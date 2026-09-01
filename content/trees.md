---
title: Trees
slug: trees
module: graphs
order: 20
status: live
level: basic → advanced
summary: Recursion with a base case — four traversals, the BST property, and the "what do I need from my children?" question that solves most tree problems.
---

# Trees

> **Recognition in one line:** the structure is hierarchical, and almost every
> problem reduces to *"what do I need from my left and right subtrees to answer
> this at the current node?"*

Trees are where recursion becomes fluent, and that fluency is what makes graphs
and dynamic programming feel manageable later. Do not skip them to get to DP.

---

## 1 · Recognition cues

| Cue | What to use |
|---|---|
| "level by level", "each level", "level order" | **BFS** with a queue |
| "depth", "height", "path from root to leaf" | **DFS**, usually recursive |
| "binary **search** tree" | In-order traversal is **sorted** — exploit it |
| "validate BST" | Pass down min/max bounds, do not just compare neighbours |
| "lowest common ancestor" | Bottom-up recursion returning found-ness |
| "serialise / deserialise" | Pre-order with explicit null markers |
| "path sum" | DFS carrying a running total |
| "k-th smallest in a BST" | In-order with a counter, stop early |

**The universal question:** at a node, what do I need from my children?

- A single value (height, sum, count) → return it up
- Two things (e.g. "best path through me" *and* "best path I can extend upward")
  → return one, track the other in a nonlocal variable. **This is the LC 124
  pattern and it recurs constantly.**

---

## 2 · The templates

```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val, self.left, self.right = val, left, right
```

```python
# DFS -- the shape of nearly every tree problem
def depth(node):
    if not node:               # base case FIRST, always
        return 0
    return 1 + max(depth(node.left), depth(node.right))
```

```python
# BFS -- level order. The `for _ in range(len(queue))` is what separates levels.
from collections import deque

def level_order(root):
    if not root:
        return []
    levels, queue = [], deque([root])
    while queue:
        level = []
        for _ in range(len(queue)):    # snapshot THIS level's size first
            node = queue.popleft()
            level.append(node.val)
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        levels.append(level)
    return levels
```

**That `for _ in range(len(queue))` is the whole trick.** Capturing the length
before the loop freezes the current level; without it you consume nodes you just
added and the levels merge.

```python
# THE FOUR TRAVERSALS -- know what each is FOR, not just the order
def preorder(node,  out):            # root, left, right   -> copy / serialise
    if node:
        out.append(node.val); preorder(node.left, out); preorder(node.right, out)

def inorder(node, out):              # left, root, right   -> SORTED for a BST
    if node:
        inorder(node.left, out); out.append(node.val); inorder(node.right, out)

def postorder(node, out):            # left, right, root   -> delete / bottom-up
    if node:
        postorder(node.left, out); postorder(node.right, out); out.append(node.val)
```

| Traversal | Use it for |
|---|---|
| **Pre-order** | Serialising, copying — you need the root before the children |
| **In-order** | Anything BST — it yields sorted order, which is the key property |
| **Post-order** | Anything needing children's results first: heights, deletion, bottom-up DP |
| **Level order (BFS)** | Anything about levels, or shortest path in an unweighted tree |

---

## 3 · The ladder

### Easy — recursion fluency

| # | Problem | Source | The point |
|---|---|---|---|
| 1 | Maximum Depth of Binary Tree | LC 104 · NeetCode | The base case habit |
| 2 | Invert Binary Tree | LC 226 · NeetCode | Three lines; famous for the wrong reason |
| 3 | Same Tree | LC 100 | Parallel recursion on two trees |
| 4 | Symmetric Tree | LC 101 | Same Tree against a mirrored self |
| 5 | Diameter of Binary Tree | LC 543 · NeetCode | **First "return one thing, track another"** |

### Medium — where interviews live

| # | Problem | Source | The point |
|---|---|---|---|
| 6 | **Binary Tree Level Order Traversal** | LC 102 · NeetCode | The BFS template |
| 7 | **Validate BST** | LC 98 · NeetCode | Bounds passed down. The classic trap |
| 8 | **LCA of a Binary Tree** | LC 236 · NeetCode | Bottom-up found-ness |
| 9 | LCA of a BST | LC 235 | Much easier — use the ordering |
| 10 | Kth Smallest in a BST | LC 230 · NeetCode | In-order with early exit |
| 11 | Construct Tree from Preorder+Inorder | LC 105 · NeetCode | Index map to avoid O(n²) |
| 12 | Right Side View | LC 199 · NeetCode | BFS, last of each level |
| 13 | Path Sum II | LC 113 | DFS with backtracking on the path list |

