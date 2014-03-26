<?php
	include 'config.php';

	session_start();

	function PDODatabaseObject()
	{
		$dbhost = MySQLHost(); // this will ususally be 'localhost', but can sometimes differ  
		$dbname = MySQLDB(); // the name of the database that you are going to use for this project  
		$dbuser = MySQLUsername(); // the username that you created, or were given, to access your database  
		$dbpass = MySQLPassword(); // the password that you created, or were given, to access your database

		$db = new PDO('mysql:host=' . $dbhost . ';dbname=' . $dbname . ';charset=utf8', $dbuser, $dbpass);
		$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		return $db;
	}