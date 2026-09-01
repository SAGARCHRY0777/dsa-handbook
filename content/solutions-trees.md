---
title: Solutions — trees
slug: solutions-trees
module: solutions
order: 62
status: live
level: worst → best
summary: Five tree problems from naive to optimal, in Python and Java, including the recursion-depth follow-up.
---

# Solutions — trees

Same format: worst first, each improvement justified, both languages.

```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val, self.left, self.right = val, left, right
```

```java
class TreeNode {
    int val; TreeNode left, right;
    TreeNode(int val) { this.val = val; }
}
```

---

## LC 104 · Maximum Depth

### Approach 1 — recursive DFS · O(n) time, O(h) space ✅

Already optimal in time. The only question is the space.

```python
def max_depth(root):
    if not root:
        return 0
    return 1 + max(max_depth(root.left), max_depth(root.right))
```

```java
public int maxDepth(TreeNode root) {
    if (root == null) return 0;
    return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}
```

### Approach 2 — iterative BFS · O(n) time, O(w) space

Where `w` is the maximum width. **Use this when the follow-up is "what if the
tree is a million nodes deep?"** — recursion would blow the stack.

```python
from collections import deque

def max_depth(root):
    if not root:
        return 0
    depth, queue = 0, deque([root])
    while queue:
        for _ in range(len(queue)):          # one full level per iteration
            node = queue.popleft()
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        depth += 1
    return depth
```

```java
public int maxDepth(TreeNode root) {
    if (root == null) return 0;
    Deque<TreeNode> queue = new ArrayDeque<>();
    queue.add(root);
    int depth = 0;
    while (!queue.isEmpty()) {
        int levelSize = queue.size();        // snapshot BEFORE adding children
        for (int i = 0; i < levelSize; i++) {
            TreeNode node = queue.poll();
            if (node.left != null) queue.add(node.left);
            if (node.right != null) queue.add(node.right);
        }
        depth++;
    }
    return depth;
}
```

> *"Recursion is O(h) stack space, which is O(n) for a skewed tree. Python's
> default recursion limit is around 1000, so for a deep tree I would go
> iterative."*

---

## LC 98 · Validate BST

### Approach 1 — compare each node to its children · **WRONG**

Worth writing precisely because it is the trap, and saying why it fails earns
more than avoiding it silently.

```python
def is_valid_bst(root):                      # INCORRECT -- do not ship this
    if not root:
        return True
    if root.left and root.left.val >= root.val:
        return False
    if root.right and root.right.val <= root.val:
        return False
    return is_valid_bst(root.left) and is_valid_bst(root.right)
```

Fails on `[10, 5, 15, null, null, 6, 20]`: the node `6` is a valid right child
of `15`, but it sits in the right subtree of `10` and is smaller than `10`.

### Approach 2 — bounds passed down · O(n) time, O(h) space ✅

```python
def is_valid_bst(root):
    def check(node, low, high):
        if not node:
            return True
        if not (low < node.val < high):
            return False
        # Going left tightens the upper bound; going right the lower.
        return check(node.left, low, node.val) and check(node.right, node.val, high)

    return check(root, float("-inf"), float("inf"))
```

```java
public boolean isValidBST(TreeNode root) {
    // Long, not int: a node may legitimately hold Integer.MIN_VALUE, and an
    // int sentinel would then produce a false negative.
    return check(root, Long.MIN_VALUE, Long.MAX_VALUE);
}

private boolean check(TreeNode node, long low, long high) {
    if (node == null) return true;
    if (node.val <= low || node.val >= high) return false;
    return check(node.left, low, node.val) && check(node.right, node.val, high);
}
```

### Approach 3 — in-order traversal · O(n) time, O(h) space ✅

A valid BST is strictly increasing in-order. Offering both shows you know *why*
in-order matters for BSTs.

```python
def is_valid_bst(root):
    previous = None

    def inorder(node):
        nonlocal previous
        if not node:
            return True
        if not inorder(node.left):
            return False
        if previous is not None and node.val <= previous:
            return False
        previous = node.val
        return inorder(node.right)

    return inorder(root)
```

> **The Java `Long` detail is a real bug source.** Using `Integer.MIN_VALUE` as
> the sentinel breaks on a tree whose root is `Integer.MIN_VALUE`. Python's
> `float("-inf")` has no such problem.

---

## LC 236 · Lowest Common Ancestor

### Approach 1 — find both paths, compare · O(n) time, O(n) space

Find the root-to-node path for each, then walk both until they diverge. Correct,
more code, more space.

```python
def lowest_common_ancestor(root, p, q):
    def path_to(node, target, path):
        if not node:
            return None
        path.append(node)
        if node is target or path_to(node.left, target, path) \
                or path_to(node.right, target, path):
            return path
        path.pop()
        return None

    path_p, path_q = path_to(root, p, []), path_to(root, q, [])
    best = None
    for a, b in zip(path_p, path_q):
        if a is b:
            best = a
        else:
            break
    return best
```

### Approach 2 — single recursion · O(n) time, O(h) space ✅

