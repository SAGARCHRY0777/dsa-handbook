---
title: Top 200 questions & company tags
slug: company-questions
module: reference
order: 93
status: live
level: the master list
summary: 206 highest-frequency interview problems with company tags, the pattern each one drills, and which handbook page covers it — plus an honest note on where the company data comes from.
---

# Top 200 questions and company tags

> **Read the source note first.** It changes how much weight to put on the
> company column.

---

## 1 · Where this data comes from — and where it does not

**This is not Big Omega data, and it is not LeetCode Premium frequency data.**
Those datasets are paid, scraped, and not something this handbook can read or
republish accurately.

What this list actually is:

| Source | Contributes |
|---|---|
| **Blind 75** | The classic minimum set |
| **NeetCode 150 / 250** | Pattern-organised expansion |
| **Grind 75** | Time-budgeted ordering |
| **LeetCode Top Interview 150** | LeetCode's own curated list |
| Community-reported company tags | The company column |

> **Treat the company column as directional, not authoritative.** Company
> question banks rotate, leak, get retired, and vary by team and by office.
> A tag here means *this problem has been widely reported at that company*,
> not *this company will ask you this*. If you want live frequency data,
> LeetCode Premium's company filter is the real source — this list is for
> deciding what to practise, not for predicting your interview.

**The useful signal is not the company. It is the pattern.** Companies do not
share a question list; they share a *pattern* distribution. Every problem
below is tagged with the pattern it drills, and that is the column to plan
from.

---

## 2 · Coverage

The handbook's pattern pages reference **258 distinct LeetCode
problems**. Against this 206-problem list:

| | Count |
|---|---|
| In this list **and** taught in the handbook | **165** (80%) |
| In this list, not yet on a pattern page | 41 |
| On a pattern page but not in this list | 93 |

**The last row is not padding.** The pattern pages include ladder rungs and
teaching problems that are not interview-frequent but build the intuition the
frequent ones need.

### The gaps

The problems below appear on the top list but are **not** yet worked into a
pattern page. Each is still listed in the tables further down, with the page
whose pattern it belongs to — so you can slot it into that page's ladder.

