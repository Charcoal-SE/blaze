<?php
include 'config.php';
echo exec("python SmokeDetector/report.py 'test' '" . SEChatUsername() . "' '" . SEChatPassword() . "'");
