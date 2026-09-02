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

> **Source note.** This page follows the method taught in
> [Aditya Verma's recursion playlist](https://www.youtube.com/playlist?list=PL_z_8CaSLPWeT1ffjiImo0sYTcnLzo-wY),
> video 1. It was **written from knowledge of the method, not transcribed from
> the video** — nobody watched it to produce this. Treat it as a scaffold to
> correct and extend as you work through the series, not as a record of what was
> said. Where your notes and this page disagree, **your notes win.**

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

**Everything in the series is one of these two.** Deciding which one you are in
is the first move on every problem.

```
                    Is this a recursion problem?
                              |
              +---------------+---------------+
              |                               |
    Can I see CHOICES?              Can I express the answer
    ("take it / leave it",           in terms of a SMALLER
     "which one next?")              version of the SAME problem?
              |                               |
              v                               v
    +-------------------+          +-----------------------+
    |  CHOICE DIAGRAM   |          |         IBH           |
    |  (recursive tree) |          | Induction, Base,      |
    |                   |          | Hypothesis            |
    | subsets           |          | sort an array         |
    | permutations      |          | reverse a stack       |
    | balanced parens   |          | tower of hanoi        |
    | N-bit binary      |          | delete stack middle   |
    +-------------------+          +-----------------------+
```

| | Choice diagram | IBH |
|---|---|---|
| **Shape of thinking** | Draw the tree of decisions | Assume the smaller case is solved |
| **What you track** | Input left, output built so far | Just the reduced input |
| **Typical problems** | Enumeration — all subsets, all permutations | Transformation — sort, reverse, move |
| **Base case comes from** | The bottom of the tree (input exhausted) | The smallest input you can answer directly |

> **This split is the whole value of the series.** People fail at "reverse a
> stack recursively" because they try to draw a choice diagram for it — there
> are no choices. And they fail at subsets because they try to reduce the input
> when what they need is to branch on it.

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

## 5 · IBH — induction, base, hypothesis

For problems with no choices, where the answer reduces to a smaller instance of
the same problem.

| Step | Question |
|---|---|
| **Hypothesis** | Assume the function *already works* on a smaller input. What does it give me? |
| **Base condition** | What is the smallest input I can answer with no recursion at all? |
| **Induction** | Given the smaller answer, what single step produces the full answer? |

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

**The order to answer the three is: hypothesis, base, induction.** Starting with
the base case is the instinct and it is backwards — you cannot know what the
smallest answerable input *is* until you know what the reduction looks like.

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

The series, and where each video lands in the two frameworks. **Fill this in as
you go** — the "your notes" column is deliberately blank.

| # | Video | Framework | Page here |
|---|---|---|---|
| 1 | Introduction and identification | both | **this page** |
| 2 | Recursive tree / choice diagram | choice | *to add* |
| 3 | Subsets / subsequences (IP–OP) | choice | *to add* |
| 4 | Unique subsets | choice | *to add* |
| 5 | Permutation with spaces | choice | *to add* |
| 6 | Permutation with case change | choice | *to add* |
| 7 | Letter case permutation | choice | *to add* |
| 8 | Generate all balanced parentheses | choice | *to add* |
| 9 | N-bit binary with more 1s than 0s | choice | *to add* |
| 10 | IBH introduction | IBH | *to add* |
| 11 | Sort an array | IBH | *to add* |
| 12 | Sort a stack | IBH | *to add* |
| 13 | Delete middle element of a stack | IBH | *to add* |
| 14 | Reverse a stack | IBH | *to add* |
| 15 | Kth symbol in grammar | IBH | *to add* |
| 16 | Tower of Hanoi | IBH | *to add* |
| 17 | Josephus problem | IBH | *to add* |

> **The video numbering above is from memory and may not match the playlist
> exactly.** Correct it as you go — that is the first thing to fix on this page.

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
4. state the three IBH questions **in the order you answer them**,
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
