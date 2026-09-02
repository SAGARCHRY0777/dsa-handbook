---
title: Tries
slug: tries
module: structures
order: 26
status: live
level: intermediate
summary: Prefix trees — when they beat a hash set, the array-versus-map trade-off, and the trie-plus-backtracking combination that solves the hardest word problems.
---

# Tries (prefix trees)

> **Recognition in one line:** the problem is about **prefixes**, or you are
> matching **many words at once** against something.

A hash set answers "is this exact word present?" in O(1) and is the better
choice when that is the question. A trie earns its place when the question is
about *prefixes* — which a hash set cannot answer at all without checking every
possible one.

---

## 1 · Recognition cues

| Cue | Signal |
|---|---|
| "starts with" / "prefix" | Definitive |
| "autocomplete" / "search suggestions" | Definitive |
| **Search a grid for a whole dictionary** | Definitive — LC 212 |
| "word with wildcards" (`.`) | Strong — a trie plus DFS |
| "longest common prefix" | Strong |
| "replace words with their root" | Strong |
| "maximum XOR of two numbers" | **A bit trie** — non-obvious and worth knowing |

**The anti-cue:** if you only ever look up complete words, use a hash set. It is
O(1), it is one line, and a trie is strictly worse. Saying that out loud is a
better answer than reaching for the fancier structure.

---

## 2 · The structure

```
words: ["cat", "car", "card", "dog"]

              (root)
             /      \
            c        d
            |        |
            a        o
           / \       |
          t*  r*     g*
              |
              d*

* = end of a word

Shared prefixes are stored ONCE. "car", "card" and "cat" share
their first letter; "car" and "card" share three.
```

**The saving is the shared prefix**, and that is also the limitation: for words
with little in common, a trie uses *more* memory than a hash set because every
node carries pointer overhead.

---

## 3 · The template

```python
class TrieNode:
    __slots__ = ("children", "is_word")     # slots matter at 10^5 nodes
    def __init__(self):
        self.children = {}                  # char -> TrieNode
        self.is_word = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word):
        node = self.root
        for ch in word:
            if ch not in node.children:
                node.children[ch] = TrieNode()
            node = node.children[ch]
        node.is_word = True                 # mark only at the END

    def search(self, word):
        node = self._walk(word)
        return node is not None and node.is_word

    def starts_with(self, prefix):
        return self._walk(prefix) is not None   # no is_word check -- the
                                                # difference between the two

    def _walk(self, s):
        node = self.root
        for ch in s:
            if ch not in node.children:
                return None
            node = node.children[ch]
        return node
```

```java
class Trie {
    // Array of 26 is faster than a HashMap when the alphabet is fixed
    // and small: no hashing, no boxing, contiguous memory. It costs
    // 26 references per node even for sparse tries -- the trade-off.
    private final Trie[] children = new Trie[26];
    private boolean isWord = false;

    public void insert(String word) {
        Trie node = this;
        for (char c : word.toCharArray()) {
            int i = c - 'a';
            if (node.children[i] == null) node.children[i] = new Trie();
            node = node.children[i];
        }
        node.isWord = true;
    }

    public boolean search(String word) {
        Trie node = walk(word);
        return node != null && node.isWord;
    }

    public boolean startsWith(String prefix) {
        return walk(prefix) != null;
    }

    private Trie walk(String s) {
        Trie node = this;
        for (char c : s.toCharArray()) {
            node = node.children[c - 'a'];
            if (node == null) return null;
        }
        return node;
    }
}
```

> **`search` and `startsWith` differ by one line**, and that line is the whole
> point of the structure: reaching a node proves the prefix exists; `is_word`
> proves a word ends there.

**Array versus map is a real trade-off worth stating:**

| | Array `[26]` | HashMap |
|---|---|---|
| Speed | Faster — no hashing | Slower |
| Memory | 26 refs per node, even if 1 is used | Only what is present |
| Alphabet | Fixed lowercase only | Any character set |

Use the array for lowercase-only problems, the map for Unicode or sparse tries.

---

## 4 · Complexity

| Operation | Time | Note |
|---|---|---|
| Insert | O(L) | L = word length — **independent of how many words are stored** |
| Search | O(L) | Same |
| Prefix search | O(L) | Same |
| Space | O(total characters × alphabet) | The real cost |

