---
title: Solutions — dynamic programming
slug: solutions-dp
module: solutions
order: 65
status: live
level: worst → best
summary: Five DP problems from exponential recursion to optimised tables, in Python and Java, showing the memoise-then-tabulate progression.
---

# Solutions — dynamic programming

DP has the clearest worst-to-best progression of any pattern, and following it
in order is the method:

```
   1. naive recursion        exponential -- but it is the RECURRENCE, written out
   2. + memoisation          polynomial, minimal change, easy to verify
   3. bottom-up table        same complexity, no recursion, better constants
   4. space optimisation     only when the recurrence looks back a fixed distance
```

**Never skip step 1.** The naive recursion *is* the recurrence. Once it is
correct, memoising is one decorator and tabulating is mechanical.

---

## LC 198 · House Robber

### Approach 1 — naive recursion · O(2ⁿ)

```python
def rob(nums):
    def best_from(i):
        if i >= len(nums):
            return 0
        # The recurrence, stated: rob this house and skip one, or skip this one.
        return max(nums[i] + best_from(i + 2), best_from(i + 1))
    return best_from(0)
```

### Approach 2 — memoised · O(n) time, O(n) space ✅

```python
from functools import cache

def rob(nums):
    @cache
    def best_from(i):
        if i >= len(nums):
            return 0
        return max(nums[i] + best_from(i + 2), best_from(i + 1))
    return best_from(0)
```

**One decorator.** That is the whole change, and it is why writing the recursion
first is worth it.

### Approach 3 — bottom-up · O(n) time, O(n) space

```python
def rob(nums):
    n = len(nums)
    dp = [0] * (n + 1)
    dp[1] = nums[0] if n else 0
    for i in range(2, n + 1):
        dp[i] = max(dp[i - 1], dp[i - 2] + nums[i - 1])
    return dp[n]
```

### Approach 4 — two variables · O(n) time, O(1) space ✅✅

The recurrence reads only `dp[i-1]` and `dp[i-2]`, so the array is unnecessary.

```python
def rob(nums):
    prev2, prev1 = 0, 0
    for x in nums:
        prev2, prev1 = prev1, max(prev1, prev2 + x)
    return prev1
```

```java
public int rob(int[] nums) {
    int prev2 = 0, prev1 = 0;
    for (int x : nums) {
        int current = Math.max(prev1, prev2 + x);
        prev2 = prev1;
        prev1 = current;
    }
    return prev1;
}
```

---

## LC 322 · Coin Change

### Approach 1 — greedy · **WRONG**

Worth writing, because producing the counterexample is the answer to "why DP?".

```python
def coin_change(coins, amount):          # INCORRECT
    coins.sort(reverse=True)
    count = 0
    for c in coins:
        while amount >= c:
            amount -= c
            count += 1
    return count if amount == 0 else -1
```

Fails on `coins = [1, 3, 4], amount = 6`: greedy takes `4 + 1 + 1 = 3` coins;
optimal is `3 + 3 = 2`.

### Approach 2 — memoised recursion · O(amount × coins) ✅

```python
from functools import cache

def coin_change(coins, amount):
    @cache
    def fewest(remaining):
        if remaining == 0:
            return 0
        if remaining < 0:
            return float("inf")
        return min((fewest(remaining - c) + 1 for c in coins), default=float("inf"))

    result = fewest(amount)
    return result if result != float("inf") else -1
```

### Approach 3 — bottom-up · O(amount × coins) time, O(amount) space ✅

```python
def coin_change(coins, amount):
    INF = amount + 1                     # unreachable sentinel, never an answer
    dp = [0] + [INF] * amount
    for a in range(1, amount + 1):
        for c in coins:
            if c <= a:
                dp[a] = min(dp[a], dp[a - c] + 1)
    return dp[amount] if dp[amount] != INF else -1
```

