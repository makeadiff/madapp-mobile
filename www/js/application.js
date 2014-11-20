var base_url = "http://localhost/Projects/Madapp/index.php/api/";
var db;
var config = {};


// Populate the database 
function populateDB(db) {
     //db.executeSql('DROP TABLE IF EXISTS Setting');
     db.executeSql('CREATE TABLE IF NOT EXISTS Setting (id, name, value, data)');
}

// Transaction error callback
function errorCB(db, err) {
    alert("Error processing SQL: "+err);
}
function successCB() {

}
function getLoginDetails(db, results) {
	var len = results.rows.length;
    for (var i=0; i<len; i++){
        config[results.rows.item(i).name] = results.rows.item(i).value;
    }
    console.log(config);
}

(function($) {
    "use strict";

    $( document ).on( "ready", function(){
        // db = window.openDatabase("mobile_madapp", "1.0", "Mobile MADApp", 1000000);
        // db.transaction(populateDB, errorCB, successCB);
        // db.executeSql('SELECT * FROM Setting', [], getLoginDetails, errorCB);

        if(window.init && typeof window.init == "function") init(); //If there is a function called init(), call it on load 
    });

    $( document ).on( "deviceready", function(){
        StatusBar.overlaysWebView( false );
        StatusBar.backgroundColorByName("gray");
    });

}
)(jQuery);

function showMessage(data) {
	var type = 'error';
	if(data.success) var type = 'success';
	
	$("#"+type+"-message").html(stripSlashes(data[type]));
	$("#"+type+"-message").fadeIn(500);
	
	// window.setTimeout(function() {
	// 	$("#"+type+"-message").fadeOut(500);
	// }, 3000); // Amount of time message should be shown.
	
	return type;
}
function stripSlashes(text) {
	if(!text) return "";
	return text.replace(/\\([\'\"])/,"$1");
}
function loading() {
	$("#loading").show();
}
function loaded() {
	$("#loading").hide();
}