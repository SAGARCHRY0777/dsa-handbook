---
title: Union-Find (DSU)
slug: union-find
module: graphs
order: 22
status: live
level: intermediate
summary: The structure for "are these two connected?" — path compression, union by rank, and the problems where it beats DFS outright.
---

# Union-Find (Disjoint Set Union)

> **Recognition in one line:** the problem is about **grouping** or
> **connectivity**, edges arrive **one at a time**, and you never need the actual
> path — only whether two things ended up together.

Twenty lines of code, near-constant time, and it turns several hard-looking
problems into a loop.

---

## 1 · Recognition cues

| Cue | Signal |
|---|---|
| "number of connected components" | Strong — though DFS also works |
| "are these two in the same group?" | Definitive |
| **Edges added incrementally** | **Definitive — DFS would restart each time** |
| "redundant connection" / "detect a cycle" in an undirected graph | Definitive |
| "merge accounts / emails / groups" | Definitive |
| "minimum spanning tree" | Kruskal's needs it |
| "the earliest time everyone is connected" | Definitive |

**The discriminating cue is incrementality.** For a static graph, DFS or BFS
answers connectivity in O(V+E) and you should just do that. But if edges arrive
over time and you must answer after each one, DFS costs O(V+E) *per query* while
union-find costs near O(1).

> **The anti-cue:** if you need the actual path between two nodes, or shortest
> distance, union-find cannot help. It knows *that* two nodes are connected, not
> *how*.

---

## 2 · The structure

Every element points at a parent. Following parents leads to a **root**, and the
root identifies the set. Two elements are in the same set exactly when they have
the same root.

```
Start: everyone is their own parent (n separate sets)

  0   1   2   3   4
  ↺   ↺   ↺   ↺   ↺

union(0,1), union(2,3), union(1,2):

        0
       / \
      1   2
           \
            3        4
                     ↺

find(3) walks 3 -> 2 -> 0. Root is 0.
find(1) walks 1 -> 0.      Root is 0.
Same root -> connected.
```

---

## 3 · The template

```python
class DSU:
    def __init__(self, n):
        self.parent = list(range(n))     # everyone is their own root
        self.rank = [0] * n              # tree height upper bound
        self.count = n                   # number of components

    def find(self, x):
        # Path compression: re-point every node on the path straight at
        # the root, so the next find on any of them is O(1).
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]

    def union(self, a, b):
        ra, rb = self.find(a), self.find(b)
        if ra == rb:
            return False                 # already together -- a CYCLE edge

        # Union by rank: hang the shorter tree under the taller one so
        # the height never grows unnecessarily.
        if self.rank[ra] < self.rank[rb]:
            ra, rb = rb, ra
        self.parent[rb] = ra
        if self.rank[ra] == self.rank[rb]:
            self.rank[ra] += 1

        self.count -= 1
        return True                      # a real merge happened
```

```java
class DSU {
    private final int[] parent, rank;
    int count;

    DSU(int n) {
        parent = new int[n];
        rank = new int[n];
        count = n;
        for (int i = 0; i < n; i++) parent[i] = i;
    }

    int find(int x) {
        // Iterative path compression -- no recursion depth limit.
        int root = x;
        while (parent[root] != root) root = parent[root];
        while (parent[x] != root) {          // second pass re-points
            int next = parent[x];
            parent[x] = root;
            x = next;
        }
        return root;
    }

    boolean union(int a, int b) {
        int ra = find(a), rb = find(b);
        if (ra == rb) return false;          // already connected
        if (rank[ra] < rank[rb]) { int t = ra; ra = rb; rb = t; }
        parent[rb] = ra;
        if (rank[ra] == rank[rb]) rank[ra]++;
        count--;
        return true;
    }
}
```

**Three things carry every problem in this family:**

| Return value | Means |
|---|---|
| `find(a) == find(b)` | They are connected |
| `union` returns `false` | The edge was **redundant** — it closes a cycle |
| `count` | Number of components, maintained for free |

---

## 4 · The two optimisations

**Both are required.** Either one alone leaves you at O(log n); together they
give near-constant time, and being able to say why is a genuine interview point.

### Path compression

```
Before find(4):        After find(4):

  0                      0
  |                     /|\
  1                    1 2 3   4      <- all re-pointed at the root
  |
  2
  |
  3
  |
  4
```

