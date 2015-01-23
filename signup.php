<?php
include 'base.php';

$db = PDODatabaseObject();

$password = md5($_POST["password"]);
$username = $_POST["username"];
$email = $_POST["email"];

$count = $db->prepare("SELECT COUNT(*) FROM users WHERE username=:username OR email=:email");
$count->execute(array(':username' => $username, ':email' => $email));
$numofrows = $count->fetchColumn();

if ($numofrows > 0) {
    echo 'username or email already taken.';
    return;
}

$insertuser = $db->prepare("INSERT INTO users (username, email, password) VALUES(:username,:email,:password)");
$insertuser->execute(array(':username' => $username, ':email' => $email, ':password' => $password));
$affected_rows = $insertuser->rowCount();

if ($affected_rows == 1) echo 'success';
else echo 'something weird went wrong';
