const newPitch = function () {

    const handlePreview = (event) => {

    }
    const handleNewPitchFormUI = () => {
        
        $('.placeholder').hide();
        $('.preview_file').hide();
        $('.preview_file_image').hide();
        $('.preview_file_docs').hide();
        $('#main-box').addClass('active_one');
        
        $('#continue_btn_main').on("click", function () {
            $('.active_one').hide();
            $('#main-box').removeClass('active_one');
            $('.active_one').hide();
            $('div').removeClass('active_one');
            $(".current_preview").show('200');
        });
        
        $(document).on("click", '.a_another_btn', function () {
            $('.current_preview').hide();
            $('.active_one').hide();
            $('.add_another_o').hide();
            $(".add_another_o").removeClass("active_one");
            $(".another-page-blank").clone().appendTo(".add_box_here").addClass('add_another_o active_one').removeClass('another-page-blank');
            $('.add_another_o').show('200');
        })
        
        $(document).on("click", '.continue_btn', function () {
            $('.active_one').hide();
            $('div').removeClass('active_one');
            $(".current_preview").show('200');
        })
        
    }

    const handleDropZone = () => {
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
            console.log($value);
           // $(this).parent('.file').html(val);
           $(this).addClass('focus');
           $(this).closest('div.file-label').hide();
           $(this).closest("div.file-value").show();
            // 
            var fileExtensionVideo = ['avi', 'wmv', 'mov', '3gp', 'mp4'];
            var fileExtensionImage = ['png', 'jpeg', 'jpg','bmp'];
            var fileExtensionDocs = ['pdf','txt'];
            var filename = val;
            if (jQuery.inArray(jQuery.trim(filename.split('.').pop().toLowerCase()), fileExtensionVideo) != -1) {
                // Video Preview
                $('div').removeClass('current_preview');
                $(".preview_file").clone().appendTo(".add_preview").addClass('current_preview active_one').removeClass('preview_file');
                let fileUrl = $(this)[0].src = URL.createObjectURL(this.files[0]);
                $(".current_preview .video_here").attr("src", fileUrl);
            }
            else if(jQuery.inArray(jQuery.trim(filename.split('.').pop().toLowerCase()), fileExtensionImage) != -1) {
                // Image Preview
            $('div').removeClass('current_preview');
               $(".preview_file_image").clone().appendTo(".add_preview").addClass('current_preview active_one').removeClass('preview_file_image');
               let fileUrl = $(this)[0].src = URL.createObjectURL(this.files[0]);
               $(".current_preview .preview_image").attr("src", fileUrl);
            }
            else if(jQuery.inArray(jQuery.trim(filename.split('.').pop().toLowerCase()), fileExtensionDocs) != -1) {
                // PDF Preview
                $('div').removeClass('current_preview');
                $(".preview_file_docs").clone().appendTo(".add_preview").addClass('current_preview active_one').removeClass('preview_file_docs');
               let fileUrl = $(this)[0].src = URL.createObjectURL(this.files[0]);
               $(".current_preview .docs_priview_e").attr("src", fileUrl);
            }
            else{
              alert('FILE TYPE NOT SUPPORTED');
            }

        })
    }
    return {
        //main function to initiate the module
        init: function () {
            handleNewPitchFormUI();
            handleDropZone();
        }
    };
}();
jQuery(document).ready(function () {
    newPitch.init();
});