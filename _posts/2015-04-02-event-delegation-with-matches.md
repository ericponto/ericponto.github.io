---
  layout: post
  title: Event Delegation with .matches()
  tag: JavaScript
  excerpt: Oh DOM, you are always full of surprises. I feel like I should have learned about `el.matches()` a long time ago. You pass it a selector and it'll return true/false if it matches. Pretty useful, and I think its most useful application is with event delegation.
---

Oh DOM, you are always full of surprises. I feel like I should have learned about `el.matches()` a long time ago (even though it is a relatively new method), but it guess it is something I've always glossed over. Well it is a really useful little thing. `matches` is equivalent to jQuery's `is`. You pass it a selector and it'll return true/false if it matches.

{% highlight javascript %}
<h1 class="page-title"></h1>

var h1 = document.querySelector("h1");
h1.matches(".page-title"); // true
{% endhighlight %}

I think its most useful application is with event delegation. It feels like event delegation has been kind of a forgotten topic lately as a lot of frameworks are moving event handlers back into the HTML with things like `ng-click` or  `{action on="click"}` or good ol' `onClick`. I generally prefer my concerns separated though. I have always been a big fan of Backbone's `events` pattern that relies on event delegation. 

Lately though, I've been really diving deep in to Functional Reactive Programming working with event streams. This works great when you have pre-built HTML and you can attach event handlers directly. But a lot of the time we're doing some sort of client side templating that is rendered when the event stream spits out a value. Something like this:

{% highlight javascript %}
var button = document.querySelector("button");
var stepper = Rx.Observable.fromEvent(button, "click");

stepper.startWith(0)
	.map(1)
	.scan((sum, num) => sum + num)
	.subscribe(renderView);
{% endhighlight %}

Image `renderView` renders some template that displays the result, but also contains the button. In that case, when the button is in the view, then the above code no longer works. The button won't be rendered when trying to attach the event. So event delegation to the rescue. You can attach the event listener to the view's container element, then use `filter` and `.matches` to have the clicks on apply to the button.

{% highlight javascript %}
var stepper = Rx.Observable.fromEvent(el, "click")
	 .filter(e => e.target.matches("button"));
{% endhighlight %}

There is also just the vanilla JavaScript implementation of event delegation with `matches`.

{% highlight javascript %}
el.addEventListener("click", function(e) {
	if (e.target.matches("button")) {
		// handle click
	}
}, false);
{% endhighlight %}

[Browser support for matches](http://caniuse.com/#feat=matchesselector) is actually pretty good, though a lot of browsers support a prefixed version of `matchesSelector`. WebPlatform.org recommends uses an implementation like the below for the most support.

{% highlight javascript %}
var docEl = document.documentElement,
	matches = docEl.matches || docEl.webkitMatchesSelector
		|| docEl.mozMatchesSelector || docEl.msMatchesSelector
		|| docEl.oMatchesSelector;

matches.call(element, selector);
{% endhighlight %}

If necessary, you can also polyfill `matches` functionality in browsers that support `querySelectorAll`, which gets you almost everything (just not IE<8). From [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Element/matches):

{% highlight javascript %}
function (selector) {
  var element = this;
  var matches = (element.document || element.ownerDocument).querySelectorAll(selector);
  var i = 0;
  
  while (matches[i] && matches[i] !== element) {
    i++;
  }

  return matches[i] ? true : false;
}
{% endhighlight %}

So that's it. It's kind of nice to no long rely on jQuery for event delegation.