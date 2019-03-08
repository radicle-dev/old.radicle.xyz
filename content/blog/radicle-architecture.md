---

title: "Radicle"
date: 2019-03-01
markup: mmark
author: "Julian Arni and James Haydon"

---

# Radicle Architecture

Radicle is a system for code collaboration that has several advantages over
existing tools. In particular Radicle is:

- Completely peer-to-peer
- Easily modifiable & programmable
- Extensible

We've built several "utilities" using the radicle system. One example,
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

You don't need to understand any of what follows to use these utilities. But how
they work behind the scenes is quite interesting. What exactly happens when
we create a new issue tracker? Or when someone submits a new issue? How do peers
see it? How are messages replicated? Or validated?

The radicle stack uses [IPFS](https://ipfs.io/) (InterPlanetary file system) for
replicating state. IPFS is a peer-to-peer distributed file system. One can think
of IPFS as a network of computers operating in a manner similar to a BitTorrent
swarm, exchanging files within a single Git repository, using hashes for
addresses. Radicle is built on top of the IPFS protocol, but runs on its own
network.


The core component of each utility is a *Radicle machine*. The word 'machine' refers
to [state machine](https://en.wikipedia.org/wiki/State_machine_replication),
that is, an abstract mathematical function rather than a piece of
hardware.

Where does a machine "exist"? Where does it execute? Part of the idea behind the
Radicle architecture is to abstract away any such notion. Whether on your local
device, or the larger P2P network, as long as a machine is available it can
be retreived from its IPFS address. For the most part, it's sufficient to know
that a machine exists, and that you can interact with it.

As far as what a Radicle machine *is*. Formally, it is a state machine defined by:

- a set of possible states \\(S\\)
- a set of possible inputs \\(I\\)
- a set of possible outputs \\(O\\)
- a transition function \\(f : S \times I \to S \times O\\)
- a distinguished starting state \\(s_0\\)

The state machine starts in state \\(s_0\\), and this state is updated according
to the inputs (elements of \\(I\\)) given to the machine. If at some point the machine is
in state \\(s\\) then the input \\(i\\) will cause a transition to state
\\(s'\\) and output \\(o\\), where \\(f(s, i) = (s', o)\\).

A simple example is a counter machine where:

{{% div style="padding: 0.2em 0 0.2em 2em;" %}}

\\(S = \mathbb{Z}\\)

\\(I = \\{\mathtt{increment}, \mathtt{getCounter}\\}\\)

\\(O = \\{\mathtt{ok}\\} \cup \mathbb{Z}\\)

\\( f(n, i) = \begin{cases} (n + 1, \mathtt{ok}) & \text{when } i = \mathtt{increment} \\\ (n,n) & \text{when } i = \mathtt{getCounter} \end{cases} \\)

\\(s_0 = 0\\)

{{% /div %}}

People can define their own Radicle machines, or set up new ones with an
existing definition.

Crucially, machines are *deterministic*. If you start from any machine, in any
state, providing the same set of inputs will always result in the same set of
outputs, and the same new state. Therefore, in order for everyone to agree on
the current state of a machine, we need to communicate two things:

- The definition of the machine
- The inputs that have already been processed by the machine

We then end up with several machines \\(M\\), \\(N\\), etc. with starting
states \\(M_0\\), \\(N_0\\), evolving according to the various inputs they
receive:

{{% div style="margin: 0 auto; width: 70%; padding: 1em 0 0.5em 0;" %}}

![machines](https://res.cloudinary.com/juliendonck/image/upload/v1552087014/radicle.xyz/machines.png)

{{% /div %}}

Rather than come up with a separate way to formally specify machine
definitions, Radicle starts from a single *root* machine \\(R\\), a special
machine which may eventually behave like any other, given the correct inputs:

{{% div style="margin: 0 auto; width: 80%; padding: 1.8em 0 0.5em 0;" %}}

![machines with a common root](https://res.cloudinary.com/juliendonck/image/upload/v1552087014/radicle.xyz/machines-common-root.png)

{{% /div %}}

In this way a Radicle machine's definition and its operation
are coincident. A machine is completely determined by its
input log, and its state is recovered by feeding these inputs into the root
machine \\(R\\).

For example, to produce the counter state machine above, we
can input the following:

```
;; prelude here

(def s (ref 0))

(def eval
  (fn [input rad-state]
    (match input
      :increment (eval '(write-ref s (+ 1 (read-ref s))) rad-state)
      :getCounter (list (read-ref s) rad-state))))
```

In this example we've omitted the Radicle *prelude*, which is a set of basic
modules containing many useful functions for writing state machines. The prelude is
necessary here in order to access pattern matching functionality.

Machines are materialized from the sequence of all received expressions, this sequence is maintained via a pointer to
a linked list stored on IPFS. To materialize a Radicle machine,
the pointer is resolved, fetching data from IPFS, and the resulting set of expressions is re-evaluated.
One can then make a query to inspect the materialized machine. For example,
requesting the current state with `get-counter`.

<!-- TODO: IPFS linked list picture -->


Fetching data will also replicate those IPFS blocks automatically, ensuring availability
if other peers go offline. One nice feature of this architecture is that
popular machines will be more available. Currently we pin all data
indefinitely, however with a system to unpin rarely used data, we
get a simple, elegant, replication and garbage collection
infrastructure. Another useful feature is that machines with common prefixes
i.e. they share initial definitions, will already be available. For instance,
consider two counter machines which share several initial IPFS blocks. Once
a single counter machine has been cached, the sequences common to the
second will already be available.

{{% div style="padding: 0.5em 0 1em 0;" %}}

![machines sharing some inputs on IPFS](https://res.cloudinary.com/juliendonck/image/upload/v1552087014/radicle.xyz/machines-sharing.png)

{{% /div %}}

Instead of fetching and materializing manually, Radicle network participants each run a
**radicle daemon** instance in the background.

A query of the current state is made to the Radicle daemon. The daemon then resolves the pointer,
fetches the data stored on IPFS, re-materializes the machine, and returns the result.
After the initial query, your daemon will subscribe (follow)
that pointer for updates, automatically replicating and
materializing further updates. If you make another query, you will get the latest data
almost immediately.

Mostly you'll be running this daemon locally—meaning it won't be available to anyone
else but you. However, you can also choose to serve this data publicly,
which has two advantages (each with caveats, for now):

First, it makes running a machine-replication service trivial. If you're
worried about your data being unavailable while offline, you can
simply query a public daemon for your machine, causing that daemon to replicate from
your instance. Then, when you go offline, the remote server can continue to make your
machine available. We provide several such public daemons, but
you can also run your own and help seed your favorite machines.

*Note: While Radicle is still in alpha, daemons have no authentication mechanim,
thus there is a possibility of DOS attacks if you enable this option.*

Secondly, because the radicle daemon is just an HTTP server, this opens the
possibility of creating websites using your machine as a data layer.

*Note: This can only be accomplished manually at present, however, we aim to automate and
simplify this process in the future.*

How does the pointer work? We back it with an IPNS pointer. IPNS
(InterPlanetary Name System) is a way of maintaining mutable links to IPFS
objects. An IPNS *name* is simply the hash of a public key.
The owner of the corresponding private key controls that IPNS name by signing updates to the IPNS pointer.
The owner of the pointer is also, in a way, the owner of the Radicle machine.
In theory, they can choose which new inputs are accepted (though accepting inputs is an
automatic process guided by the semantics of the machine, so under normal
conditions this won't happen). The owner's radicle daemon subscribes to an IPFS
pubsub channel, and anyone who wants to submit new inputs to a machine sends
their input to the relevant pubsub channel, so that the owner can add it to IPFS
and update the machine's pointer.

*Note: This means that if the owner is offline,
writing won't work, and the machine becomes read-only.*

Because the owner can point a link to *anything*, not just an extension of the
previous linked list of inputs, they could (in theory) re-write the history of
their Radicle machine. Such behaviour would be easily detectable by (the
daemon's of) other users following this machine. In the future the Radicle daemon will
stop following such a machine, mark it as invalid, and possibly notify other
users on the network of the fork.

<br>

⅏  🌷 ⅏  🌷 ⅏
