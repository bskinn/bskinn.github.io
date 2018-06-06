---
layout: post
title: 'Outlook VBA: Automatic Calendar Export'
tags: outlook vba
---

While I'm sure there's a way to set up Outlook and Google Calendar to sync in such a way that I can see my work schedule on GCal, I haven't figured out how yet. ([Suggestions welcome!](https://twitter.com/pylogging)) As a stopgap, I'm exporting my Outlook calendar to `.ics` and importing into a GCal dedicated to the purpose.

Outlook's VBA object model provides a straightforward way to accomplish this. I put together a quick macro to drop the calendar to a specific location, derived from the VB.NET instructions [here](https://msdn.microsoft.com/en-us/library/office/bb647583.aspx?cs-save-lang=1&cs-lang=vb#code-snippet-1):

```
Sub calExport()

    Dim ol As Outlook.Application
    Dim cal As Folder
    Dim exporter As CalendarSharing
    
    Set ol = Application
    Set cal = ol.Session.GetDefaultFolder(olFolderCalendar)
    Set exporter = cal.GetCalendarExporter
    
    With exporter
        .CalendarDetail = olFullDetails
        .IncludeAttachments = False
        .IncludePrivateDetails = False
        .RestrictToWorkingHours = False
        .IncludeWholeCalendar = True
        .SaveAsICal "C:\Path\To\Calendar.ics"
    End With

End Sub
```

The `.ics` file then imports cleanly into the Google Calendar. As far as I can tell, GCal is smart about not adding duplicate events, which is nice.

It's also pretty easy to set it up to email out the `.ics`. Instead of `.SaveAsICal`, use [`.ForwardAsICal`](https://msdn.microsoft.com/en-us/library/office/microsoft.office.interop.outlook._calendarsharing.forwardasical.aspx) to create a new `MailItem`, to configure and send:

```
    Dim mi As MailItem

    ...

    With exporter
        .
        .
        .
        set mi = .ForwardAsICal(olCalendarMailFormatEventList)
    End With

    With mi
        .Body = ""
        .To = "email@address.com"
        .Subject = Date & " " & Time & " Calendar"
        .Send
    End With
```

To inspect the message before it's queued into the *Outbox*, remove the `.Send` and populate a new `Inspector` with the `MailItem` instead:

```
    Dim insp As Inspector

    ...

    Set insp = ol.Inspectors.Add(mi)
    insp.Activate

```

Emailing out the `.ics` hasn't been that helpful for this purpose, though, as I haven't been able to figure out a way to trigger the GCal to import the calendar from the email payload.

