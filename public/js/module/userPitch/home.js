const userPitch = function () {

    const handledashboardUI = () => {
        let accesstoken = getCookie('accesstoken')
        $.ajax({
            url: 'http://localhost:3000/get_user_pitchs',
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
                let data = response.data;
                let dataHTML = '';
                data.forEach((obj) => {
                    dataHTML = ''
                    if (obj) {
                        dataHTML = '<li> <a href="/user/pitch/viewer/' + obj.pitch_id + '"> <div class="list-left"> <div class="title"><h3>' + obj.company_name + '</h3></div> <div class="uploaded-txt">Uploaded ' + moment(obj.created).format("MMM DD YYYY HH:mm:ss", 'en') + '</div> </a> </div> <div class="list-right"> <div class="message" onclick="openConversation(' + obj.pitch_id + ')">' + obj.messages + ' New Messages</div> <div class="pages-num">' + obj.page_count + '<span>Pages</span></div> </div> </li>';
                        $('.ul_list_wapper').append(dataHTML);
                    }
                })
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
            url: 'http://localhost:3000/get_conversation',
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
                            dataHTML = '<li><a href="" onclick=openChat(' + obj.conversation_id + ')><span>' + obj.messages + '</span> Messages From ' + obj.sender + ' </a></li>';
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

function openChat(id) {
    if (id != undefined) {

    }
}