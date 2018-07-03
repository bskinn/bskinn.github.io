---
layout: post
title: 'Jekyll: The "include" Tag as a Function-Equivalent'
tags: jekyll
---

In starting up this blog, I made use of the tremendous `jekyll-now` {% include gh.html user="barryclark" repo="jekyll-now" %} project, which provides a barebones framework for a Github Pages site.  It allowed me to start drafting posts and getting a feel for Jekyll based only on my prior experience with Markdown and git, without having to download Ruby or know any Liquid templating at all. Awesome thing, definitely check it out.

As I started to fiddle with the Jekyll/Liquid parts of the machinery, though, one of the first things I searched around for was the Liquid equivalent of a procedural function.  Encapsulation and code reuse is the bomb, after all, and I did *not* want to have to type in the same things over and over again.

After searching some dead-ends, I found it: the `{% raw %}{% include %}{% endraw %}` tag. Looking back at the Jekyll docs, it's [right there](https://jekyllrb.com/docs/includes/) for all to see, but ... when you don't know what you're looking for, you don't know what you're looking at.  That Jekyll doc page even includes an example of ~exactly what I wanted to do when I was first figuring out `{% raw %}{% include %}{% endraw %}`: a parameterized image insert.  However, I probably would still have put together my own thing anyways: my default has been to approach the site formatting where possible mainly from the Markdown side, as I still don't yet know the full menu of HTML tags provided by Jekyll/Github Pages by default.

The first parameter in an `{% raw %}{% include %}{% endraw %}` tag is the file that Jekyll should look for, in the `/_includes` directory. After that you can supply arbitrary parameters to pass into the `include` substitution, which are then available within the included file as members of the `include` object.  For my image-insertion "function", stored in `_includes/img.html`, I wanted the following structure for the image-insertion Markdown/HTML:

```
[<img  src="{path}"  alt="{alt-text}"  width="{width, with default}"/>]({path})<br>&nbsp;&nbsp;
```

The trailing `<br>&nbsp;&nbsp;` prevents the following text from cramping the bottom of the image.

The contents of `_includes/img.html` as of this writing are:

```
{% raw %}[<img src="{{ site.baseurl }}/images/{{ include.path }}" alt="{{ include.alt }}" width="{% if include.width %}{{ include.width }}{% else %}400px{% endif %}"/>]
({{ site.baseurl }}/images/{{ include.path }})<br>&nbsp;&nbsp;
{% if include.clicknote %}<span style="font-style: italic; font-size: 65%;">(Click to enlarge)</span>{% endif %}{% endraw %}
```

Since this `include` is inserting Markdown, all of the above content is actually entered on one line in `img.html`, as otherwise spurious extra newlines would be inserted.

The tag to add an image with the default width would then look like:

```
{% raw %}{% include img.html path="images/pic.png" alt="Pic of something" %}{% endraw %}
```

For scaled-down images, I also wanted to be able to explicitly include a little note advising that the image could be clicked to see it full-size. This is where the `clicknote` argument comes in; for a 600px-wide image, the following would show it at 50% scale, with a '*(click to enlarge)*' note added:

```
{% raw %}{% include img.html path="images/bigpic.png" alt="Scaled pic" width="300px" clicknote=1 %}{% endraw %}
```

[This post]({{ site.baseurl }}{% link _posts/2018-06-27-KSotD-Custom-Word-Shortcuts.md %}) ([source](https://github.com/bskinn/bskinn.github.io/blob/master/_posts/2018-06-27-KSotD-Custom-Word-Shortcuts.md)) illustrates a variety of uses of this `{% raw %}{% include %}{% endraw %}`.

{% include stackedit.html %}