| LC | Problem | Diff | Pattern | Read this page first |
|---|---|---|---|---|
| **36** | Valid Sudoku | Med | Arrays & hashing | [hashing](hashing.html) |
| **288** | Unique Word Abbreviation | Med | Arrays & hashing | [hashing](hashing.html) |
| **348** | Design Tic-Tac-Toe | Med | Arrays & hashing | [hashing](hashing.html) |
| **380** | Insert Delete GetRandom O(1) | Med | Arrays & hashing | [hashing](hashing.html) |
| **31** | Next Permutation | Med | Array manipulation | [hashing](hashing.html) |
| **48** | Rotate Image | Med | Array manipulation | [hashing](hashing.html) |
| **54** | Spiral Matrix | Med | Array manipulation | [hashing](hashing.html) |
| **66** | Plus One | Easy | Array manipulation | [hashing](hashing.html) |
| **73** | Set Matrix Zeroes | Med | Array manipulation | [hashing](hashing.html) |
| **289** | Game of Life | Med | Array manipulation | [hashing](hashing.html) |
| **43** | Multiply Strings | Med | Strings | [strings](strings.html) |
| **283** | Move Zeroes | Easy | Two pointers | [two-pointers](two-pointers.html) |
| **437** | Path Sum III | Med | Prefix sums | [prefix-sum](prefix-sum.html) |
| **224** | Basic Calculator | Hard | Stack & monotonic stack | [stack](stack.html) |
| **316** | Remove Duplicate Letters | Hard | Stack & monotonic stack | [stack](stack.html) |
| **50** | Pow(x, n) | Med | Binary search | [binary-search](binary-search.html) |
| **287** | Find the Duplicate Number | Med | Linked lists | [linked-lists](linked-lists.html) |
| **460** | LFU Cache | Hard | Linked lists | [linked-lists](linked-lists.html) |
| **103** | Binary Tree Zigzag Level Order Traversal | Med | Trees | [trees](trees.html) |
| **110** | Balanced Binary Tree | Easy | Trees | [trees](trees.html) |
| **112** | Path Sum | Easy | Trees | [trees](trees.html) |
| **114** | Flatten Binary Tree to Linked List | Med | Trees | [trees](trees.html) |
| **572** | Subtree of Another Tree | Easy | Trees | [trees](trees.html) |
| **662** | Maximum Width of Binary Tree | Med | Trees | [trees](trees.html) |
| **863** | All Nodes Distance K in Binary Tree | Med | Trees | [trees](trees.html) |
| **1448** | Count Good Nodes in Binary Tree | Med | Trees | [trees](trees.html) |
| **1288** | Remove Covered Intervals | Med | Intervals | [intervals](intervals.html) |
| **329** | Longest Increasing Path in a Matrix | Hard | Graphs | [graphs](graphs.html) |
| **332** | Reconstruct Itinerary | Hard | Graphs | [graphs](graphs.html) |
| **787** | Cheapest Flights Within K Stops | Med | Graphs | [graphs](graphs.html) |
| **797** | All Paths From Source to Target | Med | Graphs | [graphs](graphs.html) |
| **1926** | Nearest Exit from Entrance in Maze | Med | Graphs | [graphs](graphs.html) |
| **678** | Valid Parenthesis String | Med | Greedy | [greedy](greedy.html) |
| **44** | Wildcard Matching | Hard | Dynamic programming | [dynamic-programming](dynamic-programming.html) |
| **63** | Unique Paths II | Med | Dynamic programming | [dynamic-programming](dynamic-programming.html) |
| **64** | Minimum Path Sum | Med | Dynamic programming | [dynamic-programming](dynamic-programming.html) |
| **97** | Interleaving String | Med | Dynamic programming | [dynamic-programming](dynamic-programming.html) |
| **115** | Distinct Subsequences | Hard | Dynamic programming | [dynamic-programming](dynamic-programming.html) |
| **221** | Maximal Square | Med | Dynamic programming | [dynamic-programming](dynamic-programming.html) |
| **309** | Best Time to Buy and Sell Stock with Cooldown | Med | Dynamic programming | [dynamic-programming](dynamic-programming.html) |
| **7** | Reverse Integer | Med | Bit manipulation | [bit-manipulation](bit-manipulation.html) |

> **None of the gaps is a missing *pattern*.** They are additional problems in
> patterns the handbook already teaches — mostly matrix manipulation, extra
> grid-DP variants, and tree traversals. If you can do the worked examples on
> the relevant page, these are reps rather than new material.

---

## 3 · The list, by pattern

**✓** = taught on a handbook pattern page.

### Arrays & hashing — [hashing.html](hashing.html)

| | LC | Problem | Diff | Reported at |
|---|---|---|---|---|
| ✓ | 1 | Two Sum | Easy | Amazon, Google, Microsoft, Apple, Meta, Bloomberg |
| ✓ | 169 | Majority Element | Easy | Amazon, Adobe |
| ✓ | 217 | Contains Duplicate | Easy | Amazon, Apple, Microsoft |
| · | 36 | Valid Sudoku | Med | Amazon, Apple, Uber |
| ✓ | 49 | Group Anagrams | Med | Amazon, Meta, Uber, Google |
| ✓ | 128 | Longest Consecutive Sequence | Med | Google, Meta, Amazon |
| · | 288 | Unique Word Abbreviation | Med | Google |
| · | 348 | Design Tic-Tac-Toe | Med | Amazon, Microsoft |
| · | 380 | Insert Delete GetRandom O(1) | Med | Amazon, Google, Meta |

### Array manipulation — [hashing.html](hashing.html)

