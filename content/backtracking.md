---
title: Backtracking
slug: backtracking
module: search
order: 31
status: live
level: intermediate → advanced
summary: Build a candidate, abandon it the moment it cannot work, undo, try the next — one template covers subsets, permutations, combinations and constraint puzzles.
---

# Backtracking

> **Recognition in one line:** you must produce **all** valid configurations, not
> just count them or find the best one — and the constraints let you abandon
> partial candidates early.

Backtracking is DFS over a decision tree with an undo step. One template covers
almost every problem in the family; the differences are three lines.

---

## 1 · Recognition cues

| Cue | Signal |
|---|---|
| "return **all** …" | Strong — you must enumerate, not optimise |
| "all subsets / combinations / permutations" | Definitive |
| "generate all valid …" | Definitive |
| `n ≤ 20`, often `n ≤ 10` | The constraint that permits exponential work |
| "place N queens / solve the sudoku" | Constraint satisfaction |
| "partition the string such that every part is …" | Backtracking over cut positions |

**Anti-cues:**

- "**how many** ways" → usually DP; counting rarely needs enumeration
- "the **best** way" → DP or greedy
- `n ≥ 100` → exponential is not on the table

> **The constraint is the giveaway.** `n ≤ 20` with "return all" means the answer
> set is itself exponential, so an exponential algorithm is not merely
> acceptable — it is required.

---

## 2 · The template

Everything in this family is this shape:

```python
def backtrack(path, choices):
    if IS_COMPLETE(path):
        results.append(path[:])        # COPY -- path is mutated afterwards
        return

    for choice in choices:
        if not IS_VALID(choice, path):
            continue                   # prune: abandon this branch now

        path.append(choice)            # 1. choose
        backtrack(path, next_choices)  # 2. explore
        path.pop()                     # 3. UNDO -- this is the backtrack
    return
```

**Three lines carry everything:** choose, explore, undo. The three things that
vary between problems:

| Varies | Subsets | Permutations | Combinations |
|---|---|---|---|
| **Complete when** | always (every node) | `len(path) == n` | `len(path) == k` |
| **Next choices** | indices after `i` | all unused | indices after `i` |
| **Prune when** | — | already used | not enough left |

**`path[:]` is not optional.** Appending `path` itself stores a reference that
you then mutate — every result ends up identical and usually empty. It is the
most common bug in the entire pattern.

---

## 3 · The three shapes

```
   SUBSETS -- each element is in or out. 2^n results.

              []
          /        \
        [1]         []
       /   \       /   \
    [1,2]  [1]   [2]    []
     / \    / \   / \   / \
   ...    each level decides ONE element


   PERMUTATIONS -- order matters. n! results.

              []
        /      |      \
      [1]     [2]     [3]
      / \     / \     / \
   [1,2][1,3] ...    each level picks an UNUSED element


   COMBINATIONS -- choose k from n, order irrelevant. C(n,k) results.

   like subsets, but stop at depth k, and only ever
   pick indices AFTER the current one -- which is what
   prevents [1,2] and [2,1] both appearing
```

**"Only pick indices after the current one" is what distinguishes combinations
from permutations**, and it is a one-character change in the recursive call.

---

## 4 · The ladder

### Easy / foundational

| # | Problem | Source | The point |
|---|---|---|---|
| 1 | **Subsets** | LC 78 · NeetCode | The template, bare |
| 2 | Combinations | LC 77 | Depth-limited subsets |
| 3 | **Permutations** | LC 46 · NeetCode | The `used` set |

### Medium

| # | Problem | Source | The point |
|---|---|---|---|
| 4 | Subsets II | LC 90 · NeetCode | **Duplicates** — sort, then skip siblings |
| 5 | Permutations II | LC 47 | Duplicates in permutations |
| 6 | **Combination Sum** | LC 39 · NeetCode | Reuse allowed — pass `i`, not `i+1` |
| 7 | Combination Sum II | LC 40 · NeetCode | Each used once, with duplicates present |
| 8 | **Word Search** | LC 79 · NeetCode | Backtracking on a grid |
| 9 | Palindrome Partitioning | LC 131 · NeetCode | Backtrack over cut positions |
| 10 | Letter Combinations of a Phone Number | LC 17 · NeetCode | Cartesian product |
| 11 | Generate Parentheses | LC 22 · NeetCode | Pruning by counts, not by validity check |
| 12 | Restore IP Addresses | LC 93 | Heavy pruning |

### Hard

| # | Problem | Source | The point |
|---|---|---|---|
| 13 | **N-Queens** | LC 51 · NeetCode | Constraint sets make the pruning O(1) |
| 14 | Sudoku Solver | LC 37 | Same, with more constraints |
| 15 | Word Search II | LC 212 · NeetCode | Backtracking + a trie |

