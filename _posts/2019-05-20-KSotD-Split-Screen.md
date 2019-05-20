---
layout: post
title: 'KSotD (Word): Toggle Split Screen -- Ctrl+Alt+S'
tags: ksotd word
---

Going back at least the past several versions of Office, Word has implemented a split-screen
editing mode, where the top and bottom portions can be scrolled independently
to different portions of the open document:

{% include img.html path="ksotd/CA_S-1.png" width="600px" clicknote="1" %}

Historically (Office 2013 and earlier), there was always a little drag handle above the
scroll bar that I could pull down to split the screen, but that fiddly bit seems
to have been removed in Word 2019:

{% include img.html path="ksotd/CA_S-2.png" width="300px" %}

Fortunately, the `DocSplit` command is available for keyboard shortcut assignment;
I can't remember now whether it was already defined by default, or if I had to
set it up myself, but <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>S</kbd> works like a
charm to toggle the split screen.

Happily, it still works in 2019 to double-click on the separator bar to remove the
split screen, though the cursor placement seems to be a lot more touchy than it used to be.
Make sure you double-click when the cursor is showing an
[up/down resize bar](https://www.iconfinder.com/icons/2200163/css_cursor_cursor_resize_cursor_row_size_cursor_icon);
if you miss, Word will open either the `Page Setup` or `Tabs` dialog instead.