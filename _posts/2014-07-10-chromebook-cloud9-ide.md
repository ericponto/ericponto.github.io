---
  layout: post
  title: Chromebook worflow with Cloud9 IDE
  tag: Workflow
  excerpt: Who needs a Mac or Windows machine? With Cloud9 I've got a pretty sweet dev environment on a Chromebook.
---

I bought a Chromebook when they first came out a few years ago. I did my best to find replacements for all the traditional desktop apps I use and was mostly successful. But I never really was able to get a good development environment set up. There were some online code editors that were fine for doing small stuff, but I missed all my tools.

So we've always had another laptop that I used along side the Chromebook for development. But with kids both of those machines were in need of replacement. My first Chromebook stopped working after the power cord got snapped off inside the port. Our Windows 8 machine didn't last much longer with a little someone deciding to lay down on it while open, flattening it and snapping the hinges. It held together a little while with a large binder clip, but finally gave out. Anyway, it was time for a new computer and as a quick replacement, we decided to get another Chromebook.

I was a little worried that it again would not be suitable as a dev machine. I had heard of [Cloud9](https://c9.io/) and decided tonight to give it a try, but I was not expecting much from a cloud-based solution. I was totally wrong. I am using it right now and it is awesome.

I quickly connected it to my github account and clone in the repo for this site. From the provided terminal, I found node and ruby already installed. So I was able to `npm install` and `gem install jekyll` to get the whole site up and running "locally." After installing the grunt-cli globally, I made changes in a Less file and ran `grunt` just as I would normally and built the CSS. So cool.

The only tricky part of whole process was getting the Jekyll server running where I could actually see my changes. But Cloud9 has variables you can use to correctly set the port and host for the server.

{% highlight PowerShell %}
jekyll serve --host $IP --port $PORT
{% endhighlight %}

To actually see the site, the url was: https://[workspacename]-c9-[username].c9.io

So that's pretty much it. I'm missing my Sublime Text plugins a little bit, but the Cloud9 editor isn't bad. We'll see how I feel about all of this after a few weeks of use, but for tonight I'm super pleased that I'm able to maintain my normal workflow from our new Chromebook.