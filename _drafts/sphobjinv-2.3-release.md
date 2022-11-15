---
layout: post
title: 'New Release: sphobjinv v2.3'
tags: python sphobjinv release
---

*Well, seems I haven't posted here since that last `sphobjinv` release post, for
v2.1 ... been focused on writing code for one project or another.*

Anyways---`sphobjinv` v2.3 is out!

---

Although---first, an aside: I skipped writing up anything for v2.2, because ...
well, it was a release that I was disappointed that I had to make. When I
implemented the `suggest` functionality, I had included `fuzzywuzzy` as a
dependency. As it turns out, ever since `fuzzywuzzy` implemented its interface
with `python-Levenshtein` it's been licensed GPL. Not at all compatible with the
MIT License on `sphobjinv`. For users only of the CLI, it doesn't matter much;
but for anyone using the `sphobjinv` API, it was an important fix.

So, the big change in v2.2 was removing that dependency, and instead vendoring a
copy of `fuzzywuzzy` from back when it *was* MIT licensed, modified to be Python
3-compatible. (The need for those modifications made it impossible to just pin
to that early version.) Was a bummer, because speed is good. I have an idea for
how to regain some of that performance (see
[#178](https://github.com/bskinn/sphobjinv/issues/178)), which is a big focus of
my plan for v2.4. Not sure how long that'll take, though.

---

So, yeah---v2.3!

The big changes here are to the `suggest` CLI, which now provides a **LOT** more information about the `objects.inv`.

Previous v2.2.2 output:

```
$ sphobjinv su https://sphobjinv.readthedocs.io/en/v2.3/api/inventory.html#sphobjinv.inventory.Inventory.count suggest -ust99

No inventory at provided URL.
Attempting "https://sphobjinv.readthedocs.io/en/v2.3/api/inventory.html/objects.inv" ...
Attempting "https://sphobjinv.readthedocs.io/en/v2.3/api/objects.inv" ...
Attempting "https://sphobjinv.readthedocs.io/en/v2.3/objects.inv" ...
Remote inventory found.

No results found.
```

New v2.3 output:

```
$ sphobjinv su https://sphobjinv.readthedocs.io/en/v2.3/api/inventory.html#sphobjinv.inventory.Inventory.count suggest -ust99

Attempting https://sphobjinv.readthedocs.io/en/v2.3/api/inventory.html#sphobjinv.inventory.Inventory.count ...
  ... no recognized inventory.
Attempting "https://sphobjinv.readthedocs.io/en/v2.3/api/inventory.html/objects.inv" ...
  ... HTTP error: 404 Not Found.
Attempting "https://sphobjinv.readthedocs.io/en/v2.3/api/objects.inv" ...
  ... HTTP error: 404 Not Found.
Attempting "https://sphobjinv.readthedocs.io/en/v2.3/objects.inv" ...
  ... inventory found.

Project: sphobjinv
Version: 2.3

219 objects in inventory.

No results found with score at/above current threshold of 99.
```

The `suggest` CLI output now contains:

- For the `--url` mode:
  - More details of what occurred while trying to locate the `objects.inv` file
- For all modes:
  - The project and version information for the `objects.inv`
  - The total number of objects present in the `objects.inv`
  - The search score threshold value, and the number of results found for the
    given search term satisfying that value

In addition to the expanded preamble output, v2.3 also adds a new option to the
`suggest` CLI: `--paginate`, or `-p` for short. Enabling this features makes it
so that long lists of results are only displayed one terminal screen at a time:


```
$ sphobjinv su doc\build\html\objects.inv function -ps

Project: sphobjinv
Version: 2.3

219 objects in inventory.

30 results found at/above current threshold of 75.

Cannot infer intersphinx_mapping from a local objects.inv.

  Name                                                             Score
----------------------------------------------------------------  -------
:py:function:`sphobjinv.cli.convert.do_convert`                     90
:py:function:`sphobjinv.cli.core.main`                              90
:py:function:`sphobjinv.cli.load.import_infile`                     90
:py:function:`sphobjinv.cli.load.inv_local`                         90
:py:function:`sphobjinv.cli.load.inv_stdin`                         90
:py:function:`sphobjinv.cli.load.inv_url`                           90
:py:function:`sphobjinv.cli.parser.getparser`                       90
:py:function:`sphobjinv.cli.paths.resolve_inpath`                   90
:py:function:`sphobjinv.cli.paths.resolve_outpath`                  90
:py:function:`sphobjinv.cli.suggest.do_suggest`                     90
:py:function:`sphobjinv.cli.suggest.generate_index_lines`           90
Press Enter to continue...
```

<br />

Hopefully all of these changes will provide a welcome improvement to the
`suggest` CLI experience!

<br />
