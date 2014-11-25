//var base_url = "http://localhost/Projects/Madapp/index.php/api/";
var base_url = "http://makeadiff.in/madapp/index.php/api/";
var user_id = 0;
var city_id = 0;
var key = "am3omo32hom4lnv32vO";
var db;
var config = {};

(function($) {
    "use strict";

	if (localStorage.getItem("user_id")) {
		user_id = localStorage.getItem("user_id");
		city_id = localStorage.getItem("city_id");
		key = localStorage.getItem("key");
	}

    // $( document ).on( "ready", function(){
    if(window.init && typeof window.init == "function") init(); //If there is a function called init(), call it on load 
    // });

    $( document ).on( "deviceready", function(){
    	cordova.exec(null, null, "SplashScreen", "hide", []);
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