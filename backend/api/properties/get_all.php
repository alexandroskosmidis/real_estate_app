<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Content-Type: application/json");

require_once "../../config/database.php";

$sql = "
SELECT
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

FROM Property p

INNER JOIN Location l
  ON p.location_id = l.location_id

LEFT JOIN Photo_URL ph
  ON ph.property_id = p.property_id

LEFT JOIN Property_Amenity pa
  ON pa.property_id = p.property_id

ORDER BY p.property_id;
";

$result = mysqli_query($con, $sql);

if (!$result) {
    http_response_code(500);
    echo json_encode([
        "error" => mysqli_error($con)
    ]);
    exit;
}

$rows = mysqli_fetch_all($result, MYSQLI_ASSOC);


$properties = [];

foreach ($rows as $row) {
  $id = $row['property_id'];

  if (!isset($properties[$id])) {
    $properties[$id] = [
      "property_id" => (int)$row['property_id'],
      "price" => (float)$row['price'],
      "square_meters" => (int)$row['square_meters'],
      "rooms" => (int)$row['rooms'],
      "floor" => (int)$row['floor'],
      "creation_date" => $row['creation_date'],
      "purpose" => $row['purpose'],
      "city" => $row['city'],
      "area" => $row['area'],
      "address" => $row['address'],
      "number" => $row['number'],
      "photo_url" => $row['photo_url'],
      "amenities" => []
    ];
  }

  if ($row['amenity_name']) {
    $properties[$id]['amenities'][] = $row['amenity_name'];
  }
}

echo json_encode(array_values($properties));