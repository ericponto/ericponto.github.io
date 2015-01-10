---
  layout: post
  title: The :has Pseudo-Class, the Selector We've Been Waiting For
  tag: CSS
  excerpt: It is here...a solution for the elusive parent selector. The `:has` psuedo-class is a parent selector and more!
---

It is here...a solution for the elusive parent selector. I'm not exactly sure when it was added (and I first saw reference to it in an [Aaron T. Grogg post](http://aarontgrogg.com/blog/2015/01/09/todays-readings-224/)), but the latest [editor's draft of the CSS Selectors Level 4](http://dev.w3.org/csswg/selectors-4/#relational), includes a specification for a `:has` pseudo-class. It is a parent selector and more! While this is just a draft and subject to change, it's still exciting to think of the possibilities once this lands as a standard and browser start to implement it.

The basics of `:has` is that it takes a relative selector as an argument and then evaluates its existence.  If true, the CSS rules apply.

{% highlight css %}
/* target a paragraph that contains an image */
p:has(img) {}
{% endhighlight %}

The other cool thing you can do with `:has` is use a sibling selector (`+` or `~`). So it's not limited to detecting parent relationships.

{% highlight css %}
/* target a label of an input that is required */
label:has(+ input:required) {}
{% endhighlight %}

The general parent relationship where you're just looking for an inner element is not the most powerful use case. Most of the time is it easy enough to just add a class like `.img-container` to the parent element in the markup. I can see in environments where the markup is less controlled (like user generated content) where this would be more useful.

I think where this is super powerful, is when detecting the state of an element and then modifying the style of a related elements that's before it in the DOM. So like the `:require` example. Going beyond with other form input states, you could modify the `label` when an input is `:valid` or `:invalid` or `:checked` etc...

Or take the case of step indicator. There are usually 3 possible states for a given step. The is the active step, the previous steps, and the future steps...usually all styled differently. 

{% highlight html %}
<ol>
	<li class="step">Step 1</li>
	<li class="step">Step 2</li>
	<li class="step is-active">Step 3</li>
	<li class="step">Step 4</li>
</ol>
{% endhighlight %}

In this case, there is no currently no way to specifically target steps 1 and 2 as predecessors to the active step. So you end up making the previous steps the default style, the active step different, and then step 4 could use something like `.is-active ~ .step`. But with `:has`, you can specifically target the previous steps with basically the inverse of step 4 uses:  `.step:has(~ .is-active)`

Maybe a simpler example with dealing with the state of an element would be a to-do list widget. So we have a list of tasks with due dates and you want to highlight the whole list when there is a task that is overdue. `.todo-list:has(.is-overdue)` Then you are only managing the state of each task instead of the whole list. 

This does open the door for some crazier things if you're willing to use longer selectors. Take the common scenario of toggling a section of a form when a checkbox is checked or unchecked.

{% highlight html %}
<form>
	<label for="show-more">
		<input type="checkbox" id="show-more" class="toggler"> Show more
	</label>
	<div class="toggle-content">
		<!-- more inputs -->
	</div>
</form>
{% endhighlight %}

{% highlight css %}
.toggle-content {
	display: none;
}

form:has(.toggler:checked) .toggle-content {
	display: block;
}
{% endhighlight %}

I don't know how to feel about a selector with two classes, two pseudo-classes, and an element selector, but if you can get over that high specificity, then this is a pretty cool technique. It gives you a little bit more freedom in your markup as the checkbox and the toggle-able element don't have to be direct siblings.

##Polyfill
How can we start using this now? jQuery has had the `:has` selector in its arsenal since version 1.1.4, so basically forever. Using [Polyfill.js](http://philipwalton.github.io/polyfill/) with jQuery makes supporting `:has` very easy.

{% highlight js %}
Polyfill({
	selectors: [":has"]
}).doMatched(rules => {
	rules.each(rule => {
		// just pass it into jQuery since it supports `:has`
		$(rule.getSelectors()).css(rule.getDeclaration())
	});
});
{% endhighlight %}

If you are going to throw a `:has` in a media query, you'll also need to use Polyfill's `.undoUnmatched` method as well, but that's it. I'm not sure if I have a big enough need for the `:has` selector to Polyfill it before any browser has it implemented, but once a few browsers have add it, I look forward to using it.