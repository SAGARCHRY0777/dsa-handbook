---
title: Heap & top-k
slug: heap
module: structures
order: 23
status: live
level: basic → advanced
summary: When you need the k best of something without sorting everything — and the counter-intuitive detail that top-k largest uses a min-heap.
---

# Heap & top-k

> **Recognition in one line:** you need the **k largest / smallest / closest**,
> or repeated access to the current minimum or maximum of a changing collection.

The pattern is cheap to learn and appears constantly. The one genuinely
counter-intuitive part — **use a min-heap to track the k largest** — is also the
most common interview follow-up.

---

## 1 · Recognition cues

| Cue | What to use |
|---|---|
| "**k largest** / k most frequent / top k" | Min-heap of size k |
| "**k smallest** / k closest" | Max-heap of size k (negate in Python) |
| "**median** of a stream" | Two heaps, balanced |
| "merge k sorted lists" | Heap of the current head of each list |
| "schedule / process by priority" | Heap as a priority queue |
| "**k-th** largest element" | Min-heap of size k, return the root |
| "shortest path, weighted" | Dijkstra — a heap is the engine |
| "repeatedly take the largest and put something back" | Heap, e.g. LC 1046 |

**When *not* to use a heap:**

- You need the top k and k is close to n → just sort, O(n log n) and simpler
- You need k largest once, no updates → `heapq.nlargest`, or quickselect for O(n)
- You need order-statistics *and* range queries → a heap cannot do that; consider
  a balanced BST or a sorted container

---

## 2 · The templates

Python's `heapq` is a **min-heap only**. Everything else is worked around it.

```python
import heapq

heap = []
heapq.heappush(heap, x)          # O(log n)
smallest = heapq.heappop(heap)   # O(log n)
peek = heap[0]                   # O(1) -- do not pop just to look
heapq.heapify(items)             # O(n), in place. Faster than n pushes
heapq.heappushpop(heap, x)       # push then pop, ONE sift, faster than both
heapq.heapreplace(heap, x)       # pop then push -- different order, know both
```

```python
# TOP-K LARGEST -- with a MIN-heap of size k.
# The counter-intuitive bit: the min-heap's root is the WEAKEST of your
# current best k, so it is exactly the one to evict when a better item arrives.
def k_largest(nums, k):
    heap = []
    for x in nums:
        heapq.heappush(heap, x)
        if len(heap) > k:
            heapq.heappop(heap)      # drop the smallest of the k+1
    return heap                      # the k largest, in no useful order

# Better: one sift instead of two, once the heap is full.
def k_largest_faster(nums, k):
    heap = nums[:k]
    heapq.heapify(heap)
    for x in nums[k:]:
        if x > heap[0]:
            heapq.heappushpop(heap, x)
    return heap
```

**Why size k and not size n:** O(n log k) beats O(n log n), and when k is small
and n is huge — a stream, or a billion rows — the size-k heap is the only option
that fits in memory. That memory argument is the real reason interviewers ask.

```python
# MAX-HEAP in Python -- negate on the way in and out
max_heap = []
heapq.heappush(max_heap, -x)
largest = -heapq.heappop(max_heap)

# For tuples, negate only the sort key
heapq.heappush(heap, (-priority, task_id, task))
```

```python
# TWO HEAPS -- running median
class MedianFinder:
    def __init__(self):
        self.low = []      # max-heap (negated) -- the smaller half
        self.high = []     # min-heap            -- the larger half

    def add(self, num: int) -> None:
        # Always push to `low` first, then move `low`'s largest to `high`.
        # This guarantees ordering without any comparison logic.
        heapq.heappush(self.low, -num)
        heapq.heappush(self.high, -heapq.heappop(self.low))
        # Rebalance so low is never smaller than high.
        if len(self.high) > len(self.low):
            heapq.heappush(self.low, -heapq.heappop(self.high))

    def median(self) -> float:
        if len(self.low) > len(self.high):
            return -self.low[0]
        return (-self.low[0] + self.high[0]) / 2
```

---

## 3 · The ladder

### Easy

| # | Problem | Source | The point |
|---|---|---|---|
| 1 | Kth Largest Element in a Stream | LC 703 · NeetCode | The size-k min-heap, stated plainly |
| 2 | Last Stone Weight | LC 1046 · NeetCode | Max-heap via negation |

### Medium

| # | Problem | Source | The point |
|---|---|---|---|
| 3 | **Top K Frequent Elements** | LC 347 · NeetCode | Counter + heap; bucket sort gives O(n) |
| 4 | **Kth Largest Element in an Array** | LC 215 · NeetCode | Heap O(n log k), or quickselect O(n) average |
| 5 | K Closest Points to Origin | LC 973 · NeetCode | Size-k max-heap on squared distance |
| 6 | Task Scheduler | LC 621 · NeetCode | Greedy with a max-heap and a cooldown queue |
| 7 | Reorganise String | LC 767 | Always take the two most frequent |
| 8 | Meeting Rooms II | LC 253 | Min-heap of end times — the interval classic |
| 9 | Design Twitter | LC 355 · NeetCode | Merge k feeds with a heap |
| 10 | Sort Characters By Frequency | LC 451 | Counter, then heap or sort |

