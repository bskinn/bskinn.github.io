---
layout: post
title: 'Scratch Post'
tags: administrative site-testing
---

{% for p in site.posts %}
  {{ p.title | append: "<br><br>" }}
{% endfor %}

{% for tp in site.tagpages %}
  {{ tp.title | append: "<br><br>" }}
{% endfor %}


