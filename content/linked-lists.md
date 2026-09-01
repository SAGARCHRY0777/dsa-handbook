---
title: Linked lists
slug: linked-lists
module: structures
order: 25
status: live
level: basic → advanced
summary: Pointer manipulation with three tricks — dummy head, fast-slow, and in-place reversal — that between them solve almost every problem.
---

# Linked lists

> **Recognition in one line:** the input is a chain of nodes and you are
> reordering, detecting a cycle, or finding a position relative to the end.

Linked lists are less common in modern interviews than they were, but they still
appear — and they are unusually **mechanical**: three techniques cover nearly
everything, and the difficulty is bookkeeping rather than insight.

---

## 1 · Recognition cues

| Cue | Technique |
|---|---|
| "reverse the list / a portion of it" | In-place reversal |
| "k-th from the end" | Fast-slow with a fixed gap |
| "middle of the list" | Fast-slow, fast moves two |
| "detect a cycle" | Floyd's tortoise and hare |
| "where does the cycle start?" | Floyd's, then reset one pointer to the head |
| "remove nodes" / "the head might change" | **Dummy head node** |
| "merge two sorted lists" | Parallel pointers |
| "palindrome list" | Find middle, reverse half, compare |
| "reorder / interleave" | Split, reverse, merge |

**The three techniques, and that is genuinely all of them:**

```
   DUMMY HEAD      a fake node before the real head, so deleting the first
                   node needs no special case

   FAST-SLOW       two pointers at different speeds -- finds middles,
                   k-th-from-end, and cycles

   REVERSAL        three pointers walking the list, flipping each `next`
```

---

## 2 · The templates

```python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val, self.next = val, next
```

```python
# DUMMY HEAD -- removes every "what if it is the first node?" special case
def remove_elements(head, target):
    dummy = ListNode(0, head)
    prev = dummy
    while prev.next:
        if prev.next.val == target:
            prev.next = prev.next.next     # unlink, do not advance
        else:
            prev = prev.next
    return dummy.next                      # the real head, possibly changed
```

```python
# IN-PLACE REVERSAL -- three pointers. Type this until it is automatic.
def reverse_list(head):
    previous, current = None, head
    while current:
        nxt = current.next        # save the rest of the list BEFORE overwriting
        current.next = previous   # flip the arrow
        previous = current        # step both pointers forward
        current = nxt
    return previous               # `previous` is the new head
```

**Saving `current.next` before overwriting it is the whole trick.** Overwrite
first and you have lost the rest of the list, permanently.

```python
# FAST-SLOW -- middle, cycle, k-th from the end
def middle(head):
    slow = fast = head
    while fast and fast.next:      # BOTH guards, or AttributeError on odd lengths
        slow = slow.next
        fast = fast.next.next
    return slow                    # for even length, this is the SECOND middle
```

---

## 3 · The ladder

### Easy

| # | Problem | Source | The point |
|---|---|---|---|
| 1 | **Reverse Linked List** | LC 206 · NeetCode | The template. Type it from memory |
| 2 | Merge Two Sorted Lists | LC 21 · NeetCode | Dummy head + parallel pointers |
| 3 | Linked List Cycle | LC 141 · NeetCode | Floyd's, detection only |
| 4 | Middle of the Linked List | LC 876 | Fast-slow |
| 5 | Remove Duplicates from Sorted List | LC 83 | Single pass |

### Medium

| # | Problem | Source | The point |
|---|---|---|---|
| 6 | **Remove Nth Node From End** | LC 19 · NeetCode | Fast-slow with a gap, plus dummy head |
| 7 | **Reorder List** | LC 143 · NeetCode | All three techniques in one problem |
| 8 | Linked List Cycle II | LC 142 | Floyd's + the entry-point derivation |
| 9 | Add Two Numbers | LC 2 · NeetCode | Carry handling |
| 10 | Copy List with Random Pointer | LC 138 · NeetCode | Map old → new, or interleave |
| 11 | Reverse Linked List II | LC 92 | Reversal of a sublist. Fiddly |
| 12 | Palindrome Linked List | LC 234 | Middle + reverse + compare, O(1) space |
| 13 | **LRU Cache** | LC 146 · NeetCode | Doubly linked list + hash map |

### Hard

