{% for p in site.posts %}
  {{ p.title | append: "<br><br>" }}
{% endfor %}


