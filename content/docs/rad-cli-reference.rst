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
          rad issue [show | close] <issue-number>
          rad issue comment <issue-number> <comment>
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
       new          - Create a new issue in $EDITOR
       show         - Show an issue
       comment      - Add a comment to an issue
       close        - Close an issue
                      This command is restricted to the maintainer of the project.
       help         - Print this help and exit

rad diff commands
=================

.. code-block::

  rad diff - Radicle Diff CLI

     Usage:
          rad diff list [(-s | --state | --filter-by-state) <state>] [--fancy]
          rad diff propose <commit>
          rad diff [show | retract | accept | reject] <diff-number>
          rad diff comment <diff-number> <comment>
          rad diff help

       list         - Lists all diffs
                      The list can be filtered by state:
                        pending, retracted, accepted, rejected
                      The flags for filtering by state:
                        -s, --state, --filter-by-state
                      Filtering by multiple states is possible via '-s <state1> -s
                      <state2> ...'.
                      If the option '--fancy' is appended, the list is opened via
                      fzf (note that fzf has to be installed).
       propose      - Create a new diff from a single commit
       show         - Show a diff
       comment      - Add a comment to a diff
       retract      - Retract your own diff
                      This command is restricted to the creator of the diff or the
                      maintainer of the project.
       accept       - Accept a diff
                      Automatically merges to master and pushes to origin. This
                      command is restricted to the maintainer of the project.
       reject       - Reject a diff
                      This command is restricted to the maintainer of the project.
       help         - Print this help and exit

rad project commands
====================


.. code-block::

  rad project - Radicle project CLI

     Usage:
          rad-project init
          rad-project show-id
          rad-project checkout <PROJECT-ID>

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

     The key pair is used for signing actions in the apps. Note that some actions
     are restricted to certain key pairs so deleting or overwriting your key pair
     can lead to loss of some authorisations.
