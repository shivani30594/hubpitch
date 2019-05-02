const pitchDeck = function () {
    var seconds = 0;

    let pitch_analytics = $('.pitch_analytics').val();

    const getQuery = () => {
        var pattern = /[?&]viewer=/;
        var URL = location.search;
        if (pattern.test(URL)) {
            return true
        } else {
            return false
        }
    }

    const loginCheck = () => {
        let viewertoken = getCookie('viewertoken')
        let viewerName = getCookie('viewerName')
        let tokenW = getQuery();
        if (tokenW == true) {
            if (viewertoken == undefined) {
                $('#login').modal('show');
                $('body').addClass('dark-modal');
            }
            else if (viewerName == undefined) {
                $('#view_name').modal('show');
                $('body').addClass('dark-modal')
            }
            else {
                return false
            }
        }
    }
    
    const getCookie = (name) => {
        var value = "; " + document.cookie;
        var parts = value.split("; " + name + "=");
        if (parts.length == 2) return parts.pop().split(";").shift();
    }

    const handlePitchDeck = () => {
        console.log('HubPitch :) ');
        $('.unread_count_wapper').hide();
        $('.loader_hp_').hide();
        let url = $(location).attr("href").split('?').pop();
        let pitchToken = url.split('/').pop()
        if (pitchToken == '') {
            //alert('SOME THING WENT WRONG');
            return false;
        }
        setTimeout(function () {
            firstPitchPage();
            $.ajax({
                url: site_url + 'pitch-analytics',
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
                       // return alert(JSON.stringify(response.message));
                    }
                },
                error: function (jqXHR, textStatus) {
                    //alert("Request failed: " + textStatus);
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
                        url: site_url + 'pitch-page-view',
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
                               // return alert(JSON.stringify(response.message));
                            }
                        },
                        error: function (jqXHR, textStatus) {
                           // alert("Request failed: " + textStatus);
                        }
                    });
                } else if (currentPage == 1) {
                    lastValue = $('.total_pitch:first').text().trim();
                    console.log('LAST', lastValue);
                    lastViewCount = $('.' + lastValue + '_page').val();
                    lastToken = $('.' + lastValue + '_token').val();
                    // console.log(lastViewCount, 'lastViewCount');
                    // console.log(lastValue, 'lastValue');
                    // console.log(lastToken, 'lastToken');
                    // lastViewCount = $('.' + lastValue + '_page').val();
                    $.ajax({
                        url: site_url + 'pitch-page-view',
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
                               // return alert(JSON.stringify(response.message));
                            }
                        },
                        error: function (jqXHR, textStatus) {
                            //alert("Request failed: " + textStatus);
                        }
                    });
                } else {
                    //alert('SomethingWent Wrong!');
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
        let viewerName = getCookie('viewerName');
        let viewerRole = getCookie('viewerRole');
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
                // sender_name: {
                //     required: true
                // },
                email_body: {
                    required: true
                },
            },
            submitHandler: function (form) {
                $('.loader_hp_').show();
                let view_token = getCookie('viewertoken')
                tinyMCE.triggerSave();
                $.ajax({
                    url: site_url + 'share-pitch',
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        email_id: $('input[name="email_id"]').val(),
                        sender_name: viewerName,
                        sender_role: viewerRole,
                        url: window.location.href,
                        email_body: $('textarea[name="email_body"]').val(),
                        pitch_token:$('#pitch_token').val(),
                        user_token: $('#user_token').val(),
                        user_email: $('#user_email').val(),
                        company_name: $('#company_name').val()
                    },
                    success: function (response) {
                        if (!response.success) {
                            //return alert(JSON.stringify(response.error));
                        }

                        $('.loader_hp_').hide();
                        //console.log(response);
                        if (JSON.stringify(response.success == 'true')) {
                            // $('input[name="sender_name"]').val('');
                            $('input[name="email_id"]').val('');
                            $('#name-window').modal('hide')
                            $("#success-alert").fadeTo(5000, 500).slideUp(500, function () {
                                $("#success-alert").slideUp(500);
                            });
                        }
                    },
                    error: function (jqXHR, textStatus) {
                        //alert("Request failed: " + textStatus);
                    }
                });
            }
        });
    }
    const handleConversation = () => {
        let conversation = getCookie('conversation');
        if (conversation != undefined) {
            $.ajax({
                url: site_url + 'get_conversation_',
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
                        if (response.unread == undefined) {
                            $('.unread_count').hide();
                        } else {
                            $('.unread_count').show('20');
                            $('.unread_count').html('<i class="glyphicon glyphicon-envelope"></i> You Have ' + response.unread + ' Unread Messages');
                        }
                    } else {
                        console.log('Something Went Wrong In Conversation')
                    }
                },
                error: function (jqXHR, textStatus) {
                    //alert("Request failed: " + textStatus);
                }
            });
        }
        $(document).on("click", '#conversation_', () => {
            let endUserName = getCookie('viewerName');
            let conversation = getCookie('conversation');
            
            //let sender = 'John Doe';
            let sender = document.getElementById("sender_name_value").value;
            console.log("name", document.getElementById("sender_name_value").value);
            if (endUserName == undefined) {
                $('#add_name_model').modal('show');
            } else {
                if (conversation != undefined) {
                    $('#chat-window').modal('show');
                    $('.loader_hp_').show();
                    $.ajax({
                        url: site_url + 'get_conversation_',
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
                                if (response.new_conversation == 'true') {
                                    console.log('new conversation');
                                    return
                                } 
                                else {
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
                                        url: site_url + 'mark_as_read_conversation_end_user',
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
                            }
                            else {
                                //alert('Something Went Wrong!');
                            }
                        },
                        error: function (jqXHR, textStatus) {
                            //alert("Request failed: " + textStatus);
                        }
                    });
                } else {
                    $('.loader_hp_').show();
                    let pitchTokenVl = $(location).attr("href").split('/').pop();
                    $.ajax({
                        url: site_url + 'conversation-creater',
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
                                document.cookie = "conversation=" + response.data;
                                $('.loader_hp_').hide();
                                jQuery('#add_name_model').modal('hide');
                                jQuery('#chat-window').modal('show');
                            }
                            else {
                                //alert('Something Went Wrong!');
                            }
                        },
                        error: function (jqXHR, textStatus) {
                           // alert("Request failed: " + textStatus);
                        }
                    });
                }
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
               
                if ($('.chat_msg').val().trim()=="")
                {
                    alert("Not Empty");
                    $('.chat_msg').val('');

                }
                else
                {
                $('.loader_hp_').show();
                let conversation_id = getCookie('conversation');
                let sender = getCookie('viewerName');
                $.ajax({
                    url: site_url + 'send-message',
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
                            jQuery('#message_body').append('<div class="msg-block"> <div class="msg-head"> <h5>' + sender + '</h5> <!-- <span class="time-right">time</span> --> </div> <p>' + $('.chat_msg').val() + '</p></div>');
                            $('.chat_msg').val('');
                            $('.loader_hp_').hide();
                        }
                        else {
                           // alert('Something Went Wrong!');
                        }
                    },
                    error: function (jqXHR, textStatus) {
                        //alert("Request failed: " + textStatus);
                    }
                });
            }
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
                    url: site_url + 'conversation-creater',
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
                           // alert('Something Went Wrong!');
                        }
                    },
                    error: function (jqXHR, textStatus) {
                       // alert("Request failed: " + textStatus);
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
        //         url: site_url+'check_for_update',
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
        // }, 10000);
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
                url: site_url + 'get-notes',
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
                       //alert('Something Went Wrong!');
                    }
                },
                error: function (jqXHR, textStatus) {
                    //alert("Request failed: " + textStatus);
                }
            });
        }
    }
    const handleSignUp = () => {
        $('.loader_hp_').hide('50');
        $("#login_popup").validate({
            errorElement: 'span', //default input error message container
            errorClass: 'error-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            ignore: "",
            rules: {
                password: {
                    required: true
                }
            },
            submitHandler: function (form) {
                $('.loader_hp_').show('50');
                $('body').removeClass('dark-modal')
                let tokenW = window.location.href.split('?viewer=').pop();
                $.ajax({
                    url: '/end-user-login',
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        token: tokenW,
                        password: $('#login input[name="password"]').val()
                    },
                    success: function (response) {
                        if (response.error) {
                           // alert(response.error.details[0].message);
                        }
                        if (response.success == false) {
                            // alert(response.message);
                            $('#sign_up_form').trigger("reset");
                            $('.loader_hp_').hide('50');
                        }
                        if (response.success) {
                            document.cookie = "viewertoken=" + response.token;
                            $('.loader_hp_').hide('50');
                            location.reload();
                        }
                    },
                    error: function (jqXHR, textStatus) {
                        //alert("Request failed: " + textStatus);
                    }
                });
                //form.submit();
            }
        });
    }
    const handleName = () => {
        $("#add_name").validate({
            errorElement: 'span', //default input error message container
            errorClass: 'error-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            ignore: "",
            rules: {
                view_name: {
                    required: true
                },
                job_title: {
                    required: true
                }
            },
            submitHandler: function (form) {
                $('.loader_hp_').show('50');            
                
                let viewertoken = getCookie('viewertoken')
                $.ajax({
                    url: '/viewer-add-name',
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        view_token: viewertoken,
                        name: $('#add_name input[name="view_name"]').val(),
                        job_title: $('#add_name input[name="job_title"]').val(),
                    },
                    success: function (response) {
                        if (response.error) {
                            //alert(response.error.details[0].message);
                        }
                        if (response.success == false) {
                            //alert(response.message);
                            $('#add_name').trigger("reset");
                            $('.loader_hp_').hide('50');
                        }
                        if (response.success) {                           
                            alert('Update Successfully!')
                            $('#view_name').hide();
                            $('#view_info').modal('show');                                                     

                            document.cookie = "viewerName=" + $('#add_name input[name="view_name"]').val();
                            document.cookie = "viewerRole=" + $('#add_name input[name="job_title"]').val();
                            $.ajax({
                                url: site_url + 'conversation-creater',
                                headers: {
                                    'Accept': 'application/json',
                                },
                                method: 'POST',
                                dataType: 'json',
                                data: {
                                    pitch_token: $('#pitch_token').val(),
                                    viewer_id: viewertoken
                                },
                                success: function (response) {
                                    if (response.success == 'true') {
                                        document.cookie = "conversation=" + response.data;                                       
                                        $('.loader_hp_').hide();
                                            setTimeout(function () {                                               
                                                $("#view_info").hide();
                                                $('body').removeClass('dark-modal');
                                                location.reload();                         
                                            }, 10000);
                                    }
                                    else {
                                        //alert('Something Went Wrong!');
                                    }
                                },
                                error: function (jqXHR, textStatus) {
                                    //alert("Request failed: " + textStatus);
                                }
                            });
                       //set time
                      }
                    },
                    error: function (jqXHR, textStatus) {
                        //alert("Request failed: " + textStatus);
                    }
                });
                //form.submit();
            }
        });
    }

    const handleViewerAnalysis = () => {
        let viewer_id = getCookie('viewertoken');
        if (viewer_id != undefined) {
            $.ajax({
                url: '/viewer-analysis',
                type: 'POST',
                dataType: 'json',
                data: {
                    viewer_id: viewer_id,
                    pitch_info_id: $('.slick-current .pitch_info_token_c').val(),
                },
                success: function (response) {
                    console.log(response);
                },
                error: function (jqXHR, textStatus) {
                    //alert("Request failed: " + textStatus);
                }
            });
        } else {
            console.log('viewer token is', viewer_id);
        }
    }

    const handleVieweringTime = () => {
        let viewer_id = getCookie('viewertoken')
        if (viewer_id != undefined) {
            setInterval(function () {
                console.log('viewer_id', viewer_id);
                console.log('viewing_time', $('.slick-active .sliderViewer').val());
                console.log('pitch_info_id', $('.slick-current .pitch_info_token_c').val());
                $.ajax({
                    url: site_url + 'viewer/analysis-update',
                    headers: {
                        'Accept': 'application/json',
                    },
                    method: 'POST',
                    dataType: 'json',
                    data: {
                        viewer_id: viewer_id,
                        viewing_time: $('.slick-active .sliderViewer').val(),
                        pitch_info_id: $('.slick-current .pitch_info_token_c').val(),
                    },
                    success: function (response) {
                        console.log(response)
                    }
                });
            }, 10000);
        }
        else {
            console.log('viewer token is', viewer_id);
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
            loginCheck();
            handleSignUp();
            handleName();
            handleViewerAnalysis();
            handleVieweringTime();
        }
    };
}();
jQuery(document).ready(function () {    
    
    pitchDeck.init();
    viewNotification();
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
    let textValue = $('#note_' + id).val().trim();
    let sender_email = $('#user_email').val();
    let company_name = $('#company_name').val();

     $('#active_info').val(id);
    if (textValue == '') {
        $('#note_' + id).addClass('error-custom');
        $('.error_custom_error_' + id).show();
    } else {
        //let endUserName = getCookie('endUserName');
        let endUserName = getCookie('viewerName');        
        if (endUserName == undefined) {
            $('#add_name_model_simple').modal('show');
            $('.error_custom_error_' + id).hide('100');
            $('#note_' + id).removeClass('error-custom');
        }
        else {
            $('.loader_hp_').show();
            let token = getCookie('endUsertoken');
            //let token = getCookie('viewertoken');
            if (token == undefined || token == '') {
                token = makeToken();
            }
            $.ajax({
                url: site_url + 'note-creater',
                headers: {
                    'Accept': 'application/json',
                },
                method: 'POST',
                dataType: 'json',
                data: {
                    pitch_info_id: id,
                    end_user_name: endUserName,
                    text: textValue,
                    token: token,
                    user_email: sender_email,
                    company_name: company_name
                },
                success: function (response) {
                    if (response.success == 'true') {
                       //document.cookie = "endUserName=" + $('#end_user_name_').val();
                        document.cookie = "endUserName=" + endUserName;
                        document.cookie = "endUsertoken=" + token;
                        $('#note_' + id).prop('disabled', true);
                        $('#submit_btn_note_' + id).hide();
                        $('.loader_hp_').hide();
                    }
                    else {
                        //alert('Something Went Wrong!');
                    }
                },
                error: function (jqXHR, textStatus) {
                    //alert("Request failed: " + textStatus);
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

function download_document(type){
    //console.log(type);    
    let sender_email = $('#user_email').val();
    let company_name = $('#company_name').val();
    let endUserName = getCookie('viewerName');
    let endUserRole = getCookie('viewerRole');
    $.ajax({
        url: site_url + 'download-document',
        headers: {
            'Accept': 'application/json',
        },
        method: 'POST',
        dataType: 'json',
        data: {           
            end_user_name: endUserName,           
            user_email: sender_email,
            company_name: company_name,
            end_user_role:endUserRole,
        },
        success: function (response) {
            if (response.success == 'true') {
                // document.cookie = "endUserName=" + $('#end_user_name_').val();
                // document.cookie = "endUserName=" + endUserName;
                // document.cookie = "endUsertoken=" + token;
                // $('#note_' + id).prop('disabled', true);
                // $('#submit_btn_note_' + id).hide();
                // $('.loader_hp_').hide();
            }
            else {
                //alert('Something Went Wrong!');
            }
        },
        error: function (jqXHR, textStatus) {
            //alert("Request failed: " + textStatus);
        }
    });
}
const getCookie = (name) => {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
}
const full_sceen_zoom = (id, e, loop) => {
    console.log("rip",e.text());
    let currentText = e.text();
    if (currentText == 'Full Screen') {
        e.html('Full Screen<i class="glyphicon glyphicon-resize-small">');
    } else {
        e.html('Normal Screen<i class="glyphicon glyphicon-resize-full">');
    }
    $("." + id + "_edit-wrap").toggleClass("edit-wrap-toggled");
    currentText='';
    $("#loaded-layout_" + loop).resize();
}
$('#login').on('hide.bs.modal', function (e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    return false;
});
$('#view_name').on('hide.bs.modal', function (e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    return false;
});

const getToken = () => {
    let urlToken = window.location.pathname
    console.log(urlToken);
}
const viewNotification = () => {
    if (getCookie('viewerName') != undefined) {
        $.ajax({
            url: site_url + 'view-mail',
            type: 'POST',
            dataType: 'json',
            data: {
                user_token: $('#user_token').val(),
                pitch_token: $('#pitch_token').val(),
                company_name: $('#company_name').val(),
                user_email: $('#user_email').val(),
                viewer_name: getCookie('viewerName')
            },
            success: function (response) {
                console.log(response);
            }
        });
    }
}
tinymce.init({
    selector: "#email_body",
    theme: "modern",
    height: 300,
    plugins: [
        "searchreplace",
        "save table contextmenu directionality emoticons template paste textcolor"
    ],
    toolbar: "undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent | forecolor backcolor emoticons",

    style_formats: [
        { title: 'Bold text', inline: 'b' },
        { title: 'Red text', inline: 'span', styles: { color: '#ff0000' } },
        { title: 'Red header', block: 'h1', styles: { color: '#ff0000' } },
        { title: 'Example 1', inline: 'span', classes: 'example1' },
        { title: 'Example 2', inline: 'span', classes: 'example2' },
        { title: 'Table styles' },
        { title: 'Table row 1', selector: 'tr', classes: 'tablerow1' }
    ]
});