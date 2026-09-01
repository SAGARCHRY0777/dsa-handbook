---
title: Solutions — arrays & hashing
slug: solutions-arrays
module: solutions
order: 60
status: live
level: worst → best
summary: Five core problems solved from brute force to optimal, in Python and Java, with what to say at each step.
---

# Solutions — arrays & hashing

Each problem here goes **worst to best**: the brute force first, then each
improvement, with the complexity at every stage and the sentence that justifies
moving on.

> **Why start with the brute force in an interview?** Because it is scored.
> Stating an O(n²) approach and its cost takes twenty seconds, proves you
> understood the problem, and gives you a baseline to improve on. Candidates who
> jump straight to the optimal solution and get stuck have nothing to show.

---

## LC 1 · Two Sum

Return indices of the two numbers summing to `target`.

### Approach 1 — brute force · O(n²) time, O(1) space

Check every pair.

```python
def two_sum(nums, target):
    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):
            if nums[i] + nums[j] == target:
                return [i, j]
    return []
```

```java
public int[] twoSum(int[] nums, int target) {
    for (int i = 0; i < nums.length; i++) {
        for (int j = i + 1; j < nums.length; j++) {
            if (nums[i] + nums[j] == target) {
                return new int[]{i, j};
            }
        }
    }
    return new int[]{};
}
```

> *"That is O(n²). The repeated work is that for every `i` I rescan the whole
> array looking for `target − nums[i]`. If I remembered what I had already seen,
> that lookup would be O(1)."*

### Approach 2 — sort then two pointers · O(n log n) time, O(n) space

Worth mentioning, and worth rejecting: sorting destroys the original indices, so
you must keep pairs of `(value, index)`. More work than the hash map for no gain.

### Approach 3 — hash map · O(n) time, O(n) space ✅

One pass, storing each value as you go.

```python
def two_sum(nums, target):
    seen = {}                                # value -> index
    for i, x in enumerate(nums):
        if target - x in seen:               # check BEFORE inserting, so an
            return [seen[target - x], i]     # element cannot pair with itself
        seen[x] = i
    return []
```

```java
public int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> seen = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        int need = target - nums[i];
        // Check before putting: otherwise nums[i] could match itself.
        if (seen.containsKey(need)) {
            return new int[]{seen.get(need), i};
        }
        seen.put(nums[i], i);
    }
    return new int[]{};
}
```

**The trade:** O(n) time bought with O(n) space. Say that explicitly — naming
the trade is the point of the question.

---

## LC 121 · Best Time to Buy and Sell Stock

Maximum profit from one buy and one later sell.

### Approach 1 — brute force · O(n²) time, O(1) space

```python
def max_profit(prices):
    best = 0
    for i in range(len(prices)):
        for j in range(i + 1, len(prices)):
            best = max(best, prices[j] - prices[i])
    return best
```

```java
public int maxProfit(int[] prices) {
    int best = 0;
    for (int i = 0; i < prices.length; i++) {
        for (int j = i + 1; j < prices.length; j++) {
            best = Math.max(best, prices[j] - prices[i]);
        }
    }
    return best;
}
```

### Approach 2 — one pass · O(n) time, O(1) space ✅

The insight: at each day, the best sale today uses the **cheapest price so far**.
You never need to look backwards.

```python
def max_profit(prices):
    cheapest = float("inf")
    best = 0
    for price in prices:
        cheapest = min(cheapest, price)      # best buy up to today
        best = max(best, price - cheapest)   # best sale if we sell today
    return best
```

```java
public int maxProfit(int[] prices) {
    int cheapest = Integer.MAX_VALUE;
    int best = 0;
    for (int price : prices) {
        cheapest = Math.min(cheapest, price);
        best = Math.max(best, price - cheapest);
    }
    return best;
}
```

> *"Instead of comparing every pair, I carry the minimum seen so far. The best
> profit ending today is today's price minus that minimum, so one pass
> suffices."*

---

## LC 49 · Group Anagrams

Group words that are rearrangements of each other.

### Approach 1 — pairwise comparison · O(n² · k log k)

Compare every word to every group's representative. Too slow, but state it.

### Approach 2 — sorted string as key · O(n · k log k) time

```python
from collections import defaultdict

def group_anagrams(words):
    groups = defaultdict(list)
    for word in words:
        groups["".join(sorted(word))].append(word)
    return list(groups.values())
```

```java
public List<List<String>> groupAnagrams(String[] words) {
    Map<String, List<String>> groups = new HashMap<>();
    for (String word : words) {
        char[] chars = word.toCharArray();
        Arrays.sort(chars);
        String key = new String(chars);
        groups.computeIfAbsent(key, k -> new ArrayList<>()).add(word);
    }
    return new ArrayList<>(groups.values());
}
```

### Approach 3 — character counts as key · O(n · k) time ✅

Removes the `log k` by counting instead of sorting.

```python
from collections import defaultdict

def group_anagrams(words):
    groups = defaultdict(list)
    for word in words:
        counts = [0] * 26
        for ch in word:
            counts[ord(ch) - ord("a")] += 1
        # Must be a tuple: lists are unhashable in Python.
        groups[tuple(counts)].append(word)
    return list(groups.values())
```

