<?php

	/**
	 * String comparison API for AJAX use.
	 *
	 * WARNING:	Using any of the comparisons provided here is
	 * very likely to be slow. The STXT algorithm has a complexity of
	 * O((n*m)**3) without the percentage calculations; the TRGM
	 * algorithm I think has complexity O(3(n*m)**2). YOU HAVE BEEN WARNED.
	 */
	
	require_once($_SERVER["DOCUMENT_ROOT"] . "/blaze/base.php");
	
	$validation = validateToken($_POST["access_token"], $_SERVER["REMOTE_HOST"]);
	if($validation[0] !== 200) {
		http_response_code($validation[0]);
		echo json_encode(array("error_code" => $validation[1], "error_message" => $validation[2]));
		exit;
	}
	
	$text1 = $_POST["text1"];
	$text2 = $_POST["text2"];
	$algorithm = $_POST["algorithm"];
	
	if(!isset($text1) || !isset($text2)) {
		// #b.405/C: Not enough texts were provided for comparison.
		http_response_code(400);
		echo json_encode(array("error_code" => "b.405+C", "error_message" => "Not enough texts were provided for comparison."));
		exit;
	}
	
	if(!isset($algorithm)) {
		// #b.406/C: No algorithm specified.
		http_response_code(400);
		echo json_encode(array("error_code" => "b.406+C", "error_message" => "No algorithm specified."));
		exit;
	}
	
	function compute_similar_text($string1, $string2) {
		$distance = similar_text($string1, $string2);
		return strlen($string1) >= strlen($string2) ? ($distance / strlen($string1)) * 100 : ($distance / strlen($string2)) * 100;
	}
	
	function get_trigrams($string) {
		$split = explode(' ', $string);
		$chunks = array_chunk($split, 3);
		return array_map(function($chunk) { return implode(' ', $chunk); }, $chunks);
	}
	
	function compute_trigrams($string1, $string2) {
		$trigrams1 = get_trigrams($string1);
		$trigrams2 = get_trigrams($string2);
		$equal_trigrams = 0;
		for($i = 0; $i < count($trigrams1); $i++) {
			for($m = 0; $m < count($trigrams2); $m++) {
				if($trigrams1[i] == $trigrams2[m]) {
					$equal_trigrams++;
				}
			}
		}
		$divisor = strlen($string1);
		return count($trigrams1) >= count($trigrams2) ? ($equal_trigrams / count($trigrams1)) * 100 : 
			($equal_trigrams / (count($trigrams2) * $divisor)) * 100;
	}
	
	function compute_both($string1, $string2) {
		$stxt = compute_similar_text($string1, $string2);
		$trgm = compute_trigrams($string1, $string2);
		return (($stxt + $trgm) / 2) * 100;
	}
	
	if($algorithm == "STXT") {
		// Use the similar text algorithm to calculate a percentage similarity.
		echo json_encode(array("algorithm" => "STXT", "algorithm_description" => "Use the similar text algorithm to calculate a percentage similarity.", "result" => compute_similar_text($text1, $text2)));
		exit;
	}
	else if($algorithm == "TRGM") {
		// Use trigrams to compute a distance value in percent.
		echo json_encode(array("algorithm" => "TRGM", "algorithm_description" => "Use trigrams to compute a distance value in percent.","result" => compute_trigrams($text1, $text2)));
		exit;
	}
	else if($algorithm == "STXT+TRGM") {
		// Use an average value computed from both algorithms.
		echo json_encode(array("algorithm" => "STXT+TRGM", "algorithm_description" => "Use an average value computed from both algorithms.", "result" => compute_both($text1, $text2)));
		exit;
	}
	else {
		// #b.407/C: Invalid algorithm specified.
		http_response_code(400);
		echo json_encode(array("error_code" => "b.407+C", "error_message" => "Invalid algorithm specified."));
		exit;
	}
	
?>