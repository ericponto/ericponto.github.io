---
  layout: post
  title: RxJS Marble Tests with QUnit
  tag: JavaScript
  excerpt: 
---

One of my favorite features of RxJS 5 is that the `TestScheduler` has the ability to run tests via marble diagrams. On top of learning RxJS, learning to test it has been a challenge. Marble diagrams though have been an extremely useful to in both learning the library and in teaching it. In the few talks I've given on the subject, I usually do a little live coding and always will put a marble diagram in a comment next to each Observable I create.

I read about marble testing nearly a year ago when it was being worked on in RxJS 5 and saw that it was being used to test the library internally. But I didn't really investigate it until recently. And now that v5 has been officially released, I decided to see if marble tests could be used to test application code.

The library's repo itself uses mocha to run its tests and you can look through the [spec](https://github.com/ReactiveX/rxjs/tree/master/spec) folder to see how it is set up. There is also a good doc on how to write [marble tests](https://github.com/ReactiveX/rxjs/blob/master/doc/writing-marble-tests.md) for the internal unit tests. 

## Marble Diagram Syntax

The best source on the syntax is again the [marble tests docs](https://github.com/ReactiveX/rxjs/blob/master/doc/writing-marble-tests.md), but just to highlight a couple parts here:

<table>
  <tr>
    <th>-</th>
    <td>A unit of time passing (1 unit of time is considered 10 "frames")</td>
  </tr>
  <tr>
    <th>a</th>
    <td>A value emitted (which can be mapped to another value)</td>
  </tr>
  <tr>
    <th>|</th>
    <td>The end of the stream</td>
  </tr>
  <tr>
    <th>#</th>
    <td>An error</td>
  </tr>
  <tr>
    <th>^</th>
    <td>The subscription point</td>
  </tr>
</table>

## The App to Test

It feels like the canonical app for demoing anything with state management is a counter component and it is the example I like to use as well. The [completed code for the app](https://github.com/ericponto/rxjs-marble-test-example) (and the marble test) are github if you want to follow along there. So the app we are building has pretty simple requirements.

* It has an up button, a down button, and a count.
* The count starts at 0.
* When you click the up button it adds 1 to the count.
* When you click the down button it subtracts 1 from the count.

## Laying Out Out Marbles

Before we build anything, we can construct marble diagrams to map out our logic. You could call it "Marble Driven Devlopment." Let's start with the click events. A stream of click events on the up button might look something like: 

```
--x----x--x---
```

Then we would also have a stream of click events on the down button.

```
----x-------x-
```

With those two marble diagrams we've mocked out a user clicking the up button on frame 20, down on frame 40, up again on frame 70, up on frame 100, and finally down on frame 120. Based on our requirements, the state would be:

* `{count: 0}` 
* `{count: 1}`
* `{count: 0}`
* `{count: 1}`
* `{count: 2}`
* `{count: 1}`

And if we laid that out in a marble diagram we'd have the following (where "a" is `{count: 0}`, "b" is `{count: 1}` and "c" is `{count: 2}`):

```
a-b-a--b--c-b-
```


When we lineup our marble diagrams it is pretty easy at a glance to see what our app is doing.

```
up:    --x----x--x---
down:  ----x-------x-
state: a-b-a--b--c-b-
```

## Using the TestScheduler

With our marble diagrams we can now write a test for our app. The `TestScheduler` in RxJS enables a number of features that will help with writing tests. When instantiating a `new TestScheduler` you pass it an assertion that will test the equality of your actual Observable vs. the expected Observable. Because we are using QUnit, we need to instantiate the `TestSchedule` inside of a `test` function in order to have access to the `assert` object. Then we can use `assert.deepEqual` to test for equality in our actual and expected Observables.

{% highlight javascript %}
test("testing the model", (assert) => {
  const testScheduler = new TestScheduler(assert.deepEqual.bind(assert));
  // ...
});
{% endhighlight %}

In the RxJS repo they have utility functions to create observables called `hot` and `cold`, but these are just aliases to the `createHotObservable` and `createColdObservable` methods on the `TestScheduler` respectively. We can use `createHotObservable` directly to mock out of up and down click events by passing in our marble diagrams.

{% highlight javascript %}
const upMarbles   = "--x----x--x---|";
const downMarbles = "----x-------x-|";

const up$   = testScheduler.createHotObservable(upMarbles);
const down$ = testScheduler.createHotObservable(downMarbles);
{% endhighlight %}

The main functionality in our app will be to take the `up$` and `down$` streams and convert them into the app's state. We will later write a `model` function to do that, but we will use it here in our test.

{% highlight javascript %}
const state$ = model({up$, down$});
{% endhighlight %}

So `state$` is going to be our "actual" here but we still need to set up our "expected" and we can do that with our state marble diagram.

{% highlight javascript %}
const expected = "a-b-a--b--c-b-|";

const expectedStateMap = {
  a: {count: 0},
  b: {count: 1},
  c: {count: 2},
};
{% endhighlight %}


From there we actually test our `model` function. The `TestScheduler` has a helper to set up the test in the "expect...toBe" style which will test the equality of our actual vs. our expected. And to ultimately run the test, you need to call `flush`.

{% highlight javascript %}
testScheduler.expectObservable(state$).toBe(expected, expectedStateMap);

testScheduler.flush();
{% endhighlight %}

The whole test together looks like:

{% highlight javascript %}
test("Test Model", (assert) => {
  // construct TestScheduler with deep equal assertion
  const testScheduler = new TestScheduler(assert.deepEqual.bind(assert));

  // mock streams
  const upMarbles   = "--x----x--x---";
  const downMarbles = "----x-------x-";
  const expected    = "a-b-a--b--c-b-";
  
  const expectedStateMap = {
    a: {count: 0},
    b: {count: 1},
    c: {count: 2},
  };

  // mock up$ and down$ events
  const up$   = testScheduler.createHotObservable(upMarbles);
  const down$ = testScheduler.createHotObservable(downMarbles);

  const state$ = model({up$, down$});

  // assertion
  testScheduler.expectObservable(state$).toBe(expected, expectedStateMap);

  // run tests
  testScheduler.flush();
});
{% endhighlight %}





----


The purpose of this post isn't to walk through the app, so I'm just hitting the key bits so we can write tests against it. We will start off with the view. The important chuck of the view is the little bit of markup. It is just the two buttons and the count, which will come from our state.

{% highlight javascript %}
const template = (state) => (
`<div>
  <button id="up">+</button>
  <button id="down">-</button>
  <output>${state.count}</output>
</div>`
);
{% endhighlight %}

From there we will have a stream of click events from both the up and down buttons. 

{% highlight javascript %}
const clicks$ = Observable.fromEvent(document, "click");
const targetHasId = (id) => (e) => e.target.id === id;

const events = () => ({
  up$: clicks$.filter(targetHasId("up")),
  down$: clicks$.filter(targetHasId("down")),
});
{% endhighlight %}

And finally, the key part of our app is the model, which takes the events and maps those into functions that update the state.

{% highlight javascript %}
const model = ({up$, down$}) =>
  Observable.merge(
    up$.mapTo((state) => ({
      count: state.count + 1
    })),
    down$.mapTo((state) => ({
      count: state.count - 1
    })),
  )
  .startWith({count: 0})
  .scan((state, fn) => fn(state));
{% endhighlight %}

The model contains the bulk of the logic of this tiny application and is the piece of code we want to test.

## Creating the Marble Diagrams

In order to test our `model` function we need to have a stream of click events for both the up and down buttons. Rather than manually triggering clicks with JavaScript, we can create a marble diagram that represents the click event streams.

{% highlight javascript %}
const upMarbles   = "--x----x--x---";
const downMarbles = "----x-------x-";
{% endhighlight %}

So using our marble diagram syntax, we've mocked out a user clicking the up button on frame 20, down on frame 40, up again on frame 70, up on frame 100, and finally down on frame 120. Based on our requirements, the state would be:

* `{count: 0}` (from the `startWith`)
* `{count: 1}`
* `{count: 0}`
* `{count: 1}`
* `{count: 2}`
* `{count: 1}`

We can't lay out the full state objects on the marble diagram, so we can create a map for our 3 possible states.

{% highlight javascript %}
const expectedStateMap = {
  a: {count: 0},
  b: {count: 1},
  c: {count: 2},
};
{% endhighlight %}

From there we can layout what the expected results from the model should be as a marble diagram.

{% highlight javascript %}
const expected    = "a-b-a--b--c-b-|";
{% endhighlight %}

When we lineup our marble diagrams it is pretty easy at a glance to see what our app is doing.

{% highlight javascript %}
const upMarbles   = "--x----x--x---";
const downMarbles = "----x-------x-";
const expected    = "a-b-a--b--c-b-";
{% endhighlight %}



Even though this was a relatively simple example, I think it layouts out a pattern that can be grown to fit a lot of apps. Creating a model as a state store that takes events allows you to test its logic by create marble diagrams for the events and for the expected state. And again, this [marble test example is up on github](https://github.com/ericponto/rxjs-marble-test-example), so check it out.
