---

title: "Tutorial Part 2: Maintainer"
date: 2019-02-05T18:12:34+01:00
markup: rst
weight: 4

---

===========================
Tutorial Part 2: Maintainer
===========================

Creating the Radicle Garden & managing contributions
====================================================

====== explain that this isn't something you can't go through

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

  Initialised empty Git repository in ~/acme/.git
      adding "origin" remote: ipfs://QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG

  => Assembled rad-issues machine => Assembled rad-diff machine

  Your project id is 554179. See the id of your project by running:
      rad project show-id
  Run --help to get started
      rad issue --help rad diff --help

Now we're setup with everything we need to collaborate: a git repo, issues, and proposals.

If we'd like to invite others to contribute, we'll need to give them our project-id, which we can see with:

::

  $ rad project show
  <PROJECT-ID>

Let's say a collaborator already proposed a diff, using the steps outlined in the first section of this guide. We can see a list of all proposed diffs, as well as the status of each diff, with ``$ rad diff list``.

::

  $ rad diff list
  state      diff #    commit                               author        updated         
  pending    3f9e302   Make documentation more accessible   jane doe      2019-01-25 13:27

Then we can inspect the diff with:

::

  $ rad diff show <DIFF-NUMBER>
  (pending) [jane doe] 3f9e302 - Sewing seeds | <DIFF-NUMBER>

  created at 2019-01-22T09:32:37Z

  From 3f9e302ef68c74251c49cd4d1bf17452b713620 Mon Sep 17 00:00:00 2001
  From: jane doe jane@doe.com
  Date: Wed, 16 Jan 2019 10:35:58 +0000
  Subject: Sewing seeds

  Description of the feature
  ---
  garden3.txt | 8 ++++++++
  1 file changed, 8 insertions(+)
  // ...

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
  state      diff #    commit           author        updated           
  accempted  3f9e302   Sewing seeds     jane doe      2019-01-25 13:27  

That's it!

🌻

