---

title: "Radicle"
date: 2019-03-01
draft: true
markup: mmark
author: "Julian Arni and James Haydon"

---

# Radicle

Radicle is a system for code collaboration that has several advantages over
existing tools. In particular Radicle is:

- Completely [peer-to-peer](https://en.wikipedia.org/wiki/Peer-to-peer)
- Easily modifiable and programmable
- Extensible

We've built several "apps" using the radicle system. One example,
`rad-issues`, is a P2P issue tracker.

```
$ rad issue list
state    #    title                    author        updated
open     32   can't log in             juliendonck   2019-01-25T13:27
open     23   typo fix                 cloudhead     2019-01-25T13:27
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
we create a new issue tracker? Or when someone submits a new issue? How do peers
see it? How are messages replicated? Or validated?

The radicle stack uses [IPFS](https://ipfs.io/) (InterPlanetary file system) for
replicating state. IPFS is a peer-to-peer distributed file system. One can think
of IPFS as a network of computers operating in a manner similar to a BitTorrent
swarm, exchanging files within a single Git repository, using hashes for
addresses. Radicle is built on top of the IPFS protocol, but runs on its own
network.

The core component of Radicle is a Radicle **machine**. The word 'machine'
refers to [state
machine](https://en.wikipedia.org/wiki/State_machine_replication), that is, an
abstract mathematical function, rather than a piece of hardware. Formally a
state machine is defined by:

- a set of possible states \\(S\\),
- a set of possible inputs \\(I\\),
- a set of possible outputs \\(O\\),
- a transition function \\(f : S \times I \to S \times O\\),
- a distinguished starting state \\(s_0\\).

The state machine starts in state \\(s_0\\), and this state is updated according
to the inputs (elements of \\(I\\)) given to the machine. If at some point the machine is
in state \\(s\\) then the input \\(i\\) will cause a transition to state
\\(s'\\) and output \\(o\\), where \\(f(s, i) = (s', o)\\).

A simple example is a counter machine:

- \\(S = \mathbb{Z}\\)
- \\(I = \\{\mathtt{increment}, \mathtt{getCounter}\\}\\)
- \\(O = \\{\mathtt{ok}\\} \cup \mathbb{Z}\\)
- \\[ f(n, i) = \begin{cases} (n + 1, \mathtt{ok}) & \text{when } i = \mathtt{increment} \\\ (n,n) & \text{when } i = \mathtt{getCounter} \end{cases}. \\]
- \\(s_0 = 0\\).

People can define their own Radicle machines, or set up new ones with an
existing definition.

Where does a machine "exist"? Where does it execute? Part of the idea of the
Radicle architecture is to abstract away from any such notion. For the
most part, it's sufficient to know that a machine exists, and that you can
interact with it.
<!-- TODO: improve flow / better locate this sentence -->

Crucially, machines are **deterministic**. If you start from any machine, in any
state, given the same set of inputs will always result in the same set of
outputs, and the same new state. Therefore, in order for everyone to agree on the
current state of a machine, we need to communicate two things:

- The definition of the machine,
- The inputs that have already been processed by the machine.

So we end up with a bunch of machines \\(M\\), \\(N\\), etc. with starting
states \\(M_0\\), \\(N_0\\), evolving according to the different inputs they
receive:
\\[
\begin{eqnarray}
M &:& M_0 \xrightarrow{i_0} M_1 \xrightarrow{i_1} M_2 \xrightarrow{i_2} \cdots \\\\\
N &:& N_0 \xrightarrow{j_0} N_1 \xrightarrow{j_1} N_2 \xrightarrow{j_2} \cdots \\\\\
&& \cdots
\end{eqnarray}
\\]

Rather than come up with a separate way of formally specifying machine
definitions, Radicle starts from a single *root* machine \\(R\\), a special
machine which can come to behave like any other given the correct inputs:
\\[
\begin{eqnarray}
M &:& R \to \cdots \to M_0 \xrightarrow{i_0} M_1 \xrightarrow{i_1} M_2 \xrightarrow{i_2} \cdots \\\\\
N &:& R \to \cdots \to N_0 \xrightarrow{j_0} N_1 \xrightarrow{j_1} N_2 \xrightarrow{j_2} \cdots \\\\\
&& \cdots
\end{eqnarray}
\\]

In this way the boundary between a machine's definition and its operation
is blurred. In any case, a machine is now completely determined by its
input log, and its state is recovered by feeding these inputs to the root
machine \\(R\\).

This gives us the ability to define machines as pointers to a linked
list stored on IPFS; the list of all the expressions submitted to that
machine. Adding new inputs means adding that data to IPFS, then updating the
pointer to point to the new data. In order to materialize that machine, you can
resolve the pointer, fetch the data from IPFS, and then evaluate the resulting set of
expressions. You can then query the materialized machine for
e.g. its state (`get-counter`).

<!-- TODO: IPFS linked list picture -->

By fetching data, you also automatically replicate it to the network. So if someone else requests that data
and you're more easily reachable than other peers, or they are offline,
you help ensure its availability. One nice feature of this architecture is that
popular machines are more available. Currently we pin all data
indefinitely, but with a system to unpin data that's rarely used locally, we
have a simple, yet elegant, replication and garbage collection
infrastructure. Another useful feature is that machines with common prefixes
i.e. their initial definition is the same, for instance two counter apps,
these apps will share IPFS blocks; so if you already have *a* counter app,
you will already have part similar applications, so fetching the history of subsequent counters will
be faster.

<!-- TODO: "but with a system to unpin data..." clause doesn't make it clear if this system exists yet -->
<!-- TODO: IPFS linked list with shared suffix -->
```
R --> ... --> ... --> M0 -[i0]-> M1 -[i1]-> M2 -[i3]-> ... -[in]-> M{n+1}
          --> ... --> N0 -[i0]-> N1 -[i1]-> N2 -[i3]-> ... -[in]-> N{n+1}
```

This fetching and materializing isn't manual. Instead, participants of the
network have a **radicle daemon** that runs in the background; when you first
query a machine, you ask that daemon for the current state of the machine. It
resolves the pointer, fetches the data via IPFS, materializes it for you,
and returns the result of your query. After the initial query, your daemon will subscribe (follow)
that pointer for updates, automatically replicating and
materializing further updates. If you query again, you get the latest data
almost immediately.

Mostly you'll be running this daemon locally—meaning it won't be available to anyone
else but you. But you can also run it in a publicly exposed computer for anyone
to access. This has two advantages:

First, it makes running a machine-replication service trivial. If you are
worried about your data not being available when you're offline, you can
simply query a public daemon for your machine, causing that daemon to replicate it.
When you go offline, your data will have replicated to servers that are always
online, so it will continue to be available. We provide some such public daemons, but
you can run your own and contribute to the health of your machines, or of the
network generally. *Note that while Radicle is still in alpha daemons have no authentication mechanim, 
thus there is a possibility of DOS attacks if you enable this option.*

Secondly, because the radicle daemon is just an HTTP server, this gives you the
possibility of creating websites that use your machine as the data layer. (This
is still a very manual process, which we aim to automate and simplify in the future.)

How does the pointer work? We back it with an IPNS pointer. IPNS
(Inter-Planetary Name System) is a way of maintaining mutable links to IPFS
objects. An IPNS *name* is the hash of a public key. So each name has an
*owner*: the person who knows the private key corresponding to the public one,
because one needs this key to sign updates to what the link points to. The owner
of the pointer is also, in a way, the owner of the Radicle machine. In theory,
they can choose which new inputs are accepted (though accepting inputs is an
automatic process guided by the semantics of the machine, so under normal
conditions this won't happen). The owner's radicle daemon subscribes to an IPFS
pubsub channel, and anyone who wants to submit new inputs to a machine sends
that input to the relevant pubsub channel, so that the owner can add it to IPFS
and update the machine's pointer. (This means that if the owner is offline,
writing won't work, and the machine becomes read-only.)

Because the owner can point the link to *anything*, not just an extension of the
previous linked list of inputs, they could in theory re-write the history of
their Radicle machine. Such behaviour would be easily detectable by (the
daemon's of) other users following this machine. In the future a daemon would
stop following such a machine and mark it as invalid, and possibly notify other
users on the network.
