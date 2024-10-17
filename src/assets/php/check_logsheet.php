<?php

include 'db.php';
// check_logsheet.php
session_start(); // Ensure session is started if user ID is stored in session



// User ID from session (or however you obtain it)
$user_id = isset($_SESSION['user_id']) ? $_SESSION['user_id'] : 0; // Adjust according to your user session management

// Get today's date
$today = date('Y-m-d');

// Prepare SQL query
$sql = "SELECT COUNT(*) as count FROM logsheet WHERE user_id = ? AND date = ?";
$stmt = $conn->prepare($sql);

if ($stmt === false) {
    // Handle SQL preparation error
    die("SQL preparation failed: " . $conn->error);
}

$stmt->bind_param("is", $user_id, $today);

if (!$stmt->execute()) {
    // Handle execution error
    die("Execution failed: " . $stmt->error);
}

$result = $stmt->get_result();
$row = $result->fetch_assoc();
$count = $row['count'];

$stmt->close();
$conn->close();

// Return the result as JSON
echo json_encode(['exists' => $count > 0]);
