<?php
include 'db.php';

// Fetch all records from the student_application table
$sql = "SELECT * FROM student_application";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    echo "<!DOCTYPE html>
    <html lang='en'>
    <head>
        <meta charset='UTF-8'>
        <meta name='viewport' content='width=device-width, initial-scale=1.0'>
        <title>Student Applications</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 20px;
            }
            table {
                width: 100%;
                border-collapse: collapse;
            }
            table, th, td {
                border: 1px solid black;
            }
            th, td {
                padding: 8px;
                text-align: left;
            }
            th {
                background-color: #f2f2f2;
            }
            td {
                background-color: #ffffff;
            }
            .centered {
                text-align: center;
            }
        </style>
    </head>
    <body>
        <h1 class='centered'>Student Applications</h1>
        <table>
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Initials</th>
                    <th>Surname</th>
                    <th>First Names</th>
                    <th>Student Number</th>
                    <th>Level of Study</th>
                    <th>Race</th>
                    <th>Gender</th>
                    <th>Email Address</th>
                    <th>Physical Address</th>
                    <th>Cell Phone Number</th>
                    <th>Home Town</th>
                    <th>Institution Name</th>
                    <th>Town Situated</th>
                    <th>Contact Person</th>
                    <th>Contact Email</th>
                    <th>Telephone Number</th>
                    <th>Cell Phone</th>
                    <th>Declaration Info 1</th>
                    <th>Declaration Info 2</th>
                    <th>Declaration Info 3</th>
                    <th>Signature Image</th>
                    <th>ID Document</th>
                    <th>CV Document</th>
                </tr>
            </thead>
            <tbody>";

    // Output data of each row
    while ($row = $result->fetch_assoc()) {
        echo "<tr>
                <td>{$row['title']}</td>
                <td>{$row['initials']}</td>
                <td>{$row['surname']}</td>
                <td>{$row['first_names']}</td>
                <td>{$row['student_no']}</td>
                <td>{$row['level_of_study']}</td>
                <td>{$row['race']}</td>
                <td>{$row['gender']}</td>
                <td>{$row['email_address']}</td>
                <td>{$row['physical_address']}</td>
                <td>{$row['cell_phone_number']}</td>
                <td>{$row['home_town']}</td>
                <td>{$row['institution_name']}</td>
                <td>{$row['town_situated']}</td>
                <td>{$row['contact_person']}</td>
                <td>{$row['contact_email']}</td>
                <td>{$row['telephone_number']}</td>
                <td>{$row['cell_phone']}</td>
                <td>" . ($row['declaration_info_1'] ? 'Yes' : 'No') . "</td>
                <td>" . ($row['declaration_info_2'] ? 'Yes' : 'No') . "</td>
                <td>" . ($row['declaration_info_3'] ? 'Yes' : 'No') . "</td>
                <td><a href='uploads/{$row['signature_image']}' target='_blank'>View</a></td>
                <td><a href='uploads/{$row['id_document']}' target='_blank'>View</a></td>
                <td><a href='uploads/{$row['cv_document']}' target='_blank'>View</a></td>
            </tr>";
    }

    echo "</tbody>
        </table>
    </body>
    </html>";
} else {
    echo "0 results";
}

$conn->close();
?>
