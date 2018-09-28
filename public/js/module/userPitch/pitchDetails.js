const pitchDetails = function () {
    $(".loader_hp_").hide();
    const pitchShareModule = () => {
        $.ajax({
            url: 'http://localhost:3000/sharing_details',
            type: 'POST',
            dataType: 'json',
            data: {
                pitch_id: $(location).attr("href").split('/').pop(),
            },
            success: function (response) {
                if (!response.success) {
                    return alert(JSON.stringify(response.message));
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
            url: 'http://localhost:3000/get_notes',
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