```java
public List<List<String>> groupAnagrams(String[] words) {
    Map<String, List<String>> groups = new HashMap<>();
    for (String word : words) {
        int[] counts = new int[26];
        for (char ch : word.toCharArray()) {
            counts[ch - 'a']++;
        }
        // Java arrays hash by identity, not contents -- so build a string key.
        StringBuilder key = new StringBuilder();
        for (int c : counts) {
            key.append('#').append(c);
        }
        groups.computeIfAbsent(key.toString(), k -> new ArrayList<>()).add(word);
    }
    return new ArrayList<>(groups.values());
}
```

> **The Java detail worth knowing:** `int[]` uses identity hashing, so two arrays
> with identical contents are different keys. Python tuples hash by value and
> work directly. Mentioning that difference is a genuine mark of knowing both
> languages rather than transliterating one.

---

## LC 560 · Subarray Sum Equals K

Count subarrays summing to `k`. Values may be negative.

### Approach 1 — brute force · O(n³) time

Every subarray, summed from scratch.

```python
def subarray_sum(nums, k):
    count = 0
    for i in range(len(nums)):
        for j in range(i, len(nums)):
            if sum(nums[i : j + 1]) == k:      # the O(n) that makes it cubic
                count += 1
    return count
```

### Approach 2 — running sum · O(n²) time, O(1) space

Drop the inner `sum` by accumulating.

```python
def subarray_sum(nums, k):
    count = 0
    for i in range(len(nums)):
        total = 0
        for j in range(i, len(nums)):
            total += nums[j]
            if total == k:
                count += 1
    return count
```

```java
public int subarraySum(int[] nums, int k) {
    int count = 0;
    for (int i = 0; i < nums.length; i++) {
        int total = 0;
        for (int j = i; j < nums.length; j++) {
            total += nums[j];
            if (total == k) count++;
        }
    }
    return count;
}
```

### Approach 3 — prefix sum + hash map · O(n) time, O(n) space ✅

`prefix[j] − prefix[i] == k` rearranges to `prefix[i] == prefix[j] − k`, so the
question becomes a lookup.

```python
from collections import defaultdict

def subarray_sum(nums, k):
    seen = defaultdict(int)
    seen[0] = 1              # the empty prefix; without it, subarrays starting
    running = 0              # at index 0 are missed entirely
    count = 0
    for x in nums:
        running += x
        count += seen[running - k]   # count BEFORE recording, or a prefix
        seen[running] += 1           # pairs with itself when k == 0
    return count
```

```java
public int subarraySum(int[] nums, int k) {
    Map<Integer, Integer> seen = new HashMap<>();
    seen.put(0, 1);                       // the empty prefix
    int running = 0, count = 0;
    for (int x : nums) {
        running += x;
        count += seen.getOrDefault(running - k, 0);
        seen.merge(running, 1, Integer::sum);
    }
    return count;
}
```

> *"Sliding window will not work here because the values can be negative —
> shrinking the window does not monotonically reduce the sum, so the invariant
> breaks. Prefix sums with a hash map handle it in one pass."*

**Naming why the obvious pattern fails is worth more than the solution itself.**

---

## LC 128 · Longest Consecutive Sequence

Longest run of consecutive integers, in O(n).

### Approach 1 — sort · O(n log n) time ✅ but rejected by the follow-up

```python
def longest_consecutive(nums):
    if not nums:
        return 0
    nums = sorted(set(nums))
    best = run = 1
    for i in range(1, len(nums)):
        if nums[i] == nums[i - 1] + 1:
            run += 1
            best = max(best, run)
        else:
            run = 1
    return best
```

### Approach 2 — set, starting only at run beginnings · O(n) ✅

```python
def longest_consecutive(nums):
    values = set(nums)
    best = 0
    for x in values:
        if x - 1 in values:
            continue                   # not the start of a run -- skip it
        length = 1
        while x + length in values:
            length += 1
        best = max(best, length)
    return best
```

```java
public int longestConsecutive(int[] nums) {
    Set<Integer> values = new HashSet<>();
    for (int x : nums) values.add(x);

    int best = 0;
    for (int x : values) {
        // The guard that makes this O(n): only walk from the START of a run,
        // so the inner loop visits each value at most once overall.
        if (values.contains(x - 1)) continue;
        int length = 1;
        while (values.contains(x + length)) length++;
        best = Math.max(best, length);
    }
    return best;
}
```

> *"It looks quadratic, but the inner loop only runs from the start of a
> sequence and walks that sequence once. Across the whole function the inner
> work is O(n) total, not O(n) per element."*

**That sentence is the follow-up question.** Be ready to say it unprompted.

---

## Python and Java, side by side

The differences that actually bite when switching:

| Task | Python | Java |
|---|---|---|
| Hash map | `{}` / `defaultdict(int)` | `HashMap<>()`, `getOrDefault`, `merge` |
| Counting | `Counter(items)` | `map.merge(k, 1, Integer::sum)` |
| Group into lists | `defaultdict(list)` | `map.computeIfAbsent(k, x -> new ArrayList<>())` |
| Array as a key | `tuple(...)` — hashes by value | **Does not work** — build a `String` key |
| Sort a string | `"".join(sorted(s))` | `char[] c = s.toCharArray(); Arrays.sort(c);` |
| Infinity | `float("inf")` | `Integer.MAX_VALUE` (watch overflow) |
| Integer division | `//` | `/` on ints, already floor for positives |
| Ceiling division | `-(-a // b)` | `(a + b - 1) / b` |

**The two that cause real bugs:** Java arrays as hash keys (identity, not value),
and `Integer.MAX_VALUE` overflowing when you add to it. In Python neither exists
— integers are arbitrary precision and tuples hash by value.
