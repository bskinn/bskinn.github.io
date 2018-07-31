---
layout: post
title: 'Programmatic Inspection of IPython Histories'
tags: python
---

Today I needed to look back deeply into my IPython history, to find out exactly how I'd calculated some timings for one of my side projects, `sphobjinv` {% include gh.html user="bskinn" repo="sphobjinv" %} {% include rtd.html project="sphobjinv" %} {% include pypi.html project="sphobjinv" %}.  Complicating matters was the fact that the particular IPython history I needed was both on a *different computer* than the one I was working on, and also on an *entirely different network*. Capping off the challenge was the fact that I didn't have convenient shell access to it (it's a Windows machine).

Fortunately, I *do* have the ability to SSH into a Linux box on the same network, and thus can  use a combination of `ssh`, `scp`, and `smbclient` to retrieve files from it. The first task was identifying where the history is kept. Per [this handy Stack Overflow comment](https://stackoverflow.com/questions/25124037/ipython-print-complete-history-not-just-current-session#comment39103510_25124037), IPython typically keeps its history in `~/.ipython/profile_default` (or `%CURRENTUSER%/.ipython/profile_default` on Windows), in a file named `history.sqlite`. Unfortunately, as betrayed by the file extension, the history is stored in an SQL database.

This turned out to be no big deal, though, as IPython provides a [mechanism](http://ipython.readthedocs.io/en/stable/api/generated/IPython.core.history.html#IPython.core.history.HistoryAccessor) for introspecting these. I started by retrieving the file to a local temp directory:

```
local-PC$ ssh user@remote-linux
remote-linux$ smbclient //remote-win/C$ -U username
Enter username's password: [type password]
smb: \> cd users\username\.ipython\profile_default
smb: \users\username\.ipython\profile_default\> get history.sqlite
...
smb: \users\username\.ipython\profile_default\> quit
remote-linux$ logout
local-PC$ scp -P [custom port] user@remote-linux:/home/user/history.sqlite .
```
I then launched IPython in a shell at this folder, imported IPython itself (whoa, meta), and created a `HistoryAccessor` object for the history file:

```
local-PC$ ipython
>>> import IPython
>>> ha = IPython.core.history.HistoryAccessor(hist_file='history.sqlite')
```

From here, I had to conduct a deep search across numerous IPython sessions spanning several months back, in order to find what I was looking for (only relevant output is actually shown here; the actual results were much more extensive):

```
>>> print(*[_ for _ in ha.get_tail(10000) if 'timeit' in _[2]], sep='\n')
(710, 8, 'for fn in os.listdir():\n    if fn.endswith(\'.inv\'):\n        inv = soi.Inventory(fn)\n        timings = timeit.repeat("inv.suggest(\'function\')", repeat=count, number=1, globals=globals())\n        results.update({fn: sum(timings) / len(timings)})\n        ')
(710, 12, 'for fn in os.listdir():\n    if fn.endswith(\'.inv\'):\n        inv = soi.Inventory(fn)\n        timings = timeit.repeat("inv.suggest(\'function\')", repeat=count, number=1, globals=globals())\n        results.update({fn: sum(timings) / len(timings)})\n        lengths.update({fn: inv.count})\n        ')
(710, 17, 'for fn in os.listdir():\n    if fn.endswith(\'.inv\'):\n        inv = soi.Inventory(fn)\n        timings = timeit.repeat("inv.suggest(\'function\')", repeat=count, number=1, globals=globals())\n        results.update({fn: sum(timings) / len(timings)})\n        lengths.update({fn: inv.count})\n        print((fn, results[fn], lengths[fn]))\n        ')
(711, 3, 'import timeit')
(711, 7, 'for fn in os.listdir():\n    if fn.endswith(\'.inv\'):\n        inv = soi.Inventory(fn)\n        timings = timeit.repeat("inv.suggest(\'function\')", repeat=count, number=1, globals=globals())\n        results.update({fn: sum(timings) / len(timings)})\n        lengths.update({fn: inv.count})\n        print((fn, results[fn], lengths[fn]))\n        ')
(711, 9, 'for fn in os.listdir():\n    if fn.endswith(\'.inv\'):\n        inv = soi.Inventory(fn)\n        timings = timeit.repeat("inv.suggest(\'function\')", repeat=count, number=1, globals=globals())\n        results.update({fn: sum(timings) / len(timings)})\n        lengths.update({fn: inv.count})\n        print((fn, results[fn], lengths[fn]))\n        ')
```
(`soi` here is my `sphobjinv` package, imported as `import sphobjinv as soi`.  In retrospect, using [`ha.search()`](http://ipython.readthedocs.io/en/stable/api/generated/IPython.core.history.html#IPython.core.history.HistoryAccessor.search) would probably have been a far more efficient way of doing this. However, `get_tail()` was higher in the API listing, so I saw it first....)

The result returned from the `ha.get_tail()` call is an iterator of tuples of the form `(session_id, line_id, command)`. So, based on the above results, I was interested in sessions 710 and 711, which can be retrieved in a targeted way by `ha.get_range()`.  Here, I'll just show #710 (again snipped only to commands that were directly relevant to what I needed):

```
>>> print(*ha.get_range(710), sep='\n')
(710, 15, 'results = {}')
(710, 16, 'lengths = {}')
(710, 17, 'for fn in os.listdir():\n    if fn.endswith(\'.inv\'):\n        inv = soi.Inventory(fn)\n        timings = timeit.repeat("inv.suggest(\'function\')", repeat=count, number=1, globals=globals())\n        results.update({fn: sum(timings) / len(timings)})\n        lengths.update({fn: inv.count})\n        print((fn, results[fn], lengths[fn]))\n        ')
(710, 18, 'import csv')
(710, 19, "with open('\\\\git\\\\no-leven.csv', 'w') as f:\n    csvw = csv.writer(f)\n    for fn in results:\n        csvw.writeline([fn, lengths[fn], results[fn]])\n        ")
(710, 20, "with open('\\\\git\\\\no-leven.csv', 'w') as f:\n    csvw = csv.writer(f)\n    for fn in results:\n        csvw.writerow([fn, lengths[fn], results[fn]])\n        ")
>>> 
```
What I was looking for was the context and form of the `timeit` command of line 17, so I could accurately describe the timing information I had collected and tucked into an Excel file some months ago. Success!

{% include stackedit.html %}

