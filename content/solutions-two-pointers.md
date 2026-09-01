---
title: Solutions — two pointers & sliding window
slug: solutions-two-pointers
module: solutions
order: 61
status: live
level: worst → best
summary: Five core problems from brute force to optimal, in Python and Java, with the argument that justifies each improvement.
---

# Solutions — two pointers & sliding window

Same format: worst first, each improvement justified, both languages.

---

## LC 3 · Longest Substring Without Repeating Characters

### Approach 1 — brute force · O(n³) time

Every substring, checked for duplicates.

```python
def length_of_longest_substring(s):
    best = 0
    for i in range(len(s)):
        for j in range(i, len(s)):
            window = s[i : j + 1]
            if len(set(window)) == len(window):     # O(n) uniqueness check
                best = max(best, len(window))
    return best
```

### Approach 2 — expand with a set · O(n²) time

Drop one factor by growing the window and stopping at the first repeat.

```python
def length_of_longest_substring(s):
    best = 0
    for i in range(len(s)):
        seen = set()
        for j in range(i, len(s)):
            if s[j] in seen:
                break
            seen.add(s[j])
            best = max(best, j - i + 1)
    return best
```

### Approach 3 — sliding window with a set · O(n) time, O(k) space ✅

```python
def length_of_longest_substring(s):
    seen = set()
    left = 0
    best = 0
    for right, ch in enumerate(s):
        while ch in seen:                # shrink until valid again
            seen.remove(s[left])
            left += 1
        seen.add(ch)
        best = max(best, right - left + 1)
    return best
```

### Approach 4 — last-seen index, jumping · O(n) time, fewer operations ✅✅

Same complexity, but `left` jumps instead of stepping.

```python
def length_of_longest_substring(s):
    last_seen = {}                       # char -> most recent index
    left = 0
    best = 0
    for right, ch in enumerate(s):
        # The `>= left` guard matters: an occurrence BEFORE left is already
        # outside the window and must not drag it backwards.
        if ch in last_seen and last_seen[ch] >= left:
            left = last_seen[ch] + 1
        last_seen[ch] = right
        best = max(best, right - left + 1)
    return best
```

```java
public int lengthOfLongestSubstring(String s) {
    Map<Character, Integer> lastSeen = new HashMap<>();
    int left = 0, best = 0;
    for (int right = 0; right < s.length(); right++) {
        char ch = s.charAt(right);
        // Only jump forward -- an older occurrence is already excluded.
        if (lastSeen.containsKey(ch) && lastSeen.get(ch) >= left) {
            left = lastSeen.get(ch) + 1;
        }
        lastSeen.put(ch, right);
        best = Math.max(best, right - left + 1);
    }
    return best;
}
```

> *"Both pointers only move forward, so each index enters and leaves the window
> at most once — O(n) despite the nested loop shape."*

---

## LC 15 · 3Sum

### Approach 1 — brute force · O(n³) time

Three nested loops, then deduplicate the results.

```python
def three_sum(nums):
    out = set()
    n = len(nums)
    for i in range(n):
        for j in range(i + 1, n):
            for k in range(j + 1, n):
                if nums[i] + nums[j] + nums[k] == 0:
                    out.add(tuple(sorted((nums[i], nums[j], nums[k]))))
    return [list(t) for t in out]
```

### Approach 2 — fix one, hash the rest · O(n²) time, O(n) space

Better, but deduplication is manual and awkward.

### Approach 3 — sort, then converge · O(n²) time, O(1) extra space ✅

```python
def three_sum(nums):
    nums.sort()
    out = []
    n = len(nums)

    for i in range(n - 2):
        if nums[i] > 0:                          # sorted: no triple of
            break                                # positives sums to zero
        if i > 0 and nums[i] == nums[i - 1]:
            continue                             # dedupe the ANCHOR

        left, right = i + 1, n - 1
        while left < right:
            total = nums[i] + nums[left] + nums[right]
            if total < 0:
                left += 1
            elif total > 0:
                right -= 1
            else:
                out.append([nums[i], nums[left], nums[right]])
                left += 1
                while left < right and nums[left] == nums[left - 1]:
                    left += 1                    # dedupe the SECOND element
    return out
```

```java
public List<List<Integer>> threeSum(int[] nums) {
    Arrays.sort(nums);
    List<List<Integer>> out = new ArrayList<>();

    for (int i = 0; i < nums.length - 2; i++) {
        if (nums[i] > 0) break;
        if (i > 0 && nums[i] == nums[i - 1]) continue;   // dedupe anchor

        int left = i + 1, right = nums.length - 1;
        while (left < right) {
            int total = nums[i] + nums[left] + nums[right];
            if (total < 0) {
                left++;
            } else if (total > 0) {
                right--;
            } else {
                out.add(Arrays.asList(nums[i], nums[left], nums[right]));
                left++;
                // Both dedupe steps are required: anchor and second element.
                while (left < right && nums[left] == nums[left - 1]) left++;
            }
        }
    }
    return out;
}
```

> *"Sorting costs O(n log n) but buys two things: the converging scan, and
> deduplication for free. Without it I would need a set and manual dedup."*

---

## LC 11 · Container With Most Water

### Approach 1 — brute force · O(n²) time

```python
def max_area(height):
    best = 0
    for i in range(len(height)):
        for j in range(i + 1, len(height)):
            best = max(best, (j - i) * min(height[i], height[j]))
    return best
```

### Approach 2 — converging pointers · O(n) time, O(1) space ✅

