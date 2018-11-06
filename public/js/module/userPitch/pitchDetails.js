const pitchDetails = function () {
    $(".loader_hp_").hide();
    const pitchShareModule = () => {
        $.ajax({
            url: site_url + 'sharing_details',
            type: 'POST',
            dataType: 'json',
            data: {
                pitch_id: $(location).attr("href").split('/').pop(),
            },
            success: function (response) {
                if (!response.success) {
                    return alert(JSON.stringify(response.message));
                }
                if (response.message == "No Data") {
                    console.log(response.message)
                    return
                }
                let dataHTML = '';
                response.data.forEach((obj) => {
                    if (obj) {
                        dataHTML = '<li> <div class="details-box"> <div class="sender_name details"> <label> Sender Name: </label> <span>' + obj.sender_name + '</span> </div> <div class="receiver_email_address details"> <label> Receiver Email Address: </label> <span>' + obj.receiver_email_address + '</span> </div> <div class="email_body details"> <label> Email Body: </label> <span>' + obj.email_body + '</span> </div> <div class="created details"> <label> Shared At : </label> <span>' + moment(obj.created).format("MMM DD YYYY HH:mm:ss", 'en') + '</span> </div>   </div></li>';
                        $('.ul_list_wapper_sharing').append(dataHTML);
                    }
                })
            },
            error: function (jqXHR, textStatus) {
                alert("Request failed: " + textStatus);
                $("#sign_in").reset();
            }
        });
    }

    return {
        init: function () {
            pitchShareModule();
        }
    }
}();
jQuery(document).ready(function () {
    pitchDetails.init();
});
const noteDetail = (id) => {
    if (id > 0) {
        $(".loader_hp_").show();
        $.ajax({
            url: site_url + 'get_notes',
            type: 'POST',
            dataType: 'json',
            data: {
                pitch_info_id: id,
            },
            success: function (response) {
                if (!response.success) {
                    return alert(JSON.stringify(response.message));
                }
                let dataHTML = '';
                $("#note_details").modal('show');
                response.data.forEach((obj) => {
                    if (obj) {
                        console.log(obj);
                        dataHTML = '<li> <div class="details-box"> <div class="sender_name details"> <label> Sender Name: </label> <span>' + obj.end_user_name + '</span> </div> <div class="email_body details"> <label> Note Text: </label> <span>' + obj.text + '</span> </div> <div class="created details"> <label> Created At : </label> <span>' + moment(obj.created).format("MMM DD YYYY HH:mm:ss", 'en') + '</span> </div>   </div></li>';
                        $('.ul_list_wapper_note').append(dataHTML);
                    }
                })
            },
            error: function (jqXHR, textStatus) {
                alert("Request failed: " + textStatus);
                $("#sign_in").reset();
            }
        });
        $(".loader_hp_").hide();
    } else {
        alert("User Haven't Created Note Yet!")
    }
}

function checkEmail(email) {
    var regExp = /(^[a-z]([a-z_\.]*)@([a-z_\.]*)([.][a-z]{3})$)|(^[a-z]([a-z_\.]*)@([a-z_\.]*)(\.[a-z]{3})(\.[a-z]{2})*$)/i;
    return regExp.test(email);
}

function checkEmails() {
    var emails = document.getElementById("emails").value;
    var emailArray = emails.split(",");
    let errorFlag = 0;
    for (i = 0; i <= (emailArray.length - 1); i++) {
        if (checkEmail(emailArray[i])) {
            //Do what ever with the email.
            //console.log(emailArray);
        } else {
            errorFlag = errorFlag + 1
            alert("invalid email: " + emailArray[i]);
        }
    }
    if (errorFlag === 0) {

        $('.loader_hp_').show('50');
        let accesstoken = getCookie('accesstoken');
        let sender_name = getCookie('cuser');
        console.log('sender_name', sender_name);
        var url = $(location).attr('href'),
            parts = url.split("/"),
            pitch_id = parts[parts.length - 1];
        $.ajax({
            url: site_url + 'share_pitch_user',
            headers: {
                'Accept': 'application/json',
                "access-token": accesstoken
            },
            method: 'POST',
            data: {
                email_id: JSON.stringify(emailArray),
                email_body: $('#email_body').val(),
                pitch_id: pitch_id,
                pitch_url: $('#public_link').val(),
                sender_name: $('#username_').val()
            },
            dataType: 'json',
            success: function (response) {
                if (!response.success) {
                    return alert(JSON.stringify(response.message));
                }
                $('.loader_hp_').hide('50');
                alert('Email Sent To Your Viewers, Please Reload The Page For See The Updated Page');
                //window.location.href = "/user/dashboard";
                location.reload();
            },
            error: function (jqXHR, textStatus) {
                alert("Request failed: " + textStatus);
            }
        });
    }
}