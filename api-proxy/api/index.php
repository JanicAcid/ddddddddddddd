<?php
/**
 * kassa-cto.ru API Router — PHP proxy for Telegram (v3 — long polling)
 * Handles: send-order, captcha, chat/send, chat/poll
 *
 * Chat flow (NO webhook needed — uses Telegram getUpdates polling):
 *   Visitor → POST /api/chat/send → Telegram bot → operator gets message
 *   Visitor → GET /api/chat/poll → server calls bot.getUpdates → gets operator replies
 *   Operator replies in Telegram → stored via getUpdates on next poll
 *
 * Reply format (operator in Telegram):
 *   1. Reply directly to bot message → reply goes to that session
 *   2. /reply SESSION_ID message text → reply to specific session
 *   3. Just type → broadcast to ALL active sessions (last 60 min)
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Cache-Control: no-store, no-cache, must-revalidate');

// CORS preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Load config
$configPath = __DIR__ . '/config.php';
if (!file_exists($configPath)) {
    jsonResponse(['error' => 'API not configured'], 500);
    exit;
}

$config = require $configPath;
$botToken = $config['TELEGRAM_BOT_TOKEN'] ?? '';
$chatId = $config['OPERATOR_CHAT_ID'] ?? '';
$chatDataDir = __DIR__ . '/chat-data';

if (empty($botToken) || empty($chatId)) {
    jsonResponse(['error' => 'API not configured'], 500);
    exit;
}

// Ensure chat data directory exists
if (!is_dir($chatDataDir)) {
    mkdir($chatDataDir, 0755, true);
}

// Parse request path
$requestUri = $_SERVER['REQUEST_URI'] ?? '/';
$path = parse_url($requestUri, PHP_URL_PATH);

// Normalize: remove /api/ prefix
$path = preg_replace('#^/api/#', '', $path);
$path = rtrim($path, '/');
$method = $_SERVER['REQUEST_METHOD'];

// Route
try {
    switch ("$method $path") {
        case 'GET captcha':
            handleCaptcha();
            break;

        case 'POST send-order':
            handleSendOrder($botToken, $chatId);
            break;

        case 'POST log-order':
            handleLogOrder();
            break;

        case 'POST chat/send':
            handleChatSend($botToken, $chatId, $chatDataDir);
            break;

        case 'GET chat/poll':
            handleChatPoll($botToken, $chatId, $chatDataDir);
            break;

        case 'GET chat/clean':
            handleChatClean($chatDataDir);
            break;

        default:
            jsonResponse(['error' => 'Not Found'], 404);
    }
} catch (Throwable $e) {
    error_log("API Error: " . $e->getMessage() . " in " . $e->getFile() . ":" . $e->getLine());
    jsonResponse(['error' => 'Internal Server Error'], 500);
}

// ========== HANDLERS ==========

function handleCaptcha(): void
{
    $a = rand(1, 20);
    $b = rand(1, 20);
    $ops = ['+', '-', '*'];
    $op = $ops[array_rand($ops)];

    switch ($op) {
        case '+':
            $answer = $a + $b;
            $question = "$a + $b = ?";
            break;
        case '-':
            $answer = $a - $b;
            $question = "$a - $b = ?";
            break;
        case '*':
            $answer = $a * $b;
            $question = "$a x $b = ?";
            break;
    }

    $captchaId = bin2hex(random_bytes(4));
    $token = base64_encode(json_encode(['answer' => $answer, 'ts' => time()]));

    jsonResponse([
        'id' => $captchaId,
        'question' => $question,
        'token' => $token,
    ]);
}

function handleSendOrder(string $botToken, string $chatId): void
{
    $input = getJsonInput();
    $subject = $input['subject'] ?? '';
    $html = $input['html'] ?? '';

    if (empty($subject) || empty($html)) {
        jsonResponse(['error' => 'Missing fields'], 400);
        return;
    }

    sendTelegramDocument($botToken, $chatId, $html, $subject);
    jsonResponse(['success' => true, 'sentTo' => 'telegram']);
}

function handleLogOrder(): void
{
    $input = getJsonInput();
    jsonResponse(['success' => true, 'logged' => false]);
}

/**
 * Handle chat message from website visitor → Telegram
 * Supports both JSON (text) and FormData (file upload)
 * Returns botMessageId so frontend starts polling for replies
 */
