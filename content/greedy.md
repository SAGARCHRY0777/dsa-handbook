---
title: Greedy
slug: greedy
module: search
order: 32
status: live
level: intermediate
summary: The pattern where the hard part is proving you are allowed to use it — the three proof techniques, the sort that usually unlocks it, and how to tell greedy from DP.
---

# Greedy

> **Recognition in one line:** at each step there is an obviously best local
> choice, and taking it never forecloses the optimum.
>
> **The catch:** that second clause is the entire difficulty, and it is false far
> more often than it looks.

Greedy is the only pattern where writing the code is trivial and *justifying* it
is the work. Interviewers know this, which is why "why does that work?" always
follows.

---

## 1 · Recognition cues

| Cue | Signal |
|---|---|
| "minimum number of X" | Moderate — could be greedy or BFS |
| "maximum number of non-overlapping…" | Strong — the classic interval greedy |
| **Sorting makes an obvious choice appear** | **Strong** |
| "can you reach / is it possible" | Moderate — often greedy |
| Scheduling, assignment, matching | Strong |
| "jump", "gas station", "candy" | Definitive — the named greedies |
| Small local decision, no interaction between choices | Strong |

**The anti-cues — where greedy fails and DP is required:**

| Anti-cue | Why greedy breaks |
|---|---|
| Choices **interact** — taking one changes the value of another | The local best is not globally best |
| "count the number of ways" | Counting needs full enumeration |
| Knapsack with **integer** items | The fractional version is greedy; the 0/1 version is not |
| Coin change with arbitrary denominations | Largest-first fails: `{1,3,4}`, target 6 → greedy gives 4+1+1, optimum is 3+3 |

> **The coin-change counterexample is the one to memorise.** It is short, it is
> concrete, and it is the fastest way to demonstrate that you know greedy needs
> justification rather than optimism.

---

## 2 · Proving it — the actual skill

**You will be asked "why does that work?"** Three techniques, in order of how
often they apply.

### Exchange argument — the workhorse

> Take any optimal solution. Show that it can be transformed into the greedy
> solution, one swap at a time, without ever getting worse. Therefore greedy is
> optimal.

**For interval scheduling (LC 435):**

```
Greedy: always keep the interval that ENDS EARLIEST.

Suppose an optimal solution picks interval X first, and greedy picks G,
where G ends no later than X.

Swap X for G. G ends earlier, so it conflicts with no more of the
remaining intervals than X did. The solution is still valid and still
the same size.

Repeat down the list -> optimal becomes greedy without ever shrinking.
Therefore greedy is optimal.
```

**Say this out loud in ten seconds.** It is what the "why" question is asking
for, and most candidates answer with "it just works" or restate the algorithm.

### Staying ahead

> Show that after every step, greedy's partial solution is at least as good as
> any other strategy's partial solution.

Used for problems like Jump Game II: after considering the first k positions,
greedy's reachable frontier is at least as far as anyone else's.

### Contradiction

> Assume a better solution exists, examine the first point where it differs from
> greedy, and derive a contradiction.

---

## 3 · The sort is usually the algorithm

**Most greedy problems reduce to "sort by the right key, then sweep."** Finding
the key *is* the problem.

| Problem | Sort by | Why that key |
|---|---|---|
| Non-overlapping intervals | **End time** | Ending early leaves the most room |
| Merge intervals | Start time | You need them in order to merge |
| Meeting rooms | Start time (+ end heap) | Process arrivals in order |
| Minimum arrows to burst balloons | End | Same as interval scheduling |
| Task scheduler by deadline | Deadline | Tightest constraint first |
| Fractional knapsack | **Value / weight** | Best value per unit of capacity |
| Assign cookies | Both, ascending | Match smallest sufficient to smallest need |
| Queue reconstruction by height | Height desc, then insert | Taller people already placed do not shift |

> **"Sort by end time" versus "sort by start time" is the single most common
> greedy decision**, and getting it wrong is the most common greedy bug. End time
> when you are *selecting a maximum set*; start time when you are *merging or
> sweeping*.

---

## 4 · The ladder

### Foundational

