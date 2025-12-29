<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Content-Type: application/json");

require_once "../../config/database.php";

// ⚠ προσωρινά hardcoded
$user_id = 1;

$data = json_decode(file_get_contents("php://input"), true);

mysqli_begin_transaction($con);

try {
  // LOCATION
  $stmt = mysqli_prepare($con, "
    SELECT location_id FROM Location
    WHERE city=? AND area=? AND address=? AND number=? AND postal_code=?
  ");
  mysqli_stmt_bind_param(
    $stmt,
    "sssss",
    $data["city"],
    $data["area"],
    $data["address"],
    $data["number"],
    $data["postal_code"]
  );
  mysqli_stmt_execute($stmt);
  $res = mysqli_stmt_get_result($stmt);

  if ($row = mysqli_fetch_assoc($res)) {
    $location_id = $row["location_id"];
  } else {
    mysqli_query($con, "
      INSERT INTO Location (city, area, address, number, postal_code)
      VALUES (
        '{$data["city"]}',
        '{$data["area"]}',
        '{$data["address"]}',
        '{$data["number"]}',
        '{$data["postal_code"]}'
      )
    ");
    $location_id = mysqli_insert_id($con);
  }

  // PROPERTY
  mysqli_query($con, "
    INSERT INTO Property
    (price, square_meters, rooms, floor, creation_date, purpose, owner_id, location_id)
    VALUES (
      {$data["price"]},
      {$data["square_meters"]},
      {$data["rooms"]},
      {$data["floor"]},
      '{$data["creation_date"]}',
      '{$data["purpose"]}',
      $user_id,
      $location_id
    )
  ");
  $property_id = mysqli_insert_id($con);

  // AMENITIES
  foreach ($data["amenities"] as $a) {
    mysqli_query($con, "INSERT IGNORE INTO Amenity (name) VALUES ('$a')");
    mysqli_query($con, "
      INSERT INTO Property_Amenity (property_id, amenity_name)
      VALUES ($property_id, '$a')
    ");
  }

  mysqli_commit($con);
  echo json_encode(["success" => true]);

} catch (Exception $e) {
  mysqli_rollback($con);
  http_response_code(500);
  echo json_encode(["error" => "Failed"]);
}
