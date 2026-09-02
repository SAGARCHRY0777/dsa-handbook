---
title: Bit manipulation
slug: bit-manipulation
module: search
order: 33
status: live
level: basic → advanced
summary: The eight operations worth memorising, XOR's four properties that solve most bit problems, bitmasks as subsets, and the Java/Python pitfalls that actually bite.
---

# Bit manipulation

> **Recognition in one line:** the problem mentions bits or binary directly, asks
> for constant space where counting would need a map, or has `n ≤ 20` and asks
> about **subsets**.

A small pattern with a high ratio of "trivial once you know the trick" to
"impossible if you do not."

---

## 1 · Recognition cues

| Cue | Signal |
|---|---|
| "without using extra space" + duplicates | **XOR** |
| "single number" / "appears once" | XOR, or bit counting |
| "count the 1 bits", "power of two" | Direct bit work |
| **`n ≤ 20` and "subsets" or "all combinations"** | **Bitmask** |
| "XOR", "AND", "OR" in the statement | Obviously |
| "swap without a temp variable" | XOR trick |
| "add without using +" | Full adder with XOR and AND |
| Bitmask DP: "visit all cities", "assign all tasks" | Bitmask over states |

> **`n ≤ 20` is the tell for bitmask problems.** 2²⁰ is about a million states —
> comfortably enumerable. The constraint is telling you the intended solution
> iterates over subsets.

---

## 2 · The eight operations

**Memorise these.** They cover the large majority of what comes up.

```
1.  x & 1                 is x odd?
2.  x >> 1                divide by 2   (x >>> 1 in Java for unsigned)
3.  x << 1                multiply by 2
4.  x & (1 << i)          is bit i set?
5.  x | (1 << i)          SET bit i
6.  x & ~(1 << i)         CLEAR bit i
7.  x ^ (1 << i)          TOGGLE bit i
8.  x & (x - 1)           CLEAR THE LOWEST SET BIT      <- the important one
```

**And the two derived from #8:**

```
x & (x - 1) == 0          x is a power of two (or zero -- guard x > 0)
x & (-x)                  ISOLATE the lowest set bit
```

**Why `x & (x-1)` clears the lowest set bit** — worth being able to explain
rather than memorise:

```
x     = 1011 0100
x - 1 = 1011 0011      subtracting 1 flips the lowest 1 to 0
                       and turns every 0 below it into 1
x&(x-1)=1011 0000      the AND kills that lowest 1 and everything below

So looping `while (x) { x &= x - 1; count++; }` counts set bits in
O(number of set bits), not O(32). That is Brian Kernighan's algorithm.
```

---

## 3 · XOR — four properties that solve most problems

```
1.  x ^ x = 0             a value cancels itself
2.  x ^ 0 = x             identity
3.  commutative + associative -> ORDER DOES NOT MATTER
4.  x ^ y ^ y = x         XOR is its own inverse
```

**Property 1 plus property 3 is the whole trick.** If every value appears twice
except one, XOR everything: the pairs cancel regardless of order, and the
survivor is the answer.

```python
def single_number(nums):
    result = 0
    for x in nums:
        result ^= x        # pairs cancel; order is irrelevant
    return result
```

**O(n) time, O(1) space** — where a hash map would be O(n) space. That space
saving is the reason the problem is asked.

**The three canonical XOR problems:**

| Problem | Trick |
|---|---|
| **Single Number** (LC 136) | XOR everything |
| **Missing Number** (LC 268) | XOR all indices *and* all values; everything cancels but the missing one |
| **Single Number III** (LC 260) | XOR all → gives `a^b`; isolate any set bit with `x & -x`; that bit differs between a and b, so partition into two groups and XOR each |

**LC 260's partition step is the one worth understanding**, because it
generalises: `a ^ b` has a 1 wherever a and b differ, so *any* set bit splits
the array into a group containing a and a group containing b — reducing the
problem to two instances of LC 136.

---

## 4 · Bitmasks as subsets

**An integer's bits are a subset of a set of size n.** Bit i set means element i
is included.

```
n = 4, mask = 1011 (binary) = 11 (decimal)
             ^^^^
             3210      -> elements {0, 1, 3} are in the subset

Iterate ALL subsets of an n-element set:
```

```python
def all_subsets(nums):
    n = len(nums)
    out = []
    for mask in range(1 << n):                 # 2^n masks
        subset = [nums[i] for i in range(n) if mask & (1 << i)]
        out.append(subset)
    return out
```

```java
for (int mask = 0; mask < (1 << n); mask++) {
    List<Integer> subset = new ArrayList<>();
    for (int i = 0; i < n; i++) {
        if ((mask & (1 << i)) != 0) subset.add(nums[i]);
    }
    out.add(subset);
}
```

**This is an alternative to [backtracking](backtracking.html) for subsets**, and
worth having: it is iterative, has no recursion depth, and the mask itself is a
convenient key for memoisation — which is exactly what makes bitmask DP work.

**Useful mask operations:**

