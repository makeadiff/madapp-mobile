function updateWithData(url, data, id) {
	if(!id) id = "content";
	loading();
	data.key = "am3omo32hom4lnv32vO";
	data.user_id = 1;

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