| | LC | Problem | Diff | Reported at |
|---|---|---|---|---|
| · | 66 | Plus One | Easy | Amazon, Google |
| · | 31 | Next Permutation | Med | Google, Meta, Bloomberg |
| · | 48 | Rotate Image | Med | Amazon, Microsoft, Apple |
| · | 54 | Spiral Matrix | Med | Amazon, Microsoft, Google |
| · | 73 | Set Matrix Zeroes | Med | Amazon, Microsoft |
| · | 289 | Game of Life | Med | Amazon, Google, Bloomberg |
| ✓ | 41 | First Missing Positive | Hard | Amazon, Google, Microsoft |

### Strings — [strings.html](strings.html)

| | LC | Problem | Diff | Reported at |
|---|---|---|---|---|
| ✓ | 125 | Valid Palindrome | Easy | Meta, Amazon, Microsoft |
| ✓ | 242 | Valid Anagram | Easy | Amazon, Uber, Meta |
| ✓ | 5 | Longest Palindromic Substring | Med | Amazon, Meta, Microsoft, Bloomberg |
| · | 43 | Multiply Strings | Med | Meta, Amazon |
| ✓ | 227 | Basic Calculator II | Med | Amazon, Google, Meta |
| ✓ | 271 | Encode and Decode Strings | Med | Google, Meta |
| ✓ | 394 | Decode String | Med | Google, Amazon, Bloomberg |
| ✓ | 647 | Palindromic Substrings | Med | Amazon, Meta |

### Two pointers — [two-pointers.html](two-pointers.html)

| | LC | Problem | Diff | Reported at |
|---|---|---|---|---|
| ✓ | 88 | Merge Sorted Array | Easy | Meta, Amazon, Microsoft |
| · | 283 | Move Zeroes | Easy | Meta, Amazon |
| ✓ | 680 | Valid Palindrome II | Easy | Meta |
| ✓ | 11 | Container With Most Water | Med | Amazon, Meta, Google, Bloomberg |
| ✓ | 15 | 3Sum | Med | Amazon, Meta, Google, Adobe |
| ✓ | 18 | 4Sum | Med | Amazon, Google |
| ✓ | 75 | Sort Colors | Med | Meta, Amazon, Microsoft |
| ✓ | 167 | Two Sum II | Med | Amazon, Apple |
| ✓ | 42 | Trapping Rain Water | Hard | Amazon, Google, Meta, Bloomberg |

### Sliding window — [sliding-window.html](sliding-window.html)

| | LC | Problem | Diff | Reported at |
|---|---|---|---|---|
| ✓ | 3 | Longest Substring Without Repeating Characters | Med | Amazon, Meta, Google, Microsoft, Bloomberg |
| ✓ | 209 | Minimum Size Subarray Sum | Med | Meta, Amazon, Google |
| ✓ | 424 | Longest Repeating Character Replacement | Med | Google, Amazon |
| ✓ | 438 | Find All Anagrams in a String | Med | Amazon, Meta |
| ✓ | 567 | Permutation in String | Med | Microsoft, Amazon |
| ✓ | 76 | Minimum Window Substring | Hard | Amazon, Meta, Google, LinkedIn |
| ✓ | 239 | Sliding Window Maximum | Hard | Amazon, Google, Meta |

### Prefix sums — [prefix-sum.html](prefix-sum.html)

| | LC | Problem | Diff | Reported at |
|---|---|---|---|---|
| ✓ | 238 | Product of Array Except Self | Med | Amazon, Meta, Apple, Microsoft |
| · | 437 | Path Sum III | Med | Amazon, Google |
| ✓ | 560 | Subarray Sum Equals K | Med | Meta, Amazon, Google |

### Stack & monotonic stack — [stack.html](stack.html)