**If you only do four: 78, 46, 39, 79.**

---

## 5 · Worked example — LC 78, Subsets

```
   nums = [1, 2, 3]

   start=0  path=[]        -> record []
     pick 1: path=[1]      -> record [1]
       pick 2: path=[1,2]  -> record [1,2]
         pick 3: [1,2,3]   -> record
         undo -> [1,2]
       undo -> [1]
       pick 3: path=[1,3]  -> record
       undo -> [1]
     undo -> []
     pick 2: ... and so on

   Every node in the tree is a result -- that is why there is no
   "is it complete?" test.
```

```python
def subsets(nums):
    results = []

    def backtrack(start, path):
        results.append(path[:])         # every node is a subset. COPY.
        for i in range(start, len(nums)):
            path.append(nums[i])
            backtrack(i + 1, path)      # i+1: never reuse or reorder
            path.pop()                  # undo

    backtrack(0, [])
    return results
```

```java
public List<List<Integer>> subsets(int[] nums) {
    List<List<Integer>> results = new ArrayList<>();
    backtrack(nums, 0, new ArrayList<>(), results);
    return results;
}

private void backtrack(int[] nums, int start, List<Integer> path,
                       List<List<Integer>> results) {
    results.add(new ArrayList<>(path));      // COPY, not the live reference
    for (int i = start; i < nums.length; i++) {
        path.add(nums[i]);
        backtrack(nums, i + 1, path, results);
        path.remove(path.size() - 1);        // undo
    }
}
```

**Complexity:** O(2ⁿ × n) — 2ⁿ subsets, each costing O(n) to copy.

---

## 6 · Worked example — LC 90, Subsets II (duplicates)

**Problem:** the input contains duplicates; return unique subsets only.

**The fix, and it generalises to every "with duplicates" variant:** sort, then
**skip a value that equals its previous sibling at the same level**.

```
   nums = [1, 2, 2]  (sorted)

   start=0  []                    record
     i=0  pick 1  -> [1]          record
       i=1  pick 2 -> [1,2]       record
         i=2  pick 2 -> [1,2,2]   record
       i=2  SKIP -- nums[2]==nums[1] and i>start, so [1,2] was
                    already produced by the branch above
     i=1  pick 2  -> [2]          record
       i=2  pick 2 -> [2,2]       record
     i=2  SKIP -- same reason at this level

   results: [], [1], [1,2], [1,2,2], [2], [2,2]
```

```python
def subsets_with_dup(nums):
    nums.sort()                          # duplicates must be adjacent
    results = []

    def backtrack(start, path):
        results.append(path[:])
        for i in range(start, len(nums)):
            # `i > start` is the crucial part: skip only SIBLINGS at this
            # level, never the first occurrence. Using `i > 0` would wrongly
            # skip legitimate repeats deeper in the tree.
            if i > start and nums[i] == nums[i - 1]:
                continue
            path.append(nums[i])
            backtrack(i + 1, path)
            path.pop()

    backtrack(0, [])
    return results
```

**`i > start`, not `i > 0`.** That one condition is the difference between
correct and subtly wrong, and it is worth being able to explain: you are
deduplicating *choices at the same level*, not occurrences in the array.

---

## 7 · Worked example — LC 51, N-Queens

**Problem:** place N queens so none attack each other; return all boards.

**The insight that makes it fast:** three sets give O(1) conflict checking, so
you never scan the board.

```
   A queen at (row, col) attacks:
     the column           col
     the "\" diagonal     row - col   is constant along it
     the "/" diagonal     row + col   is constant along it

   Keep three sets. Placement is valid iff none of the three contain
   the corresponding key. Checking is O(1) instead of O(n).
```

```python
def solve_n_queens(n):
    results = []
    cols, diag, anti = set(), set(), set()
    board = [-1] * n                     # board[row] = column of that row's queen

    def backtrack(row):
        if row == n:
            results.append(["." * c + "Q" + "." * (n - c - 1) for c in board])
            return
        for col in range(n):
            # O(1) conflict test -- the whole reason for the three sets.
            if col in cols or (row - col) in diag or (row + col) in anti:
                continue
            board[row] = col
            cols.add(col); diag.add(row - col); anti.add(row + col)

            backtrack(row + 1)

            cols.remove(col); diag.remove(row - col); anti.remove(row + col)

    backtrack(0)
    return results
```

