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
function myActivate(id){

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