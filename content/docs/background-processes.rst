---

title: "Background Processes"
date: 2019-02-05T18:13:14+01:00
markup: rst
weight: 9

---

====================
Background Processes
====================

Radicle requires 2 background processes to be running: ``radicle-ipfs`` and
``radicle-daemon``. These are described in greater details below.

If you have installed Radicle via the brew or debian packages, the necessary
background processes should already be available as brew or systemd services
respectively (see `installation <#installation>`_).

If you are experiencing problems with Radicle, you should check the status of
these services.

On OSX run:

.. code-block::

   brew services list

to check the status of all running services. On Linux use the commands

.. code-block::

   systemctl --user status radicle-ipfs
   systemctl --user status radicle-daemon

to check the status of the IPFS daemon and the radicle daemon respectively.

Radicle ipfs daemon
===================

The Radicle IPFS daemon is the process that runs an IPFS daemon, bootstrapping
to our own separate Radicle IPFS network. Since all Radicle data is written as
IPFS objects, the Radicle daemon must communicate with the Radicle IPFS daemon
to actually persist any data to disk and expose it on the IPFS network.

To run the radicle IPFS daemon manually:

.. code-block::

  rad daemon-ipfs

Radicle daemon
==============

The Radicle daemon is what manages your Radicle State Machines, accepting valid
Radicle expressions as inputs from Radicle utilities on your machine, or from other
apps on the Radicle IPFS network.

To run the radicle daemon manually:

.. code-block::

  rad daemon-radicle
