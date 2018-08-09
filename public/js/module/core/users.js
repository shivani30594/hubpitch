const getCookie = (name) => {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
}

const signout = () => {
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
    window.location.href = "/?logout=true";
}

// ME AJAX CALL
const meUser = () => {
    let userName = getCookie('cuser');
    if (userName == undefined) {
        let accesstoken = getCookie('accesstoken')
        $.ajax({
            type: 'POST',
            url: 'http://localhost:3000/me',
            headers: {
                'Accept': 'application/json',
                "access-token": accesstoken
            },
            method: 'POST',
            dataType: 'json',
            success: function (response) {
                if (!response.success) {
                    return alert(JSON.stringify(response.message));
                }
                let data = response.data[0];
                let name = data.first_name + ' ' + data.last_name;
                document.cookie = "cuser=" + name;
                let userName = getCookie('cuser');
                $('#c_user_box').text(userName);
            },
            error: function (jqXHR, textStatus) {
                alert("Request failed: " + textStatus);
            }
        });
    } else {
        $('#c_user_box').text(userName);
    }
};

// Test Function
function hello() {
    alert('Hello world! in func hello');
}
$(function () {
    $('div[onload]').trigger('onload');
});

const sendSupport = () => {
    let userName = getCookie('cuser');
    let accesstoken = getCookie('accesstoken')
    $.ajax({
        url: 'http://localhost:3000/send_support_message',
        type: 'POST',
        headers: {
            'Accept': 'application/json',
            "access-token": accesstoken
        },
        data: {
            support_message: $('#support_msg').val(),
            user_name: userName
        },
        success: function (response) {
            if (!response.success) {
                return alert(JSON.stringify(response.message));
            }

        },
        error: function (jqXHR, textStatus) {
            alert("Request failed: " + textStatus);
        }
    });
}
