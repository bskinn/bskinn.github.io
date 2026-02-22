---
layout: page
title: Tags
permalink: /tags/
---

{% assign taglist = collections.tagList %}

<div class="leading-[80%]">
  {%- assign prev_initial = "!" -%}
  {%- for tagname in taglist -%}
    {%- assign curr_initial = tagname | initial -%}
    {%- if prev_initial != curr_initial -%}
      <div class="mt-[12px] border-b border-[#e5e7eb] pt-[12px] text-[105%]"><strong>{{- curr_initial | upcase -}}</strong></div>
    {%- endif -%}
    {%- assign numposts = collections[tagname] | size -%}
    <p class="text-[90%] tracking-[1px] text-[#0f3b21]">
      <a class="text-inherit" href="/tags/{{- tagname -}}/"><span class="whitespace-nowrap bg-[#effadc] [hyphens:none]"><strong>{{- tagname -}}</strong></span> <em>{%- render "tagdesc.html", tagname: tagname %} ({{- numposts -}})</em></a>
    </p>
    {%- assign prev_initial = curr_initial -%}
  {%- endfor -%}
</div>
