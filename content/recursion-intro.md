---
title: Recursion — introduction & identification
slug: recursion-intro
module: recursion
order: 6
status: live
level: video 1 of the series
summary: How to tell a problem is recursive before you write anything, the two frameworks (choice-diagram and IBH), and why you must stop tracing the recursion.
---

# Recursion — introduction and identification

> **The method on this page is [Aditya Verma's](https://www.youtube.com/@TheAdityaVerma),
> not mine.** The choice-diagram / IBH split, the input–output framing, and the
> "don't trace it, trust the hypothesis" rule all come from his
> [recursion playlist](https://www.youtube.com/playlist?list=PL_z_8CaSLPWeT1ffjiImo0sYTcnLzo-wY).
> **Go watch it** — it is free, and it is the source.
>
> **This page was written from knowledge of that method, not transcribed.**
> Nobody watched the videos to produce it, so it is a scaffold, not a record of
> what was said.
>
> First-hand notes live separately under **Recursion · Aditya Verma** in the
> sidebar, badged `notes`. **Where the two disagree, the notes win.**
>
> ✅ **Corrected against video 3**: the IBH step order, and the rule for choosing
> between the two frameworks. Both were wrong here before —
> see [video 3's notes](av-03-hypothesis-induction-base-condition.html).

---

## 1 · The claim the series is built on

Most people learn recursion as *"a function that calls itself"*, then freeze on
every real problem, because that definition tells you what recursion **is** and
nothing about when to **reach for it** or how to **construct** one.

> **The reframe:** you do not write recursive code by thinking about the
> function. You write it by drawing a picture — either a **choice diagram** or a
> **smaller-input reduction** — and the code falls out of the picture.

So the skill splits in two, and they are different skills:

| Skill | Question it answers |
|---|---|
| **Identification** | Is this a recursion problem at all? |
| **Construction** | Given that it is, how do I build the recursion? |

Most tutorials teach only the second, on problems where the first was obvious.

---

## 2 · Identification — is it recursion?

Three signals. Any one is usually enough.

### Signal 1 — you can see choices

**The strongest signal.** If, at each step, you face a decision — take it or
leave it, pick which one goes next, include or exclude — then a decision tree
exists, and a decision tree *is* a recursion.

```
"Find all subsets of [1,2,3]"

  For element 1: take it, or don't.     <- a CHOICE
  For element 2: take it, or don't.     <- a CHOICE
  ...

Two choices, repeated -> a binary tree -> recursion.
```

### Signal 2 — the words "all", "every", "print all", "generate"

Enumeration means you must visit the whole space of possibilities, and the
natural way to walk a space of possibilities is a tree.

| Phrasing | Read as |
|---|---|
| "return **all** subsets" | Enumerate → recursion |
| "print **every** permutation" | Enumerate → recursion |
| "**generate all** valid …" | Enumerate → recursion |
| "**how many** ways" | Count → often DP, not enumeration |
| "the **best** way" | Optimise → often DP or greedy |

### Signal 3 — the constraints are tiny

`n ≤ 10`, `n ≤ 20`, or a string of length ≤ 16. Exponential work is being
*permitted*, which means it is being *expected*.

> **The constraint is the problem talking to you.** `n ≤ 20` with "return all"
> says the answer set is itself exponential, so an exponential algorithm is not
> a compromise — it is required.

**Anti-signals** — when it looks recursive and is not:

| Anti-signal | Actually |
|---|---|
| "count the number of ways" | DP — counting rarely needs enumeration |
| "maximum / minimum value of…" | DP or greedy |
| `n ≥ 10⁵` | Nothing exponential survives |
| Overlapping subproblems, one answer wanted | Recursion **+ memo** = DP |

---

## 3 · The two frameworks

**Everything in the series is one of these two** — but they are not two bins you
sort problems into. **They are ordered: try the tree first, fall back to IBH.**

```
                    Is this a recursion problem?
                              |
                              v
              Can I SEE the recursion tree?
              (can I sketch the choices and
               the branches for a small input?)
                              |
              +---------------+---------------+
             YES                              NO
              |                               |
              v                               v
    +-------------------+          +-----------------------+
    |  CHOICE DIAGRAM   |          |         IBH           |
    |  (input-output)   |          | Hypothesis,           |
    |                   |          | Induction,            |
    |  draw it, read    |          | Base condition        |
    |  the code off it  |          |                       |
    |                   |          | the RELIABLE FALLBACK |
    | subsets           |          | sort an array         |
    | permutations      |          | reverse a stack       |
    | balanced parens   |          | delete stack middle   |
    | N-bit binary      |          | print 1 to N          |
    +-------------------+          +-----------------------+
```

> **The decision rule, from
> [video 3](av-03-hypothesis-induction-base-condition.html#5--the-decision-rule--which-framework-when):
> draw the tree if you can see it; use IBH when you cannot.** IBH is not a
> parallel technique for a different class of problem — it is what you reach for
> when the decision flow is not visible. That makes it always available when you
> are stuck, which is exactly when you need a method.

| | Choice diagram | IBH |
|---|---|---|
| **Reach for it when** | You can already picture the branching | You cannot picture it |
| **Shape of thinking** | Draw the tree of decisions | Assume the smaller case is solved |
| **What you track** | Input left, output built so far | Just the reduced input |
| **Tree shape** | Branching — 2ⁿ nodes | **A chain** — n nodes, no decisions |
| **Typical problems** | Enumeration — all subsets, all permutations | Transformation — sort, reverse, print, count |
| **Base case is** | The bottom of the tree (input exhausted) | The smallest **invalid** input |

> **A useful tell:** if you find yourself trying to draw two branches for "sort
> an array", you are in the wrong framework. There is no choice at any level —
> only reduction — so the picture is a chain, and IBH is the tool.

---

## 4 · The choice diagram (input–output method)

The method for anything enumerative. **Two boxes: what input is left, and what
output you have built.**

```
Subsets of "ab"

                     IP="ab"  OP=""
                   /                 \
          (drop a)                     (take a)
        IP="b" OP=""                IP="b" OP="a"
         /        \                  /         \
   (drop b)     (take b)       (drop b)      (take b)
 IP="" OP=""  IP="" OP="b"   IP="" OP="a"  IP="" OP="ab"
      |            |              |             |
     ""           "b"            "a"          "ab"

Input empty -> that is the BASE CASE. Record the output.
```

**Reading the code straight off the picture:**

```python
def subsets(s):
    results = []

    def solve(ip, op):
        if not ip:                  # base case: nothing left to decide
            results.append(op)
            return
        # Two branches, exactly as drawn. Both get the SAME reduced input.
        solve(ip[1:], op)           # left  branch -- do not take ip[0]
        solve(ip[1:], op + ip[0])   # right branch -- take it

    solve(s, "")
    return results
```

**The construction procedure, in order:**

1. **Draw the tree** for the smallest interesting input — two or three elements.
2. **Label each edge** with the choice it represents.
3. **Find where it stops.** That condition is your base case; you did not have
   to guess it.
4. **Read one node's outgoing edges.** That is the body of the function.
5. **Write it.**

> **Draw before you type.** The overwhelmingly common failure is trying to
> derive the base case in your head. On paper it is simply the bottom of the
> tree, and it takes no thought at all.

---

## 5 · IBH — hypothesis, induction, base condition

For problems where the answer reduces to a smaller instance of the same problem
— and, per the decision rule in §3, **whenever you cannot see the tree.**

| Step | Question |
|---|---|
| **1. Hypothesis** | Assume the function *already works* on a smaller input. What does it promise? |
| **2. Induction** | Given the smaller answer, what single step produces the full answer? |
| **3. Base condition** | What is the smallest **invalid** input — the point at which there is nothing to do? |

> **Apply them in that order** — hypothesis, induction, base — which is also the
> order in the name of [video 3](av-03-hypothesis-induction-base-condition.html).
> Reaching for the base case first is the instinct and it is backwards: you
> cannot tell where to stop until you know what the reduction is.
>
> **Define the base case as the smallest *invalid* input, not the smallest valid
> one.** For print-1-to-N that is `n == 0`, not `n == 1`. It is an easier
> question, because you only have to say where to stop, not what the answer
> there should be.

**Worked — sort an array using recursion:**

```
HYPOTHESIS   sort(arr[0..n-2]) returns the first n-1 elements, sorted.
BASE         an array of size 1 is already sorted. Return.
INDUCTION    take the last element, and INSERT it into the sorted part.

sort([3,1,2])
  -> sort([3,1])            hypothesis: this works, gives [1,3]
     -> sort([3])           base: size 1, done
     -> insert 1 into [3]   induction step -> [1,3]
  -> insert 2 into [1,3]    induction step -> [1,2,3]
```

```python
def sort_array(arr):
    if len(arr) <= 1:               # BASE
        return
    last = arr.pop()
    sort_array(arr)                 # HYPOTHESIS -- trust it
    insert(arr, last)               # INDUCTION -- one step

def insert(arr, value):
    # Itself IBH: base = empty or value belongs at the end; hypothesis =
    # insert into the smaller array; induction = put the popped element back.
    if not arr or arr[-1] <= value:
        arr.append(value)
        return
    top = arr.pop()
    insert(arr, value)
    arr.append(top)
```

> **Correction.** This page originally said the order was *hypothesis, base,
> induction*. [Video 3](av-03-hypothesis-induction-base-condition.html) settles
> it: the order is **hypothesis, induction, base condition** — the same order as
> that video's title. Fixed above.

---

## 6 · Stop tracing the recursion

**The single most important habit in the series, and the hardest to adopt.**

When you write `sort_array(arr)` inside `sort_array`, the instinct is to trace
what happens next — into the call, into its call, four levels deep — until you
lose the thread and conclude recursion is confusing.

> **Do not trace it. Trust the hypothesis.** Assume the recursive call returns
> the correct answer for its smaller input, and ask only one question: *given
> that correct smaller answer, what single step gives me mine?*

This is exactly the logic of mathematical induction, which is why the framework
is called IBH. You do not verify induction by checking every n — you check the
base case and one step.

**In practice this means:**

| Do | Do not |
|---|---|
| Write the recursive call and move on | Step into it mentally |
| Check the base case is reachable | Trace 4 levels of the stack |
| Check one induction step is correct | Try to hold the whole tree in your head |
| Draw the tree for n = 2 or 3 | Draw the tree for n = 6 |

**The exception:** when you are *debugging*, trace the smallest failing case
fully. Trust is for construction; tracing is for diagnosis.

---

## 7 · Where the base case comes from

Both frameworks hand it to you, which is the point.

| Framework | Base case is |
|---|---|
| **Choice diagram** | The condition at the bottom of the tree — input exhausted |
| **IBH** | The smallest input answerable with no recursive call |

**Two failure modes:**

```
BASE CASE TOO LATE     -> infinite recursion, stack overflow
                          (you recurse past the valid range)

BASE CASE TOO EARLY    -> missing results
                          (you stop while decisions remain)
```

**A base case that never fires is the same bug as no base case.** `if n == 0`
in a function that is called with `n = 1, -1, -3, …` never triggers — guard with
`if n <= 0` when the step size is not one.

---

## 8 · The playlist map

**The playlist has 19 videos.** Rows marked ✅ are confirmed against the actual
playlist; the rest are still unverified guesses. Fix them as you reach them.

| # | Video | Length | Framework | Page here |
|---|---|---|---|---|
| 1 ✅ | Recursion — introduction & identification | 32:31 | both | **this page** |
| 2 ✅ | Recursion is Everywhere !! | 9:05 | — | *to add* |
| 3 ✅ | Hypothesis-Induction-Base Condition | 20:16 | **IBH** | *to add* |
| 4–19 | *unverified* | | | *to add* |

> **A correction worth noting.** My earlier guess put IBH at video 10, after a
> long run of choice-diagram problems. **It is video 3.** So the series teaches
> IBH *early* — identification, then a motivating video, then straight into the
> induction framework — rather than saving it for the second half.
>
> That changes how to read this page: §5 (IBH) is not advanced material to defer,
> it is the third thing he teaches. If you are following along, do §5 early.

Everything below row 3 is still from memory and should be treated as unreliable
until you check it.

**Your notes for each video go in the separate track**, created with:

```bash
npm run note -- 2 "Recursion tree and choice diagram"
```

That produces `av-02-…` under **Recursion · Aditya Verma**, badged `notes` so it
is never mistaken for this page. Two tracks, deliberately:

| Track | What it is | Authority |
|---|---|---|
| **Recursion** (this) | Synthesised, written without the videos | Scaffold — correct it |
| **Recursion · Aditya Verma** | Yours, taken while watching | **Source of truth** |

---

## 9 · How this connects to the rest of the handbook

Recursion is the substrate, not a separate topic:

| Page | Uses recursion as |
|---|---|
| [Backtracking](backtracking.html) | The choice diagram, **plus an undo step** — same tree, state mutated in place |
| [Trees](trees.html) | The structure is recursive, so every traversal is |
| [Graphs](graphs.html) | DFS is recursion with a visited set |
| [Dynamic programming](dynamic-programming.html) | Recursion + memo, once subproblems overlap |
| [Divide and conquer](binary-search.html) | IBH with two recursive calls instead of one |

> **The clearest way to see backtracking:** it is the choice diagram where,
> instead of passing a new output down (`op + ip[0]`), you mutate a shared path
> and undo on the way back up. Aditya Verma's IP–OP form builds new strings and
> needs no undo; the classic backtracking template mutates and therefore does.
> **Same tree, different bookkeeping** — and knowing they are the same tree is
> why this page comes before that one.

---

## 10 · Stop condition for this video

You are done with video 1 when you can:

1. give the three identification signals and two anti-signals,
2. say which of the two frameworks a problem needs, and why,
3. draw the IP–OP tree for subsets of a 2-character string,
4. state the three IBH questions **in the order you answer them** — hypothesis,
   induction, base condition,
5. explain why you must not trace the recursion, and
6. say where the base case comes from in each framework.

---

## Adding the next video

Copy this frontmatter, keep `module: recursion`, and increment `order`:

```yaml
---
title: Recursion — subsets & subsequences
slug: recursion-subsets
module: recursion
order: 7
status: live
level: video 3 of the series
summary: One line.
---
```

Then `npm run build`. The sidebar picks it up automatically.
