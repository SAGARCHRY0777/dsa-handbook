#!/usr/bin/env python3
"""Top-200 interview problem dataset. Pure data -- no side effects.

Sources: Blind 75, NeetCode 150, Grind 75, LeetCode Top Interview 150, plus
community-reported company associations. NOT Big Omega or LeetCode Premium
frequency data -- see content/company-questions.md for the caveat that ships
to readers.

Consumed by gen-company-questions.py.
"""

# (lc, title, difficulty, pattern, companies)
P = [
# --- Arrays & hashing ---
(1,   "Two Sum", "E", "hashing", "Amazon Google Microsoft Apple Meta Bloomberg"),
(217, "Contains Duplicate", "E", "hashing", "Amazon Apple Microsoft"),
(242, "Valid Anagram", "E", "strings", "Amazon Uber Meta"),
(49,  "Group Anagrams", "M", "hashing", "Amazon Meta Uber Google"),
(347, "Top K Frequent Elements", "M", "heap", "Amazon Meta Google Uber"),
(238, "Product of Array Except Self", "M", "prefix-sum", "Amazon Meta Apple Microsoft"),
(36,  "Valid Sudoku", "M", "hashing", "Amazon Apple Uber"),
(128, "Longest Consecutive Sequence", "M", "hashing", "Google Meta Amazon"),
(271, "Encode and Decode Strings", "M", "strings", "Google Meta"),
(560, "Subarray Sum Equals K", "M", "prefix-sum", "Meta Amazon Google"),
(169, "Majority Element", "E", "hashing", "Amazon Adobe"),
(283, "Move Zeroes", "E", "two-pointers", "Meta Amazon"),
(88,  "Merge Sorted Array", "E", "two-pointers", "Meta Amazon Microsoft"),
(48,  "Rotate Image", "M", "arrays", "Amazon Microsoft Apple"),
(54,  "Spiral Matrix", "M", "arrays", "Amazon Microsoft Google"),
(73,  "Set Matrix Zeroes", "M", "arrays", "Amazon Microsoft"),
(289, "Game of Life", "M", "arrays", "Amazon Google Bloomberg"),
(41,  "First Missing Positive", "H", "arrays", "Amazon Google Microsoft"),
(31,  "Next Permutation", "M", "arrays", "Google Meta Bloomberg"),
(75,  "Sort Colors", "M", "two-pointers", "Meta Amazon Microsoft"),
(56,  "Merge Intervals", "M", "intervals", "Amazon Meta Google Bloomberg"),
(57,  "Insert Interval", "M", "intervals", "Google Amazon LinkedIn"),
(435, "Non-overlapping Intervals", "M", "greedy", "Amazon Google"),
(252, "Meeting Rooms", "E", "intervals", "Meta Amazon Google"),
(253, "Meeting Rooms II", "M", "intervals", "Amazon Google Meta Bloomberg"),
(1288,"Remove Covered Intervals", "M", "intervals", "Amazon"),

# --- Two pointers / sliding window ---
(15,  "3Sum", "M", "two-pointers", "Amazon Meta Google Adobe"),
(18,  "4Sum", "M", "two-pointers", "Amazon Google"),
(11,  "Container With Most Water", "M", "two-pointers", "Amazon Meta Google Bloomberg"),
(42,  "Trapping Rain Water", "H", "two-pointers", "Amazon Google Meta Bloomberg"),
(125, "Valid Palindrome", "E", "strings", "Meta Amazon Microsoft"),
(680, "Valid Palindrome II", "E", "two-pointers", "Meta"),
(167, "Two Sum II", "M", "two-pointers", "Amazon Apple"),
(3,   "Longest Substring Without Repeating Characters", "M", "sliding-window", "Amazon Meta Google Microsoft Bloomberg"),
(424, "Longest Repeating Character Replacement", "M", "sliding-window", "Google Amazon"),
(76,  "Minimum Window Substring", "H", "sliding-window", "Amazon Meta Google LinkedIn"),
(567, "Permutation in String", "M", "sliding-window", "Microsoft Amazon"),
(438, "Find All Anagrams in a String", "M", "sliding-window", "Amazon Meta"),
(239, "Sliding Window Maximum", "H", "sliding-window", "Amazon Google Meta"),
(209, "Minimum Size Subarray Sum", "M", "sliding-window", "Meta Amazon Google"),
(121, "Best Time to Buy and Sell Stock", "E", "greedy", "Amazon Meta Microsoft Bloomberg"),
(122, "Best Time to Buy and Sell Stock II", "M", "greedy", "Amazon Bloomberg"),

# --- Stack ---
(20,  "Valid Parentheses", "E", "stack", "Amazon Google Meta Microsoft Bloomberg"),
(155, "Min Stack", "M", "stack", "Amazon Google Bloomberg Uber"),
(150, "Evaluate Reverse Polish Notation", "M", "stack", "Amazon LinkedIn"),
(22,  "Generate Parentheses", "M", "backtracking", "Amazon Google Meta Uber"),
(739, "Daily Temperatures", "M", "stack", "Amazon Google"),
(853, "Car Fleet", "M", "stack", "Amazon Google"),
(84,  "Largest Rectangle in Histogram", "H", "stack", "Amazon Google Meta"),
(85,  "Maximal Rectangle", "H", "stack", "Amazon Google"),
(394, "Decode String", "M", "strings", "Google Amazon Bloomberg"),
(227, "Basic Calculator II", "M", "strings", "Amazon Google Meta"),
(224, "Basic Calculator", "H", "stack", "Google Amazon"),
(496, "Next Greater Element I", "E", "stack", "Amazon Bloomberg"),
(503, "Next Greater Element II", "M", "stack", "Amazon"),
(316, "Remove Duplicate Letters", "H", "stack", "Google Amazon"),
(71,  "Simplify Path", "M", "stack", "Meta Microsoft"),

# --- Binary search ---
(704, "Binary Search", "E", "binary-search", "Amazon Google"),
(74,  "Search a 2D Matrix", "M", "binary-search", "Amazon Microsoft"),
(875, "Koko Eating Bananas", "M", "binary-search", "Amazon Google Meta"),
(153, "Find Minimum in Rotated Sorted Array", "M", "binary-search", "Amazon Meta Microsoft"),
(33,  "Search in Rotated Sorted Array", "M", "binary-search", "Amazon Meta Microsoft Bloomberg"),
(981, "Time Based Key-Value Store", "M", "binary-search", "Amazon Google Meta"),
(4,   "Median of Two Sorted Arrays", "H", "binary-search", "Amazon Google Meta Adobe"),
(410, "Split Array Largest Sum", "H", "binary-search", "Google Amazon"),
(1011,"Capacity To Ship Packages", "M", "binary-search", "Amazon Google"),
(162, "Find Peak Element", "M", "binary-search", "Meta Google Amazon"),
(34,  "Find First and Last Position", "M", "binary-search", "Meta Amazon LinkedIn"),
(35,  "Search Insert Position", "E", "binary-search", "Amazon"),
(278, "First Bad Version", "E", "binary-search", "Meta Google"),

# --- Linked list ---
(206, "Reverse Linked List", "E", "linked-lists", "Amazon Google Meta Microsoft Apple"),
(21,  "Merge Two Sorted Lists", "E", "linked-lists", "Amazon Google Microsoft Apple"),
(143, "Reorder List", "M", "linked-lists", "Amazon Meta Microsoft"),
(19,  "Remove Nth Node From End of List", "M", "linked-lists", "Amazon Meta Google"),
(138, "Copy List with Random Pointer", "M", "linked-lists", "Amazon Meta Microsoft Bloomberg"),
(2,   "Add Two Numbers", "M", "linked-lists", "Amazon Microsoft Meta Bloomberg"),
(141, "Linked List Cycle", "E", "linked-lists", "Amazon Microsoft Bloomberg"),
(142, "Linked List Cycle II", "M", "linked-lists", "Amazon Microsoft"),
(146, "LRU Cache", "M", "linked-lists", "Amazon Meta Google Microsoft Bloomberg"),
(460, "LFU Cache", "H", "linked-lists", "Amazon Google Bloomberg"),
(23,  "Merge k Sorted Lists", "H", "heap", "Amazon Google Meta Microsoft"),
(25,  "Reverse Nodes in k-Group", "H", "linked-lists", "Amazon Meta Microsoft"),
(287, "Find the Duplicate Number", "M", "linked-lists", "Amazon Google Meta"),
(234, "Palindrome Linked List", "E", "linked-lists", "Amazon Meta"),
(160, "Intersection of Two Linked Lists", "E", "linked-lists", "Amazon Bloomberg"),

# --- Trees ---
(226, "Invert Binary Tree", "E", "trees", "Google Amazon"),
(104, "Maximum Depth of Binary Tree", "E", "trees", "Amazon Google LinkedIn"),
(543, "Diameter of Binary Tree", "E", "trees", "Meta Amazon Google"),
(110, "Balanced Binary Tree", "E", "trees", "Amazon Google"),
(100, "Same Tree", "E", "trees", "Amazon Bloomberg"),
(572, "Subtree of Another Tree", "E", "trees", "Amazon Meta"),
(235, "LCA of a BST", "M", "trees", "Amazon Meta Microsoft"),
(236, "LCA of a Binary Tree", "M", "trees", "Amazon Meta Microsoft LinkedIn"),
(102, "Binary Tree Level Order Traversal", "M", "trees", "Amazon Meta Microsoft Bloomberg"),
(199, "Binary Tree Right Side View", "M", "trees", "Meta Amazon Google"),
(1448,"Count Good Nodes in Binary Tree", "M", "trees", "Amazon Microsoft"),
(98,  "Validate Binary Search Tree", "M", "trees", "Amazon Meta Microsoft Bloomberg"),
(230, "Kth Smallest Element in a BST", "M", "trees", "Amazon Meta Bloomberg"),
(105, "Construct Binary Tree from Preorder and Inorder", "M", "trees", "Amazon Meta Microsoft"),
(124, "Binary Tree Maximum Path Sum", "H", "trees", "Amazon Meta Google Microsoft"),
(297, "Serialize and Deserialize Binary Tree", "H", "trees", "Amazon Meta Google LinkedIn"),
(112, "Path Sum", "E", "trees", "Amazon Bloomberg"),
(113, "Path Sum II", "M", "trees", "Amazon Bloomberg"),
(437, "Path Sum III", "M", "prefix-sum", "Amazon Google"),
(114, "Flatten Binary Tree to Linked List", "M", "trees", "Amazon Microsoft"),
(103, "Binary Tree Zigzag Level Order Traversal", "M", "trees", "Amazon Microsoft Bloomberg"),
(863, "All Nodes Distance K in Binary Tree", "M", "trees", "Amazon Meta"),
(662, "Maximum Width of Binary Tree", "M", "trees", "Amazon Bloomberg"),

# --- Tries ---
(208, "Implement Trie", "M", "tries", "Amazon Google Microsoft Bloomberg"),
(211, "Design Add and Search Words", "M", "tries", "Amazon Meta Google"),
(212, "Word Search II", "H", "tries", "Amazon Google Microsoft Uber"),
(648, "Replace Words", "M", "tries", "Amazon Google"),
(1032,"Stream of Characters", "H", "tries", "Google Amazon"),

# --- Heap ---
(703, "Kth Largest Element in a Stream", "E", "heap", "Amazon Meta"),
(1046,"Last Stone Weight", "E", "heap", "Amazon Google"),
(973, "K Closest Points to Origin", "M", "heap", "Amazon Meta Google LinkedIn"),
(215, "Kth Largest Element in an Array", "M", "heap", "Amazon Meta Google Microsoft"),
(621, "Task Scheduler", "M", "greedy", "Amazon Meta Google Uber"),
(355, "Design Twitter", "M", "heap", "Amazon Meta Twitter"),
(295, "Find Median from Data Stream", "H", "heap", "Amazon Google Meta Microsoft"),
(502, "IPO", "H", "greedy", "Amazon Google"),
(1094,"Car Pooling", "M", "intervals", "Amazon Google"),
(767, "Reorganize String", "M", "greedy", "Amazon Google Meta"),

# --- Backtracking ---
(78,  "Subsets", "M", "backtracking", "Amazon Meta Google Bloomberg"),
(90,  "Subsets II", "M", "backtracking", "Amazon Meta"),
(39,  "Combination Sum", "M", "backtracking", "Amazon Meta Uber"),
(40,  "Combination Sum II", "M", "backtracking", "Amazon"),
(46,  "Permutations", "M", "backtracking", "Amazon Meta Microsoft LinkedIn"),
(47,  "Permutations II", "M", "backtracking", "Amazon Microsoft"),
(79,  "Word Search", "M", "backtracking", "Amazon Meta Microsoft Bloomberg"),
(131, "Palindrome Partitioning", "M", "backtracking", "Amazon Google"),
(17,  "Letter Combinations of a Phone Number", "M", "backtracking", "Amazon Meta Google Uber"),
(51,  "N-Queens", "H", "backtracking", "Amazon Google"),
(37,  "Sudoku Solver", "H", "backtracking", "Amazon Google Uber"),

# --- Graphs ---
(200, "Number of Islands", "M", "graphs", "Amazon Meta Google Microsoft Bloomberg"),
(695, "Max Area of Island", "M", "graphs", "Amazon Google"),
(133, "Clone Graph", "M", "graphs", "Amazon Meta Google"),
(994, "Rotting Oranges", "M", "graphs", "Amazon Google Microsoft"),
(417, "Pacific Atlantic Water Flow", "M", "graphs", "Amazon Google"),
(130, "Surrounded Regions", "M", "graphs", "Amazon Microsoft"),
(207, "Course Schedule", "M", "graphs", "Amazon Meta Google Microsoft"),
(210, "Course Schedule II", "M", "graphs", "Amazon Meta Google Microsoft"),
(261, "Graph Valid Tree", "M", "union-find", "Google Meta Amazon"),
(323, "Number of Connected Components", "M", "union-find", "Amazon Google Meta"),
(684, "Redundant Connection", "M", "union-find", "Amazon Google"),
(721, "Accounts Merge", "M", "union-find", "Amazon Meta Google"),
(547, "Number of Provinces", "M", "union-find", "Amazon Bloomberg"),
(127, "Word Ladder", "H", "graphs", "Amazon Meta Google LinkedIn"),
(269, "Alien Dictionary", "H", "graphs", "Amazon Meta Google Airbnb"),
(332, "Reconstruct Itinerary", "H", "graphs", "Amazon Google Uber"),
(743, "Network Delay Time", "M", "graphs", "Amazon Google"),
(787, "Cheapest Flights Within K Stops", "M", "graphs", "Amazon Google"),
(1584,"Min Cost to Connect All Points", "M", "union-find", "Amazon Google"),
(778, "Swim in Rising Water", "H", "union-find", "Amazon Google"),
(286, "Walls and Gates", "M", "graphs", "Amazon Meta Google"),
(797, "All Paths From Source to Target", "M", "graphs", "Amazon Google"),
(1926,"Nearest Exit from Entrance in Maze", "M", "graphs", "Amazon"),

# --- Dynamic programming ---
(70,  "Climbing Stairs", "E", "dynamic-programming", "Amazon Google Adobe"),
(746, "Min Cost Climbing Stairs", "E", "dynamic-programming", "Amazon"),
(198, "House Robber", "M", "dynamic-programming", "Amazon Google LinkedIn"),
(213, "House Robber II", "M", "dynamic-programming", "Amazon Microsoft"),
(5,   "Longest Palindromic Substring", "M", "strings", "Amazon Meta Microsoft Bloomberg"),
(647, "Palindromic Substrings", "M", "strings", "Amazon Meta"),
(91,  "Decode Ways", "M", "dynamic-programming", "Amazon Meta Google Uber"),
(322, "Coin Change", "M", "dynamic-programming", "Amazon Google Meta Uber"),
(152, "Maximum Product Subarray", "M", "dynamic-programming", "Amazon LinkedIn"),
(139, "Word Break", "M", "dynamic-programming", "Amazon Meta Google Uber"),
(300, "Longest Increasing Subsequence", "M", "dynamic-programming", "Amazon Google Microsoft"),
(416, "Partition Equal Subset Sum", "M", "dynamic-programming", "Amazon Google"),
(53,  "Maximum Subarray", "M", "greedy", "Amazon Microsoft LinkedIn Bloomberg"),
(55,  "Jump Game", "M", "greedy", "Amazon Meta Google"),
(45,  "Jump Game II", "M", "greedy", "Amazon Google"),
(62,  "Unique Paths", "M", "dynamic-programming", "Amazon Google Bloomberg"),
(63,  "Unique Paths II", "M", "dynamic-programming", "Amazon"),
(64,  "Minimum Path Sum", "M", "dynamic-programming", "Amazon Google"),
(1143,"Longest Common Subsequence", "M", "dynamic-programming", "Amazon Google"),
(72,  "Edit Distance", "M", "dynamic-programming", "Amazon Google Microsoft"),
(10,  "Regular Expression Matching", "H", "dynamic-programming", "Amazon Google Meta"),
(44,  "Wildcard Matching", "H", "dynamic-programming", "Amazon Google"),
(312, "Burst Balloons", "H", "dynamic-programming", "Amazon Google"),
(115, "Distinct Subsequences", "H", "dynamic-programming", "Amazon Google"),
(309, "Best Time to Buy and Sell Stock with Cooldown", "M", "dynamic-programming", "Amazon Google"),
(494, "Target Sum", "M", "dynamic-programming", "Amazon Meta"),
(518, "Coin Change II", "M", "dynamic-programming", "Amazon"),
(97,  "Interleaving String", "M", "dynamic-programming", "Amazon Google"),
(329, "Longest Increasing Path in a Matrix", "H", "graphs", "Amazon Google"),
(221, "Maximal Square", "M", "dynamic-programming", "Amazon Google"),

# --- Greedy ---
(134, "Gas Station", "M", "greedy", "Amazon Google Bloomberg"),
(763, "Partition Labels", "M", "greedy", "Amazon Meta Google"),
(846, "Hand of Straights", "M", "greedy", "Google Amazon"),
(678, "Valid Parenthesis String", "M", "greedy", "Meta Amazon"),
(135, "Candy", "H", "greedy", "Amazon Google"),

# --- Bit manipulation ---
(136, "Single Number", "E", "bit-manipulation", "Amazon Google Bloomberg"),
(191, "Number of 1 Bits", "E", "bit-manipulation", "Amazon Apple Microsoft"),
(338, "Counting Bits", "E", "bit-manipulation", "Amazon Apple"),
(190, "Reverse Bits", "E", "bit-manipulation", "Amazon Apple"),
(268, "Missing Number", "E", "bit-manipulation", "Amazon Microsoft"),
(371, "Sum of Two Integers", "M", "bit-manipulation", "Amazon Microsoft"),
(7,   "Reverse Integer", "M", "bit-manipulation", "Amazon Bloomberg"),
(50,  "Pow(x, n)", "M", "binary-search", "Amazon Meta Google LinkedIn"),
(43,  "Multiply Strings", "M", "strings", "Meta Amazon"),
(66,  "Plus One", "E", "arrays", "Amazon Google"),

# --- Design ---
(380, "Insert Delete GetRandom O(1)", "M", "hashing", "Amazon Google Meta"),
(146, "LRU Cache", "M", "linked-lists", "Amazon Meta Google Microsoft"),
(295, "Find Median from Data Stream", "H", "heap", "Amazon Google Meta"),
(155, "Min Stack", "M", "stack", "Amazon Bloomberg"),
(348, "Design Tic-Tac-Toe", "M", "hashing", "Amazon Microsoft"),
(642, "Design Search Autocomplete System", "H", "tries", "Amazon Google"),
(288, "Unique Word Abbreviation", "M", "hashing", "Google"),
]

# de-dup by LC number, keeping the first occurrence
seen, PROBLEMS = set(), []
for _lc, _title, _diff, _pattern, _comps in P:
    if not _title or _lc in seen:
        continue
    seen.add(_lc)
    PROBLEMS.append({"lc": _lc, "title": _title, "diff": _diff,
                     "pattern": _pattern, "companies": _comps.split()})

if __name__ == "__main__":
    print(f"{len(PROBLEMS)} problems")
