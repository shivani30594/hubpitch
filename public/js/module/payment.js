const Payment = function () {
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
    Payment.init();
});
const getCookie = (name) => {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
}

function handlePaymentTable(amount, id) {
    let user_id = getCookie('newtoken');
    if (user_id == undefined) {
        alert('Something Went Wrong With Token');
        window.location = '/'
    }
    let payableamount = amount * 100
    let encodedDataD = payableamount + ',' + user_id + ',' + id
    var encodedData = window.btoa(encodedDataD); // encode a string
    $('.loader_hp_').show();
    let script = '<form action="/payment_status/' + encodedData + '" method="POST"> <script src="https://checkout.stripe.com/checkout.js" class="stripe-button" data-key="pk_test_wAUwirtoVTeDYL0nEAvhKNjP" data-name="hubPitch Membership" data-amount="' + payableamount + '"> <input type="hidden" name="amount" value="' + amount + '" /> </form>';
    $("#" + id + "_submmiting").html(script);
    $("#" + id + "_stripe_confi").modal('show');
    $('.loader_hp_').hide();
}

function handlePaymentTableFree(id) {
    $('.loader_hp_').show();
    let user_id = getCookie('newtoken');
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