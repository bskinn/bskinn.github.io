---
layout: post
title: 'New Release: sphobjinv v2.3'
tags: python sphobjinv release
---

*Well, seems I haven't posted here since that last `sphobjinv` release post, for
v2.1. Been busy writing code in my spare time, for the most part.*

Anyways -- `sphobjinv` v2.3 is out!

(I skipped writing up anything for v2.2, because ... well, it was a release that
I was disappointed that I had to make. When I implemented the `suggest`
functionality, I had included a recent `fuzzywuzzy` as a dependency. As it turns
out, ever since `fuzzywuzzy` implemented an interface with `python-Levenshtein`
it's been licensed GPL. Not at all compatible with the MIT License on
`sphobjinv`. So, the big change in v2.2 was removing that dependency, and
instead vendoring a copy of `fuzzywuzzy` from back when it *was* MIT licensed.
Bummer, because speed is good.)

So, yeah -- v2.3. The big changes here are to the `suggest` CLI, which now provides a **LOT** more information about the `objects.inv`.

v2.2.2 output:

```
>sphobjinv suggest -u https://sphobjinv.readthedocs.io/en/v2.3/ suggest -st99

No inventory at provided URL.
Attempting "https://sphobjinv.readthedocs.io/en/v2.3/objects.inv" ...
Remote inventory found.

No results found.
```

v2.3 output:

```
>sphobjinv suggest -u https://sphobjinv.readthedocs.io/en/v2.3/ suggest -st99

Attempting https://sphobjinv.readthedocs.io/en/v2.3/ ...
  ... no recognized inventory.
Attempting "https://sphobjinv.readthedocs.io/en/v2.3/objects.inv" ...
  ... inventory found.

Project: sphobjinv
Version: 2.3

219 objects in inventory.

No results found with score at/above current threshold of 99.
```

[list of all of them]