function handleChatSend(string $botToken, string $chatId, string $chatDataDir): void
{
    $sessionId = '';
    $name = 'Клиент';
    $message = '';
    $uploadedFile = null;

    // Detect content type — JSON or FormData
    $contentType = $_SERVER['CONTENT_TYPE'] ?? '';

    if (stripos($contentType, 'multipart/form-data') !== false) {
        // FormData upload (file + optional caption)
        $sessionId = $_POST['sessionId'] ?? '';
        $name = $_POST['name'] ?? 'Клиент';
        $message = $_POST['message'] ?? '';
        $uploadedFile = $_FILES['file'] ?? null;

        // Allow empty text if file is present
        if (empty($sessionId)) {
            $sessionId = 'default';
        }

        if (!$uploadedFile || $uploadedFile['error'] !== UPLOAD_ERR_OK) {
            jsonResponse(['error' => 'File upload failed'], 400);
            return;
        }
    } else {
        // JSON (text message)
        $input = getJsonInput();
        $message = $input['message'] ?? $input['text'] ?? '';
        $name = $input['name'] ?? $input['senderName'] ?? 'Клиент';
        $sessionId = $input['sessionId'] ?? '';

        if (empty($message)) {
            jsonResponse(['error' => 'Empty message'], 400);
            return;
        }
    }

    if (empty($sessionId)) {
        $sessionId = 'default';
    }

    $botMessageId = 0;

    if ($uploadedFile) {
        // Send photo or document to Telegram
        $mimeType = $uploadedFile['type'] ?? '';
        $isImage = stripos($mimeType, 'image/') !== false;

        $caption = "<b>💬 Файл с сайта</b>\n";
        $caption .= "<b>Имя:</b> " . htmlspecialchars($name) . "\n";
        $caption .= "<b>Сессия:</b> <code>" . htmlspecialchars(substr($sessionId, 0, 12)) . "</code>\n";
        $caption .= "<b>Время:</b> " . date('d.m.Y H:i:s');
        if (!empty($message)) {
            $caption .= "\n\n" . htmlspecialchars($message);
        }

        if ($isImage) {
            $botMessageId = sendTelegramPhoto($botToken, $chatId, $uploadedFile['tmp_name'], $caption);
        } else {
            $botMessageId = sendTelegramFile($botToken, $chatId, $uploadedFile['tmp_name'], $uploadedFile['name'] ?? 'file', $mimeType, $caption);
        }
    } else {
        // Text message
        $text = "<b>💬 Сообщение с сайта</b>\n";
        $text .= "<b>Имя:</b> " . htmlspecialchars($name) . "\n";
        $text .= "<b>Сессия:</b> <code>" . htmlspecialchars(substr($sessionId, 0, 12)) . "</code>\n";
        $text .= "<b>Время:</b> " . date('d.m.Y H:i:s') . "\n\n";
        $text .= htmlspecialchars($message);

        $url = "https://api.telegram.org/bot{$botToken}/sendMessage";
        $response = httpRequest($url, [
            'chat_id' => $chatId,
            'text' => $text,
            'parse_mode' => 'HTML',
        ]);
        $botMessageId = $response['result']['message_id'] ?? 0;
    }

    // Map botMessageId to sessionId for reply tracking
    if ($botMessageId > 0) {
        $mappingFile = $chatDataDir . '/mapping.json';
        $mappings = [];
        if (file_exists($mappingFile)) {
            $mappings = json_decode(file_get_contents($mappingFile), true) ?: [];
        }
        $mappings[] = [
            'botMessageId' => $botMessageId,
            'sessionId' => $sessionId,
            'ts' => time(),
        ];
        if (count($mappings) > 500) {
            $mappings = array_slice($mappings, -300);
        }
        file_put_contents($mappingFile, json_encode($mappings, JSON_UNESCAPED_UNICODE), LOCK_EX);
    }

    // Mark session as active
    $sessionFile = $chatDataDir . '/session_' . sanitizeFilename($sessionId) . '.json';
    file_put_contents($sessionFile, json_encode(['lastActive' => time(), 'name' => $name]), LOCK_EX);

    $result = ['success' => true];
    if ($botMessageId) {
        $result['botMessageId'] = $botMessageId;
    }
    jsonResponse($result);
}

