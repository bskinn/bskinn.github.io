---
layout: post
title: 'PyCon 2019 Recap'
tags: pycon
---

Two years ago, I was delighted to learn that PyCon was going to be in Cleveland
for both the 2018 and 2019 meetings, putting it only about a 3-hour drive from
my house. I'd been hacking on Python stuff for a few years by that point,
and was excited to have the chance to rub elbows with some of the
people I'd been interacting with online in various ways.  In 2018, I got to
say hello to the big Python podcasters,
Michael Kennedy {% include tw.html user="mkennedy" %},
Brian Okken {% include tw.html user="brianokken" %}, and
Tobias Macey {% include tw.html user="tobiasmacey" %}, as well as
Travis Oliphant {% include tw.html user="teoliphant" -%},
Ernest Durbin {% include tw.html user="ewdurbin" %},
Brett Cannon {% include tw.html user="brettsky" %}, and numerous
other well-known figures in the Python universe.  I also had the chance to
eat lunch with Guido {% include tw.html user="gvanrossum" %} and others from
Dropbox, which was quite fun. All in all, it definitely whetted my
appetite to return in 2019.

This year, I was able to attend for all three days of talks, plus part of
the first day of sprints.  This post is an attempt to record everything I can
recall about the experience, though I'm sure I've forgotten a substantial
fraction. Apologies to anyone I've missed, or for any incorrect details!
Lacking any particular organizational plan for this, I'm just tossing
everything into a few sets of loosely-related bullets/sections.


**Lightning Talk**

