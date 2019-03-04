---

title: "Radicle Guide"
date: 2019-02-05T18:12:34+01:00
markup: rst

---

=============
Radicle Guide
=============

Welcome to the Radicle Garden, a new-found island located somewhere off the ASCII shores of `tilde.town <http://tilde.town/~troido/cadastre/town.html>`_. Today we're going to learn how to use the Radicle collaboration apps by adding a plot of our own to the `Radicle Garden <../garden>`_ map, then we'll walk through how the Radicle Garden project was created and steps for managing contributions as a maintainer.

Make sure you've got `Radicle installed <#installation>`_ and let's dig in.

Contribute to the Radicle Garden
================================

The Radicle Garden is a project created using Radicle, with a rendered output hosted found at https://radicle.xyz/garden. A Radicle project contains a git repository as well as the all the issues and proposals associated with that repo.

Before we start contributing, we'll need to download a copy to our computer by checking out the project. To do that we need the project-id: ``12D3KooWSeVNi5qTpDULRMR8UQhhQZfk4taUGRaLoLF7BgAAsUQW``, and then we'll run:

::

  $ rad project checkout 12D3KooWSeVNi5qTpDULRMR8UQhhQZfk4taUGRaLoLF7BgAAsUQW
    Cloning into ./acme/
    remote: Enumerating objects: 70, done.
    remote: Counting objects: 100% (70/70), done.
    remote: Compressing objects: 100% (40/40), done.
    remote: Total 1472 (delta 30), reused 60 (delta 22), pack-reused 1402
    Receiving objects: 100% (1472/1472), 4.71 MiB | 1.59 MiB/s, done.
    Resolving deltas: 100% (546/546), done.
    adding "origin" remote: ipfs://QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG

  Created ./adcme/.rad-config
  To list the project's issues, run:
    rad issue list

In the output shown above we can see that ``rad project`` uses git behind the scenes to clone the project from a remote repo hosted on IPFS into a new folder named after the project-id.

Let's learn a little more about this project by moving into the newly created directory with ``$ cd radicle-garden`` and then listing what's in the folder.

::

  $ ls -a
  .  ..  .git  garden1.txt  garden2.txt


As we can see, the Radicle project folder has a .git directly inside, like any other git repo.

Now let's take a look at what's in these garden text files:

::

  $ cat garden1.txt

                      
         %            
          \_          
          | %         
  ..-`-...l..-..~-`.,.
                      
                      
                       

Oh, very pretty.

::

  $ cat garden2.txt

               🌞
     ☁
     ____🐓_
  ---|     |---------
    /       \      🌵

          ~~
     🐍         ~~





What beautiful gardens! Each garden file contains an ASCII image. These images are combined to create the community garden page located at https://radicle.xyz/garden.

Like our git repo, Radicle stores issue and proposal chains locally and distributes them over the IPFS network. To look at a list of issues we'll run ``$ rad issue list`` while inside the git repo.

::

  $ rad issue list
  state    issue #   title                        author        updated         
  open     1         Diff proposal not accepted   juliendonck   2019-01-25 13:27

There's only one issue for this project at the moment. Let's take a closer look with ``$ rad issue show 1``.

::

  $ rad issue show 1
  Issue:  #1 Diff proposal not accepted
  Author: juliendonck
  Date:   Fri Nov 16 17:51:36 2018 +0100
  ---
  Description:
    I made a proposal to add my garden to the map, but when I run `rad diff list` the state is listed as rejected.

  ---
  Comments:
    <TODO> It looks like your garden doesn't have the correct dimensions. All gardens should be 20 characters wide and 8 lines high.

If we wanted to add another comment we could run $ rad issue comment ``<issue-number> <body>`` which would open the default editor, set with the $EDITOR environment variable.

Creating an issue works just like adding a git commit message—add text at the top and save the file to create the comment.

Now let's make our own garden by creating a new text file, ``$ touch mygarden.txt`` and open the file with your favorite editor.

As mentioned in the issue above, the text should fit in a box of 20 characters wide and 8 lines high.

-- TODO: should users be able to add metadata fields? that have, for instance, their own Radicle project address? Maybe visible with a hover function? --

Once we've planted a few vegatables and feel happy with our garden, we'll save the file and commit it to the repo using git.

::

  $ git status --short
  A messages/yyyy-mm-dd_username.txt

  $ git commit -am 'Sewing seeds' yyyy-mm-dd_username.txt
  [master 3f9e302] Sewing seeds
    1 file changed, 398 insertions(+)
    create mode 100644 yyyy-mm-dd_username.txt

Now let's propose our diff upstream using the git object id of our last commit, ``3f9e302``.

::

  $ rad diff propose 3f9e302
  Proposing <DIFF-ID> to <PROJECT-ID>

If we want to see the status of our diff we can do that with:

::

  $ rad diff list
  (pending) [<MY-NAME>] 3f9e302 - Super dope contribution | <DIFF-ID>

As long as our garden is the correct dimensions, it shouldn't take long for our proposed diff to be accepted and then we'll be able to see our garden on the map at https://radicle.xyz/garden.


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
