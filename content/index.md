---
title: Start here
slug: index
module: start
order: 0
status: live
summary: A problem-first DSA handbook — the patterns you already know, applied to a curated ladder of problems with a schedule that fits your life.
---

# The DSA Handbook

A problem-first companion for interview preparation. Not another explanation of
what a hash map is — a **curated ladder of problems per pattern**, with worked
solutions, the recognition cues that tell you which pattern applies, and a
schedule that survives contact with a full-time job.

> **This does not repeat the theory.** The companion notes
> (`01_FOUNDATIONS/02_dsa_patterns.md`) already cover all nineteen patterns with
> diagrams, variant tables and recognition cues. That file is the *why*. This is
> the *which problems, in what order, and how to practise them*.

---

## The one thing that matters

**You do not get better at DSA by solving more problems. You get better by
solving fewer problems properly.**

Solving 300 problems once teaches you 300 solutions you will forget. Solving 100
problems, reviewing each after a day and again after a week, and being able to
re-derive them cold, teaches you **patterns you can apply to problems you have
never seen** — which is the only thing an interview actually tests.

The single strongest predictor of interview success is not problem count. It is
whether you can look at an unfamiliar problem and say *"this is a sliding window
with a shrink condition"* within sixty seconds.

---

## How this handbook is organised

| Part | What it gives you |
|---|---|
| **[Roadmap](roadmap.html)** | Week-by-week plans for 2 weeks, 8 weeks and 16 weeks |
| **[How to practise](how-to-practise.html)** | The method — timeboxing, review cycles, what to do when stuck |
| **Pattern pages** | Per pattern: recognition cues, the template, a problem ladder, worked examples |
| **[Problem index](problem-index.html)** | Every problem in one table, by pattern and difficulty |
| **[Complexity reference](complexity.html)** | The costs you must know without thinking |
| **[Codeforces](codeforces.html)** | How competitive programming differs, and whether you should bother |

### Each pattern page contains

1. **Recognition** — the phrases in a problem statement that mean *this pattern*
2. **The template** — the code skeleton you should be able to type from memory
3. **The ladder** — 8–12 problems from easy to hard, in dependency order
4. **Worked examples** — 2–3 solved fully, with the diagram and the reasoning
5. **Same problem in disguise** — the mapping that turns many problems into few
6. **Failure modes** — the off-by-ones and edge cases that actually cost you

---

## The honest timeline

DSA preparation is measured in months, not weeks. Anyone telling you otherwise
is selling something.

| Time available | Realistic goal |
|---|---|
| **2 weeks** | Cover the top 4 patterns properly. Pass a screening round on a good day |
| **8 weeks** | The 8 core patterns solid. Competitive for most product companies |
| **16 weeks** | All patterns including DP. FAANG-competitive with consistent practice |
| **6+ months** | Comfortable in hard rounds; the point where it stops feeling like a race |

**If you have two weeks, do not attempt the whole list.** The
[roadmap](roadmap.html) has a two-week triage that maximises the chance of
passing a screen, and it explicitly gives up on dynamic programming. That is the
correct trade, and pretending otherwise wastes the two weeks.

---

## Sources, and what each is for

| Source | Best for | Watch out for |
|---|---|---|
| **NeetCode 150** | The single best curated list. Pattern-grouped, video solutions | Can become passive watching — solve first, watch after |
| **Striver's SDE Sheet / A2Z** | Excellent structured progression, strong for Indian product companies | Very long; A2Z is a months-long commitment |
| **LeetCode** | The problem bank everything references | Solving by difficulty rather than pattern is the classic waste |
| **Codeforces** | Genuine problem-solving speed and creativity | A *different sport* — see the [Codeforces page](codeforces.html) before investing |
| **CSES Problem Set** | Clean, well-ordered, no noise | Competitive-flavoured; less interview-shaped |
| **[Aditya Verma](https://www.youtube.com/@TheAdityaVerma)** | Recursion and DP explained by *identification* rather than by solution — the best treatment of either on YouTube | Slow-paced; watch at 1.5× |

**If you use one: NeetCode 150.** It is pattern-grouped, which is how the
material actually organises, and it is sized to be finishable.

**The recursion section of this handbook follows Aditya Verma's method** — the
choice-diagram / IBH split is his framing, not this handbook's. The pages under
**Recursion · Aditya Verma** are study notes taken from his playlist and are no
substitute for watching it. See [recursion](recursion-intro.html).

---

## What this handbook will not do

**It will not solve problems for you.** Reading a solution and understanding it
feels like learning and is not. Every problem here is listed with a
*recommendation to attempt it first*, a time box, and only then the worked
solution.

**It will not pretend problem count is progress.** The tracker in the
[problem index](problem-index.html) records whether you could re-derive a
solution a week later — because that is the number that predicts interview
performance, and the number of green ticks on a profile is not.
