# DSA Handbook

A **problem-first** companion for interview preparation. Not another explanation
of what a hash map is — a curated ladder of problems per pattern, with worked
solutions, the recognition cues that tell you which pattern applies, and a
schedule that survives contact with a full-time job.

**Live site:** https://SAGARCHRY0777.github.io/dsa-handbook/

---

## The premise

> You do not get better at DSA by solving more problems. You get better by
> solving fewer problems properly.

Solving 300 problems once teaches you 300 solutions you will forget. Solving 100
problems, reviewing each after a day and again after a week, and being able to
re-derive them cold, teaches you patterns you can apply to problems you have
never seen — which is the only thing an interview actually tests.

## What is here

| Page | Contents |
|---|---|
| **Roadmap** | Week-by-week plans for 2, 8 and 16 weeks, each explicit about what it abandons |
| **How to practise** | Timeboxing, the escalation ladder for when stuck, the day-1/7/30 review cycle |
| **Pattern pages** | Recognition cues, the template, a problem ladder, worked solutions, "same problem in disguise" |
| **Reference** | Complexity table, problem index, and an honest note on Codeforces |

Each pattern page carries:

1. **Recognition** — the phrases that mean *this pattern*
2. **The template** — code you should be able to type from memory
3. **The ladder** — 8–12 problems easy → hard, in dependency order
4. **Worked examples** — solved fully, with the trace diagram
5. **Same problem in disguise** — the mapping that turns many problems into few
6. **Failure modes** — the bugs that actually cost you

## Sources

Problems are drawn from **LeetCode**, **NeetCode 150** and **Striver's sheets**,
grouped by pattern rather than by difficulty. Codeforces is covered separately,
with an honest assessment of whether it helps for interviews.

## Running it

```bash
npm install
npm run build     # content/*.md -> docs/
npm run serve     # preview on http://localhost:4180
```

`docs/` is committed so GitHub Pages serves it from `main` / `/docs`. CI fails
the build if `docs/` was not rebuilt after a content change.
