---
title: Graphs
slug: graphs
module: graphs
order: 21
status: live
level: basic → advanced
summary: BFS, DFS, topological sort and union-find — plus the recognition that most grid problems are graph problems wearing a costume.
---

# Graphs

> **Recognition in one line:** things are connected to other things, and you
> need to know what is reachable, in what order, or how far.

The most common miss is not knowing an algorithm — it is failing to notice that
a grid, a set of course prerequisites, or a list of equivalent accounts **is a
graph**. Once you see the graph, the algorithm is usually the easy part.

---

## 1 · Recognition cues

| Cue | Algorithm |
|---|---|
| "shortest path", **unweighted** | **BFS** — the first time you reach a node is the shortest way |
| "shortest path", **weighted, non-negative** | Dijkstra (heap) |
| "is there a path / are these connected?" | DFS or union-find |
| "number of islands / regions / provinces" | Connected components — DFS, BFS or union-find |
| "prerequisites", "build order", "dependencies" | **Topological sort** |
| "detect a cycle" (directed) | DFS with three colours, or Kahn's algorithm |
| "detect a cycle" (undirected) | Union-find, or DFS tracking the parent |
| "group accounts / merge equivalences" | **Union-find** |
| "minimum spanning tree", "connect all at least cost" | Kruskal or Prim |
| **A grid with movement between cells** | **A graph.** Neighbours are the four or eight adjacent cells |

> **The grid realisation is the highest-value one on this page.** "Number of
> islands", "rotting oranges", "walls and gates", "shortest path in a binary
> matrix" are all standard BFS/DFS with `(row, col)` as the node id and the four
> directions as edges. Once you see that, a whole category becomes routine.

---

## 2 · The templates

```python
from collections import deque, defaultdict

# BFS -- shortest path in an UNWEIGHTED graph, and level-by-level anything
def bfs(start, neighbours):
    seen = {start}
    queue = deque([(start, 0)])            # (node, distance)
    while queue:
        node, dist = queue.popleft()
        for nxt in neighbours(node):
            if nxt not in seen:
                seen.add(nxt)              # mark on ENQUEUE, not on dequeue,
                queue.append((nxt, dist + 1))   # or nodes enter the queue twice
    return seen
```

**Marking as seen on enqueue rather than dequeue is the single most common BFS
bug.** Mark late and a node can be added by several neighbours before it is
processed, which turns O(V+E) into something much worse and can produce wrong
distances.

```python
# DFS -- reachability, components, cycles
def dfs(node, graph, seen):
    seen.add(node)
    for nxt in graph[node]:
        if nxt not in seen:
            dfs(nxt, graph, seen)
```

```python
# GRID BFS -- the pattern that covers a whole category
def grid_bfs(grid, starts):
    rows, cols = len(grid), len(grid[0])
    queue = deque(starts)
    seen = set(starts)
    steps = 0
    while queue:
        for _ in range(len(queue)):        # one full level per step
            r, c = queue.popleft()
            for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                nr, nc = r + dr, c + dc
                if 0 <= nr < rows and 0 <= nc < cols and (nr, nc) not in seen \
                        and grid[nr][nc] != BLOCKED:
                    seen.add((nr, nc))
                    queue.append((nr, nc))
        steps += 1
    return steps
```

```python
# TOPOLOGICAL SORT -- Kahn's. Also detects cycles for free.
def topological_order(n, edges):
    graph = defaultdict(list)
    indegree = [0] * n
    for a, b in edges:                     # edge a -> b means a before b
        graph[a].append(b)
        indegree[b] += 1

    queue = deque(i for i in range(n) if indegree[i] == 0)
    order = []
    while queue:
        node = queue.popleft()
        order.append(node)
        for nxt in graph[node]:
            indegree[nxt] -= 1
            if indegree[nxt] == 0:
                queue.append(nxt)

    # If some nodes never reached indegree 0, they are in a cycle.
    return order if len(order) == n else []
```