### Hard

| # | Problem | Source | The point |
|---|---|---|---|
| 11 | **Find Median from Data Stream** | LC 295 · NeetCode | Two balanced heaps |
| 12 | **Merge k Sorted Lists** | LC 23 · NeetCode | Heap of list heads |
| 13 | Smallest Range Covering k Lists | LC 632 | Heap plus a running maximum |
| 14 | Sliding Window Median | LC 480 | Two heaps with lazy deletion |

**If you only do four: 215, 347, 23, 295.**

---

## 4 · Worked example — LC 215, Kth Largest Element

**Problem:** the k-th largest element in an unsorted array.

Three solutions, and being able to compare them **is** the interview.

```
   sorting          O(n log n) time, O(1) or O(n) space   -- simple, honest
   min-heap size k  O(n log k) time, O(k) space           -- best for streams
   quickselect      O(n) AVERAGE, O(n²) worst, O(1) space -- best average case
```

```
   nums = [3, 2, 1, 5, 6, 4],  k = 2      (expect 5)

   MIN-HEAP OF SIZE 2:
     3      heap [3]
     2      heap [2,3]
     1      1 < heap[0]=2  -> ignore, it cannot be in the top 2
     5      5 > 2 -> pushpop -> heap [3,5]
     6      6 > 3 -> pushpop -> heap [5,6]
     4      4 < 5 -> ignore

   heap[0] = 5  -> the SMALLEST of the top 2 = the 2nd largest
```

```python
import heapq

def find_kth_largest(nums: list[int], k: int) -> int:
    # The root of a size-k min-heap is the weakest member of the current best
    # k -- which is precisely the k-th largest once every element is seen.
    heap = nums[:k]
    heapq.heapify(heap)                  # O(k), cheaper than k pushes
    for x in nums[k:]:
        if x > heap[0]:
            heapq.heappushpop(heap, x)   # one sift, not two
    return heap[0]
```

**Quickselect, for the "can you do better than O(n log k)?" follow-up:**

```python
import random

def find_kth_largest_quickselect(nums: list[int], k: int) -> int:
    target = len(nums) - k               # k-th largest = this index when sorted

    def select(lo, hi):
        # Random pivot: without it, an already-sorted input degrades to O(n²),
        # which is the standard adversarial case an interviewer will raise.
        pivot = nums[random.randint(lo, hi)]
        left, mid, right = [], [], []
        for x in nums[lo : hi + 1]:
            (left if x < pivot else right if x > pivot else mid).append(x)

        if target < lo + len(left):
            nums[lo : hi + 1] = left + mid + right
            return select(lo, lo + len(left) - 1)
        if target >= lo + len(left) + len(mid):
            nums[lo : hi + 1] = left + mid + right
            return select(lo + len(left) + len(mid), hi)
        return pivot                     # target lands inside the equal block

    return select(0, len(nums) - 1)
```

**Say the trade-off out loud:** *"Heap is O(n log k) with O(k) space and works on
a stream. Quickselect is O(n) average but O(n²) worst case and needs the whole
array in memory. For a stream I take the heap; for a one-shot in-memory query
with large k, quickselect."*

---

## 5 · Worked example — LC 347, Top K Frequent Elements

**Problem:** the k most frequent elements.

```
   nums = [1,1,1,2,2,3],  k = 2

   count = {1:3, 2:2, 3:1}

   HEAP: size-k min-heap on frequency
     (3,1)  heap [(3,1)]
     (2,2)  heap [(2,2),(3,1)]
     (1,3)  1 < heap[0][0]=2 -> ignore
     -> [1, 2]

   BUCKET SORT: index the buckets BY frequency. Frequency cannot exceed n,
   so an array of n+1 buckets holds everything, and reading it backwards
   gives descending frequency in O(n).

     bucket[1] = [3]
     bucket[2] = [2]
     bucket[3] = [1]
     read from the end -> 1, 2
```

```python
from collections import Counter
import heapq

def top_k_frequent(nums: list[int], k: int) -> list[int]:
    counts = Counter(nums)
    # nlargest is the readable form of the size-k heap and is O(n log k).
    return [x for x, _ in counts.most_common(k)]


def top_k_frequent_linear(nums: list[int], k: int) -> list[int]:
    """O(n) with bucket sort -- the follow-up answer.

    A frequency can never exceed len(nums), so frequencies index directly
    into an array. That removes the log factor entirely.
    """
    counts = Counter(nums)
    buckets = [[] for _ in range(len(nums) + 1)]
    for value, freq in counts.items():
        buckets[freq].append(value)

    out = []
    for freq in range(len(buckets) - 1, 0, -1):
        for value in buckets[freq]:
            out.append(value)
            if len(out) == k:
                return out
    return out
```

