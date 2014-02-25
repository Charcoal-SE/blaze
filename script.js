$(document).ready(function() {
	console.log("hi!");

	$(".blaze-fetch-items").click(function() {
		var site = $("#blaze-api-key-field").val();

		console.log(site);

		var argString = "key=" + "p3YZ1qDutpcBd7Bte2mcDw((" + "&site=" + site + "&order=" + "desc" + "&sort=" + "creation" + "&filter=" + "!LeJQlFEfIbsDDTG1lReSJX";
		$.ajax({
			type: "GET",
			url: "https://api.stackexchange.com/2.2/answers",
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
	});
});