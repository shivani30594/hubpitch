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