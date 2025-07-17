<?php
require 'db_connect.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = $conn->real_escape_string($_POST['name']);
    $email = $conn->real_escape_string($_POST['email']);
    $message = $conn->real_escape_string($_POST['message']);

    $sql = "INSERT INTO messages (name, email, message) VALUES ('$name', '$email', '$message')";

    if ($conn->query($sql)) {
        header("Location: ../feedback.php?success=1"); // Успешно
    } else {
        header("Location: ../feedback.php?error=1");   // Ошибка
    }
    $conn->close();
}
?>