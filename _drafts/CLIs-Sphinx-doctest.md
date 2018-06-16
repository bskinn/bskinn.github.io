---
layout: post
title: 'Testing CLI Scripts in Sphinx doctest'
tags: testing python sphinx cli
---

I have a couple of Python projects that implement
CLIs: `sphobjinv` {% include gh.html gh_user="bskinn" gh_repo="sphobjinv" %}
and `h5cube` {% include gh.html gh_user="bskinn" gh_repo="h5cube" %}.
For both of these, I have documentation in place illustrating the CLI commands
(e.g., for `sphobjinv v1.0` {% include rtd.html project="sphobjinv" ver="v1.0.post1" %}).
The [`doctest` extension ](http://www.sphinx-doc.org/en/stable/ext/doctest.html)
within Sphinx works really well for testing REPL code snippets, but I haven't
been able to find anything particularly satisfying for testing CLI invocations.
So, I put something together myself.

Because `doctest` expects inputs to be interpreted at the REPL,
there's little choice but to construct a CLI runner as a Python function.
The version of `cli_run` implemented [as of this
writing](https://github.com/bskinn/sphobjinv/blob/1a6fde8f6435d6aa6ecf06e45c300e4dceddc877/doc/source/conf.py#L224-L247) is:

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

