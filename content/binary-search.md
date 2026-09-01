---
title: Binary search
slug: binary-search
module: search
order: 30
status: live
level: basic → advanced
summary: Not just "find a value in a sorted array" — the far more useful version is binary search on the answer, which is what separates candidates.
---

# Binary search

> **Recognition in one line:** the search space is **monotonic** — there is some
> point where the answer flips from *no* to *yes* — and you can test any single
> candidate cheaply.

Sorted-array lookup is the easy half. **Binary search on the answer** is the
half that gets asked in senior rounds, and the half most candidates never
recognise.

---

## 1 · Recognition cues

### Classic — searching a sorted array

| Cue | Note |
|---|---|
| "sorted array" + "find / first / last" | The plain template |
| "find the insertion position" | `bisect_left` |
| "count occurrences of X" | `bisect_right − bisect_left` |
| "rotated sorted array" | One half is always sorted; identify which |

### On the answer — the valuable half

| Cue | This is the giveaway |
|---|---|
| "**minimum** possible **maximum**" | Almost always binary search on the answer |
| "**maximum** possible **minimum**" | Same |
| "smallest k such that …" | Same |
| "can we do it in `t` time / `c` capacity?" | The feasibility test |
| `n ≤ 10⁹` but the answer is a number | You cannot enumerate; you can search |
| "minimise the largest sum / distance / cost" | Same |

> **The trigger phrase to memorise: "minimum maximum" or "maximum minimum".**
> When you see it, stop and ask *"what would I binary search over?"* — the answer
> is nearly always the numeric answer itself, not an index.

---

## 2 · The templates

Use **one** template for the classic case and never write `mid ± 1` boundary
logic again.

```python
# 1. LOWER BOUND -- first index where the predicate becomes True.
#    Everything is a variation of this. Learn only this one.
def lower_bound(nums, target):
    lo, hi = 0, len(nums)          # hi is EXCLUSIVE -- len(nums), not len-1
    while lo < hi:                 # strict <, so it terminates cleanly
        mid = (lo + hi) // 2
        if nums[mid] < target:     # predicate: "still too small"
            lo = mid + 1
        else:
            hi = mid               # NOT mid - 1. mid may be the answer
    return lo                      # first index with nums[i] >= target
```

**Why this template and not the `lo <= hi` one:** with `hi` exclusive and
`hi = mid`, there is no `+1`/`−1` decision to get wrong, the loop always
terminates, and `lo` is the answer at the end. The classic version has four
places to put an off-by-one and most people find at least one of them.

In Python, use the standard library when you can:

```python
from bisect import bisect_left, bisect_right

i = bisect_left(nums, x)              # first index where nums[i] >= x
j = bisect_right(nums, x)             # first index where nums[i] >  x
count_of_x = j - i
exists = i < len(nums) and nums[i] == x
```

```python
# 2. BINARY SEARCH ON THE ANSWER -- the pattern that matters
def min_feasible(lo, hi, feasible):
    """Smallest value in [lo, hi] for which feasible() is True.

    Requires monotonicity: if feasible(x) then feasible(x+1). The whole skill
    is spotting that property and writing the feasibility test.
    """
    while lo < hi:
        mid = (lo + hi) // 2
        if feasible(mid):
            hi = mid                  # mid works; maybe something smaller does
        else:
            lo = mid + 1              # mid fails; the answer is strictly above
    return lo
```

**The three questions to answer out loud before coding one of these:**

1. **What am I searching over?** (capacity, speed, time, distance — not an index)
2. **What are `lo` and `hi`?** (usually `max(item)` to `sum(items)`, or 1 to
   `max`)
3. **What is `feasible(x)`, and is it monotonic?** (if `x` works, does `x+1`?)

---

## 3 · The ladder

### Easy — the template

| # | Problem | Source | The point |
|---|---|---|---|
| 1 | Binary Search | LC 704 · NeetCode | The bare template |
| 2 | Search Insert Position | LC 35 | This *is* `lower_bound` |
| 3 | First Bad Version | LC 278 | Predicate form, not value form |

### Medium — where it gets interesting

| # | Problem | Source | The point |
|---|---|---|---|
| 4 | **Find First and Last Position** | LC 34 | Two bounds. `bisect_left` and `bisect_right` |
| 5 | **Search in Rotated Sorted Array** | LC 33 · NeetCode | One half is always sorted — decide which |
| 6 | Find Minimum in Rotated Sorted Array | LC 153 · NeetCode | Compare `mid` to `hi`, not to `lo` |
| 7 | **Koko Eating Bananas** | LC 875 · NeetCode | **The canonical search-on-the-answer** |
| 8 | Capacity To Ship Packages | LC 1011 | Same shape, different feasibility test |
| 9 | Split Array Largest Sum | LC 410 | "Minimise the maximum" — the trigger phrase |
| 10 | Search a 2D Matrix | LC 74 · NeetCode | Treat it as one flat sorted array |
| 11 | Find Peak Element | LC 162 | Binary search without sorted data — monotonic *slope* |
| 12 | Time Based Key-Value Store | LC 981 · NeetCode | `bisect` on timestamps. Design flavour |

