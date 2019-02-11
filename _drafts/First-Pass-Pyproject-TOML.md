---
layout: post
title: 'My How and Why: First-Pass pyproject.toml &c.'
tags: python how-why packaging testing
---

Seen various things about `pyproject.toml`; heard more on
[Python Bytes](https://pythonbytes.fm/episodes/show/100/the-big-100-with-special-guests)
Still need to listen to [Test and Code](https://testandcode.com/52).

[Article by Brett Cannon](https://snarky.ca/clarifying-pep-518/)

What really set me off was Bernat Gabor's
[three-part series](https://www.bernat.tech/pep-517-and-python-packaging/)
on the topic.

Needed to tweak one of my packages `stdio-mgr`
{% include pypi.html project="stdio-mgr" %}, so seemed like a natural time
to put in the work to finally figure all of this out.

Arguments for putting code in `src`.  Periodically attempted it; however,
this would always break things because I like to use `from pkg import __version__`
in my setup.py, and ...?

from pkg import __version__ in setup.py breaks *install* of sdists in a clean
environment, b/c it requires import of the package and thus all import-time
dependencies MUST be present at sdist *build*, but setup.py (1) can't run
to find out what install_requires *is*, before building... (2) technically
anyways they're *build*-time dependencies, not install-time.

Logic of [@hynek](https://hynek.me/articles/testing-packaging/) for `src`, ensuring that actually testing the built package, instead
of the code on the filesystem, makes great sense to me, so wanted to do this.
However, `tox` installs the package from sdist, and so this above was a blocking problem.

So, I wanted to fix this, to gain the confidence of knowing tox was testing
*built* packages, to actually have my sdists be *installable* into a fresh
environment. One unanticipated further benefit has been that I can now
include the `-e .` explicitly in my `requirements-dev.txt` (not `-travis.txt`,
unfortunately, since I'm
still trying to support old Python versions, which misbehave)
for setting up a new development environment, and thus only need the one
`pip install -r requirements-dev.txt` command to get started.

Below is some commentary on the various files relevant to this
configurationFiles below are in the state of
[this commit](https://github.com/bskinn/stdio-mgr/tree/8b09adb2ae98d3753ce6ee00015a10b520d48ec2).

-----


**`pyproject.toml`**

Per the PEP 517 and PEP 518 specs, the following two lines
in the `[build-system]` option block are the primary reason for introduction
of `pyproject.toml`:

```
[build-system]
requires = ["wheel", "setuptools", "attrs>=17.1"]
build-backend = "setuptools.build_meta"
```

I'm still just using the `setuptools` build workflow, so `wheel` and
`setuptools` naturally are build requirements.  I also need `attrs` so
that `from stdio_mgr import __version__` doesn't break when
`setup.py` is executed.

If I weren't enabling `isolated_build` in `tox.ini` (see below), I wouldn't
need to specify `build-backend` here, as its the default backend configuration
(ADD LINK?) for a `setuptools`-driven build system. However, tox doesn't like
it if `build-backend` isn't explicitly specified when `isolated_build`
is enabled:

```
$ tox -e sdist_install
ERROR: missing build-backend key at build-system section inside /.../pyproject.toml
```

***black config*** (fine; still have to `black .`; use ''';
recursive search pulls everything, then culls anything matching `exclude`
regex, then only processes things that match `include` regex;
the thing being matched is the *full relative path* (from ...where?),
starting with `/`)

***NOT tox config*** (coarsely implemented, and pytest doesn't find it)

***NOT pytest config*** (not supported at all yet)

-----


**`MANIFEST.in`**

Must have `pyproject.toml` in an `include` line, so that it's packaged
into the sdist and thus available for a subsequent clean build.

```
include LICENSE.txt README.rst CHANGELOG.md pyproject.toml
```

I don't generally package my libraries such that they're testable from an sdist
(if you want to hack on it, clone the
{% include gh.html user="bskinn" repo="stdio-mgr" %}!), so it's probably
superfluous to include those extra files, but... whatever.


-----

**`requirements-xyz.txt`**

As noted above, since my build requirements are now successfully specified
in `pyproject.toml`, and `pyproject.toml` is bundled with the sdist by
being included in `MANIFEST.in`, I can include `-e .` in my
`requirements-xyz.txt`s and (barring weird compatibility issues with old
versions of Python/`pip`/`setuptools`) a
`pip install -r requirements-dev.txt` just *works*:

```
(fresh-env) $ pip install -r requirements-dev.txt
Obtaining file:///... (from -r requirements-dev.txt (line 12))
  Installing build dependencies ... done
  Getting requirements to build wheel ... done
    Preparing wheel metadata ... done
Collecting attrs>=17 (from -r requirements-dev.txt (line 1))
  Using cached https://files.pythonhosted.org/packages/3a/e1/5f9023cc983f1a628a8c2fd051ad19e76ff7b142a0faf329336f9a62a514/attrs-18.2.0-py2.py3-none-any.whl
Collecting black (from -r requirements-dev.txt (line 2))
  Using cached https://files.pythonhosted.org/packages/2a/34/9938749f260a861cdd8427d63899e08f9a2a041159a26c2615b02828c973/black-18.9b0-py36-none-any.whl
... {many more packages} ...
Installing collected packages: {many packages}
  Running setup.py develop for stdio-mgr
Successfully installed {packages} stdio-mgr {more packages}
```


OTOH, if I delete `pyproject.toml` and try to install, it does *NOT* work:

```
(fresh-env) $ pip install -r requirements-dev.txt
Obtaining file:///... (from -r requirements-dev.txt (line 12))
    Complete output from command python setup.py egg_info:
    Traceback (most recent call last):
      File "<string>", line 1, in <module>
      File "/.../setup.py", line 6, in <module>
        from stdio_mgr import __version__
      File "/.../src/stdio_mgr/__init__.py", line 34, in <module>
        from .stdio_mgr import stdio_mgr
      File "/.../src/stdio_mgr/stdio_mgr.py", line 32, in <module>
        import attr
    ModuleNotFoundError: No module named 'attr'

    ----------------------------------------
Command "python setup.py egg_info" failed with error code 1 in /.../
```


-----

**`tox.ini`**

To have the tox build of the package be isolated from the filesystem, added:

```
[tox]
isolated_build=True
```

Also, I realized that all of my test environments specifically included an
`attrs` version:

```
[tox]
envlist=
    py3{3,4,5,6,7}-attrs_{17_4,18_2}
    py36-attrs_{17_1,17_2,17_3,18_1,latest}
    py33-attrs_17_3
    py37-attrs_latest

[testenv]
deps=
    attrs_17_1:     attrs==17.1
    attrs_17_2:     attrs==17.2
    attrs_17_3:     attrs==17.3
    attrs_17_4:     attrs==17.4
    attrs_18_1:     attrs==18.1
    attrs_18_2:     attrs==18.2
    attrs_latest:   attrs

    attrs_17_1:     pytest==3.2.5
    attrs_17_{2,3}: pytest==3.4.2
    attrs_17_4:     pytest
    attrs_18_{1,2}: pytest
    attrs_latest:   pytest
```

This has the potential to mask any problems arising
from an incorrectly-specified build environment, because tox
installs everything in the `deps` ***BEFORE*** it installs the built package
to be tested.

Thus, for example, if I delete `pyproject.toml` and remove `isolated_build`
from `tox.ini`, the following tox invocation completes successfully:

```
$ tox -qr -e py36-attrs_latest
========================================================================== test session starts ===========================================================================
platform linux -- Python 3.6.6, pytest-4.2.0, py-1.7.0, pluggy-0.8.1
cachedir: .tox/py36-attrs_latest/.pytest_cache
rootdir: /..., inifile: tox.ini
collected 5 items

README.rst .                                                                                                                                                       [ 20%]
tests/test_stdiomgr_base.py ....                                                                                                                                   [100%]

======================================================================== 5 passed in 0.06 seconds ========================================================================
________________________________________________________________________________ summary _________________________________________________________________________________
  py36-attrs_latest: commands succeeded
  congratulations :)

```

BUT, say I define a new tox environment with ***no `deps`***,
for the sole purpose of ensuring that the built package installs into
and imports from within a clean enviroment without error:

```
[testenv:sdist_install]
commands=
    python -c "import stdio_mgr"
```

With no `pyproject.toml` and `isolated_build=False`, this tox environment
**FAILS**:

```
$ tox -qr -e sdist_install
ERROR: invocation failed (exit code 1), logfile: /.../.tox/sdist_install/log/sdist_install-1.log
ERROR: actionid: sdist_install
msg: installpkg
cmdargs: '/.../.tox/sdist_install/bin/python -m pip install --exists-action w /.../.tox/.tmp/package/1/stdio-mgr-1.0.1.zip'

Processing ./.tox/.tmp/package/1/stdio-mgr-1.0.1.zip
    Complete output from command python setup.py egg_info:
    Traceback (most recent call last):
      File "<string>", line 1, in <module>
      File "/tmp/pip-req-build-k0deu53y/setup.py", line 6, in <module>
        from stdio_mgr import __version__
      File "/tmp/pip-req-build-k0deu53y/src/stdio_mgr/__init__.py", line 34, in <module>
        from .stdio_mgr import stdio_mgr
      File "/tmp/pip-req-build-k0deu53y/src/stdio_mgr/stdio_mgr.py", line 32, in <module>
        import attr
    ModuleNotFoundError: No module named 'attr'

    ----------------------------------------
Command "python setup.py egg_info" failed with error code 1 in /tmp/pip-req-build-k0deu53y/

________________________________________________________________________________ summary _________________________________________________________________________________
ERROR:   sdist_install: InvocationError for command /.../.tox/sdist_install/bin/python -m pip install --exists-action w /.../.tox/.tmp/package/1/stdio-mgr-1.0.1.zip (see /.../.tox/sdist_install/log/sdist_install-1.log) (exited with code 1)
```

With `pyproject.toml` restored and `isolated_build=True`, though,
it works fine:

```
$ tox -qr -e sdist_install
________________________________________________________________________________ summary _________________________________________________________________________________
  sdist_install: commands succeeded
  congratulations :)

```

FWIW, I also have just included my pytest configuration in `tox.ini`, rather
than creating a new `pytest.ini` or `setup.cfg`, since for this project
my pytest config is pretty minimal:

```
[pytest]
addopts = -p no:warnings --doctest-glob="README.rst"
```

-----

**`setup.py`**

[Aside from changes relating to shifting source to `src`, no revisions here.]

Major things to note are the
[path hijinks](https://github.com/bskinn/stdio-mgr/blob/fe9555897fdcd7a408abc33a412c47333b08ac68/setup.py#L5-L8)
to enable `__version__` import,
since the package hasn't been built/installed yet when `setup.py` is imported/run; and, the
[package searching machinery](https://github.com/bskinn/stdio-mgr/blob/fe9555897fdcd7a408abc33a412c47333b08ac68/setup.py#L19-L20),
switched to automatic w/`find_packages`.

Could have moved a bunch of setup stuff to `setup.cfg`, but I'd rather not
create yet another new file for only a single purpose. If `setuptools` gets
modified to where `setup.py` info could be sited in `pyproject.toml` instead
of in `setup.cfg`, I would almost certainly do that.
