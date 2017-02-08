---
  layout: post
  title: Render HTML Strings via Incremental DOM
  tag: JavaScript
  excerpt: With an HTML parser it is possible to start using Incremental DOM today with your templating engine of choice.
---

About a week ago, [Google announced Incremental DOM](https://medium.com/google-developers/introducing-incremental-dom-e98f79ce2c5f). It is a DOM diffing/patching library akin to React's rendering, virtual-dom, mithril, etc... But the key difference is that it does not create a virtual DOM to diff against. It instead applies the patch by walking through the actual DOM.

It's mostly meant as a compilation target for templating systems, primarily for Google's closure templates. And there is already some examples using JSX floating around out there. But while we wait for our favorite templating language to have an Incremental DOM fork, there are still ways to start using Incremental DOM today.

##HTML Parsing
Most of the common JavaScript templating languages render to a string of HTML. In order to call Incremental DOM's `elementOpen`, `text`, and `elementClose` methods appropriately, we need to parse the string of HTML to find those 3 parts. 

Thankfully there are a number of good HTML parsers written in JavaScript. Poking around a little I've found [htmlparser2](https://github.com/fb55/htmlparser2) to be a really good option. It is a little heavy in weight, but is really fast (check out the stats in its README) and it's callback API is a perfect map to Incremental DOM's methods.

{% highlight javascript %}
var parser = new Parser({
  onopentag: function(name, attrs) {
    // call IncrementalDOM.elementOpen with name and attrs
  }),
  ontext: IncrementalDOM.text,
  onclosetag: IncrementalDOM.elementClose
}, {decodeEntities: true}););
{% endhighlight %}

After setting up the parser, then it is a matter of writing the HTML to it, closing it, then patching the DOM.

{% highlight javascript %}
function render(html) {
  parser.write(html);
  parser.end();
}

IncrementalDOM.patch(el, render(html));
{% endhighlight %}

That is the majority of the code needed to use any templating language with Incremental DOM. There is a little bit of work to get the collection of attributes returned from htmlparser2 into the series of arguments pairs `elementOpen` takes.

{% highlight javascript %}
var argsArray = [name, null, null];

for (var attr in attrs) {
  argsArray.push(attr, attrs[attr]);
}		

IncrementalDOM.elementOpen.apply(null, argsArray);
{% endhighlight %}

And that'sp retty much it.

##html2idom
I put this all together into a little util, [html2idom](https://github.com/ericponto/html2IDOM). It is on npm (`npm install html2idom`. The main method to use is `patchHTML` which takes an element and a string of HTML. The HTML is parsed, the Incremental DOM is built, then the element is patched.

Imagine a render method of a view looking something like this:

{% highlight javascript %}
render: function(data) {
	var html = this.template(data);
	
	patchHTML(this.el, html);
}
{% endhighlight %}

I made an example of [html2idom with a dbmonster demo](https://www.ericponto.com/html2idom-dbmonster/) to test its performance. And it is actually pretty good. Parsing that big chunk of HTML does take a little time. However, the perf hit that you take by parsing the HTML is made up for in the really fast patch operation and the quick repaint.

On my low powered Chromebook, using the Dev Tool's profiler, I am getting a redraw on dbmonster every 110ms or so. About 55ms of that is parsing the HTML, 15ms for Incremental DOM, then 40ms to re-layout/paint. Compare that to the [underscore implementation](http://jashkenas.github.io/dbmonster/) that also redraws about every 110ms. The breakdown there is lighter on the JS processing time,only 40ms or so, but the repaint takes much longer as is it a full replace via `innerHTML`. 

So parsing HTML is no slower than the more traditional method. And you get the benefits of patching. This isn't a permanent solution though. The [dbmonster demo of straight Incremental DOM](http://localvoid.github.io/idom-dbmonster/) is lightning fast, redrawing every 60ms.  And once the templating engines are able to compile straight to Incremental DOM code, they'll be much faster that a solution relying on parsing. So maintainers of templating engines...please give Increment DOM a try.