### Hard

| # | Problem | Source | The point |
|---|---|---|---|
| 14 | **Binary Tree Maximum Path Sum** | LC 124 · NeetCode | The two-values pattern, fully |
| 15 | Serialise and Deserialise | LC 297 · NeetCode | Null markers are the whole problem |

**If you only do four: 102, 98, 236, 124.**

---

## 4 · Worked example — LC 98, Validate BST

**Problem:** is this a valid binary search tree?

**The trap that catches almost everyone:** checking only `left.val < node.val <
right.val` is wrong. The BST property is about *entire subtrees*, not immediate
children.

```
          10
         /  \
        5    15
            /  \
           6    20        <- 6 < 15 so the LOCAL check passes
                             but 6 is in the RIGHT subtree of 10
                             and 6 < 10  ->  NOT a valid BST

   The local comparison cannot see this. Bounds can.
```

```
   Pass an allowed (low, high) range DOWN the tree:

   node 10   range (-inf, +inf)     ok
     left  5   range (-inf, 10)     ok
     right 15  range (10, +inf)     ok
       left  6   range (10, 15)  -> 6 is NOT > 10  ->  INVALID
```

```python
def is_valid_bst(root) -> bool:
    def check(node, low, high) -> bool:
        if not node:
            return True                      # empty subtree is valid
        # Strict inequalities: BSTs here do not permit duplicates.
        if not (low < node.val < high):
            return False
        # Going left tightens the UPPER bound; going right tightens the LOWER.
        return check(node.left, low, node.val) and check(node.right, node.val, high)

    return check(root, float("-inf"), float("inf"))
```

**Complexity:** O(n) time, O(h) space for the recursion stack — O(log n) balanced,
O(n) in the worst case.

**The alternative worth mentioning:** an in-order traversal of a valid BST is
strictly increasing, so you can traverse in-order and check each value exceeds
the previous. Same complexity, and offering both shows you know *why* in-order
matters for BSTs.

---

## 5 · Worked example — LC 236, Lowest Common Ancestor

**Problem:** the lowest node having both `p` and `q` as descendants.

**The insight:** recurse, and let each node report whether it found anything
below. A node is the LCA when both sides report a find — or when it is itself
one of the targets and the other is below.

```
              3
            /   \
           5     1
          / \   / \
         6   2 0   8
            / \
           7   4

   LCA(5, 1):
     node 3: left subtree returns 5 (found), right returns 1 (found)
             -> BOTH sides non-null -> 3 IS the LCA

   LCA(5, 4):
     node 5: is itself a target -> return 5 immediately
     node 2: finds 4 below -> returns 4
     node 3: left returns 5, right returns None -> pass 5 up
             -> answer 5   (a node can be its own ancestor)
```

```python
def lowest_common_ancestor(root, p, q):
    # Three base cases in one line: empty, or we hit one of the targets.
    # Returning the node itself is what lets an ancestor detect the find.
    if not root or root is p or root is q:
        return root

    left = lowest_common_ancestor(root.left, p, q)
    right = lowest_common_ancestor(root.right, p, q)

    if left and right:
        return root          # targets are in different subtrees -> this is it
    return left or right      # both in one subtree -- pass the find upward
```

**Complexity:** O(n) time, O(h) space.

**The elegance is worth pointing out in an interview:** the function returns
either the LCA or a found target, and the `left and right` test distinguishes
them without any extra state. Being able to explain *why* six lines suffice
scores better than a longer solution with explicit flags.

---

## 6 · Worked example — LC 124, Maximum Path Sum

The hard one, and the fullest expression of the two-values pattern.

**Problem:** maximum sum of any path. A path can start and end anywhere and need
not pass through the root.

**The two quantities**, and conflating them is the whole difficulty:

```
   at each node, there are TWO different numbers:

   1. the best path THROUGH this node        left + node + right
      -> this could be the global answer
      -> but it CANNOT be extended upward (it already uses both children)

   2. the best path I can HAND UPWARD        node + max(left, right)
      -> a parent can extend this
      -> only one child, because a path cannot fork
```

