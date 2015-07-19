---
  layout: post
  title: Using RxJS with Mithril
  tag: JavaScript
  excerpt: Reactive programming with Observables and rendering views via a virtual DOM go incredibly well together. RxJS and Mithril implement those two paradigms respective and together create a power foundation from writing applications.
---

I've been exploring reactive programming a lot lately with RxJS and Bacon.js. (I'm going to refer to it as FRP, even though I know that both of these libraries aren't technically functional reactive programming.) A lot of the FRP examples use a stream to update a single value in a view via something like `assign` in Bacon or using jQuery. And that is very effective in a lot of situations. But there are still a large number of times that you don't want to update a single value and instead want to rerender the entire view (the typical MV* frameworky way to do things).

RxJS and Bacon lend themselves to full rerenders well too. With methods like `combineLatest` and `combineTemplate` it is easy to take all the streams that would affect your view and subscribe to them with a render.

{% highlight javascript %}
Rx.Observable.combineLatest(stream1, stream2, 
    (stream1, stream2) => {stream1, stream2}
  )
  .subscribe(view.render);
{% endhighlight %}

With the possible frequent rerendering of this method, using some virtual DOM solution helps a lot with performance. I've look at React in the past and have used the virtual-dom library, but I've found that [Mithril](https://lhorie.github.io/mithril/) is my favorite virtual DOM solution. It is small (only 8kb minified and gzipped), fast, and has just enough extras that make writing applications easier without being a bloated framework.

At its simplest Mithril can just be a view to render in an element. The initial render will build a virtual DOM and write the to the actual DOM. Subsequent renders will do a diff on the virtual DOM and then write only the changes. (Standard virtual DOM stuff there). 

{% highlight javascript %}
var Component = {
  view() {
    return m("h1", "Hello, world.");
  }
};

m.mount(document.body, Component);
{% endhighlight %}

The other piece of a Mithril component is the `controller`. A controller is a constructor function that will have an instance passed into the view to render. Mithril has a really smart rerender system that will redraw the view on events and ajax calls.

However, when pairing Mithril with a FRP library, we'll bypass Mithril's built in rerender and call `redraw` manually on an Observable's next value. This logic fits in well inside the `controller`.

{% highlight javascript %}
var Component = {
  controller() {
    this.model = m.prop({}); // m.prop creates a getter/setter
    
    Rx.Observable.just({ name: "Eric" })
      .subscribe(data => {
        this.model(data); // set the model
        m.redraw(); // manually redraw
      });
  },
  view(cntl) {
    return m("h1", `Hello, ${cntl.model().name}`);
  }
};

m.mount(document.body, Component);
{% endhighlight %}

##The classic autocomplete example

So putting these things together a little bit, let's build an autocomplete component that queries GitHub repos as the user types in the box. We'll use the HTML5 `<datalist>` for native autocomplete functionality. 

Using Mithril's `m` function to build a virtual DOM the view will look like:

{% highlight javascript %}
view(ctrl) {
  var data = ctrl.model();
    
  return m(".autocomplete", [
    m("label[for=search]", ["Search for Github repo: "]),
    m("input#search[list=results]"),
    m("datalist#results", [
      data.items && data.items.map(item => m("option[value=" + item.name + "]"))
    ])
  ]);
}
{% endhighlight %}

Mithril has a builtin ajax helper `m.request` which is very similar to jQuery's `$.ajax` and returns a promise.  So let's set up a function that takes the search term and call's GitHub's API.

{% highlight javascript %}
var searchGithub = (term) => m.request({
  method: "GET",
  url: `https://api.github.com/search/repositories?q=${term}`
});
{% endhighlight %}

And then we'll call that when a user types into the input. Since the input isn't rendered until the component is mounted, we need to attach the event handler to the containing element and then use [event delegation](http://www.ericponto.com/blog/2015/04/02/event-delegation-with-matches/) to target the input. (Note: I'm using `pluck` here from [`Rx.helpers.pluck`](https://github.com/Reactive-Extensions/RxJS/tree/master/doc/api/helpers#rxhelperspluckproperty).)

{% highlight javascript %}
Rx.Observable.fromEvent(el, "keyup")
    .map(pluck("target"))
    .filter(el => el.matches("input"));
{% endhighlight %}

Then we'll get the inputs value and make sure it is at least 3 characters long, so we're not querying with something like "a" and getting back a million results.

{% highlight javascript %}
    .map(pluck("value"))
    .filter(val => val.length > 2)
{% endhighlight %}

Then in order to not firing off the ajax request too often, we'll debounce the event and then ignore keyups that don't change the input's value by only keep distinct values.

{% highlight javascript %}
    .debounce(250)
    .distinctUntilChanged()
{% endhighlight %}

And finally fire off the ajax request using `flatMapLatest`, which will flatten the stream of streams created by firing an ajax call on most of the keyups and then get the latest results.

{% highlight javascript %}
    .flatMapLatest(searchGithub)
{% endhighlight %}

With that Observable we'll subscribe to it and have it update the component's model and tell the view to redraw. (Mithril will force a redraw when the `m.request` resolves so the subscribe just sets the model, but with basically anything else you'll need to manually call `m.redraw`).  So the whole controller will look like:

{% highlight javascript %}
controller() {
  this.model = m.prop({});
    
  Rx.Observable.fromEvent(el, "keyup")
    .map(pluck("target"))
    .filter(el => el.matches("input"))
    .map(pluck("value"))
    .filter(val => val.length > 2)
    .debounce(250)
    .distinctUntilChanged()
    .flatMapLatest(searchGithub)
    .subscribe(this.model); 
}
{% endhighlight %}

The [full example is on CodePen](http://codepen.io/ericponto/pen/mJEyPL).

