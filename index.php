<?php include "base.php";?>
<!DOCTYPE html>
<html lang="en">
  <head>

    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Blaze</title>

    <!-- Bootstrap -->
    <link rel="stylesheet" href="//netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css">

    <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
      <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>
    <script src="moment.min.js"></script>
    <script src="livestamp.min.js"></script>

    <script type="text/javascript">var isLoggedIn=<?php echo (isset($_SESSION['Blaze_LoggedIn'])) ? 'true' : 'false';?></script>

    <script src="script.js"></script>
    <link rel="stylesheet" href="//code.jquery.com/ui/1.10.4/themes/smoothness/jquery-ui.css">
    <script src="//code.jquery.com/ui/1.10.4/jquery-ui.js"></script>
    <style>
      img {max-width:100%;}
      html, body {height: 100%;}
      #wrap {min-height: 100%;height: auto;margin: 0 auto -50px;padding: 0 0 50px;}
      #footer {height: 50px;background-color: clear; border-top:1px dashed rgba(0,0,0,0.2);}
      .navbar .navbar-nav {display: inline-block;float: none;}
      .navbar .navbar-collapse {text-align: center;}
      .flag-button:hover {background-color:red; color: white}
      #ui-id-1{font-family: "Helvetica Neue",Helvetica,Arial,sans-serif;}
      .ui-state-focus {color:white !important; background:rgb(47,118,192) !important; border:none !important}
      .autorefresh-option.chosen {color:orange}
      code {white-space: pre-wrap; white-space: -moz-pre-wrap;white-space: -pre-wrap;white-space: -o-pre-wrap;word-wrap: break-word;}
    </style>
  </head>
  <body>
    <nav class="navbar navbar-default" role="navigation" style="display:none">
      <div class="container-fluid">
        <!-- Brand and toggle get grouped for better mobile display -->
        <div class="navbar-header">
          <a class="navbar-brand blaze-logo" href="#"><span class="glyphicon glyphicon-fire" style="color:orange"></span> Blaze</a>
        </div>
        <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
          <ul class="nav navbar-nav">
            <li class="dropdown">
              <a href="#" class="dropdown-toggle" data-toggle="dropdown"><span class="glyphicon glyphicon-screenshot"></span> Auto Refresh <b class="caret"></b></a>
              <ul class="dropdown-menu" style="text-align:left">
                <li><a class="autorefresh-option chosen" href="#" id="autorefresh-none">None</a></li>
                <li><a class="autorefresh-option" href="#" id="autorefresh-10-seconds">10 seconds</a></li>
                <li><a class="autorefresh-option" href="#" id="autorefresh-30-seconds">30 seconds</a></li>
              </ul>
            </li>
            <li><a href="#" class="refresh-current-data-button"><span class="glyphicon glyphicon-refresh"></span> Refresh</a></li>
            <li class="dropdown">
              <a href="#" class="dropdown-toggle" data-toggle="dropdown"><span class="glyphicon glyphicon-sort"></span> Sort <b class="caret"></b></a>
              <ul class="dropdown-menu" style="text-align:left">
                <li><a href="#" id="sort-by-newest-creation">Newest</a></li>
                <li><a href="#" id="sort-by-shortest-length">Shortest*</a></li>
                <li class="divider"></li>
                <li class="disabled"><a href="#">* in this batch</a></li>
              </ul>
            </li>
            <?php
            if (!empty($_SESSION['Blaze_LoggedIn']) && !empty($_SESSION['Blaze_Username']))
            {
            ?>
            <li class="dropdown">
              <a href="#" class="dropdown-toggle" data-toggle="dropdown" id="blaze-navbar-username"><span class="glyphicon glyphicon-user"></span> <?php echo $_SESSION['Blaze_Username']; ?> <b class="caret"></b></a>
              <ul class="dropdown-menu" style="text-align:left">
                <li><a href="#" id="blaze-log-out"><span class="glyphicon glyphicon-arrow-left"></span> Log out</a></li>
                <!-- <li><a href="#" id="blaze-change-password"><span class="glyphicon glyphicon-lock"></span> Change Password</a></li> -->
              </ul>
            </li>
            <?php
            }
            else
            {
              ?>
              <li><a href="#" class="show-login-modal-button" data-toggle="modal" data-target="#loginModal"><span class="glyphicon glyphicon-user"></span> Login</a></li>

              <div class="modal fade" id="loginModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                  <div class="modal-content">
                    <div class="modal-header">
                      <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                      <ul class="nav nav-tabs" id="blaze-login-signup-tabs" style="margin-bottom:-16px">
                        <li class="active"><a href="#blaze-login-tab" data-toggle="tab">Log in</a></li>
                        <li><a href="#blaze-signup-tab" data-toggle="tab">Sign up</a></li>
                        <li><a href="#blaze-forgot-password-tab" data-toggle="tab">Forgot password?</a></li>
                      </ul>
                    </div>
                    <div class="modal-body">
                      <!-- Tab panes -->
                      <div class="tab-content">
                        <div class="tab-pane active" id="blaze-login-tab">
                          <input type="text" class="form-control" id="blaze-login-username-field" placeholder="Username" style="text-align:center">
                          <br />
                          <input type="password" class="form-control" id="blaze-login-password-field" placeholder="Password" style="text-align:center">
                        </div>
                        <div class="tab-pane" id="blaze-signup-tab">
                          <input type="text" class="form-control" id="blaze-login-username-signup-field" placeholder="Username" style="text-align:center">
                          <br />
                          <input type="password" class="form-control" id="blaze-login-password-signup-field" placeholder="Password" style="text-align:center">
                          <br />
                          <input type="password" class="form-control" id="blaze-login-password-confirm-signup-field" placeholder="Password (again)" style="text-align:center">
                          <br />
                          <input type="email" class="form-control" id="blaze-login-email-signup-field" placeholder="Email address" style="text-align:center">
                        </div>
                        <div class="tab-pane" id="blaze-forgot-password-tab">
                          <input type="text" class="form-control" id="blaze-username-forgot-password-field" placeholder="Username" style="text-align:center">
                        </div>
                      </div>
                    </div>
                    <div class="modal-footer">
                      <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                      <button type="button" class="btn btn-success" id="blaze-log-in-button">Submit</button>
                    </div>
                  </div><!-- /.modal-content -->
                </div><!-- /.modal-dialog -->
              </div><!-- /.modal -->
              <?php
            }
            ?>
            <li><a href="#" class="authenticate-user-button"><span class="glyphicon glyphicon-lock"></span> Authenticate</a></li>
          </ul>
        </div><!-- /.navbar-collapse -->
    </nav>
    <div class="modal fade" id="flag_modal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
            <h4 class="modal-title">I am flagging this answer because...</h4>
          </div>
          <div class="modal-body">
            <form action="" id="flag_options_form">

            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-danger" id="modal-flag-answer-button">Flag</button>
          </div>
        </div><!-- /.modal-content -->
      </div><!-- /.modal-dialog -->
    </div><!-- /.modal -->
    <div id="wrap"><div class="container">
    <div class='blaze-header'>
      <div class="text-center" style="color:orange; font-size:90px; margin-top:20px"><span class="glyphicon glyphicon-fire"></span></div>
      <h1 class='text-center blaze-go-home'>Blaze</h1>
      <br />
      <br />
    </div>
    <div class="container site-api-key-form" style="max-width:320px;">
      <input type="text" class="form-control" id="blaze-api-key-field" placeholder="Site API name" style="text-align:center">
      <br />
      <div class="btn-group" style="width:100%">
        <button type="submit" class="btn btn-primary blaze-fetch-items" style="width:85%">Fetch Answers</button>
        <button type="button" class="btn btn-primary dropdown-toggle" style="width:15%" data-toggle="dropdown">
          <span class="caret"></span>
          <span class="sr-only">Choose Data</span>
        </button>
        <ul class="dropdown-menu" role="menu" style='width:100%'>
          <li class="disabled"><a href="#">Data to grab:</a></li>
          <li class="divider"></li>
          <li><a href="javascript:void(0)" id="select-answers">Answers</a></li>
          <li><a href="javascript:void(0)" id="select-questions">Questions</a></li>
          <li><a href="javascript:void(0)" id="select-comments">Comments</a></li>
          <li><a href="javascript:void(0)" id="select-users">Users</a></li>
        </ul>
      </div>
      <h5>Common</h5>
      <table>
        <tr>
          <td><a href="#" class="choose-site-stackoverflow">Stack Overflow</a></td>
        </tr>
        <tr>
          <td><a href="#" class="choose-site-serverfault">Server Fault</a></td>
        </tr>
        <tr>
          <td><a href="#" class="choose-site-superuser">Super User</a></td>
        </tr>
        <tr>
          <td><a href="#" class="choose-site-softwarerecs">Software Recommendations</a></td>
        </tr>
      </table>
    </div>

    <table class="col-md-offset-2" id="datatable">
    </table>
  </div></div>

    <div id="footer">
      <div class="container text-center" style="padding-top:10px; color:rgba(0,0,0,0.6)">
        <span>Made with &lt;3 by <a href='http://chat.stackexchange.com/rooms/11540/charcoal-hq' target='_blank'>The Charcoal Team</a> using <a href='http://getbootstrap.com/' tagert='_blank'>Bootstrap</a>, <a href="http://momentjs.com/">Moment.js</a>, and <a href="http://mattbradley.github.io/livestampjs/">Livestamp.js</a>. And some awesome <a href="http://glyphicons.com/">Glyphicons</a>. <?php
        if (!empty($_SESSION['Blaze_LoggedIn']) && !empty($_SESSION['Blaze_Username'])) echo "Logged in.";
        ?></span>
      </div>
    </div>

    <!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
    <script src="//netdna.bootstrapcdn.com/bootstrap/3.1.1/js/bootstrap.min.js"></script>
  </body>
</html>