**The bucket-sort answer is the one that impresses**, because O(n) beats
O(n log k) and the insight — frequency is bounded by n, so it can be an index —
transfers to other counting problems.

---

## 6 · Worked example — LC 23, Merge k Sorted Lists

**Problem:** merge k sorted linked lists into one.

**The insight:** at any moment the next output element is the smallest among the
k current heads. That is exactly a heap query.

```
   lists:  1 -> 4 -> 5
           1 -> 3 -> 4
           2 -> 6

   heap holds one node per list, keyed by value:

   heap [(1,list0), (1,list1), (2,list2)]
     pop 1 (list0) -> output 1, push list0's next (4)
   heap [(1,list1), (2,list2), (4,list0)]
     pop 1 (list1) -> output 1, push 3
   heap [(2,list2), (3,list1), (4,list0)]
     pop 2 -> output 2, push 6
   ... and so on

   Total O(N log k): N nodes, each costing one push and one pop on a
   heap of size at most k.
```

```python
import heapq

def merge_k_lists(lists):
    heap = []
    # The index is a tiebreaker: ListNode objects are not comparable, so
    # without it Python raises TypeError whenever two values are equal.
    for i, node in enumerate(lists):
        if node:
            heapq.heappush(heap, (node.val, i, node))

    dummy = tail = ListNode()
    while heap:
        _, i, node = heapq.heappop(heap)
        tail.next = node
        tail = node
        if node.next:
            heapq.heappush(heap, (node.next.val, i, node.next))

    return dummy.next
```

**The tiebreaker index is the detail that catches people.** Python compares
tuples element by element; when two values tie it tries to compare the nodes and
raises `TypeError`. Adding a unique comparable second field prevents it, and
explaining *why* is a small mark of experience.

---

## 7 · Same problem in disguise

| Problem | Really is |
|---|---|
| Kth Largest in a Stream (LC 703) | Size-k min-heap, held across calls |
| K Closest Points (LC 973) | Size-k max-heap on distance |
| Top K Frequent Words (LC 692) | LC 347 with a lexicographic tiebreak |
| Meeting Rooms II (LC 253) | Min-heap of end times = rooms in use |
| Task Scheduler (LC 621) | Max-heap with a cooldown queue |
| Reorganise String (LC 767) | LC 621 with cooldown 1 |
| Sliding Window Median (LC 480) | LC 295 plus lazy deletion |
| Network Delay Time (LC 743) | Dijkstra — a heap under a different name |

---

## 8 · Failure modes

| Bug | Symptom | Fix |
|---|---|---|
| Max-heap without negation | Wrong order, silently | Negate the key on push and pop |
| Forgetting to negate on the way out | Negative results | `-heapq.heappop(h)` |
| Non-comparable tie in a tuple | `TypeError` on equal keys | Add a unique index as a tiebreaker |
| Heap of size n for a top-k query | O(n log n), memory blowup | Keep the heap at size k |
| `heappush` + `heappop` separately | Two sifts | `heappushpop` once the heap is full |
| n pushes instead of `heapify` | O(n log n) instead of O(n) | `heapify` the initial list |
| Popping just to peek | Corrupts the heap | `heap[0]` is O(1) |

---

## 9 · Interview questions on this pattern

| Question | What to say |
|---|---|
| ⭐ "Why a min-heap for the k **largest**?" | The root is the weakest of the current best k, so it is exactly what to evict when something better arrives. It also keeps the heap at size k, giving O(n log k) time and O(k) space. |
| "Beat O(n log k) for k-th largest?" | Quickselect: O(n) average, O(n²) worst with a bad pivot, mitigated by randomising. It needs the whole array, so a heap still wins on a stream. |
| ⭐ "Top k frequent in O(n)?" | Bucket sort by frequency — frequency is bounded by n, so it can index an array directly. Read the buckets backwards and stop at k. |
| "Running median?" | Two heaps: a max-heap for the lower half, a min-heap for the upper, kept balanced within one element. Median is a root, or the mean of two roots. O(log n) insert, O(1) query. |
| "Merge k sorted lists complexity?" | O(N log k) — every node is pushed and popped once on a heap of size at most k. Not O(N log N). |
| "`heapify` versus n pushes?" | `heapify` is O(n) by sifting bottom-up; n pushes is O(n log n). Use `heapify` whenever you have the data up front. |

---

## Stop condition

You are done with this pattern when you can:

1. explain why the k largest needs a *min*-heap,
2. give heap versus quickselect with the trade-off, not just the complexities,
3. produce the O(n) bucket-sort answer for top-k frequent,
4. write the two-heap median without comparison branching, and
5. say why a tuple tiebreaker is needed when heaping objects.
