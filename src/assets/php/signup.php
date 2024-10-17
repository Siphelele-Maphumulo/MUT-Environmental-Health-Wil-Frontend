
<?php
include 'db.php';

// Retrieve POST data
$username = $_POST['username'];
$contact = $_POST['contact'];
$email = $_POST['email'];
$password = password_hash($_POST['password'], PASSWORD_BCRYPT);
$role = $_POST['role'];

// Prepare SQL statement
$sql = "INSERT INTO users (username, contact, email, password, role) VALUES (?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);

// Check if the statement was prepared successfully
if ($stmt === false) {
    die('Prepare failed: ' . htmlspecialchars($conn->error));
}

// Bind parameters (s = string, i = integer, d = double, b = blob)
$stmt->bind_param('sssss', $username, $contact, $email, $password, $role);

// Execute the statement
if ($stmt->execute()) {
    header("Location: ../login.html");
    exit(); // Ensure no further code is executed
} else {
    echo "Error: " . $stmt->error;
}

// Close statement and connection
$stmt->close();
$conn->close();
?>
