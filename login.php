<?php
	include 'base.php';

	$db = PDODatabaseObject(); // from base.php

	$username = $_POST["username"];
	$password = md5($_POST["password"]);

	$stmt = $db->prepare("SELECT * FROM users WHERE username=:username AND password=:password");
	$stmt->execute(array(':password' => $password, ':username' => $username));
	$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

	if (count($rows) == 1)
	{
		$_SESSION['Blaze_LoggedIn'] = YES;
		$_SESSION['Blaze_Username'] = $rows[0]['username'];
		echo 'logged in';
	}
	else
	{
		echo "User not in database.";
	}