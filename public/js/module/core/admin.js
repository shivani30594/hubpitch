const AdminCore = () => {

    const getCookie = (name) => {
        var value = "; " + document.cookie;
        var parts = value.split("; " + name + "=");
        if (parts.length == 2) return parts.pop().split(";").shift();
    }

    const handleAdminCoreCookie = () => {
        let accesstoken = getCookie('accesstoken')
        console.log(accesstoken);
    }

    return {
        //main function to initiate the module
        init: function () {
            handleAdminCoreCookie();
        }
    };
}
jQuery(document).ready(function () {
    AdminCore.init();
});