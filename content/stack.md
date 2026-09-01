---
title: Stack & monotonic stack
slug: stack
module: structures
order: 22
status: live
level: basic → advanced
summary: Plain stacks are easy; the monotonic stack is the one that feels like magic until you see what it is actually storing.
---

# Stack & monotonic stack

> **Recognition in one line:** you need the **most recent unresolved thing** —
> the matching bracket, the previous greater element, the last unfinished
> operation.

The plain stack is straightforward. The **monotonic stack** is the pattern that
looks like a trick and is not: it maintains a set of candidates that are still
waiting for an answer, and discards any candidate that can never win again.

---

## 1 · Recognition cues

### Plain stack

| Cue | Note |
|---|---|
| "valid parentheses", "balanced brackets" | The canonical use |
| "undo", "backtrack to the previous state" | LIFO by definition |
| "evaluate an expression", "RPN" | Operands on the stack |
| "simplify a path", "remove adjacent duplicates" | Push, and pop on a match |
| "iterative DFS" | An explicit stack replaces the call stack |

### Monotonic stack — the valuable half

| Cue | Almost always monotonic stack |
|---|---|
| "**next greater** / next smaller element" | The defining case |
| "**previous greater** / previous smaller" | Same, scanning the other way |
| "how many days until a warmer temperature" | Next greater, returning a distance |
| "largest rectangle in a histogram" | Previous and next smaller |
| "maximum area / span bounded by heights" | Same family |
| "**stock span**", "trapping rain water" | Same family |

> **The tell:** the problem asks, for *every* element, about the nearest element
> on one side satisfying a comparison. The brute force is O(n²) nested loops;
> a monotonic stack makes it O(n).

---

## 2 · The templates

```python
# PLAIN STACK -- bracket matching
def is_valid(s: str) -> bool:
    pairs = {")": "(", "]": "[", "}": "{"}
    stack = []
    for ch in s:
        if ch in pairs:
            # Pop only if it matches. A sentinel avoids a separate empty check.
            if not stack or stack.pop() != pairs[ch]:
                return False
        else:
            stack.append(ch)
    return not stack        # leftovers mean unclosed brackets
```

```python
# MONOTONIC STACK -- next greater element for every index.
# The stack holds INDICES whose answer is still unknown, in decreasing value.
def next_greater(nums):
    n = len(nums)
    result = [-1] * n
    stack = []                       # indices, values decreasing bottom -> top

    for i, x in enumerate(nums):
        # Everything smaller than x has just found its answer: x.
        # Once popped, an index never returns -- that is why this is O(n).
        while stack and nums[stack[-1]] < x:
            result[stack.pop()] = x
        stack.append(i)              # x's own answer is still unknown

    return result                    # anything left never found one -> -1
```

**What the stack actually contains, and this is the whole insight:** indices
still *waiting* for an answer, kept in decreasing order of value. When a new
element arrives, it resolves every waiting element smaller than itself — and
those can be discarded forever, because any future element that would have
resolved them is resolved by this one first.

**The O(n) argument:** each index is pushed exactly once and popped at most once.
Two operations per element, so 2n total, despite the nested loop shape. Say this
out loud; it is the follow-up question.

**Choosing the direction:**

| Want | Scan | Pop while stack top is |
|---|---|---|
| Next greater | left → right | smaller than current |
| Next smaller | left → right | greater than current |
| Previous greater | left → right, record before push | smaller than current |
| Previous smaller | left → right, record before push | greater than current |

---

## 3 · The ladder

### Easy

| # | Problem | Source | The point |
|---|---|---|---|
| 1 | **Valid Parentheses** | LC 20 · NeetCode | The canonical stack |
| 2 | Min Stack | LC 155 · NeetCode | Auxiliary stack, or store pairs |
| 3 | Baseball Game | LC 682 | Stack as a running state |
| 4 | Remove All Adjacent Duplicates | LC 1047 | Push, pop on match |

### Medium

| # | Problem | Source | The point |
|---|---|---|---|
| 5 | **Daily Temperatures** | LC 739 · NeetCode | **The monotonic stack, bare** |
| 6 | Next Greater Element II | LC 503 | Circular — iterate twice, mod the index |
| 7 | Evaluate Reverse Polish Notation | LC 150 · NeetCode | Operands stacked, operators applied |
| 8 | Asteroid Collision | LC 735 | Stack with a collision rule |
| 9 | Simplify Path | LC 71 | `..` pops, `.` and empty are skipped |
| 10 | Decode String | LC 394 · NeetCode | Two stacks — counts and partial strings |
| 11 | Car Fleet | LC 853 · NeetCode | Sort by position, then a monotonic stack of times |
| 12 | Online Stock Span | LC 901 | Previous greater, returning a span |

