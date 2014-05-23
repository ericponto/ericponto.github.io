---
  layout: post
  title: Building a drag and drop JavaScript minifier
  tag: JavaScript
  excerpt: Sometimes setting up Grunt or Gulp is just too much. Learn how to build a JavaScript minifer completely in the browser using drag and drop.
---

There are a million different tools to minify JavaScript files. There are different engines that do it: Uglify, JSMin, Closure Compiler, etc... And you can use these tools via the command line, using Grunt or Gulp, or with something like CodeKit. But sometimes you just have a one off need to take a JavaScript file where all of those solutions feel a little heavy. So let's build something.

## Drag and drop files
The events for drag and drop are very similar to the mouse events. Instead of `mouseover` you have `dragover` and instead of `click` you have `drop`. There is also `dragstart`, `drag`, `dragenter`, `dragleave`, and `dragend`. To use the events is the same too...just use `addEventListener`.

{% highlight js %}
document.querySelector(".dropzone").addEventListener("drop", handleDrop, false);
{% endhighlight %}


The trick to working with dropped files, is the `dataTransfer` object that gets added to the event in your handler. (Note: When using jQuery, to access `dataTransfer` on the event object, you need to use `event.originalEvent.dataTransfer`.) The `dataTransfer` object can control what type of drag and drop "action" is allowed (copy, move, etc...), and it holds the data for the thing being moved. In the case of files, we want to `copy` the dropped file and we can access the files on `dataTransfer.files`.

{% highlight js %}
var dropzone = document.querySelector(".dropzone");

dropzone.addEventListener("dragover", function(e) {
	e.preventDefault();
	e.stopPropagation();
	
	e.dataTransfer.dropEffect = "copy";
}, false);

dropzone.addEventListener("drop", function(e) {
	e.preventDefault();
	e.stopPropagation();
	
	var files = e.dataTransfer.files;
}, false);
{% endhighlight %}

## The FileReader API
When files are dropped, `dataTransfer.files` is a `FileList` object. It's basically an array of the files (though not technically an array so you can't do things like`forEach` on it directly.) Each file object in the list holds some really basic information about the file: `name`, `size`, `type`, and `lastModifiedDate`. And that's cool. But what we really want is the contents of the file.

The `FileReader` object lets us read the contents of a file. If you've ever added an image to a page via JavaScript, the syntax will look familiar. You create a new instance of the reader, set an onload event, then hook it up to the file. You can read a file as binary, a Blob, an ArrayBuffer, a data URL, or as text. In our case, we want to text of the JavaScript file to pass into our minifier.

{% highlight js %}
var reader = new FileReader();

reader.onload = function(e) {
	var text = e.target.result;
}

reader.readAsText(file);
{% endhighlight %}

## Putting it together
Really the last thing to do now is minify the text read out of the file. Luckily there is a [port of Uglify built to run in the browser](https://github.com/jrburke/uglifyweb), so that's taken care of. All we need to do is call `uglify` with our text and store off the output.

{% highlight js %}
var dropzone = document.querySelector(".dropzone");
var results = document.querySelector(".results");

dropzone.addEventListener("dragover", function(e) {
	e.preventDefault();
	e.stopPropagation();

	e.dataTransfer.dropEffect = "copy";
}, false);

dropzone.addEventListener("drop", function(e) {
	e.preventDefault();
	e.stopPropagation();

	// let's just work with one file
	var file = e.dataTransfer.files[0];
	var reader = new FileReader();

	reader.onload = function(e) {
		var text = e.target.result;

		// use uglifyweb to minify the file
		var output = uglify(text);

		// put the minified code in the results element
		results.innerHTML = output;
	}

	reader.readAsText(file);

}, false);
{% endhighlight %}

Check out a working example: [Drag and Drop JavaScript Minifier Demo](http://ericponto.com/demos/jsminify/index.html).

## Browser Support
I should probably mention browser support at some point. It is actually pretty good. [Drag and drop has great support](http://caniuse.com/dragndrop) on non-mobile browsers. IE actually implemented a version of it was back in IE5. The [file reader's support](http://caniuse.com/filereader) is more widespread wth the addition of the mobile browsers, but doesn't extend very far back in version of IE.

So, if you have an app that relies on working with use files and want broader reach, it is probably best to have a file input on the page as well as a drop zone. And, have the ability to post those files back to a server somewhere that handles them in the same way.

## Keep exploring
Once you have down the drag and drop events and the `FileReader`, the doors are pretty open to what you can do in the browser with files. If you want to read more about them, the [HTML5Rocks article](http://www.html5rocks.com/en/tutorials/file/dndfiles/) on the topic is good. (Which, side note is from 4 years ago! And, I'm just now writing about it...) So with these tools, you can expand to do things like minify CSS and HTML, compile CoffeeScript and LESS, convert a CSV file into an HTML table, [convert SVGs into PNG fallbacks](http://grumpicon.com), and on and on. Right now I'm working on a drag and drop tool, [ToasterOven](http://ericponto.com/ToasterOven/), that tries to do a lot of these types of tasks in a simple way and lets you download a zip file of everything at the end.

