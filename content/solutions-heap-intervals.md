---
title: Solutions — heap & intervals
slug: solutions-heap-intervals
module: solutions
order: 64
status: live
level: worst → best
summary: Five problems from sorting-everything to the optimal structure, in Python and Java, with the trade-offs stated.
---

# Solutions — heap & intervals

The recurring lesson: **sorting everything is the honest baseline**, and the
improvement is usually keeping only what you need.

---

## LC 215 · Kth Largest Element in an Array

### Approach 1 — sort · O(n log n) time, O(1) or O(n) space

Always state this. It is simple, correct, and often good enough.

```python
def find_kth_largest(nums, k):
    nums.sort()
    return nums[-k]
```

```java
public int findKthLargest(int[] nums, int k) {
    Arrays.sort(nums);
    return nums[nums.length - k];
}
```

### Approach 2 — min-heap of size k · O(n log k) time, O(k) space ✅

The root of a size-k min-heap is the weakest of your current best k — exactly
what to evict when something better arrives.

```python
import heapq

def find_kth_largest(nums, k):
    heap = nums[:k]
    heapq.heapify(heap)                  # O(k), cheaper than k pushes
    for x in nums[k:]:
        if x > heap[0]:
            heapq.heappushpop(heap, x)   # one sift, not two
    return heap[0]
```

```java
public int findKthLargest(int[] nums, int k) {
    // Java's PriorityQueue is a MIN-heap by default -- which is what we want
    // for the k largest. This is the point people get backwards.
    PriorityQueue<Integer> heap = new PriorityQueue<>();
    for (int x : nums) {
        heap.offer(x);
        if (heap.size() > k) heap.poll();      // drop the smallest of k+1
    }
    return heap.peek();
}
```

### Approach 3 — quickselect · O(n) average, O(n²) worst, O(1) space ✅

```python
import random

def find_kth_largest(nums, k):
    target = len(nums) - k               # index in sorted order

    def select(lo, hi):
        # Randomise the pivot: a fixed pivot degrades to O(n^2) on sorted
        # input, which is the standard adversarial case.
        pivot = nums[random.randint(lo, hi)]
        left = [x for x in nums[lo:hi+1] if x < pivot]
        mid = [x for x in nums[lo:hi+1] if x == pivot]
        right = [x for x in nums[lo:hi+1] if x > pivot]
        nums[lo:hi+1] = left + mid + right

        if target < lo + len(left):
            return select(lo, lo + len(left) - 1)
        if target >= lo + len(left) + len(mid):
            return select(lo + len(left) + len(mid), hi)
        return pivot

    return select(0, len(nums) - 1)
```

**The comparison is the answer:**

> *"Heap is O(n log k) with O(k) space and works on a stream — I never need the
> whole array. Quickselect is O(n) average but O(n²) worst with a bad pivot, and
> needs everything in memory. For a stream I take the heap; for a one-shot
> in-memory query with large k, quickselect."*

---

## LC 347 · Top K Frequent Elements

### Approach 1 — count and sort · O(n log n)

```python
from collections import Counter

def top_k_frequent(nums, k):
    return [x for x, _ in Counter(nums).most_common(k)]
```

### Approach 2 — size-k heap · O(n log k) ✅

```java
public int[] topKFrequent(int[] nums, int k) {
    Map<Integer, Integer> counts = new HashMap<>();
    for (int x : nums) counts.merge(x, 1, Integer::sum);

    // Min-heap on frequency, size capped at k.
    PriorityQueue<Integer> heap =
        new PriorityQueue<>((a, b) -> counts.get(a) - counts.get(b));
    for (int key : counts.keySet()) {
        heap.offer(key);
        if (heap.size() > k) heap.poll();
    }

    int[] out = new int[k];
    for (int i = k - 1; i >= 0; i--) out[i] = heap.poll();
    return out;
}
```

