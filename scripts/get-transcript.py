#!/usr/bin/env python3
"""Fetch a YouTube video's captions as clean text, for use as a study source.

    python scripts/get-transcript.py <url>
    npm run transcript -- <url>

The transcript is written to .transcripts/ which is gitignored -- it is a
working source for writing your own notes, not content to publish. Do not
commit it and do not paste it into a page: the words are the creator's, the
notes you write from them are yours.

Requires yt-dlp:  pip install yt-dlp
"""
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / ".transcripts"


def video_id(url: str) -> str:
    m = re.search(r"(?:v=|youtu\.be/|/shorts/|/embed/)([A-Za-z0-9_-]{11})", url)
    if not m:
        sys.exit(f"could not find an 11-character video id in: {url}")
    return m.group(1)


def vtt_to_text(vtt: str) -> str:
    """Strip WebVTT markup and collapse the rolling-caption duplication.

    Auto-generated captions repeat each line as the next one scrolls in, so a
    naive strip produces every sentence two or three times.
    """
    lines = []
    for raw in vtt.splitlines():
        line = raw.strip()
        if (not line
                or line.startswith(("WEBVTT", "Kind:", "Language:", "NOTE"))
                or "-->" in line
                or line.isdigit()):
            continue
        line = re.sub(r"<[^>]+>", "", line)          # <c> timing spans
        line = re.sub(r"\s+", " ", line).strip()
        if line and (not lines or lines[-1] != line):
            lines.append(line)

    # Drop a line that is wholly contained in the previous one -- the other
    # half of the rolling-caption artefact.
    deduped = []
    for line in lines:
        if deduped and line in deduped[-1]:
            continue
        deduped.append(line)

    text = " ".join(deduped)
    text = re.sub(r"\s+", " ", text).strip()
    # Soft-wrap so the file is readable and diffable.
    out, cur = [], ""
    for word in text.split(" "):
        if len(cur) + len(word) + 1 > 88:
            out.append(cur)
            cur = word
        else:
            cur = f"{cur} {word}".strip()
    if cur:
        out.append(cur)
    return "\n".join(out)


def main() -> None:
    if len(sys.argv) < 2:
        sys.exit("usage: npm run transcript -- <youtube-url>")

    url = sys.argv[1]
    vid = video_id(url)
    OUT_DIR.mkdir(exist_ok=True)
    stem = OUT_DIR / vid

    print(f"fetching captions for {vid} …")
    proc = subprocess.run(
        [sys.executable, "-m", "yt_dlp",
         "--skip-download",
         "--write-auto-sub", "--write-sub",
         "--sub-lang", "en.*,en",
         "--sub-format", "vtt",
         "--no-warnings",
         "-o", str(stem),
         url],
        capture_output=True, text=True,
    )

    found = sorted(OUT_DIR.glob(f"{vid}*.vtt"))
    if not found:
        detail = (proc.stderr or proc.stdout).strip()[-800:]
        sys.exit(
            "no captions were produced.\n"
            "  - the video may have captions disabled\n"
            "  - or yt-dlp may need updating: pip install -U yt-dlp\n\n"
            f"yt-dlp said:\n{detail}"
        )

    vtt_path = found[0]
    text = vtt_to_text(vtt_path.read_text(encoding="utf8", errors="replace"))

    # Title, for the header -- best effort, never fatal.
    title = subprocess.run(
        [sys.executable, "-m", "yt_dlp", "--skip-download", "--print", "%(title)s",
         "--no-warnings", url],
        capture_output=True, text=True,
    ).stdout.strip() or "(title unavailable)"

    txt_path = OUT_DIR / f"{vid}.txt"
    txt_path.write_text(
        f"# {title}\n# {url}\n"
        f"# Auto-generated captions, fetched as a study source.\n"
        f"# Not for publication -- write your own notes from it.\n\n{text}\n",
        encoding="utf8",
    )
    for f in found:
        f.unlink()                                   # keep only the clean text

    words = len(text.split())
    print(f"\n  title: {title}")
    print(f"  saved: {txt_path.relative_to(ROOT)}  ({words:,} words)")
    print("\nnow tell Claude:  read .transcripts/%s.txt and write the note" % vid)


if __name__ == "__main__":
    main()
