---
layout: post
title: 'My How and Why: Custom Executables & Shortcuts'
tags: how-why cli bash cmd
---

***ALL THIS INTRO NEEDS REWRITING***

I spend a decent amount of time at the commandline, for various reasons.
At work, it's usually at Windows ``cmd``; at home, it's either ``cmd``
or ``bash`` on Debian. In both places, a major activity is working with Python;
on the Linux box, I'm also doing a wide variety of other stuff (details?).

Regardless, as is pretty common, I have a bunch of things that I want
to not have to type out in full every time. Shorter ones of these I handle by
defining aliases for in Linux (e.g., helper for activating virtual environments),
but some things work better with symlinks than with aliases (linking
to various user-installed Pythons being one major example);

I did a bit of research in the course of writing this post... 
while ``cmd`` does now support symlinks, they don't play nicely with
running Pythons (appears to be a path/working dir problem --example--),
and defining persistent aliases requires some
[registry fiddling](https://stackoverflow.com/questions/20530996/aliases-in-windows-command-prompt)
that, all things considered, I'd rather not mess with it... and, it
looks like it has
similar path/working dir problems to the symlinks (--example--).

So, for now, I'll be sticking with my bin-folder-full-of-scripts approach on ``cmd``.

Linux
-----

**Aliases**

[``bash`` aliases](https://ss64.com/bash/alias.html) let you define static abbreviations
for shell commands (both builtins and executables). I've most often seen them used
to avoid needing to supply flags/arguments that are used on ~every invocation:

```
$ du -s
16720220        .
$ alias du="du -h"
$ du -s
16G     .
$ alias pyc="python3 -c"
$ pyc 'print("Hello!")'
Hello!
```

I actually hadn't used any of these before researching them for this post;
but, now that I've looked closely at them, I've added a few to
a new ``~/.bash_aliases``:

```
# ls, full listing & show dotfiles
alias lla="ls -la"

# ls, minimal display
alias l1="ls -1"

# Always human-readable du
alias du="du -h"

# Always human-readable df
alias df="df -h"

# Quick access to apt update and upgrade
alias aptupd="sudo apt-get update"
alias aptupg="sudo apt-get upgrade"
```

Note that it *does* work fine to 'redefine' an existing command to include default
options/flags, as was done above for ``du`` and ``df``---``alias`` doesn't
recurse its substitutions. In situations like this, the original command
can be accessed by enclosing it in quotes:

```
$ du -s
16G     .
$ "du" -s
16695720        .
```

However, as I did for ``lla`` and ``l1``,
in most cases I expect I will generally define my aliases as new names,
so that I can get at the original commands without quoting them, if I want to. 

Note also that aliases **cannot** contain explicit positional arguments.
Any arguments passed to the alias get transferred directly to the tail
of the expanded command.


**Functions**

``bash`` functions are a considerably more flexible means for defining
custom commands. 

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

