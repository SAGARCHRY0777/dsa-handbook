---
title: Problem index
slug: problem-index
module: reference
order: 91
status: live
summary: Every problem in the handbook in one table, with a tracking method that measures recall rather than tick count.
---

# Problem index

Every problem from the pattern pages, in one place. Roughly 110 problems — which
is deliberate: **a hundred problems you can re-derive beats three hundred you
have seen.**

---

## How to track this

Not with ticks. Ticks measure exposure; interviews measure recall.

Keep four columns per problem:

| Column | Meaning |
|---|---|
| **Solved** | Got it inside the 25-minute box, unaided |
| **Help level** | 0 = unaided … 6 = read the full solution (see [how to practise](how-to-practise.html)) |
| **Day 7** | Re-derived a week later, from a blank file |
| **Day 30** | Re-derived a month later |

**The number that predicts interview performance is the day-7 column.** A
problem solved once and never revisited is not knowledge, it is a memory of
having been told something.

A workable minimum: a spreadsheet with `problem, pattern, date, help_level,
day7, day30`. Sort by `help_level` descending to find what to revisit.

---

## The core 40

If time is short, these forty cover the highest-frequency ground. Marked ⭐ are
the ones most likely to appear verbatim.

| # | Problem | LC | Pattern |
|---|---|---|---|
| 1 | ⭐ Two Sum | 1 | Hashing |
| 2 | Contains Duplicate | 217 | Hashing |
| 3 | Valid Anagram | 242 | Hashing |
| 4 | ⭐ Group Anagrams | 49 | Hashing |
| 5 | Top K Frequent Elements | 347 | Hashing / heap |
| 6 | ⭐ Subarray Sum Equals K | 560 | Prefix sum |
| 7 | Longest Consecutive Sequence | 128 | Hashing |
| 8 | Valid Palindrome | 125 | Two pointers |
| 9 | Two Sum II | 167 | Two pointers |
| 10 | ⭐ 3Sum | 15 | Two pointers |
| 11 | ⭐ Container With Most Water | 11 | Two pointers |
| 12 | Trapping Rain Water | 42 | Two pointers |
| 13 | ⭐ Longest Substring Without Repeating | 3 | Sliding window |
| 14 | Longest Repeating Character Replacement | 424 | Sliding window |
| 15 | Permutation in String | 567 | Sliding window |
| 16 | Minimum Size Subarray Sum | 209 | Sliding window |
| 17 | ⭐ Minimum Window Substring | 76 | Sliding window |
| 18 | Sliding Window Maximum | 239 | Deque |
| 19 | ⭐ Valid Parentheses | 20 | Stack |
| 20 | Min Stack | 155 | Stack |
| 21 | ⭐ Daily Temperatures | 739 | Monotonic stack |
| 22 | Largest Rectangle in Histogram | 84 | Monotonic stack |
| 23 | ⭐ Binary Search | 704 | Binary search |
| 24 | ⭐ Search in Rotated Sorted Array | 33 | Binary search |
| 25 | Find Minimum in Rotated Sorted Array | 153 | Binary search |
| 26 | ⭐ Koko Eating Bananas | 875 | Search on the answer |
| 27 | Split Array Largest Sum | 410 | Search on the answer |
| 28 | ⭐ Maximum Depth of Binary Tree | 104 | Trees |
| 29 | ⭐ Binary Tree Level Order Traversal | 102 | Trees / BFS |
| 30 | ⭐ Validate BST | 98 | Trees |
| 31 | ⭐ Lowest Common Ancestor | 236 | Trees |
| 32 | Binary Tree Maximum Path Sum | 124 | Trees |
| 33 | ⭐ Number of Islands | 200 | Graphs |
| 34 | ⭐ Rotting Oranges | 994 | Multi-source BFS |
| 35 | ⭐ Course Schedule | 207 | Topological sort |
| 36 | Pacific Atlantic Water Flow | 417 | Graphs |
| 37 | ⭐ Kth Largest Element | 215 | Heap |
| 38 | Merge k Sorted Lists | 23 | Heap |
| 39 | ⭐ Merge Intervals | 56 | Intervals |
| 40 | ⭐ Meeting Rooms II | 253 | Intervals / heap |

**The 21 starred problems are the ones I would guarantee you see** across a
handful of loops. If you can do only twenty things, do those.

---

## By pattern

### Hashing → [page](hashing.html)

| Level | Problems |
|---|---|
| Easy | Two Sum (1) · Contains Duplicate (217) · Valid Anagram (242) · Majority Element (169) |
| Medium | Group Anagrams (49) · Top K Frequent (347) · **Subarray Sum Equals K (560)** · Longest Consecutive (128) · Contiguous Array (525) · 4Sum II (454) |
| Hard | First Missing Positive (41) · LRU Cache (146) |

### Two pointers → [page](two-pointers.html)

| Level | Problems |
|---|---|
| Easy | Valid Palindrome (125) · Two Sum II (167) · Remove Duplicates (26) · Merge Sorted Array (88) |
| Medium | **3Sum (15)** · 3Sum Closest (16) · **Container With Most Water (11)** · Sort Colors (75) · Linked List Cycle II (142) · 4Sum (18) · Boats to Save People (881) |
| Hard | Trapping Rain Water (42) |

