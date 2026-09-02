---
title: Strings
slug: strings
module: linear
order: 14
status: live
level: basic → advanced
summary: The five string sub-patterns, why concatenation in a loop is O(n²), palindromes by expansion, and the rolling hash and KMP you should be able to sketch.
---

# Strings

> **Strings are not one pattern.** They are five, wearing the same costume:
> counting, two pointers, expansion, parsing, and matching. Naming which one you
> are in is most of the work.

---

## 1 · The five sub-patterns

| Sub-pattern | Cue | Tool | Canonical |
|---|---|---|---|
| **Counting** | "anagram", "permutation", "frequency" | Hash map or `int[26]` | LC 242, 49, 438 |
| **Two pointers** | "palindrome", "reverse", "compare from both ends" | Two indices | LC 125, 344, 680 |
| **Expansion** | "longest palindromic…" | Expand from each centre | LC 5, 647 |
| **Parsing** | "evaluate", "decode", "valid" | Stack or an index cursor | LC 20, 394, 227 |
| **Matching** | "find the pattern", "repeated substring" | Rolling hash / KMP | LC 28, 459, 214 |

**Plus two that live on their own pages:** substring-with-constraint problems are
[sliding window](sliding-window.html), and prefix problems are
[tries](tries.html).

> **Classify before you code.** "Longest substring without repeating characters"
> is sliding window; "longest palindromic substring" is expansion. They sound
> alike and share nothing.

---

## 2 · The performance trap

**The single most common string bug in interviews**, and it is invisible until
someone asks about complexity.

```
Strings are IMMUTABLE in both Java and Python.

  s += char   inside a loop
  -> allocates a NEW string and copies everything, every iteration
  -> 1 + 2 + 3 + ... + n  =  O(n^2)

Building a 100,000-character string this way does ~5 billion copies.
```

| Language | Wrong | Right |
|---|---|---|
| Python | `s += ch` in a loop | `parts.append(ch)` … `"".join(parts)` |
| Java | `s += ch` in a loop | `StringBuilder.append(ch)` … `.toString()` |

```python
# O(n^2) -- looks innocent
result = ""
for ch in text:
    result += ch

# O(n)
parts = []
for ch in text:
    parts.append(ch)
result = "".join(parts)
```

**Say this out loud when you write it.** *"I'm using a list and joining because
string concatenation in a loop is quadratic"* is a free complexity point, and
the interviewer was going to ask.

**Other costs worth knowing:**

| Operation | Python | Java |
|---|---|---|
| Length | O(1) | O(1) |
| Index | O(1) | O(1) |
| Slice / substring | **O(k)** — copies | **O(k)** since Java 7u6 — copies |
| Concatenate | O(n+m) | O(n+m) |
| `in` / `contains` | O(n·m) worst | O(n·m) worst |
| Compare | O(min) | O(min) |

> **Slicing is not free**, and it is the second-most-common hidden quadratic:
> `s[i:]` inside a loop copies the tail every iteration. Pass indices instead of
> slices.

---

## 3 · Counting

`int[26]` beats a hash map when the alphabet is fixed — no hashing, no boxing,
and comparing two arrays is a single loop.

```python
def is_anagram(s, t):
    if len(s) != len(t):
        return False                      # cheap early exit
    counts = [0] * 26
    for a, b in zip(s, t):
        counts[ord(a) - ord("a")] += 1
        counts[ord(b) - ord("a")] -= 1    # one pass, not two
    return all(c == 0 for c in counts)
```

```java
public boolean isAnagram(String s, String t) {
    if (s.length() != t.length()) return false;
    int[] counts = new int[26];
    for (int i = 0; i < s.length(); i++) {
        counts[s.charAt(i) - 'a']++;
        counts[t.charAt(i) - 'a']--;
    }
    for (int c : counts) if (c != 0) return false;
    return true;
}
```

**Incrementing and decrementing in one pass** is neater than building two maps
and comparing, and it is the version to write.

**For grouping anagrams (LC 49), the key is the question:**

| Key | Cost | Note |
|---|---|---|
| Sorted string | O(k log k) per word | Simple, usually fine |
| **Count tuple `(0,1,0,…)`** | **O(k)** per word | Faster; the better answer |

---

## 4 · Palindromes — expand from centre

**The pattern for "longest palindromic substring" (LC 5) and "count palindromic
substrings" (LC 647).**

```
Every palindrome has a centre. Try all centres, expand outward.

  2n - 1 centres:  n single characters (odd length)
                   n-1 gaps between characters (even length)

Both cases are needed. Handling only odd centres silently misses "abba".
```