| # | Problem | Source | The point |
|---|---|---|---|
| 1 | **Best Time to Buy and Sell Stock** | LC 121 · NeetCode | Track the minimum so far |
| 2 | Best Time to Buy and Sell Stock II | LC 122 | Take every upward step |
| 3 | Assign Cookies | LC 455 | Sort both, two pointers |
| 4 | **Maximum Subarray** | LC 53 · NeetCode | Kadane's — greedy *or* DP, know both framings |

### Medium

| # | Problem | Source | The point |
|---|---|---|---|
| 5 | **Jump Game** | LC 55 · NeetCode | Track the furthest reachable index |
| 6 | **Jump Game II** | LC 45 · NeetCode | BFS-by-levels framing |
| 7 | **Non-overlapping Intervals** | LC 435 · NeetCode | **Sort by end — the canonical proof** |
| 8 | Minimum Arrows to Burst Balloons | LC 452 | Identical to 435 |
| 9 | **Gas Station** | LC 134 · NeetCode | The reset insight |
| 10 | Partition Labels | LC 763 · NeetCode | Last-occurrence map, then sweep |
| 11 | Task Scheduler | LC 621 · NeetCode | Formula from the most frequent task |
| 12 | Hand of Straights | LC 846 · NeetCode | Always start from the smallest remaining |
| 13 | Queue Reconstruction by Height | LC 406 | Sort desc, insert by index |
| 14 | Boats to Save People | LC 881 | Two pointers on a sorted array |

### Hard

| # | Problem | Source | The point |
|---|---|---|---|
| 15 | **Candy** | LC 135 | **Two passes — one direction is not enough** |
| 16 | Course Schedule III | LC 630 | Greedy + a heap to undo a choice |
| 17 | Minimum Number of Refueling Stops | LC 871 | Heap of skipped options |
| 18 | IPO | LC 502 | Two heaps |

**If you only do five: 435, 55, 134, 763, 135.**

---

## 5 · Worked example — LC 134, Gas Station

**Problem:** circular route, `gas[i]` at station i, `cost[i]` to reach the next.
Find the unique start index that lets you complete the circuit, or −1.

**Two insights, and the second is the greedy one:**

```
1. FEASIBILITY: if sum(gas) < sum(cost), no start works. Otherwise one does.

2. THE RESET: if you start at A and run out at station B, then NO station
   between A and B can be a valid start either.

   Why: starting at A you arrived at each station in A..B with a
   non-negative tank. Starting from any C in between means arriving at
   B with LESS fuel than you had coming from A -- and that was already
   not enough.

   So do not retry C. Jump the start to B+1.

That reduces O(n^2) to O(n): each station is passed at most twice.
```

```python
def can_complete_circuit(gas, cost):
    if sum(gas) < sum(cost):
        return -1                      # infeasible; otherwise a start exists

    start = 0
    tank = 0
    for i in range(len(gas)):
        tank += gas[i] - cost[i]
        if tank < 0:
            # Everything in [start..i] is eliminated, not just `start`.
            start = i + 1
            tank = 0
    return start
```

```java
public int canCompleteCircuit(int[] gas, int[] cost) {
    int total = 0, tank = 0, start = 0;
    for (int i = 0; i < gas.length; i++) {
        int diff = gas[i] - cost[i];
        total += diff;
        tank += diff;
        if (tank < 0) { start = i + 1; tank = 0; }
    }
    return total < 0 ? -1 : start;      // one pass does both checks
}
```

**The Java version computes feasibility and the start in one pass** — a small,
noticeable improvement worth mentioning.

---

## 6 · Worked example — LC 135, Candy

**Problem:** each child has a rating; every child gets at least one candy, and a
child with a higher rating than a neighbour gets more than that neighbour.
Minimise the total.

**Why one pass fails, and this is the transferable lesson:** a single
left-to-right sweep satisfies the left constraint but can violate the right one.

```
ratings: [1, 3, 2, 2, 1]

Left-to-right (only "greater than my LEFT neighbour"):
  [1, 2, 1, 1, 1]
                ^ index 3 (rating 2) > index 4 (rating 1) but has the
                  same candy. The RIGHT constraint is violated.

Right-to-left, taking the max with what we already have:
  [1, 2, 1, 2, 1]

total = 7
```

