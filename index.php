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
          </ul>
        </div><!-- /.navbar-collapse -->
    </nav>
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
          <li><a id="select-answers">Answers</a></li>
          <li><a id="select-questions">Questions</a></li>
          <li><a id="select-comments">Comments</a></li>
        </ul>
      </div>
    </div>

    <table class="col-md-offset-2">
    </table>
  </div></div>

    <div id="footer">
      <div class="container text-center" style="padding-top:10px; color:rgba(0,0,0,0.6)">
        <span>Made with &lt;3 by <a href='http://chat.stackexchange.com/rooms/11540/charcoal-hq' target='_blank'>The Charcoal Team</a> using <a href='http://getbootstrap.com/' tagert='_blank'>Bootstrap</a>, <a href="http://momentjs.com/">Moment.js</a>, and <a href="http://mattbradley.github.io/livestampjs/">Livestamp.js</a>. And some awesome <a href="http://glyphicons.com/">Glyphicons</a>.</span>
      </div>
    </div>

    <!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->

    <script src="//netdna.bootstrapcdn.com/bootstrap/3.1.1/js/bootstrap.min.js"></script>
  </body>
</html>
