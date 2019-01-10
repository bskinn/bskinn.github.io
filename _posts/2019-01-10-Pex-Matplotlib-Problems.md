---
layout: post
title: 'Bootstrap Problems in pex Packages'
tags: packaging pex python
---

In [this post]({% post_url 2018-12-04-First-Attempt-pex %}), I laid out an initial attempt
at a `pex` {% include pypi.html project="pex" %} workflow for packaging data analysis
code for easy use by others.  I still stand by the method in general; however, I ran into
some problems with this particular application.

For reasons I don't fully understand (and which **MAY** be fixable with, say, the correct
`pex` options, or a more tightly/fully specified `requirements-pex.txt`, or a precise
Python version match, or ...), when unpacking `matplotlib`
{% include pypi.html project="matplotlib" %} on a user's machine, `pex` fails
to populate various critical resource directories (at all? in the right sequence?).
This leads to a `FileNotFoundError` being raised during what appears to be the initial
activation of the packaged environment:

```
Traceback (most recent call last):
  File ".bootstrap\_pex\pex.py", line 347, in execute
  File ".bootstrap\_pex\pex.py", line 90, in _activate
  File ".bootstrap\_pex\environment.py", line 163, in activate
  File ".bootstrap\_pex\environment.py", line 217, in _activate
  File ".bootstrap\_pex\environment.py", line 152, in update_candidate_distributions
  File ".bootstrap\_pex\environment.py", line 122, in load_internal_cache
  File ".bootstrap\_pex\environment.py", line 109, in write_zipped_internal_cache
  File ".bootstrap\_pex\util.py", line 178, in cache_distribution
  File ".bootstrap\_pex\common.py", line 141, in safe_open
FileNotFoundError: [Errno 2] No such file or directory: 'C:\\Users\\Staff\\.pex\\install\\matplotlib-2.1.2-cp36-cp36m-win_amd64.whl.08a6cc1638139d3fe5ee428cafc4e5e73177805e.835acc1b95bb4add8dcb5d93bf8c585b\\matplotlib-2.1.2-cp36-cp36m-win_amd64.whl\\matplotlib/backends/web_backend/jquery/css/themes/base/images/ui-bg_diagonals-thick_18_b81900_40x40.png'
```

So, not good.  On trying to trace down the error in a bit more detail, I actually had trouble
making a simpler `.pex` work, containing just `matplotlib` (and its dependencies)...
here, it blew up even earlier in the process, during bootstrap, even when run 
in the same virtualenv within which the `.pex` was initially created:

```
Traceback (most recent call last):
  File "C:\Users\Brian\AppData\Local\Programs\Python\Python36\lib\runpy.py", line 193, in _run_module_as_main
    "__main__", mod_spec)
  File "C:\Users\Brian\AppData\Local\Programs\Python\Python36\lib\runpy.py", line 85, in _run_code
    exec(code, run_globals)
  File "__main__.py", line 23, in <module>
  File "<frozen importlib._bootstrap>", line 971, in _find_and_load
  File "<frozen importlib._bootstrap>", line 955, in _find_and_load_unlocked
  File "<frozen importlib._bootstrap>", line 656, in _load_unlocked
  File "<frozen importlib._bootstrap>", line 626, in _load_backward_compatible
  File ".bootstrap\pex\third_party\__init__.py", line 400, in <module>
  File ".bootstrap\pex\third_party\__init__.py", line 396, in install
  File ".bootstrap\pex\third_party\__init__.py", line 207, in install_vendored
  File ".bootstrap\pex\third_party\__init__.py", line 242, in install
  File ".bootstrap\pex\third_party\__init__.py", line 155, in _iter_importables
  File ".bootstrap\pex\third_party\__init__.py", line 110, in iter_root_modules
  File ".bootstrap\pex\third_party\__init__.py", line 121, in _filter_names
  File "C:\Users\Brian\AppData\Local\Programs\Python\Python36\lib\re.py", line 233, in compile
    return _compile(pattern, flags)
  File "C:\Users\Brian\AppData\Local\Programs\Python\Python36\lib\re.py", line 301, in _compile
    p = sre_compile.compile(pattern, flags)
  File "C:\Users\Brian\AppData\Local\Programs\Python\Python36\lib\sre_compile.py", line 562, in compile
    p = sre_parse.parse(p, flags)
  File "C:\Users\Brian\AppData\Local\Programs\Python\Python36\lib\sre_parse.py", line 855, in parse
    p = _parse_sub(source, pattern, flags & SRE_FLAG_VERBOSE, 0)
  File "C:\Users\Brian\AppData\Local\Programs\Python\Python36\lib\sre_parse.py", line 416, in _parse_sub
    not nested and not items))
  File "C:\Users\Brian\AppData\Local\Programs\Python\Python36\lib\sre_parse.py", line 502, in _parse
    code = _escape(source, this, state)
  File "C:\Users\Brian\AppData\Local\Programs\Python\Python36\lib\sre_parse.py", line 401, in _escape
    raise source.error("bad escape %s" % escape, len(escape))
sre_constants.error: bad escape \p at position 11
```

A similar explosion happened with a `.pex` containing just `requests`
{% include pypi.html project="requests" %} and dependencies. So, seems `pex`
is not as straightforward as I first thought.  Too bad, it seemed very promising!



