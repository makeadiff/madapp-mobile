function updateWithData(url, data, id) {
	if(!id) id = "content";
	loading();
	data.key = key;
	data.user_id = user_id;

	$.ajax({
		"url": url,
		"data": data,
	}).done(function(data) {
		loaded();

		var template = $("#content").clone();
		$(".row").remove();

		for(var i in data.data) {
			var blah = data.data[i];
			var new_row = template;
			for(var key in blah) {
				$("."+key, new_row).text(blah[key]);
			}

			$("#content").append(new_row.html());
		}

	});
}