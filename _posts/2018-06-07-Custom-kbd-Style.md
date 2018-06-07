---
layout: post
title: 'Custom &lt;kbd&gt; style for Jekyll / Github Pages'
tags: jekyll
---

Lots of sites that use Markdown define a  `<kbd>...</kbd>` tag for formatting keypresses, with [Stack Exchange](https://meta.stackexchange.com/questions/1939/kbd-elements-are-way-too-intrusive?answertab=oldest#tab-top) and [GitHub](https://github.com/revolunet/sublimetext-markdown-preview/issues/271) being the flavors I have most experience with. However, Jekyll/GitHub Pages doesn't seem to provide such a style by default.

So, I made one: <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>Del</kbd>. It's noticeably different from the major other styles already out there (e.g., [here](https://github.com/benweet/stackedit/issues/212)), and is considerably less flashy than [some](https://github.com/auth0/kbd/blob/cf0b1378a7576d8d08d71c21d0cfc20dd7278c54/kbd.css). But, it works, to my eye at least.

To enable it, just add this somewhere in `styles.scss` in the root of your Github Pages repo (tweak as desired):

```
kbd {
  border-style: outset;
  border-width: 2px;
  border-color: #999999;
  border-radius: 6px;
  padding: 3px;
  font-size: 75%;
  font-weight: 475;
  background-color: #f8f8f8;
  margin: 2px;
  white-space: nowrap;
}
```

<br><br><small>*This post was written with [StackEdit](https://stackedit.io).*</small>