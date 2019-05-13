const getCookie = (name) => {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
}
const Login = function () {
    const handleSignUp = () => {

        $('.loader_hp_').hide('50');
        $("#sign_up_form").validate({
            errorElement: 'span', //default input error message container
            errorClass: 'error-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            ignore: "",
            rules: {
                charge_id: {
                    required: true,
                    minlength: 3
                },
                firstName: {
                    required: true,
                    minlength: 3
                },
                lastName: {
                    required: true,
                    minlength: 3
                },
                email: {
                    required: true,
                    email: true
                }
            },
            submitHandler: function (form) {
                $('.loader_hp_').show('50');
                $.ajax({
                    url: '/signup',
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        charge_id: $('#sign_up_form input[name="charge_id"]').val(),
                        firstName: $('#sign_up_form input[name="firstName"]').val(),
                        lastName: $('#sign_up_form input[name="lastName"]').val(),
                        email: $('#sign_up_form input[name="email"]').val(),
                    },
                    success: function (response) {
                        if (response.error) {
                            alert(response.error.details[0].message);
                        }
                        if (response.success == false) {
                            if (response.message != undefined) {
                                alert(response.message);
                            }
                            $('#sign_up_form').trigger("reset");
                            $('.loader_hp_').hide('50');
                        }
                        if (response.success) {

                            document.cookie = "newtoken=" + response.token;
                            /************************************************** For Payement Description Based on their Plan choosen ***********************************************/
                            chargeid = $('#sign_up_form input[name = "charge_id"]').val();
                            if (chargeid == "free") {
                                id = getCookie('planid');
                                encodedDataD = response.token + ',' + id;
                                encodedData = window.btoa(encodedDataD); // encode a string                            
                                $.ajax({
                                    url: '/sign_up_free/' + encodedData,
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
                                        if (response.success == 'true') {
                                            // $('.loader_hp_').hide('50');
                                            alert("You will be redirected to a new page in 5 seconds");
                                            window.location = '/welcome'
                                        }
                                        else {
                                            alert('Something Went Wrong!');
                                        }
                                    },
                                    error: function (jqXHR, textStatus) {
                                        alert("Request failed: " + textStatus);
                                    }
                                });
                            }
                            else {
                                id = getCookie('planid');
                                encodedDataD = response.token + ',' + id + ',' + chargeid;
                                encodedData = window.btoa(encodedDataD); // encode a string                            
                                $.ajax({
                                    url: '/payment_done/' + encodedData,
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
                                        if (response.success == 'true') {
                                            // $('.loader_hp_').hide('50');
                                            alert("You will be redirected to a new page in 5 seconds");
                                            window.location = '/welcome'
                                        }
                                        else {
                                            alert('Something Went Wrong!')
                                        }
                                    },
                                    error: function (jqXHR, textStatus) {
                                        alert("Request failed: " + textStatus);
                                    }
                                });
                            }
                        }
                    },
                    error: function (jqXHR, textStatus) {
                        alert("Request failed: " + textStatus);
                    }
                });
                // form.submit();
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
                    url: '/forgot_password',
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        email: $('#forgot_form input[name="email"]').val()
                    },
                    success: function (response) {
                        if (!response.success) {
                            return alert(JSON.stringify(response.message));
                        }
                        alert(response.message)
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
                    url: '/reset_password',
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        token: $('#reset_form input[name="reset-token"]').val(),
                        password: $('#reset_form input[name="password"]').val(),
                    },
                    success: function (response) {
                        if (response.error) {
                            alert(response.error.details[0].message);
                            // $('#reset_form').trigger("reset");
                        }
                        if (!response.success) {
                            if (response.message != undefined) {
                                alert(response.message);
                                $('#reset_form input').trigger("reset");
                            }
                            //return alert(JSON.stringify(response.message));
                        }
                        if (response.success) {
                            alert(response.message)
                            window.location.href = "/";
                        }
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
                    url: '/signin',
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        email: $('#sign_in input[name="email"]').val(),
                        password: $('#sign_in input[name="password"]').val()
                    },
                    success: function (response) {
                        if (!response.success) {
                            // $("#success-alert").fadeTo(5000, 500).slideUp(500, function () {
                            //     $("#success-alert").slideUp(500);
                            // });
                            $("#success-alert").show();
                            return alert(JSON.stringify(response.message));
                        }
                        // document.cookie = "accesstoken=" + response.accesstoken;
                        // window.location.href = "/" + response.url;
                        if (response.data == "login") {
                            document.cookie = "accesstoken=" + response.accesstoken;
                            window.location.href = "/" + response.url;
                        }
                        else {
                            document.cookie = "accesstoken=" + response.accesstoken;
                            window.location.href = "/" + response.url;
                            //setTimeout(window.location = "/payment", 5000);
                        }

                        // document.cookie = "newtoken=" + response.token;
                        // $('.loader_hp_').hide('50');
                        // alert("You will be redirected to a new page in 5 seconds");
                        // setTimeout(window.location = "/payment", 5000);                 


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
    //$("#success-alert").hide();
    Login.init();
});

