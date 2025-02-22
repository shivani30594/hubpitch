const newPitch = function () {
    let accesstoken = getCookie('accesstoken');
    $('.loader_hp_').hide('50');

    const handleNewPitchFormUI = () => {
        $('#final_section').hide();
        $('#share_box').hide();
        $('.placeholder').hide();
        $('.preview_file').hide();
        $('.preview_file_image').hide();
        $('.preview_file_docs').hide();
        $('.preview_docx').hide();
        $('#main-box').addClass('active_one');

        $('#continue_btn_main').on("click", function () {
            // str.name.value.trim() == ""
            if ($('#c-name').val().trim() == '') {
                alert('Company Name Is Required!');
                ///location.reload();
            }
            else if ($('#drop_zone').val() == '') {
                alert('File Is Required!');
                //location.reload();
            }
            else {
                $('.active_one').hide();
                $('#main-box').removeClass('active_one');
                $('.active_one').hide();
                $('div').removeClass('active_one');
                $(".current_preview").show('200');
            }

        });

        $(document).on("click", '.a_another_btn', function () {
            $('.current_preview').hide();
            $('.add_another_o').hide();
            $("div").removeClass("active_one");
            $(".another-page-blank").clone().appendTo(".add_box_here").addClass('add_another_o active_one').removeClass('another-page-blank');
            $('.active_one').show('200');
        })

        $(document).on("click", '.continue_btn', function () {
            $('.active_one').hide();
            $('div').removeClass('active_one');
            $(".current_preview").show('200');
        })

    }

    const handleDropZone = () => {
        var count = 1;
        $(document).on("change", '.drop_zone_input', function () {
            var $element = $(this);
            var $input = $element;
            var $value = $(this).parent('.file').find('.file-value');
            // Get the value of the input
            var val = $input.val();
            let checkFileTypeWithPlanM = checkFileTypeWithPlan(val);
            if (checkFileTypeWithPlanM == true) {
                // Normalize strings    
                val = val.replace(/\\/g, "/");
                // Remove the path
                val = val.substring(val.lastIndexOf("/") + 1);
                // Toggle the 'active' class based
                // on whether or not there is a value
                $element.toggleClass('active', !!val.length);
                // Set the value text accordingly
                $value.text(val);
                $(this).parent('.file').find('.file-label').html(val);
                $(this).addClass('focus');
                // $(this).closest('div.file-label').hide();
                // $(this).closest("div.file-value").show();
                var fileExtensionVideo = ['avi', 'wmv', 'mov', '3gp', 'mp4'];
                var fileExtensionImage = ['png', 'jpeg', 'jpg', 'bmp'];
                var fileExtensionDocs = ['pdf', 'txt'];
                var fileExtensionDocsViewer = ['docx', 'xlsx', 'pptx'];
                var filename = val;
                if (jQuery.inArray(jQuery.trim(filename.split('.').pop().toLowerCase()), fileExtensionVideo) != -1) {
                    // Video Preview
                    $('div').removeClass('current_preview');
                    $(".preview_file").clone().appendTo(".add_preview").addClass('current_preview active_one display_box_d').removeClass('preview_file');
                    let fileUrl = $(this)[0].src = URL.createObjectURL(this.files[0]);
                    $(".current_preview .video_here").attr("src", fileUrl);
                }
                else if (jQuery.inArray(jQuery.trim(filename.split('.').pop().toLowerCase()), fileExtensionImage) != -1) {
                    // Image Preview
                    $('div').removeClass('current_preview');
                    $(".preview_file_image").clone().appendTo(".add_preview").addClass('current_preview active_one display_box_d').removeClass('preview_file_image');
                    let fileUrl = $(this)[0].src = URL.createObjectURL(this.files[0]);
                    $(".current_preview .preview_image").attr("src", fileUrl);
                }
                else if (jQuery.inArray(jQuery.trim(filename.split('.').pop().toLowerCase()), fileExtensionDocs) != -1) {
                    // PDF Preview
                    $('div').removeClass('current_preview');
                    $(".preview_file_docs").clone().appendTo(".add_preview").addClass('current_preview active_one display_box_d').removeClass('preview_file_docs');
                    let fileUrl = $(this)[0].src = URL.createObjectURL(this.files[0]);
                    $(".current_preview .docs_priview_e").attr("src", fileUrl);
                }
                else if (jQuery.inArray(jQuery.trim(filename.split('.').pop().toLowerCase()), fileExtensionDocsViewer) != -1) {
                    $('div').removeClass('current_preview');
                    $(".preview_docx").clone().appendTo(".add_preview").addClass('current_preview active_one display_box_d').removeClass('preview_docx');
                    $(".current_preview").show();

                    var $kukuNode = $(".current_preview .kuku-viewer-node");
                    var $files = this.files[0];
                    var $prevbutton = $(".current_preview .prev-btn");
                    var $nextbutton = $(".current_preview .next-btn");

                    var instance = null, fileType = null;
                    var docxJS = null, cellJS = null, slideJS = null, pdfJS = null;

                    var documentParser = function (file) {
                        fileType = getInstanceOfFileType(file);
                        if (fileType) {
                            if (instance) {
                                /** destroy API
                                 *  structure : destory(callback) **/
                                instance.destroy();
                            }
                            if (fileType === 'docx') {
                                if (!docxJS) {
                                    docxJS = new DocxJS();
                                }
                                instance = docxJS;
                            } else if (fileType === 'xlsx') {
                                if (!cellJS) {
                                    cellJS = new CellJS();
                                }
                                instance = cellJS;
                            } else if (fileType === 'pptx') {
                                if (!slideJS) {
                                    slideJS = new SlideJS();
                                    $('.kuku-docx-controller').show();
                                    $('.current_preview').addClass('pptx_file_type');
                                }
                                instance = slideJS;
                            } else if (fileType === 'pdf') {
                                if (!pdfJS) {
                                    pdfJS = new PdfJS();
                                }
                                instance = pdfJS;
                                instance.setCMapUrl('cmaps/');
                            }

                            if (instance) {
                                /** parse API
                                 *  structure : parse(file, successCallbackFn, errorCallbackFn) **/
                                console.log(instance);
                                instance.parse(file,
                                    function () {
                                        /** render API
                                         *  structure : render(element, callbackFn, pageId) **/
                                        console.log(file);
                                        instance.render($kukuNode[0], function () {
                                            $(".current_preview").hide();
                                        });
                                    },
                                    function () {
                                        console.log('document js viewer parsing error');
                                    });
                            } else {
                                console.log('no support files');
                            }
                        } else {
                            console.log('no support files');
                        }
                    };


                    //Utils
                    var stopEvent = function (e) {
                        if (e.preventDefault) e.preventDefault();
                        if (e.stopPropagation) e.stopPropagation();
                        e.returnValue = false;
                        e.cancelBubble = true;
                        e.stopped = true;
                    };

                    var getInstanceOfFileType = function (file) {
                        var fileExtension = null;
                        if (file) {
                            var fileName = file.name;
                            fileExtension = fileName.split('.').pop();
                        }
                        return fileExtension;
                    };

                    //Event
                    var selectFile = null, currentId = null;
                    selectFile = this.files[0];
                    stopEvent = function (e) {
                        stopEvent(e);
                    }
                    if (selectFile) {
                        documentParser(selectFile);
                    } else {
                        alert('no selected file');
                    }
                    $(document).on('click', '.current_preview .prev-btn', function () {
                        currentId = instance.getCurrentId();
                        instance.gotoPage(currentId - 1);
                        return false;
                    });
                    $(document).on('click', '.current_preview .next-btn', function () {
                        currentId = instance.getCurrentId();
                        instance.gotoPage(currentId + 1);
                        return false;
                    });
                }
                else {
                    alert('FILE TYPE NOT SUPPORTED');
                }
            } else {
                $('#add_pitch').trigger("reset");
                alert('This File Type Is Not Supported With Your Subscription');
            }
        })
    }
    const handleContinue_final = () => {
        $(document).on("click", '.continue_btn_final', function () {
            alert("rip");

            let $this = '';
            $('.preview_box').hide('100');
            if ($('div.preview_box').hasClass('display_current') === true) {
                $this = $('.display_current').next();
                if ($this.length === 0) {
                    handleContinueUpload();
                }
                $('div.preview_box').removeClass('display_current');
            } else {
                $this = $(".add_preview .preview_box:first-child");
            }
            $this.addClass('display_current');
            $this.show('100');
            // ClassicEditor
            // .create(document.querySelector('.current_preview .text_box_ta'))
            // .then( editor => {
            //     console.log( 'Editor was initialized', editor );
            //     myEditor = editor;
            // })
            // .catch(error => {
            //     console.error(error);
            // });
            tinymce.init({
                selector: ".text_box_ta",
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

            $this.find('.a_another_btn').html(' ');
            $this.find('.top-area').removeClass('col-md-12').addClass('col-md-6');
            $this.find('.text-box').show('100');
        });
    }
    const handleContinueUpload = () => {
        // FILE CODE 
        var cnt = 1;
        var ad_img_array = [];
        jQuery(".drop_zone_input").each(function () {
            ad_img_array.push(jQuery(this)[0].files[0]);
            cnt++;
        });

        // TEXT CODE 
        var cnt2 = 1;
        var ad_text_array = [];
        jQuery(".display_box_d .text_box_ta").each(function () {
            tinyMCE.triggerSave();
            ad_text_array.push(jQuery(this).val());
            cnt2++;
        });
        var input = document.querySelector('input[name="drop_zone[]"]')
        var formData = new FormData();
        var company_name = $('#c-name').val();
        formData.append('company_name', company_name);
        ad_img_array.forEach((obj) => {
            if (obj) {
                formData.append('pitch_files', obj);
            }
        })

        ad_text_array.forEach((obj) => {
            if (obj) {
                formData.append('pitch_text', obj);
            }
        })
        // console.log("heloo", ad_text_array, ad_text_array.length);
        // if (ad_text_array.length == 1) {
        //     alert("Please fill document information fields");

        //     location.reload();
        // }

        // $('.loader_hp_').show('50');
        // $.ajax({
        //     url: site_url + 'add_pitch',
        //     headers: {
        //         'Accept': 'application/json',
        //         "access-token": accesstoken
        //     },
        //     processData: false,  // tell jQuery not to process the data
        //     contentType: false,  // tell jQuery not to set contentType
        //     method: 'POST',
        //     data: formData,
        //     success: function (response) {
        //         if (!response.success) {
        //             return alert(JSON.stringify(response.message));
        //         }
        //         console.log('response', response);
        //         $('#add_new_pitch_form').hide('100');
        //         let cName = $('#c-name').val();
        //         $('#final_section').show('100');
        //         $('#final_name').val(cName);
        //         $('#pitch_id').val(response.pitch);
        //         $('.loader_hp_').hide('50');
        //     },
        //     error: function (jqXHR, textStatus) {
        //         alert("Request failed: " + textStatus);
        //     }
        // });
    }




    const handleShareLink = () => {
        $(document).on("click", '#create_pitch', function () {
            let accesstoken = getCookie('accesstoken');
            var allow_notification = $('#allow_notification').is(":checked")
            var allow_messaging = $('#allow_messaging').is(":checked")
            var allow_share = $('#allow_share').is(":checked")

            if (allow_notification == undefined && allow_messaging == undefined && allow_share == undefined) {
                allow_notification, allow_messaging, allow_share = false
            }

            $.ajax({
                url: site_url + 'manage_pitch',
                headers: {
                    'Accept': 'application/json',
                    "access-token": accesstoken
                },
                method: 'POST',
                data: {
                    pitch_id: $('#pitch_id').val(),
                    allow_notification: allow_notification,
                    allow_messaging: allow_messaging,
                    allow_share: allow_share
                },
                dataType: 'json',
                success: function (response) {
                    if (!response.success) {
                        return alert(JSON.stringify(response.message));
                    }
                    console.log(response);
                    let linkValue = site_url + 'viewer/' + response.data
                    $('#link_value').attr("href", linkValue);
                    $('#link_value').html(linkValue);
                    $('#final_section').hide();
                    $('#share_box').show();
                    $('#pitch_name_t').html($('#final_name').val());
                },
                error: function (jqXHR, textStatus) {
                    alert("Request failed: " + textStatus);
                }
            });
        });
    }
    const handleCopyButton = () => {
        $(document).on("click", '.copy_link_btn', function () {
            var copyText = document.getElementById("link_value");
            copyText.select();
            document.execCommand("copy");
            alert("Copied the text: " + copyText.value);
        });
    }
    return {
        //main function to initiate the module
        init: function () {
            handleNewPitchFormUI();
            handleDropZone();
            handleContinue_final();
            handleContinue_drafts();
            handleShareLink();
            handleCopyButton();
        }
    };
}();
jQuery(document).ready(function () {
    newPitch.init();
});

function checkEmail(email) {
    var regExp = /(^[a-z]([a-z_\.]*)@([a-z_\.]*)([.][a-z]{3})$)|(^[a-z]([a-z_\.]*)@([a-z_\.]*)(\.[a-z]{3})(\.[a-z]{2})*$)/i;
    return regExp.test(email);
}

function checkEmails() {
    var emails = document.getElementById("emails").value;
    var emailArray = emails.split(",");
    let errorFlag = 0;
    for (i = 0; i <= (emailArray.length - 1); i++) {
        if (checkEmail(emailArray[i])) {
            //Do what ever with the email.
            //console.log(emailArray);
        } else {
            errorFlag = errorFlag + 1
            alert("invalid email: " + emailArray[i]);
        }
    }
    if (errorFlag === 0) {

        tinyMCE.triggerSave();
        let accesstoken = getCookie('accesstoken');
        $('.loader_hp_').show('50');
        $.ajax({
            url: site_url + 'share_pitch_email',
            headers: {
                'Accept': 'application/json',
                "access-token": accesstoken
            },
            method: 'POST',
            data: {
                email_id: JSON.stringify(emailArray),
                email_body: $('#email_body').val(),
                pitch_token: $('#pitch_id').val(),
                sender_name: $('#c_user_box').text(),
                pitch_url: $('#link_value').attr('href')
            },
            dataType: 'json',
            success: function (response) {
                if (!response.success) {
                    return alert(JSON.stringify(response.message));
                }
                $('.loader_hp_').hide('50');
                alert('Email Sent To Your Viewers, Please Reload The Page For See The Updated Page');
                window.location.href = "/user/dashboard";
            },
            error: function (jqXHR, textStatus) {
                alert("Request failed: " + textStatus);
            }
        });
    }
}

function checkFileTypeWithPlan(file) {
    let plan_type = $('.plan_').val();
    console.log("Plan", plan_type);
    // inArray(jQuery.trim(file.split('.').pop().toLowerCase()), fileExtensionImage)
    // jQuery.trim(file.split('.').pop().toLowerCase()), fileExtensionVideo
    let plan_support = JSON.parse(plan_type);
    console.log(plan_support.img_support);
    file_type = jQuery.trim(file.split('.').pop().toLowerCase())
    if (file_type == 'jpg' || file_type == 'jpeg' || file_type == 'png' || file_type == 'bmp') {
        return (plan_support.img_support == 'true') ? true : false
    }
    if (file_type == 'pdf') {
        return (plan_support.pdf == 'true') ? true : false
    }
    if (file_type == 'txt') {
        return (plan_support.text_file == 'true') ? true : false
    }
    if (file_type == 'docx') {
        return (plan_support.word_upload == 'true') ? true : false
    }
    if (file_type == 'xlsx') {
        return (plan_support.excel_upload == 'true') ? true : false
    }
    if (file_type == 'pptx') {
        return (plan_support.powerpoint_upload == 'true') ? true : false
    }
    if (file_type == 'mp4' || file_type == 'mkv' || file_type == 'mov' || file_type == 'mpeg') {
        return (plan_support.video == 'true') ? true : false
    }
}

function copyToClipboard(element) {
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val($(element).text()).select();
    document.execCommand("copy");
    $temp.remove();
    alert('Link Coppied In ClipBoard!')
}

function discardPitch() {
    var x = confirm("Are You Sure You Want To Discard This Pitch?");
    if (x) {
        let accesstoken = getCookie('accesstoken')
        let id = $('#pitch_id').val();
        $.ajax({
            url: site_url + 'detele_pitch',
            headers: {
                'Accept': 'application/json',
                "access-token": accesstoken
            },
            method: 'POST',
            data: {
                pitch_delete_type: 'full',
                pitch_id: id,
            },
            success: function (response) {
                if (response.success == "true") {
                    alert('Pitch Discard Successfully!');
                    location.reload();
                } else {
                    console.log(response.message);
                    alert('SOMETHING WENT WRONG IN SENDING MESSAGE');
                }
            },
            error: function (jqXHR, textStatus) {
                console.log("Request failed: " + textStatus);
            }
        })
    }
}
function resetFormEdit() {
    var x = confirm("Are You Sure You Want To Discard This Pitch?");
    if (x) {
        $('#add_pitch').trigger("reset");
        location.reload();
    }
}
function draftForm() {
    alert("Rip");
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
//* For Drafts Links 
const handleContinue_drafts = () => {
    $(document).on("click", '.continue_btn_draft', function () {

        let $this = '';
        $('.preview_box').hide('100');
        if ($('div.preview_box').hasClass('display_current') === true) {
            $this = $('.display_current').next();
            if ($this.length === 0) {
                handleContinueUploadDrafts();
            }
            $('div.preview_box').removeClass('display_current');
        } else {
            $this = $(".add_preview .preview_box:first-child");
        }
        $this.addClass('display_current');
        $this.show('100');
        tinymce.init({
            selector: ".text_box_ta",
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

        $this.find('.a_another_btn').html(' ');
        $this.find('.top-area').removeClass('col-md-12').addClass('col-md-6');
        $this.find('.text-box').show('100');
    });
}

const handleContinueUploadDrafts = () => {

    let accesstoken = getCookie('accesstoken');

    // FILE CODE 
    var cnt = 1;
    var ad_img_array = [];
    jQuery(".drop_zone_input").each(function () {
        ad_img_array.push(jQuery(this)[0].files[0]);
        cnt++;
    });

    // TEXT CODE 
    var cnt2 = 1;
    var ad_text_array = [];
    jQuery(".display_box_d .text_box_ta").each(function () {
        tinyMCE.triggerSave();
        ad_text_array.push(jQuery(this).val());
        cnt2++;
    });
    var input = document.querySelector('input[name="drop_zone[]"]')
    var formData = new FormData();
    var company_name = $('#c-name').val();
    formData.append('company_name', company_name);
    ad_img_array.forEach((obj) => {
        if (obj) {
            formData.append('pitch_files', obj);
        }
    })
    ad_text_array.forEach((obj) => {
        if (obj) {
            formData.append('pitch_text', obj);
        }
    })

    // if (ad_text_array.length == 1) {
    //     alert("Please fill document information fields");
    //     location.reload();
    // }
    $('.loader_hp_').show('50');

    $.ajax({
        url: site_url + 'add_pitch_draft',
        headers: {
            'Accept': 'application/json',
            "access-token": accesstoken
        },
        processData: false,  // tell jQuery not to process the data
        contentType: false,  // tell jQuery not to set contentType
        method: 'POST',
        data: formData,
        success: function (response) {
            if (!response.success) {
                return alert(JSON.stringify(response.message));
            }
            window.location = site_url + 'user/dashboard';
            console.log('response', response);
            $('#add_new_pitch_form').hide('100');
            let cName = $('#c-name').val();
            $('#final_section').show('100');
            $('#final_name').val(cName);
            $('#pitch_id').val(response.pitch);
            $('.loader_hp_').hide('50');
        },
        error: function (jqXHR, textStatus) {
            alert("Request failed: " + textStatus);
        }
    });
}

function showModal(limit) {

    if (limit == 0) {
        $("#drop_zone").prop('disabled', true);
        $('#conversation_list').html(' ');
        $('#conversation_box').modal('show');
        let dataHTML = '';
        //dataHTML = `Email Sent To Your Mail.You have finished your pitch limit.In order to continue you uploade pitch you will need to upgrade your subscription<br><a href="${site_url}user/upgrade" style="text-decoration: underline !important;">Click HERE to Upgrade</a>`;
        dataHTML = `Your Bundle Account Has Expired<br><br>Please upgrade your account to continue.<br><br><a href="${site_url}user/upgrade" style="text-decoration: underline !important;">Click HERE to Upgrade</a>`;

        $('#conversation_list').append(dataHTML);

        if (limit === 0) {
            let accesstoken = getCookie('accesstoken');
            $.ajax({
                url: site_url + 'upgrade_plan_email',
                headers: {
                    'Accept': 'application/json',
                    "access-token": accesstoken
                },
                method: 'POST',
                success: function (response) {
                    if (!response.success) {
                        return alert(JSON.stringify(response.message));
                    }

                    // alert('Email Sent To Your Mail, Please upgrade your subscription For See The Updated Page');
                    //window.location.href = "/pitch/add";
                },
                error: function (jqXHR, textStatus) {
                    alert("Request failed: " + textStatus);
                }
            });
        }
        //window.location.href = "/pitch/add";
        //$("#drop_zone").prop('disabled', false);
        //$("#drop_zone").prop('enable', true);
        //alert("You have finished your pitch limit.In order to continue you uploade pitch you will need to upgrade your subscription");
    }
    else {
        // $("#drop_zone").click();
        //$("#drop_zone").prop('enable', true);
    }

}


