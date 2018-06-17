---
layout: post
title: 'Testing CLI Scripts in Python & Sphinx doctest'
tags: testing python sphinx cli stdio-mgr
---

I have a couple of Python projects that implement
CLIs: `sphobjinv` {% include gh.html user="bskinn" repo="sphobjinv" %} and `h5cube` {% include gh.html user="bskinn" repo="h5cube" %}.
For both of these, I have automated tests/documentation in place checking/illustrating the CLI commands
(e.g., for `sphobjinv v1.0` {% include rtd.html project="sphobjinv" ver="v1.0.post1" %}).
The [`doctest` module](https://docs.python.org/3.6/library/doctest.html) in the Python standard library 
and the [`doctest` extension ](http://www.sphinx-doc.org/en/stable/ext/doctest.html)
within Sphinx work really well for testing REPL code snippets, but these are intrinsically "API-like" interactions and I haven't
been able to find anything particularly satisfying for doctesting CLI invocations.
So, I put something together myself.  To illustrate here, I'll focus on Sphinx `doctest`--if you're interested in how I set up things on the testing side, see
[here](https://github.com/bskinn/sphobjinv/blob/94ae4062a01a3d6481a719d7b7148449069fbc3c/sphobjinv/test/sphobjinv_cli.py).

Because `doctest` expects inputs to be interpreted at the REPL,
there's little choice but to construct a CLI runner as a Python function.
The version of `cli_run` implemented [as of this
writing](https://github.com/bskinn/sphobjinv/blob/9b78e4a9ff832e558995319ad88306bbae94f3c6/doc/source/conf.py#L224-L247) is:

```
def cli_run(argstr, inp=''):
    '''Run as if argstr was passed to shell.

    Can't handle quoted arguments.
    '''
    import sys

    import sphobjinv.cmdline as cli
    from stdio_mgr import stdio_mgr

    old_argv = sys.argv
    sys.argv = argstr.strip().split()

    with stdio_mgr(inp) as (i_, o_, e_):
        try:
            cli.main()
        except SystemExit:
            pass
        finally:
            sys.argv = old_argv

        output = o_.getvalue() + e_.getvalue()

    print(output)
```

Most of this isn't particularly novel or fancy. It just imports the module containing my `main()` and swaps out the actual `sys.argv` temporarily with the test invocation to be run. Once `sys.argv` is swapped out, the `ArgumentParser` within `main()` sees the swapped arguments list and acts on it appropriately, calling into my CLI code.  The `try`/`except` to `pass` the `SystemExit` is needed to avoid fouling of the `doctest` execution from internal `sys.exit()` calls. Usage in docs is as simple as:

```
>>> cli_run('command arg1 arg2 arg3'):
<expected output here>
```

The big advantage over anything else I've seen comes from using `stdio_mgr`
{% include gh.html user="bskinn" repo="stdio-mgr" %}{% include pypi.html project="stdio-mgr" %}, which I just put together recently. In addition to allowing mocking of both `stdout` and `stderr` (via `o_` and `e_`), it provides a means for mocking `stdin` (via `i_`) as well. Thus, if you want to test a portion of your CLI that involves user input at the console, `stdio-mgr` provides a clean, concise way to do this. As a specific example, a 'Y/N' confirmation for overwriting a file is what I'll be using it on shortly in the `sphobjinv` docs {% include rtd.html project="sphobjinv" %}--the `doctest` source will probably end up looking something like:

```
>>> cli_run('sphobjinv convert plain objects_attrs.inv', inp='y\n')
File exists. Overwrite (Y/N)? y
<BLANKLINE>
Conversion completed.
'.../objects_attrs.inv' converted to '.../objects_attrs.txt' (plain).
<BLANKLINE>
```

The mocked user input `inp` (which ***MUST*** be newline terminated!!) is read from an `input` call just as if it'd been typed at the console, in response to the `File Exists. Overwrite (Y/N)? ` prompt.