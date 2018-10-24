const pitchDeck = function () {
    var seconds = 0;

    let pitch_analytics = $('.pitch_analytics').val();

    const getCookie = (name) => {
        var value = "; " + document.cookie;
        var parts = value.split("; " + name + "=");
        if (parts.length == 2) return parts.pop().split(";").shift();
    }

    const handlePitchDeck = () => {
        console.log('HubPitch :) ');
        $('.unread_count_wapper').hide();
        $('.loader_hp_').hide();
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
        if (pitch_analytics == 'true') {
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
        } else {
            console.log('Pitch Analytics Is Supported')
        }

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
    const share_pitch = () => {
        $("#success-alert").hide();
        $(".share_pitch_form").validate({
            errorElement: 'span', //default input error message container
            errorClass: 'error-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            ignore: "",
            rules: {
                email_id: {
                    required: true,
                    email: true
                },
                sender_name: {
                    required: true
                },
                email_body: {
                    required: true
                },
            },
            submitHandler: function (form) {
                $('.loader_hp_').show();
                $.ajax({
                    url: 'http://localhost:3000/share-pitch',
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        email_id: $('input[name="email_id"]').val(),
                        sender_name: $('input[name="sender_name"]').val(),
                        url: window.location.href,
                        email_body: $('textarea[name="email_body"]').val(),
                        pitch_token: $('#pitch_token').val(),
                        user_token: $('#user_token').val(),
                        user_email: $('#user_email').val()
                    },
                    success: function (response) {
                        if (!response.success) {
                            return alert(JSON.stringify(response.error));
                        }
                        //console.log(response)
                        $('.loader_hp_').hide();
                        if (JSON.stringify(response.success == 'true')) {
                            $('input[name="sender_name"]').val('');
                            $('input[name="email_id"]').val('');
                            $('#name-window').modal('hide')
                            $("#success-alert").fadeTo(5000, 500).slideUp(500, function () {
                                $("#success-alert").slideUp(500);
                            });
                        }
                    },
                    error: function (jqXHR, textStatus) {
                        alert("Request failed: " + textStatus);
                    }
                });
            }
        });
    }
    const handleConversation = () => {
        let conversation = getCookie('conversation');
        if (conversation != undefined) {
            $.ajax({
                url: 'http://localhost:3000/get_conversation_',
                headers: {
                    'Accept': 'application/json',
                },
                method: 'POST',
                dataType: 'json',
                data: {
                    conversation_id: conversation,
                },
                success: function (response) {
                    if (response.success == 'true') {
                        $('.unread_count_wapper').show();
                        $('#message_body').html('');
                        $('.unread_count').html('<i class="glyphicon glyphicon-envelope"></i> You Have ' + response.unread + ' Unread Messages');
                    } else {
                        console.log('Something Went Wrong In Conversation')
                    }
                },
                error: function (jqXHR, textStatus) {
                    alert("Request failed: " + textStatus);
                }
            });
        }
        $(document).on("click", '#conversation_', () => {
            let endUserName = getCookie('endUserName');
            let conversation = getCookie('conversation');
            let sender = 'Hareen Desai';
            if (endUserName == undefined) {
                $('#add_name_model').modal('show');
            } else {
                $('#chat-window').modal('show');
                $('.loader_hp_').show();
                $.ajax({
                    url: 'http://localhost:3000/get_conversation_',
                    headers: {
                        'Accept': 'application/json',
                    },
                    method: 'POST',
                    dataType: 'json',
                    data: {
                        conversation_id: conversation,
                    },
                    success: function (response) {
                        if (response.success == 'true') {
                            $('#message_body').html('');
                            $('.loader_hp_').hide();
                            $('.unread_count_wapper').show();
                            $('.unread_count').html('<i class="glyphicon glyphicon-envelope"></i> You Have ' + response.unread + ' Unread Messages');
                            let data = response.data;
                            let dataHTML = '';
                            data.forEach((obj) => {
                                dataHTML = ''
                                if (obj) {
                                    dataHTML = '<div class="msg-block' + (endUserName != obj.sender ? " msg_reply" : "") + '"><div class="msg-head"> <h5>' + (endUserName == obj.sender ? obj.sender : sender) + '</h5>  <span class="time-right">' + moment(obj.created).format("MMM DD YYYY hh:mm A", 'en') + '</span> </div> <div class="m-text"><p>' + obj.chat_text + '</p></div></div>';
                                    $('#message_body').append(dataHTML);
                                }
                            })
                            $.ajax({
                                url: 'http://localhost:3000/mark_as_read_conversation_end_user',
                                headers: {
                                    'Accept': 'application/json',
                                },
                                method: 'POST',
                                data: {
                                    conversation_id: conversation
                                },
                                success: function (response) {
                                    if (response.success == true) {
                                        console.log('MARK AS UNREAD');
                                    } else {
                                        console.log('SOMETHING WENT WRONG IN MARK AS UNREAD');
                                    }
                                },
                                error: function (jqXHR, textStatus) {
                                    console.log("Request failed: " + textStatus);
                                }
                            })
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
        })
    }
    const handleNewUser = () => {
        $(".send_message_form").validate({
            errorElement: 'span', //default input error message container
            errorClass: 'error-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            ignore: "",
            rules: {
                chat_msg: {
                    required: true
                },
            },
            submitHandler: function (form) {
                $('.loader_hp_').show();
                let conversation_id = getCookie('conversation');
                let sender = getCookie('endUserName');

                $.ajax({
                    url: 'http://localhost:3000/send-message',
                    headers: {
                        'Accept': 'application/json',
                    },
                    method: 'POST',
                    dataType: 'json',
                    data: {
                        conversation_id: conversation_id,
                        sender: sender,
                        receiver: $('#user_token').val(),
                        chat_text: $('.chat_msg').val(),
                        pitch_token: $('#pitch_token').val(),
                        company_name: $('#company_name').val(),
                        user_email: $('#user_email').val(),
                    },
                    success: function (response) {
                        if (response.success == 'true') {
                            console.log(response);
                            jQuery('#message_body').append('<div class="msg-block"> <div class="msg-head"> <h5>' + sender + '</h5> <!-- <span class="time-right">time</span> --> </div> <p>' + $('.chat_msg').val() + '</p></div>');
                            $('.chat_msg').val('');
                            $('.loader_hp_').hide();
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
        });
    }

    const handleSendMsg = () => {
        $(".conversation_creater_form").validate({
            errorElement: 'span', //default input error message container
            errorClass: 'error-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            ignore: "",
            rules: {
                end_user_name: {
                    required: true
                },
            },
            submitHandler: function (form) {
                $('.loader_hp_').show();
                let pitchTokenVl = $(location).attr("href").split('/').pop();
                $.ajax({
                    url: 'http://localhost:3000/conversation-creater',
                    headers: {
                        'Accept': 'application/json',
                    },
                    method: 'POST',
                    dataType: 'json',
                    data: {
                        pitch_token: $('#pitch_token').val(),
                        pitch_token: $('#pitch_token').val(),
                    },
                    success: function (response) {
                        if (response.success == 'true') {
                            document.cookie = "endUserName=" + $('#end_user_name').val();
                            document.cookie = "conversation=" + response.data;
                            $('.loader_hp_').hide();
                            jQuery('#add_name_model').modal('hide');
                            jQuery('#chat-window').modal('show');
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
        });
    }

    const handleMutipleConversation = () => {

    }

    const handleUpdatePitch = () => {

        // setInterval(function () {
        //     $.ajax({
        //         url: 'http://localhost:3000/check_for_update',
        //         headers: {
        //             'Accept': 'application/json',
        //         },
        //         method: 'POST',
        //         dataType: 'json',
        //         data: {
        //             pitch_token: $('#pitch_token').val(),
        //             counter: $('.total_pitch:first').text().trim(),
        //         },
        //         success: function (response) {
        //             if (response.success == 'true') {
        //                 if (response.status == 'Updated') {
        //                     alert('This Pitch Is just Update Please Reload The Page For See The New Updates')
        //                 } else {
        //                     console.log('No Update Found!');
        //                 }
        //             } else {
        //                 console.log('Something Went Wrong In Conversation')
        //             }
        //         },
        //         error: function (jqXHR, textStatus) {
        //             alert("Request failed: " + textStatus);
        //         }
        //     });
        // }, 4000);
    }

    const addEndUserName = () => {
        $(".add_name_form").validate({
            errorElement: 'span', //default input error message container
            errorClass: 'error-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            ignore: "",
            rules: {
                end_user_name: {
                    required: true
                },
            },
            submitHandler: function (form) {
                $('.loader_hp_').show();
                document.cookie = "endUserName=" + $('#end_user_name_').val();
                $('.loader_hp_').hide();
                $('#add_name_model_simple').modal('hide');
                submitNote($('#active_info').val())
            }
        });
    }
    const getNotes = () => {
        let token = getCookie('endUsertoken');
        if (token != undefined && token != '') {
            $('.loader_hp_').show();
            $.ajax({
                url: 'http://localhost:3000/get-notes',
                headers: {
                    'Accept': 'application/json',
                },
                method: 'POST',
                dataType: 'json',
                data: {
                    token: token,
                },
                success: function (response) {
                    if (response.success == 'true') {
                        console.log(response);
                        response.data.forEach((obj) => {
                            if (obj) {
                                $('.notesection_' + obj.pitch_info_id).show();
                                $('#submit_btn_note_' + obj.pitch_info_id).hide();
                                $('#note_' + obj.pitch_info_id).val(obj.text);
                                $('#note_' + obj.pitch_info_id).prop('disabled', true);
                                $('#note_icon_button_' + obj.pitch_info_id).removeClass('glyphicon-plus');
                                $('#note_icon_button_' + obj.pitch_info_id).addClass('glyphicon-remove');
                            }
                            $('.loader_hp_').hide();
                        })

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
    }
    return {
        //main function to initiate the module
        init: function () {
            share_pitch();
            handlePitchDeck();
            handlePitchDeckAnalytics();
            handleConversation();
            handleNewUser();
            handleSendMsg();
            handleUpdatePitch();
            addEndUserName();
            getNotes();
        }
    };
}();
jQuery(document).ready(function () {
    pitchDeck.init();
});

function openChatModal() {
    $("#conversation_").click();
    $('.unread_count').html('<i class="glyphicon glyphicon-envelope"></i> You Have ' + 0 + ' Unread Messages');
}

function addNote(id) {
    $('.notesection_' + id).toggle('200');
    $('#note_icon_button_' + id).toggleClass("glyphicon glyphicon-remove");
    $('#note_icon_button_' + id).toggleClass("glyphicon glyphicon-plus");
}
function submitNote(id) {
    let textValue = $('#note_' + id).val()
    $('#active_info').val(id);
    if (textValue == '') {
        $('#note_' + id).addClass('error-custom');
        $('.error_custom_error_' + id).show();
    } else {
        let endUserName = getCookie('endUserName');
        if (endUserName == undefined) {
            $('#add_name_model_simple').modal('show');
            $('.error_custom_error_' + id).hide('100');
            $('#note_' + id).removeClass('error-custom');
        }
        else {
            $('.loader_hp_').show();
            let token = getCookie('endUsertoken');
            if (token == undefined || token == '') {
                token = makeToken();
            }
            $.ajax({
                url: 'http://localhost:3000/note-creater',
                headers: {
                    'Accept': 'application/json',
                },
                method: 'POST',
                dataType: 'json',
                data: {
                    pitch_info_id: id,
                    end_user_name: endUserName,
                    text: textValue,
                    token: token
                },
                success: function (response) {
                    if (response.success == 'true') {
                        document.cookie = "endUserName=" + $('#end_user_name_').val();
                        document.cookie = "endUsertoken=" + token;
                        $('#note_' + id).prop('disabled', true);
                        $('#submit_btn_note_' + id).hide();
                        $('.loader_hp_').hide();
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
    }
}
const makeToken = () => {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

const getCookie = (name) => {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
}