```python
def max_area(height):
    left, right = 0, len(height) - 1
    best = 0
    while left < right:
        best = max(best, (right - left) * min(height[left], height[right]))
        # Move the SHORTER side. Moving the taller one shrinks the width while
        # the height stays capped by the unchanged shorter side, so the area
        # cannot improve -- discarding that move is provably lossless.
        if height[left] < height[right]:
            left += 1
        else:
            right -= 1
    return best
```

```java
public int maxArea(int[] height) {
    int left = 0, right = height.length - 1, best = 0;
    while (left < right) {
        best = Math.max(best, (right - left) * Math.min(height[left], height[right]));
        if (height[left] < height[right]) left++;
        else right--;
    }
    return best;
}
```

**The greedy argument is the answer, not the code.** Be able to state why moving
the taller side can never help.

---

## LC 42 · Trapping Rain Water

Four approaches, and the progression is the point.

### Approach 1 — per column, scan both ways · O(n²) time

```python
def trap(height):
    total = 0
    for i in range(len(height)):
        left_max = max(height[: i + 1], default=0)
        right_max = max(height[i:], default=0)
        total += min(left_max, right_max) - height[i]
    return total
```

### Approach 2 — precompute both maxima · O(n) time, O(n) space

```python
def trap(height):
    if not height:
        return 0
    n = len(height)
    left_max, right_max = [0] * n, [0] * n

    left_max[0] = height[0]
    for i in range(1, n):
        left_max[i] = max(left_max[i - 1], height[i])

    right_max[-1] = height[-1]
    for i in range(n - 2, -1, -1):
        right_max[i] = max(right_max[i + 1], height[i])

    return sum(min(left_max[i], right_max[i]) - height[i] for i in range(n))
```

### Approach 3 — two pointers · O(n) time, **O(1) space** ✅

```python
def trap(height):
    if not height:
        return 0
    left, right = 0, len(height) - 1
    max_left = max_right = 0
    water = 0

    while left < right:
        # Work on the side with the SMALLER running maximum: that side's max
        # is guaranteed to be the binding constraint, because the other side
        # already has something at least as tall.
        if max_left < max_right:
            max_left = max(max_left, height[left])
            water += max_left - height[left]
            left += 1
        else:
            max_right = max(max_right, height[right])
            water += max_right - height[right]
            right -= 1
    return water
```

```java
public int trap(int[] height) {
    if (height.length == 0) return 0;
    int left = 0, right = height.length - 1;
    int maxLeft = 0, maxRight = 0, water = 0;

    while (left < right) {
        if (maxLeft < maxRight) {
            maxLeft = Math.max(maxLeft, height[left]);
            water += maxLeft - height[left];
            left++;
        } else {
            maxRight = Math.max(maxRight, height[right]);
            water += maxRight - height[right];
            right--;
        }
    }
    return water;
}
```

**The O(1) space is the whole reason this is the good answer.** Say the
difference from approach 2 out loud.

---

## LC 76 · Minimum Window Substring

### Approach 1 — every substring · O(n² · k) time

Check all `n²` substrings for containing `t`. State it, then move on.

### Approach 2 — sliding window · O(|s| + |t|) time ✅

```python
from collections import Counter

def min_window(s, t):
    if not s or not t or len(s) < len(t):
        return ""

    need = Counter(t)
    missing = len(t)                  # characters still required, with multiplicity
    left = 0
    best = (float("inf"), 0, 0)

    for right, ch in enumerate(s):
        # Only decrement when this character was still NEEDED. A surplus copy
        # drives need[ch] negative and correctly does not count.
        if need[ch] > 0:
            missing -= 1
        need[ch] -= 1

        while missing == 0:                        # valid -- shrink to tighten
            if right - left + 1 < best[0]:
                best = (right - left + 1, left, right)
            need[s[left]] += 1
            if need[s[left]] > 0:                  # we just broke validity
                missing += 1
            left += 1

    return "" if best[0] == float("inf") else s[best[1] : best[2] + 1]
```

```java
public String minWindow(String s, String t) {
    if (s.length() < t.length() || t.isEmpty()) return "";

    int[] need = new int[128];                     // ASCII, faster than a map
    for (char c : t.toCharArray()) need[c]++;

    int missing = t.length(), left = 0;
    int bestLen = Integer.MAX_VALUE, bestStart = 0;

    for (int right = 0; right < s.length(); right++) {
        if (need[s.charAt(right)] > 0) missing--;
        need[s.charAt(right)]--;

        while (missing == 0) {
            if (right - left + 1 < bestLen) {
                bestLen = right - left + 1;
                bestStart = left;
            }
            need[s.charAt(left)]++;
            if (need[s.charAt(left)] > 0) missing++;
            left++;
        }
    }
    return bestLen == Integer.MAX_VALUE ? "" : s.substring(bestStart, bestStart + bestLen);
}
```

> **The Java version uses `int[128]` rather than a `HashMap`.** For a bounded
> character set that is faster and simpler, and mentioning the choice is a small
> signal of practical judgement.

---

## The progression, as an interview script

The shape that works for any of these:

```
   1. "The brute force is <approach>, which is O(n²) because <reason>."
   2. "The repeated work is <observation>."
   3. "I can avoid it with <structure>, which gives O(n)."
   4. ... code, narrating each block ...
   5. "Let me trace <small example>."
   6. "Time O(n), space O(k). The trade is <what you bought with what>."
```

**Step 2 is the one that matters.** Naming the repeated work is what turns a
memorised optimisation into a derived one, and it is the difference an
interviewer is listening for.