```python
# UNION-FIND -- grouping, connectivity, cycle detection in undirected graphs
class DSU:
    def __init__(self, n):
        self.parent = list(range(n))
        self.size = [1] * n

    def find(self, x):
        # Path compression: point every node on the path straight at the root.
        while self.parent[x] != x:
            self.parent[x] = self.parent[self.parent[x]]
            x = self.parent[x]
        return x

    def union(self, a, b) -> bool:
        ra, rb = self.find(a), self.find(b)
        if ra == rb:
            return False                   # already joined -> this edge is a cycle
        # Union by size keeps the tree shallow. With path compression this gives
        # near-constant amortised time.
        if self.size[ra] < self.size[rb]:
            ra, rb = rb, ra
        self.parent[rb] = ra
        self.size[ra] += self.size[rb]
        return True
```

---

## 3 · The ladder

### Easy / warm-up

| # | Problem | Source | The point |
|---|---|---|---|
| 1 | **Number of Islands** | LC 200 · NeetCode | The canonical grid-as-graph |
| 2 | Flood Fill | LC 733 | DFS on a grid, bare |
| 3 | Max Area of Island | LC 695 | Components, returning a size |

### Medium — the core

| # | Problem | Source | The point |
|---|---|---|---|
| 4 | **Rotting Oranges** | LC 994 · NeetCode | **Multi-source BFS** — all sources start at distance 0 |
| 5 | **Course Schedule** | LC 207 · NeetCode | Cycle detection = topological sort |
| 6 | Course Schedule II | LC 210 · NeetCode | The order itself |
| 7 | Clone Graph | LC 133 · NeetCode | Map old node → new node while traversing |
| 8 | Pacific Atlantic Water Flow | LC 417 · NeetCode | **Reverse the problem** — flow outward from the edges |
| 9 | Number of Provinces | LC 547 | Union-find, or components |
| 10 | Surrounded Regions | LC 130 | Mark from the border, then flip |
| 11 | Word Ladder | LC 127 · NeetCode | BFS over an implicit graph of words |
| 12 | Redundant Connection | LC 684 | Union-find: the first edge that fails to union |
| 13 | Network Delay Time | LC 743 | Dijkstra with a heap |

### Hard

| # | Problem | Source | The point |
|---|---|---|---|
| 14 | Alien Dictionary | LC 269 · NeetCode | Build the graph from the input, then topo sort |
| 15 | Word Ladder II | LC 126 | BFS for distances, DFS to reconstruct all paths |
| 16 | Swim in Rising Water | LC 778 | Dijkstra, or binary search plus BFS |

**If you only do four: 200, 994, 207, 417.**

---

## 4 · Worked example — LC 994, Rotting Oranges

**Problem:** rotten oranges infect adjacent fresh ones each minute. How many
minutes until none are fresh, or −1 if impossible?

**Recognise:** "how many minutes" in a grid, spreading uniformly → BFS. The
twist is that there are **many starting points**, all at time zero.

```
   grid          minute 0        minute 1        minute 2

   2 1 1          R F F           R R F           R R R
   1 1 0    ->    F F .    ->     R F .    ->     R R .
   0 1 1          . F F           . F F           . R F   ... continues

   Put ALL rotten cells in the queue before starting. They are all
   distance 0, so BFS explores the true simultaneous frontier.

   Starting one BFS per rotten orange would be wrong AND slower --
   it would compute distances from each source independently rather
   than the minimum over all sources.
```

```python
from collections import deque

def oranges_rotting(grid: list[list[int]]) -> int:
    rows, cols = len(grid), len(grid[0])
    queue = deque()
    fresh = 0

    # Seed EVERY rotten cell. This is what makes it multi-source BFS, and it
    # is the only change from ordinary BFS.
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 2:
                queue.append((r, c))
            elif grid[r][c] == 1:
                fresh += 1

    if fresh == 0:
        return 0                       # nothing to rot -- 0, not -1

    minutes = 0
    while queue and fresh:
        # One level per minute. Snapshot the size, as with tree level-order.
        for _ in range(len(queue)):
            r, c = queue.popleft()
            for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                nr, nc = r + dr, c + dc
                if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 1:
                    grid[nr][nc] = 2      # mark on enqueue
                    fresh -= 1
                    queue.append((nr, nc))
        minutes += 1

    return minutes if fresh == 0 else -1
```

