---
title: Roadmap
slug: roadmap
module: start
order: 1
status: live
summary: Week-by-week plans for two weeks, eight weeks and sixteen weeks — with the things each one deliberately gives up.
---

# Roadmap

Three plans, by how much time you actually have. Each is explicit about what it
**abandons**, because a plan that pretends you can cover everything is a plan
that covers nothing.

---

## The pattern coverage curve

This is the single most useful fact for planning. Interview problem frequency is
heavily concentrated:

```
   cumulative share of interview questions covered

   100% ┤                                        ▁▂▄████
        │                                ▁▂▄▆████
    85% ┤                        ▁▂▄▆████
        │                ▁▂▄▆████
    60% ┤        ▂▄▆█████
        │   ▄████
    30% ┤▄██
        └──┬────┬────┬────┬────┬────┬────┬────┬────┬───
        hash 2ptr slid bsrch tree graph heap stack  DP
         two  ptrs  win

   PATTERNS 1-4    ≈ 45%    arrays, strings, hashing, two pointers,
                             sliding window, binary search
   PATTERNS 1-8    ≈ 60-65% + prefix sum, sorting/greedy, intervals, stack
   THROUGH 12      ≈ 85%    + trees, graphs, heap
   DP + the rest   ≈ 100%   the long tail. Expensive per point gained
```

**DP is roughly 15% of questions and 40% of study time if you let it be.** Every
plan below front-loads the cheap patterns and treats DP as the last thing, not
the first. The classic failure is spending three weeks on DP and then failing an
easy hashing question.

---

## Plan A · Two weeks

**Goal:** pass a screening round. **Abandons:** DP, backtracking, bit
manipulation, most hard problems.

This is triage, not preparation. Be at peace with that.

| Days | Focus | Problems | Outcome |
|---|---|---|---|
| **1–2** | Hashing, arrays | 12 easy, 4 medium | Frequency counting automatic |
| **3–4** | Two pointers, sliding window | 4 easy, 10 medium | The two highest-frequency patterns |
| **5–6** | Binary search, incl. on the answer | 4 easy, 8 medium | The senior filter |
| **7** | **Review day.** Re-solve the ones you failed | — | This day is not optional |
| **8–9** | Trees: traversal, BFS/DFS, BST | 6 easy, 8 medium | Near-certain to appear |
| **10–11** | Graphs: BFS/DFS, topological sort | 2 easy, 8 medium | Grid problems are graphs |
| **12** | Heap and top-k | 2 easy, 5 medium | Cheap pattern, high frequency |
| **13** | **Mock interview.** Timed, out loud, with a human | 2 problems | The skill actually being tested |
| **14** | Review everything you failed. Nothing new | — | Consolidation beats coverage |

**Total: ~75 problems.** Roughly 5–6 hours a day. If you have less time, cut
days 10–12 before you cut day 7 or day 13.

> **The two-week rule:** on day 13 you will be tempted to learn DP because you
> feel exposed. Do not. Being solid on eight patterns beats being shaky on
> twelve, and interviewers can tell the difference immediately.

---

## Plan B · Eight weeks

**Goal:** competitive for most product companies. **Abandons:** hard DP,
advanced graphs, competitive-programming techniques.

| Week | Patterns | Problems | Note |
|---|---|---|---|
| **1** | Hashing · Arrays · Prefix sum | 25 | Build the habit: same time every day |
| **2** | Two pointers · Sliding window | 25 | The highest-frequency pair |
| **3** | Binary search · Sorting & greedy | 25 | Binary search on the answer is the key idea |
| **4** | **Review + first mock** | 15 re-solves | Re-derive week 1–3 problems cold |
| **5** | Stack · Monotonic stack · Intervals | 25 | Monotonic stack feels alien until it clicks |
| **6** | Trees · BST · LCA | 30 | Recursion fluency compounds into graphs |
| **7** | Graphs · Union-find · Topological sort | 30 | The heaviest week |
| **8** | Heap · Linked list · **Review + mocks** | 25 | Two mocks minimum |

**Total: ~200 problems**, about 15–20 hours a week.

**Week 4 is a full review week and it is where people cheat.** Skipping it to
cover more patterns is the single most common way to reach week 8 having
forgotten week 1.

---

## Plan C · Sixteen weeks

**Goal:** FAANG-competitive, including hard rounds. **Abandons:** nothing, but
requires genuine consistency.

| Weeks | Focus |
|---|---|
| **1–3** | Arrays, hashing, two pointers, sliding window, prefix sum |
| **4–5** | Binary search (incl. on the answer), sorting, greedy, intervals |
| **6** | **Review + mocks.** Re-derive everything from weeks 1–5 |
| **7–8** | Stack, monotonic stack, queue, deque, linked list |
| **9–10** | Trees: traversal, BST, LCA, tree DP |
| **11–12** | Graphs: BFS/DFS, Dijkstra, union-find, topological sort |
| **13** | **Review + mocks** |
| **14–15** | Dynamic programming: 1D, 2D, knapsack, LIS, interval DP |
| **16** | Backtracking, bit manipulation, hard mixed practice, mocks |

**Total: ~350 problems.** Two review weeks, and mock interviews from week 6
onward — weekly if you can find partners.

**DP arrives at week 14 deliberately.** By then recursion is fluent from trees
and graphs, which is most of what makes DP hard. Starting DP in week 2 is
attempting the hardest pattern with the weakest foundations.

---

## The daily shape, whichever plan

```
   ┌─────────────────────────────────────────────────────────┐
   │  10 min   REVIEW: re-derive 2 problems from last week    │
   │           (from memory, not by re-reading)               │
   ├─────────────────────────────────────────────────────────┤
   │  90 min   NEW: 3-4 problems on today's pattern           │
   │           25 min max each, then look at the solution     │
   ├─────────────────────────────────────────────────────────┤
   │  20 min   WRITE UP: for each one you failed, one line -- │
   │           what was the insight you missed?               │
   └─────────────────────────────────────────────────────────┘
```

**The 10-minute review block is the highest-value part of the day** and the
first thing people drop. Spaced repetition is what converts solved problems into
recalled patterns; without it you are filling a bucket with a hole in it.

---

## Milestones worth measuring

Not problem counts. These:

| Milestone | Test |
|---|---|
| **Pattern recognition** | Read 10 unseen problems. Name the pattern for 8+ within 60s each |
| **Template fluency** | Type binary search, BFS and DFS from memory, no syntax errors |
| **Cold re-derivation** | Re-solve a problem from 2 weeks ago without hints, in under 20 min |
| **Talking while coding** | Explain your approach out loud for 5 min before writing anything |
| **Complexity on sight** | State time and space for your solution without being asked |

**The last two are scored explicitly in real interviews** and are the ones
nobody practises. A correct solution delivered in silence scores worse than a
slightly slower one narrated well.

---

## What to do when you fall behind

You will. The plans assume a consistency nobody sustains perfectly.

**Do not restart, and do not skip the review days to catch up.** Falling a week
behind on new material costs you a week. Skipping review costs you everything
learned before it. If you must cut, cut breadth — drop a pattern entirely rather
than covering all of them shallowly.

**Cut in this order:** bit manipulation → backtracking → hard DP → linked lists
→ advanced graphs. Never cut hashing, two pointers, sliding window, binary
search or trees.