One traversal flattens the whole path. The *next* query on any of those nodes is
a single step.

### Union by rank (or size)

Always hang the smaller tree under the larger. Without it, unioning in a bad
order builds a linked list of length n and `find` degrades to O(n).

**Union by size is equally valid and often more useful** — it maintains the
component size, which many problems ask for directly ("size of the largest
group"). Same guarantee, more information.

> **Complexity:** O(α(n)) amortised per operation, where α is the inverse
> Ackermann function. **α(n) < 5 for any n you can physically store**, so it is
> constant in practice — but say "near-constant, inverse Ackermann" rather than
> "O(1)". The precision is noticed.

---

## 5 · The ladder

### Foundational

| # | Problem | Source | The point |
|---|---|---|---|
| 1 | **Number of Provinces** | LC 547 · NeetCode | The template, bare |
| 2 | Find if Path Exists in Graph | LC 1971 | `find(a) == find(b)` |
| 3 | Number of Connected Components | LC 323 · NeetCode | `count` maintained for free |

### Medium

| # | Problem | Source | The point |
|---|---|---|---|
| 4 | **Redundant Connection** | LC 684 · NeetCode | **`union` returning false is the answer** |
| 5 | Accounts Merge | LC 721 · NeetCode | Union on a non-integer key — map to indices |
| 6 | Number of Islands | LC 200 · NeetCode | DSU works; DFS is simpler — know both, know why |
| 7 | Graph Valid Tree | LC 261 · NeetCode | n−1 edges **and** no cycle |
| 8 | Satisfiability of Equality Equations | LC 990 | Process `==` first, then check `!=` |
| 9 | Most Stones Removed | LC 947 | Answer = n − components |
| 10 | Evaluate Division | LC 399 | **Weighted** DSU — ratios along the path |

### Hard

| # | Problem | Source | The point |
|---|---|---|---|
| 11 | **Number of Islands II** | LC 305 | Incremental — DFS cannot do this efficiently |
| 12 | Swim in Rising Water | LC 778 · NeetCode | Sort by height, union until connected |
| 13 | Min Cost to Connect All Points | LC 1584 · NeetCode | Kruskal's MST |
| 14 | Bricks Falling When Hit | LC 803 | **Process in reverse** — DSU cannot split |
| 15 | Redundant Connection II | LC 685 | Directed — much subtler |

**If you only do four: 547, 684, 721, 305.**

---

## 6 · Worked example — LC 684, Redundant Connection

**Problem:** a tree plus one extra edge. Return the edge that can be removed.

**The insight:** in a tree, every edge connects two *previously separate*
components. So the first edge whose endpoints are **already connected** is the
redundant one — and `union` already tells you that.

```
edges = [[1,2],[1,3],[2,3]]

union(1,2)  roots differ -> merge.        {1,2}  {3}
union(1,3)  roots differ -> merge.        {1,2,3}
union(2,3)  find(2)=find(3)=1  SAME ROOT
            -> this edge closes a cycle -> ANSWER
```

```python
def find_redundant_connection(edges):
    dsu = DSU(len(edges) + 1)             # nodes are 1-indexed
    for a, b in edges:
        if not dsu.union(a, b):           # False = already connected
            return [a, b]
```

```java
public int[] findRedundantConnection(int[][] edges) {
    DSU dsu = new DSU(edges.length + 1);
    for (int[] e : edges) {
        if (!dsu.union(e[0], e[1])) return e;
    }
    return new int[0];
}
```

**Four lines.** The DFS solution requires rebuilding and re-searching the graph
for each candidate edge — this is the clearest case where union-find is not just
an alternative but the right tool.

---

## 7 · Worked example — LC 721, Accounts Merge

**Problem:** each account is a name plus emails. Accounts sharing any email are
the same person. Merge them.

**The mapping trick, which is the transferable idea:** DSU works on integers, so
give every email an index and union emails that appear together.

```
["John", "a@x.com", "b@x.com"]     -> union(a, b)
["John", "b@x.com", "c@x.com"]     -> union(b, c)   now {a,b,c}
["Mary", "m@x.com"]                -> separate

Group emails by root, sort each group, prefix the owner's name.
```

```python
def accounts_merge(accounts):
    email_id = {}                          # email -> index
    email_name = {}                        # email -> owner name

    for name, *emails in accounts:
        for e in emails:
            if e not in email_id:
                email_id[e] = len(email_id)
            email_name[e] = name

    dsu = DSU(len(email_id))
    for _, *emails in accounts:
        # Union every email in an account to the FIRST one. Unioning
        # pairwise would be O(k^2) for no benefit -- one representative
        # per account is enough to connect the whole set.
        first = email_id[emails[0]]
        for e in emails[1:]:
            dsu.union(first, email_id[e])

    groups = defaultdict(list)
    for email, idx in email_id.items():
        groups[dsu.find(idx)].append(email)

    return [[email_name[g[0]]] + sorted(g) for g in groups.values()]
```

**Union to the first element, not pairwise.** Pairwise is O(k²) per account and
achieves nothing extra — connecting everything to one representative already
places the whole account in one set.

---

## 8 · The two things DSU cannot do

**Volunteering these is a strong signal**, because it shows you know the
structure's shape rather than just its API.

### It cannot split

Union-find merges only. There is no `disconnect(a, b)`.

> **The standard workaround is to process in reverse.** LC 803 (Bricks Falling
> When Hit) removes bricks; instead, *add them back* in reverse order and
> observe how the connectivity grows. Any "removal" problem becomes an
> "addition" problem read backwards — and recognising that transformation is the
> whole trick.

### It does not know paths

It answers "same component?" — never "what is the route?" or "how far?". For
those, use BFS or Dijkstra.

**One extension worth knowing: weighted DSU.** Store a weight alongside each
parent pointer representing the ratio or offset to it, and accumulate along the
path during compression. That is how LC 399 (Evaluate Division) works —
`a/b = 2, b/c = 3 ⟹ a/c = 6` falls out of the path product.

---

## 9 · Failure modes

| Bug | Symptom | Fix |
|---|---|---|
| No path compression | TLE on large inputs | Compress in `find` |
| No union by rank/size | TLE; degenerates to a list | Attach smaller under larger |
| Comparing `parent[a] == parent[b]` | Wrong answers | Compare `find(a) == find(b)` — parents are not roots |
| Recursive `find` on 10⁵ nodes | Stack overflow (Java/Python) | Iterative version, or raise the limit |
| Forgetting 1-indexed nodes | Off-by-one crash | Size the arrays `n+1` |
| Unioning pairwise in a group | O(k²) | Union all to one representative |
| Using DSU on a static graph | Works, but over-complicated | DFS is simpler — say so |

**`parent[a] == parent[b]` is the classic bug.** Two nodes can share a root
without sharing an immediate parent. Always compare roots.

---

## 10 · Interview questions

| Question | What to say |
|---|---|
| ⭐ "When union-find over DFS?" | When edges arrive incrementally and I have to answer connectivity after each one — DFS is O(V+E) per query, DSU is near-constant. For a static graph, DFS is simpler and I would use it. |
| ⭐ "What is the complexity?" | O(α(n)) amortised with both path compression and union by rank, where α is the inverse Ackermann function — under 5 for any storable n, so constant in practice. With only one of the two optimisations it is O(log n). |
| "Why is union by rank needed if you have compression?" | Compression flattens paths you have already walked, but a bad union order can still build a long chain before anyone walks it. Rank prevents the chain from forming. |
| ⭐ "How do you detect a cycle?" | If `union` finds both endpoints already share a root, that edge closes a cycle. For an undirected graph that is the whole algorithm — LC 684 is four lines. |
| "Can you undo a union?" | Not in the basic structure — it only merges. The standard trick is to process removals in reverse so deletions become insertions. If you genuinely need deletion, that is a different structure, like link-cut trees. |
| "How do you union non-integer things?" | Map each distinct key to an index first — a dictionary from email or string to an integer — then run ordinary DSU on the indices. |
| "Count components?" | Start the counter at n and decrement on every successful union. It is maintained for free. |

---

## Stop condition

You know this pattern when you can:

1. write the DSU class from memory, both optimisations included,
2. say why incremental edges are the discriminating cue,
3. use `union` returning false to detect a cycle,
4. state the complexity as inverse Ackermann and say why both optimisations matter,
5. explain the reverse-processing trick for deletions, and
6. avoid the `parent[a] == parent[b]` bug.
