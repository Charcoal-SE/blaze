<?php

	require_once($_SERVER["DOCUMENT_ROOT"] . "/blaze/base.php");
	
	$validation = validateToken($_POST["access_token"], $_SERVER["REMOTE_HOST"]);
	if($validation[0] !== 200) {
		http_response_code($validation[0]);
		echo json_encode(array("error_code" => $validation[1], "error_message" => $validation[2]));
		exit;
	}
	
	$conn = get_db_connection();
	
	$post_text = mysqli_real_escape_string($conn, substr($_POST['post_text'], 0, 40000));
	
	if(!isset($_POST['post_text']) || $post_text == '') {
		// #b.404/C: No post text provided to add to database.
		http_response_code(400);
		echo json_encode(array('error_code' => 'b.404+C', 'error_message' => 'No post text provided to add to database.'));
		exit;
	}
	else {
		$result = mysqli_query($conn, 'INSERT INTO Posts VALUES (DEFAULT, DEFAULT, \'' . $post_text . '\');');
		if($result === false) {
			// #b.502/S: Insertion query didn't complete.
			http_response_code(500);
			echo json_encode(array('error_code' => 'b.502+S', 'error_message' => "Insertion query didn't complete.", 'details' => mysqli_error($conn)));
			exit;
		}
		else {
			echo json_encode(array('message' => 'Post data added to database.'));
			exit;
		}
	}
	
?>