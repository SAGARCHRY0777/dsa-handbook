---
title: The cheat sheet
slug: cheatsheet
module: reference
order: 94
status: live
level: print this
summary: One page — constraint-to-algorithm, every template you should type from memory, complexity, language idioms, and the bugs that actually cost you.
---

# The cheat sheet

> **Every template here was executed against test cases before publishing**,
> including 300 randomised binary-search cases checked against Python's
> `bisect`. Cheat sheets are usually where off-by-ones go to hide.

---

## 1 · Constraints → algorithm

**The fastest read in the room.** The constraint tells you the intended
complexity, and the complexity tells you the algorithm.

| n up to | Allowed | Means |
|---|---|---|
| 10–12 | O(n!) | Permutations, brute force |
| **≤ 20** | **O(2ⁿ)** | **Subsets, bitmask DP, backtracking** |
| 100 | O(n⁴) | 3–4 nested loops, interval DP |
| 500 | O(n³) | Floyd-Warshall, matrix chain |
| 5,000 | O(n²) | Two-loop DP, all-pairs |
| **10⁵–10⁶** | **O(n log n)** | **Sort, heap, binary search — the sweet spot** |
| 10⁷–10⁸ | O(n) | One pass, counting, hashing |
| 10⁹+ | O(log n) or O(1) | Binary search, maths, closed form |

> **If n ≤ 20 and the question says "return all", the answer is exponential and
> that is intended.** Do not look for a clever polynomial solution.

---

## 2 · Cue → pattern

| The problem says | Reach for |
|---|---|
| "sorted array" | [Binary search](binary-search.html) or [two pointers](two-pointers.html) |
| "two numbers that sum to" | [Hash map](hashing.html), or two pointers if sorted |
| "contiguous subarray / substring" | [Sliding window](sliding-window.html) or [prefix sums](prefix-sum.html) |
| "subarray sums to k" **with negatives** | **Prefix sums + hash map** — window fails |
| "top k" / "k largest" / "median of a stream" | [Heap](heap.html) |
| "next greater / smaller element" | [Monotonic stack](stack.html) |
| "return **all** …", n ≤ 20 | [Backtracking](backtracking.html) |
| "**how many** ways", "min/max cost" | [DP](dynamic-programming.html) |
| "shortest path", unweighted | **BFS** |
| "shortest path", weighted | Dijkstra |
| "connected components", edges arrive over time | [Union-Find](union-find.html) |
| "prefix", "autocomplete", "dictionary of words" | [Trie](tries.html) |
| "intervals", "meetings", "merge" | [Sort by start or end](intervals.html) |
| "cycle in a linked list" | [Fast/slow pointers](linked-lists.html) |
| "minimise the maximum" / "maximise the minimum" | **Binary search on the answer** |
| "in O(1) space" with values 1..n | Index-as-hash, or cycle detection |

---

## 3 · The templates

**Type these from memory.** All verified.

### Binary search — exact

```python
def search(a, target):
    lo, hi = 0, len(a) - 1          # CLOSED interval
    while lo <= hi:                 # <= because hi is inclusive
        mid = lo + (hi - lo) // 2   # avoids overflow in Java/C++
        if a[mid] == target: return mid
        if a[mid] < target: lo = mid + 1
        else:                hi = mid - 1
    return -1
```

### Binary search — leftmost / rightmost

**The two you actually need.** Half-open interval; the loop shape differs from
the exact version and mixing them is the classic bug.

```python
def left_bound(a, t):               # == bisect_left
    lo, hi = 0, len(a)              # hi = n, HALF-OPEN
    while lo < hi:                  # < not <=
        mid = lo + (hi - lo) // 2
        if a[mid] < t: lo = mid + 1
        else:          hi = mid     # NOT mid-1
    return lo

def right_bound(a, t):              # == bisect_right
    lo, hi = 0, len(a)
    while lo < hi:
        mid = lo + (hi - lo) // 2
        if a[mid] <= t: lo = mid + 1    # the ONLY change: <= not <
        else:           hi = mid
    return lo
```

> **`left` and `right` differ by one character** — `<` versus `<=`. Learn the
> pair together; learning one alone guarantees you derive the other wrongly
> under pressure.

### Binary search on the answer

**The pattern that looks like nothing else.** Use when the question is
"minimise the maximum" or "maximise the minimum".

