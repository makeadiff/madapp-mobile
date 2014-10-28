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

    } else {
        showMessage(data);
    }
}