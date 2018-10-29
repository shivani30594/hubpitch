const site_url = "http://localhost:3000/";
const Login = function () {
    const handleUserProfile = () => {
        $("#forgot_form").validate({
            errorElement: 'span', //default input error message container
            errorClass: 'error-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            ignore: "",
            rules: {
                firstName: {
                    required: true,
                },
                lastName: {
                    required: true,
                },
                companyName: {
                    required: true,
                }
            },
            submitHandler: function (form) {
                $.ajax({
                    url: site_url + 'update_user_details',
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        firstName: $('#profile_form input[name="firstName"]').val(),
                        lastName: $('#profile_form input[name="lastName"]').val(),
                        companyName: $('#profile_form input[name="companyName"]').val()
                    },
                    success: function (response) {
                        if (!response.success) {
                            return alert(JSON.stringify(response.message));
                        }
                        window.location.href = "/";
                    },
                    error: function (jqXHR, textStatus) {
                        alert("Request failed: " + textStatus);
                    }
                });
            }
        });
    }
    const handleAdminProfile = () => {

    }
    return {
        //main function to initiate the module
        init: function () {
            handleUserProfile();
            handleAdminProfile();
        }
    };
}
jQuery(document).ready(function () {
    Login.init();
});