| | LC | Problem | Diff | Reported at |
|---|---|---|---|---|
| ✓ | 20 | Valid Parentheses | Easy | Amazon, Google, Meta, Microsoft, Bloomberg |
| ✓ | 496 | Next Greater Element I | Easy | Amazon, Bloomberg |
| ✓ | 71 | Simplify Path | Med | Meta, Microsoft |
| ✓ | 150 | Evaluate Reverse Polish Notation | Med | Amazon, LinkedIn |
| ✓ | 155 | Min Stack | Med | Amazon, Google, Bloomberg, Uber |
| ✓ | 503 | Next Greater Element II | Med | Amazon |
| ✓ | 739 | Daily Temperatures | Med | Amazon, Google |
| ✓ | 853 | Car Fleet | Med | Amazon, Google |
| ✓ | 84 | Largest Rectangle in Histogram | Hard | Amazon, Google, Meta |
| ✓ | 85 | Maximal Rectangle | Hard | Amazon, Google |
| · | 224 | Basic Calculator | Hard | Google, Amazon |
| · | 316 | Remove Duplicate Letters | Hard | Google, Amazon |

### Binary search — [binary-search.html](binary-search.html)

| | LC | Problem | Diff | Reported at |
|---|---|---|---|---|
| ✓ | 35 | Search Insert Position | Easy | Amazon |
| ✓ | 278 | First Bad Version | Easy | Meta, Google |
| ✓ | 704 | Binary Search | Easy | Amazon, Google |
| ✓ | 33 | Search in Rotated Sorted Array | Med | Amazon, Meta, Microsoft, Bloomberg |
| ✓ | 34 | Find First and Last Position | Med | Meta, Amazon, LinkedIn |
| · | 50 | Pow(x, n) | Med | Amazon, Meta, Google, LinkedIn |
| ✓ | 74 | Search a 2D Matrix | Med | Amazon, Microsoft |
| ✓ | 153 | Find Minimum in Rotated Sorted Array | Med | Amazon, Meta, Microsoft |
| ✓ | 162 | Find Peak Element | Med | Meta, Google, Amazon |
| ✓ | 875 | Koko Eating Bananas | Med | Amazon, Google, Meta |
| ✓ | 981 | Time Based Key-Value Store | Med | Amazon, Google, Meta |
| ✓ | 1011 | Capacity To Ship Packages | Med | Amazon, Google |
| ✓ | 4 | Median of Two Sorted Arrays | Hard | Amazon, Google, Meta, Adobe |
| ✓ | 410 | Split Array Largest Sum | Hard | Google, Amazon |

### Linked lists — [linked-lists.html](linked-lists.html)

| | LC | Problem | Diff | Reported at |
|---|---|---|---|---|
| ✓ | 21 | Merge Two Sorted Lists | Easy | Amazon, Google, Microsoft, Apple |
| ✓ | 141 | Linked List Cycle | Easy | Amazon, Microsoft, Bloomberg |
| ✓ | 160 | Intersection of Two Linked Lists | Easy | Amazon, Bloomberg |
| ✓ | 206 | Reverse Linked List | Easy | Amazon, Google, Meta, Microsoft, Apple |
| ✓ | 234 | Palindrome Linked List | Easy | Amazon, Meta |
| ✓ | 2 | Add Two Numbers | Med | Amazon, Microsoft, Meta, Bloomberg |
| ✓ | 19 | Remove Nth Node From End of List | Med | Amazon, Meta, Google |
| ✓ | 138 | Copy List with Random Pointer | Med | Amazon, Meta, Microsoft, Bloomberg |
| ✓ | 142 | Linked List Cycle II | Med | Amazon, Microsoft |
| ✓ | 143 | Reorder List | Med | Amazon, Meta, Microsoft |
| ✓ | 146 | LRU Cache | Med | Amazon, Meta, Google, Microsoft, Bloomberg |
| · | 287 | Find the Duplicate Number | Med | Amazon, Google, Meta |
| ✓ | 25 | Reverse Nodes in k-Group | Hard | Amazon, Meta, Microsoft |
| · | 460 | LFU Cache | Hard | Amazon, Google, Bloomberg |

