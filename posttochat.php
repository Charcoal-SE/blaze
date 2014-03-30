<?php
include 'base.php';
$question_url = $_POST["url"];

$db = PDODatabaseObject();
$stmt = $db->prepare('SELECT * FROM flags WHERE postUrl=:url');
$stmt->execute(array(":url" => $question_url));
$results = $stmt->fetchAll(PDO::FETCH_ASSOC);
if (count($results) > 0)
{
	echo "already flagged";
	return;
}
$stmt = $db->prepare("INSERT INTO flags(postUrl) VALUES(:postUrl)");
$stmt->execute(array(':postUrl' => $question_url));

echo exec("python report.py 'answer flagged: " . escapeshellarg($question_url) . "' '" . SEChatUsername() . "' '" . SEChatPassword() . "'");
