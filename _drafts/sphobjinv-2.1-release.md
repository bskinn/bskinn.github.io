---
layout: post
title: 'New(ish) Release: sphobjinv v2.1'
tags: python sphobjinv release
---

`sphobjinv` v2.1 is out!

(Well, it's actually been out for a few months, but I'm only just now getting around to writing this post about it.)

Per SemVer, since this release bumps the minor version number, no backward-incompatible changes to the API should have occurred. If you find any, please [file a bug report](https://github.com/bskinn/sphobjinv/issues/new/choose). No guarantees about the CLI, however.


#### Python Version Support

First, v2.1 officially drops Python 3.5 support, which went [end-of-life in September 2020](https://www.python.org/downloads/release/python-3510/). Given that major ecosystem tools such as `pip` have [done the same](https://pip.pypa.io/en/stable/news/#v21-0), I'm pretty comfortable with the decision.

(Plus, moving to 3.6+ allowed me to roll out f-strings throughout the codebase, which was NICE.)

In parallel, v2.1 adds Python 3.10 support, in anticipation of the [4 Oct 2021 release date for 3.10.0 final](https://www.python.org/dev/peps/pep-0619/#schedule).


#### New Features

- API
  - Function/method arguments referring to files on disk now can be type `str` or `pathlib.Path` (previously they had to be `str`). See [#176](https://github.com/bskinn/sphobjinv/pull/176).

- CLI
  - Support added for read/write from/to `stdin`/`stdout` (see [#131](https://github.com/bskinn/sphobjinv/issues/131) and [#137](https://github.com/bskinn/sphobjinv/issues/137))
    - Plaintext and JSON inventory contents can be read from `stdin` for both `convert` and `suggest` modes by passing a hyphen to [`infile`](https://sphobjinv.readthedocs.io/en/v2.1/cli/convert.html#cmdoption-sphobjinv-convert-arg-infile).
    - Plaintext and JSON inventory contents can be emitted to `stdout` for the `convert` mode by passing a hyphen to [`outfile`](https://sphobjinv.readthedocs.io/en/v2.1/cli/convert.html#cmdoption-sphobjinv-convert-arg-outfile).
  - When generating JSON from a remote inventory using the CLI (via `sphobjinv convert json -u`), the URL of the remote `objects.inv` is included at `{root}.metadata.url` (see [#138](https://github.com/bskinn/sphobjinv/issues/138)).

#### Bug/Behavior Fixes

- Equality comparisons are now implemented for `Inventory` and `DataObjStr`/`DataObjBytes` instances.
  - **RESUME**
- Better documentation of valid items in object lines
  - #181, fixed bug where inventory objects with spaces in `{name}` would be ignored on import
  - 
- Better (and/or non-broken!) comparisons

- De-anonymize the `User-Agent` header for URL-based CLI and API invocations (see [#162](https://github.com/bskinn/sphobjinv/issues/162))


#### Administrative 

- A [`[speedup]` extra](https://sphobjinv.readthedocs.io/en/v2.1/levenshtein.html#installation) was added, for more convenient co-installation of the optional `python-Levenshtein` dependency on POSIX/MacOS (see [#175](https://github.com/bskinn/sphobjinv/pull/175)).

