---
  layout: post
  title: A Month With ES6
  tag: JavaScript
  excerpt: Over the past month, I've started using ES6 features wherever I could. Here's a collection of some of my thoughts on the new features.
---

I've written about some [ES6 features before](https://www.ericponto.com/blog/2014/10/05/es6-dom-library/) and put together [an intro talk](http://dsmjs.com/11-12-14-intro-to-es6/slides.html#/) on it as well. But around Thanksgiving, I started a new little project and decided to go all in with ES6. So after a month of using ES6 quite a bit, here's a collection of some of my thoughts...

##Some Sugar
A lot of ES6 is just "syntax sugar." It's not new features to the language, just easier ways to write them. New methods on the native objects are perfect examples. `String.prototype.contains` replaces the usual `indexOf` greater than -1 check. `Array.from(myArrayLikeObject)` is much easier than `Array.prototype.slice.call(myArrayLikeObject)`. And so on.

I also like some of the shortcut syntax that is available via deconstructions or in object literals.

Swapping variables is now super easy and short to write:

{% highlight js %}
var a = 1;
var b = 2;
// swap!
[a, b] = [b, a];
{% endhighlight %}

And object literals are less colon intensive:

{% highlight js %}
var name = "Eric";
var age = 30;
var person = {
    name,
    age,
    grow() {
	    this.age++;
	}
};
{% endhighlight %}
	    
###Classes
I've used the constructor/prototype pattern, or used a library that abstracted it (like Backbone), for the majority of the JavaScript I've written in the past couple of years. And while I don't come from any object-oriented background, it's a comfortable pattern to me. So, the new `class` is right up my alley. 

The syntax is nicer than the constructor/prototype and there is finally a way to denote something is a class other than by naming convention (capitalizing the name of the function). It's also nice to not have to reference `prototype` a bunch of times.

The best features of classes though, are `extends` and `super` which make managing inheritance much, much easier. No more copying of `prototype` or calling the parent's methods. 


###Arrow Functions
I really like arrow function. I'd probably throw these into the syntax sugar category as well, even though they behave a little differently than a regular function. The syntax is short and easy to type and read. But I'm not at all ready to get rid of `function` yet. The arrow function to me just doesn't feel right for function expressions when assigning a function to a variable.

{% highlight js %}
var square = x => x * x;
{% endhighlight %}

Without the `function` keyword, I find that hard to read. Adding parenthesis around the parameter might help a little here, but at a glance I still would immediately recognize the square is a function. Maybe as arrow functions become more wildly used, that won't be as much of an issue (or if I had written more CoffeeScript in my days).

I do **really** like arrow function for any anonymous functions though, especially whenever an anonymous function is passed as an argument to another function.

{% highlight js %}
var squares = [1, 2, 3, 4].map(x => x * x);
{% endhighlight %}

That feels great and pairs excellently with most `Array` methods.

The real situation where `=>` really shines is when a function needs to inherits its parent's scope. I've always been a fan of explicit setting the scope with `bind()` (or `$.proxy` in jQuery land or `_.bind` or whatever other util library has) over aliasing `this` with something like `that`. Arrow functions remove that need as they don't have their own scope. Fantastic.

{% highlight js %}
someMethod() {
  this.el.addEventListener("click", () => {
    this.someOtherMethod();
  }, false);
}
someOtherMethod() {}
{% endhighlight %}

##New Stuff
I've had a little bit harder time finding use cases for new features to the language. Maybe it's because I lack a background in languages that already had the features. I've yet to use a `Set` or a `Map` or a Typed Array. I haven't written a generator function.

###Let and Const
I just used `const` for the first time a couple of days ago, just to have some controls at the top of a little program. I can see how it'd be more useful though andI could probably be more mindful in my variable declarations.  But the need for `const` just hasn't come up very often.

For `let`, I've found it is mostly useful with loops. I actually can't think of a good reason not use `let` with a `for` loop.  

{% highlight js %}
for (let item of myArray) {}
{% endhighlight %}

But I don't think I've used `let` in any other context yet.

###String Templates
Maybe these could be considered sugar as well (they are actually a feature I've used a lot)...templating through concatenation or replacement is nothing new. But to have it built into the language is so useful. It is such a small little thing, but once I started using it, I've noticed just how often there is a need to have part of a string come from a variable. Besides the arrow function, this new feature might my most used and favorite ES6 thing.

###Modules
Like string templates, maybe these aren't quite a completely new thing. We've been able to do modules from a while, though it is new that it is built into the language. The syntax with `import` and `export` feels like a lot of other languages and is pretty close to CommonJS modules as well, so was easy to jump into using. Right now I'm using [6to5 to compile my modules](https://6to5.org/modules.html) into AMD, then using the RequireJS optimizer via Grunt to package them up.

##The Next Month
Up next, I'd like to start diving a little bit more into some of the features I haven't used yet. Proxies are really interesting to me and I think I'll find plenty of uses from generators once I get a better feel for how they work.

I've already started diving down the path of how to start uses ES6 more with existing projects. Classes pair extremely well with Backbone apps and converting AMD modules to ES6 modules would be another easy way to start introducing some new syntax.

As the transpilers keep getting better and have lighter weight run-times and with more and more features getting implemented in the browsers, the possibilities of using ES6 for everything is getting nearer. And that is pretty exciting.