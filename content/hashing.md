---
title: Hashing
slug: hashing
module: linear
order: 10
status: live
level: basic → advanced
summary: The cheapest pattern to learn and the most frequently applicable — trade memory for a lookup, and an O(n²) scan becomes O(n).
---

# Hashing

> **Recognition in one line:** you are about to write a nested loop that looks
> for a *complement*, a *duplicate*, or a *count* — a hash map removes the inner
> loop.

This is the first pattern to learn because it is the cheapest to apply and shows
up inside half the other patterns. Almost every "seen this before?" question is
a hash map.

---

## 1 · Recognition cues

| Cue in the problem | What to reach for |
|---|---|
| "has this appeared before?" | `set` |
| "how many times does X appear?" | `Counter` |
| "find two elements that sum to `target`" | `dict` of value → index |
| "are these two things anagrams / rearrangements?" | `Counter` equality |
| "group things that share a property" | `defaultdict(list)`, keyed by the property |
| "longest / count of subarray with sum `k`" | **prefix sum + `dict`** |
| "first non-repeating / first duplicate" | `Counter`, then a second pass |

**The universal move:** whenever you are about to write

```python
for i in range(n):
    for j in range(i + 1, n):      # looking for something about nums[i]
```

ask *"what would I need to have already seen to answer this in one pass?"* Store
that thing in a dict as you go.

---

## 2 · The templates

```python
# 1. COMPLEMENT LOOKUP -- "two things that combine to a target"
def two_sum(nums, target):
    seen = {}                              # value -> index
    for i, x in enumerate(nums):
        if target - x in seen:             # check BEFORE inserting, or an
            return [seen[target - x], i]   # element pairs with itself
        seen[x] = i
    return []
```

```python
# 2. FREQUENCY COUNTING
from collections import Counter, defaultdict

def frequency(items):
    return Counter(items)                  # do not hand-roll this

def group_by(items, key):
    groups = defaultdict(list)             # never `if k not in d: d[k] = []`
    for x in items:
        groups[key(x)].append(x)
    return groups
```

```python
# 3. PREFIX SUM + HASH MAP -- the one people miss.
#    "subarrays summing to k", INCLUDING with negative numbers,
#    where sliding window does not work.
def subarray_sum_equals_k(nums, k):
    from collections import defaultdict
    seen = defaultdict(int)
    seen[0] = 1              # the empty prefix -- required, or you miss any
    running = 0              # subarray that starts at index 0
    count = 0
    for x in nums:
        running += x
        count += seen[running - k]   # how many earlier prefixes make sum k
        seen[running] += 1
    return count
```

**Template 3 is the highest-value thing on this page.** It handles negative
numbers, which is exactly where sliding window fails, and it converts a whole
family of O(n²) subarray problems into O(n). `seen[0] = 1` is not optional —
without it you silently miss every subarray beginning at index 0.

---

## 3 · The ladder

### Easy — build the reflex

| # | Problem | Source | The point |
|---|---|---|---|
| 1 | Two Sum | LC 1 · NeetCode | The canonical complement lookup |
| 2 | Contains Duplicate | LC 217 · NeetCode | A `set` is the whole solution |
| 3 | Valid Anagram | LC 242 · NeetCode | `Counter` equality |
| 4 | Majority Element | LC 169 | Then learn Boyer–Moore for the O(1)-space follow-up |

### Medium — where interviews live

| # | Problem | Source | The point |
|---|---|---|---|
| 5 | **Group Anagrams** | LC 49 · NeetCode | Key design: sorted string, or a 26-tuple |
| 6 | Top K Frequent Elements | LC 347 · NeetCode | Counter + heap, or bucket sort for O(n) |
| 7 | **Subarray Sum Equals K** | LC 560 | **Prefix sum + map. Learn this properly** |
| 8 | Longest Consecutive Sequence | LC 128 · NeetCode | O(n) with a set — the trick is only starting at run beginnings |
| 9 | Longest Substring Without Repeating | LC 3 | Hashing inside a sliding window |
| 10 | Contiguous Array | LC 525 | Map 0 → −1, then it is problem 7 |
| 11 | 4Sum II | LC 454 | Split into two halves, hash one side |

