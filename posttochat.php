<?php
include 'config.php';
$question_url = $_POST["url"];
echo exec("python SmokeDetector/report.py 'answer flagged: " . escapeshellarg($question_url) . "' '" . SEChatUsername() . "' '" . SEChatPassword() . "'");
