#!/usr/bin/env python3
"""Generate content/company-questions.md from the top-200 dataset.

Generated rather than hand-written so the "covered" column is computed
from the actual handbook content and cannot drift out of date.
"""
import io, importlib.util, re, sys
from pathlib import Path
from collections import Counter, defaultdict

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "content" / "company-questions.md"

# top200-data.py has a hyphen, so load it by path rather than by import name.
spec = importlib.util.spec_from_file_location(
    "top200_data", ROOT / "scripts" / "top200-data.py")
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)
problems = mod.PROBLEMS

# `covered` is derived from the handbook itself, so the coverage column can
# never drift away from what the pattern pages actually reference.
LC_REF = re.compile(r"\bLC (\d+)\b")

covered = set()
for md in sorted((ROOT / "content").glob("*.md")):
    if md.name == "company-questions.md":
        continue                       # don't count this page's own listing
    covered |= {int(n) for n in LC_REF.findall(md.read_text(encoding="utf8"))}

# A silent scan failure would publish a page claiming 0% coverage, which is
# worse than publishing nothing. Fail loudly instead.
if len(covered) < 100:
    raise SystemExit(
        f"refusing to generate: only {len(covered)} 'LC <n>' references found "
        "in content/ -- the scan is broken")


# pattern -> the handbook page that teaches it
PAGE = {
    "hashing": "hashing", "arrays": "hashing", "strings": "strings",
    "two-pointers": "two-pointers", "sliding-window": "sliding-window",
    "prefix-sum": "prefix-sum", "stack": "stack", "heap": "heap",
    "intervals": "intervals", "binary-search": "binary-search",
    "linked-lists": "linked-lists", "trees": "trees", "tries": "tries",
    "graphs": "graphs", "union-find": "union-find",
    "backtracking": "backtracking", "greedy": "greedy",
    "dynamic-programming": "dynamic-programming",
    "bit-manipulation": "bit-manipulation",
}
ORDER = ["hashing", "arrays", "strings", "two-pointers", "sliding-window",
         "prefix-sum", "stack", "binary-search", "linked-lists", "trees",
         "tries", "heap", "intervals", "backtracking", "graphs",
         "union-find", "greedy", "dynamic-programming", "bit-manipulation"]
LABEL = {
    "hashing": "Arrays & hashing", "arrays": "Array manipulation",
    "strings": "Strings", "two-pointers": "Two pointers",
    "sliding-window": "Sliding window", "prefix-sum": "Prefix sums",
    "stack": "Stack & monotonic stack", "binary-search": "Binary search",
    "linked-lists": "Linked lists", "trees": "Trees", "tries": "Tries",
    "heap": "Heap & top-k", "intervals": "Intervals",
    "backtracking": "Backtracking", "graphs": "Graphs",
    "union-find": "Union-Find", "greedy": "Greedy",
    "dynamic-programming": "Dynamic programming",
    "bit-manipulation": "Bit manipulation",
}
DIFF = {"E": "Easy", "M": "Med", "H": "Hard"}

missing = [p for p in problems if p["lc"] not in covered]
by_company = defaultdict(list)
for p in problems:
    for c in p["companies"]:
        by_company[c].append(p)

n_total, n_cov = len(problems), len(problems) - len(missing)
L = []
w = L.append

w("---")
w("title: Top 200 questions & company tags")
w("slug: company-questions")
w("module: reference")
w("order: 93")
w("status: live")
w("level: the master list")
w(f"summary: {n_total} highest-frequency interview problems with company tags, "
  "the pattern each one drills, and which handbook page covers it — plus an "
  "honest note on where the company data comes from.")
w("---")
w("")
w("# Top 200 questions and company tags")
w("")
w("> **Read the source note first.** It changes how much weight to put on the")
w("> company column.")
w("")
w("---")
w("")
w("## 1 · Where this data comes from — and where it does not")
w("")
w("**This is not Big Omega data, and it is not LeetCode Premium frequency data.**")
w("Those datasets are paid, scraped, and not something this handbook can read or")
w("republish accurately.")
w("")
w("What this list actually is:")
w("")
w("| Source | Contributes |")
w("|---|---|")
w("| **Blind 75** | The classic minimum set |")
w("| **NeetCode 150 / 250** | Pattern-organised expansion |")
w("| **Grind 75** | Time-budgeted ordering |")
w("| **LeetCode Top Interview 150** | LeetCode's own curated list |")
w("| Community-reported company tags | The company column |")
w("")
w("> **Treat the company column as directional, not authoritative.** Company")
w("> question banks rotate, leak, get retired, and vary by team and by office.")
w("> A tag here means *this problem has been widely reported at that company*,")
w("> not *this company will ask you this*. If you want live frequency data,")
w("> LeetCode Premium's company filter is the real source — this list is for")
w("> deciding what to practise, not for predicting your interview.")
w("")
w("**The useful signal is not the company. It is the pattern.** Companies do not")
w("share a question list; they share a *pattern* distribution. Every problem")
w("below is tagged with the pattern it drills, and that is the column to plan")
w("from.")
w("")
w("---")
w("")
w("## 2 · Coverage")
w("")
w(f"The handbook's pattern pages reference **{len(covered)} distinct LeetCode")
w(f"problems**. Against this {n_total}-problem list:")
w("")
w("| | Count |")
w("|---|---|")
w(f"| In this list **and** taught in the handbook | **{n_cov}** ({100*n_cov//n_total}%) |")
w(f"| In this list, not yet on a pattern page | {len(missing)} |")
w(f"| On a pattern page but not in this list | {len(covered) - n_cov} |")
w("")
w("**The last row is not padding.** The pattern pages include ladder rungs and")
w("teaching problems that are not interview-frequent but build the intuition the")
w("frequent ones need.")
w("")
w("### The gaps")
w("")
w("The problems below appear on the top list but are **not** yet worked into a")
w("pattern page. Each is still listed in the tables further down, with the page")
w("whose pattern it belongs to — so you can slot it into that page's ladder.")
w("")
w("| LC | Problem | Diff | Pattern | Read this page first |")
w("|---|---|---|---|---|")
for p in sorted(missing, key=lambda x: (ORDER.index(x["pattern"]), x["lc"])):
    page = PAGE[p["pattern"]]
    w(f"| **{p['lc']}** | {p['title']} | {DIFF[p['diff']]} | {LABEL[p['pattern']]} "
      f"| [{page}]({page}.html) |")
