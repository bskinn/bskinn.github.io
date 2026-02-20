---
layout: page
title: Tags
permalink: /tags/
---

{% assign taglist = collections.tagList %}

<div class="tagpage">
{%- assign prev_initial = "!" -%}
{%- assign prev_is_colored = 0 -%}<div>
{%- for tagname in taglist -%}
  {%- assign curr_initial = tagname | initial -%}
  {%- if prev_initial != curr_initial -%}
    {% if prev_is_colored == 0 %}
      </div>
      <div style="background-color: #f8fff8;">{%- assign prev_is_colored = 1 -%}
    {% else %}
      </div>
      <div>{%- assign prev_is_colored = 0 -%}
    {% endif %}
    <div style="padding-top: 12px;"><span style="font-size: 105%;"><strong>{{- curr_initial | upcase -}}</strong></span></div>
  {%- endif -%}
  {%- assign numposts = collections[tagname] | size -%}
  <p class="taglist" style="font-size: 90%;">
  <a class="tag" href="/tags/{{- tagname -}}/"><span class="tagsingle"><strong>{{- tagname -}}</strong></span> <em> {%- render "tagdesc.html", tagname: tagname %} ({{- numposts -}})</em></a>
  </p>
  {%- assign prev_initial = curr_initial -%}
{%- endfor -%}
</div>
</div>
