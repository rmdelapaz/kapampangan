#!/usr/bin/env python3
"""Wrap hand-authored lesson bodies in identical chrome and sanity-check them.

Bodies live in lessons/lesson_NN.html as bare fragments (sections only). This script
adds the head, hero, footer nav and script tags, then reports per lesson:
  exercises  — count of (Answer: X) markers
  inputs     — count of list items that actually carry BOTH ___ and (Answer: X)
Those two numbers MUST match. learn.js only upgrades an <li> to a checkable input when
it has both, so a mismatch means a raw "(Answer: …)" will leak onto the live page.
"""
import re, sys, json, pathlib

ROOT = pathlib.Path(__file__).parent
SRC = ROOT / "lessons"
VOCAB = json.loads(
    re.search(r"window\.KAPAMPANGAN_VOCAB = (.*);\s*$",
              (ROOT / "vocab-data.js").read_text(), re.S).group(1))
TITLES = VOCAB["titles"]

HEAD = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title} - Kapampangan A1-A2</title>
    <meta name="description" content="{desc}">
    <link rel="stylesheet" href="/styles/main.css">
    <link rel="stylesheet" href="/styles/shared.css">
    <link rel="stylesheet" href="/styles/learn.css">
    <link rel="icon" href="/favicon.png" type="image/png">
{mermaid}    <style>
        body {{ font-family: Arial, sans-serif; max-width: 1200px; margin: 0 auto; padding: 20px; line-height: 1.6; }}
        .hero {{ background: linear-gradient(135deg, #b45309, #dc2626, #7c3aed); color: white; padding: 40px; border-radius: 15px; text-align: center; margin-bottom: 30px; }}
        .hero h1 {{ background: none !important; color: #fff !important; padding: 0; }}
        .section {{ margin: 30px 0; padding: 20px; border-left: 4px solid #b45309; background: #f9f9f9; }}
        .example-box {{ background: #e8f5e8; padding: 15px; border-radius: 8px; margin: 15px 0; }}
        .practice-box {{ background: #fff3cd; padding: 15px; border-radius: 8px; margin: 15px 0; border: 2px solid #ffc107; }}
        .cultural-note {{ background: #e1f5fe; padding: 15px; border-left: 4px solid #2196f3; margin: 15px 0; }}
        .pos-card {{ background: white; padding: 20px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); border-left: 4px solid #b45309; margin: 15px 0; }}
        .g-table {{ width: 100%; border-collapse: collapse; margin: 15px 0; }}
        .g-table th, .g-table td {{ border: 1px solid #ddd; padding: 10px; text-align: left; }}
        .g-table th {{ background: #b45309; color: white; }}
        .toc {{ background: #fff; border: 1px solid #ddd; border-radius: 8px; padding: 15px 20px; margin: 20px 0; }}
        .toc h2 {{ background: none !important; color: inherit !important; padding: 0; margin: 0 0 8px; font-size: 1.1rem; }}
        .toc ol {{ margin: 0 0 0 1.2rem; }}
        .toc li {{ padding: 2px 0; }}
        .faq {{ background: #f3e8ff; border-left: 4px solid #7c3aed; padding: 15px; margin: 15px 0; border-radius: 8px; }}
        .faq h3 {{ background: none !important; color: inherit !important; padding: 0; }}
        .mindset h3 {{ background: none !important; color: inherit !important; padding: 0; }}
        .mindset {{ background: #ecfdf5; border-left: 4px solid #10b981; padding: 15px; margin: 15px 0; border-radius: 8px; }}
        [data-theme="dark"] .section {{ background: #1f2937; }}
        [data-theme="dark"] .pos-card,
        [data-theme="dark"] .toc {{ background: #111827; border-color: #374151; }}
        [data-theme="dark"] .example-box {{ background: #14532d; }}
        [data-theme="dark"] .practice-box {{ background: #422006; }}
        [data-theme="dark"] .cultural-note {{ background: #0c4a6e; }}
        [data-theme="dark"] .faq {{ background: #3b0764; }}
        [data-theme="dark"] .mindset {{ background: #064e3b; }}
        [data-theme="dark"] .g-table td {{ border-color: #374151; }}
    </style>
</head>
<body>
    <div class="hero">
        <h1>{heading}</h1>
        <p>{subtitle}</p>
    </div>
"""

MERMAID = """    <script type="module">
      import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';
      mermaid.initialize({ startOnLoad: true });
    </script>
"""

FOOT = """
<!-- BEGIN footer-nav (managed by build_lessons.py) -->
<nav class="lesson-nav" aria-label="Lesson Navigation">
    {prev}
    <a href="index.html" class="home-link">&#127968; Course Home</a>
    {next}
</nav>

<footer class="site-footer">
    <p>&copy; 2026 Ray de la Paz. Kapampangan: A Complete A1-A2 Course. All rights reserved.</p>
    <div class="footer-links">
        <a href="https://rays-home.netlify.app/">Ray's House of Fun</a>
        <a href="https://rays-home.netlify.app/contact">Contact</a>
        <a href="#" onclick="window.print(); return false;">Print Page</a>
    </div>
</footer>
<!-- END footer-nav -->

    <script src="/scripts/nav.js"></script>
<script src="/audio.js"></script>
<script src="/vocab-data.js"></script>
<script src="/lesson-content.js"></script>
<script src="/learn.js"></script>
</body>
</html>
"""

def build():
    rows, problems = [], []
    nums = sorted(int(p.stem.split("_")[1]) for p in SRC.glob("lesson_*.html"))
    for n in nums:
        raw = (SRC / f"lesson_{n:02d}.html").read_text()
        meta = {}
        m = re.match(r"<!--META\s+(\{.*?\})\s*-->\s*", raw, re.S)
        if m:
            meta = json.loads(m.group(1)); raw = raw[m.end():]
        title = TITLES[str(n)]
        heading = meta.get("heading", title)
        subtitle = meta.get("subtitle", "")
        desc = meta.get("desc", subtitle)

        answers = len(re.findall(r"\(Answer:", raw))
        # an <li> only becomes a checkable input if it has BOTH a blank and an answer
        inputs = sum(1 for li in re.findall(r"<li>.*?</li>", raw, re.S)
                     if "___" in li and "(Answer:" in li)
        mer = raw.count('class="mermaid"')
        if answers != inputs:
            problems.append(f"lesson {n}: {answers} (Answer:) markers but only {inputs} "
                            f"list items have BOTH ___ and (Answer:) — the extras will leak")
        for tag in ("<h2", "<h3"):
            pass
        prev = (f'<a href="kapampangan_lesson_{n-1}.html" class="prev-lesson">&larr; Previous: '
                f'{TITLES[str(n-1)]}</a>') if n > 1 else \
               '<a href="index.html" class="prev-lesson">&larr; Course Home</a>'
        nxt = (f'<a href="kapampangan_lesson_{n+1}.html" class="next-lesson">Next: '
               f'{TITLES[str(n+1)]} &rarr;</a>') if str(n+1) in TITLES else \
              '<a href="cando.html" class="next-lesson">Next: Can-Do Checklist &rarr;</a>'

        html = (HEAD.format(title=title, heading=heading, subtitle=subtitle, desc=desc,
                            mermaid=MERMAID if mer else "")
                + raw.rstrip() + "\n"
                + FOOT.format(prev=prev, next=nxt))
        (ROOT / f"kapampangan_lesson_{n}.html").write_text(html)
        rows.append((n, answers, inputs, mer, len(html)))

    print(f"{'#':>3} {'answers':>8} {'inputs':>7} {'mermaid':>8} {'bytes':>7}  title")
    for n, a, i, mm, b in rows:
        print(f"{n:>3} {a:>8} {i:>7} {mm:>8} {b:>7}  {TITLES[str(n)]}")
    print(f"\nbuilt {len(rows)} lessons")
    if problems:
        print("\nPROBLEMS:")
        for p in problems: print("  " + p)
        sys.exit(1)
    print("all exercise markup consistent")

if __name__ == "__main__":
    build()
