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
to not have to type out in full every time. Shorter ones of these I handle by
defining aliases for in Linux (e.g., helper for activating virtual environments),
but some things work better with symlinks than with aliases (linking
to various user-installed Pythons being one major example); and, 
while ``cmd`` does now support symlinks, they don't play nicely with
running Pythons (appears to be a path/working dir problem --example--),
and defining persistent aliases requires some
[registry fiddling](https://stackoverflow.com/questions/20530996/aliases-in-windows-command-prompt)
that, all things considered, I'd rather not mess with it... and, it has
similar path/working dir problems to the symlinks (--example--).

Linux
-----

**Aliases**

Don't actually use these -- don't take arguments, static abbreviations.
Should define some for things like df -h and du -sh, though:

```
alias df="df -h"
```

Can define an alias that masks another command/executable, as in the above,
or can define a new name:

```
alias dfh="df -h"
```

I generally would define a new name, so that I can get at the
original form if I want it.

**Functions**

Defined in the shell, take arguments.
Typically use if I'm not passing arguments through
wholesale to a downstream executable. Typically use for things where I'm
interacting with system builtins, rather than executables on the
filesystem. Quicker contractions of frequently used commands.

Examples -- vact, hg, psag


```
{example}
```

Can put directly into ``~/.profile`` or ``~/.bashrc``,
or keep segregated in ``~/.bash_aliases``.


**Executable Symlinks**

Create ``~/bin``; prepend ``/home/username/bin`` to ``PATH``
(show syntax as in ``.bashrc``); add symlinks to binaries
of interest in that folder. Use most extensively for
different user-installed, locally-compiled Pythons.

Build custom Python with ``./configure --prefix=/home/username/python/x.y.z/``,
then ``make && make install``.

Then, symlink in ``~/bin`` (CHECK THESE PATHS):

```
$ cd /home/username/bin
$ ln -s /home/username/python/x.y.z/bin/pythonx.y pythonx.y
```



Windows
-------

All user bin-folder batch files. Add to PATH.



Can do doskey aliases, 



**How I was doing it before; what I'm switching to?**


But, it's so clean, now I think I might switch to it?

But, no, they're one-liners? No, can use ``$T`` to run multiple commands.

Biggest limitation might be that [it's capped at nine arguments](https://ss64.com/nt/doskey.html).

