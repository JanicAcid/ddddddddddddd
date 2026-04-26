/**
 * ============================================================
 *  Google Apps Script — Backend административного кабинета
 *  kassa-cto.ru  (версия 1.0)
 * ============================================================
 *
 *  Развертывание:
 *    1. Создайте новый проект в Google Apps Script
 *    2. Скопируйте содержимое этого файла в Code.gs
 *    3. Выполните функцию setup() один раз — она создаст нужные листы
 *    4. Опубликуйте → Веб-приложение → «Выполнять как я» / «Все»
 *
 *  Все action dispatch-ятся через query-параметр:
 *    ?action=captcha|login|getOrders|addOrder|updateOrder
 *
 *  БД — Google Sheets (листы Users, Orders).
 *  Кэш сессий/captcha — ScriptProperties.
 * ============================================================
 */

/* ===========================================================
   1. УТИЛИТЫ
   =========================================================== */

/**
 * Генерация UUID v4
 */
function _uuid() {
  return Utilities.getUuid();
}

/**
 * Хэширование строки в SHA-256 (hex)
 */
function _sha256(str) {
  var bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, str);
  return bytes.map(function (b) {
    return ('0' + (b & 0xFF).toString(16)).slice(-2);
  }).join('');
}

/**
 * Текущая метка времени (мс)
 */
function _now() {
  return Date.now();
}

/* ===========================================================
   2. HEADERS / CORS
   =========================================================== */

/**
 * Установка CORS-заголовков для всех ответов
 */
function _setCors(response) {
  response
    .setHeader('Access-Control-Allow-Origin', '*')
    .setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    .setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    .setHeader('Content-Type', 'application/json; charset=utf-8');
  return response;
}

/**
 * Пустой ответ для CORS preflight (OPTIONS)
 */
function _handleOptions() {
  return _setCors(ContentService.createTextOutput(''));
}

/* ===========================================================
   3. ХРАНИЛИЩЕ ТОКЕНОВ (ScriptProperties)
   ===========================================================
   Структура в ScriptProperties:
     captcha_{token}  → JSON { answer, ts }
     session_{token}  → JSON { login, ts }
   =========================================================== */

/** TTL капчи — 5 минут */
var CAPTCHA_TTL = 5 * 60 * 1000;

/** TTL сессии — 24 часа */
var SESSION_TTL = 24 * 60 * 60 * 1000;

/**
 * Сохранить данные капчи
 */
function _saveCaptcha(token, answer) {
  ScriptProperties.setProperty(
    'captcha_' + token,
    JSON.stringify({ answer: String(answer), ts: _now() })
  );
}

/**
 * Верифицировать капчу. Возвращает true/false.
 * При успешной проверке токен удаляется (одноразовый).
 */
function _verifyCaptcha(token, answer) {
  var key = 'captcha_' + token;
  var raw = ScriptProperties.getProperty(key);
  if (!raw) return false;

  var data = JSON.parse(raw);
  ScriptProperties.deleteProperty(key); // одноразовая

  if (_now() - data.ts > CAPTCHA_TTL) return false;
  return data.answer === String(answer);
}

/**
 * Создать сессию. Возвращает токен.
 */
function _createSession(login) {
  var token = _uuid();
  ScriptProperties.setProperty(
    'session_' + token,
    JSON.stringify({ login: login, ts: _now() })
  );
  return token;
}

/**
 * Верифицировать сессию. Возвращает login или null.
 */
function _verifySession(token) {
  var key = 'session_' + token;
  var raw = ScriptProperties.getProperty(key);
  if (!raw) return null;

  var data = JSON.parse(raw);

  // Пролонгация сессии при каждом успешном запросе
  if (_now() - data.ts > SESSION_TTL) {
    ScriptProperties.deleteProperty(key);
    return null;
  }

  // Обновляем таймстамп (sliding expiration)
  data.ts = _now();
  ScriptProperties.setProperty(key, JSON.stringify(data));

  return data.login;
}

/**
 * Очистка всех просроченных капч и сессий.
 * Вызывается при каждом запросе.
 */