```java
public int coinChange(int[] coins, int amount) {
    int INF = amount + 1;                // safe sentinel: cannot overflow when
    int[] dp = new int[amount + 1];      // we add 1, unlike Integer.MAX_VALUE
    Arrays.fill(dp, INF);
    dp[0] = 0;

    for (int a = 1; a <= amount; a++) {
        for (int c : coins) {
            if (c <= a) dp[a] = Math.min(dp[a], dp[a - c] + 1);
        }
    }
    return dp[amount] == INF ? -1 : dp[amount];
}
```

> **`Integer.MAX_VALUE` as the sentinel is a real bug**: `dp[a-c] + 1` overflows
> to a negative number and silently wins the `min`. Use `amount + 1`.

---

## LC 1143 · Longest Common Subsequence

### Approach 1 — naive recursion · O(2^(m+n))

```python
def longest_common_subsequence(text1, text2):
    def lcs(i, j):
        if i == len(text1) or j == len(text2):
            return 0
        if text1[i] == text2[j]:
            return 1 + lcs(i + 1, j + 1)
        return max(lcs(i + 1, j), lcs(i, j + 1))
    return lcs(0, 0)
```

### Approach 2 — memoised · O(m·n) ✅

```python
from functools import cache

def longest_common_subsequence(text1, text2):
    @cache
    def lcs(i, j):
        if i == len(text1) or j == len(text2):
            return 0
        if text1[i] == text2[j]:
            return 1 + lcs(i + 1, j + 1)
        return max(lcs(i + 1, j), lcs(i, j + 1))
    return lcs(0, 0)
```

### Approach 3 — bottom-up table · O(m·n) time and space ✅

```python
def longest_common_subsequence(text1, text2):
    m, n = len(text1), len(text2)
    # (m+1) x (n+1): row/column 0 is the empty prefix, which removes every
    # boundary special case.
    dp = [[0] * (n + 1) for _ in range(m + 1)]

    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if text1[i - 1] == text2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
    return dp[m][n]
```

```java
public int longestCommonSubsequence(String text1, String text2) {
    int m = text1.length(), n = text2.length();
    int[][] dp = new int[m + 1][n + 1];

    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (text1.charAt(i - 1) == text2.charAt(j - 1)) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }
    return dp[m][n];
}
```

### Approach 4 — two rows · O(m·n) time, O(min(m,n)) space

Each row depends only on the previous one. Mention it even if you do not write
it.

```python
def longest_common_subsequence(text1, text2):
    if len(text1) < len(text2):
        text1, text2 = text2, text1      # keep the shorter one as the row
    previous = [0] * (len(text2) + 1)

    for a in text1:
        current = [0] * (len(text2) + 1)
        for j, b in enumerate(text2, start=1):
            current[j] = previous[j - 1] + 1 if a == b else max(previous[j], current[j - 1])
        previous = current
    return previous[-1]
```

---

## LC 300 · Longest Increasing Subsequence

### Approach 1 — recursion over take/skip · O(2ⁿ)

### Approach 2 — DP · O(n²) time, O(n) space ✅

`dp[i]` = the LIS **ending exactly at** i. That precision in the state is what
makes the recurrence writable.

```python
def length_of_lis(nums):
    if not nums:
        return 0
    dp = [1] * len(nums)
    for i in range(len(nums)):
        for j in range(i):
            if nums[j] < nums[i]:
                dp[i] = max(dp[i], dp[j] + 1)
    return max(dp)
```

```java
public int lengthOfLIS(int[] nums) {
    int[] dp = new int[nums.length];
    Arrays.fill(dp, 1);
    int best = 1;
    for (int i = 0; i < nums.length; i++) {
        for (int j = 0; j < i; j++) {
            if (nums[j] < nums[i]) dp[i] = Math.max(dp[i], dp[j] + 1);
        }
        best = Math.max(best, dp[i]);
    }
    return nums.length == 0 ? 0 : best;
}
```

### Approach 3 — patience sorting · O(n log n) time ✅✅

`tails[k]` = the smallest possible tail of an increasing subsequence of length
`k+1`.

```python
from bisect import bisect_left

def length_of_lis(nums):
    tails = []
    for x in nums:
        i = bisect_left(tails, x)        # first tail >= x
        if i == len(tails):
            tails.append(x)              # x extends the longest run
        else:
            tails[i] = x                 # x is a better tail at that length
    return len(tails)
```

