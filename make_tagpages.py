from pathlib import Path
import re
import sys

# Regex to extract the tags list
p_yamltags = re.compile(r"""
    ---\n
    ([^\n]*\n)*?
    tags:(?P<tags>[^\n]*)\n
    ([^\n]*\n)*?
    ---\n
    """, re.X | re.I)

# Template for tag page .md files
s_tagpage = """\
---
layout: tagpage
title: 'Tag: {0}'
tag: {0}
---
"""

def main():
    base = Path().resolve()

    # Find the repo root, in case not executed there
    while (not (base / '_tagpages').exists()
           and not base == base.parent):
        base = base.parent

    # This ensures it didn't crash through to the root,
    # also also is a sanity check
    if not (base / '_tagpages').is_dir():
        print("Cannot find '_tagpages' directory")
        sys.exit(1)

    # Sanity check also
    if not (base / '_posts').is_dir():
        print("Cannot find '_posts' directory")
        sys.exit(1)

    # Useful dirs
    tpdir = base / '_tagpages'
    postdir = base / '_posts'

    # Scrub tag pages in case a tag got eliminated
    for f in (_ for _ in tpdir.iterdir() if str(_).endswith('.md')):
        f.unlink()

    # Search the _posts for all tags. Set behavior handy here.
    taglist = set()
    for f in (_ for _ in postdir.iterdir() if str(_).endswith('.md')):
        m = p_yamltags.search(f.read_text())
        taglist = taglist | set(m.group('tags').strip().split(' '))

    # Write each tag page's .md
    for t in taglist:
        p = tpdir / '{}.md'.format(t)
        p.write_text(s_tagpage.format(t))


if __name__ == '__main__':
    main()
