<?php
/**
 * kassa-cto.ru — Конфигурация API-прокси
 *
 * ИНСТРУКЦИЯ ПО НАСТРОЙКЕ:
 *
 * 1. Скопируйте этот файл в config.php:
 *      cp config.example.php config.php
 *
 * 2. Заполните данные Telegram (для чата и уведомлений):
 *    - TELEGRAM_BOT_TOKEN: токен бота от @BotFather
 *    - OPERATOR_CHAT_ID: ID чата оператора (получить через @userinfobot)
 *
 * 3. Настройте Google Sheets CRM:
 *    - Создайте проект в Google Cloud Console
 *    - Включите Google Sheets API
 *    - Создайте сервисный аккаунт (IAM → Service Accounts)
 *    - Скачайте JSON-ключ сервисного аккаунта → загрузите в папку api/
 *    - Создайте Google Таблицу, дайте доступ сервисному аккаунту (email из JSON)
 *    - SHEET_ID: ID таблицы из URL (docs.google.com/spreadsheets/d/ВАШ_ID/edit)
 *
 * 4. Настройте логин администратора:
 *    - ADMIN_USER: логин для входа в Кабинет
 *    - ADMIN_PASS: пароль для входа в Кабинет
 *
 * ВАЖНО: config.php добавлен в .gitignore — он НЕ попадёт в репозиторий!
 */

return [
    // Telegram
    'TELEGRAM_BOT_TOKEN' => '',       // Токен бота от @BotFather
    'OPERATOR_CHAT_ID' => '',         // ID чата оператора

    // Google Sheets CRM
    'GOOGLE' => [
        'SHEET_ID' => '',                              // ID Google Таблицы
        'SERVICE_ACCOUNT_KEY_PATH' => __DIR__ . '/google-service-account.json', // Путь к JSON-ключу
    ],

    // Admin Cabinet
    'ADMIN_USER' => 'admin',             // Логин администратора
    'ADMIN_PASS' => 'changeme',          // Пароль (ОБЯЗАТЕЛЬНО поменяйте!)
];
