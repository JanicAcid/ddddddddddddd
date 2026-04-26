<?php
/**
 * kassa-cto.ru API Router v7 — multi-client inline buttons
 *
 * 1. Client writes on site -> bot sends to Telegram with [Reply] button
 * 2. Operator presses [Reply] -> bot remembers session
 * 3. Operator writes text -> reply goes ONLY to that client
 * 4. /cancel to abort pending reply
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Cache-Control: no-store, no-cache, must-revalidate');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

$configPath = __DIR__ . '/config.php';
if (!file_exists($configPath)) { jsonResponse(['error' => 'API not configured'], 500); exit; }

$config = require $configPath;
$botToken = $config['TELEGRAM_BOT_TOKEN'] ?? '';
$chatId = $config['OPERATOR_CHAT_ID'] ?? '';
$chatDataDir = __DIR__ . '/chat-data';

// Google Sheets CRM config
$googleConfig = $config['GOOGLE'] ?? [];
$gsSheetId = $googleConfig['SHEET_ID'] ?? '';
$gsAccessToken = $googleConfig['SERVICE_ACCOUNT_KEY_PATH'] ?? '';
$gsAdminUser = $config['ADMIN_USER'] ?? 'admin';
$gsAdminPass = $config['ADMIN_PASS'] ?? 'changeme';

if (empty($botToken) || empty($chatId)) { jsonResponse(['error' => 'API not configured'], 500); exit; }
if (!is_dir($chatDataDir)) { mkdir($chatDataDir, 0755, true); }

$requestUri = $_SERVER['REQUEST_URI'] ?? '/';
$path = preg_replace('#^/api/#', '', parse_url($requestUri, PHP_URL_PATH));
$path = rtrim($path, '/');
$method = $_SERVER['REQUEST_METHOD'];

try {
    switch ("$method $path") {
        case 'GET captcha': handleCaptcha(); break;
        case 'POST send-order': handleSendOrder($botToken, $chatId); break;
        case 'POST log-order': handleLogOrder(); break;
        case 'POST chat/send': handleChatSend($botToken, $chatId, $chatDataDir); break;
        case 'GET chat/poll': handleChatPoll($botToken, $chatId, $chatDataDir); break;
        case 'GET chat/clean': handleChatClean($chatDataDir); break;
        // CRM Google Sheets endpoints
        case 'POST crm/append': handleCrmAppend($gsSheetId, $googleConfig); break;
        case 'GET crm/read': handleCrmRead($gsSheetId, $googleConfig); break;
        case 'POST crm/update': handleCrmUpdate($gsSheetId, $googleConfig); break;
        // Admin login
        case 'POST admin/login': handleAdminLogin($gsAdminUser, $gsAdminPass); break;
        default: jsonResponse(['error' => 'Not Found'], 404);
    }
} catch (Throwable $e) { error_log("API: " . $e->getMessage()); jsonResponse(['error' => 'Internal Server Error'], 500); }

// ==================== CAPTCHA ====================

function handleCaptcha(): void {
    $a = rand(1, 20); $b = rand(1, 20);
    $ops = ['+', '-', '*']; $op = $ops[array_rand($ops)];
    switch ($op) {
        case '+': $ans = $a + $b; $q = "$a + $b = ?"; break;
        case '-': $ans = $a - $b; $q = "$a - $b = ?"; break;
        case '*': $ans = $a * $b; $q = "$a x $b = ?"; break;
    }
    jsonResponse(['id' => bin2hex(random_bytes(4)), 'question' => $q, 'token' => base64_encode(json_encode(['answer' => $ans, 'ts' => time()]))]);
}

// ==================== SEND ORDER ====================

function handleSendOrder(string $botToken, string $chatId): void {
    $input = getJsonInput();
    $subject = $input['subject'] ?? ''; $html = $input['html'] ?? '';
    if (empty($subject) || empty($html)) { jsonResponse(['error' => 'Missing fields'], 400); return; }
    sendTelegramDocument($botToken, $chatId, $html, $subject);
    jsonResponse(['success' => true, 'sentTo' => 'telegram']);
}

function handleLogOrder(): void { getJsonInput(); jsonResponse(['success' => true, 'logged' => false]); }

// ==================== CHAT SEND ====================

function handleChatSend(string $botToken, string $chatId, string $chatDataDir): void {
    $sessionId = ''; $name = 'Клиент'; $message = ''; $uploadedFile = null;
    $contentType = $_SERVER['CONTENT_TYPE'] ?? '';

    if (stripos($contentType, 'multipart/form-data') !== false) {
        $sessionId = $_POST['sessionId'] ?? ''; $name = $_POST['name'] ?? 'Клиент';
        $message = $_POST['message'] ?? ''; $uploadedFile = $_FILES['file'] ?? null;
        if (empty($sessionId)) $sessionId = 'default';
        if (!$uploadedFile || $uploadedFile['error'] !== UPLOAD_ERR_OK) { jsonResponse(['error' => 'File upload failed'], 400); return; }
    } else {
        $input = getJsonInput();
        $message = $input['message'] ?? $input['text'] ?? ''; $name = $input['name'] ?? 'Клиент';
        $sessionId = $input['sessionId'] ?? '';
        if (empty($message)) { jsonResponse(['error' => 'Empty message'], 400); return; }
    }
    if (empty($sessionId)) $sessionId = 'default';
    $shortCode = substr($sessionId, 0, 6);

    $text = "<b>💬 Сообщение с сайта</b>\n<b>Клиент:</b> " . htmlspecialchars($name) . "\n<b>ID:</b> <code>#{$shortCode}</code>\n<b>Время:</b> " . date('d.m.Y H:i:s') . "\n\n" . htmlspecialchars($message ?: '📎 Файл');
    $keyboard = json_encode(['inline_keyboard' => [[['text' => "✏️ Ответить #{$shortCode} — {$name}", 'callback_data' => "reply_{$sessionId}"]]]]);
    $botMessageId = 0;

    if ($uploadedFile) {
        $mime = $uploadedFile['type'] ?? '';
        if (stripos($mime, 'image/') !== false) {
            $botMessageId = tgSendPhoto($botToken, $chatId, $uploadedFile['tmp_name'], $text, $keyboard);
        } else {
            $botMessageId = tgSendFile($botToken, $chatId, $uploadedFile['tmp_name'], $uploadedFile['name'] ?? 'file', $mime, $text, $keyboard);
        }
    } else {
        $botMessageId = tgSendMsg($botToken, $chatId, $text, $keyboard);
    }

    if ($botMessageId > 0) {
        $mf = $chatDataDir . '/mapping.json';
        $m = file_exists($mf) ? (json_decode(file_get_contents($mf), true) ?: []) : [];
        $m[] = ['botMessageId' => $botMessageId, 'sessionId' => $sessionId, 'ts' => time()];
        if (count($m) > 500) $m = array_slice($m, -300);
        file_put_contents($mf, json_encode($m, JSON_UNESCAPED_UNICODE), LOCK_EX);
    }

    file_put_contents($chatDataDir . '/session_' . sanitizeFilename($sessionId) . '.json', json_encode(['lastActive' => time(), 'name' => $name]), LOCK_EX);

    $r = ['success' => true];
    if ($botMessageId) $r['botMessageId'] = $botMessageId;
    jsonResponse($r);
}

// ==================== CHAT POLL ====================

function handleChatPoll(string $botToken, string $chatId, string $chatDataDir): void {
    $sessionId = $_GET['sessionId'] ?? '';
    $offset = isset($_GET['offset']) ? (int)$_GET['offset'] : 0;
    if (empty($sessionId)) { jsonResponse(['messages' => [], 'offset' => $offset]); return; }

    autoClean($chatDataDir);
    fetchTelegramUpdates($botToken, $chatId, $chatDataDir);

    $rf = $chatDataDir . '/replies_' . sanitizeFilename($sessionId) . '.json';
    if (!file_exists($rf)) { jsonResponse(['messages' => [], 'offset' => $offset]); return; }

    $replies = json_decode(file_get_contents($rf), true) ?: [];
    $new = [];
    foreach ($replies as $idx => $msg) {
        if ($idx >= $offset) {
            $new[] = ['type' => $msg['type'] ?? 'text', 'text' => $msg['text'] ?? '', 'from' => $msg['from'] ?? 'Оператор', 'timestamp' => $msg['timestamp'] ?? 0];
        }
    }
    jsonResponse(['messages' => $new, 'offset' => count($replies)]);
}

// ==================== AUTO CLEAN ====================

function autoClean(string $chatDataDir): void {
    $lf = $chatDataDir . '/last_clean.txt';
    if (file_exists($lf) && (time() - (int)file_get_contents($lf)) < 300) return;
    file_put_contents($lf, (string)time());
    $now = time();

    foreach (glob($chatDataDir . '/session_*.json') as $f) {
        $d = json_decode(file_get_contents($f), true) ?: [];
        if ($now - ($d['lastActive'] ?? 0) > 7200) {
            $sid = str_replace('session_', '', basename($f, '.json'));
            $rf = $chatDataDir . '/replies_' . $sid . '.json';
            if (file_exists($rf)) unlink($rf);
            unlink($f);
        }
    }

    foreach (glob($chatDataDir . '/replies_*.json') as $f) {
        if (filemtime($f) < ($now - 3600)) unlink($f);
    }

    $pf = $chatDataDir . '/pending_reply.json';
    if (file_exists($pf)) {
        $p = json_decode(file_get_contents($pf), true) ?: [];
        if ($now - ($p['ts'] ?? 0) > 900) unlink($pf);
    }

    $mf = $chatDataDir . '/mapping.json';
    if (file_exists($mf)) {
        $m = json_decode(file_get_contents($mf), true) ?: [];
        if (count($m) > 100) {
            file_put_contents($mf, json_encode(array_slice($m, -100), JSON_UNESCAPED_UNICODE), LOCK_EX);
        }
    }
}

// ==================== MANUAL CLEAN ====================

function handleChatClean(string $chatDataDir): void {
    $c = 0;
    foreach (glob($chatDataDir . '/replies_*.json') as $f) { if (unlink($f)) $c++; }
    $pf = $chatDataDir . '/pending_reply.json';
    if (file_exists($pf)) { unlink($pf); $c++; }
    jsonResponse(['success' => true, 'cleaned' => $c]);
}

// ==================== TELEGRAM GETUPDATES ====================

function fetchTelegramUpdates(string $botToken, string $chatId, string $chatDataDir): void {
    $lock = fopen($chatDataDir . '/poll.lock', 'c');
    if (!$lock) return;
    if (!flock($lock, LOCK_NB | LOCK_EX)) { fclose($lock); return; }
    try {
        $of = $chatDataDir . '/update_offset.txt';
        $uOff = 0;
        if (file_exists($of)) { $uOff = (int)file_get_contents($of); if ($uOff > 0) $uOff++; }

        $ch = curl_init();
        curl_setopt_array($ch, [
            CURLOPT_URL => "https://api.telegram.org/bot{$botToken}/getUpdates?" . http_build_query(['offset' => $uOff, 'timeout' => 3, 'allowed_updates' => json_encode(['message', 'callback_query'])]),
            CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 5, CURLOPT_CONNECTTIMEOUT => 2,
        ]);
        $resp = curl_exec($ch); $code = curl_getinfo($ch, CURLINFO_HTTP_CODE); curl_close($ch);
        if ($code !== 200 || !$resp) return;

        $data = json_decode($resp, true);
        if (!$data || !($data['ok'] ?? false)) return;

        foreach ($data['result'] ?? [] as $upd) {
            if (isset($upd['callback_query'])) processCallback($botToken, $chatId, $chatDataDir, $upd['callback_query']);
            if (isset($upd['message'])) processOperatorMsg($botToken, $chatId, $chatDataDir, $upd['message']);
            $nid = $upd['update_id'] ?? 0;
            if ($nid > 0) file_put_contents($of, (string)$nid, LOCK_EX);
        }
    } finally { flock($lock, LOCK_UN); fclose($lock); }
}

// ==================== CALLBACK ====================

function processCallback(string $botToken, string $chatId, string $chatDataDir, array $cb): void {
    $fromId = (string)($cb['from']['id'] ?? 0);
    if ($fromId !== (string)$chatId) return;
    $data = $cb['data'] ?? '';
    if (strpos($data, 'reply_') !== 0) return;
    $sessionId = substr($data, 6);
    if (empty($sessionId)) { tgAnswerCb($botToken, $cb['id'], 'Ошибка', true); return; }

    file_put_contents($chatDataDir . '/pending_reply.json', json_encode([
        'sessionId' => $sessionId, 'operatorName' => $cb['from']['first_name'] ?? 'Оператор', 'ts' => time()
    ], JSON_UNESCAPED_UNICODE), LOCK_EX);

    $sf = $chatDataDir . '/session_' . sanitizeFilename($sessionId) . '.json';
    $clientName = 'Клиент';
    if (file_exists($sf)) { $sd = json_decode(file_get_contents($sf), true) ?: []; $clientName = $sd['name'] ?? 'Клиент'; }
    $sc = substr($sessionId, 0, 6);

    $msgId = $cb['message']['message_id'] ?? 0;
    if ($msgId) {
        $kb = json_encode(['inline_keyboard' => [[['text' => "✅ Выбран #{$sc} — {$clientName}. Ждите ответ", 'callback_data' => 'noop']]]]);
        httpRequest("https://api.telegram.org/bot{$botToken}/editMessageReplyMarkup", ['chat_id' => $chatId, 'message_id' => $msgId, 'reply_markup' => $kb]);
    }
    tgAnswerCb($botToken, $cb['id'], "Напишите ответ для {$clientName} (#{$sc})");
}

// ==================== OPERATOR MESSAGE ====================

function processOperatorMsg(string $botToken, string $chatId, string $chatDataDir, array $message): void {
    if ($message['from']['is_bot'] ?? false) return;
    if ((string)($message['chat']['id'] ?? 0) !== (string)$chatId) return;
    $text = $message['text'] ?? '';
    if (empty($text)) return;

    if ($text === '/cancel' || $text === '/отмена') {
        $pf = $chatDataDir . '/pending_reply.json';
        if (file_exists($pf)) unlink($pf);
        tgSendMsg($botToken, $chatId, '❌ Ожидание ответа отменено', '');
        return;
    }

    $pf = $chatDataDir . '/pending_reply.json';
    if (!file_exists($pf)) return;

    $pending = json_decode(file_get_contents($pf), true) ?: [];
    $sessionId = $pending['sessionId'] ?? '';
    $operatorName = $pending['operatorName'] ?? 'Оператор';
    if (empty($sessionId)) return;
    unlink($pf);

    if (time() - ($pending['ts'] ?? 0) > 600) return;

    $ts = ($message['date'] ?? time()) * 1000;
    saveReply($chatDataDir, $sessionId, ['type' => 'text', 'text' => $text, 'from' => $operatorName, 'timestamp' => $ts]);

    $sc = substr($sessionId, 0, 6);
    tgSendMsg($botToken, $chatId, "✅ Ответ отправлен клиенту <code>#{$sc}</code>", '');
}

// ==================== STORAGE ====================

function saveReply(string $dir, string $sid, array $reply): void {
    $f = $dir . '/replies_' . sanitizeFilename($sid) . '.json';
    $r = file_exists($f) ? (json_decode(file_get_contents($f), true) ?: []) : [];
    if (count($r) > 50) $r = array_slice($r, -30);
    $r[] = $reply;
    file_put_contents($f, json_encode($r, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT), LOCK_EX);
}

function sanitizeFilename(string $n): string { return preg_replace('/[^a-zA-Z0-9_-]/', '', $n) ?: 'default'; }

// ==================== TELEGRAM SEND ====================

function tgSendMsg(string $bt, string $cid, string $text, string $kb): int {
    $p = ['chat_id' => $cid, 'text' => $text, 'parse_mode' => 'HTML'];
    if (!empty($kb)) $p['reply_markup'] = $kb;
    $r = httpRequest("https://api.telegram.org/bot{$bt}/sendMessage", $p);
    return $r['result']['message_id'] ?? 0;
}

function tgSendPhoto(string $bt, string $cid, string $fp, string $cap, string $kb = ''): int {
    $p = ['chat_id' => $cid, 'photo' => new CURLFile($fp), 'caption' => $cap, 'parse_mode' => 'HTML'];
    if (!empty($kb)) $p['reply_markup'] = $kb;
    $ch = curl_init(); curl_setopt_array($ch, [CURLOPT_URL => "https://api.telegram.org/bot{$bt}/sendPhoto", CURLOPT_POST => true, CURLOPT_POSTFIELDS => $p, CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 30]);
    $r = curl_exec($ch); curl_close($ch);
    return $r ? (json_decode($r, true)['result']['message_id'] ?? 0) : 0;
}

function tgSendFile(string $bt, string $cid, string $fp, string $fn, string $mime, string $cap, string $kb = ''): int {
    $p = ['chat_id' => $cid, 'document' => new CURLFile($fp, $mime, $fn), 'caption' => $cap, 'parse_mode' => 'HTML'];
    if (!empty($kb)) $p['reply_markup'] = $kb;
    $ch = curl_init(); curl_setopt_array($ch, [CURLOPT_URL => "https://api.telegram.org/bot{$bt}/sendDocument", CURLOPT_POST => true, CURLOPT_POSTFIELDS => $p, CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 30]);
    $r = curl_exec($ch); curl_close($ch);
    return $r ? (json_decode($r, true)['result']['message_id'] ?? 0) : 0;
}

function sendTelegramDocument(string $bt, string $cid, string $html, string $subject): void {
    $boundary = '----FormBoundary' . bin2hex(random_bytes(8));
    $fn = trim(preg_replace('/[^a-zA-Zа-яА-Я0-9_\-\s]/u', '', $subject)) ?: 'order'; $fn .= '.html';
    $body = "--{$boundary}\r\nContent-Disposition: form-data; name=\"chat_id\"\r\n\r\n{$cid}\r\n--{$boundary}\r\nContent-Disposition: form-data; name=\"document\"; filename=\"{$fn}\"\r\nContent-Type: text/html; charset=utf-8\r\n\r\n{$html}\r\n--{$boundary}--\r\n";
    $ch = curl_init(); curl_setopt_array($ch, [CURLOPT_URL => "https://api.telegram.org/bot{$bt}/sendDocument", CURLOPT_POST => true, CURLOPT_POSTFIELDS => $body, CURLOPT_HTTPHEADER => ["Content-Type: multipart/form-data; boundary={$boundary}"], CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 30]);
    curl_exec($ch); curl_close($ch);
}

function tgAnswerCb(string $bt, string $cbId, string $text, bool $alert = false): void {
    httpRequest("https://api.telegram.org/bot{$bt}/answerCallbackQuery", ['callback_query_id' => $cbId, 'text' => $text, 'show_alert' => $alert]);
}

// ==================== GOOGLE SHEETS CRM ====================

/**
 * Получить access token для Google Sheets API через сервисный аккаунт (JWT).
 * Файл ключа — JSON от Google Cloud Console.
 */
