<?php
include 'base.php';

$db = PDODatabaseObject();

$password = md5($_POST["password"]);
$username = $_POST["username"];
$email = $_POST["email"];

$stmt = $db->prepare("SELECT * FROM users WHERE username=:username OR email:=email");
$stmt->execute(array(':username' => $username, ':email' => $email));
$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

if (count($rows) > 0)
{
	echo 'username or email already taken.';
	return;
}

$stmt = $db->prepare("INSERT INTO users(username,email,password) VALUES(:username,:email,:password)");
$stmt->execute(array(':username' => $username, ':email' => $email, ':password' => $password));
$affected_rows = $stmt->rowCount();

if ($affected_rows == 1) echo 'success';
else echo 'something weird went wrong';