function _cleanup() {
  var props = ScriptProperties.getProperties();
  var keys = Object.keys(props);
  var now = _now();

  keys.forEach(function (key) {
    if (key.indexOf('captcha_') === 0 || key.indexOf('session_') === 0) {
      try {
        var data = JSON.parse(props[key]);
        var ttl = key.indexOf('captcha_') === 0 ? CAPTCHA_TTL : SESSION_TTL;
        if (now - data.ts > ttl) {
          ScriptProperties.deleteProperty(key);
        }
      } catch (e) {
        // повреждённая запись — удаляем
        ScriptProperties.deleteProperty(key);
      }
    }
  });
}

/* ===========================================================
   4. ДОСТУП К GOOGLE SHEETS
   =========================================================== */

/** Имя листа пользователей */
var SHEET_USERS = 'Users';

/** Имя листа заказов */
var SHEET_ORDERS = 'Orders';

/**
 * Получить активную таблицу
 */
function _getSpreadsheet() {
  return SpreadsheetApp.getActiveSpreadsheet();
}

/**
 * Получить лист по имени (создаёт, если нет)
 */
function _getSheet(name) {
  var ss = _getSpreadsheet();
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
  }
  return sheet;
}

/* ===========================================================
   5. ACTION: captcha  (GET)
   ===========================================================
   Генерирует простой математический пример и возвращает JSON:
   { question, answer, token }
   =========================================================== */
function actionCaptcha() {
  var ops = ['+', '-', '*'];
  var op = ops[Math.floor(Math.random() * ops.length)];

  var a = Math.floor(Math.random() * 20) + 1;
  var b = Math.floor(Math.random() * 20) + 1;

  // Для вычитания — чтобы не было отрицательных
  if (op === '-' && a < b) {
    var tmp = a; a = b; b = tmp;
  }

  var result;
  switch (op) {
    case '+': result = a + b; break;
    case '-': result = a - b; break;
    case '*': result = a * b; break;
  }

  var token = _uuid();
  _saveCaptcha(token, result);

  return JSON.stringify({
    question: a + ' ' + op + ' ' + b,
    answer: String(result),
    token: token
  });
}

/* ===========================================================
   6. ACTION: login  (POST)
   ===========================================================
   Принимает: { login, password, captchaAnswer, captchaToken }
   Возвращает: { success, token? , error? }
   =========================================================== */
function actionLogin(body) {
  // --- Проверка капчи ---
  if (!body.captchaToken || !body.captchaAnswer) {
    return JSON.stringify({ success: false, error: 'Капча не передана' });
  }
  if (!_verifyCaptcha(body.captchaToken, body.captchaAnswer)) {
    return JSON.stringify({ success: false, error: 'Неверная или просроченная капча' });
  }

  // --- Проверка логина/пароля ---
  if (!body.login || !body.password) {
    return JSON.stringify({ success: false, error: 'Логин и пароль обязательны' });
  }

  var sheet = _getSheet(SHEET_USERS);
  var data = sheet.getDataRange().getValues();

  var hash = _sha256(body.password);
  var found = false;

  // Строка 1 — заголовок, пропускаем
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === body.login && data[i][1] === hash) {
      found = true;
      break;
    }
  }

  if (!found) {
    return JSON.stringify({ success: false, error: 'Неверный логин или пароль' });
  }

  // --- Создание сессии ---
  var sessionToken = _createSession(body.login);
  return JSON.stringify({ success: true, token: sessionToken });
}

/* ===========================================================
   7. ACTION: getOrders  (GET)
   ===========================================================
   Принимает: ?token=...
   Возвращает: { orders, headers, total }
   =========================================================== */
function actionGetOrders(params) {
  // --- Авторизация ---
  var login = _verifySession(params.token);
  if (!login) {
    return JSON.stringify({ success: false, error: 'Не авторизован или сессия истекла' });
  }

  var sheet = _getSheet(SHEET_ORDERS);
  var data = sheet.getDataRange().getValues();

  if (data.length < 2) {
    // Нет данных кроме заголовка
    return JSON.stringify({
      success: true,
      orders: [],
      headers: data[0] || [],
      total: 0
    });
  }

  var headers = data[0];
  var orders = [];

  for (var i = 1; i < data.length; i++) {
    var row = {};
    for (var j = 0; j < headers.length; j++) {
      row[headers[j]] = data[i][j];
    }
    row._row = i + 1; // номер строки в таблице (1-based)
    orders.push(row);
  }

  return JSON.stringify({
    success: true,
    orders: orders,
    headers: headers,
    total: orders.length
  });
}

