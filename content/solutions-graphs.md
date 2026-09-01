---
title: Solutions — graphs
slug: solutions-graphs
module: solutions
order: 63
status: live
level: worst → best
summary: Four graph problems from naive to optimal, in Python and Java, including the two reframings that collapse whole families.
---

# Solutions — graphs

Same format. The recurring lesson here is that **seeing the graph** is the work;
the algorithm afterwards is standard.

---

## LC 200 · Number of Islands

Count connected regions of `'1'` in a grid.

### Approach 1 — DFS with a visited set · O(rc) time, O(rc) space ✅

```python
def num_islands(grid):
    if not grid:
        return 0
    rows, cols = len(grid), len(grid[0])
    seen = set()

    def sink(r, c):
        stack = [(r, c)]
        while stack:                       # iterative: a 1000x1000 grid of
            cr, cc = stack.pop()           # land would blow the call stack
            for nr, nc in ((cr+1,cc), (cr-1,cc), (cr,cc+1), (cr,cc-1)):
                if 0 <= nr < rows and 0 <= nc < cols \
                        and grid[nr][nc] == "1" and (nr, nc) not in seen:
                    seen.add((nr, nc))
                    stack.append((nr, nc))

    count = 0
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == "1" and (r, c) not in seen:
                seen.add((r, c))
                sink(r, c)
                count += 1
    return count
```

```java
public int numIslands(char[][] grid) {
    if (grid.length == 0) return 0;
    int rows = grid.length, cols = grid[0].length, count = 0;
    int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};

    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < cols; c++) {
            if (grid[r][c] != '1') continue;
            count++;
            Deque<int[]> stack = new ArrayDeque<>();
            stack.push(new int[]{r, c});
            grid[r][c] = '0';                    // mark on PUSH
            while (!stack.isEmpty()) {
                int[] cell = stack.pop();
                for (int[] d : dirs) {
                    int nr = cell[0] + d[0], nc = cell[1] + d[1];
                    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols
                            && grid[nr][nc] == '1') {
                        grid[nr][nc] = '0';      // mark immediately, or the
                        stack.push(new int[]{nr, nc});   // cell enters twice
                    }
                }
            }
        }
    }
    return count;
}
```

### Approach 2 — mutate the grid, O(1) extra space

Overwriting visited land with `'0'` removes the `seen` set entirely.

> **Ask before doing it:** *"May I modify the input grid?"* If yes, space drops
> to O(1) beyond the stack. If not, keep the set. Asking is the point.

---

## LC 994 · Rotting Oranges

### Approach 1 — simulate minute by minute, rescanning · O((rc)²)

Each minute, scan the whole grid for rotten cells and infect neighbours. Correct
and needlessly quadratic.

### Approach 2 — BFS per rotten orange · still too slow

Computes distance from each source independently, rather than the minimum over
all sources.

### Approach 3 — multi-source BFS · O(rc) time ✅

Seed **every** rotten cell at distance zero, then one BFS.

```python
from collections import deque

def oranges_rotting(grid):
    rows, cols = len(grid), len(grid[0])
    queue, fresh = deque(), 0

    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 2:
                queue.append((r, c))       # ALL sources, all at time 0
            elif grid[r][c] == 1:
                fresh += 1

    if fresh == 0:
        return 0                           # nothing to rot -> 0, not -1

    minutes = 0
    while queue and fresh:
        for _ in range(len(queue)):        # one level = one minute
            r, c = queue.popleft()
            for nr, nc in ((r+1,c), (r-1,c), (r,c+1), (r,c-1)):
                if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 1:
                    grid[nr][nc] = 2
                    fresh -= 1
                    queue.append((nr, nc))
        minutes += 1

    return minutes if fresh == 0 else -1
```

```java
public int orangesRotting(int[][] grid) {
    int rows = grid.length, cols = grid[0].length, fresh = 0;
    Deque<int[]> queue = new ArrayDeque<>();

    for (int r = 0; r < rows; r++)
        for (int c = 0; c < cols; c++)
            if (grid[r][c] == 2) queue.add(new int[]{r, c});
            else if (grid[r][c] == 1) fresh++;

    if (fresh == 0) return 0;

    int minutes = 0;
    int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};
    while (!queue.isEmpty() && fresh > 0) {
        int size = queue.size();
        for (int i = 0; i < size; i++) {
            int[] cell = queue.poll();
            for (int[] d : dirs) {
                int nr = cell[0] + d[0], nc = cell[1] + d[1];
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols
                        && grid[nr][nc] == 1) {
                    grid[nr][nc] = 2;
                    fresh--;
                    queue.add(new int[]{nr, nc});
                }
            }
        }
        minutes++;
    }
    return fresh == 0 ? minutes : -1;
}
```

**Two edge cases interviewers check:** no fresh oranges → `0`, not `-1`; and
unreachable fresh oranges → `-1`.

---

## LC 207 · Course Schedule

### Approach 1 — DFS from every node checking for a cycle · O(V·(V+E))

Correct, but re-explores.

### Approach 2 — DFS with three colours · O(V+E) time ✅

```python
def can_finish(num_courses, prerequisites):
    from collections import defaultdict
    graph = defaultdict(list)
    for course, prereq in prerequisites:
        graph[prereq].append(course)

    WHITE, GREY, BLACK = 0, 1, 2           # unvisited, in progress, done
    state = [WHITE] * num_courses

    def has_cycle(node):
        if state[node] == GREY:
            return True                    # back edge -> cycle
        if state[node] == BLACK:
            return False                   # already fully explored
        state[node] = GREY
        for nxt in graph[node]:
            if has_cycle(nxt):
                return True
        state[node] = BLACK
        return False

    return not any(has_cycle(i) for i in range(num_courses))
```

