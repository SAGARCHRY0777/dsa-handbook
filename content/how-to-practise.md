---
title: How to practise
slug: how-to-practise
module: method
order: 5
status: live
summary: The method — timeboxing, the review cycle, what to do when stuck, and why solved-problem count is the wrong metric.
---

# How to practise

> **The one sentence:** looking at a solution before your time box expires feels
> efficient and is the single most effective way to spend six months solving
> problems without getting better.

Most people's practice method is: pick a problem, struggle for ten minutes, read
the solution, understand it, feel progress, move on. That produces a large
solved count and very little transferable skill.

---

## The session structure

```
   ONE PROBLEM, 25 MINUTES MAXIMUM

   0-2 min    READ. Restate it in your own words. Write down input,
              output, and one edge case. Do not start coding.

   2-5 min    RECOGNISE. What pattern is this? Say it out loud.
              If you cannot name one in 3 minutes, that is DATA --
              write down which cues you missed.

   5-8 min    BRUTE FORCE. State it and its complexity. Always.
              It is the baseline you are improving on, and interviewers
              ask for it explicitly.

   8-20 min   SOLVE. Code it. Talk while you type, even alone --
              especially alone.

   20-25 min  TEST. Empty input. Single element. Duplicates.
              All-same. Maximum size. Then trace one example BY HAND.

   ─────────────────────────────────────────────────────────
   25 min     STOP. Whether or not it works.
```

**When the timer goes, stop.** Do not push to forty minutes because you feel
close. The time box is what forces you to develop the recognition skill —
without it you brute-force your way through by persistence, which is not what an
interview measures.

---

## What to do when stuck

Do not read the full solution. Escalate in this order, and record where you
needed help.

| Level | What to do | What it teaches |
|---|---|---|
| **1** | Re-read the constraints. `n ≤ 10⁵` means O(n log n) — the bound *is* a hint | Reading the problem properly |
| **2** | Work a tiny example by hand, on paper, exhaustively | Where the structure actually is |
| **3** | Ask "what would make this easier?" — sorted input? a hash map? | Preprocessing instincts |
| **4** | Read *only the pattern name*, not the solution | Recognition, still self-solved |
| **5** | Read the first paragraph of the approach. Stop. Code the rest | Partial credit for partial help |
| **6** | Read the full solution — then **close it and re-solve from scratch** | The only way reading helps |

**Level 6 is not "read and understand".** It is read, close, wait an hour, and
re-derive it. If you cannot re-derive it, you did not learn it, and the solved
tick is a lie.

---

## The review cycle

This is the part that determines whether any of it sticks.

```
   solve a problem on day 0
        │
        ├── day 1    re-derive it. 5 min. From memory
        │
        ├── day 7    re-derive it. If it takes more than 10 min,
        │            it goes back to day-1 status
        │
        └── day 30   re-derive it. Now it is yours
```

**Re-derive, not re-read.** Open a blank file and solve it again. Recognition is
not recall, and interviews test recall under pressure.

A workable system: keep three lists — `new`, `day-7`, `day-30`. Each session
starts with two from a review list before anything new. It costs ten minutes and
it is the difference between 100 problems you know and 300 you have seen.

---

## Reading the constraints

The constraints tell you the intended complexity, and reading them properly is
free information most people skip.

| Constraint | Intended solution |
|---|---|
| `n ≤ 10` | Backtracking, permutations, bitmask — exponential is fine |
| `n ≤ 20` | Bitmask DP, `2ⁿ` |
| `n ≤ 100` | O(n³) — often interval or matrix DP |
| `n ≤ 1,000` | O(n²) — two nested loops, or 2D DP |
| `n ≤ 10⁵` | O(n log n) — sort, heap, binary search, or O(n) with a hash map |
| `n ≤ 10⁶` | O(n) — single pass, two pointers, prefix sum |
| `n ≤ 10⁹` | O(log n) or O(1) — binary search on the answer, or maths |

**A rough working figure is ~10⁸ simple operations per second.** So `n = 10⁵`
with an O(n²) solution is 10¹⁰ operations — far too slow, and you know that
before writing a line.

**"Answer within `10⁹`" or "find the minimum maximum"** almost always means
**binary search on the answer**. That phrase is worth memorising as a trigger.

---

## Talking while coding

Explicitly scored in every live round, and almost never practised.

```
   THE NARRATION SKELETON

   "Let me restate: given X, return Y. Is <edge case> possible?"
   "The brute force is <approach>, which is O(n²) because <reason>."
   "That is too slow for n = 10⁵, so I need better than O(n²)."
   "The repeated work is <observation> -- I can avoid it with <structure>."
   "So the approach is <pattern>. Let me code it."
   ... code, narrating each block in one sentence ...
   "Let me trace 'abcabcbb'. L=0, R=0 ..."
   "Time O(n), space O(k) where k is the character set."
```

**Practise this alone, out loud.** It feels absurd and it is the highest-return
thing on this page. A candidate who narrates a slightly suboptimal solution
usually outscores one who silently produces the optimal one, because the
interviewer is assessing how you think and silence gives them nothing.

---

## Choosing the next problem

**Do not solve by difficulty. Solve by pattern.** Ten sliding-window problems in
a row builds the recognition that ten random mediums does not, because the
transferable thing is the *cue*, not the solution.

The ladder each pattern page uses:

1. **Two easy** — learn the template with no complications
2. **Four to six medium** — the variations. Most interview questions live here
3. **One or two hard** — only after the mediums feel routine

**Skip hard problems until the mediums are automatic.** A hard problem you
cannot solve teaches you almost nothing; a medium you solve three different ways
teaches you a great deal.

---

## Mock interviews

From week 3 at the latest, weekly if you can. Nothing else rehearses the actual
skill.

| Format | Value |
|---|---|
| **With a person** (`pramp`, `interviewing.io`, a friend) | Highest. The social pressure is the variable being tested |
| **Recording yourself** | Good. You will hear the pauses and the mumbling |
| **Timed, alone, out loud** | Adequate. Better than nothing by a wide margin |

**What to grade yourself on**, and note that only one of these is about the
answer:

- Did I clarify before coding?
- Did I state the brute force and its complexity?
- Did I narrate continuously, or go silent while thinking?
- Did I test with edge cases unprompted?
- Did I state final complexity without being asked?
- Was the solution correct?

---

## The metrics that actually predict success

| Bad metric | Better metric |
|---|---|
| Problems solved | Problems re-derivable after 7 days |
| Hours studied | Sessions where you narrated out loud |
| Hard problems attempted | Mediums solved within the time box |
| LeetCode contest rating | Pattern named within 60s on unseen problems |
| Streak length | Mock interviews completed |

**The single best test:** open ten problems you have never seen, read only the
statements, and write down the pattern for each. If you get eight right in ten
minutes, you are ready. If you get three, more problems is not the answer —
more *review* is.

---

## Common ways people waste months

| Mistake | Why it fails | Instead |
|---|---|---|
| **Solving by difficulty** | Random patterns; no recognition builds | Group by pattern |
| **Reading solutions early** | Feels like learning, transfers nothing | Time box, then escalate through the levels |
| **No review** | Solved 300, remember 40 | Day 1, day 7, day 30 |
| **Starting with DP** | Hardest pattern, weakest foundations | DP after trees and graphs |
| **Never speaking** | The scored skill is untrained | Narrate every session |
| **Chasing count** | Optimising the wrong number | Track re-derivation, not ticks |
| **No edge-case habit** | Fail on empty input in the real thing | Test five edges every time |
| **Only easy problems** | Comfort, not progress | Mediums are where interviews live |
