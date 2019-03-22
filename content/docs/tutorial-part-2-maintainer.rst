---

title: "Tutorial 2: Maintainer"
date: 2019-02-05T18:12:34+01:00
markup: rst
weight: 5

---

===========================
Tutorial 2: Maintainer
===========================

*Part 2 of this tutorial walks through how to setup a project as a Maintainer. We'll use the Radicle Garden project again as an example, however, this time you'll need to find a friend to play the contributor role if want to see the entire workflow in action.*


Creating the Radicle Garden & managing contributions
====================================================

Now that we've shown off our green thumb in part 1, let's see what happens on the other side of the collaboration by walking through how the Radicle Garden project was created and how contributions are managed as a maintainer.

First we need to create a Radicle project. To do that we'll run ``$ rad project init``
and choose a project name.

*Note that the project is created in our current working directory.*

::

  $ mkdir acme && cd acme
  $ rad project init
  ? What's the name of your project (Default: acme)? acme
  ? Briefly describe your project? This is my description
  ? What kind of repository would you like to use?
  1. New peer-to-peer repository (git-ipfs **EXPERIMENTAL**)
  2. Add your own remote (e.g.: github / gitlab / ...)
      (see www.radicle.xyz/docs/#git-integration for more info)

We're going to choose option 1 to create a P2P repo distributed using IPFS. When we do, we'll see the following:

::

  => Assembled rad-issue machine
  => Assembled rad-patch machine
  => project id: 12D3KooW...
  => adding "origin" remote: ipfs://ipns/12D3KooW...
  [master (root-commit) e3f2a9a] Radicle Setup
  Resolving IPNS name 12D3KooW...
  Pushed 1 objects
  Updating IPNS link 12D3KooW... to /ipfs/12D3KooW...
  To ipfs://ipns/12D3KooW...
  * [new branch]      master -> master
  Branch 'master' set up to track remote branch 'master' from 'origin'.
  => project created!

Now we're setup with everything we need to collaborate: a git repo, issues, and proposals.

If we'd like to invite others to contribute, we'll need to give them our project-id, which we can see with:

::

  $ rad project show-id
  => 12D3KooW...
  => Share this project id for people to collaborate with you on your project.

Let's say a collaborator already proposed a patch using the steps outlined in the first section of this guide.
We can see a list of all proposed patches, as well as the status of each patch, with ``$ rad patch list``.
Per default the command only shows patches of state pending. For further options for the list command,
check out the cli reference.

::

  $ rad patch list
  state     #   commit                       author     updated
  pending   2   [PATCH] Plant a few flowers  jane doe   2019-03-04T17:48:28Z *

  3 patches: 1 accepted, 1 pending, 1 rejected

Then we can inspect the patch with:

::

  $ rad patch show <PATCH-NUMBER>
  pending 2 [PATCH] Plant a few flowers jane doe 2019-03-04T17:48:28Z *

  From b118c572a441a774d4577ccb68f67fcfacc58df2 Mon Mar 4 17:47:15 2001
  From: jane doe <jane@botanicals.xyz>
  Date: Mon, 4 Mar 2019 17:47:15 +0100
  Subject: [PATCH] Plant a few flowers

  ---
  2019-03-04_tulip.txt | 8 ++++++++
  ...

Maybe we'd like to add a comment to request additional changes:

::

  $ rad patch comment <PATCH-NUMBER> "Nice feature, but here is my comment..."
  Added comment to Patch <PATCH-NUMBER>

For local testing we can checkout the patch in a branch:

::

  $ rad patch checkout <PATCH-NUMBER>
  Switched to a new branch 'patch/<PATCH-NUMBER>'
  Applying: [PATCH] Plant a few flowers

And then we can either reject the proposal:

::

  $ rad patch reject <PATCH-NUMBER>
  Patch <PATCH-NUMBER> has been rejected

or accept it:

::

  $ rad patch accept <PATCH-NUMBER>
  Merging proposal <PATCH-NUMBER> with master

Let's check the proposal status one more time to confirm:

::

  $ rad patch list -s accepted
  state     #  commit                       author     updated
  accepted  2  [PATCH] Plant a few flowers  jane doe   2019-03-05T08:27:04Z
  accepted  0  Sewing seeds                 jane doe   2019-03-01T16:49:28Z

  3 patches: 2 accepted, 1 rejected

That's it!

🌻