```python
def candy(ratings):
    n = len(ratings)
    candies = [1] * n

    for i in range(1, n):                       # left neighbour constraint
        if ratings[i] > ratings[i - 1]:
            candies[i] = candies[i - 1] + 1

    for i in range(n - 2, -1, -1):              # right neighbour constraint
        if ratings[i] > ratings[i + 1]:
            # max, NOT assignment -- assigning would destroy the left-pass
            # result and violate the constraint we already satisfied.
            candies[i] = max(candies[i], candies[i + 1] + 1)

    return sum(candies)
```

> **`max` rather than assignment is the whole bug surface**, and the general
> principle is worth stating: **when constraints come from two directions, sweep
> both ways and combine with max.** The same shape appears in Trapping Rain Water
> and in Product of Array Except Self.

---

## 7 · Greedy versus DP

The distinction the interviewer is probing:

| | Greedy | DP |
|---|---|---|
| Considers | One choice per step | All choices per step |
| Revisits decisions | Never | Yes, via the table |
| Time | Usually O(n log n) — the sort | Usually O(n·k) or worse |
| Correct when | Local optimum ⟹ global optimum | Always (if the recurrence is right) |
| Risk | **Silently wrong** | Slow, but correct |

**The decision procedure, and a good thing to narrate:**

```
1. Guess a greedy rule.
2. Try to break it with a small counterexample.  <- spend real effort here
3. Found one?      -> DP.
4. Cannot find one? -> attempt an exchange argument.
5. Exchange argument works? -> greedy, and you can now defend it.
```

> **Step 2 is what candidates skip.** A greedy solution that is wrong looks
> exactly like one that is right until the failing test case appears. Spending
> thirty seconds actively trying to break your own rule is both faster and more
> impressive than defending it afterwards.

---

## 8 · Failure modes

| Bug | Symptom | Fix |
|---|---|---|
| Greedy where DP is needed | Passes samples, fails hidden tests | Try to break the rule first |
| Sorting by start instead of end | Wrong answer on interval selection | End time for *selecting*, start for *merging* |
| One pass where two are needed | Violates the other-direction constraint | Sweep both ways, combine with max |
| Assigning instead of `max` on the second pass | Destroys the first pass | `max(existing, new)` |
| Not handling the empty or single-element case | Crash | Guard early |
| Cannot justify the choice | "Why does that work?" lands badly | Have the exchange argument ready |

---

## 9 · Interview questions

| Question | What to say |
|---|---|
| ⭐ "Why does your greedy choice work?" | Exchange argument: take any optimal solution, and show it can be transformed into the greedy one by swaps that never make it worse. For interval scheduling, swapping in the earliest-ending interval can only leave more room for the rest, so the swap is always safe. |
| ⭐ "Greedy or DP?" | Greedy if I can prove the local choice never forecloses the optimum, and I actively try to break the rule with a small counterexample first. If choices interact — 0/1 knapsack, or counting problems — it is DP. The failure mode of greedy is being silently wrong, so I would rather spend thirty seconds attacking my own rule. |
| ⭐ "Sort by start or by end?" | End time when selecting a maximum non-overlapping set, because finishing earliest leaves the most room. Start time when merging or sweeping, because you need them in chronological order. |
| "Give me a case where greedy fails." | Coin change with denominations 1, 3, 4 and target 6: largest-first gives 4+1+1, three coins, but 3+3 is two. The choices interact, so DP is required. |
| ⭐ "Why two passes in Candy?" | Each child is constrained by both neighbours, and a single left-to-right pass only satisfies the left one. The second pass right-to-left takes the max with the existing value, so both constraints hold — assigning instead of taking the max would undo the first pass. |
| "Explain the Gas Station reset." | If you run out between A and B, no station in between can work either — starting later means arriving at B with even less fuel, and that was already insufficient. So the start jumps to B+1 rather than A+1, which makes it one pass. |
| "Is Kadane's greedy or DP?" | Both framings are valid. As DP: the best subarray ending here is either this element alone or this element plus the best ending at the previous index. As greedy: drop the running sum whenever it goes negative, because a negative prefix can only hurt. |

---

## Stop condition

You know this pattern when you can:

1. state the exchange argument for interval scheduling in ten seconds,
2. give the coin-change counterexample from memory,
3. choose end-time versus start-time sorting and say why,
4. explain the two-pass max pattern in Candy,
5. explain the Gas Station reset, and
6. describe the guess → break → prove decision procedure.
