const userProfile = function () {
    $('.loader_hp_').hide('50');
    const profile_form = () => {
        $("#profile_form").validate({
            errorElement: 'span', //default input error message container
            errorClass: 'error-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            ignore: "",
            rules: {
                fname: {
                    required: true,
                },
                lname: {
                    required: true,
                }
            },
            submitHandler: function (form) {
                $('.loader_hp_').show('50');
                $.ajax({
                    url: '/admin/update_profile',
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        firstName: $('#fname').val(),
                        lastName: $('#lname').val()
                    },
                    success: function (response) {
                        if (!response.success) {
                            return alert(JSON.stringify(response.message));
                        }
                        if (response.success == true) {
                            $('.loader_hp_').hide('50');
                            alert(response.message);
                            location.reload();
                        }
                    },
                    error: function (jqXHR, textStatus) {
                        alert("Request failed: " + textStatus);
                    }
                });
            }
        });
    }
    return {
        //main function to initiate the module
        init: function () {
            profile_form();
        }
    };
}();
jQuery(document).ready(function () {
    userProfile.init();
});

function changePassword() {
    console.log($('#password').val());
    if ($('#password').val() == '') {
        alert('Please Give New Password Input');
    }
    else if ($('#confirm_password').val() == '') {
        alert('Please Give Confirm Password Input');
    } else if ($('#password').val() != $('#confirm_password').val()) {
        alert('Password & Confirm Password Should Be Same');
    } else {
        $('.loader_hp_').show('50');
        $.ajax({
            url: '/user/change_password',
            type: 'POST',
            dataType: 'json',
            data: {
                password: $('#password').val(),
            },
            success: function (response) {
                if (!response.success) {
                    return alert(JSON.stringify(response.message));
                }
                if (response.success == true) {
                    $('.loader_hp_').hide('50');
                    alert(response.message);
                    location.reload();
                }
            },
            error: function (jqXHR, textStatus) {
                alert("Request failed: " + textStatus);
            }
        });
    }
}