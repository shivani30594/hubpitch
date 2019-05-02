const site_url = "http://localhost:3000/";
$(document).ready(function () {
    $('#example').DataTable();
    $('.loader_hp_').hide('50');
    $(".views").on('click', function () {
        console.log('dasd');
        // show Modal
        $('#myModal').modal('show');
    });
});


function myActivate(id) {

    var r = confirm("Are you sure user issue has resolved successfully!");
    if (r == true) {

        let accesstoken = getCookie('accesstoken')
        $.ajax({
            url: site_url + 'admin/pending_user',
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



