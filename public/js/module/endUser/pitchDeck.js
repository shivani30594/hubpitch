const pitchDeck = function () {
    const handlePitchDeck = () => {
        console.log('HubPitch :) ');
        let pitchToken = $(location).attr("href").split('/').pop();
        if (pitchToken == '') {
            alert('SOME THING WENT WRONG');
            return false;
        }
        setTimeout(function () {
            $.ajax({
                url: 'http://localhost:3000/pitch-analytics',
                headers: {
                    'Accept': 'application/json',
                },
                method: 'POST',
                dataType: 'json',
                data: {
                    pitch_token: pitchToken
                },
                success: function (response) {
                    if (!response.success) {
                        return alert(JSON.stringify(response.message));
                    }
                },
                error: function (jqXHR, textStatus) {
                    alert("Request failed: " + textStatus);
                }
            });
        }, 3000);
    }

    const handlePitchDeckAnalytics = () => {
        let currentPage = '';
        let counterSeconds = '';
        var seconds = 0;
        $(document).on("click", '.btn-prev', function () {
            currentPage = $('.slick-active .current').text();
            console.log('currentPage', currentPage);
        });

        $(document).on("click", '.btn-next', function () {
            currentPage = $('.slick-active .current').text();
            console.log('currentPage', currentPage);
        });
    }
    return {
        //main function to initiate the module
        init: function () {
            handlePitchDeck();
            handlePitchDeckAnalytics();
        }
    };
}();
jQuery(document).ready(function () {
    pitchDeck.init();
});