### Sliding window → [page](sliding-window.html)

| Level | Problems |
|---|---|
| Easy | Maximum Average Subarray (643) · Contains Duplicate II (219) |
| Medium | **Longest Substring Without Repeating (3)** · Longest Repeating Char Replacement (424) · Permutation in String (567) · Minimum Size Subarray Sum (209) · Fruit Into Baskets (904) · Max Consecutive Ones III (1004) · At Most K Distinct (340) · Subarrays with K Different (992) |
| Hard | **Minimum Window Substring (76)** · Sliding Window Maximum (239) |

### Stack → [page](stack.html)

| Level | Problems |
|---|---|
| Easy | **Valid Parentheses (20)** · Min Stack (155) · Baseball Game (682) · Remove Adjacent Duplicates (1047) |
| Medium | **Daily Temperatures (739)** · Next Greater Element II (503) · Evaluate RPN (150) · Asteroid Collision (735) · Simplify Path (71) · Decode String (394) · Car Fleet (853) · Online Stock Span (901) |
| Hard | **Largest Rectangle (84)** · Maximal Rectangle (85) |

### Binary search → [page](binary-search.html)

| Level | Problems |
|---|---|
| Easy | Binary Search (704) · Search Insert Position (35) · First Bad Version (278) |
| Medium | First and Last Position (34) · **Search in Rotated Array (33)** · Find Minimum in Rotated (153) · **Koko Eating Bananas (875)** · Capacity To Ship (1011) · Split Array Largest Sum (410) · Search a 2D Matrix (74) · Find Peak Element (162) · Time Based Store (981) |
| Hard | Median of Two Sorted Arrays (4) · Min Max Distance to Gas Station (774) |

### Trees → [page](trees.html)

| Level | Problems |
|---|---|
| Easy | Max Depth (104) · Invert Tree (226) · Same Tree (100) · Symmetric Tree (101) · Diameter (543) |
| Medium | **Level Order (102)** · **Validate BST (98)** · **LCA (236)** · LCA of BST (235) · Kth Smallest in BST (230) · Construct from Pre+In (105) · Right Side View (199) · Path Sum II (113) |
| Hard | **Max Path Sum (124)** · Serialise/Deserialise (297) |

### Graphs → [page](graphs.html)

| Level | Problems |
|---|---|
| Easy | **Number of Islands (200)** · Flood Fill (733) · Max Area of Island (695) |
| Medium | **Rotting Oranges (994)** · **Course Schedule (207)** · Course Schedule II (210) · Clone Graph (133) · Pacific Atlantic (417) · Number of Provinces (547) · Surrounded Regions (130) · Word Ladder (127) · Redundant Connection (684) · Network Delay Time (743) |
| Hard | Alien Dictionary (269) · Word Ladder II (126) · Swim in Rising Water (778) |

### Heap → [page](heap.html)

| Level | Problems |
|---|---|
| Easy | Kth Largest in Stream (703) · Last Stone Weight (1046) |
| Medium | Top K Frequent (347) · **Kth Largest in Array (215)** · K Closest Points (973) · Task Scheduler (621) · Reorganise String (767) · Meeting Rooms II (253) · Design Twitter (355) |
| Hard | **Find Median from Stream (295)** · **Merge k Sorted Lists (23)** · Smallest Range (632) |

### Intervals → [page](intervals.html)

| Level | Problems |
|---|---|
| Easy | Meeting Rooms (252) · Summary Ranges (228) |
| Medium | **Merge Intervals (56)** · **Insert Interval (57)** · Non-overlapping (435) · **Meeting Rooms II (253)** · Minimum Arrows (452) · Interval Intersections (986) · Car Pooling (1094) |
| Hard | Employee Free Time (759) |

### Dynamic programming → [page](dynamic-programming.html)

| Level | Problems |
|---|---|
| Easy | Climbing Stairs (70) · Min Cost Climbing Stairs (746) · **House Robber (198)** · House Robber II (213) |
| Medium | **Coin Change (322)** · Coin Change II (518) · **LIS (300)** · **LCS (1143)** · Word Break (139) · Unique Paths (62) · Partition Equal Subset (416) · Max Product Subarray (152) · Decode Ways (91) |
| Hard | **Edit Distance (72)** · Burst Balloons (312) · Regex Matching (10) |

---

## Suggested order across patterns

Do not work down one pattern to completion before starting the next. Interleave,
because interleaving is what builds the *recognition* that the interview tests.

```
   week 1   hashing easy+medium        two pointers easy
   week 2   two pointers medium        sliding window easy+medium
   week 3   binary search all          REVIEW week 1
   week 4   trees easy+medium          stack easy+medium
   week 5   graphs easy+medium         heap easy+medium
   week 6   REVIEW everything          intervals
   week 7   DP easy+medium             hard problems from earlier patterns
   week 8   REVIEW + mocks
```

**Two review weeks in eight is not generous, it is the minimum.** Skipping them
to cover more patterns is how people reach week eight having forgotten week one.

---

## When you are ready

Not "when the list is finished". These:

- The 21 starred problems, re-derivable cold in under 25 minutes each
- Ten unseen problems, pattern named correctly for eight, in under 60s each
- Templates for binary search, BFS, DFS and the monotonic stack typed from memory
- At least three mock interviews completed, out loud, with a human
