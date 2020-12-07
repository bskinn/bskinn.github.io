First post is high level; subsequent posts dig into individual step(s).

- Why do this at all?
  - Initially:
    - Learn GH Actions
    - Survey f8 entrypoints namespaces
      - Own information
      - Maybe provide something useful to others
    - Familiarize with PyPI JSON API
      - (Helped with the PR for `latest` web and JSON views)
  - Eventually:
    - Learn basics of tweepy, enough to make a basic posting bot
    - Publish an RSS feed, anticipated to be more useful, or
      complementarily useful, to the Twitter bot outlet

- High level
  - It's a bot, driven by GHA, so want it to:
    - Run on a timer on the primary branch to carry out all the production
      activities
      - GHA first-class support for a cron trigger is really nice
    - NOT run on pushes to primary branch, to ... why?
      - Keep a cleaner timeline on master?
      - Chance of mucking up data stream on master with a bad push/PR?
    - DO run on pushes to other branches (with exception added in for
      the `noaction-` branches), but don't apply anything permanent to
      the repo
  - Uses Python and bash, so best to run on Linux
    - Motivation for mixed Python/bash is apparent at this high level,
      so mention here
      - Essentially, many of the file system interactions (???) are
        simply done in bash, so no real need to get the Python
        machinery involved.
      - Some specific requirements in the scripts... pip, especially...
        can only be run from the shell, no public API
  - Useful "[skip ci]" detector on the job, to mimic Travis's behavior
    - Tag added to the commit with the link
  - Steps (starred can probably be written up in the initial post?
    Or maybe in some sort of "housekeeping" post? Doesn't really make
    sense to have one post for both the prologue and the epilogue, though)
    - Configure the environment
    - Prepare the filesystem
    - Update data for available packages
    - Inspect the entrypoints exposed in the available packages
      - Lots of detail in this sub-post
    - Render the markdown tables
      - Mention of templates and jinja2
      - markdown_table used to easily generate the tables
    - "Post tweets"
      - Concerns are poorly segregated here... this step
        identifies new/updated packages, bundles the RSS JSON for
        these packages, and does the tweeting (w/tweepy)
      - Much better to have this step be "process new/updated packages",
        writing what's needed for both the tweeting and the RSS,
        which will then be their own separate steps
    - Generate RSS feed
      - Feedgen
      - Two-fold staling condition for RSS items (old items are dropped as
        long as both criteria are true)
        1. Oldest item is older than 30 days
        2. More than 50 items in the feed
  - Cleaning/bundling up the directory structure (multiple steps)
  - Reporting and committing back to repo
    - Commit only happens on master


- Packages used
  - `grep import *.py | sed -r 's/^[^:]+:(.+)$/\1/' | sed -r 's/^import +(.+)$/\1/' | sed -r 's/^from ([^ ]+) import ([^ ]+)/\1.\2/' | sort`
  - Stdlib
    - argparse
    - collections.namedtuple
    - datetime.timedelta
    - importlib.metadata
    - itertools
    - json
    - os
    - packaging.utils.canonicalize_version
    - packaging.version.Version
    - pathlib
    - re
    - sys
    - textwrap.dedent
    - time.sleep
    - time.strftime
  - PyPI
    - arrow
    - feedgen (.feed.FeedGenerator)
    - jinja2 (.Template)
    - markdown_table
    - opnieuw (.retry)
    - requests
    - tweepy