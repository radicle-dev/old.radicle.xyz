---

title: "What is Radicle?"
date: 2019-02-05T18:12:27+01:00
markup: rst
weight: 2

---

================
What is Radicle?
================

Radicle is a new stack for code collaboration, which includes a few simple
utilities we've created for this first release to demonstrate the core
functionality. Think of Radicle as a Github or Gitlab alternative—though you can
also combine Radicle with these services if you're not ready to switch over
entirely.

Instead of being hosted by Github's servers, or hosted on servers that you
yourself manage and deploy, issues, patches (i.e.
pull-requests/merge-requests) and optionally repos are distributed via IPFS. To
use it, you don't need to rely on centralized services, nor go through the
trouble of self-hosting.

When you initialize or check out a Radicle project, Radicle stores the project
id in the repository's git config. When you run commands like ``rad issue`` or
``rad patch`` from inside that repo, Radicle reads that project id, and asks the
Radicle daemon to either fetch the right data from IPFS (when reading), or
submit it to the project owners (when writing). This allows you to deal with
all the tasks associated with a project right from your repo directory.

To collaborate on a project, all you need to do is share your project id.

The main commands:

- ``rad project init`` : Creates a new project
- ``rad project checkout`` : Checkout (clone) someone else's project
- ``rad issue list`` : List the issues in a project
- ``rad issue new`` : Create a new issue in a project
- ``rad issue comment`` : Comment on an issue
- ``rad patch propose`` : Propose that a commit be merged into a project
- ``rad patch accept`` : Merge a patch

Radicle was designed to make it easy to create new utilities, or
modify existing ones. If you want to require that bug reports have "How to
reproduce" sections, or if you want patches touching certain directories to
be deemed invalid and immediately rejected, or if you want to allow only certain people
to open issues, you can do all that. However, this involves
programming in the Radicle language, for which documentation is still lacking.