### Trees — [trees.html](trees.html)

| | LC | Problem | Diff | Reported at |
|---|---|---|---|---|
| ✓ | 100 | Same Tree | Easy | Amazon, Bloomberg |
| ✓ | 104 | Maximum Depth of Binary Tree | Easy | Amazon, Google, LinkedIn |
| · | 110 | Balanced Binary Tree | Easy | Amazon, Google |
| · | 112 | Path Sum | Easy | Amazon, Bloomberg |
| ✓ | 226 | Invert Binary Tree | Easy | Google, Amazon |
| ✓ | 543 | Diameter of Binary Tree | Easy | Meta, Amazon, Google |
| · | 572 | Subtree of Another Tree | Easy | Amazon, Meta |
| ✓ | 98 | Validate Binary Search Tree | Med | Amazon, Meta, Microsoft, Bloomberg |
| ✓ | 102 | Binary Tree Level Order Traversal | Med | Amazon, Meta, Microsoft, Bloomberg |
| · | 103 | Binary Tree Zigzag Level Order Traversal | Med | Amazon, Microsoft, Bloomberg |
| ✓ | 105 | Construct Binary Tree from Preorder and Inorder | Med | Amazon, Meta, Microsoft |
| ✓ | 113 | Path Sum II | Med | Amazon, Bloomberg |
| · | 114 | Flatten Binary Tree to Linked List | Med | Amazon, Microsoft |
| ✓ | 199 | Binary Tree Right Side View | Med | Meta, Amazon, Google |
| ✓ | 230 | Kth Smallest Element in a BST | Med | Amazon, Meta, Bloomberg |
| ✓ | 235 | LCA of a BST | Med | Amazon, Meta, Microsoft |
| ✓ | 236 | LCA of a Binary Tree | Med | Amazon, Meta, Microsoft, LinkedIn |
| · | 662 | Maximum Width of Binary Tree | Med | Amazon, Bloomberg |
| · | 863 | All Nodes Distance K in Binary Tree | Med | Amazon, Meta |
| · | 1448 | Count Good Nodes in Binary Tree | Med | Amazon, Microsoft |
| ✓ | 124 | Binary Tree Maximum Path Sum | Hard | Amazon, Meta, Google, Microsoft |
| ✓ | 297 | Serialize and Deserialize Binary Tree | Hard | Amazon, Meta, Google, LinkedIn |

### Tries — [tries.html](tries.html)

| | LC | Problem | Diff | Reported at |
|---|---|---|---|---|
| ✓ | 208 | Implement Trie | Med | Amazon, Google, Microsoft, Bloomberg |
| ✓ | 211 | Design Add and Search Words | Med | Amazon, Meta, Google |
| ✓ | 648 | Replace Words | Med | Amazon, Google |
| ✓ | 212 | Word Search II | Hard | Amazon, Google, Microsoft, Uber |
| ✓ | 642 | Design Search Autocomplete System | Hard | Amazon, Google |
| ✓ | 1032 | Stream of Characters | Hard | Google, Amazon |

### Heap & top-k — [heap.html](heap.html)

| | LC | Problem | Diff | Reported at |
|---|---|---|---|---|
| ✓ | 703 | Kth Largest Element in a Stream | Easy | Amazon, Meta |
| ✓ | 1046 | Last Stone Weight | Easy | Amazon, Google |
| ✓ | 215 | Kth Largest Element in an Array | Med | Amazon, Meta, Google, Microsoft |
| ✓ | 347 | Top K Frequent Elements | Med | Amazon, Meta, Google, Uber |
| ✓ | 355 | Design Twitter | Med | Amazon, Meta, Twitter |
| ✓ | 973 | K Closest Points to Origin | Med | Amazon, Meta, Google, LinkedIn |
| ✓ | 23 | Merge k Sorted Lists | Hard | Amazon, Google, Meta, Microsoft |
| ✓ | 295 | Find Median from Data Stream | Hard | Amazon, Google, Meta, Microsoft |