```
        -10
        /  \
       9    20
           /  \
          15   7

   node 15: gain = 15, through = 15
   node 7:  gain = 7,  through = 7
   node 20: gain = 20 + max(15, 7) = 35
            through = 15 + 20 + 7 = 42        <- global best
   node 9:  gain = 9,  through = 9
   node -10: gain = -10 + max(9, 35) = 25
             through = 9 + (-10) + 35 = 34

   answer 42
```

```python
def max_path_sum(root) -> int:
    best = float("-inf")

    def gain(node) -> int:
        nonlocal best
        if not node:
            return 0

        # Clamp negatives to zero: a subtree that hurts the total is simply
        # not taken. This is what removes a pile of special cases.
        left = max(gain(node.left), 0)
        right = max(gain(node.right), 0)

        # Candidate answer: the path that turns at this node, using both sides.
        best = max(best, node.val + left + right)

        # What we hand upward: only ONE side, because a path cannot fork.
        return node.val + max(left, right)

    gain(root)
    return best
```

**Complexity:** O(n) time, O(h) space.

**The `max(..., 0)` clamp is the detail to narrate.** Without it you need
explicit checks for negative subtrees; with it, "a subtree that would reduce the
total is simply not included" handles every case.

---

## 7 · Same problem in disguise

| Problem | Really is |
|---|---|
| Diameter of Binary Tree (LC 543) | LC 124 counting edges instead of summing values |
| Longest Univalue Path (LC 687) | LC 124 with an equality condition on the extension |
| Max Depth (LC 104) | The `gain` half of LC 124, without the tracking |
| Symmetric Tree (LC 101) | Same Tree (LC 100) against a mirrored copy |
| Right Side View (LC 199) | Level order, keeping the last of each level |
| Average of Levels (LC 637) | Level order, aggregating differently |
| Kth Smallest in BST (LC 230) | In-order traversal with an early exit |
| Validate BST (LC 98) | In-order traversal checking strict increase |

**LC 543, 687 and 124 are the same function** with a different quantity being
maximised. Solve 124 properly and the other two are ten-minute problems.

---

## 8 · Failure modes

| Bug | Symptom | Fix |
|---|---|---|
| Missing base case | `AttributeError` on `None` | `if not node: return ...` first, always |
| Comparing only immediate children in LC 98 | Passes the local test, wrong tree | Pass bounds down |
| Forgetting the level-size snapshot in BFS | Levels merge | `for _ in range(len(queue))` |
| Returning both values in LC 124 | Confused recursion | Return one; track the other with `nonlocal` |
| Not clamping negative gains | Wrong answer on negative subtrees | `max(gain(child), 0)` |
| Rebuilding trees with `index()` (LC 105) | O(n²) | Precompute a value → index map |
| Deep recursion in Python | `RecursionError` at ~1000 | Iterative with an explicit stack, or raise the limit |

---

## 9 · Interview questions on this pattern

| Question | What to say |
|---|---|
| ⭐ "Validate a BST." | Pass down a permitted (low, high) range; comparing only immediate children is wrong because the property is about whole subtrees. Or traverse in-order and check strict increase. |
| "Why in-order for BSTs?" | In-order visits a BST in sorted order. That single fact solves validation, k-th smallest, and converting to a sorted list. |
| ⭐ "Explain your LCA solution." | Each call returns the LCA if found, or a target if it is one. When both children return non-null the targets are in different subtrees, so this node is the LCA; otherwise pass the find upward. |
| "Iterative in-order traversal?" | An explicit stack: push left spine, pop and visit, then move to the right child and repeat. Worth knowing for the recursion-depth follow-up. |
| ⭐ "Why does LC 124 track two values?" | The best path *through* a node uses both children and cannot be extended upward; the best path to *hand upward* can use only one, because paths do not fork. Different quantities, so one is returned and one is tracked. |
| "Serialise a binary tree." | Pre-order with explicit null markers. Without the markers the structure is not recoverable, since many trees share a traversal sequence. |

---

## Stop condition

You are done with this pattern when you can:

1. write DFS and BFS templates cold, with the level-size snapshot,
2. say what each traversal is *for*, not just its order,
3. explain why local comparison fails for BST validation,
4. articulate the two quantities in LC 124, and
5. give the iterative in-order traversal when asked about recursion depth.