### Hard

| # | Problem | Source | The point |
|---|---|---|---|
| 13 | **Median of Two Sorted Arrays** | LC 4 · NeetCode | Binary search on the partition. Genuinely hard |
| 14 | Minimise Max Distance to Gas Station | LC 774 | Search on a *real-valued* answer |

**If you only do four: 704, 33, 875, 410.** Those give you the template, the
rotated variant, and two search-on-the-answer problems.

---

## 4 · Worked example — LC 875, Koko Eating Bananas

**Problem:** piles of bananas, `h` hours. Koko eats `k` bananas/hour from one
pile per hour. Find the **minimum** `k` that finishes in time.

**Recognise:** "minimum speed such that it fits in `h` hours". The answer is a
*number*, not an index, and feasibility is monotonic — if speed `k` works, any
faster speed also works. Binary search on `k`.

```
   piles = [3, 6, 7, 11],  h = 8

   search space for k: 1 .. max(piles) = 11
     k must be >= 1, and k = max(piles) always finishes in len(piles) hours

   feasible(k) = sum(ceil(p / k) for p in piles) <= h

   k=6   ceil: 1+1+2+2 = 6  <= 8   feasible -> try smaller,  hi=6
   k=3   ceil: 1+2+3+4 = 10 >  8   NOT       -> lo=4
   k=5   ceil: 1+2+2+3 = 8  <= 8   feasible -> hi=5
   k=4   ceil: 1+2+2+3 = 8  <= 8   feasible -> hi=4
   lo == hi == 4

   answer 4
```

```python
import math

def min_eating_speed(piles: list[int], h: int) -> int:
    def hours_needed(k: int) -> int:
        # ceil division without floats: -(-p // k). Floats here are a real
        # source of wrong answers on large inputs.
        return sum(-(-p // k) for p in piles)

    lo, hi = 1, max(piles)          # k=0 is invalid; k=max always finishes
    while lo < hi:
        mid = (lo + hi) // 2
        if hours_needed(mid) <= h:
            hi = mid                # mid works -- look for something smaller
        else:
            lo = mid + 1            # mid too slow -- answer is strictly above
    return lo
```

**Complexity:** O(n log(max(piles))). The `log` factor is over the *value* range,
not the array length — worth saying explicitly, because it is what makes this
work when `n` is small but values are huge.

**Narrate it like this:** *"The answer is a speed between 1 and max(piles).
Feasibility is monotonic — if speed k finishes in time, so does k+1 — so I can
binary search the speed and test feasibility in O(n)."* That sentence is the
whole answer, and delivering it before coding is what the round is testing.

---

## 5 · Worked example — LC 33, Search in Rotated Sorted Array

**Problem:** a sorted array rotated at an unknown pivot. Find `target` in
O(log n).

**The insight:** for any `mid`, **at least one half is properly sorted**. Work
out which, then decide whether the target lies inside it.

```
   nums = [4, 5, 6, 7, 0, 1, 2],  target = 0
           0  1  2  3  4  5  6

   lo=0 hi=6 mid=3 (7)
     nums[lo]=4 <= nums[mid]=7  -> LEFT half [4,5,6,7] is sorted
     is target 0 in [4, 7)?  no -> discard the left, lo = 4

   lo=4 hi=6 mid=5 (1)
     nums[lo]=0 <= nums[mid]=1  -> LEFT half [0,1] is sorted
     is target 0 in [0, 1)?  YES -> discard the right, hi = 4

   lo=4 hi=4 mid=4 (0)  == target  -> return 4
```

```python
def search(nums: list[int], target: int) -> int:
    lo, hi = 0, len(nums) - 1

    while lo <= hi:
        mid = (lo + hi) // 2
        if nums[mid] == target:
            return mid

        # Exactly one side is guaranteed sorted. Identify it, then ask whether
        # the target lies within its known range -- that is the only place a
        # confident decision can be made.
        if nums[lo] <= nums[mid]:                  # left half sorted
            if nums[lo] <= target < nums[mid]:
                hi = mid - 1
            else:
                lo = mid + 1
        else:                                      # right half sorted
            if nums[mid] < target <= nums[hi]:
                lo = mid + 1
            else:
                hi = mid - 1

    return -1
```

**The `<=` in `nums[lo] <= nums[mid]` matters.** When `lo == mid` (a two-element
window) the left "half" is a single element and is trivially sorted; using `<`
misclassifies it and the search breaks on small windows.

---

## 6 · Worked example — LC 410, Split Array Largest Sum

**Problem:** split an array into `k` contiguous subarrays, minimising the
largest subarray sum.

**Recognise:** "**minimise the largest**" — the trigger phrase. Binary search on
the answer.