### Hard

| # | Problem | Source | The point |
|---|---|---|---|
| 12 | First Missing Positive | LC 41 | O(1) space — the array *is* the hash table |
| 13 | LRU Cache | LC 146 · NeetCode | `dict` + doubly linked list. A design favourite |

**If you only do four: 1, 49, 560, 128.**

---

## 4 · Worked example — LC 560, Subarray Sum Equals K

**Problem:** count the subarrays summing to exactly `k`. Numbers may be negative.

**Recognise:** "count subarrays with sum" + negatives present → **not** sliding
window. Prefix sum + hash map.

**The insight:**

```
   prefix[j] - prefix[i] == k     is the sum of the subarray (i, j]

   rearrange:   prefix[i] == prefix[j] - k

   So while scanning to j, ask: how many earlier prefixes equal prefix[j] - k?
   Store prefix counts as you go and the question is a single lookup.
```

```
   nums = [1, 2, 3, -3, 1, 1, 1],  k = 3

   idx  x   running   need=running-3   count(need)  total   map after
   -     -     0            -              -         0      {0:1}
   0     1     1           -2              0         0      {0:1, 1:1}
   1     2     3            0              1         1      {0:1,1:1,3:1}
   2     3     6            3              1         2      {...,6:1}
   3    -3     3            0              1         3      {...,3:2}
   4     1     4            1              1         4      {...,4:1}
   5     1     5            2              0         4      {...,5:1}
   6     1     6            3              2         6      {...,6:2}

   answer 6
```

```python
def subarray_sum(nums: list[int], k: int) -> int:
    from collections import defaultdict
    seen = defaultdict(int)
    seen[0] = 1          # a prefix of 0 exists before we start; without this
                         # any subarray starting at index 0 is missed
    running = 0
    total = 0

    for x in nums:
        running += x
        # Count first, THEN record. Counting after recording would let a
        # prefix pair with itself, producing empty subarrays when k == 0.
        total += seen[running - k]
        seen[running] += 1

    return total
```

**Complexity:** O(n) time, O(n) space.

**Say this in an interview:** *"Sliding window does not apply because negatives
mean shrinking the window does not monotonically reduce the sum. Prefix sums plus
a hash map handles it in one pass."* Naming *why* the obvious pattern fails is a
strong signal.

---

## 5 · Worked example — LC 128, Longest Consecutive Sequence

**Problem:** longest run of consecutive integers, in O(n). Sorting is O(n log n)
and explicitly disallowed by the follow-up.

**The insight:** put everything in a set, then **only start counting from a
number that begins a run** — one with no predecessor in the set.

```
   nums = [100, 4, 200, 1, 3, 2]
   set  = {1, 2, 3, 4, 100, 200}

   100 -> is 99 present? no  -> START. count 100,101? no. length 1
     4 -> is 3 present? YES -> skip. 4 is mid-run, not a start
   200 -> is 199 present? no -> START. length 1
     1 -> is 0 present? no   -> START. count 1,2,3,4 -> length 4  <- best
     3 -> is 2 present? YES  -> skip
     2 -> is 1 present? YES  -> skip

   answer 4
```

```python
def longest_consecutive(nums: list[int]) -> int:
    values = set(nums)
    best = 0

    for x in values:
        # The guard that makes this O(n): only run the inner loop from the
        # START of a sequence. Every value is therefore visited by the inner
        # loop at most once across the whole function, not once per value.
        if x - 1 in values:
            continue

        length = 1
        while x + length in values:
            length += 1
        best = max(best, length)

    return best
```

**Complexity:** O(n) time, despite the nested loop. This is the follow-up
question — be ready for it.

> *"The inner `while` only runs for values that start a sequence, and it walks
> each sequence exactly once. So across the whole function the inner loop does
> O(n) total work, not O(n) per element."*