function getGoogleAccessToken(array $gConfig): ?string {
    $keyPath = $gConfig['SERVICE_ACCOUNT_KEY_PATH'] ?? '';
    if (empty($keyPath) || !file_exists($keyPath)) return null;

    $keyData = json_decode(file_get_contents($keyPath), true);
    if (!$keyData || empty($keyData['client_email']) || empty($keyData['private_key'])) return null;

    $now = time();
    $header = base64_encode(json_encode(['alg' => 'RS256', 'typ' => 'JWT']));
    $claim = base64_encode(json_encode([
        'iss' => $keyData['client_email'],
        'scope' => 'https://www.googleapis.com/auth/spreadsheets',
        'aud' => 'https://oauth2.googleapis.com/token',
        'iat' => $now,
        'exp' => $now + 3600,
    ]));
    $signature = '';
    openssl_sign("{$header}.{$claim}", $signature, $keyData['private_key'], 'sha256');
    $jwt = "{$header}.{$claim}." . base64_encode($signature);

    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL => 'https://oauth2.googleapis.com/token',
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => http_build_query([
            'grant_type' => 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            'assertion' => $jwt,
        ]),
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 10,
        CURLOPT_CONNECTTIMEOUT => 5,
    ]);
    $resp = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($code === 200 && $resp) {
        $data = json_decode($resp, true);
        return $data['access_token'] ?? null;
    }
    error_log("Google Auth failed: HTTP $code, " . ($resp ?: 'no response'));
    return null;
}