```python
def longest_palindrome(s):
    if not s:
        return ""
    start, length = 0, 1

    def expand(left, right):
        # Grow while the characters match and we are in bounds.
        while left >= 0 and right < len(s) and s[left] == s[right]:
            left -= 1
            right += 1
        # Loop exits one step PAST the palindrome, so the actual span
        # is (left+1 .. right-1), of length right - left - 1.
        return left + 1, right - left - 1

    for i in range(len(s)):
        for l, r in ((i, i), (i, i + 1)):        # odd centre, then even
            lo, ln = expand(l, r)
            if ln > length:
                start, length = lo, ln

    return s[start:start + length]
```

**O(n²) time, O(1) space.** The DP solution is also O(n²) time but O(n²) space,
so expansion is strictly better — worth saying when you choose it.

> **`right - left - 1` is the off-by-one that bites.** The loop exits one step
> past both ends, so the span shrinks by two, not one — draw it once and it
> stays learned.

**Manacher's algorithm** gets this to O(n). It is almost never required; knowing
it *exists* and that expansion is the expected answer is the right level of
knowledge.

---

## 5 · Parsing

**Nested structure means a stack.** The shape is always the same:

```
For every character:
    opening delimiter  -> PUSH the current context, start a fresh one
    closing delimiter  -> POP, combine the finished piece into the parent
    otherwise          -> accumulate into the current context
```

**LC 394 (Decode String), `3[a2[c]]` → `accaccacc`:**

```python
def decode_string(s):
    stack = []                  # (previous_string, repeat_count)
    current = ""
    number = 0

    for ch in s:
        if ch.isdigit():
            number = number * 10 + int(ch)     # multi-digit: "12[a]"
        elif ch == "[":
            stack.append((current, number))    # save the OUTER context
            current, number = "", 0            # start fresh inside
        elif ch == "]":
            previous, count = stack.pop()
            current = previous + current * count   # fold inward result out
        else:
            current += ch
    return current
```

**Two details:** `number * 10 + digit` handles multi-digit counts (`12[a]`), and
pushing `(current, number)` rather than just the number is what lets the inner
result be folded back into its parent correctly.

---

## 6 · Pattern matching

### Rolling hash (Rabin-Karp)

**The one to reach for**, because it is short and it generalises to "find any of
these k patterns" and to LC 1044 (Longest Duplicate Substring).

```
Treat the window as a base-B number mod a large prime.

  hash("abc") = a·B^2 + b·B + c   (mod P)

Slide by one:
  remove the leading char, shift, add the trailing char -- all O(1)

  hash = (hash - s[i] * B^(k-1)) * B + s[i+k]   (mod P)

Collisions are possible, so VERIFY a hash match with a real comparison.
Expected O(n + m); worst case O(n·m) if an adversary forces collisions.
```

> **Always say "and I'd verify the match".** A rolling hash that trusts the hash
> is wrong, and mentioning the verification step is what shows you understand it
> rather than recite it.

### KMP — sketch, do not memorise

```
Build a "failure" array: lps[i] = length of the longest proper prefix
of pattern[0..i] that is also a suffix of it.

On a mismatch at pattern position j, instead of restarting, jump to
lps[j-1] -- because those characters are already known to match.

The text pointer NEVER moves backwards.  O(n + m).
```

**In an interview, `s.indexOf(pattern)` or `pattern in s` is usually the correct
answer**, with "I could implement KMP for O(n+m) guaranteed if you want the
manual version." Being asked to write KMP from scratch is rare; being asked what
it does is common.

**The LPS array has a second use worth knowing:** LC 459 (Repeated Substring
Pattern) and LC 214 (Shortest Palindrome) both fall straight out of it.

---

## 7 · The ladder

### Foundational

| # | Problem | Source | The point |
|---|---|---|---|
| 1 | **Valid Anagram** | LC 242 · NeetCode | `int[26]`, one pass |
| 2 | **Valid Palindrome** | LC 125 · NeetCode | Two pointers + filtering |
| 3 | Reverse String | LC 344 | In place, two pointers |
| 4 | **Group Anagrams** | LC 49 · NeetCode | Count tuple as the key |
| 5 | **Valid Parentheses** | LC 20 · NeetCode | The stack template |
| 6 | Longest Common Prefix | LC 14 | Vertical scan |

### Medium

| # | Problem | Source | The point |
|---|---|---|---|
| 7 | **Longest Palindromic Substring** | LC 5 · NeetCode | **Expand from centre, both parities** |
| 8 | Palindromic Substrings | LC 647 · NeetCode | Same expansion, counting |
| 9 | **Decode String** | LC 394 | Stack of contexts |
| 10 | String to Integer (atoi) | LC 8 | Edge cases are the problem |
| 11 | Valid Palindrome II | LC 680 | One deletion allowed — branch once |
| 12 | Find All Anagrams in a String | LC 438 · NeetCode | Sliding window + counts |
| 13 | **Longest Repeating Character Replacement** | LC 424 · NeetCode | Sliding window on counts |
| 14 | Basic Calculator II | LC 227 | Parsing with precedence |
| 15 | Encode and Decode Strings | LC 271 · NeetCode | Length-prefixed framing |

