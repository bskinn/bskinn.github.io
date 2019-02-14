---
layout: post
title: 'KSotD (Word): (Un-)Group Objects -- Ctrl+Alt(+Shift)+G'
tags: ksotd word
---

I put a lot of figures, charts, photos, etc. in the various reports and proposals and whatnot that I write for work. Pagecount often isn't an issue for reports, so there I can add figures inline with text and it really doesn't matter if there's a lot of whitespace hovering around.  However, the page limit usually is pretty low and *extremely* strict for proposals.  Thus, using floating figures with relatively tight text wrapping is a *must*.

Now... figures have legends, and efficient placement of figure-plus-legend on the page means grouping the figure with its legend. As well, sometimes figures are a composite of multiple Word `Shape` objects and thus those figure components must *also* be grouped.  It's not ***that*** bad to hit the grouping commands by mouse (one right- and two left-clicks), and there are old-style keyboard shortcuts that do work (e.g., <kbd>{% include contextbutton.html %}</kbd>-<kbd>G</kbd>-<kbd>G</kbd> to group objects). However, being me, I want single keystrokes for both group and ungroup. 

So, I set out trying to define them. Curiously, though both the Group and Ungroup commands are available in the Ribbon (`Drawing Tools` > `Format` > `Arrange` > `Group`), they don't show up in the list of commands when assigning keyboard shortcuts. So, I had to write macro versions:

```
Sub GroupShapes()
    On Error Resume Next
        Selection.ShapeRange.Group
    Err.Clear: On Error GoTo 0
End Sub

Sub UnGroupShapes()
    On Error Resume Next
        Selection.ShapeRange.Ungroup
    Err.Clear: On Error GoTo 0
End Sub
```

Pretty straightforward, really. The error handling is to cope with cases where grouping/ungrouping isn't possible, such as when text is selected or if a 'group' operation is attempted and only one item is selected.  The syntax is meant to resemble a try-catch block from other languages; here, since I just want to do nothing if a group/ungroup isn't feasible, I don't worry about actually catching the error. In other cases, I do something more like this:

```
Dim errNum as long

On Error Resume Next
    ' do questionable thing
errNum = Err.Number: Err.Clear: On Error GoTo 0

Select Case errNum
' handle cases
End Select
```

In any event, I bound `GroupShapes` to <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>G</kbd> and `UnGroupShapes` to <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>Shift</kbd>+<kbd>G</kbd>, and ... &#128077;.