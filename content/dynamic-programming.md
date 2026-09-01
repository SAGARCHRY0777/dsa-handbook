---
title: Dynamic programming
slug: dynamic-programming
module: dp
order: 40
status: live
level: intermediate → advanced
summary: Not a bag of tricks — a mechanical procedure. Define the state, write the recurrence, then decide whether to memoise or tabulate.
---

# Dynamic programming

> **The one sentence:** DP is recursion where the same subproblem is solved more
> than once — so you solve each one *once* and remember the answer.

DP feels hard because people learn it as a collection of clever solutions. It is
not. It is a **procedure**, and the procedure works even when the problem is
unfamiliar. Learn the procedure and the cleverness is unnecessary.

**Do this pattern last.** It needs fluent recursion, which comes from trees and
graphs. Starting here is the single most common way to spend weeks and still
fail an easy hashing question.

---

## 1 · Recognition cues

| Cue | Signal |
|---|---|
| "**maximum / minimum** number of ways to …" | Strong |
| "**count the ways** to …" | Strong |
| "can you reach / is it possible to …" | Strong |
| "**longest / shortest** subsequence" (not subarray) | Strong |
| Choices at each step, where earlier choices constrain later ones | Strong |
| Greedy gives a wrong answer on a small counterexample | Very strong |
| `n ≤ 100` or `n ≤ 1000` with a combinatorial flavour | Suggestive |

**The two properties that must hold**, and checking them is the actual skill:

1. **Optimal substructure** — the optimum for the whole is built from optima of
   parts.
2. **Overlapping subproblems** — the same subproblem recurs. *Without this, it is
   divide-and-conquer, not DP.*

**Anti-cue:** "subarray" (contiguous) usually means sliding window or prefix sum.
"Subsequence" (non-contiguous) usually means DP. That single word distinction
resolves a lot of misclassification.

---

## 2 · The procedure

Do these five steps **in order, in writing**, before any code. Skipping to code
is why DP feels like guessing.

```
   1. STATE       what does dp[i] (or dp[i][j]) MEAN? Write it as a
                  full English sentence. If you cannot, you do not have
                  the state yet -- and no amount of coding will fix that.

   2. RECURRENCE  how is dp[i] built from smaller entries?
                  Usually: "for each choice, take the best."

   3. BASE CASE   the smallest input, answered directly.

   4. ORDER       in what order must entries be filled so dependencies
                  already exist? (Or use memoised recursion and skip this.)

   5. ANSWER      which cell holds the result? Not always the last one.
```

**Step 1 is 80% of the difficulty.** "dp[i] = the length of the longest
increasing subsequence **ending exactly at index i**" is a usable state. "dp[i]
= something about the first i elements" is not — and the vagueness will show up
as a recurrence you cannot write.

---

## 3 · The templates

```python
# TOP-DOWN (memoised recursion) -- write this FIRST, always.
# It follows the recurrence directly, so it is far easier to get right.
from functools import cache

def solve(i, j):
    if BASE_CASE:
        return BASE_VALUE
    return best(solve(smaller_i, smaller_j) for each choice)

solve = cache(solve)      # or decorate with @cache
```

```python
# BOTTOM-UP (tabulation) -- convert once the recurrence is proven correct.
def solve_bottom_up(n):
    dp = [BASE] * (n + 1)
    for i in range(1, n + 1):
        dp[i] = best(dp[i - k] for each choice k)
    return dp[n]
```

```python
# SPACE OPTIMISATION -- only when the recurrence looks back a fixed distance.
def fib(n):
    prev, curr = 0, 1
    for _ in range(n - 1):
        prev, curr = curr, prev + curr    # dp[i] needs only dp[i-1], dp[i-2]
    return curr
```

**Write the memoised version first, every time.** It mirrors the recurrence, so
if the recurrence is right the code is right. Convert to tabulation afterwards
only if you need the space saving or the interviewer asks. Attempting tabulation
directly means debugging the recurrence and the fill order simultaneously.

---

## 4 · The families

Most interview DP is one of six shapes. Recognising the shape gives you the
state.

