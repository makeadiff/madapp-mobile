function init() {
    $("#login-form").submit(login);
}

function login(e) {
    e.stopPropagation();
    loading();

    var email = $("#email").val();
    var password = $("#password").val();
    if(!email || !password) showMessage({"error":"Please enter both username and password", "success":false});


    $.ajax({
        "url": base_url + "user_login?email="+email+"&password="+password,
        "dataType": "json",
    })
    .done(function(data) { loaded(); loginSuccess(data); })
    .fail(function(data) { loaded(); showMessage(data); });

    return false;
}

function loginSuccess(data) {
    if(data.success) {
        console.log(data);
        data.success = data.name;
        showMessage(data); // Done

        db.executeSql("DELETE FROM Setting WHERE name='email'");
        db.executeSql("DELETE FROM Setting WHERE name='user_id'");
        db.executeSql("DELETE FROM Setting WHERE name='key'");

        db.executeSql("INSERT INTO Setting (name,vaule) VALUES('email', '"+data.email+"), ('user_id', '"+data.user_id+"), ('key', '"+data.key+")");
        

    } else {
        showMessage(data);
    }
}