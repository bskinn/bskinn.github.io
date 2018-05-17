---
layout: post
title: 'My How and Why: setup.py'
---

When I was first figuring out how to publish a project to [PyPI](https://pypi.org), one of the more confusing things about the process was the purpose of all the various arguments to [`setuptools.setup`](http://setuptools.readthedocs.io/en/latest/setuptools.html#new-and-changed-setup-keywords).  `requires` versus `install_requires`, `packages` versus `provides`, that huge list of [trove classifiers](https://pypi.org/classifiers/)... it was really hard to figure out what arguments I needed to include, and what I should put in them.

I've now gotten to a point where I'm comfortable with my `setup.py`, at least for the straightforward use-cases that my projects to date represent.  (Just in time for PyPA to start working toward [obsoleting the whole `setup.py` paradigm](https://github.com/pypa/packaging-problems/issues/129)...) Here's the `setup.py` from a recent [work-in-progress commit](https://github.com/bskinn/sphobjinv/blob/fa69fbed121b1a0350222317158aeea7f2066edd/setup.py) to one of my projects, `sphobjinv`:

```
from setuptools import setup

from sphobjinv import __version__


def readme():
    with open('README.rst', 'r') as f:
        return f.read()


setup(
    name='sphobjinv',
    version=__version__,
    description='Sphinx Objects.inv Encoder/Decoder',
    long_description=readme(),
    url='https://github.com/bskinn/sphobjinv',
    license='MIT License',
    author='Brian Skinn',
    author_email='bskinn@alum.mit.edu',
    packages=['sphobjinv'],
    provides=['sphobjinv'],
    python_requires='>=3.4',
    requires=['attrs (>=17.1)', 'certifi', 'fuzzywuzzy (>=0.3)',
              'jsonschema (>=2.0)'],
    install_requires=['attrs>=17.1', 'certifi', 'fuzzywuzzy>=0.3',
                      'jsonschema>=2.0'],
    classifiers=['License :: OSI Approved',
                 'License :: OSI Approved :: MIT License',
                 'Natural Language :: English',
                 'Environment :: Console',
                 'Framework :: Sphinx',
                 'Intended Audience :: Developers',
                 'Operating System :: OS Independent',
                 'Programming Language :: Python',
                 'Programming Language :: Python :: 3',
                 'Programming Language :: Python :: 3 :: Only',
                 'Programming Language :: Python :: 3.4',
                 'Programming Language :: Python :: 3.5',
                 'Programming Language :: Python :: 3.6',
                 'Topic :: Utilities',
                 'Development Status :: 5 - Production/Stable'],
    entry_points={
        'console_scripts': [
            'sphobjinv = sphobjinv.cmdline:main'
                           ]
                  }
)
```
In this post, I'll go through it piece by piece, noting what each chunk does (as of this writing: ~May 2018 and `setuptools` v38.5.1) and why I've set it up that way. In all likelihood there are some things missing that should really be there, but it seems to be working well enough for now. More complex projects may need a more complex `setup.py`, but this should suffice for simple ones.

To note: Kenneth Reitz has a pretty substantial tutorial for `setup.py` posted as a [GitHub repo](https://github.com/kennethreitz/setup.py); that may work better for some.

## Preamble
```
from setuptools import setup
```

Straightforward. Have to import `setup` or else there's little point.<br>&nbsp;

```
from sphobjinv import  __version__
```

This is part of a define-once strategy for my project version number: when I bump my version in [`__init__.py`](https://github.com/bskinn/sphobjinv/blob/f53f1a9edb10831e86e0566d2454e000a19cc66e/sphobjinv/__init__.py), it's automatically bumped here, too.  See the `version` argument further down. <br>&nbsp;

```
def readme():
    with open('README.rst', 'r') as f:
        return f.read()
```

I use the same `README.rst` to populate my GitHub and PyPI descriptions. GitHub picks up the README file automatically; for PyPI, it gets passed to `long_description`---see below. (Note: PyPI/Warehouse now [supports MarkDown for `long_description`](https://dustingram.com/articles/2018/03/16/markdown-descriptions-on-pypi)!) <br>&nbsp;

## `setup()` Arguments
<small>*Trailing commas on the arguments below are omitted for brevity.*</small>

```
name='sphobjinv'
```

This is the name of the project on PyPI, and is what users will pass to `pip install` to download it.<br>&nbsp;

```
version=__version__
```

This applies the 'define-once' version number imported above.<br>&nbsp;

```
description='Sphinx Objects.inv Encoder/Decoder'
```

This sets the 'short description' for the project that appears in the lower part of the page header (*click any image to enlarge*):

[<img src="{{ site.baseurl }}/images/howwhy-setup/description.png" alt="'description' screencap" width="300px"/>]({{ site.baseurl }}/images/howwhy-setup/description.png)

This description also appears with the project in search results:

[<img src="{{ site.baseurl }}/images/howwhy-setup/searchresult.png" alt="'search result' screencap" width="300px"/>]({{ site.baseurl }}/images/howwhy-setup/searchresult.png)<br>&nbsp;

```
long_description=readme()
```

This provides the content for the verbose description of the project, on the project's PyPI homepage (`https://pypi.org/project/[projectname]`):

[<img src="{{ site.baseurl }}/images/howwhy-setup/longdescription.png" alt="'long_description' screencap" width="300px"/>]({{ site.baseurl }}/images/howwhy-setup/longdescription.png)

As noted above, `readme()` is a helper function to load the contents of `README.rst` into this argument.

**NOTE:** The now-obsolete legacy PyPI system would automatically search uploaded projects for a `README.rst` and use it as the `long_description`; Warehouse, its replacement, ***does not do this***. If you don't explicitly set `long_description` in your `setup.py`, you won't get a detailed description on your PyPI project page (e.g., as happened [here](https://pypi.org/project/sphobjinv/1.0.post1/)).<br>&nbsp;

```
url='https://www.github.com/bskinn/sphobjinv'
```

Homepage for the project. If `url` links to a GitHub repo, some repository statistics will be provided in the sidebar:

[<img src="{{ site.baseurl }}/images/howwhy-setup/gh-url.png" alt="'GitHub URL' screencap" width="300px"/>]({{ site.baseurl }}/images/howwhy-setup/gh-url.png)
<br>

```
license='MIT License'
author='Brian Skinn'
author_email='bskinn@alum.mit.edu'
```
This information is used to populate a '**Meta**' block in the sidebar of the project page.<br>&nbsp;

```
packages=['sphobjinv']
provides=['sphobjinv']
```
On first blush these seemed redundant, but their  purpose is distinct.  `packages` is (essentially) **required**, and tells `setup.py`  which Python packages it should look for in the local project directory, to include in an `sdist`, `bdist_wheel`, or other distribution. `provides` is an optional metadata field, indicating to a user what packages are provided by the project. I think `provides` might be used internally by `pip` &c., to see if a dependency for package `p` is met by project `x`. But, this starts to muddle my mental distinctions between packages and projects, so I'm not too confident here. I *do* usually set `provides`, though, just in case.<br>&nbsp;

```
python_requires='>=3.4'
requires=['attrs (>=17.1)', 'certifi', 'fuzzywuzzy (>=0.3)',
          'jsonschema (>=2.0)']
install_requires=['attrs>=17.1', 'certifi', 'fuzzywuzzy>=0.3',
                  'jsonschema>=2.0']
```
`python_requires` declares a requirement for the version of Python used to invoke `setup.py`. If the interpreter version does not satisfy the conditions given, install of the project will fail. See the [`setuptools` docs](https://packaging.python.org/tutorials/distributing-packages/#python-requires) for more information, in particular for the syntax for compound version-requirement statements.

Loosely similar to `packages`/`provides`, AFAICT `requires` is purely a metadata field, used to declare rather than enforce the project's dependencies. Conversely, `install_requires` imposes strict dependency requirements for installation of the project; `pip` will attempt to auto-install everything in `install_requires` when installing the project.

Aside from the differences in the version number syntax, most of the time my `requires` and `install_requires` are identical.  The main exception is for projects with dependencies that are difficult for `pip` to install in some situations---the most common case is a dependency with C extensions that require compilation (e.g., `numpy`), which is a nightmare on Windows. In these cases, I would include `numpy` in `requires`, but leave it out of `install_requires`, with the responsibility falling on the user to install it themselves. (I might also then include an import-time check for`numpy` in the package itself.) The trend toward major projects like `numpy` uploading Windows `bdist_wheel`s with each release is making this less of an issue, however. <br>&nbsp;

```
classifiers=['License :: OSI Approved',
             'License :: OSI Approved :: MIT License',
             'Natural Language :: English',
             ...
             'Topic :: Utilities',
             'Development Status :: 5 - Production/Stable'],
```
The `classifiers` are selected from a [pre-defined list](https://pypi.org/classifiers/) and serve to, well, classify a project in a number of different categories.  When searching [pypi.org](https://pypi.org), these classifiers can be used to narrow search results, to more easily find relevant projects:

[<img src="{{ site.baseurl }}/images/howwhy-setup/classifier-filter.png" alt="Filtering PyPI by project dev status" width="300px"/>]({{ site.baseurl }}/images/howwhy-setup/classifier-filter.png)

As can be seen above, the first field/level of the classifier shows as a menu of filtering options on PyPI.  The second and subsequent levels show as checkboxes in the filtering options.  **Just because a deeper classifier is specified for a project *DOES NOT MEAN* that all 'parents' of that classifier are automatically applied to the project!** If you want your project to show up under searches for, e.g., any of `Python`, `Python :: 3`, `Python :: 3.6`, and `Python :: 3 :: Only`, then you have to *explicitly* include all of them in your `setup.py`, as I've done above.<br>&nbsp;

```
entry_points={
    'console_scripts': [
        'sphobjinv = sphobjinv.cmdline:main'
                       ]
              }
```

If your project has a commandline interface, `entry_points` is how you tell `setup` what you want that CLI command to be called, and where to hook it into your code.  When someone `pip install`s your project, it will automatically create a script and put it on your path.  (`entry_points` can do more than this---search for 'entry_points' [here](http://setuptools.readthedocs.io/en/latest/setuptools.html)---but it's the only thing I've used it for to date.)  In my hands, most of this is boilerplate; the key line is the `'sphobjinv = sphobjinv.cmdline:main'`.  AFAIK this 'pseudo-assignment' needs to be a string; the name before the `=` will become the name of the autogenerated script, and the remainder points to the function that the script should call: `package.subpackage:function`

<br><br><small>*This post was written with [StackEdit](https://stackedit.io).*</small>
