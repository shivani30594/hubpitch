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
                    console.log(obj);
                    if (obj) {
                        dataHTML = '<li> <div class="list-left"> <div class="title"><h3>' + obj.company_name + '</h3></div> <div class="uploaded-txt">Uploaded: June 14th, 2018</div> </div> <div class="list-right"> <div class="message" data-toggle="modal" data-target="#messageModal">2 New Messages</div> <div class="pages-num">' + obj.page_count + '<span>Pages</span></div> </div> </li>';
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
        }
    };
}();
jQuery(document).ready(function () {
    userPitch.init();
});