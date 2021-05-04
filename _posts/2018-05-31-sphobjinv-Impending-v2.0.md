---
layout: post
title: 'sphobjinv: Impending v2.0 Release'
tags: sphobjinv python release
---

As a heads-up for anyone out there who might be using `sphobjinv` {% include gh.html user="bskinn" repo="sphobjinv" %}, my tool for inspecting and manipulating Sphinx `objects.inv` files, I'm working to put out a v2.0 release.  **The API has completely changed from v1.0.** If you depend on it, you'll definitely want to pin your version in the near future. The project will bump to production v2.0 once I get the docs finished.

A pre-release is already up on PyPI {%- include pypi.html project="sphobjinv" version="2.0rc1" -%}; as long as no major bugs emerge, the API won't change upon transition to production v2.0. Please take it for a spin and [let me know](https://twitter.com/pylogging) what you think.  I'm particularly interested in knowing whether the [`suggest`](http://sphobjinv.readthedocs.io/en/v2.0rc1/modules/inventory.html#sphobjinv.inventory.Inventory.suggest) feature is useful to others--it's certainly been helpful to ***me*** as I've been drafting the docs for the project.

Across the board, though, I highly recommend to upgrade: the new version fixes some pretty serious bugs (what was I **thinking**, [putting `sys.exit()` in an API function](https://github.com/bskinn/sphobjinv/blob/v1.0.post1/sphobjinv/sphobjinv.py#L207)??), and introduces a proper object model for handling inventory and object data.


{% include stackedit.html %}

