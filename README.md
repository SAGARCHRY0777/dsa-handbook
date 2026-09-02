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

## Adding your own notes

Two commands. You never write frontmatter or pick an order number by hand.

```bash
npm run note -- "Recursion subsets and subsequences"     # scaffold a page
#   -> creates content/recursion-subsets-and-subsequences.md
#      with frontmatter filled in and the next order number in that module

#   ... write your notes, flip `status: draft` -> `status: live` ...

npm run publish -- "note: recursion subsets"             # build, check, push
```

Prompts for extracting a usable summary from a video are kept on the site, at
**Recursion · Aditya Verma → Prompts for taking these notes**, so they can be
copied rather than reconstructed each time.

### Two tracks, kept separate

| Command | Creates | Sidebar group | Badge |
|---|---|---|---|
| `npm run note -- 2 "Title"` | `av-02-title.md` | **Recursion · Aditya Verma** | `notes` |
| `npm run note -- "Title" structures` | `title.md` | Core structures | — |

A leading number means **a video note** — taken first-hand while working through
[Aditya Verma's recursion playlist](https://www.youtube.com/playlist?list=PL_z_8CaSLPWeT1ffjiImo0sYTcnLzo-wY),
ordered by video number so the series stays in sequence even if you watch out of
order. Anything else is a handbook page.

**Credit where it is due:** the recursion method in this handbook — the
choice-diagram / IBH split, the input–output framing — is
[Aditya Verma's](https://www.youtube.com/@TheAdityaVerma). The notes here are
personal study write-ups of his teaching, not a replacement for it. Watch the
playlist.

They are kept apart on purpose: notes taken while watching carry different
authority from a page written up afterwards, and once they are mixed you cannot
tell later which is which. Where the two disagree, **the notes win.**

`npm run publish` builds, verifies **every internal link resolves**, and only
then commits and pushes. It refuses to publish a site with a broken link, and
it treats "no pages found" as a failure rather than a vacuous pass.

While drafting, `npm run serve` gives you live preview at
<http://localhost:4180>; a page marked `status: draft` still renders, badged as
a draft in the sidebar.
