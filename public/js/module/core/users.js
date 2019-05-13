const site_url = "http://localhost:3000/";
//const site_url = "http://54.200.57.240:3000/";
//const site_url = "http://www.bundle-hubpitch.com:80/";
const getCookie = (name) => {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
}

const signout = () => {
    var cookies = document.cookie.split(";");
    for (var i = cookies.length - 1; i >= 0; i--) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        //console.log(name);
        //document.cookie = "accesstoken" + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
        // document.cookie = "accesstoken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        // document.cookie = "accesstoken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        // "accesstoken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"      
        document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        // console.log("dc", document.cookie);
        // document.cookie.clearCookie(name);   
    }

    window.location.href = "/?logout=true";
}
var delete_cookie = function (name) {
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
};
const removeCookies = () => {

    // document.cookie = "username=" + "John Doe"; "expires=" + Date.now();
    //document.cookie = "  accesstoken=";
    // document.cookie = "amt=" + 'cbvcn';
    // document.cookie = "accesstoken=" + '';

    // var res = document.cookie;
    // var multiple = res.split(";");
    // console.log("before", document.cookie);

    // for (var i = 0; i < multiple.length; i++) {
    //     var key = multiple[i].split("=");
    //     console.log('key => ', key[0]);
    //     if (key[0].trim() == "accesstoken") {
    //         console.log('accesstocken => ');

    //         document.cookie.set('accesstoken', "");
    //         document.cookie.set(key[1], "");
    //         document.cookie.remove("accesstoken", "");
    //         document.cookie.remove(key[1], "");
    //     }
    //     document.cookie.set("accesstoken", "");
    //     document.cookie.set(key[1], "");
    //     document.cookie.remove("accesstoken", "");
    //     document.cookie.remove(key[1], "");
    //     console.log('document.cookie => ', document.cookie);

    //     // document.cookie = key[0] + " =; expires = Thu, 01 Jan 1970 00:00:00 UTC";
    //     // console.log("before", document.cookie);
    //     // document.cookie.set(key[0], "");
    //     // console.log("after", document.cookie);
    // }
    // console.log("after", document.cookie);
    // 
    // console.log("cooke", res);
    //cookieHelper.setCookie('jwt', '', 0)
    //window.location.href = "/?logout=true";
}

// ME AJAX CALL
const meUser = () => {
    let userName = getCookie('cuser');
    let company_name = getCookie('company_name');
    console.log("hello", window.location.href);

    if (userName == undefined || company_name == undefined) {

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
                console.log("response", response);
                if (!response.success) {
                    alert(response.error.details[0].message);
                    window.location.href = "/";

                }
                else {
                    //console.log("data",response);
                    let data = response.data[0];
                    let name = data.first_name + ' ' + data.last_name;
                    let company_name = data.company_name;

                    if (company_name == null && window.location.href != site_url + "user/profile") {
                        $('#MessageModal').modal('show');
                    }
                    document.cookie = "cuser=" + name;
                    document.cookie = "ucompany=" + company_name;
                    let userName = getCookie('cuser');
                    $('#c_user_box').text(userName);
                    $('#company_name_user').text(company_name);
                }
            },
            error: function (jqXHR, textStatus) {
                alert("Request failed: " + "Failed to authenticate token");
                window.location.href = "/";
            }
        });
    } else {

        $('#c_user_box').text(userName);
        $('#company_name_user').text(company_name);
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
    console.log("sendSupport");
    let userName = getCookie('cuser');
    let accesstoken = getCookie('accesstoken');
    $('.loader_header_').show('20');
    if ($('#support_msg').val().trim() == '') {
        $('.loader_header_').hide('70');
        alert("Support msg should not be empty!!");
        $('#support_msg').val('');
    }
    else {
        $.ajax({
            url: site_url + 'send_support_message',
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
                    $('.loader_header_').hide('70');
                    alert('Something went wrong!!');
                    location.reload();
                }
                if (response.success == "true") {
                    $('.loader_header_').hide('70');
                    alert(response.message);
                    location.reload();
                }
            },
            error: function (jqXHR, textStatus) {
                $('.loader_header_').hide('70');
                alert("Request failed: " + textStatus);
            }
        });
    }
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
                    $('.loader_header_').hide('70');
                    alert(JSON.stringify(response.message));
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
                    $('.loader_header_').hide('10');
                    $('#search_box').val('');
                    return alert(response.message);

                }
            },
            error: function (jqXHR, textStatus) {
                $('.loader_header_').hide('70');
                alert("Request failed: " + textStatus);
            }
        });
    }
}

$(document).on("click", '.search_link', () => {
    jQuery('.loader_header_').show('20');
})
$(document).ready(function () {
    jQuery('.loader_header_').hide('50');
});
$(document).mouseup(function (e) {
    var container = $(".account");
    if (!container.is(e.target) && container.has(e.target).length === 0) {
        var containerss = $(".logged-event");
        containerss.fadeOut();
        // $(".account-sub-menu").toggleClass("show-menu");
    }
    else {
        var containerss = $(".logged-event");
        containerss.fadeIn();
    }
});