/**
 * Handle polling — fetch replies from Telegram via getUpdates, then return new messages
 * This combines two operations:
 *   1. Call bot.getUpdates to fetch operator replies
 *   2. Return new replies for this session
 */
function handleChatPoll(string $botToken, string $chatId, string $chatDataDir): void
{
    $sessionId = $_GET['sessionId'] ?? '';
    $offset = isset($_GET['offset']) ? (int)$_GET['offset'] : 0;

    if (empty($sessionId)) {
        jsonResponse(['messages' => [], 'offset' => $offset]);
        return;
    }

    // Step 1: Fetch new updates from Telegram (non-blocking, short timeout)
    fetchTelegramUpdates($botToken, $chatId, $chatDataDir);

    // Step 2: Return new replies for this session
    $repliesFile = $chatDataDir . '/replies_' . sanitizeFilename($sessionId) . '.json';

    if (!file_exists($repliesFile)) {
        jsonResponse(['messages' => [], 'offset' => $offset]);
        return;
    }

    $replies = json_decode(file_get_contents($repliesFile), true) ?: [];

    // Filter by offset — only send new messages after the offset
    $newMessages = [];
    foreach ($replies as $idx => $msg) {
        if ($idx >= $offset) {
            $newMessages[] = [
                'type' => $msg['type'] ?? 'text',
                'text' => $msg['text'] ?? '',
                'from' => $msg['from'] ?? 'Оператор',
                'timestamp' => $msg['timestamp'] ?? 0,
            ];
        }
    }

    $newOffset = count($replies);
    jsonResponse([
        'messages' => $newMessages,
        'offset' => $newOffset,
    ]);
}

function handleChatClean(string $chatDataDir): void
{
    $count = 0;
    $files = glob($chatDataDir . '/replies_*.json');
    foreach ($files as $file) {
        if (unlink($file)) $count++;
    }
    $mappingFile = $chatDataDir . '/mapping.json';
    if (file_exists($mappingFile)) { unlink($mappingFile); $count++; }
    $offsetFile = $chatDataDir . '/update_offset.txt';
    if (file_exists($offsetFile)) { unlink($offsetFile); }
    jsonResponse(['success' => true, 'cleaned' => $count]);
}

// ========== TELEGRAM GETUPDATES (replaces webhook) ==========

/**
 * Fetch new updates from Telegram using getUpdates with long polling (2s timeout)
 * This is called on every chat/poll request from the frontend
 */
function fetchTelegramUpdates(string $botToken, string $chatId, string $chatDataDir): void
{
    // Use a file lock to prevent concurrent getUpdates calls
    $lockFile = $chatDataDir . '/poll.lock';

    // Try to acquire lock (non-blocking)
    $lock = fopen($lockFile, 'c');
    if (!$lock) return;
    if (!flock($lock, LOCK_NB | LOCK_EX)) {
        fclose($lock);
        return; // Another process is already polling
    }

    try {
        // Get current update offset
        $offsetFile = $chatDataDir . '/update_offset.txt';
        $updateOffset = 0;
        if (file_exists($offsetFile)) {
            $updateOffset = (int)file_get_contents($offsetFile);
            if ($updateOffset > 0) {
                $updateOffset++; // Telegram offsets are inclusive
            }
        }

        // Call getUpdates with short timeout (3 seconds)
        $url = "https://api.telegram.org/bot{$botToken}/getUpdates";
        $payload = [
            'offset' => $updateOffset,
            'timeout' => 3,
            'allowed_updates' => ['message'],
        ];

        $ch = curl_init();
        curl_setopt_array($ch, [
            CURLOPT_URL => $url . '?' . http_build_query($payload),
            CURLOPT_POST => false,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 5, // Hard timeout to not block the poll response
            CURLOPT_CONNECTTIMEOUT => 2,
        ]);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($httpCode !== 200 || !$response) {
            return;
        }

        $data = json_decode($response, true);
        if (!$data || !($data['ok'] ?? false)) {
            return;
        }

        $updates = $data['result'] ?? [];
        if (empty($updates)) {
            return;
        }

        // Process each update
        foreach ($updates as $update) {
            processTelegramUpdate($botToken, $chatId, $chatDataDir, $update);

            // Update the offset
            $newOffset = $update['update_id'] ?? 0;
            if ($newOffset > 0) {
                file_put_contents($offsetFile, (string)$newOffset, LOCK_EX);
            }
        }
    } finally {
        flock($lock, LOCK_UN);
        fclose($lock);
    }
}

