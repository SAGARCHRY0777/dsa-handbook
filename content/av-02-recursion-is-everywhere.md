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
> 2. **A timestamped AI summary** (Gemini's YouTube integration) — the structure
>    and timestamps below come from this. Coherent, but AI-generated.
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

The progression, with the difficulty tiers as he gives them.

### Easy — printing *(4:23–4:49)*

| Problem | The point |
|---|---|
| Print 1 to N | The base case, bare |
| Print N to 1 | Same tree; work done on the way *down* instead of up |

> **These two are not filler.** Code placed *before* the recursive call runs on
> the way down; code placed *after* it runs on the way back up. One function,
> two orderings, and nearly every later problem depends on knowing which is
> which.

### Medium — reduce and rebuild *(4:53–5:19)*

| Problem | The reduction |
|---|---|
| **Sort an array** | Sort the first n−1, then insert the last element in place |
| **Delete the middle element of a stack** | Pop, recurse, push back |
| **Remove duplicates** | Reduce, rebuild without the repeat |

**All three are one move:** take an element off, trust the recursion on what
remains, put the element back correctly. This is the
[IBH family](recursion-intro.html#5-ibh--induction-base-hypothesis) — and IBH is
taught next, in **video 3**.

### Hard — constrained generation *(5:19–6:54)*

| Problem | The choice |
|---|---|
| **Generate all balanced parentheses** | Open or close, subject to a count constraint |
| **Binary string generation** | 0 or 1, subject to a prefix constraint |

> **These are hard for a specific reason:** the choice is *constrained*. You
> cannot always take both branches — an unmatched close paren is invalid before
> you finish. A choice diagram where some branches are illegal **is**
> [backtracking](backtracking.html), so this is where the series quietly
> crosses into it.

---

## 4 · The technique — 5:44 to 6:05

The **input/output method**: build a recursion tree, tracking what input is left
and what output you have built so far, and read the code off the picture.

Covered in detail in [video 1's notes](recursion-intro.html#4-the-choice-diagram-inputoutput-method).
Nothing new is added here — it is named as the tool the hard problems will use.

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
| Sorting/stack problems were "IBH family" with no tier | They are the **medium** tier |
| Parens and binary strings were mid-series choice problems | They are the **hard** tier — the endpoint |
| Josephus problem is the last problem of the series | **Unconfirmed.** Only in the garbled captions; not in the timestamped summary |
| Permutation with spaces / case change are in the syllabus | **Unconfirmed.** Same — likely later videos, not named here |

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

| # | Problem | Tier | Family | Done | Day 7 |
|---|---|---|---|---|---|
| 1 | Print 1 to N | easy | warm-up | | |
| 2 | Print N to 1 | easy | warm-up | | |
| 3 | Sort an array | medium | IBH | | |
| 4 | Sort a stack | medium | IBH | | |
| 5 | Delete middle element of a stack | medium | IBH | | |
| 6 | Reverse a stack | medium | IBH | | |
| 7 | Remove duplicates | medium | IBH | | |
| 8 | Generate balanced parentheses | hard | constrained choice | | |
| 9 | Binary strings (more 1s than 0s) | hard | constrained choice | | |

---

## Stop condition

I have got this video when I can:

1. say why recursion sits *underneath* DP, backtracking and divide-and-conquer
   rather than beside them,
2. explain why the series refuses to teach recursion through tree problems,
3. place each syllabus problem in easy / medium / hard without looking, and
4. say why the two hard problems are the bridge to
   [backtracking](backtracking.html).