| # | Problem | Source | The point |
|---|---|---|---|
| 14 | Reverse Nodes in k-Group | LC 25 · NeetCode | Reversal, repeatedly, with reconnection |
| 15 | Merge k Sorted Lists | LC 23 · NeetCode | Heap of heads |

**If you only do four: 206, 19, 143, 146.**

---

## 4 · Worked example — LC 19, Remove Nth From End

**Problem:** remove the n-th node from the end, in one pass.

**Two techniques together:** a gap of `n` between two pointers finds the
position, and a dummy head handles removing the actual head.

```
   list = 1 -> 2 -> 3 -> 4 -> 5,   n = 2      (remove 4)

   dummy -> 1 -> 2 -> 3 -> 4 -> 5

   advance `fast` n+1 = 3 steps from dummy:
   dummy -> 1 -> 2 -> 3 -> 4 -> 5
     ^slow          ^fast

   move both until fast falls off the end:
   dummy -> 1 -> 2 -> 3 -> 4 -> 5 -> None
                 ^slow          ^fast

   slow now sits just BEFORE the node to remove.
   slow.next = slow.next.next  ->  3 -> 5
```

```python
def remove_nth_from_end(head, n):
    dummy = ListNode(0, head)
    slow = fast = dummy

    # n+1, not n: we want `slow` to stop just BEFORE the target so we can
    # unlink it. Starting from dummy is what makes removing the head work.
    for _ in range(n + 1):
        fast = fast.next

    while fast:
        slow = slow.next
        fast = fast.next

    slow.next = slow.next.next
    return dummy.next
```

```java
public ListNode removeNthFromEnd(ListNode head, int n) {
    ListNode dummy = new ListNode(0, head);
    ListNode slow = dummy, fast = dummy;

    for (int i = 0; i <= n; i++) fast = fast.next;   // n+1 steps

    while (fast != null) {
        slow = slow.next;
        fast = fast.next;
    }
    slow.next = slow.next.next;
    return dummy.next;                               // head may have changed
}
```

**Return `dummy.next`, never `head`.** If the head was removed, `head` points at
a detached node. That is the single most common bug in this problem.

---

## 5 · Worked example — LC 143, Reorder List

**Problem:** reorder `L0 → L1 → … → Ln` into `L0 → Ln → L1 → Ln-1 → …`

**All three techniques in one problem**, which is why it is the best single
linked-list exercise.

```
   1 -> 2 -> 3 -> 4 -> 5

   STEP 1  find the middle (fast-slow)          -> 3
   STEP 2  reverse the second half              -> 1 -> 2 -> 3    5 -> 4
   STEP 3  interleave the two halves            -> 1 -> 5 -> 2 -> 4 -> 3
```

```python
def reorder_list(head):
    if not head or not head.next:
        return

    # 1. middle
    slow = fast = head
    while fast.next and fast.next.next:
        slow = slow.next
        fast = fast.next.next

    # 2. reverse everything after `slow`, and CUT the link so the first half
    #    terminates -- forgetting this creates a cycle.
    second = slow.next
    slow.next = None
    previous = None
    while second:
        nxt = second.next
        second.next = previous
        previous = second
        second = nxt

    # 3. interleave
    first, second = head, previous
    while second:
        first_next, second_next = first.next, second.next
        first.next = second
        second.next = first_next
        first, second = first_next, second_next
```

```java
public void reorderList(ListNode head) {
    if (head == null || head.next == null) return;

    ListNode slow = head, fast = head;
    while (fast.next != null && fast.next.next != null) {
        slow = slow.next;
        fast = fast.next.next;
    }

    ListNode second = slow.next;
    slow.next = null;                    // CUT -- otherwise you build a cycle
    ListNode prev = null;
    while (second != null) {
        ListNode next = second.next;
        second.next = prev;
        prev = second;
        second = next;
    }

    ListNode first = head;
    second = prev;
    while (second != null) {
        ListNode firstNext = first.next, secondNext = second.next;
        first.next = second;
        second.next = firstNext;
        first = firstNext;
        second = secondNext;
    }
}
```

**`slow.next = None` is the line people forget.** Without it the first half
still points into the reversed second half and you produce an infinite loop —
which shows up as a hang, not an exception.

---

