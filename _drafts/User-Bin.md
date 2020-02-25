---
layout: post
title: 'My How and Why: Per-User "bin" Directories'
tags: how-why cli bash cmd
---

I spend a decent amount of time at the commandline, for various reasons.
At work, it's usually at Windows ``cmd``; at home, it's either Windows ``cmd``
or ``bash`` on Debian. In both places, a major activity is working with Python;
on the Linux box, I'm also doing a wide variety of other stuff (details?).

Regardless, as is pretty common, I have a bunch of things that I want
to not have to type out in full every time. Some of these I handle by
defining aliases for in Linux (e.g., helper for activating virtual environments),
but some things work better with symlinks than with aliases (linking
to various user-installed Pythons being one major example); and, 
while ``cmd`` does now support symlinks, they don't play nicely with
running Pythons, and defining persistent aliases requires some
[registry fiddling](https://stackoverflow.com/questions/20530996/aliases-in-windows-command-prompt)
that, all things considered, I'd rather not mess with it...

**How I was doing it before; what I'm switching to?**


But, it's so clean, now I think I might switch to it?

But, no, they're one-liners? No, can use ``$T`` to run multiple commands.

Biggest limitation might be that [it's capped at nine arguments](https://ss64.com/nt/doskey.html).

