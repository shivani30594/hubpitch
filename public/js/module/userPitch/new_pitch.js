const newPitch = function () {

    let accesstoken = getCookie('accesstoken');

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
            if ($('#c-name').val() == '') {
                Swal('Validation Error', 'Company Name Is Required!', 'error')
            } else {
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

                var $kukuNode = $(".kuku-viewer-node");
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
                            instance.parse(file,
                                function () {
                                    /** render API
                                     *  structure : render(element, callbackFn, pageId) **/
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
        $.ajax({
            url: 'http://localhost:3000/add_pitch',
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
                console.log('response', response);
                $('#add_new_pitch_form').hide('100');
                let cName = $('#c-name').val();
                $('#final_section').show('100');
                $('#final_name').val(cName);
                $('#pitch_id').val(response.pitch);
            },
            error: function (jqXHR, textStatus) {
                alert("Request failed: " + textStatus);
            }
        });
    }
    const handleShareLink = () => {
        $(document).on("click", '#create_pitch', function () {
            let accesstoken = getCookie('accesstoken')
            $.ajax({
                url: 'http://localhost:3000/manage_pitch',
                headers: {
                    'Accept': 'application/json',
                    "access-token": accesstoken
                },
                method: 'POST',
                data: {
                    pitch_id: $('#pitch_id').val(),
                },
                dataType: 'json',
                success: function (response) {
                    if (!response.success) {
                        return alert(JSON.stringify(response.message));
                    }
                    console.log(response);
                },
                error: function (jqXHR, textStatus) {
                    alert("Request failed: " + textStatus);
                }
            });
        });
    }
    return {
        //main function to initiate the module
        init: function () {
            handleNewPitchFormUI();
            handleDropZone();
            handleContinue_final();
            handleShareLink();
        }
    };
}();
jQuery(document).ready(function () {
    newPitch.init();
});