## 6 · Worked example — LC 142, Cycle II

**Problem:** find the node where the cycle begins.

**The derivation is the interview**, not the code.

```
   Let:  a = distance from head to the cycle entry
         b = distance from entry to the meeting point
         c = remaining cycle length, so cycle = b + c

   When they meet:
     slow travelled  a + b
     fast travelled  a + b + k(b + c)      for some number of laps k
     fast = 2 * slow, so:
        a + b + k(b+c) = 2(a + b)
        k(b+c)         = a + b
        a              = k(b+c) - b
        a              = (k-1)(b+c) + c

   Read the last line: the distance from the HEAD to the entry equals the
   distance from the MEETING POINT to the entry, plus whole laps.

   So: reset one pointer to the head, advance both one step at a time,
       and they meet exactly at the entry.
```

```python
def detect_cycle(head):
    slow = fast = head
    while fast and fast.next:
        slow, fast = slow.next, fast.next.next
        if slow is fast:                     # cycle confirmed
            slow = head                      # reset ONE pointer to the head
            while slow is not fast:          # now both move ONE step
                slow, fast = slow.next, fast.next
            return slow                      # the entry point
    return None
```

```java
public ListNode detectCycle(ListNode head) {
    ListNode slow = head, fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
        if (slow == fast) {
            slow = head;
            while (slow != fast) {
                slow = slow.next;
                fast = fast.next;
            }
            return slow;
        }
    }
    return null;
}
```

**Being able to derive `a = (k-1)(b+c) + c` on the whiteboard** is what
distinguishes understanding from memorising here. Interviewers ask for it.

---

## 7 · Same problem in disguise

| Problem | Really is |
|---|---|
| Middle of the List (LC 876) | Fast-slow, fast moves two |
| Palindrome List (LC 234) | Middle + reverse + compare |
| Reorder List (LC 143) | Middle + reverse + interleave |
| Remove Nth From End (LC 19) | Fast-slow with a fixed gap |
| Reverse in k-Group (LC 25) | Reversal, repeated, with reconnection |
| Intersection of Two Lists (LC 160) | Two pointers switching lists — equalises path length |

**Middle + reverse solves three of these.** Learn those two operations properly
and half the medium problems collapse.

---

## 8 · Failure modes

| Bug | Symptom | Fix |
|---|---|---|
| Returning `head` after removing it | Wrong list returned | Always `return dummy.next` |
| Not saving `current.next` before overwriting | Lost the rest of the list | Save first, then flip |
| `fast.next.next` without both guards | `AttributeError` / NPE | `while fast and fast.next` |
| Forgetting to cut in Reorder List | Infinite loop, program hangs | `slow.next = None` |
| No dummy head when the head may change | Special-case bugs | Use one; it is one line |
| Off-by-one in the fast-slow gap | Removes the wrong node | `n + 1` steps, from dummy |

---

## 9 · Interview questions on this pattern

| Question | What to say |
|---|---|
| ⭐ "Reverse a list in place." | Three pointers: save next, flip current's pointer, advance both. Saving next before overwriting is the whole trick. O(n) time, O(1) space. |
| "Find the middle in one pass." | Fast-slow: fast moves two, slow one. When fast falls off the end, slow is at the middle. For even length, decide which middle you want and say so. |
| ⭐ "Where does the cycle start?" | Floyd's to find a meeting point, then reset one pointer to the head and advance both one step — they meet at the entry. And derive why: the head-to-entry distance equals the meeting-point-to-entry distance plus whole laps. |
| "Why a dummy head?" | It removes every special case where the head itself changes — deletion of the first node, insertion before it. One line, and it deletes a class of bugs. |
| "Reverse in k-groups?" | Reverse each block of k, reconnect the tails, leave a trailing partial group untouched unless told otherwise. Ask which, because it changes the answer. |
| "Recursive or iterative reversal?" | Iterative — O(1) space. Recursion is O(n) stack, which matters on a long list and is a real risk in Python. |

---

## Stop condition

You are done with this pattern when you can:

1. type the reversal template from memory with no bugs,
2. explain why `dummy.next` is returned rather than `head`,
3. derive the Floyd's entry-point result on a whiteboard,
4. solve Reorder List including the cut, and
5. name which technique a problem needs from its statement.
