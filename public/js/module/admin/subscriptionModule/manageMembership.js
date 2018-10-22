$(document).ready(function () {
    $('#example').DataTable();
    $('.loader_hp_').hide('50');
    $(".views").on('click', function () {
        console.log('dasd');
        // show Modal
        $('#myModal').modal('show');
    });
});