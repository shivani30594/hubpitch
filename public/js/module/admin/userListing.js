const site_url = "http://localhost:3000/";
$(document).ready(function () {
    let accesstoken = getCookie('accesstoken')
    // $.ajax({
    //     url: site_url + 'admin/get_user_list',
    //     headers: {
    //         'Accept': 'application/json',
    //         "access-token": accesstoken
    //     },
    //     method: 'POST',
    //     dataType: 'json',
    //     success: function (response) {
    //         if (!response.success) {
    //             return alert(JSON.stringify(response.message));
    //         }
    //         let data = response.data;
    //         console.log(data);
    //         // let dataHTML = '';
    //         // data.forEach((obj) => {
    //         //     dataHTML = ''
    //         //     if (obj) {
    //         //         dataHTML = '<tr> <td>' + obj.company_name + '</td> <td>' + obj.page_count + '</td> <td>' + obj.user_id + '</td> <td>' + obj.created + '</td> </tr>';
    //         //         $('#tbody_datatable').append(dataHTML);
    //         //     }
    //         // })
    //         // $('#example').DataTable();
    //     },
    //     error: function (jqXHR, textStatus) {
    //         alert("Request failed1r: " + textStatus);
    //     }
    // });
    $('#example').DataTable();
    share_pitch();
});
const share_pitch = () => {
    //alert("rip");
    // $('#name-window').modal('hide');
    // let viewerName = getCookie('viewerName');
    // let viewerRole = getCookie('viewerRole');
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
            email_body: {
                required: true
            },
        },
        submitHandler: function (form) {
            console.log("rip");
            $('.loader_hp_').show();
            let view_token = getCookie('viewertoken')
            tinyMCE.triggerSave();
            // $.ajax({
            //     url: site_url + 'share-pitch',
            //     type: 'POST',
            //     dataType: 'json',
            //     data: {
            //         email_id: $('input[name="email_id"]').val(),
            //         sender_name: viewerName,
            //         sender_role: viewerRole,
            //         url: window.location.href,
            //         email_body: $('textarea[name="email_body"]').val(),
            //         pitch_token: $('#pitch_token').val(),
            //         user_token: $('#user_token').val(),
            //         user_email: $('#user_email').val(),
            //         company_name: $('#company_name').val()
            //     },
            //     success: function (response) {
            //         if (!response.success) {
            //             //return alert(JSON.stringify(response.error));
            //         }

            //         $('.loader_hp_').hide();
            //         //console.log(response);
            //         if (JSON.stringify(response.success == 'true')) {
            //             // $('input[name="sender_name"]').val('');
            //             $('input[name="email_id"]').val('');
            //             $('#name-window').modal('hide')
            //             $("#success-alert").fadeTo(5000, 500).slideUp(500, function () {
            //                 $("#success-alert").slideUp(500);
            //             });
            //         }
            //     },
            //     error: function (jqXHR, textStatus) {
            //         //alert("Request failed: " + textStatus);
            //     }
            // });
        }
    });
}
function myActivate(id) {

    var r = confirm("Are you sure you want to Activate the User!");
    if (r == true) {

        let accesstoken = getCookie('accesstoken')
        $.ajax({
            url: site_url + 'admin/active_user',
            headers: {
                'Accept': 'application/json',
                "access-token": accesstoken
            },
            method: 'POST',
            data: {
                "user_id": id
            },
            success: function (response) {
                if (!response.success) {
                    return alert(JSON.stringify(response.message));
                }
                alert(response.message);
                location.reload();
            },
            error: function (jqXHR, textStatus) {
                alert("Request failed: " + textStatus);
            }
        });
    } else {
        txt = "You pressed Cancel!";
    }
}

function myDeactive(id) {

    var r = confirm("Are you sure you want to deactivate the User!");
    if (r == true) {

        let accesstoken = getCookie('accesstoken')
        $.ajax({
            url: site_url + 'admin/block_user',
            headers: {
                'Accept': 'application/json',
                "access-token": accesstoken
            },
            method: 'POST',
            data: {
                "user_id": id
            },
            success: function (response) {
                if (!response.success) {
                    return alert(JSON.stringify(response.message));
                }
                alert(response.message);
                location.reload();
                // console.log(data);
                // let dataHTML = '';
                // data.forEach((obj) => {
                //     dataHTML = ''
                //     if (obj) {
                //         dataHTML = '<tr> <td>' + obj.company_name + '</td> <td>' + obj.page_count + '</td> <td>' + obj.user_id + '</td> <td>' + obj.created + '</td> </tr>';
                //         $('#tbody_datatable').append(dataHTML);
                //     }
                // })
                // $('#example').DataTable();
            },
            error: function (jqXHR, textStatus) {
                alert("Request failed: " + textStatus);
            }
        });
    } else {
        txt = "You pressed Cancel!";
    }
}

function ConfirmDeleteUser(id) {
    var x = confirm("Are you sure you want to delete?");
    if (x) {
        $('.loader_hp_').show('50');
        let accesstoken = getCookie('accesstoken');
        console.log(id);
        $.ajax({
            url: site_url + 'admin/remove-pitch',
            headers: {
                'Accept': 'application/json',
                "access-token": accesstoken
            },
            type: 'POST',
            data: {
                "user_id": id
            },
            success: function (response) {
                if (!response.success) {
                    return alert(JSON.stringify(response.error));
                }
                console.log(response)
                $('.loader_hp_').hide('50');
                alert(response.message);
                location.reload();
            },
            error: function (jqXHR, textStatus) {
                alert("Request failed: " + textStatus);
            }
        });
    }
    else
        return false;
}
// function sharePitch() {
//     alert("rip");

//     $(".share_pitch_form").validate({
//         errorElement: 'span', //default input error message container
//         errorClass: 'error-block', // default input error message class
//         focusInvalid: false, // do not focus the last invalid input
//         ignore: "",
//         rules: {
//             email_id: {
//                 required: true,
//                 email: true
//             },
//             email_body: {
//                 required: true
//             },
//         },
//         submitHandler: function (form) {
//             $('.loader_hp_').show();
//             let view_token = getCookie('viewertoken')
//             tinyMCE.triggerSave();
//             $.ajax({
//                 url: site_url + 'share-pitch',
//                 type: 'POST',
//                 dataType: 'json',
//                 data: {
//                     email_id: $('input[name="email_id"]').val(),
//                     sender_name: viewerName,
//                     sender_role: viewerRole,
//                     url: window.location.href,
//                     email_body: $('textarea[name="email_body"]').val(),
//                     pitch_token: $('#pitch_token').val(),
//                     user_token: $('#user_token').val(),
//                     user_email: $('#user_email').val(),
//                     company_name: $('#company_name').val()
//                 },
//                 success: function (response) {
//                     if (!response.success) {
//                         //return alert(JSON.stringify(response.error));
//                     }

//                     $('.loader_hp_').hide();
//                     //console.log(response);
//                     if (JSON.stringify(response.success == 'true')) {
//                         // $('input[name="sender_name"]').val('');
//                         $('input[name="email_id"]').val('');
//                         $('#name-window').modal('hide')
//                         $("#success-alert").fadeTo(5000, 500).slideUp(500, function () {
//                             $("#success-alert").slideUp(500);
//                         });
//                     }
//                 },
//                 error: function (jqXHR, textStatus) {
//                     //alert("Request failed: " + textStatus);
//                 }
//             });
//         }
//     });
// }