### Hard

| # | Problem | Source | The point |
|---|---|---|---|
| 16 | **Minimum Window Substring** | LC 76 · NeetCode | The hardest sliding window |
| 17 | Implement strStr() | LC 28 | KMP or rolling hash |
| 18 | Shortest Palindrome | LC 214 | KMP's LPS array |
| 19 | Longest Duplicate Substring | LC 1044 | Binary search + rolling hash |
| 20 | Regular Expression Matching | LC 10 | 2D DP, not strings |

**If you only do six: 242, 125, 49, 5, 20, 76.**

---

## 8 · Worked example — LC 271, Encode and Decode Strings

**Problem:** serialise a list of strings into one string and back. Strings may
contain *any* characters.

**Why the obvious answer fails, and this is the entire question:**

```
Join with a delimiter:   "a,b,c"
But what if a string CONTAINS the delimiter?  ["a,b", "c"] -> "a,b,c"
Decoding gives ["a","b","c"]. Wrong, and there is no safe delimiter
because any character can appear in the data.

LENGTH PREFIXING solves it:

  "4#abcd3#xyz"
   ^ ^         length, sentinel, then exactly that many characters

Read digits until '#', then take exactly that many characters. The
content is never scanned for delimiters, so it cannot be misread.
```

```python
def encode(strs):
    # Length, then a sentinel, then the raw content.
    return "".join(f"{len(s)}#{s}" for s in strs)

def decode(s):
    out = []
    i = 0
    while i < len(s):
        j = s.index("#", i)          # the '#' terminating the length
        length = int(s[i:j])            # the digits before it
        start = j + 1
        out.append(s[start:start + length])   # take EXACTLY length chars
        i = start + length
    return out
```

**This is the framing problem every network protocol solves the same way** —
length-prefixed rather than delimiter-separated — and saying that connects it to
real systems work.

---

## 9 · Failure modes

| Bug | Symptom | Fix |
|---|---|---|
| `s += ch` in a loop | O(n²), TLE on large inputs | `join` / `StringBuilder` |
| Slicing inside a loop | Hidden O(n²) | Pass indices |
| Only odd palindrome centres | Misses "abba" | Try `(i,i)` and `(i,i+1)` |
| `right - left` instead of `right - left - 1` | Length off by two | The loop exits past both ends |
| Assuming lowercase-only | Crash on uppercase or digits | Check the constraints; use a map |
| Case/whitespace in palindromes | Wrong answer on "A man, a plan…" | Normalise or filter while scanning |
| Trusting a rolling-hash match | Rare wrong answers | Verify with a real comparison |
| Java `==` on strings | Compares references | `.equals()` |
| Not handling the empty string | Crash | Guard early |

**Java `==` on strings deserves emphasis** — it sometimes works, because of the
string pool, which makes it worse: the bug survives your tests and fails on
runtime-constructed strings.

---

## 10 · Interview questions

| Question | What to say |
|---|---|
| ⭐ "What's the complexity of building a string in a loop?" | O(n²) — strings are immutable, so each concatenation copies everything. I'd collect into a list and join, or use a StringBuilder, for O(n). |
| ⭐ "Longest palindromic substring." | Expand from every centre, trying both odd and even parities — 2n−1 centres, O(n²) time and O(1) space. The DP version is the same time but O(n²) space, so expansion is strictly better. Manacher's is O(n) but almost never expected. |
| "Anagram check?" | `int[26]` incremented from one string and decremented from the other in a single pass, then check all zeros. Fixed alphabet means no hashing and no boxing. For grouping, the count tuple is a better key than the sorted string — O(k) instead of O(k log k). |
| ⭐ "Find a pattern in a text." | The library method is the honest answer for an interview. If asked to implement it: rolling hash, which is short and generalises to multiple patterns — verifying every hash match with a real comparison, since collisions are possible. KMP gives guaranteed O(n+m) using the LPS array. |
| ⭐ "Serialise a list of strings." | Length-prefix each one — `4#abcd` — rather than delimit them, because any delimiter can appear in the data. The decoder reads the length and then takes exactly that many characters, so content is never parsed for delimiters. It is how network protocols frame messages. |
| "Sliding window or expansion?" | Sliding window for substring-with-a-constraint — no repeats, at most k distinct. Expansion for palindromes, because a palindrome is defined by its centre rather than by a window property. They sound similar and share nothing. |
| "Is slicing free?" | No — it copies, O(k). Slicing inside a loop is a common hidden quadratic; pass indices instead. |

---

## Stop condition

You know this pattern when you can:

1. name the five sub-patterns and classify a problem into one,
2. explain why loop concatenation is O(n²) and give both fixes,
3. write centre expansion with both parities and the `right-left-1` span,
4. write the stack parsing template,
5. sketch a rolling hash *and* say you would verify the match, and
6. give the length-prefix argument for LC 271.
