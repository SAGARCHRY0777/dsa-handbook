---
title: Recursion — the problem set
slug: recursion-problems
module: recursion
order: 7
status: live
level: every problem in the series, worked
summary: The thirteen problems the recursion series covers, grouped by framework, with tested implementations and the one idea each problem adds.
---

# Recursion — the problem set

> **This is the handbook's own write-up, not video notes.** The problem *list*
> comes from [Aditya Verma's](https://www.youtube.com/@TheAdityaVerma) recursion
> playlist ([video 2's notes](av-02-recursion-is-everywhere.html) has the
> timestamps). The solutions below are mine, and **every one has been executed
> against test cases** — see the note at the end.
>
> His explanations are the reason to watch the series. This page is for
> revision once you have.

---

## 1 · The three families

Every problem here is one of three shapes, and the ordering is the curriculum:

```
  REDUCE           take one element off, trust the rest, put it back
                   -> a CHAIN, no decisions
                   -> use IBH: hypothesis, induction, base

  CHOICE           take it or leave it, at every element
                   -> a BRANCHING tree, 2^n nodes
                   -> use the input-output method

  CONSTRAINED      the same branching tree, but some branches are ILLEGAL
  CHOICE           -> this is backtracking
```

**Learn one problem per family properly and the rest are variations.** The
seven reduce problems are genuinely the same move seven times.

---

## 2 · Reduce (IBH)

### Print 1 to N — the whole method in three lines

```python
def print_1_to_n(n):
    if n == 0:              # BASE -- smallest INVALID input
        return
    print_1_to_n(n - 1)     # HYPOTHESIS -- trust it prints 1..n-1
    print(n)                # INDUCTION -- one step, on the way up

def print_n_to_1(n):
    if n == 0:
        return
    print(n)                # the ONLY change: print BEFORE the call
    print_n_to_1(n - 1)     # so it runs on the way DOWN
```

> **The one idea:** code *before* the recursive call runs on the way down; code
> *after* it runs on the way back up. Two functions, one line moved. Every
> problem below depends on knowing which you want.

### Sort an array

**Hypothesis:** `sort(arr[0..n-2])` sorts everything but the last element.
**Induction:** insert that last element into its place.
**Base:** length ≤ 1 is already sorted.

```python
def sort_array(arr):
    if len(arr) <= 1:
        return
    last = arr.pop()
    sort_array(arr)              # hypothesis
    insert_sorted(arr, last)     # induction

def insert_sorted(arr, v):
    # Itself IBH: base = it belongs at the end; hypothesis = insert into the
    # smaller array; induction = put the popped element back on top.
    if not arr or arr[-1] <= v:
        arr.append(v)
        return
    top = arr.pop()
    insert_sorted(arr, v)
    arr.append(top)
```

> **`insert` is recursive too**, and that is the point. Beginners write a loop
> there and lose the lesson. The whole problem is two nested applications of the
> same three questions.

### Sort a stack

**Identical code.** Only the vocabulary changes — `pop`/`append` instead of
indexing. Doing both back to back is what makes the shape stick.

```python
def sort_stack(st):
    if len(st) <= 1:
        return
    top = st.pop()
    sort_stack(st)
    insert_stack(st, top)

def insert_stack(st, v):
    if not st or st[-1] <= v:
        st.append(v)
        return
    top = st.pop()
    insert_stack(st, v)
    st.append(top)
```

### Delete the middle element of a stack

**The counter is the whole difficulty**, and it is where implementations get it
wrong.

```python
def delete_middle(st, k=None):
    # k counts from the TOP. The middle is the (n//2 + 1)-th from the BOTTOM,
    # which is the ceil(n/2)-th from the top -- so (n+1)//2, NOT n//2 + 1.
    # n//2 + 1 is right for odd n and off by one for even n.
    if k is None:
        k = (len(st) + 1) // 2
    if k == 1:
        st.pop()                 # this is the middle -- drop it
        return
    top = st.pop()
    delete_middle(st, k - 1)
    st.append(top)               # put it back on the way up
```

> **I got this wrong first and the test caught it.** With `k = n//2 + 1`,
> `[1,2,3,4]` deletes `2` instead of `3`. Odd-length inputs pass either way, so
> if you only test `[1,2,3,4,5]` the bug ships. **Always test the even case on
> any "middle element" problem.**

### Reverse a stack

**Hypothesis:** reverse everything below the top.
**Induction:** insert the old top at the *bottom*.

```python
def reverse_stack(st):
    if len(st) <= 1:
        return
    top = st.pop()
    reverse_stack(st)
    insert_bottom(st, top)

def insert_bottom(st, v):
    # Recurse to the bottom, place v, then rebuild on the way up.
    if not st:
        st.append(v)
        return
    top = st.pop()
    insert_bottom(st, v)
    st.append(top)
```

**The insight worth holding:** a stack gives you no way to reach the bottom — so
the recursion *becomes* the second data structure. That is why the problem says
"without using another stack" and is still solvable.

### Count set bits

```python
def count_bits(n):
    if n == 0:
        return 0
    return (n & 1) + count_bits(n >> 1)   # reduce by SHIFTING
```

The reduction is numeric rather than structural — `n >> 1` is the smaller input.
Same framework, no container involved.

### Tower of Hanoi

```python
def hanoi(n, src, aux, dst):
    if n == 0:
        return
    hanoi(n - 1, src, dst, aux)      # move n-1 out of the way, onto aux
    print(f"move disk {n}: {src} -> {dst}")
    hanoi(n - 1, aux, src, dst)      # move them back on top
```

**Two recursive calls, and the argument order is the entire problem.** Note the
roles rotate: in the first call `dst` acts as the auxiliary. Getting that
rotation right is the whole exercise; 2ⁿ − 1 moves.

### Josephus problem

```python
def josephus(n, k):
    """Survivor's 0-indexed position. Add 1 for the usual 1-indexed answer."""
    if n == 1:
        return 0
    # After one execution, n-1 people remain and counting restarts k positions
    # along -- so the sub-answer needs shifting by k, modulo the new size.
    return (josephus(n - 1, k) + k) % n
```

> **The hardest IBH problem in the set**, because the induction step is a
> coordinate shift rather than an obvious "put the element back". The hypothesis
> gives you the survivor's position in the *smaller* circle; the induction step
> maps that position back into the original circle.

---

## 3 · Choice (input–output method)

### Subsets / subsequences — the template

```python
def subsets(s):
    results = []

    def solve(ip, op):
        if not ip:                    # base: nothing left to decide
            results.append(op)
            return
        solve(ip[1:], op)             # left  branch -- do NOT take ip[0]
        solve(ip[1:], op + ip[0])     # right branch -- take it

    solve(s, "")
    return results
```

**Every problem below is this function with the two branches changed.**

### Unique subsets — with duplicates

Sort first, then skip a value equal to its previous *sibling*:

```python
def unique_subsets(nums):
    nums.sort()                       # duplicates must be adjacent
    results = []

    def solve(start, path):
        results.append(path[:])
        for i in range(start, len(nums)):
            # `i > start`, not `i > 0`: dedupe CHOICES at this level, not
            # occurrences in the array.
            if i > start and nums[i] == nums[i - 1]:
                continue
            path.append(nums[i])
            solve(i + 1, path)
            path.pop()

    solve(0, [])
    return results
```

Same rule as in [backtracking](backtracking.html#6-worked-example--lc-90-subsets-ii).

### Permutation with spaces

```python
def perm_spaces(s):
    results = []

    def solve(ip, op):
        if not ip:
            results.append(op)
            return
        solve(ip[1:], op + ip[0])          # no space before this char
        solve(ip[1:], op + "_" + ip[0])    # space before it

    solve(s[1:], s[0])       # the FIRST char never has a space before it
    return results
```

> **`solve(s[1:], s[0])` rather than `solve(s, "")` is the detail.** A space can
> only go *between* characters, so the first one is placed unconditionally.
> Starting from an empty output would generate a leading space.

`"ABC"` → `ABC`, `AB_C`, `A_BC`, `A_B_C` — 2ⁿ⁻¹ results.

### Permutation with case change

```python
def perm_case(s):
    results = []

    def solve(ip, op):
        if not ip:
            results.append(op)
            return
        solve(ip[1:], op + ip[0].lower())
        solve(ip[1:], op + ip[0].upper())

    solve(s, "")
    return results
```

### Letter case permutation — digits are fixed

```python
def letter_case(s):
    results = []

    def solve(ip, op):
        if not ip:
            results.append(op)
            return
        if ip[0].isdigit():
            solve(ip[1:], op + ip[0])          # ONE branch -- no choice
        else:
            solve(ip[1:], op + ip[0].lower())
            solve(ip[1:], op + ip[0].upper())

    solve(s, "")
    return results
```

> **The first problem where a node has a variable number of branches.** A digit
> offers no choice, so that node has one child. This is the step before genuine
> pruning: the branch count now depends on the data.

---

## 4 · Constrained choice — where it becomes backtracking

**Both problems are the same template with an `if` guarding one branch.** That
guard is the whole difference, and it is what
[backtracking](backtracking.html) means.

### Generate all balanced parentheses

```python
def gen_parens(n):
    results = []

    def solve(open_left, close_left, cur):
        if open_left == 0 and close_left == 0:
            results.append(cur)
            return
        if open_left > 0:                       # always legal to open
            solve(open_left - 1, close_left, cur + "(")
        if close_left > open_left:              # ONLY legal if an unmatched
            solve(open_left, close_left - 1, cur + ")")   # open is outstanding

    solve(n, n, "")
    return results
```

> **`close_left > open_left` is the pruning condition**, and it is worth
> understanding rather than memorising. Remaining closes exceeding remaining
> opens means some open bracket has already been placed and not yet matched — so
> a `)` now has a partner. If they are equal, every open you have placed is
> already closed, and another `)` would be unmatched.

`n = 3` → 5 results, the Catalan number.

### N-bit binary strings with 1s ≥ 0s at every prefix

```python
def nbit_binary(n):
    results = []

    def solve(ones, zeros, cur):
        if len(cur) == n:
            results.append(cur)
            return
        solve(ones + 1, zeros, cur + "1")       # always legal
        if ones > zeros:                        # only while 1s are ahead
            solve(ones, zeros + 1, cur + "0")

    solve(0, 0, "")
    return results
```

**Structurally identical to the parentheses problem** — `1` behaves like `(`,
`0` like `)`, and the constraint is the same. Recognising that the two are one
problem is the point of having both in the series.

---

## 5 · The map

| Problem | Family | The one idea it adds |
|---|---|---|
| Print 1 to N | reduce | Work before vs after the call |
| Print N to 1 | reduce | The same, inverted |
| Sort an array | reduce | The helper is recursive too |
| Sort a stack | reduce | Same shape, different container |
| Delete middle of stack | reduce | A positional counter — check the even case |
| Reverse a stack | reduce | Recursion *as* the second data structure |
| Count set bits | reduce | Numeric reduction, no container |
| Tower of Hanoi | reduce | Two calls; rotating argument roles |
| Josephus | reduce | Induction as a coordinate shift |
| Subsets | choice | The template |
| Unique subsets | choice | `i > start` deduplication |
| Permutation with spaces | choice | Seeding the first character |
| Permutation with case | choice | Transform rather than include/exclude |
| Letter case permutation | choice | Variable branch count |
| Balanced parentheses | constrained | The pruning guard |
| N-bit binary | constrained | The same guard, disguised |

**Do them in that order.** Each row assumes the ones above it.

---

## 6 · Verification

Every implementation on this page was executed against test cases before
publishing — 24 assertions covering the normal case and the edges that
matter: empty input, single element, and **even-length stacks** for the middle
deletion.

That last one caught a real bug in my first version of `delete_middle`, which
passed every odd-length test. **The code here is tested; the framing is mine and
the problem list is his.**

---

## Stop condition

You know this set when you can:

1. sort any of the sixteen into reduce / choice / constrained without looking,
2. write the IBH template and the input–output template from memory,
3. explain why `insert` must also be recursive in sort-a-stack,
4. explain why reversing a stack needs no second stack,
5. derive the parentheses pruning condition rather than recalling it, and
6. say why N-bit binary and balanced parentheses are the same problem.
