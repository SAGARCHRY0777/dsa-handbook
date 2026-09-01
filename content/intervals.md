---
title: Intervals
slug: intervals
module: structures
order: 24
status: live
level: basic → advanced
summary: Sort by the right endpoint and most interval problems become a single linear scan — the difficulty is knowing which endpoint.
---

# Intervals

> **Recognition in one line:** the input is a list of `[start, end]` pairs, and
> you are merging them, counting overlaps, or choosing a non-overlapping subset.

Almost every interval problem is *sort, then scan once*. The entire skill is
deciding **which endpoint to sort by**, and that decision is not arbitrary — it
follows from what you are optimising.

---

## 1 · Recognition cues

| Cue | Sort by | Then |
|---|---|---|
| "**merge** overlapping intervals" | **start** | Extend or append |
| "insert an interval into a sorted list" | already sorted | Three phases |
| "how many **rooms / resources** are needed" | see below | Min-heap of ends, or a sweep line |
| "**maximum** non-overlapping intervals" | **end** | Greedy, take earliest finisher |
| "minimum removals to make them non-overlapping" | **end** | Same, counting rejects |
| "can a person attend all meetings?" | **start** | Any overlap → no |
| "employee free time", "busiest period" | **sweep line** | Events sorted, running count |

> **The rule that decides everything:** sort by **start** when you are
> *combining* intervals, and by **end** when you are *choosing* a maximum set of
> them. The second is the classic activity-selection greedy, and it is the one
> people get wrong by reaching for start.

---

## 2 · The templates

```python
# MERGE -- sort by START
def merge(intervals):
    intervals.sort(key=lambda x: x[0])
    out = []
    for start, end in intervals:
        # `<=` merges touching intervals like [1,3] and [3,5]. Whether that is
        # correct is a CLARIFYING QUESTION -- ask it before assuming.
        if out and start <= out[-1][1]:
            out[-1][1] = max(out[-1][1], end)   # max: the current may be nested
        else:
            out.append([start, end])
    return out
```

The `max` matters: `[[1,10],[2,3]]` must stay `[1,10]`, not become `[1,3]`.
Assigning `end` directly is the most common bug in this template.

```python
# MAX NON-OVERLAPPING -- sort by END. The activity-selection greedy.
def max_non_overlapping(intervals):
    intervals.sort(key=lambda x: x[1])
    count, last_end = 0, float("-inf")
    for start, end in intervals:
        if start >= last_end:          # does not clash with the last one taken
            count += 1
            last_end = end
    return count
```

**Why sorting by end is optimal**, and you must be able to say this: taking the
interval that finishes earliest leaves the maximum remaining time for
everything else. Any other choice finishes no earlier, so it can never allow
more intervals. That is an exchange argument, and stating it is what turns a
memorised greedy into a justified one.

```python
# SWEEP LINE -- maximum concurrent overlaps
def max_overlap(intervals):
    events = []
    for start, end in intervals:
        events.append((start, 1))      # +1 when an interval opens
        events.append((end, -1))       # -1 when it closes
    # Ties: process the CLOSE before the OPEN, so [1,2] and [2,3] do not
    # count as concurrent. -1 sorts before +1, which handles it for free.
    events.sort()

    current = best = 0
    for _, delta in events:
        current += delta
        best = max(best, current)
    return best
```

```python
# MIN-HEAP OF ENDS -- rooms needed. Same answer, different mental model.
import heapq

def min_rooms(intervals):
    intervals.sort(key=lambda x: x[0])
    ends = []                          # end times of rooms currently in use
    for start, end in intervals:
        if ends and ends[0] <= start:
            heapq.heappop(ends)        # the earliest room has freed up
        heapq.heappush(ends, end)
    return len(ends)                   # rooms never freed = peak concurrency
```

---

## 3 · The ladder

### Easy

| # | Problem | Source | The point |
|---|---|---|---|
| 1 | Meeting Rooms | LC 252 | Sort by start, check adjacent pairs |
| 2 | Summary Ranges | LC 228 | Build intervals from a sorted array |

### Medium

