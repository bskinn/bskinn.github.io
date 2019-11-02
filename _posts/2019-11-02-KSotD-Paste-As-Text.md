---
layout: post
title: 'KSotD (Word): Paste As Text -- Ctrl+Alt+Shift+Space'
tags: ksotd word
---

I do a lot of writing at work. 

A lot.  Of writing.

Proposals... reports... emails, you name it. And, in many cases I'm copying content in from elsewhere, whether it's citations, or quotes from PDF, web, etc. sources, or just moving text from one file to another.  On one hand, it's great that Word goes to such great lengths to try to preserve the formatting of the stuff it's copying in; sometimes that's exactly what you want.

Buuuut, a lot of the time it's *not* what I want. I just want the text, without the snappy font and oh-so-carefully-chosen background shading color. So, I use the `Keep Text Only` paste mode quite a bit, to discard all of the formatting:

{% include img.html path="ksotd/CAS_Space-1.png" width="246px" alt="Screenshot of 'Keep Text Only' context menu" %}

In addition to this being one of the choices in the `Paste Options` section of the context menu, there's also an old-style, sequential-press keyboard shortcut to get to it: <kbd>Alt</kbd>-<kbd>H</kbd>-<kbd>V</kbd>-<kbd>T</kbd>, which I use heavily. It's been a *really* long time since I've worked with a pre-Ribbon version of Office, so I have no clue why the first keypress is `H`. But, I assume `V` was associated with the <kbd>Ctrl</kbd>+<kbd>V</kbd> of `Paste` or `Paste Special`, straightforwardly enough, and `T` makes sense for a `Text Only` option.

Regardless, it finally struck me that I needed (or, well, *wanted*) faster access to this command. Four sequential keypresses take (comparatively speaking) a long time, and actually the newer versions of Word aren't all that great at detecting the initial <kbd>Alt</kbd> keystroke...about half the time I end up typing `hvt` into my document, instead of pasting in the text. This behavior ultimately is what introduced enough friction that it occurred to me to consider doing it differently.

So, I found the right internal command (`All Commands` > `PasteTextOnly`) and bound a keyboard shortcut to it: <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>Shift</kbd>+<kbd>Space</kbd>.  This shortcut was conveniently unbound by default in both Word 2019 and Word 2013, and was an appealing choice because if I have to I can use it one-handed. (I usually use pinky/ring/thumb for <kbd>Ctrl</kbd>/<kbd>Shift</kbd>/<kbd>Alt</kbd> and press the final shortcut key with my index finger; for this one, I'll probably need to get used to pinky/ring/index for <kbd>Ctrl</kbd>/<kbd>Shift</kbd>/<kbd>Alt</kbd> and thumb on <kbd>Space</kbd> ... just a bit of new muscle memory.)

As a sidenote, in the course of tracking down the `PasteTextOnly` command, I noticed that there's also access provided to `PasteAsPicture`, which is a feature I *also* use quite a bit (for, e.g., pasting static views of Excel charts into documents). Suspect I'll be binding something to that in the near future....

