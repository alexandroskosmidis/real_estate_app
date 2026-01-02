<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once "../../config/database.php";


$user_id = $_GET['user_id'] ?? null;


if (!$user_id) {
    echo json_encode(["success" => false, "message" => "User ID is required"]);
    exit;
}


$sql = "
    SELECT 
        m.message_id, 
        m.content, 
        m.sent_at,
        u.name AS sender_name,     
        u.email AS sender_email, 
        u.phone AS sender_phone,
        p.city AS property_city,    
        p.area AS property_area,
        p.photo_url AS property_photo,
        p.price,
        p.purpose
    FROM Message m
    JOIN Property p ON m.property_id = p.property_id
    LEFT JOIN User u ON m.sender_id = u.user_id
    WHERE m.receiver_id = ? -- WHERE p.owner_id = ?
    ORDER BY m.sent_at DESC
";

$stmt = mysqli_prepare($con, $sql);

if (!$stmt) {
    echo json_encode(["success" => false, "message" => "SQL Error: " . mysqli_error($con)]);
    exit;
}

mysqli_stmt_bind_param($stmt, "i", $user_id);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

$messages = [];
while ($row = mysqli_fetch_assoc($result)) {
    $messages[] = $row;
}

echo json_encode(["success" => true, "messages" => $messages]);
?>