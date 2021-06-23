---
layout: post
title: 'New(ish) Release: sphobjinv v2.1'
tags: python sphobjinv release
---

*(intro!)*

`sphobjinv` v2.1 is out!

(Well, 

#### Python Version Support

First of all, this v2.1 release officially drops Python 3.5 support, which went [end-of-life in September 2020](https://www.python.org/downloads/release/python-3510/). Given that major ecosystem tools such as `pip` have [done the same](https://pip.pypa.io/en/stable/news/#v21-0), I'm pretty comfortable with the decision.

(Plus, it means I got to roll out f-strings throughout the codebase, which is SO NICE.)

In parallel, v2.1 also adds Python 3.10 support, in anticipation of the [4 Oct 2021 release date for 3.10.0 final](https://www.python.org/dev/peps/pep-0619/#schedule).


#### New Features

- *(hyphen to allow input/output at `stdin`/`stdout` for plaintext and JSON inventory contents)*
- *(API file operations now accept both `str` and `pathlib.Path` arguments)*

- When generating a JSON representation of an inventory from a remote location using the CLI (a `sphobjinv convert json -u` invocation), the URL of the located `objects.inv` is stored at `{root}.metadata.url`

#### Bug/Behavior Fixes

- Better documentation of valid items in object lines
  - #181, fixed bug where inventory objects with spaces in `{name}` would be ignored on import
  - 
- Better (and/or non-broken!) comparisons

- De-anonymize the `User-Agent` header for URL-based CLI and API invocations (#162)


#### Administrative 

- `[speedup]` extra added, for more convenient install of `python-Levenshtein` on POSIX/MacOS



