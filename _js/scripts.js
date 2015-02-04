(function(window, document) {

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
	if (window.matchMedia && window.matchMedia("only all and (max-width: 480px)").matches) {
		document.getElementById("load-disqus").addEventListener("click", function() {
			loadDisqus();
		}, false);
	} else {
		loadDisqus();
	}

})(window, document);