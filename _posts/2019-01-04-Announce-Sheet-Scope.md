---
layout: post
title: 'Excel Addin: Sheet-Scoped Name Generator'
tags: excel vba
---

## Background

I've been crafting Excel formulas for fifteen years now, and recently I've been seeing the advantages of using the built-in ['defined names' functionality](https://support.office.com/en-us/article/define-and-use-names-in-formulas-4d0f13ac-53b7-422e-afd2-abd7ff379c64).  For example, if I have a worksheet that contains a number of physical constants that I'm going to be referring to on a regular basis, it's a huge time- and brain-saver to define a name for each cell.  Case in point, this (now outdated!) periodic table I put together a few years back:

{% include img.html path="excel/sheetscopename-pertable.png" alt="Periodic table view" clicknote=1 %}

Each of the molecular weight values shown here is in a cell with an assigned name of the format `w_Xx`, where `Xx` is the atomic symbol of the element of interest. So, to calculate the formula weight of calcium sulfate $$(\mathrm{CaSO_4})$$, all I have to do is:

```
=w_Ca+w_S+w_O*4
```

Names can be defined on single cells as well as multi-cell ranges, though most of the time I've found naming single cells to be most valuable.  Names can be created singly via the Name Manager, accessed by pressing <kbd>Ctrl</kbd>+<kbd>F3</kbd> or via `Formulas > Defined Names > Name Manager` in the Ribbon:

{% include img.html path="excel/sheetscopename-name-manager.png" alt="Name Manager" clicknote=1 %}

A key thing to note: when adding new names via the Name Manager, it's possible to choose whether the defined name is created at the scope of the entire workbook, or of a specific worksheet:

{% include img.html path="excel/sheetscopename-new-name.png" alt="Adding a new name" width="302px" %}

For global constants like atomic weights, the workbook-level scope makes sense. However, much of the time I'm working with multiple ~identical datasets on different tabs, each of which benefits from its own independent set of named cells.  Here, the worksheet-scoped names make far more sense.

## The Problem

Excel comes with a built-in tool for quickly defining a large number of names at the workbook scope based upon the values in neighboring cells, accessed either via <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>F3</kbd> or by `Formulas > Defined Names > Create from Selection` in the Ribbon. Take my periodic table example; say I highlight one of the elements and its atomic weight like this:

{% include img.html path="excel/sheetscopename-Ni-highlighted.png" alt="Nickel cells highlighted" width="122px" %}

Activating `Create from Selection` shows the following dialog:

{% include img.html path="excel/sheetscopename-create-from-sel.png" alt="Create from selection dialog" width="260px" %}

Excel has automatically selected `Top row`, which is indeed what I would want to use here: clicking `OK` would create a workbook-scoped name of `Ni` assigned to the cell containing `58.693`.  (Note that I didn't *actually* use `Create from Selection` to make this periodic table, since my names have that `w_Xx` syntax, but this gets the idea across.)

So, this is handy -- what's the problem?  Well, the problem is that, to the best of my knowledge, there's no way to do this sort of bulk, automatic name definition for ***worksheet***-scoped names.

## The Solution

... was to write my own add-in, obviously, which you can find at {% include gh.html user="bskinn" repo="excel-sheetscopename" %} `bskinn/excel-sheetscopename`.  To install:

 1. Download the most recent `SheetScopedName.xlam` from the [Releases page](https://github.com/bskinn/excel-sheetscopename/releases).

 1. Follow the instructions [here](https://github.com/bskinn/excel-csvexporter/wiki/Installation-&-Execution) to install and activate the add-in (looking for `Sheet-Scoped Name Generator` instead of `CSV Exporter` in the add-ins list).

To create worksheet-scoped names, start by highlighting a block of cells that you want to be named based on the contents of the cells to the left, e.g.:

{% include img.html path="excel/sheetscopename-sample-range-for-naming.png" alt="View of cells ready for naming" width="231px" %}

Then, press <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>N</kbd> and the names will be applied to each cell:

{% include img.html path="excel/sheetscopename-name-mgr-with-sheetscopes.png" alt="Name Manager showing sheet-scoped names" %}

The [Issues page](https://github.com/bskinn/excel-sheetscopename/issues) has a few known bugs to be fixed, and some potential enhancements to be implemented. 

