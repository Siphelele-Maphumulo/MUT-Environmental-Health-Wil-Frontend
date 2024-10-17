<?php
//session_start();
include 'db.php';

// Ensure the user is logged in and is a supervisor
/*if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'supervisor') {
    header("Location: ../login.html");
    exit();
}*/
// Query to fetch log sheets
$sql = "SELECT * FROM logsheets";
$result = $conn->query($sql);

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>View Log Sheets</title>
    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body {
            background-color: #f8f9fa;
        }

        .container {
            margin-top: 2rem;
        }

        .log-sheet-card {
            margin-bottom: 2rem;
        }

        .verify-button {
            margin-top: 10px;
            display: inline-block;
            background-color: #28a745;
            color: white;
            padding: 10px;
            border: none;
            cursor: pointer;
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1 class="text-center">Log Sheets</h1>


        <?php
        if ($result->num_rows > 0) {
            // Output data of each row
            while ($row = $result->fetch_assoc()) {
                echo '<div class="card log-sheet-card">';
                echo '<div class="card-body">';
                echo '<h5 class="card-title">Log Sheet ID: ' . $row['id'] . '</h5>';
                echo '<p><strong>Date:</strong> ' . $row['date'] . '</p>';
                echo '<p><strong>Description of WIL activities conducted:</strong> ' . nl2br(htmlspecialchars($row['description'])) . '</p>';
                echo '<h6 style="text-align: center;"><strong> Reflect on the most significant events:</strong> </h6>';
                echo '<p><strong>Describe the situation: What happened?</strong> ' . nl2br(htmlspecialchars($row['situation'])) . '</p>';
                echo '<p><strong>Evaluate the situation: Why was this event significant?</strong> ' . nl2br(htmlspecialchars($row['evaluation'])) . '</p>';
                echo '<p><strong>Interpret the situation: What did you learn?</strong> ' . nl2br(htmlspecialchars($row['interpretation'])) . '</p>';

                echo '<h6>Activities:</h6>';
                $activities_sql = "SELECT * FROM activities WHERE logsheet_id = " . $row['id'];
                $activities_result = $conn->query($activities_sql);

                if ($activities_result->num_rows > 0) {
                    echo '<ul>';
                    while ($activity = $activities_result->fetch_assoc()) {
                        echo '<li>' . htmlspecialchars($activity['activity']) . ': ' . htmlspecialchars($activity['hours']) . ' hours</li>';
                    }
                    echo '</ul>';
                } else {
                    echo '<p>No activities recorded.</p>';
                }


                if ($row['student_signature']) {
                    echo '<p><strong>Student Signature:</strong> <img src="uploads/' . $row['student_signature'] . '" alt="Student Signature" style="width: 100px; height: auto;"></p>';
                }

                
                    // Display supervisor name and HI number with date on the far end

                if ($row['supervisor_signature']) {
                    echo '<p><strong>Supervisor Signature:</strong> <img src="uploads/' . $row['supervisor_signature'] . '" alt="Supervisor Signature" style="width: 100px; height: auto;"></p>';
                
                    // Display supervisor name and HI number with date on the far end
                    if ($row['supervisor_name']) {
                        echo '<p><strong>Supervisor Name:</strong> ' . htmlspecialchars($row['supervisor_name']) . '<span style="float: right;">' . htmlspecialchars($row['signature_date']) . '</span></p>';
                    }
                
                    if ($row['supervisor_hi_number']) {
                        echo '<p><strong>Supervisor HI Number:</strong> ' . htmlspecialchars($row['supervisor_hi_number']) . '<span style="float: right;">' . htmlspecialchars($row['signature_date']) . '</span></p>';
                    }
                
                } else {
                    // Display the form if the supervisor's signature is not present
                    echo '
                        <form action="verify_logsheet.php" method="post" enctype="multipart/form-data">
                            <input type="hidden" name="logsheet_id" value="' . $row['id'] . '">
                            
                            <div class="form-group">
                                <label for="supervisor_name">Supervisor Name:</label>
                                <input type="text" class="form-control" name="supervisor_name" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="supervisor_hi_number">Supervisor HI Number:</label>
                                <input type="text" class="form-control" name="supervisor_hi_number" required>
                            </div>
                
                            <div class="form-group">
                                <label for="signature_date">Date:</label>
                                <input type="date" class="form-control" name="signature_date" required>
                            </div>
                
                            <div class="form-group">
                                <label for="supervisor_signature">Upload Supervisor Signature:</label>
                                <input type="file" class="form-control-file" name="supervisor_signature" accept="image/*" required>
                            </div>
                
                            <button type="submit" class="verify-button">Verify</button>
                        </form>';
                }
                

                if ($row['date_stamp']) {
                    echo '<p><strong>Date Stamp:</strong> <img src="uploads/' . $row['date_stamp'] . '" alt="Date Stamp" style="width: 100px; height: auto;"></p>';
                }

                
                echo '</div>';
                echo '</div>';
            }
        } else {
            echo '<p>No log sheets found.</p>';
        }
        

        // Close connection
        $conn->close();
        ?>

        
    </div>

    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.5.2/dist/umd/popper.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
</body>
</html>