### Intervals — [intervals.html](intervals.html)

| | LC | Problem | Diff | Reported at |
|---|---|---|---|---|
| ✓ | 252 | Meeting Rooms | Easy | Meta, Amazon, Google |
| ✓ | 56 | Merge Intervals | Med | Amazon, Meta, Google, Bloomberg |
| ✓ | 57 | Insert Interval | Med | Google, Amazon, LinkedIn |
| ✓ | 253 | Meeting Rooms II | Med | Amazon, Google, Meta, Bloomberg |
| ✓ | 1094 | Car Pooling | Med | Amazon, Google |
| · | 1288 | Remove Covered Intervals | Med | Amazon |

### Backtracking — [backtracking.html](backtracking.html)

| | LC | Problem | Diff | Reported at |
|---|---|---|---|---|
| ✓ | 17 | Letter Combinations of a Phone Number | Med | Amazon, Meta, Google, Uber |
| ✓ | 22 | Generate Parentheses | Med | Amazon, Google, Meta, Uber |
| ✓ | 39 | Combination Sum | Med | Amazon, Meta, Uber |
| ✓ | 40 | Combination Sum II | Med | Amazon |
| ✓ | 46 | Permutations | Med | Amazon, Meta, Microsoft, LinkedIn |
| ✓ | 47 | Permutations II | Med | Amazon, Microsoft |
| ✓ | 78 | Subsets | Med | Amazon, Meta, Google, Bloomberg |
| ✓ | 79 | Word Search | Med | Amazon, Meta, Microsoft, Bloomberg |
| ✓ | 90 | Subsets II | Med | Amazon, Meta |
| ✓ | 131 | Palindrome Partitioning | Med | Amazon, Google |
| ✓ | 37 | Sudoku Solver | Hard | Amazon, Google, Uber |
| ✓ | 51 | N-Queens | Hard | Amazon, Google |

### Graphs — [graphs.html](graphs.html)

| | LC | Problem | Diff | Reported at |
|---|---|---|---|---|
| ✓ | 130 | Surrounded Regions | Med | Amazon, Microsoft |
| ✓ | 133 | Clone Graph | Med | Amazon, Meta, Google |
| ✓ | 200 | Number of Islands | Med | Amazon, Meta, Google, Microsoft, Bloomberg |
| ✓ | 207 | Course Schedule | Med | Amazon, Meta, Google, Microsoft |
| ✓ | 210 | Course Schedule II | Med | Amazon, Meta, Google, Microsoft |
| ✓ | 286 | Walls and Gates | Med | Amazon, Meta, Google |
| ✓ | 417 | Pacific Atlantic Water Flow | Med | Amazon, Google |
| ✓ | 695 | Max Area of Island | Med | Amazon, Google |
| ✓ | 743 | Network Delay Time | Med | Amazon, Google |
| · | 787 | Cheapest Flights Within K Stops | Med | Amazon, Google |
| · | 797 | All Paths From Source to Target | Med | Amazon, Google |
| ✓ | 994 | Rotting Oranges | Med | Amazon, Google, Microsoft |
| · | 1926 | Nearest Exit from Entrance in Maze | Med | Amazon |
| ✓ | 127 | Word Ladder | Hard | Amazon, Meta, Google, LinkedIn |
| ✓ | 269 | Alien Dictionary | Hard | Amazon, Meta, Google, Airbnb |
| · | 329 | Longest Increasing Path in a Matrix | Hard | Amazon, Google |
| · | 332 | Reconstruct Itinerary | Hard | Amazon, Google, Uber |

### Union-Find — [union-find.html](union-find.html)

