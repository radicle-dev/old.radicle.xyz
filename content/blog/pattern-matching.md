---

title: "Pattern matching in Radicle"
date: 2019-04-04
markup: mmark
author: "James Haydon"
draft: false
summary: "We explain how pattern matching works in Radicle and how it's implemented under the hood."

---

Radicle is meant to be *minimal*, to keep the implementation as simple as
possible (and hopefully correct), and so that the semantics of a machine are
clear. That's why we chose a LISP, this keeps the syntax and semantics as simple
as possible (see for example Paul Graham's article [The roots of
LISP](http://paulgraham.com/rootsoflisp.html)). Programming in such a minimal
language was tedious though; it was not uncommon to see things like:

```
(def f
  (fn [x]
    (if (list? x)
      (if (> (length x) 2)
        (do (def a (nth 0 x))
            (def b (nth 1 x))
            (def c (nth 2 x))
            ...)
        "Should have length > 2!")
      "Should be a list!")))
```

i.e. lots of nested `if`-constructs for splitting out cases depending on the
shape of an input, and lots of binding of variables using various accessor
functions. It felt like destructuring or pattern-matching was going to give us
the biggest return on investment for making Radicle code easier to write and
clearer to understand. But how much would such a feature complicate the
implementation?  How minimal can pattern matching get?

Here was our wish-list of pattern matching abilities that we wanted:

- Pattern match a sequence, extracting the first item and the rest of the items.

- Pattern match a sequence of fixed size, extracting all the items into a
  separate variable.

- Pattern match a dictionary, extracting some of the fields.

- A Wildcard pattern `_` that matches anything, and can be used several times in a
  pattern (matching potentially different things each time).

- Nesting of the above patterns.

To make the implementation as minimal as possible, and to keep the footprint of
the Radicle spec/protocol small, we decided it would be best if most of it was
implemented in Radicle itself.

## What is a pattern?

Let's take the `/cons` pattern, which extracts the head and tail of a sequence:

```
(match [1 2 3 4]
  (/cons x xs) (string-append
                 "The head is "
                 (show x)
                 ", and the tail is "
                 (show xs))
  /nil         "empty!")
```

This should evaluate to `"The head is 1 and the tail is [2 3 4]"`. From this we
see that a pattern such as `(/cons x xs)`, whatever it is, takes some variables
as arguments (in this case `x` and `xs`) and describes a way to bind those
variables to sub-parts of a value, if the value is of some specific shape (in
this case a non-empty sequence).

But what about nesting of patterns? For example:

```
(match [1 2 3 4]
  (/cons x (/cons y xs)) (show x)
  _                      "no second item!")
```

From this we see that the arguments to a pattern might be other patterns, not
just simple variables. So how could we represent what `(/cons x (/cons y xs))`
does in Radicle itself? When `(/cons x (/cons y xs))` appears in a
`match`-expression, at run-time the interpreter must, given a value `v`, work
out:

- does `v` "match" `(/cons x (/cons y xs))`?
- if so, what new bindings should be available? In particular, what does it bind
  `x` and `y` to?

So we decided that a pattern is a function which takes in values to be matched,
and returns one of two possible sorts of values:

- The keyword `:nothing` if the value does not match the pattern,
- The 2-element vector `[:just b]` if the value does match the pattern, where
  `b` represents the *bindings* introduced by the pattern to the branch that
  follows the pattern.

So in the case of `(/cons x (/cons y xs))`, this should be a function which
takes in a value `v` and checks if it has at least 2 items. If it does it should
return a dict:

```
[:just
  {'x (first v)
   'y (first (rest v))
   'xs (rest (rest v))}]
```

So `\cons` on its own is a higher-order pattern, which takes two patterns as
arguments. So patterns are just functions, so they are easy to define. For
example here is a pattern which matches all keywords, and nothing else:

```
(def /keyword?
  (fn [v]
    (if (keyword? v)
      [:just {}]
      :nothing)))
```

Note that this pattern never makes any new bindings, it can just succeed or
fail; it's really just a restatement of the `keyword?` predicate.

While we are at it we might as well define `_`:

```
(def _ (fn [v] [:just {}]))
```

Sometimes the argument is just a variable that the programmer would like to
bind. These are patterns which match anything and return the binding to that
variable. We can code this pattern up right away:

```
(def /var
  (fn [var]
    (fn [v] [:just {var v}])))
```

But this means we have to use `/var` whenever we want to bind a variable, so our
previous example would now be:

```
(match [1 2 3 4]
  (/cons (/var 'x) (/cons (/var 'y) (/var 'xs))) (show x)
  _                                              "no second item!")
```

This is far too noisy! So instead what happens is that a special function
`match-pat` is called whenever a `match` is evaluated. This function inspects
the pattern and dispatches to a pattern matching function. This means that
patterns don't need to be functions anymore:

```
(def-rec match-pat
  (fn [pat v]
    (cond
      (atom? pat)
      [:just {pat v}]
      (some [(number? pat) (keyword? pat) (string? pat) (boolean? pat)])
      (if (eq? pat v) [:just {}] :nothing)
      (dict? pat)
      ((/dict pat) v)
      (or (vector? pat) (list? pat))
      ((/vec pat) v)
      :else
      (pat v))))
```

This version of `match-pat` inspects the pattern `pat` and:
- If it is an atom it will act as `/var` defined above. This means that when we
  want to bind the variable `x` in a pattern we can simply use `'x` instead of
  `(/var 'x)`.
- If it is a number, keyword, string or boolean value then it matches using
  `eq?`. So for example the pattern `42` will only match the number `42`.
- If `pat` is a dictionary or a vector then we dispatch to `/dict` or `/vect`
  respectively. We'll discuss these later.
- In all other cases we just call `pat` as a function, so custom patterns are
  easy to define and use.

The function `match-pat` is redefinable (well, shaddowable), so special patterns
can be added on a per module basis, and don't need to be imported globally.

The running example now becomes:

```
(match [1 2 3 4]
  (/cons 'x (/cons 'y 'xs)) (show x)
  _                         "no second item!")
```

This is in fact what we have in Radicle today. The only wart is that variables
bound in patterns have to be quoted (that is, `'x` rather than `x`), but this is
small price to pay for the power we get with first-class patterns.

The `/vec` patterns, allows one to match a vector based on a vector (or list)
based of patterns; elements and patterns are matched positionally. For example
`(/vec [p q])` will match vectors of length 2 for with the first item matches
the pattern `p` and the second item matches the pattern `q`. Because vectors are
treated specially in `match-pat` one can just use `[p q]` directly:

```
(match [:foo "hello" 42]
  [/keyword? 'x 0]  "bad"
  [/keyword? 'x 42] "good"
  _                 "not a vec!")
```

This in particular helps us with matching on [sum
types](https://en.wikipedia.org/wiki/Tagged_union), since we have come to
represent this in Radicle using vectors where the first element represents the
_constructor_ (or "tag"). For example Haskell trees:
``` haskell
data Tree a = Leaf a | Node (Tree a) (Tree a)
```
would be represented using values of form `[:leaf x]` and `[:node left right]`
in Radicle. So to sum up all the numbers at the leaves:

```
(def sum-leaves
  (fn [t]
    (match t
      [:leaf 'x]    x
      [:node 'l 'r] (+ (sum-leaves l) (sum-leaves r)))))
```

We also have patterns for dictionaries, which matches based on patterns
specified for some of the keys.

What we _don't have_ (yet) are _guards_. A guard for of a pattern is an
expression that uses the variables that have been bound within it, and which
should evaluate to a Boolean. The guard acts as an extra condition which must be
met for the pattern as a whole to match. For example trying to match vectors of
numbers of length 2 whose items do not sum to more that 10 would typically use
the pattern `['x 'y]` along with the guard `(< (+ x y) 10)`. It would not be
hard to add guards but we didn't settle on a syntax for them yet. We will
revisit guards if we feel the lack of them is making the Radicle code
significantly worse.