| Family | State | Canonical problem |
|---|---|---|
| **1D linear** | `dp[i]` = best up to i | Climbing Stairs, House Robber |
| **1D with choice** | `dp[i]` = best ending *at* i | LIS, Max Subarray |
| **2D grid** | `dp[r][c]` = best to reach (r,c) | Unique Paths, Min Path Sum |
| **2D two sequences** | `dp[i][j]` = best for prefixes i and j | LCS, Edit Distance |
| **Knapsack** | `dp[i][w]` = best with i items, capacity w | Subset Sum, Coin Change |
| **Interval** | `dp[i][j]` = best for the segment i..j | Burst Balloons, Palindrome Partitioning |

---

## 5 · The ladder

### Easy — the shape of DP

| # | Problem | Source | The point |
|---|---|---|---|
| 1 | **Climbing Stairs** | LC 70 · NeetCode | Fibonacci. The smallest possible DP |
| 2 | Min Cost Climbing Stairs | LC 746 · NeetCode | Same, with a cost |
| 3 | **House Robber** | LC 198 · NeetCode | Take-or-skip. The template for choice |
| 4 | House Robber II | LC 213 · NeetCode | Circular — run it twice |

### Medium — where interviews live

| # | Problem | Source | The point |
|---|---|---|---|
| 5 | **Coin Change** | LC 322 · NeetCode | Unbounded knapsack. Very common |
| 6 | Coin Change II | LC 518 · NeetCode | **Counting** — loop order matters enormously |
| 7 | **Longest Increasing Subsequence** | LC 300 · NeetCode | O(n²) DP, then O(n log n) with patience |
| 8 | **Longest Common Subsequence** | LC 1143 · NeetCode | The two-sequence template |
| 9 | Word Break | LC 139 · NeetCode | 1D over string positions |
| 10 | Unique Paths | LC 62 · NeetCode | The grid template |
| 11 | Partition Equal Subset Sum | LC 416 · NeetCode | 0/1 knapsack as a feasibility question |
| 12 | Maximum Product Subarray | LC 152 · NeetCode | Track min **and** max — negatives flip them |
| 13 | Decode Ways | LC 91 · NeetCode | 1D with awkward edge cases |
| 14 | Longest Palindromic Substring | LC 5 · NeetCode | Expand from centres beats DP here |

### Hard

| # | Problem | Source | The point |
|---|---|---|---|
| 15 | **Edit Distance** | LC 72 · NeetCode | The classic 2D. Know it cold |
| 16 | Burst Balloons | LC 312 · NeetCode | Interval DP; think *last*, not first |
| 17 | Regular Expression Matching | LC 10 · NeetCode | 2D with `*` handling |

**If you only do five: 198, 322, 1143, 300, 72.** Those cover linear choice,
knapsack, two-sequence, subsequence, and the hardest common 2D.

---

## 6 · Worked example — LC 198, House Robber

**The procedure, applied.**

> **1. State.** `dp[i]` = the maximum money robbable from the first `i` houses.
> **2. Recurrence.** At house `i` you either rob it (and skip `i−1`) or skip it:
> `dp[i] = max(dp[i-1], dp[i-2] + nums[i-1])`
> **3. Base.** `dp[0] = 0`, `dp[1] = nums[0]`.
> **4. Order.** Increasing `i`.
> **5. Answer.** `dp[n]`.

```
   nums = [2, 7, 9, 3, 1]

   dp[0] = 0
   dp[1] = 2                                   rob house 0
   dp[2] = max(dp[1], dp[0] + 7) = max(2, 7)  = 7
   dp[3] = max(dp[2], dp[1] + 9) = max(7, 11) = 11
   dp[4] = max(dp[3], dp[2] + 3) = max(11,10) = 11
   dp[5] = max(dp[4], dp[3] + 1) = max(11,12) = 12

   answer 12   (houses 0, 2, 4)
```

```python
def rob(nums: list[int]) -> int:
    # Only dp[i-1] and dp[i-2] are ever read, so two variables replace the
    # array. Do the array version first if it helps you think.
    prev2, prev1 = 0, 0
    for x in nums:
        prev2, prev1 = prev1, max(prev1, prev2 + x)
    return prev1
```

