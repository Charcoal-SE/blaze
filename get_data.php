<?php
	
	require_once($_SERVER["DOCUMENT_ROOT"] . "/blaze/base.php");
	
	$validation = validateToken($_POST["access_token"], $_SERVER["REMOTE_HOST"]);
	if($validation[0] !== 200) {
		http_response_code($validation[0]);
		echo json_encode(array("error_code" => $validation[1], "error_message" => $validation[2]));
		exit;
	}
	
	$conn = get_db_connection();
	
	$pagesize = isset($_POST["pagesize"]) ? $_POST["pagesize"] :
		(isset($_GET["pagesize"]) ? $_GET["pagesize"] : 1000);
	if(!isset($pagesize) || $pagesize == '') {
		$pagesize = 1000;
	}
	
	if($result = mysqli_query($conn, 'SELECT * FROM Posts LIMIT ' . $pagesize . ';')) {
		$items = array();
		while($row = $result->fetch_assoc()) {
			array_push($items, array('post_id' => $row['Id'], 'creation_date' => $row['InsertDate'], 'post_text' => $row['PostText']));
		}
		echo json_encode(array('message' => 'Retrieval query succeeded.', 'items' => $items));
		exit;
	}
	else {
		// #b.503/S: Retrieval query didn't complete.
		http_response_code(500);
		echo json_encode(array('error_code' => 'b.503+S', 'error_message' => "Retrieval query didn't complete.", 'details' => mysqli_error($conn)));
		exit;
	}
	
?>