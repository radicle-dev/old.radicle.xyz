---

title: "Limitations & Troubleshooting"
date: 2019-02-05T18:13:19+01:00
markup: rst
weight: 10

---

=============================
Limitations & Troubleshooting
=============================


Installation Troubleshooting [julian]
======================================

Clearing All Machine History
============================

Sometimes all the things you tried still don't seem to work..

If all else fails and you are having strange errors with daemons starting
or interacting with the radicle commands, you can try wiping all of your
Radicle State Machine data with the following commands:

``rm -rf ~/.local/share/radicle/machines.json``

IPNS lifetime
=============

Networking Issues (firewall, nat traversal)
===========================================

Replication & Availability (cannot resolve RSMs)
================================================

``git-ipfs`` limitations
========================
