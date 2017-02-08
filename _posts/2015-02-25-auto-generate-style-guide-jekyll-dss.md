---
  layout: post
  title: Auto-generated Style Guide via Jekyll and DSS
  tag: CSS
  excerpt: I've always been intrigued by the idea of auto-generated a style guide based on comments in my CSS. Using DSS to parse the comments and Jekyll to be the documenation site make that idea possible.
---

A few years ago I was introduced to JSDoc and was really excited by the idea of auto-generated documentation for my code. I've been using JSDoc on and off since, generally at least commenting my code using that style, and sometimes generating the documentation. I've always been intrigued by the idea of applying the same concept to CSS documentation. I'm a firm believer in the idea that CSS requires more comments than JavaScript (as explain in [CSS Guidelines](http://cssguidelin.es/#commenting) and am also a big proponent of creating style guides/pattern libraries/component libraries/etc.

Enter [DSS](https://github.com/darcyclarke/DSS). DSS parses JSDoc like comment blocks in CSS files and outputs an object of "blocks" that each have a name, description and sample markup. Perfect.

{% highlight css %}
/**
	* @name Buttons
	* @description This is an example of a button
	* @markup
	* <button class="button">Button</button>
*/
.button {}
{% endhighlight %}

DSS just outputs an object though...so to create a style guide you need to pair it with some sort of templating solution. There is a great grunt plugin, [grunt-dss](https://github.com/darcyclarke/grunt-dss), that has a solution using Handlebars. I wanted to use Jekyll to generate the docs though. This site uses Jekyll. A few other sites I work on use Jekyll. Plus it integrates so nicely with Github Pages. 

To access the data outputted from DSS in a Jekyll template, the output can go into the `_data` directory. Then it is accessible on the `site.data` object. Then it is a matter of looping over the blocks and generating the documentation.

{% highlight html %}
{% raw %}
{% for block in site.data.styles.blocks %}
	<h2>{{ block.name }}</h2>
	<p>{{ block.description }}</p>
	
	<h3>Example</h3>
	<div>{{ block.markup.example }}</div>
	
	<h3>Markup</h3>
	<div>
		{% highlight html %}
			{{ block.markup.example }}
		{% endhighlight %}
	</div>
{% endfor %}
{% endraw %}
{% endhighlight %}

To get the DSS output in the `_data` folder I wrote a little grunt plugin that wraps DSS, [grunt-dss2json](https://github.com/ericponto/grunt-dss2json). It's available to use outside of Jekyll via `npm install --save-dev grunt-dss2json`, so you can use DSS with a different templating option. 

I have a full example repo up for [Jekyll-DSS](https://github.com/ericponto/jekyll-dss) and a [page with the example output](https://www.ericponto.com/jekyll-dss/).  