### Approach 3 — bucket sort · O(n) time ✅✅

A frequency can never exceed `n`, so it indexes an array directly. That removes
the log factor entirely.

```python
from collections import Counter

def top_k_frequent(nums, k):
    counts = Counter(nums)
    buckets = [[] for _ in range(len(nums) + 1)]     # index BY frequency
    for value, freq in counts.items():
        buckets[freq].append(value)

    out = []
    for freq in range(len(buckets) - 1, 0, -1):      # read high to low
        for value in buckets[freq]:
            out.append(value)
            if len(out) == k:
                return out
    return out
```

```java
public int[] topKFrequent(int[] nums, int k) {
    Map<Integer, Integer> counts = new HashMap<>();
    for (int x : nums) counts.merge(x, 1, Integer::sum);

    List<Integer>[] buckets = new List[nums.length + 1];
    for (Map.Entry<Integer, Integer> e : counts.entrySet()) {
        int freq = e.getValue();
        if (buckets[freq] == null) buckets[freq] = new ArrayList<>();
        buckets[freq].add(e.getKey());
    }

    int[] out = new int[k];
    int idx = 0;
    for (int freq = buckets.length - 1; freq > 0 && idx < k; freq--) {
        if (buckets[freq] == null) continue;
        for (int value : buckets[freq]) {
            if (idx == k) break;
            out[idx++] = value;
        }
    }
    return out;
}
```

**The bucket-sort answer is the one that impresses**, and the insight —
*frequency is bounded by n, so it can be an index* — transfers to other counting
problems.

---

## LC 23 · Merge k Sorted Lists

### Approach 1 — collect all values, sort, rebuild · O(N log N)

Correct, ignores the sortedness you were given, and uses O(N) extra space.

### Approach 2 — merge one at a time · O(k·N)

Merging list 1 into the accumulated result re-walks it every time.

### Approach 3 — heap of heads · O(N log k) ✅

```python
import heapq

def merge_k_lists(lists):
    heap = []
    # The index is a TIEBREAKER: ListNode is not comparable, so without it
    # Python raises TypeError whenever two values are equal.
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

```java
public ListNode mergeKLists(ListNode[] lists) {
    // A comparator avoids Java's version of the same problem -- no tiebreaker
    // needed because we compare explicitly on the field we care about.
    PriorityQueue<ListNode> heap =
        new PriorityQueue<>((a, b) -> a.val - b.val);
    for (ListNode node : lists) {
        if (node != null) heap.offer(node);
    }

    ListNode dummy = new ListNode(), tail = dummy;
    while (!heap.isEmpty()) {
        ListNode node = heap.poll();
        tail.next = node;
        tail = node;
        if (node.next != null) heap.offer(node.next);
    }
    return dummy.next;
}
```

### Approach 4 — divide and conquer · O(N log k), O(1) extra space

Pair up lists and merge repeatedly. Same time, no heap.

> *"O(N log k), not O(N log N) — every node is pushed and popped once on a heap
> of size at most k."*

**The Java tiebreaker point is worth making:** Python compares tuples element by
element and fails on non-comparable objects, so you need a unique middle field.
Java's comparator sidesteps it entirely.

---

## LC 56 · Merge Intervals

### Approach 1 — repeatedly scan for overlaps · O(n²)

Merge any overlapping pair, restart, until nothing changes.

### Approach 2 — sort by start, one pass · O(n log n) ✅

```python
def merge(intervals):
    if not intervals:
        return []
    intervals.sort(key=lambda x: x[0])
    out = [intervals[0][:]]                   # copy -- do not mutate the input

    for start, end in intervals[1:]:
        if start <= out[-1][1]:
            # max, not assignment: [[1,10],[2,3]] must stay [1,10].
            out[-1][1] = max(out[-1][1], end)
        else:
            out.append([start, end])
    return out