**Complexity:** O(n) time, O(1) space.

---

## 7 · Worked example — LC 322, Coin Change

> **1. State.** `dp[a]` = the fewest coins summing to exactly `a`.
> **2. Recurrence.** `dp[a] = 1 + min(dp[a - c] for each coin c ≤ a)`
> **3. Base.** `dp[0] = 0`. Everything else starts at infinity.
> **4. Order.** Increasing `a`.
> **5. Answer.** `dp[amount]`, or −1 if still infinite.

```
   coins = [1, 2, 5],  amount = 11

   dp[0]  = 0
   dp[1]  = 1 + dp[0]  = 1                  [1]
   dp[2]  = 1 + min(dp[1], dp[0]) = 1       [2]
   dp[3]  = 1 + min(dp[2], dp[1]) = 2       [1,2]
   dp[4]  = 1 + min(dp[3], dp[2]) = 2       [2,2]
   dp[5]  = 1 + min(dp[4], dp[3], dp[0]) = 1   [5]
   ...
   dp[11] = 1 + min(dp[10], dp[9], dp[6]) = 3  [5,5,1]

   answer 3
```

```python
def coin_change(coins: list[int], amount: int) -> int:
    INF = amount + 1                       # unreachable sentinel, never a real answer
    dp = [0] + [INF] * amount

    for a in range(1, amount + 1):
        for c in coins:
            if c <= a:
                dp[a] = min(dp[a], dp[a - c] + 1)

    return dp[amount] if dp[amount] != INF else -1
```

**Complexity:** O(amount × len(coins)) time, O(amount) space.

**The greedy trap is the follow-up.** Taking the largest coin first fails on
`coins = [1, 3, 4], amount = 6` — greedy gives `4+1+1 = 3` coins, optimal is
`3+3 = 2`. Being able to produce that counterexample on demand is what shows you
know *why* it needs DP.

---

## 8 · Worked example — LC 1143, Longest Common Subsequence

The two-sequence template. Learn this and Edit Distance is the same grid with
different arithmetic.

> **1. State.** `dp[i][j]` = LCS length of `text1[:i]` and `text2[:j]`.
> **2. Recurrence.**
> - characters match → `dp[i-1][j-1] + 1`
> - otherwise → `max(dp[i-1][j], dp[i][j-1])`
> **3. Base.** Row and column 0 are all zero — an empty string shares nothing.
> **4. Order.** Row by row.
> **5. Answer.** `dp[m][n]`.

```
   text1 = "abcde",  text2 = "ace"

        ""  a  c  e
    ""   0  0  0  0
    a    0  1  1  1
    b    0  1  1  1
    c    0  1  2  2
    d    0  1  2  2
    e    0  1  2  3     <- answer 3 ("ace")

   diagonal + 1 on a match; otherwise the better of up and left.
```

```python
def longest_common_subsequence(text1: str, text2: str) -> int:
    m, n = len(text1), len(text2)
    # (m+1) x (n+1) so row/column 0 represent the empty prefix. That padding
    # removes every boundary special case.
    dp = [[0] * (n + 1) for _ in range(m + 1)]

    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if text1[i - 1] == text2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1        # extend the match
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])   # drop one character

    return dp[m][n]
```

**Complexity:** O(m × n) time and space. Space reduces to O(min(m, n)) because
each row depends only on the previous one — mention that even if you do not
write it.

---

## 9 · Worked example — LC 300, Longest Increasing Subsequence

Worth doing twice, because the O(n log n) version is a standard follow-up.

```
   nums = [10, 9, 2, 5, 3, 7, 101, 18]

   O(n^2) DP:  dp[i] = LIS ENDING AT i
     dp = [1, 1, 1, 2, 2, 3, 4, 4]
              ^        ^  ^  ^
              2      2,5  2,3,7  2,3,7,101
     answer max(dp) = 4

   O(n log n) patience:  keep `tails`, where tails[k] is the SMALLEST
   possible tail of an increasing subsequence of length k+1.

     10   -> [10]
      9   -> replace 10        [9]
      2   -> replace 9         [2]
      5   -> append            [2,5]
      3   -> replace 5         [2,3]
      7   -> append            [2,3,7]
    101   -> append            [2,3,7,101]
     18   -> replace 101       [2,3,7,18]

   len(tails) = 4
```

