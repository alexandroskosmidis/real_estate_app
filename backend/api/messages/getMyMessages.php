<?php
// ---------- CORS ----------
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// ---------- DEBUG ----------
$logFile = __DIR__ . "/debug_get_messages.log";
function log_debug($msg) {
    global $logFile;
    file_put_contents(
        $logFile,
        "[" . date("Y-m-d H:i:s") . "] " . $msg . PHP_EOL,
        FILE_APPEND
    );
}

log_debug("=== GET MY MESSAGES CALLED ===");

require_once "../../config/database.php";

if (!$con) {
    log_debug("DB CONNECTION FAILED");
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed"]);
    exit;
}

$loggedUserId = $_GET['user_id'] ?? null;
log_debug("user_id = " . ($loggedUserId ?? "NULL"));

if (!$loggedUserId) {
    log_debug("ERROR: Missing user_id");
    http_response_code(400);
    echo json_encode(["error" => "Missing user_id"]);
    exit;
}

$sql = "
SELECT 
    m.message_id,
    m.content,
    m.sent_at,
    u.user_id AS sender_id,
    u.name,
    u.email,
    u.phone
FROM Message m
JOIN User u ON u.user_id = m.sender_id
WHERE m.receiver_id = ?
ORDER BY m.sent_at DESC
";

$stmt = mysqli_prepare($con, $sql);

if (!$stmt) {
    log_debug("PREPARE FAILED: " . mysqli_error($con));
    http_response_code(500);
    echo json_encode(["error" => "Prepare failed"]);
    exit;
}

mysqli_stmt_bind_param($stmt, "i", $loggedUserId);
mysqli_stmt_execute($stmt);
$res = mysqli_stmt_get_result($stmt);

$messages = [];

while ($row = mysqli_fetch_assoc($res)) {
    $messages[] = [
        "message_id" => $row["message_id"],
        "content" => $row["content"],
        "sent_at" => $row["sent_at"],
        "sender" => [
            "user_id" => $row["sender_id"],
            "name" => $row["name"],
            "email" => $row["email"],
            "phone" => $row["phone"]
        ]
    ];
}

log_debug("Messages found: " . count($messages));

echo json_encode($messages);