| # | Problem | Source | The point |
|---|---|---|---|
| 3 | **Merge Intervals** | LC 56 · NeetCode | The canonical merge |
| 4 | **Insert Interval** | LC 57 · NeetCode | Three phases: before, overlapping, after |
| 5 | **Non-overlapping Intervals** | LC 435 · NeetCode | **Sort by END** — the greedy |
| 6 | **Meeting Rooms II** | LC 253 · NeetCode | Heap of ends, or sweep line |
| 7 | Minimum Arrows to Burst Balloons | LC 452 | LC 435 in disguise |
| 8 | Interval List Intersections | LC 986 | Two pointers over two sorted lists |
| 9 | Car Pooling | LC 1094 | Sweep line with capacities |
| 10 | My Calendar I | LC 729 | Sorted structure, binary search for a clash |

### Hard

| # | Problem | Source | The point |
|---|---|---|---|
| 11 | Employee Free Time | LC 759 | Merge all, then take the gaps |
| 12 | Data Stream as Disjoint Intervals | LC 352 | Merge maintained incrementally |

**If you only do four: 56, 57, 435, 253.**

---

## 4 · Worked example — LC 56, Merge Intervals

```
   intervals = [[1,3], [2,6], [8,10], [15,18]]

   sort by start (already sorted)

   [1,3]    out is empty -> append              out = [[1,3]]
   [2,6]    2 <= 3  -> overlap
            out[-1][1] = max(3, 6) = 6          out = [[1,6]]
   [8,10]   8 > 6   -> no overlap, append       out = [[1,6],[8,10]]
   [15,18]  15 > 10 -> append                   out = [[1,6],[8,10],[15,18]]

   answer [[1,6], [8,10], [15,18]]
```

```python
def merge(intervals: list[list[int]]) -> list[list[int]]:
    if not intervals:
        return []
    intervals.sort(key=lambda x: x[0])
    out = [intervals[0][:]]                 # copy: do not mutate the input

    for start, end in intervals[1:]:
        if start <= out[-1][1]:
            # max, not assignment: [[1,10],[2,3]] must remain [1,10].
            out[-1][1] = max(out[-1][1], end)
        else:
            out.append([start, end])

    return out
```

**Complexity:** O(n log n) — dominated by the sort. The scan is O(n).

**Ask this before coding:** *"Do touching intervals like `[1,3]` and `[3,5]`
count as overlapping?"* It is a genuine ambiguity, it changes `<=` to `<`, and
asking it is exactly the clarifying behaviour interviewers score.

---

## 5 · Worked example — LC 435, Non-overlapping Intervals

**Problem:** minimum number of intervals to remove so the rest do not overlap.

**Reframe it:** minimising removals is the same as **maximising how many you
keep** — the classic activity-selection problem.

```
   intervals = [[1,2], [2,3], [3,4], [1,3]]

   sort by END:  [1,2], [2,3], [1,3], [3,4]
                   2      3      3      4

   last_end = -inf
   [1,2]  1 >= -inf  -> KEEP.  last_end = 2   kept=1
   [2,3]  2 >= 2     -> KEEP.  last_end = 3   kept=2
   [1,3]  1 <  3     -> remove                removed=1
   [3,4]  3 >= 3     -> KEEP.  last_end = 4   kept=3

   answer 1 removal
```

**Why sorting by end and not by start:**

```
   sorted by START:  [1,100], [2,3], [4,5]
     greedily take [1,100] first -> blocks everything -> keep 1

   sorted by END:    [2,3], [4,5], [1,100]
     take [2,3], then [4,5]                         -> keep 2   CORRECT
```

```python
def erase_overlap_intervals(intervals: list[list[int]]) -> int:
    if not intervals:
        return 0
    # Sort by END. Taking the earliest finisher leaves the most room for
    # everything after it -- an exchange argument, not a heuristic.
    intervals.sort(key=lambda x: x[1])

    kept, last_end = 0, float("-inf")
    for start, end in intervals:
        if start >= last_end:
            kept += 1
            last_end = end

    return len(intervals) - kept
```

**Complexity:** O(n log n).

**The exchange argument, stated for an interviewer:** *"Suppose an optimal
solution does not take the earliest-finishing interval. Swap its first interval
for that one — it finishes no later, so nothing else conflicts, and the solution
stays the same size. So there is always an optimal solution containing the
earliest finisher."* That is a proof, and it is worth having ready.

---

## 6 · Worked example — LC 253, Meeting Rooms II

**Problem:** minimum meeting rooms required.

Two solutions, both worth knowing because they suit different follow-ups.

