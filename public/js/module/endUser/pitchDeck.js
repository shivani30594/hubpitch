const pitchDeck = function () {
    const handlePitchDeck = () => {
        console.log('HubPitch :) ');
        let pitchToken = $(location).attr("href").split('/').pop();
        if (pitchToken == '') {
            alert('SOME THING WENT WRONG');
            return false;
        }
        console.log(pitchToken);
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
                let data = response.data;
                console.log(data);
            },
            error: function (jqXHR, textStatus) {
                alert("Request failed: " + textStatus);
            }
        });
    }

    const handlePitchDeckAnalytics = () => {

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