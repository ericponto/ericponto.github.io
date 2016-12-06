---
  layout: post
  title: Teaching RxJS
  tag: JavaScript
  excerpt: As I have been learning RxJS over the past couple of years I've also spent a lot of time trying to teach it to others just about any way I can...pairing, converstaions, conference and meetup talks, presentations at work, etc. So I wanted to write out some of my thoughts on different ways to teach Observables.
---

I have been thinking a lot lately about the best way to teach RxJS. I've read all the introductory blog posts I could find and watched many conference talks on YouTube. And I've given a few different talks on RxJS myself at conferences, meetups, and at work. Each time I've presented, I have tried different approaches to teach the difficult subject. RxJS can be overwhelming at first to learn. There are seemingly hundreds of operators, tricky concepts (like hot vs. cold), and a lot of inertia to overcome to switch your mental model of programming over to the world of streams. 

As I've gotten more experience with the library and learned more about functional programming, my understanding of RxJS and the way I think about teaching it has changed. For the most part, my goal is to find something relatable to developers, whatever their experience may be, and then connect it to concepts in RxJS. So this post is not trying to teach anyone RxJS. Rather, it is a chance for me to layout all the different ways I think about Observables and how to teach them to someone.


## The values are separated by time

I think this is the most common way to teach Observables and also the most approachable for a lot JavaScript developers. It allows you to start in a place most people are comfortable: the humble Array. With the heavy push towards functional programming lately in the JavaScript community, a lot of people have read the standard FP in JS blog post that introduces `map`, `filter` and `reduce`. For anyone who may not be as familiar and even for those who are, it's helpful to level set on those concepts. My go to is "find the sum of the squares of the odds in the Array: [1, 2, 3, 4, 5]". 

{% highlight javascript %}
const sum    = (a, b) => a + b;
const isOdd  = (x)    => x % 2 ===0;
const square = (x)    => x * x;

const total = [1, 2, 3, 4, 5]
  .filter(isOdd)            // [1, 3, 5]
  .map(square)              // [1, 9, 25]
  .reduce(sum);             // 35
{% endhighlight %}

(If you want to sell FP as well, show the imperative version of this code.)

Then you drop the bomb: "with an Observable, instead of separated by commas, the values are separated by time." Boom! Minds are blown.

From there you can draw the comparison between Lodash and RxJS. Lodash adds a bunch of utility functions for dealing with arrays and RxJS adds those exact same utilities, but for Observables. It's the same stuff you already know! Just async!

I usually start with a simple timer. `Observable.interval(1000)`. If you lay that out on a timeline, it looks an awful lot like the Array `[1, 2, 3, 4, 5]` used earlier...so you can `map`, `filter`, and <s>`reduce`</s> `scan` it just the same.

{% highlight javascript %}
Observable.interval(1000)  // |--0--1--2--3--4--5-->
  .filter(isOdd)           // |-----1-----3-----5-->
  .map(square)             // |-----1-----9-----25->
  .scan(sum);              // |-----1-----10----35->
{% endhighlight %}

From here you can go in to whatever examples you like to show the best with RxJS, whether it is the counter component with increment and decrement buttons, or an autocomplete AJAX widget...


## #GTOR

Kris Kowal's ["A General Theory of Reactivity"](https://github.com/kriskowal/gtor) is a great teaching tool and another good method to introduce Observables. It plays better to a bit more experienced crowd, or at least to developers who have spent some time with ES2015 (specifically Promises and Iterables). The theory lays out the 4 ways we have interfaces with values across two planes: singular vs. plural and spatial vs. temporal.