I got to give a lightning talk! I submitted `pent`
{% include gh.html user="bskinn" repo="pent" -%}
{%- include pypi.html project="pent" %},
my early-stage side project for extraction of structured data from free text,
and was slotted into the Saturday PM session.  I thought it went quite well,
especially given that I made a live code demo of it. (Typing accurately through
stage nerves is an ... interesting...  challenge.) The video is
[up on YouTube](https://youtu.be/sRwHWPDJBnk?t=1050), starting at 17:30.
As I mentioned in the talk, the are still in [docs](https://pent.readthedocs.io)
progress...they're the next thing on my list after I finish this post.

I need to make particular note here, though: the talk wouldn't have happened
if not for the generosity of Jonas Neubert
{% include tw.html user="jonemo" %}, who loaned me his laptop for a couple
of hours.  Thanks again, and my apologies for leaving your `cmd` windows
set to 28-pt black-on-white....


**Packaging Mini-Summit**

I had decided to stay for one day of sprints, if I could;
I'd learned about the
[Packaging Mini-Summit](https://discuss.python.org/t/pycon-us-packaging-mini-summit-2019/833)
planned for that day, and figured it would be a good way to get more insight
into some of the internals of the packaging decision-making,
and maybe even help out some.
In order to kickstart discussions and help people recognize one another,
a PyPA/packaging meet-and-greet open space had been scheduled for first-thing Friday morning.
I briefly met Carol Willing
{% include tw.html user="WillingCarol" %},
Sumana Harihareswara {% include tw.html user="brainwane" %},
and Pradyun Gedam {% include tw.html user="pradyunsg" %} there,
as well as at least 3-4 other people whose names I didn't get.
The mini-summit was scheduled to be part of the packaging sprints,
which Sumana was broadly orchestrating.  First-thing on Monday, I was tasked
with co-facilitating the process of onboarding some people new to Python packaging
via running through the
[official PyPA packaging tutorial](https://packaging.python.org/tutorials/packaging-projects/),
which mostly involved answering a handful of questions while everyone otherwise ~breezed through.

During this initial chunk of time, Brett Cannon {% include tw.html user="brettsky" %} came over
briefly to say hello, and I remarked about how I'd unexpectedly been put in charge of a thing.
He noted that it's really not that hard to "move up in the ranks" within the Python
community ... that all it really takes is being nice and expressing a desire to help out.
Pretty straightforward!

The mini-summit started up mid-morning, broke over lunch, and wrapped up in the
early afternoon. Requests for topics to discuss had been solicited through a
[discuss.python.org](https://discuss.python.org/t/packaging-mini-summit-pycon-us-2019-topic-suggestions/1534)
post, with priority decided based on the combined number of likes on each topic at
the discuss.python post plus the number of in-person 'in favor' votes. The following topics
were addressed:

 - Status of PyPA Security Grant
 - External Dependencies
 - PyPA Governance
 - Future of Editable Installs
 - Strictness of PyPI/pip with Regard to Metadata
 - src/ Layout
 - Storage of Requested/Installed Extras
 - Mechanism to Upload Wheels for Packages Owned by Others

More detail (*lots* more) can be found at the
[Google Doc](https://docs.google.com/document/d/1Wz2-ECkicJgAmQDxMFivWmU2ZunKvPZ2UfQ59zDGj7g/edit#)
housing the notes from both the mini-summit and from the remainder of the sprints.
I had volunteered to take notes throughout the mini-summit, as had
Chris Wilcox {% include tw.html user="chriswilcox47" %}; he put together the majority of the
mini-summit content in the Doc, and I filled in some gaps/details where I could.


**Talks**

*Friday*

- [Keynote, Russell Keith-Magee](https://www.youtube.com/watch?v=ftP5BQh1-YM) --
*[black swans, unpredicted things leading to Python succeeding, and what things might
further Python's future adoption, or hinder it]*

- ...

**Misc Connections/Events**

- I ended up spending a fair amount of time at the JetBrains booth on the
trade show floor, where I:
  - Talked to Matt Harrison
{% include tw.html user="__mharrison__" %} about his training services
  - Got some tips about tracking down PyCharm keyboard shortcuts from
Elizaveta Shashkova {% include tw.html user="lisa_shashkova" %}.
  - Talked a bit with a few other JetBrains employees, as well as with
Michael Kennedy {% include tw.html user="mkennedy" %},
Christopher Burke {% include tw.html user="captainbatman" %}, and
Stephen Schroeder {% include linkedin.html user="stephenschroeder7" %}.
  - Was in the audience for the live recording of Python Bytes
{% include tw.html user="pythonbytes" %}
([#129](https://pythonbytes.fm/episodes/show/129/maintaining-a-python-project-when-it-s-not-your-job)),
which I had missed last year.
  - Caught bits and pieces of some of the various content-creators'
    mini-presentations they'd scheduled

- I ran into Brian Okken {% include tw.html user="brianokken" %} a couple
of different times, and in one of those conversations I asked him about
parametrizing pytest fixtures.  I had tried just applying
`@mark.parametrize`, but that didn't work at all. The discussion
prompted me to take a closer look at the pytest docs, whereupon I
learned that you have to [pass the parametrization iterable to the
*params* argument of
`@pytest.fixture()`](https://docs.pytest.org/en/latest/fixture.html#parametrizing-fixtures). 
I of course promptly [reorganized some rather smelly test
code](https://github.com/bskinn/sphobjinv/commit/4f0c43afcd535a535ef2952a7023070633537ea6)
in one of my packages, `sphobjinv`
{% include gh.html user="bskinn" repo="sphobjinv" %} {% include pypi.html project="sphobjinv" %}.

- Friday evening I tagged along with a group headed out to dinner, and ended up talking
mostly to Pradyun {% include tw.html user="pradyunsg" %} and
Jonas Neubert {% include tw.html user="jonemo" %}, plus a couple of quick exchanges with
Julian Berman {% include tw.html user="JulianWasTaken" %} {% include gh.html user="Julian" %}.
This proved serendipitous, given Jonas's generosity in loaning his laptop
for my lightning talk.

- During the job fair/poster session on Sunday, I saw
Russell Keith-Magee {% include tw.html user="freakboy3742" %}
and chatted with him a bit, mostly about his
[keynote](https://www.youtube.com/watch?v=ftP5BQh1-YM)
and what the future of [BeeWare](https://beeware.org) in particular, and Python in general,
might look like.

- After the closing keynotes on Sunday, I ran into
Meredydd Luff {% include tw.html user="meredydd" %} and
Ian Davies {% include tw.html user="daviesian_cam" %} of 
[Anvil fame](https://anvil.works) {% include tw.html user="anvil_works" %},
and talked to Ian for a little while. I'd talked to Meredydd a bit at
PyCon 2018, and it was good to learn more from Ian about how Anvil works
under the hood and how things are going for them.  The Anvil booth
was consistently **packed** this year, so they've clearly gotten
a lot of people's attention!

- This conversation with Ian was fortuitous, because during the course of it
a group of people convened in the vicinity and started making dinner plans.
One of them was Pradyun {% include tw.html user="pradyunsg" %},
who very kindly invited me along.  So, I ended up getting dinner and
ice cream with Pradyun,
Sumana {% include tw.html user="brainwane" %},
Nathaniel Smith {% include tw.html user="vorpalsmith" %},
Josh Oreman {% include gh.html user="oremanj" %}, and
Sviatoslav Sydorenko {% include tw.html user="webKnjaZ" %},
which was a really great time.
There was an unexpectedly prolific amount of 
[ST:TNG](https://en.wikipedia.org/wiki/Star_Trek:_The_Next_Generation) and
[Square One TV](https://en.wikipedia.org/wiki/Square_One_Television)/
[Mathnet](https://en.wikipedia.org/wiki/Mathnet) geeking-out
with Sumana, which was **awesome**.

- During the brief 'Python packaging newcomers' session Monday morning,
I met someone who'd bookmarked my
[pyproject.toml/src post]({% post_url 2019-04-01-My-How-Why-Pyproject-Src %})
for later use---THAT was simultaneously a cool and also a decidedly *odd*
experience ... "Somebody I don't know actually read my thing!"

- At lunch on Monday, I happened to sit at the same table as
Anthony Sottile {% include tw.html user="codewithanthony" %} {% include gh.html user="asottile" %},
and it was great to have the chance to talk to him in person for a bit.
