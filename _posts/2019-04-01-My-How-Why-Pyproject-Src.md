---
layout: post
title: 'My How and Why: pyproject.toml &amp; the &#39;src&#39; Project Structure'
tags: python how-why packaging testing
---

**UPDATE 2 (16 May 2019):** With the release of pip v19.1.1
{% include pypi.html project="pip" version="19.1.1" %}, editable installs are
again allowed in the presence of `pyproject.toml`. Both the `pip install -e .` and
`python setup.py develop` approaches should now work.
[Discussion is ongoing](https://discuss.python.org/t/specification-of-editable-installation/1564)
on a more robust, `setuptools`-independent specification of editable installs.

**UPDATE (26 Apr 2019):** Just like with many others in the Python ecosystem, I was
caught by the switch to rigorous observance of PEP517 in `pip` 19.1,
which prohibits editable installs in projects declaring PEP517 compliance via
the presence of `pyproject.toml`. However, I discovered that switching from a
`pip`-mediated editable install to a `setuptools`-mediated 'develop' install
(via `python setup.py develop`) seems to have bypassed the problem. Edits/updates have
been made below where relevant.

-----

At various points over the last year or so, I'd heard or seen various things
about the new `pyproject.toml` file and how it interacts with Python packaging---in
particular, I'd listened to the
[Python Bytes](https://pythonbytes.fm/episodes/show/100/the-big-100-with-special-guests)
{% include tw.html user="pythonbytes" %}
and [Test and Code](https://testandcode.com/52)
{% include tw.html user="testandcode" %} episodes that covered it.
I'd also paid passing attention to the various debates about the merits of
the `src` and non-`src` approaches to structuring projects.
The most compelling argument I'd seen for `src` was made by
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
to put in the work to get these in place. The main
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
mainly because I don't know how otherwise to specify custom dependencies for
Read the Docs builds.) **UPDATE:** With the `pip` 19.1 behavior change, I have **removed**
`-e .` from my requirements files, and instead run `python setup.py develop` to install
the package working tree into the relevant environment after calling `pip install`.
For my local working directory, I just run the command manually; for CI, I insert it as a
[separate command](https://github.com/bskinn/stdio-mgr/blob/dff9f326528aac67d7ca0dc0a86ce3dffa3e0d39/.travis.yml#L4)
in the pre-test phase of the build (`install` for Travis).

Below is some commentary on the various files relevant to the changes I made.
The files below are in the state of
[this commit](https://github.com/bskinn/stdio-mgr/tree/8b09adb2ae98d3753ce6ee00015a10b520d48ec2),
except where revised due to the `pip` 19.1 strict enforcement of PEP517.

-----


[**`pyproject.toml`**](https://github.com/bskinn/stdio-mgr/blob/8b09adb2ae98d3753ce6ee00015a10b520d48ec2/pyproject.toml)

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
`setuptools` naturally are build requirements.  I also needed `attrs` at the
time I attempted this conversion so
that [`from stdio_mgr import __version__`](https://github.com/bskinn/stdio-mgr/blob/8b09adb2ae98d3753ce6ee00015a10b520d48ec2/setup.py#L6)
didn't break when `setup.py` is executed. (This import-via-the-package approach
to single-sourcing the version number is #6 in the list put out in the
[Python Packaging Guide](https://packaging.python.org/guides/single-sourcing-package-version/)...
I'm not really a fan of the path manipulation hijinks required to make this method work
in the `src` configuration, though (see `setup.py`, below), so I've actually [already
switched to option #3](https://github.com/bskinn/stdio-mgr/blob/1f57ca198fcb45e5df891be3910279cf8c89fa65/setup.py#L5-L6)
in the `dev` branch of the project.)

If I weren't enabling `isolated_build` in `tox.ini` (see below), I wouldn't
*have* to specify `build-backend` here, as PEP 517
[specifies](https://www.python.org/dev/peps/pep-0517/#source-trees) to fall back
to the `setuptools`/`setup.py` backend configuration if `build-backend` is
missing. However, tox doesn't like
it if `build-backend` isn't explicitly specified when `isolated_build`
is enabled:

```
$ tox -e sdist_install
ERROR: missing build-backend key at build-system section inside /.../pyproject.toml
```

I found it distinctly handy to be able to
[include my `black` configuration](https://black.readthedocs.io/en/stable/pyproject_toml.html)
in here as well; specifying line length and include/exclude patterns:

```
[tool.black]
line-length = 79
include = '''
(
    ^/tests/
  | ^/src/stdio_mgr/
  | ^/setup[.]py
  | ^/conftest[.]py
)
'''
exclude = '''
(
    __pycache__
)
'''
```

`black` uses a regex filter, so that `__pycache__` in `exclude` matches
*any* cache folder throughout the project. Note also that the names of items
as generated from `black`'s search algoritm always
have a leading backslash, which has to be accounted for when constructing
regexes anchored at the project root. (As an aside, I *really* like this
formatting for multiline regexes with alternative patterns
(`(...|...|...)`), and will be stealing it wholesale.)

I briefly considered also moving my `tox` config into `pyproject.toml`,
but there's only a string-key
[legacy method](https://tox.readthedocs.io/en/latest/example/basic.html#pyproject-toml-tox-legacy-ini)
implemented at the moment, and `pytest` isn't able to find its config info
within that `legacy_tox_ini` string.

-----


[**`MANIFEST.in`**](https://github.com/bskinn/stdio-mgr/blob/8b09adb2ae98d3753ce6ee00015a10b520d48ec2/MANIFEST.in)

It looks like recent versions of `setuptools` automatically add `pyproject.toml`
to the sdist build manifest, along with LICENSE, README, and CHANGELOG-like files.
But, for my peace of mind I like to include them explicitly:

```
include LICENSE.txt README.rst CHANGELOG.md pyproject.toml
```

-----

[**`requirements-xyz.txt`**](https://github.com/bskinn/stdio-mgr/blob/8b09adb2ae98d3753ce6ee00015a10b520d48ec2/requirements-dev.txt)

As noted above, since my build requirements are now successfully specified
in `pyproject.toml`, and `pyproject.toml` is bundled with the sdist by
being included in `MANIFEST.in` (or by default), I <strike>can</strike> used to be able to include `-e .` in my
`requirements-xyz.txt`s and (barring some weird compatibility issues with old
versions of Python/`pip`/`setuptools` I've encountered on CI) a
`pip install -r requirements-dev.txt` just <strike><em>works</em></strike> *worked*:

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


OTOH, if I delete `pyproject.toml` and try to install, it <strike>does</strike> did *NOT* work:

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

**UPDATE:** As noted above, the strict enforcement of PEP517 in `pip` 19.1 disallows editable installs:

```
>pip install -e .
Obtaining file:///.../stdiomgr
ERROR: Error installing 'file:///.../stdiomgr': editable mode is not supported for pyproject.toml
-style projects. This project is being processed as pyproject.toml-style because it has a pyproject.
toml file with a "build-backend" key in the "build_system" value. See PEP 517 for the relevant speci
fication.
```

In some (many? most?) cases, a separate invocation of `python setup.py develop` will work as
an alternative to the `pip`-mediated `-e .` editable install:

```
>python setup.py develop
running develop
running egg_info
writing src\stdio_mgr.egg-info\PKG-INFO
writing dependency_links to src\stdio_mgr.egg-info\dependency_links.txt
writing requirements to src\stdio_mgr.egg-info\requires.txt
writing top-level names to src\stdio_mgr.egg-info\top_level.txt
reading manifest file 'src\stdio_mgr.egg-info\SOURCES.txt'
reading manifest template 'MANIFEST.in'
writing manifest file 'src\stdio_mgr.egg-info\SOURCES.txt'
running build_ext
Creating c:\...\stdiomgr\env\lib\site-packages\stdio-mgr.egg-link (link to src)
Adding stdio-mgr 1.0.2.dev1 to easy-install.pth file

Installed c:\...\stdiomgr\src
Processing dependencies for stdio-mgr==1.0.2.dev1
Searching for attrs==19.1.0
Best match: attrs 19.1.0
Adding attrs 19.1.0 to easy-install.pth file

Using c:\...\stdiomgr\env\lib\site-packages
Finished processing dependencies for stdio-mgr==1.0.2.dev1
```

So far, this approach has worked smoothly for both of my projects that I've already converted
to the `src` layout and PEP517 build system. As noted above, I've just run the `setup.py develop` command
manually for my local development trees, and added it as an extra `install` step in
[`.travis.yml`](https://github.com/bskinn/stdio-mgr/blob/dff9f326528aac67d7ca0dc0a86ce3dffa3e0d39/.travis.yml#L4)
for CI.

-----

[**`tox.ini`**](https://github.com/bskinn/stdio-mgr/blob/8b09adb2ae98d3753ce6ee00015a10b520d48ec2/tox.ini)

In order to have `tox` build the package under test in isolation from the development
code, I added the standard:

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

In the absence of `pyproject.toml` and `isolated_build=True`,
this has the potential to mask any problems arising
from an incorrectly-specified build environment, because
with `isolated_build=False`, `tox`
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

FWIW, as a final point I'll note that I also just folded my `pytest` configuration into `tox.ini`, rather
than creating a new `pytest.ini` or `setup.cfg`:

```
[pytest]
addopts = -p no:warnings --doctest-glob="README.rst"
```

I figure I'll probably keep `pytest` config in here in general, even if it grows, to avoid creating
the extra file.

-----

[**`setup.py`**](https://github.com/bskinn/stdio-mgr/blob/8b09adb2ae98d3753ce6ee00015a10b520d48ec2/setup.py)

Only minor things to point out here, save for noting again that it was critical to define `package_dir`
in order for `setuptools` to grok the project source correctly.

```
setup(
    ...
    packages=find_packages("src"),
    package_dir={"": "src"},
    ...
)
```

Since I was still using the import-through-the-project approach to single-source versioning
at the particular commit I'm talking about here, I did have to do some path hijinks
in order to access the `__version__` defined within `src/stdio_mgr/__init__.py`:

```
sys.path.append(os.path.abspath("src"))
from stdio_mgr import __version__
sys.path.pop()
```

As noted above, I have since switched to single-source-version option [#3](https://github.com/bskinn/stdio-mgr/blob/1f57ca198fcb45e5df891be3910279cf8c89fa65/setup.py#L5-L6)
in the `dev` branch of the project:

```
with open(osp.join(*["src", "stdio_mgr", "version.py"])) as f:
    exec(f.read())
```

**NOTE (2019-06-12):** I realized recently that the above construction
is unnecessarily complicated---the unpacking of the list literal is superfluous.
Should be `.join("src", "stdio_mgr", "version.py")`.
I think the unpacking must have been left over from something else I was fiddling with...?

I could have moved a bunch of the configuration options to `setup` into `setup.cfg`, but I'd rather not
create yet another new file for only this single purpose. If `setuptools` gets an update such that
arguments to `setup` could be sited in `pyproject.toml`, I would strongly consider shifting them over there.
