$(document).ready(function() {
	var apiEndpoint = "answers";
	var currentPage = 1;
	var pageSize = 100;
	var sort = ByCreationDate;
	$("#blaze-api-key-field").focus();
	
	InitSiteAPIKeyAutocomplete();

	$(".blaze-logo").click(function()
	{
		$("table tr").remove();
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
	$(".blaze-fetch-items").click(function() {
		RefreshData();
	});
	$(".refresh-current-data-button").click(function()
	{
		var oldHTML = $(this).html();
		$(this).html("working...");

		$("table tr").remove();

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
		var site = $("#blaze-api-key-field").val();

		var oldButtonText = $(".blaze-fetch-items").html();
		$(".blaze-fetch-items").html("Loading...");

		console.log(site);

		var argString = "page=" + currentPage + "&pagesize=" + pageSize + "&key=" + "p3YZ1qDutpcBd7Bte2mcDw((" + "&site=" + site + "&order=" + "desc" + "&sort=" + "creation" + "&filter=" + "!LeJQlFEfIbsDDTG1lReSJX";
		if (apiEndpoint == "questions") argString = "page=" + currentPage + "&pagesize=" + pageSize + "&key=" + "p3YZ1qDutpcBd7Bte2mcDw((" + "&site=" + site + "&order=" + "desc" + "&sort=" + "creation" + "&filter=" + "!)Q7pHZaD2SW58N2KuVqkwvB5";
		if (apiEndpoint == "comments") argString = "page=" + currentPage + "&pagesize=" + pageSize + "&key=" + "p3YZ1qDutpcBd7Bte2mcDw((" + "&site=" + site + "&order=" + "desc" + "&sort=" + "creation" + "&filter=" + "!)Q3IqX*j)mxF9SKNRz3tb5yK";
		var url = "https://api.stackexchange.com/2.2/" + apiEndpoint;
		$.ajax({
			type: "GET",
			url: url,
			data: argString,
			success: function(data)
			{
				console.log(data["items"]);

				$(".blaze-header").fadeOut();
				$(".site-api-key-form").fadeOut();

				$("nav").fadeIn();

				var items = data["items"];

				items.sort(sort);

				jQuery.each(items, function(index, item) {
					if (apiEndpoint == 'questions')
					{
						$("table").append(RenderQuestion(item));
					}
					else if (apiEndpoint == 'answers')
					{
						$("table").append(RenderAnswer(item));
					}
					else if (apiEndpoint == 'comments')
					{
						$("table").append(RenderComment(item));
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
		$("table tr").remove();
		$("#current-sort-indicator").html("Working...");
		RefreshData(function()
			{
				$("#current-sort-indicator").html("Newest");
			});
	});
	$("#sort-by-shortest-length").click(function() {
		sort = ByLength;
		console.log($("#current-sort-indicator"));
		$("table tr").remove();
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
		var postLink = $(this).attr("postLink");
		console.log(postLink);
		var argString = "url=" + postLink;
		$.ajax({
		    type: "POST",
		 	url: "/blaze/posttochat.php",
		 	data: argString,
		 	success: function(data) {
		 		console.log("success");
		 		flagButton.html("flagged");
			},
			error: function(data) {
				console.log("error")
			}
		});
	});

	//Rendering things

	function RenderAnswer(item)
	{
		var string = '<tr><td style="vertical-align:top" class="col-md-1"><div class="score"><h2 style="color:rgba(0,0,0,0.6); pull:right">';
		string = string + item["score"];
		string = string + '</h2></div></td><td class=""><div class="post col-md-9"><h3><a href="';
		string = string + item["link"];
		string = string + '">';
		string = string + item["title"];
		string = string + '</a>';
		string = string + '</h3><hr><span class="post-body" style="color:rgba(70,70,70,1)">';
		string = string + item["body"];
		string = string + '</span><a class="flag" style="float:left; color:rgb(165,65,65)" href="#" postLink="' + item["link"] + '"><strong>flag</strong></a>';
		string = string + "<div style='background-color:rgb(216,229,238); padding-left:3px; width:175px; height:58px; float:right'><div style='margin-top:2px; font-size:12px; margin-bottom:4px'>posted ";
		string = string + '<span data-livestamp="';
		string = string + item["creation_date"];
		string = string + '"></span>';
		string = string + "</div><div style='float:left; width:32px; height:32px'><img src='";
		string = string + item["owner"]["profile_image"];
		string = string + "' style='width:32px; height:32px'></div><span style='color:#888; font-size:12px; margin-left:5px;'><a href='";
		string = string + item["owner"]["link"];
		string = string + "'>";
		string = string + item["owner"]["display_name"];
		if (item["owner"]['user_type'] == 'moderator') string = string + ' &diams;';
		string = string + "</a></span></div></div>";
		string = string + '</p></div></td></tr>';
		string = string + '<tr><td class="col-md-1"></td></tr>'; //<td><strong style="color:#b65454">flag</strong></td>
		return string;
	}
	function RenderQuestion(item)
	{
		var string = '<tr><td style="vertical-align:top" class="col-md-1"><div class="score"><h2 style="color:rgba(0,0,0,0.6); pull:right">';
		string = string + item["score"];
		string = string + '</h2></div></td><td class=""><div class="post col-md-9"><h3><a href="';
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
		// string = string + '</span><p style="color:grey; float:right">posted by ';
		// var owner = item["owner"];
		// string = string + '<a href="';
		// string = string + owner["link"];
		// string = string + '">';
		// string = string + owner["display_name"];
		// if (owner['user_type'] == 'moderator') string = string + ' &diams;';
		// string = string + '</a> '
		// string = string + '<span data-livestamp="';
		// string = string + item["creation_date"];
		// console.log(item["creation_date"]);
		// string = string + '"></span>';
		string = string + "<div style='background-color:rgb(216,229,238); padding-left:3px; width:175px; height:58px; float:right'><div style='margin-top:2px; font-size:12px; margin-bottom:4px'>posted ";
		string = string + '<span data-livestamp="';
		string = string + item["creation_date"];
		string = string + '"></span>';
		string = string + "</div><div style='float:left; width:32px; height:32px'><img src='";
		string = string + item["owner"]["profile_image"];
		string = string + "' style='width:32px; height:32px'></div><span style='color:#888; font-size:12px; margin-left:5px;'><a href='";
		string = string + item["owner"]["link"];
		string = string + "'>";
		string = string + item["owner"]["display_name"];
		if (item["owner"]['user_type'] == 'moderator') string = string + ' &diams;';
		string = string + "</a></span></div></div>";
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
		string = string + '</a> <a style="color:grey" href="';
		string = string + item["link"];
		string = string + '"><span data-livestamp="';
		string = string + item["creation_date"];
		string = string + '"></span>';
		string = string + '</a></span></div></td></tr>';
		return string;
	}

	//Autocomplete things

	function InitSiteAPIKeyAutocomplete()
	{
		$.ajax({
			type: "GET",
			url: "https://api.stackexchange.com/2.2/sites",
			data: "pagesize=1000&filter=!mszzl.y_MC",
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
});
