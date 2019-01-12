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

function handlePaymentTable(amount, id) {
    let user_id = getCookie('accesstoken');   
    let payableamount = amount * 100
    let encodedDataD = payableamount + ',' + user_id + ',' + id
    var encodedData = window.btoa(encodedDataD); // encode a string
    $('.loader_hp_').show();
    let script = '<form action="/user/upgrade_payment_status/' + encodedData + '" method="POST"> <script src="https://checkout.stripe.com/checkout.js" class="stripe-button" data-key="pk_test_nN2AAsg2jHlJxmCky4QOiuPe" data-name="hubPitch Membership" data-amount="' + payableamount + '"> <input type="hidden" name="amount" value="' + amount + '" /> </form>';
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