```
   intervals = [[0,30], [5,10], [15,20]]

   HEAP OF END TIMES:
     sort by start -> [0,30], [5,10], [15,20]
     [0,30]  no free room -> open one.        ends = [30]
     [5,10]  earliest end 30 > 5 -> busy      ends = [10, 30]
     [15,20] earliest end 10 <= 15 -> reuse   ends = [20, 30]
     rooms = len(ends) = 2

   SWEEP LINE:
     events: (0,+1) (5,+1) (10,-1) (15,+1) (20,-1) (30,-1)
     running: 1, 2, 1, 2, 1, 0
     peak = 2
```

```python
import heapq

def min_meeting_rooms(intervals: list[list[int]]) -> int:
    if not intervals:
        return 0
    intervals.sort(key=lambda x: x[0])
    ends = []                                # end times of occupied rooms

    for start, end in intervals:
        # If the earliest-finishing room is free by now, reuse it. Only the
        # earliest matters -- if it is still busy, so is every other room.
        if ends and ends[0] <= start:
            heapq.heappop(ends)
        heapq.heappush(ends, end)

    return len(ends)


def min_meeting_rooms_sweep(intervals: list[list[int]]) -> int:
    events = []
    for start, end in intervals:
        events.append((start, 1))
        events.append((end, -1))
    # A meeting ending at time t frees the room for one starting at t, so the
    # -1 must be processed first. Sorting tuples gives that automatically.
    events.sort()

    current = best = 0
    for _, delta in events:
        current += delta
        best = max(best, current)
    return best
```

**Which to offer:** the heap version generalises when you need to know *which*
room; the sweep line generalises to weighted capacity problems like Car Pooling.
Mentioning that distinction is better than picking one and defending it.

---

## 7 · Same problem in disguise

| Problem | Really is |
|---|---|
| Minimum Arrows (LC 452) | LC 435 — maximum non-overlapping, counting groups |
| Maximum Length of Pair Chain (LC 646) | LC 435 with different wording |
| Car Pooling (LC 1094) | Sweep line with capacities instead of counts |
| Employee Free Time (LC 759) | Merge everything, return the gaps |
| Meeting Rooms II (LC 253) | Maximum concurrent overlap |
| My Calendar I (LC 729) | Incremental overlap check via binary search |
| Insert Interval (LC 57) | Merge, exploiting pre-sorted input for O(n) |

**LC 435, 452 and 646 are one problem.** Solve the activity-selection greedy
once and all three follow.

---

## 8 · Failure modes

| Bug | Symptom | Fix |
|---|---|---|
| Assigning `end` instead of `max` in merge | Nested intervals truncated | `max(out[-1][1], end)` |
| Sorting by start for LC 435 | Wrong answer on `[[1,100],[2,3],[4,5]]` | Sort by end for selection |
| Wrong tie handling in a sweep line | Off-by-one room count | Process closes before opens |
| Not asking about touching intervals | Wrong `<` vs `<=` | Clarify before coding |
| Mutating the input list | Caller's data corrupted | Copy on append |
| Forgetting the empty case | `IndexError` | Guard `if not intervals` |

---

## 9 · Interview questions on this pattern

| Question | What to say |
|---|---|
| ⭐ "Sort by start or by end?" | Start when combining intervals — merging, inserting. End when choosing a maximum non-overlapping set, because the earliest finisher leaves the most room for the rest. |
| ⭐ "Prove the greedy is optimal." | Exchange argument: if an optimal solution omits the earliest finisher, swap its first interval for that one. It finishes no later, so nothing conflicts and the size is unchanged — so an optimal solution containing it always exists. |
| "Meeting rooms — heap or sweep line?" | Both O(n log n). The heap tells you which room; the sweep generalises to weighted capacity. Pick by what the follow-up will ask. |
| "Do `[1,3]` and `[3,5]` overlap?" | That is a clarifying question, not an assumption. It changes `<=` to `<`, and asking it is part of the answer. |
| "Insert into an already-sorted list in O(n)?" | Three phases: append everything ending before the new start, merge everything overlapping, append the rest. No re-sort needed. |
| "Intervals arriving as a stream?" | A sorted structure with binary search for the clash — `SortedList`, or a balanced BST. O(log n) per insert instead of re-sorting. |

---

## Stop condition

You are done with this pattern when you can:

1. state the sort-by-start versus sort-by-end rule and why,
2. give the exchange argument as a proof,
3. write merge with the `max` and explain what it protects against,
4. solve LC 253 both ways and say when each is preferable, and
5. ask the touching-intervals question unprompted.
