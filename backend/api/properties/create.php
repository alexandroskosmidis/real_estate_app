<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
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

log_debug("=== CREATE PROPERTY CALLED ===");

// ---------- PREFLIGHT ----------
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

// ⚠ προσωρινά hardcoded user
$user_id = 1;

// ---------- READ JSON ----------
$raw = file_get_contents("php://input");
log_debug("RAW INPUT: " . $raw);

$data = json_decode($raw, true);

if (!$data) {
    log_debug("ERROR: Invalid JSON");
    http_response_code(400);
    echo json_encode(["error" => "Invalid JSON"]);
    exit;
}

// ---------- TRANSACTION ----------
mysqli_begin_transaction($con);

try {

    // ---------- LOCATION ----------
    log_debug("Checking location...");

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
        log_debug("Location exists: ID = $location_id");
    } else {
        log_debug("Inserting new location...");
        if (!mysqli_query($con, "
            INSERT INTO Location (city, area, address, number, postal_code)
            VALUES (
              '{$data["city"]}',
              '{$data["area"]}',
              '{$data["address"]}',
              '{$data["number"]}',
              '{$data["postal_code"]}'
            )
        ")) {
            throw new Exception("Location insert failed: " . mysqli_error($con));
        }
        $location_id = mysqli_insert_id($con);
        log_debug("New location ID = $location_id");
    }

    // ---------- PROPERTY ----------
    log_debug("Inserting property...");

    if (!mysqli_query($con, "
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
    ")) {
        throw new Exception("Property insert failed: " . mysqli_error($con));
    }

    $property_id = mysqli_insert_id($con);
    log_debug("Property ID = $property_id");

    // ---------- AMENITIES ----------
    if (!empty($data["amenities"])) {
        foreach ($data["amenities"] as $a) {
            log_debug("Amenity: $a");

            if (!mysqli_query($con,
                "INSERT IGNORE INTO Amenity (name) VALUES ('$a')"
            )) {
                throw new Exception("Amenity insert failed: " . mysqli_error($con));
            }

            if (!mysqli_query($con, "
                INSERT INTO Property_Amenity (property_id, amenity_name)
                VALUES ($property_id, '$a')
            ")) {
                throw new Exception("Property_Amenity insert failed: " . mysqli_error($con));
            }
        }
    }

    // ---------- COMMIT ----------
    mysqli_commit($con);
    log_debug("TRANSACTION COMMITTED");

    echo json_encode(["success" => true]);

} catch (Exception $e) {

    mysqli_rollback($con);
    log_debug("ERROR: " . $e->getMessage());

    http_response_code(500);
    echo json_encode([
        "error" => "Failed to create property",
        "details" => $e->getMessage()
    ]);
}
