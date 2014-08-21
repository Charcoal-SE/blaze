<?php
include 'base.php';

if (!$_SESSION['Blaze_LoggedIn'])
{
	echo 'you shall not pass';
	return;
}


$answer_id = $_POST["id"];
$site = $_POST["site"];
$body = $_POST["body"];

$db = PDODatabaseObject();
$stmt = $db->prepare('SELECT COUNT(*) FROM flags WHERE postUrl=:url');
$stmt->execute(array(":url" => $site . $answer_id));
if ($stmt->fetchColumn() > 0)
{
	echo "already flagged";
	return;
}
if (preg_match("/[0-9]+/", $answer_id) < 1)
{
	echo "error";
	return;
}

$url = "https://api.stackexchange.com/2.2/posts/" . $answer_id . "?order=desc&sort=activity&site=" . $site;
$options = array(
	'http' => array(
		'method' => 'GET'
	)
);
$context  = stream_context_create($options);
$result = @file_get_contents($url, false, $context);
if ($result === FALSE)
{
	echo "error";
	return;
}
$json = json_decode($result, true);
if (!is_null($json["error_message"]))
{
	echo "error";
	return;
}

$link = "http://" . $site . "/a/" . $answer_id;
$stmt = $db->prepare("INSERT INTO flags(postUrl, body) VALUES(:postUrl, :body)");
$stmt->execute(array(':postUrl' => $site . $answer_id, ':body' => $body));

echo exec("python report.py 'answer flagged by " . escapeshellarg($_SESSION['Blaze_Username']) . ": " . escapeshellarg($link) . "' '" . SEChatUsername() . "' '" . SEChatPassword() . "'");
