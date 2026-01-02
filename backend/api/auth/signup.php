<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$logFile = __DIR__ . "/signup_debug.log";
function log_debug($msg) {
    global $logFile;
    file_put_contents($logFile, "[" . date("Y-m-d H:i:s") . "] " . $msg . PHP_EOL, FILE_APPEND);
}

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

$input = file_get_contents("php://input");
$data = json_decode($input, true);

if (empty($data['username']) || empty($data['password']) || empty($data['email'])) {
    echo json_encode(["success" => false, "message" => "Please fill in all required fields."]);
    exit;
}

$username   = $data['username'];
$password   = $data['password'];
$email      = $data['email'];
$phone      = $data['phone'] ?? '';
$role       = 'renter'; 

mysqli_begin_transaction($con);

try {
    // 2. Έλεγχος αν υπάρχει ήδη ο χρήστης
    $checkStmt = mysqli_prepare($con, "SELECT user_id FROM User WHERE name = ? OR email = ?");
    mysqli_stmt_bind_param($checkStmt, "ss", $username, $email);
    mysqli_stmt_execute($checkStmt);
    mysqli_stmt_store_result($checkStmt);

    if (mysqli_stmt_num_rows($checkStmt) > 0) {
        throw new Exception("Username or Email already exists.");
    }
    mysqli_stmt_close($checkStmt);

    $r = mysqli_query($con, "SELECT COALESCE(MAX(user_id), 0) + 1 AS next_id FROM User");
    $row = mysqli_fetch_assoc($r);
    $new_user_id = (int)$row['next_id'];

    log_debug("Creating user with ID: " . $new_user_id);

    // 4. Εισαγωγή του νέου χρήστη με το συγκεκριμένο ID
    $insertSql = "INSERT INTO User (user_id, name, password, email, phone, role) VALUES (?, ?, ?, ?, ?, ?)";
    $stmt = mysqli_prepare($con, $insertSql);

    // "isssss" -> i=integer (id), s=string 
    mysqli_stmt_bind_param($stmt, "isssss", $new_user_id, $username, $password, $email, $phone, $role);
    if (!mysqli_stmt_execute($stmt)) {
        throw new Exception("Insert failed: " . mysqli_stmt_error($stmt));
    }

    mysqli_commit($con);

    echo json_encode(["success" => true, "message" => "User created successfully!", "user_id" => $new_user_id]);

} catch (Exception $e) {
    mysqli_rollback($con);
    log_debug("Error: " . $e->getMessage());
    
    echo json_encode([
        "success" => false, 
        "message" => $e->getMessage()
    ]);
}
?>