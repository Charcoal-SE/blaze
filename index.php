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
    <script src="script.js"></script>
    <style>
      img {max-width:100%;}
      .navbar .navbar-nav {display: inline-block;float: none;}
      .navbar .navbar-collapse {text-align: center;}
    </style>
  </head>
  <body>
  <nav class="navbar navbar-default" role="navigation" style="display:none">
    <div class="container-fluid">
      <!-- Brand and toggle get grouped for better mobile display -->
      <div class="navbar-header">
        <a class="navbar-brand" href="#"><span class="glyphicon glyphicon-fire" style="color:orange"></span> Blaze</a>
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
  <div class='blaze-header'>
    <div class="text-center" style="color:orange; font-size:90px; margin-top:20px"><span class="glyphicon glyphicon-fire"></span></div>
    <h1 class='text-center blaze-go-home'>Blaze</h1>
    <br />
    <br />
  </div>
  <div class="container site-api-key-form" style="max-width:320px;">
    <input type="text" class="form-control" id="blaze-api-key-field" placeholder="Site API name" style="text-align:center">
    <br />
    <!-- <button type="submit" class="btn btn-primary blaze-fetch-items button" style="width:100%">Fetch Answers</button> -->
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
      </ul>
    </div>
  </div>

  <table class="col-md-offset-2">
    <tr>

    </tr>
  </table>

    <!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->

    <script src="//netdna.bootstrapcdn.com/bootstrap/3.1.1/js/bootstrap.min.js"></script>
  </body>
</html>