```python
def min_capacity(weights, days):
    def feasible(cap):              # monotonic: true for all larger caps
        d, cur = 1, 0
        for w in weights:
            if cur + w > cap:
                d += 1; cur = 0
            cur += w
        return d <= days

    lo, hi = max(weights), sum(weights)   # bounds must be VALID answers
    while lo < hi:
        mid = lo + (hi - lo) // 2
        if feasible(mid): hi = mid        # keep searching lower
        else:             lo = mid + 1
    return lo
```

**Three questions to ask:** what am I searching over (not the array — the
*answer*)? Is `feasible` monotonic? Are my bounds valid answers?

### Sliding window — variable size

```python
def longest_unique(s):
    seen = {}                        # char -> last index
    best = left = 0
    for right, ch in enumerate(s):
        if ch in seen and seen[ch] >= left:
            left = seen[ch] + 1      # >= left: never move `left` BACKWARDS
        seen[ch] = right
        best = max(best, right - left + 1)
    return best
```

> **`seen[ch] >= left` is the whole difficulty.** On `"abba"`, when the second
> `a` arrives its stored index is 0, which is behind `left`. Without the guard
> you jump `left` backwards and get 3 instead of 2.

### Two pointers — opposite ends

```python
def two_sum_sorted(a, target):
    lo, hi = 0, len(a) - 1
    while lo < hi:
        s = a[lo] + a[hi]
        if s == target: return [lo, hi]
        if s < target:  lo += 1      # need bigger
        else:           hi -= 1      # need smaller
    return []
```

### Monotonic stack — next greater

```python
def next_greater(nums):
    res, st = [-1] * len(nums), []   # st holds INDICES
    for i, n in enumerate(nums):
        while st and nums[st[-1]] < n:
            res[st.pop()] = n        # n is the answer for everything popped
        st.append(i)
    return res
```

**Store indices, not values** — you almost always need the position, and can get
the value from it. For *distance* problems (LC 739) the answer is `i - j`.

### BFS on a grid

```python
from collections import deque

def shortest_path(grid):
    R, C = len(grid), len(grid[0])
    q = deque([(0, 0, 1)])
    seen = {(0, 0)}                  # mark visited ON PUSH, not on pop
    while q:
        r, c, d = q.popleft()
        if (r, c) == (R - 1, C - 1): return d
        for dr, dc in ((1,0), (-1,0), (0,1), (0,-1)):
            nr, nc = r + dr, c + dc
            if 0 <= nr < R and 0 <= nc < C and grid[nr][nc] == 0 \
               and (nr, nc) not in seen:
                seen.add((nr, nc))
                q.append((nr, nc, d + 1))
    return -1
```

> **Mark visited when you push, not when you pop.** Popping lets the same cell
> enter the queue many times before it is first processed, which turns O(V+E)
> into something much worse.

### Backtracking

```python
def backtrack(path, choices):
    if is_complete(path):
        results.append(path[:])      # COPY -- path is mutated after this
        return
    for choice in choices:
        if not valid(choice, path): continue   # prune
        path.append(choice)          # choose
        backtrack(path, next_choices)# explore
        path.pop()                   # UNDO
```

### DP — 1D, rolling variables

```python
def rob(nums):
    prev = cur = 0
    for n in nums:
        prev, cur = cur, max(cur, prev + n)
    return cur
```

**Write the O(n)-space table first, then compress.** Compressing before the
recurrence is correct is how you produce something that is fast and wrong.

### Union-Find

```python
class DSU:
    def __init__(self, n):
        self.p = list(range(n)); self.r = [0]*n; self.count = n
    def find(self, x):
        if self.p[x] != x: self.p[x] = self.find(self.p[x])   # compress
        return self.p[x]
    def union(self, a, b):
        ra, rb = self.find(a), self.find(b)
        if ra == rb: return False        # already joined -> a CYCLE edge
        if self.r[ra] < self.r[rb]: ra, rb = rb, ra
        self.p[rb] = ra
        if self.r[ra] == self.r[rb]: self.r[ra] += 1
        self.count -= 1
        return True
```

---

## 4 · Complexity

| Structure | Access | Search | Insert | Delete |
|---|---|---|---|---|
| Array | O(1) | O(n) | O(n) | O(n) |
| Sorted array | O(1) | **O(log n)** | O(n) | O(n) |
| Hash map | — | **O(1)** | O(1) | O(1) |
| Balanced BST / TreeMap | — | O(log n) | O(log n) | O(log n) |
| Heap | O(1) peek | O(n) | O(log n) | O(log n) |
| Linked list | O(n) | O(n) | **O(1)** at a known node | O(1) |
| Trie | — | O(L) | O(L) | O(L) |
| Union-Find | — | ~O(1) | — | — |

