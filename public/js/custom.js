$(document).ready(function(){
	$(".account").click(function(){
		$(".account-sub-menu").toggleClass("show-menu");
	});
	$(".mobile-menu").click(function(){
		$(".menu-items > ul").slideToggle(600);
	})
});