<style>
td { border: 1px solid #444; }
</style>
<table>
  <thead>
    <tr>
      <th></th>
      <th>Singular</th>
      <th>Plural</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>Spatial</th>
      <td>Value</td>
      <td>Iterable</td>
    </tr>
    <tr>
      <th>Temporal</th>
      <td>Promise</td>
      <td><em>Observable</strong></td>
    </tr>
  </tbody>
</table>

Singular vs. plural is pretty straight forward. Singular is a single value and plural is multiple values. Spatial vs. temporal isn't quite as clear. The [RxJS docs on Observables](http://reactivex.io/rxjs/manual/overview.html#observable) refers to this as pull vs. push. So a spatial value you have to pull to consume, whereas a temporal value gets pushed to you to consume. I also think sync vs. async also helps drive the point home.

The top left quadrant is almost trivial to describe. It is any old value...a boolean, number, or string. Then moving to the right, Iterables are generally something that is known. You can focus more on the Array side of things (much like the previous section), but showing a generator function that uses `yield` and then using the `next` method to pull values is important to lead in to Observables.

{% highlight javascript %}
const gen = function* () {
  yield 1;
  yield 2;
  yield 3;
}

const it = gen();

it.next(); // { value: 1, done: false }
it.next(); // { value: 2, done: false }
it.next(); // { value: 3, done: false }
it.next(); // { value: undefined, done: true }
{% endhighlight %}

Next, the lower left quadrant is also familiar from ES2015: the Promise. Showing a Promise constructor is also a good lead in. It has `resolve` and `reject` functions that can be called at any point in time, so it is temporal. And, you can only call `resolve` once, which isn't something that comes up a lot, so it is singular. Also showing how the value is consumed using `then` provides a good correlation to `subscribe`.

{% highlight javascript %}
const promise = new Promise((resolve, reject) => {
  setTimeout(() => resolve("hello"), 1000);
  // if error, then `reject(err)`
});

promise.then(
  (val) => {}, // do something with the resolved value
  (err) => {}  // oh no, an error!
)
{% endhighlight %}

An Observable is temporal, but also plural. So it is like a Promise, but can "resolve" multiple times.

An Observable is plural, but also temporal. So it is like an Iterable, but pushes instead of pulls values using `next`.

Creating an Observable with `Observable.create` isn't all that common in practice, but using it helps illustrate how it is related to Promises and Iterables and helps eliminate some of the "blackbox" feel to RxJS.

{% highlight javascript %}
const observable = Observable.create((observer) => {
  observer.next(1);
  observer.next(2);
  observer.next(3);

  observer.complete();
  // if error, then `observer.error(err)`
});

observable.subscribe(
  (val) => {}, // do something with the "next" value
  (err) => {}, // oh no, an error!
  ()    => {}  // all done!
)
{% endhighlight %}

It helps that both Iterables and Observables use the same `next` method. And it is pretty easy to show how the Observable constructor is like a combination of a Promise constructor and a generator function, with a little bit of Iterable mixed in. Hopefully at the very least it'll feel somewhat familiar and comfortable to anyone who knows about Promises.

It is also worth highlighting in the GOTR table that as you move down or right, the interfaces are able to handle those that came before them. An Array can hold a single value, for example. This leads to the Observable as a "general" interface to any type of value, singluar or plural...spacial or temporal. It is the whole, "everything is a stream." RxJS even has convenient methods to turn values, Iterables, and Promises into Observables.

{% highlight javascript %}
// Value
Observable.of("hi");

// Iterable
Observable.from([1, 2, 3, 4, 5]);

// Promise
Observable.fromPromise(fetch("/my-url.json"));
{% endhighlight %}

From here, you can again dive into any RxJS examples you want.

## For the Redux crowd

Like the first method, it's good to start here with Arrays and Array methods. It is especially important to make sure everyone understands `reduce`, as it set up understanding of both Redux and the RxJS implementation of a state store. So throwing in the classic "find the sum of a list of numbers" example is worth while. Then really show how the accumulation works. From there more advanced uses of `reduce` are also useful, particularly showing an implementation of `pipe` or `flow` or whatever you like to call it.


{% highlight javascript %}
const pipe = (...fns) => (x) =>
  fns.reduce((prev, fn) => fn(prev), x);

const add3   = (x) => x + 3;
const times2 = (x) => x * 2;
const square = (x) => x * x;

const add3ThenTimes2ThenSquare = pipe(
  add3,
  times2,
  square
);

add3ThenTimes2ThenSquare(2); // 100
{% endhighlight %}

From Arrays, you can move on to Observables and show the same type of examples using the `scan` method instead of `reduce`. And then build out an actual component with some state. My go to is the same as everyone's: a counter component with a "+1" and a "-1" button. It is a good introduction to RxJS, but also works well for introducing Redux. And it's a good opportunity to review `scan` in the familiar "adding numbers together" use case.

{% highlight javascript %}
const counter$ = Observable
  .merge(
    Observable.fromEvent(upButton, "click").map(1),
    Observable.fromEvent(downButton, "click").map(-1)
  )
  .startWith(0)
  .scan((prev, x) => prev + x);

counter$.subscribe(renderMyComponent);
{% endhighlight %}

The same example in Redux now:

{% highlight javascript %}
const reducer (state = 0, action) => {
  switch(action.type) {
    case "UP":
      return state + 1;
    case "DOWN":
      return state - 1;
  }
};

const store = createStore(reducer);

upButton.addEventListener("click", () => store.dispatch("UP"));
downButton.addEventListener("click", () => store.dispatch("DOWN"));

store.subscribe(() => renderMyComponent(store.getState()));
{% endhighlight %}

So there are a couple of things to note with Redux. First, a reducer's signature is exactly the same as a function we would pass to `reduce` or `scan`. Second, dispatching actions is like creating a stream of actions. So we can implement the same functionality as Redux in RxJS with just a few lines of code.

{% highlight javascript %}
const reducer (state = 0, action) => {
  switch(action.type) {
    case "UP":
      return state + 1;
    case "DOWN":
      return state - 1;
  }
};

const actions$ = new BehaviorSubject(0);
const dispatch = (action) => actions$.next(action);

const store$ = actions$.scan(reducer);

upButton.addEventListener("click", () => dispatch("UP"));
downButton.addEventListener("click", () => dispatch("DOWN"));

store$.subscribe(renderMyComponent);
{% endhighlight %}

A quick explanation of a `Subject` is really all that is needed here to move from Redux to RxJS. The `reducer` function is exactly the same. You still `dispatch` actions. You still `subscribe` to the store.

The final code though, gets rid of some of the terms borrowed from Redux (like reducers and dispatch). It moves away from the large reducers with `switch` statements and instead uses the pattern where each action is mapped to its own update function, which is probably the most common RxJS pattern for a state store. 

{% highlight javascript %}
const up$ = new Subject();
const down$ = new Subject();

const store$ = Observable
  .merge(
    up$.map(() => (state) => state + 1),
    down$.map(() => (state) => state - 1)
  )
  .startWith(0)
  .scan((prev, fn) => fn(prev));

upButton.addEventListener("click", () => up$.next());
downButton.addEventListener("click", () => down$.next());

store$.subscribe(renderMyComponent);
{% endhighlight %}

The `scan` in this case is used just like the `reduce` in our `pipe` function earlier. We are creating a stream of update functions, then "piping" the state through. That brings everything full circle and gives people a pattern for managing state in their apps without having to know all the ins and outs of RxJS or the tens of operators.

## Functors, and Monads, and Bears

Using functional programming jargon can definitely get an "oh my" type of response. And going too deep into things like endomorphisms or contravariance isn't helpful when trying to teach RxJS. But a basic understanding of some of functional programming's core concepts is useful. The ideas of pure functions and immutable data are a good place to start. Building from there with higher-order functions and function composition is also helpful. These concepts lead nicely into some of parts from the previous sections...like using `reduce` to create the `pipe` function.

Another important concept to go over is containers. Arrays are a great place to start with explaining a container. It wraps around a value and gives you methods to work with that value.

{% highlight javascript %}
Array.of(2)      // [2]
  .map(add3)     // [5]
  .map(times2)   // [10]
  .map(square);  // [100]
{% endhighlight %}

This idea of wrapping values is a very common pattern in JavaScript. jQuery is a great example. It wraps a list of element and gives you methods to work with those elements. `$("div").map((i, el) => el.innerHTML)` gives you a jQuery object that contains a list of the HTML in all the divs on a page. Moment.js, which is a container for dates, is another example people might know.

From there, you can get a little bit more technical and go into functors. You can work in some of the previous concepts with a definition like: A functor is an **immutable** container that exposes a `map` method that takes **pure functions** to transform the contained value. And lo and behold, an Array is a functor. jQuery is a functor. We can create our own functor too.

{% highlight javascript %}
class Functor {
  constructor(value) {
    this.__value = value;
  }

  static of(value) {
    return new Functor(value);
  }

  map(fn) {
    return Functor.of(fn(this.__value));
  }
}
{% endhighlight %}

And we can do the same example with our functor.

{% highlight javascript %}
Functor.of(2)    // Functor(2)
  .map(add3)     // Functor(5)
  .map(times2)   // Functor(10)
  .map(square);  // Functor(100)
{% endhighlight %}

RxJS creates its own Functor too...the Observable. An Observable is a container for values that may or may not be asynchronous. And if has the same methods as an Array or our Functor.

{% highlight javascript %}
Observable.of(2) // |--2---->
  .map(add3)     // |--5---->
  .map(times2)   // |--10--->
  .map(square);  // |--100-->
{% endhighlight %}

Ultimately though, an Observable is a container for a function. It contains function that takes an `observer` object and calls the `next`, `error`, and/or `complete` methods on that object (as we've seen above with `Observer.create`). Without the container, we could still get the base functionality of Observable with just a good ol' function.

{% highlight javascript %}
const observableFunction = (observer) => {
  observer.next(1);
  observer.next(2);
  observer.next(3);

  observer.complete();
};

observableFunction({
  next(value) {
    // do something with the value
  },

  error(err) {
    // do something with the err
  },

  complete() {
    // do something on complete
  }
});
{% endhighlight %}

So what the Observable container gives us then is the ability to chain methods and some safety checks (like `next` won't get called after a `complete` is called), but ultimately isn't much more complex than a function. Teaching Observables in this way is what I call the "Ben Lesh method" and his [Thinking Reactively talk from AngularConnect](https://www.youtube.com/watch?v=3LKMwkuK0ZE) is a great example.

---

In the end, each time I am teaching RxJS I pull bits and pieces from each of these approaches with the goal of finding that one concept that a person is familiar with and then relating that concept to Observables. 

