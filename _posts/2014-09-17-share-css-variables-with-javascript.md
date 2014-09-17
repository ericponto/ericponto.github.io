---
  layout: post
  title: Sharing CSS Variables with JavaScript
  tag: CSS, JavaScript
  excerpt: Accessing CSS variables from JavaScript is pretty easy, but it's hard to think up many use cases. One powerful use, though, is detecting the active breakpoint.

---

Since I started playing with CSS variables (or technically, CSS custom properties), I've been really intrigued by the idea of sharing those variables between CSS and JavaScript. It is kind of hard to think of a really good use cases for sharing most CSS properties with JavaScript though. Why would I ever need to know the default padding that is used for a box or the font size of headers? I can see some instances where knowing the color palette could be useful, for example when building a chart with JavaScript.

It turns out accessing CSS variables from JavaScript is pretty easy via `getComputedStyle` and `getPropertyValue`.

{% highlight CSS %}
:root {
  --my-color: #f00;
}
{% endhighlight %}

{% highlight JavaScript %}
var htmlStyles = window.getComputedStyle(document.querySelector("html"));
var myColor = htmlStyles.getPropertyValue("--my-color"); // returns "#f00"
{% endhighlight %}

Now we can do whatever we want in our code with `myColor`. Success!

You can also go the other direction by using `style.setProperty`.

{% highlight JavaScript %}
document.querySelector("html").style.setProperty("--my-color", "#00f");
{% endhighlight %}

And while I'm struggling to think of any really good use cases for going this way as well (most things I can think of, you'd just be better off toggling a class), I am sure it is going to open the door up to some awesome stuff in the future for somebody more creative than I am.

##Media Queries - Sharing your breakpoints
The thing I think that would have a really large benefit, is sharing a variable for media query breakpoints. There is often a need to have a component's functionality change (along with its styles) at different breakpoints. The main way to share the breakpoint values today is to maintain them separately in the media query in CSS and using `matchMedia` in JavaScript. Since we can access CSS variables from JavaScript, it would be cool to store the breakpoint as a variable in CSS and use it in both places. But, at least at this point in time, in Firefox (the only [browser currently supporting CSS variables](http://caniuse.com/#feat=css-variables)), this doesn't work.

{% highlight CSS %}
:root {
  --large-screen: 50em;
}

@media all and (min-width: var(--large-screen)){
  /* large screen styles */
}
{% endhighlight %}

So dang. We can't do that for now. There is a [clever trick to testing which breakpoint is active using a hidden pseudo element](https://gist.github.com/emilbjorklund/2481019) that has been floating around for a while. It uses `getComputedStyle` to access the `content` of the pseudo element (sound familiar?). So with custom properties, we no longer have to rely on `content` to store a string.

{% highlight CSS %}
.widget {
  --breakpoint: small;
}

@media all and (min-width: 25em) {
  .widget {
    --breakpoint: medium;
  }
}

@media all and (min-width: 50em) {
  .widget {
    --breakpoint: large;
  }
}
{% endhighlight %}

{% highlight JavaScript %}
function calcBreakpoint() {
  var widgetStyles = getComputedStyle(document.querySelector(".widget"));
  var breakpoint = widgetStyles.getPropertyValue("--breakpoint");
  return breakpoint; // "small", "medium", or "large"
}
{% endhighlight %}

I think this is an improvement over the pseudo element technique. If you want to try it out, I did create a [test in Codepen](http://codepen.io/ericponto/pen/dyqHf) (just remember to use Firefox). Now we just need browser support to come around.