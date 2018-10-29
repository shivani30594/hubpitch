const site_url = "http://localhost:3000/";
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
            url: site_url + 'me',
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
    $('.loader_header_').show('20');
    $.ajax({
        url: site_url+'send_support_message',
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
            if (response.success == "true") {
                $('.loader_header_').hide('70');
                alert(response.message);
                location.reload();
            }
        },
        error: function (jqXHR, textStatus) {
            alert("Request failed: " + textStatus);
        }
    });
}

function search(id) {
    $('.search_res_display').html(' ')
    if ($('#search_box').val().length >= 3) {
        $('.loader_header_').show('20');
        $.ajax({
            url: '/user/search_pitch',
            type: 'POST',
            headers: {
                'Accept': 'application/json',
            },
            data: {
                search_key: $('#search_box').val()
            },
            success: function (response) {
                if (!response.success) {
                    return alert(JSON.stringify(response.message));
                }
                if (response.success == "true") {
                    $('.loader_header_').hide('70');
                    console.log(response);
                    let dataHTML = '';
                    response.data.forEach((obj) => {
                        dataHTML = ''
                        if (obj) {
                            dataHTML = '<li> <a class="search_link" href="/user/pitch/viewer/' + obj.pitch_id + '"> ' + obj.company_name + ' </a> </li>';
                            $('.search_res_display').append(dataHTML);
                        }
                    })
                }
                else if (response.success == "search_fail") {
                    $('.loader_header_').hide('70');
                    alert(response.message);
                    return
                }
            },
            error: function (jqXHR, textStatus) {
                alert("Request failed: " + textStatus);
            }
        });
    }
}

$(document).on("click", '.search_link', () => {
    jQuery('.loader_header_').show('20');
})
jQuery(document).ready(function () {
    jQuery('.loader_header_').hide('50');
});