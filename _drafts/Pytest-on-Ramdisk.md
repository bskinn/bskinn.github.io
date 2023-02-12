---
layout: post
title: '[Something About Pytest and a Ramdisk]'
tags: pytest ramdisk
---

Intro

- Faster tests
- Less disk churn

Database testing on SSD in particular.

## Makign the ramdisk

[SO incantation for Debian]

[Tools exist for Windows]

## Helper for making the ramdisk

[bash function! into .bash_aliases]

## Pointing pytest at the ramdisk

[--basetemp]

[Don't point it at the root of the mounted ramdisk, it'll try to delete that ramdisk mount root and that won't go well]

## Precopying the database to the ramdisk

[tmp_path_factory, so that it's session-scope-able]

[tmp_path is function(?) scope, no good]

[For these tests, the database *should* not be modified--and I have a rollback/engine disposal in the function-scope fixture that connects to the db]

[This does make it possible that the db will get corrupted/state-changed between tests. Something to watch out for]

[But, IMO worth the tradeoff -- low-stakes application, and the whole point is to minimize disk churn. Less important since copying the database out is read-only from an SSD---super fast reads, no writes---but seems acceptable for now]