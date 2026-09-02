---
title: Prefix sums & difference arrays
slug: prefix-sum
module: linear
order: 13
status: live
level: basic → intermediate
summary: Precompute once, answer range queries in O(1) — plus the hash-map variant that turns "subarray sums to k" from O(n²) into O(n), and the difference array for range updates.
---

# Prefix sums and difference arrays

> **Recognition in one line:** the problem asks about **sums (or counts) over
> ranges or subarrays**, and the brute force recomputes the same overlapping
> sums repeatedly.

The cheapest big win in the whole toolkit — usually four lines that remove a
factor of n.

---

## 1 · Recognition cues

| Cue | Signal |
|---|---|
| "sum of a subarray / range" | Definitive |
| "number of subarrays that sum to k" | Definitive — the hash-map variant |
| **Repeated range queries on a static array** | Definitive |
| "average of a subarray" | Same thing, divided |
| "range update, query at the end" | **Difference array** — the inverse |
| "product of all elements except self" | Prefix + suffix |
| "subarray with equal 0s and 1s" | Map 0 → −1, then prefix sums |
| 2D grid, "sum of a rectangle" | 2D prefix sums |

**The unifying idea:** any range aggregate `f(i..j)` where `f` has an inverse can
be answered as `F(j) − F(i−1)` after one pass. Sums qualify. XOR qualifies
(it is its own inverse). **Minimum does not** — which is why range-minimum
queries need a sparse table or segment tree instead, and knowing that boundary is
worth stating.

---

## 2 · The basic structure

```
nums    = [ 2,  4,  1,  7,  3]
prefix  = [0, 2,  6,  7, 14, 17]        prefix[i] = sum of first i elements
           ^  ^
           |  the leading 0 is what removes every edge case

sum(i..j) inclusive = prefix[j+1] - prefix[i]

sum(1..3) = prefix[4] - prefix[1] = 14 - 2 = 12   (4 + 1 + 7)  ✓
```

```python
def build_prefix(nums):
    # Length n+1 with a leading 0. Without it, every query needs an
    # "if i == 0" special case -- which is where the bugs live.
    prefix = [0] * (len(nums) + 1)
    for i, x in enumerate(nums):
        prefix[i + 1] = prefix[i] + x
    return prefix

def range_sum(prefix, i, j):              # inclusive both ends
    return prefix[j + 1] - prefix[i]
```

```java
int[] prefix = new int[nums.length + 1];
for (int i = 0; i < nums.length; i++) {
    prefix[i + 1] = prefix[i] + nums[i];
}
// sum of nums[i..j] inclusive
int sum = prefix[j + 1] - prefix[i];
```

> **The leading zero is not cosmetic.** With it, every query is one expression.
> Without it, `i == 0` is a special case you will forget under pressure. Use the
> `n+1` form always.

**Cost:** O(n) once, then O(1) per query. Worth it from the second query onward.

---

## 3 · The hash-map variant — the interview version

**This is the one that actually gets asked**, and it is a genuinely different
idea from the array above.

**Problem (LC 560):** count subarrays summing to exactly `k`.

```
A subarray (i..j) sums to k
  <=>  prefix[j+1] - prefix[i] == k
  <=>  prefix[i] == prefix[j+1] - k

So while scanning, at each position ask:
  "how many earlier prefixes equal (current_prefix - k)?"

That is a hash-map lookup. One pass. O(n).
```

```python
def subarray_sum(nums, k):
    from collections import defaultdict
    counts = defaultdict(int)
    counts[0] = 1                 # the empty prefix -- REQUIRED, see below
    running = 0
    total = 0

    for x in nums:
        running += x
        # Every earlier prefix equal to (running - k) marks the start of
        # a subarray ending here that sums to k.
        total += counts[running - k]
        counts[running] += 1      # record AFTER counting, or a zero-length
                                  # subarray would match itself
    return total
```

```java
public int subarraySum(int[] nums, int k) {
    Map<Integer, Integer> counts = new HashMap<>();
    counts.put(0, 1);                    // empty prefix
    int running = 0, total = 0;
    for (int x : nums) {
        running += x;
        total += counts.getOrDefault(running - k, 0);
        counts.merge(running, 1, Integer::sum);
    }
    return total;
}
```

**Two details that are the whole difficulty:**

