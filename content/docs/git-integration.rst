---

title: "Git Integration"
date: 2019-02-05T18:13:08+01:00
draft: true
markup: rst
weight: 8

---
===============
Git Integration
===============

Radicle utilities are centered around code collaboration. They usually expect that
the directory from which ``rad`` commands are executed is a ``git`` repository.
There is, however, no restriction on how the ``git`` repository is shared with
others: you can use any ``git`` hosting service (such as GitHub or GitLab), or a
self-hosted ``git`` server to ``push`` and ``pull`` your changes.

If you prefer to not rely on a centralized ``git`` hosting service, Radicle
provides integration with git-remote-ipfs_, which allows storing ``git``
repositories on IPFS_. Note, however, that this is currently considered
experimental and has some `known limitations <#limitations-troubleshooting>`_.

To start using git-remote-ipfs_, just pick ``New peer-to-peer repository`` when
``rad project init`` prompts you for the kind of repository to use.


.. _git-remote-ipfs: https://github.com/oscoin/ipfs/blob/master/git-remote-ipfs/README.rst
.. _IPFS: https://docs.ipfs.io