/**
 * Process a single Telegram update (operator message)
 */
function processTelegramUpdate(string $botToken, string $chatId, string $chatDataDir, array $update): void
{
    $message = $update['message'] ?? null;
    if (!$message) return;

    // Ignore messages from the bot itself
    $isBot = $message['from']['is_bot'] ?? false;
    if ($isBot) return;

    // Only process messages from the operator's chat
    $messageChatId = (string)($message['chat']['id'] ?? 0);
    if ($messageChatId !== (string)$chatId) return;

    $text = $message['text'] ?? '';
    $fromName = $message['from']['first_name'] ?? 'Оператор';
    $timestamp = $message['date'] ?? time();

    if (empty($text)) return;

    // Ignore old messages (>2min) to prevent stale reply flood
    if (time() - $timestamp > 120) return;

    // Determine target session(s)
    $replyToMessage = $message['reply_to_message'] ?? null;
    $targetSessions = [];

    // Mode 1: Reply to a specific bot message → find session
    if ($replyToMessage) {
        $botMsgId = $replyToMessage['message_id'] ?? 0;
        $session = findSessionByBotMessageId($chatDataDir, $botMsgId);
        if ($session) {
            $targetSessions[] = $session;
        }
    }

    // Mode 2: /reply SESSION_ID text
    if (empty($targetSessions) && preg_match('#^/reply\s+([a-f0-9]+)\s+(.*)#si', $text, $m)) {
        $partialId = $m[1];
        $text = trim($m[2]);
        $targetSessions = findSessionsByPartialId($chatDataDir, $partialId);
    }

    // No broadcast - operator must REPLY to bot message
    if (empty($targetSessions)) return;

    // Build reply message
    $reply = [
        'type' => 'text',
        'text' => $text,
        'from' => $fromName,
        'timestamp' => $timestamp * 1000,
    ];

    // Save reply to all target sessions
    foreach ($targetSessions as $session) {
        saveReply($chatDataDir, $session, $reply);
    }
}

// ========== CHAT STORAGE ==========

function findSessionByBotMessageId(string $chatDataDir, int $botMessageId): ?string
{
    $mappingFile = $chatDataDir . '/mapping.json';
    if (!file_exists($mappingFile)) return null;

    $mappings = json_decode(file_get_contents($mappingFile), true) ?: [];
    for ($i = count($mappings) - 1; $i >= 0; $i--) {
        if (isset($mappings[$i]['botMessageId']) && $mappings[$i]['botMessageId'] == $botMessageId) {
            return $mappings[$i]['sessionId'] ?? null;
        }
    }
    return null;
}

function findSessionsByPartialId(string $chatDataDir, string $partialId): array
{
    $files = glob($chatDataDir . '/session_*.json');
    $matches = [];
    foreach ($files as $file) {
        $sessionId = str_replace('session_', '', basename($file, '.json'));
        if (strpos($sessionId, $partialId) === 0) {
            $matches[] = $sessionId;
        }
    }
    return $matches;
}

function getActiveSessions(string $chatDataDir, int $maxAgeSeconds): array
{
    $files = glob($chatDataDir . '/session_*.json');
    $active = [];
    $now = time();
    foreach ($files as $file) {
        $data = json_decode(file_get_contents($file), true) ?: [];
        $lastActive = $data['lastActive'] ?? 0;
        if (($now - $lastActive) <= $maxAgeSeconds) {
            $active[] = str_replace('session_', '', basename($file, '.json'));
        }
    }
    return $active;
}

