const Login = function () {
    const handleSignUp = function () {
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
                let firstName = $('#sign_up_form input[name="firstName"]').val();
                let lastName = $('#sign_up_form input[name="lastName"]').val();
                let email = $('#sign_up_form input[name="email"]').val();
                let DataJson =
                {
                    "firstName": firstName,
                    "lastName": lastName,
                    "email": email
                }
                fetch('http://localhost:3000/signup', {
                    method: 'post',
                    headers: {
                        'Accept': 'application/json',
                    },
                    body: DataJson
                }).then(function (response) {
                    console.log(response);
                    return response.json();
                }).then(function (myJson) {
                    console.log(myJson);
                });
                //form.submit();
            }
        });
    }
    return {
        //main function to initiate the module
        init: function () {
            handleSignUp();
        }
    };
}();

jQuery(document).ready(function () {
    Login.init();
});

