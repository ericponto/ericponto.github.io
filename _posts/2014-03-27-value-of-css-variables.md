---
  layout: post
  title: The value of CSS variables
  tag: CSS
  excerpt: When I first thought about CSS variables, I didn't really see how they would be useful. But now I see that the real value of CSS variables comes from their ability to enable configuration and customization of reusable components.
---

When I first thought about CSS variables, I didn't really see how they would be useful. I was just thinking about variables in terms of reusing values. So, define a color in a variable, reuse it in a few spots. That alone is kind of helpful...if I want to change the color, just change it in the variable and it trickles down to all of the spots I used it. We already have that though, within any of the CSS preprocessors. And, I feel like the job of resolving a reusable variable makes more sense to do at build time, than in the browser.

But, with the kind of recent addition of CSS variables in Firefox, I've given them a second thought. <span class="pullquote">The real value of CSS variables comes from their ability to enable configuration and customization of reusable components.</span> And, with [web components](http://w3c.github.io/webcomponents/explainer/) slowly, but surely coming, this is going to be an even more important concept.

## The basics
If you haven't seen the syntax of CSS variables, here are the basics. A CSS variables is much the same as a variable in any other programming language. You declare them with a name and a value, then can use them throughout your CSS.

The syntax to declare a new CSS variable is simalar to anything in CSS. It is a `name: value` pair. And it must be declared inside a ruleset for a selector. To globally declare the variable, it can just be done on the `:root`. The specific syntax is:

{% highlight css %}
:root {
	/* set a variable named "my-color" to "#c0ffee"
	var-my-color: #c0ffee;
}
{% endhighlight %}

To reference a variable, you use the `var()` notation passing in the name of the variable.

{% highlight css %}
/* use the my-color variable */
h1 {
	color: var(my-color);
}
{% endhighlight %}

## The cool part
CSS variables are scoped via the cascade and specificity just like any other CSS rule. That means we can use the same variable name, but set it to different values for different selectors. 

So, a simple example...we want the link color as a default to be blue, but if it has a class of `link-alt` to be red, if it is inside of the the `.sidebar` of the site to be green, and on really large screens to be yellow. Here's how we could set that up:

{% highlight css %}
:root {
	var-link-color: blue;
}

.link-alt {
	var-link-color: red;
}

.sidebar {
	var-link-color: green;
}

@media all and (min-width: 1500px) {
	:root {
		var-link-color: yellow;
	}
}

a {
	color: var(link-color);
}
{% endhighlight %}

The real value, I think, is in the `.sidebar` case. Traditionally, we would have either had to create a new class for the link to have a green color (like we did with `.link-alt`) or we would have had to make use of a longer selector (`.sidebar a`). For a simple link, there's not any huge efficiency gain here, but let's look at a bigger example.

## A reusuable component
For this example, let's just say we have a panel component that we might want to drop in different places on our website. Some simple markup:

{% highlight html %}
<div class="panel">
	<header class="panel-header">
		<h1>Header Text</h1>
	</header>
	<div class="panel-body">
		<p>Lorem ipsum...</p>
	</div>
</div>
{% endhighlight %}

For the default styling we're going with a gray and white theme, with some standard padding.

{% highlight css %}
.panel {
	border: 1px solid #ccc;
	border-radius: 2px;
	color: #222;
}

.panel-header {
	background-color: #ddd;
	padding: 1em;
}

.panel-body {
	background-color: #fff;
	padding: 1em;
}
{% endhighlight %}

Now, if we want to drop the panel into the footer of the site, which may be a different color and might have a little less room (so we want to decrease the padding), we're going to have to make some changes. Without variables, we'd need to create modifiers for the `.panel`, `.panel-header` and the `.panel-body`. It would look something like:

{% highlight css %}
.panel-alt {
	border: 1px solid #036;
	color: #fff;
}

.panel-header-alt {
	background-color: #069;
	padding: .5em;
}

.panel-body-alt {
	background-color: #39c;
	padding: .5em;
}
{% endhighlight %}

So our CSS has almost doubled in size and we now need to modify our HTML with the new classnames. So that's not ideal. The other way to do it without variables, is to prefix all of our selectors with the the footer.

{% highlight css %}
.footer .panel {
	border: 1px solid #036;
	color: #fff;
}

.footer .panel-header {
	background-color: #069;
	padding: .5em;
}

.footer .panel-body {
	background-color: #39c;
	padding: .5em;
}
{% endhighlight %}

Again the CSS has dramatically grown, but at least we don't have to change our HTML. The specificity of all of our selectors has grown too. That's not neccessarily a problem, but I like to keep everything at the class/attribute specificty level for simplicity and to let the cascade do its thing.

So here is where variables can really help us out. First let's make some of those properties configurable with variables.

{% highlight css %}
:root {
	var-panel-color: #222;
	var-panel-header-bg-color: #ddd;
	var-panel-body-bg-color: #fff;
	var-panel-border-color: #fff;
	var-panel-padding: 1em;
}

.panel {
	border: 1px solid var(panel-border-color);
	border-radius: 2px;
	color: var(panel-color);
}

.panel-header {
	background-color: var(panel-header-bg-color);
	padding: var(panel-padding);
}

.panel-body {
	background-color: var(panel-body-bg-color)
	padding: var(panel-padding);
}
{% endhighlight %}

Now we can just update those variables for the footer.

{% highlight css %}
.footer {
	var-panel-color: #fff;
	var-panel-header-bg-color: #069;
	var-panel-body-bg-color: #39c;
	var-panel-border-color: #036;
	var-panel-padding: .5em;
}
{% endhighlight %}

And that's it. That's all the extra CSS needed and no changes are needed to the HTML...just drop it in the footer.

## The future

The spec for [CSS Variables](http://dev.w3.org/csswg/css-variables/) has some features that have not been implemented in any of the browser (as far as I can tell at least). The one that I think is most exciting is a second argument that can be passed into `var` that defines a fallback value if the variable has not been set.

{% highlight css %}
h1 {
	color: var(my-color, #f00);
}
{% endhighlight %}

In this case, if `var-my-color` hasn't been defined anywhere in scope, then the color of the `h1` will fallback to a nice bright red, `#f00`. The fallback argument makes defining default values much simpler. You will no longer have to load up the `:root` with all of the defaults...they can be defined in place.

Now what we need is for much better browser support. Chrome has had CSS Variables behind the "Experimental Web Platform features" flag for a while and Firefox now has them behind the `layout.css.variables.enabled` pref. Hopefully soon they'll both be available by default and more browser will add support.