| | LC | Problem | Diff | Reported at |
|---|---|---|---|---|
| ✓ | 261 | Graph Valid Tree | Med | Google, Meta, Amazon |
| ✓ | 323 | Number of Connected Components | Med | Amazon, Google, Meta |
| ✓ | 547 | Number of Provinces | Med | Amazon, Bloomberg |
| ✓ | 684 | Redundant Connection | Med | Amazon, Google |
| ✓ | 721 | Accounts Merge | Med | Amazon, Meta, Google |
| ✓ | 1584 | Min Cost to Connect All Points | Med | Amazon, Google |
| ✓ | 778 | Swim in Rising Water | Hard | Amazon, Google |

### Greedy — [greedy.html](greedy.html)

| | LC | Problem | Diff | Reported at |
|---|---|---|---|---|
| ✓ | 121 | Best Time to Buy and Sell Stock | Easy | Amazon, Meta, Microsoft, Bloomberg |
| ✓ | 45 | Jump Game II | Med | Amazon, Google |
| ✓ | 53 | Maximum Subarray | Med | Amazon, Microsoft, LinkedIn, Bloomberg |
| ✓ | 55 | Jump Game | Med | Amazon, Meta, Google |
| ✓ | 122 | Best Time to Buy and Sell Stock II | Med | Amazon, Bloomberg |
| ✓ | 134 | Gas Station | Med | Amazon, Google, Bloomberg |
| ✓ | 435 | Non-overlapping Intervals | Med | Amazon, Google |
| ✓ | 621 | Task Scheduler | Med | Amazon, Meta, Google, Uber |
| · | 678 | Valid Parenthesis String | Med | Meta, Amazon |
| ✓ | 763 | Partition Labels | Med | Amazon, Meta, Google |
| ✓ | 767 | Reorganize String | Med | Amazon, Google, Meta |
| ✓ | 846 | Hand of Straights | Med | Google, Amazon |
| ✓ | 135 | Candy | Hard | Amazon, Google |
| ✓ | 502 | IPO | Hard | Amazon, Google |

### Dynamic programming — [dynamic-programming.html](dynamic-programming.html)

| | LC | Problem | Diff | Reported at |
|---|---|---|---|---|
| ✓ | 70 | Climbing Stairs | Easy | Amazon, Google, Adobe |
| ✓ | 746 | Min Cost Climbing Stairs | Easy | Amazon |
| ✓ | 62 | Unique Paths | Med | Amazon, Google, Bloomberg |
| · | 63 | Unique Paths II | Med | Amazon |
| · | 64 | Minimum Path Sum | Med | Amazon, Google |
| ✓ | 72 | Edit Distance | Med | Amazon, Google, Microsoft |
| ✓ | 91 | Decode Ways | Med | Amazon, Meta, Google, Uber |
| · | 97 | Interleaving String | Med | Amazon, Google |
| ✓ | 139 | Word Break | Med | Amazon, Meta, Google, Uber |
| ✓ | 152 | Maximum Product Subarray | Med | Amazon, LinkedIn |
| ✓ | 198 | House Robber | Med | Amazon, Google, LinkedIn |
| ✓ | 213 | House Robber II | Med | Amazon, Microsoft |
| · | 221 | Maximal Square | Med | Amazon, Google |
| ✓ | 300 | Longest Increasing Subsequence | Med | Amazon, Google, Microsoft |
| · | 309 | Best Time to Buy and Sell Stock with Cooldown | Med | Amazon, Google |
| ✓ | 322 | Coin Change | Med | Amazon, Google, Meta, Uber |
| ✓ | 416 | Partition Equal Subset Sum | Med | Amazon, Google |
| ✓ | 494 | Target Sum | Med | Amazon, Meta |
| ✓ | 518 | Coin Change II | Med | Amazon |
| ✓ | 1143 | Longest Common Subsequence | Med | Amazon, Google |
| ✓ | 10 | Regular Expression Matching | Hard | Amazon, Google, Meta |
| · | 44 | Wildcard Matching | Hard | Amazon, Google |
| · | 115 | Distinct Subsequences | Hard | Amazon, Google |
| ✓ | 312 | Burst Balloons | Hard | Amazon, Google |