| Operation | Expression |
|---|---|
| Full set of n elements | `(1 << n) - 1` |
| Add element i | `mask \| (1 << i)` |
| Remove element i | `mask & ~(1 << i)` |
| Is i present | `mask & (1 << i)` |
| Count elements | `bin(mask).count('1')` / `Integer.bitCount(mask)` |
| Complement | `mask ^ ((1 << n) - 1)` |
| **Iterate all submasks** | `sub = mask; while sub: ...; sub = (sub - 1) & mask` |

> **The submask enumeration idiom is genuinely non-obvious** and worth knowing:
> `(sub - 1) & mask` walks exactly the subsets of `mask` in decreasing order,
> and the whole loop over all masks and their submasks is O(3ⁿ), not O(4ⁿ).

---

## 5 · Language pitfalls

**These cause real bugs and are worth mentioning aloud in an interview.**

### Java

| Pitfall | Detail |
|---|---|
| `>>` versus `>>>` | `>>` is arithmetic (sign-extending); `>>>` is logical. For unsigned bit counting on negatives, use `>>>` or you loop forever |
| `1 << 31` | Overflows `int` into the sign bit. Use `1L << 31` when you need the value |
| Shift by ≥ 32 | Java masks the shift count by 31, so `1 << 32` is `1`, not `0` |
| Operator precedence | `&` binds **looser** than `==`. `if (x & 1 == 0)` does not compile / misparses — parenthesise: `if ((x & 1) == 0)` |

### Python

| Pitfall | Detail |
|---|---|
| **Unbounded integers** | No overflow, but also no natural 32-bit wraparound — problems assuming 32-bit arithmetic need explicit masking |
| Negative numbers | Infinite leading 1s conceptually; `bin(-5)` is `'-0b101'`, not two's complement |
| The fix | Mask with `& 0xFFFFFFFF`, then convert back: `x - (1 << 32) if x >= (1 << 31) else x` |

```python
def get_sum(a, b):
    """Add two integers without + or -. LC 371."""
    MASK = 0xFFFFFFFF
    MAX_INT = 0x7FFFFFFF

    while b != 0:
        carry = ((a & b) << 1) & MASK    # AND finds where a carry is generated
        a = (a ^ b) & MASK               # XOR is addition without carry
        b = carry
    # Python ints are unbounded, so reinterpret as signed 32-bit.
    return a if a <= MAX_INT else ~(a ^ MASK)
```

**`a ^ b` is addition without carry; `(a & b) << 1` is the carry.** Repeat until
there is no carry. That is a full adder, and it is the answer to "add without
`+`".

---

## 6 · The ladder

### Foundational

| # | Problem | Source | The point |
|---|---|---|---|
| 1 | **Number of 1 Bits** | LC 191 · NeetCode | `x & (x-1)` — Kernighan's |
| 2 | **Single Number** | LC 136 · NeetCode | XOR cancellation |
| 3 | **Missing Number** | LC 268 · NeetCode | XOR indices and values |
| 4 | Power of Two | LC 231 | `x > 0 && (x & (x-1)) == 0` |
| 5 | **Counting Bits** | LC 338 · NeetCode | DP: `dp[i] = dp[i >> 1] + (i & 1)` |
| 6 | **Reverse Bits** | LC 190 · NeetCode | Build the result bit by bit |

### Medium

| # | Problem | Source | The point |
|---|---|---|---|
| 7 | **Sum of Two Integers** | LC 371 · NeetCode | Full adder; Python masking |
| 8 | Single Number II | LC 137 | Every element thrice but one — bit counts mod 3 |
| 9 | **Single Number III** | LC 260 | Isolate a differing bit, partition |
| 10 | Bitwise AND of Numbers Range | LC 201 | Common prefix of the endpoints |
| 11 | **Subsets** (bitmask version) | LC 78 | Iterative alternative to backtracking |
| 12 | Maximum XOR of Two Numbers | LC 421 | Bit trie — see [tries](tries.html) |
| 13 | Maximum Product of Word Lengths | LC 318 | Words as 26-bit masks; `&` tests disjointness |

### Hard

| # | Problem | Source | The point |
|---|---|---|---|
| 14 | **Partition to K Equal Sum Subsets** | LC 698 | Bitmask DP over used elements |
| 15 | Shortest Path Visiting All Nodes | LC 847 | BFS where the state is `(node, visited_mask)` |
| 16 | Smallest Sufficient Team | LC 1125 | Bitmask DP over required skills |

**If you only do five: 191, 136, 268, 338, 78.**

---

## 7 · Worked example — LC 338, Counting Bits

**Problem:** for every `i` from 0 to n, return the number of 1 bits.

**The naive answer is O(n log n)** — Kernighan's per number. The intended
solution is O(n), and it comes from a bit-level recurrence.