```python
def lowest_common_ancestor(root, p, q):
    # Three base cases in one line: empty, or we found a target. Returning the
    # node itself is what lets an ancestor detect the find.
    if not root or root is p or root is q:
        return root

    left = lowest_common_ancestor(root.left, p, q)
    right = lowest_common_ancestor(root.right, p, q)

    if left and right:
        return root            # targets in different subtrees -> this is the LCA
    return left or right        # both on one side -- pass the find upward
```

```java
public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
    if (root == null || root == p || root == q) return root;

    TreeNode left = lowestCommonAncestor(root.left, p, q);
    TreeNode right = lowestCommonAncestor(root.right, p, q);

    if (left != null && right != null) return root;
    return left != null ? left : right;
}
```

> *"The function returns either the LCA or a found target, and `left && right`
> distinguishes them without any extra state — which is why six lines suffice."*

---

## LC 102 · Level Order Traversal

### Approach 1 — BFS with a queue · O(n) time, O(w) space ✅

```python
from collections import deque

def level_order(root):
    if not root:
        return []
    levels, queue = [], deque([root])
    while queue:
        level = []
        for _ in range(len(queue)):     # freeze this level's size first
            node = queue.popleft()
            level.append(node.val)
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        levels.append(level)
    return levels
```

```java
public List<List<Integer>> levelOrder(TreeNode root) {
    List<List<Integer>> levels = new ArrayList<>();
    if (root == null) return levels;

    Deque<TreeNode> queue = new ArrayDeque<>();
    queue.add(root);
    while (!queue.isEmpty()) {
        int size = queue.size();        // snapshot -- children are added below
        List<Integer> level = new ArrayList<>();
        for (int i = 0; i < size; i++) {
            TreeNode node = queue.poll();
            level.add(node.val);
            if (node.left != null) queue.add(node.left);
            if (node.right != null) queue.add(node.right);
        }
        levels.add(level);
    }
    return levels;
}
```

### Approach 2 — DFS carrying a depth · O(n) time, O(h) space

Also valid, and better when you only need one value per level.

```python
def level_order(root):
    levels = []

    def dfs(node, depth):
        if not node:
            return
        if depth == len(levels):
            levels.append([])          # first node seen at this depth
        levels[depth].append(node.val)
        dfs(node.left, depth + 1)
        dfs(node.right, depth + 1)

    dfs(root, 0)
    return levels
```

**In Java, use `ArrayDeque`, not `LinkedList`.** Both implement `Deque`, but
`ArrayDeque` is faster and is the idiomatic choice — a small signal of knowing
the collections library.

---

## LC 124 · Binary Tree Maximum Path Sum

### Approach 1 — every node as a turning point, recomputing · O(n²)

For each node, compute the best downward path in each subtree from scratch.

### Approach 2 — one pass, two quantities · O(n) time, O(h) space ✅

```python
def max_path_sum(root):
    best = float("-inf")

    def gain(node):
        nonlocal best
        if not node:
            return 0

        # Clamp negatives to zero: a subtree that reduces the total is simply
        # not taken. This removes a pile of special cases.
        left = max(gain(node.left), 0)
        right = max(gain(node.right), 0)

        # Candidate answer: the path that TURNS here, using both children.
        best = max(best, node.val + left + right)

        # Handed upward: only ONE side, because a path cannot fork.
        return node.val + max(left, right)

    gain(root)
    return best
```

```java
private int best;

public int maxPathSum(TreeNode root) {
    best = Integer.MIN_VALUE;
    gain(root);
    return best;
}

private int gain(TreeNode node) {
    if (node == null) return 0;
    int left = Math.max(gain(node.left), 0);
    int right = Math.max(gain(node.right), 0);
    best = Math.max(best, node.val + left + right);   // turns here
    return node.val + Math.max(left, right);          // extends upward
}
```

> *"There are two different quantities. The best path through this node uses
> both children and cannot be extended upward. The best path I can hand to my
> parent uses only one, because a path cannot fork. So I return one and track
> the other."*

**That distinction is the entire problem.** Say it before writing code.

---

## Recursion depth — the follow-up to be ready for

| Language | Default limit | What to do |
|---|---|---|
| Python | ~1000 frames | `sys.setrecursionlimit`, or go iterative |
| Java | ~10,000+ frames (stack-size dependent) | Iterative, or increase `-Xss` |

**Iterative in-order, worth knowing cold:**

```python
def inorder(root):
    out, stack, node = [], [], root
    while stack or node:
        while node:                # push the entire left spine
            stack.append(node)
            node = node.left
        node = stack.pop()
        out.append(node.val)       # visit
        node = node.right          # then move right and repeat
    return out
```

```java
public List<Integer> inorderTraversal(TreeNode root) {
    List<Integer> out = new ArrayList<>();
    Deque<TreeNode> stack = new ArrayDeque<>();
    TreeNode node = root;
    while (node != null || !stack.isEmpty()) {
        while (node != null) {
            stack.push(node);
            node = node.left;
        }
        node = stack.pop();
        out.add(node.val);
        node = node.right;
    }
    return out;
}
```

**Offering the iterative version unprompted, when the tree could be deep, is a
genuine seniority signal** — it shows you are thinking about the input the
interviewer has not mentioned yet.
