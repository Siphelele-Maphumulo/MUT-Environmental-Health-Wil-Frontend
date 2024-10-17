<?php
session_start(); // Start the session

// Check if user is logged in
if (isset($_SESSION['student_id'])) {
    $student_id = $_SESSION['student_id']; // Retrieve student_id from the session
} else {
    // Redirect to login page if not logged in
    header("Location: login.html");
    exit();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Student Page</title>
    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
    <link href="css/styles.css" rel="stylesheet">
</head>
<body>

<!-- Display student ID at the top of the page -->
<header>
    <div class="container">
        <h1>Welcome, Student ID: <?php echo htmlspecialchars($student_id); ?></h1>
    </div>
</header>

<!-- Page content here -->

<script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.5.2/dist/umd/popper.min.js"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
</body>
</html>
