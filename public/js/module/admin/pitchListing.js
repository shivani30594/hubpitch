const site_url = "http://localhost:3000/";
$(document).ready(function () {
    let accesstoken = getCookie('accesstoken')
    $.ajax({
        url: site_url + 'admin/get_pitch',
        headers: {
            'Accept': 'application/json',
            "access-token": accesstoken
        },
        method: 'POST',
        dataType: 'json',
        success: function (response) {
            if (!response.success) {
                return alert(JSON.stringify(response.message));
            }
            let data = response.data;
            console.log(data);
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
    $('#example').DataTable();
});

function myDeactive() {

    var txt;
    var r = confirm("Press a button!");
    if (r == true) {
        txt = "You pressed OK!";
        let accesstoken = getCookie('accesstoken')
        $.ajax({
            url: site_url + 'admin/get_pitch',
            headers: {
                'Accept': 'application/json',
                "access-token": accesstoken
            },
            method: 'POST',
            dataType: 'json',
            success: function (response) {
                if (!response.success) {
                    return alert(JSON.stringify(response.message));
                }
                let data = response.data;
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
    alert(txt);
}
function ConfirmDeleteUser(id) {
    alert("hello");
    var x = confirm("Are you sure you want to delete?");
    if (x) {
        $('.loader_hp_').show('50');
        let accesstoken = getCookie('accesstoken');
        console.log(id);
        // $.ajax({
        //     url: site_url + 'admin/remove_membership_plan',
        //     headers: {
        //         'Accept': 'application/json',
        //         "access-token": accesstoken
        //     },
        //     type: 'POST',
        //     data: {
        //         "plan_id": id
        //     },
        //     success: function (response) {
        //         if (!response.success) {
        //             return alert(JSON.stringify(response.error));
        //         }
        //         console.log(response)
        //         $('.loader_hp_').hide('50');
        //         alert(response.message);
        //         location.reload();
        //     },
        //     error: function (jqXHR, textStatus) {
        //         alert("Request failed: " + textStatus);
        //     }
        // });
    }
    else
        return false;
} 