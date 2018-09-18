const pitchDetails = function () {
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
    const handleNewPitchFormUI = () => {
        $('#final_section').hide();
        $('#share_box').hide();
        $('.placeholder').hide();
        $('.preview_file').hide();
        $('.preview_file_image').hide();
        $('.preview_file_docs').hide();
        $('.preview_docx').hide();
        $('#main-box').addClass('active_one');

        $('#continue_btn_main').on("click", function () {
            if ($('#c-name').val() == '') {
                Swal('Validation Error', 'Company Name Is Required!', 'error')
            } else {
                $('.active_one').hide();
                $('#main-box').removeClass('active_one');
                $('.active_one').hide();
                $('div').removeClass('active_one');
                $(".current_preview").show('200');
            }
        });

        $(document).on("click", '.a_another_btn', function () {
            $('.current_preview').hide();
            $('.add_another_o').hide();
            $("div").removeClass("active_one");
            $(".another-page-blank").clone().appendTo(".add_box_here").addClass('add_another_o active_one').removeClass('another-page-blank');
            $('.active_one').show('200');
        })

        $(document).on("click", '.continue_btn', function () {
            $('.active_one').hide();
            $('div').removeClass('active_one');
            $(".current_preview").show('200');
        })

    }
    return {

        init: function () {
            pitchShareModule();
            handleNewPitchFormUI();
        }
    }
}();
jQuery(document).ready(function () {
    pitchDetails.init();
});