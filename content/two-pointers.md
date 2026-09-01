---
title: Two pointers
slug: two-pointers
module: linear
order: 11
status: live
level: basic → advanced
summary: Two indices moving with purpose — the pattern that turns O(n²) into O(n) whenever the data is sorted or has a monotonic property.
---

# Two pointers

> **Recognition in one line:** the array is **sorted** (or you may sort it), and
> you are looking for a **pair or triple** satisfying a condition — or you are
> partitioning an array in place.

The enabling property is monotonicity: moving a pointer must change the value
you are testing in a *predictable direction*. Without that, you cannot decide
which pointer to move, and the pattern does not apply.

---

## 1 · Recognition cues

| Cue | Variant |
|---|---|
| "sorted array" + "find a pair summing to X" | Converging (opposite ends) |
| "triplet" / "3Sum" | Sort, fix one, converge on the rest |
| "remove / move elements **in place**" | Fast-slow (read and write pointers) |
| "is it a palindrome?" | Converging from both ends |
| "**k-th from the end**" of a linked list | Fast-slow with a fixed gap |
| "detect a cycle" | Fast-slow (Floyd's) |
| "merge two sorted things" | Parallel pointers, one per input |
| "container / trapping water" | Converging, move the limiting side |

**Three distinct shapes**, and confusing them is the main source of bugs:

```
   CONVERGING            L →           ← R        sorted data, pair search
   FAST-SLOW             slow → fast →             in-place edit, cycles
   PARALLEL              i → (list A)   j → (list B)   merging
```

---

## 2 · The templates

```python
# 1. CONVERGING -- sorted array, find a pair
def two_sum_sorted(nums, target):
    left, right = 0, len(nums) - 1
    while left < right:
        total = nums[left] + nums[right]
        if total == target:
            return [left, right]
        if total < target:
            left += 1          # need a bigger sum -> the only way is left up
        else:
            right -= 1         # need a smaller sum -> right down
    return []
```

The decision rule is the whole pattern: because the array is sorted, moving
`left` up can only increase the sum and moving `right` down can only decrease
it. Each comparison eliminates one candidate permanently, so it is O(n).

```python
# 2. FAST-SLOW -- in-place filtering. `slow` is the WRITE position.
def remove_element(nums, val):
    slow = 0
    for fast in range(len(nums)):
        if nums[fast] != val:
            nums[slow] = nums[fast]
            slow += 1
    return slow                # nums[:slow] is the kept prefix
```

```python
# 3. FAST-SLOW on a linked list -- cycle detection
def has_cycle(head):
    slow = fast = head
    while fast and fast.next:          # both guards needed, or AttributeError
        slow = slow.next
        fast = fast.next.next
        if slow is fast:
            return True
    return False
```

```python
# 4. THREE POINTERS -- sort, fix one, converge on the other two
def three_sum(nums):
    nums.sort()
    out = []
    for i in range(len(nums) - 2):
        if i > 0 and nums[i] == nums[i - 1]:
            continue                       # skip duplicate anchors
        left, right = i + 1, len(nums) - 1
        while left < right:
            total = nums[i] + nums[left] + nums[right]
            if total < 0:
                left += 1
            elif total > 0:
                right -= 1
            else:
                out.append([nums[i], nums[left], nums[right]])
                left += 1
                while left < right and nums[left] == nums[left - 1]:
                    left += 1              # skip duplicate seconds
    return out
```

---

## 3 · The ladder

### Easy

| # | Problem | Source | The point |
|---|---|---|---|
| 1 | Valid Palindrome | LC 125 · NeetCode | Converging, with input cleaning |
| 2 | Two Sum II (sorted) | LC 167 · NeetCode | The converging template, bare |
| 3 | Remove Duplicates from Sorted Array | LC 26 | Fast-slow, in place |
| 4 | Merge Sorted Array | LC 88 | **Fill from the back** to avoid overwriting |

### Medium

| # | Problem | Source | The point |
|---|---|---|---|
| 5 | **3Sum** | LC 15 · NeetCode | The one everyone gets asked. Duplicate handling is the difficulty |
| 6 | 3Sum Closest | LC 16 | Same shape, track a best difference |
| 7 | **Container With Most Water** | LC 11 · NeetCode | The greedy move-the-shorter-side argument |
| 8 | Sort Colors | LC 75 | Dutch national flag, three pointers |
| 9 | Linked List Cycle II | LC 142 | Floyd's, plus finding the entry point |
| 10 | 4Sum | LC 18 | 3Sum with one more loop |
| 11 | Boats to Save People | LC 881 | Greedy pairing, converging |

### Hard

| # | Problem | Source | The point |
|---|---|---|---|
| 12 | **Trapping Rain Water** | LC 42 · NeetCode | Two pointers with running maxima. O(1) space |

**If you only do four: 167, 15, 11, 42.**

---

## 4 · Worked example — LC 15, 3Sum

**Problem:** all unique triplets summing to zero.

**Recognise:** triplet + "unique" → sort, fix one, converge on the rest. Sorting
is what makes both the convergence and the deduplication possible.

```
   nums = [-1, 0, 1, 2, -1, -4]
   sorted = [-4, -1, -1, 0, 1, 2]

   i=0  anchor -4   L=1 R=5   -4 + -1 + 2 = -3 < 0  -> L++
                    L=2 R=5   -4 + -1 + 2 = -3 < 0  -> L++
                    L=3 R=5   -4 +  0 + 2 = -2 < 0  -> L++
                    L=4 R=5   -4 +  1 + 2 = -1 < 0  -> L++   done

   i=1  anchor -1   L=2 R=5   -1 + -1 + 2 =  0  HIT -> [-1,-1,2]
                    L=3 R=4   -1 +  0 + 1 =  0  HIT -> [-1,0,1]

   i=2  anchor -1   SKIP -- same as the previous anchor, would repeat triplets

   i=3  anchor  0   L=4 R=5    0 +  1 + 2 =  3 > 0 -> R--   done

   answer [[-1,-1,2], [-1,0,1]]
```

```python
def three_sum(nums: list[int]) -> list[list[int]]:
    nums.sort()
    out = []
    n = len(nums)

    for i in range(n - 2):
        # Once the anchor is positive, three sorted positives cannot sum to 0.
        if nums[i] > 0:
            break
        # Deduplicate ANCHORS. Without this, [-1,-1,...] emits every triplet
        # twice. Note `i > 0` -- comparing index 0 to index -1 wraps around.
        if i > 0 and nums[i] == nums[i - 1]:
            continue

        left, right = i + 1, n - 1
        while left < right:
            total = nums[i] + nums[left] + nums[right]
            if total < 0:
                left += 1
            elif total > 0:
                right -= 1
            else:
                out.append([nums[i], nums[left], nums[right]])
                left += 1
                # Deduplicate the SECOND element after a hit. Both dedup steps
                # are needed: one for the anchor, one inside the scan.
                while left < right and nums[left] == nums[left - 1]:
                    left += 1

    return out
```

**Complexity:** O(n²) time — an O(n) scan for each of n anchors. O(1) extra
space beyond the output, or O(n) counting the sort.

**The follow-up:** *"why not a hash set to dedupe?"* You can, and it costs O(n)
space and produces the same answer. Sorting gets deduplication for free by
construction, which is cleaner and is what the interviewer is looking for.

---

## 5 · Worked example — LC 11, Container With Most Water

**Problem:** given heights, pick two lines forming the container holding the
most water.

**The greedy argument is the whole problem**, and you must be able to state it:

```
   area = (right - left) × min(height[left], height[right])

   At each step, move the SHORTER side inward.

   Why is that safe? Moving the taller side inward:
     - width strictly decreases
     - height is capped by the shorter side, which did not change
   -> the area cannot increase. So that move can never find a better answer,
      and discarding it loses nothing.
```

```
   height = [1, 8, 6, 2, 5, 4, 8, 3, 7]
             0  1  2  3  4  5  6  7  8

   L=0 R=8   min(1,7)=1  × 8 = 8      left is shorter  -> L++
   L=1 R=8   min(8,7)=7  × 7 = 49  <- best             right shorter -> R--
   L=1 R=7   min(8,3)=3  × 6 = 18     right shorter    -> R--
   L=1 R=6   min(8,8)=8  × 5 = 40     equal -> move either
   L=1 R=5   min(8,4)=4  × 4 = 16     ...

   answer 49
```

```python
def max_area(height: list[int]) -> int:
    left, right = 0, len(height) - 1
    best = 0

    while left < right:
        best = max(best, (right - left) * min(height[left], height[right]))
        # Move the shorter side. Moving the taller one can only shrink the
        # width while the height stays capped by the shorter side, so it can
        # never improve the area -- discarding it is provably safe.
        if height[left] < height[right]:
            left += 1
        else:
            right -= 1

    return best
```

**Complexity:** O(n) time, O(1) space.

---

## 6 · Worked example — LC 42, Trapping Rain Water

The hard one, and it has a beautiful two-pointer solution most people miss.

**The insight:** water above a bar is `min(maxLeft, maxRight) − height[i]`. You
do not need both maxima precomputed — you need only the *smaller* one, and the
pointer on the smaller side always knows its own maximum is the binding
constraint.

```
   height = [0,1,0,2,1,0,1,3,2,1,2,1]

   L=0 R=11   maxL=0  maxR=1   maxL < maxR -> work on the LEFT
              height[0]=0 >= maxL -> maxL=0, no water. L++
   L=1        height[1]=1 >= maxL(0) -> maxL=1, no water. L++
   L=2        height[2]=0 <  maxL(1) -> water += 1-0 = 1. L++
   L=3        height[3]=2 >= maxL(1) -> maxL=2. L++
   L=4        height[4]=1 <  maxL(2) -> water += 2-1 = 1   (total 2). L++
   L=5        height[5]=0 <  maxL(2) -> water += 2         (total 4). L++
   ...
   answer 6
```

```python
def trap(height: list[int]) -> int:
    if not height:
        return 0

    left, right = 0, len(height) - 1
    max_left = max_right = 0
    water = 0

    while left < right:
        # Work on whichever side has the SMALLER running maximum. That side's
        # maximum is guaranteed to be the binding constraint, because the other
        # side already has something at least as tall -- so we can settle this
        # bar now without knowing the rest of the array.
        if max_left < max_right:
            max_left = max(max_left, height[left])
            water += max_left - height[left]
            left += 1
        else:
            max_right = max(max_right, height[right])
            water += max_right - height[right]
            right -= 1

    return water
```

**Complexity:** O(n) time, **O(1) space** — better than the standard
precompute-both-arrays solution, which is O(n) space. Say that difference out
loud; it is the reason this solution is the good answer.

---

## 7 · Same problem in disguise

| Problem | Really is |
|---|---|
| 3Sum Closest (LC 16) | 3Sum, tracking a best difference instead of exact zero |
| 4Sum (LC 18) | 3Sum with one more anchor loop |
| 3Sum Smaller (LC 259) | 3Sum, counting `right − left` per hit |
| Boats to Save People (LC 881) | Converging pair matching, greedy |
| Valid Palindrome II (LC 680) | Converging, with one permitted skip |
| Squares of a Sorted Array (LC 977) | Converging, writing to the output from the back |
| Merge Sorted Array (LC 88) | Parallel pointers, filling from the back |

**"Fill from the back" appears three times.** Whenever writing forward would
overwrite input you still need, write backward — that single idea solves LC 88
and LC 977 immediately.

---

## 8 · Failure modes

| Bug | Symptom | Fix |
|---|---|---|
| `while left <= right` in converging | Element pairs with itself | `left < right` for pairs |
| Forgetting anchor deduplication in 3Sum | Duplicate triplets | `if i > 0 and nums[i] == nums[i-1]: continue` |
| Only deduplicating the anchor | Still duplicates | Also skip equal seconds after a hit |
| Moving the taller side in LC 11 | Wrong answer | Move the shorter side; be able to say why |
| `fast.next.next` without guards | `AttributeError` | `while fast and fast.next` |
| Merging forward in LC 88 | Overwrites unread input | Fill from the back |
| Forgetting to sort | Convergence logic invalid | Sorting is what creates the monotonicity |

---

## 9 · Interview questions on this pattern

| Question | What to say |
|---|---|
| "Why move the shorter side in Container With Most Water?" | Moving the taller side shrinks the width while the height stays capped by the unchanged shorter side, so the area cannot improve. Discarding that move is provably lossless. |
| "3Sum without sorting?" | Possible with a hash set per anchor, O(n²) time and O(n) space, and deduplication becomes manual. Sorting gives dedup for free — that is why it is preferred. |
| "Trapping Rain Water in O(1) space?" | Two pointers with running maxima, always advancing the side with the smaller maximum, because that side's max is the binding constraint. |
| "Find the start of a linked-list cycle." | Floyd's: after they meet, reset one pointer to the head and advance both one step at a time. They meet at the entry. |
| "When does two pointers not apply?" | When there is no monotonic property to exploit — unsorted data with no orderable condition. Then hashing, or sort first if order does not matter. |
| "Why is 3Sum O(n²) and not O(n³)?" | The inner converging scan is O(n), not O(n²), because each pointer moves only inward. One O(n) scan per anchor. |

---

## Stop condition

You are done with this pattern when you can:

1. name the three shapes and pick the right one from a statement,
2. state the LC 11 greedy argument as a proof, not a rule,
3. write 3Sum with both deduplication steps, cold,
4. explain the O(1)-space trapping-water insight, and
5. say what property must hold for two pointers to be valid at all.
