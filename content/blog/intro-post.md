---

title: "Radicle"
date: 2019-03-01
draft: true
markup: mmark
author: "Julian Arni and James Haydon"

---

# Intro

`radicle` is a system for code collaboration that has several advantages over
existing systems:

- It is completely [peer-to-peer](https://en.wikipedia.org/wiki/Peer-to-peer)
- It is easily modifiable and programmable
- It is extensible

We've built a couple of "apps" in the radicle system. One example is
`rad-issues`, a p2p issue tracker.

```
$ rad issue list
state    #    title                    author        updated
open     32   can't log in             juliendonck   2019-01-25T13:27
open     23   some title               cloudhead     2019-01-25T13:27
closed   12   why doesn't this work?   xla           2019-01-25T13:27
```

```
$ rad issue new
<opens text editor>
```

```
$ rad issue comment #33 'I have doubts'
Commented on issue 33 in docs
```

You don't need to understand any of what follows to use these apps. But how
they work behind the scenes is quite interesting. What exactly happens when
create a new issue tracker? Or when someone submits a new issue? How do others
see it? How is it replicated? How is it validated?

# Background (IPFS)

[IPFS](https://ipfs.io/) (InterPlanetary file system) is a peer-to-peer
distributed file system. One can think of IPFS as a network of computers
operating in a manner similar to a BitTorrent swarm, exchanging files within a
single Git repository, using hashes for addresses. `radicle` is built on top of
the IPFS protocol, but runs on its own network.

## Replicated state machines

The core component of `radicle` is a `radicle` **machine**. The word 'machine'
is use in the sense of a *state machine*, that is, an abstract mathematical
function, rather than a piece of hardware. Formally a state machine is defined by:
- a set of possible states <i>S</i>,
- a set of possible inputs <i>I</i>,
- a set of possible outputs <i>O</i>,
- a transition function <i>f</i> : <i>S</i> × <i>I</i> → <i>S</i> × <i>O</i>,
- a distinguished starting state <i>s</i><sub>0</sub>.

The state machine starts in state <i>s</i><sub>0</sub>, and this state is
updated according to the inputs given to the machine. If at some point it is in
state <i>s</i> then the input <i>i</i> will make it transition to state
<i>s'</i> while outputting <i>o</i>, where <i>f</i>(<i>s</i>, <i>i</i>) =
(<i>s'</i>, <i>o</i>).

A simple example is a counter machine:
- <i>S</i> = ℤ
- <i>I</i> = {`increment`, `get-counter`}
- <i>O</i> = {`ok`} ∪ ℤ
- <i>f</i>(<i>n</i>, <i>i</i>) = (<i>n</i> + 1, `ok`) when <i>i</i> =
  `increment` and <i>f</i>(<i>n</i>, <i>i</i>) = (<i>n</i>, <i>n</i>) when
  <i>i</i> = `get-counter`.
- <i>s</i><sub>0</sub> = 0.

People can define their own machines, or set up new ones with an existing
definition.

Where does a machine "exist"? Where does it execute? Part of the idea of the
radicle architecture is somewhat abstracting away from any such notion. For the
most part, it's sufficient to know that it does exist, and that you can
interact with it.
(TODO: improve flow / better locate this sentence)

Crucially, machines are **deterministic**. If you start from any machine, in any
state, giving it the same set of inputs will always result in the same set of
outputs, and the same new state. Therefore in order for everyone to agree on the
current state of a machine, we need to communicate two things:

- The definition of the machine,
- The inputs that have already been processed by the machine.

Picture:

```
M : M0 -[i0]-> M1 -[i1]-> M2 -[i3]-> ... -[in]-> M{n+1}
N : N0 -[i0]-> N1 -[i1]-> N2 -[i3]-> ... -[in]-> N{n+1}
...

```

Rather than come up with a separate way of formally specifying machine
definitions, radicle starts from a single *root* machine `R`, a special machine
which can come to behave like any other given the correct inputs:

Picture:

```
R --> ... --> M0 -[i0]-> M1 -[i1]-> M2 -[i3]-> ... -[in]-> M{n+1}
  --> ... --> N0 -[i0]-> N1 -[i1]-> N2 -[i3]-> ... -[in]-> N{n+1}
```

In this way the the boundary between a machine's definition and its operation
becomes blurred. In any case, a machine is now completely determined by its
input log, and its *state* is recovered by feeding these inputs to the root
machine `R`.

What this gives us is the ability to define machines as a pointers to linked
list stored on IPFS; the list of all the expressions submitted to that
machine. Adding new inputs means adding the data to IPFS, and then updating the
pointer to point to the new data. In order to materialize that machine, you can
resolve the pointer, fetch the data from IPFS, and then evaluate the set of
expressions that gives you. You can then query that materialized machine for
e.g. it's state (`get-counter`).

   TODO: IPFS linked list picture

By fetching the data, you are also replicating it. So if someone else wants it
and you are more easily reachable than other replicators, or others are offline,
you help ensure its availability. One nice feature of this architecture is that
machines that are popular are more available. Currently we pin all the data
indefinitely, but with a system to unpin data that's rarely used locally, we
have a very simple but elegant replication and garbage collection
infrastructure. Another nice feature is that machines that have common prefixes
(their initial definition is the same - e.g., they are both counter apps, albeit
different ones) share blocks on IPFS; so if you already have *a* counter app,
you already have part of other ones, and fetching the history of other ones will
be faster.

TODO: IPFS linked list with shared suffix
```
R --> ... --> ... --> M0 -[i0]-> M1 -[i1]-> M2 -[i3]-> ... -[in]-> M{n+1}
          --> ... --> N0 -[i0]-> N1 -[i1]-> N2 -[i3]-> ... -[in]-> N{n+1}
```

This fetching and materializing isn't manual. Instead, participants of the
network have a **radicle daemon** that runs in the background; when you first
query a machine, you ask that daemon for the current state of the machine. It
resolves the pointer, fetches the data via IPFS, materializes it for you,
and returns the result of your query. After that, it subscribes/polls
("follows") the pointer for updates, automatically replicating and
materializing further updates. If you query again, you get the latest data
almost immediately.

Mostly you'll be running this daemon locally. It won't be available to anyone
else but you. But you can also run it in a publicly exposed computer for anyone
to access. This gives us two things.

First, it makes running a machine-replication service trivial. If you are
worried about your data not being available when you are offline, you can
simply query a public daemon for your machine, causing it to start replication.
When you go offline, your data will have replicated to servers that are always
online, so it will still be available. We provide some such public daemons, but
you can run your own and contribute to the health of your machines, or of the
network generally. (Note that there's still not authentication mechanism in
these daemons, so there's still the possibility of DOS attacks if you go this
route.)

Secondly, because the radicle daemon is just an HTTP server, this gives you the
possibility of having websites that have your machine as the data layer. (This
is still a very manual process, which we hope to in the future make easier.)

How does the pointer work? We back it with an IPNS pointer. [Explain IPNS.] So
each pointer has an *owner* who is allowed to modify what it points to. The
owner of the pointer is also in a way the owner of the machine. They can in
theory choose which new inputs get accepted (though accepting inputs is an
automatic process guided by the semantics of the machine, so in normal
operation this won't happen). The owner's radicle daemon subscribes to an
(IPFS) pubsub channel, and anyone who wants to submit new inputs to a machine
sends that input to the relevant pubsub channel, so that the owner can add it
to IPFS and update the machine's pointer. (This means that if the owner is
offline, writing won't work, and the machine becomes read-only.)

TODO: mention that the owner can also rewrite history?
