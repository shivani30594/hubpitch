const pitchEdit = function () {
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
            console.log("Drop ZONE",$('#drop_zone_edit').val());
            if ($('#c-name').val() == '') {
                Swal('Validation Error', 'Company Name Is Required!', 'error')
            } 
            else if ($('#drop_zone_edit').val() == '') {
                Swal('Validation Error', 'File Is Required!', 'error')
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
            $('.slider-main-wrapper').hide();
            $('.current_preview').hide();
            $('.add_another_o').hide();
            $("div").removeClass("active_one");
            $(".another-page-blank").clone().appendTo(".add_box_here").addClass('add_another_o active_one').removeClass('another-page-blank');
            $('.active_one').show('200');
        })

        $(document).on("click", '.continue_btn', function () {

            if ($('#drop_zone_edit').val() == '') {               
                alert('File Is Required!');
                //location.reload();
            }
            else
            {
                $('.active_one').hide();
                $('div').removeClass('active_one');
                $(".current_preview").show('200');
            }
        })

    }
    const handleDropZone = () => {
        //$('#email_body').val("Add a message and/or notes");
        //$('#viewers_emails').modal('show');
        var count = 1;
        $(document).on("change", '.drop_zone_input', function () {
            var $element = $(this);
            var $input = $element;
            var $value = $(this).parent('.file').find('.file-value');
            // Get the value of the input
            var val = $input.val();
           // let checkFileTypeWithPlanM = checkFileTypeWithPlan(val);
            //if (checkFileTypeWithPlanM == true) {
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
                $('#add_pitch').trigger("reset");   
                location.reload();            
            }          
        
        })
    }
  
    const handleContinue_final = () => {
        $(document).on("click", '.continue_btn_final', function () {
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
            $('.display_current .text_box_ta').addClass('tinymce')
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
        tinyMCE.triggerSave();
        var cnt2 = 1;
        var ad_text_array = [];
        jQuery(".display_box_d .text_box_ta").each(function () {
            ad_text_array.push(jQuery(this).val());
            cnt2++;
        });

        var pitch_id = $('#pitch_token').val();
        var input = document.querySelector('input[name="drop_zone[]"]')
        var formData = new FormData();
        formData.append('pitch_id', pitch_id);
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
        $('.loader_hp_').show('50');
        $.ajax({
            url: site_url + 'add_new_file',
            headers: {
                'Accept': 'application/json',
                "access-token": accesstoken
            },
            processData: false,  // tell jQuery not to process the data
            contentType: false,  // tell jQuery not to set contentType
            method: 'POST',
            data: formData,
            success: function (response) {
                console.log("response",response);
                if (!response.success) {
                    return alert(JSON.stringify(response.message));
                }
                //_____Form will hide till email box display________________________
                //$('#add_new_pitch_form').hide('100');

                //let cName = $('#c-name').val();
                //$('#final_section').show('100');
                //$('#final_name').val(cName);
                //$('#pitch_id').val(response.pitch);
                //alert('Your Pages Are Added Please Reload This Page To See The Changes');
                if (response.viewers) {
                   
                    let emailAdressInput = '';                    
                    response.viewers.forEach((obj) => {
                        if (emailAdressInput === '') {
                            emailAdressInput = obj.email_address;
                        } else {
                            emailAdressInput = emailAdressInput + ',' + obj.email_address;
                        }
                    })
                    $('#pre_emails').val(emailAdressInput);
                    //$('#email_body').val(response.viewers[0].email_body);
                    $('#email_body').val("Add a message and/or notes");
                    $('.loader_hp_').hide('50');
                    $('#viewers_emails').modal('show');
                }
               
            },
            error: function (jqXHR, textStatus) {
                alert("Request failed: " + textStatus);
            }
        });
    }
    return {
        init: function () {
            handleNewPitchFormUI();
            handleDropZone();
            handleContinue_final();
        }
    }
}();
jQuery(document).ready(function () {
    pitchEdit.init();
});

function checkEmail(email) {
    var regExp = /(^[a-z]([a-z_\.]*)@([a-z_\.]*)([.][a-z]{3})$)|(^[a-z]([a-z_\.]*)@([a-z_\.]*)(\.[a-z]{3})(\.[a-z]{2})*$)/i;
    return regExp.test(email);
}
function resetFormEdit() {
    var x = confirm("Are You Sure You Want To Discard This Pitch?");
    if (x) {
        $('#add_pitch').trigger("reset");
        location.reload();
    }
}
function checkEmails() {
    var emails = document.getElementById("emails").value;
    var pre_emails = document.getElementById("pre_emails").value;
    var url = $(location).attr('href'),
        parts = url.split("/"),
        pitch_id = parts[parts.length - 1];
    if (emails == '') {
        let accesstoken = getCookie('accesstoken');
        var pre_email_id_arr = pre_emails.split(',');
        $.ajax({
            url: site_url + 'update_share_pitch_email',
            headers: {
                'Accept': 'application/json',
                "access-token": accesstoken
            },
            method: 'POST',
            data: {
                pre_email_id: JSON.stringify(pre_email_id_arr),
                new_email_id: '',
                email_body: $('#email_body').val(),
                pitch_id: pitch_id,
                sender_name: $('#c_user_box').text()
            },
            dataType: 'json',
            success: function (response) {
                if (!response.success) {
                    return alert(JSON.stringify(response.message));
                }
                $('#viewers_emails').modal('hide');
                if (response.success == 'true') {
                    alert('Email Sent To Your Viewers, Please Reload The Page For See The Updated Page');

                }
            },
            error: function (jqXHR, textStatus) {
                alert("Request failed: " + textStatus);
            }
        });
    } else {
        var emailArray = emails.split(",");
        var pre_email_id_arr = pre_emails.split(',');
        let errorFlag = 0;
        for (i = 0; i <= (emailArray.length - 1); i++) {
            if (checkEmail(emailArray[i])) {
                //Do what ever with the email.
                console.log(emailArray);
            } else {
                errorFlag = errorFlag + 1
                alert("invalid email: " + emailArray[i]);
            }
        }
        if (errorFlag === 0) {
            tinyMCE.triggerSave();
            $('.loader_hp_').show('50');
            console.log('DO THE API CALL');
            let accesstoken = getCookie('accesstoken');
            $.ajax({
                url: site_url + 'update_share_pitch_email',
                headers: {
                    'Accept': 'application/json',
                    "access-token": accesstoken
                },
                method: 'POST',
                data: {
                    pre_email_id: JSON.stringify(pre_email_id_arr),
                    new_email_id: JSON.stringify(emailArray),
                    email_body: $('#email_body').val(),
                    pitch_id: pitch_id,
                    sender_name: $('#c_user_box').text()
                },
                dataType: 'json',
                success: function (response) {
                    if (!response.success) {
                        return alert(JSON.stringify(response.message));
                    }
                    $('.loader_hp_').hide('50');
                    alert('Email Sent To Your Viewers, Please Reload The Page For See The Updated Page');
                    location.reload();
                },
                error: function (jqXHR, textStatus) {
                    alert("Request failed: " + textStatus);
                }
            });
        }
    }
}

const editText = (id) => {
    $('.loader_hp_').show('50');
    $('#edit_text_modal').modal('show');
    $('#pitch_text').val('');
    $('#pitch_info_token').val('');
    let text = $('#textof_' + id).html();
    console.log('text====',$('#textof_' + id));
    $('#pitch_text').val(text);
    $('#pitch_info_token').val(id);
    tinymce.init({
        selector: "#pitch_text",
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
    // var content =  tinyMCE.getContent('pitch_text');
    // console.log(content)
    $('.loader_hp_').hide('50');
}

const editTextCall = () => {
    tinyMCE.triggerSave();
    let pitch_info_id = $('#pitch_info_token').val();
    let pitcht_text = $('#pitch_text').val();
    var formData = new FormData();
    formData.append('pitch_info_id', pitch_info_id);
    formData.append('pitch_info_text', pitcht_text);
    if (pitch_info_id == undefined || pitch_info_id == '') {
        alert('Something Went Wrong Please Reload The Page');
    } else {
        if (pitcht_text == '') {
            alert('Please Add Some Text Contain First');
        } else {

            $.ajax({
                url: site_url+'edit_pitch_text',
                headers: {
                    'Accept': 'application/json',
                },
                processData: false,  // tell jQuery not to process the data
                contentType: false,  // tell jQuery not to set contentType
                method: 'POST',
                data: formData,
                success: function (response) {
                    if (!response.success) {
                        return alert(JSON.stringify(response.message));
                    }
                    $('#edit_text_modal').modal('hide');
                    if (response.success == true) {
                        alert("Text Contains Are Updated Please Reload The Page To See Changes");
                        location.reload();
                    }
                },
                error: function (jqXHR, textStatus) {
                    alert("Request failed: " + textStatus);
                    location.reload();
                }
            });
        }
    }
}
$('#edit_text_modal').on('hidden.bs.modal', function () {
    // do something…
    //alert('HERE');
    tinymce.execCommand('mceRemoveControl', true, 'pitch_text');
})
$(document).on("click", '.btn-prev', function () {
    tinymce.execCommand('mceRemoveEditor', true, 'pitch_text');
});
$(document).on("click", '.btn-next', function () {
    tinymce.execCommand('mceRemoveEditor', true, 'pitch_text');
});

function checkFileTypeWithPlan(file) {
    let plan_type = $('.plan_').val();
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