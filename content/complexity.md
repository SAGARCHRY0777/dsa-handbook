---
title: Complexity reference
slug: complexity
module: reference
order: 90
status: live
summary: The costs you must state without thinking, the operation counts that tell you which complexity is intended, and how to analyse recursion in an interview.
---

# Complexity reference

Stating time and space **without being asked** is scored in every round. This
page is the set of facts that makes that automatic.

---

## Reading the constraints

The bound tells you the intended solution. Reading it properly is free
information, and most candidates skip it.

| Constraint | Intended complexity | Typical approach |
|---|---|---|
| `n ≤ 10` | O(n!) or O(2ⁿ) | Permutations, backtracking |
| `n ≤ 20` | O(2ⁿ) | Bitmask DP, subsets |
| `n ≤ 100` | O(n³) | Interval DP, Floyd–Warshall |
| `n ≤ 1,000` | O(n²) | Nested loops, 2D DP |
| `n ≤ 10⁵` | O(n log n) | Sort, heap, binary search |
| `n ≤ 10⁶` | O(n) | Single pass, two pointers, prefix sum |
| `n ≤ 10⁹` | O(log n) or O(1) | **Binary search on the answer**, maths |

**Rough working figure: ~10⁸ simple operations per second.** So `n = 10⁵` with
an O(n²) solution is 10¹⁰ operations — far too slow, and you know that before
writing a line.

> **The most useful single inference:** `n ≤ 10⁹` with a numeric answer almost
> always means binary search on the answer, because you cannot enumerate the
> space but you can halve it.

---

## Data structure operations

### Python built-ins

| Operation | `list` | `dict` / `set` | `deque` | `heapq` |
|---|---|---|---|---|
| Access by index | O(1) | — | O(1) ends | O(1) min only |
| Search | O(n) | **O(1)** avg | O(n) | O(n) |
| Insert / append at end | O(1) amortised | O(1) avg | O(1) | O(log n) |
| Insert at front | **O(n)** | — | **O(1)** | — |
| Delete from front | **O(n)** | — | **O(1)** | O(log n) |
| Delete arbitrary | O(n) | O(1) avg | O(n) | O(n) |
| `min` / `max` | O(n) | O(n) | O(n) | **O(1)** min |

> **`list.pop(0)` is O(n).** Using a list as a queue turns an O(n) algorithm
> into O(n²) and is one of the most common silent performance bugs. Use
> `collections.deque`.

### Classic structures

| Structure | Search | Insert | Delete | Note |
|---|---|---|---|---|
| Sorted array | O(log n) | O(n) | O(n) | Binary search, expensive updates |
| Hash table | O(1) avg, **O(n) worst** | O(1) avg | O(1) avg | Worst case is adversarial collisions |
| Balanced BST | O(log n) | O(log n) | O(log n) | Ordered iteration, unlike a hash |
| Binary heap | O(n) | O(log n) | O(log n) | O(1) peek at the extreme |
| Trie | O(k) | O(k) | O(k) | k is key length, independent of n |
| Union-find | ~O(1) | ~O(1) | — | Inverse Ackermann, with both optimisations |

---

## Algorithms

| Algorithm | Time | Space | Note |
|---|---|---|---|
| Binary search | O(log n) | O(1) | Needs monotonicity, not sortedness |
| Merge sort | O(n log n) | O(n) | Stable, predictable |
| Quicksort | O(n log n) avg, **O(n²) worst** | O(log n) | Randomise the pivot |
| Heapsort | O(n log n) | O(1) | In place, not stable |
| Counting / bucket sort | **O(n + k)** | O(k) | Only for bounded integer keys |
| `heapify` | **O(n)** | O(1) | Not O(n log n) — bottom-up sifting |
| BFS / DFS | O(V + E) | O(V) | |
| Dijkstra (binary heap) | O((V + E) log V) | O(V) | Non-negative weights only |
| Bellman–Ford | O(V · E) | O(V) | Handles negatives; detects negative cycles |
| Floyd–Warshall | O(V³) | O(V²) | All pairs; fine for V ≤ 400 |
| Topological sort | O(V + E) | O(V) | Detects cycles for free |
| Kruskal MST | O(E log E) | O(V) | Sort edges, union-find |

**`heapify` being O(n) is a favourite question.** Most elements are near the
bottom of the heap and sift down only a short distance; summing the work gives a
convergent series, not n log n.

---

## Recursion analysis

Two things carry most interview cases.

**The recursion tree** — count nodes and work per node:

```
   fib(n) naive:      branching 2, depth n     -> O(2^n)
   merge sort:        branching 2, depth log n,
                      O(n) merge per level     -> O(n log n)
   binary search:     branching 1, depth log n -> O(log n)
   subsets:           2 choices per element    -> O(2^n) * O(n) to copy
   permutations:      n! orderings             -> O(n! * n)
```

**The Master Theorem** for `T(n) = a·T(n/b) + O(nᵈ)`:

| Condition | Result | Example |
|---|---|---|
| `a < bᵈ` | O(nᵈ) | Binary search on a sorted array |
| `a = bᵈ` | O(nᵈ log n) | Merge sort: a=2, b=2, d=1 |
| `a > bᵈ` | O(n^(log_b a)) | Naive Karatsuba-style splitting |

**Space includes the call stack.** A recursive DFS on a skewed tree is O(n)
space, not O(1). Saying "O(h), which is O(log n) balanced and O(n) in the worst
case" is the complete answer.

---

## Amortised versus worst case

Three cases worth being precise about, because interviewers probe them:

| Thing | Naive claim | Honest answer |
|---|---|---|
| `list.append` | O(1) | O(1) **amortised** — occasional O(n) resize |
| Hash lookup | O(1) | O(1) **average**; O(n) worst under collisions |
| Monotonic stack loop | Looks O(n²) | O(n) — each index pushed once, popped once |

**The monotonic stack argument in one sentence:** *"the inner `while` looks
quadratic, but each element is pushed exactly once and popped at most once, so
there are at most 2n stack operations across the whole run."*

---

## Common complexities, ranked

```
   O(1)         hash lookup, array index
   O(log n)     binary search, heap push/pop, balanced BST
   O(n)         single pass, two pointers, BFS/DFS, heapify
   O(n log n)   sorting, heap over n items, divide and conquer
   O(n²)        nested loops, 2D DP, naive pair comparison
   O(n³)        triple loops, Floyd-Warshall, interval DP
   O(2^n)       subsets, naive recursion without memoisation
   O(n!)        permutations, brute-force TSP
```

**The jump from O(n log n) to O(n²) is the one that decides whether you pass.**
At `n = 10⁵` those are roughly 1.7 million versus 10 billion operations.

---

## Saying it well

The full form, delivered unprompted at the end of a solution:

> *"Time is O(n log n), dominated by the sort — the scan afterwards is O(n).
> Space is O(n) for the output, or O(1) extra if we sort in place and stream the
> result."*

Three things that make it a good answer rather than a number:

1. **Say what dominates**, not just the total. "Dominated by the sort" shows you
   know where the cost is.
2. **Separate output space from working space.** Interviewers often mean the
   second.
3. **Give the worst case, and name the average if it differs.** Quickselect is
   "O(n) average, O(n²) worst with a bad pivot, mitigated by randomising" —
   never just "O(n)".
