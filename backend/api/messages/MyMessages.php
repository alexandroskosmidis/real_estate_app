<?php
header("Content-Type: application/json");
require_once "../../config/database.php";

$loggedUserId = $_GET['user_id'] ?? null;

if (!$loggedUserId) {
    http_response_code(400);
    echo json_encode(["error" => "Missing user_id"]);
    exit;
}

$sql = "
SELECT 
    m.message_id,
    m.content,
    m.sent_at,
    u.user_id,
    u.name,
    u.email,
    u.phone
FROM Message m
JOIN User u ON u.user_id = m.sender_id
WHERE m.receiver_id = ?
ORDER BY m.sent_at DESC
";

$stmt = mysqli_prepare($con, $sql);
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
            "user_id" => $row["user_id"],
            "name" => $row["name"],
            "email" => $row["email"],
            "phone" => $row["phone"]
        ]
    ];
}

echo json_encode($messages);
