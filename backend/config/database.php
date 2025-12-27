<?php

$con = mysqli_connect(
  "localhost",
  "lab2526omada2",
  "alex_vicky",
  "lab2526omada2_real_estate_app"
);

if (!$con) {
  http_response_code(500);
  header("Content-Type: application/json");
  echo json_encode([
    "success" => false,
    "message" => "Database connection failed",
    "error" => mysqli_connect_error()
  ]);
  exit;
}