| Detail | Why |
|---|---|
| `counts[0] = 1` | Represents the empty prefix, so a subarray starting at index 0 is counted. Without it `[3], k=3` returns 0. |
| Record *after* counting | Otherwise the current prefix matches itself when `k = 0` |

> **Why sliding window does not work here**, and the interviewer may ask: sliding
> window requires that growing the window monotonically increases the sum. With
> negative numbers it does not, so there is no valid shrink condition. Prefix
> sums plus a hash map handle negatives; sliding window does not. **State that
> distinction** — it is the reason this pattern exists alongside
> [sliding window](sliding-window.html).

---

## 4 · The difference array — the inverse

**Use when:** many range *updates*, then read the final array.

```
"Add 5 to indices 2..5" many times, then print the array.

Naive: O(range) per update.
Difference array: O(1) per update, O(n) once at the end.

diff[i] = nums[i] - nums[i-1]

To add v to [l..r]:      diff[l] += v;  diff[r+1] -= v
                                        ^ the -= is what stops the
                                          addition after r

Rebuild with a prefix sum over diff.
```

```python
def range_updates(n, updates):
    diff = [0] * (n + 1)              # n+1 so r+1 is always in range
    for l, r, v in updates:
        diff[l] += v
        diff[r + 1] -= v              # cancel beyond r

    result = []
    running = 0
    for i in range(n):
        running += diff[i]
        result.append(running)
    return result
```

**LC 1109 (Corporate Flight Bookings) and LC 370 (Range Addition) are this
verbatim.** It also underlies the sweep-line solution to
[interval](intervals.html) problems — `+1` at a start, `−1` at an end is exactly
a difference array.

---

## 5 · 2D prefix sums

For rectangle queries on a grid (LC 304).

```
P[i][j] = sum of the rectangle from (0,0) to (i-1, j-1)

Build:
  P[i+1][j+1] = grid[i][j] + P[i][j+1] + P[i+1][j] - P[i][j]
                                                     ^ added twice, remove once

Query (r1,c1) to (r2,c2) inclusive -- INCLUSION-EXCLUSION:

  P[r2+1][c2+1] - P[r1][c2+1] - P[r2+1][c1] + P[r1][c1]

      +-----------+
      |  A  |  B  |      want D
      |-----+-----|      = total - (A+B) - (A+C) + A
      |  C  |  D  |
      +-----------+      A is subtracted twice, so add it back once
```

**Both the build and the query are inclusion-exclusion**, and the `+ P[i][j]`
term is the part people drop. Draw the rectangle if you are unsure — it is
faster than re-deriving.

---

## 6 · The ladder

### Foundational

| # | Problem | Source | The point |
|---|---|---|---|
| 1 | **Running Sum of 1d Array** | LC 1480 | The build, bare |
| 2 | **Range Sum Query — Immutable** | LC 303 | Why you precompute |
| 3 | Find Pivot Index | LC 724 | Prefix and suffix together |
| 4 | **Product of Array Except Self** | LC 238 · NeetCode | Prefix × suffix, no division |

### Medium

| # | Problem | Source | The point |
|---|---|---|---|
| 5 | **Subarray Sum Equals K** | LC 560 · NeetCode | **The hash-map variant — do this one** |
| 6 | Contiguous Array | LC 525 | Map 0 → −1; equal counts become sum 0 |
| 7 | Subarray Sums Divisible by K | LC 974 | Group by prefix **modulo** k |
| 8 | Continuous Subarray Sum | LC 523 | Same modulo idea, length constraint |
| 9 | Range Sum Query 2D | LC 304 | Inclusion-exclusion |
| 10 | Corporate Flight Bookings | LC 1109 | **Difference array** |
| 11 | Range Addition | LC 370 | Same, bare |
| 12 | Maximum Size Subarray Sum Equals k | LC 325 | First-index map, not counts |

### Hard

| # | Problem | Source | The point |
|---|---|---|---|
| 13 | Count of Range Sum | LC 327 | Prefix sums + merge sort / BIT |
| 14 | Max Sum of Rectangle No Larger Than K | LC 363 | 2D reduced to 1D + ordered set |
| 15 | Number of Submatrices That Sum to Target | LC 1074 | 2D compression + LC 560 |

**If you only do four: 560, 238, 974, 1109.**

---

## 7 · Worked example — LC 974, divisible by k

**Problem:** count subarrays whose sum is divisible by `k`.

