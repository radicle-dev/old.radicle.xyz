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

Each machine is identified by an IPNS record. These, if not republished, last
at most 24 hours. If the computer that owns the machine is offline or not
running the IPFS daemon for longer than that period, other computers will not
be able to resolve your machine, and so will fail to read it even if there is
no new data. Some 30 minutes or so after coming back online, your daemon will
automatically republish the record.

Besides being online more often, there currently is no solution to this
problem. We plan to eventually increase the length of time IPNS records last.


Networking Issues (firewall, NAT)
===========================================

Many networks, such as caffés and offices, are behind a firewall or NAT.
Depending on the exact configuration, this may not present a problem, but often
it does. In particular, two computers that are behind an untraversable firewall
or NAT will not be able to read data from, or write data to, one another.

Other radicle daemons - that are not behind such restricted networks - can
function as *relays* for your machines. This means they'll replicate your data
to their more easily-accessible network, and convey write requests to you if
you can't receive them directly. By default, all daemons try to act as a relay
for the machines they follow (i.e. have queried or written to in the past). A
friend who decided to see what you were up to on a machine, for example, may
thus also end up helping others be able to query or collaborate with you on
that machine.

But friends go offline. Instead of relying on that, you can also ask certain
publicly available servers, that are always on and online, to follow your
machine. We provide some such servers. To use it, run:

``rad replicate``

From your repo directory.

This has the additional advantage of making your data available for reading
when you're offline.

Replication & Availability (cannot resolve RSMs)
================================================

``git-ipfs`` limitations
========================
