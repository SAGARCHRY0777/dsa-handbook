---
title: Sliding window
slug: sliding-window
module: linear
order: 12
status: live
level: basic → advanced
summary: The highest-frequency pattern in interviews — recognition cues, one template, a twelve-problem ladder, and three worked solutions.
---

# Sliding window

> **Recognition in one line:** the problem asks for the **longest or shortest
> contiguous** subarray or substring satisfying some condition.

Contiguous is the load-bearing word. If the elements need not be adjacent, this
is not a sliding window — it is probably hashing, sorting or DP.

---

## 1 · Recognition cues

Phrases in the statement that mean *sliding window*:

| Cue in the problem | Variant |
|---|---|
| "longest substring **such that** …" | Variable, shrink while invalid |
| "shortest subarray **with at least** …" | Variable, shrink while **valid** |
| "**subarray of size k**" | Fixed |
| "**at most k** distinct / replacements / zeros" | Variable, shrink while > k |
| "maximum sum of **k consecutive**" | Fixed |
| "**contiguous**" appearing anywhere | Strong signal |

**Anti-cues — these mean it is *not* a sliding window:**

- "subsequence" (not contiguous) → DP or greedy
- negative numbers with a sum condition → prefix sum + hash map, because
  shrinking no longer monotonically reduces the sum
- "any two elements" → two pointers on a *sorted* array, or hashing

> **The negative-numbers trap is the one that catches people.** Sliding window
> relies on the invariant that removing an element from the left makes the
> window "smaller" in the relevant sense. With negative numbers, removing an
> element can *increase* the sum, so the invariant breaks and the window never
> converges. If you see negatives plus a sum target, reach for prefix sums.

---

## 2 · The template

Two variants. Learn both; they differ by one line.

```python
# VARIABLE-SIZE WINDOW -- the common case.
# "longest / shortest ... such that <condition>"
def variable_window(s):
    from collections import defaultdict
    count = defaultdict(int)
    left = 0
    best = 0

    for right, ch in enumerate(s):
        count[ch] += 1                      # 1. expand: always add s[right]

        while INVALID(count):               # 2. shrink while the window is bad
            count[s[left]] -= 1
            if count[s[left]] == 0:
                del count[s[left]]          # keep len(count) meaningful
            left += 1

        best = max(best, right - left + 1)  # 3. record AFTER restoring validity

    return best
```

```python
# FIXED-SIZE WINDOW -- "of size k", "k consecutive"
def fixed_window(nums, k):
    window = sum(nums[:k])
    best = window
    for right in range(k, len(nums)):
        window += nums[right] - nums[right - k]   # add one, drop one
        best = max(best, window)
    return best
```

**Three details that cause most bugs:**

1. **`best` is recorded after the shrink loop**, not inside it. Inside, the
   window may still be invalid.
2. **Delete zero-count keys.** If you use `len(count)` as "number of distinct
   characters", a key sitting at zero silently breaks it.
3. **For "shortest", the shrink loop condition inverts** — you shrink *while
   valid*, recording the minimum each time, because you want the tightest
   window that still satisfies the condition.

---

## 3 · The ladder

Attempt in this order. Time box 25 minutes each.

### Easy — learn the template

| # | Problem | Source | The point |
|---|---|---|---|
| 1 | Maximum Average Subarray I | LC 643 | Fixed window, nothing else |
| 2 | Contains Duplicate II | LC 219 | Window as a set, fixed size |

### Medium — the variations that get asked

| # | Problem | Source | The point |
|---|---|---|---|
| 3 | **Longest Substring Without Repeating Characters** | LC 3 · NeetCode | **The canonical one. Know it cold** |
| 4 | Longest Repeating Character Replacement | LC 424 · NeetCode | Validity uses `len - maxfreq`, a real insight |
| 5 | Permutation in String | LC 567 · NeetCode | Fixed window + frequency match |
| 6 | Minimum Size Subarray Sum | LC 209 | "Shortest" — the inverted shrink |
| 7 | Fruit Into Baskets | LC 904 | "At most 2 distinct" in disguise |
| 8 | Max Consecutive Ones III | LC 1004 | "At most k zeros" — same shape as 424 |
| 9 | Longest Substring with At Most K Distinct | LC 340 | The generalisation of 3 and 7 |
| 10 | Subarrays with K Different Integers | LC 992 | **exactly(k) = atMost(k) − atMost(k−1)** |

### Hard — only after the mediums are routine

