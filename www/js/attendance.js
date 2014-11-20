var class_data;
var all_teachers;
function init () {
	getData(base_url + "class_get_last_batch/", {"user_id":1}, updatePage, "levels");
	setTeachers();
}

function setTeachers() {
	all_teachers = [{"id":1,"name":"Xyz"}, {"id":2,"name":"Abc"}]
}

function getData(url, args, func, context) {
	loading();
	args.key = "am3omo32hom4lnv32vO";

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
		html += "<li><a href='#' class='level btn' data-level-id='"+level_data.level_id+"' data-index='"+index+"'>" +level_data.level_name+ "</a></li>";
	}
	html += "</ul>";

	$("#levels").html(html).trigger( "create" ); ;
	$(".level").on("click", showLevel);
}

function showLevel(e) {
	var index = $(this).attr("data-index");
	var level_data = class_data.classes[index];

	var html = "";
	html += "<h3>" + level_data.level_name + "</h3>";

	html += "<form action='' method='post'>";

	html += "<div data-role='fieldcontain'><label for='unit_id'>Unit Taught</label><select id='unit_id' name='unit_id'>";
	for(var i in level_data['all_lessons']) {
		var lesson = level_data['all_lessons'][i];
		html += "<option value='"+lesson.unit_id+"'>"+lesson.unit_name+"</option>";
	}
	html += "</select></div>";

	for(var teacher_index in level_data['teachers']) {
		var teacher = level_data['teachers'][teacher_index];
		html += "<h4>Teacher: " + teacher.name + "</h4>";


		html += "<div data-role='fieldcontain'><label for='substitued_user_id_"+teacher_index+"'>Substitute</label><select id='substitued_user_id_"+teacher_index+"' name='substitued_user_id_"+teacher_index+"'>";
		for(var i in all_teachers) {
			var teacher = all_teachers[i];
			html += "<option value='"+teacher.id+"'>"+teacher.name+"</option>";
		}
		html += "</select></div>";

		html += "<div data-role='fieldcontain'><label for='status_"+teacher_index+"'>Status</label>";
		html += "<select name='status_"+teacher_index+"'><option value='attended'>Attended</option><option value='absent'>Absent</option></select></div>";
	}

	html += "<div data-role='fieldcontain'><label for='student_attendance'>Student Attendance</label>";
	html += "<input type='button' class='btn student_attendance' data-index='"+index+"' name='student_attendance' id='student_attendance_status' value='Student Attendance: "+level_data.student_attendance+"' /></div>";

	html += "<input type='submit' name='action' value='Save' />";
	html += "<input type='button' name='cancel' data-class-id='"+level_data.id+"' class='cancel-class' value='Cancel Class'  />";

	html += "</form>";

	$("#level_info").html(html).trigger( "create" );
	$("#student_attendance_status").on("click", getStudentAttendance);
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

