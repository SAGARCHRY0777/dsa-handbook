---
title: 2. Recursion is Everywhere
slug: av-02-recursion-is-everywhere
module: recursion-notes
order: 2
status: live
source: notes
level: video 2 · 9:05
summary: Notes from video 2 of Aditya Verma's recursion playlist — why recursion sits underneath DP, backtracking and divide-and-conquer, and why the series isolates it from data structures.
---

# 2. Recursion is Everywhere

> **Study notes from [Aditya Verma's](https://www.youtube.com/@TheAdityaVerma)
> recursion playlist**, video 2. The argument and the framing are his — this is
> my write-up for revision. **Watch the original**; these notes are no
> substitute for it.

**Video:** https://www.youtube.com/watch?v=ZQMQW8YVuZ4 — 9:05
**Playlist:** https://www.youtube.com/playlist?list=PL_z_8CaSLPWeT1ffjiImo0sYTcnLzo-wY

> ⚠️ **How this page was made, so you know what to trust.** Three sources, none
> of them the video itself:
>
> 1. **The video description** — clean, first-party, reliable.
> 2. **Two timestamped AI summaries** (Gemini's YouTube integration) — the
>    structure, timestamps and problem list come from these. Coherent and
>    mutually consistent, but AI-generated and not independent of each other.
> 3. **The Hindi auto-captions** — badly mangled; used only where they agreed
>    with source 2.
>
> **Nobody watched the video to write this.** The argument is solid — all three
> sources agree on it. Anything marked *(unconfirmed)* appeared in only one
> source. **Fix this page as you watch**; timestamps are given so you can jump
> straight to each claim.

---

## 1 · The argument — 0:18 to 2:40

> **Recursion is not a topic alongside DP and backtracking. It is what they are
> built out of.**

Two claims, and the second is the one that matters:

**It is everywhere structurally** *(0:32–0:46)* — trees, linked lists, graphs.
Traversing any of them is recursion whether you call it that or not.

**It is the base of the advanced paradigms** *(1:43–1:57)* — dynamic
programming, backtracking, and divide-and-conquer are all recursion with
something added.

```
                      RECURSION
                          |
        +-----------------+------------------+
        |                 |                  |
   Dynamic          Backtracking       Divide and
   Programming      = recursion        Conquer
   = recursion      + choice tree      = recursion
   + memo           + undo             + split/combine

   and structurally, it is how you walk:
        trees · linked lists · graphs
```

**The interview consequence** *(0:23–0:30, 2:28–2:49)*: skipping recursion is a
serious preparation mistake, because it is not one topic you might be asked
about — it is underneath a large share of everything you will be asked about.

> This is the motivation video. Video 1 taught identification; this one argues
> why it is worth the effort. There is no new technique here — **if you are short
> on time, this is the one video in the series you could watch at 2×.**

---

## 2 · Why the series isolates recursion — 2:40 to 3:45

**The most useful idea in the video**, and it explains the whole syllabus.

Recursion lives inside trees, graphs and DP — but you cannot *learn* it there,
because a tree problem demands you already know trees. The recursion gets tangled
with prerequisites and you cannot tell which part you failed at.

> **So the series teaches recursion as a standalone skill** *(3:27–3:58)*,
> deliberately choosing problems where recursion is the *entire* difficulty —
> no tree, graph, or DP knowledge required. Isolate the base logic first
> *(3:47–4:06)*, then apply it to the broader concepts later.

| | |
|---|---|
| **Excluded** | Tree, graph and DP problems — they carry prerequisites |
| **Included** | Problems where recursion is the only thing being tested |
| **Why** | So the thing you practise is the thing you are learning |

**This is worth stealing as a study principle generally: isolate a skill before
combining it.** It is also why this series works better than learning recursion
"through" binary trees, which is how most courses do it.

---

## 3 · The syllabus — 4:06 to 7:05

**Every problem named in the video, with its timestamp.** Two are solved or
demonstrated here; the rest are announced as the series' plan.

| Time | Problem | Family | Why it is there |
|---|---|---|---|
| 4:23 | **Print 1 to N, and N to 1** | reduce | The base case, bare — and the down/up distinction |
| 4:53 | **Sort an array** | reduce | Sort n−1, insert the last element |
| 5:03 | **Sort a stack** | reduce | Same move, different container |
| 5:11 | **Delete the middle element of a stack** | reduce | Pop, recurse, push back |
| 5:16 | Remove duplicates from a list | reduce | Reduce and rebuild without the repeat |
| 5:18 | Count the number of bits | reduce | Numeric reduction rather than structural |
| 5:21 | **Subset generation** | choice | The canonical take-it-or-leave-it tree |
| 5:25 | Permutation with spaces | choice | Insert a space, or don't |
| 5:28 | Permutation with case changes | choice | Upper or lower, per letter |
| 5:31 | Letter case permutation | choice | Same family, letters only |
| 6:12 | **Binary strings, N-bit with 1s ≥ 0s** | **constrained choice** | The prefix constraint |
| 6:35 | **Balanced parentheses generation** | **constrained choice** | The count constraint |

**Two structural things fall out of that list:**

**It splits cleanly into three groups**, and the ordering is the curriculum:

```
  REDUCE          take one element off, trust the rest, put it back
  (4:23 - 5:18)   -> this is IBH, taught in VIDEO 3

  CHOICE          take it or leave it, at every element
  (5:21 - 5:31)   -> this is the input-output tree

  CONSTRAINED     take it or leave it, but some branches are ILLEGAL
  CHOICE          -> this is where it becomes BACKTRACKING
  (6:12 - 6:35)
```

**The two hardest problems are hard for one specific reason:** the choice is
constrained. You cannot always take both branches — an unmatched close paren is
invalid before you finish the string, so the branch must be pruned. **A choice
tree where some branches are illegal is
[backtracking](backtracking.html)**, which is why these sit at the end.

---

## 4 · The technique — 5:44 to 6:08

He calls it **input–output mapping**: rather than tracking state transitions,
you hold two things — the input you have left, and the output you have built —
and let a recursion tree show you the rest.

**The demonstration is "print 1 to N", and it is the whole method in miniature:**

```
Goal: print 1 2 3 ... N

  HYPOTHESIS   assume solve(N-1) already prints 1 .. N-1 correctly
  INDUCTION    so: call solve(N-1) first, then print N
  BASE         stop at N == 1 (or N == 0, printing nothing)

  solve(3)
    solve(2)
      solve(1)      base -- print 1
      print 2                        <- runs on the way BACK UP
    print 3

  output: 1 2 3
```

```python
def print_1_to_n(n):
    if n == 0:              # BASE
        return
    print_1_to_n(n - 1)     # HYPOTHESIS -- trust it
    print(n)                # INDUCTION -- one small step, on the way up

def print_n_to_1(n):
    if n == 0:
        return
    print(n)                # the ONLY change: print BEFORE the call
    print_n_to_1(n - 1)     # so it runs on the way DOWN
```

> **This is why the printing problems are not filler.** The two functions differ
> by one line's position. Code before the recursive call runs on the way *down*;
> code after it runs on the way *back up*. Almost every later problem in the
> series depends on knowing which you want, and this is the cheapest possible
> place to learn it.

### ⚠️ A discrepancy to resolve while watching

The summary I worked from describes "input–output method" as *the* framework and
folds hypothesis / induction / base condition inside it. But:

- the **print 1 to N** example above is plainly **IBH** — reduce the input, trust
  the smaller call, do one step;
- **video 3 is titled "Hypothesis-Induction-Base Condition"**, implying IBH is
  its own named framework;
- and [video 1](recursion-intro.html) presents the input–output *tree* as the
  tool for **enumeration** (subsets, permutations), which is a different shape.

**So either he uses "input–output" loosely here as an umbrella term, or the two
really are one framework in his telling and my
[recursion page](recursion-intro.html) is wrong to split them.**

**Check this in video 3 and fix whichever page is wrong.** It is the single most
important open question across these notes, because the two-framework split is
the organising idea of my write-up.

---

## 5 · How to work through it — 7:05 to 8:43

| | |
|---|---|
| **Do not skip videos** *(7:24–7:35)* | Stated explicitly. The path is sequential and cumulative — later videos assume earlier framing |
| **Practise, don't just watch** *(8:02–8:18)* | Proficiency is built by solving, not by watching someone solve |
| **Easy → medium → hard** | The ordering is deliberate, not incidental |

**The second one is the same claim the rest of this handbook makes**, and it is
the one people ignore. See [how to practise](how-to-practise.html).

---

## 6 · Corrections to my earlier guesses

Keeping these visible so the page's reliability is auditable:

| I had said | Actually |
|---|---|
| Sorting/stack problems were an untiered "IBH family" | They are the early-middle of the list, 4:53–5:18 |
| Parens and binary strings were mid-series | They are the **last two**, 6:12 and 6:35 — the endpoint |
| Permutation with spaces / case change: *unconfirmed* | **Wrong — they are in the list**, at 5:25 and 5:28. I downgraded them on one weak source and the fuller list restored them |
| *(missing entirely)* | **Count the number of bits** (5:18) and **letter case permutation** (5:31) — I had neither |
| Josephus problem is the last problem of the series | **Still unconfirmed.** It has not appeared in either detailed summary; treat as noise from the garbled captions until seen |

> **Note the second-to-last row.** I "corrected" the permutation problems out of
> the page, and that correction was itself wrong. Downgrading a claim on thin
> evidence is as much an error as asserting one — **the fix for a weak source is
> a better source, not a confident deletion.**

---

## 7 · What tripped me up

*Fill this in as you solve — this section is why the page exists.*

- The Hindi auto-captions on this playlist are close to useless. Use the
  transcript panel's language dropdown to switch to English (auto-translated),
  or an AI summary, rather than reading the Hindi ASR.
-
-

---

## 8 · Problems to do

The full series list, in the order he names them.

| # | Problem | Family | Done | Day 7 |
|---|---|---|---|---|
| 1 | Print 1 to N | reduce | | |
| 2 | Print N to 1 | reduce | | |
| 3 | Sort an array | reduce | | |
| 4 | Sort a stack | reduce | | |
| 5 | Delete middle element of a stack | reduce | | |
| 6 | Remove duplicates from a list | reduce | | |
| 7 | Count the number of bits | reduce | | |
| 8 | Subset generation | choice | | |
| 9 | Permutation with spaces | choice | | |
| 10 | Permutation with case changes | choice | | |
| 11 | Letter case permutation | choice | | |
| 12 | Binary strings, N-bit with 1s ≥ 0s | constrained | | |
| 13 | Balanced parentheses generation | constrained | | |

**Do them in this order.** Problems 1–7 all use the same reduce-and-rebuild move,
so once you have one you nearly have all seven. Problems 8–11 are the same
choice tree with a different branching rule each time. Only 12 and 13 introduce
something genuinely new — pruning.

---

## Stop condition

I have got this video when I can:

1. say why recursion sits *underneath* DP, backtracking and divide-and-conquer
   rather than beside them,
2. explain why the series refuses to teach recursion through tree problems,
3. place each syllabus problem in easy / medium / hard without looking, and
4. say why the two hard problems are the bridge to
   [backtracking](backtracking.html).
