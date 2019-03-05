---

title: "Installation"
date: 2019-02-05T18:12:27+01:00
draft: true
markup: rst
weight: 2

---
============
Installation
============

**Disclaimer**: *Radicle is alpha technology and in heavy development. All your data may be lost. We do not guarantee backwards compatibility between releases. It’s important to remember that this is experimental software and should be treated as such.*

|

*This release is aimed for developers and early-adopters who want to get a glimpse into what we are building and help shape the product through feedback or contributions to the Radicle project.*

External Dependencies
=====================

OS X
====


.. code-block::

   brew tap oscoin/radicle
   brew install radicle-alpha


To run the `rad` commands, you must have both a Radicle daemon, and Radicle IPFS daemon running.
For OS X users these can be accessed using `brew services <https://github.com/Homebrew/homebrew-services>`_
with the following commands:

.. code-block::

   brew services start radicle-alpha-ipfs
   brew services start radicle-alpha


Debian/Ubuntu
=============

For Debian-based systems we provide packages.

.. code-block::

    wget https://storage.googleapis.com/static.radicle.xyz/releases/radicle_2019.03.05_amd64.deb
    apt install ./radicle_2019.03.05_amd64.deb

The package includes systemd service files for the Radicle daemon. To
start the deamon run

.. code-block::

    systemctl --user start radicle-daemon

This will also start the ``radicle-ipfs`` service. You can check the
status of a service with ``systemctl --user status <service>``.

Install From Source
===================

To build Radicle from source you need to install `stack`_.

.. code-block::

   git clone https://github.com/oscoin/radicle.git
   cd radicle

   stack build
   stack install :rad :radicle

Note that `stack` might take as much as 4GB of memory to build Radicle.

Radicle requires `ipfs`_ and `git-remote-ipfs`_ to be installed. To use Radicle
you will need to run the Radicle daemon and the Radicle IPFS daemon. You can do
that from the shell with ``rad daemon-ipfs`` and ``rad daemon-radicle``. For a
more sophisticated setup see “Running Background processes” below.

.. _stack: https://docs.haskellstack.org/en/latest/install_and_upgrade/
.. _ipfs: https://docs.ipfs.io/introduction/install/
.. _git-remote-ipfs: https://github.com/oscoin/ipfs/tree/master/git-remote-ipfs#install

Running background processes
============================
