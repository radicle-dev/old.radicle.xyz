---

title: "Pattern matching in Radicle"
date: 2019-04-04
markup: mmark
author: "James Haydon"
draft: true
summary: "TODO"

---

Radicle is meant to be *minimal*, to keep the implementation as simple as
possible (and hopefully correct), and so that the semantics of a machine are
clear. That's why we chose a LISP, this keeps the syntax as simple as
possible. Programming in such a minimal language was tedious though; it was not
uncommon to see things like:

```
(def f
  (fn [x]
    (if (> (length x) 2)
      (do (def a (nth 0 x))
          (def b (nth 1 x))
          (def c (nth 2 x))
          ...)
       (do ...))))
```

i.e. lots of nested `if`-constructs for splitting out cases depending on the
shape of an input, and lots of binding of variables using various accessor
functions. If felt like destructuring or pattern-matching was going to help a
lot here at making Radicle code more elegant and compact. But how much would
such a feature complicate the implementation? How minimal can pattern matching
get?

Here was out wish-list of pattern matching abilities that we wanted:

- Pattern match a sequence, extracting the first item and the rest of the items.

- Pattern match a sequence of fixed size, extracting all the items into a
  separate variable.

- Pattern match a dict, extracting some of the fields.

- A Wildcard pattern `_` that matches anything, and can be used several times in a
  pattern (matching potentially different things each time).

- Nesting of the above patterns.

To make the implementation as minimal as possible we decided it would be best if
most of it was implemented in Radicle itself.

## What is a pattern?

Let's take the `/cons` pattern, which extracts the head and tail of sequence:

```
(match [1 2 3 4]
  (/cons x xs) (put-str! (show x))
  /nil         (put-str! "empty!"))
```

This should print `1`. From this we see that a pattern takes some variables as
arguments and describes a way to bind those varibales to sub-parts of a value,
if the value is of some specific sort (in this case a non-empty sequence).

But what about nesting of patterns? For example:

```
(match [1 2 3 4]
  (/cons x (/cons y xs)) (put-str! (show x))
  _                      (put-str! "no second item!"))
```

From this we see that the arguments to a pattern might be other patterns, not
just simple variables. So how could we represent what `(/cons x (/cons y xs))`
does in Radicle itself? When `(/cons x (/cons y xs))` appears in a
pattern-matching construct, at run-time, given a value `v`, the interpreter must
work out:

- Does the value `v` match `(/cons x (/cons y xs))`?
- If so, what does it bind `x` and `y` to?

So we decided that a pattern should just be a function which takes in the value
to be matched, and returns one of two possible sorts of values:

- `:nothing` if the value does not match the pattern,
- `[:just b]` if the value does match the pattern, where `b` represents the
  *bindings* introduced by the pattern to the branch that follows the pattern.

So in the case of `(/cons x (/cons y xs))`, this should be a function which
takes in a value `v` and checks if it has at least 2 items. If it does it should
return a dict:

```
{'x (first v)
 'y (first (rest v))
 'xs (rest (rest v))
 }
```

So `\cons` on its own is a higher-order pattern, which takes two patterns as
arguments. Sometimes the argument is just a variable that the programmer would
like to bind. These are patterns which match anything and return the binding to
that variable. We can code this pattern up right away:

```
(def /var
  (fn [var]
    (fn [v] {var v})))
```

But this means we have to use `/var` whenever we want to bind a variable, so for
example our first example would now be:

```
(match [1 2 3 4]
  (/cons (/var 'x) (/var 'xs)) (put-str! (show x))
  /nil                         (put-str! "empty!"))
```

This is a little noise, but we'll see how we remove the need for the `/var` a
little later.

## Non-linear patterns

Wouldn't it be great if we had non-linear patterns?! blabla
