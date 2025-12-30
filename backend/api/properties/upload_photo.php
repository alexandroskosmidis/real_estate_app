<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    exit;
}

require_once "../../config/database.php";

if (!isset($_POST["property_id"])) {
    http_response_code(400);
    echo json_encode(["error" => "Missing property_id"]);
    exit;
}

if (!isset($_FILES["photo"])) {
    http_response_code(400);
    echo json_encode(["error" => "Missing photo"]);
    exit;
}

$property_id = intval($_POST["property_id"]);
$file = $_FILES["photo"];

$allowedTypes = ["image/jpeg", "image/png", "image/webp"];
if (!in_array($file["type"], $allowedTypes)) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid file type"]);
    exit;
}

$ext = pathinfo($file["name"], PATHINFO_EXTENSION);
$filename = "property_" . $property_id . "_" . time() . "." . $ext;

$uploadDir = "../../uploads/properties/";
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

$target = $uploadDir . $filename;

if (!move_uploaded_file($file["tmp_name"], $target)) {
    http_response_code(500);
    echo json_encode(["error" => "Upload failed"]);
    exit;
}

$photo_url =
  "https://dblab.nonrelevant.net/~lab2526omada2/uploads/properties/$filename";

mysqli_query($con, "
    INSERT INTO Photo_URL (photo_url, property_id)
    VALUES ('$photo_url', $property_id)
");

echo json_encode([
    "success" => true,
    "photo_url" => $photo_url
]);
