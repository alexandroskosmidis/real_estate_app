<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

session_start();

// ---------- DEBUG LOG ----------
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

// ---------- PREFLIGHT ----------
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
    exit;
}

require_once "../../config/database.php";

if (!isset($_SESSION['user_id'])) {
  http_response_code(401);
  echo json_encode(["error" => "Not authenticated"]);
  exit;
}

$sender_id = (int)$_SESSION['user_id'];

// ---------- READ JSON ----------
$raw = file_get_contents("php://input");
log_debug("RAW INPUT: " . $raw);

$data = json_decode($raw, true);

if (!$data || empty($data['content']) || empty($data['property_id'])) {
    log_debug("ERROR: Invalid payload");
    http_response_code(400);
    echo json_encode(["error" => "Invalid request data"]);
    exit;
}

$content = trim($data['content']);
$property_id = (int)$data['property_id'];

try {

    // ================== FIND OWNER ==================
    log_debug("Finding property owner...");

    $stmt = mysqli_prepare($con, "
        SELECT owner_id 
        FROM Property 
        WHERE property_id = ?
    ");
    mysqli_stmt_bind_param($stmt, "i", $property_id);
    mysqli_stmt_execute($stmt);
    $res = mysqli_stmt_get_result($stmt);

    if (!$row = mysqli_fetch_assoc($res)) {
        throw new Exception("Property not found");
    }

    $receiver_id = (int)$row['owner_id'];
    log_debug("Receiver ID: $receiver_id");

    // ================== NEXT MESSAGE ID ==================
    $r = mysqli_query(
        $con,
        "SELECT COALESCE(MAX(message_id),0)+1 AS next_id FROM Message"
    );
    $message_id = mysqli_fetch_assoc($r)['next_id'];

    // ================== INSERT MESSAGE ==================
    $stmt = mysqli_prepare($con, "
        INSERT INTO Message
        (message_id, content, sent_at, sender_id, receiver_id, property_id)
        VALUES (?, ?, NOW(), ?, ?, ?)
    ");

    mysqli_stmt_bind_param(
        $stmt,
        "isiii",
        $message_id,
        $content,
        $sender_id,
        $receiver_id,
        $property_id
    );

    if (!mysqli_stmt_execute($stmt)) {
        throw new Exception(mysqli_error($con));
    }

    log_debug("Message inserted: ID = $message_id");

    echo json_encode([
        "success" => true,
        "message_id" => $message_id
    ]);

} catch (Exception $e) {

    log_debug("ERROR: " . $e->getMessage());

    http_response_code(500);
    echo json_encode([
        "error" => "Failed to send message",
        "details" => $e->getMessage()
    ]);
}
