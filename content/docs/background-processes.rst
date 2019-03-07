---

title: "Background Processes"
date: 2019-02-05T18:13:14+01:00
markup: rst
weight: 9

---

====================
Background Processes
====================

Radicle requires 2 background processes to be running: radicle-daemon and radicle-ipfs-daemon.

If you have installed Radicle via the brew / debian packages, the necessary background processes
should be already available as systemd or brew services respectively (see `installation <#installation-setup>`_).

radicle daemon
==============

The Radicle daemon is what manages your Radicle State Machines, accepting valid Radicle expressions as inputs
from Radicle apps on your machine, or from other apps on the Radicle IPFS network.

To run the radicle daemon:

.. code-block::

  rad daemon-radicle

Radicle daemon

radicle ipfs daemon
===================

The Radicle IPFS daemon is the process that runs an IPFS daemon, bootstrapping to our own separate Radicle
IPFS network. Since all Radicle data is written as IPFS objects, the Radicle daemon must communicate with
the Radicle IPFS daemon to actually persist any data to disk and expose it on the IPFS network.

To run the radicle IPFS daemon:

.. code-block::

  rad daemon-ipfs
