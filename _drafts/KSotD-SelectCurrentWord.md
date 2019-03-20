---
layout: post
title: 'KSotD (Word): Select Current Word -- Ctrl+Alt+W'
tags: ksotd word
---

The default Word keyboard shortcuts for cursor movement usually work pretty well for me.
I realized today that one thing that's really been bugging me is the inefficiency of
selecting the word under the cursor using only the keyboard. I find that I'm often
wanting to select a specific word to then, e.g., toggle its highlight with my
<kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>Shift</kbd>+<kbd>H</kbd>
[custom macro]({% post_url 2018-12-18-KSotD-Cycle-Highlight %}). With the mouse, a simple
double-left-click is all that's needed; with the keyboard, though, unless there's
a shortcut/command I don't know about, I have to:

 1. Jump to the start of the word with <kbd>Ctrl</kbd>+<kbd>&#129056;</kbd>

 2. Select the whole word with <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>&#129058;</kbd>

 3. If the word is followed by a space, deselect that space with <kbd>Shift</kbd>+<kbd>&#129056;</kbd>

The muscle memory for this is pretty well established by now, but ... there has to be a better way.
So: ***Macro time!***

I slapped together the following and assigned <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>W</kbd> to it,
which AFAICT is unbound by default:

```
Sub SelectCurrentWord()

    Dim rxSpace As New RegExp

    With rxSpace
        .Global = False
        .IgnoreCase = True
        .MultiLine = False
        .Pattern = "\W"
    End With

    Selection.Expand wdWord

    Do While rxSpace.Test(Selection.Characters(Selection.Characters.Count))
        Selection.MoveEnd wdCharacter, -1
    Loop

End Sub
```

The bulk of the work is done by the built-in `Selection.Expand wdWord`, which expands both the start
of the selection backward to the nearest start-of-word boundary and the
end of the selection forward to the nearest *start*-of-word boundary.  This latter behavior
leads to an annoying result due to how Word structures word boundaries.  If I interpret things
correctly, Word treats at least the following as the start of a word:

 * (Most?) punctuation characters, *including* tabs
 * The first letter of a grouping of letters following whitespace

So, when executed with the cursor within a word in the middle of a sentence, `Selection.Expand wdWord`
expands the selection to *include* the whitespace following that word.

&#128544;

I'm pretty sure I basically *never* want this behavior. Thus, enter the regex and the while loop.
The `\W` regex pattern [matches a single non-word character](https://www.regular-expressions.info/shorthand.html),
and I used a `Do While` instead of a simple `If` so that cases with multiple whitespace characters
are handled properly.

If I end up using this regularly, will probably end up creating similar macros and
keyboard shortcuts to select the current sentence (<kbd>Ctrl</kbd>+**FINISH THIS**