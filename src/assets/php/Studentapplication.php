<?php
include 'db.php';

// Collect form data
$title = $_POST['title'];
$initials = $_POST['initials'];
$surname = $_POST['surname'];
$first_names = $_POST['first_names'];

$student_no = $_POST['student_no'];
$level_of_study = $_POST['level_of_study'];
$race = $_POST['race'];
$gender = $_POST['gender'];
$email_address = $_POST['email_address'];
$physical_address = $_POST['physical_address'];

$cell_phone_number = $_POST['cell_phone_number'];
$home_town = $_POST['home_town'];
$institution_name = $_POST['institution_name'];
$town_situated = $_POST['town_situated'];
$contact_person = $_POST['contact_person'];

$contact_email = $_POST['contact_email'];
$telephone_number = $_POST['telephone_number'];
$cell_phone = $_POST['cell_phone'];
$declaration_info_1 = isset($_POST['declaration_info_1']) ? 1 : 0;
$declaration_info_2 = isset($_POST['declaration_info_2']) ? 1 : 0;
$declaration_info_3 = isset($_POST['declaration_info_3']) ? 1 : 0;

// File uploads
$signature_image = $_FILES['signature_image']['name'];
$id_document = $_FILES['id_document']['name'];
$cv_document = $_FILES['cv_document']['name'];

// Move uploaded files to a directory (e.g., uploads/)
move_uploaded_file($_FILES['signature_image']['tmp_name'], 'uploads/' . $signature_image);
move_uploaded_file($_FILES['id_document']['tmp_name'], 'uploads/' . $id_document);
move_uploaded_file($_FILES['cv_document']['tmp_name'], 'uploads/' . $cv_document);

// Prepare and execute SQL statement
$sql = "INSERT INTO student_application 
    (title, initials, surname, first_names, student_no, level_of_study, race, gender, email_address, physical_address, 
    cell_phone_number, home_town, institution_name, town_situated, contact_person, contact_email, telephone_number, 
    cell_phone, declaration_info_1, declaration_info_2, declaration_info_3, signature_image, id_document, 
    cv_document) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

if ($stmt = $conn->prepare($sql)) {
    $stmt->bind_param(
        "ssssssssssssssssssssssss", 
        $title, $initials, $surname, $first_names, $student_no, $level_of_study, $race, $gender, $email_address, 
        $physical_address, $cell_phone_number, $home_town, $institution_name, $town_situated, $contact_person, 
        $contact_email, $telephone_number, $cell_phone, $declaration_info_1, $declaration_info_2, $declaration_info_3, 
        $signature_image, $id_document, $cv_document
    );

    if ($stmt->execute()) {
        echo "New record created successfully";
    } else {
        echo "Error executing statement: " . $stmt->error;
    }

    $stmt->close();
} else {
    echo "Error preparing statement: " . $conn->error;
}

$conn->close();
?>