/**
 * Чтение Google Sheets через API.
 */
function googleSheetsRead(string $sheetId, string $accessToken, string $range = 'Лист1'): ?array {
    $url = "https://sheets.googleapis.com/v4/spreadsheets/{$sheetId}/values/" . urlencode($range);
    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL => $url,
        CURLOPT_HTTPHEADER => ["Authorization: Bearer {$accessToken}"],
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 15,
        CURLOPT_CONNECTTIMEOUT => 5,
    ]);
    $resp = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($code === 200 && $resp) {
        $data = json_decode($resp, true);
        return $data;
    }
    error_log("Google Sheets read failed: HTTP $code");
    return null;
}

/**
 * Запись строки в Google Sheets (append).
 */
function googleSheetsAppend(string $sheetId, string $accessToken, string $range, array $values): bool {
    $url = "https://sheets.googleapis.com/v4/spreadsheets/{$sheetId}/values/" . urlencode($range) . ":append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS";
    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL => $url,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode(['values' => [$values]], JSON_UNESCAPED_UNICODE),
        CURLOPT_HTTPHEADER => [
            "Authorization: Bearer {$accessToken}",
            'Content-Type: application/json',
        ],
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 15,
        CURLOPT_CONNECTTIMEOUT => 5,
    ]);
    $resp = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($code === 200) return true;
    error_log("Google Sheets append failed: HTTP $code, " . ($resp ?: 'no response'));
    return false;
}

