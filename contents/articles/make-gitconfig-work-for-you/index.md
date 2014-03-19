---
title: Make .gitconfig Work for You
date: 19 March 2014
template: article.html
---

[Git](http://git-scm.com) has undoubtedly become one of the most important tools within any Web Developer's bag of tricks, arguably due to amazing success of [GitHub](http://github.com). Unfortunately, Git can be quite overwhelming - particularly for those developers new to *distributed* version control systems.

This complexity leads some developers to seek out graphical Git clients to assist them in managing their workflow correctly. Although there are a great number of excellent GUI-based clients, I've always enjoyed using the command line instead. It's through the command line tools that Git's true power, and flexibility, shine through and today I'd like to discuss one of Git's strongest "utilities": the `.gitconfig` file.

A `.gitconfig` file can reside in up to three locations within your filesystem, the location determining the scope in which the file's contents are considered:

* Global (`~/.gitconfig`): The most common use, establishes global configuration options for a particular user.
* System (`/etc/.gitconfig`): Rarely used, establishes configuration options for the entirety of the local system (all users on this computer).
* Local (`~/Projects/this-project/.gitconfig`): A the repository level, establishes configuration options that only affect this repository. If this file were committed, the settings contained within would impact all users that clone this repository.

Since we're primarily interested in making configuration changes that will make our own lives easier, without affecting other users, we'll focus on the global `.gitconfig` file. You should first check to see if you have a `.gitconfig` file within your home directory and create one if you do not (Unix commands provided, Windows users should make the appropriate modifications as necessary):

```shell
$ cat ~/.gitconfig
cat: /Users/mike/.gitconfig: No such file or directory

$ touch ~/.gitconfig
```


## Common Endpoint Shortcuts

Although GitHub is by far the most popular place to host a repository there are a number of other options. [BitBucket](http://bitbucket.org) is a popular provider for many businesses, primarily because their pricing model focuses on number of users rather than if a repository is public or private (in other words, unlimited free private repositories). [Gist](http://gist.github.com), a GitHub service, is great for hosting quick snippets of code that don't really need to be associated with a huge project - each snippet is its own fully functional repository.

Throughout the course of a day, I could be interacting with repositories from a number of providers. Having to type out the full URL, and undoubtedly fat-fingering those URLs a few times, would not only be a huge annoyance but could actually kill off a few precious minutes each and every day. Fortunately, we can configure shortcuts within our `.gitconfig` file using the `url.insteadOf` setting. In the following examples, I have configure the `gh:`, `bb:` and `gist:` shortcuts to point to their full URL:

```ini
[url "https://github.com/"]
    insteadOf = gh:

[url "https://gist.github.com/"]
    insteadOf = gist:

[url "https://bitbucket.org/"]
    insteadOf = bb:
```

With this configuration in place, here's how I would then clone a few example repositories (notice how I'm only having to concern myself with the namespace and project name of the repository I am cloning):

```shell
$ git clone gh:walesmd/walesmd.github.io

$ git clone gist:walesmd/7315613

$ git clone bb:walesmd/codeigniter-erkana-auth
```


## Colored Output

If you've put a lot of hard work into building out the perfect shell prompt, like I have (a topic for a future post) you may find Git's monochromatic responses to be a bit dull. Not only does coloring provide an aesthetic appeal it can prove to be quite functional as well. We instinctively associate the color green with success or that everything is okay; inversely, red indicates a warning or a problem. I've configured a number of various colors within my own `.gitconfig` to help me easily identify changes to a repository, identify branches and more.

```ini
[color]
    ui = true

[color "branch"]
    current = yellow reverse
    local = yello
    remote = green

[color "diff"]
    meta = yellow bold
    frag = magenta bold
    old = red bold
    new = green bold

[color "status"]
    added = yellow
    changed = green
    untracked = red
```


## Aliases

My first introduction to distributed version control was with [Mercurial](http://mercurial.selenic.com/), whose commands come with a number of shortcuts (`ci` for commit, `br` to list branches, etc). A number of these shortcuts were muscle memory by the time I made the transition to Git, so I needed a way to port these various shortcuts over. Once again, Git promises to deliver in the form of aliases.

You may have seen various aliases provided in other articles, typically in the form of a single command within your shell. `git config --global alias.ci commit`, for example creates a new alias (`ci`) associated with `commit`. But, did you know these commands aren't doing anything that special or magical to your Git environment? In fact, `git config` is simply a command to read and write to various config files, `.gitconfig` included (and with the `--global` switch, we make sure we're editing `~/.gitconfig`).

Below I've provided a number of my favorite aliases, with inline comments to futher explain those that may be a bit confusing. As you review this list, take note of any alias definitions that are preceded by a `!`. This tells git to run that entire command is if it had been entered directly within a shell and is required if you are piping results or running multiple commands:

```ini
[alias]
    # Add and remove all changes, note how this alias is calling another alias
    addremove = !git r && git add . --all

    # Show all of my configured aliases
    aliases = !git config --list | grep 'alias\\.' | sed 's/alias\\.\\([^=]*\\)=\\(.*\\)/\\1\\ \t => \\2/' | sort

    # For when you made that commit a bit too early, amend
    amend = !git log -n 1 --pretty=tformat:%s%n%n%b | git commit -F - --amend

    # Show all branches
    br = branch -av

    # Show the current branch name (usefull for shell prompts)
    brname = !git branch | grep "^*" | awk '{ print $2 }'

    # Delete a branch
    brdel = branch -D

    # Which files are receiving the most "love"
    churn = !git log --all -M -C --name-only --format='format:' "$@" | sort | grep -v '^$' | uniq -c | sort | awk 'BEGIN {print "count,file"} {print $1 "," $2}'

    # View the log and diff for a commit (previous if no SHA1 provided)
    details = log -n1 -p --format=fuller

    # Save a repo as a tarball
    export = archive -o latest.tar.gz -9 --prefix=latest/

    # Unstage changes from the index
    unstage = reset HEAD --

    # View a pretty git log with branch tree
    g = !git log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit --date=relative

    # Return a list of commit SHA1s
    l = "!f() { git log $* | grep '^commit ' | cut -f 2 -d ' '; }; f"

    # Remove deleted files
    r = !git ls-files -z --deleted | xargs -0 git rm

    # Return the repository's root directory (usefull for shell prompts)
    root = rev-parse --show-toplevel

    # Update all submodules
    subup = submodule update --init

    # List all tags
    tags = tag -l

    # Start a new local repository and perform initial commit
    this = !git init && git add . && git commmit -m \"Initial commit.\"

    # Thin out older metadata within the repository, reduceses filesystem footprint
    trim = !git reflog expire --expire=now --all && git gc --prune=now
```

## My Complete `.gitconfig`

I haven't covered every single entry within my `.gitconfig` file, just what I believe have been some of the most helpful changes I've made. If you're interested in reviewing my entire file, I present to you:

```ini
[alias]
    addremove = !git r && git add . --all
    aliases = !git config --list | grep 'alias\\.' | sed 's/alias\\.\\([^=]*\\)=\\(.*\\)/\\1\\ \t => \\2/' | sort
    all = add . --all
    amend = !git log -n 1 --pretty=tformat:%s%n%n%b | git commit -F - --amend
    br = branch -av
    brname = !git branch | grep "^*" | awk '{ print $2 }'
    brdel = branch -D
    ci = commit
    changes = "!f() { git log --pretty=format:'* %s' $1..$2; }; f"
    churn = !git log --all -M -C --name-only --format='format:' "$@" | sort | grep -v '^$' | uniq -c | sort | awk 'BEGIN {print "count,file"} {print $1 "," $2}'
    co = checkout
    details = log -n1 -p --format=fuller
    export = archive -o latest.tar.gz -9 --prefix=latest/
    unstage = reset HEAD --
    g = !git log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit --date=relative
    in = pull --dry-run
    l = "!f() { git log $* | grep '^commit ' | cut -f 2 -d ' '; }; f"
    out = log --branches --not --remotes
    r = !git ls-files -z --deleted | xargs -0 git rm
    root = rev-parse --show-toplevel
    st = status
    subup = submodule update --init
    tags = tag -l
    this = !git init && git add . && git commit -m \"Initial commit.\"
    trim = !git reflog expire --expire=now --all && git gc --prune=now

[credential]
    helper = osxkeychain

[color]
    ui = true

[color "branch"]
    current = yellow reverse
    local = yellow
    remote = green

[color "diff"]
    meta = yellow bold
    frag = magenta bold
    old = red bold
    new = green bold

[color "status"]
    added = yellow
    changed = green
    untracked = red

[core]
    autocrlf = input
    compression = 9
    excludesfile = ~/.gitignore_global
    filemode = false

[diff]
    mnemonicprefix = true

[merge]
    log = true
    ff = false

[push]
    default = simple

[url "https://bitbucket.org/"]
    insteadOf = bb:

[url "https://github.com/"]
    insteadOf = gh:

[url "https://gist.github.com/"]
    insteadOf = gist:

[user]
    name = Michael Wales
    email = webmaster@michaelwales.com
```