**Complexity:** O(rows × cols) time and space.

**Two edge cases interviewers check:** no fresh oranges at all → return 0, not
−1; and fresh oranges unreachable from any rotten one → return −1.

---

## 5 · Worked example — LC 207, Course Schedule

**Problem:** given prerequisites, can all courses be finished?

**Recognise:** "prerequisites" → directed graph. "Can all be finished" → **is
there a cycle?** A cycle means a course transitively requires itself.

```
   n = 4, prerequisites = [[1,0], [2,1], [3,2], [1,3]]
   edge [a, b] means b must come before a

   graph:  0 -> 1 -> 2 -> 3
                ^         |
                +---------+       CYCLE

   Kahn's algorithm:
     indegree: 0:0  1:2  2:1  3:1
     queue starts with nodes of indegree 0 -> [0]
     pop 0 -> indegree[1] becomes 1  (not 0, so not enqueued)
     queue empty. processed 1 of 4 nodes  ->  CYCLE  ->  False
```

```python
from collections import deque, defaultdict

def can_finish(num_courses: int, prerequisites: list[list[int]]) -> bool:
    graph = defaultdict(list)
    indegree = [0] * num_courses
    for course, prereq in prerequisites:
        graph[prereq].append(course)        # prereq -> course
        indegree[course] += 1

    queue = deque(i for i in range(num_courses) if indegree[i] == 0)
    processed = 0

    while queue:
        node = queue.popleft()
        processed += 1
        for nxt in graph[node]:
            indegree[nxt] -= 1
            if indegree[nxt] == 0:
                queue.append(nxt)

    # Any node never reaching indegree 0 is stuck behind a cycle.
    return processed == num_courses
```

**Complexity:** O(V + E).

**Say the reframing out loud:** *"Finishing all courses is possible exactly when
the prerequisite graph is a DAG, so this is cycle detection. Kahn's algorithm
gives me that and the ordering together."* Naming the reframing is the skill
being tested; the code is standard.

---

## 6 · Worked example — LC 417, Pacific Atlantic Water Flow

**Problem:** water flows from a cell to equal-or-lower neighbours. Find cells
from which water can reach both oceans.

**The insight, and it is the whole problem: reverse the flow.** Instead of
asking "from this cell, can I reach an ocean?" for every cell — which is O(n²)
searches — start *at each ocean* and walk **uphill**, marking everything that
can drain there. Then intersect.

```
   heights          Pacific reaches (from top/left, going uphill)
   1 2 2 3 5        P P P P P
   3 2 3 4 4        P P P P P
   2 4 5 3 1        P P P . .
   6 7 1 4 5        P P . . .
   5 1 1 2 4        P . . . .

                    Atlantic reaches (from bottom/right, uphill)
                    . . . . A
                    . . . A A
                    . . A A A
                    . A A A A
                    A A A A A

   intersection -> cells that drain to BOTH
```

```python
def pacific_atlantic(heights: list[list[int]]) -> list[list[int]]:
    if not heights:
        return []
    rows, cols = len(heights), len(heights[0])

    def climb(starts: list[tuple[int, int]]) -> set:
        """Walk UPHILL from the ocean edges. Anything reached can drain here."""
        seen = set(starts)
        stack = list(starts)
        while stack:
            r, c = stack.pop()
            for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                nr, nc = r + dr, c + dc
                # Reversed condition: we move to a neighbour that is HIGHER or
                # equal, because in the real direction water would flow down
                # from there to here.
                if 0 <= nr < rows and 0 <= nc < cols and (nr, nc) not in seen \
                        and heights[nr][nc] >= heights[r][c]:
                    seen.add((nr, nc))
                    stack.append((nr, nc))
        return seen

    pacific = climb([(0, c) for c in range(cols)] + [(r, 0) for r in range(rows)])
    atlantic = climb([(rows - 1, c) for c in range(cols)]
                     + [(r, cols - 1) for r in range(rows)])

    return [list(cell) for cell in pacific & atlantic]
```

