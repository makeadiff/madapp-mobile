var class_data;
var all_teachers;
function init () {
	getData(base_url + "class_get_last_batch/", {"user_id": user_id}, updatePage, "levels");
	getData(base_url + "user_get_teachers/", {"city_id": city_id}, setTeachers);
}

function setTeachers(data) {
	all_teachers = data.teachers;
}

function getData(url, args, func, context) {
	loading();
	args.key = key;

	$.ajax({
		"url": url,
		"data": args,
	}).done(function(data) {
		loaded();
		func.apply(document, [data, context]);
	});
}

function updatePage(data, id) {
	if(!id) id = "content";
	class_data = data;

	var html = "";
	html += "<h3>" + data.center_name + "</h3>";
	html += "<h4>" + data.batch_name + "</h4>";

	html += "<ul data-role='listview'>";
	for(var index in data.classes) {
		var level_data = data.classes[index];
		html += "<li><a href='#level_info' disabled='disabled' class='level btn' data-level-id='"+level_data.level_id+"' data-index='"+index+"'>" +level_data.level_name+ "</a></li>";
	}
	html += "</ul>";

	$("#levels").html(html).trigger( "create" ); ;
	$(".level").on("click", showLevel);
}

function showLevel(e) {
	var index = $(this).attr("data-index");
	var level_data = class_data.classes[index];

	var disabled = '';
	if(level_data.class_status == '0') disabled = " disabled='disabled'";

	var html = "";
	html += "<h3>" + level_data.level_name + "</h3>";

	html += "<form action='' method='post' id='level_form'>";

	html += "<div data-role='fieldcontain'><label for='lesson_id'>Unit Taught</label><select id='lesson_id' name='lesson_id' "+disabled+">";
	for(var i in level_data['all_lessons']) {
		var lesson = level_data['all_lessons'][i];
		html += "<option value='"+lesson.lesson_id+"'";
		if(lesson.lesson_id == level_data.lesson_id) html += " selected";
		html += ">"+lesson.lesson_name+"</option>";
	}
	html += "</select></div>";

	for(var teacher_index in level_data['teachers']) {
		var teacher = level_data['teachers'][teacher_index];
		console.log(teacher);
		html += "<h4>Teacher: " + teacher.name + "</h4>";

		html += "<input type='hidden' name='teacher_id["+teacher_index+"]' value='"+teacher.id+"' />";
		html += "<input type='hidden' name='zero_hour_attendance["+teacher_index+"]' value='1' />";

		html += "<div data-role='fieldcontain'><label for='substitued_user_id_"+teacher_index+"'>Substitute</label><select id='substitued_user_id_"+teacher_index+"' name='substitute_id["+teacher_index+"]' "+disabled+">";
		html += "<option value='0'>None</option>";
		for(var i in all_teachers) {
			var teacher_user = all_teachers[i];
			html += "<option value='"+teacher_user.id+"'";
			if(teacher_user.id == teacher.substitute_id) html += " selected";
			html += ">"+teacher_user.name+"</option>";
		}
		html += "</select></div>";

		html += "<div data-role='fieldcontain'><label for='status_"+teacher_index+"'>Status</label>";
		html += "<select id='status_"+teacher_index+" 'name='status["+teacher_index+"]' "+disabled+"><option value='attended'>Attended</option><option value='absent'>Absent</option></select></div>";
	}

	html += "<div data-role='fieldcontain'><label for='student_attendance'>Student Attendance</label>";
	html += "<input "+disabled+" type='button' class='btn student_attendance' data-index='"+index+"' name='student_attendance' id='student_attendance_status' value='Student Attendance: "+level_data.student_attendance+"' /></div>";

	html += "<input type='hidden' name='class_id' value='"+level_data.id+"' />";
	html += "<input type='submit' name='action' value='Save' "+disabled+" />";
	if(level_data.class_status == '1') {
		html += "<input type='button' name='cancel' id='cancel_class' data-class-id='"+level_data.id+"' data-index='"+index+"' class='cancel-class' value='Cancel Class'  />";
	} else {
		html += "<input type='button' name='uncancel' id='un_cancel_class' data-class-id='"+level_data.id+"' data-index='"+index+"' class='uncancel-class' value='UnCancel Class'  />";
	}

	html += "</form>";

	$("#level_info").html(html).trigger( "create" ).show();
	$("#level_form").on("submit", saveClassData);
	$("#student_attendance_status").on("click", getStudentAttendance);
	$("#cancel_class").on("click", doCancelClass);
	$("#un_cancel_class").on("click", doUnCancelClass);
}