w("")
w("> **None of the gaps is a missing *pattern*.** They are additional problems in")
w("> patterns the handbook already teaches — mostly matrix manipulation, extra")
w("> grid-DP variants, and tree traversals. If you can do the worked examples on")
w("> the relevant page, these are reps rather than new material.")
w("")
w("---")
w("")
w("## 3 · The list, by pattern")
w("")
w("**✓** = taught on a handbook pattern page.")
w("")

for pat in ORDER:
    ps = sorted([p for p in problems if p["pattern"] == pat],
                key=lambda x: ("EMH".index(x["diff"]), x["lc"]))
    if not ps:
        continue
    page = PAGE[pat]
    w(f"### {LABEL[pat]} — [{page}.html]({page}.html)")
    w("")
    w("| | LC | Problem | Diff | Reported at |")
    w("|---|---|---|---|---|")
    for p in ps:
        mark = "✓" if p["lc"] in covered else "·"
        comps = ", ".join(p["companies"])
        w(f"| {mark} | {p['lc']} | {p['title']} | {DIFF[p['diff']]} | {comps} |")
    w("")

w("---")
w("")
w("## 4 · By company")
w("")
w("Same caveat as above — directional, not a prediction.")
w("")
w("> **Read the pattern distribution, not the problem numbers.** The tag data is")
w("> coarse: Amazon interviews broadly and is reported on almost everything here,")
w("> so its row carries little information. What survives that noise is the")
w("> *relative* pattern weighting, and that is the only column worth planning")
w("> from.")
w("")
w("| Company | Tagged | Heaviest patterns |")
w("|---|---|---|")
for comp, ps in sorted(by_company.items(), key=lambda kv: -len(kv[1])):
    if len(ps) < 8:
        continue
    pats = Counter(p["pattern"] for p in ps).most_common(5)
    total = len(ps)
    pat_str = ", ".join(f"{LABEL[k].lower()} {100*v//total}%" for k, v in pats)
    w(f"| **{comp}** | {total} | {pat_str} |")
w("")
w("**What to take from this table:** every company's top patterns are drawn from")
w("the same small set — trees, graphs, DP, hashing, two pointers. That is the")
w("actual finding, and it is why the handbook is organised by pattern rather than")
w("by company. There is no company-specific curriculum to learn.")
w("")
w("**What the table does support:** Google and Amazon lean hardest on dynamic")
w("programming and graphs; Meta, Microsoft and Bloomberg lean on trees and linked")
w("lists. If you are short on time and interviewing at one of the first two,")
w("weight DP and graphs; at the second three, weight trees and pointer work.")
w("")
w("**What it does not support:** anything about the rows with fewer than about 40")
w("tags. Uber at 26% backtracking is 4 problems out of 15 — that is sample size,")
w("not a hiring signal. Read only the top five rows as meaningful.")
w("")
w("---")
w("")
w("## 5 · How to use this")
w("")
w("**Do not work through it top to bottom.** 200 problems attempted once is worth")
w("less than 60 problems you can re-derive, and the whole")
w("[practice method](how-to-practise.html) is built on that claim.")
w("")
w("| You have | Do |")
w("|---|---|")
w("| **2 weeks** | The 40 marked ✓ in the [problem index](problem-index.html) core, nothing else |")
w("| **6 weeks** | One pattern page per two days, plus its ✓ problems here |")
w("| **3 months** | This whole list, with day-7 and day-30 re-derivation |")
w("")
w("**If you have a named company:** read its row in the table above for the")
w("*pattern* weighting, and drill the two or three heaviest. The specific problem")
w("numbers tell you almost nothing — that list will have rotated by the time you")
w("sit down, and the pattern distribution will not have.")
w("")
w("**The order within a pattern matters more than the order between patterns.**")
w("Each pattern page's ladder is built so that each rung teaches something the")
w("next one assumes. This page is an index; the ladders are the curriculum.")

io.open(OUT, "w", encoding="utf8", newline="\n").write("\n".join(L) + "\n")
print(f"wrote {OUT}: {len(L)} lines, {n_total} problems, {n_cov} covered, {len(missing)} gaps")