/**
 * Обновление ячеек в Google Sheets.
 */
function googleSheetsUpdate(string $sheetId, string $accessToken, string $range, array $values): bool {
    $url = "https://sheets.googleapis.com/v4/spreadsheets/{$sheetId}/values/" . urlencode($range) . "?valueInputOption=USER_ENTERED";
    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL => $url,
        CURLOPT_PUT => true,
        CURLOPT_POSTFIELDS => json_encode(['values' => [$values]], JSON_UNESCAPED_UNICODE),
        CURLOPT_HTTPHEADER => [
            "Authorization: Bearer {$accessToken}",
            'Content-Type: application/json',
        ],
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 15,
        CURLOPT_CONNECTTIMEOUT => 5,
    ]);
    $resp = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($code === 200) return true;
    error_log("Google Sheets update failed: HTTP $code, " . ($resp ?: 'no response'));
    return false;
}

/** Кэш Google access token */
$_googleTokenCache = ['token' => '', 'expires' => 0];

function getCachedGoogleToken(array $gConfig): ?string {
    global $_googleTokenCache;
    if (!empty($_googleTokenCache['token']) && time() < $_googleTokenCache['expires']) {
        return $_googleTokenCache['token'];
    }
    $token = getGoogleAccessToken($gConfig);
    if ($token) {
        $_googleTokenCache = ['token' => $token, 'expires' => time() + 3500];
    }
    return $token;
}