```
i in binary, shifted right by one, is i/2.
Shifting drops exactly the lowest bit.

  so  popcount(i) = popcount(i >> 1) + (lowest bit of i)
                  = dp[i >> 1] + (i & 1)

  i=5  101  ->  dp[2] + 1  =  1 + 1  =  2   ✓
  i=6  110  ->  dp[3] + 0  =  2 + 0  =  2   ✓
  i=7  111  ->  dp[3] + 1  =  2 + 1  =  3   ✓

Every value depends on a strictly smaller index, so one forward pass works.
```

```python
def count_bits(n):
    dp = [0] * (n + 1)
    for i in range(1, n + 1):
        dp[i] = dp[i >> 1] + (i & 1)     # i>>1 is already computed
    return dp
```

```java
public int[] countBits(int n) {
    int[] dp = new int[n + 1];
    for (int i = 1; i <= n; i++) {
        dp[i] = dp[i >> 1] + (i & 1);
    }
    return dp;
}
```

**An alternative recurrence worth knowing:** `dp[i] = dp[i & (i-1)] + 1` —
clearing the lowest set bit gives a smaller number with exactly one fewer bit.
Both are O(n); mentioning both shows fluency.

---

## 8 · Worked example — LC 318, Maximum Product of Word Lengths

**Problem:** find the maximum `len(a) × len(b)` over pairs of words sharing no
common letter.

**The insight:** checking letter overlap with sets is O(26) per pair. **Encode
each word as a 26-bit mask and overlap becomes a single `&`.**

```
"abc"  -> bits 0,1,2 set   -> 0000...0111
"def"  -> bits 3,4,5 set   -> 0000...111000

mask_a & mask_b == 0  <=>  no shared letter.  ONE instruction.
```

```python
def max_product(words):
    masks = []
    for w in words:
        m = 0
        for ch in w:
            m |= 1 << (ord(ch) - ord("a"))   # set the letter's bit
        masks.append(m)

    best = 0
    for i in range(len(words)):
        for j in range(i + 1, len(words)):
            if masks[i] & masks[j] == 0:     # disjoint letter sets
                best = max(best, len(words[i]) * len(words[j]))
    return best
```

**O(n² ) with a constant-time inner check instead of O(n²·26).** The
transferable idea: **a small fixed universe (26 letters, 20 cities, 32 tasks)
compresses into one integer, and set operations become single instructions.**

---

## 9 · Failure modes

| Bug | Symptom | Fix |
|---|---|---|
| `x & (x-1) == 0` for `x = 0` | Zero reported as a power of two | Guard `x > 0` |
| Java `>>` on negatives | Infinite loop counting bits | Use `>>>` |
| Java precedence | Compile error or wrong parse | `((x & 1) == 0)` |
| `1 << 31` in Java `int` | Negative value | `1L << 31` |
| Python negative shifts | Wrong results, no overflow | Mask with `0xFFFFFFFF` |
| Off-by-one in `1 << n` | Missing the last subset | `range(1 << n)` gives 0..2ⁿ−1, which is correct |
| Confusing `^` with `**` in Python | `2 ^ 3` is 1, not 8 | `^` is XOR; `**` is power |

---

## 10 · Interview questions

| Question | What to say |
|---|---|
| ⭐ "Find the number that appears once." | XOR everything. Equal values cancel and XOR is commutative, so order does not matter and the survivor is the answer — O(n) time and O(1) space, versus O(n) space for a hash map. That space saving is the point of the question. |
| ⭐ "Count set bits efficiently." | `x & (x-1)` clears the lowest set bit, so the loop runs once per set bit rather than 32 times — Brian Kernighan's algorithm. For all values up to n, the DP recurrence `dp[i] = dp[i>>1] + (i&1)` gives O(n) total. |
| ⭐ "Why does `x & (x-1)` clear the lowest bit?" | Subtracting one flips the lowest 1 to 0 and sets every bit below it. ANDing with the original kills that bit and everything under it, leaving the higher bits untouched. |
| "Two numbers appear once, everything else twice." | XOR everything to get `a ^ b`, which has a 1 wherever they differ. Isolate any such bit with `x & -x`, use it to partition the array into two groups — each containing one of the singles — and XOR each group. |
| ⭐ "Generate all subsets." | Iterate masks 0 to 2ⁿ−1; bit i means element i is included. It is an iterative alternative to backtracking with no recursion depth, and the mask doubles as a memoisation key — which is what makes bitmask DP work. |
| "Add two numbers without `+`." | `a ^ b` is addition without carry and `(a & b) << 1` is the carry; loop until there is no carry. In Python you also have to mask to 32 bits and reinterpret the sign, because Python integers do not overflow. |
| "When would you use a bitmask?" | When the universe is small and fixed — up to about 20 or 32 elements. `n ≤ 20` in the constraints is usually the problem telling you it wants subset enumeration or bitmask DP. |

---

## Stop condition

You know this pattern when you can:

1. write the eight operations from memory,
2. explain *why* `x & (x-1)` clears the lowest set bit,
3. give XOR's four properties and solve LC 136 and 268 with them,
4. explain the LC 260 partition trick,
5. enumerate subsets by mask and know the `n ≤ 20` tell, and
6. name the Java `>>>` and Python masking pitfalls.
