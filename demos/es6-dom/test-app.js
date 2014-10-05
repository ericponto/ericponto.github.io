import {$} from "./es6-dom";

$(".addClass").addClass("passed");
$(".removeClass").removeClass("failed");

if ($(".hasClass").hasClass("hasClass")) {
	$(".hasClass").addClass("passed");
}

$("a").on("click", function(e) {
	e.preventDefault();
	alert("cliked");
});