---

title: "Limitations & Troubleshooting"
date: 2019-02-05T18:13:19+01:00
markup: rst
weight: 11

---
===============================
 Limitations & Troubleshooting
===============================



Installation Troubleshooting
============================

Work in progress


Clearing All Machine History
============================

Sometimes all the things you tried still don't seem to work.

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
=================================

Many networks, such as cafés and offices, are behind a firewall or NAT.
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

Work in progress

git-ipfs limitations
====================

**Replication**

Data is replicated across the IPFS network based on demand: as soon as someone
requests a particular piece of data, the network tries to find peers which
already have it, and downloads it from there. The more peers download the datum,
the more replicas exist on the network, and the faster the data can be
downloaded.

For ``git-ipfs``, this means that after a ``push``, the computer from which it
was initiated needs to stay online until someone else pulls the latest changes.
Otherwise, those changes are not visible to the network.

While RSMs can be requested to be replicated by a remote Radicle daemon by using
the ``rad replicate`` command, this mechanism currently does not include ``git``
repositories. We hope to address this in a future release. Meanwhile, if you
would like pushes to be replicated without your computer being online
permanently, we recommend to employ a pinning service such as (???)

**Storage Space and Network Bandwidth**

Git repositories employ a compression technique called packfiles_ to store
``git`` objects efficiently. How exactly a packfile is constructed is subject to
heuristics_, which means that two ``git`` repositories may pack in two diffent
ways. In the traditional client-server model of ``git``, this detail is hidden:
when a client pushes to or pulls from a server, both first negotiate which
objects need to be transferred at all. What goes over the wire is then a
packfile of just the difference required to bring the other side up-to-date.

In a peer-to-peer setting, however, we can't rely on the other side being online
at the same time we want to push or pull. Also, there is no way to ensure the
integrity of a packfile without first downloading it as a whole.

IPFS (or, more precisely, IPLD_) works very similar to "loose" ``git`` objects:
the address of an IPFS object (respectively block) is the hash of its contents,
which in turn may link to other objects via their hashes. Unsurprisingly thus,
the IPLD_ project has devised ``git`` storage on IPFS to use uncompressed loose
``git`` objects, which allows for a fairly efficient way to request a subset of
the history of a ``git`` repository, leveraging the content-addressability of
the objects.

As a consequence, however, the overall space required to store a ``git``
repository on the local ``ipfs daemon``, and to replicate it over the network is
at least one order of magitude higher than in the traditional client-server
model.


**Pushing Changes as a Collaborator**

Similar to RSMs, we leverage IPNS_ to address the latest changes to a ``git``
repository stored on IPFS. As a consequence, only the owner of that particular
IPNS_ name may update it to point to new refs. This is similar to a GitHub
repository where only the owner has push access. The equivalent to GitHub's
``fork`` paradigm is to create another remote which points to a different IPNS_
name, or just the empty URL ``ipfs://``, and pushing to that.

Note that this is mostly useful if you employ a pinning service, or want to
collaborate with people synchronously. The ``rad patch`` utility allows you to share
patches without the need for pushing them.


.. _packfiles: https://git-scm.com/book/en/v2/Git-Internals-Packfiles
.. _heuristics: https://github.com/git/git/blob/master/Documentation/technical/pack-heuristics.txt
.. _IPLD: https://ipld.io
.. _IPNS: https://docs.ipfs.io/guides/concepts/ipns/
