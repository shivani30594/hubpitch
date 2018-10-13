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

function handlePaymentTable(amount) {
    console.log(amount)
    let payableamount = amount * 100
    $('.loader_hp_').show(); 
    let script = '<form action="/payment_status" method="POST"> <script src="https://checkout.stripe.com/checkout.js" class="stripe-button" data-key="pk_test_wAUwirtoVTeDYL0nEAvhKNjP" data-name="Hub Pitch Membership" data-amount="' + payableamount + '">  </form>';
    $("#submmiting").html(script);
    $("#stripe_confi").modal('show');
    $('.loader_hp_').hide();
}
$(document).ajaxComplete(function () {
    console.log('ajaxComplete');
});