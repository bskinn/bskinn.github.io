---
layout: post
title: 'KSotD: Adding Custom Keyboard Shortcuts in Word'
tags: ksotd word
---

This post is another "administrative" KSotD entry, setting the stage for specific keyboard shortcuts to come.

Word is unique among the major Office applications in that you can freely (re)define any keyboard shortcuts you wish.  (Powerpoint has no support that I've found for custom keyboard shortcuts; Excel at least lets you attach <kbd>Ctrl</kbd>+<kbd>{letter}</kbd> shortcuts to macros.)  Shortcut definitions are managed through the `Customize Keyboard` dialog, which I usually access as follows:

1. Select `More Commands...` from the `Customize Quick Access Toolbar` drop-down:

{% include img.html path="ksotd/CustKS-1.png" alt="Click path for More Commands..." width="360px" %}

2. Click `Customize Ribbon` in the left-hand pane, and then `Customize...` next to "Keyboard shortcuts:" at the bottom of the options dialog:

{% include img.html path="ksotd/CustKS-2.png" alt="Click path for Customize Keyboard Shortcuts" clicknote="1" %}

This will display the `Customize Keyboard` dialog:

{% include img.html path="ksotd/CustKS-3.png" alt="Customize Keyboard dialog" width="567px" %}

From here, you can select essentially ***any*** command that Word knows how to execute and both (a) see what keyboard shortcut(s), if any, are assigned to it; and (b) (de-/re-)assign shortcut(s) as you see fit, *including* many shortcuts that are defined by default.

The commands are generally categorized by where they appear in the Ribbon; that's the first place to check.  Some commands aren't listed under any Ribbon tab categories, though, so for those you have to hunt through the "All Commands" or "Commands Not in the Ribbon" categories:

{% include img.html path="ksotd/CustKS-4.png" alt="All Commands listing" width="567px" %}

Adding shortcuts to macros is done via the "Macros" category:

{% include img.html path="ksotd/CustKS-5.png" alt="All Commands listing" width="567px" %}

Removing shortcuts is straightforward: select the currently assigned shortcut and click `Remove`. The workflow for adding shortcuts is pretty intuitive: click into the `Press new shortcut key:` box and press the key combination you want.  The dialog will tell you what that key combination is assigned to, if anything. Be sure to click `Assign` once you've got the shortcut you want.

Note that Word supports two-step key combinations, such as <kbd>Ctrl</kbd>+<kbd>'</kbd>,<kbd>A</kbd> (the default for inserting $$\mathrm{\acute A}$$). In this case, the initial <kbd>Ctrl</kbd>+<kbd>'</kbd> keypress is referred to as a `[prefix key]`, and shows up as such in the `Currently assigned to:` field:

{% include img.html path="ksotd/CustKS-6.png" alt="Showing [prefix key]" width="567px" %}

Hugely, hugely helpful. Many of the entries in the KSotD series will be custom-defined shortcuts, some to built-in Word functionality and some to custom macros.


<br><br><small>*This post was written with [StackEdit](https://stackedit.io).*</small>

