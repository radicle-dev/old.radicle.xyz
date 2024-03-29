---

title: "Rad CLI Reference"
date: 2019-02-05T18:12:57+01:00
markup: rst
weight: 7

---
=================
Rad CLI Reference
=================

rad issue commands
==================

.. code-block::

  rad issue - Radicle Issue CLI

     Usage:
          rad issue list [(--filter-by-state | --state | -s) <state>] [--fancy]
          rad issue new
          rad issue [show | close | mark-read | mark-unread] <issue-number>
          rad issue comment <issue-number> <comment>
          rad issue all-read
          rad issue help

       list         - Lists all issues
                      The list can be filtered by state:
                        open, closed
                      The flags for filtering by state:
                        --filter-by-state, --state, -s
                      Filtering by multiple states is possible via '-s <state1> -s
                      <state2> ...'.
                      If the option '--fancy' is appended, the list is opened via
                      fzf (note that fzf has to be installed).
                      If the option '--unread' is appended, only unread issues
                      are listed.
                      Unread issues are marked with a * after the timestamp.
       new          - Create a new issue in $EDITOR
       show         - Show an issue
       comment      - Add a comment to an issue
       close        - Close an issue
                      This command is restricted to the maintainer of the project.
       mark-read    - Mark issue as read
       mark-unread  - Mark issue as unread
       all-read     - Mark all issues as read
       help         - Print this help and exit

rad patch commands
==================

.. code-block::

  rad patch - Radicle Patch CLI

     Usage:
          rad patch list [(-s | --state | --filter-by-state) <state>] [--fancy]
          rad patch propose <commit>
          rad patch [show | retract | accept | reject | checkout | mark-read | mark-unread] <patch-number>
          rad patch comment <patch-number> <comment>
          rad patch all-read
          rad patch help

       list         - Lists all patches
                      The list can be filtered by state:
                        pending, retracted, accepted, rejected
                      The flags for filtering by state:
                        -s, --state, --filter-by-state
                      Filtering by multiple states is possible via '-s <state1> -s
                      <state2> ...'.
                      If the option '--fancy' is appended, the list is opened via
                      fzf (note that fzf has to be installed).
                      If the option '--unread' is appended, only unread patches
                      are listed.
                      Unread patches are marked with a * after the timestamp.
       propose      - Create a new patch from a single commit
       show         - Show a patch
       comment      - Add a comment to a patch
       retract      - Retract your own patch
                      This command is restricted to the creator of the patch or the
                      maintainer of the project.
       accept       - Accept a patch
                      Automatically merges to master and pushes to origin. This
                      command is restricted to the maintainer of the project.
       checkout     - Checkout a patch locally
                      Creates a new branch 'patch/<patch-number>' and applies the
                      patch to it.
       reject       - Reject a patch
                      This command is restricted to the maintainer of the project.
       mark-read    - Mark patch as read
       mark-unread  - Mark patch as unread
       all-read     - Mark all patches as read
       help         - Print this help and exit

rad project commands
====================

.. code-block::

  rad project - Radicle project CLI

     Usage:
          rad project init
          rad project show-id
          rad project checkout <PROJECT-ID>

       init         - Initialize a new project
       show-id      - Show the project id
       checkout     - Checkout a project

rad key commands
================

.. code-block::

  rad key - Radicle Key Management CLI

     Usage:
          rad key create [--force]
          rad key help

     Creates a new key pair. If `--force` is appended, an existing key pair
     file will be overwritten.
     Per default, key pairs are stored in `$HOME/.config/radicle/my-keys.rad`
     this can be adjusted by setting `$XDG_CONFIG_HOME`.

     The key pair is used for signing actions in the utils. Note that some actions
     are restricted to certain key pairs so deleting or overwriting your key pair
     can lead to loss of some authorisations.

rad replicate commands
======================

.. code-block::

  rad replicate - Replicate radicle projects.

    This can be used to make your machines more available (e.g., readable when
    you are offline, or writable and readable if you are behind a firewall).

     Usage:
          rad replicate [URL]

    If not provided, the URL defaults to http://replicate.radicle.xyz
