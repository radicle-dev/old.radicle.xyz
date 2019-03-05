---

title: "Tutorial Part 2: Maintainer"
date: 2019-02-05T18:12:34+01:00
markup: rst
weight: 4

---

===========================
Tutorial Part 2: Maintainer
===========================

*Part 2 of this tutorial walks through how to setup a project as a Maintainer. As an example, we'll be using the Radicle Garden again, however in this instance we won't have a contributor on the other side, so while we'll explain the steps, you may have to get a friend to act as a contributor if you'd like to see this entire workflow in action.*


Creating the Radicle Garden & managing contributions
====================================================

Now that we've shown off our green thumb, let's see what happens on the other side of the collaboration by seeing how the Radicle Garden project was created and how to manage contributions as a maintainer.

First we need to create the Radicle project. To do that we'll run ``$ rad project init`` and choose a project name.

::

  $ rad project init
  ? What's the name of your project (Default: acme)? acme
  ? Briefly describe your project? This is my description
  ? What kind of repository would you like to use?
  1. New peer-to-peer repository (git-ipfs **EXPERIMENTAL**)
  2. Add your own remote (e.g.: github / gitlab / ...)
      (see radicle.xyz/docs/storage for more info)

We're going to choose option 1 to crate a P2P repo that's distributed with IPFS. When we do, we'll see the following:

::

  => Assembled rad-issue machine
  => Assembled rad-diff machine
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
  => 12D3KooWDdviavVJx13oZ7RFiuVNYoNzRAaE8GawoKYNDKHBQYqK
  => Share this project id for people to collaborate with you on your project.

Let's say a collaborator already proposed a diff, using the steps outlined in the first section of this guide. We can see a list of all proposed diffs, as well as the status of each diff, with ``$ rad diff list``.

::

  $ rad diff list
  state      diff #    commit                               author        updated
  pending    3f9e302   Make documentation more accessible   jane doe      2019-01-25 13:27

Then we can inspect the diff with:

::

  $ rad diff show <DIFF-NUMBER>
  accepted 0 Sewing seeds jane doe 2019-03-04T16:49:28Z

  From b118c572a441a774d4577ccb68f67fcfacc58df2 Mon Sep 17 00:00:00 2001
  From: jane doe <jane@doe.xyz>
  Date: Mon, 4 Mar 2019 17:47:15 +0100
  Subject: [PATCH] Sewing seeds

  ---
  mygarden.txt | 8 ++++++++
  ...

Maybe we'd like to add a comment to request additional changes:

::

  $ rad diff comment <DIFF-NUMBER> "Nice feature, but here is my comment..."
  Added comment to Diff <DIFF-NUMBER>

And then we can either reject the proposal:

::

  $ rad diff reject <DIFF-NUMBER>
  Diff <DIFF-NUMBER> has been rejected

or accept it:

::

  $ rad diff accept <DIFF-NUMBER>
  Merging proposal <DIFF-NUMBER> with master

Let's check the proposal status one more time to confirm:

::

  $ rad diff list
  state     diff #  commit        author    updated
  accepted  2       Sewing seeds  jane doe  2019-01-25 13:27

That's it!

🌻

