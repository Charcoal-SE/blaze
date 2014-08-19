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
$link = "http://";

$site_list = array("stackoverflow", "meta.stackoverflow", "meta.stackexchange", "askubuntu", "meta.askubuntu",
	"mathoverflow", "meta.mathoverflow", "superuser", "meta.superuser", "serverfault", "meta.serverfault");

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
	echo "not a valid id";
	return;
}
if (in_array($site, $site_list))
{
	$link = $link . $site . ".com";
}
else
{
	$link = $link . $site . ".stackexchange.com";
}
$link = $link . "/a/" . $answer_id;
$stmt = $db->prepare("INSERT INTO flags(postUrl, body) VALUES(:postUrl, :body)");
$stmt->execute(array(':postUrl' => $site . $answer_id, ':body' => $body));

echo exec("python report.py 'answer flagged by " . escapeshellarg($_SESSION['Blaze_Username']) . ": " . escapeshellarg($link) . "' '" . SEChatUsername() . "' '" . SEChatPassword() . "'");
echo "success";