### Approach 3 — Kahn's algorithm · O(V+E) time ✅

Same complexity, iterative, and it produces the ordering for free.

```python
from collections import deque, defaultdict

def can_finish(num_courses, prerequisites):
    graph = defaultdict(list)
    indegree = [0] * num_courses
    for course, prereq in prerequisites:
        graph[prereq].append(course)
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

```java
public boolean canFinish(int numCourses, int[][] prerequisites) {
    List<List<Integer>> graph = new ArrayList<>();
    for (int i = 0; i < numCourses; i++) graph.add(new ArrayList<>());
    int[] indegree = new int[numCourses];

    for (int[] p : prerequisites) {
        graph.get(p[1]).add(p[0]);
        indegree[p[0]]++;
    }

    Deque<Integer> queue = new ArrayDeque<>();
    for (int i = 0; i < numCourses; i++)
        if (indegree[i] == 0) queue.add(i);

    int processed = 0;
    while (!queue.isEmpty()) {
        int node = queue.poll();
        processed++;
        for (int next : graph.get(node)) {
            if (--indegree[next] == 0) queue.add(next);
        }
    }
    return processed == numCourses;
}
```

> *"Finishing every course is possible exactly when the prerequisite graph is a
> DAG, so this is cycle detection. Kahn's gives me that and the ordering
> together, and it is iterative so deep graphs are safe."*

**Prefer Kahn's in an interview** unless asked for DFS — no recursion limit, and
Course Schedule II is then a one-line change.

---

## LC 417 · Pacific Atlantic Water Flow

### Approach 1 — search from every cell · O((rc)²)

For each cell, flood downhill and check whether both oceans are reached.

### Approach 2 — reverse the flow · O(rc) time ✅

Start **at the oceans** and climb uphill. Two traversals total, not one per cell.

```python
def pacific_atlantic(heights):
    if not heights:
        return []
    rows, cols = len(heights), len(heights[0])

    def climb(starts):
        seen = set(starts)
        stack = list(starts)
        while stack:
            r, c = stack.pop()
            for nr, nc in ((r+1,c), (r-1,c), (r,c+1), (r,c-1)):
                # Reversed condition: move to a HIGHER or equal neighbour,
                # because water would flow down from there to here.
                if 0 <= nr < rows and 0 <= nc < cols and (nr, nc) not in seen \
                        and heights[nr][nc] >= heights[r][c]:
                    seen.add((nr, nc))
                    stack.append((nr, nc))
        return seen

    pacific = climb([(0, c) for c in range(cols)] + [(r, 0) for r in range(rows)])
    atlantic = climb([(rows-1, c) for c in range(cols)]
                     + [(r, cols-1) for r in range(rows)])
    return [list(cell) for cell in pacific & atlantic]
```

```java
public List<List<Integer>> pacificAtlantic(int[][] heights) {
    int rows = heights.length, cols = heights[0].length;
    boolean[][] pacific = new boolean[rows][cols];
    boolean[][] atlantic = new boolean[rows][cols];

    for (int c = 0; c < cols; c++) {
        climb(heights, pacific, 0, c);
        climb(heights, atlantic, rows - 1, c);
    }
    for (int r = 0; r < rows; r++) {
        climb(heights, pacific, r, 0);
        climb(heights, atlantic, r, cols - 1);
    }

    List<List<Integer>> out = new ArrayList<>();
    for (int r = 0; r < rows; r++)
        for (int c = 0; c < cols; c++)
            if (pacific[r][c] && atlantic[r][c])
                out.add(Arrays.asList(r, c));
    return out;
}

private void climb(int[][] h, boolean[][] seen, int r, int c) {
    seen[r][c] = true;
    int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};
    for (int[] d : dirs) {
        int nr = r + d[0], nc = c + d[1];
        if (nr >= 0 && nr < h.length && nc >= 0 && nc < h[0].length
                && !seen[nr][nc] && h[nr][nc] >= h[r][c]) {
            climb(h, seen, nr, nc);
        }
    }
}
```

> *"Searching from every cell is quadratic. Reversing it — starting at the
> destinations and walking backwards — makes it two linear traversals."*

**"Reverse the problem" is transferable.** It also solves Surrounded Regions
(mark from the border) and Walls and Gates (multi-source from the gates).
Whenever per-cell search looks quadratic, ask whether starting from the
destinations collapses it.

---

## The two reframings that collapse families

| Reframing | Solves |
|---|---|
| **Multi-source BFS** — seed all sources at distance 0 | Rotting Oranges, Walls and Gates, 01 Matrix |
| **Reverse the problem** — start at the destinations | Pacific Atlantic, Surrounded Regions |

Plus the recognition that **a grid is a graph**, which turns a whole category
into routine BFS/DFS with `(row, col)` as the node id.

---

## Python and Java, graph-specific

| Task | Python | Java |
|---|---|---|
| Queue | `collections.deque` | `ArrayDeque`, **not** `LinkedList` |
| Visited set on a grid | `set()` of tuples | `boolean[][]`, faster and simpler |
| Adjacency list | `defaultdict(list)` | `List<List<Integer>>`, pre-filled |
| Direction array | `((1,0),(-1,0),(0,1),(0,-1))` | `int[][] dirs = {{1,0},...}` |
| Decrement and test | `indegree[x] -= 1; if indegree[x] == 0:` | `if (--indegree[x] == 0)` |

**`boolean[][]` beats a `HashSet<int[]>` in Java**, and not marginally — `int[]`
hashes by identity, so a `HashSet<int[]>` does not even work correctly. It is
the same identity-hashing trap as using an array for a map key.
