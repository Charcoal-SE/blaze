$(document).ready(function() {
	console.log("hi!");
	var apiEndpoint = "answers";

	$("#select-answers").click(function()
	{
		$(".blaze-fetch-items").html("Fetch Answers");
		apiEndpoint = 'answers';
	});
	$("#select-questions").click(function()
	{
		$(".blaze-fetch-items").html("Fetch Questions");
		apiEndpoint = 'questions';
	});
	$(".blaze-fetch-items").click(function() {
		RefreshData();
	});
	function RefreshData()
	{
		var site = $("#blaze-api-key-field").val();

		console.log(site);

		var argString = "key=" + "p3YZ1qDutpcBd7Bte2mcDw((" + "&site=" + site + "&order=" + "desc" + "&sort=" + "creation" + "&filter=" + "!LeJQlFEfIbsDDTG1lReSJX";
		if (apiEndpoint == "questions") argString = "key=" + "p3YZ1qDutpcBd7Bte2mcDw((" + "&site=" + site + "&order=" + "desc" + "&sort=" + "creation" + "&filter=" + "!)suLj6TsmW6NWHOPM0a*";
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

				jQuery.each(data["items"], function(index, item) {
					string = '<tr><td style="vertical-align:top" class="col-md-1"><div class="score"><h2 style="color:rgba(0,0,0,0.6); pull:right">';
					string = string + item["score"];
					string = string + '</h2></div></td><td class=""><div class="post col-md-9"><h3><a href="';
					string = string + item["link"];
					string = string + '">';
					string = string + item["title"];
					string = string + '</a></h3><hr><span class="post-body" style="color:grey">';
					string = string + item["body"];
					string = string + '</span></div></td></tr>';
					$("table").append(string);
				});
			},
		});
	}
});