function saveClassData(e) {
	e.preventDefault();

	var serazilized = $("#level_form").serialize();
	var data = decodeURIComponent(serazilized);
	
	//console.log(data, serazilized);
	getData(base_url + "class_save_level/?"+data, {}, classSaved);
}

function classSaved(data) {
	alert("Data Saved");
}

function doCancelClass(e) {
	e.preventDefault();

	var class_id = $(this).attr("data-class-id");
	var index = $(this).attr("data-index");

	getData(base_url + "class_cancel", {"class_id": class_id}, function(data) {
		class_data.classes[index].class_status = "0";
		$("#level_info").hide();
		alert("Class Cancelled");
	});
}

function doUnCancelClass(e) {
	e.preventDefault();

	var class_id = $(this).attr("data-class-id");
	var index = $(this).attr("data-index");
	getData(base_url + "class_uncancel", {"class_id": class_id}, function(data) {
		class_data.classes[index].class_status = "1";
		$("#level_info").hide();
		alert("Class Un-Cancelled");
	});
}
function showAttendance(data, context) {
	var index = $(context.this).attr("data-index");

	var html = "";
	html += "<h3>Student Attendance</h3>";
	html += "<form action='' method='post' id='attendance-form'>";

	html += "<ul style='list-style:none;'>";
	for(var i in data.students) {
		html += "<li><input type='checkbox' class='student-attendance-data' value='"+i+"' id='student_"+i+"'";
		if(data.attendance[i] == "1") html += " checked='checked'";
		html += "/><label for='student_"+i+"'>"+data.students[i]+"</label></li>";
	}
	html += "</ul>";

	// Multi Select option. Better - but API don't support it yet.
	// html += "<select name='attendance' id='attendance' multiple='multiple' data-native-menu='false'>";
	// for(var i in data.students) {
	// 	html += "<option value='"+i+"'";
	// 	if(data.attendance[i]) html += " selected='selected'";
	// 	html += ">"+data.students[i]+"</option>";
	// }
	// html += "</select>";

	html += "<input type='submit' name='action' value='Save' />";
	html += "<input type='button' name='cancel' id='cancel_attendance' value='Cancel' />";
	html += "<input type='hidden' name='class_id' value='"+class_data.classes[index].id+"' id='class_id' />";
	html += "</form>";

	$("#student_attendance").html(html).show().trigger( "create" ); 
	$("#attendance-form").on("submit", saveAttendanceData);
	$("#cancel_attendance").on("click", function() {
		$("#student_attendance").hide();
	});
}


function getStudentAttendance(e) {
	var index = $(this).attr("data-index");
	var level_data = class_data.classes[index];

	getData(base_url + "class_get_students", {"class_id":level_data.id}, showAttendance, {"this": this});
}

function saveAttendanceData(e) {
	e.preventDefault();

	var attendance_data = {};
	var attended_count = 0;
	var total = 0;
	$(".student-attendance-data").each(function() {
		if(this.checked) {
			attendance_data[this.value] = 1;
			attended_count++;
		}
		else attendance_data[this.value] = 0;

		total++;
	});

	getData(base_url + "class_save_student_attendance", {"class_id": $("#class_id").val(), "attendance": attendance_data}, function (data) {
		$("#student_attendance").hide();
		$("#student_attendance_status").val("Student Attendance Marked: " + attended_count + "/" + total);
		$("#student_attendance_status").button("refresh");
	});

	return false;
}