```

```java
public int[][] merge(int[][] intervals) {
    if (intervals.length == 0) return intervals;
    Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));

    List<int[]> out = new ArrayList<>();
    out.add(new int[]{intervals[0][0], intervals[0][1]});

    for (int i = 1; i < intervals.length; i++) {
        int[] last = out.get(out.size() - 1);
        if (intervals[i][0] <= last[1]) {
            last[1] = Math.max(last[1], intervals[i][1]);
        } else {
            out.add(new int[]{intervals[i][0], intervals[i][1]});
        }
    }
    return out.toArray(new int[0][]);
}
```

> **Ask first:** *"Do touching intervals like `[1,3]` and `[3,5]` count as
> overlapping?"* It changes `<=` to `<`, it is a genuine ambiguity, and asking
> is scored.

**Use `Integer.compare(a[0], b[0])`, not `a[0] - b[0]`** — subtraction overflows
on large opposite-signed values. A small correctness detail worth knowing.

---

## LC 253 · Meeting Rooms II

### Approach 1 — check every pair for overlap · O(n²)

Count maximum simultaneous overlaps by brute force.

### Approach 2 — min-heap of end times · O(n log n) ✅

```python
import heapq

def min_meeting_rooms(intervals):
    if not intervals:
        return 0
    intervals.sort(key=lambda x: x[0])
    ends = []                             # end times of rooms in use

    for start, end in intervals:
        # Only the EARLIEST-finishing room matters: if it is still busy, so is
        # every other room.
        if ends and ends[0] <= start:
            heapq.heappop(ends)
        heapq.heappush(ends, end)
    return len(ends)
```

### Approach 3 — sweep line · O(n log n) ✅

```python
def min_meeting_rooms(intervals):
    events = []
    for start, end in intervals:
        events.append((start, 1))
        events.append((end, -1))
    # A meeting ending at t frees the room for one starting at t, so -1 must
    # sort before +1. Tuple ordering gives that for free.
    events.sort()

    current = best = 0
    for _, delta in events:
        current += delta
        best = max(best, current)
    return best
```

```java
public int minMeetingRooms(int[][] intervals) {
    int n = intervals.length;
    int[] starts = new int[n], ends = new int[n];
    for (int i = 0; i < n; i++) {
        starts[i] = intervals[i][0];
        ends[i] = intervals[i][1];
    }
    Arrays.sort(starts);
    Arrays.sort(ends);

    // Two sorted arrays walked in parallel -- the sweep line without an
    // explicit event list.
    int rooms = 0, best = 0, e = 0;
    for (int s = 0; s < n; s++) {
        while (e < n && ends[e] <= starts[s]) { rooms--; e++; }
        rooms++;
        best = Math.max(best, rooms);
    }
    return best;
}
```

**Which to offer:** the heap version generalises when you need to know *which*
room; the sweep line generalises to weighted capacity problems like Car Pooling.
Saying that is better than picking one and defending it.

---

## Python and Java, heap and sorting specifics

| Task | Python | Java |
|---|---|---|
| Min-heap | `heapq` (min by default) | `PriorityQueue<>()` (min by default) |
| Max-heap | Negate values | `new PriorityQueue<>(Collections.reverseOrder())` |
| Heapify a list | `heapq.heapify(xs)` — O(n) | `new PriorityQueue<>(collection)` — O(n) |
| Push then pop | `heappushpop` — one sift | `offer` then `poll` — two operations |
| Sort by key | `xs.sort(key=lambda x: x[1])` | `Arrays.sort(a, (x,y) -> Integer.compare(x[1], y[1]))` |
| Comparator overflow | Not possible — arbitrary precision | **`a - b` overflows.** Use `Integer.compare` |
| Non-comparable tie | `TypeError` — add a tiebreaker | Comparator avoids it |

**The two that cause real bugs:** `a - b` overflow in Java comparators, and
Python's tuple comparison falling through to non-comparable objects. Neither is
syntax — both are correctness.