/**
 * CRM: Добавить заявку
 */
function handleCrmAppend(string $sheetId, array $gConfig): void {
    if (empty($sheetId)) { jsonResponse(['error' => 'Google Sheets не настроена. Задайте SHEET_ID в config.php'], 503); return; }
    $token = getCachedGoogleToken($gConfig);
    if (!$token) { jsonResponse(['error' => 'Ошибка авторизации Google API'], 503); return; }

    $input = getJsonInput();
    $values = $input['values'] ?? [];
    if (empty($values)) { jsonResponse(['error' => 'Нет данных для добавления'], 400); return; }

    // Проверяем, есть ли заголовки — добавляем при первом запросе
    $headers = $input['headers'] ?? null;
    if ($headers && is_array($headers)) {
        $readData = googleSheetsRead($sheetId, $token, 'Лист1!1:1');
        if (!$readData || empty($readData['values'])) {
            googleSheetsAppend($sheetId, $token, 'Лист1!A1', $headers);
        }
    }

    $ok = googleSheetsAppend($sheetId, $token, 'Лист1!A:A', $values);
    if ($ok) {
        jsonResponse(['success' => true]);
    } else {
        jsonResponse(['error' => 'Не удалось записать в Google Таблицу'], 500);
    }
}

/**
 * CRM: Прочитать заявки
 */
