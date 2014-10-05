---
  layout: post
  title: Creating an ES6 DOM Library
  tag: JavaScript
  excerpt: ES6 and ES7 are making JavaScript even better. To expirement with some of the new features, let's look at how to write a jQuery-like DOM library.
---

I've been exploring what the new specification of JavaScript have in store, and I have to say I'm pretty excited with the direction it is going. A lot of the common problems that require a lot of boilerplate to solve, now have simple methods (for example, creating an array out of an array-like object). So just to expirement with ES6 (and maybe a little bit of ES7), I wanted to try to make a jQuery-like DOM library. 

##Getting Classy
jQuery sometime feels like it has a lot of magic going on, but the whole DOM library part of it is just some syntax sugar around the usual constructor function/prototype pattern. When you call the `$` with a selector, it creates a `new` jQuery object. Then, all those methods and plugins that get added to `$.fn` are really just getting added to `$.prototype`. (This line is right in the jQuery source: `jQuery.fn = jQuery.prototype ...`

With ES6, we can do the same sort of thing, but using the new `class`. The syntax for `class` I think is a little easier to digest than a function (which we only know is a constructor based on a naming convention) and than the mysterious `prototype`. The constructor function still exists, but now is a keyword. And methods of the class just get added one after another in the `class` block. For our DOM library it is going to look like:

{% highlight js %}
class DOM {
  constructor( selector ) {}

  each( callback ) {}

  addClass( className ) {}

  /* ... */
}
{% endhighlight %}

Then to create a new instance of the DOM class, it's the same as it always was...just use `new`. To be like jQuery, we can wrap that with a function named `$` and using arrow functions it'll look like:

{% highlight js %}
var $ = selector => new DOM(selector);
{% endhighlight %}

##The constructor
When a new instance of an class is instantiated, the `constructor` method is called. It is the as creating any function and calling it via `new`. For the DOM library, we're going so store off all the matched elements via `querySelectorAll`.

If you've ever looked at the jQuery object returned when you call `$` in the console, it looks like an array. But really it is just an array-like object. It has some different properties, but also has a list of the matched elements that is 0-based indexed (so it looks like `{0: el1, 1: el2, ...}`). The `length` property is also needed to make it array-like. In jQuery they make this array-like object with a method called `makeArray`, which uses `$.merge` to combined the matched elements into the jQuery object by looping over the elements.

In ES6, there is a new object method, `assign`, that handles merging objects. It's very similar to `$.extend`. So making an array-like object from the matched elements becomes a little easier. 

{% highlight js %}
constructor( selector ) {
  var elements = document.querySelectorAll(selector);

  this.length = elements.length;
  Object.assign(this, elements);
}
{% endhighlight %}

##Loop with for...of
For the `each` method, we need to loop over the matching elements of the selector we saved on `this`.  We'd traditionally just use a `for` loop looking something like `for (i = 0; i < this.length; i++ ) { /* do stuff with this[i] */ }`.  But with the new `for...of` loop, it gets much simpler. `for (el of this) { /* do stuff with el */ }`

That doesn't quite work out of the box though because `this` would need to be iterable. We could create a custom iterator for `this`, but it is easier to just convert it into an array  (which is iterable). A new Array method, `from`, makes it much easier to take an array-like object, like `this`, and convert it to an array (say goodbye to `Array.prototype.slice.call()`). So our each method becomes:

{% highlight js %}
each( callback ) {
  for ( let el of Array.from(this) ) {
    callback.call(el);
  }
  
 // return this for chaining
  return this;
}
{% endhighlight %}
 
##Actually doing stuff
jQuery has a bunch of methods to traverse and manipulate elements once you select them. I've found the majority of what I want to do with jQuery is change class names and add event listeners.

There isn't anything special with ES6 that is going to make adding a class any simpler (at least that I could think of), so it's just:

{% highlight js %}
addClass( className ) {
  return this.each(function() {
    this.classList.add(className);
  });
}
{% endhighlight %}

Adding an event listener is the same as well.

{% highlight js %}
on( event, callback ) {
  return this.each(function() {
    this.addEventListener(event, callback, false);
  });
}
{% endhighlight %}

##Modularization
To make this a module, we'll just export the `$` function.

{% highlight js %}
export var $ = selector => new DOM(selector);
{% endhighlight %}

Then to use our library in another module, it just need to be imported.

{% highlight js %}
import {$} from "./es6-dom";
{% endhighlight %}

##Putting it together
Here's the whole file with the `removeClass` and `hasClass` methods filled in.

{% highlight js %}
/**
 * jQuery like DOM class
 * @class
 */
class DOM {
	/**
	 * create a new array like object of elements
	 * @constructor
	 */
	constructor( selector ) {
		var elements = document.querySelectorAll(selector);
		
		this.length = elements.length;
		
		Object.assign(this, elements);
	}
	
	/**
	 * @param {Function} callback A callback to call on each element
	 */
	each( callback ) {
		// convert this to Array to use for...of
		for ( let el of Array.from(this) ) {
			callback.call( el );
		}
		
		// return this for chaining
		return this;
	}
	
	/**
	 * Add a class to selected elements
	 * @param {String} className The class name to add
	 */
	addClass( className ) {
		return this.each(function() {
			this.classList.add(className);
		});
	}
	
	/**
	 * Remove a class from selected elements
	 * @param {String} className The class name to remove
	 */
	removeClass( className ) {
		return this.each(function() {
			this.classList.remove(className);
		});
	}
	
	/**
	 * Check to see if the element has a class
	 * (Note: Only checks the first elements if more than one is selected)
	 * @param {String} className The class name to check
	 */
	hasClass( className ) {
		return this[0].classList.contains(className);
	}
	
	/**
	 * Attach an event listener with a callback to the selected elements
	 * @param {String} event Name of event, eg. "click", "mouseover", etc...
	 * @param {Function} callback The function to call when the event is triggered
	 */
	on( event, callback ) {
		return this.each(function() {
			this.addEventListener(event, callback, false);
		});
	}
};

export var $ = selector => new DOM(selector);
{% endhighlight %}

To actually use this, I am using [Traceur](https://github.com/google/traceur-compiler). I put together a little [demo using the ES6 DOM library](/demos/es6-dom/). And the [code is on github](https://github.com/ericponto/ericponto.github.io/tree/master/demos/es6-dom). So check it out.