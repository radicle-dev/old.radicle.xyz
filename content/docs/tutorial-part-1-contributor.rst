---

title: "Tutorial Part 1: Contributor"
date: 2019-02-05T18:12:34+01:00
markup: rst
weight: 3

---

============================
Tutorial Part 1: Contributor
============================

*Once you've finished installing Radicle you're ready to try the Radicle tutorial.*

*In the Radicle tutorial you'll learn to use some of the basic collaboration tools. First you'll contribute changes to a Radicle project maintained by someone else. In this section you'll learn the three commands: rad project, rad issues, and rad diff.*

*Then, in part 2, you'll see the other side by walking through the maintainer workflow.*

🌿

Welcome to the Radicle Garden, a new-found island located somewhere off the ASCII shores of `tilde.town <http://tilde.town/~troido/cadastre/town.html>`_. Today we're going to learn how to use the Radicle collaboration apps by adding a plot of our own to the `Radicle Garden <../garden>`_ map, then we'll walk through how the Radicle Garden project was created and steps for managing contributions as a maintainer.

Make sure you've got `Radicle installed <#installation>`_ and let's dig in.

Contribute to the Radicle Garden
================================

The Radicle Garden is a project created using Radicle, with a rendered output hosted found at https://radicle.xyz/garden. A Radicle project contains a git repository as well as the all the issues and proposals associated with that repo.

Before we start contributing, we'll need to download a copy to our computer by checking out the project. To do that we need the project-id: ``12D3KooWSeVNi5qTpDULRMR8UQhhQZfk4taUGRaLoLF7BgAAsUQW``, and then we'll run:

::

  $ rad project checkout 2D3KooWSeVNi5qTpDULRMR8UQhhQZfk4taUGRaLoLF7BgAAsUQW
  radicle-garden
  Initialized empty Git repository in /home/gardener/projects/radicle-garden/.git/
  Warning: Permanently added the RSA host key for IP address '192.30.253.112' to the list of known hosts.
  remote: Enumerating objects: 8, done.
  remote: Counting objects: 100% (8/8), done.
  remote: Compressing objects: 100% (7/7), done.
  remote: Total 8 (delta 1), reused 4 (delta 1), pack-reused 0
  Unpacking objects: 100% (8/8), done.
  From github.com:oscoin/radicle-garden
   * [new branch]      master     -> origin/master


In the output shown above we can see that ``rad project`` uses git behind the scenes to clone the project from a remote repo hosted on IPFS into a new folder named after the project-id.

Let's learn a little more about this project by moving into the newly created directory with ``$ cd radicle-garden`` and then listing what's in the folder.

::

  $ ls -a
  .  ..  .git  2019-03-01_chia.txt  2019-03-02_garbanzo.txt


As we can see, the Radicle project folder has a .git directly inside, like any other git repo.

Now let's take a look at what's in these garden text files:

::

  $ cat 2019-03-01_chia.txt

         %
          \_
          | %
  ..-`-...l..-..~-`.,.
  ....................
  ....................
  ....................

Oh, very pretty.

::

  $ cat 2019-03-02_garbanzo.txt

               🌞
     ☁
     ____🐓_
  ---|     |---------
    /       \      🌵

          ~~
     🐍         ~~



What lovely gardens. It looks like each garden file contains an ASCII image. These images are combined to create the community garden page located at https://radicle.xyz/garden.

Like our git repo, Radicle stores issue and proposal chains locally and distributes them over the IPFS network. To look at a list of issues we'll run ``$ rad issue list`` while inside the git repo.

::

  $ rad issue list
  state    issue #   title                        author        updated
  open     1         Diff proposal not accepted   juliendonck   2019-01-25 13:27

There's only one issue for this project at the moment. Let's take a closer look with ``$ rad issue show 1``.

::

  $ rad issue show 0
  open  0  Diff proposal not accepted  Julien Donck  2019-03-04T16:41:47Z

  **State:** open
  **Labels:** []

  I made a proposal to add my garden to the map, but when I run `rad diff list` the state is listed as rejected.

  Comments
  --------

  ### hxrts [2019-03-04T16:43:26Z]

  It looks like your garden doesn't have the correct dimensions. All gardens should be 20 characters wide and 8 lines high.

If we wanted to add another comment we could run ``$ rad issue comment <issue-number> <body>``.

Creating an issue works just like adding a git commit message—add text at the top and save the file to create the comment.

Now let's make our own garden now. First of let's create a new branch and check it out, ``$ git checkout -b my-garden``. Then we'll create a new text file, ``$ touch yyy-mm-dd_username.txt`` and open the file with your favorite editor.

As mentioned in the issue above, the text should fit in a box of 20 characters wide and 8 lines high.

Once we've planted a few vegatables and feel happy with our garden, we'll save the file, add the staged file and commit it to the repo using git.

::

  $ git commit -a -m "Sewing seeds"
  [master (root-commit) 798c5c4] Sewing seeds
   1 files changed, 8 insertions(+)
   create mode 100644 YYY-MM-DD_username.txt

Now let's propose our diff upstream using the HEAD of this git branch.

::

  $ rad diff propose HEAD
  Proposing <DIFF-ID> to <PROJECT-ID>

If we want to see the status of our diff we can do that with:

::

  $ rad diff list
  state     #  commit                  author  updated
  pending   1  YYY-MM-DD_username.txt  hxrts   2019-03-04T21:23:34Z

As long as our garden is the correct dimensions, it shouldn't take long for our proposed diff to be accepted and then we'll be able to see our garden on the map at https://radicle.xyz/garden. Also if you check out master, ``$ git checkout master``, and pull in the latest changes, ``$ git pull origin master``, you should see your garden file there as well.

|

That's the end of Part 1. If you feel comfortable with that material you can move on to Part 2 of this tutorial, which explains what the same process looks like as a `Maintainer <#tutorial-part-2-maintainer>`_.