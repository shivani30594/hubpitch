const Login = function () {
    const handleSignUp = () => {
        $("#sign_up_form").validate({
            errorElement: 'span', //default input error message container
            errorClass: 'error-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            ignore: "",
            rules: {
                firstName: {
                    required: true
                },
                lastName: {
                    required: true
                },
                email: {
                    required: true,
                    email: true
                }
            },
            submitHandler: function (form) {
                $.ajax({
                    url: 'http://localhost:3000/signup',
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        firstName: $('#sign_up_form input[name="firstName"]').val(),
                        lastName: $('#sign_up_form input[name="lastName"]').val(),
                        email: $('#sign_up_form input[name="email"]').val()
                    },
                    success: function (response) {
                        if (!response.success) {
                            return alert(JSON.stringify(response.error));
                        }
                        console.log(response)
                    },
                    error: function (jqXHR, textStatus) {
                        alert("Request failed: " + textStatus);
                    }
                });
                //form.submit();
            }
        });
    }
    const fogotPassword = () => {
        $("#forgot_form").validate({
            errorElement: 'span', //default input error message container
            errorClass: 'error-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            ignore: "",
            rules: {
                email: {
                    required: true,
                    email: true
                }
            },
            submitHandler: function (form) {
                $.ajax({
                    url: 'http://localhost:3000/forgot_password',
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        email: $('#forgot_form input[name="email"]').val()
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
    const resetPassword = () => {
        $("#reset_form").validate({
            errorElement: 'span', //default input error message container
            errorClass: 'error-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            ignore: "",
            rules: {
                password: {
                    required: true,
                    minlength: 5,
                },
                cpassword: {
                    required: true,
                    equalTo: "#password"
                },

            },
            submitHandler: function (form) {
                $.ajax({
                    url: 'http://localhost:3000/reset_password',
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        token: $('#reset_form input[name="reset-token"]').val(),
                        password: $('#reset_form input[name="password"]').val(),
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
    const handleLogin = () => {
        $("#sign_in").validate({
            errorElement: 'span', //default input error message container
            errorClass: 'error-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            ignore: "",
            rules: {
                email: {
                    required: true,
                    email: true
                },
                password: {
                    required: true,
                }
            },
            submitHandler: function (form) {
                $.ajax({
                    url: 'http://localhost:3000/signin',
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        email: $('#sign_in input[name="email"]').val(),
                        password: $('#sign_in input[name="password"]').val()
                    },
                    success: function (response) {
                        if (!response.success) {
                            return alert(JSON.stringify(response.message));
                        }
                        document.cookie = "accesstoken=" + response.accesstoken;
                        window.location.href = "/" + response.url;
                    },
                    error: function (jqXHR, textStatus) {
                        alert("Request failed: " + textStatus);
                        $("#sign_in").reset();
                    }
                });
            }
        });
    }
    return {
        //main function to initiate the module
        init: function () {
            handleLogin();
            handleSignUp();
            fogotPassword();
            resetPassword();
        }
    };

}();

jQuery(document).ready(function () {
    Login.init();
});

