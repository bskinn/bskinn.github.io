---
layout: post
title: 'Excel Addins: Setting the Name & Description'
tags: excel vba add-ins
---

When creating an Excel add-in, it's useful to be able to configure
how it will appear in the Add-Ins management dialog.

`File > Options > Add-Ins`; select `Excel Add-ins` next to `Manage:`
and click `Go...`:

{% include img.html path="excel/addin-name-description.png" alt="View of Addin dialog" width="330px" %}

For the add-in that's highlighted in the image, I had to manually set both its name, *CSV Exporter v1.0* {% include gh.html user="bskinn" repo="excel-csvexporter" %} and the description text, *Automated export of an array of cells.*  I can't remember where I initially found out how to set these, but it's really non-obvious what you need to do.

Both of these values are read from "built-in document properties" on the `.xlam` file of the add-in itself. To set them, start by opening Excel and making sure the add-in is loaded.  Then, in the VBA Editor (<kbd>Alt</kbd>+<kbd>F11</kbd>), open the `Immediate` pane (<kbd>Ctrl</kbd>+<kbd>G</kbd>) and use something like the following:

```
Workbooks("CSVExporter.xlam").BuiltinDocumentProperties("Title") = "CSV Exporter v1.0"

Workbooks("CSVExporter.xlam").BuiltinDocumentProperties("Comments") = "Automated export of an array of cells."

```

Then, save the add-in (click `Save` or press <kbd>Ctrl</kbd>+<kbd>S</kbd> ***in the VBA Editor***) and you should be all set.

<br/>

**NOTE:** In order for an add-in to appear in the `Add-Ins` dialog, it has to be placed in a specific folder *for each user*: `%USERPROFILE%\AppData\Roaming\Microsoft\AddIns`

