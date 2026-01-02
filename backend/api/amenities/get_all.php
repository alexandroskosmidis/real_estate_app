<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once "../../config/database.php";

$res = mysqli_query($con, "SELECT name FROM Amenity");
$rows = mysqli_fetch_all($res, MYSQLI_ASSOC);

echo json_encode(array_column($rows, "name"));
