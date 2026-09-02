---
title: 0. Prompts for taking these notes
slug: video-note-prompts
module: recursion-notes
order: 0
status: live
source: notes
level: copy from here
summary: Copy-paste prompts for extracting a usable, checkable summary from a video — plus the workflow that turns it into a page.
---

# Prompts for taking these notes

> **Copy from this page every time.** A prompt you have to reconstruct is a
> prompt you stop using.

These are written for an AI with video access — YouTube's **Ask** button (the ✦
next to Share), or Gemini's YouTube integration. Paste the whole block.

---

## 1 · The master prompt

**Use this first, on every video.**

```
Give me detailed study notes on this video, structured as:

1. TIMESTAMPED OUTLINE — every section with start-end times.

2. THE METHOD — if a technique is taught, give its exact steps in
   order, using the speaker's own terminology. If he names the steps,
   keep his names AND his ordering.

3. EVERY WORKED EXAMPLE — for each: the exact input he uses, what he
   writes at each step, and the final answer.

4. WHAT HE DRAWS — describe each diagram or tree on screen, node by
   node, with the labels he writes.

5. CODE — any code written on screen, line by line, with the
   explanation he gives for each line.

6. WARNINGS — every "don't do this", "people get this wrong", or
   common-mistake remark, with its timestamp.

7. DISTINCTIVE PHRASES — any phrase or mnemonic he repeats.

8. CONFIDENCE — mark anything you are unsure about, and say which
   parts of the video were unclear to you.
```

> **Section 8 is the one that earns its place.** Without it these tools state
> everything with equal confidence and you cannot separate what was transcribed
> from what was inferred. With it, you know which claims to check.

---

## 2 · Follow-ups

Ask these after the master prompt, when the answer is thin in a particular
place.

**When two methods exist and you need the decision rule:**

```
What does he say about WHEN to use this method versus the other one?
Give the decision rule as close to his own words as you can.
```

**When the problem list matters:**

```
List every problem he mentions, even in passing, with its timestamp,
and mark whether he SOLVES it here or only names it for a later video.
```

**When a worked example went too fast:**

```
Walk through his worked example again, slower. At each step give me:
the current input, the output built so far, and what the call stack
looks like.
```

**When you want the reasoning, not the result:**

```
Why does he say this approach works? Give his justification, not
just the steps. If he proves or argues anything, reproduce the
argument's structure.
```

**When the video is long and you want to triage:**

```
Which 3 minutes of this video carry the actual technique, and which
parts are motivation, recap, or channel promotion? Give timestamps.
```

---

## 3 · For a technique video

Adapt the names to whatever framework is being taught.

```
He teaches [NAME OF FRAMEWORK]. For each named step:
  - his definition, in his words
  - the question he says to ask yourself at that step
  - the ORDER he says to answer the steps in
  - the example he uses to demonstrate it

Also: does he say anything about what NOT to do while applying it?
```

> **The ordering question is worth asking every time.** Frameworks are usually
> presented as a list, and the order you *apply* them in is often different from
> the order they are *named* in — and that difference is the part that makes the
> method usable.

---

## 4 · For a problem video

```
For the problem solved in this video:
  - the exact problem statement he gives
  - the brute-force or naive approach, if he mentions one
  - the recursion tree or diagram he draws, described fully
  - the base case, and HOW he decides what it should be
  - the final code, line by line
  - the complexity, if he states it
  - any edge case or gotcha he calls out
```

```
What does he say makes this problem different from the previous one
in the series? What is the new idea being introduced?
```

> **The second question is the valuable one.** A series is ordered because each
> problem adds one thing. Naming that one thing is worth more than the solution,
> which you could get anywhere.

---

## 5 · The workflow

```
1. WATCH the video first, at whatever speed suits you.

2. ASK — paste the master prompt into the video's Ask / Gemini panel.
   Follow up with the section-specific prompts where the answer is thin.

3. SAVE — if the answer is long, paste it into a file:
       d:\GITHUB\dsa-handbook\.transcripts\video-NN.txt
   .transcripts/ is gitignored, so working sources never reach the
   published site.

4. SCAFFOLD the page:
       npm run note -- 3 "Hypothesis Induction Base Condition"

5. WRITE it — or hand the summary over and have it drafted, then
   correct it against what you actually saw.

6. PUBLISH:
       npm run publish -- "notes: video 3"
```

---

## 6 · Two rules for the notes themselves

**Mark your sources, and mark your confidence.** Every page in this section
opens with what it was built from and what has not been verified. That header is
not ceremony — it is what lets you trust the page in three weeks when you cannot
remember which parts you checked.

**Do not delete a claim just because one source is weak.** It has already
happened once here: a problem was correctly listed, then removed as
"unconfirmed" on thin evidence, then restored when a better source arrived.
**The fix for a bad source is a better source, not a confident deletion.** Mark
it uncertain and move on.

---

## 7 · What these notes are for

They are a revision artefact, not a replacement for the videos. The material
belongs to whoever made it; these pages exist so the ideas can be re-derived
quickly later, and every one links back to the original.

> If a page here is good enough that you would skip the video, it is wrong —
> **the video is where the understanding comes from, and the page is only where
> it is stored.**