```java
public List<List<String>> solveNQueens(int n) {
    List<List<String>> results = new ArrayList<>();
    Set<Integer> cols = new HashSet<>(), diag = new HashSet<>(), anti = new HashSet<>();
    int[] board = new int[n];
    backtrack(0, n, board, cols, diag, anti, results);
    return results;
}

private void backtrack(int row, int n, int[] board, Set<Integer> cols,
                       Set<Integer> diag, Set<Integer> anti,
                       List<List<String>> results) {
    if (row == n) {
        List<String> layout = new ArrayList<>();
        for (int c : board) {
            char[] line = new char[n];
            Arrays.fill(line, '.');
            line[c] = 'Q';
            layout.add(new String(line));
        }
        results.add(layout);
        return;
    }
    for (int col = 0; col < n; col++) {
        if (cols.contains(col) || diag.contains(row - col) || anti.contains(row + col)) continue;
        board[row] = col;
        cols.add(col); diag.add(row - col); anti.add(row + col);
        backtrack(row + 1, n, board, cols, diag, anti, results);
        cols.remove(col); diag.remove(row - col); anti.remove(row + col);
    }
}
```

**One queen per row is itself a pruning decision** — it removes an entire
dimension of the search space before the algorithm starts. Mentioning that is
better than only explaining the diagonal keys.

---

## 8 · Pruning — where the performance is

Backtracking is exponential in the worst case; pruning is what makes it usable.
Four kinds, in order of how much they typically save:

| Pruning | Example |
|---|---|
| **Constraint violation** | N-Queens: skip an attacked square |
| **Bound exceeded** | Combination Sum: stop once the running total exceeds the target |
| **Not enough left** | Combinations: stop if fewer than `k − len(path)` candidates remain |
| **Duplicate branch** | Subsets II: skip equal siblings |

**Sorting first often enables the bound prune**, because once one candidate is
too large, every later one is too. That single line frequently turns a timeout
into a pass.

```python
def combination_sum(candidates, target):
    candidates.sort()                    # enables the break below
    results = []

    def backtrack(start, path, remaining):
        if remaining == 0:
            results.append(path[:])
            return
        for i in range(start, len(candidates)):
            if candidates[i] > remaining:
                break                    # sorted -> everything after is worse
            path.append(candidates[i])
            backtrack(i, path, remaining - candidates[i])   # i, not i+1: reuse
            path.pop()

    backtrack(0, [], target)
    return results
```

**`backtrack(i, ...)` versus `backtrack(i + 1, ...)`** is the entire difference
between "each candidate may be reused" and "used once". One character.

---

## 9 · Failure modes

| Bug | Symptom | Fix |
|---|---|---|
| Appending `path` not `path[:]` | All results identical or empty | Copy on record |
| Forgetting to undo | Results contaminated across branches | `path.pop()` after the call |
| `i > 0` instead of `i > start` | Valid results missing | Deduplicate siblings, not occurrences |
| Not sorting before dedup | Duplicates not adjacent | Sort first |
| `i + 1` where `i` was needed | Reuse disallowed by accident | Reuse → `i`; once → `i + 1` |
| No pruning | Times out on larger inputs | Bound checks; sort to enable `break` |
| Mutating shared state without undo | Wrong results, hard to trace | Every mutation needs its inverse |

---

## 10 · Interview questions on this pattern

| Question | What to say |
|---|---|
| ⭐ "What is backtracking?" | DFS over a decision tree with an undo step: choose, explore, undo. It differs from plain DFS by abandoning partial candidates the moment they cannot lead to a solution. |
| "Subsets versus permutations?" | Subsets pass `i + 1` so each element is considered once in order; permutations track a `used` set because order matters and any unused element may come next. |
| ⭐ "How do you handle duplicates?" | Sort so equal values are adjacent, then skip a value equal to its previous **sibling** at the same level — `i > start`, not `i > 0`. You deduplicate choices at a level, not occurrences in the array. |
| "What is the complexity?" | Output-sensitive: O(2ⁿ × n) for subsets, O(n! × n) for permutations — the number of results times the cost of copying each. Pruning improves the constant, not the bound. |
| ⭐ "How do you make N-Queens fast?" | One queen per row removes a dimension, and three sets — column, `row − col`, `row + col` — make conflict checks O(1) instead of scanning the board. |
| "When is it DP instead?" | When you need a count or an optimum rather than the configurations themselves. Enumerating and then counting is exponential work for a polynomial answer. |

---

## Stop condition

You are done with this pattern when you can:

1. type the choose-explore-undo template from memory,
2. say why `path[:]` is required,
3. explain `i > start` versus `i > 0` for duplicates,
4. name the four kinds of pruning, and
5. give the O(1) conflict test for N-Queens.
