const Upgrade = function () {
    const handlePaymentPage = () => {
        $('.loader_hp_').hide('250');
        $(document).on('click', '.stripe-custom', function (e) {
            e.preventDefault();
            $(".stripe-button-el").trigger("click");

        });
    }
    return {
        //main function to initiate the module
        init: function () {
            handlePaymentPage();
        }
    };
}();
jQuery(document).ready(function () {
    Upgrade.init();
});

function handlePaymentTable(amount, id, plan_key) {
    alert(plan_key);
    let user_id = getCookie('accesstoken');
    let payableamount = Math.round(amount * 100);
    let encodedDataD = payableamount + ',' + user_id + ',' + id + ',' + plan_key
    var encodedData = window.btoa(encodedDataD); // encode a string
    $('.loader_hp_').show();
    let script = '<form action="/user/upgrade_payment_status/' + encodedData + '" method="POST"> <script src="https://checkout.stripe.com/checkout.js" class="stripe-button" data-key="pk_test_nN2AAsg2jHlJxmCky4QOiuPe" data-name="hubPitch Membership" data-amount="' + payableamount + '"> <input type="hidden" name="amount" value="' + amount + '" /> </form>';
    $("#" + id + "_submmiting").html(script);
    $("#" + id + "_stripe_confi").modal('show');
    $('.loader_hp_').hide();
}


function handlePaymentTestingTable(amount, id) {
    let user_id = getCookie('accesstoken');
    let payableamount = Math.round(amount * 100);
    let encodedDataD = payableamount + ',' + user_id + ',' + id
    var encodedData = window.btoa(encodedDataD); // encode a string
    $('.loader_hp_').show();
    let script = '<form action="/user/upgrade_payment_test_status/' + encodedData + '" method="POST"> <script src="https://checkout.stripe.com/checkout.js" class="stripe-button" data-key="pk_test_nN2AAsg2jHlJxmCky4QOiuPe" data-name="hubPitch Membership" data-amount="' + payableamount + '"> <input type="hidden" name="amount" value="' + amount + '" /> </form>';
    $("#" + id + "_submmiting").html(script);
    $("#" + id + "_stripe_confi").modal('show');
    $('.loader_hp_').hide();
}

function handlePaymentTableFree(id) {
    $('.loader_hp_').show();
    let user_id = getCookie('accesstoken');
    if (user_id == undefined) {
        alert('Something Went Wrong With Token');
        window.location = '/'
    }
    $('.loader_hp_').hide('20');
    $("#" + id + "_stripe_confi").modal('show');
}

function signUpFree(id) {
    let user_id = getCookie('newtoken');
    let encodedDataD = user_id + ',' + id
    var encodedData = window.btoa(encodedDataD); // encode a string
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
                window.location = '/welcome'
            } else {
                alert('Something Went Wrong!')
            }
        },
        error: function (jqXHR, textStatus) {
            alert("Request failed: " + textStatus);
        }
    });
}

$(document).ajaxComplete(function () {
    console.log('ajaxComplete');
});

function cancelSubscription() {
    var txt;
    var r = confirm("Are you want to cancel your subscription plan!");
    if (r == true) {
        txt = "You pressed OK!";
        console.log("ok");
        let accesstoken = getCookie('accesstoken');
        $.ajax({
            url: site_url + 'deactivate_user',
            headers: {
                'Accept': 'application/json',
                "access-token": accesstoken
            },
            method: 'POST',
            success: function (response) {
                if (response.success == true) {
                    alert(response.message);
                    window.location = '/';
                    //location.reload();
                } else {
                    console.log(response.success, response.message);
                    alert('SOMETHING WENT WRONG IN SENDING MESSAGE1');
                }
            },
            error: function (jqXHR, textStatus) {
                console.log("Request failed: " + textStatus);
            }
        })
    } else {
        txt = "You pressed Cancel!";
    }
}

const handleSignUp = () => {
    $('.loader_hp_').hide('50');
    $("#sign_up_form").validate({
        errorElement: 'span', //default input error message container
        errorClass: 'error-block', // default input error message class
        focusInvalid: false, // do not focus the last invalid input
        ignore: "",
        rules: {
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
                    firstName: $('#sign_up_form input[name="firstName"]').val(),
                    lastName: $('#sign_up_form input[name="lastName"]').val(),
                    email: $('#sign_up_form input[name="email"]').val()
                },
                success: function (response) {
                    if (response.error) {
                        console.log(response.error);
                        alert(response.error.details[0].message);
                    }
                    if (response.success == false) {
                        alert(response.message);
                        $('#sign_up_form').trigger("reset");
                        $('.loader_hp_').hide('50');
                    }
                    if (response.success) {
                        document.cookie = "newtoken=" + response.token;
                        $('.loader_hp_').hide('50');
                        alert("You will be redirected to a new page in 5 seconds");
                        setTimeout(window.location = "/payment", 5000);
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