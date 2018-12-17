---
layout: post
title: 'KSotD (Word): Rotate Highlight Color -- Ctrl+Alt+Shift+H'
tags: ksotd word
---

When writing just about anything, I use highlights heavily for a variety of reasons: marking something that needs more attention later, flagging things for someone else to look at, tagging placeholders for figure references and whatnot, whatever.  As of Office 2010, Word supports a handful of highlight colors; enough for what I need, but altogether fewer than I'd like:

{% include img.html path="ksotd/CAS_H-1.png" alt="Highlight colors menu" %}

One of my biggest frustrations with highlights for quite a while was the really klunky keyboard shortcut setup. You'd have to navigate through the Ribbon with individual keystrokes: start with <kbd>Alt</kbd>-<kbd>H</kbd>-<kbd>I</kbd> to access the highlight options, then navigate to the desired color with the cursor keys and hit <kbd>Enter</kbd> to apply the highlight.  Really slow, and really annoying, so most of the time I just clicked through I wanted something better.

So, I wrote the following macro and [bound it]({% post_url 2018-06-27-KSotD-Custom-Word-Shortcuts %}) to <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>Shift</kbd>+<kbd>H</kbd>:

```
Sub RotateHighlight()
'
' Rotates highlighting of selected text, including removal of the highlight.
'
' A side-effect of this construction: if the selection includes text whose
'  highlighting is not uniform, all highlighting is removed from the selection.
'

    Select Case Selection.Range.HighlightColorIndex
    Case wdYellow
        Selection.Range.HighlightColorIndex = wdBrightGreen
    Case wdBrightGreen
        Selection.Range.HighlightColorIndex = wdTurquoise
    Case wdTurquoise
        Selection.Range.HighlightColorIndex = wdRed
    Case wdNoHighlight
        Selection.Range.HighlightColorIndex = wdYellow
    Case wdRed
        Selection.Range.HighlightColorIndex = wdPink
    Case wdPink
        Selection.Range.HighlightColorIndex = wdGray25
    Case Else
        Selection.Range.HighlightColorIndex = wdNoHighlight
    End Select
    
End Sub
```

With it, just select whatever text you want highlighted, press the shortcut key however many times, and boom: highlighted.  Further, if you want to remove the highlighting from anything, just select the highlighted text plus a bit of additional content before/after it and then press the shortcut key.

