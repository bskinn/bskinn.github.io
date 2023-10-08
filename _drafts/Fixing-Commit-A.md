---
layout: post
title: 'Cleanly Fixing an Accidental `git commit -a`'
tags: git
---

## Intro

- git commit -a is great, it's the most common way I commit stuff
- But sometimes I use it when I don't mean to, usually working quickly on committing a bunch of changes piecewise
- How to cleanly turn an accidental commit like this into that series of piecewise commits?
- revert, checkout, rebase!

## The Steps

```
$ git revert <SHA>
$ git checkout -p <SHA>
{accept/reject hunks for first commit}
$ git commit
$ git checkout -p <SHA>
{accept/reject hunks for second commit}
$ git commit
{repeat 'checkout -p' / 'commit' cycle until all commits made}
$ git rebase -i
{drop the erroneous bulk commit and its revert commit}
```


## The Explanation

...