| # | Problem | Source | The point |
|---|---|---|---|
| 11 | **Minimum Window Substring** | LC 76 · NeetCode | The hard one everyone is asked eventually |
| 12 | Sliding Window Maximum | LC 239 · NeetCode | Window + **monotonic deque** |

**If you only do four: 3, 424, 209, 76.** Those cover expand-shrink, a non-obvious
validity function, the inverted shrink, and the hard case.

---

## 4 · Worked example — LC 3, Longest Substring Without Repeating

**Problem:** given a string, return the length of the longest substring with no
repeated characters.

**Recognise:** "longest" + "substring" (contiguous) + a condition → variable
window, shrink while invalid.

```
   s = "a b c a b c b b"
        0 1 2 3 4 5 6 7

   R=0  window "a"      valid    best=1
   R=1  window "ab"     valid    best=2
   R=2  window "abc"    valid    best=3
   R=3  add 'a' -> "abca"  INVALID ('a' twice)
        shrink: drop s[0]='a'  -> L=1, window "bca"  valid   best=3
   R=4  add 'b' -> "bcab"  INVALID
        shrink: drop s[1]='b'  -> L=2, window "cab"  valid   best=3
   R=5  add 'c' -> "cabc"  INVALID
        shrink: drop s[2]='c'  -> L=3, window "abc"  valid   best=3
   R=6  add 'b' -> "abcb"  INVALID
        shrink: drop s[3]='a'  -> L=4, "bcb" still INVALID
        shrink: drop s[4]='b'  -> L=5, "cb"  valid   best=3
   R=7  add 'b' -> "cbb"   INVALID
        shrink: drop s[5]='c'  -> L=6, "bb" still INVALID
        shrink: drop s[6]='b'  -> L=7, "b"   valid   best=3

   answer 3
```

```python
def length_of_longest_substring(s: str) -> int:
    last_seen = {}          # char -> most recent index
    left = 0
    best = 0

    for right, ch in enumerate(s):
        # The jump: if we have seen this char INSIDE the current window,
        # move left past its previous position in one step. The `>= left`
        # guard matters -- an occurrence before `left` is already excluded
        # and must not drag the window backwards.
        if ch in last_seen and last_seen[ch] >= left:
            left = last_seen[ch] + 1

        last_seen[ch] = right
        best = max(best, right - left + 1)

    return best
```

**Complexity:** O(n) time — each index is visited once by `right` and `left`
never moves backwards. O(min(n, alphabet)) space.

**Say this out loud in an interview:** *"Left and right each move only forward,
so each index enters and leaves the window at most once — that gives O(n) even
though there is a nested loop shape."* That sentence is what the interviewer is
waiting for.

---

## 5 · Worked example — LC 424, Longest Repeating Character Replacement

**Problem:** you may replace at most `k` characters. Return the longest
substring of a single repeated character achievable.

**The insight**, and it is the whole problem: a window is valid when

```
   window_length − count_of_most_frequent_char  ≤  k
```

because everything that is not the majority character must be replaced.

```
   s = "A A B A B B A",  k = 1

   L R  window     maxfreq  len - maxfreq   valid?
   0 0  "A"           1        0            yes   best=1
   0 1  "AA"          2        0            yes   best=2
   0 2  "AAB"         2        1            yes   best=3
   0 3  "AABA"        3        1            yes   best=4
   0 4  "AABAB"       3        2  > k       NO  -> shrink
   1 4  "ABAB"        2        2  > k       NO  -> shrink
   2 4  "BAB"         2        1            yes   best=4
```

```python
def character_replacement(s: str, k: int) -> int:
    from collections import defaultdict
    count = defaultdict(int)
    left = 0
    max_freq = 0
    best = 0

    for right, ch in enumerate(s):
        count[ch] += 1
        max_freq = max(max_freq, count[ch])

        # Note max_freq is never decreased when shrinking. That looks like a
        # bug and is not: a smaller max_freq could only produce a SHORTER
        # window, and we only care about the longest. Keeping the historical
        # maximum keeps this O(n) instead of O(26n).
        if (right - left + 1) - max_freq > k:
            count[s[left]] -= 1
            left += 1

        best = max(best, right - left + 1)

    return best
```

**The `max_freq` subtlety is a favourite follow-up question.** Being able to
explain why not decrementing it is correct — rather than just knowing the code —
is exactly the kind of thing that separates a memorised solution from an
understood one.

---

## 6 · Worked example — LC 76, Minimum Window Substring

The hard one. Same template, inverted shrink.

**Problem:** find the shortest substring of `s` containing all characters of `t`
including duplicates.