### Bit manipulation — [bit-manipulation.html](bit-manipulation.html)

| | LC | Problem | Diff | Reported at |
|---|---|---|---|---|
| ✓ | 136 | Single Number | Easy | Amazon, Google, Bloomberg |
| ✓ | 190 | Reverse Bits | Easy | Amazon, Apple |
| ✓ | 191 | Number of 1 Bits | Easy | Amazon, Apple, Microsoft |
| ✓ | 268 | Missing Number | Easy | Amazon, Microsoft |
| ✓ | 338 | Counting Bits | Easy | Amazon, Apple |
| · | 7 | Reverse Integer | Med | Amazon, Bloomberg |
| ✓ | 371 | Sum of Two Integers | Med | Amazon, Microsoft |

---

## 4 · By company

Same caveat as above — directional, not a prediction.

> **Read the pattern distribution, not the problem numbers.** The tag data is
> coarse: Amazon interviews broadly and is reported on almost everything here,
> so its row carries little information. What survives that noise is the
> *relative* pattern weighting, and that is the only column worth planning
> from.

| Company | Tagged | Heaviest patterns |
|---|---|---|
| **Amazon** | 200 | dynamic programming 12%, trees 11%, graphs 8%, greedy 7%, linked lists 7% |
| **Google** | 127 | dynamic programming 14%, graphs 11%, greedy 7%, binary search 7%, stack & monotonic stack 6% |
| **Meta** | 98 | trees 12%, binary search 9%, linked lists 9%, strings 7%, heap & top-k 7% |
| **Microsoft** | 58 | linked lists 15%, trees 15%, graphs 8%, array manipulation 6%, arrays & hashing 5% |
| **Bloomberg** | 40 | trees 20%, linked lists 15%, greedy 10%, stack & monotonic stack 7%, array manipulation 5% |
| **Uber** | 15 | backtracking 26%, dynamic programming 20%, arrays & hashing 13%, strings 6%, heap & top-k 6% |
| **LinkedIn** | 14 | trees 21%, binary search 14%, dynamic programming 14%, intervals 7%, sliding window 7% |
| **Apple** | 11 | arrays & hashing 27%, bit manipulation 27%, linked lists 18%, prefix sums 9%, array manipulation 9% |

**What to take from this table:** every company's top patterns are drawn from
the same small set — trees, graphs, DP, hashing, two pointers. That is the
actual finding, and it is why the handbook is organised by pattern rather than
by company. There is no company-specific curriculum to learn.

**What the table does support:** Google and Amazon lean hardest on dynamic
programming and graphs; Meta, Microsoft and Bloomberg lean on trees and linked
lists. If you are short on time and interviewing at one of the first two,
weight DP and graphs; at the second three, weight trees and pointer work.

**What it does not support:** anything about the rows with fewer than about 40
tags. Uber at 26% backtracking is 4 problems out of 15 — that is sample size,
not a hiring signal. Read only the top five rows as meaningful.

---

## 5 · How to use this

**Do not work through it top to bottom.** 200 problems attempted once is worth
less than 60 problems you can re-derive, and the whole
[practice method](how-to-practise.html) is built on that claim.

| You have | Do |
|---|---|
| **2 weeks** | The 40 marked ✓ in the [problem index](problem-index.html) core, nothing else |
| **6 weeks** | One pattern page per two days, plus its ✓ problems here |
| **3 months** | This whole list, with day-7 and day-30 re-derivation |

**If you have a named company:** read its row in the table above for the
*pattern* weighting, and drill the two or three heaviest. The specific problem
numbers tell you almost nothing — that list will have rotated by the time you
sit down, and the pattern distribution will not have.

**The order within a pattern matters more than the order between patterns.**
Each pattern page's ladder is built so that each rung teaches something the
next one assumes. This page is an index; the ladders are the curriculum.