function handleCrmRead(string $sheetId, array $gConfig): void {
    if (empty($sheetId)) { jsonResponse(['error' => 'Google Sheets не настроена'], 503); return; }
    $token = getCachedGoogleToken($gConfig);
    if (!$token) { jsonResponse(['error' => 'Ошибка авторизации Google API'], 503); return; }

    $limit = isset($_GET['limit']) ? min((int)$_GET['limit'], 200) : 100;
    $offset = isset($_GET['offset']) ? (int)$_GET['offset'] : 0;

    $readData = googleSheetsRead($sheetId, $token, 'Лист1');
    if (!$readData || empty($readData['values'])) {
        jsonResponse(['success' => true, 'orders' => [], 'total' => 0, 'headers' => []]);
        return;
    }

    $allRows = $readData['values'];
    $headers = array_shift($allRows);

    // Фильтруем пустые строки
    $allRows = array_values(array_filter($allRows, fn($r) => count(array_filter($r)) > 0));

    $total = count($allRows);

    // Разворачиваем — последние наверху
    $allRows = array_reverse($allRows);

    // Срез
    $sliced = array_slice($allRows, $offset, $limit);

    $orders = [];
    foreach ($sliced as $i => $row) {
        $order = ['_row' => (string)($total - $offset - $i)]; // Реальный номер строки в таблице (1-indexed)
        foreach ($headers as $col => $header) {
            $order[$header] = $row[$col] ?? '';
        }
        $orders[] = $order;
    }

    jsonResponse(['success' => true, 'orders' => $orders, 'total' => $total, 'headers' => $headers]);
}

