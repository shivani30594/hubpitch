const db = require("./db");
const Paypal = require('paypal-express-checkout');

class paymentController {
    static async paymentPayPal(req, res, next) {
        var paypal = Paypal.init('username', 'password', 'signature', 'http://www.example.com/return', 'http://www.example.com/cancel', true);

        // Localization (OPTIONAL): https://developer.paypal.com/docs/classic/api/locale_codes/
        // paypal.locale = 'SK';
        // or
        // paypal.locale = 'en_US';

        // checkout
        // requireAddress = optional, defaults to false
        // paypal.pay('Invoice number', amount, 'description', 'currency', requireAddress, customData, callback);
        // paypal.pay('20130001', 123.23, 'iPad', 'EUR', function(err, url) {
        // or with "requireAddress": true
        paypal.pay('20130001', 123.23, 'iPad', 'EUR', true, ['custom', 'data'], function (err, url) {
            if (err) {
                console.log(err);
                return;
            }

            // redirect to paypal webpage
            response.redirect(url);
        });

        // result in GET method
        // paypal.detail('token', 'PayerID', callback);
        // or
        // paypal.detail(totaljs.controller, callback);

        paypal.detail('EC-788441863R616634K', '9TM892TKTDWCE', function (err, data, invoiceNumber, price, custom_data_array) {

            // custom_data_array {String Array} - supported in +v1.6.3

            if (err) {
                console.log(err);
                return;
            }

            // data.success == {Boolean}

            if (data.success)
                console.log('DONE, PAYMENT IS COMPLETED.');
            else
                console.log('SOME PROBLEM:', data);

            /*
            data (object) =
            { TOKEN: 'EC-35S39602J3144082X',
              TIMESTAMP: '2013-01-27T08:47:50Z',
              CORRELATIONID: 'e51b76c4b3dc1',
              ACK: 'Success',
              VERSION: '52.0',
              BUILD: '4181146',
              TRANSACTIONID: '87S10228Y4778651P',
              TRANSACTIONTYPE: 'expresscheckout',
              PAYMENTTYPE: 'instant',
              ORDERTIME: '2013-01-27T08:47:49Z',
              AMT: '10.00',
              TAXAMT: '0.00',
              CURRENCYCODE: 'EUR',
              PAYMENTSTATUS: 'Pending',
              PENDINGREASON: 'multicurrency',
              REASONCODE: 'None' };
            */

        });
    }
}
module.exports = paymentController;