```
   nums = [7, 2, 5, 10, 8],  k = 2

   what are we searching over?  the largest allowed subarray sum
   lo = max(nums) = 10   (no subarray can be smaller than its biggest element)
   hi = sum(nums) = 32   (one subarray containing everything)

   feasible(limit) = greedily fill subarrays without exceeding `limit`;
                     is the number of subarrays needed <= k?

   limit=21  greedy: [7,2,5] =14, +10 -> 24 > 21 so cut; [10,8]=18  -> 2 parts. OK
   limit=15  greedy: [7,2,5]=14, +10>15 cut; [10]=10, +8>15 cut; [8]  -> 3 > 2. NO
   limit=18  greedy: [7,2,5]=14, +10>18 cut; [10,8]=18            -> 2. OK
   ...
   converges to 18
```

```python
def split_array(nums: list[int], k: int) -> int:
    def parts_needed(limit: int) -> int:
        # Greedy is optimal here: taking as much as possible into each part
        # can never require MORE parts than any other valid packing.
        parts, current = 1, 0
        for x in nums:
            if current + x > limit:
                parts += 1
                current = x
            else:
                current += x
        return parts

    lo, hi = max(nums), sum(nums)
    while lo < hi:
        mid = (lo + hi) // 2
        if parts_needed(mid) <= k:
            hi = mid
        else:
            lo = mid + 1
    return lo
```

**Complexity:** O(n log(sum − max)).

**The bounds are the part people get wrong.** `lo = max(nums)` because no limit
below the largest single element is achievable at all; `hi = sum(nums)` because
one part containing everything always works. Stating those two facts is half the
answer.

---

## 7 · Same problem in disguise

Every one of these is `min_feasible` with a different feasibility function.

| Problem | Search over | `feasible(x)` |
|---|---|---|
| Koko Eating Bananas (LC 875) | Eating speed | Hours needed ≤ h |
| Capacity To Ship Packages (LC 1011) | Ship capacity | Days needed ≤ D |
| Split Array Largest Sum (LC 410) | Largest allowed sum | Parts needed ≤ k |
| Minimum Days to Make Bouquets (LC 1482) | Number of days | Bouquets possible ≥ m |
| Magnetic Force Between Balls (LC 1552) | Minimum gap | Balls placeable ≥ m |
| Minimise Max Distance (LC 774) | Real-valued distance | Stations needed ≤ k |

**Six named problems, one function.** Write `min_feasible` once and each becomes
about five lines. Recognising this family is the single highest-return idea on
this page.

---

## 8 · Failure modes

| Bug | Symptom | Fix |
|---|---|---|
| `hi = mid - 1` in the lower-bound template | Skips the answer | `hi = mid`; `mid` may be it |
| `while lo <= hi` with exclusive `hi` | Infinite loop or overrun | Match the loop to the template |
| `mid = (lo + hi) // 2` overflow | Not an issue in Python; **is** in Java/C++ | `lo + (hi - lo) // 2` |
| Float division for ceilings | Precision errors on large values | `-(-a // b)` |
| Wrong `lo`/`hi` bounds on the answer | Wrong result, no crash | `lo = max(...)`, `hi = sum(...)` — justify both |
| Feasibility not monotonic | Converges to nonsense | Verify: if `x` works, must `x+1`? |
| `<` instead of `<=` in LC 33 | Fails on two-element windows | `nums[lo] <= nums[mid]` |

---

## 9 · Interview questions on this pattern

| Question | What to say |
|---|---|
| ⭐ "How do you know this is binary search?" | The answer space is monotonic — there is a threshold where feasibility flips — and I can test one candidate cheaply. That is the only requirement; the data does not need to be sorted. |
| "Search a rotated array." | At any `mid`, one half is guaranteed sorted. Identify which by comparing `nums[lo]` to `nums[mid]`, then check whether the target lies in that half's known range. |
| "Why `hi = mid` and not `mid - 1`?" | Because `mid` may be the answer. With exclusive `hi` and `lo < hi`, the loop still terminates and there is no off-by-one to get wrong. |
| ⭐ "Minimise the largest subarray sum." | Binary search the answer between `max(nums)` and `sum(nums)`, with a greedy feasibility check counting parts needed. O(n log(sum)). |
| "What if the answer is a real number?" | Binary search on floats with a fixed iteration count — about 100 iterations, or until the interval is below a tolerance. Do not loop on equality. |
| "Find a peak in an unsorted array in O(log n)." | Binary search on the *slope*: if `nums[mid] < nums[mid+1]` a peak exists to the right, else to the left. Monotonicity of the gradient, not of the values. |

---

## Stop condition

You are done with this pattern when you can:

1. write the lower-bound template cold, with the exclusive `hi`,
2. recognise "minimum maximum" as a search-on-the-answer trigger,
3. state the three questions — search over what, what bounds, what feasibility,
4. justify `lo` and `hi` for LC 410 out loud, and
5. explain why binary search needs monotonicity, not sortedness.
