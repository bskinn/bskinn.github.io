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
{% for tagname in taglist %}
  {% for tp in site.tagpages %}
    {% if tp.tag == tagname %}{% assign tagurl = tp.url %}{% endif %}
  {% endfor %}
  {% for t in site.tags %}
    {% if t[0] == tagname %}{% assign numposts = t[1] | size %}{% endif %}
  {% endfor %}
  <p class="taglist"><a class="tag" href="{{ tagurl }}"><span class="tagsingle"><strong>{{ tagname }}</strong></span> <em>{% include tagdesc.html tagname=tagname %} ({{ numposts }})</em></a></p>
{% endfor %}
</div>