**The insight, which generalises:** `(prefix[j] − prefix[i]) % k == 0` exactly
when `prefix[j] % k == prefix[i] % k`. **So group prefixes by remainder** and
count pairs — the same shape as LC 560, with the key changed from the value to
the value mod k.

```
nums = [4,5,0,-2,-3,1], k = 5
prefix:      4, 9, 9, 7, 4, 5
prefix % 5:  4, 4, 4, 2, 4, 0

remainder 4 appears 4 times -> C(4,2) = 6 pairs
remainder 0 appears 1 time, plus the empty prefix -> C(2,2) = 1
total = 7
```

```python
def subarrays_div_by_k(nums, k):
    counts = {0: 1}                # empty prefix
    running = 0
    total = 0
    for x in nums:
        running += x
        # Python's % already returns non-negative for positive k.
        # In Java, ((running % k) + k) % k is REQUIRED -- otherwise -3 % 5
        # is -3, not 2, and the grouping silently breaks.
        r = running % k
        total += counts.get(r, 0)
        counts[r] = counts.get(r, 0) + 1
    return total
```

> **The negative-modulo difference between Python and Java is a real bug source**
> and worth mentioning aloud: Python's `%` returns a non-negative result for a
> positive divisor; Java's `%` keeps the sign of the dividend. In Java you must
> normalise with `((x % k) + k) % k`.

---

## 8 · Failure modes

| Bug | Symptom | Fix |
|---|---|---|
| No leading zero in the prefix array | Off-by-one on ranges starting at 0 | Build length `n+1` |
| Forgetting `counts[0] = 1` | Undercounts by exactly the subarrays starting at index 0 | Seed the empty prefix |
| Recording before counting | Zero-length subarrays counted when `k = 0` | Count, then record |
| Java negative modulo | Wrong groups, silently | `((x % k) + k) % k` |
| Integer overflow on prefix sums | Wraparound | `long` in Java |
| Difference array sized `n` | Index out of range at `r+1` | Size it `n+1` |
| Dropping `+ P[i][j]` in 2D | Rectangle sums too small | Inclusion-exclusion — draw it |
| Sliding window with negatives | Wrong answers | Prefix + hash map instead |

---

## 9 · Interview questions

| Question | What to say |
|---|---|
| ⭐ "Sum of a range, many times." | Build a prefix array once in O(n), then each query is `prefix[j+1] − prefix[i]` in O(1). I use length n+1 with a leading zero so there is no special case at index 0. |
| ⭐ "Count subarrays summing to k." | Prefix sums plus a hash map. A subarray ending here sums to k exactly when some earlier prefix equals `running − k`, so I count occurrences as I scan. Seed the map with `{0: 1}` for the empty prefix, and record after counting. O(n). |
| ⭐ "Why not sliding window for that?" | Sliding window needs the sum to grow monotonically as the window grows, so there is a valid shrink condition. With negative numbers there is not. Prefix sums plus a map handle negatives; sliding window only works for all-positive arrays. |
| "Divisible by k rather than equal to k?" | Group prefixes by remainder instead of value — two prefixes with the same remainder bound a subarray divisible by k. Same code, different key. In Java, normalise the modulo for negatives. |
| ⭐ "Many range updates, read once at the end." | Difference array: `diff[l] += v` and `diff[r+1] -= v`, so each update is O(1), then one prefix-sum pass rebuilds the array in O(n). It is the inverse operation to a prefix sum. |
| "Rectangle sums in a grid?" | 2D prefix sums with inclusion-exclusion, both when building and when querying — the overlapping corner gets subtracted twice and has to be added back. |
| "What if the array changes between queries?" | Prefix sums are for static arrays — an update invalidates everything after it, so rebuilding is O(n). For interleaved updates and queries, use a Fenwick tree or segment tree: O(log n) for both. |
| "Does this work for range minimum?" | No — the technique needs an invertible operation, and you cannot subtract a minimum out. That is why range-minimum queries use a sparse table or segment tree. |

---

## Stop condition

You know this pattern when you can:

1. build the `n+1` prefix array and explain the leading zero,
2. derive the hash-map variant from `prefix[i] == running − k`,
3. say why `counts[0] = 1` is required and what breaks without it,
4. explain why sliding window fails with negative numbers,
5. write the difference array and say it is the inverse operation, and
6. name the invertibility requirement that excludes range minimum.