/* ===========================================================
   8. ACTION: addOrder  (POST)
   ===========================================================
   Принимает: { token?, data: { ... } }
   Без токена — публичная заявка (капча проверяется отдельно
   на клиенте при отправке формы).
   =========================================================== */
function actionAddOrder(body) {
  // Если передан токен — проверяем сессию (админ)
  if (body.token) {
    var login = _verifySession(body.token);
    if (!login) {
      return JSON.stringify({ success: false, error: 'Не авторизован или сессия истекла' });
    }
  }
  // Если токена нет — допускаем публичную подачу

  if (!body.data || typeof body.data !== 'object') {
    return JSON.stringify({ success: false, error: 'Данные заказа не переданы' });
  }

  var sheet = _getSheet(SHEET_ORDERS);
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

  // Собираем значения в порядке колонок
  var rowValues = headers.map(function (h) {
    return body.data[h] !== undefined ? body.data[h] : '';
  });

  // Добавляем строку
  sheet.appendRow(rowValues);

  // Номер добавленной строки
  var rowNum = sheet.getLastRow();

  return JSON.stringify({ success: true, row: rowNum });
}

/* ===========================================================
   9. ACTION: updateOrder  (POST)
   ===========================================================
   Принимает: { token, rowIndex, updates: { "Статус": "...", ... } }
   =========================================================== */
function actionUpdateOrder(body) {
  // --- Авторизация (обязательна) ---
  var login = _verifySession(body.token);
  if (!login) {
    return JSON.stringify({ success: false, error: 'Не авторизован или сессия истекла' });
  }

  if (!body.rowIndex || !body.updates || typeof body.updates !== 'object') {
    return JSON.stringify({ success: false, error: 'Не указан rowIndex или updates' });
  }

  var sheet = _getSheet(SHEET_ORDERS);
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var lastRow = sheet.getLastRow();

  // Проверяем, что строка существует
  var rowIdx = parseInt(body.rowIndex, 10);
  if (isNaN(rowIdx) || rowIdx < 2 || rowIdx > lastRow) {
    return JSON.stringify({ success: false, error: 'Неверный номер строки: ' + body.rowIndex });
  }

  // Обновляем только переданные поля
  var updates = body.updates;
  Object.keys(updates).forEach(function (colName) {
    var colIdx = headers.indexOf(colName);
    if (colIdx !== -1) {
      sheet.getRange(rowIdx, colIdx + 1).setValue(updates[colName]);
    }
  });

  return JSON.stringify({ success: true });
}

/* ===========================================================
   10. MAIN DISPATCHER — doGet / doPost
   =========================================================== */

/**
 * Обработчик GET-запросов
 */
function doGet(e) {
  _cleanup();

  // CORS preflight
  if (e && e.parameter && e.parameter._method === 'OPTIONS') {
    return _setCors(ContentService.createTextOutput(''));
  }

  var action = (e && e.parameter) ? e.parameter.action : '';

  var result;
  switch (action) {
    case 'captcha':
      result = actionCaptcha();
      break;

    case 'getOrders':
      result = actionGetOrders(e.parameter);
      break;

    default:
      result = JSON.stringify({
        success: false,
        error: 'Неизвестное action (GET). Доступные: captcha, getOrders'
      });
  }

  return _setCors(ContentService.createTextOutput(result));
}

/**
 * Обработчик POST-запросов
 */
function doPost(e) {
  _cleanup();

  var action = (e && e.parameter) ? e.parameter.action : '';
  var body = {};

  // Парсим тело запроса
  if (e && e.postData && e.postData.contents) {
    try {
      body = JSON.parse(e.postData.contents);
    } catch (err) {
      var errorResult = JSON.stringify({ success: false, error: 'Невалидный JSON в теле запроса' });
      return _setCors(ContentService.createTextOutput(errorResult));
    }
  }

  var result;
  switch (action) {
    case 'login':
      result = actionLogin(body);
      break;

    case 'addOrder':
      result = actionAddOrder(body);
      break;

    case 'updateOrder':
      result = actionUpdateOrder(body);
      break;

    default:
      result = JSON.stringify({
        success: false,
        error: 'Неизвестное action (POST). Доступные: login, addOrder, updateOrder'
      });
  }

  return _setCors(ContentService.createTextOutput(result));
}

