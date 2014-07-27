<?php
include 'base.php';

if (isset($_POST["code"]) && !empty($_POST["code"]))
{
    if ($_POST["code"] == $_SESSION["recovery_code"])
    {
        if ($_POST["password"] == $_POST["repassword"])
        {
            $username = $_SESSION['Blaze_Recover_Password_Username'];
            $password = md5($_POST["password"]);
            
            $db = PDODatabaseObject();
            $stmt = $db->prepare("UPDATE users SET password=:password WHERE username=:username");
            $stmt->execute(array(':password' => $password, ':username' => $username));
            unset($_SESSION['Blaze_Recover_Password_Username']);
            unset($_SESSION['recovery_code']);
            ?>
<!DOCTYPE html>
<html lang="en">
<head>
  <title>Password successfully changed</title>
</head>
<body>
  <p>Your password is successfully changed.</p>
  <p><a href="/blaze">Return to Blaze</a></p>
</body>
</html>
<?php
        }
        else
        {
            writeRecoveryCodeHtml('The two passwords don\'t match.');
        }
    }
    else
    {
        writeRecoveryCodeHtml('The given recovery code is invalid.');
    }
}
else if (isset($_POST["username"]) && !empty($_POST["username"]))
{
    $username = $_POST["username"];
    $_SESSION["Blaze_Recover_Password_Username"] = $username;
    $db = PDODatabaseObject(); // from base.php
    
    $stmt = $db->prepare("SELECT email FROM users WHERE username=:username");
    $stmt->execute(array(':username' => $username));
    $rows = $stmt->fetchAll();
    if (count($rows) > 0)
    {
        $email = $rows[0]["email"];
        $subject = "Blaze password recovery";
        $recoveryCode = bin2hex(openssl_random_pseudo_bytes(32));
        $usernameHtmlEntities = htmlentities($username);
        require_once('ses.php');
          $ses = new SimpleEmailService(SESKey(), SESSecret());
          $m = new SimpleEmailServiceMessage();
          $m->addTo($email);
          $m->setFrom('blaze@erwaysoftware.com');
          $m->setSubject('Blaze Password Recovery');
          $m->setMessageFromString("This mail contains your requested Blaze recovery code: " . $recoveryCode);
          $ses->sendEmail($m);

          $_SESSION["recovery_code"] = $recoveryCode;
          echo "success";
    }
    else
    {
        echo "No user found.";
    }
}
else if (!isset($_SESSION['Blaze_Recover_Password_Username']) || empty($_SESSION['Blaze_Recover_Password_Username']) || !isset($_SESSION['recovery_code']) || empty($_SESSION['recovery_code']))
{
?>
<!DOCTYPE html>
<html>
<head>
  <title>Blaze password recovery</title>
</head>
<body>
Please request to recover your account before coming here. Go to <a href="/blaze">the index page</a>, click "Log in" and select the "Forgot password?" tab.
</body>
</html>
<?php
}
else 
{
    writeRecoveryCodeHtml('');
}
function writeRecoveryCodeHtml($errorMessage)
{?>
<!DOCTYPE html>
<html lang="en">
<head>
  <title>Blaze Password Recovery</title>
  <!-- Bootstrap -->
  <link rel="stylesheet" href="//netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css">
  <style type="text/css">
    .error { color: red; }
    body { margin: 25px 75px;}
  </style>
</head>
<body>
<?php if ($errorMessage !== '') { echo "<span class=\"error\">$errorMessage</span>"; } ?>
<form action="/blaze/recoverpassword.php" method="post">
  <input type="text" name="code" class="form-control" placeholder="Recovery code"><br />
  <input type="password" name="password" class="form-control" placeholder="New password"><br />
  <input type="password" name="repassword" class="form-control" placeholder="Re-enter new password"><br />
  <input type="submit" value="Submit" class="btn btn-default">
  </form>
</body>
</html>
<?php
}
?>