**The headline property:** lookup does not depend on the number of stored words.
A trie holding a million words searches as fast as one holding ten. That is what
you trade the memory for.

---

## 5 · The ladder

| # | Problem | Source | The point |
|---|---|---|---|
| 1 | **Implement Trie** | LC 208 · NeetCode | The template |
| 2 | Longest Common Prefix | LC 14 | Walk until branching (a trie is overkill, but instructive) |
| 3 | **Design Add and Search Words** | LC 211 · NeetCode | **Wildcards → DFS over children** |
| 4 | Replace Words | LC 648 | Stop at the first `is_word` |
| 5 | Map Sum Pairs | LC 677 | Aggregate over a subtree |
| 6 | Implement Magic Dictionary | LC 676 | Exactly one character differs |
| 7 | **Word Search II** | LC 212 · NeetCode | **Trie + backtracking — the canonical hard one** |
| 8 | Design Search Autocomplete | LC 642 | Top-k per node |
| 9 | **Maximum XOR of Two Numbers** | LC 421 | **Bit trie — the surprising application** |
| 10 | Concatenated Words | LC 472 | Trie + DP |
| 11 | Palindrome Pairs | LC 336 | Trie of reversed words |
| 12 | Stream of Characters | LC 1032 | Trie of *reversed* words, matched backwards |

**If you only do three: 208, 211, 212.**

---

## 6 · Worked example — LC 211, wildcards

**Problem:** `search` may contain `.`, matching any single character.

**The insight:** a `.` means you cannot follow one edge — you must try **all** of
them. That turns the walk into a DFS.

```
trie: ["bad", "dad", "mad"]

search("b..")
  'b' -> follow the b edge
  '.' -> try EVERY child of that node
  '.' -> try every child again
  end -> is_word?  yes -> true
```

```python
class WordDictionary:
    def __init__(self):
        self.root = TrieNode()

    def add_word(self, word):
        node = self.root
        for ch in word:
            node = node.children.setdefault(ch, TrieNode())
        node.is_word = True

    def search(self, word):
        def dfs(index, node):
            if index == len(word):
                return node.is_word

            ch = word[index]
            if ch == ".":
                # Branch: any child could lead to a match.
                return any(dfs(index + 1, child)
                           for child in node.children.values())

            # Ordinary character: exactly one edge, or fail.
            return ch in node.children and dfs(index + 1, node.children[ch])

        return dfs(0, self.root)
```

**Complexity:** O(L) with no wildcards; worst case O(26^d × L) where d is the
number of dots — a leading `.` forces branching across the whole alphabet.
**Say that** rather than claiming O(L) unconditionally.

---

## 7 · Worked example — LC 212, Word Search II

**Problem:** given a grid and a list of words, return every word findable in the
grid.

**Why this is the canonical trie problem:** running the single-word search (LC
79) once per word re-walks the grid W times. **Put the words in a trie and walk
the grid once**, carrying a trie node alongside the position — every word is
matched simultaneously.

```
Naive:  for each word: DFS the whole grid       O(W · m·n·4^L)
Trie:   DFS the grid ONCE, carrying a trie node O(m·n·4^L)

The trie also PRUNES: the moment the current path is not a prefix of
any word, there is no child to follow and the branch dies immediately.
That pruning matters more than the asymptotic saving.
```

```python
def find_words(board, words):
    root = TrieNode()
    for w in words:
        node = root
        for ch in w:
            node = node.children.setdefault(ch, TrieNode())
        node.word = w                     # store the word AT the end node

    rows, cols = len(board), len(board[0])
    found = []

    def dfs(r, c, node):
        ch = board[r][c]
        child = node.children.get(ch)
        if child is None:
            return                        # not a prefix of anything -- prune

        if child.word:
            found.append(child.word)
            child.word = None             # de-duplicate without a set

        board[r][c] = "#"                 # mark visited
        for dr, dc in ((1,0), (-1,0), (0,1), (0,-1)):
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and board[nr][nc] != "#":
                dfs(nr, nc, child)
        board[r][c] = ch                  # backtrack

        # Optimisation that matters: once a node's word is consumed and it
        # has no children left, unlink it. The trie shrinks as words are
        # found, so later grid cells prune faster.
        if not child.children:
            node.children.pop(ch)

    for r in range(rows):
        for c in range(cols):
            dfs(r, c, root)
    return found
```

