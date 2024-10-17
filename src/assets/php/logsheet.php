<?php
// Database connection settings
include 'db.php';

// Collect form data with isset() to avoid undefined index notices
$date = isset($_POST['date']) ? $_POST['date'] : null;
$activity = isset($_POST['activity']) ? $_POST['activity'] : [];
$hours = isset($_POST['hours']) ? $_POST['hours'] : [];
$description = isset($_POST['description']) ? $_POST['description'] : null;
$situation = isset($_POST['situation']) ? $_POST['situation'] : null;
$evaluation = isset($_POST['evaluation']) ? $_POST['evaluation'] : null;
$interpretation = isset($_POST['interpretation']) ? $_POST['interpretation'] : null;
$supervisor_name = isset($_POST['supervisor_name']) ? $_POST['supervisor_name'] : null;
$supervisor_hi_number = isset($_POST['supervisor_hi_number']) ? $_POST['supervisor_hi_number'] : null;
$signature_date = isset($_POST['signature_date']) ? $_POST['signature_date'] : null;

// Function to upload files
function uploadFile($file, $upload_dir) {
    if ($file && $file['error'] == UPLOAD_ERR_OK) {
        $tmp_name = $file['tmp_name'];
        $name = basename($file['name']);
        $upload_file = $upload_dir . $name;
        move_uploaded_file($tmp_name, $upload_file);
        return $name;
    }
    return null;
}

$upload_dir = 'uploads/';
if (!is_dir($upload_dir)) {
    mkdir($upload_dir, 0777, true);
}

$student_signature = isset($_FILES['student_signature']) ? uploadFile($_FILES['student_signature'], $upload_dir) : null;
$supervisor_signature = isset($_FILES['supervisor_signature']) ? uploadFile($_FILES['supervisor_signature'], $upload_dir) : null;
$date_stamp = isset($_FILES['date_stamp']) ? uploadFile($_FILES['date_stamp'], $upload_dir) : null;

// Check if an entry already exists for this student and date
$check_stmt = $conn->prepare("SELECT COUNT(*) FROM logsheets WHERE date = ?");
if ($check_stmt === false) {
    die("Error preparing statement: " . $conn->error);
}
$check_stmt->bind_param("s", $date);
$check_stmt->execute();
$check_stmt->bind_result($count);
$check_stmt->fetch();
$check_stmt->close();

if ($count > 0) {
    echo "A log sheet for today's date already exists.";
} else {
    // Insert form data into the logsheets table
    $stmt = $conn->prepare("
        INSERT INTO logsheets (date, description, situation, evaluation, interpretation, student_signature, supervisor_signature, date_stamp, supervisor_name, supervisor_hi_number, signature_date) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    
    if ($stmt === false) {
        die("Error preparing statement: " . $conn->error);
    }

    $stmt->bind_param("sssssssssss", $date, $description, $situation, $evaluation, $interpretation, $student_signature, $supervisor_signature, $date_stamp, $supervisor_name, $supervisor_hi_number, $signature_date);
    
    if ($stmt->execute()) {
        $logsheet_id = $stmt->insert_id;
        
        // Insert activities into the activities table
        $activity_stmt = $conn->prepare("INSERT INTO activities (logsheet_id, activity, hours) VALUES (?, ?, ?)");
        if ($activity_stmt === false) {
            die("Error preparing statement: " . $conn->error);
        }
        
        foreach ($activity as $index => $act) {
            $hrs = isset($hours[$index]) ? $hours[$index] : 0;
            $activity_stmt->bind_param("isi", $logsheet_id, $act, $hrs);
            $activity_stmt->execute();
        }

        echo "Log sheet submitted successfully!";
    } else {
        echo "Error: " . $stmt->error;
    }

    // Close connections
    $stmt->close();
    $activity_stmt->close();
}

$conn->close();
?>
