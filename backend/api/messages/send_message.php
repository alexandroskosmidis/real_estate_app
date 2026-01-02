<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once "../../config/database.php";

// ---------- DEBUG ----------
$logFile = __DIR__ . "/debug_send_message.log";
function log_debug($msg) {
    global $logFile;
    file_put_contents(
        $logFile,
        "[" . date("Y-m-d H:i:s") . "] " . $msg . PHP_EOL,
        FILE_APPEND
    );
}

log_debug("=== SEND MESSAGE CALLED ===");

$data = json_decode(file_get_contents("php://input"), true);

$sender_id   = $data['sender_id'] ?? null;
$property_id = $data['property_id'] ?? null;
$content     = trim($data['content'] ?? '');

if (!$sender_id || !$property_id || !$content) {
    log_debug("ERROR: Missing fields");
    http_response_code(400);
    echo json_encode(["error" => "Missing fields"]);
    exit;
}

// ---------- FIND RECEIVER (OWNER) ----------
$stmt = mysqli_prepare($con, "
    SELECT owner_id
    FROM Property
    WHERE property_id = ?
");
mysqli_stmt_bind_param($stmt, "i", $property_id);
mysqli_stmt_execute($stmt);
$res = mysqli_stmt_get_result($stmt);

$row = mysqli_fetch_assoc($res);
if (!$row) {
    log_debug("ERROR: Property not found");
    http_response_code(404);
    echo json_encode(["error" => "Property not found"]);
    exit;
}

$receiver_id = $row['owner_id'];

// ---------- NEXT MESSAGE ID ----------
$r = mysqli_query($con, "SELECT COALESCE(MAX(message_id), 0) + 1 AS next_id FROM `Message`");
$row = mysqli_fetch_assoc($r);
$message_id = (int)$row['next_id'];

log_debug("Next message_id = $message_id");

// ---------- INSERT MESSAGE ----------
$stmt = mysqli_prepare($con, "
    INSERT INTO Message
    (message_id, sender_id, receiver_id, property_id, content, sent_at)
    VALUES (?, ?, ?, ?, ?, NOW())
");

mysqli_stmt_bind_param(
    $stmt,
    "iiiis",
    $message_id,
    $sender_id,
    $receiver_id,
    $property_id,
    $content
);

if (!mysqli_stmt_execute($stmt)) {
    log_debug("MYSQL ERROR: " . mysqli_error($con));
    http_response_code(500);
    echo json_encode(["error" => "Insert failed"]);
    exit;
}


log_debug("MESSAGE SENT from $sender_id to $receiver_id");

echo json_encode(["success" => true]);
