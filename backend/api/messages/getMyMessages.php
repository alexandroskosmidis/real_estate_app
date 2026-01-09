<?php
header("Access-Control-Allow-Origin: *");
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
    u.phone,

    p.property_id,
    p.price,
    p.square_meters,
    p.rooms,
    p.floor,
    p.creation_date,
    p.purpose,

    l.city,
    l.area,
    l.address,
    l.number,

    ph.photo_url,
    pa.amenity_name

FROM Message m

INNER JOIN User u 
    ON u.user_id = m.sender_id

INNER JOIN Property p 
    ON p.property_id = m.property_id

INNER JOIN Location l 
    ON p.location_id = l.location_id

LEFT JOIN Photo_URL ph 
    ON ph.property_id = p.property_id

LEFT JOIN Property_Amenity pa 
    ON pa.property_id = p.property_id

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

    $messageId = $row['message_id'];

    if (!isset($messages[$messageId])) {
        $messages[$messageId] = [
            "message_id" => (int)$row["message_id"],
            "content" => $row["content"],
            "sent_at" => $row["sent_at"],

            "sender" => [
                "user_id" => (int)$row["sender_id"],
                "name" => $row["name"],
                "email" => $row["email"],
                "phone" => $row["phone"],
            ],

            "property" => [
                "property_id" => (int)$row["property_id"],
                "price" => (float)$row["price"],
                "square_meters" => (int)$row["square_meters"],
                "rooms" => (int)$row["rooms"],
                "floor" => (int)$row["floor"],
                "creation_date" => $row["creation_date"],
                "purpose" => $row["purpose"],

                "city" => $row["city"],
                "area" => $row["area"],
                "address" => $row["address"],
                "number" => $row["number"],

                "photo_url" => $row["photo_url"],
                "amenities" => []
            ]
        ];
    }

    if (!empty($row['amenity_name'])) {
        $messages[$messageId]['property']['amenities'][] = $row['amenity_name'];
    }
}


log_debug("Messages found: " . count($messages));

echo json_encode(array_values($messages));
