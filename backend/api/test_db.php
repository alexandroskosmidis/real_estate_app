
<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once __DIR__ . "/../config/database.php";

$result = mysqli_query($con, "SELECT 1");

if ($result) {
  echo json_encode([
    "success" => true,
    "message" => "Database connection OK"
  ]);
} else {
  echo json_encode([
    "success" => false,
    "message" => "Query failed"
  ]);
}
