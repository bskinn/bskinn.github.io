---
layout: page
title: Tags
permalink: /tags/
---

{% for tag in site.tags %}
  {% assign taglist = taglist | append: tag[0] | append: " " %}
{% endfor %}

{% assign taglist = taglist | strip | split: " " | sort %}

<div class="tagpage">
{% assign prev_initial = "!" %}
{% for tagname in taglist %}
  {% assign curr_initial = tagname | slice: 0 %}
  {% if prev_initial != curr_initial %}<div style="padding-top: 12px;"><span style="font-size: 105%;"><strong>{{ curr_initial | upcase }}</strong></span></div>{% endif %}
  {% for tp in site.tagpages %}
    {% if tp.tag == tagname %}{% assign tagurl = tp.url %}{% endif %}
  {% endfor %}
  {% for t in site.tags %}
    {% if t[0] == tagname %}{% assign numposts = t[1] | size %}{% endif %}
  {% endfor %}
  <p class="taglist" style="font-size: 90%;"><a class="tag" href="{{ tagurl }}"><span class="tagsingle"><strong>{{ tagname }}</strong></span> <em>{% include tagdesc.html tagname=tagname %} ({{ numposts }})</em></a></p>
  {% assign prev_initial = curr_initial %}
{% endfor %}
</div>

