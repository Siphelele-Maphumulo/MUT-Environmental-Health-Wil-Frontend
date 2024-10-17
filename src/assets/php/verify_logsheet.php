<?php
include 'db.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $logsheet_id = $_POST['logsheet_id'];
    $supervisor_name = $_POST['supervisor_name'];
    $supervisor_hi_number = $_POST['supervisor_hi_number'];
    $signature_date = $_POST['signature_date'];

    // Handle file upload
    if (isset($_FILES['supervisor_signature']) && $_FILES['supervisor_signature']['error'] == 0) {
        $upload_dir = 'uploads/';
        $file_name = basename($_FILES['supervisor_signature']['name']);
        $target_file = $upload_dir . $file_name;

        // Move the uploaded file to the target directory
        if (move_uploaded_file($_FILES['supervisor_signature']['tmp_name'], $target_file)) {
            // Update the log sheet with the supervisor's signature, name, HI number, and date
            $sql = "UPDATE logsheets 
                    SET supervisor_signature='$file_name', 
                        supervisor_name='$supervisor_name', 
                        supervisor_hi_number='$supervisor_hi_number', 
                        signature_date='$signature_date' 
                    WHERE id=$logsheet_id";

            if ($conn->query($sql) === TRUE) {
                echo "Log sheet verified successfully.";
                header("Location: logsheet_display.php"); // Redirect to the log sheets view page
                exit();
            } else {
                echo "Error updating log sheet: " . $conn->error;
            }
        } else {
            echo "Error uploading file.";
        }
    } else {
        echo "No file uploaded or there was an error with the upload.";
    }

    // Close the connection
    $conn->close();
}
?>
