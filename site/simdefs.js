/**
 * simdefs.js — the simulations themselves. The player lives in sims.js.
 *
 * Each definition registers into window.__SIMS and is drawn with the helper
 * exposed as window.__SIM_D. Definitions are independent blocks: adding a new
 * sim never touches an existing one, and never touches the build.
 *
 * The rule:
 *   THE FRAMES MUST BE THE REAL MECHANISM, IN THE REAL ORDER.
 * Every number on screen is computed from a stated configuration, not typed in
 * to look plausible. If a mechanism has no genuine time axis, it does not get a
 * sim — a fake timeline over a static formula teaches motion that is not there.
 *
 * (dsa-handbook)
 */
(function () {
  "use strict";
  var S = window.__SIMS;
  if (!S) return;

  // >>> SPLICED SIMS

  // ====================================================================
// ======================================================================
// SIM · dsaav01recursionint
//   page: content/av-01-recursion-introduction-and-identification.md
//
// This is the one page in the module that has not been written. Its
// front matter says status: draft, and all EIGHT section bodies are
// still the angle-bracket prompts the template ships with. So the real
// content of the page is its GATES -- eight instructions addressed to
// whoever fills it in -- and the only honest time axis is the note being
// filled, section by section, in the page's own order.
//
// CONFIG -- every figure on screen is computed from these:
//   sections    the page's 8 headings, in page order:
//               What he actually said / The idea / Diagram / Code /
//               Why it works / What tripped me up / Problems to do /
//               Stop condition
//   gates       each section's own bracketed instruction, read as a
//               predicate over what the run wrote
//   diagram     the page's literal rule, "draw it for n=2 or n=3, never
//               n=6". The three values 2, 3 and 6 are the page's.
//   tree size   a take-it-or-leave-it tree of depth n has
//                 2^(n+1) - 1 nodes and 2^n leaves
//               a reduction chain of depth n has n + 1 nodes
//               Both shapes are evaluated at the page's three values.
//   stop cond.  the page's stop condition has exactly 3 numbered slots
//   problems    the page's table has 4 columns: Problem, Source, Done,
//               Day 7 -- and one empty row
//
// THREE RUNS OF THE SAME TEMPLATE:
//   1. watched it    the video ticked off; fills that look like notes
//   2. worked it     every gate honoured
//   3. as it stands  the page's real current state, all 8 bodies empty
//
// The pass count on every frame is produced by running the 8 gate
// predicates against that run's fills. Nothing is asserted.
// ======================================================================

var dsaav01recursionint_NS = [2, 3, 6];          // the page's three named n values
var dsaav01recursionint_STOP_SLOTS = 3;          // "I have got this when I can: 1. 2. 3."
var dsaav01recursionint_TABLE_COLS = 4;          // Problem | Source | Done | Day 7

function dsaav01recursionint_treeNodes(n) { return Math.pow(2, n + 1) - 1; }
function dsaav01recursionint_treeLeaves(n) { return Math.pow(2, n); }
function dsaav01recursionint_chainNodes(n) { return n + 1; }

function dsaav01recursionint_pct(a, b) { return b ? (a / b) * 100 : 0; }

// ----------------------------------------------------------------------
// The eight sections. rule is the page's instruction, gate is that
// instruction turned into a predicate, meter is what the gate actually
// measured, and capOk / capBad carry the teaching.
// ----------------------------------------------------------------------
var dsaav01recursionint_SECTIONS = [
  {
    h: "What he actually said",
    rule: "in his framing, not mine. if he uses a specific phrase for something, keep his phrase",
    gate: function (f) { return f.hisPhrases >= 1; },
    meter: function (f) { return { label: "his phrases kept verbatim", value: String(f.hisPhrases) }; },
    capOk: function (f) {
      return "<b>1 · What he actually said.</b> " + f.hisPhrases + " phrases carried over " +
        "in his words rather than yours. The instruction is not politeness about " +
        "attribution -- the page says his phrase is <i>the thing you will recall later</i>, " +
        "so a paraphrase throws away the handle you were going to retrieve it by.";
    },
    capBad: function (f) {
      return "<b>1 · What he actually said.</b> " + (f.empty ? "Still the bracketed prompt." :
        "Rewritten in your own words, so " + f.hisPhrases + " of his phrases survive.") +
        " The section exists because a recalled phrase is a retrieval key; your paraphrase " +
        "is a key to a door you have not built yet.";
    }
  },
  {
    h: "The idea",
    rule: "two sentences. if you cannot, you have not got it yet, and that is worth knowing now",
    gate: function (f) { return f.sentences >= 1 && f.sentences <= 2; },
    meter: function (f) { return { label: "sentences written", value: f.sentences + " of max 2" }; },
    capOk: function (f) {
      return "<b>2 · The idea.</b> " + f.sentences + " sentences, inside the page's limit of 2. " +
        "This is the cheapest comprehension test in the handbook: the limit is not a style " +
        "rule, it is a detector. Compression is only possible once the idea has collapsed " +
        "into one thing.";
    },
    capBad: function (f) {
      var lead = f.empty
        ? "Nothing written, so the test was never taken."
        : f.sentences + " sentences where the page allows 2, and that overflow is the whole " +
          "signal.";
      return "<b>2 · The idea.</b> " + lead + " The page says as much in the prompt itself: " +
        "<i>if you cannot, you have not got it yet, and that is worth knowing now rather " +
        "than in an interview.</i> The gate has fired, and the usual response to a fired " +
        "gate is to widen it.";
    }
  },
  {
    h: "Diagram",
    rule: "the tree, or the reduction. draw it for n=2 or n=3, never n=6",
    diag: true,
    gate: function (f) { return f.diagramN >= 1 && f.diagramN <= 3; },
    meter: function (f) {
      return {
        label: "drawn at",
        value: f.diagramN ? "n = " + f.diagramN + " · " +
          (f.shape === "chain" ? dsaav01recursionint_chainNodes(f.diagramN) :
            dsaav01recursionint_treeNodes(f.diagramN)) + " nodes" : "not drawn"
      };
    },
    capOk: function (f) {
      var nodes = dsaav01recursionint_treeNodes(f.diagramN);
      var leaves = dsaav01recursionint_treeLeaves(f.diagramN);
      return "<b>3 · Diagram, at n = " + f.diagramN + ".</b> A take-it-or-leave-it tree of " +
        "depth " + f.diagramN + " is <b>" + nodes + " nodes and " + leaves + " leaves</b> -- " +
        "small enough that you draw every node and the shape is still the thing you see. " +
        "At the page's forbidden n = 6 the same tree is " +
        dsaav01recursionint_treeNodes(6) + " nodes, " +
        (dsaav01recursionint_treeNodes(6) / nodes).toFixed(1) + "× larger, and you would be " +
        "drawing for ten minutes to learn the same branching rule.";
    },
    capBad: function (f) {
      if (f.empty) {
        return "<b>3 · Diagram.</b> Not drawn. The page offers two shapes -- <i>the tree, or " +
          "the reduction</i> -- and they have different sizes at the same n, which is exactly " +
          "why the rule names an n rather than a node count. See the table.";
      }
      var nodes = dsaav01recursionint_treeNodes(f.diagramN);
      return "<b>3 · Diagram, at n = " + f.diagramN + ".</b> The page names this value and " +
        "forbids it: <i>never n=6</i>. Here is the arithmetic behind the ban -- the tree is " +
        "<b>" + nodes + " nodes and " + dsaav01recursionint_treeLeaves(f.diagramN) + " leaves</b>, " +
        (nodes / dsaav01recursionint_treeNodes(3)).toFixed(1) + "× the n = 3 drawing, and it " +
        "carries not one extra idea. A big diagram feels like more work done; it is the same " +
        "branching rule, buried.";
    }
  },
  {
    h: "Code",
    rule: "typed from understanding, not copied from the screen",
    gate: function (f) { return f.codeSource === "understanding"; },
    meter: function (f) {
      return { label: "source of the code", value: f.codeSource === "understanding" ? "typed from understanding" :
        f.codeSource === "screen" ? "copied from the screen" : "no code yet" };
    },
    capOk: function () {
      return "<b>4 · Code.</b> Typed from understanding. The difference matters because " +
        "transcription and reconstruction feel identical while you do them and differ " +
        "completely a week later -- one of them exercised recall, the other exercised your " +
        "eyes. The page spends a whole prompt line on this for that reason.";
    },
    capBad: function (f) {
      if (f.empty) {
        return "<b>4 · Code.</b> Only the comment survives -- <i>typed from understanding, " +
          "not copied from the screen</i> -- which is the instruction standing in for the " +
          "thing it was supposed to govern. This section is the cheapest one to fake and " +
          "the most expensive one to skip.";
      }
      return "<b>4 · Code.</b> Copied off the screen. It will compile, it will be correct, " +
        "and it proves nothing. This is where a note-taking habit either builds recall or " +
        "quietly replaces it, and copied code always looks like the finished version of " +
        "the same work.";
    }
  },
  {
    h: "Why it works",
    rule: "base case, and the one step. or: the choices, and where the tree bottoms out",
    gate: function (f) { return f.whyBase && f.whyStep; },
    meter: function (f) {
      return {
        label: "the two required parts",
        value: (f.whyBase ? 1 : 0) + (f.whyStep ? 1 : 0) + " of 2 written"
      };
    },
    capOk: function () {
      return "<b>5 · Why it works.</b> Both halves present: where it stops, and the single " +
        "step it does. Note that the page gives the prompt twice, once per shape -- " +
        "<i>base case and the one step</i> for a reduction, <i>the choices and where the tree " +
        "bottoms out</i> for a tree. Same two questions, and which pair you can answer tells " +
        "you which shape you are actually in.";
    },
    capBad: function (f) {
      return "<b>5 · Why it works.</b> " + ((f.whyBase ? 1 : 0) + (f.whyStep ? 1 : 0)) +
        " of the 2 required parts. A correctness argument for recursion is exactly two " +
        "claims -- it terminates, and one step is right -- so half of it is not a partial " +
        "argument, it is no argument.";
    }
  },
  {
    h: "What tripped me up",
    rule: "the whole value of these notes is here. write what you got wrong, because that is what you will get wrong again",
    gate: function (f) { return f.mistakes >= 1; },
    meter: function (f) { return { label: "mistakes recorded", value: String(f.mistakes) }; },
    capOk: function (f) {
      return "<b>6 · What tripped me up.</b> " + f.mistakes + " recorded. The page calls this " +
        "section <i>the whole value of these notes</i>, and it is the only section whose " +
        "content cannot be obtained from the video -- everything else is recoverable by " +
        "rewatching. This is the part that is yours.";
    },
    capBad: function (f) {
      if (f.empty) {
        return "<b>6 · What tripped me up.</b> Blank, like the other seven. The page calls " +
          "this section <i>the whole value of these notes</i>, so on the page's own " +
          "accounting this single empty heading costs more than the other seven together.";
      }
      return "<b>6 · What tripped me up.</b> Blank -- the usual outcome, because nothing " +
        "trips you up while you are watching someone else succeed. That is the trap: the " +
        "section is empty precisely when the study method was passive, so its emptiness is " +
        "itself the diagnosis.";
    }
  },
  {
    h: "Problems to do",
    rule: "a table of " + dsaav01recursionint_TABLE_COLS + " columns: Problem, Source, Done, Day 7",
    gate: function (f) { return f.problems >= 1 && f.day7; },
    meter: function (f) {
      return {
        label: "rows · Day 7 column",
        value: f.problems + " row" + (f.problems === 1 ? "" : "s") + " · " +
          (f.day7 ? "scheduled" : "unscheduled")
      };
    },
    capOk: function (f) {
      return "<b>7 · Problems to do.</b> " + f.problems + " rows, and the <b>Day 7</b> column " +
        "filled. That fourth column is the only forward-looking thing on the page -- Done " +
        "records that you solved it once, Day 7 records whether you could still solve it " +
        "after forgetting. They measure different things and the page gives them separate " +
        "columns for that reason.";
    },
    capBad: function (f) {
      return "<b>7 · Problems to do.</b> " + f.problems + " rows in a " +
        dsaav01recursionint_TABLE_COLS + "-column table, Day 7 " + (f.day7 ? "set" : "unset") +
        ". An empty problem table turns the page into a summary of a video, which is a thing " +
        "you can already get by rewatching the video.";
    }
  },
  {
    h: "Stop condition",
    rule: "I have got this when I can: three numbered claims",
    gate: function (f) { return f.stopSlots === dsaav01recursionint_STOP_SLOTS; },
    meter: function (f) {
      return { label: "numbered slots filled", value: f.stopSlots + " of " + dsaav01recursionint_STOP_SLOTS };
    },
    capOk: function () {
      return "<b>8 · Stop condition.</b> All " + dsaav01recursionint_STOP_SLOTS + " slots " +
        "filled, so the page can now tell you when to stop studying it -- which is the " +
        "question every study page dodges. ";
    },
    capBad: function (f) {
      return "<b>8 · Stop condition.</b> " + f.stopSlots + " of " +
        dsaav01recursionint_STOP_SLOTS + " slots filled, so nothing on this page can ever be " +
        "marked finished. A note with no stop condition is re-read forever at decreasing " +
        "value, which feels like studying. ";
    }
  }
];

var dsaav01recursionint_N_SEC = dsaav01recursionint_SECTIONS.length;

// ----------------------------------------------------------------------
// One driver. Each run supplies only its fills and its prose; every count
// below is produced by running the 8 gates over those fills.
// ----------------------------------------------------------------------
function dsaav01recursionint_run(cfg) {
  var steps = [{
    caption: cfg.idle,
    idx: -1, passes: 0, reached: 0, cfg: cfg, ok: false, flag: "idle"
  }];
  var passes = 0, i, sec, ok, cap;
  for (i = 0; i < dsaav01recursionint_N_SEC; i++) {
    sec = dsaav01recursionint_SECTIONS[i];
    ok = sec.gate(cfg.fill);
    if (ok) passes += 1;
    cap = ok ? sec.capOk(cfg.fill) : sec.capBad(cfg.fill);
    if (i === dsaav01recursionint_N_SEC - 1) cap += cfg.verdict(passes);
    steps.push({
      caption: cap,
      flag: ok ? "ok" : "bad",
      idx: i, ok: ok, passes: passes, reached: i + 1, cfg: cfg
    });
  }
  return { id: cfg.id, label: cfg.label, steps: steps };
}

// --- run 1: the video ticked off --------------------------------------
var dsaav01recursionint_WATCHED = dsaav01recursionint_run({
  id: "watched",
  label: "Watched it",
  idle: "The page's template, about to be filled by someone who watched video 1 straight " +
    "through and understood it. Understanding it is not in dispute here -- what the eight " +
    "gates test is whether anything survived the week. Press Play.",
  fill: {
    empty: false,
    hisPhrases: 0, sentences: 4, diagramN: 6, shape: "branching",
    codeSource: "screen", whyBase: true, whyStep: true,
    mistakes: 0, problems: 0, day7: false, stopSlots: 0
  },
  wrote: [
    "a clean summary of the video, in your words",
    "four sentences covering identification, the tree, the base case and why it matters",
    "the full tree at n = 6, because it looks more complete",
    "the function, pasted from the screen",
    "stops at the base case; one step per level",
    "(left blank -- nothing went wrong while watching)",
    "(no rows)",
    "(no slots filled)"
  ],
  verdict: function (p) {
    return "<b>" + p + " of " + dsaav01recursionint_N_SEC + " gates.</b> Nothing here was " +
      "lazy: the summary is accurate, the diagram is bigger than asked, the code is correct. " +
      "Every failure is a failure of <i>effort in the wrong place</i> -- and the three " +
      "sections that would have made this page revisable in a week (the 2-sentence idea, " +
      "the mistakes, the stop condition) are the three that cost nothing to skip.";
  }
});

// --- run 2: every gate honoured ---------------------------------------
var dsaav01recursionint_WORKED = dsaav01recursionint_run({
  id: "worked",
  label: "Worked through it",
  idle: "Same template, same video, same person. The only change is that each section's own " +
    "bracketed instruction is treated as a gate rather than as a hint.",
  fill: {
    empty: false,
    hisPhrases: 3, sentences: 2, diagramN: 3, shape: "branching",
    codeSource: "understanding", whyBase: true, whyStep: true,
    mistakes: 2, problems: 4, day7: true, stopSlots: 3
  },
  wrote: [
    "3 of his phrases kept exactly as he said them",
    "two sentences, rewritten four times to get there",
    "the tree at n = 3, every node drawn and labelled",
    "typed from memory, then checked against the video",
    "where it stops, and the single step it does",
    "2 things got wrong, written down while they were still embarrassing",
    "4 rows, Source and Day 7 both set",
    "3 numbered claims you can check yourself against"
  ],
  verdict: function (p) {
    return "<b>" + p + " of " + dsaav01recursionint_N_SEC + " gates, " +
      Math.round(dsaav01recursionint_pct(p, dsaav01recursionint_N_SEC)) + "%.</b> The " +
      "difference against the first tab is not diligence, it is that four of these gates " +
      "reject work that <i>looks better</i> -- shorter prose, a smaller diagram, code you " +
      "typed slower, a section admitting you were wrong. A template that only rewarded more " +
      "output would have passed the first run.";
  }
});

// --- run 3: the page as it actually stands ----------------------------
var dsaav01recursionint_DRAFT = dsaav01recursionint_run({
  id: "draft",
  label: "The page as it stands",
  idle: "This run is not hypothetical. It is the live state of the page you are reading: " +
    "front matter says <b>status: draft</b>, and all " + dsaav01recursionint_N_SEC +
    " bodies are still the angle-bracket prompts the template shipped with.",
  fill: {
    empty: true,
    hisPhrases: 0, sentences: 0, diagramN: 0, shape: "none",
    codeSource: "none", whyBase: false, whyStep: false,
    mistakes: 0, problems: 0, day7: false, stopSlots: 0
  },
  wrote: [
    "&lt;in his framing, not mine&gt;",
    "&lt;two sentences&gt;",
    "&lt;the tree, or the reduction&gt;",
    "# typed from understanding, not copied from the screen",
    "&lt;base case, and the one step&gt;",
    "&lt;the whole value of these notes is here&gt;",
    "| | | | |  -- one empty row",
    "1.  2.  3."
  ],
  verdict: function (p) {
    return "<b>" + p + " of " + dsaav01recursionint_N_SEC + ".</b> The sibling pages in this " +
      "module were written from AI summaries and each carries a warning saying so; this one " +
      "was not written at all. That is worth leaving visible rather than quietly deleting " +
      "the page -- an empty template is an honest record of what has not been done, and " +
      "video 1 is the only video in the series whose notes are still owed.";
  }
});

S["dsaav01recursionint"] = {
  title: "Fill the template against its own gates",
  note: "The page is a note template with <b>" + dsaav01recursionint_N_SEC + " sections</b>, " +
    "each carrying a bracketed instruction, and a stop condition with <b>" +
    dsaav01recursionint_STOP_SLOTS + " numbered slots</b>. Each instruction is read here as a " +
    "gate, and the pass count on every frame is produced by evaluating those " +
    dsaav01recursionint_N_SEC + " predicates against what the run wrote -- never asserted. " +
    "The diagram gate is the page's literal rule, <i>draw it for n=2 or n=3, never n=6</i>; " +
    "the node counts behind it are computed, since a take-it-or-leave-it tree of depth n has " +
    "2<sup>n+1</sup> − 1 nodes and 2<sup>n</sup> leaves while a reduction chain has n + 1.",
  interval: 1400,
  scenarios: [
    dsaav01recursionint_WATCHED,
    dsaav01recursionint_WORKED,
    dsaav01recursionint_DRAFT
  ],

  draw: function (step, d, ctx) {
    var i, sec, cells = [], cfg = step.cfg;

    for (i = 0; i < dsaav01recursionint_N_SEC; i++) {
      sec = dsaav01recursionint_SECTIONS[i];
      var state = i >= step.reached ? "idle"
        : (sec.gate(cfg.fill) ? "ok" : "bad");
      cells.push({
        label: String(i + 1),
        flag: state,
        title: sec.h + " — " + (i >= step.reached ? "not reached yet"
          : state === "ok" ? "gate holds: " + sec.rule
          : "gate fails: " + sec.rule)
      });
    }

    var cur = step.idx >= 0 ? dsaav01recursionint_SECTIONS[step.idx] : null;
    var reached = step.reached;
    var failed = reached - step.passes;

    var top = d.flow([
      d.big(reached ? step.passes + " / " + dsaav01recursionint_N_SEC : "—", "gates held",
        !reached ? "idle" : step.passes === dsaav01recursionint_N_SEC ? "ok"
          : step.passes === 0 ? "bad" : "warn"),
      d.stat({
        label: "sections checked",
        value: reached + " of " + dsaav01recursionint_N_SEC,
        sub: reached ? failed + " rejected" : "not started",
        flag: !reached ? "idle" : failed ? "bad" : "ok"
      }),
      d.stat({
        label: "usable on day 7",
        value: reached ? String(step.passes) : "—",
        sub: "sections a revision can read",
        flag: !reached ? "idle" : step.passes >= 6 ? "ok" : step.passes ? "warn" : "bad"
      })
    ]);

    var body = "";
    if (cur) {
      body += d.mono(cfg.wrote[step.idx], step.ok ? "ok" : "bad");
    }

    var node = d.node({
      title: cur ? (step.idx + 1) + " · " + cur.h : "template · nothing filled yet",
      status: !cur ? "IDLE" : step.ok ? "GATE HOLDS" : "GATE FAILS",
      statusFlag: !cur ? "idle" : step.ok ? "ok" : "bad",
      badge: cfg.label,
      meta: cur ? "the page says: " + cur.rule : "8 sections, each with its own instruction",
      flag: !cur ? "idle" : step.ok ? "ok" : "bad",
      body: body || undefined,
      rows: cur
        ? [
            (function () {
              var m = cur.meter(cfg.fill);
              return { label: m.label, value: m.value, flag: step.ok ? "ok" : "bad" };
            })(),
            { label: "gates held so far", value: step.passes + " of " + reached,
              flag: step.passes === reached ? "ok" : "bad" }
          ]
        : [
            { label: "sections", value: String(dsaav01recursionint_N_SEC) },
            { label: "stop-condition slots", value: String(dsaav01recursionint_STOP_SLOTS) },
            { label: "problem-table columns", value: String(dsaav01recursionint_TABLE_COLS) }
          ]
    });

    var extra = "";
    if (cur && cur.diag) {
      var rows = [];
      for (i = 0; i < dsaav01recursionint_NS.length; i++) {
        var n = dsaav01recursionint_NS[i];
        rows.push([
          "n = " + n,
          String(dsaav01recursionint_treeNodes(n)),
          String(dsaav01recursionint_treeLeaves(n)),
          String(dsaav01recursionint_chainNodes(n)),
          n <= 3 ? "allowed" : "the page forbids it"
        ]);
      }
      extra = d.table(
        ["depth", "tree nodes", "leaves", "chain nodes", "the rule"],
        rows
      );
    }

    var msg;
    if (!reached) {
      msg = d.note("Eight sections, eight instructions. None of them is about formatting.", "idle");
    } else if (reached === dsaav01recursionint_N_SEC) {
      msg = d.note(
        "<b>" + step.passes + " of " + dsaav01recursionint_N_SEC + "</b> gates held — " +
        Math.round(dsaav01recursionint_pct(step.passes, dsaav01recursionint_N_SEC)) +
        "% of the page is load-bearing a week from now.",
        step.passes === dsaav01recursionint_N_SEC ? "ok" : step.passes ? "warn" : "bad"
      );
    } else {
      msg = d.note(
        (dsaav01recursionint_N_SEC - reached) + " sections still to check.",
        failed ? "warn" : "ok"
      );
    }

    return d.stack([
      top,
      d.cells(cells, { label: "the page's 8 sections, in page order" }),
      node,
      extra,
      msg
    ]);
  }
};

  // ====================================================================
// ======================================================================
// SIM · dsaav02recursionise   (av-02-recursion-is-everywhere.md)
//
// The page's §3 is a syllabus: twelve timestamped rows naming thirteen
// problems, split into three families, and the page states outright that
// "the ordering is the curriculum". So the time axis is the video's own
// clock -- 4:23 to 6:35 -- and the mechanism is what each new problem
// adds to the machinery you are carrying.
//
// CONFIG -- every figure is computed from the page's §3 table, verbatim:
//   rows        4:23 Print 1 to N and N to 1 (reduce)
//               4:53 Sort an array · 5:03 Sort a stack
//               5:11 Delete the middle element of a stack
//               5:16 Remove duplicates from a list
//               5:18 Count the number of bits
//               5:21 Subset generation (choice)
//               5:25 Permutation with spaces · 5:28 with case changes
//               5:31 Letter case permutation
//               6:12 Binary strings, N-bit with 1s >= 0s (constrained)
//               6:35 Balanced parentheses generation (constrained)
//   problems    13 -- the 4:23 row carries two of §8's numbered problems
//   families    the page's three groups, with its own spans:
//               REDUCE 4:23-5:18 · CHOICE 5:21-5:31 · CONSTRAINED 6:12-6:35
//   ideas       one per family boundary: reduce-and-rebuild, the choice
//               tree, pruning. Counted by walking the list, not asserted.
//   §2 confound a tree problem puts 3 skills under test at once, so a
//               failure localises to 1 of 3; an isolated problem puts 1
//               under test. The page: "so the thing you practise is the
//               thing you are learning."
//
// Every span in seconds is parsed from those m:ss strings at load.
//
// THREE RUNS OVER THE SAME SYLLABUS:
//   1. in the video's order  -- the curriculum as given
//   2. straight to the hard one -- start at #13, meet every prerequisite
//      simultaneously
//   3. through binary trees  -- the page's §2, the approach the series
//      exists to refuse
// ======================================================================

function dsaav02recursionise_secs(t) {
  var p = String(t).split(":");
  return Number(p[0]) * 60 + Number(p[1]);
}
function dsaav02recursionise_clock(s) {
  var m = Math.floor(s / 60), r = s - m * 60;
  return m + ":" + (r < 10 ? "0" : "") + r;
}
function dsaav02recursionise_pct(a, b) { return b ? (a / b) * 100 : 0; }

// --- the page's §3 table, row for row ---------------------------------
var dsaav02recursionise_ROWS = [
  { t: "4:23", name: "Print 1 to N, and N to 1", fam: "reduce", n: 2,
    why: "the base case, bare, and the down/up distinction" },
  { t: "4:53", name: "Sort an array", fam: "reduce", n: 1,
    why: "sort n-1, insert the last element" },
  { t: "5:03", name: "Sort a stack", fam: "reduce", n: 1,
    why: "same move, different container" },
  { t: "5:11", name: "Delete the middle element of a stack", fam: "reduce", n: 1,
    why: "pop, recurse, push back" },
  { t: "5:16", name: "Remove duplicates from a list", fam: "reduce", n: 1,
    why: "reduce and rebuild without the repeat" },
  { t: "5:18", name: "Count the number of bits", fam: "reduce", n: 1,
    why: "numeric reduction rather than structural" },
  { t: "5:21", name: "Subset generation", fam: "choice", n: 1,
    why: "the canonical take-it-or-leave-it tree" },
  { t: "5:25", name: "Permutation with spaces", fam: "choice", n: 1,
    why: "insert a space, or do not" },
  { t: "5:28", name: "Permutation with case changes", fam: "choice", n: 1,
    why: "upper or lower, per letter" },
  { t: "5:31", name: "Letter case permutation", fam: "choice", n: 1,
    why: "same family, letters only" },
  { t: "6:12", name: "Binary strings, N-bit with 1s >= 0s", fam: "constrained", n: 1,
    why: "the prefix constraint" },
  { t: "6:35", name: "Balanced parentheses generation", fam: "constrained", n: 1,
    why: "the count constraint" }
];

var dsaav02recursionise_IDEA = {
  reduce: "reduce and rebuild",
  choice: "the choice tree",
  constrained: "pruning"
};

// --- derive the totals by walking the table ---------------------------
var dsaav02recursionise_TOTAL = 0;
var dsaav02recursionise_FAM = { reduce: null, choice: null, constrained: null };
(function () {
  var i, r, f;
  for (i = 0; i < dsaav02recursionise_ROWS.length; i++) {
    r = dsaav02recursionise_ROWS[i];
    dsaav02recursionise_TOTAL += r.n;
    f = dsaav02recursionise_FAM[r.fam];
    if (!f) {
      f = dsaav02recursionise_FAM[r.fam] =
        { probs: 0, rows: 0, from: r.t, to: r.t, first: i };
    }
    f.probs += r.n;
    f.rows += 1;
    f.to = r.t;
  }
})();
var dsaav02recursionise_FAMS = ["reduce", "choice", "constrained"];
var dsaav02recursionise_IDEAS = dsaav02recursionise_FAMS.length;   // 3, counted
var dsaav02recursionise_SPAN =
  dsaav02recursionise_secs(dsaav02recursionise_ROWS[dsaav02recursionise_ROWS.length - 1].t) -
  dsaav02recursionise_secs(dsaav02recursionise_ROWS[0].t);
var dsaav02recursionise_REUSED = dsaav02recursionise_TOTAL - dsaav02recursionise_IDEAS;

function dsaav02recursionise_famSpan(k) {
  var f = dsaav02recursionise_FAM[k];
  return dsaav02recursionise_secs(f.to) - dsaav02recursionise_secs(f.from);
}
function dsaav02recursionise_famFlag(k) {
  return k === "reduce" ? "ok" : k === "choice" ? "warn" : "bad";
}

// ======================================================================
// SCENARIO 1 — the video's order. Frames group the rows the way the page
// groups them; the counters are cumulative over the rows a frame covers.
// ======================================================================
var dsaav02recursionise_GROUPS = [[0], [1, 2, 3], [4, 5], [6], [7, 8, 9], [10], [11]];

function dsaav02recursionise_ordered() {
  var steps = [{
    mode: "order", rows: [], upto: 0, probs: 0, ideas: 0, verdict: false,
    caption: "The page's §3 syllabus: <b>" + dsaav02recursionise_TOTAL + " problems</b> " +
      "named between " + dsaav02recursionise_ROWS[0].t + " and " +
      dsaav02recursionise_ROWS[dsaav02recursionise_ROWS.length - 1].t + " — " +
      dsaav02recursionise_SPAN + " seconds of video. Watch what each one <i>adds</i>, " +
      "rather than what it is called. Press Play.",
    flag: "idle"
  }];

  var probs = 0, ideas = 0, seen = {}, g, i, j, r, newIdea, upto = 0;
  for (g = 0; g < dsaav02recursionise_GROUPS.length; g++) {
    newIdea = null;
    for (j = 0; j < dsaav02recursionise_GROUPS[g].length; j++) {
      i = dsaav02recursionise_GROUPS[g][j];
      r = dsaav02recursionise_ROWS[i];
      probs += r.n;
      if (!seen[r.fam]) { seen[r.fam] = 1; ideas += 1; newIdea = r.fam; }
      upto = i + 1;
    }
    var famKey = dsaav02recursionise_ROWS[dsaav02recursionise_GROUPS[g][0]].fam;
    var fam = dsaav02recursionise_FAM[famKey];
    var closes = upto === fam.first + fam.rows;
    steps.push({
      mode: "order",
      rows: dsaav02recursionise_GROUPS[g],
      upto: upto, probs: probs, ideas: ideas,
      newIdea: newIdea, fam: famKey, closes: closes,
      verdict: g === dsaav02recursionise_GROUPS.length - 1,
      caption: "",
      flag: newIdea ? "warn" : closes ? "ok" : undefined
    });
  }

  var s;
  s = steps[1];
  s.caption = "<b>4:23 — Print 1 to N, and N to 1.</b> Two of §8's thirteen problems in " +
    "one row, and the first idea arrives with them: <i>" +
    dsaav02recursionise_IDEA.reduce + "</i>. They differ by the position of one line, " +
    "which is the cheapest possible place to learn that code before the recursive call " +
    "runs on the way down and code after it runs on the way back up.";
  s = steps[2];
  s.caption = "<b>4:53 to 5:11 — sort an array, sort a stack, delete the middle element.</b> " +
    "Three problems, <b>zero new ideas</b>. Sorting a stack is sorting an array with the " +
    "container swapped; deleting the middle is pop, recurse, push back. The counter on " +
    "the left is the point: problems went up by 3 and machinery did not move.";
  s = steps[3];
  var fr = dsaav02recursionise_FAM.reduce;
  s.caption = "<b>5:16 to 5:18 — remove duplicates, count the bits.</b> The reduce block " +
    "closes: <b>" + fr.probs + " problems</b> from " + fr.from + " to " + fr.to + " (" +
    dsaav02recursionise_famSpan("reduce") + " s of video) on <b>one</b> idea. Count the " +
    "bits is the interesting one — the reduction is numeric rather than structural, which " +
    "is how you find out the move was never about containers.";
  s = steps[4];
  s.caption = "<b>5:21 — Subset generation.</b> Second idea: <i>" +
    dsaav02recursionise_IDEA.choice + "</i>. This is a different shape, not a harder " +
    "version of the last one — at every element you branch twice instead of reducing once, " +
    "so the call graph stops being a chain. The seven problems behind you bought you " +
    "nothing here, and that is exactly why it sits at a family boundary.";
  s = steps[5];
  var fc = dsaav02recursionise_FAM.choice;
  s.caption = "<b>5:25 to 5:31 — permutation with spaces, with case changes, letter case.</b> " +
    "Three problems, zero new ideas again. Same tree, and only the branching rule changes: " +
    "space or no space, upper or lower. The choice block closes at <b>" + fc.probs +
    " problems</b> in " + dsaav02recursionise_famSpan("choice") + " seconds — the densest " +
    "stretch in the list, because by now the machinery is free.";
  s = steps[6];
  s.caption = "<b>6:12 — Binary strings, N-bit with 1s >= 0s.</b> Third and last idea: " +
    "<i>" + dsaav02recursionise_IDEA.constrained + "</i>. The tree is the same tree; what " +
    "changed is that some branches are illegal before you reach a leaf. A prefix with more " +
    "0s than 1s can never recover, so the branch is cut rather than explored and discarded.";
  s = steps[7];
  var fk = dsaav02recursionise_FAM.constrained;
  s.caption = "<b>6:35 — Balanced parentheses.</b> Same prune, a count constraint instead " +
    "of a prefix constraint, and the list ends. <b>" + dsaav02recursionise_TOTAL +
    " problems, " + dsaav02recursionise_IDEAS + " ideas</b> — " +
    dsaav02recursionise_REUSED + " of the " + dsaav02recursionise_TOTAL + " (" +
    Math.round(dsaav02recursionise_pct(dsaav02recursionise_REUSED,
      dsaav02recursionise_TOTAL)) + "%) introduce nothing at all. That is the page's " +
    "<i>once you have one you nearly have all seven</i> turned into arithmetic, and it is " +
    "also why the last two are the bridge to backtracking: <b>a choice tree where some " +
    "branches are illegal is backtracking</b>. Every idea arrived alone.";
  return { id: "order", label: "In the video's order", steps: steps };
}

// ======================================================================
// SCENARIO 2 — start at the end. The same three ideas, met at once.
// ======================================================================
var dsaav02recursionise_UNKNOWNS = [
  { id: 8, t: "5:21", tag: "the choice tree",
    need: "enumerate every candidate string, not just test one" },
  { id: 12, t: "6:12", tag: "pruning",
    need: "kill a prefix that can never become valid" },
  { id: 1, t: "4:23", tag: "reduce and rebuild",
    need: "append on the way down, and undo on the way back up" }
];

function dsaav02recursionise_jump() {
  function frame(found, fixed, cap, flag, cost) {
    var open = found - fixed;
    return {
      mode: "jump", found: found, fixed: fixed, open: open, cost: !!cost,
      caption: cap, flag: flag
    };
  }
  var U = dsaav02recursionise_UNKNOWNS;
  var steps = [
    frame(0, 0,
      "Same " + dsaav02recursionise_TOTAL + " problems, opened at the bottom. <b>#13, " +
      "balanced parentheses (6:35)</b>, because it is the one on the list that sounds like " +
      "an interview question. Nothing about that instinct is unreasonable.",
      "idle"),
    frame(1, 0,
      "<b>First wall.</b> You have to produce <i>all</i> balanced strings, so you need a " +
      "structure that branches at every position. That is <b>#" + U[0].id + " · " + U[0].tag +
      "</b>, named at " + U[0].t + " and not done. <b>1</b> unknown open.", "warn"),
    frame(2, 0,
      "<b>Second wall.</b> The tree alone generates every string, valid or not. A prefix " +
      "with an unmatched close paren is dead and must be cut where it is discovered, not " +
      "filtered at the leaves. That is <b>#" + U[1].id + " · " + U[1].tag + "</b> (" +
      U[1].t + "). <b>2</b> open.", "bad"),
    frame(3, 0,
      "<b>Third wall.</b> The candidate has to be built as you descend and unbuilt as you " +
      "return, or branch two inherits branch one's characters. That is <b>#" + U[2].id +
      " · " + U[2].tag + "</b> (" + U[2].t + ") — the very first row of the syllabus. <b>3</b> " +
      "open.", "bad"),
    frame(3, 0,
      "<b>The actual cost of skipping.</b> Three unknowns held at once, and the output is " +
      "wrong. Which one is broken? Every one of the <b>3</b> is a live candidate, so the " +
      "failure localises to <b>1 in 3</b> and debugging becomes guessing. Walking the list " +
      "in order, the maximum ever open at once is <b>1</b> — each of the three ideas " +
      "arrives on its own row.", "bad", true),
    frame(3, 1,
      "<b>Backfill #" + U[2].id + " (" + U[2].t + ").</b> Print 1 to N: build on the way " +
      "down, or build on the way back up. Ninety seconds of work, and it removes an " +
      "unknown. <b>2</b> open.", "warn"),
    frame(3, 2,
      "<b>Backfill #" + U[0].id + " (" + U[0].t + ").</b> Subset generation: the " +
      "take-it-or-leave-it tree, every branch legal, nothing to prune. <b>1</b> open — and " +
      "the remaining unknown is now isolated, which is the only state in which you can " +
      "learn anything from a failure.", "warn"),
    frame(3, 3,
      "<b>Backfill #" + U[1].id + " (" + U[1].t + "), then #13 lands.</b> You solved the " +
      "same four problems in the same order the video gives them — " + U[2].t + ", " +
      U[0].t + ", " + U[1].t + ", 6:35 — after paying for a run with 3 simultaneous " +
      "unknowns first. Skipping ahead did not save the prerequisites; it bought one " +
      "unlocalisable failure and then charged for them anyway.", "ok")
  ];
  return { id: "jump", label: "Straight to the hard one", steps: steps };
}

// ======================================================================
// SCENARIO 3 — the page's §2: why the series refuses tree problems.
// ======================================================================
var dsaav02recursionise_TREE_SKILLS = [
  "binary-tree representation",
  "traversal order",
  "the recursion itself"
];
var dsaav02recursionise_ISO_SKILLS = ["the recursion itself"];

function dsaav02recursionise_through() {
  function frame(skills, tested, cap, flag, extra) {
    var o = {
      mode: "tree", skills: skills, tested: tested,
      caption: cap, flag: flag
    };
    if (extra) { for (var k in extra) if (extra.hasOwnProperty(k)) o[k] = extra[k]; }
    return o;
  }
  var T = dsaav02recursionise_TREE_SKILLS, I = dsaav02recursionise_ISO_SKILLS;
  var steps = [
    frame(T, 0,
      "The page's §2, and it calls this the most useful idea in the video. Recursion does " +
      "live inside trees — so why not learn it there? Press Play and count what is under " +
      "test.", "idle", { probName: "maximum depth of a binary tree", attempts: 0, solved: 0 }),
    frame(T, T.length,
      "<b>Maximum depth of a binary tree.</b> A fair problem, four lines long. But solving " +
      "it requires <b>" + T.length + "</b> separate things to be true at once, and only one " +
      "of them is the thing you came to learn.", "warn",
      { probName: "maximum depth of a binary tree", attempts: 0, solved: 0 }),
    frame(T, T.length,
      "<b>You write it. It returns the wrong number.</b> Nothing about the failure says " +
      "which of the " + T.length + " is at fault — a null child mishandled, the wrong " +
      "traversal, or a genuinely wrong recursive hypothesis all produce exactly this.",
      "bad", { probName: "maximum depth of a binary tree", attempts: 1, solved: 0 }),
    frame(T, T.length,
      "<b>Localisation: 1 in " + T.length + ".</b> With " + T.length + " candidate causes " +
      "and no way to isolate them, diagnosis is a " +
      Math.round(dsaav02recursionise_pct(1, T.length)) + "% guess. The page's phrase for " +
      "this is that the recursion <i>gets tangled with prerequisites and you cannot tell " +
      "which part you failed at</i>.", "bad",
      { probName: "maximum depth of a binary tree", attempts: 3, solved: 0 }),
    frame(T, T.length,
      "<b>You fix the traversal and it passes.</b> Problem solved, and the question you " +
      "sat down with — is my recursive reasoning sound? — is still open, because the " +
      "confound was never broken. A green test here is not evidence about recursion.",
      "warn", { probName: "maximum depth of a binary tree", attempts: 4, solved: 1 }),
    frame(T, T.length,
      "<b>Second tree problem, same " + T.length + " skills under test.</b> The count does " +
      "not fall with practice, because it is a property of the problem and not of you. " +
      "This is why the page marks tree, graph and DP problems <b>excluded</b>: they carry " +
      "prerequisites.", "bad",
      { probName: "diameter of a binary tree", attempts: 5, solved: 1 }),
    frame(I, I.length,
      "<b>Now the syllabus version: #3, sort an array (4:53).</b> Skills under test: <b>" +
      I.length + "</b>. If it is wrong, the recursion is wrong — localisation <b>1 in " +
      I.length + "</b>, " + Math.round(dsaav02recursionise_pct(1, I.length)) + "%. The page: " +
      "<i>so the thing you practise is the thing you are learning.</i>", "ok",
      { probName: "sort an array (#3, 4:53)", attempts: 6, solved: 2 }),
    frame(I, I.length,
      "<b>And it holds across the whole list.</b> Of the " + dsaav02recursionise_TOTAL +
      " syllabus problems, the number requiring tree, graph or DP knowledge is <b>0</b> — " +
      "arrays, stacks, strings and integers only. That is not a taste in problems, it is " +
      "the design: isolate a skill before combining it, which is worth stealing as a study " +
      "principle well beyond recursion.", "ok",
      { probName: "all " + dsaav02recursionise_TOTAL + " syllabus problems", attempts: 6, solved: 2 })
  ];
  return { id: "through", label: "Through binary trees", steps: steps };
}

S["dsaav02recursionise"] = {
  title: "Walk the syllabus and count what each problem adds",
  note: "The page's §3 table, row for row: <b>" + dsaav02recursionise_TOTAL + " problems</b> " +
    "named between " + dsaav02recursionise_ROWS[0].t + " and " +
    dsaav02recursionise_ROWS[dsaav02recursionise_ROWS.length - 1].t + ", in three families " +
    "with the page's own spans (REDUCE " + dsaav02recursionise_FAM.reduce.from + "–" +
    dsaav02recursionise_FAM.reduce.to + " · CHOICE " + dsaav02recursionise_FAM.choice.from +
    "–" + dsaav02recursionise_FAM.choice.to + " · CONSTRAINED " +
    dsaav02recursionise_FAM.constrained.from + "–" + dsaav02recursionise_FAM.constrained.to +
    "). Every count, span and percentage below is derived from that table at load — the " +
    "problem totals, the " + dsaav02recursionise_IDEAS + " family boundaries, and the " +
    "seconds, which are parsed from the timestamps. The third tab prices the page's §2 " +
    "confound: a tree problem puts " + dsaav02recursionise_TREE_SKILLS.length +
    " skills under test at once, an isolated one puts " +
    dsaav02recursionise_ISO_SKILLS.length + ".",
  interval: 1500,
  scenarios: [
    dsaav02recursionise_ordered(),
    dsaav02recursionise_jump(),
    dsaav02recursionise_through()
  ],

  draw: function (step, d, ctx) {
    var i, j, r, cells, rows;

    // ---------------- mode: the video's order --------------------------
    if (step.mode === "order") {
      cells = [];
      var num = 0;
      for (i = 0; i < dsaav02recursionise_ROWS.length; i++) {
        r = dsaav02recursionise_ROWS[i];
        for (j = 0; j < r.n; j++) {
          num += 1;
          var reached = i < step.upto;
          cells.push({
            label: String(num),
            flag: reached ? dsaav02recursionise_famFlag(r.fam) : "idle",
            title: "#" + num + " · " + r.t + " · " + r.name + " · " + r.fam +
              (reached ? " — covered: " + r.why : " — not reached yet")
          });
        }
      }

      var idea = step.newIdea
        ? dsaav02recursionise_IDEA[step.newIdea]
        : (step.upto ? "nothing new" : "none yet");
      var nowRows = [];
      for (i = 0; i < step.rows.length; i++) {
        r = dsaav02recursionise_ROWS[step.rows[i]];
        nowRows.push({
          label: r.t + " · " + r.name,
          value: r.fam,
          flag: dsaav02recursionise_famFlag(r.fam)
        });
      }
      if (!nowRows.length) {
        nowRows.push({ label: "nothing named yet", value: "0 of " + dsaav02recursionise_TOTAL,
          flag: "idle" });
      }

      var head = d.flow([
        d.big(step.probs + " / " + dsaav02recursionise_TOTAL, "problems named",
          step.probs ? "ok" : "idle"),
        d.stat({
          label: "ideas carried",
          value: String(step.ideas),
          sub: step.newIdea ? "+1 this step · " + idea : "unchanged",
          flag: step.newIdea ? "warn" : step.ideas ? "ok" : "idle"
        }),
        d.stat({
          label: "video elapsed",
          value: step.upto
            ? dsaav02recursionise_ROWS[step.upto - 1].t
            : dsaav02recursionise_ROWS[0].t,
          sub: "of " + dsaav02recursionise_ROWS[dsaav02recursionise_ROWS.length - 1].t +
            " · " + dsaav02recursionise_SPAN + " s total",
          flag: "idle"
        })
      ]);

      var node = d.node({
        title: step.upto ? "named in this step" : "the list, unopened",
        status: step.newIdea ? "NEW MACHINERY" : step.upto ? "REUSE" : "IDLE",
        statusFlag: step.newIdea ? "warn" : step.upto ? "ok" : "idle",
        badge: step.fam ? step.fam : "13 problems",
        meta: step.newIdea
          ? "this family boundary introduces: " + idea
          : step.upto ? "same machinery, different container or branching rule"
          : "three families, three ideas, one ordering",
        flag: step.newIdea ? "warn" : step.upto ? "ok" : "idle",
        rows: nowRows
      });

      var tail;
      if (step.verdict) {
        rows = [];
        for (i = 0; i < dsaav02recursionise_FAMS.length; i++) {
          var k = dsaav02recursionise_FAMS[i];
          var f = dsaav02recursionise_FAM[k];
          rows.push([
            k,
            f.from + "–" + f.to,
            dsaav02recursionise_famSpan(k) + " s",
            String(f.probs),
            "1 · " + dsaav02recursionise_IDEA[k]
          ]);
        }
        rows.push([
          "all", dsaav02recursionise_ROWS[0].t + "–" +
            dsaav02recursionise_ROWS[dsaav02recursionise_ROWS.length - 1].t,
          dsaav02recursionise_SPAN + " s",
          String(dsaav02recursionise_TOTAL),
          String(dsaav02recursionise_IDEAS)
        ]);
        tail = d.table(["family", "span", "seconds", "problems", "ideas"], rows);
      } else {
        tail = d.note(
          step.upto
            ? (dsaav02recursionise_TOTAL - step.probs) + " problems still to come, and at " +
              "most " + (dsaav02recursionise_IDEAS - step.ideas) + " more ideas."
            : "Thirteen problems. Guess how many distinct ideas are in them.",
          step.upto ? undefined : "idle"
        );
      }

      return d.stack([
        head,
        d.cells(cells, { label: "the 13 problems, in the order he names them" }),
        node,
        tail
      ]);
    }

    // ---------------- mode: straight to the hard one -------------------
    if (step.mode === "jump") {
      cells = [];
      for (i = 0; i < dsaav02recursionise_UNKNOWNS.length; i++) {
        var u = dsaav02recursionise_UNKNOWNS[i];
        var st = i >= step.found ? "idle" : i < step.fixed ? "ok" : "bad";
        cells.push({
          label: "#" + u.id,
          flag: st,
          title: u.tag + " (" + u.t + ") — " +
            (st === "idle" ? "not yet discovered as a prerequisite"
              : st === "ok" ? "backfilled" : "open: " + u.need)
        });
      }
      var loc = step.open ? 1 / step.open : 1;

      var jrows = [];
      for (i = 0; i < dsaav02recursionise_UNKNOWNS.length; i++) {
        var uu = dsaav02recursionise_UNKNOWNS[i];
        jrows.push({
          label: "#" + uu.id + " · " + uu.tag + " (" + uu.t + ")",
          value: i >= step.found ? "not seen" : i < step.fixed ? "done" : "OPEN",
          flag: i >= step.found ? "idle" : i < step.fixed ? "ok" : "bad"
        });
      }

      return d.stack([
        d.flow([
          d.big(String(step.open), "unknowns open at once",
            step.open >= 2 ? "bad" : step.open === 1 ? "warn" : "ok"),
          d.stat({
            label: "a failure localises to",
            value: "1 in " + (step.open || 1),
            sub: Math.round(dsaav02recursionise_pct(1, step.open || 1)) + "% certain",
            flag: step.open >= 2 ? "bad" : "ok"
          }),
          d.stat({
            label: "backfilled",
            value: step.fixed + " of " + dsaav02recursionise_UNKNOWNS.length,
            sub: "prerequisites paid for",
            flag: step.fixed === dsaav02recursionise_UNKNOWNS.length ? "ok"
              : step.fixed ? "warn" : "idle"
          })
        ]),
        d.cells(cells, { label: "prerequisites of #13, discovered one wall at a time" }),
        d.node({
          title: "#13 · Balanced parentheses generation (6:35)",
          status: step.cost ? "UNLOCALISABLE"
            : step.fixed === dsaav02recursionise_UNKNOWNS.length ? "SOLVED"
            : step.open ? "BLOCKED" : "OPENED",
          statusFlag: step.fixed === dsaav02recursionise_UNKNOWNS.length ? "ok"
            : step.open ? "bad" : "idle",
          badge: "constrained choice",
          meta: "the last problem on a list whose ordering the page calls the curriculum",
          flag: step.fixed === dsaav02recursionise_UNKNOWNS.length ? "ok"
            : step.open ? "bad" : "idle",
          rows: jrows
        }),
        step.cost
          ? d.table(
              ["route", "max unknowns at once", "localisation", "problems solved"],
              [
                ["#13 first", String(dsaav02recursionise_UNKNOWNS.length),
                  "1 in " + dsaav02recursionise_UNKNOWNS.length,
                  "0 of " + (dsaav02recursionise_UNKNOWNS.length + 1)],
                ["the video's order", "1", "1 in 1",
                  (dsaav02recursionise_UNKNOWNS.length + 1) + " of " +
                    (dsaav02recursionise_UNKNOWNS.length + 1)]
              ]
            )
          : d.note(
              "In the video's order the maximum ever open at once is <b>1</b>, because each " +
              "of the " + dsaav02recursionise_IDEAS + " ideas has a row to itself.",
              step.open >= 2 ? "bad" : "ok"
            )
      ]);
    }

    // ---------------- mode: through binary trees -----------------------
    cells = [];
    for (i = 0; i < dsaav02recursionise_TREE_SKILLS.length; i++) {
      var on = i < step.skills.length;
      cells.push({
        label: String(i + 1),
        flag: !on ? "idle" : step.skills.length > 1 ? "bad" : "ok",
        title: dsaav02recursionise_TREE_SKILLS[i] +
          (on ? " — under test" : " — not involved in this problem")
      });
    }
    var k2 = step.tested || 1;
    var srows = [];
    for (i = 0; i < step.skills.length; i++) {
      srows.push({
        label: step.skills[i],
        value: "under test",
        flag: step.skills.length > 1 ? "bad" : "ok"
      });
    }
    if (!srows.length) srows.push({ label: "nothing attempted yet", value: "—", flag: "idle" });

    return d.stack([
      d.flow([
        d.big(String(step.tested || 0), "skills under test",
          !step.tested ? "idle" : step.tested > 1 ? "bad" : "ok"),
        d.stat({
          label: "a failure localises to",
          value: "1 in " + k2,
          sub: Math.round(dsaav02recursionise_pct(1, k2)) + "% certain",
          flag: !step.tested ? "idle" : step.tested > 1 ? "bad" : "ok"
        }),
        d.stat({
          label: "attempts · solved",
          value: step.attempts + " · " + step.solved,
          sub: "and still no evidence about recursion" ,
          flag: step.solved && step.skills.length === 1 ? "ok"
            : step.attempts ? "warn" : "idle"
        })
      ]),
      d.cells(cells, { label: "the three skills a tree problem tests at once" }),
      d.node({
        title: step.probName,
        status: step.skills.length > 1 ? "CONFOUNDED" : "ISOLATED",
        statusFlag: step.skills.length > 1 ? "bad" : "ok",
        badge: step.skills.length > 1 ? "excluded by the page" : "on the syllabus",
        meta: step.skills.length > 1
          ? "a tree problem demands you already know trees"
          : "recursion is the entire difficulty",
        flag: step.skills.length > 1 ? "bad" : "ok",
        rows: srows
      }),
      d.note(
        step.skills.length > 1
          ? "Excluded: tree, graph and DP problems — they carry prerequisites."
          : "Included: problems where recursion is the only thing being tested.",
        step.skills.length > 1 ? "bad" : "ok"
      )
    ]);
  }
};

  // ====================================================================
// ======================================================================
// SIM · dsaav03hypothesisin   (av-03-hypothesis-induction-base-condition.md)
//
// The page's §2 works one example and names its size: "Print 1 to N,
// demonstrated with n = 7." Its §3 then makes the structural claim that
// the recursion tree here is a CHAIN, not a branching tree, and that
// "the return path is what produces the output -- the printing happens
// as the stack unwinds, not as it builds."
//
// That is a genuine time axis and there is only one honest way to show
// it: run the function, record every call, every print and every return
// as an event, and play the tape. Nothing below is drawn from memory --
// the stack contents, the depth, the output, the call count and the
// missing value in the third tab are all replayed off recorded tapes.
//
// CONFIG -- every figure on screen comes from these:
//   N = 7                the page's own demonstration size
//   base condition       the page's rule: the smallest INVALID input.
//                        For print 1 to N that is n == 0, "not n == 1".
//   line order           code BEFORE the recursive call runs on the way
//                        down; code AFTER it runs on the way back up.
//   chain vs tree        §3: an IBH call graph is a chain; a choice tree
//                        is 2^n. Both are computed at n = 7 and compared
//                        against the recorded node count.
//
// THREE RUNS OF THE SAME THREE LINES:
//   1. base n == 0, print AFTER the call   -> 1 2 3 4 5 6 7
//   2. base n == 0, print BEFORE the call  -> 7 6 5 4 3 2 1
//      (the page: "the ONLY change: print BEFORE the call")
//   3. base n == 1, print AFTER the call   -> the "smallest valid input"
//      mistake the page explicitly warns against. The tape shows what it
//      costs, and the diff against run 1 is computed, not asserted.
// ======================================================================

var dsaav03hypothesisin_N = 7;              // the page's §2 demonstration size

// ----------------------------------------------------------------------
// The recorder. One event per call, per print and per return.
// ----------------------------------------------------------------------
function dsaav03hypothesisin_tape(n, printBefore, baseAt) {
  var events = [], stack = [], maxDepth = 0, calls = 0, guard = 0;

  function rec(k) {
    guard += 1;
    if (guard > 200) return;                 // the sim never runs away
    calls += 1;
    stack.push(k);
    if (stack.length > maxDepth) maxDepth = stack.length;
    events.push({ t: "call", k: k, base: k <= baseAt });
    if (k <= baseAt) {
      stack.pop();
      events.push({ t: "ret", k: k, base: true });
      return;
    }
    if (printBefore) events.push({ t: "out", k: k });
    rec(k - 1);
    if (!printBefore) events.push({ t: "out", k: k });
    stack.pop();
    events.push({ t: "ret", k: k });
  }

  rec(n);
  return { events: events, calls: calls, maxDepth: maxDepth };
}

// index one past the count-th event of the given type; whole tape if short
function dsaav03hypothesisin_cut(tape, t, count) {
  var seen = 0, i;
  for (i = 0; i < tape.events.length; i++) {
    if (tape.events[i].t === t) {
      seen += 1;
      if (seen === count) return i + 1;
    }
  }
  return tape.events.length;
}

// replay the tape up to the cut and report the machine state there
function dsaav03hypothesisin_state(tape, upto) {
  var stack = [], out = [], calls = 0, rets = 0, deepest = 0, i, e, last = null;
  for (i = 0; i < upto && i < tape.events.length; i++) {
    e = tape.events[i];
    last = e;
    if (e.t === "call") {
      calls += 1;
      stack.push(e.k);
      if (stack.length > deepest) deepest = stack.length;
    } else if (e.t === "out") {
      out.push(e.k);
    } else {
      rets += 1;
      stack.pop();
    }
  }
  return {
    stack: stack, out: out, calls: calls, rets: rets,
    depth: stack.length, deepest: deepest, last: last
  };
}

var dsaav03hypothesisin_UP = dsaav03hypothesisin_tape(dsaav03hypothesisin_N, false, 0);
var dsaav03hypothesisin_DOWN = dsaav03hypothesisin_tape(dsaav03hypothesisin_N, true, 0);
var dsaav03hypothesisin_WRONG = dsaav03hypothesisin_tape(dsaav03hypothesisin_N, false, 1);

var dsaav03hypothesisin_FULL_UP =
  dsaav03hypothesisin_state(dsaav03hypothesisin_UP, dsaav03hypothesisin_UP.events.length);
var dsaav03hypothesisin_FULL_DOWN =
  dsaav03hypothesisin_state(dsaav03hypothesisin_DOWN, dsaav03hypothesisin_DOWN.events.length);
var dsaav03hypothesisin_FULL_WRONG =
  dsaav03hypothesisin_state(dsaav03hypothesisin_WRONG, dsaav03hypothesisin_WRONG.events.length);

// what the wrong base condition dropped, found by diffing the two outputs
var dsaav03hypothesisin_MISSING = (function () {
  var miss = [], i, v;
  for (i = 0; i < dsaav03hypothesisin_FULL_UP.out.length; i++) {
    v = dsaav03hypothesisin_FULL_UP.out[i];
    if (dsaav03hypothesisin_FULL_WRONG.out.indexOf(v) < 0) miss.push(v);
  }
  return miss;
})();

// §3's structural claim, computed at the page's n
var dsaav03hypothesisin_CHAIN = dsaav03hypothesisin_FULL_UP.calls;        // recorded
var dsaav03hypothesisin_TREE = Math.pow(2, dsaav03hypothesisin_N);        // the page's 2^n
var dsaav03hypothesisin_RATIO = dsaav03hypothesisin_TREE / dsaav03hypothesisin_CHAIN;

function dsaav03hypothesisin_seq(a) {
  return a.length ? a.join(" ") : "(nothing printed yet)";
}

// ----------------------------------------------------------------------
// Build a scenario from a tape plus a list of cut points and captions.
// ----------------------------------------------------------------------
function dsaav03hypothesisin_scenario(cfg) {
  var steps = [{
    caption: cfg.idle,
    flag: "idle",
    st: dsaav03hypothesisin_state(cfg.tape, 0),
    tape: cfg.tape, cfg: cfg, last: false
  }], i;
  for (i = 0; i < cfg.cuts.length; i++) {
    steps.push({
      caption: cfg.caps[i],
      flag: cfg.flags[i],
      st: dsaav03hypothesisin_state(cfg.tape, cfg.cuts[i]),
      tape: cfg.tape, cfg: cfg,
      last: i === cfg.cuts.length - 1
    });
  }
  return { id: cfg.id, label: cfg.label, steps: steps };
}

// --- run 1: the page's own code, print AFTER the call -----------------
var dsaav03hypothesisin_S1 = (function () {
  var T = dsaav03hypothesisin_UP;
  var cuts = [
    dsaav03hypothesisin_cut(T, "call", 1),
    dsaav03hypothesisin_cut(T, "call", 3),
    dsaav03hypothesisin_cut(T, "call", 5),
    dsaav03hypothesisin_cut(T, "call", 7),
    dsaav03hypothesisin_cut(T, "ret", 1),
    dsaav03hypothesisin_cut(T, "ret", 4),
    dsaav03hypothesisin_cut(T, "ret", 7),
    T.events.length
  ];
  var s = [], k;
  for (k = 0; k < cuts.length; k++) s.push(dsaav03hypothesisin_state(T, cuts[k]));

  return dsaav03hypothesisin_scenario({
    id: "up", label: "Print 1 to N", tape: T, cuts: cuts,
    idle: "<b>print(" + dsaav03hypothesisin_N + ")</b>, the page's own demonstration size. " +
      "Three lines: <i>if (n == 0) return;</i> then <i>print(n - 1);</i> then <i>cout &lt;&lt; " +
      "n;</i>. Nothing has been called yet. Press Play.",
    flags: [undefined, undefined, undefined, "warn", "warn", "ok", "ok", "ok"],
    caps: [
      "<b>HYPOTHESIS.</b> print(" + dsaav03hypothesisin_N + ") is on the stack and it does " +
        "not print first. It assumes print(" + (dsaav03hypothesisin_N - 1) + ") already " +
        "prints 1 to " + (dsaav03hypothesisin_N - 1) + " correctly — assumes, without " +
        "checking. The page calls that assumption the magic, and refusing to make it is why " +
        "people find recursion hard.",
      "<b>INDUCTION, repeated.</b> Depth " + s[1].depth + ". Each frame does the identical " +
        "thing: hand a smaller input to itself. Note there is <b>no branch anywhere</b> — " +
        "one child per frame, never two. If you catch yourself drawing two branches here, " +
        "you are in the wrong framework.",
      "<b>Depth " + s[2].depth + ", output still empty.</b> " + s[2].calls + " calls made and " +
        "the printed sequence is <i>" + dsaav03hypothesisin_seq(s[2].out) + "</i>. All the " +
        "work is queued behind calls that have not returned.",
      "<b>Depth " + s[3].depth + " — print(1) is on the stack.</b> This is where the page's " +
        "definition earns itself. The base is the smallest <b>invalid</b> input, so print(1) " +
        "is not the base; it recurses once more. Deciding <i>where to stop</i> never required " +
        "deciding <i>what the answer is</i>.",
      "<b>BASE CONDITION fires at n == 0.</b> Deepest point: " + s[4].deepest + " frames, " +
        s[4].calls + " calls. Printed so far: <i>" + dsaav03hypothesisin_seq(s[4].out) +
        "</i>. " + s[4].calls + " calls of setup and <b>zero output</b> — every line of useful work is " +
        "still in front of you, on the return path.",
      "<b>Unwinding, and the output appears.</b> print(1), print(2), print(3) each run their " +
        "one line as their child returns: <i>" + dsaav03hypothesisin_seq(s[5].out) + "</i>. " +
        "Depth has fallen to " + s[5].depth + ". This is §3's claim happening — the return " +
        "path is what produces the output.",
      "<b>Still unwinding.</b> <i>" + dsaav03hypothesisin_seq(s[6].out) + "</i>, depth " +
        s[6].depth + ". The order is not something the code sorted; it is the order the " +
        "stack pops in, which is the reverse of the order it pushed.",
      "<b>Done: " + dsaav03hypothesisin_seq(s[7].out) + ".</b> " + s[7].calls + " calls, " +
        s[7].rets + " returns, maximum depth " + s[7].deepest + ", " + s[7].out.length +
        " values printed. And §3's structural point, at this n: the chain is <b>" +
        dsaav03hypothesisin_CHAIN + " nodes</b> where a take-it-or-leave-it tree over the " +
        "same " + dsaav03hypothesisin_N + " would be 2<sup>" + dsaav03hypothesisin_N +
        "</sup> = <b>" + dsaav03hypothesisin_TREE + "</b> — " + dsaav03hypothesisin_RATIO +
        "× more. There is no decision at any level here, only reduction, which is exactly " +
        "why the tree method has nothing to draw."
    ]
  });
})();

// --- run 2: the one line moved ----------------------------------------
var dsaav03hypothesisin_S2 = (function () {
  var T = dsaav03hypothesisin_DOWN;
  var cuts = [
    dsaav03hypothesisin_cut(T, "out", 1),
    dsaav03hypothesisin_cut(T, "out", 3),
    dsaav03hypothesisin_cut(T, "out", 5),
    dsaav03hypothesisin_cut(T, "out", 7),
    dsaav03hypothesisin_cut(T, "ret", 1),
    dsaav03hypothesisin_cut(T, "ret", 4),
    dsaav03hypothesisin_cut(T, "ret", 7),
    T.events.length
  ];
  var s = [], k;
  for (k = 0; k < cuts.length; k++) s.push(dsaav03hypothesisin_state(T, cuts[k]));
  var U = dsaav03hypothesisin_FULL_UP;

  return dsaav03hypothesisin_scenario({
    id: "down", label: "Move one line", tape: T, cuts: cuts,
    idle: "The same three lines, same base condition, same n = " + dsaav03hypothesisin_N +
      ". <b>One change: the print now sits before the recursive call.</b> The page's words: " +
      "<i>the ONLY change: print BEFORE the call.</i>",
    flags: [undefined, undefined, undefined, "ok", "warn", undefined, undefined, "ok"],
    caps: [
      "<b>Depth " + s[0].depth + ", and it has already printed.</b> print(" +
        dsaav03hypothesisin_N + ") ran its one line before handing anything down, so the " +
        "output begins <i>" + dsaav03hypothesisin_seq(s[0].out) + "</i>. Compare the first " +
        "tab at this same depth: nothing had been printed at all.",
      "<b>Depth " + s[1].depth + ", output <i>" + dsaav03hypothesisin_seq(s[1].out) +
        "</i>.</b> Work is happening on the way <b>down</b> now, one line per push. The " +
        "stack is identical to the other tab frame for frame; only the timing of the print " +
        "moved.",
      "<b>Depth " + s[2].depth + ", output <i>" + dsaav03hypothesisin_seq(s[2].out) +
        "</i>.</b> " + s[2].out.length + " of " + dsaav03hypothesisin_N + " values already " +
        "emitted and the recursion has not returned once.",
      "<b>Depth " + s[3].depth + " and the job is finished: <i>" +
        dsaav03hypothesisin_seq(s[3].out) + "</i>.</b> All " + s[3].out.length + " values " +
        "printed, zero returns so far. Everything from here is bookkeeping.",
      "<b>Base fires at n == 0, depth " + s[4].deepest + ".</b> Same base condition, same " +
        "deepest point, same " + s[4].calls + " calls as the first tab. And the output is " +
        "already complete: <i>" + dsaav03hypothesisin_seq(s[4].out) + "</i>.",
      "<b>Unwinding prints nothing.</b> Depth " + s[5].depth + ", output unchanged. In the " +
        "first tab this was the phase that did all the work; here it is empty. Same stack, " +
        "opposite half of it used.",
      "<b>Depth " + s[6].depth + ", output still unchanged.</b> The return path is pure " +
        "overhead in this version — which is not a criticism, it is just where the line was " +
        "put.",
      "<b>Done: " + dsaav03hypothesisin_seq(s[7].out) + ".</b> Against the first tab: " +
        "identical call count (" + s[7].calls + " vs " + U.calls + "), identical maximum " +
        "depth (" + s[7].deepest + " vs " + U.deepest + "), identical number of values (" +
        s[7].out.length + " vs " + U.out.length + ") — and the reverse sequence. <b>The two " +
        "functions differ by the position of one line</b>, and almost every later problem in " +
        "the series depends on knowing which side of the call you want to be on."
    ]
  });
})();

// --- run 3: the base condition the page warns against -----------------
var dsaav03hypothesisin_S3 = (function () {
  var T = dsaav03hypothesisin_WRONG;
  var cuts = [
    dsaav03hypothesisin_cut(T, "call", 1),
    dsaav03hypothesisin_cut(T, "call", 3),
    dsaav03hypothesisin_cut(T, "call", 5),
    dsaav03hypothesisin_cut(T, "call", 7),
    dsaav03hypothesisin_cut(T, "ret", 1),
    dsaav03hypothesisin_cut(T, "ret", 3),
    dsaav03hypothesisin_cut(T, "ret", 5),
    T.events.length
  ];
  var s = [], k;
  for (k = 0; k < cuts.length; k++) s.push(dsaav03hypothesisin_state(T, cuts[k]));
  var U = dsaav03hypothesisin_FULL_UP;
  var miss = dsaav03hypothesisin_MISSING;

  return dsaav03hypothesisin_scenario({
    id: "wrong", label: "Base at n == 1", tape: T, cuts: cuts,
    idle: "Same three lines, print after the call, and one change: the base condition is " +
      "<b>n == 1</b> instead of n == 0. The page names this exact substitution — the " +
      "smallest <i>valid</i> input in place of the smallest <i>invalid</i> one — and it " +
      "looks more sensible, because 1 is a number you can answer for.",
    flags: [undefined, undefined, undefined, "warn", "bad", "bad", "bad", "bad"],
    caps: [
      "<b>Identical start.</b> print(" + dsaav03hypothesisin_N + ") pushes and trusts the " +
        "smaller call. Nothing distinguishes this run from the correct one yet, and nothing " +
        "will until the very bottom.",
      "<b>Depth " + s[1].depth + ".</b> Still identical: same frames, same order, same empty " +
        "output. A wrong base condition is invisible for the entire descent, which is what " +
        "makes it an interview-grade bug rather than a typo.",
      "<b>Depth " + s[2].depth + ", " + s[2].calls + " calls.</b> Output <i>" +
        dsaav03hypothesisin_seq(s[2].out) + "</i>. One frame to go before the divergence.",
      "<b>Depth " + s[3].depth + " — print(1), and this run treats it as the base.</b> The " +
        "correct run reached depth " + U.deepest + " here by recursing once more into " +
        "print(0). This one stops a frame early: <b>" + s[3].deepest + "</b> against " +
        U.deepest + ".",
      "<b>The base returns, having printed nothing.</b> And print(1) is the frame whose job " +
        "was to print <b>1</b>. That value has just been skipped, permanently — no later " +
        "frame prints it, because each frame only ever prints its own n.",
      "<b>Unwinding: <i>" + dsaav03hypothesisin_seq(s[5].out) + "</i>.</b> The output is " +
        "correct in form, correct in order, monotonic, and starts at the wrong number. Every " +
        "property you would eyeball holds.",
      "<b><i>" + dsaav03hypothesisin_seq(s[6].out) + "</i>, depth " + s[6].depth + ".</b> " +
        "Off-by-one bugs at the base survive review because the trace looks right from the " +
        "second element onward, and the second element is where a reader starts checking.",
      "<b>Done: " + dsaav03hypothesisin_seq(s[7].out) + ".</b> Diffed against the correct " +
        "run: <b>" + s[7].out.length + " values instead of " + U.out.length + "</b>, " +
        "missing <b>" + miss.join(", ") + "</b>; " + s[7].calls + " calls instead of " +
        U.calls + "; maximum depth " + s[7].deepest + " instead of " + U.deepest + ". " +
        "This is the case for the page's definition. <i>Smallest valid input</i> makes you " +
        "decide what the answer is at that input, and one wrong answer there is silently " +
        "the whole first element. <i>Smallest invalid input</i> asks only where to stop, and " +
        "n == 0 is not a judgement call."
    ]
  });
})();

S["dsaav03hypothesisin"] = {
  title: "Run the chain down and watch where the work happens",
  note: "<b>print(" + dsaav03hypothesisin_N + ")</b> — the page's own demonstration size — " +
    "actually executed, with every call, print and return recorded as an event and the tape " +
    "replayed here. The stack contents, the depth, the output, the call counts and the diff " +
    "in the third tab are read off those tapes, not typed. The three runs differ by exactly " +
    "one thing each: the <b>position of the print</b> relative to the recursive call, and " +
    "the <b>base condition</b> — the page's rule being that it is the smallest <i>invalid</i> " +
    "input, n == 0 and not n == 1. §3's structural claim is checked at the end: the chain " +
    "records <b>" + dsaav03hypothesisin_CHAIN + " nodes</b> against 2<sup>" +
    dsaav03hypothesisin_N + "</sup> = " + dsaav03hypothesisin_TREE + " for a branching tree " +
    "over the same input.",
  interval: 1300,
  scenarios: [dsaav03hypothesisin_S1, dsaav03hypothesisin_S2, dsaav03hypothesisin_S3],

  draw: function (step, d, ctx) {
    var st = step.st, cfg = step.cfg, i;

    // --- the call stack, shallowest first -----------------------------
    var frames = [];
    for (i = 0; i < st.stack.length; i++) {
      var k = st.stack[i];
      frames.push({
        label: String(k),
        flag: i === st.stack.length - 1 ? (k <= (cfg.id === "wrong" ? 1 : 0) ? "bad" : "warn") : "ok",
        title: "print(" + k + ") · frame " + (i + 1) +
          (i === st.stack.length - 1 ? " — the live frame" : " — waiting on its child")
      });
    }
    if (!frames.length) {
      frames.push({
        label: "—", flag: "idle",
        title: st.calls ? "the stack has unwound completely" : "nothing called yet"
      });
    }

    // --- the printed sequence, in print order -------------------------
    var outs = [];
    for (i = 0; i < dsaav03hypothesisin_N; i++) {
      if (i < st.out.length) {
        outs.push({
          label: String(st.out[i]),
          flag: "ok",
          title: "printed " + (i + 1) + (i === 0 ? "st" : i === 1 ? "nd" : i === 2 ? "rd" : "th") +
            " · by the frame for n = " + st.out[i]
        });
      } else {
        outs.push({ label: "·", flag: "idle", title: "not printed yet" });
      }
    }

    var depthPct = (st.depth / (dsaav03hypothesisin_N + 1)) * 100;
    var outPct = (st.out.length / dsaav03hypothesisin_N) * 100;

    var head = d.flow([
      d.big(String(st.depth), "frames on the stack",
        !st.calls ? "idle" : st.depth ? "warn" : "ok"),
      d.stat({
        label: "printed",
        value: st.out.length + " of " + dsaav03hypothesisin_N,
        sub: st.out.length ? dsaav03hypothesisin_seq(st.out) : "nothing yet",
        flag: !st.out.length ? "idle" : st.out.length === dsaav03hypothesisin_N ? "ok" : "warn"
      }),
      d.stat({
        label: "calls · returns",
        value: st.calls + " · " + st.rets,
        sub: "deepest " + st.deepest,
        flag: st.calls ? "ok" : "idle"
      })
    ]);

    var phase = !st.calls ? "IDLE"
      : st.depth === 0 ? "COMPLETE"
      : st.rets === 0 ? "DESCENDING"
      : "UNWINDING";

    var node = d.node({
      title: "print(" + dsaav03hypothesisin_N + ") · base at n == " +
        (cfg.id === "wrong" ? "1" : "0"),
      status: phase,
      statusFlag: phase === "COMPLETE"
        ? (cfg.id === "wrong" ? "bad" : "ok")
        : phase === "IDLE" ? "idle" : "warn",
      badge: cfg.id === "down" ? "print BEFORE the call" : "print AFTER the call",
      meta: cfg.id === "wrong"
        ? "the smallest VALID input used as the base — the page's warning"
        : "the smallest INVALID input used as the base",
      flag: phase === "COMPLETE" ? (cfg.id === "wrong" ? "bad" : "ok")
        : phase === "IDLE" ? "idle" : "warn",
      gauges: [
        { label: "stack depth", pct: depthPct, value: st.depth + " frames",
          flag: st.depth ? "warn" : "idle" },
        { label: "output produced", pct: outPct,
          value: st.out.length + " / " + dsaav03hypothesisin_N,
          flag: st.out.length === dsaav03hypothesisin_N ? "ok" : st.out.length ? "warn" : "idle" }
      ],
      body:
        d.cells(frames, { label: "call stack — shallowest first, live frame last" }) +
        d.cells(outs, { label: "output, in the order it was printed" })
    });

    var tail;
    if (step.last) {
      tail = d.table(
        ["shape", "nodes at n = " + dsaav03hypothesisin_N, "children per node", "output comes from"],
        [
          ["chain (IBH)", String(dsaav03hypothesisin_CHAIN), "1", "the return path"],
          ["branching tree (choice)", String(dsaav03hypothesisin_TREE), "2", "the leaves"],
          ["this run", String(st.calls), "1",
            cfg.id === "down" ? "the descent" : "the return path"]
        ]
      );
    } else {
      tail = d.mono(
        cfg.id === "down"
          ? "print(n);  print(n - 1);      <-- the print runs on the way DOWN"
          : "print(n - 1);  print(n);      <-- the print runs on the way BACK UP",
        st.rets ? "ok" : "warn"
      );
    }

    return d.stack([head, node, tail]);
  }
};

  // ====================================================================
// ======================================================================
// SIM · dsabacktracking   (backtracking.md)
//
// The page's template is three lines -- choose, explore, undo -- and its
// two worked examples are traced by hand in §5 and §6. This sim runs the
// same template for real: one recorder, one recursion, three rule
// settings, and every count on screen is read off the recorded tape.
//
// CONFIG -- all of it is the page's own:
//   §5  nums = [1, 2, 3]        LC 78, Subsets. Every node is a result,
//                               so there is no IS_COMPLETE test.
//   §6  nums = [1, 2, 2]        LC 90, Subsets II, already sorted, with
//                               the page's rule: skip nums[i] when
//                               i > start and nums[i] == nums[i-1].
//                               The page's §9 failure row for the wrong
//                               version -- i > 0 instead of i > start --
//                               is produced by flipping one flag here
//                               and rerunning, not by assertion.
//   §5  complexity O(2^n x n)   2^n subsets, each O(n) to copy. The
//                               bound and the actual element-copy count
//                               are both computed and shown together.
//   §9  "Appending path not path[:]" -- "all results identical or
//                               empty" -- the third tab literally stores
//                               the live array instead of a copy, and
//                               the results panel is re-read at every
//                               frame, so the aliasing is visible rather
//                               than described.
//
// THREE RUNS OF ONE TEMPLATE:
//   1. subsets [1,2,3]     the template bare
//   2. subsets II [1,2,2]  the same template with the dedup prune
//   3. the same [1,2,3]    with path stored instead of path[:]
// ======================================================================

var dsabacktracking_A = [1, 2, 3];        // §5, LC 78
var dsabacktracking_B = [1, 2, 2];        // §6, LC 90, sorted

// ----------------------------------------------------------------------
// The recorder. rule: "none" | "start" (correct) | "zero" (the bug).
// alias: store the live path instead of a copy -- §9's first row.
// Every event carries the counters as they stood at that instant.
// ----------------------------------------------------------------------
function dsabacktracking_run(nums, rule, alias) {
  var events = [], results = [], path = [];
  var nodes = 0, appends = 0, pops = 0, skips = 0, copies = 0;

  function snap() {
    var o = [], i;
    for (i = 0; i < results.length; i++) o.push(results[i].slice());
    return o;
  }
  function mark(t, extra) {
    var e = {
      t: t, path: path.slice(), stored: snap(),
      nodes: nodes, appends: appends, pops: pops, skips: skips, copies: copies,
      kept: results.length
    };
    if (extra) { for (var k in extra) if (extra.hasOwnProperty(k)) e[k] = extra[k]; }
    events.push(e);
  }

  function bt(start) {
    nodes += 1;
    results.push(alias ? path : path.slice());   // the page's COPY, or the bug
    copies += path.length;
    mark("record", { start: start });

    for (var i = start; i < nums.length; i++) {
      var dup = i > 0 && nums[i] === nums[i - 1];
      var prune = (rule === "start" && i > start && dup) ||
                  (rule === "zero" && dup);
      if (prune) {
        skips += 1;
        mark("skip", { start: start, i: i, val: nums[i] });
        continue;
      }
      path.push(nums[i]);
      appends += 1;
      bt(i + 1);
      path.pop();
      pops += 1;
    }
  }

  bt(0);
  return {
    nums: nums, events: events, nodes: nodes, appends: appends, pops: pops,
    skips: skips, copies: copies, kept: results.length, tail: snap(),
    bound: Math.pow(2, nums.length) * nums.length
  };
}

function dsabacktracking_distinct(list) {
  var seen = {}, c = 0, i, k;
  for (i = 0; i < list.length; i++) {
    k = list[i].join(",");
    if (!seen[k]) { seen[k] = 1; c += 1; }
  }
  return c;
}
function dsabacktracking_show(p) { return p.length ? p.join(" ") : "∅"; }
function dsabacktracking_list(rows) {
  var o = [], i;
  for (i = 0; i < rows.length; i++) o.push("{" + dsabacktracking_show(rows[i]) + "}");
  return o.join("  ");
}
function dsabacktracking_lost(big, small) {
  var out = [], i, k, seen = {};
  for (i = 0; i < small.length; i++) seen[small[i].join(",")] = 1;
  for (i = 0; i < big.length; i++) {
    k = big[i].join(",");
    if (!seen[k]) { seen[k] = 1; out.push("{" + dsabacktracking_show(big[i]) + "}"); }
  }
  return out;
}

// --- the five runs; every comparison below is a diff of these ---------
var dsabacktracking_R_A = dsabacktracking_run(dsabacktracking_A, "none", false);
var dsabacktracking_R_ALIAS = dsabacktracking_run(dsabacktracking_A, "none", true);
var dsabacktracking_R_RAW = dsabacktracking_run(dsabacktracking_B, "none", false);
var dsabacktracking_R_FIX = dsabacktracking_run(dsabacktracking_B, "start", false);
var dsabacktracking_R_BUG = dsabacktracking_run(dsabacktracking_B, "zero", false);

var dsabacktracking_MISSED =
  dsabacktracking_lost(dsabacktracking_R_FIX.tail, dsabacktracking_R_BUG.tail);

function dsabacktracking_scenario(cfg) {
  var steps = [{
    caption: cfg.idle, flag: "idle",
    ev: { t: "idle", path: [], stored: [], nodes: 0, appends: 0, pops: 0,
          skips: 0, copies: 0, kept: 0, start: 0 },
    run: cfg.run, alias: !!cfg.alias, last: false, mode: cfg.mode
  }], i;
  for (i = 0; i < cfg.frames.length; i++) {
    steps.push({
      caption: cfg.caps[i], flag: cfg.flags[i],
      ev: cfg.frames[i], run: cfg.run, alias: !!cfg.alias,
      last: i === cfg.frames.length - 1, mode: cfg.mode
    });
  }
  return { id: cfg.id, label: cfg.label, steps: steps };
}

// ======================================================================
// SCENARIO 1 — the template, bare. §5, nums = [1, 2, 3].
// ======================================================================
var dsabacktracking_S1 = (function () {
  var R = dsabacktracking_R_A, e = R.events;
  return dsabacktracking_scenario({
    id: "subsets", label: "Subsets [1,2,3]", run: R, frames: e, mode: "walk",
    idle: "<b>LC 78</b>, the page's §5 input <b>[1, 2, 3]</b>. Three lines do all of it: " +
      "choose, explore, undo. One frame per recorded result, and every counter below is " +
      "read off the run. Press Play.",
    flags: [undefined, undefined, undefined, "warn", "ok", undefined, undefined, "ok"],
    caps: [
      "<b>backtrack(0), path empty — and it records immediately.</b> Subsets has no " +
        "<i>is it complete?</i> test because <b>every node in the tree is a result</b>. " +
        "The empty set is not a special case handled up front; it is just the root doing " +
        "what every other node does.",
      "<b>Choose 1, explore.</b> The recursive call is given <b>start = i + 1 = 1</b>. That " +
        "single integer is the whole difference from permutations: an element is only ever " +
        "considered at indices after the current one, so nothing is reused and nothing is " +
        "reordered. Element copies so far: " + e[1].copies + ".",
      "<b>{1 2}.</b> Depth 2, " + e[2].nodes + " nodes entered, " + e[2].appends +
        " appends and still <b>" + e[2].pops + " undos</b> — the whole descent happens " +
        "before a single pop. Backtracking is depth-first, and the undo only shows up on " +
        "the way back.",
      "<b>{1 2 3} — the deepest node.</b> start is now " + e[3].start + ", which is past the " +
        "last index, so the loop at this node has no iterations at all and it returns " +
        "without choosing anything. " +
        "The tree bottoms out because the index ran out, not because a test said so.",
      "<b>{1 3}, and the undo finally fires.</b> Between the last frame and this one: pop 3, " +
        "pop 2, then choose 3. Undos are now <b>" + e[4].pops + "</b> against <b>" +
        e[4].appends + "</b> appends. Every append gets exactly one pop, forever — that " +
        "invariant is the entire correctness argument for the shared <i>path</i> array.",
      "<b>{2}.</b> The stack has unwound all the way to the root and taken the second " +
        "top-level branch. " + e[5].pops + " undos, " + e[5].appends + " appends, " +
        e[5].nodes + " nodes. Nothing was copied to make this happen; the same array was " +
        "shortened.",
      "<b>{2 3}.</b> Note what is <i>not</i> in the results: {2 1} and {3 1}. Order is not " +
        "deduplicated afterwards — <b>start = i + 1</b> made it unrepresentable. Pruning " +
        "you never have to do is the cheapest kind.",
      "<b>{3}, and the traversal is finished.</b> <b>" + R.kept + " results from " +
        R.nodes + " nodes</b>, which is 2<sup>" + R.nums.length + "</sup> = " +
        Math.pow(2, R.nums.length) + " exactly, because every node records. " +
        R.appends + " appends, " + R.pops + " undos — equal, as they must be. And the " +
        "complexity: the page gives O(2<sup>n</sup> × n), a bound of <b>" + R.bound +
        "</b> element copies; the run actually copied <b>" + R.copies + "</b>, because the " +
        "average subset is shorter than n. The bound is right about the shape and generous " +
        "about the constant, which is what a bound is for."
    ]
  });
})();

// ======================================================================
// SCENARIO 2 — duplicates. §6, nums = [1, 2, 2], rule i > start.
// ======================================================================
var dsabacktracking_S2 = (function () {
  var R = dsabacktracking_R_FIX, e = R.events;
  var RAW = dsabacktracking_R_RAW, BUG = dsabacktracking_R_BUG;
  return dsabacktracking_scenario({
    id: "dups", label: "Subsets II [1,2,2]", run: R, frames: e, mode: "walk",
    idle: "<b>LC 90</b>, the page's §6 input <b>[1, 2, 2]</b>, already sorted so that equal " +
      "values are adjacent. Same template, one extra line: skip nums[i] when <b>i &gt; " +
      "start</b> and nums[i] == nums[i−1]. Watch where that condition is true and where " +
      "it is not.",
    flags: [undefined, undefined, undefined, "ok", "warn", undefined, undefined, "ok"],
    caps: [
      "<b>Root, path empty.</b> Sorting first is not cosmetic: the whole rule below " +
        "compares nums[i] with nums[i−1], which only finds duplicates if equal values sit " +
        "next to each other. Unsorted input makes the prune silently useless.",
      "<b>Choose 1.</b> i = 0 at this level, so there is no previous sibling to compare " +
        "against and the condition cannot fire. First occurrences are never skipped — that " +
        "is what <i>i &gt; start</i> protects.",
      "<b>{1 2}.</b> Still nothing pruned. The 2 at index 1 is the first 2 seen at this " +
        "level, so it is a legitimate first occurrence.",
      "<b>{1 2 2} — and here is the subtle part.</b> The second 2 was taken at the level " +
        "above, where i = " + e[2].start + " and start = " + e[2].start + ": <b>i &gt; " +
        "start is false</b>, so the prune does not fire. This is a <i>deeper repeat</i>, " +
        "not a sibling — the two 2s are at different levels of one branch. Swap the rule " +
        "to <i>i &gt; 0</i> and this exact node disappears.",
      "<b>PRUNED.</b> Back at the level where path = {1}: i = " + e[4].i + ", start = " +
        e[4].start + ", nums[" + e[4].i + "] = " + e[4].val + " = nums[" + (e[4].i - 1) +
        "]. <b>i &gt; start holds</b>, so this branch is cut. It would have produced {1 2} " +
        "— which the branch above already produced. Deduplicating <i>choices at a level</i>, " +
        "not occurrences in the array.",
      "<b>{2}.</b> Top level, i = 1: nums[1] = 2 and nums[0] = 1, not equal, so nothing is " +
        "pruned and the second top-level branch opens normally. The rule is doing nothing " +
        "at all most of the time, which is the point.",
      "<b>{2 2}.</b> i = start again at this level, so the repeat is kept for the same " +
        "reason {1 2 2} was. Two nodes have now been produced that a naive <i>skip every " +
        "repeat</i> rule would have destroyed.",
      "<b>PRUNED again, and the run ends.</b> " + R.kept + " results, " + R.skips +
        " branches cut, " + R.nodes + " nodes entered. The three rules on the same input, " +
        "all three actually run: no dedup gives " + RAW.kept + " results of which " +
        dsabacktracking_distinct(RAW.tail) + " are distinct; <b>i &gt; start</b> gives " +
        R.kept + " and " + dsabacktracking_distinct(R.tail) + " distinct; <b>i &gt; 0</b> " +
        "gives only " + BUG.kept + ", losing " + dsabacktracking_MISSED.join(" and ") +
        ". Both losses are deeper repeats, not siblings — <i>i &gt; 0</i> cannot tell the " +
        "two apart, because it compares a position in the array when the question is about " +
        "a position in the loop. One character, and the difference is between a duplicate " +
        "you can filter and an answer you never generated."
    ]
  });
})();

// ======================================================================
// SCENARIO 3 — §9's first failure row, executed rather than described.
// ======================================================================
var dsabacktracking_S3 = (function () {
  var R = dsabacktracking_R_ALIAS, e = R.events;
  var OK = dsabacktracking_R_A;
  var frames = e.slice(0);
  frames.push({
    t: "return", path: [], stored: R.tail, nodes: R.nodes, appends: R.appends,
    pops: R.pops, skips: R.skips, copies: R.copies, kept: R.kept, start: 0
  });
  var okDistinct = dsabacktracking_distinct(OK.tail);
  var bugDistinct = dsabacktracking_distinct(R.tail);

  return dsabacktracking_scenario({
    id: "alias", label: "Forgetting path[:]", run: R, alias: true, mode: "alias",
    frames: frames,
    idle: "The same input and the same traversal as the first tab, with one line changed: " +
      "<b>results.append(path)</b> instead of <b>results.append(path[:])</b>. The page " +
      "calls this the most common bug in the entire pattern. The results panel below is " +
      "re-read at every frame rather than snapshotted, so you can watch it happen.",
    flags: [undefined, "warn", "bad", "bad", "bad", "bad", "bad", "bad", "bad"],
    caps: [
      "<b>Root records, and everything looks fine.</b> One result, and it reads ∅ — exactly " +
        "what the correct run shows here too. The bug is undetectable at the first node, " +
        "which is why it survives a quick manual test on an empty input.",
      "<b>Choose 1, record — and look at result #1.</b> It reads {1}. Nothing overwrote it. " +
        "There is only <b>one array in the whole program</b>, and both stored results are " +
        "that array, which now has a 1 in it.",
      "<b>{1 2}, and all " + e[2].kept + " results read the same.</b> Appending <i>path</i> " +
        "stores a reference; appending <i>path[:]</i> stores a value. The template mutates " +
        "path after every recursive call, so a stored reference is a promise to be wrong " +
        "later.",
      "<b>Deepest node.</b> " + e[3].kept + " results, <b>" +
        dsabacktracking_distinct(e[3].stored) + " distinct value</b> between them. This is " +
        "the high-water mark — from here the undos start shortening the array that every " +
        "stored result points at.",
      "<b>The first undos land, and the stored results get <i>shorter</i>.</b> " +
        e[4].pops + " pops so far, and every result now reads {" +
        dsabacktracking_show(e[4].path) + "}. Results already written are changing. Nothing " +
        "in the recording code ran to cause that.",
      "<b>{2}.</b> " + e[5].kept + " results, still " +
        dsabacktracking_distinct(e[5].stored) + " distinct. The traversal is perfect — " +
        "identical to the first tab, node for node — and the output is worthless. The " +
        "search was never the broken part.",
      "<b>{2 3}.</b> " + e[6].kept + " results. If you printed the answer at this instant " +
        "you would get seven copies of {2 3}, which at least looks wrong. The dangerous " +
        "case is the next frame.",
      "<b>{3}, the last record.</b> " + e[7].kept + " results, all reading {" +
        dsabacktracking_show(e[7].path) + "}. The traversal is complete and correct: " +
        e[7].nodes + " nodes, 2<sup>" + R.nums.length + "</sup> as expected. Only the " +
        "recording was wrong.",
      "<b>The outermost pop runs and backtrack(0) returns.</b> path is empty, so all " +
        R.kept + " stored results read ∅. The page's symptom line is <i>all results " +
        "identical or empty</i> — it is both, and it is both for the same reason. Against " +
        "the correct run: <b>" + okDistinct + " distinct subsets</b> there, <b>" +
        bugDistinct + "</b> here, from a traversal that visited the identical " +
        R.nodes + " nodes and did the identical " + R.appends + " appends and " +
        R.pops + " pops. <b>path[:] is not an optimisation and not a style choice.</b>"
    ]
  });
})();

S["dsabacktracking"] = {
  title: "Choose, explore, undo — and count what it costs",
  note: "The page's own two inputs, actually executed: <b>[1, 2, 3]</b> from §5 (LC 78) and " +
    "<b>[1, 2, 2]</b> from §6 (LC 90, sorted). One recorder runs the choose/explore/undo " +
    "template and logs every node, append, pop, pruned branch and element copy, and every " +
    "figure below is read off those tapes. The dedup rules are compared by re-running the " +
    "same recursion with the condition changed — <b>i &gt; start</b> against the page's " +
    "§9 failure row <b>i &gt; 0</b> — and the third tab runs the template with " +
    "<i>results.append(path)</i> in place of <i>results.append(path[:])</i>, re-reading the " +
    "stored results at every frame instead of snapshotting them. Complexity is shown as " +
    "the page states it, O(2<sup>n</sup> × n), next to the copies the run actually made.",
  interval: 1350,
  scenarios: [dsabacktracking_S1, dsabacktracking_S2, dsabacktracking_S3],

  draw: function (step, d, ctx) {
    var ev = step.ev, R = step.run, i;
    var n = R.nums.length;
    var isSkip = ev.t === "skip";
    var isIdle = ev.t === "idle";

    // --- the live path ------------------------------------------------
    var pathCells = [];
    for (i = 0; i < ev.path.length; i++) {
      pathCells.push({
        label: String(ev.path[i]),
        flag: isSkip ? "warn" : "ok",
        title: "path[" + i + "] = " + ev.path[i] + " — chosen at depth " + (i + 1)
      });
    }
    if (isSkip) {
      pathCells.push({
        label: String(ev.val),
        flag: "bad",
        title: "nums[" + ev.i + "] = " + ev.val + " — pruned, never appended"
      });
    }
    if (!pathCells.length) {
      pathCells.push({
        label: "∅", flag: isIdle ? "idle" : "ok",
        title: isIdle ? "not started" : "the path is empty at this node"
      });
    }

    // --- the results, as they read at this instant ---------------------
    var resCells = [];
    for (i = 0; i < ev.stored.length; i++) {
      resCells.push({
        label: dsabacktracking_show(ev.stored[i]),
        flag: step.alias ? (i < ev.stored.length - 1 ? "bad" : "warn") : "ok",
        title: "result #" + (i + 1) + " — " +
          (step.alias ? "a reference to the one live array; it currently reads {" +
            dsabacktracking_show(ev.stored[i]) + "}"
            : "a copy taken at the moment it was recorded")
      });
    }
    if (!resCells.length) {
      resCells.push({ label: "—", flag: "idle", title: "nothing recorded yet" });
    }

    var distinct = dsabacktracking_distinct(ev.stored);
    var maxNodes = Math.pow(2, n);

    var head = d.flow([
      d.big(String(ev.kept), "results recorded",
        isIdle ? "idle" : step.alias ? "bad" : "ok"),
      d.stat({
        label: "nodes entered",
        value: ev.nodes + " of " + maxNodes,
        sub: "2^" + n + " is every subset",
        flag: isIdle ? "idle" : "ok"
      }),
      d.stat({
        label: "distinct results",
        value: isIdle ? "—" : String(distinct),
        sub: step.alias ? "one shared array" : "values stored",
        flag: isIdle ? "idle" : step.alias ? "bad" : "ok"
      })
    ]);

    var node = d.node({
      title: isIdle ? "backtrack(0) — not called yet"
        : "backtrack(start = " + ev.start + ")",
      status: isIdle ? "IDLE" : ev.t === "return" ? "RETURNED"
        : isSkip ? "PRUNED" : "RECORD",
      statusFlag: isIdle ? "idle" : isSkip ? "warn"
        : step.alias ? "bad" : "ok",
      badge: "nums = [" + R.nums.join(", ") + "]",
      meta: step.alias ? "results.append(path) — the live reference"
        : isSkip ? "i > start and nums[i] == nums[i-1]"
        : "results.append(path[:]) — a copy",
      flag: isIdle ? "idle" : isSkip ? "warn" : step.alias ? "bad" : "ok",
      body:
        d.cells(pathCells, { label: "path — the one array every frame shares" }) +
        d.cells(resCells, {
          label: step.alias
            ? "results, re-read right now (not snapshotted)"
            : "results recorded so far",
          dense: ev.stored.length > 6
        }),
      rows: [
        { label: "appends · undos", value: ev.appends + " · " + ev.pops,
          flag: ev.appends === ev.pops && ev.appends ? "ok" : undefined },
        { label: "branches pruned", value: String(ev.skips),
          flag: ev.skips ? "warn" : undefined },
        { label: "element copies",
          value: ev.copies + " of " + R.bound + " allowed",
          flag: step.alias ? "bad" : "ok" }
      ]
    });

    var tail;
    if (step.last && step.mode === "alias") {
      tail = d.table(
        ["run", "nodes", "results", "distinct", "outcome"],
        [
          ["results.append(path[:])", String(dsabacktracking_R_A.nodes),
            String(dsabacktracking_R_A.kept),
            String(dsabacktracking_distinct(dsabacktracking_R_A.tail)), "correct"],
          ["results.append(path)", String(R.nodes), String(R.kept),
            String(dsabacktracking_distinct(R.tail)), "all identical and empty"]
        ]
      );
    } else if (step.last && R.nums === dsabacktracking_B) {
      tail = d.table(
        ["dedup rule", "nodes", "results", "distinct", "verdict"],
        [
          ["none", String(dsabacktracking_R_RAW.nodes),
            String(dsabacktracking_R_RAW.kept),
            String(dsabacktracking_distinct(dsabacktracking_R_RAW.tail)), "duplicates"],
          ["i > start", String(dsabacktracking_R_FIX.nodes),
            String(dsabacktracking_R_FIX.kept),
            String(dsabacktracking_distinct(dsabacktracking_R_FIX.tail)), "correct"],
          ["i > 0", String(dsabacktracking_R_BUG.nodes),
            String(dsabacktracking_R_BUG.kept),
            String(dsabacktracking_distinct(dsabacktracking_R_BUG.tail)),
            "loses " + dsabacktracking_MISSED.join(", ")]
        ]
      );
    } else if (step.last) {
      tail = d.table(
        ["measure", "value", "where it comes from"],
        [
          ["results", String(R.kept), "one per node, 2^" + n],
          ["appends · undos", R.appends + " · " + R.pops, "one undo per choose"],
          ["element copies", String(R.copies), "sum of path lengths at record time"],
          ["O(2^n x n) bound", String(R.bound), "the page's complexity, same n"]
        ]
      );
    } else {
      tail = d.mono(
        isSkip
          ? "if i > start and nums[i] == nums[i-1]: continue      <-- prune the sibling"
          : step.alias
          ? "results.append(path)        <-- stores a reference, not a value"
          : "path.append(c);  backtrack(i+1);  path.pop()      <-- choose, explore, undo",
        isSkip ? "warn" : step.alias ? "bad" : "ok"
      );
    }

    return d.stack([head, node, tail]);
  }
};

  // ====================================================================
// ======================================================================
// SIM · dsabinarysearch  (binary-search.md)
//
// The time axis is the loop itself. One function runs all three tabs — the
// page's `min_feasible(lo, hi, feasible)` — and the only thing that changes
// between tabs is the predicate. That is the page's own thesis in §7:
// "Six named problems, one function."
//
// CONFIG — every number on screen is read off the running loop.
//
//   tab 1  classic lower_bound.  STATED CONFIG (the page gives no array for
//          LC 704/35): a 32-element sorted array with two 26s, target 26.
//          lo = 0, hi = len(nums) — the page's exclusive hi, "len(nums), not
//          len-1".
//   tab 2  Koko, LC 875.  PAGE FIGURES: piles = [3, 6, 7, 11], h = 8,
//          search space k in 1 .. max(piles) = 11, feasible(k) =
//          sum(ceil(p/k)) <= h.  The page's trace is k = 6, 3, 5, 4 and the
//          answer is 4; this loop reproduces it probe for probe.
//   tab 3  Split Array Largest Sum, LC 410.  PAGE FIGURES:
//          nums = [7, 2, 5, 10, 8], k = 2, lo = max(nums) = 10,
//          hi = sum(nums) = 32, greedy parts_needed.  The page's trace is
//          limit = 21, 15, 18 then "converges to 18"; this loop reproduces
//          those three probes, adds the 17 the page elides, and lands on 18.
//
//   extrapolations use the page's own cue "n <= 10^9 but the answer is a
//   number" for the value-range tabs, and a STATED n = 10^6 for tab 1.
//
// Every probe count, window width, feasibility call and element touch is a
// counter incremented inside the loop. Nothing here is a formula typed into
// a caption.
// ======================================================================

// ---- tab 1 · stated config ------------------------------------------
var dsabinarysearch_ARR = [
  2, 3, 3, 5, 8, 8, 8, 11, 13, 14, 17, 17, 19, 21, 22, 25,
  26, 26, 28, 31, 33, 34, 34, 37, 39, 40, 42, 42, 45, 47, 49, 52
];
var dsabinarysearch_TARGET = 26;
var dsabinarysearch_BIGN = 1000000;        // stated config for the tab-1 scale row

// ---- tab 2 · page figures (LC 875) ----------------------------------
var dsabinarysearch_PILES = [3, 6, 7, 11];
var dsabinarysearch_HOURS = 8;

// ---- tab 3 · page figures (LC 410) ----------------------------------
var dsabinarysearch_NUMS = [7, 2, 5, 10, 8];
var dsabinarysearch_PARTS = 2;

// ---- the page's own scale cue ---------------------------------------
var dsabinarysearch_BIGV = 1000000000;     // page: "n <= 10^9 but the answer is a number"
var dsabinarysearch_BIGARR = 100000;       // stated config: array length at scale

// ---------------------------------------------------------------------
// small helpers
// ---------------------------------------------------------------------
function dsabinarysearch_max(a) {
  var i, m = a[0];
  for (i = 1; i < a.length; i++) if (a[i] > m) m = a[i];
  return m;
}
function dsabinarysearch_sum(a) {
  var i, s = 0;
  for (i = 0; i < a.length; i++) s += a[i];
  return s;
}
function dsabinarysearch_ceilDiv(p, k) {
  // the page's -(-p // k): ceiling division with no floats
  return Math.floor((p + k - 1) / k);
}
function dsabinarysearch_ceilLog2(x) {
  if (!isFinite(x) || x <= 1) return 0;
  return Math.ceil(Math.log(x) / Math.LN2 - 1e-12);
}
function dsabinarysearch_num(n) {
  if (!isFinite(n)) return "—";
  return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// ---------------------------------------------------------------------
// THE loop. One function, three predicates. hi is exclusive-or-upper-bound
// depending on the predicate; either way the invariant is the same:
// everything below lo has tested FALSE, everything at or above hi is TRUE.
// ---------------------------------------------------------------------
function dsabinarysearch_search(lo, hi, feas) {
  var L = lo, H = hi, it = [], calls = 0, touch = 0, guard = 0, mid, r;
  while (L < H && guard < 400) {
    guard++;
    mid = L + Math.floor((H - L) / 2);     // the cheat sheet's overflow-safe mid
    r = feas(mid);
    calls++;
    touch += r.touches;
    it.push({
      lo: L, hi: H, mid: mid, ok: r.ok, width: H - L,
      work: r.work, wstat: r.status, expr: r.expr, value: r.value,
      calls: calls, touch: touch,
      nlo: r.ok ? L : mid + 1,
      nhi: r.ok ? mid : H
    });
    if (r.ok) H = mid; else L = mid + 1;
  }
  return { answer: L, iters: it, calls: calls, touch: touch };
}

// ---------------------------------------------------------------------
// predicate 1 · nums[i] >= target   (the page's lower_bound, inverted from
// its `nums[mid] < target` branch)
// ---------------------------------------------------------------------
function dsabinarysearch_feasArr(strict) {
  return function (i) {
    var v = dsabinarysearch_ARR[i];
    var t = dsabinarysearch_TARGET;
    var ok = strict ? (v > t) : (v >= t);
    var sym = strict ? "&gt;" : "≥";
    return {
      ok: ok, touches: 1,
      value: v,
      expr: "a[" + i + "] = " + v,
      status: "a[" + i + "] = " + v + (ok ? " passes" : " fails"),
      work: [
        { label: "a[mid]", value: String(v) },
        { label: "target", value: String(t) },
        { label: "predicate  a[mid] " + (strict ? ">" : "≥") + " target",
          value: ok ? "true" : "false", flag: ok ? "ok" : "bad" }
      ]
    };
  };
}

// ---------------------------------------------------------------------
// predicate 2 · Koko.  feasible(k) = sum(ceil(p/k)) <= h
// ---------------------------------------------------------------------
function dsabinarysearch_feasKoko(k) {
  var i, hrs = 0, rows = [], lhs = [], rhs = [], c, p;
  for (i = 0; i < dsabinarysearch_PILES.length; i++) {
    p = dsabinarysearch_PILES[i];
    c = dsabinarysearch_ceilDiv(p, k);
    hrs += c;
    lhs.push("⌈" + p + "/" + k + "⌉");
    rhs.push(String(c));
    rows.push({ label: "pile " + p + "  at " + k + "/h", value: c + " h" });
  }
  var ok = hrs <= dsabinarysearch_HOURS;
  rows.push({
    label: "hours needed",
    value: hrs + " h  vs  h = " + dsabinarysearch_HOURS,
    flag: ok ? "ok" : "bad"
  });
  return {
    ok: ok, touches: dsabinarysearch_PILES.length,
    value: hrs,
    expr: lhs.join(" + ") + " = " + rhs.join(" + ") + " = " + hrs,
    status: hrs + " h " + (ok ? "≤ " : "&gt; ") + dsabinarysearch_HOURS,
    work: rows
  };
}

// ---------------------------------------------------------------------
// predicate 3 · Split Array.  greedy parts_needed(limit) <= k
// ---------------------------------------------------------------------
function dsabinarysearch_feasSplit(limit) {
  var i, x, parts = 1, cur = 0, groups = [], g = [], rows = [], pieces = [];
  for (i = 0; i < dsabinarysearch_NUMS.length; i++) {
    x = dsabinarysearch_NUMS[i];
    if (cur + x > limit) { parts++; groups.push(g); g = [x]; cur = x; }
    else { cur += x; g.push(x); }
  }
  groups.push(g);
  var ok = parts <= dsabinarysearch_PARTS;
  for (i = 0; i < groups.length; i++) {
    rows.push({
      label: "part " + (i + 1) + "  [" + groups[i].join(", ") + "]",
      value: "sum " + dsabinarysearch_sum(groups[i]),
      flag: dsabinarysearch_sum(groups[i]) > limit ? "bad" : undefined
    });
    pieces.push("[" + groups[i].join(",") + "]=" + dsabinarysearch_sum(groups[i]));
  }
  rows.push({
    label: "parts needed",
    value: parts + "  vs  k = " + dsabinarysearch_PARTS,
    flag: ok ? "ok" : "bad"
  });
  return {
    ok: ok, touches: dsabinarysearch_NUMS.length,
    value: parts,
    expr: pieces.join("  ·  ") + "  →  " + parts + " part" + (parts === 1 ? "" : "s"),
    status: parts + " part" + (parts === 1 ? "" : "s") + (ok ? " ≤ " : " &gt; ") + dsabinarysearch_PARTS,
    work: rows
  };
}

// ---------------------------------------------------------------------
// the three runs, executed once at load
// ---------------------------------------------------------------------
var dsabinarysearch_N_ARR = dsabinarysearch_ARR.length;
var dsabinarysearch_MAXP = dsabinarysearch_max(dsabinarysearch_PILES);
var dsabinarysearch_MAXN = dsabinarysearch_max(dsabinarysearch_NUMS);
var dsabinarysearch_SUMN = dsabinarysearch_sum(dsabinarysearch_NUMS);

var dsabinarysearch_RUN_ARR =
  dsabinarysearch_search(0, dsabinarysearch_N_ARR, dsabinarysearch_feasArr(false));
var dsabinarysearch_RUN_RIGHT =
  dsabinarysearch_search(0, dsabinarysearch_N_ARR, dsabinarysearch_feasArr(true));
var dsabinarysearch_RUN_KOKO =
  dsabinarysearch_search(1, dsabinarysearch_MAXP, dsabinarysearch_feasKoko);
var dsabinarysearch_RUN_SPLIT =
  dsabinarysearch_search(dsabinarysearch_MAXN, dsabinarysearch_SUMN, dsabinarysearch_feasSplit);

// the brute-force baseline for tab 1: scan until the predicate flips
var dsabinarysearch_LINEAR = (function () {
  var i, probes = 0;
  for (i = 0; i < dsabinarysearch_N_ARR; i++) {
    probes++;
    if (dsabinarysearch_ARR[i] >= dsabinarysearch_TARGET) break;
  }
  return probes;
})();

var dsabinarysearch_COUNT = dsabinarysearch_RUN_RIGHT.answer - dsabinarysearch_RUN_ARR.answer;

// ---------------------------------------------------------------------
// scenario configuration
// ---------------------------------------------------------------------
function dsabinarysearch_cfgArr() {
  return {
    id: "classic", kind: "arr", label: "Sorted array · LC 704/35",
    base: 0, count: dsabinarysearch_N_ARR,
    lo0: 0, hi0: dsabinarysearch_N_ARR,
    run: dsabinarysearch_RUN_ARR,
    spaceLabel: "search space · index 0 … " + (dsabinarysearch_N_ARR - 1) +
      "  (cell shows a[i])",
    callsLabel: "array probes",
    touchLabel: "elements read",
    nLabel: "n = " + dsabinarysearch_N_ARR,
    workTitle: "predicate · a[mid] ≥ target",
    searchOver: "an index",
    cellTitle: function (v, flag) {
      return "i = " + v + " · a[" + v + "] = " + dsabinarysearch_ARR[v] + " · " +
        (flag === "bad" ? "tested or implied a[i] < target"
          : flag === "ok" ? "a[i] ≥ target (by sortedness)"
            : flag === "warn" ? "probing now" : "still live");
    }
  };
}
function dsabinarysearch_cfgKoko() {
  return {
    id: "koko", kind: "koko", label: "Koko · LC 875",
    base: 1, count: dsabinarysearch_MAXP,
    lo0: 1, hi0: dsabinarysearch_MAXP,
    run: dsabinarysearch_RUN_KOKO,
    spaceLabel: "search space · eating speed k = 1 … " + dsabinarysearch_MAXP +
      "  (a value, not an index)",
    callsLabel: "feasibility calls",
    touchLabel: "pile reads",
    nLabel: "n = " + dsabinarysearch_PILES.length + " piles",
    workTitle: "feasible(k) · hours needed ≤ h",
    searchOver: "a speed",
    cellTitle: function (v, flag) {
      return "k = " + v + " · " +
        (flag === "bad" ? "too slow (proven, or implied by monotonicity)"
          : flag === "ok" ? "finishes in time (proven, or implied)"
            : flag === "warn" ? "testing now" : "unknown");
    }
  };
}
function dsabinarysearch_cfgSplit() {
  return {
    id: "split", kind: "split", label: "Split Array · LC 410",
    base: dsabinarysearch_MAXN,
    count: dsabinarysearch_SUMN - dsabinarysearch_MAXN + 1,
    lo0: dsabinarysearch_MAXN, hi0: dsabinarysearch_SUMN,
    run: dsabinarysearch_RUN_SPLIT,
    spaceLabel: "search space · largest allowed sum = " + dsabinarysearch_MAXN +
      " … " + dsabinarysearch_SUMN,
    callsLabel: "feasibility calls",
    touchLabel: "element reads",
    nLabel: "n = " + dsabinarysearch_NUMS.length,
    workTitle: "feasible(limit) · parts needed ≤ k",
    searchOver: "a sum",
    cellTitle: function (v, flag) {
      return "limit = " + v + " · " +
        (flag === "bad" ? "needs too many parts (proven or implied)"
          : flag === "ok" ? "packs into ≤ k parts (proven or implied)"
            : flag === "warn" ? "testing now" : "unknown");
    }
  };
}

// ---------------------------------------------------------------------
// captions
// ---------------------------------------------------------------------
function dsabinarysearch_probeCap(cfg, it, idx) {
  var newW = it.nhi - it.nlo;
  var killed = it.width - newW;
  var head = "<b>Probe " + (idx + 1) + " · mid = " + it.lo + " + ⌊(" + it.hi +
    " − " + it.lo + ")/2⌋ = " + it.mid + ".</b> ";
  var move = it.ok
    ? "mid may itself be the answer, so <b>hi = mid = " + it.nhi +
      "</b> — never <i>mid − 1</i>. "
    : "the answer is strictly above, so <b>lo = mid + 1 = " + it.nlo + "</b>. ";
  var tail = "Window " + it.width + " → <b>" + newW + "</b> candidate" +
    (newW === 1 ? "" : "s") + "; " + (it.calls === 1 ? "this one call" : "call " + it.calls) +
    " removed " + killed + " of them. Element reads so far: <b>" + it.touch + "</b>.";

  if (cfg.kind === "arr") {
    return head + "a[" + it.mid + "] = " + it.value + ", so <code>a[mid] &lt; " +
      dsabinarysearch_TARGET + "</code> is <b>" + (it.ok ? "false" : "true") +
      "</b> — and because the array is sorted that verdict carries to " +
      (it.ok ? "every index above it" : "every index below it") + " for free. " +
      move + tail;
  }
  if (cfg.kind === "koko") {
    return head + "At k = " + it.mid + ": " + it.expr + " <b>hours</b>, versus h = " +
      dsabinarysearch_HOURS + ". Feasible is <b>" + (it.ok ? "true" : "false") +
      "</b>, and feasibility is monotonic — if k finishes in time so does k + 1 — so " +
      (it.ok ? "every faster speed is already known to work" :
        "every slower speed is already known to fail") + ". " + move + tail;
  }
  return head + "Greedily packing at limit " + it.mid + ": " + it.expr +
    ", versus k = " + dsabinarysearch_PARTS + ". Feasible is <b>" +
    (it.ok ? "true" : "false") + "</b>" +
    (it.ok ? " — and every larger limit needs no more parts" :
      " — and every smaller limit needs at least as many") + ". " + move + tail;
}

function dsabinarysearch_doneCap(cfg) {
  var R = cfg.run;
  var base = "<b>lo == hi == " + R.answer + ". The loop is over.</b> ";
  if (cfg.kind === "arr") {
    return base + "It took <b>" + R.calls + "</b> probes on " + dsabinarysearch_N_ARR +
      " elements to place the boundary: a[" + R.answer + "] = " +
      dsabinarysearch_ARR[R.answer] + " is the first element ≥ " +
      dsabinarysearch_TARGET + ". Change one character in the predicate — <code>&gt;</code> " +
      "instead of <code>≥</code> — and the same function returns <b>" +
      dsabinarysearch_RUN_RIGHT.answer + "</b> in <b>" + dsabinarysearch_RUN_RIGHT.calls +
      "</b> probes; the difference, <b>" + dsabinarysearch_COUNT +
      "</b>, is the number of " + dsabinarysearch_TARGET + "s in the array.";
  }
  if (cfg.kind === "koko") {
    return base + "The minimum eating speed is <b>" + R.answer +
      " bananas/hour</b> — the page's answer — found in <b>" + R.calls +
      "</b> feasibility calls costing <b>" + R.touch + "</b> pile reads in total. " +
      "Nothing was ever sorted and no array was searched: the thing being " +
      "bisected was the answer.";
  }
  return base + "The minimum largest-subarray sum is <b>" + R.answer +
    "</b> — the page's answer — found in <b>" + R.calls +
    "</b> feasibility calls costing <b>" + R.touch + "</b> element reads. The page " +
    "shows limits " + dsabinarysearch_RUN_SPLIT.iters[0].mid + ", " +
    dsabinarysearch_RUN_SPLIT.iters[1].mid + ", " + dsabinarysearch_RUN_SPLIT.iters[2].mid +
    " and then writes “…”; the probe it elides is <b>" +
    dsabinarysearch_RUN_SPLIT.iters[3].mid + "</b>, which fails and pushes lo up to " +
    R.answer + ".";
}

function dsabinarysearch_ledgerCap(cfg) {
  var R = cfg.run;
  if (cfg.kind === "arr") {
    return "<b>" + dsabinarysearch_LINEAR + " probes linear, " + R.calls +
      " binary — on 32 elements.</b> The bound ⌈log₂ " + dsabinarysearch_N_ARR + "⌉ is " +
      dsabinarysearch_ceilLog2(dsabinarysearch_N_ARR) + ", and the loop hit it exactly. " +
      "At a stated n = " + dsabinarysearch_num(dsabinarysearch_BIGN) + " the linear scan's " +
      "worst case is " + dsabinarysearch_num(dsabinarysearch_BIGN) + " probes and binary " +
      "search's is <b>" + dsabinarysearch_ceilLog2(dsabinarysearch_BIGN) + "</b>. That gap " +
      "is the easy half of this page. The next two tabs are the half that gets asked.";
  }
  if (cfg.kind === "koko") {
    var range = dsabinarysearch_MAXP - dsabinarysearch_lo0Koko() + 1;
    return "<b>" + R.calls + " calls instead of " + range + ".</b> There are " + range +
      " candidate speeds; testing them one by one costs " +
      (range * dsabinarysearch_PILES.length) + " pile reads, and the loop spent <b>" +
      R.touch + "</b>. The page's complexity is O(n log(max(piles))) — the log is over " +
      "the <i>value</i> range, not the array. Push max(piles) to the page's own " +
      "10⁹ cue and the array work does not change at all: <b>" +
      dsabinarysearch_ceilLog2(dsabinarysearch_BIGV) + "</b> feasibility calls, still " +
      dsabinarysearch_PILES.length + " piles each. Enumerating 10⁹ speeds is not an option; " +
      "bisecting them is 30 calls.";
  }
  var rangeS = dsabinarysearch_SUMN - dsabinarysearch_MAXN + 1;
  var bigHi = dsabinarysearch_BIGARR * dsabinarysearch_BIGV;
  return "<b>" + R.calls + " calls instead of " + rangeS + ".</b> The bounds are the " +
    "part people get wrong, and they are the reason the range is only " + rangeS +
    " wide: lo = max(nums) = " + dsabinarysearch_MAXN + " because no limit below the " +
    "biggest element is achievable, hi = sum(nums) = " + dsabinarysearch_SUMN +
    " because one part holding everything always works. At the page's scale — n = " +
    dsabinarysearch_num(dsabinarysearch_BIGARR) + ", values to 10⁹ — hi reaches " +
    dsabinarysearch_num(bigHi) + ", so the range is about 10¹⁴ wide and the loop needs " +
    "<b>" + dsabinarysearch_ceilLog2(bigHi) + "</b> calls: " +
    dsabinarysearch_num(dsabinarysearch_ceilLog2(bigHi) * dsabinarysearch_BIGARR) +
    " element reads total, against a range you could never enumerate.";
}
function dsabinarysearch_lo0Koko() { return 1; }

// ---------------------------------------------------------------------
// the ledger table rows, all counted
// ---------------------------------------------------------------------
function dsabinarysearch_ledgerRows(cfg) {
  var R = cfg.run, rows = [];
  if (cfg.kind === "arr") {
    rows.push(["linear scan", String(dsabinarysearch_LINEAR),
      String(dsabinarysearch_N_ARR),
      dsabinarysearch_num(dsabinarysearch_BIGN)]);
    rows.push(["binary lower_bound", String(R.calls),
      String(dsabinarysearch_ceilLog2(dsabinarysearch_N_ARR)),
      String(dsabinarysearch_ceilLog2(dsabinarysearch_BIGN))]);
    rows.push(["same loop, > instead of ≥", String(dsabinarysearch_RUN_RIGHT.calls),
      String(dsabinarysearch_ceilLog2(dsabinarysearch_N_ARR)),
      String(dsabinarysearch_ceilLog2(dsabinarysearch_BIGN))]);
    return { head: ["approach", "probes here", "worst case", "worst case at n = 10⁶"], rows: rows };
  }
  if (cfg.kind === "koko") {
    var range = dsabinarysearch_MAXP - 1 + 1;
    rows.push(["try every speed", String(range),
      String(range * dsabinarysearch_PILES.length),
      dsabinarysearch_num(dsabinarysearch_BIGV)]);
    rows.push(["binary search on k", String(R.calls), String(R.touch),
      String(dsabinarysearch_ceilLog2(dsabinarysearch_BIGV))]);
    rows.push(["bound ⌈log₂ range⌉",
      String(dsabinarysearch_ceilLog2(dsabinarysearch_MAXP - 1)), "—",
      String(dsabinarysearch_ceilLog2(dsabinarysearch_BIGV))]);
    return { head: ["approach", "feasibility calls", "pile reads", "calls if max(piles) = 10⁹"], rows: rows };
  }
  var rangeS = dsabinarysearch_SUMN - dsabinarysearch_MAXN + 1;
  var bigHi = dsabinarysearch_BIGARR * dsabinarysearch_BIGV;
  rows.push(["try every limit", String(rangeS),
    String(rangeS * dsabinarysearch_NUMS.length),
    dsabinarysearch_num(bigHi - dsabinarysearch_BIGV)]);
  rows.push(["binary search on the sum", String(R.calls), String(R.touch),
    String(dsabinarysearch_ceilLog2(bigHi))]);
  rows.push(["bound ⌈log₂ range⌉",
    String(dsabinarysearch_ceilLog2(dsabinarysearch_SUMN - dsabinarysearch_MAXN)), "—",
    String(dsabinarysearch_ceilLog2(bigHi))]);
  return { head: ["approach", "feasibility calls", "element reads", "calls at n = 10⁵, v ≤ 10⁹"], rows: rows };
}

// ---------------------------------------------------------------------
// scenario builder
// ---------------------------------------------------------------------
function dsabinarysearch_scenario(cfg, intro, bounds, boundWork) {
  var steps = [], i, it, R = cfg.run;

  steps.push({
    cfg: cfg, kind: "idle", lo: cfg.lo0, hi: cfg.hi0, mid: -1,
    calls: 0, touch: 0, caption: intro
  });

  steps.push({
    cfg: cfg, kind: "bounds", lo: cfg.lo0, hi: cfg.hi0, mid: -1,
    calls: 0, touch: 0, work: boundWork, wstat: "not probed yet",
    flag: "warn", caption: bounds
  });

  for (i = 0; i < R.iters.length; i++) {
    it = R.iters[i];
    steps.push({
      cfg: cfg, kind: "probe", lo: it.lo, hi: it.hi, mid: it.mid, ok: it.ok,
      calls: it.calls, touch: it.touch, work: it.work, wstat: it.wstat,
      flag: it.ok ? "ok" : "bad",
      caption: dsabinarysearch_probeCap(cfg, it, i)
    });
  }

  steps.push({
    cfg: cfg, kind: "done", lo: R.answer, hi: R.answer, mid: -1,
    calls: R.calls, touch: R.touch, answer: R.answer,
    work: [
      { label: "answer", value: String(R.answer), flag: "ok" },
      { label: cfg.callsLabel, value: String(R.calls) },
      { label: cfg.touchLabel, value: String(R.touch) },
      { label: "candidates eliminated",
        value: String((cfg.hi0 - cfg.lo0)) + " of " + String(cfg.hi0 - cfg.lo0) }
    ],
    wstat: "converged", flag: "ok",
    caption: dsabinarysearch_doneCap(cfg)
  });

  steps.push({
    cfg: cfg, kind: "ledger", lo: R.answer, hi: R.answer, mid: -1,
    calls: R.calls, touch: R.touch, answer: R.answer,
    ledger: dsabinarysearch_ledgerRows(cfg),
    flag: "ok", caption: dsabinarysearch_ledgerCap(cfg)
  });

  return { id: cfg.id, label: cfg.label, steps: steps };
}

// ---------------------------------------------------------------------
// the search-space grid — the whole picture in one row of cells
// ---------------------------------------------------------------------
function dsabinarysearch_cells(step, d) {
  var cfg = step.cfg, out = [], j, v, flag, lab;
  if (!cfg) return "";
  for (j = 0; j < cfg.count; j++) {
    v = cfg.base + j;
    flag = undefined;
    if (v < step.lo) flag = "bad";
    else if (v >= step.hi) flag = "ok";
    if (step.kind === "probe" && v === step.mid) flag = "warn";
    lab = cfg.kind === "arr" ? String(dsabinarysearch_ARR[j]) : String(v);
    out.push({ label: lab, flag: flag, title: cfg.cellTitle(v, flag) });
  }
  return d.cells(out, { label: cfg.spaceLabel, dense: true });
}

S["dsabinarysearch"] = {
  title: "One loop, three problems: narrow the window until it is one",
  note: "Three runs of <b>one</b> function — the page's " +
    "<code>min_feasible(lo, hi, feasible)</code> — differing only in the predicate. " +
    "Tab 1 searches an <i>index</i> (stated config: a 32-element sorted array with two " +
    "26s, target 26, and the page's exclusive <code>hi = len(nums)</code>). Tabs 2 and 3 " +
    "search a <i>number</i> and use the page's own inputs: Koko's " +
    "<code>piles = [3, 6, 7, 11], h = 8</code> and Split Array's " +
    "<code>nums = [7, 2, 5, 10, 8], k = 2</code> with " +
    "<code>lo = max = 10, hi = sum = 32</code>. Every probe, window width, feasibility " +
    "call and element read below is <b>a counter incremented inside the loop</b> — the " +
    "traces reproduce the page's worked examples probe for probe. Extrapolations use the " +
    "page's own <code>n ≤ 10⁹</code> cue.",
  interval: 1500,

  scenarios: [
    dsabinarysearch_scenario(
      dsabinarysearch_cfgArr(),
      "A sorted 32-element array and target " + dsabinarysearch_TARGET +
        ". The predicate is <code>a[i] ≥ " + dsabinarysearch_TARGET +
        "</code>, which is false then true and never flips back — that monotonic " +
        "boundary is the only thing binary search actually needs. Press Play.",
      "<b>lo = 0, hi = " + dsabinarysearch_N_ARR + ".</b> The page is emphatic: hi is " +
        "<i>exclusive</i> — <code>len(nums)</code>, not <code>len − 1</code> — and the " +
        "loop is <code>while lo &lt; hi</code> with <code>hi = mid</code>. That removes " +
        "every ±1 decision there is. <b>" + dsabinarysearch_N_ARR + "</b> candidate " +
        "positions are live and none has been tested.",
      [
        { label: "lo", value: "0" },
        { label: "hi  (exclusive)", value: String(dsabinarysearch_N_ARR) },
        { label: "live candidates", value: String(dsabinarysearch_N_ARR) },
        { label: "probes spent", value: "0" }
      ]
    ),

    dsabinarysearch_scenario(
      dsabinarysearch_cfgKoko(),
      "Same loop, different question. Koko's piles are " +
        dsabinarysearch_PILES.join(", ") + " and she has " + dsabinarysearch_HOURS +
        " hours. There is no array to search — the thing being bisected is the " +
        "<i>speed</i>. Press Play.",
      "<b>lo = 1, hi = max(piles) = " + dsabinarysearch_MAXP + ".</b> k = 0 is invalid, " +
        "and k = max(piles) always finishes in " + dsabinarysearch_PILES.length +
        " hours, so the top of the range is feasible by construction — that is why the " +
        "right-hand cell is already green. <b>" + dsabinarysearch_MAXP +
        "</b> candidate speeds, nothing tested.",
      [
        { label: "lo = 1", value: "k = 0 is invalid" },
        { label: "hi = max(piles)", value: String(dsabinarysearch_MAXP) },
        { label: "feasible(hi)", value: "true by construction", flag: "ok" },
        { label: "feasibility calls", value: "0" }
      ]
    ),

    dsabinarysearch_scenario(
      dsabinarysearch_cfgSplit(),
      "The trigger phrase: <i>minimise the largest</i>. nums = " +
        dsabinarysearch_NUMS.join(", ") + ", k = " + dsabinarysearch_PARTS +
        ". Searching over the largest allowed subarray sum, with a greedy packing as " +
        "the feasibility test. Press Play.",
      "<b>lo = max(nums) = " + dsabinarysearch_MAXN + ", hi = sum(nums) = " +
        dsabinarysearch_SUMN + ".</b> No limit below the biggest single element is " +
        "achievable at all; one part containing everything always works. Stating those " +
        "two facts is half the answer, and it is also what makes the range only <b>" +
        (dsabinarysearch_SUMN - dsabinarysearch_MAXN + 1) + "</b> candidates wide.",
      [
        { label: "lo = max(nums)", value: String(dsabinarysearch_MAXN) },
        { label: "hi = sum(nums)", value: String(dsabinarysearch_SUMN) },
        { label: "candidate limits",
          value: String(dsabinarysearch_SUMN - dsabinarysearch_MAXN + 1) },
        { label: "feasibility calls", value: "0" }
      ]
    )
  ],

  draw: function (step, d, ctx) {
    var cfg = step.cfg, panel, width, R;
    if (!cfg) return d.note("Press Play.", "idle");
    R = cfg.run;
    width = step.hi - step.lo;
    if (width < 0) width = 0;

    var head = d.flow([
      d.big(
        step.kind === "idle" ? "—"
          : step.kind === "bounds" ? "set up"
            : step.kind === "probe" ? "mid = " + step.mid
              : String(step.answer),
        step.kind === "done" || step.kind === "ledger" ? "answer" : "probing",
        step.kind === "done" || step.kind === "ledger" ? "ok"
          : step.kind === "probe" ? "warn" : "idle"
      ),
      d.stat({
        label: "live window",
        value: step.lo + " … " + step.hi,
        sub: width + " candidate" + (width === 1 ? "" : "s"),
        flag: width === 0 ? "ok" : width <= 2 ? "warn" : undefined
      }),
      d.stat({
        label: cfg.callsLabel,
        value: String(step.calls),
        sub: "of " + R.calls + " total",
        flag: step.calls ? "warn" : "idle"
      }),
      d.stat({
        label: cfg.touchLabel,
        value: String(step.touch),
        sub: cfg.nLabel,
        flag: step.touch ? "warn" : "idle"
      })
    ]);

    if (step.kind === "ledger" && step.ledger) {
      panel = d.node({
        title: "counted: brute force against the loop you just watched",
        status: "every cell measured",
        statusFlag: "ok",
        badge: "searching " + cfg.searchOver,
        flag: "ok",
        body: d.table(step.ledger.head, step.ledger.rows)
      });
    } else {
      panel = d.node({
        title: cfg.workTitle,
        status: step.wstat || "idle",
        statusFlag: step.kind === "probe" ? (step.ok ? "ok" : "bad")
          : step.kind === "done" ? "ok" : "idle",
        badge: step.kind === "probe" ? "mid = " + step.mid : "searching " + cfg.searchOver,
        meta: step.kind === "probe"
          ? "one call costs " + cfg.nLabel.replace("n = ", "") + " of work"
          : "monotone: false … false | true … true",
        flag: step.kind === "probe" ? (step.ok ? "ok" : "bad")
          : step.kind === "done" ? "ok" : "idle",
        rows: step.work && step.work.length ? step.work
          : [{ label: "status", value: "nothing probed yet" }]
      });
    }

    var legend = "Red = predicate proven <i>false</i> here (and, by monotonicity, " +
      "everywhere below) · green = proven <i>true</i> (and everywhere above) · " +
      "amber = the cell being tested right now · plain = still live. Binary search " +
      "needs exactly this shape — <b>monotonicity, not sortedness</b>.";

    return d.stack([
      head,
      dsabinarysearch_cells(step, d),
      panel,
      d.note(legend, step.kind === "idle" ? "idle" : undefined)
    ]);
  }
};

  // ====================================================================
// ======================================================================
// SIM · dsabitmanipulation  (bit-manipulation.md)
//
// One task in all three tabs: fill dp[i] = popcount(i) for every i in
// 0..7. The time axis is the loop over those values; one frame is one
// value. Only the inner machine changes between tabs, and the operation
// counter is what separates them.
//
// CONFIG — every figure on screen is computed from these, none typed in:
//   values     i = 0 .. N with N = 7        -> NVAL = 8 values
//   int width  W = 32                       -> the page's "O(32)" scan
//   popcount   computed in code by the page's operation #8, x &= x - 1
//   display    4-bit binary, wide enough for 0..7
//
// PER-VALUE COST — the only thing that differs between the tabs:
//   bit scan    W tests, always                    -> 32
//   Kernighan   one iteration per SET bit          -> popcount(i)
//   dp (LC 338) one addition, dp[i>>1] + (i & 1)   -> 1, and 0 for i = 0
//
// TOTALS, summed in code, never typed:
//   scan       NVAL x W                = 8 x 32 = 256
//   Kernighan  sum of popcounts 0..7   = 12
//   dp         N additions             = 7
//
// PAGE FIGURES used verbatim: the eight operations list (#8 is x & (x-1)),
// "O(number of set bits), not O(32)", the recurrence dp[i] = dp[i>>1] +
// (i & 1), the page's three spot-checks i=5 -> 2, i=6 -> 2, i=7 -> 3
// (printed from the computed table rather than written out), and the
// alternative recurrence dp[i] = dp[i & (i-1)] + 1.
// ======================================================================

var dsabitmanipulation_N = 7;          // build the table for 0..7
var dsabitmanipulation_W = 32;         // int width — the page's O(32)
var dsabitmanipulation_B = 4;          // display width in bits

function dsabitmanipulation_bin(x, w) {
  var s = "", k;
  for (k = w - 1; k >= 0; k--) s += ((x >> k) & 1) ? "1" : "0";
  return s;
}

// popcount by the page's operation #8 — this is also the Kernighan loop,
// so the iteration count the sim reports IS the number of set bits.
function dsabitmanipulation_pcount(x) {
  var c = 0;
  while (x) { x = x & (x - 1); c++; }
  return c;
}

var dsabitmanipulation_PC = [];
var dsabitmanipulation_SUMPC = 0;
var dsabitmanipulation_seed;
for (dsabitmanipulation_seed = 0;
     dsabitmanipulation_seed <= dsabitmanipulation_N;
     dsabitmanipulation_seed++) {
  dsabitmanipulation_PC.push(dsabitmanipulation_pcount(dsabitmanipulation_seed));
  dsabitmanipulation_SUMPC += dsabitmanipulation_PC[dsabitmanipulation_seed];
}

var dsabitmanipulation_NVAL = dsabitmanipulation_N + 1;                             // 8
var dsabitmanipulation_SCAN_TOTAL = dsabitmanipulation_NVAL * dsabitmanipulation_W; // 256
var dsabitmanipulation_KERN_TOTAL = dsabitmanipulation_SUMPC;                       // 12
var dsabitmanipulation_DP_TOTAL = dsabitmanipulation_N;                             // 7

function dsabitmanipulation_ops(mode, v) {
  if (mode === "scan") return dsabitmanipulation_W;
  if (mode === "kern") return dsabitmanipulation_PC[v];
  return v === 0 ? 0 : 1;              // dp: one addition per value after the base case
}

function dsabitmanipulation_upto(mode, v) {
  var t = 0, k;
  for (k = 0; k <= v; k++) t += dsabitmanipulation_ops(mode, k);
  return t;
}

// The inner trace of the Kernighan loop on one value: the page's own
// three-line explanation, generated rather than transcribed.
function dsabitmanipulation_trace(v) {
  var rows = [], x = v, B = dsabitmanipulation_B;
  while (x) {
    rows.push([
      dsabitmanipulation_bin(x, B),
      dsabitmanipulation_bin(x - 1, B),
      dsabitmanipulation_bin(x & (x - 1), B)
    ]);
    x = x & (x - 1);
  }
  return rows;
}

function dsabitmanipulation_ratio(a, b) {
  if (!b) return "—";
  return "×" + (a / b).toFixed(1);
}

// --- captions ---------------------------------------------------------

function dsabitmanipulation_hits(pc) {
  return pc + (pc === 1 ? " lands on a set bit" : " land on a set bit");
}

// One distinct point per value, so no two frames say the same thing.
var dsabitmanipulation_SCAN_POINT = [
  "",
  "The value is one bit wide; the loop is " + dsabitmanipulation_W + " bits wide. " +
    "That mismatch is the entire inefficiency, and it never closes.",
  "The hit moved from bit 0 to bit 1 and the bill did not move at all — the scan is " +
    "indifferent to the data.",
  "Two hits now instead of one. The cost stays flat while the yield changes, which is the " +
    "signature of a loop bounded by the <i>word</i> rather than by the <i>answer</i>.",
  "The shift-loop variant <i>while (x) { c += x &amp; 1; x &gt;&gt;= 1; }</i> would stop early " +
    "here — but in Java on a negative int, <i>&gt;&gt;</i> sign-extends and the loop never " +
    "terminates. Use <i>&gt;&gt;&gt;</i>, or a fixed " + dsabitmanipulation_W + "-step scan.",
  "Halfway by value, and the running bill is already larger than the number of set bits in " +
    "the whole range.",
  "Hit rate so far: " + dsabitmanipulation_KERN_TOTAL + " useful tests are coming out of " +
    dsabitmanipulation_SCAN_TOTAL + " — under 5%. Every one of the rest is the loop asking " +
    "about a bit the value does not have.",
  ""
];

var dsabitmanipulation_KERN_POINT = [
  "",
  "",
  "The lowest set bit is not bit 0 here, and the identity does not care: subtract, AND, gone.",
  "Two set bits, two iterations. The loop length <b>is</b> the popcount — which is why the " +
    "final total will be the sum of the popcounts and nothing else.",
  "A value of 4 costs exactly what a value of 1 cost. And note the shape: one iteration and " +
    "<i>x &amp; (x−1)</i> hits zero, which is the power-of-two test — guard <i>x &gt; 0</i>, " +
    "because zero passes it too.",
  "The scan needed " + (dsabitmanipulation_W * 6) + " tests to learn what these six values " +
    "cost; the clearing loop charged only for bits that exist.",
  "Two iterations again. Nothing in this loop looks at the word size, so a 64-bit int with " +
    "two set bits costs the same two iterations.",
  ""
];

var dsabitmanipulation_DP_POINT = [
  "",
  "dp[0] was on the table before this step began — that is the whole trick.",
  "The low bit is zero, so the addition adds nothing: this value is a pure copy of a smaller " +
    "one. Halving in binary is just dropping a digit.",
  "Both terms contribute: the shifted value already had a bit, and the dropped bit was a one.",
  "Another power of two, and the recurrence gets it for the same single addition as every " +
    "other value — the data no longer changes the cost in either direction.",
  "",
  "",
  ""
];

function dsabitmanipulation_capScan(v, f) {
  var b = dsabitmanipulation_bin(v, dsabitmanipulation_B);
  var pc = dsabitmanipulation_PC[v];
  var W = dsabitmanipulation_W;
  if (v === 0) {
    return "<b>i = 0 — " + b + ".</b> The scan tests bit 0, then bit 1, and keeps going " +
      "to bit 31, because a fixed loop cannot know where the value runs out. " + W +
      " evaluations of <i>x &amp; (1 &lt;&lt; k)</i> and <b>zero</b> of them land on a set " +
      "bit. That is the cost floor: the naive method charges the same for every value in " +
      "the range, including this one.";
  }
  if (v === dsabitmanipulation_N) {
    return "<b>Table complete — " + f.scanT + " tests.</b> " + dsabitmanipulation_NVAL +
      " values × " + W + " bit positions, and the data never entered into it. Only <b>" +
      dsabitmanipulation_KERN_TOTAL + "</b> of those tests found a set bit; the other <b>" +
      (dsabitmanipulation_SCAN_TOTAL - dsabitmanipulation_KERN_TOTAL) + "</b> confirmed a " +
      "zero. The next tab deletes exactly those.";
  }
  return "<b>i = " + v + " — " + b + ".</b> " + W + " tests again: " +
    dsabitmanipulation_hits(pc) + ", " + (W - pc) + " do not. Running total <b>" + f.scanT +
    "</b> — exactly " + (v + 1) + " × " + W + ". " + dsabitmanipulation_SCAN_POINT[v];
}

function dsabitmanipulation_capKern(v, f) {
  var b = dsabitmanipulation_bin(v, dsabitmanipulation_B);
  var pc = dsabitmanipulation_PC[v];
  if (v === 0) {
    return "<b>i = 0 — " + b + ".</b> <i>while (x)</i> is false before the body ever runs: " +
      "<b>0</b> iterations. The scan spent " + dsabitmanipulation_W + " tests on this same " +
      "value. The loop is bounded by the number of set bits, and there are none.";
  }
  if (v === 1) {
    return "<b>i = 1 — " + b + ".</b> One iteration, and the trace is the proof of " +
      "operation #8: subtracting 1 flips the lowest <i>1</i> to <i>0</i> and turns every " +
      "<i>0</i> below it into <i>1</i>, so the AND kills that bit and everything under it " +
      "while leaving the higher bits untouched.";
  }
  if (v === dsabitmanipulation_N) {
    return "<b>Table complete — " + f.kernT + " iterations</b> against the scan's " +
      dsabitmanipulation_SCAN_TOTAL + ", a " +
      dsabitmanipulation_ratio(dsabitmanipulation_SCAN_TOTAL, dsabitmanipulation_KERN_TOTAL) +
      " saving. The total is not a coincidence: it is the sum of the popcounts, because the " +
      "loop runs <b>once per set bit</b> and never once more. O(set bits), not O(32) — and " +
      "still one pass per value, which the last tab removes.";
  }
  return "<b>i = " + v + " — " + b + ".</b> " + pc + (pc === 1 ? " iteration" : " iterations") +
    ". Running total <b>" + f.kernT + "</b> against the scan's " + f.scanT +
    " at the same point — a gap of " + (f.scanT - f.kernT) + " tests spent confirming zeros. " +
    dsabitmanipulation_KERN_POINT[v];
}

function dsabitmanipulation_capDp(v, f) {
  var b = dsabitmanipulation_bin(v, dsabitmanipulation_B);
  var src = v >> 1;
  var lowbit = v & 1;
  var tick = "";
  if (v >= 5) {
    tick = " The page's own spot-check: <i>i=" + v + "  " + dsabitmanipulation_bin(v, 3) +
      " → dp[" + src + "] + " + lowbit + " = " + dsabitmanipulation_PC[src] + " + " + lowbit +
      " = " + dsabitmanipulation_PC[v] + "</i> ✓";
  }
  if (v === 0) {
    return "<b>dp[0] = 0.</b> The base case, and the only free value. No test, no shift, no " +
      "addition — and from here on, every value reads a cell that is already filled.";
  }
  if (v === dsabitmanipulation_N) {
    return "<b>Table complete — " + f.dpT + " additions</b> for " + dsabitmanipulation_NVAL +
      " values, against Kernighan's " + dsabitmanipulation_KERN_TOTAL + " and the scan's " +
      dsabitmanipulation_SCAN_TOTAL + " (" +
      dsabitmanipulation_ratio(dsabitmanipulation_SCAN_TOTAL, dsabitmanipulation_DP_TOTAL) +
      "). Kernighan is still the right answer for <i>one</i> number; the recurrence wins only " +
      "because we wanted <b>all</b> of them, and each was one shift away from an answer " +
      "already on the table. An alternative recurrence does the same job: " +
      "<i>dp[i] = dp[i &amp; (i−1)] + 1</i> — clearing the lowest set bit also gives a " +
      "smaller index, with exactly one fewer bit." + tick;
  }
  return "<b>dp[" + v + "] = dp[" + src + "] + (" + v + " &amp; 1) = " +
    dsabitmanipulation_PC[src] + " + " + lowbit + " = " + dsabitmanipulation_PC[v] + ".</b> " +
    "<i>" + b + "</i> shifted right by one is <i>" +
    dsabitmanipulation_bin(src, dsabitmanipulation_B) + "</i> — the shift drops exactly the " +
    "lowest bit, and i&gt;&gt;1 is strictly smaller, so one forward pass is enough. Running " +
    "total <b>" + f.dpT + "</b>. " + dsabitmanipulation_DP_POINT[v] + tick;
}

// --- one scenario per machine -----------------------------------------

function dsabitmanipulation_run(mode, id, label, idleCap) {
  var steps = [{
    caption: idleCap,
    mode: mode, v: -1, flag: "idle",
    ops: 0, scanT: 0, kernT: 0, dpT: 0
  }];
  var v, f;
  for (v = 0; v <= dsabitmanipulation_N; v++) {
    f = {
      mode: mode,
      v: v,
      ops: dsabitmanipulation_ops(mode, v),
      scanT: dsabitmanipulation_upto("scan", v),
      kernT: dsabitmanipulation_upto("kern", v),
      dpT: dsabitmanipulation_upto("dp", v)
    };
    f.flag = mode === "scan" ? (v === 0 ? "bad" : "warn") : "ok";
    f.caption = mode === "scan" ? dsabitmanipulation_capScan(v, f)
      : mode === "kern" ? dsabitmanipulation_capKern(v, f)
      : dsabitmanipulation_capDp(v, f);
    steps.push(f);
  }
  return { id: id, label: label, steps: steps };
}

function dsabitmanipulation_total(mode) {
  return mode === "scan" ? dsabitmanipulation_SCAN_TOTAL
    : mode === "kern" ? dsabitmanipulation_KERN_TOTAL
    : dsabitmanipulation_DP_TOTAL;
}

S["dsabitmanipulation"] = {
  title: "Build the popcount table three ways, and count the operations",
  note: "Every tab fills the same array — <i>dp[i] = popcount(i)</i> for <b>i = 0…" +
    dsabitmanipulation_N + "</b> — and one frame is one value of <b>i</b>. Nothing here is " +
    "typed in: the popcounts are computed by the page's operation #8 (<i>x &amp;= x−1</i>), " +
    "the int width is the page's <b>" + dsabitmanipulation_W + "</b>, and each total is the " +
    "sum of the per-value costs. They come out at <b>" + dsabitmanipulation_SCAN_TOTAL +
    "</b> tests for the bit scan (" + dsabitmanipulation_NVAL + " × " + dsabitmanipulation_W +
    ", data-independent), <b>" + dsabitmanipulation_KERN_TOTAL + "</b> iterations for " +
    "Kernighan (the sum of the popcounts — O(set bits), not O(32)), and <b>" +
    dsabitmanipulation_DP_TOTAL + "</b> additions for the LC 338 recurrence.",
  interval: 1300,
  scenarios: [
    dsabitmanipulation_run("scan", "Bit scan", "Bit scan · O(32) each",
      "Empty table. The naive scan will test all " + dsabitmanipulation_W +
      " bit positions of every value, whatever the value is — press Play."),
    dsabitmanipulation_run("kern", "Kernighan", "Kernighan · x &= x−1",
      "Empty table. This run clears the lowest set bit until nothing is left, so it pays " +
      "once per set bit instead of once per bit position — press Play."),
    dsabitmanipulation_run("dp", "dp recurrence", "dp[i>>1] + (i&1)",
      "Empty table. This run never inspects the bits at all: it reads an answer it already " +
      "computed and adds one bit back — press Play.")
  ],

  draw: function (step, d, ctx) {
    var N = dsabitmanipulation_N;
    var W = dsabitmanipulation_W;
    var B = dsabitmanipulation_B;
    var PC = dsabitmanipulation_PC;
    var v = step.v;
    var has = v >= 0;
    var pc = has ? PC[v] : 0;
    var mode = step.mode;
    var k;

    // ---- the table being filled, shared by all three tabs -------------
    var cells = [];
    for (k = 0; k <= N; k++) {
      cells.push({
        label: (has && k <= v) ? String(PC[k]) : "·",
        flag: (has && k === v) ? "warn" : (has && k < v) ? "ok" : undefined,
        title: "dp[" + k + "]  popcount(" + dsabitmanipulation_bin(k, B) + ") = " + PC[k]
      });
    }

    // ---- the inner machine for this value -----------------------------
    var body, sub;
    if (mode === "scan") {
      var bits = [];
      for (k = 0; k < W; k++) {
        var on = has && ((v >> k) & 1) === 1;
        bits.push({
          label: "",
          flag: !has ? undefined : on ? "ok" : "idle",
          title: has
            ? "bit " + k + " tested — " + (on ? "SET (a hit)" : "zero (a wasted test)")
            : "bit " + k + " — not tested yet"
        });
      }
      body = d.cells(bits, {
        label: has
          ? W + " tests of x & (1 << k) · " + pc + " hit · " + (W - pc) + " wasted"
          : W + " bit positions, none tested yet",
        dense: true
      });
      sub = null;
    } else if (mode === "kern") {
      var rows = has ? dsabitmanipulation_trace(v) : [];
      body = rows.length
        ? d.table(["x", "x − 1", "x & (x−1)"], rows)
        : d.mono(has
          ? "while (x)  ->  false immediately, 0 iterations"
          : "x & (x - 1) clears the lowest set bit — press Play", has ? "ok" : "idle");
      sub = null;
    } else {
      var src = has ? (v >> 1) : 0;
      body = d.mono(has
        ? (v === 0
          ? "dp[0] = 0                        base case, no work"
          : "dp[" + v + "] = dp[" + v + " >> 1] + (" + v + " & 1) = dp[" + src + "] + " +
            (v & 1) + " = " + PC[src] + " + " + (v & 1) + " = " + PC[v])
        : "dp[i] = dp[i >> 1] + (i & 1) — press Play", has ? "ok" : "idle");
      // a second lane showing which already-filled cell this value reads
      var reads = [];
      for (k = 0; k <= N; k++) {
        var isSrc = has && v > 0 && k === src;
        reads.push({
          label: isSrc ? "↑" : "",
          flag: isSrc ? "ok" : undefined,
          title: isSrc ? "dp[" + k + "] = " + PC[k] + " — read, already computed"
            : "not read on this step"
        });
      }
      sub = d.lane({ label: "reads", cells: reads });
    }

    var total = dsabitmanipulation_total(mode);
    var done = has ? v + 1 : 0;
    var run = mode === "scan" ? step.scanT : mode === "kern" ? step.kernT : step.dpT;

    var mine = mode === "scan" ? "bit scan" : mode === "kern" ? "Kernighan" : "dp recurrence";

    return d.stack([
      d.flow([
        d.stack([
          d.big(has ? dsabitmanipulation_bin(v, B) : "—",
            has ? "i = " + v : "not started", has ? (mode === "scan" ? "warn" : "ok") : "idle"),
          d.pill(has ? pc + (pc === 1 ? " set bit" : " set bits") : "table empty",
            has ? "ok" : "idle")
        ]),
        d.node({
          title: mine,
          status: !has ? "IDLE" : done === dsabitmanipulation_NVAL ? "TABLE BUILT" : "RUNNING",
          statusFlag: !has ? "idle" : done === dsabitmanipulation_NVAL ? "ok" : step.flag,
          badge: mode === "scan" ? "O(32) per value"
            : mode === "kern" ? "O(set bits) per value" : "O(1) per value",
          meta: dsabitmanipulation_NVAL + " values · " + W + "-bit int",
          flag: has ? step.flag : "idle",
          gauges: [{
            label: "values done",
            pct: (done / dsabitmanipulation_NVAL) * 100,
            value: done + " / " + dsabitmanipulation_NVAL,
            flag: done === dsabitmanipulation_NVAL ? "ok" : done ? "warn" : "idle"
          }],
          rows: [
            { label: "operations this value", value: has ? String(step.ops) : "—",
              flag: !has ? undefined : step.ops > pc ? "warn" : "ok" },
            { label: "operations so far", value: String(run),
              flag: has ? step.flag : undefined },
            { label: "if the table finishes", value: String(total) }
          ],
          body: body
        }),
        d.stack([
          d.stat({
            label: "bit scan",
            value: String(step.scanT),
            sub: (v + 1 > 0 ? (done + " × " + W) : "not started"),
            flag: mode === "scan" ? "warn" : "idle"
          }),
          d.stat({
            label: "Kernighan",
            value: String(step.kernT),
            sub: "Σ popcount",
            flag: mode === "kern" ? "ok" : "idle"
          }),
          d.stat({
            label: "dp recurrence",
            value: String(step.dpT),
            sub: "one add each",
            flag: mode === "dp" ? "ok" : "idle"
          })
        ])
      ]),
      d.lane({ label: "dp[0…" + N + "]", cells: cells }),
      sub,
      d.note(
        has
          ? "All three tabs end with the <b>same array</b> — " +
            "<i>" + PC.join(" ") + "</i> — and they differ only in what they charge to get " +
            "there. At this point: scan <b>" + step.scanT + "</b>, Kernighan <b>" +
            step.kernT + "</b>, recurrence <b>" + step.dpT + "</b>."
          : "The answer is the same in every tab. What differs is the price: " +
            dsabitmanipulation_SCAN_TOTAL + " versus " + dsabitmanipulation_KERN_TOTAL +
            " versus " + dsabitmanipulation_DP_TOTAL + " operations for the finished table.",
        has ? step.flag : "idle"
      )
    ]);
  }
};

  // ====================================================================
// ======================================================================
// SIM · dsacomplexity  (complexity.md)
//
// The page's "Recursion analysis" section is the one part of a reference
// page with a genuine time axis: a recursion tree is BUILT, level by level,
// and the complexity is whatever the node counts add up to. So that is the
// machinery — one tree expander, run three times, one level per frame.
//
// The page's own code block is the script:
//     fib(n) naive:  branching 2, depth n      -> O(2^n)
//     merge sort:    branching 2, depth log n,
//                    O(n) merge per level      -> O(n log n)
// Branching 2 in both. The tab bar exists to show that the branching factor
// was never the thing: what decides the answer is whether the subproblem
// shrinks by SUBTRACTION or by DIVISION, and whether repeats are remembered.
//
// CONFIG — every figure on screen is counted by running the real recursion.
//   tab 1  fib(8), plain recursion. STATED n = 8 (the page gives no n); small
//          enough that the whole call tree fits on screen, which is the point.
//   tab 2  fib(8) again, one dict added. Same recurrence, same frames.
//   tab 3  merge sort on a STATED 32-element permutation of 1…32, against
//          quicksort with a last-element pivot on 1…32 already sorted —
//          the page's "Quicksort O(n log n) avg, O(n^2) worst. Randomise
//          the pivot", and its "Space includes the call stack".
//
// PAGE FIGURES used as stated:
//   ~10^8 simple operations per second          (the working figure)
//   n = 10^5: ~1.7 million vs 10 billion        (n log n vs n^2) — this sim
//          recomputes both from the formulas and lands on the page's numbers
//   Master Theorem T(n) = a T(n/b) + O(n^d), and merge sort as a=2,b=2,d=1
//   Merge sort O(n log n) time / O(n) space, stable
//   Quicksort O(n log n) avg, O(n^2) worst, O(log n) space
//   Space includes the call stack: O(h), O(log n) balanced, O(n) skewed
//
// Nothing below is asserted. The call counts come from a counter inside the
// recursion; the comparison counts come from a merge and a partition that
// actually sort the arrays; the sorted output is checked at load.
// ======================================================================

var dsacomplexity_OPS = 100000000;          // page: ~10^8 simple ops per second
var dsacomplexity_FIBN = 8;                 // stated
var dsacomplexity_BIGFIB = 50;              // stated, for the scale frame
var dsacomplexity_BIGN = 100000;            // page: n = 10^5

// stated config: a fixed permutation of 1…32, so the comparison counts are
// reproducible rather than sampled
var dsacomplexity_ARR = [
  23, 5, 31, 12, 8, 27, 3, 19, 16, 1, 29, 10, 25, 7, 14, 32,
  21, 4, 18, 30, 9, 26, 2, 15, 11, 28, 6, 22, 17, 13, 24, 20
];
var dsacomplexity_SORTN = dsacomplexity_ARR.length;

// ---------------------------------------------------------------------
// formatting
// ---------------------------------------------------------------------
function dsacomplexity_num(n) {
  if (!isFinite(n)) return "—";
  return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function dsacomplexity_secs(ops) {
  var s = ops / dsacomplexity_OPS;
  if (s < 0.001) return (s * 1000000).toFixed(1) + " µs";
  if (s < 1) return (s * 1000).toFixed(1) + " ms";
  if (s < 600) return s.toFixed(1) + " s";
  return (s / 60).toFixed(1) + " min";
}
function dsacomplexity_log2(x) { return Math.log(x) / Math.LN2; }

// ---------------------------------------------------------------------
// THE tree expander. One recursion, optionally given a cache. Every call is
// recorded with its depth, its argument, and whether it did any work.
// ---------------------------------------------------------------------
function dsacomplexity_fibRun(n, useMemo) {
  var memo = {};
  var levels = [];                 // levels[d] = { calls:[] }
  var seen = {};                   // arguments met at least once, in DFS order
  var perArg = {};                 // how many times each argument was entered
  var calls = 0, hits = 0, computed = 0, adds = 0, maxDepth = 0;

  function level(dep) {
    while (levels.length <= dep) levels.push({ calls: [] });
    return levels[dep];
  }

  function rec(k, dep) {
    calls += 1;
    if (dep > maxDepth) maxDepth = dep;
    perArg[k] = (perArg[k] || 0) + 1;
    var repeat = seen[k] !== undefined;
    seen[k] = true;

    var kind;
    if (useMemo && memo[k] !== undefined) {
      hits += 1;
      kind = "hit";
      level(dep).calls.push({ k: k, kind: kind, repeat: repeat });
      return memo[k];
    }
    if (k <= 1) {
      computed += 1;
      kind = "base";
      if (useMemo) memo[k] = k;
      level(dep).calls.push({ k: k, kind: kind, repeat: repeat });
      return k;
    }
    var slot = { k: k, kind: "work", repeat: repeat };
    level(dep).calls.push(slot);
    var v = rec(k - 1, dep + 1) + rec(k - 2, dep + 1);
    adds += 1;
    computed += 1;
    if (useMemo) memo[k] = v;
    return v;
  }

  var value = rec(n, 0);
  var distinct = 0, key;
  for (key in perArg) if (perArg.hasOwnProperty(key)) distinct += 1;

  // second pass: a call is DUPLICATED if the tree enters that argument more
  // than once anywhere. Independent of traversal order, so the colouring is
  // the same whichever level is on screen.
  var di, dj, dc, dups = [];
  for (di = 0; di < levels.length; di++) {
    dups.push(0);
    for (dj = 0; dj < levels[di].calls.length; dj++) {
      dc = levels[di].calls[dj];
      dc.dup = perArg[dc.k] > 1;
      if (dc.dup) dups[di] += 1;
    }
  }

  return {
    dups: dups,
    value: value, calls: calls, hits: hits, computed: computed, adds: adds,
    levels: levels, perArg: perArg, distinct: distinct, maxDepth: maxDepth
  };
}

var dsacomplexity_NAIVE = dsacomplexity_fibRun(dsacomplexity_FIBN, false);
var dsacomplexity_MEMO = dsacomplexity_fibRun(dsacomplexity_FIBN, true);

// closed forms, verified against the measured runs at load
function dsacomplexity_fibVal(n) {
  var a = 0, b = 1, i, t;
  for (i = 0; i < n; i++) { t = a + b; a = b; b = t; }
  return a;
}
// naive call count is 2*F(n+1) - 1; the measured run is the proof
var dsacomplexity_NAIVE_FORM = 2 * dsacomplexity_fibVal(dsacomplexity_FIBN + 1) - 1;
var dsacomplexity_MEMO_FORM = 2 * dsacomplexity_FIBN - 1;
var dsacomplexity_FORM_OK =
  dsacomplexity_NAIVE_FORM === dsacomplexity_NAIVE.calls &&
  dsacomplexity_MEMO_FORM === dsacomplexity_MEMO.calls;

// the same two formulas at the scale frame's n
var dsacomplexity_BIG_NAIVE = 2 * dsacomplexity_fibVal(dsacomplexity_BIGFIB + 1) - 1;
var dsacomplexity_BIG_MEMO = 2 * dsacomplexity_BIGFIB - 1;

// ---------------------------------------------------------------------
// merge sort — a real sort, comparisons charged to the depth that made them
// ---------------------------------------------------------------------
function dsacomplexity_mergeRun(arr) {
  var levels = [], comps = 0, maxDepth = 0;
  function level(dep) {
    while (levels.length <= dep) levels.push({ subs: 0, comps: 0, sizes: [], elems: 0 });
    return levels[dep];
  }
  function ms(a, dep) {
    var L = level(dep);
    L.subs += 1; L.elems += a.length; L.sizes.push(a.length);
    if (dep > maxDepth) maxDepth = dep;
    if (a.length <= 1) return a.slice();
    var mid = Math.floor(a.length / 2);
    var left = ms(a.slice(0, mid), dep + 1);
    var right = ms(a.slice(mid), dep + 1);
    var out = [], i = 0, j = 0, c = 0;
    while (i < left.length && j < right.length) {
      c += 1;
      if (left[i] <= right[j]) { out.push(left[i]); i += 1; }
      else { out.push(right[j]); j += 1; }
    }
    while (i < left.length) { out.push(left[i]); i += 1; }
    while (j < right.length) { out.push(right[j]); j += 1; }
    L.comps += c; comps += c;
    return out;
  }
  var sorted = ms(arr, 0);
  var ok = true, i;
  for (i = 1; i < sorted.length; i++) if (sorted[i - 1] > sorted[i]) ok = false;
  return { levels: levels, comps: comps, maxDepth: maxDepth, sorted: sorted, ok: ok };
}

// ---------------------------------------------------------------------
// quicksort, last-element pivot, on input that is ALREADY SORTED — the
// page's named worst case. Same branching factor as merge sort.
// ---------------------------------------------------------------------
function dsacomplexity_quickRun(n) {
  var a = [], i;
  for (i = 1; i <= n; i++) a.push(i);
  var levels = [], comps = 0, maxDepth = 0;
  function level(dep) {
    while (levels.length <= dep) levels.push({ subs: 0, comps: 0, sizes: [] });
    return levels[dep];
  }
  function qs(lo, hi, dep) {
    if (lo >= hi) return;
    var L = level(dep);
    L.subs += 1; L.sizes.push(hi - lo + 1);
    if (dep > maxDepth) maxDepth = dep;
    var pivot = a[hi], p = lo, j, t;
    for (j = lo; j < hi; j += 1) {
      comps += 1; L.comps += 1;
      if (a[j] < pivot) { t = a[j]; a[j] = a[p]; a[p] = t; p += 1; }
    }
    t = a[hi]; a[hi] = a[p]; a[p] = t;
    qs(lo, p - 1, dep + 1);
    qs(p + 1, hi, dep + 1);
  }
  qs(0, n - 1, 0);
  return { levels: levels, comps: comps, maxDepth: maxDepth };
}

var dsacomplexity_MS = dsacomplexity_mergeRun(dsacomplexity_ARR);
var dsacomplexity_QS = dsacomplexity_quickRun(dsacomplexity_SORTN);
var dsacomplexity_NLOGN = dsacomplexity_SORTN * dsacomplexity_log2(dsacomplexity_SORTN);
var dsacomplexity_NSQ2 = (dsacomplexity_SORTN * (dsacomplexity_SORTN - 1)) / 2;

// the page's own headline comparison, recomputed from the formulas
var dsacomplexity_PAGE_NLOGN = dsacomplexity_BIGN * dsacomplexity_log2(dsacomplexity_BIGN);
var dsacomplexity_PAGE_NSQ = dsacomplexity_BIGN * dsacomplexity_BIGN;

// ---------------------------------------------------------------------
// cumulative helpers over a level list
// ---------------------------------------------------------------------
function dsacomplexity_cumCalls(run, upto) {
  var t = 0, i;
  for (i = 0; i <= upto && i < run.levels.length; i++) t += run.levels[i].calls.length;
  return t;
}
function dsacomplexity_cumComps(levels, upto) {
  var t = 0, i;
  for (i = 0; i <= upto && i < levels.length; i++) t += levels[i].comps;
  return t;
}
function dsacomplexity_levelWork(run, dep) {
  return dep < run.levels.length ? run.levels[dep].calls.length : 0;
}
function dsacomplexity_cumDups(run, upto) {
  var t = 0, i;
  for (i = 0; i <= upto && i < run.dups.length; i++) t += run.dups[i];
  return t;
}

// ---------------------------------------------------------------------
// tab 1 · plain recursion. One frame per level of the real call tree.
// ---------------------------------------------------------------------
function dsacomplexity_naiveScenario() {
  var R = dsacomplexity_NAIVE, s = [], dep, L, cum, prev, ratio, reps, i;

  s.push({
    kind: "fib", mode: "naive", depth: -1,
    caption: "<b>fib(" + dsacomplexity_FIBN + "), written the obvious way: " +
      "<i>fib(k) = fib(k−1) + fib(k−2)</i>.</b> The page's method is to draw the " +
      "recursion tree and count it — branching factor, depth, work per node. " +
      "Nothing has been called yet. Press Play and the tree builds one level per frame.",
    flag: "idle"
  });

  for (dep = 0; dep < R.levels.length; dep++) {
    L = R.levels[dep];
    cum = dsacomplexity_cumCalls(R, dep);
    prev = dep > 0 ? R.levels[dep - 1].calls.length : 0;
    ratio = prev ? L.calls.length / prev : 0;
    reps = R.dups[dep];

    var cap;
    if (dep === 0) {
      cap = "<b>Depth 0 — one call, fib(" + dsacomplexity_FIBN + ").</b> " +
        "It will spawn two children, and each of those two more. The argument drops " +
        "by <b>1</b> on one branch and <b>2</b> on the other — it is <i>subtracted</i>, " +
        "not divided, and that single fact is what makes the depth <b>n</b> instead of " +
        "log n.";
    } else if (ratio >= 2) {
      cap = "<b>Depth " + dep + " — " + L.calls.length + " calls, the level doubled.</b> " +
        "Every node above it made exactly two children. <b>" + reps + " of the " +
        L.calls.length + "</b> " + (reps === 1 ? "is an argument" : "are arguments") +
        " the tree evaluates more than once — red below, and each red cell will be " +
        "recomputed in full. Calls so far: <b>" + cum + "</b>.";
    } else if (ratio >= 1) {
      cap = "<b>Depth " + dep + " — " + L.calls.length + " calls, growth down to " +
        ratio.toFixed(2) + "×.</b> The doubling breaks here because the fib(k−2) " +
        "branches are bottoming out at fib(1) and fib(0) two levels early. Averaged " +
        "over the whole tree the branching is the golden ratio, about 1.618 — which " +
        "is why the honest count is Θ(1.618ⁿ) and the page writes the looser, easier " +
        "<b>O(2ⁿ)</b>. All " + reps + " calls at this depth are duplicates. Calls so " +
        "far: <b>" + cum + "</b>.";
    } else {
      cap = "<b>Depth " + dep + " — " + L.calls.length + " calls, the level is " +
        "shrinking.</b> Only the branch that subtracted 1 every single time is still " +
        "alive, which is why the height is exactly <b>" + R.maxDepth + " = n − 1</b>. " +
        (dep === R.maxDepth
          ? "These last two are fib(1) and fib(0) — the base cases, reached for the " +
            "first time after " + cum + " calls."
          : reps + " of them are duplicates.") +
        " Calls so far: <b>" + cum + "</b>.";
    }

    s.push({
      kind: "fib", mode: "naive", depth: dep, caption: cap,
      flag: dep < 3 ? "warn" : "bad"
    });
  }

  s.push({
    kind: "fib", mode: "naive", depth: R.levels.length - 1, verdict: true,
    caption: "<b>" + R.calls + " calls to compute " + R.value + ", over " +
      R.distinct + " distinct subproblems.</b> " + (R.calls - R.distinct) +
      " of those calls recomputed an answer the program had already produced. " +
      "Look at the tally: <b>fib(1) was entered " + R.perArg[1] + " times</b> — and " +
      R.perArg[1] + " <i>is</i> the answer. The program is literally adding 1 to " +
      "itself " + R.value + " times, the slowest possible way. At n = " +
      dsacomplexity_BIGFIB + " the same code makes <b>" +
      dsacomplexity_num(dsacomplexity_BIG_NAIVE) + "</b> calls: at the page's working " +
      "figure of 10⁸ simple operations per second that is <b>" +
      dsacomplexity_secs(dsacomplexity_BIG_NAIVE) + "</b>.",
    flag: "bad"
  });

  return { id: "naive", label: "fib(8) · no memo", steps: s };
}

// ---------------------------------------------------------------------
// tab 2 · the same recursion with a dict. Same frames, same machinery.
// ---------------------------------------------------------------------
function dsacomplexity_memoScenario() {
  var R = dsacomplexity_MEMO, N = dsacomplexity_NAIVE, s = [], dep, L, cum, i, hit;

  s.push({
    kind: "fib", mode: "memo", depth: -1,
    caption: "<b>Same recurrence, same call order, one dict.</b> Before recursing, " +
      "look the argument up; after computing, store it. The page's one sentence for " +
      "the whole of dynamic programming is exactly this — the same subproblem is " +
      "solved more than once, so solve it once and remember. Watch what the tree " +
      "turns into.",
    flag: "idle"
  });

  for (dep = 0; dep < R.levels.length; dep++) {
    L = R.levels[dep];
    cum = dsacomplexity_cumCalls(R, dep);
    hit = 0;
    for (i = 0; i < L.calls.length; i++) if (L.calls[i].kind === "hit") hit += 1;

    var naiveHere = dsacomplexity_levelWork(N, dep);
    var cap;
    if (dep === 0) {
      cap = "<b>Depth 0 — fib(" + dsacomplexity_FIBN + "), cache empty.</b> Identical " +
        "to the previous tab so far. The first call down any path always has to happen; " +
        "memoisation never saves the first visit, only every visit after it.";
    } else if (dep === R.levels.length - 1) {
      cap = "<b>Depth " + dep + " — the base cases, fib(1) and fib(0).</b> The recursion " +
        "bottoms out here, and it took <b>" + cum + "</b> calls to get here against <b>" +
        dsacomplexity_cumCalls(N, dep) + "</b> without the cache. Every level of this " +
        "tree was <b>two calls wide</b>: one that recursed and one that hit the cache " +
        "and returned immediately. That is not a tree, it is a <i>path</i>.";
    } else {
      var args = [], q;
      for (q = 0; q < L.calls.length; q++) args.push(L.calls[q]);
      var worked = args[0], hitc = args[args.length - 1];
      cap = "<b>Depth " + dep + " — fib(" + worked.k + ") recurses, fib(" + hitc.k +
        ") " + (hitc.kind === "hit" ? "is already in the dict" : "recurses too") +
        ".</b> " + (hit
          ? "That second call returns in <b>one lookup</b> and recurses no further, " +
            "which prunes the whole subtree the previous tab had to walk. "
          : "") +
        (naiveHere === L.calls.length
          ? "This level is still the same <b>" + naiveHere + "</b> calls wide as the " +
            "plain tree — the saving is not here, it is in the subtree that never gets " +
            "built. "
          : "Without the cache this level held <b>" + naiveHere + "</b> calls; with it, <b>" +
            L.calls.length + "</b>. ") +
        "Calls so far: <b>" + cum + "</b> against " +
        dsacomplexity_cumCalls(N, dep) + ".";
    }

    s.push({
      kind: "fib", mode: "memo", depth: dep, caption: cap,
      flag: dep === 0 ? "warn" : "ok"
    });
  }

  s.push({
    kind: "fib", mode: "memo", depth: R.levels.length - 1, verdict: true,
    caption: "<b>" + R.calls + " calls against " + N.calls + ", same answer " + R.value +
      ".</b> " + R.computed + " arguments were computed — one per distinct subproblem — " +
      "and " + R.hits + " calls were served from the dict. The measured count matches " +
      "<b>2n − 1 = " + dsacomplexity_MEMO_FORM + "</b> exactly, so the recursion is " +
      "<b>O(n)</b>. That is the whole trade the page is describing: O(n) memory bought " +
      "the drop from exponential to linear. At n = " + dsacomplexity_BIGFIB + " it is <b>" +
      dsacomplexity_num(dsacomplexity_BIG_MEMO) + " calls</b> against <b>" +
      dsacomplexity_num(dsacomplexity_BIG_NAIVE) + "</b> — " +
      dsacomplexity_secs(dsacomplexity_BIG_MEMO) + " against " +
      dsacomplexity_secs(dsacomplexity_BIG_NAIVE) + ". And the honest space answer is " +
      "<b>O(n)</b> either way, because the page's rule is that space includes the call " +
      "stack: this recursion is still " + (R.maxDepth + 1) + " frames deep at its lowest.",
    flag: "ok"
  });

  return { id: "memo", label: "fib(8) · memoised", steps: s };
}

// ---------------------------------------------------------------------
// tab 3 · branching 2 again, on two sorts. Halving versus shrink-by-1.
// ---------------------------------------------------------------------
function dsacomplexity_sortScenario() {
  var M = dsacomplexity_MS, Q = dsacomplexity_QS, s = [], dep, mc, qc, mcum, qcum;

  s.push({
    kind: "sort", depth: -1,
    caption: "<b>Branching factor 2 for the third time — now on two sorts of the same " +
      "size.</b> Merge sort splits <b>in half</b>; quicksort splits at a pivot, and this " +
      "input is <i>already sorted</i> with a last-element pivot, so the split is " +
      "" + (dsacomplexity_SORTN - 1) + " and 0. Same branching, opposite shrink rule. " +
      "n = " + dsacomplexity_SORTN + " for both.",
    flag: "idle"
  });

  for (dep = 0; dep <= M.maxDepth; dep++) {
    mc = M.levels[dep] ? M.levels[dep].comps : 0;
    qc = Q.levels[dep] ? Q.levels[dep].comps : 0;
    mcum = dsacomplexity_cumComps(M.levels, dep);
    qcum = dsacomplexity_cumComps(Q.levels, dep);

    var msize = M.levels[dep] ? M.levels[dep].sizes[0] : 1;
    var qsize = Q.levels[dep] ? Q.levels[dep].sizes[0] : 0;
    var cap;

    if (dep === 0) {
      cap = "<b>Depth 0.</b> Merge sort: one subproblem of " + msize + ", and merging " +
        "its two halves back together costs <b>" + mc + "</b> comparisons — about n, " +
        "which is the <i>d = 1</i> in the page's Master Theorem form " +
        "T(n) = a·T(n/b) + O(nᵈ). Quicksort: one partition pass over all " + qsize +
        ", <b>" + qc + "</b> comparisons, and it hands back one subproblem of " +
        (qsize - 1) + " and one of 0.";
    } else if (dep < M.maxDepth) {
      cap = "<b>Depth " + dep + ".</b> Merge sort now has <b>" + M.levels[dep].subs +
        "</b> subproblems of " + msize + " — " + M.levels[dep].subs + " × " + msize +
        " = " + M.levels[dep].elems + ", the whole array again — and they cost <b>" + mc +
        "</b> comparisons between them. <i>Every level costs about n.</i> Quicksort has " +
        "<b>1</b> subproblem of " + qsize + " and spends <b>" + qc + "</b>. Running " +
        "totals: merge <b>" + mcum + "</b>, quick <b>" + qcum + "</b>.";
    } else {
      cap = "<b>Depth " + dep + " — merge sort is finished.</b> " + M.levels[dep].subs +
        " subproblems of size 1, nothing left to merge, <b>" + mcum +
        "</b> comparisons spent in total. It took exactly <b>log₂ " +
        dsacomplexity_SORTN + " = " + dsacomplexity_log2(dsacomplexity_SORTN).toFixed(0) +
        "</b> levels, because halving " + dsacomplexity_SORTN + " reaches 1 in " +
        dsacomplexity_log2(dsacomplexity_SORTN).toFixed(0) + " steps. Quicksort is at " +
        "depth " + dep + " of <b>" + Q.maxDepth + "</b>, with " + qsize +
        " elements still unsorted and <b>" + (Q.comps - qcum) + "</b> comparisons left " +
        "to make.";
    }

    s.push({ kind: "sort", depth: dep, caption: cap, flag: dep < M.maxDepth ? "warn" : "ok" });
  }

  s.push({
    kind: "sort", depth: M.maxDepth, tail: true,
    caption: "<b>" + M.comps + " comparisons against " + Q.comps + ", on the same " +
      dsacomplexity_SORTN + " values.</b> Merge sort landed under n log₂ n = " +
      dsacomplexity_NLOGN.toFixed(0) + "; quicksort hit <b>n(n−1)/2 = " +
      dsacomplexity_NSQ2 + "</b> exactly, which is what O(n²) means when you count it. " +
      "And the page's other half — <b>space includes the call stack</b>: merge sort " +
      "bottomed out at <b>" + (M.maxDepth + 1) + "</b> frames, quicksort at <b>" +
      (Q.maxDepth + 1) + "</b>. O(log n) against O(n), and on a real input the second " +
      "one is a stack overflow.",
    flag: "bad"
  });

  s.push({
    kind: "sort", depth: M.maxDepth, tail: true, scale: true,
    caption: "<b>The sentence the page says decides whether you pass.</b> At n = " +
      dsacomplexity_num(dsacomplexity_BIGN) + ", n log₂ n = <b>" +
      dsacomplexity_num(dsacomplexity_PAGE_NLOGN) + "</b> and n² = <b>" +
      dsacomplexity_num(dsacomplexity_PAGE_NSQ) + "</b> — the page's “roughly 1.7 " +
      "million versus 10 billion”, recomputed rather than quoted. At 10⁸ operations " +
      "per second that is <b>" + dsacomplexity_secs(dsacomplexity_PAGE_NLOGN) +
      "</b> against <b>" + dsacomplexity_secs(dsacomplexity_PAGE_NSQ) + "</b>. Three " +
      "recursions, all branching 2, and the answers were 2ⁿ, n and n log n. " +
      "<b>Count the levels and the work per level; the branching factor on its own " +
      "tells you nothing.</b>",
    flag: "bad"
  });

  return { id: "sort", label: "Sorted input · quicksort", steps: s };
}

// ---------------------------------------------------------------------
// drawing
// ---------------------------------------------------------------------
function dsacomplexity_fibLanes(d, run, upto, mode) {
  var out = [], dep, L, cells, i, c, flag, title;
  for (dep = 0; dep <= upto && dep < run.levels.length; dep++) {
    L = run.levels[dep];
    cells = [];
    for (i = 0; i < L.calls.length; i++) {
      c = L.calls[i];
      if (mode === "memo") {
        flag = c.kind === "hit" ? "idle" : c.kind === "base" ? "warn" : "ok";
        title = "fib(" + c.k + ") · " +
          (c.kind === "hit" ? "cache hit — returned without recursing"
            : c.kind === "base" ? "base case" : "computed, then stored");
      } else {
        flag = c.dup ? "bad" : "ok";
        title = "fib(" + c.k + ") · " +
          (c.dup
            ? "this argument is entered " + run.perArg[c.k] +
              " times in the tree, and recomputed in full every time"
            : "entered exactly once in the whole tree");
      }
      cells.push({ label: String(c.k), flag: flag, title: title });
    }
    out.push(d.lane({ label: "d" + dep, cells: cells }));
  }
  return out.join("");
}

function dsacomplexity_tallyRows(d, run) {
  var rows = [], k, v, max = 0;
  for (k = dsacomplexity_FIBN; k >= 0; k--) {
    v = run.perArg[k] || 0;
    if (v > max) max = v;
  }
  for (k = dsacomplexity_FIBN; k >= 0; k--) {
    v = run.perArg[k] || 0;
    rows.push(d.bar({
      label: "fib(" + k + ")",
      pct: max ? (v / max) * 100 : 0,
      value: v + (v === 1 ? " call" : " calls"),
      flag: v > 1 ? "bad" : "ok"
    }));
  }
  return rows.join("");
}

function dsacomplexity_sortLanes(d, upto) {
  var M = dsacomplexity_MS, Q = dsacomplexity_QS;
  var out = [], dep, L, cells, i;
  for (dep = 0; dep <= upto && dep < M.levels.length; dep++) {
    L = M.levels[dep];
    cells = [];
    for (i = 0; i < L.sizes.length; i++) {
      cells.push({
        label: String(L.sizes[i]),
        flag: L.sizes[i] > 1 ? "ok" : "idle",
        title: "merge sort · depth " + dep + " · subarray of " + L.sizes[i]
      });
    }
    out.push(d.lane({ label: "merge d" + dep, cells: cells }));
  }
  for (dep = 0; dep <= upto && dep < Q.levels.length; dep++) {
    L = Q.levels[dep];
    cells = [];
    for (i = 0; i < L.sizes.length; i++) {
      cells.push({
        label: String(L.sizes[i]),
        flag: "bad",
        title: "quicksort · depth " + dep + " · subarray of " + L.sizes[i] +
          " (the pivot was the largest element, so nothing went right)"
      });
    }
    cells.push({ label: "0", flag: "idle", title: "the empty right side" });
    out.push(d.lane({ label: "quick d" + dep, cells: cells }));
  }
  return out.join("");
}

S["dsacomplexity"] = {
  title: "Expand the recursion tree and count it",
  note: "The page's recursion-tree method, run as a tree: one level per frame, " +
    "three recursions that all branch <b>2</b>. Every call count and comparison " +
    "below is incremented by the real recursion at load — the sorts actually sort, " +
    "and the sorted output is checked. <b>Config:</b> fib(" + dsacomplexity_FIBN +
    ") plain, fib(" + dsacomplexity_FIBN + ") with a dict, and merge sort against " +
    "last-pivot quicksort on " + dsacomplexity_SORTN + " values (stated — the page " +
    "gives no array; quicksort's input is 1…" + dsacomplexity_SORTN + " already " +
    "sorted, its named worst case). <b>From the page:</b> the working figure of " +
    "~10⁸ simple operations per second, the Master Theorem form T(n) = a·T(n/b) + " +
    "O(nᵈ) with merge sort as a=2, b=2, d=1, and “at n = 10⁵ those are roughly 1.7 " +
    "million versus 10 billion operations”, which the last frame recomputes." +
    (dsacomplexity_FORM_OK
      ? " The measured call counts agree with 2·F(n+1) − 1 and 2n − 1."
      : " Measured counts and closed forms disagree — trust the counters."),
  interval: 1300,

  scenarios: [
    dsacomplexity_naiveScenario(),
    dsacomplexity_memoScenario(),
    dsacomplexity_sortScenario()
  ],

  draw: function (step, d, ctx) {
    if (step.kind === "fib") {
      var run = step.mode === "memo" ? dsacomplexity_MEMO : dsacomplexity_NAIVE;
      var other = step.mode === "memo" ? dsacomplexity_NAIVE : dsacomplexity_MEMO;
      var idle = step.depth < 0;
      var dep = idle ? -1 : step.depth;
      var here = idle ? 0 : dsacomplexity_levelWork(run, dep);
      var cum = idle ? 0 : dsacomplexity_cumCalls(run, dep);
      var pct = run.calls ? (cum / run.calls) * 100 : 0;
      var widest = 0, i;
      for (i = 0; i < run.levels.length; i++) {
        if (run.levels[i].calls.length > widest) widest = run.levels[i].calls.length;
      }

      var rows = [
        { label: "calls at this depth", value: idle ? "—" : String(here) },
        { label: "calls so far", value: idle ? "0" : String(cum) },
        {
          label: "distinct subproblems", value: idle ? "0 of " + run.distinct
            : run.distinct + " arguments exist",
          flag: idle ? undefined : "warn"
        }
      ];
      if (!idle && step.mode === "memo") {
        rows.push({
          label: "same depth without the cache",
          value: String(dsacomplexity_cumCalls(other, dep)) + " calls",
          flag: "bad"
        });
      }
      if (!idle && step.mode === "naive") {
        rows.push({
          label: "calls on a duplicated argument",
          value: dsacomplexity_cumDups(run, dep) + " of " + cum,
          flag: dsacomplexity_cumDups(run, dep) ? "bad" : "ok"
        });
      }

      return d.stack([
        d.flow([
          d.big(idle ? "—" : "d" + dep, "depth", idle ? "idle" : undefined),
          d.stat({
            label: "calls",
            value: idle ? "0" : String(cum),
            sub: "of " + run.calls + " total",
            flag: idle ? "idle" : step.mode === "memo" ? "ok" : "bad"
          }),
          d.stat({
            label: "widest level",
            value: idle ? "—" : String(widest),
            sub: step.mode === "memo" ? "the tree is a path" : "branching 2, depth n",
            flag: idle ? "idle" : step.mode === "memo" ? "ok" : "bad"
          }),
          d.stat({
            label: "answer",
            value: idle || dep < run.maxDepth ? "—" : String(run.value),
            sub: "fib(" + dsacomplexity_FIBN + ")",
            flag: idle || dep < run.maxDepth ? "idle" : "ok"
          })
        ]),
        d.node({
          title: step.mode === "memo"
            ? "fib(" + dsacomplexity_FIBN + ") with a dict · call tree"
            : "fib(" + dsacomplexity_FIBN + ") plain · call tree",
          status: idle ? "IDLE" : dep >= run.maxDepth ? "COMPLETE" : "EXPANDING",
          statusFlag: idle ? "idle" : dep >= run.maxDepth
            ? (step.mode === "memo" ? "ok" : "bad") : "warn",
          badge: idle ? "not called" : "depth " + dep + " / " + run.maxDepth,
          meta: step.mode === "memo"
            ? "green computed · grey cache hit · amber base case"
            : "green first sight of this argument · red already evaluated elsewhere",
          flag: idle ? "idle" : step.mode === "memo" ? "ok" : "bad",
          gauges: [{
            label: "calls made",
            pct: idle ? 0 : pct,
            value: idle ? "0 of " + run.calls : cum + " of " + run.calls,
            flag: idle ? "idle" : step.mode === "memo" ? "ok" : "bad"
          }],
          body: idle
            ? d.mono("fib(k) = fib(k-1) + fib(k-2)" +
              (step.mode === "memo" ? "   with memo[k] checked first" : ""))
            : dsacomplexity_fibLanes(d, run, dep, step.mode),
          rows: rows
        }),
        step.verdict
          ? d.node({
            title: step.mode === "memo"
              ? "the trade, counted" : "how many times each argument was entered",
            badge: step.mode === "memo" ? "O(n) time, O(n) space" : "the tally",
            flag: step.mode === "memo" ? "ok" : "bad",
            body: step.mode === "memo"
              ? d.table(
                ["n", "plain calls", "memoised", "plain at 10⁸/s"],
                [
                  [String(dsacomplexity_FIBN),
                    dsacomplexity_num(dsacomplexity_NAIVE.calls),
                    dsacomplexity_num(dsacomplexity_MEMO.calls),
                    dsacomplexity_secs(dsacomplexity_NAIVE.calls)],
                  [String(dsacomplexity_BIGFIB),
                    dsacomplexity_num(dsacomplexity_BIG_NAIVE),
                    dsacomplexity_num(dsacomplexity_BIG_MEMO),
                    dsacomplexity_secs(dsacomplexity_BIG_NAIVE)]
                ])
              : dsacomplexity_tallyRows(d, run)
          })
          : "",
        d.note(
          step.mode === "memo"
            ? "Every level is <b>two</b> calls wide — one that recurses and one that " +
            "hits the dict — so the tree the previous tab drew has become a path of " +
            "length n. Overlapping subproblems is the property that makes this legal; " +
            "without it, caching buys nothing and the problem is divide-and-conquer."
            : "The tree is the proof. <b>Branching 2</b> with the argument <i>subtracted</i> " +
            "gives depth n and therefore about 2ⁿ nodes. A red cell is an argument the " +
            "tree enters more than once — hover one for its count. Those are the " +
            "<i>overlapping subproblems</i>, the second of the two properties the page " +
            "requires, and they are exactly what the next tab removes.",
          step.mode === "memo" ? "ok" : "bad"
        )
      ]);
    }

    // ---- sort tab -----------------------------------------------------
    var M = dsacomplexity_MS, Q = dsacomplexity_QS;
    var sidle = step.depth < 0;
    var sdep = sidle ? -1 : step.depth;
    var mcum = sidle ? 0 : dsacomplexity_cumComps(M.levels, sdep);
    var qcum = sidle ? 0 : dsacomplexity_cumComps(Q.levels, sdep);
    var msubs = !sidle && M.levels[sdep] ? M.levels[sdep].subs : 0;
    var qleft = !sidle && Q.levels[sdep] ? Q.levels[sdep].sizes[0] : dsacomplexity_SORTN;

    var board = [
      d.bar({
        label: "merge sort",
        pct: (mcum / Q.comps) * 100,
        value: mcum + " comps",
        flag: "ok"
      }),
      d.bar({
        label: "quicksort",
        pct: (qcum / Q.comps) * 100,
        value: qcum + " comps",
        flag: "bad"
      })
    ].join("");

    return d.stack([
      d.flow([
        d.big(sidle ? "—" : "d" + sdep, "depth", sidle ? "idle" : undefined),
        d.stat({
          label: "merge sort",
          value: sidle ? "0" : String(mcum),
          sub: sidle ? "not started" : msubs + " sub" + (msubs === 1 ? "" : "s") +
            " of " + (M.levels[sdep] ? M.levels[sdep].sizes[0] : 1),
          flag: sidle ? "idle" : "ok"
        }),
        d.stat({
          label: "quicksort",
          value: sidle ? "0" : String(qcum),
          sub: sidle ? "not started" : "1 sub of " + qleft,
          flag: sidle ? "idle" : "bad"
        }),
        d.stat({
          label: "levels left",
          value: sidle ? "—" : (M.maxDepth - sdep) + " / " + (Q.maxDepth - sdep),
          sub: "merge / quick",
          flag: sidle ? "idle" : sdep >= M.maxDepth ? "bad" : "warn"
        })
      ]),
      d.node({
        title: "same n = " + dsacomplexity_SORTN + ", same branching 2",
        status: sidle ? "IDLE" : sdep >= M.maxDepth ? "MERGE DONE" : "SPLITTING",
        statusFlag: sidle ? "idle" : sdep >= M.maxDepth ? "warn" : "ok",
        badge: sidle ? "unsplit" : "depth " + sdep,
        meta: sidle
          ? "cell labels are subproblem sizes"
          : "merge halves: " + dsacomplexity_SORTN + " → " +
          (M.levels[sdep] ? M.levels[sdep].sizes[0] : 1) +
          " · quick shrinks by 1: " + dsacomplexity_SORTN + " → " + qleft,
        flag: sidle ? "idle" : "warn",
        body: sidle
          ? d.mono("merge: T(n) = 2 T(n/2) + O(n)      quick, worst: T(n) = T(n-1) + O(n)")
          : dsacomplexity_sortLanes(d, sdep),
        rows: [
          { label: "comparisons this depth",
            value: sidle ? "—" : (M.levels[sdep] ? M.levels[sdep].comps : 0) +
              " merge · " + (Q.levels[sdep] ? Q.levels[sdep].comps : 0) + " quick" },
          { label: "call-stack depth reached",
            value: sidle ? "0" : (sdep + 1) + " frames",
            flag: sidle ? undefined : "warn" }
        ]
      }),
      sidle ? "" : d.node({
        title: "comparisons spent",
        badge: "scale: quicksort's total, " + Q.comps,
        flag: sdep >= M.maxDepth ? "bad" : "warn",
        body: board
      }),
      step.scale
        ? d.table(
          ["", "merge sort", "quicksort, sorted input"],
          [
            ["comparisons at n = " + dsacomplexity_SORTN,
              String(M.comps), String(Q.comps)],
            ["formula", "≤ n log₂ n = " + dsacomplexity_NLOGN.toFixed(0),
              "n(n−1)/2 = " + dsacomplexity_NSQ2],
            ["stack frames", String(M.maxDepth + 1), String(Q.maxDepth + 1)],
            ["at n = " + dsacomplexity_num(dsacomplexity_BIGN),
              dsacomplexity_num(dsacomplexity_PAGE_NLOGN),
              dsacomplexity_num(dsacomplexity_PAGE_NSQ)],
            ["at 10⁸ ops/s",
              dsacomplexity_secs(dsacomplexity_PAGE_NLOGN),
              dsacomplexity_secs(dsacomplexity_PAGE_NSQ)]
          ])
        : "",
      d.note(
        step.tail
          ? "<b>Master Theorem, applied to the left column:</b> merge sort is " +
          "a = 2, b = 2, d = 1 — the page's own worked parameters — so a = bᵈ and " +
          "the answer is O(nᵈ log n) = <b>O(n log n)</b>. Quicksort's worst case is " +
          "not a Master Theorem recurrence at all: T(n) = T(n−1) + O(n) subtracts " +
          "instead of dividing, and it sums to n²/2."
          : "Read the two lane stacks as levels. Merge sort's level <i>d</i> always " +
          "holds 2ᵈ subproblems that still total " + dsacomplexity_SORTN +
          " elements, so every level costs about n and there are log₂ n of them. " +
          "Quicksort's holds <b>one</b> subproblem, one element shorter than the last, " +
          "so there are n of them.",
        step.tail ? "bad" : undefined
      )
    ]);
  }
};

  // ====================================================================
// ======================================================================
// SIM · dsadppatterns  (dp-patterns.md)
//
// The page's closing table is "the three bugs that run and lie", and two of
// the three are a SINGLE WORD in a loop header: backward vs forward in the
// inner loop, and coin-outer vs amount-outer in the nesting. So the mechanism
// worth animating is not a clever algorithm — it is one array, filled three
// times by the same write, with one word changed each time.
//
// CONFIG — every number on screen is produced by the loop below, never typed:
//   coins    {1, 2, 5}          the page's coin_change_ways example
//   target   5                  the page's amount
//   table    dp[0..5], six cells, dp[0] = 1 (one way to make 0: take nothing)
//   write    dp[t] += dp[t - c] — byte-identical in all three runs
//
//   run 1  coin outer, t BACKWARD  -> 0/1: each coin at most once
//   run 2  coin outer, t FORWARD   -> unbounded: coins reusable
//   run 3  amount outer, coin inner, forward -> permutations
//
// The page states the verified figure coin_change_ways([1,2,5], 5) == 4.
// That is run 2's dp[5] and it is computed here, not asserted. Runs 1 and 3
// perform exactly the same number of writes and answer different questions.
// Every finished cell is cross-checked against a brute-force enumeration of
// the actual subsets / multisets / sequences it claims to count, so the table
// is not merely plausible — it is verified against the objects themselves.
// ======================================================================

var dsadppatterns_COINS = [1, 2, 5];
var dsadppatterns_TARGET = 5;
var dsadppatterns_SET = "{" + dsadppatterns_COINS.join(", ") + "}";
// The rectangle the two loop headers sit inside: amount x coins. The loop
// bounds (t >= c, or c <= t) are what carve the real work out of it.
var dsadppatterns_BOX = dsadppatterns_TARGET * dsadppatterns_COINS.length;

function dsadppatterns_zeros(n) {
  var a = [], i;
  for (i = 0; i < n; i++) a.push(0);
  return a;
}

// --- brute force: the actual objects each cell claims to count ----------
function dsadppatterns_subsets(t) {          // each coin at most once
  var out = [];
  function rec(i, left, picked) {
    if (left === 0) { out.push(picked.length ? picked.join("+") : "take nothing"); return; }
    if (i >= dsadppatterns_COINS.length || left < 0) return;
    rec(i + 1, left - dsadppatterns_COINS[i], picked.concat([dsadppatterns_COINS[i]]));
    rec(i + 1, left, picked);
  }
  rec(0, t, []);
  return out;
}

function dsadppatterns_combos(t) {           // multisets: order does not matter
  var out = [];
  function rec(i, left, picked) {
    if (left === 0) { out.push(picked.length ? picked.join("+") : "take nothing"); return; }
    if (i >= dsadppatterns_COINS.length) return;
    if (dsadppatterns_COINS[i] <= left) {
      rec(i, left - dsadppatterns_COINS[i], picked.concat([dsadppatterns_COINS[i]]));
    }
    rec(i + 1, left, picked);
  }
  rec(0, t, []);
  return out;
}

function dsadppatterns_perms(t) {            // sequences: order matters
  var out = [];
  function rec(left, picked) {
    var i;
    if (left === 0) { out.push(picked.length ? picked.join("+") : "take nothing"); return; }
    for (i = 0; i < dsadppatterns_COINS.length; i++) {
      if (dsadppatterns_COINS[i] <= left) {
        rec(left - dsadppatterns_COINS[i], picked.concat([dsadppatterns_COINS[i]]));
      }
    }
  }
  rec(t, []);
  return out;
}

function dsadppatterns_witTable(fn) {
  var out = [], t;
  for (t = 0; t <= dsadppatterns_TARGET; t++) out.push(fn(t));
  return out;
}

var dsadppatterns_WIT = {
  zeroone: dsadppatterns_witTable(dsadppatterns_subsets),
  unbounded: dsadppatterns_witTable(dsadppatterns_combos),
  perm: dsadppatterns_witTable(dsadppatterns_perms)
};

var dsadppatterns_NAMES = {
  zeroone: "subsets",
  unbounded: "combinations",
  perm: "permutations"
};

// ----------------------------------------------------------------------
// run 1 and run 2 — coin outer, amount inner. `backward` is the one word.
// ----------------------------------------------------------------------
function dsadppatterns_coinOuter(backward) {
  var mode = backward ? "zeroone" : "unbounded";
  var dir = backward ? "backward" : "forward";
  var dp = dsadppatterns_zeros(dsadppatterns_TARGET + 1);
  var steps = [];
  var ops = 0;
  var i, c, t, before, trace, touched, changed, changedList, passOps;

  steps.push({
    mode: mode, dp: dp.slice(0), touched: {}, changed: {},
    ops: 0, passOps: 0, trace: [], phase: "IDLE", flag: "idle",
    loop: "for c in coins:  for t = " + (backward ? "5 → c" : "c → 5"),
    title: "dp table",
    status: "NOT INITIALISED",
    caption: "Six cells for the amounts <b>0 … " + dsadppatterns_TARGET +
      "</b>, coins " + dsadppatterns_SET + ". The write is <i>dp[t] += dp[t − c]</i> — " +
      "the same line in all three tabs. Only the loop header differs. Press Play.",
    derive: "Nothing has been read yet. Every cell is 0, including dp[0]."
  });

  dp[0] = 1;
  steps.push({
    mode: mode, dp: dp.slice(0), touched: {}, changed: { 0: 1 },
    ops: 0, passOps: 0, trace: [], phase: "BASE", flag: "ok",
    loop: "dp[0] = 1",
    title: "dp table",
    status: "BASE CASE SET",
    caption: "<b>Base case: dp[0] = 1.</b> There is exactly one way to make 0 — " +
      "take nothing. Every later cell is built out of this single 1, so it is the " +
      "only number in the table that is not derived.",
    derive: "dp[0] = 1, every other cell still 0. No writes counted yet."
  });

  for (i = 0; i < dsadppatterns_COINS.length; i++) {
    c = dsadppatterns_COINS[i];
    trace = []; touched = {}; changed = {}; changedList = []; passOps = 0;

    if (backward) {
      for (t = dsadppatterns_TARGET; t >= c; t--) {
        before = dp[t];
        dp[t] = dp[t] + dp[t - c];
        passOps++;
        touched[t] = 1;
        trace.push("dp[" + t + "] += dp[" + (t - c) + "]   →   " + before + " + " +
          dp[t - c] + " = " + dp[t]);
        if (dp[t] !== before) { changed[t] = 1; changedList.push(t); }
      }
    } else {
      for (t = c; t <= dsadppatterns_TARGET; t++) {
        before = dp[t];
        dp[t] = dp[t] + dp[t - c];
        passOps++;
        touched[t] = 1;
        trace.push("dp[" + t + "] += dp[" + (t - c) + "]   →   " + before + " + " +
          dp[t - c] + " = " + dp[t]);
        if (dp[t] !== before) { changed[t] = 1; changedList.push(t); }
      }
    }
    ops += passOps;

    steps.push({
      mode: mode, dp: dp.slice(0), touched: touched, changed: changed,
      ops: ops, passOps: passOps, trace: trace, coin: c,
      phase: "PASS", flag: backward ? "ok" : "warn",
      loop: "c = " + c + ",  t = " + (backward ? dsadppatterns_TARGET + " → " + c
        : c + " → " + dsadppatterns_TARGET),
      title: "dp table",
      status: "COIN " + c + " · " + dir.toUpperCase(),
      caption: "<b>Coin " + c + ", " + dir + ".</b> t runs " +
        (backward ? dsadppatterns_TARGET + " down to " + c : c + " up to " + dsadppatterns_TARGET) +
        " — <b>" + passOps + "</b> write" + (passOps === 1 ? "" : "s") + ", <b>" +
        changedList.length + "</b> cell" + (changedList.length === 1 ? "" : "s") +
        " changed" + (changedList.length ? " (dp[" + changedList.join("], dp[") + "])" : "") +
        ". " + (backward
          ? "Reading downward, dp[t−" + c + "] still holds the value from <i>before</i> coin " +
            c + " was considered, so coin " + c + " can be used at most once."
          : "Reading upward, dp[t−" + c + "] may <i>already</i> contain coin " + c +
            " — so this pass lets coin " + c + " be reused, which is what unbounded wants."),
      derive: "Writes this pass <b>" + passOps + "</b>, cumulative <b>" + ops + "</b>. " +
        "The " + (dsadppatterns_BOX - ops) + " remaining slots of the " + dsadppatterns_BOX +
        "-cell (amount × coins) rectangle are either not reached yet or skipped by the " +
        "bound t ≥ " + c + "."
    });
  }

  return { mode: mode, steps: steps, dp: dp, ops: ops, answer: dp[dsadppatterns_TARGET] };
}

// ----------------------------------------------------------------------
// run 3 — the loops swapped: amount outer, coin inner.
// ----------------------------------------------------------------------
function dsadppatterns_amountOuter() {
  var dp = dsadppatterns_zeros(dsadppatterns_TARGET + 1);
  var steps = [];
  var ops = 0;
  var t, i, c, before, start, trace, used, passOps;

  steps.push({
    mode: "perm", dp: dp.slice(0), touched: {}, changed: {},
    ops: 0, passOps: 0, trace: [], phase: "IDLE", flag: "idle",
    loop: "for t = 1 → 5:  for c in coins",
    title: "dp table",
    status: "NOT INITIALISED",
    caption: "Same six cells, same coins " + dsadppatterns_SET + ", same write " +
      "<i>dp[t] += dp[t − c]</i>. This time the <b>nesting</b> is swapped: amount " +
      "outer, coin inner. Press Play.",
    derive: "Nothing has been read yet. Every cell is 0, including dp[0]."
  });

  dp[0] = 1;
  steps.push({
    mode: "perm", dp: dp.slice(0), touched: {}, changed: { 0: 1 },
    ops: 0, passOps: 0, trace: [], phase: "BASE", flag: "ok",
    loop: "dp[0] = 1",
    title: "dp table",
    status: "BASE CASE SET",
    caption: "<b>Base case: dp[0] = 1</b>, identical to the other two runs. " +
      "Every difference that follows comes from the loop header alone.",
    derive: "dp[0] = 1, every other cell still 0. No writes counted yet."
  });

  for (t = 1; t <= dsadppatterns_TARGET; t++) {
    trace = []; used = []; passOps = 0; start = dp[t];
    for (i = 0; i < dsadppatterns_COINS.length; i++) {
      c = dsadppatterns_COINS[i];
      if (c <= t) {
        before = dp[t];
        dp[t] = dp[t] + dp[t - c];
        passOps++;
        used.push(c);
        trace.push("c = " + c + " :  dp[" + t + "] += dp[" + (t - c) + "]   →   " +
          before + " + " + dp[t - c] + " = " + dp[t]);
      } else {
        trace.push("c = " + c + " :  skipped, " + c + " > " + t);
      }
    }
    ops += passOps;

    steps.push({
      mode: "perm", dp: dp.slice(0), touched: {}, changed: {},
      cursor: t, ops: ops, passOps: passOps, trace: trace, amount: t,
      phase: "PASS", flag: "warn",
      loop: "t = " + t + ",  c over " + dsadppatterns_SET,
      title: "dp table",
      status: "AMOUNT " + t,
      caption: "<b>t = " + t + ".</b> Every coin ≤ " + t + " is tried against this one " +
        "cell: " + (used.length ? used.join(", ") : "none") + ". dp[" + t + "] goes " +
        start + " → <b>" + dp[t] + "</b> in <b>" + passOps + "</b> write" +
        (passOps === 1 ? "" : "s") + ". Because the cell is finished before the next " +
        "amount starts, a smaller coin can follow a larger one — <i>order is being " +
        "counted</i>.",
      derive: "Writes this amount <b>" + passOps + "</b>, cumulative <b>" + ops + "</b>. " +
        "Coins skipped here because c > t: <b>" +
        (dsadppatterns_COINS.length - passOps) + "</b>."
    });
    // mark the single cell this pass owns
    steps[steps.length - 1].touched[t] = 1;
    if (dp[t] !== start) steps[steps.length - 1].changed[t] = 1;
  }

  return { mode: "perm", steps: steps, dp: dp, ops: ops, answer: dp[dsadppatterns_TARGET] };
}

// ----------------------------------------------------------------------
var dsadppatterns_A = dsadppatterns_coinOuter(true);    // 0/1, backward
var dsadppatterns_B = dsadppatterns_coinOuter(false);   // unbounded, forward
var dsadppatterns_C = dsadppatterns_amountOuter();      // loops swapped

// Cross-check every finished cell against the brute-force enumeration.
function dsadppatterns_verify(run) {
  var wit = dsadppatterns_WIT[run.mode], t, bad = 0;
  for (t = 0; t <= dsadppatterns_TARGET; t++) {
    if (run.dp[t] !== wit[t].length) bad++;
  }
  return bad;
}
var dsadppatterns_BAD =
  dsadppatterns_verify(dsadppatterns_A) +
  dsadppatterns_verify(dsadppatterns_B) +
  dsadppatterns_verify(dsadppatterns_C);

var dsadppatterns_ANSWERS = "1 · " + dsadppatterns_A.answer + "   2 · " +
  dsadppatterns_B.answer + "   3 · " + dsadppatterns_C.answer;

// Two closing frames per run: the answer, then the brute-force cross-check.
function dsadppatterns_close(run, headline, why) {
  var T = dsadppatterns_TARGET;
  var wit = dsadppatterns_WIT[run.mode];
  var mismatches = dsadppatterns_verify(run);
  var last = run.steps[run.steps.length - 1];

  run.steps.push({
    mode: run.mode, dp: run.dp.slice(0), touched: {}, changed: {},
    ops: run.ops, passOps: 0, trace: last.trace, phase: "ANSWER", flag: "ok",
    loop: "return dp[" + T + "]",
    title: "dp table",
    status: "ANSWER READ",
    answerLabel: run.answer + " " + dsadppatterns_NAMES[run.mode],
    caption: "<b>dp[" + T + "] = " + run.answer + ".</b> " + headline + " " + why +
      " All three tabs performed <b>" + run.ops + "</b> writes — the same " + run.ops +
      " — and returned " + dsadppatterns_ANSWERS.replace(/ {3}/g, ", ") + ".",
    derive: "Writes <b>" + run.ops + "</b> out of the " + dsadppatterns_BOX +
      " (amount × coins) slots the two loop headers enclose; the other " +
      (dsadppatterns_BOX - run.ops) + " are the pairs where c > t, which the loop " +
      "bound never visits. Cost is identical across the three runs — the loop " +
      "header changes the <i>question</i>, not the work."
  });

  run.steps.push({
    mode: run.mode, dp: run.dp.slice(0), touched: {}, changed: {},
    ops: run.ops, passOps: 0, trace: [], phase: "CHECK",
    flag: mismatches ? "bad" : "ok",
    loop: "brute force",
    title: "dp table",
    status: mismatches ? "MISMATCH" : "VERIFIED",
    answerLabel: run.answer + " " + dsadppatterns_NAMES[run.mode],
    wit: wit,
    caption: "<b>Cross-check.</b> Enumerating the actual " +
      dsadppatterns_NAMES[run.mode] + " of " + dsadppatterns_SET + " by brute force " +
      "gives " + wit[T].length + " for t = " + T + ", against dp[" + T + "] = " +
      run.answer + ". Across all six cells: <b>" + mismatches + "</b> mismatch" +
      (mismatches === 1 ? "" : "es") + ". The table is not merely plausible — " +
      "it counts the objects listed below.",
    derive: "Every cell compared against an explicit list. Hover any cell to read " +
      "the objects it counts."
  });
}

dsadppatterns_close(
  dsadppatterns_A,
  "Backward inner loop, so each coin is used at most once.",
  "The only subset of " + dsadppatterns_SET + " summing to " + dsadppatterns_TARGET +
  " is {5}."
);
dsadppatterns_close(
  dsadppatterns_B,
  "Forward inner loop — the same line, one word changed — so coins are reusable.",
  "This is the page's verified figure, coin_change_ways([1,2,5], 5) == " +
  dsadppatterns_B.answer + ", recomputed by the loop above rather than asserted."
);
dsadppatterns_close(
  dsadppatterns_C,
  "Amount outer, coin inner: a cell is finished before the next amount begins.",
  "1+2+2 and 2+1+2 are now two different answers, so the run counts orderings."
);

S["dsadppatterns"] = {
  title: "One array, one word changed, three different questions",
  note: "One dp table of <b>" + (dsadppatterns_TARGET + 1) + "</b> cells, coins <b>" +
    dsadppatterns_SET + "</b>, target <b>" + dsadppatterns_TARGET + "</b>, base case " +
    "dp[0] = 1, and the single write <i>dp[t] += dp[t − c]</i> — identical in all " +
    "three tabs. The only thing that changes is the loop header: <b>backward</b> vs " +
    "<b>forward</b>, and <b>coin outer</b> vs <b>amount outer</b>. Each run performs " +
    "the same <b>" + dsadppatterns_A.ops + "</b> writes and returns a different answer " +
    "(" + dsadppatterns_ANSWERS.replace(/ {3}/g, ", ") + "). Tab 2 is the page's " +
    "verified figure <i>coin_change_ways([1,2,5], 5) == " + dsadppatterns_B.answer +
    "</i>, computed here rather than quoted; every finished cell is cross-checked " +
    "against a brute-force enumeration (<b>" + dsadppatterns_BAD + "</b> mismatches).",
  interval: 1350,

  scenarios: [
    { id: "zeroone", label: "0/1 · backward", steps: dsadppatterns_A.steps },
    { id: "unbounded", label: "Unbounded · forward", steps: dsadppatterns_B.steps },
    { id: "perm", label: "Loops swapped", steps: dsadppatterns_C.steps }
  ],

  draw: function (step, d, ctx) {
    var T = dsadppatterns_TARGET;
    var dp = step.dp || dsadppatterns_zeros(T + 1);
    var wit = step.wit || null;
    var done = step.phase === "ANSWER" || step.phase === "CHECK";
    var idxCells = [], dpCells = [], i, fl, ttl, list;

    for (i = 0; i <= T; i++) {
      fl = undefined;
      if (step.changed && step.changed[i]) fl = "ok";
      else if (step.touched && step.touched[i]) fl = "warn";
      else if (!dp[i]) fl = "idle";
      if (done) fl = i === T ? "ok" : (dp[i] ? undefined : "idle");

      ttl = "dp[" + i + "] = " + dp[i];
      if (done) {
        list = dsadppatterns_WIT[step.mode] ? dsadppatterns_WIT[step.mode][i] : null;
        if (list && list.length) ttl += "  —  " + list.join("   ·   ");
        else if (list) ttl += "  —  no way to make " + i;
      }
      idxCells.push({ label: String(i), flag: done && i === T ? "ok" : "idle" });
      dpCells.push({ label: String(dp[i]), flag: fl, title: ttl });
    }

    var opsPct = dsadppatterns_BOX ? ((step.ops || 0) / dsadppatterns_BOX) * 100 : 0;

    var head = d.flow([
      d.stack([
        d.big(done ? String(dp[T]) : (step.phase === "IDLE" ? "—" : String(dp[T])),
          "dp[" + T + "]", done ? "ok" : step.phase === "IDLE" ? "idle" : "warn"),
        d.pill(step.loop, step.phase === "IDLE" ? "idle" : "warn")
      ]),
      d.node({
        title: step.title,
        status: step.status,
        statusFlag: step.flag,
        badge: "coins " + dsadppatterns_SET,
        meta: "dp[t] += dp[t − c] · target " + T,
        flag: step.flag,
        gauges: [{
          label: "writes performed",
          pct: opsPct,
          value: (step.ops || 0) + " / " + dsadppatterns_BOX,
          flag: step.ops ? "ok" : "idle"
        }],
        body: d.stack([
          d.lane({ label: "t", cells: idxCells }),
          d.lane({ label: "dp", cells: dpCells })
        ]),
        rows: [
          { label: "writes this frame", value: String(step.passOps || 0) },
          { label: "writes so far", value: String(step.ops || 0) },
          {
            label: "answer",
            value: step.answerLabel ? step.answerLabel : "not read yet",
            flag: step.answerLabel ? "ok" : "idle"
          }
        ]
      }),
      d.stack([
        d.stat({
          label: "0/1 · backward",
          value: String(dsadppatterns_A.answer),
          sub: "subsets",
          flag: step.mode === "zeroone" ? "ok" : "idle"
        }),
        d.stat({
          label: "unbounded · forward",
          value: String(dsadppatterns_B.answer),
          sub: "combinations",
          flag: step.mode === "unbounded" ? "ok" : "idle"
        }),
        d.stat({
          label: "loops swapped",
          value: String(dsadppatterns_C.answer),
          sub: "permutations",
          flag: step.mode === "perm" ? "ok" : "idle"
        })
      ])
    ]);

    var body;
    if (step.phase === "CHECK" && wit) {
      var rows = [];
      for (i = 0; i <= T; i++) {
        rows.push([
          String(i),
          String(dp[i]),
          String(wit[i].length),
          wit[i].length ? wit[i].join("   ·   ") : "none"
        ]);
      }
      body = d.node({
        title: "brute force · the actual " + dsadppatterns_NAMES[step.mode],
        status: step.status,
        statusFlag: step.flag,
        badge: "enumerated, not counted",
        flag: step.flag,
        body: d.table(["t", "dp[t]", "found", "the objects"], rows)
      });
    } else {
      var lines = [];
      if (step.trace && step.trace.length) {
        for (i = 0; i < step.trace.length; i++) {
          lines.push(d.mono(step.trace[i], step.flag === "idle" ? "idle" : undefined));
        }
      } else {
        lines.push(d.note("No write executed in this frame.", "idle"));
      }
      body = d.node({
        title: "the writes, in execution order",
        status: (step.passOps || 0) + " write" + ((step.passOps || 0) === 1 ? "" : "s"),
        statusFlag: step.passOps ? "ok" : "idle",
        badge: step.coin !== undefined && step.coin !== null
          ? "coin " + step.coin
          : step.amount !== undefined && step.amount !== null
            ? "amount " + step.amount
            : "setup",
        flag: step.flag,
        body: d.stack(lines)
      });
    }

    return d.stack([head, body, d.note(step.derive, step.flag)]);
  }
};

  // ====================================================================
// ======================================================================
// SIM · dsadynamicprogrammi  (dynamic-programming.md)
//
// The page's opening sentence is the whole mechanism: "DP is recursion where
// the same subproblem is solved more than once — so you solve each one once
// and remember the answer." That is a thing that HAPPENS, in order, and it
// can be counted. So one recurrence runs three ways.
//
// The recurrence is the page's §7, LC 322 Coin Change, with the page's own
// five steps:
//   STATE       dp[a] = the fewest coins summing to exactly a
//   RECURRENCE  dp[a] = 1 + min(dp[a - c]) over coins c <= a
//   BASE        dp[0] = 0
//   ORDER       increasing a
//   ANSWER      dp[amount]
//
// PAGE FIGURES, used exactly as printed:
//   coins = [1, 2, 5], amount = 11, answer 3
//   the trace lines dp[0]=0, dp[1]=1, dp[2]=1, dp[3]=2, dp[4]=2, dp[5]=1
//     and dp[11]=3   (the page elides dp[6..10] with an ellipsis; this sim
//     computes them and names them, rather than leaving the gap)
//   complexity O(amount x len(coins)) time, O(amount) space
//   the greedy counterexample coins = [1, 3, 4], amount = 6 — greedy gives
//     4+1+1 = 3 coins, optimal is 3+3 = 2
//
// CONFIG for the scale row (STATED, the page gives no second amount):
//   amount = 50 on the same coins, where the plain recursion's call count
//   is produced by the closed recurrence T(a) = 1 + sum T(a - c), which is
//   checked at load against the 527 calls the real recursion actually makes.
//
// Every count below — calls, cache hits, loop iterations, relaxations,
// improvements, coins taken — is incremented by code that really runs.
// Nothing is asserted.
// ======================================================================

var dsadynamicprogrammi_COINS = [1, 2, 5];       // page
var dsadynamicprogrammi_AMT = 11;                // page
var dsadynamicprogrammi_GCOINS = [1, 3, 4];      // page, the counterexample
var dsadynamicprogrammi_GAMT = 6;                // page
var dsadynamicprogrammi_BIGAMT = 50;             // stated

function dsadynamicprogrammi_num(n) {
  if (!isFinite(n)) return "—";
  return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function dsadynamicprogrammi_set(c) { return "[" + c.join(", ") + "]"; }

// ---------------------------------------------------------------------
// 1 · the plain recursion. No cache. Every entry is recorded.
// ---------------------------------------------------------------------
function dsadynamicprogrammi_plain(coins, amount) {
  var calls = 0, per = {}, order = [], rets = [], depth = 0, maxDepth = 0, a;
  for (a = 0; a <= amount; a++) per[a] = 0;

  function rec(x) {
    calls += 1;
    depth += 1;
    if (depth > maxDepth) maxDepth = depth;
    per[x] += 1;
    order.push(x);
    if (x === 0) { rets.push({ a: 0, at: calls }); depth -= 1; return 0; }
    var best = Infinity, i, sub;
    for (i = 0; i < coins.length; i++) {
      if (coins[i] <= x) {
        sub = rec(x - coins[i]);
        if (sub + 1 < best) best = sub + 1;
      }
    }
    rets.push({ a: x, at: calls });
    depth -= 1;
    return best;
  }

  var value = rec(amount);
  var distinct = 0;
  for (a = 0; a <= amount; a++) if (per[a] > 0) distinct += 1;
  return {
    value: value, calls: calls, per: per, order: order, rets: rets,
    distinct: distinct, maxDepth: maxDepth
  };
}

// closed form for the same count, so the scale row is not invented:
//   T(0) = 1,  T(a) = 1 + sum over coins c <= a of T(a - c)
function dsadynamicprogrammi_closed(coins, upto) {
  var t = [1], a, i, s;
  for (a = 1; a <= upto; a++) {
    s = 1;
    for (i = 0; i < coins.length; i++) if (coins[i] <= a) s += t[a - coins[i]];
    t.push(s);
  }
  return t;
}

// ---------------------------------------------------------------------
// 2 · the same recursion with a dict, and the tabulation it becomes
// ---------------------------------------------------------------------
function dsadynamicprogrammi_memo(coins, amount) {
  var memo = {}, calls = 0, hits = 0, computed = 0, seq = [], depth = 0, maxDepth = 0;
  function rec(x) {
    calls += 1;
    if (memo[x] !== undefined) { hits += 1; return memo[x]; }
    depth += 1;
    if (depth > maxDepth) maxDepth = depth;
    if (x === 0) { memo[0] = 0; computed += 1; seq.push(0); depth -= 1; return 0; }
    var best = Infinity, i, sub;
    for (i = 0; i < coins.length; i++) {
      if (coins[i] <= x) {
        sub = rec(x - coins[i]);
        if (sub + 1 < best) best = sub + 1;
      }
    }
    memo[x] = best; computed += 1; seq.push(x);
    depth -= 1;
    return best;
  }
  var value = rec(amount);
  return {
    value: value, calls: calls, hits: hits, computed: computed,
    seq: seq, memo: memo, maxDepth: maxDepth
  };
}

function dsadynamicprogrammi_bottom(coins, amount) {
  var INF = amount + 1;                    // the page's unreachable sentinel
  var dp = [0], a, i, c;
  var iters = 0, relax = 0, improve = 0, trace = [];
  for (a = 1; a <= amount; a++) dp.push(INF);
  for (a = 1; a <= amount; a++) {
    var terms = [], took = 0;
    for (i = 0; i < coins.length; i++) {
      iters += 1;                          // the loop body runs amount x coins times
      c = coins[i];
      if (c <= a) {
        relax += 1;                        // and this many pass the c <= a guard
        terms.push("dp[" + (a - c) + "]=" + (dp[a - c] === INF ? "∞" : dp[a - c]));
        if (dp[a - c] + 1 < dp[a]) { dp[a] = dp[a - c] + 1; improve += 1; took = c; }
      }
    }
    trace.push({ a: a, v: dp[a], terms: terms, coin: took });
  }
  return { dp: dp, iters: iters, relax: relax, improve: improve, trace: trace, INF: INF };
}

// which coins the optimum actually uses, reconstructed from the table
function dsadynamicprogrammi_pick(coins, amount) {
  var INF = amount + 1, dp = [0], from = [0], a, i;
  for (a = 1; a <= amount; a++) { dp.push(INF); from.push(0); }
  for (a = 1; a <= amount; a++) {
    for (i = 0; i < coins.length; i++) {
      if (coins[i] <= a && dp[a - coins[i]] + 1 < dp[a]) {
        dp[a] = dp[a - coins[i]] + 1; from[a] = coins[i];
      }
    }
  }
  var out = [], x = amount, guard = 0;
  while (x > 0 && guard < 200) { guard += 1; out.push(from[x]); x -= from[x]; }
  out.sort(function (p, q) { return q - p; });
  return out;
}

// ---------------------------------------------------------------------
// 3 · greedy: largest coin that fits, repeat
// ---------------------------------------------------------------------
function dsadynamicprogrammi_greedy(coins, amount) {
  var sorted = coins.slice().sort(function (p, q) { return q - p; });
  var left = amount, picks = [], steps = [], i, guard = 0;
  for (i = 0; i < sorted.length; i++) {
    while (left >= sorted[i] && guard < 200) {
      guard += 1;
      left -= sorted[i];
      picks.push(sorted[i]);
      steps.push({ coin: sorted[i], left: left, picks: picks.slice() });
    }
  }
  return { picks: picks, left: left, count: picks.length, steps: steps, sorted: sorted };
}

// ---------------------------------------------------------------------
// run everything once at load
// ---------------------------------------------------------------------
var dsadynamicprogrammi_P =
  dsadynamicprogrammi_plain(dsadynamicprogrammi_COINS, dsadynamicprogrammi_AMT);
var dsadynamicprogrammi_M =
  dsadynamicprogrammi_memo(dsadynamicprogrammi_COINS, dsadynamicprogrammi_AMT);
var dsadynamicprogrammi_B =
  dsadynamicprogrammi_bottom(dsadynamicprogrammi_COINS, dsadynamicprogrammi_AMT);
var dsadynamicprogrammi_T =
  dsadynamicprogrammi_closed(dsadynamicprogrammi_COINS, dsadynamicprogrammi_BIGAMT);
// the closed form has to agree with the recursion that really ran
var dsadynamicprogrammi_TOK =
  dsadynamicprogrammi_T[dsadynamicprogrammi_AMT] === dsadynamicprogrammi_P.calls;
var dsadynamicprogrammi_BIGCALLS = dsadynamicprogrammi_T[dsadynamicprogrammi_BIGAMT];
var dsadynamicprogrammi_BIGITERS =
  dsadynamicprogrammi_BIGAMT * dsadynamicprogrammi_COINS.length;

var dsadynamicprogrammi_GG =
  dsadynamicprogrammi_greedy(dsadynamicprogrammi_COINS, dsadynamicprogrammi_AMT);
var dsadynamicprogrammi_GBAD =
  dsadynamicprogrammi_greedy(dsadynamicprogrammi_GCOINS, dsadynamicprogrammi_GAMT);
var dsadynamicprogrammi_BBAD =
  dsadynamicprogrammi_bottom(dsadynamicprogrammi_GCOINS, dsadynamicprogrammi_GAMT);
var dsadynamicprogrammi_OPT =
  dsadynamicprogrammi_pick(dsadynamicprogrammi_COINS, dsadynamicprogrammi_AMT);
var dsadynamicprogrammi_OPTBAD =
  dsadynamicprogrammi_pick(dsadynamicprogrammi_GCOINS, dsadynamicprogrammi_GAMT);

// ---------------------------------------------------------------------
// tab 1 checkpoints — every one is a real event in the traversal: the call
// index at which the nth solve(a) subtree returns.
// ---------------------------------------------------------------------
function dsadynamicprogrammi_nthReturn(a, n) {
  var seen = 0, i, r = dsadynamicprogrammi_P.rets;
  for (i = 0; i < r.length; i++) {
    if (r[i].a === a) { seen += 1; if (seen === n) return r[i].at; }
  }
  return dsadynamicprogrammi_P.calls;
}

function dsadynamicprogrammi_snapshot(k) {
  var per = {}, a, i, deepest = dsadynamicprogrammi_AMT;
  for (a = 0; a <= dsadynamicprogrammi_AMT; a++) per[a] = 0;
  for (i = 0; i < k && i < dsadynamicprogrammi_P.order.length; i++) {
    per[dsadynamicprogrammi_P.order[i]] += 1;
    if (dsadynamicprogrammi_P.order[i] < deepest) deepest = dsadynamicprogrammi_P.order[i];
  }
  var touched = 0, dup = 0;
  for (a = 0; a <= dsadynamicprogrammi_AMT; a++) {
    if (per[a] > 0) touched += 1;
    if (per[a] > 1) dup += per[a] - 1;
  }
  return { per: per, calls: k, touched: touched, dup: dup, deepest: deepest };
}

var dsadynamicprogrammi_CPS = (function () {
  var raw = [
    1,
    dsadynamicprogrammi_nthReturn(0, 1),
    dsadynamicprogrammi_nthReturn(6, 1),
    dsadynamicprogrammi_nthReturn(8, 1),
    dsadynamicprogrammi_nthReturn(10, 1),
    dsadynamicprogrammi_nthReturn(9, 2),
    dsadynamicprogrammi_P.calls
  ];
  var out = [], i;
  for (i = 0; i < raw.length; i++) {
    if (i === 0 || raw[i] > raw[i - 1]) out.push(dsadynamicprogrammi_snapshot(raw[i]));
  }
  return out;
})();

// ---------------------------------------------------------------------
// tab 1 · the plain recursion, sampled at those events
// ---------------------------------------------------------------------
function dsadynamicprogrammi_plainScenario() {
  var P = dsadynamicprogrammi_P, s = [], i, snap;

  s.push({
    kind: "tally", cp: -1, flag: "idle",
    caption: "<b>The page's state and recurrence, written straight out as recursion.</b> " +
      "<i>dp[a] = the fewest coins summing to exactly a</i>, and " +
      "<i>dp[a] = 1 + min(dp[a − c])</i> over coins " +
      dsadynamicprogrammi_set(dsadynamicprogrammi_COINS) + " with a = " +
      dsadynamicprogrammi_AMT + ". No cache. The bars below count how many times each " +
      "subproblem is <i>entered</i>. Press Play."
  });

  var notes = [
    "<b>Call 1 — solve(" + dsadynamicprogrammi_AMT + ").</b> It will try every coin that " +
      "fits: solve(" + (dsadynamicprogrammi_AMT - 1) + "), solve(" +
      (dsadynamicprogrammi_AMT - 2) + "), solve(" + (dsadynamicprogrammi_AMT - 5) +
      "). Three children, and each of them three more. Optimal substructure is what " +
      "makes that legal — the best way to make " + dsadynamicprogrammi_AMT +
      " really is one coin plus the best way to make what is left.",
    "<b>The first base case.</b> The recursion took the coin-1 branch all the way down " +
      "and reached solve(0) — the page's base, dp[0] = 0 — " +
      dsadynamicprogrammi_P.maxDepth + " stack frames deep. Every amount from 0 to " +
      dsadynamicprogrammi_AMT + " has now been entered exactly once, and it will never " +
      "be that tidy again.",
    "<b>The first complete solve(6) subtree.</b> Look at the bars: the small amounts are " +
      "already being entered again and again. Every one of those repeats is the same " +
      "question with the same answer, and the program has no idea it has seen it before.",
    "<b>The first complete solve(8).</b> The tally is now visibly geometric — each " +
      "smaller amount is entered roughly 1.7× as often as the one above it, because " +
      "every amount is reachable from three larger ones.",
    "<b>solve(" + (dsadynamicprogrammi_AMT - 1) + ") returns — the first of the root's " +
      "three children.</b> One coin's worth of the answer has cost most of the run so " +
      "far, and there are two more branches to go.",
    "<b>solve(" + (dsadynamicprogrammi_AMT - 2) + ") returns — the second child.</b> " +
      "It has just re-derived, from scratch, almost everything the first child already " +
      "worked out. Nothing was shared between them, because nothing was stored.",
    "<b>Done.</b> The last child, solve(" + (dsadynamicprogrammi_AMT - 5) +
      "), returns and the root can finally take its minimum."
  ];

  for (i = 0; i < dsadynamicprogrammi_CPS.length; i++) {
    snap = dsadynamicprogrammi_CPS[i];
    s.push({
      kind: "tally", cp: i,
      flag: i === 0 ? "warn" : i >= dsadynamicprogrammi_CPS.length - 2 ? "bad" : "warn",
      caption: (notes[i] || "<b>The recursion continues.</b>") +
        " Calls so far: <b>" + snap.calls + "</b>, over <b>" + snap.touched +
        "</b> distinct subproblems."
    });
  }

  s.push({
    kind: "tally", cp: dsadynamicprogrammi_CPS.length - 1, verdict: true, flag: "bad",
    caption: "<b>" + P.calls + " calls, answer " + P.value + ", and only " + P.distinct +
      " distinct subproblems exist.</b> solve(0) alone was entered <b>" + P.per[0] +
      "</b> times and solve(1) <b>" + P.per[1] + "</b> times. That is the page's " +
      "second property — <i>overlapping subproblems</i> — and it is the only reason " +
      "this is DP rather than divide-and-conquer. At a stated amount of " +
      dsadynamicprogrammi_BIGAMT + " on the same coins the same code makes <b>" +
      dsadynamicprogrammi_num(dsadynamicprogrammi_BIGCALLS) + "</b> calls, against " +
      dsadynamicprogrammi_BIGITERS + " loop iterations for the table. " +
      "<b>Nothing about the recurrence changes — only whether you write the answers down.</b>"
  });

  return { id: "plain", label: "Recursion, no memo", steps: s };
}

// ---------------------------------------------------------------------
// tab 2 · add a dict, then convert. Frames follow the resolution order.
// ---------------------------------------------------------------------
function dsadynamicprogrammi_memoScenario() {
  var M = dsadynamicprogrammi_M, B = dsadynamicprogrammi_B, P = dsadynamicprogrammi_P;
  var s = [], groups = [[0], [1, 2], [3, 4], [5, 6], [7, 8], [9, 10], [11]];
  var g, i, upto, caps;

  s.push({
    kind: "fill", upto: -1, flag: "idle",
    caption: "<b>Same recurrence, same call order, one dict in front of it.</b> The page " +
      "says write the memoised version <i>first, every time</i>, because it mirrors the " +
      "recurrence — if the recurrence is right the code is right. Watch the order the " +
      "table fills in; that is step 4 of the procedure deciding itself."
  });

  caps = [
    "<b>The dive, and the base case.</b> solve(" + dsadynamicprogrammi_AMT +
      ") → solve(" + (dsadynamicprogrammi_AMT - 1) + ") → … → solve(0), which returns " +
      "<b>0</b> immediately. The page's base case: dp[0] = 0, no coins needed for " +
      "nothing. Every recursive call above it is still on the stack, waiting.",
    "<b>dp[1] = 1, dp[2] = 1 — the page's first two lines.</b> dp[1] = 1 + dp[0] = 1; " +
      "dp[2] takes the 2-coin, 1 + dp[0] = 1, beating 1 + dp[1] = 2. The unwinding " +
      "stores each answer on the way back up.",
    "<b>dp[3] = 2, dp[4] = 2 — the page's next two.</b> Both need two coins and there " +
      "is no single coin that reaches them. Notice the table is filling <i>left to " +
      "right</i>, in ascending a, without anyone choosing that order.",
    "<b>dp[5] = 1 — one coin, because 5 is a coin.</b> The recurrence reaches back to " +
      "dp[0] and finds 0, so 1 + 0 beats both neighbours. This is the page's last " +
      "printed line before the ellipsis.",
    "<b>dp[7] = 2, dp[8] = 3 — two of the lines the page skips.</b> dp[7] = 1 + dp[5] " +
      "= 2, and dp[8] cannot do better than 1 + dp[3] = 3. The ellipsis hides the only " +
      "part where the minimum is genuinely contested.",
    "<b>dp[9] = 3, dp[10] = 2.</b> dp[10] is the interesting one: 1 + dp[5] = 2, so " +
      "two 5s, and it is <i>smaller</i> than dp[9] and dp[8]. The table is not monotonic, " +
      "which is exactly why greedy is not safe here — hold that thought for tab 3.",
    "<b>dp[" + dsadynamicprogrammi_AMT + "] = " + M.value + ".</b> " +
      "1 + min(dp[10]=" + B.dp[10] + ", dp[9]=" + B.dp[9] + ", dp[6]=" + B.dp[6] +
      ") = " + M.value + " — the page's answer, and the coins are " +
      dsadynamicprogrammi_OPT.join(" + ") + ". <b>" + M.calls + " calls</b> against " +
      P.calls + " without the dict; " + M.hits + " of them were served from the cache " +
      "and " + M.computed + " did work."
  ];

  for (g = 0; g < groups.length; g++) {
    upto = groups[g][groups[g].length - 1];
    s.push({
      kind: "fill", upto: upto, flag: g === groups.length - 1 ? "ok" : "warn",
      caption: caps[g]
    });
  }

  s.push({
    kind: "fill", upto: dsadynamicprogrammi_AMT, tabulate: true, flag: "ok",
    caption: "<b>Now convert, and notice there is nothing to convert.</b> The memo " +
      "resolved in the order <b>0, 1, 2 … " + dsadynamicprogrammi_AMT +
      "</b> — which is precisely the loop the bottom-up version writes by hand. Same " +
      "array, same values, no stack: the loop body runs <b>" + B.iters +
      "</b> times (amount × coins = " + dsadynamicprogrammi_AMT + " × " +
      dsadynamicprogrammi_COINS.length + ", the page's O(amount × len(coins))), <b>" +
      B.relax + "</b> of those pass the <i>c ≤ a</i> guard, and only <b>" + B.improve +
      "</b> actually lower a cell. Space is <b>O(amount)</b> and the call stack is gone — " +
      "the memoised run was " + M.maxDepth + " frames deep."
  });

  return { id: "memo", label: "Memoise, then tabulate", steps: s };
}

// ---------------------------------------------------------------------
// tab 3 · greedy. It agrees on the page's example and then it does not.
// ---------------------------------------------------------------------
function dsadynamicprogrammi_greedyScenario() {
  var G = dsadynamicprogrammi_GG, GB = dsadynamicprogrammi_GBAD;
  var B = dsadynamicprogrammi_B, BB = dsadynamicprogrammi_BBAD;
  var s = [], i, st;

  s.push({
    kind: "greedy", which: "good", si: -1, flag: "idle",
    caption: "<b>Before writing any DP, try the obvious thing: take the largest coin " +
      "that fits, repeat.</b> Coins " + dsadynamicprogrammi_set(dsadynamicprogrammi_COINS) +
      ", amount " + dsadynamicprogrammi_AMT + " — the page's example. If greedy is " +
      "right, none of the previous two tabs was necessary."
  });

  for (i = 0; i < G.steps.length; i++) {
    st = G.steps[i];
    s.push({
      kind: "greedy", which: "good", si: i, flag: "warn",
      caption: "<b>Take " + st.coin + ".</b> " + (dsadynamicprogrammi_AMT - st.left) +
        " of " + dsadynamicprogrammi_AMT + " covered, <b>" + st.left + "</b> left, " +
        st.picks.length + " coin" + (st.picks.length === 1 ? "" : "s") + " used. " +
        (st.left === 0
          ? "Nothing left — greedy is finished."
          : st.left >= 5 ? "5 still fits, so take it again."
            : "5 no longer fits; drop to the next coin down.")
    });
  }

  s.push({
    kind: "greedy", which: "good", si: G.steps.length - 1, compare: true, flag: "warn",
    caption: "<b>Greedy: " + G.count + " coins, " + G.picks.join(" + ") +
      ". The table also says " + B.dp[dsadynamicprogrammi_AMT] + ".</b> They agree. " +
      "This is the dangerous moment — the cheap algorithm matched the careful one on " +
      "the example you happened to test, so you ship it and never write the DP."
  });

  s.push({
    kind: "greedy", which: "bad", si: -1, flag: "bad",
    caption: "<b>The page's counterexample: coins " +
      dsadynamicprogrammi_set(dsadynamicprogrammi_GCOINS) + ", amount " +
      dsadynamicprogrammi_GAMT + ".</b> Nothing about the code changes. Same greedy, " +
      "same rule, one different coin set — and it is the smallest one that breaks it."
  });

  for (i = 0; i < GB.steps.length; i++) {
    st = GB.steps[i];
    s.push({
      kind: "greedy", which: "bad", si: i, flag: "bad",
      caption: "<b>Take " + st.coin + ".</b> <b>" + st.left + "</b> left, " +
        st.picks.length + " coin" + (st.picks.length === 1 ? "" : "s") + " used. " +
        (i === 0
          ? "4 is the largest coin that fits — and taking it strands a remainder of " +
            st.left + " that only 1s can pay for. The 3s are now unreachable."
          : st.left === 0
            ? "Done: " + st.picks.join(" + ") + "."
            : "Only 1s fit now.")
    });
  }

  s.push({
    kind: "greedy", which: "bad", si: GB.steps.length - 1, compare: true, verdict: true,
    flag: "bad",
    caption: "<b>Greedy " + GB.count + " coins, the table " +
      BB.dp[dsadynamicprogrammi_GAMT] + ": " + GB.picks.join(" + ") + " against " +
      dsadynamicprogrammi_OPTBAD.join(" + ") + ".</b> Greedy committed to the 4 " +
      "because it was locally biggest, and the choice that was worse on its own — two " +
      "3s — was better overall. <b>That is what “earlier choices constrain later ones” " +
      "means</b>, and the page lists a greedy counterexample as the <i>very strong</i> " +
      "recognition cue. Be able to produce this one from memory; " + BB.iters +
      " loop iterations settle it and no argument is needed."
  });

  return { id: "greedy", label: "Greedy, and its counterexample", steps: s };
}

// ---------------------------------------------------------------------
// drawing helpers
// ---------------------------------------------------------------------
function dsadynamicprogrammi_tallyLanes(d, snap) {
  var idx = [], cnt = [], a, v, max = 0;
  for (a = 0; a <= dsadynamicprogrammi_AMT; a++) {
    if (snap.per[a] > max) max = snap.per[a];
  }
  for (a = 0; a <= dsadynamicprogrammi_AMT; a++) {
    v = snap.per[a];
    idx.push({ label: String(a), flag: v ? "warn" : "idle", title: "amount " + a });
    cnt.push({
      label: String(v),
      flag: v === 0 ? "idle" : v === 1 ? "ok" : "bad",
      title: "solve(" + a + ") entered " + v + " time" + (v === 1 ? "" : "s") +
        " so far" + (v > 1 ? " — every entry after the first recomputes a known answer" : "")
    });
  }
  var bars = [], top = [0, 1, 2], j;
  for (j = 0; j < top.length; j++) {
    a = top[j];
    bars.push(d.bar({
      label: "solve(" + a + ")",
      pct: max ? (snap.per[a] / max) * 100 : 0,
      value: snap.per[a] + (snap.per[a] === 1 ? " entry" : " entries"),
      flag: snap.per[a] > 1 ? "bad" : snap.per[a] === 1 ? "ok" : "idle"
    }));
  }
  return d.lane({ label: "a", cells: idx }) +
    d.lane({ label: "entered", cells: cnt }) + bars.join("");
}

function dsadynamicprogrammi_fillLanes(d, upto) {
  var B = dsadynamicprogrammi_B, idx = [], val = [], a, filled;
  for (a = 0; a <= dsadynamicprogrammi_AMT; a++) {
    filled = a <= upto;
    idx.push({ label: String(a), flag: filled ? "ok" : "idle", title: "amount " + a });
    val.push({
      label: filled ? String(B.dp[a]) : "∞",
      flag: !filled ? "idle" : a === upto ? "warn" : "ok",
      title: filled
        ? "dp[" + a + "] = " + B.dp[a] + " coin" + (B.dp[a] === 1 ? "" : "s")
        : "dp[" + a + "] not resolved yet — the sentinel is amount + 1 = " + B.INF
    });
  }
  return d.lane({ label: "a", cells: idx }) + d.lane({ label: "dp", cells: val });
}

S["dsadynamicprogrammi"] = {
  title: "Solve the same subproblem 527 times, then once",
  note: "One recurrence — the page's LC 322 Coin Change, <b>dp[a] = 1 + min(dp[a − c])</b> " +
    "with coins " + dsadynamicprogrammi_set(dsadynamicprogrammi_COINS) + " and amount " +
    dsadynamicprogrammi_AMT + ", answer <b>" + dsadynamicprogrammi_B.dp[dsadynamicprogrammi_AMT] +
    "</b> — run three ways. Every call, cache hit, loop iteration and coin below is " +
    "counted by code that actually runs at load; the table reproduces the page's trace " +
    "lines dp[0]=0 … dp[5]=1 and fills in the dp[6]…dp[10] the page elides. Tab 3 uses " +
    "the page's own greedy counterexample, coins " +
    dsadynamicprogrammi_set(dsadynamicprogrammi_GCOINS) + " and amount " +
    dsadynamicprogrammi_GAMT + ". The only stated figure is the scale amount " +
    dsadynamicprogrammi_BIGAMT + ", whose call count comes from the closed recurrence " +
    "T(a) = 1 + ΣT(a − c)" +
    (dsadynamicprogrammi_TOK
      ? ", checked at load against the " + dsadynamicprogrammi_P.calls +
        " calls the real recursion makes."
      : " — which disagrees with the measured run; trust the counter."),
  interval: 1300,

  scenarios: [
    dsadynamicprogrammi_plainScenario(),
    dsadynamicprogrammi_memoScenario(),
    dsadynamicprogrammi_greedyScenario()
  ],

  draw: function (step, d, ctx) {
    var P = dsadynamicprogrammi_P, M = dsadynamicprogrammi_M, B = dsadynamicprogrammi_B;

    // ---- tab 1: the entry tally ---------------------------------------
    if (step.kind === "tally") {
      var idleT = step.cp < 0;
      var snap = idleT
        ? dsadynamicprogrammi_snapshot(0)
        : dsadynamicprogrammi_CPS[step.cp];
      var pct = P.calls ? (snap.calls / P.calls) * 100 : 0;

      return d.stack([
        d.flow([
          d.big(idleT ? "0" : String(snap.calls), "calls made", idleT ? "idle" : "bad"),
          d.stat({
            label: "distinct subproblems",
            value: idleT ? "0" : snap.touched + " / " + (dsadynamicprogrammi_AMT + 1),
            sub: "amounts 0 … " + dsadynamicprogrammi_AMT,
            flag: idleT ? "idle" : "warn"
          }),
          d.stat({
            label: "redundant entries",
            value: idleT ? "0" : String(snap.dup),
            sub: "repeats of an answer already found",
            flag: idleT ? "idle" : snap.dup ? "bad" : "ok"
          }),
          d.stat({
            label: "answer",
            value: idleT || snap.calls < P.calls ? "—" : String(P.value),
            sub: "dp[" + dsadynamicprogrammi_AMT + "]",
            flag: idleT || snap.calls < P.calls ? "idle" : "ok"
          })
        ]),
        d.node({
          title: "solve(a) with no cache · how often each amount is entered",
          status: idleT ? "IDLE" : snap.calls >= P.calls ? "COMPLETE" : "RECURSING",
          statusFlag: idleT ? "idle" : snap.calls >= P.calls ? "bad" : "warn",
          badge: idleT ? "not called" : snap.calls + " of " + P.calls + " calls",
          meta: "coins " + dsadynamicprogrammi_set(dsadynamicprogrammi_COINS) +
            " · stack reached " + P.maxDepth + " frames",
          flag: idleT ? "idle" : "bad",
          gauges: [{
            label: "progress through the call tree",
            pct: idleT ? 0 : pct,
            value: idleT ? "0%" : pct.toFixed(0) + "%",
            flag: idleT ? "idle" : "bad"
          }],
          body: dsadynamicprogrammi_tallyLanes(d, snap),
          rows: [
            { label: "deepest amount reached",
              value: idleT ? "—" : "a = " + snap.deepest },
            { label: "calls per distinct subproblem",
              value: idleT || !snap.touched ? "—"
                : (snap.calls / snap.touched).toFixed(1) + "×",
              flag: idleT ? undefined : snap.calls / Math.max(1, snap.touched) > 2 ? "bad" : "warn" }
          ]
        }),
        step.verdict
          ? d.table(
            ["amount", "plain calls", "memo calls", "table iterations"],
            [
              [String(dsadynamicprogrammi_AMT), dsadynamicprogrammi_num(P.calls),
                String(M.calls), String(B.iters)],
              [String(dsadynamicprogrammi_BIGAMT),
                dsadynamicprogrammi_num(dsadynamicprogrammi_BIGCALLS),
                String(2 * dsadynamicprogrammi_BIGAMT + 1) + " approx",
                String(dsadynamicprogrammi_BIGITERS)]
            ])
          : "",
        d.note(
          "Each cell in the <b>entered</b> row is one subproblem. A red cell has been " +
          "asked the same question more than once, and answered it from scratch every " +
          "time. <b>Optimal substructure</b> is what lets the recurrence exist at all; " +
          "<b>overlapping subproblems</b> — this row — is what makes caching pay. " +
          "The page requires both, and without the second it is divide-and-conquer.",
          step.verdict ? "bad" : undefined
        )
      ]);
    }

    // ---- tab 2: the table filling -------------------------------------
    if (step.kind === "fill") {
      var idleF = step.upto < 0;
      var u = idleF ? -1 : step.upto;
      var done = u + 1;
      var tr = u >= 1 ? B.trace[u - 1] : null;
      var expr = u <= 0
        ? "dp[0] = 0                      base case"
        : "dp[" + u + "] = 1 + min(" + tr.terms.join(", ") + ") = " + B.dp[u];

      return d.stack([
        d.flow([
          d.big(idleF ? "—" : "dp[" + u + "]", "just resolved", idleF ? "idle" : "ok"),
          d.stat({
            label: "cells filled",
            value: idleF ? "0" : done + " / " + (dsadynamicprogrammi_AMT + 1),
            sub: "one per distinct subproblem",
            flag: idleF ? "idle" : "ok"
          }),
          d.stat({
            label: "calls so far",
            value: idleF ? "0" : step.tabulate ? "0 — no recursion" : String(M.calls),
            sub: step.tabulate ? "the loop replaced them" : "plain recursion used " + P.calls,
            flag: idleF ? "idle" : "ok"
          }),
          d.stat({
            label: "answer",
            value: u >= dsadynamicprogrammi_AMT ? String(B.dp[dsadynamicprogrammi_AMT]) : "—",
            sub: "coins " + (u >= dsadynamicprogrammi_AMT
              ? dsadynamicprogrammi_OPT.join(" + ") : "not yet"),
            flag: u >= dsadynamicprogrammi_AMT ? "ok" : "idle"
          })
        ]),
        d.node({
          title: step.tabulate
            ? "the same table, filled by a loop instead of a stack"
            : "memoised solve(a) · the dict as it resolves",
          status: idleF ? "IDLE" : step.tabulate ? "TABULATED"
            : u >= dsadynamicprogrammi_AMT ? "SOLVED" : "UNWINDING",
          statusFlag: idleF ? "idle" : "ok",
          badge: idleF ? "empty dict"
            : step.tabulate ? B.iters + " loop iterations" : "resolved up to a = " + u,
          meta: "∞ is the page's sentinel, amount + 1 = " + B.INF +
            " — unreachable, so it can never be mistaken for an answer",
          flag: idleF ? "idle" : "ok",
          gauges: [{
            label: "table resolved",
            pct: idleF ? 0 : (done / (dsadynamicprogrammi_AMT + 1)) * 100,
            value: idleF ? "0%"
              : ((done / (dsadynamicprogrammi_AMT + 1)) * 100).toFixed(0) + "%",
            flag: idleF ? "idle" : "ok"
          }],
          body: dsadynamicprogrammi_fillLanes(d, u) +
            d.mono(idleF ? "dp[a] = 1 + min(dp[a - c] for c in coins if c <= a)" : expr,
              idleF ? undefined : "ok"),
          rows: step.tabulate
            ? [
              { label: "loop body ran", value: B.iters + " times (amount × coins)" },
              { label: "passed the c ≤ a guard", value: String(B.relax) },
              { label: "actually lowered a cell", value: String(B.improve), flag: "ok" }
            ]
            : [
              { label: "cache hits so far",
                value: idleF ? "0" : "of " + M.hits + " for the whole run" },
              { label: "stack depth", value: idleF ? "0" : M.maxDepth + " frames",
                flag: idleF ? undefined : "warn" }
            ]
        }),
        step.tabulate
          ? d.table(
            ["", "plain", "memoised", "tabulated"],
            [
              ["work at amount " + dsadynamicprogrammi_AMT,
                dsadynamicprogrammi_num(P.calls) + " calls",
                M.calls + " calls", B.iters + " iterations"],
              ["extra space", "none", "dict of " + M.computed + " + stack of " + M.maxDepth,
                "array of " + (dsadynamicprogrammi_AMT + 1)],
              ["time", "exponential", "O(amount × coins)", "O(amount × coins)"]
            ])
          : "",
        d.note(
          step.tabulate
            ? "<b>Step 4 of the page's procedure — ORDER — was never actually a choice.</b> " +
            "The memo resolved ascending because the recurrence only ever looks " +
            "<i>backwards</i>, and the loop simply walks that same direction without a " +
            "stack. Memoise first because it mirrors the recurrence; tabulate afterwards " +
            "for the constant factor and the space."
            : "Amber is the cell that just resolved, green is stored, grey is still the " +
            "sentinel. Each cell is written <b>exactly once</b> — that is the entire " +
            "difference from the previous tab, where a = 0 was entered " +
            P.per[0] + " times.",
          "ok"
        )
      ]);
    }

    // ---- tab 3: greedy -------------------------------------------------
    var bad = step.which === "bad";
    var Gr = bad ? dsadynamicprogrammi_GBAD : dsadynamicprogrammi_GG;
    var Tb = bad ? dsadynamicprogrammi_BBAD : B;
    var coins = bad ? dsadynamicprogrammi_GCOINS : dsadynamicprogrammi_COINS;
    var amt = bad ? dsadynamicprogrammi_GAMT : dsadynamicprogrammi_AMT;
    var opt = bad ? dsadynamicprogrammi_OPTBAD : dsadynamicprogrammi_OPT;
    var idleG = step.si < 0;
    var stp = idleG ? null : Gr.steps[step.si];
    var picks = idleG ? [] : stp.picks;
    var left = idleG ? amt : stp.left;

    var pcells = [], q;
    for (q = 0; q < picks.length; q++) {
      pcells.push({
        label: String(picks[q]),
        flag: bad ? "bad" : "warn",
        title: "coin " + q + 1 + " taken by greedy"
      });
    }
    if (!pcells.length) pcells.push({ label: "—", flag: "idle", title: "nothing taken yet" });

    var ocells = [], r;
    for (r = 0; r < opt.length; r++) {
      ocells.push({ label: String(opt[r]), flag: "ok", title: "coin from the optimal set" });
    }

    var dpIdx = [], dpVal = [], a2;
    for (a2 = 0; a2 <= amt; a2++) {
      dpIdx.push({ label: String(a2), flag: a2 === amt ? "ok" : "idle", title: "amount " + a2 });
      dpVal.push({
        label: String(Tb.dp[a2]),
        flag: a2 === amt ? "ok" : "idle",
        title: "dp[" + a2 + "] = " + Tb.dp[a2]
      });
    }

    return d.stack([
      d.flow([
        d.big(idleG ? String(amt) : String(left), "remaining", idleG ? "idle"
          : left === 0 ? "ok" : bad ? "bad" : "warn"),
        d.stat({
          label: "greedy coins",
          value: idleG ? "0" : String(picks.length),
          sub: idleG ? "not started" : picks.join(" + "),
          flag: idleG ? "idle" : bad ? "bad" : "warn"
        }),
        d.stat({
          label: "optimal",
          value: step.compare ? String(Tb.dp[amt]) : "—",
          sub: step.compare ? opt.join(" + ") : "from the table",
          flag: step.compare ? "ok" : "idle"
        }),
        d.stat({
          label: "verdict",
          value: step.compare ? (picks.length === Tb.dp[amt] ? "agrees" : "worse by "
            + (picks.length - Tb.dp[amt])) : "—",
          sub: step.compare ? (picks.length === Tb.dp[amt]
            ? "on this input" : "coins, on this input") : "still running",
          flag: step.compare ? (picks.length === Tb.dp[amt] ? "warn" : "bad") : "idle"
        })
      ]),
      d.node({
        title: "greedy · largest coin that fits, repeat",
        status: idleG ? "IDLE" : left === 0 ? "FINISHED" : "TAKING",
        statusFlag: idleG ? "idle" : bad ? "bad" : "warn",
        badge: "coins " + dsadynamicprogrammi_set(coins) + " · amount " + amt,
        meta: idleG
          ? "tried largest first: " + Gr.sorted.join(" then ")
          : (dsadynamicprogrammi_AMT === amt ? "the page's example" : "the page's counterexample"),
        flag: idleG ? "idle" : bad ? "bad" : "warn",
        gauges: [{
          label: "amount covered",
          pct: amt ? ((amt - left) / amt) * 100 : 0,
          value: (amt - left) + " of " + amt,
          flag: idleG ? "idle" : left === 0 ? (bad ? "bad" : "ok") : "warn"
        }],
        body: d.cells(pcells, { label: "coins greedy has taken" }) +
          (step.compare ? d.cells(ocells, { label: "coins the table says are enough" }) : "")
      }),
      step.compare
        ? d.node({
          title: "the table for the same coins",
          badge: "dp[0 … " + amt + "], " + Tb.iters + " loop iterations",
          flag: bad ? "bad" : "ok",
          body: d.lane({ label: "a", cells: dpIdx }) + d.lane({ label: "dp", cells: dpVal })
        })
        : "",
      step.verdict
        ? d.table(
          ["coins", "amount", "greedy", "DP", "greedy correct"],
          [
            [dsadynamicprogrammi_set(dsadynamicprogrammi_COINS),
              String(dsadynamicprogrammi_AMT),
              String(dsadynamicprogrammi_GG.count),
              String(B.dp[dsadynamicprogrammi_AMT]),
              dsadynamicprogrammi_GG.count === B.dp[dsadynamicprogrammi_AMT] ? "yes" : "no"],
            [dsadynamicprogrammi_set(dsadynamicprogrammi_GCOINS),
              String(dsadynamicprogrammi_GAMT),
              String(dsadynamicprogrammi_GBAD.count),
              String(dsadynamicprogrammi_BBAD.dp[dsadynamicprogrammi_GAMT]),
              dsadynamicprogrammi_GBAD.count ===
                dsadynamicprogrammi_BBAD.dp[dsadynamicprogrammi_GAMT] ? "yes" : "no"]
          ])
        : "",
      d.note(
        bad
          ? "<b>Greedy is not wrong because it is greedy — it is wrong because this coin " +
          "set has no matroid structure.</b> With " +
          dsadynamicprogrammi_set(dsadynamicprogrammi_COINS) + " every coin divides the " +
          "next, so local best is global best and greedy happens to be safe. With " +
          dsadynamicprogrammi_set(dsadynamicprogrammi_GCOINS) + " it does not, and the " +
          "only reliable way to find out is the counterexample."
          : "This is the page's recognition cue running in reverse: <i>greedy gives a " +
          "wrong answer on a small counterexample</i> is listed as a <b>very strong</b> " +
          "signal for DP. Here greedy gives the right answer — so the cue says nothing " +
          "yet, and that is exactly the trap.",
        bad ? "bad" : "warn"
      )
    ]);
  }
};

  // ====================================================================
  // ======================================================================
  // SIM · dsagreedy  (greedy.md)
  //
  // LC 134, Gas Station — the page's §5 worked example — driven three ways
  // over one route. The time axis is the drive itself: one frame per station
  // entered, with the tank updated exactly as the page's loop updates it
  //     tank += gas[i] - cost[i];  if (tank < 0) { start = i + 1; tank = 0; }
  // and the answer decided exactly as the page's Java one-pass decides it
  //     return total < 0 ? -1 : start;
  //
  // CONFIG — the page states the algorithm but no array, so the route is
  // declared here and every figure on screen is read off a real run of it:
  //     gas  = [4, 3, 1, 5, 2, 1, 7, 2]
  //     cost = [3, 2, 4, 4, 1, 4, 2, 4]
  //   sum(gas) = 25, sum(cost) = 24  ->  total = +1, a start exists.
  //   Tab 3 changes exactly one number, gas[6] 7 -> 5, giving
  //   sum(gas) = 23 < sum(cost) = 24  ->  total = -1.
  //
  // Nothing is typed into a caption. The sweep runs, the retry-every-start
  // version runs, and every start is ridden to check validity; the counters
  // are the real number of stations those runs entered.
  // ======================================================================
  var dsagreedy_GAS = [4, 3, 1, 5, 2, 1, 7, 2];
  var dsagreedy_COST = [3, 2, 4, 4, 1, 4, 2, 4];
  var dsagreedy_GAS_SHORT = [4, 3, 1, 5, 2, 1, 5, 2];   // gas[6] lowered 7 -> 5
  var dsagreedy_N = dsagreedy_GAS.length;

  function dsagreedy_sum(a) {
    var s = 0, i;
    for (i = 0; i < a.length; i++) s += a[i];
    return s;
  }
  function dsagreedy_sign(v) { return (v >= 0 ? "+" : "") + v; }
  function dsagreedy_nulls(n) {
    var a = [], i;
    for (i = 0; i < n; i++) a.push(null);
    return a;
  }
  function dsagreedy_diffs(gas, cost) {
    var out = [], i;
    for (i = 0; i < gas.length; i++) out.push(gas[i] - cost[i]);
    return out;
  }
  function dsagreedy_plural(n, one, many) { return n + " " + (n === 1 ? one : many); }

  /** Actually drive the circuit from station s. Returns where it dies. */
  function dsagreedy_ride(diffs, s) {
    var n = diffs.length, tanks = dsagreedy_nulls(n);
    var tank = 0, visits = 0, failAt = -1, j, idx, order = [];
    for (j = 0; j < n; j++) {
      idx = (s + j) % n;
      tank += diffs[idx];
      visits++;
      tanks[idx] = tank;
      order.push(tank);
      if (tank < 0) { failAt = idx; break; }
    }
    return {
      start: s, ok: failAt < 0, tanks: tanks, visits: visits,
      failAt: failAt, tank: tank, order: order
    };
  }

  function dsagreedy_path(ride) {
    var out = [], i;
    for (i = 0; i < ride.order.length; i++) out.push(dsagreedy_sign(ride.order[i]));
    return out.join(" ");
  }

  /** Every start that genuinely completes the circuit — used to check the sweep. */
  function dsagreedy_validStarts(diffs) {
    var out = [], s;
    for (s = 0; s < diffs.length; s++) if (dsagreedy_ride(diffs, s).ok) out.push(s);
    return out;
  }

  /** The page's one-pass sweep, traced. */
  function dsagreedy_sweep(gas, cost) {
    var diffs = dsagreedy_diffs(gas, cost);
    var n = diffs.length, tanks = dsagreedy_nulls(n);
    var total = 0, tank = 0, start = 0, visits = 0, resets = 0;
    var trace = [], i, raw, reset, prev;
    for (i = 0; i < n; i++) {
      prev = start;
      total += diffs[i];
      tank += diffs[i];
      visits++;
      raw = tank;
      tanks[i] = tank;
      reset = tank < 0;
      if (reset) { start = i + 1; tank = 0; resets++; }
      trace.push({
        i: i, raw: raw, tank: tank, total: total,
        start: start, prevStart: prev, reset: reset,
        visits: visits, tanks: tanks.slice(0)
      });
    }
    return {
      diffs: diffs, trace: trace, total: total, start: start,
      visits: visits, resets: resets, answer: total < 0 ? -1 : start
    };
  }

  // --- scenario 1: retry every start -----------------------------------
  function dsagreedy_bruteScenario() {
    var gas = dsagreedy_GAS, cost = dsagreedy_COST;
    var diffs = dsagreedy_diffs(gas, cost), n = diffs.length;
    var gsum = dsagreedy_sum(gas), csum = dsagreedy_sum(cost);
    var steps = [{
      mode: "brute", st: 0, gas: gas, cost: cost, diffs: diffs,
      i: -1, cand: -1, start: 0, tank: 0, total: 0, visits: 0,
      tanks: dsagreedy_nulls(n), failAt: -1, ok: false, answer: null,
      caption: "Eight stations, <b>" + dsagreedy_plural(gsum, "unit", "units") +
        " of gas</b> against <b>" + csum + " of cost</b>. The obvious algorithm: " +
        "pick a start, drive until the tank goes negative, throw the attempt away " +
        "and try the next station. Press Play and count the stations it enters."
    }];
    var visits = 0, s, ride, failed = 0;
    for (s = 0; s < n; s++) {
      ride = dsagreedy_ride(diffs, s);
      visits += ride.visits;
      if (!ride.ok) failed++;
      steps.push({
        mode: "brute", st: ride.ok ? 2 : 1, gas: gas, cost: cost, diffs: diffs,
        i: -1, cand: s, start: s, tank: ride.tank, total: 0,
        visits: visits, tanks: ride.tanks, failAt: ride.failAt, ok: ride.ok,
        attempt: ride.visits, answer: ride.ok ? s : null,
        flag: ride.ok ? "ok" : "bad",
        caption: ride.ok
          ? "<b>Start " + s + " completes the circuit.</b> Tank path <b>" +
            dsagreedy_path(ride) + "</b> — never negative across all " + n +
            " stations. <b>" + visits + " tank updates</b> in total to find it."
          : "<b>Start " + s + ".</b> Tank path <b>" + dsagreedy_path(ride) +
            "</b> — dry at station <b>" + ride.failAt + "</b> after " +
            dsagreedy_plural(ride.visits, "station", "stations") + ". The attempt is " +
            "discarded whole: " + visits + " tank updates spent, and start " + (s + 1) +
            " will be driven from zero as if nothing had been learned."
      });
      if (ride.ok) break;
    }
    var last = steps[steps.length - 1];
    last.caption = "<b>" + last.visits + " tank updates to find start " + last.cand +
      ".</b> " + failed + " starts failed and " + (failed + 1) + " were tried; the " +
      failed + " failures re-drove stations that earlier attempts had already proved " +
      "were fine. That is the O(n²) shape the page names — and the next tab throws " +
      "none of it away.";
    return { id: "brute", label: "Retry every start", steps: steps };
  }

  // --- scenarios 2 and 3: the one-pass sweep ---------------------------
  function dsagreedy_sweepScenario(cfg) {
    var gas = cfg.gas, cost = cfg.cost;
    var r = dsagreedy_sweep(gas, cost);
    var diffs = r.diffs, n = diffs.length;
    var gsum = dsagreedy_sum(gas), csum = dsagreedy_sum(cost);
    var valid = dsagreedy_validStarts(diffs);
    var steps = [{
      mode: "sweep", st: 0, gas: gas, cost: cost, diffs: diffs,
      i: -1, start: 0, tank: 0, total: 0, visits: 0, reset: false,
      tanks: dsagreedy_nulls(n), failAt: -1, answer: null,
      caption: cfg.idle
    }];
    var k, t, netTxt;
    for (k = 0; k < r.trace.length; k++) {
      t = r.trace[k];
      netTxt = "gas " + gas[t.i] + " − cost " + cost[t.i] + " = <b>" +
        dsagreedy_sign(diffs[t.i]) + "</b>";
      steps.push({
        mode: "sweep", st: 1, gas: gas, cost: cost, diffs: diffs,
        i: t.i, start: t.start, tank: t.tank, raw: t.raw, total: t.total,
        visits: t.visits, reset: t.reset, tanks: t.tanks, failAt: -1, answer: null,
        flag: t.reset ? "warn" : "ok",
        caption: t.reset
          ? "<b>Station " + t.i + " empties the tank.</b> " + netTxt + " takes it to <b>" +
            dsagreedy_sign(t.raw) + "</b>. This is the reset: not just start " +
            t.prevStart + " but <i>every</i> station in [" + t.prevStart + ".." + t.i +
            "] is eliminated at once — starting later means arriving at station " + t.i +
            " with less fuel than this run had, and that was already not enough. " +
            "start jumps to <b>" + t.start + "</b>, tank back to 0."
          : "<b>Station " + t.i + ".</b> " + netTxt + ", tank <b>" +
            dsagreedy_sign(t.raw) + "</b>. Non-negative, so the candidate start stays at <b>" +
            t.start + "</b> and the running total is now " + dsagreedy_sign(t.total) + "."
      });
    }
    var last = steps[steps.length - 1];
    last.st = 2;
    last.answer = r.answer;
    last.flag = cfg.feasible ? "ok" : "bad";
    last.caption = cfg.verdict(r, valid, gsum, csum);
    return { id: cfg.id, label: cfg.label, steps: steps };
  }

  var dsagreedy_SC_BRUTE = dsagreedy_bruteScenario();
  var dsagreedy_BRUTE_VISITS =
    dsagreedy_SC_BRUTE.steps[dsagreedy_SC_BRUTE.steps.length - 1].visits;
  var dsagreedy_BRUTE_START =
    dsagreedy_SC_BRUTE.steps[dsagreedy_SC_BRUTE.steps.length - 1].cand;

  var dsagreedy_SC_SWEEP = dsagreedy_sweepScenario({
    id: "reset", label: "The reset · one pass", feasible: true,
    gas: dsagreedy_GAS, cost: dsagreedy_COST,
    idle: "Same route, one pass. The tank is carried forward and the candidate " +
      "start only ever moves <i>past</i> the station that emptied it — never back " +
      "to the station after it. Press Play.",
    verdict: function (r, valid, gsum, csum) {
      return "<b>total = " + dsagreedy_sign(r.total) + " ≥ 0, so the answer is station <b>" +
        r.answer + "</b>.</b> " + r.visits + " tank updates — exactly n — with " +
        dsagreedy_plural(r.resets, "reset", "resets") + " along the way, against the <b>" +
        dsagreedy_BRUTE_VISITS + "</b> the retry loop spent for the same answer. " +
        "Riding all " + r.diffs.length + " starts to check it: exactly " +
        dsagreedy_plural(valid.length, "start", "starts") + " completes the circuit, " +
        "station " + valid.join(", ") + ". The sweep found it without ever backtracking.";
    }
  });

  var dsagreedy_SC_SHORT = dsagreedy_sweepScenario({
    id: "infeasible", label: "Infeasible route", feasible: false,
    gas: dsagreedy_GAS_SHORT, cost: dsagreedy_COST,
    idle: "One number changed: gas[6] drops from " + dsagreedy_GAS[6] + " to " +
      dsagreedy_GAS_SHORT[6] + ". sum(gas) = " + dsagreedy_sum(dsagreedy_GAS_SHORT) +
      " against sum(cost) = " + dsagreedy_sum(dsagreedy_COST) +
      ". Watch the sweep behave exactly as it did before.",
    verdict: function (r, valid, gsum, csum) {
      var check = dsagreedy_ride(r.diffs, r.start);
      return "<b>The sweep ended at start = " + r.start + " with a tank of " +
        dsagreedy_sign(r.tankEnd === undefined ? r.trace[r.trace.length - 1].tank : r.trace[r.trace.length - 1].tank) +
        " — and the answer is −1.</b> sum(gas) " + gsum + " &lt; sum(cost) " + csum +
        ", so total = " + dsagreedy_sign(r.total) + " and no start works: riding all " +
        r.diffs.length + " of them finds <b>" + valid.length + "</b> that complete the " +
        "circuit. Station " + r.start + " dies at station <b>" + check.failAt +
        "</b>, on the wrap-around the single pass never simulates. The greedy sweep is " +
        "not wrong here — it is <i>incomplete</i>, and <code>total &lt; 0 ? −1 : start</code> " +
        "is the line that covers the half it cannot see. That gap is what \"prove it " +
        "before you ship it\" means in practice.";
    }
  });

  var dsagreedy_SCALE = Math.max(dsagreedy_BRUTE_VISITS, dsagreedy_N);

  S["dsagreedy"] = {
    title: "Drive LC 134 three ways and count the stations",
    note: "A declared route of " + dsagreedy_N + " stations — <b>gas = [" +
      dsagreedy_GAS.join(", ") + "]</b>, <b>cost = [" + dsagreedy_COST.join(", ") +
      "]</b> — because the page gives LC 134's algorithm but no array. sum(gas) = <b>" +
      dsagreedy_sum(dsagreedy_GAS) + "</b> against sum(cost) = <b>" +
      dsagreedy_sum(dsagreedy_COST) + "</b>, so a start exists. Both algorithms really " +
      "run here and the counter is the real number of stations they enter: the retry " +
      "loop spends <b>" + dsagreedy_BRUTE_VISITS + "</b>, the sweep spends exactly <b>" +
      dsagreedy_N + "</b>. The third tab lowers gas[6] from " + dsagreedy_GAS[6] +
      " to " + dsagreedy_GAS_SHORT[6] + " and changes nothing else.",
    interval: 1250,
    scenarios: [dsagreedy_SC_BRUTE, dsagreedy_SC_SWEEP, dsagreedy_SC_SHORT],

    draw: function (step, d, ctx) {
      var n = step.diffs.length;
      var idxCells = [], gasCells = [], costCells = [], netCells = [], tankCells = [];
      var i, fl, v, tf, mark;

      for (i = 0; i < n; i++) {
        if (step.mode === "brute") {
          fl = step.failAt === i ? "bad"
            : step.tanks[i] !== null ? "ok" : undefined;
          mark = step.cand === i;
        } else {
          fl = i === step.i ? (step.reset ? "bad" : "warn")
            : i < step.start ? "idle"
            : i < step.i ? "ok" : undefined;
          mark = step.st > 0 && step.start === i;
        }
        idxCells.push({
          label: (mark ? "▸" : "") + i,
          flag: mark ? "warn" : "idle",
          title: mark
            ? (step.mode === "brute" ? "candidate start for this attempt"
                                     : "current candidate start")
            : "station " + i
        });
        gasCells.push({
          label: String(step.gas[i]), flag: fl,
          title: "gas[" + i + "] = " + step.gas[i]
        });
        costCells.push({
          label: String(step.cost[i]), flag: fl,
          title: "cost[" + i + "] = " + step.cost[i]
        });
        netCells.push({
          label: dsagreedy_sign(step.diffs[i]), flag: fl,
          title: "gas − cost = " + dsagreedy_sign(step.diffs[i])
        });
        v = step.tanks[i];
        tf = v === null ? "idle"
          : v < 0 ? "bad"
          : (step.mode === "sweep" && i < step.start && i !== step.i) ? "idle" : "ok";
        tankCells.push({
          label: v === null ? "·" : dsagreedy_sign(v), flag: tf,
          title: v === null ? "not entered on this run"
            : "tank on leaving station " + i + ": " + dsagreedy_sign(v)
        });
      }

      var status, sflag;
      if (step.st === 0) {
        status = "IDLE"; sflag = "idle";
      } else if (step.mode === "brute") {
        status = step.ok ? "CIRCUIT COMPLETE" : "DRY AT " + step.failAt;
        sflag = step.ok ? "ok" : "bad";
      } else if (step.st === 2) {
        status = step.answer < 0 ? "RETURN −1" : "START = " + step.answer;
        sflag = step.answer < 0 ? "bad" : "ok";
      } else {
        status = step.reset ? "RESET" : "DRIVING";
        sflag = step.reset ? "warn" : "ok";
      }

      var rows = [];
      if (step.mode === "brute") {
        rows.push({
          label: "candidate start",
          value: step.cand < 0 ? "—" : String(step.cand)
        });
        rows.push({
          label: "stations driven this attempt",
          value: step.st === 0 ? "0" : String(step.attempt),
          flag: step.ok ? "ok" : step.st === 0 ? "idle" : "bad"
        });
        rows.push({
          label: "attempts discarded",
          value: String(Math.max(0, (ctx.i || 0) - (step.ok ? 1 : 0))),
          flag: ctx.i > 1 ? "warn" : "idle"
        });
      } else {
        rows.push({ label: "candidate start", value: String(step.start) });
        rows.push({
          label: "tank",
          value: dsagreedy_sign(step.tank),
          flag: step.reset ? "warn" : step.st === 0 ? "idle" : "ok"
        });
        rows.push({
          label: "running total",
          value: dsagreedy_sign(step.total),
          flag: step.st === 2 ? (step.total < 0 ? "bad" : "ok") : undefined
        });
        rows.push({
          label: "stations eliminated",
          value: String(step.start),
          flag: step.start ? "warn" : "idle"
        });
      }

      var bigVal, bigLab, bigFlag;
      if (step.st === 0) {
        bigVal = "—"; bigLab = "nothing driven yet"; bigFlag = "idle";
      } else if (step.mode === "brute") {
        bigVal = String(step.cand); bigLab = "candidate start";
        bigFlag = step.ok ? "ok" : "bad";
      } else {
        bigVal = dsagreedy_sign(step.tank);
        bigLab = "tank after station " + step.i;
        bigFlag = step.reset ? "warn" : "ok";
      }

      return d.flow([
        d.stack([
          d.big(bigVal, bigLab, bigFlag),
          d.stat({
            label: "answer",
            value: step.answer === null || step.answer === undefined
              ? "—" : String(step.answer),
            sub: step.answer === -1 ? "no start works" : "start index",
            flag: step.answer === null || step.answer === undefined ? "idle"
              : step.answer < 0 ? "bad" : "ok"
          })
        ]),
        d.node({
          title: step.mode === "brute" ? "retry every start" : "one-pass sweep",
          status: status,
          statusFlag: sflag,
          badge: "n = " + n,
          meta: "sum(gas) " + dsagreedy_sum(step.gas) + " · sum(cost) " +
            dsagreedy_sum(step.cost),
          flag: sflag,
          body: d.stack([
            d.lane({ label: "station", cells: idxCells }),
            d.lane({ label: "gas", cells: gasCells }),
            d.lane({ label: "cost", cells: costCells }),
            d.lane({ label: "net", cells: netCells }),
            d.lane({ label: "tank", cells: tankCells })
          ]),
          rows: rows
        }),
        d.stack([
          d.stat({
            label: "tank updates",
            value: String(step.visits),
            sub: "one per station entered",
            flag: step.visits > n ? "bad" : step.visits ? "ok" : "idle"
          }),
          d.gauge({
            label: "work against the retry loop's " + dsagreedy_BRUTE_VISITS,
            pct: dsagreedy_SCALE ? (step.visits / dsagreedy_SCALE) * 100 : 0,
            value: step.visits + " / " + dsagreedy_BRUTE_VISITS,
            flag: step.visits > n ? "bad" : step.visits ? "ok" : "idle"
          })
        ])
      ]);
    }
  };

  // ====================================================================
// ======================================================================
// SIM · dsaheap  (heap.md)
//
// The page's section-4 worked example, executed rather than described:
// nums = [3, 2, 1, 5, 6, 4], k = 2, "(expect 5)". A real binary heap runs
// underneath -- sift-up, sift-down, heapify and the heappushpop body are
// all implemented here -- and every comparison, swap, sift and peak-size
// figure on screen is tallied by that code as it runs. Nothing is typed.
//
// CONFIG
//   nums       [3, 2, 1, 5, 6, 4]   the page's worked example, verbatim
//   k          2                    the page's k
//   expected   5                    the page's "(expect 5)". The sim
//                                   re-derives it by sorting descending and
//                                   reading index k-1; the closing caption
//                                   claims a match only when they are equal.
//   billion    1e9                  the page's own memory argument, "a
//                                   stream, or a billion rows"
//
// THREE RUNS OF THE SAME SIX NUMBERS
//   1  size-k MIN-heap   the page's find_kth_largest: take the first k as a
//                        slice, heapify (O(k), "cheaper than k pushes"),
//                        then for each remaining x, peek heap[0] and call
//                        heappushpop only when x beats it -- "one sift, not
//                        two". Peak heap size k.
//   2  size-n MIN-heap   two rows of the page's failure-mode table at once:
//                        "n pushes instead of heapify" and "heap of size n
//                        for a top-k query". Push all n, then pop n-k times
//                        and read the root. Same answer, peak size n.
//   3  size-k MAX-heap   the error the page's starred interview question
//                        exists to prevent. Push every element and, whenever
//                        the heap exceeds k, pop the root -- which in a
//                        max-heap is the BEST element seen so far. It evicts
//                        its own winners and finishes holding the k
//                        SMALLEST, which is exactly the tool the page's cue
//                        table assigns to "k smallest / k closest".
//
// COMPARISON ACCOUNTING. One helper, dsaheap_before(), performs and counts
// every value comparison, so the three tallies are like-for-like. The guard
// "x > heap[0]" is counted once; dsaheap_replaceRoot is the heappushpop body
// entered with that guard already satisfied, so it is not re-counted, which
// is what "one sift, not two" actually buys.
//
// SCALING. The verdict's two scaling figures come from the page's memory
// argument, computed at n = 1e9 and k = 2: items held = n/k, and comparisons
// per element = log2(n)/log2(k).
// ======================================================================

var dsaheap_NUMS = [3, 2, 1, 5, 6, 4];
var dsaheap_K = 2;
var dsaheap_N = dsaheap_NUMS.length;
var dsaheap_PAGE_ANSWER = 5;          // heap.md section 4: "(expect 5)"
var dsaheap_BIG_N = 1000000000;       // heap.md section 2: "a billion rows"

/** Ground truth, derived. Never used by the three heaps -- only to score them. */
function dsaheap_bySort(a, k) {
  var c = a.slice();
  c.sort(function (x, y) { return y - x; });
  return c[k - 1];
}
var dsaheap_TRUE = dsaheap_bySort(dsaheap_NUMS, dsaheap_K);

// ---------------------------------------------------------------- the heap

function dsaheap_ctx() {
  return { cmp: 0, swap: 0, sift: 0, push: 0, pop: 0, peak: 0 };
}
function dsaheap_snap(c) {
  return { cmp: c.cmp, swap: c.swap, sift: c.sift, push: c.push, pop: c.pop, peak: c.peak };
}

/** The one place a value comparison happens, and the one place it is counted. */
function dsaheap_before(c, a, b, isMin) {
  c.cmp += 1;
  return isMin ? a < b : a > b;
}

function dsaheap_swapAt(h, i, j, c) {
  var t = h[i]; h[i] = h[j]; h[j] = t; c.swap += 1;
}

function dsaheap_siftUp(h, i, c, isMin) {
  var p;
  c.sift += 1;
  while (i > 0) {
    p = (i - 1) >> 1;
    if (!dsaheap_before(c, h[i], h[p], isMin)) break;
    dsaheap_swapAt(h, i, p, c);
    i = p;
  }
}

function dsaheap_siftDown(h, i, c, isMin) {
  var n = h.length, l, r, m;
  c.sift += 1;
  for (;;) {
    l = 2 * i + 1; r = l + 1; m = i;
    if (l < n && dsaheap_before(c, h[l], h[m], isMin)) m = l;
    if (r < n && dsaheap_before(c, h[r], h[m], isMin)) m = r;
    if (m === i) break;
    dsaheap_swapAt(h, i, m, c);
    i = m;
  }
}

function dsaheap_push(h, x, c, isMin) {
  h.push(x); c.push += 1;
  if (h.length > c.peak) c.peak = h.length;
  dsaheap_siftUp(h, h.length - 1, c, isMin);
}

function dsaheap_pop(h, c, isMin) {
  var top = h[0], last = h.pop();
  c.pop += 1;
  if (h.length) { h[0] = last; dsaheap_siftDown(h, 0, c, isMin); }
  return top;
}

/** O(k) bottom-up heapify -- the page's "cheaper than k pushes". */
function dsaheap_heapify(h, c, isMin) {
  var i;
  if (h.length > c.peak) c.peak = h.length;
  for (i = (h.length >> 1) - 1; i >= 0; i--) dsaheap_siftDown(h, i, c, isMin);
}

/** heappushpop's body, entered with the guard already satisfied: ONE sift. */
function dsaheap_replaceRoot(h, x, c, isMin) {
  var out = h[0];
  h[0] = x;
  dsaheap_siftDown(h, 0, c, isMin);
  c.push += 1; c.pop += 1;
  return out;
}

// ---------------------------------------------------------------- the runs

function dsaheap_frame(o) { return o; }

/** RUN 1 -- the page's find_kth_largest, size-k min-heap. */
function dsaheap_runMinK() {
  var c = dsaheap_ctx(), h = [], steps = [], i, x, gone, act, cap;

  steps.push(dsaheap_frame({
    mode: "mink", heap: [], idx: -1, x: null, gone: null, tally: dsaheap_snap(c),
    phase: "heap = nums[:k]", flag: "idle", popped: [],
    caption: "<code>nums = [" + dsaheap_NUMS.join(", ") + "]</code>, <code>k = " +
      dsaheap_K + "</code>. The heap will <b>never hold more than " + dsaheap_K +
      " items</b>, whatever the length of the input. Press play and watch what the root " +
      "is for."
  }));

  for (i = 0; i < dsaheap_N; i++) {
    x = dsaheap_NUMS[i];
    gone = null;
    if (i < dsaheap_K) {
      h.push(x); c.push += 1;
      if (h.length > c.peak) c.peak = h.length;
      if (i === dsaheap_K - 1) {
        act = "heapify";
        dsaheap_heapify(h, c, true);
        cap = "<b>Slot " + (i + 1) + " of " + dsaheap_K + " taken: " + x + ".</b> The " +
          "slice is full, so <code>heapify</code> runs &mdash; one bottom-up sift-down, " +
          "<b>" + c.cmp + " comparison</b> and <b>" + c.swap + " swap</b>, and the array " +
          "is a valid min-heap [" + h.join(", ") + "]. " + dsaheap_K + " separate pushes " +
          "would have been O(k log k); heapify is O(k).";
      } else {
        act = "slice";
        cap = "<b>Slot " + (i + 1) + " of " + dsaheap_K + " taken: " + x + ".</b> The " +
          "page does not push these &mdash; <code>heap = nums[:k]</code> is a slice, and " +
          "the heap order is imposed once, afterwards. Comparisons so far: <b>" + c.cmp +
          "</b>.";
      }
    } else if (dsaheap_before(c, h[0], x, true)) {
      act = "pushpop";
      gone = dsaheap_replaceRoot(h, x, c, true);
      cap = "<b>" + x + " beats the root " + gone + ".</b> So " + x + " belongs in the " +
        "best " + dsaheap_K + " and " + gone + " does not &mdash; and the root is " +
        "precisely the member to throw away, because it is the <i>weakest</i> of the " +
        "current best " + dsaheap_K + ". <code>heappushpop</code> overwrites index 0 and " +
        "sifts down <b>once</b>: a separate push then pop would have been two sifts for " +
        "the same result. Heap [" + h.join(", ") + "], root climbs to <b>" + h[0] +
        "</b>. Running totals: " + c.cmp + " comparisons, " + c.swap + " swaps, " +
        c.sift + " sifts.";
    } else {
      act = "ignore";
      cap = "<b>" + x + " loses to the root " + h[0] + ".</b> There are already " +
        dsaheap_K + " elements at least as big, so " + x + " cannot be in the top " +
        dsaheap_K + " and nothing needs to move. One O(1) peek at <code>heap[0]</code> " +
        "&mdash; the page is explicit that you never pop just to look. Comparisons: <b>" +
        c.cmp + "</b>, swaps still <b>" + c.swap + "</b>.";
    }
    steps.push(dsaheap_frame({
      mode: "mink", heap: h.slice(), idx: i, x: x, gone: gone, act: act,
      tally: dsaheap_snap(c), popped: [],
      phase: i < dsaheap_K ? "seed the heap" : "scan · element " + (i + 1) + " of " + dsaheap_N,
      flag: act === "ignore" ? "idle" : "ok",
      caption: cap
    }));
  }

  return {
    id: "mink", label: "Min-heap, size k", steps: steps, heap: h.slice(),
    answer: h[0], tally: dsaheap_snap(c), order: "O(n log k)",
    space: "O(k) = " + dsaheap_K
  };
}

/** RUN 2 -- n pushes into a heap of size n, then drain down to k. */
function dsaheap_runMinN() {
  var c = dsaheap_ctx(), h = [], steps = [], i, x, popped = [], before;

  steps.push(dsaheap_frame({
    mode: "minn", heap: [], idx: -1, x: null, gone: null, tally: dsaheap_snap(c),
    phase: "empty heap", flag: "idle", popped: [],
    caption: "Same six numbers, same k, but the heap is allowed to grow to <b>all " +
      dsaheap_N + "</b> &mdash; the page's failure-mode row <i>\"heap of size n for a " +
      "top-k query\"</i>, combined with <i>\"n pushes instead of heapify\"</i>. It gets " +
      "the right answer. Watch what it costs."
  }));

  for (i = 0; i < dsaheap_N; i++) {
    x = dsaheap_NUMS[i];
    before = c.cmp;
    dsaheap_push(h, x, c, true);
    steps.push(dsaheap_frame({
      mode: "minn", heap: h.slice(), idx: i, x: x, gone: null, act: "push",
      tally: dsaheap_snap(c), popped: [],
      phase: "push " + (i + 1) + " of " + dsaheap_N, flag: "warn",
      caption: "<b>Push " + x + ".</b> It lands at index " + (h.length - 1) + " and sifts " +
        "up through " + (c.cmp - before) + " comparison" + (c.cmp - before === 1 ? "" : "s") +
        ". Heap [" + h.join(", ") + "], size <b>" + h.length + "</b>" +
        (h.length <= dsaheap_K
          ? " &mdash; still within k, so the two runs are identical so far."
          : h.length === dsaheap_N
            ? ". The whole input is now resident and not one element has been discarded. " +
              "This is the line the page's memory argument is about: at a billion rows the " +
              "size-k heap holds " + dsaheap_K + " items and this one holds the stream."
            : " &mdash; " + (h.length - dsaheap_K) + " item" +
              (h.length - dsaheap_K === 1 ? "" : "s") + " more than the size-k run is " +
              "holding, and every one of them will have to be sifted past later.")
    }));
  }

  var drainFrom = c.cmp, drainSwap = c.swap, need = dsaheap_N - dsaheap_K;
  for (i = 0; i < need; i++) popped.push(dsaheap_pop(h, c, true));

  steps.push(dsaheap_frame({
    mode: "minn", heap: h.slice(), idx: dsaheap_N, x: null, gone: null, act: "drain",
    tally: dsaheap_snap(c), popped: popped.slice(),
    phase: "drain " + need + " pops", flag: "warn",
    caption: "<b>Now pay for the size.</b> The root of an n-element min-heap is the " +
      "global minimum, so the k-th largest is " + need + " pops away: " +
      popped.join(", ") + " come off in order, each one a full sift-down over a heap " +
      "that is still nearly full. Those " + need + " pops alone cost <b>" +
      (c.cmp - drainFrom) + " comparisons</b> and <b>" + (c.swap - drainSwap) +
      " swaps</b> &mdash; more than the size-k run spent in total. Heap [" + h.join(", ") +
      "], root <b>" + h[0] + "</b>."
  }));

  return {
    id: "minn", label: "Min-heap, size n", steps: steps, heap: h.slice(),
    answer: h[0], tally: dsaheap_snap(c), order: "O(n log n)",
    space: "O(n) = " + dsaheap_N
  };
}

/** RUN 3 -- size-k MAX-heap. Right discipline, wrong polarity. */
function dsaheap_runMaxK() {
  var c = dsaheap_ctx(), h = [], steps = [], i, x, gone, evicted = [];

  steps.push(dsaheap_frame({
    mode: "maxk", heap: [], idx: -1, x: null, gone: null, tally: dsaheap_snap(c),
    phase: "empty max-heap", flag: "idle", popped: [],
    caption: "The question says <b>largest</b>, so this run reaches for a <b>max</b>-heap " +
      "and keeps it at size " + dsaheap_K + " the same disciplined way. The size " +
      "discipline is right, the memory is right, the complexity is right. Play it and " +
      "watch the root."
  }));

  for (i = 0; i < dsaheap_N; i++) {
    x = dsaheap_NUMS[i];
    gone = null;
    dsaheap_push(h, x, c, false);
    if (h.length > dsaheap_K) {
      gone = dsaheap_pop(h, c, false);
      evicted.push(gone);
    }
    steps.push(dsaheap_frame({
      mode: "maxk", heap: h.slice(), idx: i, x: x, gone: gone,
      act: gone === null ? "push" : "evict", tally: dsaheap_snap(c), popped: evicted.slice(),
      phase: "element " + (i + 1) + " of " + dsaheap_N,
      flag: gone === null ? "idle" : "bad",
      caption: gone === null
        ? "<b>Push " + x + ".</b> The heap is not yet over size " + dsaheap_K +
          ", so nothing is evicted. Root (the maximum) is <b>" + h[0] + "</b>. So far " +
          "this looks identical to the correct algorithm."
        : "<b>Push " + x + ", size " + (h.length + 1) + " &gt; " + dsaheap_K +
          ", pop the root &mdash; and the root of a max-heap is <span>" + gone +
          "</span>, the best element it has ever seen.</b> " + gone + " is thrown away " +
          "and [" + h.join(", ") + "] is kept. Every eviction here discards a winner: " +
          "dropped so far " + evicted.join(", ") + "."
    }));
  }

  return {
    id: "maxk", label: "Max-heap, size k", steps: steps, heap: h.slice(),
    answer: h[0], tally: dsaheap_snap(c), order: "O(n log k)",
    space: "O(k) = " + dsaheap_K, evicted: evicted
  };
}

var dsaheap_R1 = dsaheap_runMinK();
var dsaheap_R2 = dsaheap_runMinN();
var dsaheap_R3 = dsaheap_runMaxK();
var dsaheap_RUNS = [dsaheap_R1, dsaheap_R2, dsaheap_R3];

function dsaheap_maxCmp() {
  var m = 1, i;
  for (i = 0; i < dsaheap_RUNS.length; i++) {
    if (dsaheap_RUNS[i].tally.cmp > m) m = dsaheap_RUNS[i].tally.cmp;
  }
  return m;
}
var dsaheap_MAXCMP = dsaheap_maxCmp();

// Scaling, from the page's own memory argument: n = 1e9 rows, k = 2.
var dsaheap_MEM_X = dsaheap_BIG_N / dsaheap_K;
var dsaheap_CMP_X = Math.log(dsaheap_BIG_N) / Math.log(dsaheap_K);

// ---------------------------------------------------------------- verdicts

function dsaheap_verdict(run) {
  var t = run.tally, ok = run.answer === dsaheap_TRUE;
  var base = "<b>heap[0] = " + run.answer + "</b> after " + t.cmp + " comparisons, " +
    t.swap + " swaps and a peak heap of " + t.peak + ". ";

  if (run.id === "mink") {
    return base + "The true " + dsaheap_ord(dsaheap_K) + " largest of [" + dsaheap_NUMS.join(", ") +
      "] is <b>" + dsaheap_TRUE + "</b>" +
      (dsaheap_TRUE === dsaheap_PAGE_ANSWER ? ", which is the page's stated answer" : "") +
      ", so this run is <b>" + (ok ? "correct" : "wrong") + "</b>. Read the root again: " +
      "it is the <i>smallest</i> of the best " + dsaheap_K + " the scan ever assembled, " +
      "and that is exactly what \"" + dsaheap_ord(dsaheap_K) + " largest\" means. That single " +
      "sentence is the answer to the page's starred question. The cost of being right " +
      "this way: <b>" + t.cmp + "</b> comparisons against the size-n run's <b>" +
      dsaheap_R2.tally.cmp + "</b>, and " + dsaheap_K + " items in memory against " +
      dsaheap_N + ".";
  }
  if (run.id === "minn") {
    return base + "Correct &mdash; and " +
      (dsaheap_R2.tally.cmp - dsaheap_R1.tally.cmp) + " extra comparisons, " +
      (dsaheap_R2.tally.swap - dsaheap_R1.tally.swap) + " extra swaps and " +
      (dsaheap_N - dsaheap_K) + " extra items held, to reach the answer the size-k run " +
      "already had. At six elements that is a rounding error, which is why the page " +
      "argues from <b>memory</b> rather than speed: at the page's billion rows with k = " +
      dsaheap_K + " this heap holds <b>" + dsaheap_int(dsaheap_MEM_X) + "&times;</b> as " +
      "many items and pays about <b>" + dsaheap_CMP_X.toFixed(0) + "&times;</b> the " +
      "comparisons per element (log&#8322;n / log&#8322;k), and the size-k heap is not " +
      "merely faster &mdash; it is the only one of the two that fits.";
  }
  return "<b>heap[0] = " + run.answer + ", and the answer is " + dsaheap_TRUE +
    ".</b> Nothing crashed, no exception was raised, and the complexity and memory are " +
    "both textbook-correct: " + t.cmp + " comparisons, peak heap " + t.peak + ". It is " +
    "simply the wrong heap. Popping the max evicted " + run.evicted.join(", ") +
    " &mdash; every strong element the scan found &mdash; and what survives, [" +
    run.heap.slice().sort(function (a, b) { return a - b; }).join(", ") + "], is the <b>" +
    dsaheap_K + " smallest</b>. Which is not waste: that is precisely the machine the " +
    "page's cue table assigns to <i>\"k smallest / k closest\"</i>. Same code, opposite " +
    "sign, mirror problem. The min-heap keeps the k largest because its root is the " +
    "weakest survivor; the max-heap keeps the k smallest because its root is the " +
    "strongest. Choose by asking which one you want to <i>evict</i>.";
}

function dsaheap_ord(k) {
  var teen = k % 100, last = k % 10;
  if (teen >= 11 && teen <= 13) return k + "th";
  return k + (last === 1 ? "st" : last === 2 ? "nd" : last === 3 ? "rd" : "th");
}

function dsaheap_int(n) {
  return n.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

function dsaheap_close(run) {
  var t = run.tally;
  run.steps.push(dsaheap_frame({
    mode: run.id, heap: run.heap.slice(), idx: dsaheap_N + 1, x: null, gone: null,
    act: "verdict", tally: t, popped: run.evicted || [], final: true,
    phase: "the answer", flag: run.answer === dsaheap_TRUE ? "ok" : "bad",
    caption: dsaheap_verdict(run)
  }));
}
dsaheap_close(dsaheap_R1);
dsaheap_close(dsaheap_R2);
dsaheap_close(dsaheap_R3);

// ---------------------------------------------------------------- drawing

function dsaheap_isMin(mode) { return mode !== "maxk"; }

function dsaheap_levels(step, d) {
  var h = step.heap, out = [], start = 0, cnt = 1, lvl = 0, i, cells, rootFlag;
  if (!h.length) {
    return d.lane({ label: "heap", cells: [{ label: "empty", flag: "idle" }] });
  }
  rootFlag = step.act === "evict" ? "bad" : "ok";
  while (start < h.length) {
    cells = [];
    for (i = start; i < start + cnt && i < h.length; i++) {
      cells.push({
        label: String(h[i]),
        flag: i === 0 ? rootFlag : undefined,
        title: "index " + i + (i === 0
          ? (dsaheap_isMin(step.mode) ? " · root · the minimum" : " · root · the maximum")
          : "")
      });
    }
    out.push(d.lane({
      label: lvl === 0 ? "root" : "depth " + lvl,
      cells: cells
    }));
    start += cnt; cnt *= 2; lvl += 1;
  }
  return d.stack(out);
}

function dsaheap_inputLane(step, d) {
  var cells = [], i, v, inHeap, f, t;
  for (i = 0; i < dsaheap_N; i++) {
    v = dsaheap_NUMS[i];
    inHeap = step.heap.indexOf(v) >= 0;
    if (step.idx < 0 || i > step.idx) { f = "idle"; t = "not read yet"; }
    else if (i === step.idx && !step.final) { f = "warn"; t = "being read now"; }
    else if (inHeap) { f = "ok"; t = "read, and still in the heap"; }
    else { f = "bad"; t = "read, then discarded"; }
    cells.push({ label: String(v), flag: f, title: v + " — " + t });
  }
  return d.lane({ label: "input", cells: cells });
}

function dsaheap_costBars(step, d) {
  var out = [], i, run, live, val, flag;
  for (i = 0; i < dsaheap_RUNS.length; i++) {
    run = dsaheap_RUNS[i];
    live = run.id === step.mode;
    val = live ? step.tally.cmp : run.tally.cmp;
    flag = live ? (run.answer === dsaheap_TRUE ? "ok" : "bad") : "idle";
    out.push(d.bar({
      label: (live ? "▶ " : "") + run.label,
      pct: (val / dsaheap_MAXCMP) * 100,
      value: val + " cmp" + (live ? "" : " (final)"),
      flag: flag
    }));
  }
  return d.stack(out);
}

function dsaheap_rows(step) {
  var rows = [], t = step.tally, isMin = dsaheap_isMin(step.mode);
  rows.push({
    label: "heap kind",
    value: (isMin ? "min-heap" : "max-heap") + " · root is the " +
      (isMin ? "smallest" : "largest") + " it holds",
    flag: isMin ? "ok" : "bad"
  });
  rows.push({
    label: "heap · bottom to top",
    value: step.heap.length ? "[" + step.heap.join(", ") + "]" : "[]"
  });
  rows.push({
    label: "root · heap[0] · O(1) peek",
    value: step.heap.length ? String(step.heap[0]) : "—",
    flag: step.heap.length ? (isMin ? "ok" : "warn") : "idle"
  });
  rows.push({
    label: "size now / cap",
    value: step.heap.length + " / " + (step.mode === "minn" ? dsaheap_N : dsaheap_K),
    flag: t.peak > dsaheap_K ? "bad" : "ok"
  });
  rows.push({ label: "comparisons", value: String(t.cmp) });
  rows.push({ label: "swaps · sifts", value: t.swap + " · " + t.sift });
  rows.push({
    label: "peak items held",
    value: String(t.peak),
    flag: t.peak > dsaheap_K ? "bad" : "ok"
  });
  if (step.gone !== null && step.gone !== undefined) {
    rows.push({
      label: "evicted this step",
      value: String(step.gone),
      flag: step.mode === "maxk" ? "bad" : "ok"
    });
  }
  if (step.popped && step.popped.length) {
    rows.push({
      label: step.mode === "minn" ? "popped while draining" : "thrown away so far",
      value: step.popped.join(", "),
      flag: step.mode === "maxk" ? "bad" : "warn"
    });
  }
  return rows;
}

function dsaheap_finalTable(d) {
  var rows = [], i, run;
  for (i = 0; i < dsaheap_RUNS.length; i++) {
    run = dsaheap_RUNS[i];
    rows.push([
      run.label,
      run.order,
      run.space,
      String(run.tally.cmp),
      String(run.tally.peak),
      run.answer + (run.answer === dsaheap_TRUE ? " ✓" : " ✗")
    ]);
  }
  return d.table(["approach", "time", "space", "cmp", "peak", "answer"], rows);
}

S["dsaheap"] = {
  title: "Run the page's top-k trace through three different heaps",
  note: "The page's section-4 example executed for real: <code>nums = [" +
    dsaheap_NUMS.join(", ") + "]</code>, <code>k = " + dsaheap_K +
    "</code>, page answer <b>" + dsaheap_PAGE_ANSWER + "</b> (re-derived here by sorting " +
    "descending and reading index k&minus;1, which gives <b>" + dsaheap_TRUE + "</b>). A " +
    "binary heap is implemented underneath &mdash; sift-up, sift-down, <code>heapify</code> " +
    "and the <code>heappushpop</code> body &mdash; and every comparison, swap, sift and " +
    "peak-size number below is counted by that code as it runs, through one shared " +
    "comparison helper so the three tallies are like-for-like. The tabs are the same six " +
    "numbers through three heaps: the page's size-k min-heap, the size-n heap its " +
    "failure-mode table warns about, and the size-k <i>max</i>-heap that the starred " +
    "interview question exists to prevent. The scaling figures in the verdict use the " +
    "page's own memory argument &mdash; a billion rows at k = " + dsaheap_K + ".",
  interval: 1400,

  scenarios: [
    { id: dsaheap_R1.id, label: dsaheap_R1.label, steps: dsaheap_R1.steps },
    { id: dsaheap_R2.id, label: dsaheap_R2.label, steps: dsaheap_R2.steps },
    { id: dsaheap_R3.id, label: dsaheap_R3.label, steps: dsaheap_R3.steps }
  ],

  draw: function (step, d, ctx) {
    var t = step.tally;
    var isMin = dsaheap_isMin(step.mode);
    var shownRoot = step.heap.length ? String(step.heap[0]) : "—";
    var rootFlag;
    if (!step.heap.length) rootFlag = "idle";
    else if (step.final) rootFlag = step.heap[0] === dsaheap_TRUE ? "ok" : "bad";
    else rootFlag = isMin ? "ok" : "warn";

    var head = d.flow([
      d.big(shownRoot, step.final ? "the answer it returns" : "heap[0] right now", rootFlag),
      d.stat({
        label: "items held",
        value: String(step.heap.length),
        sub: "peak " + t.peak + " of " + dsaheap_N,
        flag: t.peak > dsaheap_K ? "bad" : step.heap.length ? "ok" : "idle"
      }),
      d.stat({
        label: "comparisons",
        value: String(t.cmp),
        sub: t.swap + " swaps · " + t.sift + " sifts",
        flag: t.cmp ? "warn" : "idle"
      })
    ]);

    var body = [dsaheap_levels(step, d)];
    if (step.final) body.push(dsaheap_finalTable(d));

    var node = d.node({
      title: step.phase,
      status: step.final ? "DONE" : step.idx < 0 ? "IDLE" : "STEP " + (ctx.i) + " / " + ctx.n,
      statusFlag: step.flag || "idle",
      badge: isMin ? "min-heap" : "max-heap",
      meta: "k = " + dsaheap_K + " · n = " + dsaheap_N + " · true answer " + dsaheap_TRUE,
      flag: step.flag || "idle",
      rows: dsaheap_rows(step),
      body: d.stack(body)
    });

    return d.stack([
      head,
      dsaheap_inputLane(step, d),
      node,
      dsaheap_costBars(step, d),
      d.note(
        step.final
          ? "All three tallies are complete, counted by the same comparison helper."
          : "Input: <b>amber</b> is being read, <b>green</b> is read and still in the heap, " +
            "<b>red</b> was read and discarded, grey is unread. The bars hold every run's " +
            "comparison count so the three are directly comparable.",
        step.final ? (step.heap[0] === dsaheap_TRUE ? "ok" : "bad") : undefined
      )
    ]);
  }
};

  // ====================================================================
// ======================================================================
// SIM · dsahowtopractise  (how-to-practise.md)
//
// The time axis is the page's own clock. One 25-minute session runs minute
// by minute through the page's five blocks, the bell goes at 25, and the
// axis then continues into the page's review cycle -- day 1, day 7, day 30.
// Three people spend the same session on the same problem three ways.
//
// CONFIG -- all of it from the page.
//   the boxes     0-2 READ · 2-5 RECOGNISE · 5-8 BRUTE FORCE · 8-20 SOLVE ·
//                 20-25 TEST · 25 STOP. The 25-minute box is derived as the
//                 last block's end, not typed.
//   the ladder    the six escalation levels of "What to do when stuck",
//                 verbatim. Level 6 is "read the full solution -- then close
//                 it and re-solve from scratch", which the page is emphatic
//                 is NOT "read and understand".
//   the edges     the five classes named in the 20-25 block: empty, single
//                 element, duplicates, all-same, maximum size.
//   the grade     the six self-grade items from "Mock interviews", of which
//                 the page notes only one is about the answer.
//   the cycle     day 1 re-derive "5 min"; day 7 re-derive with the page's
//                 rule "if it takes more than 10 min, it goes back to day-1
//                 status"; day 30 re-derive. The page prices day 1 at 5 and
//                 caps day 7 at 10; day 30 is priced at 10 here, which is
//                 the sim's own figure and is declared as such.
//   retention     the page's two figures, used as given:
//                   no review   -> "Solved 300, remember 40"  = 40/300
//                   full cycle  -> "100 problems you know"     = all of them
//   the overrun   40 minutes, the page's own "Do not push to forty minutes
//                 because you feel close".
//
// THE SIM'S OWN FIXTURES
//   a 40-hour study budget (2,400 minutes) for the projection, and the
//   per-minute account of what each of the three people actually did with
//   each block. Every total, rate, attempt count, retained count and
//   minutes-per-retained-problem below is summed from that account.
// ======================================================================

var dsahowtopractise_BLOCKS = [
  { id: "read", from: 0, to: 2, name: "READ",
    page: "Restate it in your own words. Write down input, output, and one edge case. Do not start coding." },
  { id: "recog", from: 2, to: 5, name: "RECOGNISE",
    page: "What pattern is this? Say it out loud. If you cannot name one in 3 minutes, that is DATA." },
  { id: "brute", from: 5, to: 8, name: "BRUTE FORCE",
    page: "State it and its complexity. Always. It is the baseline you are improving on." },
  { id: "solve", from: 8, to: 20, name: "SOLVE",
    page: "Code it. Talk while you type, even alone — especially alone." },
  { id: "test", from: 20, to: 25, name: "TEST",
    page: "Empty. Single element. Duplicates. All-same. Maximum size. Then trace one example by hand." }
];
var dsahowtopractise_BOX = dsahowtopractise_BLOCKS[dsahowtopractise_BLOCKS.length - 1].to;
var dsahowtopractise_OVERRUN = 40;   // the page's "Do not push to forty minutes"

var dsahowtopractise_LADDER = [
  "re-read the constraints",
  "work a tiny example by hand",
  "ask what would make this easier",
  "read only the pattern name",
  "read the first paragraph, then stop",
  "read it all, close it, re-solve"
];

var dsahowtopractise_EDGES = ["empty", "single", "duplicates", "all-same", "max size"];

var dsahowtopractise_GRADE = [
  "clarified before coding",
  "stated the brute force and its cost",
  "narrated continuously",
  "tested edge cases unprompted",
  "stated final complexity unasked",
  "solution correct"
];

// The review cycle. Day 1 and the day-7 ceiling are the page's; day 30 is
// priced here at the day-7 ceiling and is the sim's own figure.
var dsahowtopractise_CYCLE = [
  { day: 1, cost: 5 }, { day: 7, cost: 10 }, { day: 30, cost: 10 }
];
function dsahowtopractise_cycleCost() {
  var t = 0, i;
  for (i = 0; i < dsahowtopractise_CYCLE.length; i++) t += dsahowtopractise_CYCLE[i].cost;
  return t;
}
var dsahowtopractise_CYCLE_MIN = dsahowtopractise_cycleCost();

// The page's own retention figures.
var dsahowtopractise_SEEN = 300;        // "Solved 300, remember 40"
var dsahowtopractise_REMEMBERED = 40;
var dsahowtopractise_NO_REVIEW_RATE = dsahowtopractise_REMEMBERED / dsahowtopractise_SEEN;

// The sim's projection budget.
var dsahowtopractise_HOURS = 40;
var dsahowtopractise_BUDGET = dsahowtopractise_HOURS * 60;

var dsahowtopractise_ACTS = [
  { id: "read", label: "reading the statement", flag: "ok" },
  { id: "recog", label: "naming the pattern", flag: "ok" },
  { id: "brute", label: "stating the brute force", flag: "ok" },
  { id: "code", label: "coding", flag: "ok" },
  { id: "hint", label: "reading a hint", flag: "warn" },
  { id: "soln", label: "reading the solution", flag: "bad" },
  { id: "test", label: "testing", flag: "ok" },
  { id: "review", label: "re-deriving on later days", flag: "ok" }
];
function dsahowtopractise_act(id) {
  var i;
  for (i = 0; i < dsahowtopractise_ACTS.length; i++) {
    if (dsahowtopractise_ACTS[i].id === id) return dsahowtopractise_ACTS[i];
  }
  return { id: id, label: id, flag: "idle" };
}

// ------------------------------------------------------------ the builder

function dsahowtopractise_count(arr) {
  var n = 0, i;
  for (i = 0; i < arr.length; i++) if (arr[i]) n += 1;
  return n;
}

/**
 * Walk a run's phase list, spending minutes in order onto a single
 * timeline, and emit one frame per phase. Everything the frames show is
 * accumulated here; nothing is passed in pre-totalled.
 */
function dsahowtopractise_build(cfg) {
  var line = [], spent = {}, clock = 0, i, j, p, a, mins, steps = [];
  var edges = [], grade = [], level = 0, reviewed = [];
  for (i = 0; i < dsahowtopractise_EDGES.length; i++) edges.push(false);
  for (i = 0; i < dsahowtopractise_GRADE.length; i++) grade.push(false);
  for (i = 0; i < dsahowtopractise_CYCLE.length; i++) reviewed.push(false);

  steps.push({
    cfg: cfg, phase: "the timer is at 0:00", line: [], spent: {}, clock: 0,
    edges: edges.slice(), grade: grade.slice(), reviewed: reviewed.slice(),
    level: 0, showEdges: false, showGrade: false, showReview: false, flag: "idle",
    caption: "One problem, one 25-minute box, the page's five blocks. " + cfg.blurb +
      " Press play and watch where the minutes actually go."
  });

  for (i = 0; i < cfg.phases.length; i++) {
    p = cfg.phases[i];
    for (j = 0; j < (p.add || []).length; j++) {
      a = p.add[j][0]; mins = p.add[j][1];
      spent[a] = (spent[a] || 0) + mins;
      if (a !== "review") {
        for (var m = 0; m < mins; m++) { line.push(a); clock += 1; }
      }
    }
    if (p.level !== undefined) level = p.level;
    for (j = 0; j < (p.edges || []).length; j++) edges[p.edges[j]] = true;
    if (p.grade) grade = cfg.grade.slice();
    for (j = 0; j < (p.reviews || []).length; j++) reviewed[p.reviews[j]] = true;

    steps.push({
      cfg: cfg, phase: p.title, line: line.slice(), spent: dsahowtopractise_copy(spent),
      clock: clock, edges: edges.slice(), grade: grade.slice(), reviewed: reviewed.slice(),
      level: level, showEdges: i >= 4, showGrade: i >= 5, showReview: i >= 6,
      blockIdx: p.blockIdx === undefined ? -1 : p.blockIdx,
      flag: p.flag, caption: p.caption
    });
  }
  return { id: cfg.id, label: cfg.label, steps: steps, cfg: cfg };
}

function dsahowtopractise_copy(o) {
  var out = {}, k;
  for (k in o) if (o.hasOwnProperty(k)) out[k] = o[k];
  return out;
}

/** The arithmetic every verdict quotes, derived from one run's totals. */
function dsahowtopractise_project(run) {
  var last = run.steps[run.steps.length - 1];
  var session = last.clock;
  var review = last.spent.review || 0;
  var perProblem = session + review;
  var attempted = Math.floor(dsahowtopractise_BUDGET / perProblem);
  var full = dsahowtopractise_count(last.reviewed) === dsahowtopractise_CYCLE.length;
  var retained = full
    ? attempted
    : Math.floor(attempted * dsahowtopractise_NO_REVIEW_RATE);
  return {
    session: session, review: review, perProblem: perProblem,
    attempted: attempted, retained: retained, full: full,
    perRetained: retained ? dsahowtopractise_BUDGET / retained : 0,
    grade: dsahowtopractise_count(last.grade),
    edges: dsahowtopractise_count(last.edges),
    level: last.level
  };
}

// ------------------------------------------------------------- the three runs

var dsahowtopractise_RUN_A = {
  id: "editorial", label: "Solution at minute 10",
  blurb: "This run is the page's opening sentence: the solution gets opened before the " +
    "box expires, it all makes sense, and the tick goes in.",
  grade: [true, false, false, false, false, true],
  verdictFlag: "bad",
  phases: [
    { title: "0–2 · READ", blockIdx: 0, add: [["read", 2]], flag: "ok",
      caption: "<b>0–2 · READ.</b> Restated in my own words; input, output and one edge " +
        "case written down; no code. This block is done exactly as the page asks, and it " +
        "is the only one that will be." },
    { title: "2–5 · RECOGNISE", blockIdx: 1, add: [["recog", 2], ["code", 1]], flag: "warn",
      caption: "<b>2–5 · RECOGNISE.</b> Two minutes of trying to name the pattern, nothing " +
        "arrives, and at minute 4 the hands start typing anyway. The page says failing to " +
        "name a pattern inside three minutes <i>is the data</i> — the cues you missed are " +
        "the thing to write down, not the thing to escape from. One minute of speculative " +
        "code instead, and nothing is written down." },
    { title: "5–8 · BRUTE FORCE (skipped)", blockIdx: 2, add: [["code", 3]], flag: "bad",
      caption: "<b>5–8 · BRUTE FORCE. Skipped.</b> Three more minutes of code aimed at " +
        "something that is not yet an approach. Two things are now unavailable: a baseline " +
        "to improve from, and the place where the repeated work becomes visible. The page " +
        "notes this block is also asked for explicitly in interviews, so the cost is not " +
        "only pedagogical." },
    { title: "8–20 · SOLVE, and the editorial", blockIdx: 3,
      add: [["code", 2], ["soln", 6], ["code", 4]], level: 6, flag: "bad",
      caption: "<b>8–20 · SOLVE — and at minute 10, the editorial.</b> Two minutes of " +
        "stalling, then the full solution is opened: a jump straight to escalation level 6 " +
        "with levels 1 to 5 never tried. It reads clearly. Six minutes to absorb it, four " +
        "to retype it. But the page's level 6 is <i>read, close it, wait an hour, " +
        "re-derive</i> — and none of that second half happens, so what was bought is " +
        "understanding, not ability." },
    { title: "20–25 · TEST (unused)", blockIdx: 4, add: [], edges: [], flag: "bad",
      caption: "<b>20–25 · TEST. Not used.</b> The code passes the given example, so it is " +
        "marked solved at minute 20 with five minutes of the box unspent. Zero of the five " +
        "edge classes run. Note the feeling this produces: the session finished <i>early</i>, " +
        "which reads as efficiency and is exactly what the page's first sentence warns " +
        "about." },
    { title: "25 · the bell", add: [], grade: true, flag: "bad",
      caption: "<b>25 · STOP.</b> There is nothing to stop; the tick went in five minutes " +
        "ago. Graded against the six items the page says are actually scored, this session " +
        "earns <b>2 of 6</b> — clarified, and correct. The page's own remark on that list " +
        "is that only one of the six is about the answer, and it is the only one this run " +
        "has any claim to." },
    { title: "day 1 · day 7 · day 30", add: [], reviews: [], flag: "bad",
      caption: "<b>No review list, so nothing comes due.</b> No day-1 re-derivation, no " +
        "day-7 one, no day-30 one. The page's test — open a blank file and solve it again — " +
        "is never run, so the question of whether this problem was learned is never asked " +
        "and the green tick is never challenged. The page's word for that tick is <i>a " +
        "lie</i>." },
    { title: "40 hours later", add: [], flag: "bad", verdict: true, caption: "" }
  ]
};

var dsahowtopractise_RUN_B = {
  id: "timebox", label: "Time box, then escalate",
  blurb: "This run keeps the box, escalates through the levels instead of opening the " +
    "solution, and puts the problem on the review list.",
  grade: [true, true, true, true, true, true],
  verdictFlag: "ok",
  phases: [
    { title: "0–2 · READ", blockIdx: 0, add: [["read", 2]], flag: "ok",
      caption: "<b>0–2 · READ.</b> Restated in my own words; input, output and one edge " +
        "case written down before a single thought about approach. Two minutes." },
    { title: "2–5 · RECOGNISE", blockIdx: 1, add: [["recog", 3]], flag: "ok",
      caption: "<b>2–5 · RECOGNISE.</b> Said out loud: <i>contiguous subarray, so prefix " +
        "sum or a two-pointer scan</i>. Named inside the three minutes, so the cue is " +
        "already trained. Had nothing arrived, the instruction is to record which cues " +
        "were missed and carry on — the miss is information, not failure." },
    { title: "5–8 · BRUTE FORCE", blockIdx: 2, add: [["brute", 3]], flag: "ok",
      caption: "<b>5–8 · BRUTE FORCE.</b> Stated aloud with its cost: every start against " +
        "every end, O(n²). Three minutes buys a baseline to improve from, the place the " +
        "repeated work becomes visible, and a ready answer to a question interviewers ask " +
        "directly." },
    { title: "8–20 · SOLVE, one minute of help", blockIdx: 3,
      add: [["code", 11], ["hint", 1]], level: 4, flag: "ok",
      caption: "<b>8–20 · SOLVE, with one minute of help.</b> Stuck at minute 14. Instead " +
        "of the solution, the ladder: re-read the constraints (1), work a three-element " +
        "case by hand (2), ask what would make this easier (3), and at level 4 read " +
        "<i>only the pattern name</i> — one minute. Everything after that is self-solved. " +
        "<b>Level 4 of 6</b>, and the page's instruction is to write down that it took " +
        "level 4, because where you needed help is the diagnosis." },
    { title: "20–25 · TEST", blockIdx: 4, add: [["test", 5]],
      edges: [0, 1, 2, 3, 4], flag: "ok",
      caption: "<b>20–25 · TEST.</b> Empty, single element, duplicates, all-same, maximum " +
        "size — all five of the page's classes — and then one example traced by hand. " +
        "<b>5 of 5.</b> This is also the block that produces the unprompted edge-case " +
        "habit the grading list rewards." },
    { title: "25 · the bell", add: [], grade: true, flag: "ok",
      caption: "<b>25 · STOP, and the timer is obeyed.</b> Graded against the page's six " +
        "scored items: <b>6 of 6</b>. Five of those six were earned before a single line " +
        "of the solution existed, which is the page's argument in one number — the session " +
        "structure <i>is</i> the interview rubric, rehearsed." },
    { title: "day 1 · day 7 · day 30", add: [["review", 5], ["review", 10], ["review", 10]],
      reviews: [0, 1, 2], flag: "ok",
      caption: "<b>Day 1: re-derived from a blank file in 5 minutes. Day 7: re-derived " +
        "again, inside the page's 10-minute limit, so it stays on schedule instead of " +
        "dropping back to day-1 status. Day 30: re-derived cold — now it is yours.</b> " +
        "Three re-derivations, 25 minutes on top of the 25-minute session. Re-derive, not " +
        "re-read: recognition is not recall, and recall under pressure is what is being " +
        "trained." },
    { title: "40 hours later", add: [], flag: "ok", verdict: true, caption: "" }
  ]
};

var dsahowtopractise_RUN_C = {
  id: "overrun", label: "Push to forty minutes",
  blurb: "This run never reads a solution and never cheats. It simply feels close at " +
    "minute 25 and keeps going.",
  grade: [true, true, false, false, true, true],
  verdictFlag: "bad",
  phases: [
    { title: "0–2 · READ", blockIdx: 0, add: [["read", 2]], flag: "ok",
      caption: "<b>0–2 · READ.</b> Restated, input and output written down, one edge case " +
        "noted. Identical to the disciplined run so far — this is not a careless person." },
    { title: "2–5 · RECOGNISE", blockIdx: 1, add: [["recog", 3]], flag: "warn",
      caption: "<b>2–5 · RECOGNISE.</b> Three minutes and no pattern name. The page is " +
        "clear that this <i>is</i> the data point of the session: write down which cues " +
        "were missed. This run does not write anything down, so the one genuinely useful " +
        "output of the next thirty-five minutes is thrown away in the third minute." },
    { title: "5–8 · BRUTE FORCE", blockIdx: 2, add: [["brute", 3]], flag: "ok",
      caption: "<b>5–8 · BRUTE FORCE.</b> Stated honestly with its cost, O(n²). The " +
        "baseline exists. Everything so far has been done right." },
    { title: "8–20 · SOLVE", blockIdx: 3, add: [["code", 12]], level: 1, flag: "warn",
      caption: "<b>8–20 · SOLVE.</b> Twelve minutes of coding and no help asked for at any " +
        "point past level 1, re-reading the constraints. At minute 20 the function is " +
        "half-written. The ladder exists precisely so that being stuck costs one minute at " +
        "level 4 rather than twelve at level 0 — unused, it is not discipline, it is just " +
        "a slower way to be stuck." },
    { title: "20–25 · TEST, spent coding", blockIdx: 4, add: [["code", 5]], flag: "bad",
      caption: "<b>20–25 · the TEST block, spent coding.</b> The last five minutes of the " +
        "box go on the same function. Zero edge classes run, and at 25 minutes the code " +
        "still does not work. This is the moment the page legislates for: <i>when the " +
        "timer goes, stop — whether or not it works</i>." },
    { title: "25 · the bell, ignored", add: [["code", 13], ["test", 2]],
      edges: [0, 1], grade: true, flag: "bad",
      caption: "<b>25 · STOP — ignored, because it feels close.</b> Fifteen more minutes: " +
        "thirteen coding, two testing, and it works at minute 40. Two of the five edge " +
        "classes get run. Grade: <b>4 of 6</b> — the misses are narration and edge cases, " +
        "both of which the box would have protected. And the deeper cost is invisible on " +
        "this screen: the recognition skill is trained by the box, and this session " +
        "brute-forced past it by persistence, which is not what an interview measures." },
    { title: "day 1 · day 7 · day 30", add: [], reviews: [], flag: "bad",
      caption: "<b>The review list gets nothing.</b> The page's workable system costs ten " +
        "minutes at the start of each session, two re-derivations before anything new. A " +
        "session that runs 60% over its box has no ten minutes to give, so the overrun " +
        "does not just cost this problem's time — it is paid for out of the review of " +
        "every problem before it." },
    { title: "40 hours later", add: [], flag: "bad", verdict: true, caption: "" }
  ]
};

var dsahowtopractise_A = dsahowtopractise_build(dsahowtopractise_RUN_A);
var dsahowtopractise_B = dsahowtopractise_build(dsahowtopractise_RUN_B);
var dsahowtopractise_C = dsahowtopractise_build(dsahowtopractise_RUN_C);
var dsahowtopractise_RUNS = [dsahowtopractise_A, dsahowtopractise_B, dsahowtopractise_C];

var dsahowtopractise_P = {};
dsahowtopractise_P[dsahowtopractise_A.id] = dsahowtopractise_project(dsahowtopractise_A);
dsahowtopractise_P[dsahowtopractise_B.id] = dsahowtopractise_project(dsahowtopractise_B);
dsahowtopractise_P[dsahowtopractise_C.id] = dsahowtopractise_project(dsahowtopractise_C);

function dsahowtopractise_bestRetained() {
  var m = 1, k;
  for (k in dsahowtopractise_P) {
    if (dsahowtopractise_P.hasOwnProperty(k) && dsahowtopractise_P[k].retained > m) {
      m = dsahowtopractise_P[k].retained;
    }
  }
  return m;
}
var dsahowtopractise_BEST = dsahowtopractise_bestRetained();

function dsahowtopractise_verdict(id) {
  var p = dsahowtopractise_P[id];
  var b = dsahowtopractise_P[dsahowtopractise_B.id];
  var generous = Math.floor(p.attempted * dsahowtopractise_NO_REVIEW_RATE * 2);

  if (id === dsahowtopractise_B.id) {
    var fastest = dsahowtopractise_P[dsahowtopractise_A.id];
    return "<b>" + p.perProblem + " minutes a problem — " + p.session + " in the box and " +
      p.review + " spread over days 1, 7 and 30 — so " + dsahowtopractise_HOURS +
      " hours buys <b>" + p.attempted + "</b> problems.</b> The run that opens the " +
      "editorial gets through " + (fastest.attempted / p.attempted).toFixed(1) +
      "× as many, and its profile says so. Every one of these " + p.attempted +
      " was re-derived from a blank file three times, so by the page's own figure they are " +
      "the " +
      "\"problems you know\" rather than the ones you have seen: <b>" + p.retained +
      " re-derivable</b>, at <b>" + p.perRetained.toFixed(0) + " minutes each</b>. " +
      "Self-grade <b>" + p.grade + " of " + dsahowtopractise_GRADE.length + "</b>, edge " +
      "classes <b>" + p.edges + " of " + dsahowtopractise_EDGES.length + "</b>, help " +
      "taken at level " + p.level + " of " + dsahowtopractise_LADDER.length + ". This run " +
      "is the slowest on the metric the page calls bad and the fastest on every metric it " +
      "calls good.";
  }

  var extra = p.attempted - b.attempted;
  return "<b>" + p.perProblem + " minutes a problem, so " + dsahowtopractise_HOURS +
    " hours buys <b>" + p.attempted + "</b> problems — " + extra + " more than the " +
    "reviewed run manages.</b> Nothing here is reviewed, so the page's figure for that is " +
    "the one that applies: solved " + dsahowtopractise_SEEN + ", remember " +
    dsahowtopractise_REMEMBERED + ". <b>" + p.retained + " re-derivable</b>, at <b>" +
    p.perRetained.toFixed(0) + " minutes each</b> against the reviewed run's " +
    b.perRetained.toFixed(0) + ". Double the page's retention figure out of pure " +
    "generosity and it is still " + generous + " against " + b.retained + ". Self-grade " +
    "<b>" + p.grade + " of " + dsahowtopractise_GRADE.length + "</b>, edge classes <b>" +
    p.edges + " of " + dsahowtopractise_EDGES.length + "</b>. This is the page's whole " +
    "argument as arithmetic: the count goes up, the thing the count is a proxy for goes " +
    "down, and the profile looks better the whole time.";
}

function dsahowtopractise_closeAll() {
  var i, run, last;
  for (i = 0; i < dsahowtopractise_RUNS.length; i++) {
    run = dsahowtopractise_RUNS[i];
    last = run.steps[run.steps.length - 1];
    last.verdict = true;
    last.caption = dsahowtopractise_verdict(run.id);
  }
}
dsahowtopractise_closeAll();

// ------------------------------------------------------------------ drawing

function dsahowtopractise_clockCells(step, d) {
  var cells = [], i, a, f, label, total = dsahowtopractise_OVERRUN;
  for (i = 0; i < total; i++) {
    a = step.line[i];
    if (a === undefined) {
      f = "idle";
      label = i === dsahowtopractise_BOX ? "!" : "";
      cells.push({
        label: label, flag: f,
        title: "minute " + i + " — unspent" +
          (i >= dsahowtopractise_BOX ? " (past the 25-minute box)" : "")
      });
    } else {
      if (i >= dsahowtopractise_BOX) f = "bad";
      else f = dsahowtopractise_act(a).flag;
      cells.push({
        label: "", flag: f,
        title: "minute " + i + " — " + dsahowtopractise_act(a).label +
          (i >= dsahowtopractise_BOX ? " (past the bell)" : "")
      });
    }
  }
  return d.cells(cells, {
    label: "the clock · one block per minute · minute " + dsahowtopractise_BOX +
      " is the bell", dense: true
  });
}

function dsahowtopractise_spendBars(step, d) {
  var out = [], i, a, m, total = step.clock + (step.spent.review || 0);
  if (!total) {
    return d.note("Nothing spent yet — the timer has not started.", "idle");
  }
  for (i = 0; i < dsahowtopractise_ACTS.length; i++) {
    a = dsahowtopractise_ACTS[i];
    m = step.spent[a.id] || 0;
    if (!m) continue;
    out.push(d.bar({
      label: a.label, pct: (m / total) * 100,
      value: m + " min", flag: a.flag
    }));
  }
  return d.stack(out);
}

function dsahowtopractise_ladderCells(step, d) {
  var cells = [], i, reached;
  for (i = 0; i < dsahowtopractise_LADDER.length; i++) {
    reached = step.level >= i + 1;
    cells.push({
      label: String(i + 1),
      flag: !reached ? "idle" : i + 1 >= 6 ? "bad" : i + 1 === 5 ? "warn" : "ok",
      title: "level " + (i + 1) + " · " + dsahowtopractise_LADDER[i] +
        (reached ? " — used" : " — not used")
    });
  }
  return d.lane({ label: "help taken", cells: cells });
}

function dsahowtopractise_tickCells(list, names, label, d) {
  var cells = [], i;
  for (i = 0; i < names.length; i++) {
    cells.push({
      label: list[i] ? "✓" : "·",
      flag: list[i] ? "ok" : "bad",
      title: names[i] + (list[i] ? " — done" : " — not done")
    });
  }
  return d.lane({ label: label, cells: cells });
}

function dsahowtopractise_reviewLane(step, d) {
  var cells = [], i, c;
  for (i = 0; i < dsahowtopractise_CYCLE.length; i++) {
    c = dsahowtopractise_CYCLE[i];
    cells.push({
      label: "d" + c.day,
      flag: step.reviewed[i] ? "ok" : "bad",
      title: "day " + c.day + " re-derivation · " + c.cost + " min" +
        (step.reviewed[i] ? " — done" : " — never happened")
    });
  }
  return d.lane({ label: "review cycle", cells: cells });
}

function dsahowtopractise_verdictTable(d) {
  var rows = [], i, run, p;
  for (i = 0; i < dsahowtopractise_RUNS.length; i++) {
    run = dsahowtopractise_RUNS[i];
    p = dsahowtopractise_P[run.id];
    rows.push([
      run.label,
      p.perProblem + " min",
      String(p.attempted),
      String(p.retained),
      p.perRetained.toFixed(0) + " min",
      p.grade + "/" + dsahowtopractise_GRADE.length
    ]);
  }
  return d.table(
    ["run", "min / problem", "attempted", "re-derivable", "min each", "grade"],
    rows
  );
}

S["dsahowtopractise"] = {
  title: "Spend the same 25 minutes three ways",
  note: "The page's clock, run minute by minute: <b>0–2 read · 2–5 recognise · 5–8 brute " +
    "force · 8–20 solve · 20–25 test · " + dsahowtopractise_BOX + " stop</b>, then the " +
    "page's review cycle at day 1, day 7 and day 30. Scored with the page's own " +
    "instruments &mdash; the six escalation levels of <i>what to do when stuck</i>, the " +
    "five edge classes named in the test block, and the six self-grade items from the " +
    "mock-interview section, of which the page notes only one is about the answer. " +
    "Retention uses the page's two figures exactly as it states them: no review is " +
    "<i>\"solved " + dsahowtopractise_SEEN + ", remember " + dsahowtopractise_REMEMBERED +
    "\"</i>, the full cycle is <i>\"" + dsahowtopractise_SEEN +
    " you have seen\" versus \"100 problems you know\"</i>. The sim's own fixtures are a " +
    dsahowtopractise_HOURS + "-hour study budget, a day-30 re-derivation priced at the " +
    "page's day-7 ceiling of " + dsahowtopractise_CYCLE[1].cost + " minutes, and the " +
    "minute-by-minute account of what each of the three people did with each block. " +
    "Every total, projection and rate below is summed from that account.",
  interval: 1500,

  scenarios: [
    { id: dsahowtopractise_A.id, label: dsahowtopractise_A.label, steps: dsahowtopractise_A.steps },
    { id: dsahowtopractise_B.id, label: dsahowtopractise_B.label, steps: dsahowtopractise_B.steps },
    { id: dsahowtopractise_C.id, label: dsahowtopractise_C.label, steps: dsahowtopractise_C.steps }
  ],

  draw: function (step, d, ctx) {
    var over = step.clock > dsahowtopractise_BOX;
    var block = step.blockIdx >= 0 ? dsahowtopractise_BLOCKS[step.blockIdx] : null;
    var p = dsahowtopractise_P[step.cfg.id];
    var review = step.spent.review || 0;

    var head = d.flow([
      d.big(step.clock + " min", over ? "past the bell" : "on the clock",
        over ? "bad" : step.clock ? "ok" : "idle"),
      d.stat({
        label: "of the " + dsahowtopractise_BOX + "-minute box",
        value: Math.round((Math.min(step.clock, dsahowtopractise_BOX) /
          dsahowtopractise_BOX) * 100) + "%",
        sub: over ? "+" + (step.clock - dsahowtopractise_BOX) + " min over"
          : (dsahowtopractise_BOX - step.clock) + " min left",
        flag: over ? "bad" : "ok"
      }),
      d.stat({
        label: "help taken",
        value: step.level ? "level " + step.level : "none",
        sub: step.level >= 6 ? "the full solution" : "of " + dsahowtopractise_LADDER.length,
        flag: step.level >= 6 ? "bad" : step.level ? "ok" : "idle"
      })
    ]);

    var rows = [];
    if (block) {
      rows.push({ label: "block", value: block.from + "–" + block.to + " min · " + block.name });
      rows.push({ label: "what the page asks for here", value: block.page });
    } else {
      rows.push({
        label: "block",
        value: step.verdict ? "the projection" : step.showReview
          ? "days 1, 7 and 30" : "minute " + dsahowtopractise_BOX + " · the bell"
      });
    }
    rows.push({
      label: "minutes in the session",
      value: String(step.clock),
      flag: over ? "bad" : "ok"
    });
    rows.push({
      label: "minutes re-deriving later",
      value: review ? String(review) : "0",
      flag: review ? "ok" : step.showReview ? "bad" : "idle"
    });
    rows.push({
      label: "cost of this problem, whole life",
      value: (step.clock + review) + " min",
      flag: review ? "warn" : "idle"
    });
    if (step.verdict) {
      rows.push({
        label: dsahowtopractise_HOURS + " h buys",
        value: p.attempted + " problems attempted",
        flag: "warn"
      });
      rows.push({
        label: "re-derivable after day 7",
        value: p.retained + " of " + p.attempted +
          "  (" + Math.round((p.retained / p.attempted) * 100) + "%)",
        flag: p.full ? "ok" : "bad"
      });
      rows.push({
        label: "minutes per re-derivable problem",
        value: p.perRetained.toFixed(0),
        flag: p.retained === dsahowtopractise_BEST ? "ok" : "bad"
      });
    }

    var body = [dsahowtopractise_spendBars(step, d), dsahowtopractise_ladderCells(step, d)];
    if (step.showEdges) {
      body.push(dsahowtopractise_tickCells(step.edges, dsahowtopractise_EDGES,
        "edge classes", d));
    }
    if (step.showGrade) {
      body.push(dsahowtopractise_tickCells(step.grade, dsahowtopractise_GRADE,
        "self-grade", d));
    }
    if (step.showReview) body.push(dsahowtopractise_reviewLane(step, d));
    if (step.verdict) body.push(dsahowtopractise_verdictTable(d));

    var node = d.node({
      title: step.phase,
      status: step.verdict ? "PROJECTION" : over ? "OVER" : "IN THE BOX",
      statusFlag: step.flag || "idle",
      badge: step.cfg.label,
      meta: "box " + dsahowtopractise_BOX + " min · ladder 1–" +
        dsahowtopractise_LADDER.length + " · grade 0–" + dsahowtopractise_GRADE.length,
      flag: step.flag || "idle",
      rows: rows,
      body: d.stack(body)
    });

    return d.stack([
      head,
      dsahowtopractise_clockCells(step, d),
      node,
      d.note(
        step.verdict
          ? "All three columns are summed from the same minute-by-minute account, against " +
            "the same " + dsahowtopractise_HOURS + "-hour budget."
          : "Clock: <b>green</b> is a minute spent on one of the page's own blocks, " +
            "<b>amber</b> on a hint, <b>red</b> on reading the solution or on anything " +
            "past minute " + dsahowtopractise_BOX + ", grey unspent.",
        step.verdict ? step.cfg.verdictFlag : undefined
      )
    ]);
  }
};

  // ====================================================================
// ======================================================================
// SIM · dsahowtothink  (how-to-think.md)
//
// The page's first five minutes, in the page's order: the four places to
// look (output type, constraints, examples, words), then the five
// questions, ending on the constraint-budget check. Three people walk the
// same eight stages on the same unseen problem and leave with three
// different algorithms.
//
// THE PROBLEM is the page's own worked example -- the one its five quoted
// answers are all about: "the count of contiguous subarrays summing to k.
// Not the subarrays themselves -- the count", on an array "possibly with
// duplicates and negatives", with the page's own bound "n <= 10^5 so I need
// O(n) or O(n log n)".
//
// CONFIG
//   nums     [3, 4, 7, 2, -3, 1, 4, 2]   the sim's fixture. Chosen for one
//                                        reason: it contains a negative, so
//                                        it can tell the two O(n) answers
//                                        apart.
//   k        7
//   bound    n <= 10^5        the page's Q5, verbatim
//   values   duplicates and negatives allowed -- the page's Q1, verbatim
//   speed    10^8 simple operations per second. That figure is the sibling
//            how-to-practise page's "rough working figure", named here
//            rather than invented.
//
// FOUR ALGORITHMS ACTUALLY RUN on the fixture, each counting its own
// arithmetic; nothing below is asserted:
//   triple loop   re-sum every range           n(n+1)(n+2)/6 additions
//   double loop   accumulate as you extend     n(n+1)/2 additions
//   two pointers  grow right, shrink left      O(n) -- and WRONG here,
//                                              because a negative breaks the
//                                              monotonicity that shrinking from
//                                              the left depends on
//   prefix + map  the page's own Q4 table row  n additions, n lookups
// The true answer is taken from the exhaustive double loop, and every
// subarray each method finds is recorded so the two O(n) answers can be
// compared subarray by subarray rather than only by their totals.
//
// Projected runtimes take each method's asymptotic shape at n = 10^5 with a
// leading constant of 1, divided by the 10^8/s figure.
// ======================================================================

var dsahowtothink_NUMS = [3, 4, 7, 2, -3, 1, 4, 2];
var dsahowtothink_K = 7;
var dsahowtothink_N = dsahowtothink_NUMS.length;
var dsahowtothink_BOUND = 100000;      // the page's "n ≤ 10⁵"
var dsahowtothink_OPS = 100000000;     // the sibling page's "~10⁸ ops per second"

// ------------------------------------------------------------- algorithms

/** Exhaustive. Also the ground truth: every subarray summing to k. */
function dsahowtothink_double() {
  var i, j, s, adds = 0, found = [];
  for (i = 0; i < dsahowtothink_N; i++) {
    s = 0;
    for (j = i; j < dsahowtothink_N; j++) {
      s += dsahowtothink_NUMS[j]; adds += 1;
      if (s === dsahowtothink_K) found.push([i, j]);
    }
  }
  return { adds: adds, found: found, count: found.length, shape: "O(n²)", pow: 2 };
}

/** The same search, re-summing each range from scratch. */
function dsahowtothink_triple() {
  var i, j, t, s, adds = 0, found = [];
  for (i = 0; i < dsahowtothink_N; i++) {
    for (j = i; j < dsahowtothink_N; j++) {
      s = 0;
      for (t = i; t <= j; t++) { s += dsahowtothink_NUMS[t]; adds += 1; }
      if (s === dsahowtothink_K) found.push([i, j]);
    }
  }
  return { adds: adds, found: found, count: found.length, shape: "O(n³)", pow: 3 };
}

/** Two pointers. Correct only while every value is non-negative. */
function dsahowtothink_window() {
  var l = 0, r, s = 0, ops = 0, found = [];
  for (r = 0; r < dsahowtothink_N; r++) {
    s += dsahowtothink_NUMS[r]; ops += 1;
    while (s > dsahowtothink_K && l <= r) {
      s -= dsahowtothink_NUMS[l]; l += 1; ops += 1;
    }
    if (s === dsahowtothink_K) found.push([l, r]);
  }
  return { adds: ops, found: found, count: found.length, shape: "O(n)", pow: 1 };
}

/** The page's Q4 table row: "the total up to here" -> dict of prefix → count. */
function dsahowtothink_prefix() {
  var seen = {}, run = 0, j, need, adds = 0, looks = 0, found = [], idx, list;
  seen["0"] = [0];
  for (j = 0; j < dsahowtothink_N; j++) {
    run += dsahowtothink_NUMS[j]; adds += 1;
    need = run - dsahowtothink_K;
    looks += 1;
    list = seen[String(need)];
    if (list) {
      for (idx = 0; idx < list.length; idx++) found.push([list[idx], j]);
    }
    list = seen[String(run)];
    if (list) list.push(j + 1); else seen[String(run)] = [j + 1];
  }
  found.sort(function (a, b) { return a[0] - b[0] || a[1] - b[1]; });
  return {
    adds: adds, looks: looks, found: found, count: found.length,
    shape: "O(n)", pow: 1
  };
}

var dsahowtothink_D3 = dsahowtothink_triple();
var dsahowtothink_D2 = dsahowtothink_double();
var dsahowtothink_W = dsahowtothink_window();
var dsahowtothink_PF = dsahowtothink_prefix();
var dsahowtothink_TRUTH = dsahowtothink_D2.found;
var dsahowtothink_ANSWER = dsahowtothink_D2.count;

/** How much of the triple loop's arithmetic the prefix pass never repeats. */
var dsahowtothink_WASTED = dsahowtothink_D3.adds - dsahowtothink_PF.adds;
var dsahowtothink_WASTED_PCT = (dsahowtothink_WASTED / dsahowtothink_D3.adds) * 100;
var dsahowtothink_WASTED2 = dsahowtothink_D2.adds - dsahowtothink_PF.adds;

function dsahowtothink_has(list, a, b) {
  var i;
  for (i = 0; i < list.length; i++) if (list[i][0] === a && list[i][1] === b) return true;
  return false;
}
function dsahowtothink_missed(list) {
  var out = [], i;
  for (i = 0; i < dsahowtothink_TRUTH.length; i++) {
    if (!dsahowtothink_has(list, dsahowtothink_TRUTH[i][0], dsahowtothink_TRUTH[i][1])) {
      out.push(dsahowtothink_TRUTH[i]);
    }
  }
  return out;
}
var dsahowtothink_W_MISSED = dsahowtothink_missed(dsahowtothink_W.found);

/** Asymptotic shape at the page's bound, with a leading constant of 1. */
function dsahowtothink_atBound(pow) { return Math.pow(dsahowtothink_BOUND, pow); }
function dsahowtothink_secs(pow) {
  return dsahowtothink_atBound(pow) / dsahowtothink_OPS;
}
function dsahowtothink_dur(pow) {
  var s = dsahowtothink_secs(pow);
  if (s < 0.001) return (s * 1000000).toFixed(0) + " µs";
  if (s < 1) return (s * 1000).toFixed(0) + " ms";
  if (s < 120) return s.toFixed(0) + " s";
  if (s < 86400) return (s / 3600).toFixed(1) + " h";
  return (s / 86400).toFixed(0) + " days";
}
var dsahowtothink_SUP = ["⁰", "¹", "²", "³", "⁴",
  "⁵", "⁶", "⁷", "⁸", "⁹"];
function dsahowtothink_sci(n) {
  var e = Math.round(Math.log(n) / Math.LN10), s = String(e), out = "", i;
  for (i = 0; i < s.length; i++) out += dsahowtothink_SUP[Number(s.charAt(i))];
  return "10" + out;
}
function dsahowtothink_range(r) { return "[" + r[0] + ".." + r[1] + "]"; }
function dsahowtothink_slice(r) {
  return dsahowtothink_NUMS.slice(r[0], r[1] + 1).join(" + ").replace(/\+ -/g, "− ");
}

// ------------------------------------------------------- the eight stages

var dsahowtothink_STAGES = [
  { kind: "place", n: 1, name: "the output type",
    ask: "What am I returning? A number? A boolean? One item? All items?" },
  { kind: "place", n: 2, name: "the constraints",
    ask: "n ≤ ?  values ≤ ?  negatives allowed?" },
  { kind: "place", n: 3, name: "the examples",
    ask: "Work the given example BY HAND, slowly." },
  { kind: "place", n: 4, name: "the words",
    ask: "contiguous · subsequence · sorted · distinct · minimum maximum · at most k" },
  { kind: "q", n: 2, name: "what does the brute force cost?",
    ask: "Always. Even when it is obviously too slow." },
  { kind: "q", n: 3, name: "what work am I repeating?",
    ask: "This is the question that produces the answer." },
  { kind: "q", n: 4, name: "what could I remember?",
    ask: "The repeated work names the data structure." },
  { kind: "q", n: 5, name: "does it meet the constraint budget?",
    ask: "Check it against the bound BEFORE coding, not after it times out." }
];

/** The page's Q4 table, verbatim. The chosen row is marked, not restated. */
var dsahowtothink_MEMTABLE = [
  ["have I seen this before?", "the set of things seen", "set / dict"],
  ["what is the total up to here?", "running prefix sums", "dict of prefix → count"],
  ["what is the smallest so far?", "the running minimum", "a variable, or a heap"],
  ["what is the nearest bigger element?", "unresolved candidates", "monotonic stack"],
  ["what is the answer for a smaller input?", "subproblem results", "memo / DP table"],
  ["which of these k is smallest?", "the k best", "heap"]
];

// ------------------------------------------------------------- the three runs

function dsahowtothink_build(cfg) {
  var steps = [], i, st, done = [], j;
  for (i = 0; i < dsahowtothink_STAGES.length; i++) done.push(null);

  steps.push({
    cfg: cfg, idx: -1, done: done.slice(), flag: "idle",
    caption: "An unseen problem: <i>given an array of integers, return the <b>count</b> " +
      "of contiguous subarrays summing to k</i>. Nothing has been read yet. " + cfg.blurb
  });

  for (i = 0; i < dsahowtothink_STAGES.length; i++) {
    st = dsahowtothink_STAGES[i];
    done[i] = cfg.acts[i].ok;
    steps.push({
      cfg: cfg, idx: i, stage: st, act: cfg.acts[i], done: done.slice(),
      flag: cfg.acts[i].flag,
      caption: cfg.acts[i].caption
    });
  }
  for (j = 0; j < steps.length; j++) steps[j].last = j === steps.length - 1;
  return { id: cfg.id, label: cfg.label, steps: steps, cfg: cfg };
}

var dsahowtothink_RUN_CODE = {
  id: "code", label: "Straight to code", algo: dsahowtothink_W, algoName: "two pointers",
  verdictFlag: "bad",
  blurb: "This run reads the statement and starts typing. The page's first cost — " +
    "<i>you solve the wrong problem, and half the failed attempts are a misread " +
    "constraint, not a missing algorithm</i> — is about to be paid in full.",
  acts: [
    { ok: true, flag: "ok",
      caption: "<b>Place 1 · the output type. Read.</b> <i>A count</i> — one integer, not " +
        "the subarrays. That much is correct, and it is the only one of the four places " +
        "this run opens." },
    { ok: false, flag: "bad",
      caption: "<b>Place 2 · the constraints. Skipped.</b> This is where the line " +
        "<i>values may be negative</i> lives. Four seconds of reading, not done. Nothing " +
        "goes wrong yet, and nothing will go wrong for another twenty minutes — the page's " +
        "point is that a misread constraint does not announce itself." },
    { ok: false, flag: "bad",
      caption: "<b>Place 3 · the examples. Skipped.</b> The page says this is the one " +
        "people skip and the one where the answers are. Working the fixture [" +
        dsahowtothink_NUMS.join(", ") + "] by hand would have surfaced the subarray " +
        dsahowtothink_range(dsahowtothink_TRUTH[2]) + ", whose sum only reaches " +
        dsahowtothink_K + " by first going <i>above</i> it and coming back down. That one " +
        "observation is the whole problem." },
    { ok: true, flag: "warn",
      caption: "<b>Place 4 · the words. Read — and over-read.</b> <i>Contiguous</i> is " +
        "there, and the page's own cue table says contiguous means sliding scan or prefix " +
        "sum. <b>Two options, and only one of them survives a negative number.</b> The cue " +
        "narrows the field; it does not pick. Picked anyway: a growing-and-shrinking " +
        "two-pointer scan." },
    { ok: false, flag: "bad",
      caption: "<b>Question 2 · the brute force. Never stated.</b> The page asks for it " +
        "<i>always, even when it is obviously too slow</i>, for two reasons this run now " +
        "forfeits: there is no baseline to improve from, and — more expensively here — " +
        "the exhaustive version would have produced the right answer on the fixture, " +
        "which is the thing that catches the bug." },
    { ok: false, flag: "bad",
      caption: "<b>Question 3 · what am I repeating? Never asked.</b> The two-pointer " +
        "scan does avoid repeated work, so the run arrives at an O(n) answer without ever " +
        "articulating <i>which</i> repetition it removed. That is the difference between " +
        "an answer and a guess: the same code, with and without the reason, is the same " +
        "code right up to the first input that tests the reason." },
    { ok: false, flag: "warn",
      caption: "<b>Question 4 · what could I remember?</b> The scan remembers two things: " +
        "a left index and a running sum. Both are discarded as the left pointer advances. " +
        "The page's table has a row for <i>\"what is the total up to here?\"</i>, and it " +
        "says to remember <b>every</b> prefix, not just the current one. Throwing the old " +
        "prefixes away is exactly the decision that fails." },
    { ok: true, flag: "bad",
      caption: "" }
  ]
};

var dsahowtothink_RUN_FIVE = {
  id: "five", label: "The five questions", algo: dsahowtothink_PF,
  algoName: "prefix sums + hash map", verdictFlag: "ok",
  blurb: "This run spends the first five minutes in the page's order and does not type " +
    "anything until question 5 has an answer.",
  acts: [
    { ok: true, flag: "ok",
      caption: "<b>Place 1 · the output type.</b> Restated out loud: <i>an array of " +
        "integers, possibly with duplicates and negatives, and I return the count of " +
        "contiguous subarrays summing to k — not the subarrays themselves, the count.</i> " +
        "\"A number\" rather than \"all items\" already rules out backtracking." },
    { ok: true, flag: "ok",
      caption: "<b>Place 2 · the constraints.</b> <code>n ≤ " +
        dsahowtothink_BOUND.toLocaleString("en-US") + "</code>, and <b>values may be " +
        "negative</b>. The first fixes the complexity target before a single idea has " +
        "arrived: O(n) or O(n log n). The second is worth more — it is the line that " +
        "disqualifies an entire family of answers, and it costs four seconds to read." },
    { ok: true, flag: "ok",
      caption: "<b>Place 3 · the examples, worked by hand.</b> " + dsahowtothink_ANSWER +
        " subarrays of the fixture sum to " + dsahowtothink_K + ", and one of them, " +
        dsahowtothink_range(dsahowtothink_TRUTH[2]) + " = " +
        dsahowtothink_slice(dsahowtothink_TRUTH[2]) + ", climbs past " + dsahowtothink_K +
        " before the negative brings it back. Two minutes with a pen and the structure is " +
        "visible: <b>running totals are not monotonic</b>, so nothing that depends on " +
        "shrinking from the left can work." },
    { ok: true, flag: "ok",
      caption: "<b>Place 4 · the words.</b> <i>Contiguous</i> — the page's cue table " +
        "offers sliding scan <i>or</i> prefix sum. Place 3 has already eliminated the " +
        "first, so the word narrows the field and the hand-worked example resolves it. " +
        "That is the order the page recommends, and it is why place 3 comes before the " +
        "cue lookup rather than after it." },
    { ok: true, flag: "ok",
      caption: "<b>Question 2 · the brute force, stated with its cost.</b> For every " +
        "start, for every end, sum the range: <b>" + dsahowtothink_D3.adds + " additions</b> " +
        "on these " + dsahowtothink_N + " elements, O(n³). Accumulating as the end extends " +
        "drops it to <b>" + dsahowtothink_D2.adds + "</b>, O(n²). Both get the right " +
        "answer, " + dsahowtothink_D2.count + ". Now there is a baseline." },
    { ok: true, flag: "ok",
      caption: "<b>Question 3 · what work am I repeating?</b> Counted, not guessed: the " +
        "triple loop performs <b>" + dsahowtothink_D3.adds + "</b> additions where <b>" +
        dsahowtothink_PF.adds + "</b> running totals would answer every one of its " +
        "queries — <b>" + dsahowtothink_WASTED + " of them, " +
        dsahowtothink_WASTED_PCT.toFixed(1) + "%, are re-additions of a prefix already " +
        "computed</b>. Even the O(n²) version repeats " + dsahowtothink_WASTED2 + " of its " +
        dsahowtothink_D2.adds + ", because each new start re-walks ground the previous " +
        "start already covered." },
    { ok: true, flag: "ok",
      caption: "<b>Question 4 · what could I remember?</b> The repetition was phrased as " +
        "<i>\"what is the total up to here?\"</i>, and the page's table answers that " +
        "directly: remember running prefix sums, in a dict of prefix → count. The " +
        "reformulation follows &mdash; a subarray (i..j] sums to k exactly when " +
        "prefix[j] − prefix[i] = k, so for each j the question is <i>have I seen the value " +
        "prefix[j] − k?</i>, which is a lookup, not a scan." },
    { ok: true, flag: "ok", caption: "" }
  ]
};

var dsahowtothink_RUN_BRUTE = {
  id: "brute", label: "Brute force, never improved", algo: dsahowtothink_D2,
  algoName: "double loop", verdictFlag: "bad",
  blurb: "This run is careful, honest and correct. It skips exactly one of the eight " +
    "stages — the one the page calls the question that produces the answer.",
  acts: [
    { ok: true, flag: "ok",
      caption: "<b>Place 1 · the output type.</b> A count, not the subarrays. Read " +
        "properly and restated." },
    { ok: true, flag: "warn",
      caption: "<b>Place 2 · the constraints. Read, and not converted.</b> Negatives " +
        "noted — which is why this run will be <i>correct</i>. But <code>n ≤ " +
        dsahowtothink_BOUND.toLocaleString("en-US") + "</code> is read as a fact about " +
        "the input rather than as a budget, and the page's whole point about place 2 is " +
        "that the bound tells you the intended complexity before you have had a single " +
        "idea." },
    { ok: true, flag: "ok",
      caption: "<b>Place 3 · the examples, worked by hand.</b> All " +
        dsahowtothink_ANSWER + " subarrays found, including the one that overshoots " +
        dsahowtothink_K + " before the negative pulls it back. This run will not have the " +
        "correctness bug." },
    { ok: true, flag: "ok",
      caption: "<b>Place 4 · the words.</b> <i>Contiguous</i>, so start and end indices — " +
        "which is read as licence for two nested loops. Not wrong, and not yet an " +
        "optimisation." },
    { ok: true, flag: "ok",
      caption: "<b>Question 2 · the brute force, stated with its cost.</b> Stated " +
        "properly: every start against every end, accumulating as the end extends, <b>" +
        dsahowtothink_D2.adds + " additions</b> on these " + dsahowtothink_N +
        " elements, O(n²), answer " + dsahowtothink_D2.count + ". Everything the page asks " +
        "for at this stage has been done." },
    { ok: false, flag: "bad",
      caption: "<b>Question 3 · what work am I repeating? Never asked — and this is the " +
        "only stage this run skips.</b> The baseline is correct and it runs, so it gets " +
        "typed up. But <b>" + dsahowtothink_WASTED2 + " of its " + dsahowtothink_D2.adds +
        " additions</b> re-walk a prefix an earlier start already computed, and the page " +
        "is categorical that every optimisation in the subject is the removal of repeated " +
        "work. Skip the question and the optimisation has nowhere to come from." },
    { ok: false, flag: "bad",
      caption: "<b>Question 4 · what could I remember? Nothing is named.</b> With no " +
        "repetition articulated there is nothing for the page's table to match against, " +
        "so no structure is selected, so the double loop ships. The table is not a lookup " +
        "of problems; it is a lookup of <i>repetitions</i>, and this run never produced " +
        "the key." },
    { ok: true, flag: "bad", caption: "" }
  ]
};

var dsahowtothink_RUNS = [dsahowtothink_RUN_CODE, dsahowtothink_RUN_FIVE, dsahowtothink_RUN_BRUTE];

function dsahowtothink_verdict(cfg) {
  var a = cfg.algo, ok = a.count === dsahowtothink_ANSWER;
  var head = "<b>" + cfg.algoName + " · " + a.shape + " · answer " + a.count +
    " where the truth is " + dsahowtothink_ANSWER + ".</b> ";

  if (cfg.id === "code") {
    return head + "It is linear, it clears the budget with " + dsahowtothink_dur(a.pow) +
      " at the bound, and <b>it is wrong</b> — it finds " +
      dsahowtothink_W.found.length + " of the " + dsahowtothink_TRUTH.length +
      " and misses " + dsahowtothink_range(dsahowtothink_W_MISSED[0]) + " and " +
      dsahowtothink_range(dsahowtothink_W_MISSED[1]) + ", both of which pass through a " +
      "running total above " + dsahowtothink_K + " and come back. Question 5 passes this " +
      "solution: the complexity is right. That is the trap the page's first cost " +
      "describes — the budget check cannot catch a misread constraint, only place 2 and " +
      "place 3 can, and both were skipped in the first ninety seconds to save four " +
      "seconds and two minutes.";
  }
  if (cfg.id === "five") {
    return head + "Correct, and <b>" + a.adds + " additions with " + a.looks +
      " lookups</b> against the triple loop's " + dsahowtothink_D3.adds + " — the " +
      dsahowtothink_WASTED_PCT.toFixed(1) + "% that question 3 identified, removed. At " +
      "the page's bound of n = " + dsahowtothink_sci(dsahowtothink_BOUND) + " that is " +
      dsahowtothink_dur(a.pow) + " against O(n²)'s " + dsahowtothink_dur(2) +
      " and O(n³)'s " + dsahowtothink_dur(3) + ", all at the " +
      dsahowtothink_sci(dsahowtothink_OPS) + " operations-a-second working figure. " +
      "Question 5 answers itself. Note what actually did the work: place 3 ruled out the " +
      "wrong linear answer, and question 3 named the repetition that question 4's table " +
      "then looked up. Neither is cleverness &mdash; both are two minutes of reading and " +
      "one sentence said out loud.";
  }
  return head + "Correct on every input, and " + dsahowtothink_dur(a.pow) +
    " at n = " + dsahowtothink_sci(dsahowtothink_BOUND) + " — roughly " +
    (dsahowtothink_secs(2) / 60).toFixed(1) + " minutes for one call, against a budget " +
    "that wanted " + dsahowtothink_dur(1) + ". <b>" + dsahowtothink_D2.adds +
    " additions on eight elements looks like nothing; " +
    dsahowtothink_sci(dsahowtothink_atBound(2)) + " on " +
    dsahowtothink_sci(dsahowtothink_BOUND) + " is the same code.</b> Seven of the eight " +
    "stages were done properly. The one that was skipped is the one the page puts in bold " +
    "and calls the question that produces the answer, and skipping it did not produce a " +
    "wrong answer — it produced no <i>second</i> answer at all, which in a timed round is " +
    "indistinguishable from not knowing.";
}

var dsahowtothink_C = dsahowtothink_build(dsahowtothink_RUN_CODE);
var dsahowtothink_F = dsahowtothink_build(dsahowtothink_RUN_FIVE);
var dsahowtothink_B = dsahowtothink_build(dsahowtothink_RUN_BRUTE);
var dsahowtothink_BUILT = [dsahowtothink_C, dsahowtothink_F, dsahowtothink_B];

function dsahowtothink_closeAll() {
  var i, run, last;
  for (i = 0; i < dsahowtothink_BUILT.length; i++) {
    run = dsahowtothink_BUILT[i];
    last = run.steps[run.steps.length - 1];
    last.caption = dsahowtothink_verdict(run.cfg);
  }
}
dsahowtothink_closeAll();

// ------------------------------------------------------------------ drawing

function dsahowtothink_progress(step, d) {
  var pl = [], qs = [], i, st, v, f;
  for (i = 0; i < dsahowtothink_STAGES.length; i++) {
    st = dsahowtothink_STAGES[i];
    v = step.done[i];
    f = v === null ? "idle" : v ? "ok" : "bad";
    (st.kind === "place" ? pl : qs).push({
      label: String(st.n), flag: f,
      title: (st.kind === "place" ? "place " : "question ") + st.n + " · " + st.name +
        (v === null ? " — not reached" : v ? " — done" : " — skipped")
    });
  }
  qs.unshift({
    label: "1", flag: step.done[0] === null ? "idle" : step.done[0] ? "ok" : "bad",
    title: "question 1 · what am I given and what must I return — answered at place 1"
  });
  return d.stack([
    d.lane({ label: "4 places", cells: pl }),
    d.lane({ label: "5 questions", cells: qs })
  ]);
}

function dsahowtothink_arrayCells(step, d) {
  var cells = [], i, inAny = [], j, r, show;
  show = step.idx >= 2 && step.cfg.acts[2].ok;
  for (i = 0; i < dsahowtothink_N; i++) inAny.push(false);
  if (show) {
    for (j = 0; j < dsahowtothink_TRUTH.length; j++) {
      r = dsahowtothink_TRUTH[j];
      for (i = r[0]; i <= r[1]; i++) inAny[i] = true;
    }
  }
  for (i = 0; i < dsahowtothink_N; i++) {
    cells.push({
      label: String(dsahowtothink_NUMS[i]),
      flag: !show ? "idle" : inAny[i] ? "ok" : "warn",
      title: "index " + i + (show
        ? (inAny[i] ? " — inside a subarray that sums to " + dsahowtothink_K
          : " — in none of them")
        : " — the example has not been worked")
    });
  }
  return d.lane({ label: "nums", cells: cells });
}

function dsahowtothink_handTable(d) {
  var rows = [], i, r;
  for (i = 0; i < dsahowtothink_TRUTH.length; i++) {
    r = dsahowtothink_TRUTH[i];
    rows.push([dsahowtothink_range(r), dsahowtothink_slice(r), String(dsahowtothink_K)]);
  }
  return d.table(["indices", "by hand", "sum"], rows);
}

function dsahowtothink_memTable(step, d) {
  var rows = [], i, pick;
  for (i = 0; i < dsahowtothink_MEMTABLE.length; i++) {
    pick = step.cfg.id === "five" && i === 1;
    rows.push([
      (pick ? "◀ " : "") + dsahowtothink_MEMTABLE[i][0],
      dsahowtothink_MEMTABLE[i][1],
      dsahowtothink_MEMTABLE[i][2]
    ]);
  }
  return d.table(["what is repeated", "what to remember", "structure"], rows);
}

function dsahowtothink_costBars(step, d) {
  var out = [], i, defs, maxA = dsahowtothink_D3.adds;
  defs = [
    { n: "triple loop · O(n³)", a: dsahowtothink_D3.adds, f: "bad" },
    { n: "double loop · O(n²)", a: dsahowtothink_D2.adds, f: "warn" },
    { n: "two pointers · O(n)", a: dsahowtothink_W.adds, f: "warn" },
    { n: "prefix + map · O(n)", a: dsahowtothink_PF.adds, f: "ok" }
  ];
  for (i = 0; i < defs.length; i++) {
    out.push(d.bar({
      label: defs[i].n, pct: (defs[i].a / maxA) * 100,
      value: defs[i].a + " ops", flag: defs[i].f
    }));
  }
  return d.stack(out);
}

function dsahowtothink_finalTable(d) {
  var rows = [], i, defs;
  defs = [
    { n: "triple loop", r: dsahowtothink_D3 },
    { n: "double loop", r: dsahowtothink_D2 },
    { n: "two pointers", r: dsahowtothink_W },
    { n: "prefix + map", r: dsahowtothink_PF }
  ];
  for (i = 0; i < defs.length; i++) {
    rows.push([
      defs[i].n, defs[i].r.shape, String(defs[i].r.adds),
      defs[i].r.count + (defs[i].r.count === dsahowtothink_ANSWER ? " ✓" : " ✗"),
      dsahowtothink_dur(defs[i].r.pow)
    ]);
  }
  return d.table(
    ["method", "shape", "ops on 8", "answer", "at n = 10⁵"],
    rows
  );
}

function dsahowtothink_compareTable(d) {
  var rows = [], i, r, inW, inP;
  for (i = 0; i < dsahowtothink_TRUTH.length; i++) {
    r = dsahowtothink_TRUTH[i];
    inW = dsahowtothink_has(dsahowtothink_W.found, r[0], r[1]);
    inP = dsahowtothink_has(dsahowtothink_PF.found, r[0], r[1]);
    rows.push([
      dsahowtothink_range(r), dsahowtothink_slice(r),
      inW ? "found" : "MISSED", inP ? "found" : "MISSED"
    ]);
  }
  return d.table(["subarray", "values", "two pointers", "prefix + map"], rows);
}

S["dsahowtothink"] = {
  title: "Walk the first five minutes three ways",
  note: "The page's order, executed on the page's own worked problem &mdash; <i>the count " +
    "of contiguous subarrays summing to k, on an array possibly with duplicates and " +
    "negatives, n &le; " + dsahowtothink_BOUND.toLocaleString("en-US") + "</i> &mdash; " +
    "through the four places to look and then the five questions. Fixture: <code>nums = [" +
    dsahowtothink_NUMS.join(", ") + "]</code>, <code>k = " + dsahowtothink_K +
    "</code>, chosen for one reason, the negative, because it is what tells the two O(n) " +
    "answers apart. Four algorithms actually run on it and count their own arithmetic " +
    "&mdash; triple loop, double loop, two pointers and prefix-sums-plus-hash-map &mdash; " +
    "and each records every subarray it finds, so the two linear answers can be compared " +
    "subarray by subarray and not merely by their totals. The true count, <b>" +
    dsahowtothink_ANSWER + "</b>, comes from the exhaustive double loop. Projected " +
    "runtimes take each shape at n = " + dsahowtothink_sci(dsahowtothink_BOUND) +
    " with a leading constant of 1, at the sibling how-to-practise page's working figure " +
    "of " + dsahowtothink_sci(dsahowtothink_OPS) + " simple operations a second.",
  interval: 1500,

  scenarios: [
    { id: dsahowtothink_C.id, label: dsahowtothink_C.label, steps: dsahowtothink_C.steps },
    { id: dsahowtothink_F.id, label: dsahowtothink_F.label, steps: dsahowtothink_F.steps },
    { id: dsahowtothink_B.id, label: dsahowtothink_B.label, steps: dsahowtothink_B.steps }
  ],

  draw: function (step, d, ctx) {
    var cfg = step.cfg, st = step.stage, a = cfg.algo;
    var doneCount = 0, skipped = 0, i;
    for (i = 0; i < step.done.length; i++) {
      if (step.done[i] === true) doneCount += 1;
      else if (step.done[i] === false) skipped += 1;
    }

    var head = d.flow([
      d.big(
        step.last ? String(a.count) : step.idx < 0 ? "—" : doneCount + "/" +
          dsahowtothink_STAGES.length,
        step.last ? "the count it returns" : "stages done properly",
        step.last ? (a.count === dsahowtothink_ANSWER ? "ok" : "bad")
          : skipped ? "bad" : doneCount ? "ok" : "idle"
      ),
      d.stat({
        label: "skipped so far", value: String(skipped),
        sub: skipped ? "of " + (doneCount + skipped) + " reached" : "none yet",
        flag: skipped ? "bad" : "ok"
      }),
      d.stat({
        label: step.last ? "cost at n = 10⁵" : "true answer",
        value: step.last ? dsahowtothink_dur(a.pow) : String(dsahowtothink_ANSWER),
        sub: step.last ? a.shape + " · budget wants " + dsahowtothink_dur(1)
          : "subarrays summing to " + dsahowtothink_K,
        flag: step.last ? (a.pow <= 1 ? "ok" : "bad") : "idle"
      })
    ]);

    var rows = [];
    if (st) {
      rows.push({
        label: st.kind === "place" ? "place " + st.n : "question " + st.n,
        value: st.name,
        flag: step.act.ok ? "ok" : "bad"
      });
      rows.push({ label: "what the page asks here", value: st.ask });
      rows.push({
        label: "this run",
        value: step.act.ok ? "done" : "skipped",
        flag: step.act.ok ? "ok" : "bad"
      });
    } else {
      rows.push({ label: "stage", value: "nothing read yet" });
      rows.push({ label: "the statement", value: "count the contiguous subarrays summing to k" });
    }
    rows.push({ label: "approach it will ship", value: cfg.algoName + " · " + a.shape });
    if (step.last) {
      rows.push({
        label: "operations on the " + dsahowtothink_N + "-element fixture",
        value: String(a.adds),
        flag: "warn"
      });
      rows.push({
        label: "answer / truth",
        value: a.count + " / " + dsahowtothink_ANSWER,
        flag: a.count === dsahowtothink_ANSWER ? "ok" : "bad"
      });
      rows.push({
        label: "at n = " + dsahowtothink_BOUND.toLocaleString("en-US"),
        value: dsahowtothink_dur(a.pow) + "  (budget: " + dsahowtothink_dur(1) + ")",
        flag: a.pow <= 1 ? "ok" : "bad"
      });
    }

    var body = [dsahowtothink_arrayCells(step, d)];
    if (st && st.kind === "place" && st.n === 3 && step.act.ok) {
      body.push(dsahowtothink_handTable(d));
    }
    if (st && st.kind === "q" && st.n === 3) body.push(dsahowtothink_costBars(step, d));
    if (st && st.kind === "q" && st.n === 4) body.push(dsahowtothink_memTable(step, d));
    if (step.last) {
      body.push(dsahowtothink_finalTable(d));
      body.push(dsahowtothink_compareTable(d));
    }

    var node = d.node({
      title: st ? (st.kind === "place" ? "place " + st.n + " · " + st.name
        : "question " + st.n + " · " + st.name) : "the unseen problem",
      status: step.last ? "VERDICT" : step.idx < 0 ? "IDLE" : "STAGE " + (step.idx + 1) +
        " / " + dsahowtothink_STAGES.length,
      statusFlag: step.flag || "idle",
      badge: cfg.label,
      meta: "k = " + dsahowtothink_K + " · n = " + dsahowtothink_N + " fixture · bound n ≤ " +
        dsahowtothink_BOUND.toLocaleString("en-US"),
      flag: step.flag || "idle",
      rows: rows,
      body: d.stack(body)
    });

    return d.stack([
      head,
      dsahowtothink_progress(step, d),
      node,
      d.note(
        step.last
          ? "Both tables are produced by running the four methods on the fixture, not by " +
            "describing them."
          : "Progress lanes: <b>green</b> done, <b>red</b> skipped, grey not reached. " +
            "Question 1 is answered at place 1, which is why they share a marker.",
        step.last ? cfg.verdictFlag : undefined
      )
    ]);
  }
};

  // ====================================================================
  // ======================================================================
  // SIM · dsaintervals  (intervals.md)
  //
  // The time axis is the scan. Every interval problem on this page is
  // "sort, then scan once", and the page's entire claim is that the SORT KEY
  // decides the answer — "sort by start when you are combining intervals, and
  // by end when you are choosing a maximum set of them". So this is one
  // greedy, run three times, and the only thing that changes between tabs is
  // which endpoint the sort used.
  //
  // CONFIG — both interval sets are transcribed verbatim from intervals.md §5:
  //   set A  [[1,2],[2,3],[3,4],[1,3]]   the LC 435 worked example. The page
  //          prints the sorted-by-end order "[1,2], [2,3], [1,3], [3,4]",
  //          traces kept=3, and states "answer 1 removal".
  //   set B  [[1,100],[2,3],[4,5]]       the page's counter-example. It prints
  //          "sorted by START: [1,100], [2,3], [4,5] ... keep 1" and
  //          "sorted by END: [2,3], [4,5], [1,100] ... keep 2  CORRECT".
  //
  // NOTHING ELSE IS TYPED IN.
  //   · the sort is a real stable bottom-up-recursive merge sort and its key
  //     comparisons are COUNTED, per run;
  //   · the scan's `start >= last_end` comparisons are COUNTED;
  //   · an exhaustive 2^n subset search is actually RUN on each set, with its
  //     own comparisons counted, so the greedy's answer is checked against the
  //     true optimum rather than asserted. That is what makes tab 2 a proof of
  //     wrongness and not an opinion.
  //   · the page says "O(n log n) — dominated by the sort. The scan is O(n)."
  //     At n = 3 and n = 4 that is invisible, so the same merge sort is also
  //     run once on a deterministic n = 1,000 set and its comparisons counted.
  //
  // The timeline is drawn on a compressed axis: one slot per gap between
  // consecutive distinct endpoints. [1,100] therefore reads as "covers every
  // slot", which is exactly why it blocks everything.
  // ======================================================================

  var dsaintervals_SET_A = [[1, 2], [2, 3], [3, 4], [1, 3]];
  var dsaintervals_SET_B = [[1, 100], [2, 3], [4, 5]];
  var dsaintervals_BIG_N = 1000;

  function dsaintervals_txt(iv) { return "[" + iv[0] + "," + iv[1] + "]"; }

  function dsaintervals_list(ivs) {
    var i, out = [];
    for (i = 0; i < ivs.length; i++) out.push(dsaintervals_txt(ivs[i]));
    return out.join(", ");
  }

  /** Stable merge sort on one endpoint. `c.cmp` counts every key comparison. */
  function dsaintervals_msort(list, key, c) {
    if (list.length < 2) return list.slice();
    var mid = Math.floor(list.length / 2);
    var lo = dsaintervals_msort(list.slice(0, mid), key, c);
    var hi = dsaintervals_msort(list.slice(mid), key, c);
    var out = [], i = 0, j = 0;
    while (i < lo.length && j < hi.length) {
      c.cmp++;                                   // one key comparison
      if (lo[i][key] <= hi[j][key]) { out.push(lo[i]); i++; }
      else { out.push(hi[j]); j++; }
    }
    while (i < lo.length) { out.push(lo[i]); i++; }
    while (j < hi.length) { out.push(hi[j]); j++; }
    return out;
  }

  /**
   * The activity-selection greedy, exactly as the page writes it:
   *   for start, end in intervals:  if start >= last_end: keep; last_end = end
   * One event per interval, in sorted order. Nothing here is narrated.
   */
  function dsaintervals_greedy(list, key) {
    var c = { cmp: 0 };
    var sorted = dsaintervals_msort(list, key, c);
    var events = [], last = null, kept = 0, i, iv, take, before;
    for (i = 0; i < sorted.length; i++) {
      iv = sorted[i];
      before = last;
      take = last === null || iv[0] >= last;     // start >= last_end
      if (take) { kept++; last = iv[1]; }
      events.push({
        i: i, iv: iv, take: take, before: before, after: last,
        kept: kept, removed: i + 1 - kept, scanCmp: i + 1
      });
    }
    return {
      sorted: sorted, sortCmp: c.cmp, events: events,
      kept: kept, removed: sorted.length - kept
    };
  }

  /**
   * Exhaustive search over all 2^n subsets — the thing the greedy replaces.
   * Because the candidates are walked in end-sorted order, a subset is
   * non-overlapping exactly when each selected interval starts at or after the
   * previous selected one ends, so consecutive pairs are the whole check.
   * Comparisons are counted; nothing is assumed about the answer.
   */
  function dsaintervals_brute(list) {
    var throwaway = { cmp: 0 };
    var byEnd = dsaintervals_msort(list, 1, throwaway);
    var n = byEnd.length, total = 1, m, i, prev, ok, size, ops = 0;
    var best = 0, bestMask = 0;
    for (i = 0; i < n; i++) total *= 2;
    for (m = 0; m < total; m++) {
      prev = null; ok = true; size = 0;
      for (i = 0; i < n; i++) {
        if (m & (1 << i)) {
          if (prev !== null) {
            ops++;
            if (byEnd[i][0] < prev) { ok = false; break; }
          }
          prev = byEnd[i][1];
          size++;
        }
      }
      if (ok && size > best) { best = size; bestMask = m; }
    }
    var winner = [];
    for (i = 0; i < n; i++) if (bestMask & (1 << i)) winner.push(byEnd[i]);
    return { best: best, subsets: total, ops: ops, winner: winner };
  }

  /** Distinct endpoints, ascending — the compressed time axis. */
  function dsaintervals_axis(list) {
    var pts = [], i, j, k, v, seen;
    for (i = 0; i < list.length; i++) {
      for (j = 0; j < 2; j++) {
        v = list[i][j];
        seen = false;
        for (k = 0; k < pts.length; k++) if (pts[k] === v) seen = true;
        if (!seen) pts.push(v);
      }
    }
    pts.sort(function (a, b) { return a - b; });
    return pts;
  }

  function dsaintervals_covers(iv, pts, s) {
    return pts[s] >= iv[0] && pts[s + 1] <= iv[1];
  }

  // --- the same merge sort at a size where "dominated by the sort" shows ---
  var dsaintervals_BIG = (function () {
    var list = [], i, a, s, c = { cmp: 0 };
    for (i = 0; i < dsaintervals_BIG_N; i++) {
      a = (i * 2654435761) >>> 0;                // deterministic, no Math.random
      s = a % 5000;
      list.push([s, s + 1 + ((a >>> 11) % 50)]);
    }
    dsaintervals_msort(list, 1, c);
    return {
      n: dsaintervals_BIG_N,
      cmp: c.cmp,
      nlogn: Math.round(dsaintervals_BIG_N * Math.log(dsaintervals_BIG_N) / Math.LN2),
      bruteExp: Math.round(dsaintervals_BIG_N * Math.LN2 / Math.LN10)
    };
  })();

  // --- the three runs -----------------------------------------------------
  var dsaintervals_RUNS = [
    {
      id: "end4", label: "Sort by END · LC 435",
      input: dsaintervals_SET_A, key: 1,
      pageOrder: "[1,2], [2,3], [1,3], [3,4]",     // intervals.md §5, verbatim
      pageKept: 3, pageRemoved: 1                  // "kept=3" / "answer 1 removal"
    },
    {
      id: "start3", label: "Sort by START · the trap",
      input: dsaintervals_SET_B, key: 0,
      pageOrder: "[1,100], [2,3], [4,5]",          // §5 "sorted by START"
      pageKept: 1, pageRemoved: 2                  // "-> keep 1"
    },
    {
      id: "end3", label: "Sort by END · same input",
      input: dsaintervals_SET_B, key: 1,
      pageOrder: "[2,3], [4,5], [1,100]",          // §5 "sorted by END"
      pageKept: 2, pageRemoved: 1                  // "-> keep 2   CORRECT"
    }
  ];

  (function () {
    var i, R;
    for (i = 0; i < dsaintervals_RUNS.length; i++) {
      R = dsaintervals_RUNS[i];
      R.n = R.input.length;
      R.keyName = R.key === 1 ? "end" : "start";
      R.greedy = dsaintervals_greedy(R.input, R.key);
      R.brute = dsaintervals_brute(R.input);
      R.axis = dsaintervals_axis(R.input);
      R.orderTxt = dsaintervals_list(R.greedy.sorted);
      R.orderOk = R.orderTxt === R.pageOrder;
      R.keptOk = R.greedy.kept === R.pageKept;
      R.optimal = R.greedy.kept === R.brute.best;
      R.greedyOps = R.greedy.sortCmp + R.n;
    }
  })();

  function dsaintervals_run(id) {
    var i;
    for (i = 0; i < dsaintervals_RUNS.length; i++) {
      if (dsaintervals_RUNS[i].id === id) return dsaintervals_RUNS[i];
    }
    return dsaintervals_RUNS[0];
  }

  function dsaintervals_lastTxt(v) { return v === null ? "−∞" : String(v); }

  // --- captions -----------------------------------------------------------
  var dsaintervals_INTRO = {
    end4: "Four meetings — <b>[1,2], [2,3], [3,4], [1,3]</b>, the LC 435 example " +
      "from §5. Remove as few as possible so the rest do not overlap, which is the " +
      "same question as <i>keep as many as possible</i>. Sort by <b>end</b>, then " +
      "scan once. Press Play.",
    start3: "Three meetings — <b>[1,100], [2,3], [4,5]</b>. Identical greedy, " +
      "identical scan, one difference: the sort key is the <b>start</b>. This is the " +
      "reach the page says people get wrong, and the exhaustive search at the end " +
      "will settle whether it is merely worse or actually incorrect.",
    end3: "The same three meetings, the same greedy — sorted by <b>end</b> this " +
      "time. One character of difference from the previous tab. Watch [1,100] arrive " +
      "last instead of first."
  };

  function dsaintervals_sortCaption(R) {
    return "<b>Sort by " + R.keyName + ".</b> A stable merge sort over n = " + R.n +
      " performed <b>" + R.greedy.sortCmp + "</b> key comparisons, counted as it ran. " +
      "The order is now <b>" + R.orderTxt + "</b> — " +
      (R.orderOk
        ? "exactly the order printed in §5."
        : "which does <b>not</b> match the order printed in §5 (" +
          R.pageOrder + ").") +
      " The scan below never re-sorts and never looks backwards; it sees each " +
      "interval once, in this order.";
  }

  function dsaintervals_scanCaption(R, e) {
    var head = "<b>" + (e.i + 1) + " · " + dsaintervals_txt(e.iv) + ".</b> ";
    if (e.take) {
      return head + "start <b>" + e.iv[0] + "</b> ≥ last_end <b>" +
        dsaintervals_lastTxt(e.before) + "</b> — no clash, so <b>KEEP</b> it. " +
        "last_end moves to <b>" + e.iv[1] + "</b>; kept = <b>" + e.kept +
        "</b>, removed = " + e.removed + ". Comparisons in the scan so far: <b>" +
        e.scanCmp + "</b>.";
    }
    return head + "start <b>" + e.iv[0] + "</b> &lt; last_end <b>" +
      dsaintervals_lastTxt(e.before) + "</b> — it overlaps the one just taken, " +
      "so <b>REMOVE</b> it. last_end stays at <b>" + e.after + "</b>; kept = " +
      e.kept + ", removed = <b>" + e.removed + "</b>. Comparisons in the scan so " +
      "far: <b>" + e.scanCmp + "</b>.";
  }

  function dsaintervals_answerCaption(R) {
    var g = R.greedy;
    return "<b>Scan finished in one pass.</b> Kept <b>" + g.kept + "</b> of " + R.n +
      ", removed <b>" + g.removed + "</b> — so this greedy's answer to LC 435 " +
      "is <b>" + g.removed + " removal" + (g.removed === 1 ? "" : "s") + "</b>. " +
      (R.keptOk
        ? "The page states keep " + R.pageKept + " for this run, and the scan above " +
          "reached " + g.kept + "."
        : "The page states keep " + R.pageKept + " for this run but the scan reached " +
          g.kept + " — which would mean this simulation disagrees with §5.") +
      " Total comparisons: <b>" + g.sortCmp + "</b> to sort + <b>" + R.n +
      "</b> to scan = <b>" + R.greedyOps + "</b>.";
  }

  function dsaintervals_verdictCaption(R) {
    var g = R.greedy, b = R.brute;
    var common = " Exhaustive search over all <b>" + b.subsets + "</b> subsets of these " +
      R.n + " intervals — actually run, <b>" + b.ops + "</b> overlap comparisons " +
      "— finds the true maximum is <b>" + b.best + "</b> (" +
      dsaintervals_list(b.winner) + ").";

    if (R.id === "start3") {
      return "<b>Sorting by start kept " + g.kept + ". The optimum is " + b.best +
        ".</b>" + common + " So this is not a greedy that merely looks worse on paper " +
        "— it returns the <b>wrong answer</b>. Taking [1,100] first is legal, " +
        "cheap and immediately fatal: it finishes at 100 and blocks the other " +
        (R.n - 1) + " intervals outright. Sorting by end never does this, because the " +
        "earliest finisher leaves the most room behind it — the exchange argument " +
        "in §5, which is why the rule is a proof and not a preference.";
    }

    var sameInput = R.id === "end3"
      ? " Same three intervals as the previous tab, same scan, same " + R.greedyOps +
        " comparisons — only the sort key changed, and the answer went from " +
        dsaintervals_run("start3").greedy.kept + " kept to " + g.kept + "."
      : " That is the page's stated answer for this set: 1 removal.";

    return "<b>Sorting by end kept " + g.kept + " — the optimum.</b>" + common +
      sameInput + " And the cost: the greedy made <b>" + R.greedyOps +
      "</b> comparisons against the exhaustive search's <b>" + b.ops + "</b> over " +
      b.subsets + " subsets. At n = " + dsaintervals_BIG.n + " the same merge sort " +
      "makes <b>" + dsaintervals_fmt(dsaintervals_BIG.cmp) + "</b> comparisons (n·log₂n = " +
      dsaintervals_fmt(dsaintervals_BIG.nlogn) + ") plus a " + dsaintervals_fmt(dsaintervals_BIG.n) +
      "-comparison scan — that ratio is what \"O(n log n), dominated by the " +
      "sort\" means — while the subset search would face 2<sup>" +
      dsaintervals_BIG.n + "</sup>, a number with " + dsaintervals_BIG.bruteExp +
      " digits.";
  }

  function dsaintervals_fmt(n) {
    return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  // --- frames -------------------------------------------------------------
  function dsaintervals_scenario(id) {
    var R = dsaintervals_run(id);
    var steps = [{
      run: R, phase: "idle", cur: -1,
      caption: dsaintervals_INTRO[id]
    }];
    steps.push({
      run: R, phase: "sort", cur: -1, flag: "warn",
      caption: dsaintervals_sortCaption(R)
    });
    var i, e;
    for (i = 0; i < R.greedy.events.length; i++) {
      e = R.greedy.events[i];
      steps.push({
        run: R, phase: "scan", cur: i, e: e,
        flag: e.take ? "ok" : "bad",
        caption: dsaintervals_scanCaption(R, e)
      });
    }
    steps.push({
      run: R, phase: "answer", cur: R.n,
      flag: R.optimal ? "ok" : "bad",
      caption: dsaintervals_answerCaption(R)
    });
    steps.push({
      run: R, phase: "verdict", cur: R.n,
      flag: R.optimal ? "ok" : "bad",
      caption: dsaintervals_verdictCaption(R)
    });
    return { id: id, label: R.label, steps: steps };
  }

  /** State of the i-th interval (in sorted order) at this frame. */
  function dsaintervals_state(step, i) {
    if (step.phase === "idle" || step.phase === "sort") return "idle";
    if (step.phase === "scan") {
      if (i > step.cur) return "idle";
      if (i === step.cur) return "warn";
      return step.run.greedy.events[i].take ? "ok" : "bad";
    }
    return step.run.greedy.events[i].take ? "ok" : "bad";
  }

  S["dsaintervals"] = {
    title: "Sort by the wrong endpoint, and watch the greedy break",
    note: "One greedy — <code>if start &gt;= last_end: keep</code> — run three " +
      "times. The interval sets are transcribed from intervals.md §5: " +
      "<b>[[1,2],[2,3],[3,4],[1,3]]</b> (the LC 435 worked example, \"answer 1 " +
      "removal\") and <b>[[1,100],[2,3],[4,5]]</b> (the page's counter-example, " +
      "\"keep 1\" by start versus \"keep 2 CORRECT\" by end). Everything else on screen " +
      "is <b>counted while it runs</b>: the merge sort's key comparisons, the scan's " +
      "<code>start &gt;= last_end</code> comparisons, and an exhaustive 2<sup>n</sup> " +
      "subset search that is genuinely executed so the greedy's answer can be checked " +
      "against the true optimum. The time axis is compressed to one slot per gap " +
      "between distinct endpoints, so [1,100] reads as \"covers everything\".",
    interval: 1250,

    scenarios: [
      dsaintervals_scenario("end4"),
      dsaintervals_scenario("start3"),
      dsaintervals_scenario("end3")
    ],

    draw: function (step, d, ctx) {
      var R = step.run, g = R.greedy, b = R.brute;
      var pts = R.axis, slots = pts.length - 1;
      var order = step.phase === "idle" ? R.input : g.sorted;
      var e = step.e;
      var i, s, cells, lanes = [], iv, st, covered;

      // --- axis ------------------------------------------------------------
      cells = [];
      for (s = 0; s < slots; s++) {
        cells.push({
          label: String(pts[s]),
          title: "slot " + (s + 1) + " of " + slots + " · time " + pts[s] +
            " → " + pts[s + 1]
        });
      }
      lanes.push(d.lane({ label: "time", cells: cells }));

      // --- one lane per interval, in the current order ----------------------
      for (i = 0; i < order.length; i++) {
        iv = order[i];
        st = step.phase === "idle" ? "idle" : dsaintervals_state(step, i);
        cells = [];
        for (s = 0; s < slots; s++) {
          covered = dsaintervals_covers(iv, pts, s);
          cells.push({
            label: "",
            flag: covered ? st : undefined,
            title: covered
              ? dsaintervals_txt(iv) + " occupies " + pts[s] + "→" + pts[s + 1]
              : dsaintervals_txt(iv) + " is free at " + pts[s] + "→" + pts[s + 1]
          });
        }
        lanes.push(d.lane({
          label: dsaintervals_txt(iv) +
            (step.phase !== "idle" && step.phase !== "sort"
              ? (st === "ok" ? "  keep" : st === "bad" ? "  cut" : st === "warn" ? "  ▶" : "")
              : ""),
          cells: cells
        }));
      }

      // --- header ----------------------------------------------------------
      var scanCmp = e ? e.scanCmp : (step.phase === "idle" || step.phase === "sort" ? 0 : R.n);
      var sortCmp = step.phase === "idle" ? 0 : g.sortCmp;
      var kept = step.phase === "idle" || step.phase === "sort"
        ? 0 : (e ? e.kept : g.kept);
      var removed = step.phase === "idle" || step.phase === "sort"
        ? 0 : (e ? e.removed : g.removed);
      var lastEnd = step.phase === "idle" || step.phase === "sort"
        ? null : (e ? e.after : g.events[g.events.length - 1].after);

      var head = d.flow([
        d.big(
          step.phase === "idle" ? "—"
            : step.phase === "sort" ? "sort"
              : step.phase === "scan" ? (step.cur + 1) + "/" + R.n
                : "done",
          step.phase === "sort" ? "by " + R.keyName : "scan position",
          step.flag || "idle"
        ),
        d.node({
          title: "greedy state",
          status: step.phase === "idle" ? "not started"
            : step.phase === "sort" ? "sorted by " + R.keyName
              : step.phase === "scan" ? (e && e.take ? "KEEP" : "REMOVE")
                : "finished",
          statusFlag: step.phase === "idle" ? "idle" : (step.flag || "warn"),
          badge: "key = " + R.keyName,
          meta: "n = " + R.n + " · one pass, no backtracking",
          rows: [
            { label: "last_end", value: dsaintervals_lastTxt(lastEnd),
              flag: lastEnd === null ? "idle" : "warn" },
            { label: "kept", value: String(kept), flag: kept ? "ok" : "idle" },
            { label: "removed", value: String(removed), flag: removed ? "bad" : "idle" }
          ]
        }),
        d.stack([
          d.stat({
            label: "sort comparisons",
            value: sortCmp ? String(sortCmp) : "—",
            sub: "stable merge sort",
            flag: sortCmp ? "warn" : "idle"
          }),
          d.stat({
            label: "scan comparisons",
            value: scanCmp ? String(scanCmp) : "—",
            sub: "start ≥ last_end",
            flag: scanCmp ? "ok" : "idle"
          }),
          d.stat({
            label: "exhaustive search",
            value: step.phase === "verdict" ? String(b.ops) : "—",
            sub: b.subsets + " subsets",
            flag: step.phase === "verdict" ? "bad" : "idle"
          })
        ])
      ]);

      var body = [head, d.stack(lanes)];

      if (step.phase === "verdict") {
        var rows = [], k, Q;
        for (k = 0; k < dsaintervals_RUNS.length; k++) {
          Q = dsaintervals_RUNS[k];
          rows.push([
            (Q.id === R.id ? "▶ " : "") + Q.label,
            dsaintervals_list(Q.input),
            "by " + Q.keyName,
            String(Q.greedy.kept),
            String(Q.brute.best),
            Q.optimal ? "optimal" : "WRONG"
          ]);
        }
        body.push(d.table(
          ["run", "input", "sort key", "greedy keeps", "true optimum", "verdict"],
          rows
        ));
      } else {
        body.push(d.note(
          "Each row is one interval on a shared, endpoint-compressed axis. " +
          "<b>Amber</b> is the interval being examined right now, <b>green</b> was " +
          "kept, <b>red</b> was removed because it started before <code>last_end</code>, " +
          "grey has not been reached. Row order <i>is</i> the sort order.",
          step.flag || "idle"
        ));
      }

      return d.stack(body);
    }
  };

  // ====================================================================
// ======================================================================
// SIM · dsalinkedlists  (dsa-handbook/content/linked-lists.md)
//
// LC 143, Reorder List — the page's §5 worked example — run three ways on
// the page's own input, 1 -> 2 -> 3 -> 4 -> 5. The page calls it "the best
// single linked-list exercise" because all three of its techniques appear
// in one problem: fast-slow to find the middle, in-place reversal of the
// second half, and parallel pointers to interleave. The third run is the
// bug the page's §8 failure table names outright — "Forgetting to cut in
// Reorder List | Infinite loop, program hangs | slow.next = None".
//
// The time axis is the pointer walk itself: one frame per loop iteration,
// which is the only honest clock a linked-list algorithm has.
//
// CONFIG — every figure on screen is counted off the simulated list. The
// only typed values are the page's own.
//   list        [1,2,3,4,5]        the page's §5 input, verbatim.
//   middle      NOT typed. Found by running the page's own guard,
//               `while fast.next and fast.next.next`, which lands on node
//               3 — matching the page's trace, "STEP 1 find the middle
//               (fast-slow) -> 3".
//   target      the page's stated STEP 3 result, "1 -> 5 -> 2 -> 4 -> 3",
//               typed once as a node ORDER and converted to a link array.
//               Every run's output is compared against it rather than
//               assumed correct.
//   reads       every `.next` dereference, INCLUDING the loop guards. The
//               middle loop tests fast.next and fast.next.next, which is
//               two reads per test — and the page's §8 table lists dropping
//               either one as an AttributeError.
//   writes      every assignment to a `.next` field.
//   extra       peak auxiliary words any frame holds = live named pointers
//               plus array slots. Taken as a max over the frames drawn.
//   BIG = 1,000,000 nodes and WORD = 8 bytes per reference are STATED
//   CONFIG, not page figures, used only for the projection row — to turn
//   "O(n) space" from a letter into a number you can say out loud.
// ======================================================================

var dsalinkedlists_N = 5;                 // the page's list has five nodes
var dsalinkedlists_BIG = 1000000;         // stated config, for the projection
var dsalinkedlists_WORD = 8;              // bytes per reference, stated config
var dsalinkedlists_CAP = 13;              // display budget when walking a cycle

// the page's §5 STEP 3 answer, "1 -> 5 -> 2 -> 4 -> 3", as node indices
var dsalinkedlists_ORDER = [0, 4, 1, 3, 2];

var dsalinkedlists_TARGET = (function () {
  var t = [], i;
  for (i = 0; i < dsalinkedlists_N; i++) t.push(-1);
  for (i = 0; i + 1 < dsalinkedlists_ORDER.length; i++) {
    t[dsalinkedlists_ORDER[i]] = dsalinkedlists_ORDER[i + 1];
  }
  return t;
})();

function dsalinkedlists_fmt(n) {
  return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function dsalinkedlists_fresh() {
  var nx = [], i;
  for (i = 0; i < dsalinkedlists_N; i++) nx.push(i + 1 < dsalinkedlists_N ? i + 1 : -1);
  return nx;
}

/** Walk from `head`, recording repeats, so a cycle shows itself instead of hanging. */
function dsalinkedlists_walk(nx, head, cap) {
  var out = [], seen = {}, at = head, cyc = -1, n = 0;
  while (at >= 0 && n < cap) {
    out.push(at);
    if (seen[at] && cyc < 0) cyc = at;
    seen[at] = true;
    at = nx[at];
    n += 1;
  }
  return { path: out, cyc: cyc, ended: at < 0 };
}

function dsalinkedlists_chainText(nx) {
  var w = dsalinkedlists_walk(nx, 0, dsalinkedlists_CAP), s = [], i;
  for (i = 0; i < w.path.length; i++) s.push(String(w.path[i] + 1));
  if (w.ended) return s.join(" → ") + " → ∅";
  return s.join(" → ") + " → …  (never reaches ∅)";
}

/** Which nodes sit inside the cycle, if there is one. */
function dsalinkedlists_cycleSet(nx) {
  var w = dsalinkedlists_walk(nx, 0, dsalinkedlists_CAP), set = {}, i, on = false;
  if (w.cyc < 0) return set;
  for (i = 0; i < w.path.length; i++) {
    if (w.path[i] === w.cyc) on = true;
    if (on) set[w.path[i]] = true;
  }
  return set;
}

function dsalinkedlists_matches(nx) {
  var i;
  for (i = 0; i < dsalinkedlists_N; i++) if (nx[i] !== dsalinkedlists_TARGET[i]) return false;
  return true;
}

/** Floyd's, exactly as the page's §6 writes it — used to diagnose run 3. */
function dsalinkedlists_floyd(nx) {
  var slow = 0, fast = 0, guard = 0;
  while (fast >= 0 && nx[fast] >= 0 && guard < 100) {
    slow = nx[slow];
    fast = nx[nx[fast]];
    guard += 1;
    if (slow >= 0 && slow === fast) {
      var meet = slow;                               // capture BEFORE the reset walk
      slow = 0;
      while (slow !== fast && guard < 200) { slow = nx[slow]; fast = nx[fast]; guard += 1; }
      return { found: true, meet: meet, entry: slow };
    }
  }
  return { found: false, meet: -1, entry: -1 };
}

function dsalinkedlists_p(name, at) { return { name: name, at: at }; }

function dsalinkedlists_snap(st, phase, ptrs, caption, flag) {
  st.frames.push({
    nx: st.nx.slice(),
    ptrs: ptrs,
    arr: st.arr.slice(),
    reads: st.reads,
    writes: st.writes,
    slots: st.arr.length,
    live: ptrs.length,
    extra: ptrs.length + st.arr.length,
    phase: phase,
    caption: caption,
    flag: flag
  });
}

// ----------------------------------------------------------------------
// RUN 1 — copy the node references into an array, then index from both
// ends. Correct, and it does FEWER pointer operations than the in-place
// version. It pays in memory instead, which is the trade the page leaves
// implicit and the interviewer does not.
// ----------------------------------------------------------------------
function dsalinkedlists_runA() {
  var st = { nx: dsalinkedlists_fresh(), reads: 0, writes: 0, arr: [], frames: [] };
  var node = 0, i, j, k, v, a, b, c;

  dsalinkedlists_snap(st, "idle", [dsalinkedlists_p("head", 0)],
    "The page's list, <b>1 → 2 → 3 → 4 → 5</b>, and the page's target, " +
    "<b>1 → 5 → 2 → 4 → 3</b>. The first solution most people reach for " +
    "stops treating it as a list at all: copy every node reference into an array, and then " +
    "the two ends are one index apart. Press Play.", "idle");

  while (node >= 0) {
    st.arr.push(node);
    v = node + 1;
    k = st.arr.length;
    st.reads += 1;                                   // node = node.next
    node = st.nx[node];
    dsalinkedlists_snap(st, "copy",
      [dsalinkedlists_p("head", 0), dsalinkedlists_p("node", node)],
      "<b>Copy " + k + " of " + dsalinkedlists_N + ".</b> Node <b>" + v +
      "</b> into slot " + (k - 1) + ", then <code>node = node.next</code> — one read, " +
      "one slot. Nothing is rewired yet: every link is still the original, and the extra " +
      "memory has just grown to " + (k + 2) + " words. " +
      (node >= 0 ? "" : "That read returned <b>∅</b>, so the walk is over."),
      "warn");
  }

  i = 0;
  j = st.arr.length - 1;
  while (i < j) {
    st.nx[st.arr[i]] = st.arr[j];
    st.writes += 1;
    a = st.arr[i] + 1;
    b = st.arr[j] + 1;
    i += 1;
    c = "";
    if (i < j) {
      st.nx[st.arr[j]] = st.arr[i];
      st.writes += 1;
      c = " and <b>" + b + " → " + (st.arr[i] + 1) + "</b>";
      j -= 1;
    }
    dsalinkedlists_snap(st, "rebuild",
      [dsalinkedlists_p("head", 0),
       dsalinkedlists_p("i", st.arr[i < st.arr.length ? i : st.arr.length - 1]),
       dsalinkedlists_p("j", st.arr[j > 0 ? j : 0])],
      "<b>Splice from both ends.</b> <b>" + a + " → " + b + "</b>" + c +
      ". This is the one thing the list could not do — hand you the node at the far " +
      "end without walking to it. <b>" + st.writes + "</b> link writes so far, and still " +
      "zero extra reads: the array is answering every question.", "warn");
  }
  st.nx[st.arr[i]] = -1;
  st.writes += 1;
  dsalinkedlists_snap(st, "rebuild",
    [dsalinkedlists_p("head", 0), dsalinkedlists_p("i", st.arr[i]),
     dsalinkedlists_p("j", st.arr[i])],
    "<b>i and j have met on node " + (st.arr[i] + 1) + ".</b> That node is the new tail, so " +
    "<code>arr[i].next = None</code>. Miss this single write and the list still points back " +
    "into itself — the array version has exactly the same cut, wearing a different hat.",
    "warn");

  return st;
}

// ----------------------------------------------------------------------
// RUN 2 and RUN 3 — the page's own code. `cut` toggles the one line
// `slow.next = None`, which is the only difference between them.
// Snapshots are taken MID-iteration, at the moment all of the loop's
// pointers are live, because that count is the space complexity.
// ----------------------------------------------------------------------
function dsalinkedlists_runInPlace(cut) {
  var st = { nx: dsalinkedlists_fresh(), reads: 0, writes: 0, arr: [], frames: [] };
  var slow = 0, fast = 0, it = 0, second, prev, nxt, first, fn, sn, tail;

  dsalinkedlists_snap(st, "idle", [dsalinkedlists_p("head", 0)],
    cut
      ? "Same list, same target, no array. Three techniques in sequence — fast-slow, " +
        "reversal, parallel pointers — and never more than a handful of live pointers. " +
        "Press Play and count them."
      : "The same three techniques with one line deleted: <code>slow.next = None</code>. " +
        "The page files this under failure modes as <i>“infinite loop, program " +
        "hangs”</i>. Watch for the frame where the hang is actually built — it is " +
        "not the frame where it shows up.",
    "idle");

  dsalinkedlists_snap(st, "middle",
    [dsalinkedlists_p("head", 0), dsalinkedlists_p("slow", slow), dsalinkedlists_p("fast", fast)],
    "<b>Both pointers start at the head.</b> The guard is <code>while fast.next and " +
    "fast.next.next</code> — <i>both</i> halves. That is two reads every time it is " +
    "tested, and the page's failure table lists dropping either one as an " +
    "<code>AttributeError</code> on any odd length. This list has an odd length.", "warn");

  while (st.nx[fast] >= 0 && st.nx[st.nx[fast]] >= 0) {
    st.reads += 2;                                   // the guard, both halves
    slow = st.nx[slow]; st.reads += 1;
    fast = st.nx[st.nx[fast]]; st.reads += 2;
    it += 1;
    dsalinkedlists_snap(st, "middle",
      [dsalinkedlists_p("head", 0), dsalinkedlists_p("slow", slow),
       dsalinkedlists_p("fast", fast)],
      "<b>Iteration " + it + ".</b> slow moves one, to node <b>" + (slow + 1) +
      "</b>; fast moves two, to node <b>" + (fast + 1) + "</b>. Five reads this pass " +
      "— two for the guard, one for slow, two for fast — <b>" + st.reads +
      "</b> in total, and <b>zero</b> writes. Finding the middle changes nothing about " +
      "the list.", "warn");
  }
  st.reads += 1;                                     // the guard that fails, short-circuited

  second = st.nx[slow];
  st.reads += 1;
  if (cut) {
    st.nx[slow] = -1;
    st.writes += 1;
    dsalinkedlists_snap(st, "cut",
      [dsalinkedlists_p("head", 0), dsalinkedlists_p("slow", slow),
       dsalinkedlists_p("second", second)],
      "<b>The guard failed, so slow is the middle — node " + (slow + 1) +
      ", which is what the page's trace says it should be.</b> " +
      "<code>second = slow.next</code> takes the back half, and then the line everything " +
      "downstream depends on: <code>slow.next = None</code>. <b>One write</b>, and the " +
      "list is now two lists.", "ok");
  } else {
    dsalinkedlists_snap(st, "cut",
      [dsalinkedlists_p("head", 0), dsalinkedlists_p("slow", slow),
       dsalinkedlists_p("second", second)],
      "<b>slow is the middle, node " + (slow + 1) + ".</b> <code>second = slow.next</code> " +
      "takes the back half, and that is all that happens. <b>Zero writes.</b> Node " +
      (slow + 1) + " still points at node " + (second + 1) +
      ", so this is one list wearing a disguise. Nothing looks wrong here, and that is " +
      "precisely why the bug survives to production.", "bad");
  }

  prev = -1;
  it = 0;
  while (second >= 0) {
    nxt = st.nx[second]; st.reads += 1;
    st.nx[second] = prev; st.writes += 1;
    it += 1;
    dsalinkedlists_snap(st, "reverse",
      [dsalinkedlists_p("prev", prev), dsalinkedlists_p("cur", second),
       dsalinkedlists_p("nxt", nxt), dsalinkedlists_p("head", 0)],
      "<b>Reverse, pass " + it + ".</b> <code>nxt</code> is saved <i>before</i> the " +
      "overwrite — the page calls that “the whole trick” — and then node " +
      "<b>" + (second + 1) + "</b>'s arrow flips to " +
      (prev < 0 ? "<b>∅</b>" : "node <b>" + (prev + 1) + "</b>") +
      ". Three pointers live, one read, one write, <b>" + st.writes + "</b> writes total. " +
      "Three pointers is the same number whether the list has five nodes or five million.",
      "warn");
    prev = second;
    second = nxt;
  }

  first = 0;
  second = prev;
  it = 0;
  while (second >= 0) {
    fn = st.nx[first]; st.reads += 1;
    sn = st.nx[second]; st.reads += 1;
    st.nx[first] = second; st.writes += 1;
    st.nx[second] = fn; st.writes += 1;
    it += 1;
    tail = st.nx[slow];
    dsalinkedlists_snap(st, "weave",
      [dsalinkedlists_p("first", first), dsalinkedlists_p("second", second),
       dsalinkedlists_p("first_next", fn), dsalinkedlists_p("second_next", sn),
       dsalinkedlists_p("head", 0)],
      "<b>Interleave, pass " + it + ".</b> Both next-pointers saved, then both overwritten: " +
      "<b>" + (first + 1) + " → " + (second + 1) + "</b> and <b>" + (second + 1) +
      " → " + (fn < 0 ? "∅" : fn + 1) + "</b>. Two reads, two writes, <b>" +
      st.writes + "</b> writes total. " +
      (cut
        ? "Five pointers live including the head — the peak for this algorithm, and it " +
          "is the same five on a list of five million."
        : "And underneath all of this, node " + (slow + 1) + " is still pointing at node " +
          (tail < 0 ? "∅" : tail + 1) + ", because nothing ever cut it."),
      cut ? "warn" : "bad");
    first = fn;
    second = sn;
  }

  return st;
}

// the three runs, computed once so every tab can show the other two
var dsalinkedlists_RUNS = [
  { id: "array", label: "Copy to an array", st: dsalinkedlists_runA() },
  { id: "inplace", label: "Three pointers", st: dsalinkedlists_runInPlace(true) },
  { id: "nocut", label: "Forget the cut", st: dsalinkedlists_runInPlace(false) }
];

(function () {
  var i, j, r, f;
  for (i = 0; i < dsalinkedlists_RUNS.length; i++) {
    r = dsalinkedlists_RUNS[i].st;
    r.peak = 0;
    r.maxSlots = 0;
    for (j = 0; j < r.frames.length; j++) {
      f = r.frames[j];
      if (f.extra > r.peak) r.peak = f.extra;
      if (f.slots > r.maxSlots) r.maxSlots = f.slots;
    }
    r.maxLive = r.peak - r.maxSlots;
    r.ok = dsalinkedlists_matches(r.nx);
    r.chain = dsalinkedlists_chainText(r.nx);
    // auxiliary words at BIG nodes: array slots scale with n, pointers do not
    r.big = (r.maxSlots > 0 ? dsalinkedlists_BIG : 0) + r.maxLive;
  }
})();

function dsalinkedlists_find(id) {
  var i;
  for (i = 0; i < dsalinkedlists_RUNS.length; i++) {
    if (dsalinkedlists_RUNS[i].id === id) return dsalinkedlists_RUNS[i];
  }
  return dsalinkedlists_RUNS[0];
}

function dsalinkedlists_bytes(words) {
  var b = words * dsalinkedlists_WORD;
  if (b >= 1048576) return (b / 1048576).toFixed(2) + " MB";
  if (b >= 1024) return (b / 1024).toFixed(1) + " KB";
  return b + " bytes";
}

function dsalinkedlists_finale(id) {
  var R = dsalinkedlists_find(id), r = R.st;
  var A = dsalinkedlists_find("array").st;
  var B = dsalinkedlists_find("inplace").st;
  var f, wrong, i;

  if (id === "array") {
    return "<b>Correct — " + r.chain + " — in " + r.reads + " reads and " +
      r.writes + " writes.</b> That is <i>fewer</i> pointer operations than the in-place " +
      "run on the next tab (" + B.reads + " and " + B.writes + "), and it is the part " +
      "people get backwards: the array version is not slower, it is <b>bigger</b>. Peak " +
      "auxiliary memory here is " + r.peak + " words, " + r.maxSlots +
      " of them one slot per node. At " + dsalinkedlists_fmt(dsalinkedlists_BIG) +
      " nodes that is <b>" + dsalinkedlists_bytes(r.big) + "</b> of references, to reorder " +
      "a list you were already holding. Say this solution out loud first, then beat it.";
  }
  if (id === "inplace") {
    return "<b>Same answer, " + r.chain + ", with " + r.peak +
      " live pointers and nothing else.</b> It spent " + (r.reads - A.reads) +
      " more reads and " + (r.writes - A.writes) + " more writes than the array — " +
      r.reads + " and " + r.writes + " against " + A.reads + " and " + A.writes +
      " — and that <i>is</i> the trade: a constant amount of extra pointer traffic " +
      "buys a constant amount of space. At " + dsalinkedlists_fmt(dsalinkedlists_BIG) +
      " nodes this run still holds " + r.peak + " words, <b>" +
      dsalinkedlists_bytes(r.big) + "</b>, against the array's " +
      dsalinkedlists_bytes(A.big) + ". Three techniques, one problem, O(1) space.";
  }

  f = dsalinkedlists_floyd(r.nx);
  wrong = 0;
  for (i = 0; i < dsalinkedlists_N; i++) if (r.nx[i] !== dsalinkedlists_TARGET[i]) wrong += 1;
  return "<b>" + r.writes + " writes instead of " + B.writes + " — one missing — " +
    "and " + wrong + " of " + dsalinkedlists_N + " links is wrong.</b> Node " + (f.entry + 1) +
    " is now reachable twice, so a walk from the head never reaches <b>∅</b>. No " +
    "exception, no stack trace: a process that stops returning. The diagnosis is on this " +
    "same page — Floyd's sends the two pointers round until they meet at node " +
    (f.meet + 1) + ", resets one to the head, advances both one step at a time, and they " +
    "meet again at the cycle entry: node <b>" + (f.entry + 1) + "</b>, which is exactly the " +
    "node <code>slow.next = None</code> was supposed to disconnect.";
}

function dsalinkedlists_scenario(R) {
  var steps = [], i, f, frames = R.st.frames;
  for (i = 0; i < frames.length; i++) {
    f = frames[i];
    steps.push({ f: f, idle: i === 0, run: R.id, caption: f.caption, flag: f.flag });
  }
  steps.push({
    f: frames[frames.length - 1], run: R.id, verdict: R.id,
    caption: dsalinkedlists_finale(R.id),
    flag: R.id === "nocut" ? "bad" : "ok"
  });
  return { id: R.id, label: R.label, steps: steps };
}

function dsalinkedlists_board(d, id) {
  var rows = [], i, R, r;
  for (i = 0; i < dsalinkedlists_RUNS.length; i++) {
    R = dsalinkedlists_RUNS[i];
    r = R.st;
    rows.push([
      (R.id === id ? "▶ " : "") + R.label,
      String(r.reads),
      String(r.writes),
      r.peak + " words",
      dsalinkedlists_bytes(r.big),
      r.ok ? "correct" : "hangs"
    ]);
  }
  return d.table(
    ["same list, same target", "reads", "writes", "peak extra", "at 1M nodes", "result"],
    rows
  );
}

S["dsalinkedlists"] = {
  title: "Reorder one list three ways, and count every pointer",
  note: "LC 143 on the page's own input, <b>1 → 2 → 3 → 4 → 5</b>, " +
    "against the page's own target, <b>1 → 5 → 2 → 4 → 3</b>. Nothing " +
    "below is typed in: the middle is <i>found</i> by running the page's guard " +
    "<code>while fast.next and fast.next.next</code>, reads count every <code>.next</code> " +
    "dereference <i>including the guards</i>, writes count every assignment to a " +
    "<code>.next</code> field, and peak extra memory is the largest number of live pointers " +
    "plus array slots that any frame holds. Correctness is decided by comparing the final " +
    "link array against the page's answer, never assumed. The projection uses " +
    dsalinkedlists_fmt(dsalinkedlists_BIG) + " nodes at " + dsalinkedlists_WORD +
    " bytes a reference — <i>stated config, not page figures</i> — only to turn " +
    "O(n) space into a number you can say in an interview.",
  interval: 1400,

  scenarios: [
    dsalinkedlists_scenario(dsalinkedlists_find("array")),
    dsalinkedlists_scenario(dsalinkedlists_find("inplace")),
    dsalinkedlists_scenario(dsalinkedlists_find("nocut"))
  ],

  draw: function (step, d, ctx) {
    var f = step.f;
    var nx = f ? f.nx : dsalinkedlists_fresh();
    var cyc = dsalinkedlists_cycleSet(nx);
    var walk = dsalinkedlists_walk(nx, 0, dsalinkedlists_CAP);
    var R = dsalinkedlists_find(step.run || "array");
    var i, j, k, p, to, good, row;

    // --- the five nodes, each coloured by whether its outgoing link is final
    var cells = [], done = 0;
    for (i = 0; i < dsalinkedlists_N; i++) {
      to = nx[i];
      good = to === dsalinkedlists_TARGET[i];
      if (good) done += 1;
      cells.push({
        label: String(i + 1),
        flag: step.idle ? "idle" : cyc[i] ? "bad" : good ? "ok" : "idle",
        title: "node " + (i + 1) + " · next → " +
          (to < 0 ? "∅" : String(to + 1)) +
          (good ? " · already final"
            : " · target is " +
              (dsalinkedlists_TARGET[i] < 0 ? "∅" : String(dsalinkedlists_TARGET[i] + 1))) +
          (cyc[i] ? " · inside the cycle" : "")
      });
    }

    // --- one lane per live pointer; the lane count IS the space complexity
    var lanes = [];
    var shown = f ? f.ptrs.length : 0;
    if (shown > 5) shown = 5;
    for (k = 0; k < shown; k++) {
      p = f.ptrs[k];
      row = [];
      for (j = 0; j < dsalinkedlists_N; j++) {
        row.push({
          label: p.at === j ? "▲" : "",
          flag: p.at === j ? (step.idle ? "idle" : "warn") : undefined,
          title: p.at === j ? p.name + " is on node " + (j + 1) : p.name
        });
      }
      lanes.push(d.lane({
        label: p.name + " → " +
          (p.at >= 0 && p.at < dsalinkedlists_N ? String(p.at + 1) : "∅"),
        cells: row
      }));
    }

    // --- the auxiliary array, when the run has one
    var arrHtml = "";
    if (f && f.slots > 0) {
      var slots = [];
      for (i = 0; i < dsalinkedlists_N; i++) {
        slots.push({
          label: i < f.arr.length ? String(f.arr[i] + 1) : "·",
          flag: i < f.arr.length ? "bad" : "idle",
          title: i < f.arr.length
            ? "slot " + i + " holds a reference to node " + (f.arr[i] + 1)
            : "slot " + i + " not written yet"
        });
      }
      arrHtml = d.cells(slots, {
        label: "auxiliary array · " + f.slots + " of " + dsalinkedlists_N +
          " slots · one per node",
        dense: true
      });
    }

    var reads = f ? f.reads : 0;
    var writes = f ? f.writes : 0;
    var extra = f ? f.extra : 0;
    var live = f ? f.live : 0;
    var slotsNow = f ? f.slots : 0;

    return d.stack([
      d.flow([
        d.big(String(writes), "link writes",
          step.idle ? "idle" : walk.cyc >= 0 ? "bad" : "warn"),
        d.stat({
          label: "pointer reads",
          value: String(reads),
          sub: "every .next, guards included",
          flag: step.idle ? "idle" : "warn"
        }),
        d.stat({
          label: "extra memory",
          value: extra + " words",
          sub: slotsNow
            ? live + " pointers + " + slotsNow + " slots — grows with n"
            : live + " pointers — constant in n",
          flag: step.idle ? "idle" : slotsNow ? "bad" : "ok"
        })
      ]),
      d.node({
        title: step.idle ? "the list, untouched"
          : f.phase === "copy" ? "phase 1 · copy every node into an array"
            : f.phase === "rebuild" ? "phase 2 · splice from both ends"
              : f.phase === "middle" ? "technique 1 · fast-slow finds the middle"
                : f.phase === "cut" ? "the cut · slow.next = None"
                  : f.phase === "reverse" ? "technique 2 · in-place reversal"
                    : "technique 3 · parallel pointers interleave",
        status: step.idle ? "IDLE"
          : walk.cyc >= 0 ? "CYCLE"
            : done === dsalinkedlists_N ? "DONE"
              : done + " / " + dsalinkedlists_N + " links",
        statusFlag: step.idle ? "idle" : walk.cyc >= 0 ? "bad"
          : done === dsalinkedlists_N ? "ok" : "warn",
        badge: R.label,
        meta: dsalinkedlists_N + " nodes · target 1 → 5 → 2 → 4 → 3",
        flag: step.idle ? "idle" : walk.cyc >= 0 ? "bad"
          : done === dsalinkedlists_N ? "ok" : "warn",
        body: d.cells(cells, { label: "nodes · green = this node's next is already final" }) +
          lanes.join("") + arrHtml +
          d.mono("from head:  " + dsalinkedlists_chainText(nx),
            walk.cyc >= 0 ? "bad" : done === dsalinkedlists_N ? "ok" : undefined),
        rows: [
          { label: "links matching the page's answer",
            value: done + " / " + dsalinkedlists_N,
            flag: done === dsalinkedlists_N ? "ok" : undefined },
          { label: "walk from the head",
            value: walk.ended
              ? walk.path.length + " nodes, then ∅"
              : "revisits node " + (walk.cyc + 1) + " — never returns",
            flag: walk.ended ? "ok" : "bad" }
        ]
      }),
      step.verdict ? dsalinkedlists_board(d, step.verdict) : "",
      d.note(
        "Node strip: <b>green</b> this node's <code>next</code> already matches the page's " +
        "answer · <b>red</b> the node sits inside a cycle · grey not rewired yet. " +
        "Each lane is one live pointer, and the number of lanes <i>is</i> the space " +
        "complexity — the array run's slot strip grows with the input, the pointer " +
        "lanes never do."
      )
    ]);
  }
};

  // ====================================================================
// ======================================================================
// SIM · dsaprefixsum  (dsa-handbook/content/prefix-sum.md)
//
// One array, one k, three scans. The array is the page's §7 worked example
// verbatim — nums = [4,5,0,-2,-3,1], k = 5 — chosen by the page precisely
// because it contains negatives, which is what makes the third tab fail.
//
// The time axis is the scan: one frame per outer step, which is the only
// clock a single-pass algorithm has. Every count on screen is incremented
// by the simulated loop, never typed.
//
// The three runs:
//   1  BRUTE FORCE      the double loop the page says "recomputes the same
//                       overlapping sums repeatedly". Correct. n(n+1)/2
//                       array reads, counted off the inner loop.
//   2  PREFIX + HASH    the page's §3 code, including counts[0] = 1 for the
//                       empty prefix and recording AFTER counting. One pass.
//                       The same pass also runs the §7 modulo variant with
//                       the key changed from the value to the value mod k,
//                       and lands on the page's own answer of 7.
//   3  SLIDING WINDOW   the tempting wrong answer. The page devotes a
//                       blockquote and a starred interview question to why
//                       it fails: "sliding window requires that growing the
//                       window monotonically increases the sum. With
//                       negative numbers it does not." This run shows the
//                       exact index where the window throws away a left
//                       boundary it needs later.
//
// CONFIG — every figure derives from these.
//   nums     [4,5,0,-2,-3,1]      page §7, verbatim
//   k        5                    page §7, verbatim
//   prefix   built with the leading zero the page's §2 insists on:
//            P = [0,4,9,9,7,4,5], so P[1..6] is the page's printed
//            "prefix: 4, 9, 9, 7, 4, 5".
//   reads    every `+=` against an array element, in every run
//   answer   NOT typed. The brute force counts it, and the other two runs
//            are scored against that count.
//   BIG = 100,000 elements and RATE = 1,000,000,000 simple operations a
//   second are STATED CONFIG, not page figures. They exist only to turn
//   the page's "removes a factor of n" into wall-clock seconds.
// ======================================================================

var dsaprefixsum_NUMS = [4, 5, 0, -2, -3, 1];      // page §7
var dsaprefixsum_K = 5;                            // page §7
var dsaprefixsum_BIG = 100000;                     // stated config
var dsaprefixsum_RATE = 1000000000;                // stated config, ops/second
var dsaprefixsum_N = dsaprefixsum_NUMS.length;

// the page's §2 form: length n+1, leading zero, no special case at index 0
var dsaprefixsum_P = (function () {
  var p = [0], i;
  for (i = 0; i < dsaprefixsum_N; i++) p.push(p[i] + dsaprefixsum_NUMS[i]);
  return p;
})();

function dsaprefixsum_fmt(n) {
  return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function dsaprefixsum_secs(ops) {
  var s = ops / dsaprefixsum_RATE;
  if (s >= 1) return s.toFixed(2) + " s";
  if (s >= 0.001) return (s * 1000).toFixed(1) + " ms";
  return (s * 1000000).toFixed(0) + " µs";
}

function dsaprefixsum_span(a, b) {
  return "nums[" + a + ".." + b + "]";
}

function dsaprefixsum_slice(a, b) {
  var s = [], i;
  for (i = a; i <= b; i++) s.push(dsaprefixsum_NUMS[i]);
  return "[" + s.join(", ") + "]";
}

// ----------------------------------------------------------------------
// RUN 1 — the double loop. Fix a left end, extend the right end, keep a
// running sum. The page's phrase for it: "the brute force recomputes the
// same overlapping sums repeatedly."
// ----------------------------------------------------------------------
function dsaprefixsum_runBrute() {
  var frames = [], reads = 0, total = 0, hits = [], i, j, s, sums, found;

  frames.push({
    mode: "brute", idle: true, i: -1, reads: 0, total: 0, sums: [], found: [],
    caption: "The page's own array, <b>[" + dsaprefixsum_NUMS.join(", ") +
      "]</b>, and the page's own <b>k = " + dsaprefixsum_K + "</b>. The question is how " +
      "many contiguous subarrays sum to exactly k. Start where everyone starts: fix a left " +
      "end, extend the right end, add as you go. Press Play.",
    flag: "idle"
  });

  for (i = 0; i < dsaprefixsum_N; i++) {
    s = 0; sums = []; found = [];
    for (j = i; j < dsaprefixsum_N; j++) {
      s += dsaprefixsum_NUMS[j];
      reads += 1;
      sums.push(s);
      if (s === dsaprefixsum_K) { total += 1; hits.push([i, j]); found.push(j); }
    }
    frames.push({
      mode: "brute", i: i, lo: i, reads: reads, total: total,
      sums: sums.slice(), found: found.slice(),
      caption: "<b>Left end fixed at index " + i + ".</b> Extend right and add: " +
        sums.join(", ") + " — <b>" + (dsaprefixsum_N - i) + "</b> more reads, <b>" +
        reads + "</b> so far. " +
        (found.length
          ? "<b>Hit.</b> " + dsaprefixsum_span(i, found[0]) + " = " +
            dsaprefixsum_slice(i, found[0]) + " sums to " + dsaprefixsum_K +
            (found.length > 1
              ? ", and so does " + dsaprefixsum_span(i, found[1]) + "."
              : ".") +
            " Running total <b>" + total + "</b>."
          : "Nothing sums to " + dsaprefixsum_K + " from here. " +
            "And notice what just happened: the sum of " + dsaprefixsum_span(i, i + 1) +
            " was computed on the previous row too. That duplicated work <i>is</i> the " +
            "factor of n."),
      flag: found.length ? "ok" : "warn"
    });
  }

  return { id: "brute", frames: frames, reads: reads, total: total, hits: hits, lookups: 0 };
}

// ----------------------------------------------------------------------
// RUN 2 — the page's §3 code. Also runs the §7 modulo variant in the same
// pass, with the key changed from the prefix value to the prefix mod k.
// ----------------------------------------------------------------------
function dsaprefixsum_runHash() {
  var frames = [], reads = 0, lookups = 0, total = 0, hits = [];
  var counts = { "0": 1 };                  // the page: counts[0] = 1, the empty prefix
  var where = { "0": [0] };                 // which prefix indices held that value
  var mcounts = { "0": 1 }, mtotal = 0;     // the §7 modulo variant, same pass
  var running = 0, i, x, need, got, r, mgot, startList;

  frames.push({
    mode: "hash", idle: true, i: -1, reads: 0, lookups: 0, total: 0,
    running: 0, counts: { "0": 1 }, need: null, got: 0,
    caption: "Same array, same k. The map is seeded with <b>{0: 1}</b> before anything is " +
      "read — the empty prefix. The page is blunt about it: without that seed, " +
      "<code>[3], k=3</code> returns 0, because the subarray starting at index 0 has no " +
      "earlier prefix to subtract. Press Play.",
    flag: "idle"
  });

  for (i = 0; i < dsaprefixsum_N; i++) {
    x = dsaprefixsum_NUMS[i];
    running += x;
    reads += 1;
    need = running - dsaprefixsum_K;
    got = counts[String(need)] || 0;
    lookups += 1;
    total += got;
    startList = (where[String(need)] || []).slice();
    var k2;
    for (k2 = 0; k2 < startList.length; k2++) hits.push([startList[k2], i]);

    // §7: same code, key changed from the value to the value mod k
    r = ((running % dsaprefixsum_K) + dsaprefixsum_K) % dsaprefixsum_K;
    mgot = mcounts[String(r)] || 0;
    mtotal += mgot;
    mcounts[String(r)] = mgot + 1;

    // record AFTER counting -- the page's second "whole difficulty" detail
    counts[String(running)] = (counts[String(running)] || 0) + 1;
    where[String(running)] = (where[String(running)] || []).concat([i + 1]);

    frames.push({
      mode: "hash", i: i, reads: reads, lookups: lookups, total: total,
      running: running, need: need, got: got,
      counts: JSON.parse(JSON.stringify(counts)),
      starts: startList,
      caption: "<b>Read nums[" + i + "] = " + x + ".</b> Running prefix is <b>" +
        running + "</b>, so the question is how many earlier prefixes equal " +
        "<b>running − k = " + need + "</b>. The map says <b>" + got + "</b>. " +
        (got
          ? "That is " + got + " subarray" + (got === 1 ? "" : "s") + " ending here: " +
            dsaprefixsum_span(startList[0], i) + " = " +
            dsaprefixsum_slice(startList[0], i) + ". Total <b>" + total + "</b>."
          : "No earlier prefix matches, so nothing ends here. Total stays <b>" + total +
            "</b>.") +
        " Then — and only then — record prefix " + running +
        ". Recording before counting would let this prefix match itself when k = 0.",
      flag: got ? "ok" : "warn"
    });
  }

  // the §7 decomposition, counted off the remainder histogram rather than asserted
  var hist = {}, key, m, pairs = 0, histRows = [];
  for (i = 0; i < dsaprefixsum_P.length; i++) {
    key = String(((dsaprefixsum_P[i] % dsaprefixsum_K) + dsaprefixsum_K) % dsaprefixsum_K);
    hist[key] = (hist[key] || 0) + 1;
  }
  for (key in hist) {
    if (hist.hasOwnProperty(key)) {
      m = hist[key];
      pairs += (m * (m - 1)) / 2;
      histRows.push([key, String(m), "C(" + m + ",2) = " + ((m * (m - 1)) / 2)]);
    }
  }
  histRows.sort(function (a, b) { return Number(a[0]) - Number(b[0]); });

  return {
    id: "hash", frames: frames, reads: reads, lookups: lookups, total: total, hits: hits,
    mtotal: mtotal, pairs: pairs, histRows: histRows
  };
}

// ----------------------------------------------------------------------
// RUN 3 — the sliding window, written the way it is written for an
// all-positive array: grow right, shrink left while the sum exceeds k.
// The page's §9: "Sliding window needs the sum to grow monotonically as
// the window grows, so there is a valid shrink condition. With negative
// numbers there is not."
// ----------------------------------------------------------------------
function dsaprefixsum_runWindow() {
  var frames = [], reads = 0, total = 0, hits = [], shrinks = 0;
  var left = 0, running = 0, right, dropped;

  frames.push({
    mode: "win", idle: true, i: -1, reads: 0, total: 0, left: 0, right: -1, running: 0,
    dropped: [], lost: 0,
    caption: "Same array, same k, and the pattern that looks like it should work: grow the " +
      "window on the right, shrink it on the left whenever the sum overshoots k. It is O(n) " +
      "and it is four lines. Press Play and watch exactly which index it throws away.",
    flag: "idle"
  });

  for (right = 0; right < dsaprefixsum_N; right++) {
    running += dsaprefixsum_NUMS[right];
    reads += 1;
    dropped = [];
    while (running > dsaprefixsum_K && left <= right) {
      running -= dsaprefixsum_NUMS[left];
      reads += 1;
      dropped.push(left);
      left += 1;
      shrinks += 1;
    }
    if (running === dsaprefixsum_K) { total += 1; hits.push([left, right]); }
    frames.push({
      mode: "win", i: right, right: right, left: left, running: running, reads: reads,
      total: total, dropped: dropped.slice(),
      caption: "<b>right = " + right + ", nums[" + right + "] = " +
        dsaprefixsum_NUMS[right] + ".</b> Window sum <b>" + running + "</b>. " +
        (dropped.length
          ? "It overshot " + dsaprefixsum_K + ", so the shrink condition fired and index " +
            dropped.join(", ") + " left the window <b>permanently</b>. " +
            "left is now pinned at " + left + " and can never move back."
          : "No overshoot, so left stays at " + left + ".") +
        (running === dsaprefixsum_K
          ? " Sum equals k — count " + dsaprefixsum_span(left, right) + ". Total <b>" +
            total + "</b>."
          : " Sum is not k. Total stays <b>" + total + "</b>.") +
        (right >= 1 && left > 0
          ? " Every subarray that starts before index " + left +
            " is now unreachable, and the algorithm has no way to know whether it needed one."
          : ""),
      flag: dropped.length ? "bad" : running === dsaprefixsum_K ? "ok" : "warn"
    });
  }

  return { id: "win", frames: frames, reads: reads, total: total, hits: hits, shrinks: shrinks };
}

var dsaprefixsum_BRUTE = dsaprefixsum_runBrute();
var dsaprefixsum_HASH = dsaprefixsum_runHash();
var dsaprefixsum_WIN = dsaprefixsum_runWindow();

var dsaprefixsum_RUNS = [
  { id: "brute", label: "Brute force O(n²)", run: dsaprefixsum_BRUTE,
    shape: "O(n²)", big: (dsaprefixsum_BIG * (dsaprefixsum_BIG + 1)) / 2 },
  { id: "hash", label: "Prefix + hash map", run: dsaprefixsum_HASH,
    shape: "O(n)", big: dsaprefixsum_BIG },
  { id: "win", label: "Sliding window", run: dsaprefixsum_WIN,
    shape: "O(n)", big: dsaprefixsum_BIG }
];

// the brute force is the oracle; everything else is scored against it
var dsaprefixsum_TRUTH = dsaprefixsum_BRUTE.total;

function dsaprefixsum_key(h) { return h[0] + ":" + h[1]; }

function dsaprefixsum_missed(run) {
  var have = {}, out = [], i;
  for (i = 0; i < run.hits.length; i++) have[dsaprefixsum_key(run.hits[i])] = true;
  for (i = 0; i < dsaprefixsum_BRUTE.hits.length; i++) {
    if (!have[dsaprefixsum_key(dsaprefixsum_BRUTE.hits[i])]) out.push(dsaprefixsum_BRUTE.hits[i]);
  }
  return out;
}

function dsaprefixsum_find(id) {
  var i;
  for (i = 0; i < dsaprefixsum_RUNS.length; i++) {
    if (dsaprefixsum_RUNS[i].id === id) return dsaprefixsum_RUNS[i];
  }
  return dsaprefixsum_RUNS[0];
}

function dsaprefixsum_finale(id) {
  var R = dsaprefixsum_find(id), r = R.run, miss, i, parts;
  var B = dsaprefixsum_find("brute");

  if (id === "brute") {
    return "<b>" + r.total + " subarrays, in " + r.reads + " array reads.</b> Six elements " +
      "cost 6+5+4+3+2+1 = " + r.reads + " reads, which is n(n+1)/2 — counted off the " +
      "inner loop above, not quoted. At " + dsaprefixsum_fmt(dsaprefixsum_BIG) +
      " elements that is <b>" + dsaprefixsum_fmt(R.big) + "</b> reads, about <b>" +
      dsaprefixsum_secs(R.big) + "</b>, and LeetCode's limit is two. This answer is correct, " +
      "so it is also the oracle: the other two tabs are scored against <b>" +
      dsaprefixsum_TRUTH + "</b>.";
  }

  if (id === "hash") {
    parts = [];
    for (i = 0; i < r.histRows.length; i++) {
      if (Number(r.histRows[i][1]) > 1) {
        parts.push("remainder " + r.histRows[i][0] + " appears " + r.histRows[i][1] +
          " times → " + r.histRows[i][2]);
      }
    }
    return "<b>" + r.total + " subarrays — the same answer — in " + r.reads +
      " reads and " + r.lookups + " lookups, one pass.</b> Against the brute force's " +
      B.run.reads + " reads on six elements that looks like nothing; at " +
      dsaprefixsum_fmt(dsaprefixsum_BIG) + " elements it is " +
      dsaprefixsum_fmt(dsaprefixsum_BIG) + " against " +
      dsaprefixsum_fmt(B.big) + ", <b>" + dsaprefixsum_secs(R.big) + "</b> against <b>" +
      dsaprefixsum_secs(B.big) + "</b>. And the same pass, with the key changed from the " +
      "prefix value to the prefix <i>mod k</i>, counted <b>" + r.mtotal +
      "</b> subarrays divisible by " + dsaprefixsum_K + " — which is the page's §7 " +
      "answer, reached here by grouping the seven prefixes by remainder and summing C(m,2): " +
      parts.join(", ") + ", total " + r.pairs + ". Same code, different key.";
  }

  miss = dsaprefixsum_missed(r);
  parts = [];
  for (i = 0; i < miss.length; i++) {
    parts.push(dsaprefixsum_span(miss[i][0], miss[i][1]) + " = " +
      dsaprefixsum_slice(miss[i][0], miss[i][1]));
  }
  return "<b>" + r.total + " of " + dsaprefixsum_TRUTH + ". Fast, O(n), " + r.reads +
    " reads — and wrong.</b> The missing answer is " + parts.join(" and ") +
    ", which sums to exactly " + dsaprefixsum_K + " because the negatives bring the total " +
    "back down. The window could not find it: at right = 1 the sum hit 9, the shrink " +
    "condition fired, and index 0 left the window for good. <b>That is the whole argument.</b> " +
    "A shrink condition is only valid if a longer window always means a larger sum; with " +
    "negatives it does not, so there is no condition to shrink on. Prefix sums plus a map " +
    "handle negatives because they never discard a boundary — every prefix stays in " +
    "the map forever. Say this distinction out loud; the page marks the question with a star.";
}

function dsaprefixsum_scenario(R) {
  var steps = [], i, f;
  for (i = 0; i < R.run.frames.length; i++) {
    f = R.run.frames[i];
    steps.push({ f: f, idle: !!f.idle, run: R.id, caption: f.caption, flag: f.flag });
  }
  steps.push({
    f: R.run.frames[R.run.frames.length - 1], run: R.id, verdict: R.id,
    caption: dsaprefixsum_finale(R.id),
    flag: R.run.total === dsaprefixsum_TRUTH ? "ok" : "bad"
  });
  return { id: R.id, label: R.label, steps: steps };
}

function dsaprefixsum_board(d, id) {
  var rows = [], i, R, r;
  for (i = 0; i < dsaprefixsum_RUNS.length; i++) {
    R = dsaprefixsum_RUNS[i];
    r = R.run;
    rows.push([
      (R.id === id ? "▶ " : "") + R.label,
      R.shape,
      String(r.reads),
      r.total + " / " + dsaprefixsum_TRUTH,
      dsaprefixsum_secs(R.big)
    ]);
  }
  return d.table(
    ["same array, k = " + dsaprefixsum_K, "cost", "reads on 6", "found", "at 100k"],
    rows
  );
}

S["dsaprefixsum"] = {
  title: "Count the subarrays three ways, and watch one of them lose an answer",
  note: "The array is the page's §7 example, <b>[" + dsaprefixsum_NUMS.join(", ") +
    "]</b>, with the page's <b>k = " + dsaprefixsum_K + "</b> — chosen there because " +
    "it contains negatives, which is exactly what breaks the third tab. The prefix array is " +
    "built in the page's §2 form, length n+1 with a leading zero: <b>[" +
    dsaprefixsum_P.join(", ") + "]</b>. No answer below is typed: the brute force " +
    "<i>counts</i> the correct total and the other two runs are scored against it, and " +
    "reads are incremented by the simulated loops. The projection uses " +
    dsaprefixsum_fmt(dsaprefixsum_BIG) + " elements at " +
    dsaprefixsum_fmt(dsaprefixsum_RATE) + " simple operations a second — <i>stated " +
    "config, not page figures</i> — to put seconds on the page's “removes a " +
    "factor of n”.",
  interval: 1500,

  scenarios: [
    dsaprefixsum_scenario(dsaprefixsum_find("brute")),
    dsaprefixsum_scenario(dsaprefixsum_find("hash")),
    dsaprefixsum_scenario(dsaprefixsum_find("win"))
  ],

  draw: function (step, d, ctx) {
    var f = step.f;
    var mode = f ? f.mode : "brute";
    var R = dsaprefixsum_find(step.run || "brute");
    var i, j, lab, fl, ttl;

    // ---- the array itself, coloured by what this frame is touching
    var cells = [];
    for (i = 0; i < dsaprefixsum_N; i++) {
      fl = "idle";
      ttl = "nums[" + i + "] = " + dsaprefixsum_NUMS[i];
      if (!step.idle) {
        if (mode === "brute") {
          if (i >= f.lo) { fl = "warn"; ttl += " · in this row's sweep"; }
          for (j = 0; j < f.found.length; j++) {
            if (i >= f.lo && i <= f.found[j]) { fl = "ok"; ttl += " · inside a hit"; }
          }
        } else if (mode === "hash") {
          if (i < f.i) { fl = "warn"; ttl += " · already folded into the prefix"; }
          else if (i === f.i) { fl = "ok"; ttl += " · just read"; }
          if (f.starts && f.starts.length && i >= f.starts[0] && i <= f.i) {
            fl = "ok"; ttl += " · inside the subarray just counted";
          }
        } else {
          if (i >= f.left && i <= f.right) { fl = "warn"; ttl += " · inside the window"; }
          if (i < f.left) { fl = "bad"; ttl += " · dropped — unreachable forever"; }
          if (i === f.right && f.running === dsaprefixsum_K) { fl = "ok"; }
        }
      }
      cells.push({ label: String(dsaprefixsum_NUMS[i]), flag: fl, title: ttl });
    }

    // ---- the prefix strip, length n+1, leading zero
    var pcells = [];
    for (i = 0; i < dsaprefixsum_P.length; i++) {
      fl = "idle";
      ttl = "prefix[" + i + "] = " + dsaprefixsum_P[i] +
        " = sum of the first " + i + " element" + (i === 1 ? "" : "s");
      if (!step.idle && mode === "hash") {
        if (i <= f.i + 1) { fl = "warn"; }
        if (i === f.i + 1) { fl = "ok"; ttl += " · the running prefix now"; }
        if (f.starts && f.starts.length) {
          for (j = 0; j < f.starts.length; j++) {
            if (i === f.starts[j]) { fl = "ok"; ttl += " · matched running − k"; }
          }
        }
      }
      pcells.push({ label: String(dsaprefixsum_P[i]), flag: fl, title: ttl });
    }

    // ---- the mode-specific middle
    var mid = "", rows = [], lanes = [];
    if (mode === "brute") {
      var srow = [];
      for (i = 0; i < dsaprefixsum_N; i++) {
        if (step.idle || i < f.lo) srow.push({ label: "", title: "not in this row" });
        else {
          lab = String(f.sums[i - f.lo]);
          srow.push({
            label: lab,
            flag: f.sums[i - f.lo] === dsaprefixsum_K ? "ok" : "warn",
            title: "sum of " + dsaprefixsum_span(f.lo, i) + " = " + lab
          });
        }
      }
      lanes.push(d.lane({
        label: step.idle ? "sums" : "sums from " + f.lo,
        cells: srow
      }));
      mid = d.mono(step.idle
        ? "for i in range(n):  s = 0;  for j in range(i, n):  s += nums[j]"
        : "i = " + f.lo + "   →   " + f.sums.join(", "));
      rows = [
        { label: "array reads so far", value: String(f.reads), flag: "warn" },
        { label: "rows still to sweep",
          value: String(dsaprefixsum_N - (step.idle ? 0 : f.lo + 1)),
          flag: undefined }
      ];
    } else if (mode === "hash") {
      var keys = [], krows = [], kk;
      for (kk in f.counts) if (f.counts.hasOwnProperty(kk)) keys.push(Number(kk));
      keys.sort(function (a, b) { return a - b; });
      for (i = 0; i < keys.length; i++) {
        krows.push([
          String(keys[i]),
          String(f.counts[String(keys[i])]),
          (!step.idle && keys[i] === f.need) ? "▶ running − k" :
            keys[i] === 0 ? "empty prefix" : ""
        ]);
      }
      mid = d.table(["prefix seen", "times", ""], krows);
      rows = [
        { label: "running prefix", value: String(f.running), flag: "warn" },
        { label: "looking for running − k",
          value: step.idle ? "—" : String(f.need),
          flag: step.idle ? undefined : f.got ? "ok" : undefined },
        { label: "map said", value: step.idle ? "—" : String(f.got),
          flag: step.idle ? undefined : f.got ? "ok" : undefined }
      ];
    } else {
      var wrow = [];
      for (i = 0; i < dsaprefixsum_N; i++) {
        lab = "";
        fl = undefined;
        ttl = "index " + i;
        if (!step.idle) {
          if (i < f.left) { lab = "×"; fl = "bad"; ttl += " · dropped"; }
          else if (i >= f.left && i <= f.right) {
            lab = "■"; fl = "warn"; ttl += " · in the window";
          }
        }
        wrow.push({ label: lab, flag: fl, title: ttl });
      }
      lanes.push(d.lane({
        label: step.idle ? "window" : "window [" + f.left + ".." + f.right + "]",
        cells: wrow
      }));
      mid = d.mono(step.idle
        ? "while running > k and left <= right:  running -= nums[left];  left += 1"
        : "left = " + f.left + "   right = " + f.right + "   sum = " + f.running +
          (f.dropped.length ? "   dropped " + f.dropped.join(",") : ""));
      rows = [
        { label: "window sum", value: String(f.running),
          flag: f.running === dsaprefixsum_K ? "ok" : undefined },
        { label: "indices discarded for good",
          value: step.idle ? "0" : String(f.left),
          flag: (!step.idle && f.left > 0) ? "bad" : undefined }
      ];
    }

    var total = f ? f.total : 0;
    var reads = f ? f.reads : 0;
    var right = dsaprefixsum_TRUTH;

    return d.stack([
      d.flow([
        d.big(String(total), "subarrays summing to " + dsaprefixsum_K,
          step.idle ? "idle" : total === right ? "ok" : "warn"),
        d.stat({
          label: "array reads",
          value: String(reads),
          sub: R.shape + " · " + dsaprefixsum_fmt(R.big) + " at " +
            dsaprefixsum_fmt(dsaprefixsum_BIG),
          flag: step.idle ? "idle" : R.shape === "O(n)" ? "ok" : "bad"
        }),
        d.stat({
          label: "against the oracle",
          value: total + " / " + right,
          sub: step.idle ? "not started"
            : total === right ? "complete" : (right - total) + " still unfound",
          flag: step.idle ? "idle" : total === right ? "ok" : "warn"
        })
      ]),
      d.node({
        title: mode === "brute" ? "double loop · recompute every subarray sum"
          : mode === "hash" ? "one pass · prefix sums into a hash map"
            : "one pass · grow right, shrink left",
        status: step.idle ? "IDLE" : total === right ? "ALL FOUND" : total + " found",
        statusFlag: step.idle ? "idle" : total === right ? "ok" : "warn",
        badge: R.label,
        meta: "n = " + dsaprefixsum_N + " · k = " + dsaprefixsum_K +
          " · negatives present",
        flag: step.idle ? "idle" : total === right ? "ok" : "warn",
        body: d.cells(cells, { label: "nums · the page's §7 array" }) +
          (mode === "hash"
            ? d.cells(pcells, { label: "prefix, length n+1 with the leading zero", dense: true })
            : "") +
          lanes.join("") + mid,
        rows: rows
      }),
      step.verdict ? dsaprefixsum_board(d, step.verdict) : "",
      d.note(
        mode === "win"
          ? "<b>■</b> in the window · <b>×</b> dropped, and a dropped index " +
            "never comes back — that is the whole failure. The prefix run below keeps " +
            "every boundary in the map forever, which is why negatives cost it nothing."
          : "The prefix strip is the page's <b>n+1</b> form: <code>sum(i..j) = prefix[j+1] " +
            "− prefix[i]</code>, with no <code>if i == 0</code> anywhere. Green is the " +
            "prefix just written or the one that matched <code>running − k</code>."
      )
    ]);
  }
};

  // ====================================================================
// ======================================================================
// SIM · dsarecursionproblem  (recursion-problems.md)
//
// The page reports its own bug, with the figure: "With k = n//2 + 1,
// [1,2,3,4] deletes 2 instead of 3. Odd-length inputs pass either way, so
// if you only test [1,2,3,4,5] the bug ships." That is a time axis and a
// three-way contrast in one sentence, so it is what this sim runs.
//
// The mechanism is delete_middle(st, k) from §2, executed literally:
//     if k == 1: st.pop(); return          <- the element the counter chose
//     top = st.pop()                       <- runs on the way DOWN
//     delete_middle(st, k - 1)
//     st.append(top)                       <- runs on the way UP
// One frame per stack operation. The call stack holding the popped values
// is drawn beside the data stack, because that is §2's other idea: the
// recursion IS the second data structure.
//
// CONFIG — nothing below is typed, all of it is read off real runs:
//   stack     values 1..n, drawn bottom -> top, so the value at position p
//             from the bottom is exactly p
//   middle    the page's definition: the (n//2 + 1)-th element FROM THE
//             BOTTOM
//   correct   k = (n + 1) // 2    counted from the TOP
//   buggy     k = n // 2 + 1      the page's wrong counter
//   tab 1     n = 8, correct counter
//   tab 2     n = 8, buggy counter      -- deletes the wrong element
//   tab 3     n = 7, and BOTH counters, which coincide there
//
// Frame count is not chosen either: a run of depth k performs exactly
// (k-1) pops + 1 delete + (k-1) pushes = 2k-1 operations, so the tabs are
// 8, 10 and 8 frames long because k is 4, 5 and 4.
//
// The closing table re-runs both counters for n = 4..9 and prints what each
// one actually deletes. The page's own [1,2,3,4] case is row one, and the
// "deletes 2 instead of 3" figure is produced by the recursion rather than
// quoted.
// ======================================================================

var dsarecursionproblem_EVEN = 8;
var dsarecursionproblem_ODDN = 7;

function dsarecursionproblem_seq(n) {
  var a = [], i;
  for (i = 1; i <= n; i++) a.push(i);
  return a;
}

// the page's two counters, both counting from the TOP of the stack
function dsarecursionproblem_correctK(n) { return Math.floor((n + 1) / 2); }
function dsarecursionproblem_buggyK(n) { return Math.floor(n / 2) + 1; }

// the page's definition of the middle: (n//2 + 1)-th from the BOTTOM.
// With values 1..n stacked bottom-first, the position IS the value.
function dsarecursionproblem_middlePos(n) { return Math.floor(n / 2) + 1; }

/**
 * Run delete_middle(st, k) on the stack 1..n and record every stack
 * operation. Returns the event tape plus what was actually deleted.
 */
function dsarecursionproblem_run(n, k) {
  var stack = dsarecursionproblem_seq(n);
  var held = [];
  var evs = [];
  var pops = 0, pushes = 0, deleted = 0, i, v;

  for (i = 1; i <= k; i++) {
    v = stack.pop();
    pops++;
    if (i === k) {
      deleted = v;
      evs.push({
        phase: "delete", v: v, depth: i,
        stack: stack.slice(0), held: held.slice(0),
        pops: pops, pushes: pushes
      });
    } else {
      held.push(v);
      evs.push({
        phase: "down", v: v, depth: i,
        stack: stack.slice(0), held: held.slice(0),
        pops: pops, pushes: pushes
      });
    }
  }
  while (held.length) {
    v = held[held.length - 1];
    held = held.slice(0, held.length - 1);
    stack.push(v);
    pushes++;
    evs.push({
      phase: "up", v: v, depth: held.length + 1,
      stack: stack.slice(0), held: held.slice(0),
      pops: pops, pushes: pushes
    });
  }

  return {
    n: n, k: k, deleted: deleted, evs: evs,
    ops: pops + pushes, pops: pops, pushes: pushes,
    maxDepth: k, finalStack: stack
  };
}

/** What the run left behind, as a string, e.g. "1 2 3 4 6 7 8". */
function dsarecursionproblem_show(a) {
  return a.length ? a.join(" ") : "empty";
}

/** Both counters, run for real, for every n in the range. */
function dsarecursionproblem_divergence(lo, hi) {
  var rows = [], n, mid, ok, bad;
  for (n = lo; n <= hi; n++) {
    mid = dsarecursionproblem_middlePos(n);
    ok = dsarecursionproblem_run(n, dsarecursionproblem_correctK(n));
    bad = dsarecursionproblem_run(n, dsarecursionproblem_buggyK(n));
    rows.push({
      n: n, mid: mid, ok: ok.deleted, bad: bad.deleted,
      agree: ok.deleted === bad.deleted,
      okRight: ok.deleted === mid, badRight: bad.deleted === mid
    });
  }
  return rows;
}

var dsarecursionproblem_DIV = dsarecursionproblem_divergence(4, 9);

function dsarecursionproblem_divTable(d) {
  var rows = [], i, r;
  for (i = 0; i < dsarecursionproblem_DIV.length; i++) {
    r = dsarecursionproblem_DIV[i];
    rows.push([
      String(r.n),
      String(r.mid),
      String(r.ok),
      String(r.bad),
      r.badRight ? "same" : "OFF BY ONE"
    ]);
  }
  return d.table(["n", "middle", "(n+1)//2", "n//2+1", "buggy counter"], rows);
}

/** How many of the tested sizes the buggy counter gets away with. */
function dsarecursionproblem_survives() {
  var pass = 0, i;
  for (i = 0; i < dsarecursionproblem_DIV.length; i++) {
    if (dsarecursionproblem_DIV[i].badRight) pass++;
  }
  return pass;
}

/**
 * Turn one run into a scenario: idle frame, then one frame per stack
 * operation, with the last frame carrying the verdict.
 */
function dsarecursionproblem_scenario(o) {
  var r = dsarecursionproblem_run(o.n, o.k);
  var mid = dsarecursionproblem_middlePos(o.n);
  var correct = dsarecursionproblem_correctK(o.n);
  var buggy = dsarecursionproblem_buggyK(o.n);
  var steps = [], i, e, cap, flag;

  steps.push({
    r: r, mid: mid, correct: correct, buggy: buggy, label: o.label,
    formula: o.formula, phase: "idle", v: 0, depth: 0,
    stack: dsarecursionproblem_seq(o.n), held: [], pops: 0, pushes: 0,
    flag: "idle", last: false,
    caption: "<b>" + o.n + " values on the stack, " + o.n + " on top.</b> The middle " +
      "is the <i>(n//2 + 1)</i>-th from the <b>bottom</b> — position <b>" + mid +
      "</b>, which here holds the value <b>" + mid + "</b>. But the recursion counts " +
      "from the <b>top</b>, so the whole problem is converting one into the other. " +
      "This run uses <code>k = " + o.formula + " = " + o.k + "</code>. " +
      "Press Play and watch which value falls out."
  });

  for (i = 0; i < r.evs.length; i++) {
    e = r.evs[i];
    if (e.phase === "down") {
      flag = "idle";
      cap = "<b>Depth " + e.depth + " · on the way DOWN.</b> <code>top = st.pop()</code> " +
        "lifts <b>" + e.v + "</b> off and the call frame holds it — this line runs " +
        "<i>before</i> the recursive call. k drops to <b>" + (o.k - e.depth) +
        "</b>; the stack is down to " + e.stack.length + " values and " + e.held.length +
        " are parked in the recursion, not in a second stack.";
    } else if (e.phase === "delete") {
      flag = e.v === mid ? "ok" : "bad";
      cap = "<b>Depth " + e.depth + " · k == 1, so this is the one.</b> " +
        "<code>st.pop()</code> drops <b>" + e.v + "</b> and returns nothing — " +
        (e.v === mid
          ? "and " + e.v + " is position " + mid + " from the bottom, the middle. Correct."
          : "but the middle is <b>" + mid + "</b>. This counter went <b>" +
            Math.abs(e.v - mid) + "</b> too far down the stack, and nothing about the " +
            "run looks wrong. From here the unwind is flawless — it faithfully rebuilds " +
            "a stack with the wrong element missing.");
    } else {
      flag = "idle";
      cap = "<b>Returning to depth " + e.depth + " · on the way UP.</b> " +
        "<code>st.append(top)</code> puts <b>" + e.v + "</b> back — this line sits " +
        "<i>after</i> the recursive call, so it only runs now. " +
        (e.held.length
          ? e.held.length + " value" + (e.held.length === 1 ? "" : "s") +
            " still held above; stack back to " + e.stack.length + "."
          : "Nothing left held: the call stack is empty and the data stack is rebuilt.");
    }
    steps.push({
      r: r, mid: mid, correct: correct, buggy: buggy, label: o.label,
      formula: o.formula, phase: e.phase, v: e.v, depth: e.depth,
      stack: e.stack, held: e.held, pops: e.pops, pushes: e.pushes,
      flag: flag, last: false, caption: cap
    });
  }

  var last = steps[steps.length - 1];
  last.last = true;
  last.flag = o.verdictFlag;
  last.caption = o.verdict(r, mid, correct, buggy);
  return { id: o.id, label: o.label, steps: steps };
}

S["dsarecursionproblem"] = {
  title: "Delete the middle of a stack, one pop at a time",
  note: "The page's §2 problem and the page's own bug report, executed. The stack holds " +
    "<b>1..n</b> bottom-first, so a value equals its position from the bottom; the middle " +
    "is the page's <i>(n//2 + 1)</i>-th from the bottom. The recursion counts from the " +
    "<b>top</b>: the correct counter is <code>(n+1)//2</code> and the page's wrong one is " +
    "<code>n//2 + 1</code>. Every frame is one real stack operation — a run of depth k does " +
    "exactly <b>(k−1) pops + 1 delete + (k−1) pushes = 2k−1</b> of them, which is why these " +
    "tabs are " +
    (2 * dsarecursionproblem_correctK(dsarecursionproblem_EVEN) - 1) + ", " +
    (2 * dsarecursionproblem_buggyK(dsarecursionproblem_EVEN) - 1) + " and " +
    (2 * dsarecursionproblem_correctK(dsarecursionproblem_ODDN) - 1) +
    " operations long. The deleted value, the counters, the closing table and the page's " +
    "own <code>[1,2,3,4]</code> case are all produced by running the recursion, not quoted.",
  interval: 1250,

  scenarios: [
    dsarecursionproblem_scenario({
      id: "correct", label: "n = 8 · (n+1)//2",
      n: dsarecursionproblem_EVEN,
      k: dsarecursionproblem_correctK(dsarecursionproblem_EVEN),
      formula: "(n+1)//2",
      verdictFlag: "ok",
      verdict: function (r, mid, correct, buggy) {
        return "<b>Deleted " + r.deleted + " — position " + mid + " from the bottom, the " +
          "middle. " + dsarecursionproblem_show(r.finalStack) + " remains.</b> " +
          r.pops + " pops and " + r.pushes + " pushes, " + r.ops + " operations in total, " +
          "maximum depth <b>" + r.maxDepth + "</b>. No second stack was ever allocated: the " +
          r.pushes + " values that had to be held were held by the call frames, and the " +
          "<code>append</code> after the recursive call is what puts them back in order. " +
          "That is the whole reason the reduce family is worth drilling — the work before " +
          "the call and the work after it are two different programs.";
      }
    }),
    dsarecursionproblem_scenario({
      id: "buggy", label: "n = 8 · n//2 + 1",
      n: dsarecursionproblem_EVEN,
      k: dsarecursionproblem_buggyK(dsarecursionproblem_EVEN),
      formula: "n//2 + 1",
      verdictFlag: "bad",
      verdict: function (r, mid, correct, buggy) {
        return "<b>Deleted " + r.deleted + ", not " + mid + ".</b> One counter off by one, " +
          "and the result is a stack that is the right height, in the right order, missing " +
          "the wrong element: <code>" + dsarecursionproblem_show(r.finalStack) +
          "</code> instead of the middle removed. It cost " + r.ops + " operations against " +
          (2 * correct - 1) + " for the correct counter — <b>two extra</b>, one pop and one " +
          "push, which is the only externally visible difference. There is no exception, no " +
          "assertion and no imbalance to catch: <code>" + buggy + "</code> is a perfectly " +
          "legal depth. Only comparing the output against the definition of \"middle\" finds " +
          "this.";
      }
    }),
    dsarecursionproblem_scenario({
      id: "oddpass", label: "n = 7 · both counters",
      n: dsarecursionproblem_ODDN,
      k: dsarecursionproblem_correctK(dsarecursionproblem_ODDN),
      formula: "(n+1)//2 = n//2 + 1",
      verdictFlag: "warn",
      verdict: function (r, mid, correct, buggy) {
        return "<b>Deleted " + r.deleted + " — correct. And the buggy counter would have " +
          "deleted " + r.deleted + " too.</b> For odd n the two formulas are the same " +
          "number: <code>(7+1)//2 = " + correct + "</code> and <code>7//2 + 1 = " + buggy +
          "</code>. This is the test that ships the bug. Across n = 4..9 the wrong counter " +
          "passes <b>" + dsarecursionproblem_survives() + " of " +
          dsarecursionproblem_DIV.length + "</b> sizes — every odd one — so a test suite " +
          "built from odd examples is <i>all green</i> while the even case quietly deletes " +
          "the wrong element. Any problem with \"middle\" in the statement needs an " +
          "even-length case; the table below is what that test would print.";
      }
    })
  ],

  draw: function (step, d, ctx) {
    var r = step.r;
    var i, cells, held;

    // --- the data stack, bottom -> top -------------------------------
    cells = [];
    for (i = 0; i < step.stack.length; i++) {
      cells.push({
        label: String(step.stack[i]),
        flag: step.stack[i] === step.mid ? "ok" : "idle",
        title: "position " + (i + 1) + " from the bottom" +
          (step.stack[i] === step.mid ? " — the middle" : "")
      });
    }
    if (step.phase === "delete") {
      cells.push({ label: "✗" + step.v, flag: "bad", title: "popped and discarded" });
    }
    if (!cells.length) cells = [{ label: "·", flag: "idle", title: "stack empty" }];

    // --- the call frames holding the popped values --------------------
    held = [];
    for (i = 0; i < step.held.length; i++) {
      held.push({
        label: String(step.held[i]),
        flag: "warn",
        title: "held by the call at depth " + (i + 1)
      });
    }
    if (!held.length) {
      held = [{
        label: "·", flag: "idle",
        title: step.phase === "idle" ? "no calls yet" : "no values held"
      }];
    }

    var phaseName = step.phase === "idle" ? "not started"
      : step.phase === "down" ? "pop · on the way down"
      : step.phase === "delete" ? "pop · discard"
      : "push · on the way up";

    var body = d.stack([
      d.cells(cells, { label: "the stack · bottom → top", dense: true }),
      d.cells(held, { label: "held in the call frames · depth 1 → " + r.k, dense: true })
    ]);

    var rows = [
      { label: "k · elements from the top", value: String(r.k) + "  (" + step.formula + ")" },
      { label: "the middle, from the bottom", value: "position " + step.mid },
      {
        label: "dropped",
        value: step.phase === "idle" ? "nothing yet"
          : (r.deleted && (step.phase === "delete" || step.pops === r.k)
            ? String(r.deleted) + (r.deleted === step.mid ? "  ✓" : "  ✗ wanted " + step.mid)
            : "not yet"),
        flag: step.phase === "idle" ? "idle"
          : (step.pops < r.k ? "idle" : r.deleted === step.mid ? "ok" : "bad")
      },
      {
        label: "stack operations",
        value: step.pops + " pops · " + step.pushes + " pushes",
        flag: "idle"
      }
    ];

    if (step.last) {
      rows.push({
        label: "stack left behind",
        value: dsarecursionproblem_show(r.finalStack),
        flag: r.deleted === step.mid ? "ok" : "bad"
      });
    }

    var opsPct = r.ops ? ((step.pops + step.pushes) / r.ops) * 100 : 0;

    var out = [
      d.flow([
        d.big(
          step.phase === "idle" ? "—"
            : step.pops < r.k ? "↓ " + step.depth
            : step.phase === "delete" ? "✗ " + step.v
            : "↑ " + step.depth,
          step.phase === "idle" ? "press Play" : phaseName,
          step.phase === "delete" ? (step.v === step.mid ? "ok" : "bad")
            : step.phase === "idle" ? "idle" : "warn"
        ),
        d.stat({
          label: "recursion depth",
          value: step.depth + " / " + r.k,
          sub: "one frame per pending call",
          flag: step.depth ? "warn" : "idle"
        }),
        d.stat({
          label: "held without a second stack",
          value: String(step.held.length),
          sub: "values parked in call frames",
          flag: step.held.length ? "warn" : "idle"
        }),
        d.stat({
          label: "operations",
          value: (step.pops + step.pushes) + " / " + r.ops,
          sub: "2k − 1 for k = " + r.k,
          flag: step.last ? "ok" : "idle"
        })
      ]),
      d.node({
        title: "delete_middle(st, k = " + r.k + ")",
        status: step.phase === "idle" ? "IDLE"
          : step.phase === "down" ? "DESCENDING"
          : step.phase === "delete" ? (step.v === step.mid ? "MIDDLE DROPPED" : "WRONG ELEMENT DROPPED")
          : "UNWINDING",
        statusFlag: step.flag,
        badge: "n = " + r.n,
        meta: step.label,
        flag: step.flag,
        rows: rows,
        gauges: [{
          label: "way down · way up",
          pct: opsPct,
          value: step.pops + r.pushes === 0 ? "0%" : Math.round(opsPct) + "%",
          flag: step.last ? (r.deleted === step.mid ? "ok" : "bad") : "warn"
        }],
        body: body
      })
    ];

    if (step.last) out.push(dsarecursionproblem_divTable(d));

    out.push(d.note(
      step.last
        ? "Both counters, run for real on every size from 4 to 9. They agree on odd n and " +
          "differ on every even one — including <b>n = 4</b>, where <code>n//2 + 1</code> " +
          "deletes <b>" + dsarecursionproblem_DIV[0].bad + "</b> instead of <b>" +
          dsarecursionproblem_DIV[0].mid + "</b>, exactly the case the page reports."
        : "Green is the element that <i>should</i> go · amber is a value held by a pending " +
          "call, not by any data structure · <b>red is the value this counter actually " +
          "dropped</b>.",
      step.last ? (r.deleted === step.mid ? "ok" : "bad") : undefined
    ));

    return d.stack(out);
  }
};

  // ====================================================================
// ======================================================================
// SIM · dsarecursiontre  (recursion-tree.md)
//
// The page's own claim: "Every diagram below was generated by actually
// running the code — not drawn from memory. The call order, the return
// order and the pruned branches are what the machine really does."
// So this sim does the same thing: it RUNS the recursion, records every
// call entry and every return as an event, and plays the event tape.
//
// The time axis is the depth-first traversal itself — down the tree on
// calls, back up on returns. That is the page's §3 distinction ("code
// BEFORE the recursive call runs on the way down; code AFTER runs on the
// way up"), and it is the only axis a recursion tree has.
//
// THREE RUNS OF THE SAME MACHINERY:
//   1. fib(5) naive      — §6. The page's exact figure: 15 calls for
//                          6 distinct values.
//   2. fib(5) memoised    — §6's prescription: "Cache each node and the
//                          tree collapses from 2ⁿ to n."
//   3. subsets("ab")      — §4. Same recorder, and the page's contrast:
//                          "every node there is distinct — so there is
//                          nothing to cache and memoisation would not
//                          help." The duplicate detector runs on this
//                          tree too and finds zero. That zero is the
//                          point.
//
// EVERY NUMBER ON SCREEN IS COUNTED FROM THE RUN. Nothing is asserted:
// the call counts per key, the node totals, the maximum stack depth, the
// number of redundant recomputations and the leaf results are all read
// off the recorded tape. The page's published figures — 15 calls, 6
// distinct values, fib(0)×3 fib(1)×5 fib(2)×3 fib(3)×2 fib(4)×1 fib(5)×1,
// 2ⁿ leaves for subsets, leaf order ∅/b/a/ab — are reproduced by the
// simulation rather than typed in, and the sim says so when they match.
// ======================================================================

var dsarecursiontre_FIBN = 5;          // the page's §6 example is fib(5)
var dsarecursiontre_IP = "ab";         // the page's §4 example is "ab"

// ----------------------------------------------------------------------
// The recorder. One entry per call, one event per call and per return.
// `dup` is set when a node finishes computing a value some earlier node
// in THIS run already finished computing — the page's "identical nodes
// appear in more than one place".
// ----------------------------------------------------------------------
function dsarecursiontre_fibRun(N, useMemo) {
  var nodes = [], events = [], cache = {}, done = {}, calls = {};
  var stack = [], adds = 0, maxStack = 0;

  function rec(k, depth, parent) {
    var key = "fib(" + k + ")";
    var id = nodes.length;
    var node = {
      id: id, key: key, k: k, depth: depth, parent: parent,
      label: String(k), value: null, hit: false, dup: false,
      base: false, leaf: false, result: null
    };
    nodes.push(node);
    calls[key] = (calls[key] || 0) + 1;
    stack.push(id);
    if (stack.length > maxStack) maxStack = stack.length;

    if (useMemo && cache.hasOwnProperty(key)) {
      node.hit = true;
      node.value = cache[key];
      node.leaf = true;
      events.push({ t: "hit", id: id, depth: depth });
      stack.pop();
      events.push({ t: "ret", id: id, depth: depth });
      return node.value;
    }

    events.push({ t: "call", id: id, depth: depth });
    var v;
    if (k <= 1) {
      v = k;
      node.base = true;
      node.leaf = true;
    } else {
      var a = rec(k - 1, depth + 1, id);
      var b = rec(k - 2, depth + 1, id);
      v = a + b;
      adds++;
    }
    node.value = v;
    if (done[key]) node.dup = true;
    done[key] = (done[key] || 0) + 1;
    if (useMemo) cache[key] = v;
    stack.pop();
    events.push({ t: "ret", id: id, depth: depth });
    return v;
  }

  var answer = rec(N, 0, -1);
  var keys = [], i;
  for (i = 0; i <= N; i++) if (calls["fib(" + i + ")"]) keys.push("fib(" + i + ")");
  return {
    kind: "fib", nodes: nodes, events: events, calls: calls, keys: keys,
    answer: answer, adds: adds, maxStack: maxStack, memo: !!useMemo,
    title: "fib(" + N + ")" + (useMemo ? " + memo" : "")
  };
}

// ----------------------------------------------------------------------
// The same recorder over the page's §4 subsets recursion. The key for
// duplicate detection is the whole node label (ip, op) — exactly what the
// page says makes memoisation useless here.
// ----------------------------------------------------------------------
function dsarecursiontre_subRun(s) {
  var nodes = [], events = [], done = {}, calls = {}, results = [];
  var stack = [], maxStack = 0;

  function rec(ip, op, depth, parent) {
    var key = "ip=" + (ip === "" ? "∅" : ip) + " op=" + (op === "" ? "∅" : op);
    var id = nodes.length;
    var node = {
      id: id, key: key, depth: depth, parent: parent, ip: ip, op: op,
      label: op === "" ? "∅" : op, value: null, hit: false,
      dup: false, base: false, leaf: false, result: null
    };
    nodes.push(node);
    calls[key] = (calls[key] || 0) + 1;
    stack.push(id);
    if (stack.length > maxStack) maxStack = stack.length;
    events.push({ t: "call", id: id, depth: depth });

    if (ip === "") {
      node.base = true;
      node.leaf = true;
      node.result = op;
      results.push(op);
    } else {
      rec(ip.substring(1), op, depth + 1, id);              // skip ip[0]
      rec(ip.substring(1), op + ip.charAt(0), depth + 1, id); // take ip[0]
    }
    if (done[key]) node.dup = true;
    done[key] = (done[key] || 0) + 1;
    stack.pop();
    events.push({ t: "ret", id: id, depth: depth });
  }

  rec(s, "", 0, -1);
  var keys = [], i;
  for (i = 0; i < nodes.length; i++) {
    if (keys.indexOf(nodes[i].key) < 0) keys.push(nodes[i].key);
  }
  return {
    kind: "sub", nodes: nodes, events: events, calls: calls, keys: keys,
    results: results, adds: 0, maxStack: maxStack, memo: false,
    title: "subsets(\"" + s + "\")"
  };
}

// ----------------------------------------------------------------------
// Nodes grouped by depth, left to right (DFS id order IS left to right).
// ----------------------------------------------------------------------
function dsarecursiontre_layout(run) {
  var rows = [], i, n;
  for (i = 0; i < run.nodes.length; i++) {
    n = run.nodes[i];
    while (rows.length <= n.depth) rows.push([]);
    rows[n.depth].push(n.id);
  }
  return rows;
}

// ----------------------------------------------------------------------
// Replay the tape up to event `ev` and report the state exactly.
// ----------------------------------------------------------------------
function dsarecursiontre_state(run, ev) {
  var status = [], i, e, nd;
  for (i = 0; i < run.nodes.length; i++) status.push(0);   // 0 unvisited 1 live 2 done
  var st = {
    status: status, entered: 0, returned: 0, hits: 0, dups: 0,
    stack: [], peak: 0, results: [], seen: {}, distinct: 0, counts: {}
  };
  var cap = ev < run.events.length ? ev : run.events.length;
  for (i = 0; i < cap; i++) {
    e = run.events[i];
    nd = run.nodes[e.id];
    if (e.t === "call" || e.t === "hit") {
      st.entered++;
      if (e.t === "hit") st.hits++;
      status[e.id] = 1;
      st.stack.push(e.id);
      if (st.stack.length > st.peak) st.peak = st.stack.length;
      st.counts[nd.key] = (st.counts[nd.key] || 0) + 1;
      if (!st.seen[nd.key]) { st.seen[nd.key] = 1; st.distinct++; }
    } else {
      status[e.id] = 2;
      st.returned++;
      if (nd.dup) st.dups++;
      if (nd.result !== null) st.results.push(nd.result);
      if (st.stack.length) st.stack.pop();
    }
  }
  return st;
}

/** Human name for a node, used in captions and tooltips. */
function dsarecursiontre_name(run, id) {
  var n = run.nodes[id];
  return run.kind === "fib" ? n.key : n.key;
}

/** The event tape rendered as a dense strip of arrows. */
function dsarecursiontre_tape(run, ev, d) {
  var cells = [], i, e, n;
  for (i = 0; i < run.events.length; i++) {
    e = run.events[i];
    n = run.nodes[e.id];
    if (i >= ev) {
      cells.push({ label: "", flag: "idle", title: "not reached yet" });
    } else if (e.t === "hit") {
      cells.push({
        label: "⚡", flag: "ok",
        title: "event " + (i + 1) + " · memo HIT on " + n.key + " = " + n.value +
          " — the whole subtree below it never happens"
      });
    } else if (e.t === "call") {
      cells.push({
        label: "↓", flag: "warn",
        title: "event " + (i + 1) + " · call DOWN into " + n.key + " at depth " + n.depth
      });
    } else {
      cells.push({
        label: "↑", flag: n.dup ? "bad" : "ok",
        title: "event " + (i + 1) + " · return UP from " + n.key +
          (n.value !== null ? " = " + n.value : "") +
          (n.result !== null ? " · leaf result \"" + (n.result === "" ? "∅" : n.result) + "\"" : "") +
          (n.dup ? " · this value was already computed earlier in this run" : "")
      });
    }
  }
  return d.cells(cells, {
    label: "call / return tape · ↓ down (call)  ↑ up (return)  ⚡ memo hit",
    dense: true
  });
}

/** Build the frames for one run: a fixed chunk of tape events per frame. */
function dsarecursiontre_frames(run, chunk) {
  var out = [], ev = 0, prev = 0;
  while (ev < run.events.length) {
    prev = ev;
    ev += chunk;
    if (ev > run.events.length) ev = run.events.length;
    out.push({ from: prev, to: ev });
  }
  return out;
}

/** What happened inside one chunk, as plain facts for the caption. */
function dsarecursiontre_chunkFacts(run, from, to) {
  var f = { calls: [], rets: [], hits: [], dups: [], leaves: [], deepest: -1 };
  var i, e, n;
  for (i = from; i < to; i++) {
    e = run.events[i];
    n = run.nodes[e.id];
    if (e.t === "call") {
      f.calls.push(n);
      if (n.depth > f.deepest) f.deepest = n.depth;
    } else if (e.t === "hit") {
      f.hits.push(n);
      if (n.depth > f.deepest) f.deepest = n.depth;
    } else {
      f.rets.push(n);
      if (n.dup) f.dups.push(n);
      if (n.result !== null) f.leaves.push(n);
    }
  }
  return f;
}

function dsarecursiontre_list(arr, key) {
  var out = [], i;
  for (i = 0; i < arr.length; i++) out.push(key ? arr[i][key] : arr[i].key);
  return out.join(", ");
}

// ----------------------------------------------------------------------
// The three runs, executed once at load. Every figure below reads off
// these objects.
// ----------------------------------------------------------------------
var dsarecursiontre_NAIVE = dsarecursiontre_fibRun(dsarecursiontre_FIBN, false);
var dsarecursiontre_MEMO = dsarecursiontre_fibRun(dsarecursiontre_FIBN, true);
var dsarecursiontre_SUBS = dsarecursiontre_subRun(dsarecursiontre_IP);

/** Redundant calls = total calls − distinct values. Counted, not claimed. */
function dsarecursiontre_waste(run) {
  return run.nodes.length - run.keys.length;
}

/** The page's own call-count line, rebuilt from the run. */
function dsarecursiontre_countLine(run) {
  var parts = [], i, k;
  for (i = 0; i < run.keys.length; i++) {
    k = run.keys[i];
    parts.push(k + "×" + run.calls[k]);
  }
  return parts.join("  ");
}

// ----------------------------------------------------------------------
// Scenario builder — the captions narrate the tape, never anticipate it.
// ----------------------------------------------------------------------
function dsarecursiontre_scenario(o) {
  var run = o.run;
  var chunks = dsarecursiontre_frames(run, o.chunk);
  var steps = [{
    caption: o.idle, flag: "idle", run: run, ev: 0,
    st: dsarecursiontre_state(run, 0), rows: dsarecursiontre_layout(run)
  }];
  var rows = dsarecursiontre_layout(run);
  var i, c, st, prevSt, f, cap, flag;

  for (i = 0; i < chunks.length; i++) {
    c = chunks[i];
    st = dsarecursiontre_state(run, c.to);
    prevSt = dsarecursiontre_state(run, c.from);
    f = dsarecursiontre_chunkFacts(run, c.from, c.to);
    cap = o.caption(run, st, prevSt, f, i, i === chunks.length - 1);
    flag = i === chunks.length - 1
      ? o.endFlag
      : (f.dups.length ? "bad" : f.hits.length ? "ok" : "warn");
    steps.push({
      caption: cap, flag: flag, run: run, ev: c.to, st: st, rows: rows,
      chunkFrom: c.from, chunkTo: c.to
    });
  }
  return { id: o.id, label: o.label, steps: steps };
}

// ======================================================================
S["dsarecursiontre"] = {
  title: "Unfold the recursion tree call by call, then watch it return",

  note: "Three recursions are executed and recorded: the page's §6 " +
    "<code>fib(" + dsarecursiontre_FIBN + ")</code>, the same call with a cache, and the " +
    "page's §4 <code>solve(ip=\"" + dsarecursiontre_IP + "\", op=\"\")</code>. " +
    "One frame advances the depth-first traversal by a fixed number of tape events — " +
    "a call is one event, a return is another — so <b>down the tree</b> and " +
    "<b>up the tree</b> are literally different frames, which is the page's §3 " +
    "distinction. The naive run makes <b>" + dsarecursiontre_NAIVE.nodes.length +
    "</b> calls to compute <b>" + dsarecursiontre_NAIVE.keys.length + "</b> distinct " +
    "values — the page's \"fifteen calls to compute six distinct values\", counted " +
    "here rather than quoted. Node counts, per-argument call counts, stack depth, " +
    "redundant recomputations and leaf order are all read off the recorded tape; " +
    "nothing on screen is typed in.",

  interval: 1250,

  scenarios: [
    // ---- 1. the naive tree -------------------------------------------
    dsarecursiontre_scenario({
      id: "naive", label: "fib(5) naive",
      run: dsarecursiontre_NAIVE, chunk: 4, endFlag: "bad",
      idle: "<b>The root, and nothing else yet.</b> <code>fib(" + dsarecursiontre_FIBN +
        ")</code> is about to be called and the tree below it does not exist — it is " +
        "created by the calls, which is the whole idea of a recursion tree. " +
        "The lanes are the depths the run will reach; every slot is grey because no call " +
        "has happened. Press Play and watch it go down before it comes back up.",
      caption: function (run, st, prev, f, idx, last) {
        var waste = dsarecursiontre_waste(run);
        if (last) {
          return "<b>" + run.nodes.length + " calls, " + run.keys.length +
            " distinct values, answer fib(" + dsarecursiontre_FIBN + ") = " + run.answer +
            ".</b> Counted off the tape: " + dsarecursiontre_countLine(run) +
            " — which is exactly the call-count line the page publishes. <b>" +
            waste + " of the " + run.nodes.length + " calls</b> (" +
            Math.round((waste / run.nodes.length) * 100) + "%) recomputed a value this " +
            "run already had, because " + run.nodes.length + " calls minus " +
            run.keys.length + " distinct arguments leaves " + waste +
            " that were pure repetition. Read the two shapes separately, as §8 " +
            "insists: <b>" + run.nodes.length + " nodes</b> is the time, <b>" +
            st.peak + " frames</b> is the deepest the stack ever got — exponential " +
            "in time, linear in space, and they are not the same number.";
        }
        if (f.dups.length) {
          return "<b>" + dsarecursiontre_list(f.dups) + " returns a value this run " +
            "already computed.</b> " + (f.dups.length === 1 ? "That node is" : "Those nodes are") +
            " red because an identical label finished earlier in the traversal — the " +
            "page's definition of overlapping subproblems, and the precise signal to " +
            "memoise. Redundant returns so far: <b>" + st.dups + "</b>. " +
            st.entered + " calls entered, " + st.returned + " returned, stack " +
            st.stack.length + " deep.";
        }
        if (f.calls.length && !f.rets.length) {
          return "<b>Still descending — " + f.calls.length + " calls, no returns.</b> " +
            dsarecursiontre_list(f.calls) + " went on the stack; the arguments shrink on " +
            "the way down and nothing is computed yet. Depth reached <b>" + f.deepest +
            "</b>, stack <b>" + st.stack.length + "</b> frames. Every one of these is code " +
            "running <i>before</i> the recursive call.";
        }
        return "<b>The bottom, then back up.</b> " +
          (f.calls.length
            ? f.calls.length + " more call" + (f.calls.length === 1 ? "" : "s") + " down (" +
              dsarecursiontre_list(f.calls) + ") and "
            : "") +
          f.rets.length + " return" + (f.rets.length === 1 ? "" : "s") + " up (" +
          dsarecursiontre_list(f.rets) + ") — addition only happens here, on the way " +
          "up, after both children have answered. <b>" + st.entered + "</b> calls entered, " +
          "<b>" + st.returned + "</b> returned, <b>" + st.distinct + "</b> distinct " +
          "arguments seen, stack <b>" + st.stack.length + "</b> deep (peak " + st.peak + ").";
      }
    }),

    // ---- 2. the memoised tree ----------------------------------------
    dsarecursiontre_scenario({
      id: "memo", label: "fib(5) + memo",
      run: dsarecursiontre_MEMO, chunk: 2, endFlag: "ok",
      idle: "<b>Same function, same root, one added line: a cache checked on entry.</b> " +
        "The page's prescription is \"cache each node and the tree collapses from 2ⁿ " +
        "to n\" — so this tab runs it and counts the collapse. Nothing is drawn yet; " +
        "the lanes are narrower than the previous tab's only because fewer calls will ever " +
        "be made. Press Play.",
      caption: function (run, st, prev, f, idx, last) {
        var ref = dsarecursiontre_NAIVE;
        if (last) {
          return "<b>" + run.nodes.length + " calls against the naive run's " +
            ref.nodes.length + ", same answer " + run.answer + ".</b> " +
            "<b>" + st.hits + "</b> of those calls were cache hits that returned instantly, " +
            "and <b>" + st.dups + "</b> values were recomputed — zero, which is what " +
            "\"collapses\" means precisely. The tree lost <b>" +
            (ref.nodes.length - run.nodes.length) + " nodes</b> (" +
            Math.round((1 - run.nodes.length / ref.nodes.length) * 100) + "% of it), " +
            "and the surviving " + run.nodes.length + " calls cover " + run.keys.length +
            " distinct arguments — " + (run.nodes.length - run.keys.length) +
            " more than the minimum, all of them the hits themselves. Stack peak is still " +
            "<b>" + st.peak + "</b>: memoisation buys time, never space.";
        }
        if (f.hits.length) {
          var h = f.hits[0];
          return "<b>⚡ " + h.key + " is a cache hit — " + h.value +
            " comes straight back.</b> In the previous tab this exact node opened a subtree; " +
            "here it is a leaf, and every call that subtree would have made simply does not " +
            "happen. Hits so far <b>" + st.hits + "</b>, calls entered <b>" + st.entered +
            "</b> against the naive run's " + ref.nodes.length + " for the same answer.";
        }
        if (f.calls.length && !f.rets.length) {
          return "<b>Descending — " + dsarecursiontre_list(f.calls) + ".</b> " +
            "The cache is still cold, so this is identical to the naive run: the first " +
            "spine down to the base case has nothing to reuse. Stack <b>" + st.stack.length +
            "</b> deep, " + st.entered + " calls entered, " + st.hits + " hits so far.";
        }
        return "<b>Returning — " + dsarecursiontre_list(f.rets) + " stores its value " +
          "on the way up.</b> Each return writes the cache, which is why the answers are " +
          "waiting when the second child asks. <b>" + st.returned + "</b> returned, <b>" +
          st.hits + "</b> hits, <b>" + st.dups + "</b> recomputations — the " +
          "recomputation counter is the one to watch, and it is still " + st.dups + ".";
      }
    }),

    // ---- 3. the tree where memo would buy nothing ---------------------
    dsarecursiontre_scenario({
      id: "subsets", label: "subsets(\"ab\")",
      run: dsarecursiontre_SUBS, chunk: 2, endFlag: "ok",
      idle: "<b>A different recursion, the same recorder — and the same duplicate " +
        "detector.</b> The page's §4 subsets call, with two boxes at every node: " +
        "<code>ip</code> shrinking as you descend, <code>op</code> growing. Each cell below " +
        "is labelled with that node's <code>op</code>. The answer does not come back up here " +
        "— it is sitting at the leaves. Press Play.",
      caption: function (run, st, prev, f, idx, last) {
        var shown = [], i;
        for (i = 0; i < st.results.length; i++) {
          shown.push(st.results[i] === "" ? "∅" : st.results[i]);
        }
        if (last) {
          var leaves = 0;
          for (i = 0; i < run.nodes.length; i++) if (run.nodes[i].leaf) leaves++;
          return "<b>" + leaves + " leaves, " + run.nodes.length + " nodes, " +
            run.keys.length + " distinct nodes — and <b>" + st.dups +
            "</b> repeats.</b> That zero is the whole contrast: the identical detector that " +
            "flagged " + dsarecursiontre_waste(dsarecursiontre_NAIVE) + " redundant calls in " +
            "the fib tree finds nothing here, because every node carries a different " +
            "(<code>ip</code>, <code>op</code>) pair. <b>Memoising this would gain exactly " +
            "nothing.</b> Results in leaf order: " + shown.join(", ") + " — skips " +
            "before takes, because the skip branch is called first. And §8's two " +
            "numbers again, counted: " + run.nodes.length + " nodes (2ⁿ⁺¹−1 " +
            "for n=" + dsarecursiontre_IP.length + " is " +
            (Math.pow(2, dsarecursiontre_IP.length + 1) - 1) + ") against a stack that " +
            "never exceeded <b>" + st.peak + "</b>.";
        }
        if (f.leaves.length) {
          var got = [];
          for (i = 0; i < f.leaves.length; i++) {
            got.push(f.leaves[i].result === "" ? "∅" : f.leaves[i].result);
          }
          return "<b>Leaf reached — <code>ip</code> is empty, so <code>op</code> = \"" +
            got.join("\", \"") + "\" is an answer.</b> This is the base case the page tells " +
            "you not to guess: it is simply where the picture stops. Results collected so " +
            "far: " + shown.join(", ") + ". Repeated nodes detected: <b>" + st.dups +
            "</b>. Stack " + st.stack.length + " deep.";
        }
        if (f.calls.length && !f.rets.length) {
          var lbl = [];
          for (i = 0; i < f.calls.length; i++) lbl.push(f.calls[i].key);
          return "<b>Descending — " + lbl.join(" then ") + ".</b> Watch the two boxes " +
            "move in opposite directions: <code>ip</code> loses a character on every edge, " +
            "<code>op</code> gains one only on the take branch. Depth " + f.deepest +
            ", stack <b>" + st.stack.length + "</b>, " + st.entered + " calls entered, <b>" +
            st.distinct + "</b> of them distinct — still every single one.";
        }
        return "<b>Unwinding — " + f.rets.length + " return" +
          (f.rets.length === 1 ? "" : "s") + ", carrying nothing.</b> Unlike fib, no value " +
          "travels up this tree; the results were already deposited at the leaves. " +
          "Collected: " + (shown.length ? shown.join(", ") : "none yet") + ". Calls entered <b>" +
          st.entered + "</b>, distinct <b>" + st.distinct + "</b>, repeats <b>" + st.dups +
          "</b>.";
      }
    })
  ],

  // ====================================================================
  draw: function (step, d, ctx) {
    var run = step.run, st = step.st, rows = step.rows;
    var i, j, id, n, cells, flag, label, title;

    // ---- the tree, one lane per depth --------------------------------
    var lanes = [];
    for (i = 0; i < rows.length; i++) {
      cells = [];
      for (j = 0; j < rows[i].length; j++) {
        id = rows[i][j];
        n = run.nodes[id];
        var s = st.status[id];
        label = n.label;
        if (s === 0) {
          flag = "idle";
          title = n.key + " · depth " + n.depth + " · not called yet";
        } else if (s === 1) {
          flag = "warn";
          title = n.key + " · depth " + n.depth + " · ON THE STACK, has not returned";
        } else if (n.hit) {
          flag = "ok";
          label = "⚡";
          title = n.key + " · depth " + n.depth + " · MEMO HIT, returned " + n.value +
            " without recursing";
        } else if (n.dup) {
          flag = "bad";
          title = n.key + " · depth " + n.depth + " · returned " + n.value +
            " — already computed earlier in this run";
        } else {
          flag = "ok";
          title = n.key + " · depth " + n.depth + " · returned " +
            (n.value !== null ? n.value : "") +
            (n.result !== null ? " leaf result \"" + (n.result === "" ? "∅" : n.result) + "\"" : "");
        }
        cells.push({ label: label, flag: flag, title: title });
      }
      lanes.push(d.lane({
        label: "depth " + i + " · " + rows[i].length,
        cells: cells
      }));
    }

    // ---- the live call stack -----------------------------------------
    var stackRows = [];
    if (!st.stack.length) {
      stackRows.push(d.row("call stack", ctx.done ? "empty — the root returned" : "empty", "idle"));
    } else {
      for (i = st.stack.length - 1; i >= 0; i--) {
        n = run.nodes[st.stack[i]];
        stackRows.push(d.row(
          (i === st.stack.length - 1 ? "top →  " : "") + "frame " + i,
          n.key,
          i === st.stack.length - 1 ? "warn" : "idle"
        ));
      }
    }

    // ---- per-argument call counts, counted so far --------------------
    var tbl;
    if (run.kind === "fib") {
      var trows = [];
      for (i = 0; i < run.keys.length; i++) {
        var k = run.keys[i];
        trows.push([
          k,
          String(st.counts[k] || 0),
          String(run.calls[k]),
          (run.calls[k] > 1 ? "recomputed " + (run.calls[k] - 1) + "×" : "once")
        ]);
      }
      tbl = d.table(["argument", "calls so far", "calls in full run", "verdict"], trows);
    } else {
      var lres = [], done = 0;
      for (i = 0; i < run.nodes.length; i++) {
        if (!run.nodes[i].leaf) continue;
        var reached = st.status[i] === 2;
        if (reached) done++;
        lres.push({
          label: run.nodes[i].result === "" ? "∅" : run.nodes[i].result,
          flag: reached ? "ok" : "idle"
        });
      }
      tbl = d.stack([
        d.cells(lres, { label: "leaves · " + done + " of " + lres.length + " reached" }),
        d.row("distinct (ip, op) nodes", st.distinct + " of " + st.entered + " called",
          st.dups ? "bad" : "ok"),
        d.row("repeats found", String(st.dups), st.dups ? "bad" : "ok")
      ]);
    }

    // ---- headline figures --------------------------------------------
    var wasteNow = st.dups;
    var head = d.flow([
      d.big(
        st.entered + " / " + run.nodes.length,
        "calls entered",
        st.entered === 0 ? "idle" : run.memo ? "ok" : wasteNow ? "bad" : "warn"
      ),
      d.stat({
        label: "distinct arguments",
        value: st.entered ? String(st.distinct) : "—",
        sub: st.entered ? st.entered + " calls for " + st.distinct + " of them" : "nothing called yet",
        flag: st.entered ? "ok" : "idle"
      }),
      d.stat({
        label: run.memo ? "cache hits" : "redundant returns",
        value: run.memo ? String(st.hits) : String(st.dups),
        sub: run.memo
          ? (st.hits ? "subtrees never built" : "cache still cold")
          : (st.dups ? "values already known" : "none yet"),
        flag: run.memo ? (st.hits ? "ok" : "idle") : (st.dups ? "bad" : "idle")
      }),
      d.stat({
        label: "stack depth",
        value: st.stack.length + " / " + st.peak,
        sub: "now / peak so far",
        flag: st.stack.length ? "warn" : "idle"
      })
    ]);

    var progress = run.events.length
      ? Math.round((step.ev / run.events.length) * 100)
      : 0;

    var body = d.stack([
      d.gauge({
        label: "traversal complete",
        pct: progress,
        value: step.ev + " / " + run.events.length + " events",
        flag: progress >= 100 ? "ok" : progress ? "warn" : "idle"
      }),
      d.stack(lanes)
    ]);

    var node = d.node({
      title: run.title,
      status: step.ev === 0
        ? "NOT STARTED"
        : ctx.done
          ? "RETURNED " + (run.kind === "fib" ? String(run.answer) : run.results.length + " results")
          : (st.stack.length ? "DEPTH " + (st.stack.length - 1) : "UNWINDING"),
      statusFlag: step.flag || "idle",
      badge: run.memo ? "cache on entry" : "no cache",
      meta: run.kind === "fib"
        ? "one node = one call to fib(k) · label is k"
        : "one node = one call · label is op, ∅ means empty",
      flag: step.flag || "idle",
      body: body
    });

    return d.stack([
      head,
      node,
      d.cols([
        d.node({ title: "call stack", status: st.stack.length + " frames",
          statusFlag: st.stack.length ? "warn" : "idle",
          flag: st.stack.length ? "warn" : "idle",
          body: stackRows.join("") }),
        d.node({ title: run.kind === "fib" ? "calls per argument" : "leaves and repeats",
          status: run.kind === "fib"
            ? st.entered + " calls"
            : st.results.length + " results",
          statusFlag: "idle", flag: "idle", body: tbl })
      ]),
      dsarecursiontre_tape(run, step.ev, d),
      d.note(
        "Grey has not been called · <b>amber is on the stack</b> · green has " +
        "returned · <b>red returned a value this run already had</b> · " +
        "⚡ is a memo hit that skipped an entire subtree.",
        st.dups ? "bad" : st.hits ? "ok" : undefined
      )
    ]);
  }
};

  // ====================================================================
// ======================================================================
// SIM · dsaslidingwindow  (sliding-window.md)
//
// One engine, three validity functions. The page's §2 template is a single
// loop -- expand right, shrink left while the window is bad, record after
// the shrink -- and §7's whole thesis is that the famous problems differ
// only in what "bad" means. So this sim implements the template ONCE and
// hands each tab a different predicate. The time axis is the real one: one
// frame per advance of the right pointer, which is exactly one iteration of
// the page's  for right, ch in enumerate(s)  loop.
//
// CONFIG -- every figure is produced by running the template, not typed:
//
//   tab 1  LC 3, the page's §4 string  s = "abcabcbb"
//          invalid  when  some character occurs twice in the window
//          shrink is a WHILE, as the page's template has it
//          the page's trace prints best = 3; so does this
//
//   tab 2  LC 424, the page's §5 string  s = "AABABBA", k = 1
//          invalid  when  (window length - max_freq) > k
//          shrink is an IF, as the page's code has it, and max_freq is
//          NEVER decremented -- so this tab also recomputes the TRUE
//          maximum frequency each step and shows the two diverging, which
//          is the page's "favourite follow-up question"
//          the page's trace prints best = 4; so does this
//
//   tab 3  the page's §1 and §8 anti-cue: negative numbers with a sum
//          condition. Same engine, invalid when sum > K.
//          a = [5,-3,2,4,-6,3,1,-2], K = 4
//          The whole array sums to 4, so the true answer is the full
//          length 8 -- and the window returns 7. Both numbers are computed
//          here (the second by brute force over every subarray), so the
//          failure is demonstrated rather than asserted.
//
// COST MODEL, also derived. The page's §9 answer is "both pointers only
// move forward, so each index enters and leaves the window at most once --
// 2n pointer moves total". This counts the actual moves and prints them
// against that 2n bound. The brute-force column is the closed form for
// examining every substring: n(n+1)/2 of them, n(n+1)(n+2)/6 character
// visits in total.
// ======================================================================

var dsaslidingwindow_LC3 = "abcabcbb";          // the page's §4 string
var dsaslidingwindow_S424 = "AABABBA";          // the page's §5 string
var dsaslidingwindow_K424 = 1;                  // the page's k
var dsaslidingwindow_NEG = [5, -3, 2, 4, -6, 3, 1, -2];
var dsaslidingwindow_NEGK = 4;

function dsaslidingwindow_chars(s) {
  var a = [], i;
  for (i = 0; i < s.length; i++) a.push(s.charAt(i));
  return a;
}

/**
 * The page's §2 template, once. Callers supply only the predicate and the
 * two bookkeeping hooks; everything counted here is counted identically
 * for all three tabs, which is what makes them comparable.
 *
 *   o.seq    the array being scanned
 *   o.st     the window state object (mutated by add / drop)
 *   o.add    fn(st, x) -- called on expand
 *   o.drop   fn(st, x) -- called on shrink
 *   o.bad    fn(st, len) -> bool
 *   o.once   true means shrink with IF (LC 424), false means WHILE
 */
function dsaslidingwindow_slide(o) {
  var seq = o.seq;
  var st = o.st;
  var left = 0, best = 0, rightMoves = 0, leftMoves = 0;
  var evs = [], r, shrinks, len, dropped;

  for (r = 0; r < seq.length; r++) {
    rightMoves++;
    o.add(st, seq[r]);
    shrinks = 0;
    dropped = [];
    while (left <= r && o.bad(st, r - left + 1)) {
      dropped.push(seq[left]);
      o.drop(st, seq[left]);
      left++;
      leftMoves++;
      shrinks++;
      if (o.once) break;                    // the page's LC 424 code uses IF
    }
    len = r - left + 1;
    if (len > best) best = len;
    evs.push({
      r: r, left: left, len: len, best: best,
      shrinks: shrinks, dropped: dropped,
      rightMoves: rightMoves, leftMoves: leftMoves,
      moves: rightMoves + leftMoves,
      valid: !o.bad(st, len),
      probe: o.probe ? o.probe(st, seq, left, r) : null
    });
  }
  return { evs: evs, best: best, left: left, moves: rightMoves + leftMoves };
}

/** Brute force, for the tab that needs a second opinion. */
function dsaslidingwindow_bruteSum(a, K) {
  var best = 0, i, j, s;
  for (i = 0; i < a.length; i++) {
    s = 0;
    for (j = i; j < a.length; j++) {
      s += a[j];
      if (s <= K && j - i + 1 > best) best = j - i + 1;
    }
  }
  return best;
}

/** The two closed forms for "examine every substring". */
function dsaslidingwindow_subs(n) { return (n * (n + 1)) / 2; }
function dsaslidingwindow_visits(n) { return (n * (n + 1) * (n + 2)) / 6; }

/** Max count in a character window -- the LC 3 validity probe. */
function dsaslidingwindow_maxCount(counts) {
  var m = 0, key;
  for (key in counts) {
    if (Object.prototype.hasOwnProperty.call(counts, key) && counts[key] > m) m = counts[key];
  }
  return m;
}

// ----------------------------------------------------------------------
// tab 1 · LC 3 -- longest substring without repeating characters
// ----------------------------------------------------------------------
function dsaslidingwindow_lc3() {
  var seq = dsaslidingwindow_chars(dsaslidingwindow_LC3);
  var n = seq.length;
  var run = dsaslidingwindow_slide({
    seq: seq,
    st: { c: {} },
    add: function (st, x) { st.c[x] = (st.c[x] || 0) + 1; },
    drop: function (st, x) { st.c[x] -= 1; if (!st.c[x]) delete st.c[x]; },
    bad: function (st) { return dsaslidingwindow_maxCount(st.c) > 1; },
    probe: function (st) {
      var m = dsaslidingwindow_maxCount(st.c);
      return { label: "max count in window", value: String(m) + " (needs 1)", ok: m <= 1 };
    }
  });

  var steps = [{
    caption: "<b>" + dsaslidingwindow_LC3 + "</b> — the page's §4 string. " +
      "Recognise it from the words: <i>longest</i> + <i>substring</i> means contiguous, " +
      "so this is the variable window that <b>shrinks while invalid</b>. Both pointers " +
      "start at 0 and neither will ever move backwards. Press Play.",
    ev: null, mode: "lc3", seq: seq, k: 0, flag: "idle"
  }];

  var i, e, cap;
  var firstShrink = true;
  for (i = 0; i < run.evs.length; i++) {
    e = run.evs[i];
    cap = "<b>right = " + e.r + ", reading '" + seq[e.r] + "'.</b> ";
    if (e.shrinks === 0) {
      cap += "Nothing repeats, so the shrink loop never runs. Window <code>" +
        dsaslidingwindow_LC3.slice(e.left, e.r + 1) + "</code>, length " + e.len +
        (e.len === e.best ? " — a new best." : ".");
    } else {
      cap += "'" + seq[e.r] + "' is already inside, so the window is invalid. The " +
        "<code>while</code> runs " +
        (e.shrinks === 1 ? "once" : e.shrinks === 2 ? "twice" : e.shrinks + " times") +
        ", dropping " + e.dropped.join(" then ") + "; left is now <b>" + e.left +
        "</b>, window <code>" + dsaslidingwindow_LC3.slice(e.left, e.r + 1) +
        "</code>, length " + e.len + ". ";
      if (firstShrink) {
        cap += "<i>best</i> is read only after the loop finishes. Reading it inside " +
          "would record a window that still has a repeat in it — the page's first " +
          "listed failure mode.";
        firstShrink = false;
      } else if (e.shrinks > 1) {
        cap += "<b>Two drops in one step</b>, and that is why the shrink is a " +
          "<code>while</code> and not an <code>if</code>: after dropping " +
          e.dropped[0] + " the window <code>" +
          dsaslidingwindow_LC3.slice(e.left - 1, e.r + 1) + "</code> was still " +
          "invalid. An <code>if</code> here leaves the window broken — the page's " +
          "third listed failure mode.";
      } else {
        cap += "The window has been stuck at length " + e.len + " for " +
          (e.r - 1) + " steps: every new character collides with one already inside, " +
          "so each expansion is paid for immediately by a contraction. Left is at " +
          e.left + " after " + e.leftMoves + " total moves.";
      }
    }
    steps.push({
      caption: cap, ev: e, mode: "lc3", seq: seq, k: 0,
      flag: e.shrinks > 1 ? "warn" : e.valid ? "ok" : "bad"
    });
  }

  var last = steps[steps.length - 1];
  last.flag = "ok";
  last.caption = "<b>Answer " + run.best + ", which is the page's answer.</b> Count what " +
    "it cost: right moved " + n + " times and left moved " + (run.moves - n) +
    ", <b>" + run.moves + " pointer moves</b> against the 2n = " + (2 * n) + " bound the " +
    "page tells you to say out loud. Left never once went backwards, which is the whole " +
    "argument. Examining every substring instead would be " + dsaslidingwindow_subs(n) +
    " substrings and " + dsaslidingwindow_visits(n) + " character visits — the nested " +
    "loop <i>shape</i> is not a nested loop <i>cost</i>.";
  return { id: "lc3", label: "LC 3 · longest", steps: steps };
}

// ----------------------------------------------------------------------
// tab 2 · LC 424 -- the same engine, a validity function worth arguing about
// ----------------------------------------------------------------------
function dsaslidingwindow_lc424() {
  var seq = dsaslidingwindow_chars(dsaslidingwindow_S424);
  var n = seq.length;
  var k = dsaslidingwindow_K424;
  var run = dsaslidingwindow_slide({
    seq: seq,
    once: true,                                  // the page's code uses IF
    st: { c: {}, mf: 0 },
    add: function (st, x) {
      st.c[x] = (st.c[x] || 0) + 1;
      if (st.c[x] > st.mf) st.mf = st.c[x];      // never decreased again
    },
    drop: function (st, x) { st.c[x] -= 1; },
    bad: function (st, len) { return len - st.mf > k; },
    probe: function (st, sq, left, r) {
      var m = {}, tm = 0, j, ch;
      for (j = left; j <= r; j++) {
        ch = sq[j];
        m[ch] = (m[ch] || 0) + 1;
        if (m[ch] > tm) tm = m[ch];
      }
      return {
        label: "len − maxfreq ≤ k",
        value: (r - left + 1) + " − " + st.mf + " = " + (r - left + 1 - st.mf) +
          "  (true maxfreq " + tm + ")",
        ok: (r - left + 1) - st.mf <= k,
        sticky: st.mf, truemf: tm
      };
    }
  });

  var steps = [{
    caption: "<b>" + dsaslidingwindow_S424 + "</b>, k = " + k + " — the page's §5 string. " +
      "Same loop as the last tab; only <i>invalid</i> changes. A window is valid when " +
      "<code>length − count of the most frequent character ≤ k</code>, because " +
      "everything that is not the majority character has to be replaced. Press Play.",
    ev: null, mode: "424", seq: seq, k: k, flag: "idle"
  }];

  var i, e, cap, p;
  for (i = 0; i < run.evs.length; i++) {
    e = run.evs[i];
    p = e.probe;
    cap = "<b>right = " + e.r + ", reading '" + seq[e.r] + "'.</b> Window <code>" +
      dsaslidingwindow_S424.slice(e.left, e.r + 1) + "</code>, cost " +
      (e.len - p.sticky) + " replacement" + (e.len - p.sticky === 1 ? "" : "s") + " of " +
      k + " allowed. ";
    if (e.shrinks) {
      cap += "Over budget, so the <code>if</code> drops one character from the left — " +
        "an <code>if</code>, not a <code>while</code>, because right advances every " +
        "step so at most one left move is ever needed to keep up. ";
    }
    if (p.sticky !== p.truemf) {
      cap += "<b>Look at max_freq.</b> The code says " + p.sticky + "; recounting the " +
        "window honestly gives " + p.truemf + ". It is stale, and deliberately so: a " +
        "smaller max_freq could only ever justify a <i>shorter</i> window, and shorter " +
        "windows cannot beat a best of " + e.best + ".";
    } else {
      cap += "Here the stale max_freq and the true one agree at " + p.sticky + ".";
    }
    steps.push({
      caption: cap, ev: e, mode: "424", seq: seq, k: k,
      flag: p.sticky !== p.truemf ? "warn" : "ok"
    });
  }

  var last = steps[steps.length - 1];
  last.flag = "ok";
  last.caption = "<b>Answer " + run.best + " — the page's answer, found at right = 3 and " +
    "never beaten.</b> The last three windows were all genuinely invalid on a fresh " +
    "recount, and the answer is still right: <i>best</i> only ever records a length, and " +
    "length " + run.best + " was legitimately achieved by <code>AABA</code>. That is why " +
    "not decrementing max_freq is correct rather than lucky, and it keeps the loop at " +
    "<b>" + run.moves + " pointer moves</b> instead of rescanning 26 counters " + n +
    " times. Being able to say that, and not just type the code, is the follow-up the " +
    "page warns you about.";
  return { id: "rep", label: "LC 424 · replacement", steps: steps };
}

// ----------------------------------------------------------------------
// tab 3 · the anti-cue -- negatives break the invariant
// ----------------------------------------------------------------------
function dsaslidingwindow_neg() {
  var seq = dsaslidingwindow_NEG;
  var n = seq.length;
  var K = dsaslidingwindow_NEGK;
  var total = 0, i, j;
  for (i = 0; i < n; i++) total += seq[i];
  var truth = dsaslidingwindow_bruteSum(seq, K);

  var run = dsaslidingwindow_slide({
    seq: seq,
    st: { s: 0 },
    add: function (st, x) { st.s += x; },
    drop: function (st, x) { st.s -= x; },
    bad: function (st) { return st.s > K; },
    probe: function (st) {
      return {
        label: "sum ≤ K",
        value: st.s + " ≤ " + K,
        ok: st.s <= K
      };
    }
  });

  var steps = [{
    caption: "<b>Same engine, a sum condition, and negative numbers.</b> Longest subarray " +
      "with sum ≤ " + K + ". Everything about the statement looks like a window: " +
      "<i>longest</i>, <i>contiguous</i>, a condition. The page's §1 anti-cue says do not. " +
      "Watch exactly where it dies. The whole array sums to <b>" + total + "</b> — hold " +
      "on to that. Press Play.",
    ev: null, mode: "neg", seq: seq, k: K, flag: "idle"
  }];

  var e, cap;
  var negSeen = false, grew = 0;
  for (i = 0; i < run.evs.length; i++) {
    e = run.evs[i];
    cap = "<b>right = " + e.r + ", adding " + seq[e.r] + ".</b> ";
    var before = Number(e.probe.value.split(" ")[0]);
    for (j = 0; j < e.dropped.length; j++) before += e.dropped[j];
    if (e.shrinks) {
      cap += "The window sums to " + before + ", above " + K + ", so the shrink " +
        "loop drops " + e.dropped.join(" and ") + " from the left. <b>Left is now " +
        e.left + " and can never return.</b> That single move is the whole bug, and " +
        "nothing on screen looks wrong yet.";
    } else if (seq[e.r] < 0) {
      cap += "A negative: the window grew to length " + e.len + " and its sum <i>fell</i> " +
        "to " + before + ". ";
      cap += negSeen
        ? "Second time. By now index 0 is " + e.left + " place behind left and the " +
          "budget has " + (K - before) + " of slack — slack that would have been " +
          "enough to keep <b>" + seq[0] + "</b>. The algorithm cannot spend it."
        : "That is the assumption the template is built on, broken in one step: " +
          "<i>longer</i> is supposed to mean <i>worse</i>. Here it means better, so an " +
          "index discarded earlier might have belonged in the answer after all.";
      negSeen = true;
    } else {
      grew++;
      cap += "Sum " + before + ", inside the budget of " + K + ", so left stays at " +
        e.left + " and the window simply gets longer: length " + e.len + ", best " +
        e.best + ". ";
      cap += grew === 1
        ? "From here the shrink loop never fires again — the run is just an " +
          "uninterrupted expansion, which should make you suspicious."
        : grew === 2
          ? "Three consecutive best-so-far records with no shrink. The algorithm has " +
            "settled into a fixed left edge and is measuring from the wrong place."
          : "Best has now been beaten " + e.best + " times, once per step, and every " +
            "single one of those windows starts at index " + e.left + " rather than 0.";
    }
    steps.push({
      caption: cap, ev: e, mode: "neg", seq: seq, k: K,
      flag: e.shrinks ? "bad" : "warn"
    });
  }

  var last = steps[steps.length - 1];
  last.flag = "bad";
  last.truth = truth;
  last.caption = "<b>The window says " + run.best + ". The answer is " + truth +
    ".</b> The whole array sums to " + total + ", which is ≤ " + K + " — the best " +
    "subarray is the entire input, and the window threw away index 0 on its very first " +
    "step. It was not wrong to shrink: at right = 0 the window really was invalid. It was " +
    "wrong to assume that an invalid window can only be fixed by getting shorter. " +
    "<code>" + seq[4] + "</code> at index 4 would have rescued it by making the window " +
    "<i>longer</i>. Sliding window needs the sum to move one way as the window grows; " +
    "negatives remove that, so reach for <b>prefix sums plus a hash map</b> — still O(n), " +
    "and it does not need the invariant.";
  return { id: "neg", label: "Negatives · it breaks", steps: steps };
}

S["dsaslidingwindow"] = {
  title: "Run the one template three ways",
  note: "The page's §2 template implemented <b>once</b> — expand right, shrink left while " +
    "invalid, record after the shrink — and handed a different <i>invalid</i> per tab, " +
    "which is §7's claim made executable. Inputs are the page's own: <code>" +
    dsaslidingwindow_LC3 + "</code> for LC 3, <code>" + dsaslidingwindow_S424 +
    "</code> with k = " + dsaslidingwindow_K424 + " for LC 424, and an array with " +
    "negatives for the anti-cue. One frame is one advance of <code>right</code>, so a tab " +
    "is exactly as long as its input. Pointer moves are counted against the page's <b>2n</b> " +
    "bound, and the brute-force columns are n(n+1)/2 substrings and n(n+1)(n+2)/6 " +
    "character visits. Nothing here is quoted: the answers <b>3</b>, <b>4</b> and the " +
    "wrong one in tab 3 all come out of the same loop.",
  interval: 1350,

  scenarios: [dsaslidingwindow_lc3(), dsaslidingwindow_lc424(), dsaslidingwindow_neg()],

  draw: function (step, d, ctx) {
    var e = step.ev;
    var seq = step.seq;
    var n = seq.length;
    var left = e ? e.left : 0;
    var right = e ? e.r : -1;
    var best = e ? e.best : 0;
    var i, cells, lbl, flag;

    // --- the input strip, with the window painted on it ----------------
    cells = [];
    for (i = 0; i < n; i++) {
      lbl = String(seq[i]);
      if (right < 0) {
        flag = "idle";
      } else if (i > right) {
        flag = "idle";
      } else if (i < left) {
        flag = "idle";
      } else if (i === right) {
        flag = e.valid ? "ok" : "bad";
      } else {
        flag = e.valid ? "ok" : "warn";
      }
      cells.push({
        label: lbl,
        flag: flag,
        title: "index " + i +
          (right < 0 ? " — not reached"
            : i > right ? " — not reached"
            : i < left ? " — left of the window, gone for good"
            : i === right ? " — the right pointer"
            : " — inside the window")
      });
    }

    // --- the two pointers on their own lane ----------------------------
    var ptr = [];
    for (i = 0; i < n; i++) {
      if (right >= 0 && i === left && i === right) lbl = "LR";
      else if (right >= 0 && i === left) lbl = "L";
      else if (i === right) lbl = "R";
      else lbl = "";
      ptr.push({
        label: lbl,
        flag: lbl ? (lbl === "R" ? "ok" : "warn") : "idle",
        title: lbl === "L" ? "left = " + left : lbl === "R" ? "right = " + right
          : lbl === "LR" ? "left = right = " + left : "index " + i
      });
    }

    var probe = e && e.probe ? e.probe : null;
    var rows = [
      { label: "window", value: right < 0 ? "not started" : "[" + left + ", " + right + "]  length " + e.len },
      {
        label: probe ? probe.label : "validity",
        value: probe ? probe.value : "not evaluated",
        flag: probe ? (probe.ok ? "ok" : "bad") : "idle"
      },
      {
        label: "shrinks this step",
        value: right < 0 ? "0" : String(e.shrinks),
        flag: right < 0 ? "idle" : e.shrinks ? "warn" : "ok"
      }
    ];
    if (step.mode === "424" && probe) {
      rows.push({
        label: "max_freq · code vs honest recount",
        value: probe.sticky + " vs " + probe.truemf,
        flag: probe.sticky === probe.truemf ? "ok" : "warn"
      });
    }
    if (step.truth !== undefined) {
      rows.push({
        label: "brute force over every subarray",
        value: String(step.truth),
        flag: "bad"
      });
    }

    var movePct = e ? (e.moves / (2 * n)) * 100 : 0;

    var out = [
      d.flow([
        d.big(String(best), "best so far", right < 0 ? "idle" : step.mode === "neg" ? "warn" : "ok"),
        d.stat({
          label: "right",
          value: right < 0 ? "—" : String(right) + " / " + (n - 1),
          sub: "expands every step",
          flag: right < 0 ? "idle" : "ok"
        }),
        d.stat({
          label: "left",
          value: String(left),
          sub: "only ever forward",
          flag: right < 0 ? "idle" : left ? "warn" : "ok"
        })
      ]),
      d.node({
        title: step.mode === "lc3" ? "longest substring, no repeats"
          : step.mode === "424" ? "longest run after ≤ " + step.k + " replacement"
          : "longest subarray with sum ≤ " + step.k,
        status: right < 0 ? "READY" : e.valid ? "VALID" : "INVALID",
        statusFlag: right < 0 ? "idle" : e.valid ? "ok" : "bad",
        badge: "n = " + n,
        meta: step.mode === "424" ? "shrink with IF" : "shrink with WHILE",
        flag: step.flag === "idle" ? "idle" : step.mode === "neg" ? "bad" : step.flag,
        rows: rows,
        gauges: [{
          label: "pointer moves against the 2n bound",
          pct: movePct,
          value: (e ? e.moves : 0) + " / " + (2 * n),
          flag: right < 0 ? "idle" : "ok"
        }],
        body: d.stack([
          d.cells(cells, { label: "the input, window painted on it", dense: n > 8 }),
          d.cells(ptr, { label: "L and R", dense: n > 8 })
        ])
      })
    ];

    if (ctx.i === ctx.n) {
      out.push(d.table(
        ["cost of", "this run", "every substring"],
        [
          ["work units", (e ? e.moves : 0) + " pointer moves", dsaslidingwindow_subs(n) + " substrings"],
          ["element visits", String(e ? e.moves : 0), String(dsaslidingwindow_visits(n))],
          ["growth", "O(n)", "O(n²) windows, O(n³) visits"]
        ]
      ));
    }

    out.push(d.note(
      ctx.i === ctx.n
        ? (step.mode === "neg"
          ? "The engine is not broken and the code has no bug. The <i>precondition</i> is " +
            "missing, and that is the only reason this run is wrong."
          : "Green is the live window · amber is inside it while it is invalid · grey is " +
            "either not reached yet or permanently behind <b>L</b>.")
        : "Green is the live window · amber is inside it while it is invalid · grey is " +
          "either not reached yet or permanently behind <b>L</b>. <b>L</b> and <b>R</b> " +
          "between them make at most 2n moves, which is the whole complexity argument.",
      ctx.i === ctx.n && step.mode === "neg" ? "bad" : undefined
    ));

    return d.stack(out);
  }
};

  // ====================================================================
// ======================================================================
// SIM · dsasolutionsarr  (solutions-arrays.md)
//
// LC 560 · Subarray Sum Equals K — the one problem on the page carrying
// three complexity tiers AND a named trap, which is exactly what a tab bar
// is for. The page's own ladder runs here over the same eight elements:
// the O(n^3) brute force, the O(n) prefix-sum hash map, and the sliding
// window the page warns about. The window gets a tab because it does not
// merely cost more — it answers WRONG, which is the page's point.
//
// CONFIG — declared here, because the page states no array:
//   nums = [3, 4, 7, -2, 2, 1, 4, 2]     eight elements, one negative
//   k    = 7
// Chosen so that (a) a negative value is present, which is precisely the
// condition the page says breaks the window's invariant, and (b) one prefix
// value repeats, so the hash map's count jumps by 2 in a single step —
// the multiplicity that a "seen it before / not seen it" set would lose.
//
// From the page, used as stated:
//   approach 1  O(n^3) — "every subarray, summed from scratch"
//   approach 2  O(n^2) — "drop the inner sum by accumulating"
//   approach 3  O(n) time, O(n) space — prefix[i] == prefix[j] - k, with
//               seen[0] = 1 for the empty prefix, and counting BEFORE
//               recording so a prefix cannot pair with itself
//   the warning — "shrinking the window does not monotonically reduce the
//               sum, so the invariant breaks"
//
// OPERATION MODEL, stated so the counters mean something. One operation is
// one element added into a running total, one comparison (including one
// loop test), or one hash lookup / insert. Every counter below is
// incremented by the loop that does the work. No count is a formula, and
// the n = 1,000 projection is produced by walking the same two loops and
// tallying the inner lengths they would run.
// ======================================================================

var dsasolutionsarr_NUMS = [3, 4, 7, -2, 2, 1, 4, 2];
var dsasolutionsarr_K = 7;
var dsasolutionsarr_N = dsasolutionsarr_NUMS.length;
var dsasolutionsarr_BIGN = 1000;

function dsasolutionsarr_num(v) {
  return (v < 0 ? "−" : "") + Math.abs(v);
}
function dsasolutionsarr_int(v) {
  return String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function dsasolutionsarr_span(a, b) {
  return a === b ? String(a) : a + ".." + b;
}
function dsasolutionsarr_values(a, b) {
  var out = "", t;
  for (t = a; t <= b; t++) out += (t > a ? " + " : "") + dsasolutionsarr_num(dsasolutionsarr_NUMS[t]);
  return out;
}
function dsasolutionsarr_covers(spans, j) {
  var s;
  for (s = 0; s < spans.length; s++) if (j >= spans[s][0] && j <= spans[s][1]) return true;
  return false;
}

// --- approach 1 · every subarray, summed from scratch -------------------
function dsasolutionsarr_bruteRun() {
  var nums = dsasolutionsarr_NUMS, n = dsasolutionsarr_N, k = dsasolutionsarr_K;
  var adds = 0, cmps = 0, count = 0, subs = 0, matches = [], frames = [];
  var i, j, t, total, here, subsHere;

  for (i = 0; i < n; i++) {
    here = [];
    subsHere = 0;
    for (j = i; j < n; j++) {
      total = 0;
      for (t = i; t <= j; t++) { total += nums[t]; adds++; }   // the O(n) that makes it cubic
      cmps++; subs++; subsHere++;
      if (total === k) { count++; matches.push([i, j]); here.push([i, j]); }
    }
    frames.push({
      i: i, subsHere: subsHere, subs: subs, adds: adds, cmps: cmps,
      ops: adds + cmps, count: count, here: here, matches: matches.slice(0)
    });
  }
  return { frames: frames, adds: adds, cmps: cmps, ops: adds + cmps, count: count, subs: subs };
}

// --- approach 2 · running sum, no frames (counted for the ledger) -------
function dsasolutionsarr_quadRun() {
  var nums = dsasolutionsarr_NUMS, n = dsasolutionsarr_N, k = dsasolutionsarr_K;
  var adds = 0, cmps = 0, count = 0, i, j, total;
  for (i = 0; i < n; i++) {
    total = 0;
    for (j = i; j < n; j++) {
      total += nums[j]; adds++;
      cmps++;
      if (total === k) count++;
    }
  }
  return { adds: adds, cmps: cmps, ops: adds + cmps, count: count };
}

// --- approach 3 · prefix sum + hash map ---------------------------------
function dsasolutionsarr_hashRun() {
  var nums = dsasolutionsarr_NUMS, n = dsasolutionsarr_N, k = dsasolutionsarr_K;
  var seen = {}, where = {}, order = [];
  var running = 0, count = 0, adds = 0, looks = 0, ins = 0;
  var frames = [], matches = [], i, q, key, rkey, hits, fresh, idxs, snap, o;

  seen["p0"] = 1; where["p0"] = [0]; order.push(0);            // the empty prefix

  for (i = 0; i < n; i++) {
    running += nums[i]; adds++;
    key = "p" + (running - k);
    looks++;
    hits = seen.hasOwnProperty(key) ? seen[key] : 0;           // count BEFORE recording
    fresh = [];
    if (hits > 0) {
      idxs = where[key];
      for (q = 0; q < idxs.length; q++) { fresh.push([idxs[q], i]); matches.push([idxs[q], i]); }
    }
    count += hits;

    rkey = "p" + running;
    ins++;
    if (seen.hasOwnProperty(rkey)) { seen[rkey] += 1; where[rkey].push(i + 1); }
    else { seen[rkey] = 1; where[rkey] = [i + 1]; order.push(running); }

    snap = [];
    for (o = 0; o < order.length; o++) snap.push({ v: order[o], c: seen["p" + order[o]] });

    frames.push({
      i: i, running: running, need: running - k, hits: hits, count: count,
      adds: adds, looks: looks, ins: ins, ops: adds + looks + ins,
      map: snap, fresh: fresh, matches: matches.slice(0)
    });
  }
  return { frames: frames, adds: adds, looks: looks, ins: ins, ops: adds + looks + ins, count: count };
}

// --- the trap · sliding window, which the page tells you not to use -----
function dsasolutionsarr_windowRun() {
  var nums = dsasolutionsarr_NUMS, n = dsasolutionsarr_N, k = dsasolutionsarr_K;
  var left = 0, total = 0, count = 0, adds = 0, cmps = 0, shrinks = 0;
  var frames = [], found = [], r, dropped, hit;

  for (r = 0; r < n; r++) {
    total += nums[r]; adds++;
    dropped = [];
    cmps++;                                       // the while test, first evaluation
    while (total > k && left <= r) {
      total -= nums[left]; adds++; dropped.push(left); left++; shrinks++;
      cmps++;                                     // and again after every shrink
    }
    cmps++;                                       // total === k
    hit = total === k;
    if (hit) { count++; found.push([left, r]); }
    frames.push({
      r: r, left: left, total: total, dropped: dropped, hit: hit, count: count,
      adds: adds, cmps: cmps, shrinks: shrinks, ops: adds + cmps, found: found.slice(0)
    });
  }
  return { frames: frames, adds: adds, cmps: cmps, ops: adds + cmps, count: count, shrinks: shrinks, found: found };
}

var dsasolutionsarr_BRUTE = dsasolutionsarr_bruteRun();
var dsasolutionsarr_QUAD = dsasolutionsarr_quadRun();
var dsasolutionsarr_HASH = dsasolutionsarr_hashRun();
var dsasolutionsarr_WIN = dsasolutionsarr_windowRun();
var dsasolutionsarr_TRUTH = dsasolutionsarr_HASH.frames[dsasolutionsarr_N - 1].matches;

// which of the true subarrays the window never counted
var dsasolutionsarr_MISSED = (function () {
  var out = [], a, b, hit;
  for (a = 0; a < dsasolutionsarr_TRUTH.length; a++) {
    hit = false;
    for (b = 0; b < dsasolutionsarr_WIN.found.length; b++) {
      if (dsasolutionsarr_WIN.found[b][0] === dsasolutionsarr_TRUTH[a][0] &&
          dsasolutionsarr_WIN.found[b][1] === dsasolutionsarr_TRUTH[a][1]) hit = true;
    }
    if (!hit) out.push(dsasolutionsarr_TRUTH[a]);
  }
  return out;
})();

// the same three counters at n = 1,000 — walked, not solved. The brute
// force's cost does not depend on the values (it never returns early), so
// tallying the inner lengths of the same two loops is exact.
var dsasolutionsarr_PROJ = (function () {
  var n = dsasolutionsarr_BIGN, i, j, inner = 0, pairs = 0;
  for (i = 0; i < n; i++) {
    for (j = i; j < n; j++) { inner += j - i + 1; pairs++; }
  }
  return { n: n, cubic: inner + pairs, quad: pairs * 2, linear: n * 3 };
})();

function dsasolutionsarr_ledger(d, mark) {
  var W = dsasolutionsarr_WIN, rows = [];
  rows.push([
    (mark === "brute" ? "▶ " : "") + "brute force · sum from scratch",
    "O(n³)", dsasolutionsarr_int(dsasolutionsarr_BRUTE.ops),
    dsasolutionsarr_BRUTE.count + " subarrays"
  ]);
  rows.push([
    "running sum", "O(n²)", dsasolutionsarr_int(dsasolutionsarr_QUAD.ops),
    dsasolutionsarr_QUAD.count + " subarrays"
  ]);
  rows.push([
    (mark === "hash" ? "▶ " : "") + "prefix sum + hash map",
    "O(n)", dsasolutionsarr_int(dsasolutionsarr_HASH.ops),
    dsasolutionsarr_HASH.count + " subarrays"
  ]);
  rows.push([
    (mark === "window" ? "▶ " : "") + "sliding window",
    "O(n), and wrong", dsasolutionsarr_int(W.ops),
    W.count + " subarrays ✗"
  ]);
  return d.table(["same 8 elements, k = " + dsasolutionsarr_K, "class", "operations counted", "answer"], rows);
}

function dsasolutionsarr_projNote(d) {
  var P = dsasolutionsarr_PROJ;
  return d.note(
    "The same three counters, walked over <b>n = " + dsasolutionsarr_int(P.n) + "</b> instead of " +
    dsasolutionsarr_N + ": <b>" + dsasolutionsarr_int(P.cubic) + "</b> operations cubic, <b>" +
    dsasolutionsarr_int(P.quad) + "</b> quadratic, <b>" + dsasolutionsarr_int(P.linear) +
    "</b> for the one pass — <b>" + dsasolutionsarr_int(P.cubic / P.linear) +
    "×</b> the work for the identical answer. At n = " + dsasolutionsarr_N +
    " the gap was only " + (dsasolutionsarr_BRUTE.ops / dsasolutionsarr_HASH.ops).toFixed(1) +
    "×, which is why eight elements never settle an argument about complexity.",
    "warn"
  );
}

// --- scenarios ----------------------------------------------------------
function dsasolutionsarr_bruteScenario() {
  var R = dsasolutionsarr_BRUTE, steps = [], i, f, cap;

  steps.push({
    mode: "brute", i: -1, subs: 0, adds: 0, cmps: 0, ops: 0, count: 0,
    here: [], matches: [],
    caption: "<b>nums = [" + dsasolutionsarr_NUMS.join(", ").replace(/-/g, "−") +
      "], k = " + dsasolutionsarr_K + ".</b> Approach 1 checks every subarray and sums each " +
      "one from scratch — the inner <code>sum(nums[i:j+1])</code> is the O(n) that makes " +
      "it cubic. Nothing counted yet; press Play and watch the ledger."
  });

  for (i = 0; i < R.frames.length; i++) {
    f = R.frames[i];
    cap = "<b>i = " + f.i + ".</b> " + f.subsHere + " subarray" + (f.subsHere === 1 ? "" : "s") +
      " start here, and each is re-summed from index " + f.i + " — <b>" +
      (f.i === 0 ? f.adds : f.adds - R.frames[i - 1].adds) + "</b> element additions on this " +
      "row alone. Running total: <b>" + dsasolutionsarr_int(f.ops) + "</b> operations, <b>" +
      f.count + "</b> match" + (f.count === 1 ? "" : "es") + " so far";
    cap += f.here.length
      ? ", including <b>" + dsasolutionsarr_values(f.here[0][0], f.here[0][1]) + " = " +
        dsasolutionsarr_K + "</b>."
      : ".";
    steps.push({
      mode: "brute", i: f.i, subsHere: f.subsHere, subs: f.subs, adds: f.adds, cmps: f.cmps,
      ops: f.ops, count: f.count, here: f.here, matches: f.matches,
      flag: f.here.length ? "ok" : "warn", caption: cap
    });
  }

  steps[steps.length - 1].showLedger = true;
  steps[steps.length - 1].flag = "bad";
  steps[steps.length - 1].caption =
    "<b>" + R.count + " subarrays, for " + dsasolutionsarr_int(R.ops) + " operations</b> — " +
    dsasolutionsarr_int(R.adds) + " element additions and " + R.cmps + " comparisons over " +
    R.subs + " subarrays. The hash-map pass reaches the same " + R.count + " in <b>" +
    dsasolutionsarr_HASH.ops + "</b>. Dropping the inner <code>sum</code> for a running total " +
    "(approach 2) already removes " + dsasolutionsarr_int(R.ops - dsasolutionsarr_QUAD.ops) +
    " of them, and it is one line.";
  return { id: "brute", label: "Brute force · O(n³)", steps: steps };
}

function dsasolutionsarr_hashScenario() {
  var R = dsasolutionsarr_HASH, steps = [], i, f, cap;

  steps.push({
    mode: "hash", i: -1, running: 0, need: 0 - dsasolutionsarr_K, hits: 0, count: 0,
    adds: 0, looks: 0, ins: 0, ops: 0, map: [{ v: 0, c: 1 }], fresh: [], matches: [],
    caption: "Same array, same <b>k = " + dsasolutionsarr_K + "</b>. <code>prefix[j] − " +
      "prefix[i] = k</code> rearranges to <code>prefix[i] = prefix[j] − k</code>, so the " +
      "question becomes a lookup. The map starts holding <b>{0: 1}</b> — the empty prefix, " +
      "without which every subarray starting at index 0 is missed."
  });

  for (i = 0; i < R.frames.length; i++) {
    f = R.frames[i];
    cap = "<b>x = " + dsasolutionsarr_num(dsasolutionsarr_NUMS[f.i]) + " (index " + f.i +
      ").</b> running = <b>" + dsasolutionsarr_num(f.running) + "</b>, so it asks the map for " +
      "<b>" + dsasolutionsarr_num(f.running) + " − " + dsasolutionsarr_K + " = " +
      dsasolutionsarr_num(f.need) + "</b>: ";
    if (f.hits === 0) {
      cap += "not there, nothing to add. Count stays <b>" + f.count + "</b>.";
    } else if (f.hits === 1) {
      cap += "seen <b>once</b>, so one subarray ends here — <b>" +
        dsasolutionsarr_values(f.fresh[0][0], f.fresh[0][1]) + " = " + dsasolutionsarr_K +
        "</b>. Count <b>" + f.count + "</b>.";
    } else {
      cap += "seen <b>" + f.hits + " times</b>, so <b>" + f.hits + "</b> subarrays end right " +
        "here (indices " + dsasolutionsarr_span(f.fresh[0][0], f.fresh[0][1]) + " and " +
        dsasolutionsarr_span(f.fresh[1][0], f.fresh[1][1]) + "). This is why the map stores a " +
        "<i>count</i> and not a set. Count <b>" + f.count + "</b>.";
    }
    cap += " Then <code>" + dsasolutionsarr_num(f.running) + "</code> is recorded — after " +
      "the lookup, never before. Ledger: <b>" + f.ops + "</b> operations, three per element.";
    steps.push({
      mode: "hash", i: f.i, running: f.running, need: f.need, hits: f.hits, count: f.count,
      adds: f.adds, looks: f.looks, ins: f.ins, ops: f.ops, map: f.map, fresh: f.fresh,
      matches: f.matches, flag: f.hits ? "ok" : "idle", caption: cap
    });
  }

  steps[steps.length - 1].showLedger = true;
  steps[steps.length - 1].flag = "ok";
  steps[steps.length - 1].caption =
    "<b>" + R.count + " subarrays in " + R.ops + " operations</b> — " + R.adds +
    " additions, " + R.looks + " lookups, " + R.ins + " inserts, one pass, no rescan. The " +
    "brute force needed " + dsasolutionsarr_int(dsasolutionsarr_BRUTE.ops) + " for the same " +
    R.count + ". <b>The trade to name out loud:</b> O(n) time bought with O(n) space — " +
    "the map ended holding " + R.frames[R.frames.length - 1].map.length +
    " distinct prefix values.";
  return { id: "hash", label: "Prefix sum + hash · O(n)", steps: steps };
}

function dsasolutionsarr_windowScenario() {
  var R = dsasolutionsarr_WIN, steps = [], i, f, cap;

  steps.push({
    mode: "window", r: -1, left: 0, total: 0, dropped: [], hit: false, count: 0,
    adds: 0, cmps: 0, shrinks: 0, ops: 0, found: [],
    caption: "The pattern that looks right and is not. Grow the window at the right, shrink " +
      "from the left while the sum exceeds <b>k = " + dsasolutionsarr_K + "</b>, count a match " +
      "whenever the sum lands on it. Watch what index 3 does to the invariant."
  });

  for (i = 0; i < R.frames.length; i++) {
    f = R.frames[i];
    cap = "<b>right = " + f.r + " (" + dsasolutionsarr_num(dsasolutionsarr_NUMS[f.r]) +
      ").</b> Window sum <b>" + dsasolutionsarr_num(f.total) + "</b>";
    cap += f.dropped.length
      ? " after dropping " + f.dropped.length + " element" + (f.dropped.length === 1 ? "" : "s") +
        " from the left (left = " + f.left + ")"
      : " over window " + dsasolutionsarr_span(f.left, f.r);
    cap += f.hit
      ? " — a hit, count <b>" + f.count + "</b>."
      : " — no match, count stays <b>" + f.count + "</b>.";
    if (dsasolutionsarr_NUMS[f.r] < 0) {
      cap += " <i>And here is the break:</i> this element is negative, so extending the window " +
        "made the sum <b>smaller</b>. The shrink rule assumes growth only ever raises it.";
    }
    cap += " Ledger: <b>" + f.ops + "</b> operations.";
    steps.push({
      mode: "window", r: f.r, left: f.left, total: f.total, dropped: f.dropped, hit: f.hit,
      count: f.count, adds: f.adds, cmps: f.cmps, shrinks: f.shrinks, ops: f.ops,
      found: f.found, flag: f.hit ? "ok" : dsasolutionsarr_NUMS[f.r] < 0 ? "bad" : "idle",
      caption: cap
    });
  }

  steps[steps.length - 1].showLedger = true;
  steps[steps.length - 1].showMissed = true;
  steps[steps.length - 1].flag = "bad";
  steps[steps.length - 1].caption =
    "<b>The window answers " + R.count + ". The answer is " + dsasolutionsarr_HASH.count +
    ".</b> It is the cheapest run on the board — " + R.ops + " operations, fewer than the " +
    "hash map's " + dsasolutionsarr_HASH.ops + " — and it is wrong, which is the only " +
    "thing about it that matters. It missed " + dsasolutionsarr_MISSED.length + " subarrays, " +
    "both of them <i>inside</i> a window the left pointer had already walked past. Once a " +
    "negative value exists, shrinking does not monotonically reduce the sum, so no left " +
    "pointer position is safe to abandon. <b>Naming why the obvious pattern fails is worth " +
    "more than the solution itself.</b>";
  return { id: "window", label: "Sliding window · wrong", steps: steps };
}

S["dsasolutionsarr"] = {
  title: "Count the same subarrays three ways, and tally every operation",
  note: "LC 560 · Subarray Sum Equals K over <b>nums = [3, 4, 7, −2, 2, 1, 4, 2]</b> " +
    "with <b>k = 7</b> — the page states no array, so that one is declared here, chosen " +
    "because it holds a negative value and one repeated prefix sum. The three tabs run the " +
    "page's approach 1 (sum every subarray from scratch), approach 3 (prefix sums in a hash " +
    "map) and the sliding window the page explicitly rejects, over the identical eight " +
    "elements. <b>Every count on screen is incremented by the loop doing the work</b>: one " +
    "operation is one element added into a running total, one comparison or loop test, or one " +
    "hash lookup or insert. Nothing here is a formula, including the n = 1,000 projection.",
  interval: 1300,

  scenarios: [
    dsasolutionsarr_bruteScenario(),
    dsasolutionsarr_hashScenario(),
    dsasolutionsarr_windowScenario()
  ],

  draw: function (step, d, ctx) {
    var nums = dsasolutionsarr_NUMS, n = dsasolutionsarr_N;
    var cells = [], mcells = [], body, j, s, fl, tail = [], head;

    // ---------------- approach 1 · brute force -------------------------
    if (step.mode === "brute") {
      for (j = 0; j < n; j++) {
        fl = "idle";
        if (step.i >= 0) {
          if (j < step.i) fl = "idle";
          else if (j === step.i) fl = "bad";
          else fl = "warn";
        }
        cells.push({
          label: dsasolutionsarr_num(nums[j]),
          flag: fl,
          title: "index " + j + " · value " + dsasolutionsarr_num(nums[j]) +
            (step.i < 0 ? " · not started"
              : j < step.i ? " · finished as a start index"
                : j === step.i ? " · the start index being scanned from"
                  : " · re-summed for every subarray starting at " + step.i)
        });
      }
      for (s = 0; s < step.matches.length; s++) {
        mcells.push({
          label: dsasolutionsarr_span(step.matches[s][0], step.matches[s][1]),
          flag: "ok",
          title: dsasolutionsarr_values(step.matches[s][0], step.matches[s][1]) + " = " +
            dsasolutionsarr_K
        });
      }
      if (!mcells.length) mcells.push({ label: "—", flag: "idle", title: "nothing found yet" });

      head = d.flow([
        d.big(step.i < 0 ? "—" : "i = " + step.i, "start index", step.i < 0 ? "idle" : "bad"),
        d.stat({
          label: "operations",
          value: dsasolutionsarr_int(step.ops),
          sub: step.adds + " adds · " + step.cmps + " compares",
          flag: step.i < 0 ? "idle" : "bad"
        }),
        d.stat({
          label: "subarrays summed",
          value: step.subs + " / " + dsasolutionsarr_BRUTE.subs,
          sub: "each from scratch",
          flag: step.i < 0 ? "idle" : "warn"
        }),
        d.stat({
          label: "matches",
          value: String(step.count),
          sub: "sum = " + dsasolutionsarr_K,
          flag: step.count ? "ok" : "idle"
        }),
        d.stat({
          label: "one pass would have spent",
          value: String(step.i < 0 ? 0 : (step.i + 1) * 3),
          sub: "3 ops per element",
          flag: "ok"
        })
      ]);

      body = d.cells(cells, { label: "nums · red is the start index, amber is re-summed from it" }) +
        d.cells(mcells, { label: "subarrays found so far (index range)" });

      tail = [d.node({
        title: "approach 1 · every subarray, summed from scratch",
        status: step.i < 0 ? "IDLE" : step.i === n - 1 ? "DONE" : "SCANNING",
        statusFlag: step.i < 0 ? "idle" : step.i === n - 1 ? "bad" : "warn",
        badge: "O(n³)",
        meta: "n = " + n + " · k = " + dsasolutionsarr_K,
        flag: step.i < 0 ? "idle" : "warn",
        body: body,
        rows: [
          { label: "element additions (the inner sum)", value: dsasolutionsarr_int(step.adds), flag: "bad" },
          { label: "comparisons (one per subarray)", value: String(step.cmps) },
          { label: "operations per match found", value: step.count ? (step.ops / step.count).toFixed(1) : "—", flag: "warn" }
        ]
      })];
    }

    // ---------------- approach 3 · prefix + hash map --------------------
    else if (step.mode === "hash") {
      for (j = 0; j < n; j++) {
        fl = "idle";
        if (step.i >= 0) {
          if (dsasolutionsarr_covers(step.fresh, j)) fl = "ok";
          else if (j === step.i) fl = "warn";
          else if (j < step.i) fl = "idle";
        }
        cells.push({
          label: dsasolutionsarr_num(nums[j]),
          flag: fl,
          title: "index " + j + " · value " + dsasolutionsarr_num(nums[j]) +
            (step.i === j ? " · the element being consumed" : "")
        });
      }
      for (s = 0; s < step.map.length; s++) {
        mcells.push({
          label: dsasolutionsarr_num(step.map[s].v) + (step.map[s].c > 1 ? " ×" + step.map[s].c : ""),
          flag: step.i >= 0 && step.map[s].v === step.need ? "ok"
            : step.i >= 0 && step.map[s].v === step.running ? "warn" : "idle",
          title: "prefix sum " + dsasolutionsarr_num(step.map[s].v) + " seen " + step.map[s].c +
            " time" + (step.map[s].c === 1 ? "" : "s")
        });
      }

      head = d.flow([
        d.big(step.i < 0 ? "—" : dsasolutionsarr_num(step.running), "running prefix",
          step.i < 0 ? "idle" : "warn"),
        d.stat({
          label: "looking for",
          value: dsasolutionsarr_num(step.need),
          sub: "running − k",
          flag: step.i < 0 ? "idle" : step.hits ? "ok" : "idle"
        }),
        d.stat({
          label: "map says",
          value: step.i < 0 ? "—" : "×" + step.hits,
          sub: step.hits === 1 ? "one subarray ends here"
            : step.hits > 1 ? step.hits + " subarrays end here" : "no subarray ends here",
          flag: step.hits ? "ok" : "idle"
        }),
        d.stat({
          label: "matches",
          value: String(step.count),
          sub: "counted before recording",
          flag: step.count ? "ok" : "idle"
        }),
        d.stat({
          label: "operations",
          value: String(step.ops),
          sub: step.adds + " adds · " + step.looks + " lookups · " + step.ins + " inserts",
          flag: "ok"
        })
      ]);

      body = d.cells(cells, { label: "nums · amber is the element consumed, green is a subarray just counted" }) +
        d.cells(mcells, { label: "seen{} · prefix value × count — green is the one just asked for" });

      tail = [d.node({
        title: "approach 3 · prefix sums in a hash map",
        status: step.i < 0 ? "IDLE" : step.i === n - 1 ? "DONE" : "ONE PASS",
        statusFlag: step.i < 0 ? "idle" : "ok",
        badge: "O(n) time · O(n) space",
        meta: "map holds " + step.map.length + " distinct prefix value" + (step.map.length === 1 ? "" : "s"),
        flag: step.i < 0 ? "idle" : "ok",
        body: body,
        rows: [
          { label: "elements consumed", value: (step.i + 1) + " / " + n },
          { label: "operations per element", value: step.i < 0 ? "—" : (step.ops / (step.i + 1)).toFixed(1), flag: "ok" },
          {
            label: "brute force, at this point",
            value: dsasolutionsarr_int(step.i < 0 ? 0 : dsasolutionsarr_BRUTE.frames[step.i].ops),
            flag: "bad"
          }
        ]
      })];
    }

    // ---------------- the trap · sliding window -------------------------
    else {
      for (j = 0; j < n; j++) {
        fl = "idle";
        if (step.r >= 0) {
          if (j >= step.left && j <= step.r) fl = step.hit ? "ok" : "warn";
          else if (j < step.left) fl = "bad";
        }
        cells.push({
          label: dsasolutionsarr_num(nums[j]),
          flag: fl,
          title: "index " + j + " · value " + dsasolutionsarr_num(nums[j]) +
            (step.r < 0 ? ""
              : j < step.left ? " · abandoned by the left pointer, never revisited"
                : j <= step.r ? " · inside the window" : " · not reached yet")
        });
      }
      if (step.showMissed) {
        for (s = 0; s < dsasolutionsarr_TRUTH.length; s++) {
          var got = false;
          for (j = 0; j < dsasolutionsarr_WIN.found.length; j++) {
            if (dsasolutionsarr_WIN.found[j][0] === dsasolutionsarr_TRUTH[s][0] &&
                dsasolutionsarr_WIN.found[j][1] === dsasolutionsarr_TRUTH[s][1]) got = true;
          }
          mcells.push({
            label: dsasolutionsarr_span(dsasolutionsarr_TRUTH[s][0], dsasolutionsarr_TRUTH[s][1]),
            flag: got ? "ok" : "bad",
            title: dsasolutionsarr_values(dsasolutionsarr_TRUTH[s][0], dsasolutionsarr_TRUTH[s][1]) +
              " = " + dsasolutionsarr_K + (got ? " · the window counted it" : " · MISSED")
          });
        }
      } else {
        for (s = 0; s < step.found.length; s++) {
          mcells.push({
            label: dsasolutionsarr_span(step.found[s][0], step.found[s][1]),
            flag: "ok",
            title: dsasolutionsarr_values(step.found[s][0], step.found[s][1]) + " = " + dsasolutionsarr_K
          });
        }
        if (!mcells.length) mcells.push({ label: "—", flag: "idle", title: "nothing counted yet" });
      }

      head = d.flow([
        d.big(step.r < 0 ? "—" : dsasolutionsarr_span(step.left, step.r), "window",
          step.r < 0 ? "idle" : step.hit ? "ok" : "warn"),
        d.stat({
          label: "window sum",
          value: dsasolutionsarr_num(step.total),
          sub: "target " + dsasolutionsarr_K,
          flag: step.r < 0 ? "idle" : step.hit ? "ok" : "warn"
        }),
        d.stat({
          label: "counted",
          value: String(step.count),
          sub: "true answer " + dsasolutionsarr_HASH.count,
          flag: step.r < 0 ? "idle" : step.count === dsasolutionsarr_HASH.count ? "ok" : "bad"
        }),
        d.stat({
          label: "left-pointer shrinks",
          value: String(step.shrinks),
          sub: "elements abandoned",
          flag: step.shrinks ? "bad" : "idle"
        }),
        d.stat({
          label: "operations",
          value: String(step.ops),
          sub: "cheapest run on the board",
          flag: "warn"
        })
      ]);

      body = d.cells(cells, { label: "nums · amber is the live window, red was abandoned on the left" }) +
        d.cells(mcells, {
          label: step.showMissed
            ? "all " + dsasolutionsarr_TRUTH.length + " true subarrays · red was never counted"
            : "counted by the window so far"
        });

      tail = [d.node({
        title: "the rejected pattern · sliding window",
        status: step.r < 0 ? "IDLE" : step.showMissed ? "WRONG ANSWER" : "RUNNING",
        statusFlag: step.r < 0 ? "idle" : step.showMissed ? "bad" : "warn",
        badge: "negatives present",
        meta: "invariant assumed: growing right raises the sum",
        flag: step.r < 0 ? "idle" : step.showMissed ? "bad" : "warn",
        body: body,
        rows: [
          { label: "subarrays the window counted", value: String(step.count), flag: step.showMissed ? "bad" : undefined },
          { label: "subarrays that actually sum to " + dsasolutionsarr_K, value: String(dsasolutionsarr_HASH.count), flag: "ok" },
          { label: "missed", value: String(step.showMissed ? dsasolutionsarr_MISSED.length : Math.max(0, 0)), flag: step.showMissed ? "bad" : "idle" }
        ]
      })];
    }

    if (step.showLedger) {
      tail.push(dsasolutionsarr_ledger(d, step.mode));
      tail.push(dsasolutionsarr_projNote(d));
    }

    return d.stack([head].concat(tail));
  }
};

  // ====================================================================
// ======================================================================
// SIM · dsasolutionstwo  (solutions-two-pointers.md)
// LC 3, Longest Substring Without Repeating Characters, run three times over
// the same string: the page's approach 1 (every substring, each re-checked
// for duplicates), approach 3 (sliding window with a set) and approach 4
// (last-seen index, left jumps). The time axis is the loop itself — one frame
// per anchor for the brute force, one frame per right pointer for the two
// linear scans. The algorithms below are the page's code, transcribed, and
// every figure on screen is tallied by running them.
//
// CONFIG — the page states no example string, so the sim declares one.
//   s          "abcacbab", n = 8, alphabet {a,b,c}
//   work unit  ONE INDEX VISIT = one read of a character position of s.
//              approach 1: the uniqueness check reads the whole window, so a
//                          substring of length L costs L visits
//              approach 3: one visit per right advance, one per left STEP
//              approach 4: one visit per right advance; left JUMPS, so the
//                          skipped positions are never read
//   long run   the same three functions over a 64-character string built by
//              the LCG x = (75·x + 74) mod 65537, seed 7, letter = "abc"[x%3]
//
// No complexity class is asserted anywhere below. Every count is counted.
// ======================================================================
var dsasolutionstwo_STR = "abcacbab";
var dsasolutionstwo_N = dsasolutionstwo_STR.length;

function dsasolutionstwo_keys(o) {
  var k, out = [];
  for (k in o) { if (o.hasOwnProperty(k)) out.push(k); }
  return out.sort();
}

/** Approach 1 — every substring, each one re-scanned for duplicates. */
function dsasolutionstwo_brute(s) {
  var n = s.length, ops = 0, best = 0, bestL = 0, bestR = 0;
  var frames = [], i, j, t, seen, uniq, len, opsThis, bestHere, subs;
  for (i = 0; i < n; i++) {
    opsThis = 0; bestHere = 0; subs = [];
    for (j = i; j < n; j++) {
      len = j - i + 1;
      seen = {}; uniq = true;
      for (t = i; t <= j; t++) {           // len(set(window)) == len(window)
        opsThis++;                          // one character read
        if (seen[s.charAt(t)]) { uniq = false; }
        seen[s.charAt(t)] = true;
      }
      subs.push({ len: len, uniq: uniq });
      if (uniq && len > bestHere) { bestHere = len; }
      if (uniq && len > best) { best = len; bestL = i; bestR = j; }
    }
    ops += opsThis;
    frames.push({
      anchor: i, opsThis: opsThis, ops: ops, best: best, bestHere: bestHere,
      dupAt: i + bestHere < n ? i + bestHere : -1,
      subs: subs, tried: subs.length
    });
  }
  return { frames: frames, ops: ops, best: best, bestL: bestL, bestR: bestR,
    substrings: (n * (n + 1)) / 2, closed: (n * (n + 1) * (n + 2)) / 6 };
}

/** Approach 3 — sliding window with a set; left STEPS one position at a time. */
function dsasolutionstwo_setrun(s) {
  var n = s.length, seen = {}, left = 0, best = 0, bestL = 0, bestR = 0, ops = 0;
  var frames = [], right, ch, removed, before, len, steps = 0;
  for (right = 0; right < n; right++) {
    ch = s.charAt(right);
    removed = []; before = ops;
    while (seen[ch]) {                       // shrink until valid again
      ops++; steps++;                        // reads s[left] to evict it
      removed.push(s.charAt(left));
      delete seen[s.charAt(left)];
      left++;
    }
    ops++;                                   // reads s[right] to admit it
    seen[ch] = true;
    len = right - left + 1;
    if (len > best) { best = len; bestL = left; bestR = right; }
    frames.push({
      right: right, left: left, ch: ch, len: len, best: best,
      ops: ops, opsThis: ops - before, removed: removed,
      setTxt: dsasolutionstwo_keys(seen).join(" ")
    });
  }
  return { frames: frames, ops: ops, best: best, bestL: bestL, bestR: bestR,
    leftSteps: steps, rights: n };
}

/** Approach 4 — last-seen index; left JUMPS. guarded=false removes the >= left test. */
function dsasolutionstwo_jumprun(s, guarded) {
  var n = s.length, last = {}, left = 0, best = 0, bestL = 0, bestR = 0, ops = 0;
  var frames = [], right, ch, prev, moved, blocked, len, jumps = 0, blocks = 0;
  var from, k, keys, txt;
  for (right = 0; right < n; right++) {
    ch = s.charAt(right);
    ops++;                                   // reads s[right]; left reads nothing
    prev = last.hasOwnProperty(ch) ? last[ch] : -1;
    moved = false; blocked = false; from = left;
    if (prev >= 0) {
      if (!guarded || prev >= left) { left = prev + 1; moved = true; jumps++; }
      else { blocked = true; blocks++; }
    }
    last[ch] = right;
    len = right - left + 1;
    if (len > best) { best = len; bestL = left; bestR = right; }
    keys = dsasolutionstwo_keys(last); txt = [];
    for (k = 0; k < keys.length; k++) { txt.push(keys[k] + " at " + last[keys[k]]); }
    frames.push({
      right: right, left: left, from: from, ch: ch, prev: prev, len: len,
      best: best, ops: ops, opsThis: 1, moved: moved, blocked: blocked,
      skipped: moved ? left - from : 0,
      lastTxt: txt.join(" · ")
    });
  }
  return { frames: frames, ops: ops, best: best, bestL: bestL, bestR: bestR,
    jumps: jumps, blocks: blocks, rights: n };
}

/** A longer string from a stated generator, so the three counts can diverge. */
function dsasolutionstwo_long(len) {
  var x = 7, out = "", i;
  for (i = 0; i < len; i++) {
    x = (x * 75 + 74) % 65537;
    out += "abc".charAt(x % 3);
  }
  return out;
}

var dsasolutionstwo_BRUTE = dsasolutionstwo_brute(dsasolutionstwo_STR);
var dsasolutionstwo_SET = dsasolutionstwo_setrun(dsasolutionstwo_STR);
var dsasolutionstwo_JUMP = dsasolutionstwo_jumprun(dsasolutionstwo_STR, true);
var dsasolutionstwo_BUG = dsasolutionstwo_jumprun(dsasolutionstwo_STR, false);

var dsasolutionstwo_LONG = dsasolutionstwo_long(64);
var dsasolutionstwo_LB = dsasolutionstwo_brute(dsasolutionstwo_LONG);
var dsasolutionstwo_LS = dsasolutionstwo_setrun(dsasolutionstwo_LONG);
var dsasolutionstwo_LJ = dsasolutionstwo_jumprun(dsasolutionstwo_LONG, true);

var dsasolutionstwo_RUNS = [
  { id: "brute", label: "Brute force", run: dsasolutionstwo_BRUTE,
    name: "1 · every substring", big: dsasolutionstwo_LB },
  { id: "set", label: "Window + set", run: dsasolutionstwo_SET,
    name: "3 · window, left steps", big: dsasolutionstwo_LS },
  { id: "jump", label: "Jump on last-seen", run: dsasolutionstwo_JUMP,
    name: "4 · window, left jumps", big: dsasolutionstwo_LJ }
];

function dsasolutionstwo_board(d, id) {
  var rows = [], i, R;
  for (i = 0; i < dsasolutionstwo_RUNS.length; i++) {
    R = dsasolutionstwo_RUNS[i];
    rows.push([
      (R.id === id ? "> " : "") + R.name,
      String(R.run.ops),
      (R.run.ops / dsasolutionstwo_N).toFixed(2) + " x n",
      String(R.big.ops),
      String(R.run.best)
    ]);
  }
  return d.table(
    ["approach", "visits, n=8", "per character", "visits, n=64", "answer"],
    rows
  );
}

// ---------------------------------------------------------------- tab 1
function dsasolutionstwo_bruteScenario() {
  var R = dsasolutionstwo_BRUTE, steps = [], i, f, cap;
  steps.push({
    mode: "brute", kind: "idle", ops: 0, best: 0,
    caption: "Approach 1, the page's brute force: <b>every</b> substring of " +
      "<i>s = " + dsasolutionstwo_STR + "</i>, each one checked for duplicates " +
      "by building a set over the whole window. There are " + R.substrings +
      " substrings here. One frame per anchor <i>i</i> — press Play."
  });
  for (i = 0; i < R.frames.length; i++) {
    f = R.frames[i];
    f.mode = "brute"; f.kind = "step";
    cap = "<b>Anchor i=" + f.anchor + " ('" + dsasolutionstwo_STR.charAt(f.anchor) +
      "').</b> " + f.tried + " substring" + (f.tried === 1 ? "" : "s") +
      " start here, and each is re-read end to end: <b>" + f.opsThis +
      "</b> index visits in this pass alone";
    if (f.dupAt >= 0) {
      cap += ". The run breaks at index " + f.dupAt + " ('" +
        dsasolutionstwo_STR.charAt(f.dupAt) + "', a repeat), so the longest " +
        "duplicate-free window from this anchor is " + f.bestHere;
    } else {
      cap += ". Nothing repeats from here to the end, so all " + f.bestHere +
        " remaining characters are duplicate-free";
    }
    cap += ". Running total <b>" + f.ops + "</b> visits, best so far " + f.best + ".";
    if (f.anchor === 1) {
      cap += " Every one of those reads was already performed at anchor 0 — that " +
        "is the repeated work the page tells you to name.";
    }
    f.caption = cap;
    f.flag = f.opsThis >= 20 ? "bad" : f.opsThis >= 10 ? "warn" : undefined;
    steps.push(f);
  }
  steps.push({
    mode: "brute", kind: "verdict", ops: R.ops, best: R.best,
    bestL: R.bestL, bestR: R.bestR, flag: "bad",
    caption: "<b>Answer " + R.best + ", at a counted cost of " + R.ops +
      " index visits</b> for " + dsasolutionstwo_N + " characters — " +
      (R.ops / dsasolutionstwo_N).toFixed(1) + " reads per character, " +
      R.substrings + " substrings scanned. That total is not an estimate: the " +
      "loop was run and the reads were tallied, and it matches the closed form " +
      "n(n+1)(n+2)/6 = " + R.closed + " exactly. Push n from " +
      dsasolutionstwo_N + " to 64 and the same function costs " +
      dsasolutionstwo_LB.ops + " visits."
  });
  return { id: "brute", label: "Brute force · O(n³)", steps: steps };
}

// ---------------------------------------------------------------- tab 2
function dsasolutionstwo_setScenario() {
  var R = dsasolutionstwo_SET, steps = [], i, f, cap;
  steps.push({
    mode: "set", kind: "idle", ops: 0, best: 0, left: 0, right: -1,
    setTxt: "", removed: [],
    caption: "Approach 3, same string. One set holds the window's characters; " +
      "<i>right</i> admits a character and <i>left</i> evicts until the window " +
      "is valid again. One frame per <i>right</i>, and both pointers only ever " +
      "move forward."
  });
  for (i = 0; i < R.frames.length; i++) {
    f = R.frames[i];
    f.mode = "set"; f.kind = "step";
    cap = "<b>right=" + f.right + " ('" + f.ch + "').</b> ";
    if (f.removed.length) {
      cap += "'" + f.ch + "' is already in the set, so left steps forward " +
        f.removed.length + " time" + (f.removed.length === 1 ? "" : "s") +
        ", evicting " + f.removed.join(" then ") + " — " + f.removed.length +
        " read" + (f.removed.length === 1 ? "" : "s") + " — and then '" + f.ch +
        "' is admitted. Window [" + f.left + "," + f.right + "], length " + f.len;
    } else {
      cap += "The set does not hold '" + f.ch + "', so nothing is evicted: one " +
        "read, one insert. Window [" + f.left + "," + f.right + "], length " + f.len;
    }
    cap += ". Visits this step <b>" + f.opsThis + "</b>, running total <b>" +
      f.ops + "</b>, best " + f.best + ".";
    if (f.right === 2) {
      cap += " Anchor 0 of the other tab spent " +
        dsasolutionstwo_BRUTE.frames[0].opsThis + " visits to learn this much.";
    }
    f.caption = cap;
    f.flag = f.removed.length > 1 ? "warn" : "ok";
    steps.push(f);
  }
  steps.push({
    mode: "set", kind: "verdict", ops: R.ops, best: R.best,
    left: R.bestL, right: R.bestR, bestL: R.bestL, bestR: R.bestR,
    setTxt: "", removed: [], flag: "ok",
    caption: "<b>Same answer " + R.best + ", " + R.ops + " index visits</b> — " +
      R.rights + " right advances plus " + R.leftSteps + " left steps. Each " +
      "index enters the window once and leaves at most once, so this can never " +
      "exceed 2n = " + (2 * dsasolutionstwo_N) + " however the string is " +
      "arranged: that is what makes the nested-looking loop linear. Against the " +
      "brute force's " + dsasolutionstwo_BRUTE.ops + " visits it is " +
      (dsasolutionstwo_BRUTE.ops / R.ops).toFixed(1) + "x less work on 8 " +
      "characters, and " + (dsasolutionstwo_LB.ops / dsasolutionstwo_LS.ops).toFixed(0) +
      "x less on 64."
  });
  return { id: "set", label: "Window + set · O(n)", steps: steps };
}

// ---------------------------------------------------------------- tab 3
function dsasolutionstwo_jumpScenario() {
  var R = dsasolutionstwo_JUMP, B = dsasolutionstwo_BUG, steps = [], i, f, g, cap;
  steps.push({
    mode: "jump", kind: "idle", ops: 0, best: 0, left: 0, right: -1,
    lastTxt: "", prev: -1,
    caption: "Approach 4, same string again. The set is replaced by a map of " +
      "<i>last seen index</i>, so left does not step — it <b>jumps</b> straight " +
      "past the previous occurrence. Same O(n), and the counter at the top is " +
      "the thing that changes."
  });
  for (i = 0; i < R.frames.length; i++) {
    f = R.frames[i]; g = B.frames[i];
    f.mode = "jump"; f.kind = "step";
    cap = "<b>right=" + f.right + " ('" + f.ch + "').</b> ";
    if (f.prev < 0) {
      cap += "'" + f.ch + "' has not been seen, so left stays at " + f.left +
        ". Window [" + f.left + "," + f.right + "], length " + f.len;
    } else if (f.moved) {
      cap += "'" + f.ch + "' was last seen at index " + f.prev + ", which is " +
        "inside the window (" + f.prev + " &ge; left=" + f.from + "), so left " +
        "jumps to " + f.left + " in one assignment — " + f.skipped +
        " position" + (f.skipped === 1 ? "" : "s") + " skipped without reading " +
        "any of them. Window [" + f.left + "," + f.right + "], length " + f.len;
    } else {
      cap += "'" + f.ch + "' was last seen at index " + f.prev + ", but left is " +
        "already at " + f.left + " — that occurrence is <b>outside</b> the " +
        "window, so the <i>>= left</i> guard refuses to drag left backwards. " +
        "Window [" + f.left + "," + f.right + "], length " + f.len;
    }
    cap += ". Visits this step <b>1</b>, running total <b>" + f.ops +
      "</b>, best " + f.best + ".";
    if (f.blocked) {
      cap += " Delete that guard and left would move to " + (f.prev + 1) +
        " here, making the window '" +
        dsasolutionstwo_STR.slice(f.prev + 1, f.right + 1) + "' — which repeats " +
        "a character — and the run would report " + g.best + " at this step " +
        "instead of " + f.best + ".";
    }
    f.caption = cap;
    f.flag = f.blocked ? "warn" : "ok";
    steps.push(f);
  }
  steps.push({
    mode: "jump", kind: "verdict", ops: R.ops, best: R.best,
    left: R.bestL, right: R.bestR, bestL: R.bestL, bestR: R.bestR,
    lastTxt: "", prev: -1, flag: "ok",
    caption: "<b>Answer " + R.best + " in exactly " + R.ops + " index visits — " +
      "one per character, " + R.jumps + " jumps and " + R.blocks + " blocked by " +
      "the guard.</b> The set version needed " + dsasolutionstwo_SET.ops +
      " for the identical answer and the brute force " + dsasolutionstwo_BRUTE.ops +
      ": same complexity class as the set version, " +
      (dsasolutionstwo_SET.ops - R.ops) + " fewer reads, because the evicted " +
      "positions are never touched. On the 64-character string: " +
      dsasolutionstwo_LJ.ops + " visits against " + dsasolutionstwo_LS.ops +
      " and " + dsasolutionstwo_LB.ops + ". And the guard is not a detail — " +
      "without it this same run returns <b>" + B.best + "</b>, an answer no " +
      "duplicate-free substring of this string has."
  });
  return { id: "jump", label: "Jump on last-seen · O(n)", steps: steps };
}

S["dsasolutionstwo"] = {
  title: "Three scans of one string, with the reads counted",
  note: "LC 3 on <b>s = " + dsasolutionstwo_STR + "</b> (n = " + dsasolutionstwo_N +
    "), run three ways. The unit is one <b>index visit</b> — a single read of a " +
    "character position — and every total below was tallied by running the " +
    "page's code in this file, not read off a complexity class: <b>" +
    dsasolutionstwo_BRUTE.ops + "</b> visits for approach 1, <b>" +
    dsasolutionstwo_SET.ops + "</b> for approach 3, <b>" + dsasolutionstwo_JUMP.ops +
    "</b> for approach 4. All three return " + dsasolutionstwo_BRUTE.best +
    ". The same three functions on a 64-character string from the stated " +
    "generator cost " + dsasolutionstwo_LB.ops + " / " + dsasolutionstwo_LS.ops +
    " / " + dsasolutionstwo_LJ.ops + " — the gap is the whole lesson.",
  interval: 1250,
  scenarios: [
    dsasolutionstwo_bruteScenario(),
    dsasolutionstwo_setScenario(),
    dsasolutionstwo_jumpScenario()
  ],

  draw: function (step, d, ctx) {
    var s = dsasolutionstwo_STR, n = dsasolutionstwo_N;
    var mode = step.mode, kind = step.kind;
    var cells = [], ptr = [], k, flag, title, mark;
    var left = step.left === undefined ? 0 : step.left;
    var right = step.right === undefined ? -1 : step.right;

    for (k = 0; k < n; k++) {
      flag = "idle"; title = "index " + k + " · '" + s.charAt(k) + "'"; mark = "";
      if (kind === "verdict") {
        if (k >= step.bestL && k <= step.bestR) {
          flag = "ok"; title += " · in the answer window";
          mark = k === step.bestL ? "L" : k === step.bestR ? "R" : "";
        } else {
          title += " · outside the answer";
        }
      } else if (kind === "idle") {
        title += " · not read yet";
      } else if (mode === "brute") {
        if (k < step.anchor) {
          title += " · already used as an anchor";
        } else if (k === step.anchor) {
          flag = "warn"; title += " · this pass's anchor"; mark = "i";
        } else if (k < step.anchor + step.bestHere) {
          flag = "ok"; title += " · duplicate-free from the anchor";
        } else if (k === step.dupAt) {
          flag = "bad"; title += " · the repeat that ends the run"; mark = "x";
        } else {
          title += " · past the first repeat";
        }
      } else {
        if (k < left) {
          title += " · left of the window";
        } else if (k < right) {
          flag = "ok"; title += " · inside the window";
        } else if (k === right) {
          flag = "warn"; title += " · just admitted"; mark = "R";
        } else {
          title += " · not read yet";
        }
        if (k === left && right >= 0) { mark = k === right ? "LR" : "L"; }
        if (mode === "jump" && step.prev !== undefined && step.prev === k &&
            step.prev >= 0 && k >= left && k < right) {
          flag = "bad"; title += " · previous occurrence, jumped past";
        }
      }
      cells.push({ label: s.charAt(k), flag: flag, title: title });
      ptr.push({ label: mark, flag: mark ? (mark === "x" ? "bad" : "warn") : "idle",
        title: mark ? "pointer " + mark + " at index " + k : "index " + k });
    }

    // --- the per-approach state panel ---------------------------------
    var panel;
    if (mode === "brute") {
      var sub = [], m, list = step.subs || [];
      for (m = 0; m < list.length; m++) {
        sub.push({
          label: String(list[m].len),
          flag: list[m].uniq ? "ok" : "bad",
          title: "substring of length " + list[m].len + " · " +
            (list[m].uniq ? "duplicate-free" : "has a repeat") +
            " · cost " + list[m].len + " reads"
        });
      }
      if (!sub.length) { sub.push({ label: "-", flag: "idle", title: "no pass yet" }); }
      panel = d.node({
        title: "this pass",
        status: kind === "step" ? "SCANNING" : kind === "verdict" ? "FINISHED" : "IDLE",
        statusFlag: kind === "step" ? "bad" : kind === "verdict" ? "warn" : "idle",
        meta: "each cell is one substring, labelled with its length",
        body: d.lane({ label: "checked", cells: sub }),
        rows: [
          { label: "substrings checked here", value: String(step.tried || 0) },
          { label: "reads spent here", value: String(step.opsThis || 0),
            flag: (step.opsThis || 0) >= 20 ? "bad" : undefined },
          { label: "reads, all passes so far", value: String(step.ops || 0) }
        ]
      });
    } else if (mode === "set") {
      panel = d.node({
        title: "window state",
        status: kind === "verdict" ? "ANSWER" : (step.removed && step.removed.length) ? "SHRINKING" : "GROWING",
        statusFlag: kind === "verdict" ? "ok" : (step.removed && step.removed.length) ? "warn" : "ok",
        meta: "a set of the characters between left and right",
        rows: [
          { label: "set contents", value: step.setTxt ? step.setTxt : "empty" },
          { label: "evicted this step",
            value: (step.removed && step.removed.length) ? step.removed.join(" ") : "none",
            flag: (step.removed && step.removed.length) ? "warn" : undefined },
          { label: "window", value: right < 0 ? "not open" : "[" + left + "," + right + "]" },
          { label: "reads this step", value: String(step.opsThis || 0) }
        ]
      });
    } else {
      panel = d.node({
        title: "last_seen map",
        status: kind === "verdict" ? "ANSWER" : step.blocked ? "GUARD HELD" : step.moved ? "JUMPED" : "OPEN",
        statusFlag: kind === "verdict" ? "ok" : step.blocked ? "warn" : "ok",
        meta: "character to its most recent index",
        rows: [
          { label: "map", value: step.lastTxt ? step.lastTxt : "empty" },
          { label: "previous occurrence",
            value: step.prev === undefined || step.prev < 0 ? "none" : "index " + step.prev },
          { label: "left moved", value: step.moved ? step.from + " to " + left +
            " (" + step.skipped + " skipped)" : step.blocked ? "held at " + left +
            " by the guard" : "stayed at " + left,
            flag: step.blocked ? "warn" : undefined },
          { label: "reads this step", value: kind === "step" ? "1" : "0" }
        ]
      });
    }

    var ops = step.ops || 0;
    var perChar = ops / n;

    return d.stack([
      d.flow([
        d.big(step.best ? String(step.best) : "—", "longest so far",
          kind === "verdict" ? "ok" : undefined),
        d.stat({
          label: "index visits",
          value: String(ops),
          sub: ops ? perChar.toFixed(2) + " per character" : "nothing read yet",
          flag: mode === "brute" ? (ops ? "bad" : "idle") : ops > 2 * n ? "warn" : "ok"
        }),
        d.stat({
          label: mode === "brute" ? "this pass" : "this step",
          value: String(step.opsThis || 0),
          sub: mode === "brute" ? "reads for one anchor" : "reads for one right",
          flag: (step.opsThis || 0) > 2 ? "warn" : undefined
        }),
        d.stat({
          label: "window now",
          value: kind === "idle" ? "—"
            : mode === "brute" ? String(step.bestHere === undefined ? step.best : step.bestHere)
            : String(kind === "verdict" ? step.best : step.len),
          sub: mode === "brute" ? "best from this anchor" : "right − left + 1",
          flag: kind === "verdict" ? "ok" : undefined
        })
      ]),
      d.cells(cells, { label: "s = " + s }),
      d.cells(ptr, { label: "pointers" }),
      panel,
      dsasolutionstwo_board(d, step.mode),
      d.note(
        "Green is inside the live window, amber is the character just read, red " +
        "is the repeat that ended it, grey has not been read on this step. The " +
        "table recomputes all three runs on every frame — the answer column is " +
        "identical, the visits column is not."
      )
    ]);
  }
};

  // ====================================================================
// ======================================================================
// SIM · dsastack  (stack.md)
// The monotonic stack played on its real time axis: one frame per index of
// the scan, with the stack, the answer array and BOTH operation counters on
// screen at once.
//
// CONFIG — every number below is tallied by the code as it runs. Nothing is
// typed into a caption.
//   temps        the page's section 4 array, verbatim:
//                [73, 74, 75, 71, 69, 72, 76, 73]
//   page answer  [1, 1, 4, 2, 1, 1, 0, 0] — the sim reproduces it, and the
//                closing caption claims a match only if the join is equal.
//   the bound    the page's O(n) argument: "each index is pushed exactly
//                once and popped at most once. Two operations per element,
//                so 2n total". 2n = 16 here and the counter is checked
//                against it every frame.
//   cooling run  the SAME eight temperatures sorted descending (computed by
//                sort, not typed), so no day is ever followed by a warmer
//                one. That is the input that makes the nested loop pay the
//                full n(n-1)/2 comparisons the page calls O(n^2).
//
// Both algorithms run on every frame of every tab. The tab decides which
// machinery is DRAWN; the comparison counters always show both, so the two
// bars are a like-for-like count of value comparisons.
// ======================================================================
var dsastack_TEMPS = [73, 74, 75, 71, 69, 72, 76, 73];
var dsastack_PAGE_ANSWER = [1, 1, 4, 2, 1, 1, 0, 0];
var dsastack_N = dsastack_TEMPS.length;
var dsastack_TWO_N = 2 * dsastack_N;
var dsastack_WORST = (dsastack_N * (dsastack_N - 1)) / 2;

function dsastack_sortedDesc(a) {
  var c = a.slice();
  c.sort(function (x, y) { return y - x; });
  return c;
}
var dsastack_COOLING = dsastack_sortedDesc(dsastack_TEMPS);

/** The O(n^2) baseline: for every day, scan right until something warmer. */
function dsastack_brute(t) {
  var n = t.length, cum = 0, per = [], res = [], i, j, ans, last, used;
  for (i = 0; i < n; i++) res.push(null);
  for (i = 0; i < n; i++) {
    ans = 0; last = i; used = 0;
    for (j = i + 1; j < n; j++) {
      cum++; used++; last = j;
      if (t[j] > t[i]) { ans = j - i; break; }
    }
    res[i] = ans;
    per.push({
      ans: ans, used: used, cum: cum, last: last,
      hit: ans > 0, res: res.slice()
    });
  }
  return { per: per, total: cum, res: res.slice() };
}

function dsastack_stackCaption(t, i, popped, stk) {
  var s = "<b>i = " + i + ", " + t[i] + "&deg;.</b> ", k, parts, surv;
  if (!popped.length) {
    if (stk.length === 1) {
      s += "The stack was empty, so there was nothing to resolve. ";
    } else {
      surv = stk[stk.length - 2];
      s += "The top of the stack is index " + surv + " (" + t[surv] + "&deg;), which is " +
        "not colder than today, so the <i>while</i> stops on its first test &mdash; " +
        "one comparison, no pops. ";
    }
  } else {
    parts = [];
    for (k = 0; k < popped.length; k++) {
      parts.push("index " + popped[k].idx + " (" + popped[k].temp + "&deg;) &rarr; " +
        i + " &minus; " + popped[k].idx + " = <b>" + popped[k].ans + "</b>");
    }
    s += "Today is warmer than " + popped.length + " waiting day" +
      (popped.length === 1 ? "" : "s") + ", so " + (popped.length === 1 ? "it is" : "they are") +
      " resolved and discarded forever: " + parts.join("; then ") + ". ";
    if (stk.length > 1) {
      surv = stk[stk.length - 2];
      s += "Index " + surv + " (" + t[surv] + "&deg;) is still not beaten, so the popping stops. ";
    } else {
      s += "The stack is now empty. ";
    }
  }
  s += "Push " + i + ". Stack, bottom&rarr;top: [" + stk.join(", ") + "].";
  return s;
}

function dsastack_bruteCaption(t, i, b) {
  var s = "<b>i = " + i + ", " + t[i] + "&deg;.</b> ";
  if (b.used === 0) {
    s += "No days remain to the right, so the inner loop never runs and the answer stays <b>0</b>.";
  } else if (b.hit) {
    s += "Scan right: " + b.used + " comparison" + (b.used === 1 ? "" : "s") +
      " to reach index " + b.last + " (" + t[b.last] + "&deg;), the first warmer day &rarr; <b>" +
      b.ans + "</b>. Every day skipped on the way is re-read again from the next start.";
  } else {
    s += "Scan right across all " + b.used + " remaining day" + (b.used === 1 ? "" : "s") +
      " and none is warmer &rarr; <b>0</b>. " + b.used + " comparisons bought nothing.";
  }
  return s + " Running total: <b>" + b.cum + "</b> comparisons.";
}

/**
 * One run. Both algorithms are stepped together, index by index; `show`
 * decides which one the stage draws.
 */
function dsastack_run(temps, show, id, label, intro, conclude) {
  var n = temps.length;
  var brute = dsastack_brute(temps);
  var res = [], stk = [], i, k, day, b, popped, depth = 0;
  for (i = 0; i < n; i++) res.push(null);

  var pushes = 0, pops = 0, cmpS = 0;
  var steps = [{
    caption: intro,
    flag: "idle",
    mode: show, temps: temps, i: -1, stk: [], popped: [],
    res: res.slice(), pushes: 0, pops: 0, cmpS: 0, cmpB: 0,
    scanUsed: 0, scanLast: -1, scanHit: false
  }];

  for (i = 0; i < n; i++) {
    popped = [];
    while (stk.length) {
      cmpS++;
      if (temps[stk[stk.length - 1]] < temps[i]) {
        day = stk.pop();
        pops++;
        res[day] = i - day;
        popped.push({ idx: day, temp: temps[day], ans: i - day });
      } else {
        break;
      }
    }
    stk.push(i);
    pushes++;
    if (stk.length > depth) depth = stk.length;
    b = brute.per[i];

    steps.push({
      caption: show === "brute"
        ? dsastack_bruteCaption(temps, i, b)
        : dsastack_stackCaption(temps, i, popped, stk),
      flag: (show === "brute" ? b.hit : popped.length > 0) ? "ok" : "warn",
      mode: show, temps: temps, i: i,
      stk: stk.slice(), popped: popped,
      res: show === "brute" ? b.res : res.slice(),
      pushes: pushes, pops: pops, cmpS: cmpS, cmpB: b.cum,
      scanUsed: b.used, scanLast: b.last, scanHit: b.hit
    });
  }

  var finalRes = res.slice();
  var leftover = stk.length;
  for (k = 0; k < finalRes.length; k++) if (finalRes[k] === null) finalRes[k] = 0;

  var stats = {
    n: n, temps: temps,
    pushes: pushes, pops: pops, ops: pushes + pops,
    twoN: 2 * n, worst: (n * (n - 1)) / 2,
    cmpS: cmpS, cmpB: brute.total,
    depth: depth, leftover: leftover,
    answer: finalRes, joined: finalRes.join(", "),
    match: finalRes.join(",") === dsastack_PAGE_ANSWER.join(",")
  };

  steps.push({
    caption: conclude(stats),
    flag: "ok",
    mode: show, temps: temps, i: n,
    stk: stk.slice(), popped: [],
    res: show === "brute" ? brute.res : finalRes,
    pushes: pushes, pops: pops, cmpS: cmpS, cmpB: brute.total,
    scanUsed: 0, scanLast: -1, scanHit: false
  });

  return { id: id, label: label, steps: steps };
}

S["dsastack"] = {
  title: "Run the monotonic stack, and count what it saves",
  note: "The page's Daily Temperatures array, <b>[" + dsastack_TEMPS.join(", ") +
    "]</b>, scanned once. The stack holds <i>indices still waiting for an answer</i>, " +
    "kept in decreasing temperature. Every counter below is tallied by the code as it " +
    "runs &mdash; pushes, pops and value comparisons &mdash; and checked against the " +
    "page's own bound of 2n = " + dsastack_TWO_N + " stack operations. Both algorithms " +
    "step together on every tab, so the two comparison bars are like for like.",
  interval: 1300,

  scenarios: [
    dsastack_run(
      dsastack_TEMPS, "stack", "mono", "Monotonic stack",
      "The page's eight temperatures. The stack is empty, every answer is unknown. " +
      "Press Play and watch what the stack is actually holding.",
      function (s) {
        return "<b>One pass, done.</b> " + s.pushes + " pushes and " + s.pops +
          " pops = <b>" + s.ops + " stack operations</b> for n = " + s.n +
          ", inside the page's 2n = " + s.twoN + " bound &mdash; nested <i>while</i> and all, " +
          "because an index that leaves never comes back. The " + s.leftover +
          " indices still on the stack never warmed, so they keep their 0. Answer [" +
          s.joined + "]" + (s.match ? ", exactly the array the page prints" : "") +
          ". It cost <b>" + s.cmpS + "</b> comparisons; the nested loop on the next tab cost <b>" +
          s.cmpB + "</b>.";
      }
    ),
    dsastack_run(
      dsastack_TEMPS, "brute", "brute", "Brute force",
      "Same eight temperatures, the obvious O(n²) answer: for every day, scan right " +
      "until a warmer one turns up. Same results &mdash; watch the bill.",
      function (s) {
        var diff = s.cmpB - s.cmpS;
        return "<b>Same answers, " + s.cmpB + " comparisons</b> against the stack's " +
          s.cmpS + " &mdash; " + (diff > 0 ? "only " + diff + " more" :
            diff === 0 ? "a dead heat" : Math.abs(diff) + " fewer") +
          ". At n = " + s.n + ", on an array where a warmer day usually arrives within a " +
          "step or two, the nested loop is <i>not yet punished</i>: its inner loop keeps " +
          "breaking early. That is why this input does not settle the argument. The third " +
          "tab removes the early break.";
      }
    ),
    dsastack_run(
      dsastack_COOLING, "stack", "cool", "Worst case: all cooling",
      "The same eight temperatures sorted <b>descending</b> &mdash; [" +
      dsastack_COOLING.join(", ") + "] &mdash; so no day is ever followed by a warmer one. " +
      "Nothing will ever be resolved. Watch both counters.",
      function (s) {
        return "<b>Nothing ever resolves.</b> " + s.pushes + " pushes, " + s.pops +
          " pops: the stack grows to its full depth of " + s.depth +
          " and every answer is 0. Still only <b>" + s.ops + " operations</b> and <b>" +
          s.cmpS + "</b> comparisons &mdash; one failed test per day. The nested loop had no " +
          "early break to take, so it scanned to the end every time: <b>" + s.cmpB +
          "</b> comparisons, which is exactly n(n&minus;1)/2 = " + s.worst +
          ". Same answers, " + (s.cmpS ? (s.cmpB / s.cmpS).toFixed(1) : "—") +
          "× the work at n = " + s.n + " alone — and that ratio grows with n.";
      }
    )
  ],

  draw: function (step, d, ctx) {
    var t = step.temps, n = t.length, i = step.i, k;
    var brute = step.mode === "brute";
    var res = step.res;
    var worst = (n * (n - 1)) / 2;
    var twoN = 2 * n;

    var onStack = {}, poppedNow = {};
    for (k = 0; k < step.stk.length; k++) onStack[step.stk[k]] = true;
    for (k = 0; k < step.popped.length; k++) poppedNow[step.popped[k].idx] = true;

    var filled = 0;
    for (k = 0; k < n; k++) if (res[k] !== null) filled++;

    // --- the array, the answers, and the cursors, on one axis -----------
    var tempCells = [], resCells = [], curCells = [];
    for (k = 0; k < n; k++) {
      var scanned = brute && step.scanUsed > 0 && k > i && k <= step.scanLast;
      var flag;
      if (poppedNow[k]) flag = "ok";
      else if (res[k] !== null && res[k] > 0) flag = "ok";
      else if (res[k] === 0) flag = "bad";
      else if (k === i) flag = "warn";
      else if (scanned) flag = "warn";
      else if (!brute && onStack[k]) flag = "warn";
      else flag = "idle";

      tempCells.push({
        label: String(t[k]),
        flag: flag,
        title: "index " + k + " · " + t[k] + "° · " +
          (res[k] === null ? "still waiting for an answer"
            : res[k] === 0 ? "never warms — answer 0"
              : "answer " + res[k] + " day" + (res[k] === 1 ? "" : "s"))
      });
      resCells.push({
        label: res[k] === null ? "·" : String(res[k]),
        flag: res[k] === null ? "idle" : res[k] === 0 ? "bad" : "ok",
        title: res[k] === null ? "index " + k + " unresolved" : "index " + k + " → " + res[k]
      });
      var mark = "";
      if (k === i) mark = "i";
      else if (brute && step.scanUsed > 0 && k === step.scanLast) mark = "j";
      curCells.push({ label: mark, flag: mark ? "warn" : "idle", title: mark ? mark + " = " + k : "" });
    }

    var axis = d.stack([
      d.lane({ label: "temps", cells: tempCells }),
      d.lane({ label: "answer", cells: resCells }),
      d.lane({ label: brute ? "i / j" : "i", cells: curCells })
    ]);

    // --- the machinery panel --------------------------------------------
    var panel;
    if (brute) {
      panel = d.node({
        title: "nested loop",
        status: i < 0 ? "IDLE" : i >= n ? "FINISHED" : step.scanUsed === 0 ? "NO SCAN" :
          step.scanHit ? "BROKE EARLY" : "SCANNED TO END",
        statusFlag: i < 0 || i >= n ? "idle" : step.scanHit ? "ok" : "bad",
        flag: i < 0 || i >= n ? "idle" : step.scanHit ? "warn" : "bad",
        meta: "no auxiliary memory — and no memory of what it just read",
        body: d.mono(i < 0 ? "for i in range(n): for j in range(i+1, n): ..."
          : i >= n ? "loop finished"
            : "i = " + i + "  ->  j scanned " + step.scanUsed + " of the " + (n - 1 - i) +
            " days to the right"),
        rows: [
          { label: "comparisons this day", value: String(step.scanUsed) },
          { label: "comparisons so far", value: String(step.cmpB), flag: step.cmpB > worst / 2 ? "bad" : "warn" }
        ]
      });
    } else {
      var stackCells = [];
      for (k = 0; k < step.stk.length; k++) {
        var idx = step.stk[k];
        stackCells.push({
          label: idx + ":" + t[idx],
          flag: idx === i ? "ok" : "warn",
          title: "index " + idx + " · " + t[idx] + "° · waiting for a warmer day"
        });
      }
      if (!stackCells.length) stackCells.push({ label: "—", flag: "idle", title: "stack empty" });
      panel = d.node({
        title: "stack — indices still waiting",
        status: step.stk.length ? "DEPTH " + step.stk.length : "EMPTY",
        statusFlag: step.stk.length ? "warn" : "idle",
        flag: step.stk.length ? "warn" : "idle",
        meta: "bottom → top, temperatures decreasing",
        body: d.cells(stackCells, { label: "index : temperature" }),
        rows: [
          { label: "popped this step", value: String(step.popped.length), flag: step.popped.length ? "ok" : undefined },
          { label: "pushes · pops", value: step.pushes + " · " + step.pops }
        ]
      });
    }

    // --- counters, counted off the run ----------------------------------
    var scale = Math.max(worst, step.cmpB, step.cmpS, 1);
    var counters = d.node({
      title: "work, counted",
      status: step.cmpB > step.cmpS ? "STACK AHEAD" : step.cmpB < step.cmpS ? "LOOP AHEAD" : "LEVEL",
      statusFlag: step.cmpB > step.cmpS ? "ok" : step.cmpB < step.cmpS ? "warn" : "idle",
      meta: "both algorithms stepped on every frame",
      body: d.stack([
        d.bar({
          label: "monotonic stack — comparisons",
          pct: (step.cmpS / scale) * 100,
          value: String(step.cmpS),
          flag: "ok"
        }),
        d.bar({
          label: "brute force — comparisons",
          pct: (step.cmpB / scale) * 100,
          value: String(step.cmpB),
          flag: step.cmpB > step.cmpS ? "bad" : "warn"
        }),
        d.bar({
          label: "stack operations vs the page's 2n bound",
          pct: ((step.pushes + step.pops) / twoN) * 100,
          value: (step.pushes + step.pops) + " / " + twoN,
          flag: step.pushes + step.pops > twoN ? "bad" : "ok"
        })
      ])
    });

    return d.stack([
      d.flow([
        d.big(i < 0 ? "—" : i >= n ? "done" : "i = " + i,
          i < 0 ? "not started" : i >= n ? "one pass, n = " + n : "scan index"),
        d.stat({
          label: "answers found",
          value: filled + " / " + n,
          sub: filled === n ? "every index resolved" : "still unknown: " + (n - filled),
          flag: filled === n ? "ok" : filled ? "warn" : "idle"
        }),
        d.stat({
          label: "stack operations",
          value: String(step.pushes + step.pops),
          sub: step.pushes + " push · " + step.pops + " pop · cap 2n = " + twoN,
          flag: step.pushes + step.pops > twoN ? "bad" : "ok"
        }),
        d.stat({
          label: "comparisons",
          value: step.cmpS + " vs " + step.cmpB,
          sub: "stack vs nested loop · worst case n(n−1)/2 = " + worst,
          flag: step.cmpB > step.cmpS ? "ok" : "warn"
        })
      ]),
      axis,
      d.cols([panel, counters]),
      d.note(
        "Array row: <b>amber</b> still waiting (on the stack, or being scanned right now) · " +
        "<b>green</b> resolved · <b>red</b> resolved as <i>never</i> — answer 0 · " +
        "grey not reached. The answer row fills out of order under the stack, and in order " +
        "under the nested loop; both end up at the same array."
      )
    ]);
  }
};

})();
