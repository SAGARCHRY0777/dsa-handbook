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
