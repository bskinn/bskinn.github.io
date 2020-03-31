---
layout: post
title: 'My How and Why: Aliases, Functions, Symlinks and Shortcuts'
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

``bash`` (Debian Linux)
-----------------------

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
but, now that I've looked closely, I've added a few to
a new ``~/.bash_aliases`` (they could also be added directly into
``~/.bashrc`` or ``~/.profile``):

```
# ls, full listing & show dotfiles
alias lla="ls -la"

# ls, minimal display
alias l1="ls -1"

# Always human-readable du
alias du="du -h"

# Always human-readable df
alias df="df -h"

# Grepped history and ps
alias hg="history | grep "
alias psag="ps aux | grep "

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
in most cases I expect I'll define aliases as new names,
so that I can get at the original commands without quoting them.

Note also that aliases **cannot** contain explicit positional arguments.
Any arguments passed to the alias alwyays get transferred directly to the tail
of the expanded command.


**Functions**

[``bash`` functions](https://ss64.com/bash/function.html)
are a considerably more flexible means for defining
custom commands.  They can enclose multi-line commands, and can use
arguments in arbitrary ways. The syntax is a bit unusual, as can be
seen in this function for activating a python virtual environment
in a sub-directory of the current working directory:

```
vact () {
  source "env$1/bin/activate"
}
```

The parentheses will *always* be empty; they're purely
a syntactic marker to tell ``bash`` that you're defining a function.
Note that even though this function is only a single command,
it could not be implemented as an alias, since the argument
indicating which environment to activate
has to be substituted into the middle of the command.
(Most of the time, I use this function without an argument, which
will activate the environment in ``env``; however, if I define
multiple environments in a common location, this lets me activate
a specific environment: ``$ vact foo`` would activate
an environment residing in ``envfoo``.)

Note that, unlike with aliases, arguments passed to a function call
are **NOT** automatically passed through to any particular command
inside the function body---you have to specifically indicate
where they should be used:

```
$ pygood () { python3 $*; }
$ pybad () { python3; }
$ pygood -c "print('Hi')"
Hi
$ pybad -c "print('Hi')"
Python 3.7.3 (default, Apr  3 2019, 05:39:12)
[GCC 8.3.0] on linux
Type "help", "copyright", "credits" or "license" for more information.
>>>
```

As with aliases, functions can put directly into
``~/.profile`` or ``~/.bashrc``,
or kept segregated in ``~/.bash_aliases``.


**Executable Symlinks**

Aliases and functions are great for abbreviating direct invocations
from the command line, but they have some disadvantages
as compared to symlinks ([created with ``ln``](https://ss64.com/bash/ln.html)).
One significant disadvantage is the fact that aliases and functions
are defined per-user, whereas symlinks exist on the filesystem
and (given suitable permissions) can thus be used by anyone
logged in to the machine. Also, since symlinks provide an
effectively invisible pass-through to the target executable,
they can be used in complex invocations in ways that
aliases and functions might not support.
Initially, I thought that piped command sequences were one
example of this, but it turns out that both aliases and functions
handle pipes and input redirects just fine:

```
$ alias py="python3"
$ py3 () { python3 $*; }
$ echo "print('Hi')" | python3
Hi
$ echo "print('Hi')" | py
Hi
$ echo "print('Hi')" | py3
Hi
$ echo "print('Hi')" > in
$ py < in
Hi
$ py3 < in
Hi
```

Depending on your needs, it may make sense to put some symlinks in
a common location that won't conflict with the system
package manager (e.g., ``/usr/custom/bin`` is what I would use,
though there may be a convention here that I don't know about).
All of the symlinks I use with regularity I just put in a 
per-user ``~/bin`` directory, however.


[**LINK TO /usr/local/bin INFO**](https://unix.stackexchange.com/q/4186/95427)

[more context on /bin &c.](https://askubuntu.com/q/406250/364673)


**REWRITE WHOLE PARAGRAPH** That said, since all of my Linux sysadmin experience to date
has been on systems where I'm the only user,
I've pretty much always created my symlinks
in a per-user fashion, placing them in a ``~/bin`` directory,
since I don't need to make them accessible to others.
I've done this even though I'm using multiple logins
(to keep various responsibilities separated), because most of the
commands are specific to each of the different logins I use
to keep concerns segregated. However, for my custom Python
builds, as described below, I'm considering moving the
installation locations to a centralized location
such as ``/usr/custom``, and switching to building with
the superuser, so that they're readily accessible
to all logins. I would still curate the symlinks per-user, though,
in ``~/bin``.

In order to make the symlinks available for execution,
I just add a command in ``~/.bashrc`` to prepend ``~/bin``
to ``PATH``:

```
export PATH="/home/usr/bin:$PATH"
```

On all subsequent logins with ``user``, these symlinks will be available
for direct execution in the shell.

My main current use for these symlinks is to allow easy access to multiple
user-compiled versions of Python. While there are tools
out there that provide for automatic management of Python
versions, I would rather have more direct control over
what's installed and how it's compiled. For per-user installs,
I install my custom
Pythons into ``~/python/x.y.z/``, and then
create symlinks in ``~/bin``:

```
$ cd /home/user/bin
$ ln -s /home/user/python/3.8.0/bin/python3.8 python3.8
```

This setup works really well with ``tox`` **LINK**, such that the Python
executables can be set just as:

```
ADD STUFF FROM TOX.INI
```

The packages associated with each Python version can be changed with:

```
$ python3.8 -m pip ...
```

And, new virtual environments can be created with a given Python version
(after a ``python3.x -m pip install virtualenv``, since I typically
use that rather than ``venv`` from the standard library) via:

```
$ python3.8 -m virtualenv env --prompt="(envname) "
```


Windows
-------

All user bin-folder batch files. Add to PATH.

Despite doskey aliases and the new symlink capability in Windows 10,
this approach is the only practical one I've found for Pythons
(as of the last time I tried them, doskey/symlinks don't handle 
path-setting correctly, so even ``python3.8 -m pip ...`` doesn't
execute correctly. Also, doskey syntax is clunky, and
elevated priviges are required to create symlinks (*MAYBE REMOVE SENTENCE*).

{description of PATH setting and where ``bin`` gets created and
syntax of e.g. ``vact`` vs ``python3.x``}


Doskey aliases -- sort of a partial cross of bash aliases and functions.

Can do doskey aliases, but the syntax is clunky and
[it can handle at most nine arguments](https://ss64.com/nt/doskey.html). **CAN IT HANDLE SOMETHING LIKE $*???**
Also, they  



But, no, they're one-liners? No, can use ``$T`` to run multiple commands.


