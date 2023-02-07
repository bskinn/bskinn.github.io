---
layout: post
title: 'Required Packages for a Complete CPython Build on Debian "bullseye"'
tags: build cpython debian linux python
---

I've been building my own versions of CPython on Linux for a long time, more or
less ever since I released [`sphobjinv`][sphobjinv repo README] for the first
time. I wanted to be sure that it did actually work correctly with the versions
I declared it to, so I set up [`tox`][tox repo README] for a matrix of Python
versions. In order for this test matrix to actually *work*, I had to build my
own Pythons.

In the course of getting this figured out, I had to solve the problem of
Debian's then-current version of OpenSSL not being compatible with the Pythons I
was building. This led me down the path of building OpenSSL locally, wiring that
into both `./configure` (for build-time) *and* `$LD_LIBRARY_PATH` (for
run-time). More on that below.

I *also* ran into the challenge of trying to get all of the pieces of CPython to
build successfully. Anyone who's tried to build their own CPython has likely run
into some variation of the following, emitted at the end of the `make` step:

```
The necessary bits to build these optional modules were not found:
_bz2              	_curses           	_curses_panel
_dbm              	_gdbm             	_lzma
_tkinter          	_uuid             	readline
zlib
To find the necessary bits, look in setup.py in detect_modules() for the module's name.


The following modules found by detect_modules() in setup.py have not
been built, they are *disabled* by configure:
_sqlite3


Failed to build these modules:
_ctypes
```

I usually didn't care about *all* of these packages, but it always bugged me
that they wouldn't install.

At one point I found an `apt-get` incantation on Stack Overflow or wherever that
installed (at least) everything I needed in order to build everything I cared
about, and I just left it at that. Did that install pull in more than I needed?
Probably... but, eh. Whatever.

---

Fast-forward to a couple of weeks ago, when I was setting up my dev environment
in WSL Debian on a new Win 11 laptop. Cue the
`necessary bits ... were not found` refrain.

"All right," I said. "Y'know, I've always wondered what the minimal set of
packages is to build all these modules. Let's find out."

So, after downloading the source tarball for Python 3.11.1, I methodically went
through each of the optional modules and figured out that minimal package set. I
basically brute-forced each module:

1. Search around and find candidate Debian packages to match the failed module.
  - Most of these looked a lot like `lib{module}-dev`.
2. Run `sudo apt-get install {package candidate}` on a single candidate.
3. Run `./configure && make` and check the list of unbuilt modules for `{module}`.
4. If `{module}` builds successfully, hurray! If not, repeat (2) and (3) -- and, if needed, (1) -- until it does.
5. If it took more than one `{package candidate}` to get a successful build, backtrack through each installed candidate, running `sudo apt-get remove {package candidate}` to uninstall it and then repeating (3) to see if that uninstall re-broke the build of `{module}`.
6. ...



[sphobjinv repo README]: https://github.com/bskinn/sphobjinv#readme
[tox repo README]: https://github.com/tox-dev/tox#readme
