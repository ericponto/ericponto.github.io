---
  layout: post
  title: BEM-Like CSS With Dots and Mods
  tag: CSS
  excerpt: I like BEM, but that syntax... What if wrote class names like `block.element` or `block%modifier` instead?
---

I have always been intrigued by BEM. I like all of the philosophies it is based on around architecting good CSS. But that syntax... I just can't get over the `--` and `__`. My typical approach has been building CSS class names in a similar fashion with block, element, and modifier as the core parts, but separated by single dashes instead.

But then a couple of months ago, [cssstyle](http://www.csstyle.io/) opened my eyes to the possibility of using different characters in my class names. I guess I knew it was possible before, but it was always so impractical having to escape any special characters with a `\` that I never even considered it. But the brilliant innovation by cssstyle, was the use of Sass mixins that do the escaping for you.

So now the doors are open and special characters are back in for class naming. While cssstyle uses `+` and `@` to represent different things like "tweaks" and "locations," I think you can stick with the BEM methodology and just update the separators to be more meaningful. For example, we could use `.` to separate a block from a child element, `block.element`, which feels very JavaScript...I read that as accessing an element that's on the block. And then use `%` to separate the modifier, `block%modifier`, which is a nod to the JavaScript modulo operator.

So we go from traditional BEM style:

{% highlight html %}
<div class="block">
  <div class="block__element">
</div>
<div class="block--modifier"></div>
{% endhighlight %}

To something like this:

{% highlight html %}
<div class="block">
  <div class="block.element">
</div>
<div class="block%modifier"></div>
{% endhighlight %}

The CSS, without any preprocessor is where this would get ugly. The `.` and the `%` need to be escaped in the selector.

{% highlight css %}
.block\.element {}
.block\%modifier {}
{% endhighlight %}

That is hard to read and hard to type. But with a couple of simple mixins, it becomes much easier. I've seen a few projects doing similar mixins for the BEM syntax, and here are some Sass mixins for creating blocks, elements, and modifiers with the `.` and `%`.

{% highlight css %}
@mixin block($name) {
  .#{$name} {
    @content;
  }
}

@mixin element($name) {
  &\.#{$name} {
    @content;
  }
}

@mixin modifier($name) {
  &\%#{$name} {
    @content;
  }
}
{% endhighlight %}

While those are a little bit ugly, you can stash them away in your `_mixins.scss` file and forget about them. And then they let you write code like:

{% highlight css %}
@include block("a") {
  color: red;
  
  @include element("b") {
    color: blue;
  }
  
  @include modifier("c") {
    color: purple;
  }
}
{% endhighlight %}

Which spits out:

{% highlight css %}
.a {
  color: red;
}
.a\.b {
  color: blue;
}
.a\%c {
  color: purple;
}
{% endhighlight %}

Here is a simple [demo of these mixins in action on CodePen](http://codepen.io/ericponto/pen/dPzaMd). And if LESS is more your thing, then here's a LESS version of the code and a [demo](http://codepen.io/ericponto/pen/EawxjR).

{% highlight css %}
.block(@name, @content) {
  .@{name} {
    @content();
  }
}

.element(@name, @content) {
  &\.@{name} {
    @content();
  }
}

.modifier(@name, @content) {
  &\%@{name} {
    @content();
  }
}

.block(a, {
  color: red;
  
  .element(b, {
    color: blue;
  });
  
  .modifier(c, {
    color: purple;
  });
});
{% endhighlight %}

I haven't actually given this syntax a shot yet on a real project, but I'm thinking about giving it a try on the next thing I build. If it feels good, then I can see expanding the use of special characters for other things as well. A  class marking a state could go from code like `is-active` to `=active` and a utility class might use something like `+text-center`. I imagine some markup for a modal looking like this:

{% highlight html %}
<div class="modal =open">
  <div class="modal.header">
    <h2 class="modal.title">Awesome Modal</h2>
  </div>
  <div class="modal.content">
    Lorem ipsum
  </div>
  <div class="modal.footer +text-right">
    <button class="btn btn%cancel">Close</button>
    <button class="btn btn%submit">OK<button>
  </div>
</div>
{% endhighlight %}

I think that feels pretty good.