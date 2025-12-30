<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// ---------- DEBUG LOG ----------
$logFile = __DIR__ . "/debug.log";
function log_debug($msg) {
    global $logFile;
    file_put_contents(
        $logFile,
        "[" . date("Y-m-d H:i:s") . "] " . $msg . PHP_EOL,
        FILE_APPEND
    );
}

log_debug("=== UPLOAD PHOTO CALLED ===");

// ---------- PREFLIGHT ----------
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    log_debug("Wrong method");
    http_response_code(405);
    exit;
}

require_once "../../config/database.php";

// ---------- VALIDATION ----------
if (!isset($_POST["property_id"])) {
    log_debug("Missing property_id");
    http_response_code(400);
    echo json_encode(["error" => "Missing property_id"]);
    exit;
}

if (!isset($_FILES["photo"])) {
    log_debug("Missing photo file");
    http_response_code(400);
    echo json_encode(["error" => "Missing photo"]);
    exit;
}

$property_id = (int)$_POST["property_id"];
$file = $_FILES["photo"];

log_debug("Property ID: $property_id");
log_debug("File name: " . $file["name"]);
log_debug("File error: " . $file["error"]);

// ---------- CHECK UPLOAD ----------
if ($file["error"] !== UPLOAD_ERR_OK) {
    log_debug("Upload error code: " . $file["error"]);
    http_response_code(400);
    exit;
}

// ---------- DESTINATION ----------
$uploadDir = "../../../uploads/properties/";
log_debug("Upload dir: $uploadDir");

if (!is_dir($uploadDir)) {
    log_debug("Upload dir does not exist, creating...");
    mkdir($uploadDir, 0755, true);
}

$ext = pathinfo($file["name"], PATHINFO_EXTENSION);
$filename = "property_" . $property_id . "_" . time() . "." . $ext;
$fullPath = $uploadDir . $filename;

log_debug("Full path: $fullPath");

// ---------- MOVE FILE ----------
if (!move_uploaded_file($file["tmp_name"], $fullPath)) {
    log_debug("move_uploaded_file FAILED");
    http_response_code(500);
    exit;
}

$photo_url = "https://dblab.nonrelevant.net/~lab2526omada2/uploads/properties/" . $filename;
log_debug("Photo URL: $photo_url");

// ---------- DB INSERT ----------
$stmt = mysqli_prepare(
    $con,
    "INSERT INTO Photo_URL (photo_url, property_id) VALUES (?, ?)"
);

if (!$stmt) {
    log_debug("Prepare failed: " . mysqli_error($con));
    http_response_code(500);
    exit;
}

mysqli_stmt_bind_param($stmt, "si", $photo_url, $property_id);

if (!mysqli_stmt_execute($stmt)) {
    log_debug("DB insert failed: " . mysqli_error($con));
    http_response_code(500);
    exit;
}

log_debug("UPLOAD SUCCESS");

echo json_encode([
    "success" => true,
    "photo_url" => $photo_url
]);