**Three details worth being able to explain:**

| Detail | Why |
|---|---|
| Store the *word* at the end node | No need to rebuild the string from the path |
| Set `word = None` after finding | Deduplicates without a separate set |
| **Prune exhausted branches** | The trie shrinks as you go; later cells fail faster |

**The pruning is the answer to "how would you optimise this?"** and it is the
follow-up this problem exists to ask.

---

## 8 · The bit trie

**The application nobody expects**, and knowing it is a genuine edge.

**LC 421 — maximum XOR of two numbers in an array.** Insert each number as a
32-bit path (a trie of `0`/`1`), then for each number greedily walk toward the
*opposite* bit at every level, because XOR is maximised by differing bits.

```
To maximise a XOR b, at each bit position from the most significant
down, prefer the branch with the OPPOSITE bit to a's. Take it if it
exists; otherwise take what is there.

Greedy works because a higher bit outweighs every lower bit combined:
2^k > 2^(k-1) + ... + 2^0.
```

```python
def find_maximum_xor(nums):
    root = {}
    for num in nums:                        # insert as 32-bit paths
        node = root
        for i in range(31, -1, -1):
            bit = (num >> i) & 1
            node = node.setdefault(bit, {})

    best = 0
    for num in nums:
        node, current = root, 0
        for i in range(31, -1, -1):
            bit = (num >> i) & 1
            want = 1 - bit                  # opposite bit maximises XOR
            if want in node:
                current |= (1 << i)
                node = node[want]
            else:
                node = node[bit]
        best = max(best, current)
    return best
```

O(32n) instead of O(n²). **The transferable idea: a trie indexes any sequence,
and a number is a sequence of bits.**

---

## 9 · Failure modes

| Bug | Symptom | Fix |
|---|---|---|
| Marking `is_word` on every node | "ca" reports as a word | Mark only at the last character |
| `search` not checking `is_word` | Prefixes match as words | The one-line difference |
| Array of 26 for mixed case/digits | Index out of range | Use a map |
| Forgetting to backtrack in grid DFS | Wrong results | Restore the cell after recursing |
| Not deduplicating results | Duplicate words | Null out `word` when consumed |
| Recursion depth on long words | Stack overflow | Iterative walk where possible |
| Using a trie for exact lookups only | Works, wastes memory | A hash set is better — say so |

---

## 10 · Interview questions

| Question | What to say |
|---|---|
| ⭐ "Trie or hash set?" | Hash set for exact lookups — O(1) and one line. A trie earns its place when the question involves prefixes, which a hash set cannot answer without enumerating them, or when I need to match many words at once against something. |
| ⭐ "What is the complexity?" | O(L) per operation, independent of how many words are stored — that independence is the property you are buying. Space is the cost: O(total characters), times the alphabet size if you use fixed arrays. |
| "Array or map for children?" | Array of 26 for lowercase-only — faster, no hashing — but it costs 26 references per node even when one is used. Map for large or sparse alphabets. |
| ⭐ "How do wildcards work?" | A `.` means you cannot follow a single edge, so you recurse into every child — the walk becomes a DFS. Worst case is 26^d for d dots, so a leading dot is expensive. |
| ⭐ "Why a trie for Word Search II?" | Searching each word separately re-walks the grid once per word. One trie lets a single grid DFS match every word simultaneously, and the trie prunes: if the current path is not a prefix of any word, the branch dies instantly. I'd also unlink exhausted nodes so the trie shrinks as words are found. |
| "Where else does a trie apply?" | Anything that is a sequence — including bits. Maximum XOR builds a 32-level binary trie and greedily walks toward opposite bits, which turns O(n²) into O(32n). |
| "How do you do autocomplete?" | Walk to the prefix node, then collect words in its subtree. For latency-critical use, precompute the top-k at each node so a query is a walk plus a read rather than a subtree traversal. |

---

## Stop condition

You know this pattern when you can:

1. write insert/search/startsWith from memory,
2. say when a hash set is the better answer,
3. give the one-line difference between search and startsWith,
4. handle wildcards with DFS and state the real complexity,
5. explain the trie-plus-backtracking pruning in LC 212, and
6. describe the bit trie for maximum XOR.
