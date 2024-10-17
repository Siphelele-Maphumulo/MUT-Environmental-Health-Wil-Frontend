<?php
session_start();
include 'db.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $username = $_POST['username'];
    $password = $_POST['password'];

    // Prepare the SQL statement
    $sql = "SELECT id, email, password, role FROM users WHERE username = ?";
    $stmt = $conn->prepare($sql);

    if ($stmt) {
        // Bind the parameter and execute the statement
        $stmt->bind_param("s", $username);
        $stmt->execute();
        $stmt->store_result();

        // Check if the user exists
        if ($stmt->num_rows > 0) {
            // Bind result variables
            $stmt->bind_result($id, $email, $hashed_password, $role);
            $stmt->fetch();

            // Verify the password
            if (password_verify($password, $hashed_password)) {
                // Set session variables
                $_SESSION['student_id'] = $id;
                $_SESSION['username'] = $username;
                $_SESSION['email'] = $email;
                $_SESSION['role'] = $role;

                // Echo JavaScript to store student_id and username in session storage
                echo "<script>
                        sessionStorage.setItem('student_id', '" . $id . "');
                        sessionStorage.setItem('username', '" . $username . "');
                        window.location.href = '" . ($role == 'student' ? "/wil/studentsforms.html" : "logsheet_display.php") . "';
                      </script>";
                exit();
            } else {
                echo "Invalid credentials.";
            }
        } else {
            echo "User not found.";
        }

        // Close the statement
        $stmt->close();
    } else {
        echo "Database error: Failed to prepare the statement.";
    }
} else {
    echo "Invalid request method.";
}

// Close the connection
$conn->close();
?>