```java
public int lengthOfLIS(int[] nums) {
    int[] tails = new int[nums.length];
    int size = 0;
    for (int x : nums) {
        // binarySearch returns -(insertionPoint) - 1 when absent; this
        // recovers the insertion point either way.
        int i = Arrays.binarySearch(tails, 0, size, x);
        if (i < 0) i = -(i + 1);
        tails[i] = x;
        if (i == size) size++;
    }
    return size;
}
```

> **`tails` is not itself a valid subsequence** — only its length is meaningful.
> Say that before the interviewer asks; it is the standard probe.

---

## LC 72 · Edit Distance

The classic 2D. Same grid as LCS, three operations instead of two.

### Approach 1 — memoised recursion · O(m·n) ✅

```python
from functools import cache

def min_distance(word1, word2):
    @cache
    def edit(i, j):
        if i == len(word1):
            return len(word2) - j        # insert the rest
        if j == len(word2):
            return len(word1) - i        # delete the rest
        if word1[i] == word2[j]:
            return edit(i + 1, j + 1)    # free match
        return 1 + min(
            edit(i + 1, j),              # delete from word1
            edit(i, j + 1),              # insert into word1
            edit(i + 1, j + 1),          # replace
        )
    return edit(0, 0)
```

### Approach 2 — bottom-up · O(m·n) time and space ✅

```python
def min_distance(word1, word2):
    m, n = len(word1), len(word2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]

    # Base row and column: converting to or from an empty string costs its
    # length in inserts or deletes.
    for i in range(m + 1):
        dp[i][0] = i
    for j in range(n + 1):
        dp[0][j] = j

    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if word1[i - 1] == word2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1]
            else:
                dp[i][j] = 1 + min(dp[i - 1][j],      # delete
                                   dp[i][j - 1],      # insert
                                   dp[i - 1][j - 1])  # replace
    return dp[m][n]
```

```java
public int minDistance(String word1, String word2) {
    int m = word1.length(), n = word2.length();
    int[][] dp = new int[m + 1][n + 1];

    for (int i = 0; i <= m; i++) dp[i][0] = i;
    for (int j = 0; j <= n; j++) dp[0][j] = j;

    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (word1.charAt(i - 1) == word2.charAt(j - 1)) {
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                dp[i][j] = 1 + Math.min(dp[i - 1][j - 1],
                              Math.min(dp[i - 1][j], dp[i][j - 1]));
            }
        }
    }
    return dp[m][n];
}
```

**Naming the three neighbours is how you explain it:** up is delete, left is
insert, diagonal is replace. Draw the 3×3 neighbourhood on the whiteboard and the
recurrence explains itself.

---

## The progression as an interview script

```
   "The naive recursion is: <recurrence in words>. That is exponential,
    because the same subproblem is reached along many paths."

   "So I memoise -- that makes it O(m*n), one entry per state."

   "I can also write it bottom-up as a table, same complexity,
    no recursion depth risk and better constants."

   "And since each row only depends on the previous one, I can reduce
    the space to O(n)."
```

**Walking that ladder out loud is worth more than jumping to the optimised
table**, because it demonstrates you derived the solution rather than recalled
it — and if you stall, you still have a correct answer on the board.

---

## Python and Java, DP specifics

| Task | Python | Java |
|---|---|---|
| Memoise | `@cache` (`functools`) | `HashMap`, or an `int[][]` with a sentinel |
| 2D table | `[[0]*(n+1) for _ in range(m+1)]` | `new int[m+1][n+1]` — zeroed already |
| Infinity | `float("inf")` | **Never `Integer.MAX_VALUE`** if you add to it |
| Fill a row | `[0] * n` | `Arrays.fill(dp, value)` |
| Character at index | `s[i]` | `s.charAt(i)` |
| Multi-arg min | `min(a, b, c)` | `Math.min(a, Math.min(b, c))` |

> **The `[[0]*n]*m` trap in Python:** that creates `m` references to the *same*
> row, so writing to one writes to all. Always use the comprehension form.
