const userPitch = function () {

    const handledashboardUI = () => {
        let accesstoken = getCookie('accesstoken')
        $.ajax({
            url: site_url + 'get_user_pitchs',
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
                let dataHTML = '';
                let data = response.data;
                if (data == '') {
                    dataHTML = "<li> <h3> You haven't Created Pitch Yet ! </h3> </li>"
                    $('.ul_list_wapper').append(dataHTML);
                } else {
                    data.forEach((obj) => {
                        dataHTML = ''
                        if (obj) {
                            dataHTML = '<li> <a href="/user/pitch/viewer/' + obj.pitch_id + '"> <div class="list-left"> <div class="title"><h3>' + obj.company_name + '</h3></div> <div class="uploaded-txt">Uploaded ' + moment(obj.created).format("MMM DD YYYY HH:mm:ss", 'en') + '</div> </a> </div> <div class="list-right"> <div class="message" onclick="openConversation(' + obj.pitch_id + ')">' + obj.messages + ' New Messages</div> <div class="pages-num">' + obj.page_count + '<span>Pages</span></div> </div> </li>';
                            $('.ul_list_wapper').append(dataHTML);
                        }
                    })
                }

            },
            error: function (jqXHR, textStatus) {
                alert("Request failed: " + textStatus);
            }
        });
    }

    return {
        init: function () {
            handledashboardUI();
            openConversation();
        }
    };
}();
jQuery(document).ready(function () {
    userPitch.init();
});

function openConversation(id) {
    if (id != undefined) {
        let accesstoken = getCookie('accesstoken')
        $.ajax({
            url: site_url + 'get_conversation',
            headers: {
                'Accept': 'application/json',
                "access-token": accesstoken
            },
            method: 'POST',
            data: {
                pitch_id: id
            },
            success: function (response) {
                $('#conversation_list').html(' ');
                if (response.success == true) {
                    $('#conversation_box').modal('show');
                    let data = response.data;
                    let dataHTML = '';
                    data.forEach((obj) => {
                        dataHTML = ''
                        if (obj) {
                            dataHTML = '<li><a href="javascript:void(0)" onclick=openChat(' + obj.conversation_id + ',"' + obj.sender + '")><span>' + obj.messages + '</span> Messages From ' + obj.sender + ' </a></li>';
                            $('#conversation_list').append(dataHTML);
                        }
                    })
                } else {

                }
            },
            error: function (jqXHR, textStatus) {
                alert("Request failed: " + textStatus);
            }

        })
    }
}

function openChat(id, name) {
    if (id != undefined) {
        let accesstoken = getCookie('accesstoken')
        $.ajax({
            url: site_url + 'get_conversation_messages',
            headers: {
                'Accept': 'application/json',
                "access-token": accesstoken
            },
            method: 'POST',
            data: {
                conversation_id: id
            },
            success: function (response) {
                $('#message_body_p').html(' ');
                if (response.success == 'true') {
                    $('#conversation_box').modal('hide');
                    $('#conversation_modal').modal('show');
                    let data = response.data;
                    let dataHTML = '';
                    $('#name_place').html(name);
                    data.forEach((obj) => {
                        dataHTML = ''
                        if (obj) {
                            dataHTML = '<div class="msg-block' + (name != obj.sender ? " msg_reply" : "") + '"> <div class="m-name">' + (name != obj.sender ? "" : obj.sender) + '</div> <div class="m-time">' + moment(obj.created).format("MMM DD YYYY hh:mm A", 'en') + '</div> <div class="m-text"><p>' + obj.chat_text + '</p></div></div>';
                            $('#message_body_p').append(dataHTML);
                        }
                    })
                    let sendCreate = '<button type="submit" class="btn btn-warning btn-sm" id="btn-chat" onclick=reply(' + id + ',"' + name + '")> Send </button>';
                    $('#btn_place').html(sendCreate);
                    $.ajax({
                        url: site_url + 'mark_as_read_conversation',
                        headers: {
                            'Accept': 'application/json',
                            "access-token": accesstoken
                        },
                        method: 'POST',
                        data: {
                            conversation_id: id
                        },
                        success: function (response) {
                            if (response.success == true) {
                                console.log('MARK AS UNREAD');
                            } else {
                                console.log('SOMETHING WENT WRONG IN MARK AS UNREAD');
                            }
                        },
                        error: function (jqXHR, textStatus) {
                            console.log("Request failed: " + textStatus);
                        }
                    })
                }

            },
            error: function (jqXHR, textStatus) {
                alert("Request failed: " + textStatus);
            }

        })
    }
}

function reply(id, name) {
    let chat_text = $('#chat_message').val();
    let accesstoken = getCookie('accesstoken')
    if (chat_text != '') {
        $.ajax({
            url: site_url + 'reply_message',
            headers: {
                'Accept': 'application/json',
                "access-token": accesstoken
            },
            method: 'POST',
            data: {
                conversation_id: id,
                receiver: name,
                chat_text: chat_text
            },
            success: function (response) {
                if (response.success == "true") {
                    console.log('Message Send');
                    jQuery('#message_body_p').append('<div class="msg-block msg_reply"> <p>' + chat_text + '</p></div>');
                    $('#chat_message').val('');
                } else {
                    console.log('SOMETHING WENT WRONG IN SENDING MESSAGE');
                }
            },
            error: function (jqXHR, textStatus) {
                console.log("Request failed: " + textStatus);
            }
        })
    } else {
        alert('Please Enter Chat Message First!');
    }
}