---
layout: post
title: Setting up sphinx-autobuild on Windows
tags: sphinx
---

I write the documentation for [all of my side projects](https://readthedocs.org/profiles/bskinn/) in
Sphinx {% include pypi.html project="sphinx" %}
{% include gh.html user="sphinx-doc" repo="sphinx" %},
as it's more or less the standard for Python docs.
One of the ongoing pain points has been having to
re-run `make`/`make.bat` every time I want to view
the rendered docs after an edit.
I don't recall where I came across it, but I've found
`sphinx-autobuild` {% include pypi.html project="sphinx-autobuild" %}
{% include gh.html user="GaretJax" repo="sphinx-autobuild" %} to work
quite nicely, as the name suggests,
to automatically rebuild the docset every time I
save changes to the source. However, the README for the project only has instructions for
configuring `make livehtml` on Linux, and not
`make.bat` for Windows. So, I had to figure that out on my own.

For versions of Sphinx since (I think) v1.6.1, the `make.bat` generated from
`sphinx-quickstart` will look something like this:

```
@ECHO OFF

pushd %~dp0

REM Command file for Sphinx documentation

if "%SPHINXBUILD%" == "" (
	set SPHINXBUILD=sphinx-build
)
set SOURCEDIR=source
set BUILDDIR=build
set SPHINXPROJ=pent

if "%1" == "" goto help

%SPHINXBUILD% >NUL 2>NUL
if errorlevel 9009 (
	echo.
	echo.The 'sphinx-build' command was not found. Make sure you have Sphinx
	echo.installed, then set the SPHINXBUILD environment variable to point
	echo.to the full path of the 'sphinx-build' executable. Alternatively you
	echo.may add the Sphinx directory to PATH.
	echo.
	echo.If you don't have Sphinx installed, grab it from
	echo.http://sphinx-doc.org/
	exit /b 1
)

%SPHINXBUILD% -M %1 %SOURCEDIR% %BUILDDIR% %SPHINXOPTS%
goto end

:help
%SPHINXBUILD% -M help %SOURCEDIR% %BUILDDIR% %SPHINXOPTS%

:end
popd
```

The above file was probably generated from v1.7.4 or thereabouts. In any event,
the part I usually edit is the invocation right above the `:help` label,
which I change to the following:

```
if "%1" == "livehtml" (
	sphinx-autobuild %SOURCEDIR% %BUILDDIR% %SPHINXOPTS% %2
) else (
	%SPHINXBUILD% -M %1 %SOURCEDIR% %BUILDDIR% %SPHINXOPTS% %2
)
goto end
```

Then, invoking `make livehtml` works smoothly to launch `sphinx-autobuild`.
To kick off the auto-build in a new console window, so that the old one
remains free for use, `start make livehtml` works great. It even launches
the process in the same virtualenv!

The `%2` added at the ends of the `sphinx-autobuild` and `%SPHINXBUILD` lines
allows passing additional arguments to the commands.  For `sphinx-autobuild`,
these include options to configure how the documentation is served;
for the plain Sphinx build, it allows things like
[`make html -Ea`](https://www.sphinx-doc.org/en/master/man/sphinx-build.html?highlight=sphinx-build#cmdoption-sphinx-build-a), which
rebuilds the entire docset completely from scratch
(somewhat like what `make clean html` does on Linux), and
[`make html -n`](https://www.sphinx-doc.org/en/master/man/sphinx-build.html?highlight=sphinx-build#cmdoption-sphinx-build-n), which
warns about things like improperly constructed cross-references.