/* ===========================================================
   11. SETUP — первичная инициализация
   ===========================================================
   Выполните эту функцию вручную один раз, чтобы создать
   листы Users и Orders с заголовками и дефолтного админа.
   =========================================================== */
function setup() {
  var ss = _getSpreadsheet();

  // --- Лист Users ---
  var usersSheet = _getSheet(SHEET_USERS);
  var usersData = usersSheet.getDataRange().getValues();

  if (usersData.length === 0 || (usersData.length === 1 && usersData[0][0] === '')) {
    // Лист пуст — создаём заголовки и админа
    usersSheet.getRange(1, 1, 1, 2).setValues([['login', 'password_hash']]);

    // Дефолтный админ: admin / tellur2024
    var adminHash = _sha256('tellur2024');
    usersSheet.appendRow(['admin', adminHash]);

    Logger.log('✅ Лист «Users» создан. Администратор: admin / tellur2024');
  } else {
    Logger.log('ℹ️ Лист «Users» уже существует.');
  }

  // --- Лист Orders ---
  var ordersSheet = _getSheet(SHEET_ORDERS);
  var ordersData = ordersSheet.getDataRange().getValues();

  var orderHeaders = [
    'Дата/время',
    'Заказ №',
    'Клиент',
    'Телефон',
    'Email',
    'ККМ',
    'Состояние',
    'Услуги',
    'Сумма',
    'Комментарий',
    'Статус',
    'Комментарий менеджера',
    'Файл заказа'
  ];

  if (ordersData.length === 0 || (ordersData.length === 1 && ordersData[0][0] === '')) {
    ordersSheet.getRange(1, 1, 1, orderHeaders.length).setValues([orderHeaders]);
    Logger.log('✅ Лист «Orders» создан с заголовками.');
  } else {
    Logger.log('ℹ️ Лист «Orders» уже существует.');
  }

  // --- Настройки защиты: закрепляем строку заголовков ---
  usersSheet.setFrozenRows(1);
  ordersSheet.setFrozenRows(1);

  Logger.log('🎉 Настройка завершена!');
}

/* ===========================================================
   12. ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ДЛЯ ДИАГНОСТИКИ
   =========================================================== */

/**
 * Удалить все сессии и капчи (для отладки)
 * Можно вызвать из редактора: resetAllSessions()
 */
function resetAllSessions() {
  var props = ScriptProperties.getProperties();
  var keys = Object.keys(props);
  var count = 0;
  keys.forEach(function (key) {
    if (key.indexOf('captcha_') === 0 || key.indexOf('session_') === 0) {
      ScriptProperties.deleteProperty(key);
      count++;
    }
  });
  Logger.log('🗑 Удалено записей: ' + count);
  return count;
}

/**
 * Посмотреть все активные сессии (для отладки)
 */
function listActiveSessions() {
  var props = ScriptProperties.getProperties();
  var keys = Object.keys(props);
  var now = _now();
  var sessions = [];

  keys.forEach(function (key) {
    if (key.indexOf('session_') === 0) {
      try {
        var data = JSON.parse(props[key]);
        var remaining = SESSION_TTL - (now - data.ts);
        sessions.push({
          token: key.replace('session_', ''),
          login: data.login,
          created_ago_min: Math.round((now - data.ts) / 60000),
          remaining_min: Math.round(remaining / 60000)
        });
      } catch (e) { /* skip */ }
    }
  });

  Logger.log(JSON.stringify(sessions, null, 2));
  return sessions;
}

/**
 * Изменить пароль пользователя (для отладки)
 * Пример: changePassword('admin', 'newPassword123')
 */
function changePassword(login, newPassword) {
  var sheet = _getSheet(SHEET_USERS);
  var data = sheet.getDataRange().getValues();

  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === login) {
      var hash = _sha256(newPassword);
      sheet.getRange(i + 1, 2).setValue(hash);
      Logger.log('✅ Пароль для «' + login + '» обновлён.');
      return true;
    }
  }

  Logger.log('❌ Пользователь «' + login + '» не найден.');
  return false;
}