---

## 6 · Worked example — LC 49, Group Anagrams

**Problem:** group words that are anagrams of one another.

**The whole problem is key design.** Two options, and the trade is worth
articulating:

```
   key = "".join(sorted(word))       O(k log k) per word, simple, readable
   key = tuple(count of 26 letters)  O(k) per word, faster for long words
```

```python
def group_anagrams(words: list[str]) -> list[list[str]]:
    from collections import defaultdict
    groups = defaultdict(list)

    for word in words:
        # A 26-tuple is O(k) rather than O(k log k), and it must be a tuple
        # because lists are unhashable. For ASCII lowercase this is strictly
        # better than sorting; for unicode, sorting is the simpler correct call.
        counts = [0] * 26
        for ch in word:
            counts[ord(ch) - ord("a")] += 1
        groups[tuple(counts)].append(word)

    return list(groups.values())
```

**Complexity:** O(n · k) where k is the average word length.

---

## 7 · Same problem in disguise

| Problem | Really is |
|---|---|
| Contiguous Array (LC 525) | Subarray Sum Equals K, after mapping 0 → −1 and k = 0 |
| Subarray Sums Divisible by K (LC 974) | Same, keyed on `running % k` |
| Continuous Subarray Sum (LC 523) | Same, keyed on the remainder |
| Two Sum (LC 1) | Complement lookup |
| 4Sum II (LC 454) | Complement lookup, over pair sums of two halves |
| Isomorphic Strings (LC 205) | Two dicts enforcing a bijection |
| Word Pattern (LC 290) | Isomorphic Strings with words instead of characters |

**Three named problems are one solution keyed differently.** Recognising that
LC 525 becomes LC 560 with a single substitution is worth more than solving both
independently.

---

## 8 · Failure modes

| Bug | Symptom | Fix |
|---|---|---|
| Inserting before checking in Two Sum | An element pairs with itself | Check the complement first, then insert |
| Forgetting `seen[0] = 1` | Subarrays starting at index 0 missed | Seed the empty prefix |
| Recording before counting in LC 560 | Off-by-one when k = 0 | Count first, then record |
| Using a `list` as a dict key | `TypeError: unhashable` | `tuple(...)` |
| Missing the start-of-run guard in LC 128 | O(n²), times out | `if x - 1 in values: continue` |
| Mutating a dict while iterating it | `RuntimeError` | Iterate over `list(d.items())` |
| `dict` where `defaultdict` was wanted | `KeyError` and noisy code | `defaultdict(int)` / `(list)` |

---

## 9 · Interview questions on this pattern

| Question | What to say |
|---|---|
| "Two Sum, but the array is sorted." | Two pointers instead — O(1) space rather than O(n). Recognising that the sorted version has a better answer is the point of the question. |
| "Why is LC 128 O(n) with a nested loop?" | The inner loop only runs from sequence starts, and walks each sequence once. Total inner work is O(n) across the whole function. |
| "Majority element in O(1) space?" | Boyer–Moore voting. Keep a candidate and a counter; increment on a match, decrement otherwise, reset the candidate at zero. |
| "Why not sliding window for LC 560?" | Negative numbers. Shrinking no longer monotonically reduces the sum, so the window invariant breaks. Prefix sum plus a map instead. |
| "What is the cost of hashing worst case?" | O(n) per operation under adversarial collisions. Python randomises string hashing per process, so it is not attackable in practice, but the honest answer is amortised O(1), not guaranteed. |
| "Design an LRU cache." | `dict` for O(1) lookup plus a doubly linked list for O(1) recency reordering. `OrderedDict` gives both, but be ready to hand-roll the list. |

---

## Stop condition

You are done with this pattern when you can:

1. write the prefix-sum-plus-map template from memory,
2. explain why `seen[0] = 1` is required,
3. say when hashing beats sorting and when it does not,
4. derive LC 525 from LC 560 out loud, and
5. give the honest worst-case complexity of a hash map.
