---

title: "FAQ"
date: 2019-02-05T18:13:32+01:00
markup: rst

---

===
FAQ
===


Isn’t git already a distributed version control system?
=======================================================

Yes! Git as a VCS (version control system) allows for collaboration on software projects to be distributed across mutliple computers. Using git, repositories can be distributed via email, self-hosted services like Gitea, or through third-party platforms like GitHub or GitLab. These services all serve as a way to have a canonical source of truth for the state of a project.

However, most software development also requires some form of social coordination, notably, issues and proposals i.e. GitHub’s pull requests or GitLab’s merge requests. Radicle tries to take these aspects of code collaboration and create a distributed state management system simliar to git. The Radicle CLI sits right alongside git, bringing the benefits of local repository storage to project issues and proposals.

Radicle’s peer-to-peer model allows you to directly exchange repos, issues, and diff proposals with your collaborators, without a third party host.


Can I use Radicle with GitHub, GitLab, or another code hosting service?
=======================================================================

Yes. Radicle apps function 100% independently of where you host your code, be it GitHub, GitLab, or IPFS. This means you can use Radicle for managing issues and code contributions and still continue to host your code on a service like GitHub.

Select how you’d like to host your code when initializing a Radicle project with the ``rad project init`` command, which will prompt you to select where you want to set your git remote.

The Radicle commands that interact with your source code (like proposing and merging diffs), will call out directly to git under the hood. So if there are any problems, you can use the existing git commands for managing merge conflicts.


What is the difference between Radicle and other P2P projects like Dat or Scuttlebutt?
=========================================================================================

While taking inspiration from other P2P projects like ZeroNet, Dat, and Scuttlebutt — as well as making use of IPFS for data replication — Radicle’s design centers on creating peer-to-peer tools for open source software development.

That said, there are some conceptual differences between Radicle and the P2P protocols above that are worth noting.

Both Dat and IPFS are “data-centric,” and often you’ll hear them called “distributed file systems” for this reason. Both make use of content addressing and DHTs to index and discover data on the network.

Similarly, we might say Scuttlebutt is “people-centric,” where each person or device has a personal feed represented by a hash-linked list of cryptographically signed messages. Rather than using a DHT for discovery, the Scuttlebutt gossip protocol propagates data through the social network, where users replicate all messages from the feeds they follow.

In Radicle, everything is centered around peer-to-peer collaboration tooling. Phrased another way, Radicle is program-centric. These peer-to-peer programs, also known as Radicle State Machines or RSMs, use the model of a state machine represented by a hash-linked list of inputs that are sequentially applied to the initial program state.

Through one lens these RSMs look quite similar to Scuttlebutt feeds, where instead of feeds representing a chain of messages signed by a Scuttlebutt user, RSMs represent a chain of updates to the state of a Radicle app.

Unlike Scuttlebutt however, Radicle apps have no social graph to allow data to propagate throughout the network. Rather than relying on its own custom network and replication layer, Radicle uses IPFS as the peer-to-peer infrastructure on which to build Radicle apps. RSM updates are written as IPFS objects, using IPLD to link between these IPFS objects, and lastly we use IPNS to give us persistent identifiers for RSMs that resolve to the current state.


If I am a project owner, can I get updates from contributors if we are not online at the same time?
===================================================================================================

Currently the owner of the project must be online in order to receive any proposed RSM updates from a contributor. Once received and processed, these updates will be written to IPFS by the project owner, and made available to all users who follow that project.

To alleviate this, one workaround is to run Radicle from a server that will always be online, setting that radicle-daemon to be the project owner. However, this means that all issue management and merging of diff proposals must happen from that server.

We’re aware that this is not ideal from a usability perspective, and are currently investigating alternative ways to help with this problem.

Can I collaborate on a local area network without an internet connection?
=========================================================================

LAN-only collaboration isn't supported yet. IPFS still needs to connect to outside bootstrap nodes in order to read and write data from the network so a direct connection to the internet is required.

Can I collaborate privately?
============================

Radicle does not explicitly support private collaboration. All data, projects, and peer-to-peer communication is publicly available on the IPFS network to anyone who knows your project ID.



Can I use the Radicle collaboration apps with my favorite editor?
=================================================================

Yes. ``rad issues`` and ``rad proposals`` uses whichever text editor is set in the $EDITOR environment variable. Set your default editor with ``export EDITOR=vim`` by executing the command in your terminal or setting the $EDITOR environment variable in your ``.bash_profile``.

