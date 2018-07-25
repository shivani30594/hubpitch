const newPitch = function () {
    const handleNewPitchFormUI = () => {
        $('.placeholder').hide();
        $('#main-box').addClass('active_one');
        $('#continue_btn_main').on("click", function () {
            $('.active_one').hide();
            $('#main-box').removeClass('active_one');
            $('#placeholder-box').show('200');
            $('#placeholder-box').addClass('active_one');
        });
        $(document).on("click", '.a_another_btn', function () {
            $('.active_one').hide();
            $('.add_another_o').hide();
            $(".add_another_o").removeClass("active_one");
            $(".another-page-blank").clone().appendTo(".add_box_here").addClass('add_another_o active_one').removeClass('another-page-blank');
            $('.add_another_o').show('200');
        })
        $(document).on("click",'.continue_btn',function(){
            $('.active_one').hide();
            $('div').removeClass('active_one');
            $('#placeholder-box').show('200');
            $('#placeholder-box').addClass('active_one');
        })
        $(document).on("click",'.continue_btn',function(){
            $('.active_one').hide();
            $('div').removeClass('active_one');
            $('#placeholder-box-2').show('200');
            $('#placeholder-box').addClass('active_one');
        })
    }

    const handleDropZone = () => {
        $(document).on("change", '.drop_zone_input', function () {
            console.log('hasdas');
            var $element = $(this);
            var $input = $element;
            var $value = $(this).parent('.file').find('.file-value');
            console.log($value);
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
             console.log(val);
             $(this).parent('.file').html(val);
             $(this).addClass('focus');
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