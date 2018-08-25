const pitchDeck = function () {
    var seconds = 0;
    const handlePitchDeck = () => {
        console.log('HubPitch :) ');
        let pitchToken = $(location).attr("href").split('/').pop();
        if (pitchToken == '') {
            alert('SOME THING WENT WRONG');
            return false;
        }
        setTimeout(function () {
            firstPitchPage();
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
        let lastValue = '';
        let lastViewCount = '';
        let lastToken = '';
        $(document).on("click", '.btn-prev', function () {
            currentPage = $('.slick-active .current').text();
            console.log('currentPage', currentPage);
        });

        $(document).on("click", '.btn-next', function () {
            seconds = 0;
            currentPage = $('.slick-active .current').text();
            console.log('currentPage --------- ', currentPage);
            if (currentPage > 1) {
                $('.slick-active .sliderViewer').addClass(currentPage + '_page');
                lastValue = currentPage - 1;
                lastViewCount = $('.' + lastValue + '_page').val();
                lastToken = $('.' + lastValue + '_token').val();
                console.log(lastViewCount, 'lastViewCount');
                console.log(lastValue, 'lastValue');
                console.log(lastToken, 'lastToken');
                $.ajax({
                    url: 'http://localhost:3000/pitch-page-view',
                    headers: {
                        'Accept': 'application/json',
                    },
                    method: 'POST',
                    dataType: 'json',
                    data: {
                        pitch_token: $('#pitch_token').val(),
                        pitch_info_token: lastToken,
                        page: lastValue,
                        view: lastViewCount
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
            } else if (currentPage == 1) {
                lastValue = $('.total_pitch:first').text().trim();
                console.log('LAST', lastValue);
                lastViewCount = $('.' + lastValue + '_page').val();
                lastToken = $('.' + lastValue + '_token').val();
                console.log(lastViewCount, 'lastViewCount');
                console.log(lastValue, 'lastValue');
                console.log(lastToken, 'lastToken');
                //lastViewCount = $('.' + lastValue + '_page').val();
                $.ajax({
                    url: 'http://localhost:3000/pitch-page-view',
                    headers: {
                        'Accept': 'application/json',
                    },
                    method: 'POST',
                    dataType: 'json',
                    data: {
                        pitch_token: $('#pitch_token').val(),
                        pitch_info_token: lastToken,
                        page: lastValue,
                        view: lastViewCount
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
            } else {
                alert('SomethingWent Wrong!');
            }
            setInterval(incrementSeconds, 1000);
        });
    }

    const incrementSeconds = () => {
        seconds += 1;
        $('.slick-active .sliderViewer').val(seconds);
    }
    const firstPitchPage = () => {
        seconds = 0;
        $('.slick-active .sliderViewer').addClass('1_page');
        setInterval(incrementSeconds, 1000);
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