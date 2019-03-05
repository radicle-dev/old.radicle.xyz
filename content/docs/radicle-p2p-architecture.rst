---

title: "Radicle P2P Architecture"
date: 2019-02-06T17:31:11+01:00
markup: rst
weight: 7

---

========================
Radicle P2P Architecture
========================

How replication works
=====================

Radicle state machines are replicated using IPFS_. The state of a machine is
fully determined by its input log, and this is exactly what is stored and
replicated on IPFS as a linked list. The *empty* Radicle machine has the
address ``zdpuAyyGtvC37aeZid2zh7LAGKCbFTn9MzdqoPpbNQm3BCwWT``, which is just the
CID_ (content-addressed identifier) of ``{"radicle": true}``; there is no
significance to this, it's just a way of choosing a CID to represent the empty
list of expressions. Subsequent inputs (which are just sequences of Radicle
expressions) are stored as documents containing the expressions and a link to
the previous input. One only needs the address of the latest input, the
*"head"*, to be able to recover the whole log. The owner of a machine uses an
IPNS_ link to point to the head of the list, and the name of this link is then
the *name* of the machine also.

..
   TODO: maybe an image of a linked list of radicle expressions stored on IPFS.

Writing to an RSM (ipfs-pubsub)
===============================

To add expressions to a machine, one creates a document with the expressions to
be added and adds a link to the previous head of the linked list of inputs:

.. code-block:: json

    {
      "expressions": ["(def x 42)", "(def y (+ x x))"],
      "previous": {
        "/": "zdpuApnKnQHsRmEFowFcXW7D4KRHDQzCf8RJStF3SVVGA1pTL"
      }
    }

The IPNS link of the machine is then updated to point to the CID of this new
document. This is all done automatically by the Radicle daemon.

Of course, only the owner of the IPNS link (the person who knows the private key
paired to the public key the IPNS name is derived from) can update the IPNS
link. So how do other people add inputs to a machine?

For this, the Radicle daemon uses IPFSPubsub_, an experimental feature of
IPFS. When a follower of a machine would like to add an expression, they publish
this expression to the pubsub topic associated to the machine (this is just the
machine's name). The Radicle daemon of the machine's owner will subscribe to
this topic to listen for suggested inputs, and will accept any that is valid
(doesn't cause an error). Once the expression is accepted, an acknowledgement is
sent back to the follower, and the machine's IPNS link is updated.

How querying works
==================

When using a Radicle app, the app queries the state of some machine by
making requests to the Radicle daemon. For example ``rad-issue`` might need
to know who the author of issue ``5`` is. To do this, it sends a *query* to the
Radicle daemon, which is just an expression to be speculatively evaluated on
the machine. Once the result is obtained, the expression (and the resulting
state) is discarded. For example an app could query machine
``12D3KooWBdkbHsG35HpEegK4ecr2MU3Um61B3rqhiGmSBrEi6eKQ`` with the expression
``(lookup :author (issue-by-number 5))``. The daemon will make sure the machine
is loaded and up to date before evaluating the expression, and it will also
subscribe for updates in order to remain up to date. This ensures that
subsequent queries take very little time to complete.

When a daemon executes a query, it *pins* all the expressions it had to download
from IPFS. Therefore querying a machine also has the effect of seeding it to
other peers.

The radicle language & how apps are written
===========================================

Radicle machines are just sequences of expressions of the Radicle
*language*; a LISP heavily inspired by Scheme_, modified to be fully
deterministic and have the ability to restrict the validity of future
inputs. The code forming a Radicle *app* has two components:

- The *machine code*, that is, the inputs of the Radicle state machine,

- The *UX code*. This provides all the functionality that is needed to help
  users submit valid inputs and to visualise the current state of the
  machine. It isn't strictly necessary to use the Radicle language for this
  but doing so presents several advantages:

  - A perfect fit with the radicle data model: Being a LISP, it's very natural
    to create an manipulate Radicle expressions in Radicle itself.

  - Code sharing code between the UX and machine: Just like it's attractive to
    use the same language on the frontend and backend of a traditional web-app
    (e.g. Node/JS, Clojure/Clojurescript, etc.), using Radicle for the UX
    code allows one to re-use utility functions, validation logic, etc. that was
    already needed for the machine code.

For more information about the Radicle language, check out the RadicleDocs_.

.. _IPFS: https://docs.ipfs.io/
.. _CID: https://docs.ipfs.io/guides/concepts/cid/
.. _IPNS: https://docs.ipfs.io/guides/concepts/ipns/
.. _IPFSPubsub: https://blog.ipfs.io/25-pubsub/
.. _Scheme: http://www.scheme-reports.org/
.. _RadicleDocs: http://docs.radicle.xyz/en/latest/
