<?php
session_start();
include 'db.php';

// Ensure user is logged in and has the 'supervisor' role
if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'supervisor') {
    header("Location: ../login.html");
    exit();
}

// Fetch all log sheets
$sql = "SELECT users.username, logsheet.date, logsheet.details 
        FROM logsheet 
        JOIN users ON logsheet.student_id = users.id";
$result = $conn->query($sql);

if (!$result) {
    die("Query failed: " . $conn->error);
}

$logs = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $logs[] = $row;
    }
}

header('Content-Type: application/json');
echo json_encode($logs);

$conn->close();
?>
