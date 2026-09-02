/**
 * Scaffold a new note page: npm run note -- "Some title" [module]
 *
 * Exists so taking notes never requires remembering frontmatter syntax or
 * picking an order number by hand -- the two things that make people stop
 * writing notes into a static site and go back to a scratch file.
 */

import { readdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const CONTENT = join(ROOT, "content");

const KNOWN_MODULES = [
  "start", "method", "recursion", "linear", "structures",
  "graphs", "search", "dp", "solutions", "reference",
];

const [, , rawTitle, rawModule = "recursion"] = process.argv;

if (!rawTitle) {
  console.error(`usage: npm run note -- "Title of the note" [module]

modules: ${KNOWN_MODULES.join(", ")}
example: npm run note -- "Recursion subsets and subsequences" recursion`);
  process.exit(1);
}

if (!KNOWN_MODULES.includes(rawModule)) {
  console.error(`unknown module "${rawModule}". one of: ${KNOWN_MODULES.join(", ")}`);
  process.exit(1);
}

const slug = rawTitle
  .toLowerCase()
  .replace(/[^\w\s-]/g, "")
  .trim()
  .replace(/\s+/g, "-")
  .slice(0, 60);

const path = join(CONTENT, `${slug}.md`);
if (existsSync(path)) {
  console.error(`${slug}.md already exists -- edit it instead of recreating it`);
  process.exit(1);
}

// Next order number within the module, so the sidebar sorts correctly without
// the author having to look up what is already there.
let maxOrder = 0;
for (const file of readdirSync(CONTENT).filter((f) => f.endsWith(".md"))) {
  const raw = readFileSync(join(CONTENT, file), "utf8");
  const mod = /^module:\s*(\S+)/m.exec(raw)?.[1];
  const ord = Number(/^order:\s*(\d+)/m.exec(raw)?.[1] ?? 0);
  if (mod === rawModule && ord > maxOrder) maxOrder = ord;
}
const order = maxOrder + 1;

const template = `---
title: ${rawTitle}
slug: ${slug}
module: ${rawModule}
order: ${order}
status: draft
level: my notes
summary: One line describing what this note covers.
---

# ${rawTitle}

> **My notes.** Written while working through the source, not polished prose.

**Source:** <paste the video / article link here>

---

## The problem

<what is being solved, in your own words>

## The idea

<the one insight -- if you cannot write this in two sentences, you have not
got it yet, and that is useful information>

## Diagram

\`\`\`
<draw the tree / the reduction / the state, in ASCII.
 draw it for n=2 or n=3, never n=6>
\`\`\`

## Code

\`\`\`python
# your version, typed from understanding rather than copied
\`\`\`

## Why it works

<the base case, and the one induction step -- or the choices and where the
tree bottoms out>

## What tripped me up

<the actual value of these notes lives here. write the thing you got wrong
the first time, because that is what you will get wrong again>

## Related

- [recursion intro](recursion-intro.html)

---

## Stop condition

I have got this when I can:

1. <what you should be able to do without looking>
2.
3.
`;

writeFileSync(path, template);
console.log(`created content/${slug}.md   (module: ${rawModule}, order: ${order})`);
console.log(`  1. write your notes in it`);
console.log(`  2. flip  status: draft  ->  status: live  when it is ready`);
console.log(`  3. npm run publish -- "note: ${rawTitle}"`);
