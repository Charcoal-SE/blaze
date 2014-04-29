<?php
include 'base.php';

if (!$_SESSION['Blaze_LoggedIn'])
{
	echo 'you shall not pass';
	return;
}


$question_url = $_POST["url"];
$body = $_POST["body"];

$db = PDODatabaseObject();
$stmt = $db->prepare('SELECT COUNT(*) FROM flags WHERE postUrl=:url');
$stmt->execute(array(":url" => $question_url));
if ($stmt->fetchColumn() > 0)
{
	echo "already flagged";
	return;
}
$stmt = $db->prepare("INSERT INTO flags(postUrl, body) VALUES(:postUrl, :body)");
$stmt->execute(array(':postUrl' => $question_url, ':body' => $body));

echo exec("python report.py 'answer flagged by " . escapeshellarg($_SESSION['Blaze_Username']) . ": " . escapeshellarg($question_url) . "' '" . SEChatUsername() . "' '" . SEChatPassword() . "'");
