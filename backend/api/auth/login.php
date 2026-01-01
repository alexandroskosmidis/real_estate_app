<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

session_start();
require_once __DIR__ . "/../../config/database.php";

$data = json_decode(file_get_contents("php://input"), true);

$username = $data['username'] ?? '';
$password = $data['password'] ?? '';

if (!$username || !$password) {
    echo json_encode([
        "success" => false,
        "message" => "Username and password required"
    ]);
    exit;
}

$sql = "
    SELECT user_id, name, email, phone, role
    FROM User
    WHERE name = ? AND password = ?
";

$stmt = mysqli_prepare($con, $sql);
mysqli_stmt_bind_param($stmt, "ss", $username, $password);
mysqli_stmt_execute($stmt);

$result = mysqli_stmt_get_result($stmt);
$user = mysqli_fetch_assoc($result);

if ($user) {
    echo json_encode([
        "success" => true,
        "user" => $user
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Invalid credentials"
    ]);
}
