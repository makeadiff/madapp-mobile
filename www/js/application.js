var base_url = "http://localhost/Projects/Madapp/index.php/api/";
(function($) {
    "use strict";


    $( document ).on( "ready", function(){
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