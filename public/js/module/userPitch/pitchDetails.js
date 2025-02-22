const pitchDetails = function () {
    $(".loader_hp_").hide();
    $('#share_box').hide();
    const pitchShareModule = () => {
        let accesstoken = getCookie('accesstoken');
        $.ajax({
            url: site_url + 'sharing_details',
            type: 'POST',
            headers: {
                'Accept': 'application/json',
                "access-token": accesstoken
            },
            dataType: 'json',
            data: {
                pitch_id: $(location).attr("href").split('/').pop(),
            },
            success: function (response) {
                if (!response.success) {
                    return alert(JSON.stringify(response.message));
                }
                if (response.message == "No Data") {
                    let data = '';
                    data = '<li> You have empty sharing information!!</li>';
                    $('.ul_list_wapper_sharing').append(data);
                }
                else {
                    let dataHTML = '';
                    let i = 1;
                    response.data.forEach((obj) => {

                        if (obj.sharing_tracking_permission != "false") {
                            dataHTML = ''
                            if (obj) {
                                dataHTML = '<li> <div class="details-box"> <div class="sender_name details"> <label> Sender Name: </label> <span>' + obj.sender_name + '</span> </div> <div class="receiver_email_address details"> <label> Receiver Email Address: </label> <span>' + obj.receiver_email_address + '</span> </div> <div class="email_body details"> <label> Email Body: </label> <span>' + obj.email_body + '</span> </div> <div class="created details"> <label> Shared At : </label> <span>' + moment(obj.created).format("MMM DD YYYY HH:mm:ss", 'en') + '</span> </div>   </div></li>';
                                $('.ul_list_wapper_sharing').append(dataHTML);
                            }
                        }
                        else {
                            dataHTML = ''
                            if (i == 1) {
                                dataHTML = `<li> <div class="details-box"> <a href="${site_url}user/upgrade" style="text-decoration: underline !important;">You must upgrade your account to Premier Subscription in order to see pitch sharing information.</a> </div></li>`;
                                $('.ul_list_wapper_sharing').append(dataHTML);
                                i++;
                            }

                        }
                    })
                }
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
    var str = window.location.href; //window.location.href; 
    str = str.replace("?publish=publish", '');
    $('#pitch_id').val((str.split("/")[6]));
    pitchDetails.init();
    $(document).on("click", '.publish', function () {
        $('#final_name').val($('.company_name').text().trim())
    })
});
const noteDetail = (id) => {
    let dataHTML = '';
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

                // $("#close").click(function () {
                //     $('.added').remove();

                // });
                $('.temp').remove();
                $("#note_details").modal('show');
                response.data.forEach((obj) => {
                    if (obj) {
                        console.log(obj);
                        dataHTML = '<li class="temp"> <div class="details-box"> <div class="sender_name details"> <label> Sender Name: </label> <span>' + obj.end_user_name + '</span> </div> <div class="email_body details"> <label> Note Text: </label> <span>' + obj.text + '</span> </div> <div class="created details"> <label> Created At : </label> <span>' + moment(obj.created).format("MMM DD YYYY HH:mm:ss", 'en') + '</span> </div>   </div></li>';
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
    //alert(emails);
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
        tinyMCE.triggerSave();
        let s = document.getElementById("email_body").value;
        let t = s.replace(/<[^>]+>/g, '');
        let p = t.replace(/\&nbsp;/g, '');


        if (p.trim() == '') {
            alert("Email information can't be empty");
            $('#email_body').val('');
        }
        else {

            $('.loader_hp_').show('50');
            let accesstoken = getCookie('accesstoken');
            let sender_name = getCookie('cuser');
            // var url = $(location).attr('href'),
            //     parts = url.split("/"),
            //     pitch_id = parts[parts.length - 1];
            var str = window.location.href; //window.location.href; 
            str = str.replace("?publish=publish", '');
            pitch_id = str.split("/")[6];
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
                    window.location.href = "/user/dashboard";
                    //location.reload();
                },
                error: function (jqXHR, textStatus) {
                    alert("Request failed: " + textStatus);
                }
            });
        }
    }

}
function checkEmailsShare() {

    if ($('#email_body_share').val().trim() == '') {
        alert("Email information can't be empty");
        $('#email_body_share').val('');
    }
    else if ($('#emails_share').val().trim() == '') {
        alert("Recipients Email information can't be empty");
        $('#emails_share').val('');
    }
    else {
        var emails = document.getElementById("emails_share").value;
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

            tinyMCE.triggerSave();
            $('.loader_hp_').show('50');
            let accesstoken = getCookie('accesstoken');
            let sender_name = getCookie('cuser');
            // var url = $(location).attr('href'),
            //     parts = url.split("/"),
            //     pitch_id = parts[parts.length - 1];
            var str = window.location.href; //window.location.href; 
            str = str.replace("?publish=publish", '');
            pitch_id = str.split("/")[6];
            $.ajax({
                url: site_url + 'share_pitch_user',
                headers: {
                    'Accept': 'application/json',
                    "access-token": accesstoken
                },
                method: 'POST',
                data: {
                    email_id: JSON.stringify(emailArray),
                    email_body: $('#email_body_share').val(),
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
                    window.location.href = "/user/dashboard";
                    //location.reload();
                },
                error: function (jqXHR, textStatus) {
                    alert("Request failed: " + textStatus);
                }
            });
        }
    }
}

function pitchViewerDetails(id) {
    let accesstoken = getCookie('accesstoken');
    $(".loader_hp_").show('50');
    $.ajax({
        url: site_url + 'viewer/analysis',
        type: 'POST',
        headers: {
            'Accept': 'application/json',
            "access-token": accesstoken
        },
        dataType: 'json',
        data: {
            pitch_info_id: id,
        },
        success: function (response) {
            let data = response.data;
            let dataHTML = '';
            let i = 1;
            $('#viewer_details').html(' ');
            data.forEach((obj) => {
                if (obj.analytics_permission != "false") {
                    dataHTML = ''
                    if (obj) {
                        dataHTML = '<div class="col-md-4 col-sm-4 col-xs-12"> <div class="viewer-info text-center"> <div class="primary"> <p class="lable">' + obj.full_name + '</p> <p>' + obj.job_title + '</p> </div> <p class="total-view"><span class="lable">Views:</span>' + obj.views + '</p><div class="viewer-time"> <p class="lable">viewing Time:</p> <p>' + moment.utc(obj.viewing_time * 1000).format('HH:mm:ss') + '</p> </div> <div class="last-view-time"> <p class="lable">last View:</p> <p> ' + moment(obj.utc_datetime).format("MMM DD YYYY hh:mm A", 'en') + '</p> </div> </div> </div>';
                        $('#viewer_details').append(dataHTML);
                    }
                }
                else {
                    dataHTML = ''
                    if (i == 1) {
                        dataHTML = `<div class="col-md-12 col-sm-12 col-xs-12"> <div class="viewer-info text-center"> <div class="primary"> <a href="${site_url}user/upgrade" style="text-decoration: underline !important;">You must upgrade your account to Premier Subscription in order  to see pitch details..</a> </div> </div> </div>`;
                        $('#viewer_details').append(dataHTML);
                        i++;
                    }
                    // return false; 
                    // break; 
                }
            })
            $('#viewer_analysis').modal('show');
            $(".loader_hp_").hide('50');
        },
        error: function (jqXHR, textStatus) {
            alert("Request failed: " + textStatus);
            $("#sign_in").reset();
        }
    });
}

function createDrafLink() {
    //  $('#pitch_id').val(response.pitch);
    //      alert(('#pitch_id').val());   
    let accesstoken = getCookie('accesstoken');
    var allow_notification = $('#allow_notification').is(":checked");
    var allow_messaging = $('#allow_messaging').is(":checked");
    var allow_share = $('#allow_share').is(":checked");




    if (allow_notification == undefined && allow_messaging == undefined && allow_share == undefined) {
        allow_notification, allow_messaging, allow_share = false
    }

    $.ajax({
        url: site_url + 'link_draf',
        headers: {
            'Accept': 'application/json',
            "access-token": accesstoken
        },
        method: 'POST',
        data: {
            pitch_id: $('#pitch_id').val(),
            allow_notification: allow_notification,
            allow_messaging: allow_messaging,
            allow_share: allow_share
        },
        dataType: 'json',
        success: function (response) {
            if (!response.success) {
                return alert(JSON.stringify(response.message));
            }
            console.log("response" + response.data);
            let linkValue = site_url + 'viewer/' + response.data
            $('#share_box').show();
            $('.draf_galley').hide();
            $('#link_value').attr("href", linkValue);
            $('.link_value').text(linkValue);
            $('#pitch_name_t').html($('#final_name').val());

            //$('#final_name').val($('.company_name').text().trim())
            $('#publish_pitch').modal('hide');
        },
        error: function (jqXHR, textStatus) {
            alert("Request failed: " + textStatus);
        }
    });

}
function copyToClipboard(element) {
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val($(element).text()).select();
    document.execCommand("copy");
    $temp.remove();
    alert('Link Coppied In ClipBoard!')
}

function discardPitch() {
    var x = confirm("Are You Sure You Want To Discard This Pitch?");
    if (x) {
        let accesstoken = getCookie('accesstoken')
        let id = $('#pitch_id').val();
        $.ajax({
            url: site_url + 'detele_pitch',
            headers: {
                'Accept': 'application/json',
                "access-token": accesstoken
            },
            method: 'POST',
            data: {
                pitch_delete_type: 'full',
                pitch_id: id,
            },
            success: function (response) {
                if (response.success == "true") {
                    alert('Pitch Discard Successfully!');
                    window.location.href = "/pitch/add";
                } else {
                    console.log(response.message);
                    alert('SOMETHING WENT WRONG IN SENDING MESSAGE');

                }
            },
            error: function (jqXHR, textStatus) {
                console.log("Request failed: " + textStatus);
            }
        })
    }
}

tinymce.init({
    selector: "#email_body",
    theme: "modern",
    height: 300,
    plugins: [
        "searchreplace",
        "save table contextmenu directionality emoticons template paste textcolor"
    ],
    toolbar: "undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent | forecolor backcolor emoticons",

    style_formats: [
        { title: 'Bold text', inline: 'b' },
        { title: 'Red text', inline: 'span', styles: { color: '#ff0000' } },
        { title: 'Red header', block: 'h1', styles: { color: '#ff0000' } },
        { title: 'Example 1', inline: 'span', classes: 'example1' },
        { title: 'Example 2', inline: 'span', classes: 'example2' },
        { title: 'Table styles' },
        { title: 'Table row 1', selector: 'tr', classes: 'tablerow1' }
    ]
});