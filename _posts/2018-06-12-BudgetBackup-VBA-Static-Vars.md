---
layout: post
title: 'VBA: "Budget Backup" Project & Static Variables'
tags: vba xl-budgetbackup excel
---

Lately I've been working on my ["Budget Backup" VBA project](https://github.com/bskinn/excel-budgetbackup), which helps to organize the 'backup' files that I have to submit with proposal budgets.  These files map one-to-one with the itemized materials budget of each proposal, and so they need to be bookkept in the same order. Prior to putting it together, I had to manually curate these files, with involved a *LOT* of painfully slow renaming. The tool handles all of the numbering and renaming automatically.

{% include img.html path="vba/budgetbackup_form_general.png" alt="View of Budget Backup form" width="350px" clicknote="1" %}

In addition, I have to submit an Excel sheet with the backup files summarizing the overall cost.  The tool handles this for me, too; I've defined a standard syntax for the filenames that the tool can parse and extract the vendor, description, unit price, quantity, etc., to use to populate the summary sheet.

Overall, the thing takes an hour(s)-long process and reduces it to at most an hour of work.  *Soooo* handy.

As I have the `UserForm` implemented currently, whenever I make any sort of change to the ordering of the backup files (e.g., clicking `Insert`), I clear the contents of the `Included` and `Excluded` listboxes and then rebuild them from scratch (this is actually surprisingly fast): 

```
LBxExcl.Clear
LBxIncl.Clear

{scan the work folder}

{repopulate the lists}
```

One implication of this approach is that I have to store and retrieve both the view position and the currently selected item for both listboxes, or else every time I made a change (a) the views of both lists would return to the top and (b) the selections in both lists would be cleared. To do this, I use four storage variables:

```
exclIdx = LBxExcl.ListIndex
inclIdx = LBxIncl.ListIndex

exclView = LBxExcl.TopIndex
inclView = LBxIncl.TopIndex
```

It's then relatively straightforward to restore view and selection after the repopulation, bearing in mind that the number of items in either list might have decreased (`wsf` is a form-level global, bound to `Application.WorksheetFunction`):

```
LBxExcl.ListIndex = wsf.Min(exclIdx, LBxExcl.ListCount - 1)
LBxIncl.ListIndex = wsf.Min(inclIdx, LBxIncl.ListCount - 1)
LBxExcl.TopIndex = exclView
LBxIncl.TopIndex = inclView
```

Up until yesterday, I had just been declaring `exclIdx`, `exclView`, etc. as form-level global variables.  Then, it occurred to me to check whether VBA supports static variables---which [it does](https://bettersolutions.com/vba/variables/static-variables.htm)! So, [now these guys are `Static`](https://github.com/bskinn/excel-budgetbackup/blob/724ace643f50b5b189173ccc6a7a505bbad68c0d/src/FrmBackupSort.frm#L135-L136) within the list repopulation method. Much better!

