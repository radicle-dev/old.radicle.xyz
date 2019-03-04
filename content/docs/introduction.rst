---

title: "Introduction"
date: 2019-02-05T18:12:20+01:00
draft: true
markup: rst

---

============
Introduction
============

Welcome to the Radicle docs! Whether you’re coming across Radicle for the
first time or looking to dig into how the Radicle stack works from a technical
perspective, you’re in the right place.

For a technical overview of Radicle, including some of the architectural
choices we’ve made, a good place to start is `this blogpost`_ on the Radicle
architecture.

If you want to dive straight in and play around with Radicle for yourself,
follow the installation instructions and then the `Try Radicle`_ guide in the
docs below.


The Case for Radicle
--------------------

When looking at the peer-to-peer tech landscape, it’s common to see projects
bootstrapping their own technology. P2P developer communities strive to be
active users and advocates of the tools they create, but it can be difficult
to move off of centralized platforms entirely, especially when organizations
like Github still play an essential role in the open source ecosystem.

This desire for P2P communities to be using P2P tools more generally isn’t
really new. Scuttlebutt has long discussions around new ideas of “teamware_.”
Projects like git-ssb_ and git-remote-ipfs_ have existed for some time already.

Rather than thinking of solutions for decentralized code collaboration within
the scope of a single P2P protocol, Radicle tries to take what it can learn
from existing solutions in the ecosystem, using these technologies directly
where possible, and build towards a compelling vision of a technology stack
that enables open source communities to easily to develop decentralized code
collaboration tools and applications.

Getting Involved
----------------

For general inquiries, chatter, or questions, the easiest ways to get in touch
is on the #radicle IRC channel on Freenode, or via our dev-mailing list.

As of the alpha release, we’re using Radicle for managing our issues. If you
want to track or submit issues, you can checkout the project on Radicle with
the following command:

``rad project checkout <<RAD_PROJECT_ID>>``

For making code contributions to Radicle we still accept PR’s through our
github_, since the rad diff app only works with single commit changes.

Lastly, the core Radicle team does weekly updates on `Secure Scuttlebutt`_, which
you can see by following the #radicle-weekly-updates channel. If you’re not a
scuttlebutt user already, pop over to IRC and we can give you an invite to our
own Scuttlebutt pub :)

Contributions to the Radicle project and interactions with the community should adhere to our [code of conduct](https://github.com/oscoin/radicle/tree/master/code-of-conduct.md).

.. _teamware: https://viewer.scuttlebot.io/%25ZyZge6x3sXi4kROFfhnGs8URgPEDq1thPjC0D8tPfms%3D.sha256
.. _git-ssb: https://git.scuttlebot.io/%25n92DiQh7ietE%2BR%2BX%2FI403LQoyf2DtR3WQfCkDKlheQU%3D.sha256
.. _git-remote-ipfs: https://github.com/ipfs-shipyard/git-remote-ipld
.. _`this blogpost`: ../blog/radicle-intro
.. _`Try Radicle`: ./#try-radicle
.. _github: https://github.com/oscoin/radicle
.. _`Secure Scuttlebutt`: https://scuttlebutt.nz
