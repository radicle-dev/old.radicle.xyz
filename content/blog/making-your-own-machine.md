---

title: "Making your own radicle machine"
date: 2019-03-28
markup: mmark
author: "Julian Arni"
draft: true
summary: "We explain how to build and deploy your own decentralized service with radicle"

---

We've developed radicle initially with a particular use-case in mind: building
a programmable, peer-to-peer code collaboration platform. The programmability
requirement came from wanting users to be able to easily tweak the logic behind
their issues or PRs, for instance, or build other new features themselves. But
in order to make it work, we ended building a quite general platform for
peer-to-peer computation. It's become increasingly clear that this could be of
use to others in very different applications, so in this blog post we'll give a
tutorial on how to build your own radicle machine.

(Our previous blog post describes how radicle works architecturally; you might
find that useful, but you don't really need to have read it in order to
understand what follows.)

Since one of the higher-profile uses of IPFS (which radicle uses) was
maintaining the censored website fo the Catalan referendum, let's improve on that.

<WHAT>

Radicle comes with its own REPL. If you have everything installed, you can run
it with `rad repl`.  A radicle machine is very much like a radicle REPL. (The
only two differences are that the REPL has access to effectful functions,
whereas a machine doesn't; and that a machine is hosted in a P2P way, allowing
others to interact with it.) Given this similarity, we can use the REPL to
quickly prototype a machine. Moreover, we can use the REPL to easily interact
with machines.