**Complexity:** O(rows × cols) — two traversals, not one per cell.

**"Reverse the problem" is a transferable move.** It also solves Surrounded
Regions (mark from the border rather than testing each region) and Walls and
Gates (multi-source BFS from the gates). When per-cell search looks quadratic,
ask whether starting from the destinations collapses it.

---

## 7 · Same problem in disguise

| Problem | Really is |
|---|---|
| Number of Islands (LC 200) | Connected components on a grid |
| Max Area of Island (LC 695) | LC 200, returning component size |
| Number of Provinces (LC 547) | LC 200 on an adjacency matrix |
| Number of Closed Islands (LC 1254) | LC 200 after eliminating border-touching components |
| Rotting Oranges (LC 994) | Multi-source BFS |
| Walls and Gates (LC 286) | Multi-source BFS from the gates |
| 01 Matrix (LC 542) | Multi-source BFS from every zero |
| Surrounded Regions (LC 130) | Reverse the problem — mark from the border |
| Pacific Atlantic (LC 417) | Reverse the problem — climb from the oceans |
| Course Schedule (LC 207) | Cycle detection via topological sort |
| Alien Dictionary (LC 269) | LC 207, after building the graph from the input |

**Three ideas — components, multi-source BFS, reverse the problem — cover eleven
named problems.** That collapse is the reason to study by pattern.

---

## 8 · Failure modes

| Bug | Symptom | Fix |
|---|---|---|
| Marking seen on dequeue | Duplicates in the queue, wrong distances | Mark on enqueue |
| One BFS per source | Times out; wrong minimum | Seed all sources, then one BFS |
| Missing bounds check on a grid | `IndexError`, or wraparound | Check `0 <= nr < rows` before indexing |
| Using DFS for shortest path | Wrong answer on unweighted graphs | BFS gives shortest by construction |
| Dijkstra with negative weights | Silently wrong | Bellman–Ford instead |
| Union-find without path compression | O(n) per find, times out | Compress, and union by size |
| Forgetting the parent in undirected DFS cycle detection | Every edge looks like a cycle | Skip the edge you arrived on |
| Deep recursion on a large grid | `RecursionError` | Iterative DFS with a stack, or BFS |

---

## 9 · Interview questions on this pattern

| Question | What to say |
|---|---|
| ⭐ "BFS or DFS?" | BFS for shortest path in an unweighted graph and anything level-based, because the first arrival is the shortest. DFS for reachability, components and cycle detection, and it is simpler to write recursively. |
| ⭐ "How do you detect a cycle in a directed graph?" | Kahn's algorithm — if the topological order does not contain every node, the remainder is in a cycle. Or DFS with three colours, where an edge to a grey node is a back edge. |
| "Why multi-source BFS rather than one per source?" | Seeding all sources at distance zero computes the minimum over all sources in a single O(V+E) pass. Per-source BFS gives distances from each source independently and is far slower. |
| "Union-find complexity?" | Near-constant amortised — inverse Ackermann — with both path compression and union by size. Without both it degrades badly, so mention both. |
| "Dijkstra with negative edges?" | It breaks: Dijkstra finalises a node on first pop, and a later negative edge could have improved it. Use Bellman–Ford, which also detects negative cycles. |
| ⭐ "Shortest path in a weighted grid?" | Dijkstra with a heap, treating cells as nodes. If weights are 0 or 1, a deque-based 0-1 BFS is O(V+E) and simpler. |

---

## Stop condition

You are done with this pattern when you can:

1. write BFS, DFS, Kahn's and union-find templates cold,
2. recognise a grid problem as a graph problem immediately,
3. explain why seen-on-enqueue matters,
4. name the three collapsing ideas — components, multi-source, reverse — and
5. say when Dijkstra is wrong and what replaces it.
