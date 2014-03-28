(function(document) {

// pullquotes script
var postPage = function() {
	var pullquotes = document.querySelectorAll(".pullquote");
	[].forEach.call(pullquotes, function(el) {
		var html = el.innerHTML;
		var parent = el.parentNode;
		var pullquote = document.createElement("div");

		pullquote.className = "pullquote-right";
		pullquote.innerHTML = html;

		parent.parentNode.insertBefore(pullquote, parent);
	});
};

var loadScript = function(url) {
	var script = document.createElement("script");
	script.async = true;
	script.src = url;
	document.getElementsByTagName("body")[0].appendChild(script);
};

var loadDisqus = function() {
	document.getElementById("load-disqus").style.display = "none";
	loadScript("//ericponto.disqus.com/embed.js");
};

// Disqus coments
if (window.matchMedia && window.matchMedia("only all and (max-width: 35em)").matches) {
	document.getElementById("load-disqus").addEventListener("click", function() {
		loadDisqus();
	}, false);
} else {
	loadDisqus();
}


// cuts the mustard
if ( "querySelectorAll" in document && Array.prototype.forEach) {
	postPage();
}

})(document);