/**
 * CRM: Обновить заявку (статус, комментарий менеджера)
 */
function handleCrmUpdate(string $sheetId, array $gConfig): void {
    if (empty($sheetId)) { jsonResponse(['error' => 'Google Sheets не настроена'], 503); return; }
    $token = getCachedGoogleToken($gConfig);
    if (!$token) { jsonResponse(['error' => 'Ошибка авторизации Google API'], 503); return; }

    $input = getJsonInput();
    $rowIndex = (int)($input['rowIndex'] ?? 0);
    $updates = $input['updates'] ?? [];
    if ($rowIndex <= 0 || empty($updates)) { jsonResponse(['error' => 'Неверные параметры'], 400); return; }

    // Читаем заголовки
    $readData = googleSheetsRead($sheetId, $token, 'Лист1!1:1');
    if (!$readData || empty($readData['values'])) {
        jsonResponse(['error' => 'Не удалось прочитать заголовки таблицы'], 500);
        return;
    }
    $headers = $readData['values'][0];

    // Ищем колонки для обновления
    foreach ($updates as $key => $value) {
        $colIndex = array_search($key, $headers);
        if ($colIndex === false) {
            // Пробуем по альтернативным ключам
            $altMap = [
                'Статус' => ['Статус', 'статус'],
                'Комментарий менеджера' => ['Комментарий менеджера', 'Примечание менеджера'],
            ];
            $found = false;
            foreach ($altMap[$key] ?? [] as $alt) {
                $colIndex = array_search($alt, $headers);
                if ($colIndex !== false) { $found = true; break; }
            }
            if (!$found) continue;
        }
        $colLetter = chr(65 + $colIndex); // A, B, C...
        $range = "Лист1!{$colLetter}{$rowIndex}";
        googleSheetsUpdate($sheetId, $token, $range, [$value]);
    }

    jsonResponse(['success' => true]);
}

// ==================== ADMIN LOGIN ====================

function handleAdminLogin(string $adminUser, string $adminPass): void {
    $input = getJsonInput();
    $login = $input['login'] ?? '';
    $password = $input['password'] ?? '';
    if (empty($login) || empty($password)) { jsonResponse(['error' => 'Заполните все поля'], 400); return; }

    if ($login === $adminUser && $password === $adminPass) {
        $token = bin2hex(random_bytes(32));
        // Сохраняем токен в файл (простая сессия)
        $sessionDir = __DIR__ . '/sessions';
        if (!is_dir($sessionDir)) mkdir($sessionDir, 0755, true);
        file_put_contents($sessionDir . '/' . $token . '.json', json_encode([
            'login' => $login, 'ts' => time(), 'ip' => $_SERVER['REMOTE_ADDR'] ?? '',
        ], JSON_UNESCAPED_UNICODE), LOCK_EX);
        jsonResponse(['success' => true, 'token' => $token]);
    } else {
        jsonResponse(['success' => false, 'error' => 'Неверный логин или пароль']);
    }
}

// ==================== HELPERS ====================

function jsonResponse(array $d, int $s = 200): void { http_response_code($s); echo json_encode($d, JSON_UNESCAPED_UNICODE); exit; }
function getJsonInput(): array { $r = file_get_contents('php://input'); return is_array($d = json_decode($r, true)) ? $d : []; }
function httpRequest(string $url, array $payload): array {
    $ch = curl_init(); curl_setopt_array($ch, [CURLOPT_URL => $url, CURLOPT_POST => true, CURLOPT_POSTFIELDS => json_encode($payload), CURLOPT_HTTPHEADER => ['Content-Type: application/json'], CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 30]);
    $r = curl_exec($ch); $code = curl_getinfo($ch, CURLINFO_HTTP_CODE); curl_close($ch);
    return ($code === 200 && $r) ? (json_decode($r, true) ?: ['ok' => false]) : ['ok' => false, 'code' => $code];
}
