---
layout: post
title: 'Extracting Unique Twitter handles from Custom Jekyll Include Tags'
tags: bash regex jekyll
---

While I work mainly on Windows, I've also been using Debian Linux for quite a while,
with a first dabbling in the `sarge` era and then a more prolonged,
ongoing experience with the recent `wheezy`/`jessie`/`stretch` sequence
([list of all Debian versions](https://www.electrictoolbox.com/debian-release-names/)).
I currently am maintaining a dual quad-core Xeon Dell PowerEdge
(purportedly a cast-off from a Facebook server farm, interestingly...)
that's running `stretch`, which I'm using for development and for running some
odds-and-ends quantum chemical calculations.
In the course of finalizing my [PyCon 2019 recap post]({% post_url 2019-06-26-PyCon-2019-Recap %}),
I had reason to use some of the Linux/Unix CLI tooling in a way I hadn't had to before.
I imagine most of this post will not be particularly novel to many,
but I was pleased at how quickly I was able to get the info I needed.

As part of adapting Barry Clark's
`jekyll-now` {% include gh.html user="barryclark" repo="jekyll-now" %} to make this blog,
I've created a number of [custom includes](https://github.com/bskinn/bskinn.github.io/tree/master/_includes)
to streamline the writing process.  For example, the GitHub repo link icon above
was created using a [`gh.html`](https://github.com/bskinn/bskinn.github.io/blob/0a2938955ed779c4b65b008c59c073f8f05bc328/_includes/gh.html) include;
I have similar ones for [Twitter](https://github.com/bskinn/bskinn.github.io/blob/0a2938955ed779c4b65b008c59c073f8f05bc328/_includes/tw.html),
[PyPI](https://github.com/bskinn/bskinn.github.io/blob/0a2938955ed779c4b65b008c59c073f8f05bc328/_includes/pypi.html),
[YouTube](https://github.com/bskinn/bskinn.github.io/blob/0a2938955ed779c4b65b008c59c073f8f05bc328/_includes/yt.html),
and others.  As part of the PyCon recap post, I tried to connect everyone I mentioned there
to their profile on some sort of social media platform, or on GitHub.
Since most everyone mentioned was on Twitter, I wanted to follow up the
[announcement of the post](https://twitter.com/pylogging/status/1144013370984718342)
with a couple of ['acknowlegment Tweets'](https://twitter.com/btskinn/status/1144020289635926016).
Since those Twitter mentions were all achieved using `tw.html`, that `{% raw %}{% include %}{% endraw %}`
syntax provided a handy way of generating a sorted, duplicate-free list of handles for me.

The  `tw.html` include is set up to take a Twitter handle as input using the typical
[parameter syntax](https://jekyllrb.com/docs/includes/#passing-parameters-to-includes),
via `user="handle"`, which provides a natural pattern to key off of for a regex search of the post's Markdown source.
A bash one-liner, inspired by [this SO answer](https://stackoverflow.com/a/619091/4376000), handed these to me quite neatly:

```
$ grep tw.html 2019-06-26-PyCon-2019-Recap.md | sed -E 's/^.+user="([^ ]+)".+$/\1/' | sort -u
```

I didn't need to use regex in the initial "`grep tw.html ...`",
since I was just trying to pick out the lines that had the `tw.html` includes in them.
If I'd enabled regex in `grep`, it would've been best to handle the period specially:
`grep -E 'tw[.]html'`. Surrounding it in square brackets would turn it into a
[character class](https://www.regular-expressions.info/charclass.html);
a period within a character class is not a metacharacter.

All of the regex power was brought to bear in the `sed` command,
in the form of the search-and-replace `'s/.../.../'` syntax; see
[here](https://ss64.com/bash/sed.html). The `-E` flag to `sed` activates 'extended regex';
I don't really know what differs between "regular" and "extended" regex (lookaround, maybe?),
but I do know I basically *always* want extended regex.

Here's what each piece of the regex search-and-replace does:

```
s/          # Start the search/replace
^           # Start matching at the start of the line
.+          # Match one or more arbitrary non-newline characters
user="      # Match the explicit string 'user="'
(           # Open a capturing group, for later use
[^ ]+       # Character class to match at least one *non*-space character; '^' makes it a negated character class
)           # Close the capturing group
"           # Explicit double-quote, closing the passed 'user' parameter value
.+          # Match one or more arbitrary non-newline characters
$           # Match the end of the line
/           # Switch from the search pattern to the replace pattern
\1          # Replace the entire line (since I used '^.+' and '.+$') with the single capturing group, representing the desired Twitter handle
/           # Close the sed search-and-replace directive
```

This regex is not perfectly constructed; in particular, I possibly should have used `.*`
instead of `.+` both places the latter occurred, just on the off-chance that the includes
were adjacent to the start or end of a line. However, I almost *never* write my includes
that way, so I was pretty confident I didn't have to worry about those cases.

The final `sort -u` was the key thing I took from the SO question...
`sort`, naturally, [sorts the lines](https://ss64.com/bash/sort.html);
but the `-u` argument (for 'unique') removes any duplicates, which provided
a handy list for transferring into Twitter.

-----

In order to at least be approximately sure I hadn't missed anyone,
I needed to check to be sure I hadn't split any `{% raw %}{% include %}{% endraw %}` commands over
multiple lines in a way that would break the detection. I thus compared my original search:

```
$ grep tw.html 2019-06-26-PyCon-2019-Recap.md | wc -l
57
```

to a similar search, but set up to also find the closing curly braces of the relevant include tags:

```
$ grep -E 'tw.html.+}' 2019-06-26-PyCon-2019-Recap.md | wc -l
57
```

(I actually forgot to escape/character-class the "`.`" in `tw.html` in that second search, but it shouldn't really matter.)
Here, I'm using [`wc`](https://ss64.com/bash/wc.html) with the `-l` flag to count the total number of
lines in the search results.  Thus, since these two searches have the same number of results,
I was confident that I was catching all of the occurrences of `user="handle"` that I cared about.
(Note that if it were possible that any of the includes had been written with internal Liquid tags,
and thus might have had an extra "`}`" within the overall `{% raw %}{% include %}{% endraw %}`,
then the second search would not have been reliable. Since I knew I hadn't done this, though,
this search *was* sufficient to satisfy me that I had found all of the Twitter handles.)

Still, being the ever-so-*slightly* compulsive nerd that I am, I still went ahead and did a negative control
check, by searching for a similar regex that should ***never*** match.
AFAIK Jekyll/Liquid does not use carets in its syntax, so the following `grep` should return
zero results.

```
$ grep -E 'tw.html.+\^' 2019-06-26-PyCon-2019-Recap.md | wc -l
0
```

And, indeed it did. All good!


{% include stackedit.html %}