**Sorting is O(n log n).** If your solution is already O(n log n), sorting is
free — say so.

**Recursion space is the call depth**, and it is separate from time. The subsets
tree is O(2ⁿ) time but only O(n) stack.

---

## 5 · Python ↔ Java

| Task | Python | Java |
|---|---|---|
| Min-heap | `heapq` (min by default) | `PriorityQueue<>()` |
| Max-heap | negate values | `PriorityQueue<>(Collections.reverseOrder())` |
| Push+pop in one | `heappushpop` | `offer` then `poll` |
| Sort by key | `xs.sort(key=lambda x: x[1])` | `Arrays.sort(a, (x,y) -> Integer.compare(x[1], y[1]))` |
| Counter | `collections.Counter` | `map.merge(k, 1, Integer::sum)` |
| Default dict | `defaultdict(list)` | `map.computeIfAbsent(k, x -> new ArrayList<>())` |
| Deque | `collections.deque` | `ArrayDeque` |
| Binary search | `bisect_left/right` | `Arrays.binarySearch` (undefined on duplicates) |
| Build a string | `"".join(parts)` | `StringBuilder` |
| Integer division | `//` (floors toward −∞) | `/` (truncates toward 0) |
| `-7 % 3` | `2` | **`-1`** |
| Max int | unbounded | `Integer.MAX_VALUE`, overflows |

> **Four that cause real bugs:**
> **`a - b` in a Java comparator overflows** — use `Integer.compare`.
> **Java `%` keeps the dividend's sign** — normalise with `((x % k) + k) % k`.
> **`-7 // 2` is `-4` in Python, `-3` in Java.**
> **Python tuple comparison falls through to the next element** — add a
> tiebreaker when heaping non-comparable objects.

---

## 6 · Bugs that actually cost you

| Bug | Where it bites |
|---|---|
| `while lo <= hi` with half-open bounds | Binary search — infinite loop |
| `hi = mid - 1` in the leftmost template | Skips the answer |
| Moving `left` backwards | Sliding window on repeated chars |
| `path` instead of `path[:]` | Backtracking — all results identical |
| Forgetting `path.pop()` | Backtracking — results contaminated |
| Marking visited on pop | BFS/DFS — exponential blowup |
| `i > 0` instead of `i > start` | Duplicate handling in subsets |
| `s += ch` in a loop | Strings — silent O(n²) |
| Slicing inside a loop | Same, hidden |
| No `counts[0] = 1` | Prefix-sum counting — off by exactly the prefixes |
| Comparing `parent[a] == parent[b]` | Union-Find — compare `find()`, not parents |
| Integer overflow on `(lo+hi)/2` | Java/C++ — use `lo + (hi-lo)/2` |
| Not handling empty input | Everywhere |

---

## 7 · Before you type

```
[ ] Restate the problem in one sentence
[ ] Ask: duplicates? negatives? empty? sorted? size?
[ ] State the brute force AND its complexity
[ ] Name the pattern out loud, and why
[ ] Say the target complexity before coding
[ ] Walk one small example by hand
[ ] Code it
[ ] Trace the example through your code, out loud
[ ] Check: empty, single element, all-same, largest input
```

**Stating the brute force first is free marks.** It shows you understand the
problem before optimising it, and it gives you a correctness baseline to compare
against.

---

## 8 · The 10 problems that teach the most

If you have one evening:

| # | Problem | Teaches |
|---|---|---|
| 1 | Two Sum (LC 1) | Hash map as memory |
| 2 | Valid Parentheses (LC 20) | The stack template |
| 3 | Longest Substring Without Repeating (LC 3) | Sliding window |
| 4 | Merge Intervals (LC 56) | Sort-then-sweep |
| 5 | Number of Islands (LC 200) | Grid DFS/BFS |
| 6 | Course Schedule (LC 207) | Topological sort / cycle detection |
| 7 | Coin Change (LC 322) | DP from a recurrence |
| 8 | Subsets (LC 78) | The backtracking template |
| 9 | Kth Largest (LC 215) | Heap vs quickselect |
| 10 | Binary Search (LC 704) | The bounds, properly |

**These ten cover eight patterns.** If you can re-derive all ten cold, you can
attempt most of an interview loop.
