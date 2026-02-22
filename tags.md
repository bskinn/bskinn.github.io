---
layout: page
title: Tags
permalink: /tags/
---

{% assign taglist = collections.tagList %}

<div class="tagpage">
  {%- assign prev_initial = "!" -%}
  {%- for tagname in taglist -%}
    {%- assign curr_initial = tagname | initial -%}
    {%- if prev_initial != curr_initial -%}
      <div class="tag-index-letter"><strong>{{- curr_initial | upcase -}}</strong></div>
    {%- endif -%}
    {%- assign numposts = collections[tagname] | size -%}
    <p class="taglist tag-index-entry">
      <a class="tag" href="/tags/{{- tagname -}}/"><span class="tagsingle"><strong>{{- tagname -}}</strong></span> <em>{%- render "tagdesc.html", tagname: tagname %} ({{- numposts -}})</em></a>
    </p>
    {%- assign prev_initial = curr_initial -%}
  {%- endfor -%}
</div>