function saveReply(string $chatDataDir, string $sessionId, array $reply): void
{
    $repliesFile = $chatDataDir . '/replies_' . sanitizeFilename($sessionId) . '.json';

    $replies = [];
    if (file_exists($repliesFile)) {
        $replies = json_decode(file_get_contents($repliesFile), true) ?: [];
    }

    if (count($replies) > 50) {
        $replies = array_slice($replies, -30);
    }

    $replies[] = $reply;
    file_put_contents($repliesFile, json_encode($replies, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT), LOCK_EX);
}

function sanitizeFilename(string $name): string
{
    return preg_replace('/[^a-zA-Z0-9_-]/', '', $name) ?: 'default';
}

// ========== TELEGRAM FUNCTIONS ==========

function sendTelegramPhoto(string $botToken, string $chatId, string $filePath, string $caption): int
{
    $url = "https://api.telegram.org/bot{$botToken}/sendPhoto";

    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL => $url,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => [
            'chat_id' => $chatId,
            'photo' => new CURLFile($filePath),
            'caption' => $caption,
            'parse_mode' => 'HTML',
        ],
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 30,
    ]);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode === 200 && $response) {
        $data = json_decode($response, true);
        return $data['result']['message_id'] ?? 0;
    }

    error_log("Telegram sendPhoto error ({$httpCode}): {$response}");
    return 0;
}

function sendTelegramFile(string $botToken, string $chatId, string $filePath, string $fileName, string $mimeType, string $caption): int
{
    $url = "https://api.telegram.org/bot{$botToken}/sendDocument";

    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL => $url,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => [
            'chat_id' => $chatId,
            'document' => new CURLFile($filePath, $mimeType, $fileName),
            'caption' => $caption,
            'parse_mode' => 'HTML',
        ],
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 30,
    ]);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode === 200 && $response) {
        $data = json_decode($response, true);
        return $data['result']['message_id'] ?? 0;
    }

    error_log("Telegram sendDocument error ({$httpCode}): {$response}");
    return 0;
}

function sendTelegramMessage(string $botToken, string $chatId, string $text): void
{
    $url = "https://api.telegram.org/bot{$botToken}/sendMessage";
    $payload = [
        'chat_id' => $chatId,
        'text' => $text,
        'parse_mode' => 'HTML',
    ];
    $response = httpRequest($url, $payload);
    if (!$response['ok']) {
        error_log("Telegram sendMessage error: " . json_encode($response));
    }
}

function sendTelegramDocument(string $botToken, string $chatId, string $html, string $subject): void
{
    $url = "https://api.telegram.org/bot{$botToken}/sendDocument";

    $boundary = '----FormBoundary' . bin2hex(random_bytes(8));

    $filename = preg_replace('/[^a-zA-Zа-яА-Я0-9_\-\s]/u', '', $subject);
    $filename = trim($filename) ?: 'order';
    $filename .= '.html';

    $body = "--{$boundary}\r\n";
    $body .= "Content-Disposition: form-data; name=\"chat_id\"\r\n\r\n";
    $body .= "{$chatId}\r\n";
    $body .= "--{$boundary}\r\n";
    $body .= "Content-Disposition: form-data; name=\"document\"; filename=\"{$filename}\"\r\n";
    $body .= "Content-Type: text/html; charset=utf-8\r\n\r\n";
    $body .= $html . "\r\n";
    $body .= "--{$boundary}--\r\n";

    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL => $url,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => $body,
        CURLOPT_HTTPHEADER => [
            "Content-Type: multipart/form-data; boundary={$boundary}",
        ],
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 30,
    ]);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    if (curl_errno($ch)) {
        error_log("Telegram sendDocument curl error: " . curl_error($ch));
    } elseif ($httpCode !== 200) {
        error_log("Telegram sendDocument error ({$httpCode}): {$response}");
    }

    curl_close($ch);
}

// ========== HELPERS ==========

function jsonResponse(array $data, int $status = 200): void
{
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function getJsonInput(): array
{
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function httpRequest(string $url, array $payload): array
{
    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL => $url,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode($payload),
        CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 30,
    ]);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode === 200 && $response) {
        return json_decode($response, true) ?: ['ok' => false, 'description' => 'Empty response'];
    }

    return ['ok' => false, 'description' => "HTTP {$httpCode}", 'code' => $httpCode];
}