### Hard

| # | Problem | Source | The point |
|---|---|---|---|
| 13 | **Largest Rectangle in Histogram** | LC 84 · NeetCode | Previous and next smaller, together |
| 14 | Maximal Rectangle | LC 85 | LC 84 applied per row |
| 15 | Trapping Rain Water | LC 42 | Solvable with a stack, though two pointers is cleaner |

**If you only do four: 20, 739, 394, 84.**

---

## 4 · Worked example — LC 739, Daily Temperatures

**Problem:** for each day, how many days until a warmer temperature? Zero if
never.

**Recognise:** "for every element, the nearest greater one to the right" → next
greater, returning a distance rather than a value.

```
   temps = [73, 74, 75, 71, 69, 72, 76, 73]
   index     0   1   2   3   4   5   6   7

   i=0  73   stack empty            push 0        stack [0]
   i=1  74   74 > 73 -> resolve 0, answer 1-0=1   stack [1]
   i=2  75   75 > 74 -> resolve 1, answer 2-1=1   stack [2]
   i=3  71   71 < 75 -> nothing resolved, push 3  stack [2,3]
   i=4  69   69 < 71 -> push 4                    stack [2,3,4]
   i=5  72   72 > 69 -> resolve 4, answer 5-4=1
            72 > 71 -> resolve 3, answer 5-3=2
            72 < 75 -> stop, push 5               stack [2,5]
   i=6  76   76 > 72 -> resolve 5, answer 6-5=1
            76 > 75 -> resolve 2, answer 6-2=4
            stack empty, push 6                   stack [6]
   i=7  73   73 < 76 -> push 7                    stack [6,7]

   left over: 6 and 7 never warmed -> 0

   answer [1, 1, 4, 2, 1, 1, 0, 0]
```

```python
def daily_temperatures(temperatures: list[int]) -> list[int]:
    result = [0] * len(temperatures)
    stack = []                        # indices, temperatures decreasing

    for i, temp in enumerate(temperatures):
        # Every waiting day cooler than today has just found its warmer day.
        while stack and temperatures[stack[-1]] < temp:
            day = stack.pop()
            result[day] = i - day     # distance, not the temperature
        stack.append(i)

    return result                     # unresolved indices keep their 0
```

**Complexity:** O(n) time, O(n) space. Each index is pushed once and popped once.

---

## 5 · Worked example — LC 84, Largest Rectangle in Histogram

The hard one, and the clearest demonstration of what a monotonic stack is for.

**Problem:** largest rectangle fitting inside a histogram.

**The insight:** for each bar, the widest rectangle *of that bar's height*
extends left until a shorter bar and right until a shorter bar. So for every bar
you need its **previous smaller** and **next smaller** — exactly what one
increasing monotonic stack produces in a single pass.

```
   heights = [2, 1, 5, 6, 2, 3]
              0  1  2  3  4  5

   maintain a stack of indices with INCREASING heights.
   when a shorter bar arrives, the popped bar can extend no further right.

   i=0 h=2   stack []        push 0            [0]
   i=1 h=1   1 < 2 -> pop 0: height 2,
             right boundary = 1, left boundary = -1 (stack now empty)
             width = 1 - (-1) - 1 = 1   area 2*1 = 2
             push 1                                  [1]
   i=2 h=5   5 > 1  push 2                           [1,2]
   i=3 h=6   6 > 5  push 3                           [1,2,3]
   i=4 h=2   2 < 6 -> pop 3: height 6, right=4, left=2
                     width = 4-2-1 = 1   area 6
             2 < 5 -> pop 2: height 5, right=4, left=1
                     width = 4-1-1 = 2   area 10   <- best so far
             2 > 1  push 4                          [1,4]
   i=5 h=3   3 > 2  push 5                          [1,4,5]

   flush with a sentinel height 0 at i=6:
             pop 5: height 3, right=6, left=4, width=1, area 3
             pop 4: height 2, right=6, left=1, width=4, area 8
             pop 1: height 1, right=6, left=-1, width=6, area 6

   answer 10
```

```python
def largest_rectangle_area(heights: list[int]) -> int:
    stack = []                        # indices, heights strictly increasing
    best = 0
    # The sentinel 0 forces every remaining bar to be resolved at the end,
    # which removes the separate flush loop and a class of off-by-one bugs.
    for i, h in enumerate(heights + [0]):
        while stack and heights[stack[-1]] >= h:
            height = heights[stack.pop()]
            # Left boundary is the new stack top -- the previous smaller bar.
            # -1 when the stack is empty means the bar extends to the start.
            left = stack[-1] if stack else -1
            best = max(best, height * (i - left - 1))
        stack.append(i)
    return best
```

