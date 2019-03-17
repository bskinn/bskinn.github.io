---
layout: post
title: 'My How and Why: pyproject.toml and `src` Code Layout'
tags: python how-why packaging testing
---

At various points over the last year or so, I'd heard or seen various things
about the new `pyproject.toml` file and how it interacts with Python packaging---in
particular, I'd listened to the
[Python Bytes](https://pythonbytes.fm/episodes/show/100/the-big-100-with-special-guests)
{% include tw.html user="pythonbytes" %}
and [Test and Code](https://testandcode.com/52)
{% include tw.html user="testandcode" %} episodes that covered it.
I'd also paid passing attention to the various debates about the merits of
the `src` and non-`src` approaches to organizing code within a package
under development. The most compelling argument I'd seen for `src` was made by
[Hynek Schlawack](https://hynek.me/articles/testing-packaging/)
{% include tw.html user="hynek" %}:

<img src="https://i.imgflip.com/2u49r0.jpg"
title="You /dev/null-ed my father. Prepare to die."
alt="Inigo has opinions about testing."
width="300px"/>

I'd tried moving my code to `src` a couple of times, but
it promptly broke things every time and I never cared enough to bother with figuring it out.
When I recently came across Bernat Gabor's
[three-part series](https://www.bernat.tech/pep-517-and-python-packaging/)
on the state of Python packaging (covered not long ago on
[Python Bytes](https://pythonbytes.fm/episodes/show/117/is-this-the-end-of-python-virtual-environments)),
though, it got me curious enough to seriously attempt a conversion both to
`pyproject.toml` and a `src` project layout. I needed to tweak one of my
Python packages and put out a new patch version anyways (`stdio-mgr`
{% include pypi.html project="stdio-mgr" %}
{% include gh.html user="bskinn" repo="stdio-mgr" %}),
so it seemed like a natural time
to put in the work to finally get it all to work. The main
resources I used in this process were Bernat's series, the above
article by Hynek, and [Brett Cannon's article](https://snarky.ca/clarifying-pep-518/)
on PEP 517/518.

In the end, as far as I can tell my problems boiled down to two things:

 1. I hadn't paid close enough attention to the instructions in Hynek's article
    for the `src` layout conversion, and had failed to set `package_dir` in addition
    to `packages` in the `setuptools.setup()` call.
 2. The exact chicken-and-egg problem that motivated PEP 517/518, where
    the dependencies needed to run `setup.py` are defined dynamically
    within `setup.py`.

Ultimately, what makes me *really* glad I looked into this was realizing that
I had been shipping broken sdists to PyPI. (Time for some fun with `pip install --no-binary`,
\*sigh\*...) Turns out it was a highly useful thing that
tox builds and installs the package to test from *sdist*, as opposed to just installing from
a wheel, because it made it very clear to me that I had been doing The Wrong Thing&#153;.

An unanticipated knock-on benefit from making both of these changes has been that I can now
just include `-e .` explicitly in my `requirements-dev.txt` to install the project in
developer mode as part of my dev virtualenv. Thus, I only need to invoke one command,
`pip install -r requirements-dev.txt`, to set up the virtualenv, instead of having to
then follow with a `pip install -e .` (I'm sticking with the `requirements.txt` paradigm
mainly because I don't know how otherwise to specify custom dependencies for Read the Docs.)

Below is some commentary on the various files relevant to the changes I made.
The files below are in the state of
[this commit](https://github.com/bskinn/stdio-mgr/tree/8b09adb2ae98d3753ce6ee00015a10b520d48ec2).

-----


**`pyproject.toml`**

Per the [PEP 517](https://www.python.org/dev/peps/pep-0517/)
and [PEP 518](https://www.python.org/dev/peps/pep-0518/) specs, the following two lines
in the `[build-system]` option block are the primary reason for introduction
of `pyproject.toml`:

```
[build-system]
requires = ["wheel", "setuptools", "attrs>=17.1"]
build-backend = "setuptools.build_meta"
```

I'm still just using the `setuptools` build workflow, so `wheel` and
`setuptools` naturally are build requirements.  I also need `attrs` so
that [`from stdio_mgr import __version__`](https://github.com/bskinn/stdio-mgr/blob/8b09adb2ae98d3753ce6ee00015a10b520d48ec2/setup.py#L6)
doesn't break when `setup.py` is executed. (To note, this is approach #6 for single-sourcing
a package version from the
[Python Packaging Guide](https://packaging.python.org/guides/single-sourcing-package-version/)...
I'm not really a fan of the path manipulation hijinks required to make the import work
in the `src` configuration, so I'm strongly considering switching to #3 or #4 at some point.)

If I weren't enabling `isolated_build` in `tox.ini` (see below), I wouldn't
*need* to specify `build-backend` here, as PEP 517
[specifies](https://www.python.org/dev/peps/pep-0517/#source-trees) to fall back
to the `setuptools`/`setup.py` backend configuration if `build-backend` is
missing. However, tox doesn't like
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

***REVISE*** To have the tox build of the package be isolated from the filesystem, added:

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
