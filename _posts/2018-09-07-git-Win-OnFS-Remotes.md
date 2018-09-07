---
layout: post
title: 'git: Working with On-Filesystem Remotes in Windows'
tags: git
---

I do some development work in Linux, but the majority of the time I'm working on a Windows machine, especially at the office, where there's no Linux to be found at all. Thus, I have to figure out how to make all of my tooling behave properly in Windows.  Like a good dev, I'm source-controlling everythng I can, for the usual dual purposes of history tracking and code backup.  git is my source-control tool of choice---and FWIW, I'm a big fan of the Git Bash that's integrated into [Git for Windows](https://gitforwindows.org/), as it exposes quite a few of the handy *nix CLI tools that I'm familiar with, while behaving well interacting with the underlying Windows system.

Since most of the coding I'm doing for work isn't for public consumption, public repos (e.g., on GitHub) aren't an option.  Private repos that come with a paid GH account would be one solution, but to date I've not needed to collaborate externally and so there's no specific need to have the repos available outside our network, and thus no particular need to pay for that particular service.

So, (I think) I've figured out a pretty good way to set up remotes for git that live on our internal server.  In the course of doing so, I've run into (what appear to be) some interesting quirks/limitations of Git for Windows in terms of accessing network locations.

The first step is to create the repo in the working folder:

```
Brian@PC MINGW64 ~
$ cd /c/path/to/workfld

Brian@PC MINGW64 /c/path/to/workfld
$ git init .
Initialized empty Git repository in C:/path/to/workfld/.git/
```

So as to have something in the repo to push to the as-yet-uncreated intranet remote, I'll create a test file and commit it locally:

```
Brian@PC MINGW64 /c/path/to/workfld (master)
$ echo "TEST FILE" > testfile.txt

Brian@PC MINGW64 /c/path/to/workfld (master)
$ git add .

Brian@PC MINGW64 /c/path/to/workfld (master)
$ git commit -m "Test file"
[master (root-commit) d979da4] Test file
 1 file changed, 1 insertion(+)
 create mode 100644 testfile.txt
```

Now, create the `origin` repo, either on a local or network drive.  Since I want to house `origin` where (1) I can get to it from any computer in the building, and (2) where I can take advantage of IT's automated backup protocols, I've basically always hosted my `origin`s on the network.  This is where one of Git for Windows's quirks pops up. **To the best of my ability to determine, Git for Windows is only able to access network locations that are *mapped to drive letters*.** So, say my desired `origin` location is on the J: drive---create a `--bare` repo to serve as `origin`, so that it takes up less space and has a cleaner presence on the network drive:

```
Brian@PC MINGW64 /c/path/to/workfld (master)
$ cd /j/path/to/origin

Brian@PC MINGW64 /j/path/to/origin
$ git init --bare work.git
Initialized empty Git repository in J:/path/to/origin/work.git/
```

Now, navigate back to the local repo and add the new repo on the network as the `origin` remote:

```
Brian@PC MINGW64 /j/path/to/origin
$ cd /c/path/to/workfld

Brian@PC MINGW64 /c/path/to/workfld (master)
$ git remote add origin "J:/path/to/origin/work.git"

Brian@PC MINGW64 /c/path/to/workfld (master)
$ git remote show origin
* remote origin
  Fetch URL: J:/path/to/origin/work.git
  Push  URL: J:/path/to/origin/work.git
  HEAD branch: (unknown)
```

For whatever reason,  git likes **forward** slashes as the path separator here, despite the Windows-style drive path syntax (`J:`).  IIRC, I first tried using escaped backslashes and that bombed.  The double-quotes around the path of the remote repo may not be necessary when the path doesn't include spaces, but I make a habit of always double-quoting here so that I don't need to think about it.

The `master` branch in the local repo can then be linked to `master` in the remote via the usual `--set-upstream` approach:

```
Brian@PC MINGW64 /c/path/to/workfld (master)
$ git push --set-upstream origin master
Counting objects: 3, done.
Writing objects: 100% (3/3), 234 bytes | 0 bytes/s, done.
Total 3 (delta 0), reused 0 (delta 0)
To J:/path/to/origin/work.git
 * [new branch]      master -> master
Branch master set up to track remote branch master from origin.

Brian@PC MINGW64 /c/path/to/workfld (master)
$ git remote show origin
* remote origin
  Fetch URL: J:/path/to/origin/work.git
  Push  URL: J:/path/to/origin/work.git
  HEAD branch: master
  Remote branch:
    master tracked
  Local branch configured for 'git pull':
    master merges with remote master
  Local ref configured for 'git push':
    master pushes to master (up to date)
```

And that's it!  The intranet remote now should behave just like any other remote.

If the network location of the remote should change, I've found it easier to manually edit the remote entry in `.git/config`, rather than trying to use `git remote` on the commandline:

```
Brian@PC MINGW64 /c/path/to/workfld (master)
$ cd .git

Brian@BrianXPS MINGW64 /c/jupy/deleteme/.git (GIT_DIR!)
$ cat config
...
[remote "origin"]
        url = J:/path/to/origin/work.git            <----- EDIT HERE
        fetch = +refs/heads/*:refs/remotes/origin/*
[branch "master"]
        remote = origin
        merge = refs/heads/master
```

{% include stackedit.html %}

