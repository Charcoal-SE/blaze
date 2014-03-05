$(document).ready(function() {
	var apiEndpoint = "answers";
	var currentPage = 1;
	var pageSize = 100;
	var sort = ByCreationDate;

	$(".blaze-logo").click(function()
	{
		$("table tr").remove();
		apiEndpoint = 'answers';
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
		if (apiEndpoint == "questions") argString = "page=" + currentPage + "&pagesize=" + pageSize + "&key=" + "p3YZ1qDutpcBd7Bte2mcDw((" + "&site=" + site + "&order=" + "desc" + "&sort=" + "creation" + "&filter=" + "!41Uq1Xg7x8dpO6Gp1";
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

					$(".blaze-fetch-items").html(oldButtonText);

					$("div.alert.alert-danger").remove();
				});

				if (typeof f == "function") f();
			},
			error: function(data)
			{
				string = '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><strong>Error!</strong> ';
				string = string + data.responseJSON["error_message"];
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
		if (apiEndpoint == "questions")
		{
			string = string + "</br><small>";
			for (var i = 0; i < item["tags"].length; i++) {
				string = string + '<kbd style="background-color:grey">' + item["tags"][i] + '</kbd> ';
			};
			string = string + "</small>";
		}
		string = string + '</h3><hr><span class="post-body" style="color:grey">';
		string = string + item["body"];
		string = string + '</span></div></td></tr>';
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
		string = string + '</h3><hr><span class="post-body" style="color:grey">';
		string = string + item["body"];
		string = string + '</span></div></td></tr>';
		return string;
	}
	function RenderComment(item)
	{
		var string = '<tr><td style="vertical-align:top; padding-bottom: 1em;" class="col-md-1"><div class="score"><h5 style="color:rgba(0,0,0,0.6); pull:right; text-align:right">';
		string = string + item["score"];
		string = string + '</h5></div></td><td style="padding-bottom: 1em;"><div class="post col-md-9">';
		string = string + '<span class="post-body" style="">';
		string = string + item["body"];
		string = string + ' - <a href="';
		string = string + item["owner"]["link"];
		string = string + '">';
		string = string + item["owner"]["display_name"];
		string = string + '</a> <a style="color:grey" href="';
		string = string + item["link"];
		string = string + '">here</a>'
		string = string + '</a></span></div></td></tr>';
		return string;
	}
});