```
   s = "A D O B E C O D E B A N C",  t = "ABC"

   expand until the window CONTAINS all of t:
     "ADOBEC"                    valid, length 6   -> best
   now shrink from the left WHILE still valid:
     "DOBEC"                     invalid (lost A)  -> stop, expand again
   ...
     "CODEBANC"                  valid, length 8
     shrink -> "ODEBANC" invalid -> stop
   ...
   eventually "BANC" -- valid, length 4            -> best

   answer "BANC"
```

```python
def min_window(s: str, t: str) -> str:
    from collections import Counter
    if not s or not t or len(s) < len(t):
        return ""

    need = Counter(t)
    missing = len(t)            # total characters still required, with multiplicity
    left = 0
    best = (float("inf"), 0, 0)

    for right, ch in enumerate(s):
        # Only decrement `missing` when this character was actually still
        # needed. A surplus copy pushes need[ch] negative and correctly does
        # not count toward completion.
        if need[ch] > 0:
            missing -= 1
        need[ch] -= 1

        while missing == 0:                     # valid -- shrink to tighten
            if right - left + 1 < best[0]:
                best = (right - left + 1, left, right)
            need[s[left]] += 1
            if need[s[left]] > 0:               # we just broke validity
                missing += 1
            left += 1

    return "" if best[0] == float("inf") else s[best[1] : best[2] + 1]
```

**Complexity:** O(|s| + |t|). Each pointer traverses `s` once.

---

## 7 · Same problem in disguise

This mapping is the point of practising by pattern. Six of these are one problem.

| Problem | Really is |
|---|---|
| Longest substring with at most 2 distinct (LC 159) | at-most-k with k=2 |
| Fruit Into Baskets (LC 904) | at-most-k with k=2, in a story |
| Longest substring with at most K distinct (LC 340) | the general form |
| Max Consecutive Ones III (LC 1004) | at-most-k, where "distinct" is "zeros" |
| Longest Repeating Char Replacement (LC 424) | at-most-k, where cost is `len − maxfreq` |
| Subarrays with K Different (LC 992) | `atMost(k) − atMost(k−1)` |

**Write the `at_most_k` helper once and four of these become three lines each.**
Recognising that is worth more than solving all six independently.

```python
def at_most_k_distinct(nums, k):
    from collections import defaultdict
    count, left, total = defaultdict(int), 0, 0
    for right, x in enumerate(nums):
        count[x] += 1
        while len(count) > k:
            count[nums[left]] -= 1
            if count[nums[left]] == 0:
                del count[nums[left]]
            left += 1
        total += right - left + 1      # all windows ending at `right`
    return total

def exactly_k(nums, k):
    # The trick worth remembering: "exactly" is a difference of "at most".
    return at_most_k_distinct(nums, k) - at_most_k_distinct(nums, k - 1)
```

---

## 8 · Failure modes

| Bug | Symptom | Fix |
|---|---|---|
| Recording `best` inside the shrink loop | Answers too large | Record after the loop |
| Not deleting zero-count keys | `len(count)` wrong | `del` when it hits zero |
| Using `if` where `while` is needed | Window stays invalid | Shrink is a `while` |
| Forgetting `>= left` in the jump | Window moves backwards | Guard against stale indices |
| Applying it with negative numbers | Never converges | Prefix sum + hash map |
| Mixing up the two variants | Off-by-one everywhere | "Longest" shrinks while invalid; "shortest" shrinks while valid |

---

## 9 · Interview questions on this pattern

| Question | What to say |
|---|---|
| "Why is this O(n) when there is a nested loop?" | Both pointers only move forward, so each index enters and leaves the window at most once — 2n pointer moves total. |
| "Why not decrement `max_freq` in LC 424?" | A smaller `max_freq` could only yield a shorter window, and we want the longest. Keeping the historical maximum avoids an O(26) rescan per step. |
| "When does sliding window not apply?" | Non-contiguous (subsequence), or negative numbers with a sum condition — shrinking no longer monotonically reduces the sum, so the invariant breaks. |
| "How would you handle exactly k?" | `atMost(k) − atMost(k−1)`. Exactly is a difference of two at-most computations. |
| "Optimise Sliding Window Maximum" | A monotonic deque holding indices in decreasing value order; front is the max, pop from the back while smaller. O(n). |

---

## Stop condition

You are done with this pattern when you can:

1. type both templates from memory, no syntax errors,
2. name the variant from the problem statement in under 30 seconds,
3. explain the O(n) argument in one sentence,
4. write `at_most_k` and derive `exactly_k` from it, and
5. solve LC 76 in under 25 minutes, cold.
