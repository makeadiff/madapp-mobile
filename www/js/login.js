function init() {
    // Clear the existing things...
    localStorage.setItem("user_id", "");
    localStorage.setItem("city_id", "");
    localStorage.setItem("key", "");

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
        data.success = data.name;

        user_id = data.user_id;
        city_id = data.city_id;
        key = data.key;
        localStorage.setItem("user_id", user_id);
        localStorage.setItem("city_id", city_id);
        localStorage.setItem("key", key);

        location.href="index.html";

    } else {
        showMessage(data);
    }
}