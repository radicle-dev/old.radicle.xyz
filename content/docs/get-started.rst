---

title: "Radicle Guide"
date: 2019-02-05T18:12:34+01:00
draft: true
markup: rst

---

=================
 Guide user flow
=================

The following flows capture what a user will learn when going through the code collaboration guide they will find under rad.xyz/docs/guide on the alpha website. It is assumed the user has a working setup of
radicle and the project, git and diff app installed.

Try radicle
===========

Welcome to radicle. Today we will teach you how you can contribute to someone else's project. After that we will guide you through setting up your own project and enabling others to contribute to your project.


How to contribute to a project
------------------------------

We've created a project for this guide where you will be adding your own message to `our community board <radicle.xyz/garden>`_. Before you can start contributing though, you'll have to get the project on your device.

To be able to get the communtity board project on your device, you'll need the project-id: ``<PROJECT-ID>``

::

  $ rad project checkout 98402842
  Cloning into ./<PROJECT-NAME>/
  remote: Enumerating objects: 70, done.
  remote: Counting objects: 100% (70/70), done.
  remote: Compressing objects: 100% (40/40), done.
  remote: Total 1472 (delta 30), reused 60 (delta 22), pack-reused 1402
  Receiving objects: 100% (1472/1472), 4.71 MiB | 1.59 MiB/s, done.
  Resolving deltas: 100% (546/546), done.
  adding "origin" remote: ipfs://ipns/12D3KooWLxcJZUqurFa2bkBcBv1piZnd5TNQWGHWLW95fQPGTcZv

  Created ./<PROJECT-NAME>/.rad-config
  To list the project's issues, run:
    rad issue list


You can see that this is using git to clone the project in a folder named after the project-name, using ipfs as the remote. What this also does is allow you to get the issues and diffs that are currently connected to this project.

Let's try that out. Start by changing into that newly created folder ``$ cd PROJECT-NAME``.
Then let's start by listing all the issues for the project, we can do that by running ``$ rad issue list``.

::

  $ rad issue list
  state    issue #   title                                author        updated
  open     1         How do I add to the community board  juliendonck   2019-01-25 13:27


As you can see there is only one issue there. Since it's talking about what we want to do, let's take a closer look at that issue. We can do that by running ``$ rad issue show 1``.

::

  $ rad issue show 1
  Issue:  #1 How do I add to the community board
  Author: juliendonck
  Date:   Fri Nov 16 17:51:36 2018 +0100
  ---
  Description:
    I'd like to contribute to the community board. How can I contribute.

  ---
  Comments:
    <TODO> add a comment that explains how to add a message to the board


Great. This person was trying to do the same thing as us and it seems like the maintainer of this project already commented on this issue with some steps to follow. You can use ``$ rad issue comment <issue-number> <body>`` to leave a comment or dive right in.

Start of by going into the 'messages' folder by running ``$ cd messages``. Then you're gonna create a new file with the date and a username (this username will be public), to do that you can run ``$ touch yyyy-mm-dd_username.txt``.

After that you can add your personal message. It should fit in a box of 20 characters wide and 8 lines high.

Some examples:

::

      ~+     *       +
   ()      '
      .-.,="````"=.   - o -
      '=/_         \
  *    |  '=._     |
        \     ``=./``,    '
      .  '=.__.=' ``=' *
    O      *        '   +


or

::

  ╔══════════════════╗
  ║                  ║
  ║                  ║
  ║                  ║
  ║                  ║
  ║                  ║
  ║            ~gino ║
  ╚══════════════════╝


Once you've created the file and added your message, save that file and commit it to the repo using git.

::

  $ git status --short
  A messages/yyyy-mm-dd_username.txt
  $ git add messages/yyyy-mm-dd_username.txt
  $ git commit -am 'Super dope contribution' yyyy-mm-dd_username.txt
  [master 3f9e302] Super dope contribution
    1 file changed, 398 insertions(+)
    create mode 100644 yyyy-mm-dd_username.txt


Once we have that, you'll want to propose your diff upstream using the git object id of the last commit (``3f9e302``).

::

  $ rad diff propose 3f9e302
  Proposing <DIFF-ID> to <PROJECT-ID>


If you want to see the status of your diff, you can do that by running ``$ rad diff list``.

::

  $ rad diff list
  state      #   commit                              author           updated
  state      #   commit                              author           updated
  pending    1   Super dope contribution             <AUTHOR-NAME>    2019-02-01T11:30


It shouldn't take too long for your proposed diff will be accepted and then you can check out your contribution on `radicle.xyz <radicle.xyz/garden.html>`_.



How to start your own project
-----------------------------

Now that you've gotten the hang how to contribute to other projects, let's take a look at starting your own project and how to enable others to contribute to it.

First of you're going to have to create a new radicle project, to do that first run ``$ rad project init`` and then choose a project name.

::

  $ rad project init
  ? What's the name of your project?
  Initialising project with name: <your-project-name>

  ✓ Assembled rad-repo machine
    Initialised empty Git repository in ~/<your-project-name>/.git
    adding "origin" remote: ipfs://QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG
  ✓ Assembled rad-issues machine
  ✓ Assembled rad-diff machine

  Your project id is 812396. See the id of your project by running:
    rad project show

  Run --help to get started
    rad issue --help
    rad diff --help


There you go, that sets you up with everything you need. If now you'd like to get some other to contribute, simply run ``$ rad project show`` and share the project id with them. They can then follow the steps in the `How to contribute to a project`_.

Now let's say they've proposed a new diff to the project, you can then proceed by running ``$ rad diff list`` to see them.

::

  state      diff #    commit                              author        updated            unread
  pending    3f9e302   Super dope feature                  jane doe      2019-01-25 13:27   *


You can then inspect that diff.

::

  $ rad diff show <DIFF-NUMBER>
  (pending) [jane doe] 3f9e302 - Super dope feature | <DIFF-NUMBER>

  created at 2019-01-22T09:32:37Z

  From 3f9e302ef68c74251c49cd4d1bf17452b713620 Mon Sep 17 00:00:00 2001
  From: jane doe jane@doe.com
  Date: Wed, 16 Jan 2019 10:35:58 +0000
  Subject: Super dope feature

  Description of the feature
  ---
  main.c | 398 +++++++++++++++++++++++++++++++++++
  1 file changed, 398 insertions(+)
  // ...


And accept if it looks good.

::

  $ rad diff accept <DIFF-NUMBER>
  Merging proposal <DIFF-NUMBER> with master


Or reject it.

::

  $ rad diff reject <DIFF-NUMBER>
  Diff <DIFF-NUMBER> has been rejected


Or add a general comment for clarification or to request a change.

::

  $ rad diff comment <DIFF-NUMBER> "Nice feature, but here is my comment..."
  Added comment to Diff <DIFF-NUMBER>


That's it, this should get you going. If you have any other questions please take a look at the `docs <link to docs>`_ for more information.

