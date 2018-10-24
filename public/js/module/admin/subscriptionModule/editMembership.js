const editMembership = function () {
    const editMambershipForm = () => {
        $("#membership_plan").validate({
            errorElement: 'span', //default input error message container
            errorClass: 'error-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            ignore: "",
            rules: {
                plan_name: {
                    required: true,
                    minlength: 3,
                },
                plan_price: {
                    required: true,
                    number: true
                }
            },
            submitHandler: function (form) {
                let accesstoken = getCookie('accesstoken');
                $.ajax({
                    url: '/admin/edit_membership_plan',
                    headers: {
                        'Accept': 'application/json',
                        "access-token": accesstoken
                    },
                    type: 'POST',
                    data: {
                        plan_id: $('#plan_id').val(),
                        plan_name: $('#plan_name').val(),
                        plan_price: $('#plan_price').val(),
                        unlimited_customer_pitches: $('#unlimited_customer_pitches').is(":checked"),
                        video_upload_editing: $('#video_upload_editing').is(":checked"),
                        pdf_upload: $('#pdf_upload').is(":checked"),
                        pitch_customization: $('#pitch_customization').is(":checked"),
                        powerpoint_upload: $('#powerpoint_upload').is(":checked"),
                        excel_upload: $('#excel_upload').is(":checked"),
                        word_upload: $('#word_upload').is(":checked"),
                        pitch_analytics: $('#pitch_analytics').is(":checked"),
                        pitch_notifications: $('#pitch_notifications').is(":checked"),
                        sharing_tracking: $('#recipient_sharing_tracking').is(":checked"),
                        user_to_customer_messaging: $('#user_to_customer_messaging').is(":checked"),
                        other_details: $('#exampleFormControlTextarea1').val()
                    },
                    success: function (response) {
                        if (!response.success) {
                            return alert(JSON.stringify(response.error));
                        }
                        if(response.success) {
                            alert(response.message);
                            location.reload();
                        }
                    },
                    error: function (jqXHR, textStatus) {
                        alert("Request failed: " + textStatus);
                    }
                });
                //form.submit();
            }
        });
    }
    return {
        //main function to initiate the module
        init: function () {
            editMambershipForm();
        }
    };
}();
jQuery(document).ready(function () {
    editMembership.init();
});