<?php
	include 'base.php';
	$_SESSION = array();
	session_destroy();

	echo 'logged out';