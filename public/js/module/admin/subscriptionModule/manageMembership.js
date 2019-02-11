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
function ConfirmDelete(id) {
    var x = confirm("Are you sure you want to delete?");
    if (x) {
        $('.loader_hp_').show('50');
        let accesstoken = getCookie('accesstoken');
        $.ajax({
            url: site_url+'admin/remove_membership_plan',
            headers: {
                'Accept': 'application/json',
                "access-token": accesstoken
            },
            type: 'POST',
            data: {
                "plan_id": id
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