```python
from bisect import bisect_left

def length_of_lis(nums: list[int]) -> int:
    tails = []
    for x in nums:
        i = bisect_left(tails, x)      # first tail >= x
        if i == len(tails):
            tails.append(x)            # x extends the longest subsequence
        else:
            tails[i] = x               # x is a better (smaller) tail at length i
    return len(tails)
```

**`tails` is not itself a valid subsequence** — only its *length* is meaningful.
That is the point people get wrong, and the interviewer will probe it. Say it
before they ask.

**Complexity:** O(n log n) time, O(n) space.

---

## 10 · Same problem in disguise

| Problem | Really is |
|---|---|
| Min Cost Climbing Stairs (LC 746) | Climbing Stairs with weights |
| House Robber II (LC 213) | House Robber run twice, excluding one end each time |
| Delete Operation for Two Strings (LC 583) | LCS — delete everything not in it |
| Shortest Common Supersequence (LC 1092) | LCS, reconstructing |
| Edit Distance (LC 72) | LCS grid, three operations instead of two |
| Target Sum (LC 494) | Subset sum after an algebraic rearrangement |
| Partition Equal Subset Sum (LC 416) | Subset sum for `total/2` |
| Coin Change II (LC 518) | Unbounded knapsack, counting instead of minimising |
| Longest Palindromic Subsequence (LC 516) | LCS of the string with its reverse |

**LC 516 is the nicest one to know:** the longest palindromic *subsequence* is
just the LCS of the string and its reverse. One line of reframing removes the
whole problem.

---

## 11 · Failure modes

| Bug | Symptom | Fix |
|---|---|---|
| Vague state definition | Cannot write the recurrence | Write the state as a full English sentence first |
| Tabulating before memoising | Debugging recurrence and order together | Memoise first, convert later |
| Wrong loop order in Coin Change II | Counts permutations, not combinations | Coins outer, amount inner for combinations |
| Off-by-one on 1-indexed DP | `IndexError` or wrong answer | Size `n+1`, treat index 0 as empty |
| Space-optimising too early | Hard-to-find bugs | Get the 2D version right first |
| Forgetting negatives in LC 152 | Wrong on `[-2,3,-4]` | Track running min *and* max |
| Missing base case | Infinite recursion | Base case as the first line |
| Mutable default in memoisation | Stale results across calls | `@cache`, or an explicit dict |

---

## 12 · Interview questions on this pattern

| Question | What to say |
|---|---|
| ⭐ "How do you know it is DP?" | Optimal substructure plus overlapping subproblems. If the same subproblem never recurs it is divide-and-conquer. And if a greedy counterexample exists, that usually confirms DP. |
| ⭐ "Walk me through your state." | State as a sentence, then recurrence, base case, order, answer cell. Doing it in that order out loud is the method — and it works on problems I have not seen. |
| "Top-down or bottom-up?" | Memoise first because it mirrors the recurrence and is easier to get right. Tabulate afterwards for the constant factor or the space optimisation. |
| "Why doesn't greedy work for Coin Change?" | `coins = [1,3,4], amount = 6`: greedy gives 4+1+1, optimal is 3+3. A concrete counterexample beats an abstract argument. |
| ⭐ "LIS in O(n log n)?" | Patience sorting: maintain the smallest possible tail for each length and binary search the insertion point. Its length is the answer, but `tails` is not itself a valid subsequence. |
| "Reduce the space?" | Whenever the recurrence looks back a fixed distance, keep only those rows or variables. LCS needs two rows; House Robber needs two integers. |

---

## Stop condition

You are done with this pattern when you can:

1. recite the five-step procedure and apply it to an unseen problem,
2. write a state as a sentence before writing any code,
3. produce the Coin Change greedy counterexample from memory,
4. write LCS and Edit Distance cold, and
5. explain the LIS patience method including what `tails` is not.
