<?php
session_start();
include 'db.php';
include 'header.php';
include 'footer.php';

// Enable error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Check if the user is logged in
if (!isset($_SESSION['user_id'])) {
    header("Location: ../login.html");
    exit();
}

// Get the user's role from the session
$role = isset($_SESSION['role']) ? $_SESSION['role'] : '';

// Ensure user has a valid role
if ($role !== 'student' && $role !== 'supervisor') {
    header("Location: ../login.html");
    exit();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard</title>
    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
    <link href="../css/styles.css" rel="stylesheet">
    <link rel="stylesheet" href="./index.css" />
    <style>
        body {
            background-color: #f8f9fa;
            h3{
                font-weight: bolder;
                text-align: center;
            }

        }

        .submit-button {
            width: 30%;
            margin: 1rem auto;
            display: block;
        }
        .form-group input[type="number"] {
            width: auto;
            display: inline-block;
        }
        .form-container {
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem;
        }
        .form-group {
            margin-bottom: 1rem;
        }
        .form-group label {
            font-weight: bold;
        }
        .empty-square {
            width: 60px;
            height: 30px;
            border: 1px solid #ddd;
            background-color: #f8f9fa;
            display: inline-block;
            margin-right: 1rem;
        }
        .form-inline-section {
            display: flex;
            align-items: center;
        }
        .form-inline-section button {
            margin-left: 1rem;
        }
        .card {
            margin-bottom: 1rem;
        }
        .centered-container {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;

        }
        .activities-row .form-check {
            display: flex;
            align-items: center;
        }
        .activities-row .form-check input[type="number"] {
            width: 90px;
            margin-left: 10px;
        }
    </style>
</head>
<body>
 
    <!-- Header -->
    <div id="header"></div>
        <div class="container mt-4">
            <h1 class="text-center mb-4">Dashboard</h1>

            <?php if ($role == 'student') { ?>
                <h2 class="text-center">Daily Log Sheet</h2>
                <p class="text-center">Instruction: Details below must be completed per each activity undertaken by the student each day and verified by the instructor.</p>

                <form action="logsheet.php" method="post" enctype="multipart/form-data">
                    <!-- Date field -->
                    <div class="form-group">
                        <label for="date">Date:</label>
                        <input type="date" class="form-control" id="date" name="date" required style="width: 28%;">
                    </div>

                    <!-- Activity section -->
                    <h3>WIL Activities Conducted</h3>
                    <p class="text-center">Please tick the activities conducted and indicate how many hours per each activity.</p>

                <!-- Row 1 -->
                <div class="row activities-row mb-3">
                    <div class="col-md-6">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" name="activity[]" value="Food control" id="foodControl">
                            <label class="form-check-label" for="foodControl">Food control</label>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <input type="number" class="form-control" name="hours_foodControl" placeholder="Hours" min="0">
                    </div>
                </div>

                <!-- Row 2 -->
                <div class="row activities-row mb-3">
                    <div class="col-md-6">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" name="activity[]" value="Monitoring water quality" id="waterQuality">
                            <label class="form-check-label" for="waterQuality">Monitoring water quality</label>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <input type="number" class="form-control" name="hours_waterQuality" placeholder="Hours" min="0">
                    </div>
                </div>

                <!-- Row 3 -->
                <div class="row activities-row mb-3">
                    <div class="col-md-6">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" name="activity[]" value="Waste management" id="wasteManagement">
                            <label class="form-check-label" for="wasteManagement">Waste management</label>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <input type="number" class="form-control" name="hours_wasteManagement" placeholder="Hours" min="0">
                    </div>
                </div>

                <!-- Row 4 -->
                <div class="row activities-row mb-3">
                    <div class="col-md-6">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" name="activity[]" value="Site inspections" id="siteInspections">
                            <label class="form-check-label" for="siteInspections">Site inspections</label>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <input type="number" class="form-control" name="hours_siteInspections" placeholder="Hours" min="0">
                    </div>
                </div>

                <!-- Row 5 -->
                <div class="row activities-row mb-3">
                    <div class="col-md-6">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" name="activity[]" value="Data analysis" id="dataAnalysis">
                            <label class="form-check-label" for="dataAnalysis">Data analysis</label>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <input type="number" class="form-control" name="hours_dataAnalysis" placeholder="Hours" min="0">
                    </div>
                </div>

                <!-- Row 6 -->
                <div class="row activities-row mb-3">
                    <div class="col-md-6">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" name="activity[]" value="Training sessions" id="trainingSessions">
                            <label class="form-check-label" for="trainingSessions">Training sessions</label>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <input type="number" class="form-control" name="hours_trainingSessions" placeholder="Hours" min="0">
                    </div>
                </div>

                <!-- Row 1 -->
                <div class="row activities-row mb-3">
                    <div class="col-md-6">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" name="activity[]" value="Health surveillance of premises" id="Healthsurveillance">
                            <label class="form-check-label" for="Healthsurveillance">Health surveillance of premises </label>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <input type="number" class="form-control" name="hours_Healthsurveillance" placeholder="Hours" min="0">
                    </div>
                </div>

                <!-- Row 2 -->
                <div class="row activities-row mb-3">
                    <div class="col-md-6">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" name="activity[]" value="Surveillance & prevention of communicable diseases" id="communicablediseases">
                            <label class="form-check-label" for="communicablediseases">Surveillance & prevention of communicable diseases and Malaria control</label>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <input type="number" class="form-control" name="hours_communicablediseases" placeholder="Hours" min="0">
                    </div>
                </div>

                <!-- Row 3 -->
                <div class="row activities-row mb-3">
                    <div class="col-md-6">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" name="activity[]" value="monitoring of hazardous substances" id="hazardoussubstances">
                            <label class="form-check-label" for="hazardoussubstancest">Control & monitoring of hazardous substances </label>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <input type="number" class="form-control" name="hours_hazardoussubstancest" placeholder="Hours" min="0">
                    </div>
                </div>

                <!-- Row 4 -->
                <div class="row activities-row mb-3">
                    <div class="col-md-6">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" name="activity[]" value="General hygiene monitoring " id="General hygienemonitoring ">
                            <label class="form-check-label" for="hygienemonitoring ">General hygiene monitoring</label>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <input type="number" class="form-control" name="hours_hygienemonitoring h" placeholder="Hours" min="0">
                    </div>
                </div>

                <!-- Row 5 -->
                <div class="row activities-row mb-3">
                    <div class="col-md-6">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" name="activity[]" value="Vectorcontrol monitoringn" id="Vectorcontrol">
                            <label class="form-check-label" for="Vector control">Vector control monitoringn</label>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <input type="number" class="form-control" name="hours_Vectorcontrol" placeholder="Hours" min="0">
                    </div>
                </div>

                <!-- Row 6 -->
                <div class="row activities-row mb-3">
                    <div class="col-md-6">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" name="activity[]" value="Chemical safety " id="Chemicalsafety ">
                            <label class="form-check-label" for="Chemicalsafety">Chemical safety </label>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <input type="number" class="form-control" name="hours_Chemicalsafety" placeholder="Hours" min="0">
                    </div>
                </div>


                <!-- Row 7 -->
                <div class="row activities-row mb-3">
                    <div class="col-md-6">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" name="activity[]" value="Noise control Hour" id="Noisecontrol">
                            <label class="form-check-label" for="Noisecontrol">Noise control Hour</label>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <input type="number" class="form-control" name="hours_Noisecontrol" placeholder="Hours" min="0">
                    </div>
                </div>

                <!-- Row 8 -->
                <div class="row activities-row mb-3">
                    <div class="col-md-6">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" name="activity[]" value="Environmental pollution control" id="pollutioncontrol">
                            <label class="form-check-label" for="pollutioncontrol">Environmental pollution control</label>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <input type="number" class="form-control" name="hours_pollutioncontrol" placeholder="Hours" min="0">
                    </div>
                </div>


                <!-- Row 7 -->
                <div class="row activities-row mb-3">
                    <div class="col-md-6">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" name="activity[]" value="Port health" id="Porthealth">
                            <label class="form-check-label" for="Port health">Port health</label>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <input type="number" class="form-control" name="hours_Port health" placeholder="Hours" min="0">
                    </div>
                </div>

                <!-- Row 8 -->
                <div class="row activities-row mb-3">
                    <div class="col-md-6">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" name="activity[]" value="Health surveillance of premises" id="Healthsurveillancel">
                            <label class="form-check-label" for="Healthsurveillancel">Health surveillance of premises</label>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <input type="number" class="form-control" name="hours_Healthsurveillancel" placeholder="Hours" min="0">
                    </div>
                </div>

                <!-- Row 9 -->
                <div class="row activities-row mb-3">
                    <div class="col-md-6">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" name="activity[]" value="Radiation monitoring and control" id="Radiation monitoring">
                            <label class="form-check-label" for="Radiation monitoring">Radiation monitoring and control</label>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <input type="number" class="form-control" name="hours_Radiation monitoring" placeholder="Hours" min="0">
                    </div>
                </div>

                <!-- Row 10 -->
                <div class="row activities-row mb-3">
                    <div class="col-md-6">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" name="activity[]" value="Administration" id="administration">
                            <label class="form-check-label" for="administration"> Administration</label>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <input type="number" class="form-control" name="hours_administration" placeholder="Hours" min="0">
                    </div>
                </div>
            </div>


                    <!-- Description and reflection section -->
            <
            <div class="container form-container">
                <div class="form-section">
                    <h3>Description of WIL Activities Conducted</h3>
                    <div class="form-group">
                        <label for="description">Reflect on the most significant events:</label>
                        <textarea class="form-control" id="description" name="description" rows="4" required></textarea>
                    </div>
                    <div class="form-group">
                        <label for="situation">Describe the situation: What happened?</label>
                        <textarea class="form-control" id="situation" name="situation" rows="4" required></textarea>
                    </div>
                    <div class="form-group">
                        <label for="evaluation">Evaluate the situation: Why was this event significant?</label>
                        <textarea class="form-control" id="evaluation" name="evaluation" rows="4" required></textarea>
                    </div>
                    <div class="form-group">
                        <label for="interpretation">Interpret the situation: What did you learn?</label>
                        <textarea class="form-control" id="interpretation" name="interpretation" rows="4" required></textarea>
                    </div>
                </div>
            </div>

                    <!-- Signatures section -->
                <!--    <div class="container form-container">  -->
        <h3 style="padding-bottom: 40px">Signatures</h3>
        <div class="row" >
            <div class="col-md-4 form-group" style="padding-left:50px">
                <label for="student_signature">Student Signature:</label>
                <div class="d-flex align-items-center">
                    <div class="empty-square mr-2"></div>
                    <input type="file" class="form-control-file" id="student_signature" name="student_signature" accept="image/*" >
                </div>
            </div>
            <div class="col-md-4 form-group" style="text-align:center">
                <label for="supervisor_signature">Supervisor/EHP Signature:</label>
                <div class="d-flex align-items-center">
                    <div class="empty-square mr-2"></div>
                    <input type="file" class="form-control-file" id="supervisor_signature" name="supervisor_signature" accept="image/*" disabled>
                </div>
            </div>
            <div class="col-md-4 form-group">
                <label for="date_stamp" >Date Stamp:</label>
                <div class="d-flex align-items-center">
                    <div class="empty-square mr-2"></div>
                    <input type="file" class="form-control-file" id="date_stamp" name="date_stamp" accept="image/*" disabled>
                </div>
            </div>
        </div>
        <h5 style="padding-bottom: 10px; text-align:center">Upload as Image</h5>
         <!--   </div>  -->

                    <!-- Submit button -->
                    <button type="submit" class="btn btn-primary submit-button">Submit</button>
                </form>
            <?php } else if ($role == 'supervisor') { ?>
                <h2 class="text-center">All Log Sheets</h2>
                <div id="logSheetsTable" class="mt-4"></div>

                

                <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
                <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.5.2/dist/umd/popper.min.js"></script>
                <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
                <script>
                    $(document).ready(function() {
                        fetchLogSheets();
                    });

                    function fetchLogSheets() {
                        fetch('php/fetch_logs.php')
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error('Network response was not ok');
                                }
                                return response.json();
                            })
                            .then(data => {
                                let html = '<table class="table table-striped"><thead><tr><th>Student ID</th><th>Date</th><th>Details</th></tr></thead><tbody>';
                                if (Array.isArray(data) && data.length > 0) {
                                    data.forEach(log => {
                                        html += `<tr><td>${log.student_id}</td><td>${log.date}</td><td>${log.details}</td></tr>`;
                                    });
                                } else {
                                    html += '<tr><td colspan="3">No log sheets available.</td></tr>';
                                }
                                html += '</tbody></table>';
                                document.getElementById('logSheetsTable').innerHTML = html;
                            })
                            .catch(error => {
                                console.error('Error:', error);
                                document.getElementById('logSheetsTable').innerHTML = '<p>Unable to fetch log sheets.</p>';
                            });
                    }

                    function loadHTML(elementId, url) {
                        fetch(url)
                            .then(response => response.text())
                            .then(data => {
                                document.getElementById(elementId).innerHTML = data;
                            })
                            .catch(error => console.log('Error loading file:', error));
                    }

                    // Load header and footer
                    loadHTML('header', 'header.html');
                    loadHTML('footer', 'footer.html');
                </script>
            <?php } ?>
        </div>

        <div id="footer" style="padding-top: 10px"></div>
    </div>
</body>
</html>