**Complexity:** O(n) time, O(n) space.

**The width formula is where people go wrong.** It is `i - left - 1`, not
`i - left`: the rectangle spans the indices strictly *between* the two
boundaries, exclusive on both sides. Deriving that on the whiteboard rather than
recalling it is what the interviewer wants to see.

---

## 6 · Worked example — LC 394, Decode String

**Problem:** decode `"3[a2[c]]"` → `"accaccacc"`.

**Recognise:** nesting → stack. The subtlety is that you need **two** things
saved per level: the repeat count and the string built so far.

```
   s = "3[a2[c]]"

   '3'   number = 3
   '['   push (current="", count=3); reset current="", count=0
   'a'   current = "a"
   '2'   number = 2
   '['   push (current="a", count=2); reset
   'c'   current = "c"
   ']'   pop ("a", 2) -> current = "a" + "c"*2 = "acc"
   ']'   pop ("",  3) -> current = ""  + "acc"*3 = "accaccacc"

   answer "accaccacc"
```

```python
def decode_string(s: str) -> str:
    stack = []            # (string built before this bracket, repeat count)
    current = ""
    count = 0

    for ch in s:
        if ch.isdigit():
            # Multi-digit numbers: "12[a]" must read 12, not 1 then 2.
            count = count * 10 + int(ch)
        elif ch == "[":
            stack.append((current, count))
            current, count = "", 0
        elif ch == "]":
            previous, repeat = stack.pop()
            current = previous + current * repeat
        else:
            current += ch

    return current
```

**The multi-digit accumulation is the detail that breaks naive solutions.**
`count = count * 10 + int(ch)` handles `"100[a]"`; `int(ch)` alone does not.

---

## 7 · Same problem in disguise

| Problem | Really is |
|---|---|
| Daily Temperatures (LC 739) | Next greater, returning a distance |
| Next Greater Element I (LC 496) | Next greater, with a lookup map |
| Next Greater Element II (LC 503) | Next greater, iterating twice for circularity |
| Online Stock Span (LC 901) | Previous greater, returning a span |
| Largest Rectangle (LC 84) | Previous smaller + next smaller |
| Maximal Rectangle (LC 85) | LC 84 run once per row |
| Trapping Rain Water (LC 42) | Next greater on both sides |
| Sum of Subarray Minimums (LC 907) | Previous and next smaller, counting contributions |

**Eight problems, one stack.** The only differences are the comparison
direction and what you record when an element is resolved.

---

## 8 · Failure modes

| Bug | Symptom | Fix |
|---|---|---|
| Popping an empty stack | `IndexError` | Guard `if stack and ...` |
| Storing values instead of indices | Cannot compute distances or widths | Store indices; look values up |
| `>` where `>=` was needed in LC 84 | Wrong on equal heights | `>=` so equal bars resolve correctly |
| `i - left` instead of `i - left - 1` | Width off by one | The span is exclusive at both ends |
| Forgetting the sentinel | Bars left unresolved at the end | Append a 0, or flush explicitly |
| Single-digit number parsing | Breaks on `"12[a]"` | `count = count * 10 + int(ch)` |
| Wrong monotonic direction | Answers inverted | Decide it from the cue table before coding |

---

## 9 · Interview questions on this pattern

| Question | What to say |
|---|---|
| ⭐ "Why is the monotonic stack O(n) with a nested loop?" | Each index is pushed exactly once and popped at most once, so there are at most 2n stack operations regardless of the inner `while`. |
| ⭐ "What is the stack actually holding?" | Elements still waiting for an answer, kept in monotonic order. A new element resolves every waiting element it dominates, and those can be discarded permanently because any later element that would have resolved them is resolved by this one first. |
| "Increasing or decreasing stack?" | Decided by the question. For next *greater*, keep values decreasing and pop while the top is smaller. Deriving it from the cue beats memorising it. |
| "Min Stack with O(1) getMin?" | A second stack holding the minimum-so-far at each level, or store `(value, current_min)` pairs. Both are O(1) per operation. |
| "Largest rectangle — where does the width come from?" | The bar extends between its previous smaller and next smaller bars, exclusive, so the width is `right − left − 1`. The stack gives both boundaries in one pass. |
| "When is a plain queue or deque better?" | When you need the oldest element, or both ends. Sliding Window Maximum is a monotonic *deque*, not a stack, because the window discards from the front. |

---

## Stop condition

You are done with this pattern when you can:

1. state what the stack holds and why popping is permanent,
2. give the O(n) argument in one sentence,
3. derive the stack direction from the problem statement,
4. write LC 84 including the sentinel and the width formula, and
5. say when a monotonic deque replaces the stack.
