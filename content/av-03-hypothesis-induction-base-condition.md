---
title: 3. Hypothesis-Induction-Base Condition
slug: av-03-hypothesis-induction-base-condition
module: recursion-notes
order: 3
status: live
source: notes
level: video 3 · 20:16
summary: Notes from video 3 of Aditya Verma's recursion playlist — the IBH framework, the order to apply it in, and the decision rule for when to use it instead of drawing a tree.
---

# 3. Hypothesis-Induction-Base Condition

> **Study notes from [Aditya Verma's](https://www.youtube.com/@TheAdityaVerma)
> recursion playlist**, video 3. The framework and the framing are his — this is
> my write-up for revision. **Watch the original**; these notes are no
> substitute for it.

**Playlist:** https://www.youtube.com/playlist?list=PL_z_8CaSLPWeT1ffjiImo0sYTcnLzo-wY

> ⚠️ **Built from a timestamped AI summary of the video, not from watching it.**
> The framework, its ordering, and the decision rule are consistent across the
> summary and the video's own title, so they are solid. Fine detail should still
> be checked. Timestamps are given so you can jump straight to any claim.

> 🎯 **This is the video that settles the open question** raised in
> [video 2's notes](av-02-recursion-is-everywhere.html#4--the-technique--544-to-608):
> are the tree method and IBH one framework or two? **They are two**, and this
> video gives the rule for choosing. See §5.

---

## 1 · The framework — 2:17 to 6:30

Three steps, and **the order in the title is the order you apply them in**:

| Step | What you do | The question |
|---|---|---|
| **1. Hypothesis** | Assume a function already solves the problem for input `n` | *What does this function promise to do?* |
| **2. Induction** | Call it on a smaller input, then do the one extra step | *Given the smaller answer, what single step finishes it?* |
| **3. Base condition** | Stop at the smallest **invalid** input | *What input is too small to do any work on?* |

**The base condition is defined as the smallest *invalid* input**, not the
smallest valid one. For printing 1 to N, that is `n == 0` — not `n == 1`. This
framing is more reliable than "the smallest case I can answer", because you do
not have to decide what the answer *is*, only where to stop.

> **"Recursion works like magic."** The hypothesis step is the magic: you assume
> the function works on the smaller input without checking. That assumption is
> the entire method — and refusing to make it is why people find recursion hard.

The other repeated phrase is **"input smaller"** — the whole move is: make the
input smaller, hand it to yourself, do one step with what comes back.

---

## 2 · The worked example — 6:30 to 13:10

**Print 1 to N**, demonstrated with `n = 7`.

```
HYPOTHESIS   assume print(n-1) correctly prints 1 .. n-1
INDUCTION    so call print(n-1) first, then print n
BASE         if n == 0, return          <- smallest INVALID input

print(7)
  print(6)
    print(5)
      ...
        print(1)
          print(0)   -> base, returns immediately
          prints 1                        <- work happens on the way BACK UP
        prints 2
      ...
  prints 7

output: 1 2 3 4 5 6 7
```

```cpp
void print(int n) {
    if (n == 0) return;      // base condition -- smallest invalid input
    print(n - 1);            // hypothesis -- trust that this prints 1..n-1
    cout << n << " ";        // induction  -- the one step for THIS n
}
```

```python
def print_1_to_n(n):
    if n == 0:                 # base condition
        return
    print_1_to_n(n - 1)        # hypothesis -- trust it
    print(n, end=" ")          # induction -- one step, on the way up
```

**The line order is the entire lesson.** Put `print(n)` *before* the recursive
call and you get 7 down to 1; put it *after* and you get 1 up to 7. Same three
lines, opposite output — because code before the call runs on the way down and
code after it runs on the way back up.

---

## 3 · The recursion tree here is a chain — 13:10 to 16:50

Worth noticing, because it differs from the [subsets tree](recursion-intro.html#4-the-choice-diagram-inputoutput-method):

```
IBH problems              CHOICE problems
  n                            []
  |                          /    \
 n-1                      take   skip
  |                        / \    / \
 n-2                     ...  ... ... ...
  |
 ...                     a BRANCHING tree -- 2^n nodes
  |
  0                      each level makes a DECISION

a CHAIN -- n nodes
no decision at any level,
only reduction
```

> **There is no choice being made at any level here.** That is precisely why the
> input–output tree method does not apply, and why a separate framework exists.
> If you catch yourself trying to draw two branches for "sort an array", that is
> the signal you are in the wrong framework.

The return path is what produces the output — the printing happens as the stack
unwinds, not as it builds.

---

## 4 · The warnings

Both are worth taking seriously.

| Time | Warning |
|---|---|
| **14:45** | **Do not force this method onto every problem.** Some problems are better solved by designing the recursion tree directly. |
| **15:31** | **Do not think in loops.** Trying to map the recursion onto an iterative loop actively obstructs understanding the recursive flow. |

**The second is the one that bites beginners.** The instinct on seeing
`print(n-1)` is to unroll it mentally into an iteration — and that is exactly
the tracing habit that makes recursion feel impossible. Trust the hypothesis
instead.

---

## 5 · The decision rule — which framework, when

**This answers the question left open in video 2.**

> **Draw the tree if you can see it. Use IBH when you cannot.**

| | |
|---|---|
| **Recursion tree / input–output** | When the decision flow is visible — you can see the choices and sketch the branches |
| **IBH** | When you *cannot* visualise the tree. It is the reliable fallback for problems where the decision structure is not obvious |

**So they are not two disjoint problem categories.** IBH is a *fallback method*
for when the tree is not apparent — which is a more practical rule than sorting
problems into two bins up front.

> **This corrects my [recursion page](recursion-intro.html).** That page presents
> the two as parallel frameworks selected by problem type ("can I see choices?"
> versus "can I reduce the input?"). His actual rule is sequential: **try to see
> the tree; if you can't, fall back to IBH.** The distinction matters, because
> under my version you might reject IBH for a problem that has choices — under
> his, IBH is always available when you are stuck.

---

## 6 · Problems named for later

| Time | Problem |
|---|---|
| 6:30 | **Print 1 to N** — solved here |
| 17:12 | Delete the middle element of a stack |
| 17:15 | Remove duplicates from a string |
| 17:18 | Number of occurrences |

All three are the same reduce-and-rebuild shape as the worked example.

---

## 7 · Triage — if you are short on time

| Segment | Time |
|---|---|
| **The technique itself** | **7:10 – 10:10** — the three minutes that matter |
| Motivation and context | 0:00 – 3:00 |
| Roadmap and channel | 18:40 – 20:16 |

**Watch 7:10–10:10 first.** The rest is framing you can pick up afterwards.

---

## 8 · What tripped me up

*Fill this in as you solve — this is the part that pays off later.*

-
-

---

## 9 · Problems to do

| # | Problem | Done | Day 7 |
|---|---|---|---|
| 1 | Print 1 to N | | |
| 2 | Print N to 1 (move one line) | | |
| 3 | Delete middle element of a stack | | |
| 4 | Remove duplicates from a string | | |
| 5 | Number of occurrences | | |

---

## Stop condition

I have got this video when I can:

1. name the three steps **in the order they are applied**,
2. define the base condition as the smallest *invalid* input and say why that
   framing is easier,
3. write print-1-to-N and print-N-to-1 by moving one line,
4. explain why this tree is a chain and not a branching tree, and
5. state the decision rule: **draw the tree if you can see it, use IBH when you
   cannot.**
