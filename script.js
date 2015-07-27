if (typeof String.prototype.endsWith !== 'function') {
    String.prototype.endsWith = function(suffix) {
        return this.indexOf(suffix, this.length - suffix.length) !== -1;
    };
}

$(document).ready(function() {
	var apiEndpoint = "answers";
	var currentPage = 1;
	var pageSize = 100;
  	var autorefresh_time = 1000000000; //crazy long == no refresh, because I'm lazy
  	var autorefresh_timeout;
	var sort = ByCreationDate;
	$("#blaze-api-key-field").focus();
	InitSiteAPIKeyAutocomplete();

	var hasToken = false

	var lochash = location.hash.substr(1)

  var site = lochash.substr(lochash.indexOf('site=')).split('&')[0].split('=')[1]

  if (site) {
    console.log("site: " + site)
    $("#blaze-api-key-field").val(site)
    RefreshData()
  }

	var token = lochash.substr(lochash.indexOf('access_token='))
					.split('&')[0]
					.split('=')[1];
	if (token) {
		console.log("saving token to localstorage: " + token);
		localStorage.setItem('access_token', token);
	}

	var token = localStorage.getItem('access_token')

	if (token)
	{
		SetAuthButtonText("Verifying...")

		$.ajax({
			type: "GET",
			url: "https://api.stackexchange.com/2.2/access-tokens/" + token,
			data: "key=p3YZ1qDutpcBd7Bte2mcDw((",
			success: function(data)
			{
				console.log("success!")
				console.log(data);
				hasToken = true
				if (data["items"].length == 0)
				{
					console.log("current token invalid")
					localStorage.removeItem("access_token")
					hasToken = false
					SetAuthButtonText("Authenticate")
				}
				else
				{
					SetAuthButtonText("Verified")
				}
			},
			error: function(data)
			{
				console.log("error!")
				console.log(data)
			}
		});
	}

	$(document).on('click', 'a.flag-post-naa', function(event)
	{
		event.preventDefault();
		var postId = $(this).attr("data-postid");
		var siteName = $(this).attr("data-site");

		$.ajax({
			type: "GET",
			url: "https://api.stackexchange.com/2.2/answers/" + postId + "/flags/options",
			data: "key=p3YZ1qDutpcBd7Bte2mcDw((&site=" + siteName + "&access_token=" + token,
			success: function(data)
			{
				$("#flag_options_form").html("")
				$("#flag_options_form").html(RenderFlagOptions(data["items"]))

				$("#flag_modal").modal()

				$("#modal-flag-answer-button").attr("data-site-name", siteName)
				$("#modal-flag-answer-button").attr("data-post-id", postId)

				console.log(data)
			},
			error: function(data)
			{
				console.log("error!")
				console.log(data)
			}
		});
	});

  function AutoRefresh()
  {
    $("table#datatable tr").remove();
    RefreshData();
    autorefresh_timeout = setTimeout(AutoRefresh, autorefresh_time);
  }

  $(".autorefresh-option#autorefresh-none").click(function()
  {
    $(".autorefresh-option").removeClass("chosen");
    $(this).addClass("chosen");
    autorefresh_time = 10000000000;
    clearTimeout(autorefresh_timeout);
    autorefresh_timeout = setTimeout(AutoRefresh, autorefresh_time);
  });
  $(".autorefresh-option#autorefresh-10-seconds").click(function()
  {
    $(".autorefresh-option").removeClass("chosen");
    $(this).addClass("chosen");
    autorefresh_time = 10000;
    clearTimeout(autorefresh_timeout);
    autorefresh_timeout = setTimeout(AutoRefresh, autorefresh_time);
  });
  $(".autorefresh-option#autorefresh-30-seconds").click(function()
  {
    $(".autorefresh-option").removeClass("chosen");
    $(this).addClass("chosen");
    autorefresh_time = 30000;
    clearTimeout(autorefresh_timeout);
    autorefresh_timeout = setTimeout(AutoRefresh, autorefresh_time);
  });

	$("#modal-flag-answer-button").click(function()
	{
		var postId = $(this).attr("data-post-id")
		var flagId = $('input[name=flag_type]:checked', '#flag_options_form').val()
		var site = $(this).attr("data-site-name")

		$.ajax({
			type: "POST",
			url: "https://api.stackexchange.com/2.2/answers/" + postId + "/flags/add",
			data: "key=p3YZ1qDutpcBd7Bte2mcDw((&site=" + site + "&access_token=" + token + "&option_id=" + flagId + "&comment=",
			success: function(data) {
				console.log(data);
				$("#flag_modal").modal('hide')
			},
			error: function(data) {
				console.log("error");
				console.log(data)
			}
		});
	});

	$(".blaze-logo").click(function()
	{
		$("table#datatable tr").remove();
		$(".blaze-header").fadeIn();
		$(".site-api-key-form").fadeIn();
		$("nav").fadeOut();
	});
	$("#select-answers").click(function()
	{
		$(".blaze-fetch-items").html("Fetch Answers");
		apiEndpoint = 'answers';
	});
	$("#select-comments").click(function()
	{
		$(".blaze-fetch-items").html("Fetch Comments");
		apiEndpoint = 'comments';
	});
	$("#select-questions").click(function()
	{
		$(".blaze-fetch-items").html("Fetch Questions");
		apiEndpoint = 'questions';
	});
  $("#select-users").click(function()
	{
		$(".blaze-fetch-items").html("Fetch Users");
		apiEndpoint = 'users';
	});
	$(".blaze-fetch-items").click(function() {
		RefreshData();
	});

	$(".authenticate-user-button").click(function()
	{
		var token = localStorage.getItem('access_token')

		SetAuthButtonText("Working...")

		if (token)
		{
			$.ajax({
				type: "GET",
				url: "https://api.stackexchange.com/2.2/access-tokens/" + token,
				data: "key=p3YZ1qDutpcBd7Bte2mcDw((",
				success: function(data)
				{
					console.log("success!")
					console.log(data);

					if (data["items"].length == 0)
					{
						console.log("current token invalid")
						localStorage.removeItem("access_token")
						window.open("https://stackexchange.com/oauth/dialog?client_id=2670&scope=write_access&redirect_uri=http://erwaysoftware.com/blaze","_self")
						SetAuthButtonText("Redirecting...")
						hasToken = false
					}
					else
					{
						SetAuthButtonText("Verified")
						hasToken = true
					}
				},
				error: function(data)
				{
					console.log("error!")
					console.log(data)
				}
			});
		}
		else
		{
			window.open("https://stackexchange.com/oauth/dialog?client_id=2670&scope=write_access&redirect_uri=http://erwaysoftware.com/blaze","_self")
		}
	});

	$(".refresh-current-data-button").click(function()
	{
		var oldHTML = $(this).html();
		$(this).html("working...");

		$("table#datatable tr").remove();

		RefreshData(function()
			{
				$(".refresh-current-data-button").html(oldHTML);
			});
	});
	$(document).keypress(function(e) {
		if(e.which == 13) {
			RefreshData();
		}
	});
	function RefreshData(f)
	{
		RemoveErrorsAndWarnings();

		var site = $("#blaze-api-key-field").val();

    window.location.hash = "site=" + site

		var oldButtonText = $(".blaze-fetch-items").html();
		$(".blaze-fetch-items").html("Loading...");

		console.log(site);

		var argString = "page=" + currentPage + "&pagesize=" + pageSize + "&key=" + "p3YZ1qDutpcBd7Bte2mcDw((" + "&site=" + site + "&order=" + "desc" + "&sort=" + "creation" + "&filter=" + "!LeJQlFEfIbsDDTG1lReSJX";
		if (apiEndpoint == "questions") argString = "page=" + currentPage + "&pagesize=" + pageSize + "&key=" + "p3YZ1qDutpcBd7Bte2mcDw((" + "&site=" + site + "&order=" + "desc" + "&sort=" + "creation" + "&filter=" + "!)Q7pHZaD2SW58N2KuVqkwvB5";
		if (apiEndpoint == "comments") argString = "page=" + currentPage + "&pagesize=" + pageSize + "&key=" + "p3YZ1qDutpcBd7Bte2mcDw((" + "&site=" + site + "&order=" + "desc" + "&sort=" + "creation" + "&filter=" + "!)Q3IqX*j)mxF9SKNRz3tb5yK";
    if (apiEndpoint == "users") argstring = "page=" + currentPage + "&pagesize=" + pageSize + "&key=" + "p3YZ1qDutpcBd7Bte2mcDw((" + "&site=" + site + "&order=" + "desc" + "&sort=" + "creation" + "&filter=" + "!40.F89yKwjYalEn_s";

		var url = "https://api.stackexchange.com/2.2/" + apiEndpoint;
		$.ajax({
			type: "GET",
			url: url,
			data: argString,
			success: function(data)
			{
				console.log(data["items"]);
				console.log("backoff: " + data["backoff"]);
				if (data["backoff"])
				{
					var backoff = parseInt(data["backoff"], 10);
					if  (backoff > 0)
					{
						ShowWarningWithMessage("Backoff received: " + backoff + " seconds :(");
						console.log('hi');
					}
				}

				$(".blaze-header").fadeOut();
				$(".site-api-key-form").fadeOut();

				$("nav").fadeIn();

				var items = data["items"];

				items.sort(sort);

				jQuery.each(items, function(index, item) {
					if (apiEndpoint == 'questions')
					{
						$("table#datatable").append(RenderQuestion(item));
					}
					else if (apiEndpoint == 'answers')
					{
						$("table#datatable").append(RenderAnswer(item, site));
					}
					else if (apiEndpoint == 'comments')
					{
						$("table#datatable").append(RenderComment(item));
					}
          else if (apiEndpoint == 'users')
          {
            $("table#datatable").append(RenderUser(item));
          }
				});

				$(".blaze-fetch-items").html(oldButtonText);

				$("div.alert.alert-danger").remove();

				if (typeof f == "function") f();
			},
			error: function(data)
			{
				string = '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>';
				string = string + data.responseJSON["error_message"].charAt(0).toUpperCase() + data.responseJSON["error_message"].slice(1);
				string = string + '</div>';
				$("div.alert.alert-danger").remove();
				$(".site-api-key-form").prepend(string);
				$(".blaze-fetch-items").html(oldButtonText);
				ShowErrorWithMessage(data.responseJSON["error_message"].charAt(0).toUpperCase() + data.responseJSON["error_message"].slice(1));
			}
		});
	}

	// Array sorting functions:

	function ByLength(a, b){
		var aLength = a["body"].length;
		var bLength = b["body"].length;
		return ((aLength < bLength) ? -1 : ((aLength > bLength) ? 1 : 0));
	}
	function ByCreationDate(a, b){
		var aDate = a["creation_date"];
		var bDate = b["creation_date"];
		return ((aDate > bDate) ? -1 : ((aDate < bDate) ? 1 : 0));
	}

	$("#sort-by-newest-creation").click(function() {
		sort = ByCreationDate;
		$("table#datatable tr").remove();
		$("#current-sort-indicator").html("Working...");
		RefreshData(function()
			{
				$("#current-sort-indicator").html("Newest");
			});
	});
	$("#sort-by-shortest-length").click(function() {
		sort = ByLength;
		console.log($("#current-sort-indicator"));
		$("table#datatable tr").remove();
		RefreshData(function()
			{
				$("#current-sort-indicator").html("Shortest");
			});
	});
	$(document).on('click', 'a.flag', function(event) {
		event.preventDefault();
		console.log("flag button pressed");
		var flagButton = $(this);
		flagButton.html("<strong>working...</strong>");
		var postId = $(this).attr("data-postid");
		var siteName = $(this).attr("data-site");
		var body = $(this).siblings("span.post-body").html();
		console.log(postId);
		var argString = "id=" + postId + "&site=" + siteName + "&body=" + body;
		$.ajax({
		    type: "POST",
		    url: "/blaze/posttochat.php",
		    data: argString,
		    success: function(data) {
		 	console.log(data);
		 	if (data.trim() == "error") {
		 	    flagButton.html("error");
		 	}
		 	else if (data.trim() == "already flagged") {
                            flagButton.html("already flagged");
		        }
		 	else {
		 	    flagButton.html("flagged");
		 	}
		    },
	            error: function(data) {
		        console.log("error");
		    }
		});
	});

	//Rendering things

	function RenderAnswer(item)
	{
		var string = '<tr><td style="vertical-align:top" class="col-md-1"><div class="score"><h2 style="color:rgba(0,0,0,0.6); pull:right">';
		string = string + item["score"];
		string = string + '</h2></div></td><td class=""><div class="post col-md-9" style="max-width:75%"><h3><a target="_blank" href="';
		string = string + item["link"];
		string = string + '">';
		string = string + item["title"];
		string = string + '</a>';
		string = string + '</h3><hr><span class="post-body" style="color:rgba(70,70,70,1)">';
		string = string + item["body"];
		string = string + '</span>'
		var siteUrl = item["link"].split("/")[2];
		string = string + '<a class="flag" style="float:left; color:rgb(165,65,65);' + (isLoggedIn ? '"' : 'display:none"') + 'href="#" data-site="' + siteUrl + '" data-postid="' + item["link"].split("#")[1] + '"><strong>flag</strong></a>';
		if (hasToken)
		{
			string = string + '<br /><a class="flag-post-naa" style="float:left; color:rgb(165,65,65);" href="#" data-site="' + siteUrl + '" data-postid="' + item["link"].split("#")[1] + '"><strong>Flag on Site</strong></a>'
		}
		string = string + RenderUsercard(item["owner"], item);
		string = string + '</p></div></td></tr>';
		string = string + '<tr><td class="col-md-1"></td></tr>'; //<td><strong style="color:#b65454">flag</strong></td>
		return string;
	}
	function RenderQuestion(item)
	{
		var string = '<tr><td style="vertical-align:top" class="col-md-1"><div class="score"><h2 style="color:rgba(0,0,0,0.6); pull:right">';
		string = string + item["score"];
		string = string + '</h2></div></td><td class=""><div class="post col-md-9" style="max-width:75% !important"><h3><a target="_blank" href="';
		string = string + item["link"];
		string = string + '">';
		string = string + item["title"];
		string = string + '</a>';
		string = string + "</br><small>";
		for (var i = 0; i < item["tags"].length; i++) {
			string = string + '<kbd style="background-color:grey">' + item["tags"][i] + '</kbd> ';
		};
		string = string + "</small>";
		string = string + '</h3><hr><span class="post-body" style="color:rgba(70,70,70,1)">';
		string = string + item["body"];
		var siteUrl = item["link"].split("/")[2];
		string = string + '<a class="flag" style="float:left; color:rgb(165,65,65);' +(isLoggedIn ? '"' : 'display:none"') + 'href="#" data-site="' + siteUrl + '" data-postid="' + item["link"].split("/")[4] + '"><strong>flag</strong></a>';
		string = string + RenderUsercard(item["owner"], item);
		string = string + '</p></div></td></tr>';
		return string;
	}
	function RenderComment(item)
	{
		var string = '<tr><td style="vertical-align:top; padding-bottom: 1em;" class="col-md-1"><div class="score"><h5 style="color:rgba(0,0,0,0.6); pull:right; text-align:right">';
		if (item["score"] != "0") string = string + item["score"];
		string = string + '</h5></div></td><td style="padding-bottom: 1em;"><div class="post col-md-9">';
		string = string + '<span class="post-body" style="color:rgba(70,70,70,1)">';
		string = string + item["body"];
		string = string + ' - <a href="';
		string = string + item["owner"]["link"];
		string = string + '">';
		string = string + item["owner"]["display_name"];
		if (item["owner"]["user_type"] == 'moderator') string = string + " &diams;";
		string = string + '</a> <a target="_blank" style="color:grey" href="';
		string = string + item["link"];
		string = string + '"><span data-livestamp="';
		string = string + item["creation_date"];
		string = string + '"></span>';
		string = string + '</a></span></div></td></tr>';
		return string;
	}
  function RenderUser(item)
  {
    var string = '<tr style="margin-top:10px"><td style="vertical-align:top" class="col-md-1">';
    string = string + RenderUsercard(item, item).replace("posted ", "created ");
    string = string + '</td><td class=""><div class="post col-md-9" style="max-width:75% !important"><p class="text-danger">';
    string = string + ((item["about_me"] != undefined) ? item["about_me"] : "-");
    string = string + '</p></div></td></tr>';
    return string;
  }

	function RenderUsercard(user, item)
	{
		var string = "<div style='background-color: clear; padding-left:5px;padding-right:3px;padding-bottom:3px; padding-top: 2px; width:175px; min-height:58px; float:right;border: 1px dashed rgba(0,0,0,.2);'><div style='margin-top: 0px; font-size:12px; margin-bottom: 2px;color: grey;'>posted ";
		string = string + '<span style="font-weight: bold;"data-livestamp="';
		string = string + item["creation_date"];
		string = string + '"></span>';
		string = string + "</div><div style='float:left; width:32px; height:32px'><img src='";
		string = string + user["profile_image"];
		string = string + "' style='width:32px; height:32px'></div><div style='color:#888; font-size:12px; margin-left:5px;'><span style='padding-left:6px; border-left:6margin-left:6px; border-top:-10px'><a target='_blank' href='";
		string = string + user["link"];
		string = string + "'>";
		string = string + user["display_name"];
		if (user['user_type'] == 'moderator') string = string + ' &diams;';
		string = string + "</a></span>";
		string = string + "</br><span style='color:grey; font-size:12px; padding-left:6px; border-left:6margin-left:6px; border-top:-10px'>";
		string = string + FormatRep(user["reputation"]);
		string = string + "</span>";
		string = string + "</div></div>";
		return string;
	}

	function RenderFlagOptions(items)
	{
		string = "";

		$.each(items, function(index, value)
		{
			string = string + '<input type="radio" name="flag_type" value="' + value["option_id"] + '">'
			string = string + '<strong style="margin-left:10px">' + value["title"] + '</strong>';
			string = string + '<p style="margin-left:20px">' + value["description"] + '</p>';
			string = string + '<br />'
		});

		return string
	}

	//Autocomplete things

	function InitSiteAPIKeyAutocomplete()
	{
		$.ajax({
			type: "GET",
			url: "https://api.stackexchange.com/2.2/sites",
			data: "pagesize=1000&filter=!mszzl.y_MC&key=p3YZ1qDutpcBd7Bte2mcDw((",
			success: function(data)
			{
				var items = data["items"];

				var siteApiKeys = [];

				jQuery.each(items, function(index, item) {
					siteApiKeys.push(item["api_site_parameter"]);
				});

				$("#blaze-api-key-field").autocomplete({
					source: siteApiKeys
				});
			},
			error: function(data) {}
		});
	}

	//User auth things

	$("#blaze-log-in-button").click(function()
	{
	    var btnText = $("ul#blaze-login-signup-tabs li.active").text();
		if (btnText == 'Log in') {
			var username = $("#blaze-login-username-field").val();
			var password = $("#blaze-login-password-field").val();
			var argString = "username=" + encodeURIComponent(username) + "&password=" + encodeURIComponent(password);
			$.ajax({
				type: "POST",
				url: "/blaze/login.php",
				data: argString,
				success: function(data) {
				    if (data.trim() == "logged in") {
				        var profilebutton = '<li class="dropdown"><a href="#" class="dropdown-toggle" data-toggle="dropdown" id="blaze-navbar-username"><span class="glyphicon glyphicon-user"></span> ' + username + ' <b class="caret"></b></a><ul class="dropdown-menu" style="text-align:left"><li><a href="#" id="blaze-log-out"><span class="glyphicon glyphicon-arrow-left"></span> Log out</a></li></ul></li>'
				        $("#loginModal").modal("hide");
					$(".flag").fadeIn();
					$(".show-login-modal-button").fadeOut();
					$(".navbar-nav").append(profilebutton);
					$(".show-login-modal-button").remove();
					isLoggedIn = true;
				    }
				    else console.log(data);
				}
			});
		}
		else if (btnText == 'Sign up') {
			var password = $("#blaze-login-password-signup-field").val();
			var passwordConf = $("#blaze-login-password-confirm-signup-field").val();
			if (password != passwordConf) {
				alert("passwords don't match!");
				return;
			}

			var argString = "username=" + encodeURIComponent($("#blaze-login-username-signup-field").val()) + "&password=" + encodeURIComponent($("#blaze-login-password-signup-field").val()) + "&email=" + encodeURIComponent($("#blaze-login-email-signup-field").val());
			$.ajax({
				type: "POST",
				url: "/blaze/signup.php",
				data: argString,
				success: function(data)
				{
					if (data.trim() == "success")
					{
						$('#blaze-login-signup-tabs a[href="#blaze-login-tab"]').tab('show') // Select tab by name
					}
					else
					{
						console.log(data);
					}
				}
			});
		}
		else // Forgot password
		{
		    argString = "username=" + encodeURIComponent($("#blaze-username-forgot-password-field").val());
		    $.ajax({
			    type: "POST",
				url: "/blaze/recoverpassword.php",
				data: argString,
				success: function(data)
				{
				    if (data.endsWith("success")) // endsWith and not trim here, because of the notices in ses.php
					{
					    window.location.href = "/blaze/recoverpassword.php";
					}
					else
					{
					    console.log(data);
					}
				}
			});
		}
	});
	$("#blaze-log-out").click(function()
	{
		$.ajax({
			type: "POST",
			url: "/blaze/logout.php",
			data: '',
			success: function(data)
			{
				if (data.trim() == "logged out")
				{
					window.location.reload(true);
				}
			}
		});
	});
  $(".choose-site-stackoverflow").click(function()
  {
    $("#blaze-api-key-field").val("stackoverflow");
    event.preventDefault();
  });
  $(".choose-site-superuser").click(function()
  {
    $("#blaze-api-key-field").val("superuser");
    event.preventDefault();
  });
  $(".choose-site-serverfault").click(function()
  {
    $("#blaze-api-key-field").val("serverfault");
    event.preventDefault();
  });
  $(".choose-site-softwarerecs").click(function()
  {
    $("#blaze-api-key-field").val("softwarerecs");
    event.preventDefault();
  });

	function ShowWarningWithMessage(message)
	{
		RemoveErrorsAndWarnings();
		$(".navbar").before("<div class='blaze-modal-warning' style='width:100%; height:30px; vertical-align:center; background-color:rgb(248,198,77); color:white; font-size:17px; text-align:center; font-family:Helvetica'>" + message + "</div>")
	}
	function ShowErrorWithMessage(message)
	{
		RemoveErrorsAndWarnings();
		$(".navbar").before("<div class='blaze-modal-error' style='width:100%; height:30px; vertical-align:center; background-color:rgb(241,62,66); color:white; font-size:17px; text-align:center; font-family:Helvetica'>" + message + "</div>")
	}
	function RemoveErrorsAndWarnings()
	{
		$(".blaze-modal-error").remove();
		$(".blaze-modal-warning").remove();
	}

	function SetAuthButtonText(text)
	{
		$(".authenticate-user-button").html('<span class="glyphicon glyphicon-lock"></span> ' + text)
	}

	function FormatRep(reputation)
    {
		return Math.abs(Number(reputation)) >= 1.0e+4

		? (Math.abs(Number(reputation)) / 1.0e+3).toFixed(1) + "k"

		: Math.abs(Number(reputation));
   }
});
