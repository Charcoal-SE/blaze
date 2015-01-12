<?php
include 'base.php';

if (!$_SESSION['Blaze_LoggedIn'])
{
	echo 'you shall not pass';
	return;
}

$post_id = $_POST["id"];
$site = $_POST["site"];
$body = $_POST["body"];

$db = PDODatabaseObject();
$stmt = $db->prepare('SELECT COUNT(*) FROM flags WHERE postUrl=:url');
$stmt->execute(array(":url" => $site . $post_id));
if ($stmt->fetchColumn() > 0)
{
	echo "already flagged";
	return;
}
if (preg_match("/[0-9]+/", $post_id) < 1)
{
	echo "PostId is messed up";
	return;
}

$url = "https://api.stackexchange.com/2.2/posts/" . $post_id . "?order=desc&sort=activity&site=" . $site;

$options = array(
	CURLOPT_URL => $url,
	CURLOPT_RETURNTRANSFER => TRUE,
	CURLOPT_ENCODING => 'identity'
);

$ch = curl_init();
curl_setopt_array($ch, $options);
if(!$result = curl_exec($ch))
{
        echo "could not fetch from API";
        return;
}
curl_close($ch);

$json = json_decode($result, true);
if (!is_null($json["error_message"]))
{
	echo "API gave error: " . $json["error_message"];
	return;
}
$link = $json["items"][0]["link"];
$type = $json["items"][0]["post_type"];
$stmt = $db->prepare("INSERT INTO flags(postUrl, body) VALUES(:postUrl, :body)");
$stmt->execute(array(':postUrl' => $site . $post_id, ':body' => $body));

echo exec("python report.py '" . $type . " flagged by " . escapeshellarg($_SESSION['Blaze_Username']) . ": " . escapeshellarg($link) . "' '" . SEChatUsername() . "' '" . SEChatPassword() . "'");
