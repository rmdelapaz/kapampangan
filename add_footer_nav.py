#!/usr/bin/env python3
"""
add_footer_nav.py
-----------------
Apply the footer-nav fix to the Kapampangan course in one pass:

  1. LESSON HTMLs - replace the existing static <div class="lesson-nav">
     block with a sentinel-wrapped <nav class="lesson-nav"> + <footer
     class="site-footer"> block. Idempotent via BEGIN/END sentinels.
     The lesson-specific custom <footer> content (per-lesson wrap-up
     message) is preserved.

  2. styles/main.css - append/refresh a sentinel-wrapped block adding the
     .lesson-nav .home-link "ghost" variant, the .lesson-nav > span:empty
     placeholder rule, base .site-footer + .footer-links styling
     (Kapampangan had none), and a small @media print rule that also
     hides .site-footer (the project's existing print block hides
     .site-nav / .lesson-nav / .theme-toggle / .nav-toggle but not the
     new .site-footer). Uses Kapampangan's --accent / --border /
     --text-muted tokens. Idempotent.

NOTE: Kapampangan has no external nav JS file (each lesson uses an inline
<script> for theme toggle, and the top .site-nav is hardcoded static HTML
on every page). There is no JS section in this script - only HTML + CSS.

Edge cases on #1:
  - First lesson (intro): prev side becomes <span></span>.
  - Last  lesson (mastery_celebration): next link is omitted.

Usage:
    python3 add_footer_nav.py                # dry run (default)
    python3 add_footer_nav.py --apply        # write changes (.bak backups)
    python3 add_footer_nav.py --apply --no-backup
    python3 add_footer_nav.py --dir .        # explicit project dir
"""
from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

# ---------------------------------------------------------------------------
# Lesson order (from index.html .lesson-grid; topic titles)
# ---------------------------------------------------------------------------
LESSONS: list[tuple[str, str]] = [
    ("kapampangan_intro.html",                  "Introduction to Kapampangan"),
    ("kapampangan_basics.html",                 "Kapampangan Basics"),
    ("kapampangan_conversations.html",          "Kapampangan Conversations"),
    ("kapampangan_grammar.html",                "Grammar Patterns & Structures"),
    ("kapampangan_expressions_vocabulary.html", "Expressions & Vocabulary"),
    ("kapampangan_mastery_celebration.html",    "Mastery & Cultural Celebration"),
]

# ===========================================================================
# 1. LESSON HTML - footer-nav block
# ===========================================================================

BEGIN_HTML = "<!-- BEGIN footer-nav (managed by add_footer_nav.py) -->"
END_HTML   = "<!-- END footer-nav -->"

# Match the existing static <div class="lesson-nav">...</div> block in each
# lesson. Non-greedy across newlines; the lesson-nav div has no nested divs.
LEGACY_LESSON_NAV_RE = re.compile(
    r'<div\s+class=["\']lesson-nav["\']\s*>.*?</div>',
    flags=re.DOTALL | re.IGNORECASE,
)

# Last-resort insertion anchor.
FALLBACK_BODY_RE = re.compile(r'\s*</body>', re.IGNORECASE)

# Sentinel-wrapped existing block (for idempotent refresh).
EXISTING_HTML_BLOCK_RE = re.compile(
    re.escape(BEGIN_HTML) + r".*?" + re.escape(END_HTML),
    flags=re.DOTALL,
)


def build_footer(prev_file, prev_title, next_file, next_title):
    if prev_file:
        prev_html = (
            f'    <a href="{prev_file}" class="prev-lesson">'
            f'&larr; Previous: {prev_title}</a>'
        )
    else:
        prev_html = '    <span></span>'

    if next_file:
        next_html = (
            f'\n    <a href="{next_file}" class="next-lesson">'
            f'Next: {next_title} &rarr;</a>'
        )
    else:
        next_html = ''

    return (
        f"{BEGIN_HTML}\n"
        f'<nav class="lesson-nav" aria-label="Lesson Navigation">\n'
        f"{prev_html}\n"
        f'    <a href="index.html" class="home-link">&#127968; Course Home</a>'
        f"{next_html}\n"
        f"</nav>\n"
        f"\n"
        f'<footer class="site-footer">\n'
        f"    <p>&copy; 2026 All rights reserved.</p>\n"
        f'    <div class="footer-links">\n'
        f'        <a href="https://rays-home.netlify.app/">Ray\'s House of Fun</a>\n'
        f'        <a href="https://rays-home.netlify.app/contact">Contact</a>\n'
        f'        <a href="#" onclick="window.print(); return false;">Print Page</a>\n'
        f"    </div>\n"
        f"</footer>\n"
        f"{END_HTML}"
    )


def inject_html(html, footer):
    """Insert/refresh the footer block on a lesson HTML.

    Returns (new_html, status) where status is one of:
      'refreshed' | 'replaced' | 'added' | 'unchanged' | 'skipped:no-anchor'
    """
    # 1. Refresh existing sentinel-wrapped block in place.
    m = EXISTING_HTML_BLOCK_RE.search(html)
    if m:
        new = html[:m.start()] + footer + html[m.end():]
        return new, ("refreshed" if new != html else "unchanged")

    # 2. Replace the legacy hand-coded <div class="lesson-nav">...</div>.
    m = LEGACY_LESSON_NAV_RE.search(html)
    if m:
        new = html[:m.start()] + footer + html[m.end():]
        return new, "replaced"

    # 3. Fallback: insert just before </body>.
    m = FALLBACK_BODY_RE.search(html)
    if m:
        new = html[:m.start()].rstrip() + "\n\n" + footer + "\n" + html[m.start():].lstrip("\n")
        return new, "added"

    return html, "skipped:no-anchor"


# ===========================================================================
# 2. styles/main.css - footer-nav rules (sentinel-wrapped block)
# Kapampangan has NO .site-footer styling, so the block defines the base
# .site-footer rules in addition to the home-link ghost variant etc. The
# small @media print rule covers .site-footer (the project's existing
# print block does not include it).
# ===========================================================================

BEGIN_CSS = "/* BEGIN footer-nav-styles (managed by add_footer_nav.py) */"
END_CSS   = "/* END footer-nav-styles */"

CSS_BLOCK = BEGIN_CSS + """
/* Static lesson footer (inserted by add_footer_nav.py into each lesson HTML) */
.site-footer {
    text-align: center;
    padding: 1.5rem 1rem;
    font-size: .85rem;
    color: var(--text-muted);
    border-top: 1px solid var(--border);
    margin-top: 2rem;
    max-width: 960px;
    margin-left: auto;
    margin-right: auto;
}
.site-footer a { color: var(--accent); text-decoration: none; }
.site-footer a:hover { text-decoration: underline; }
.site-footer p { margin: .35rem 0; }

.footer-links {
    display: flex;
    justify-content: center;
    gap: 1rem;
    flex-wrap: wrap;
    margin-top: .5rem;
}

/* Home-link: outlined "ghost" variant to distinguish from prev/next */
.lesson-nav .home-link {
    background: transparent;
    color: var(--accent);
    border: 2px solid var(--accent);
}
.lesson-nav .home-link:hover {
    background: var(--accent);
    color: #fff;
    border-color: var(--accent);
}

/* First lesson uses <span></span> as a prev placeholder; keep it inert */
.lesson-nav > span:empty { flex: 0 0 auto; }

@media print {
    .site-footer { display: none !important; }
}
""" + END_CSS

EXISTING_CSS_BLOCK_RE = re.compile(
    re.escape(BEGIN_CSS) + r".*?" + re.escape(END_CSS),
    flags=re.DOTALL,
)


def inject_css(css):
    """Insert/refresh the sentinel-wrapped CSS block."""
    m = EXISTING_CSS_BLOCK_RE.search(css)
    if m:
        new = css[:m.start()] + CSS_BLOCK + css[m.end():]
        return new, ("refreshed" if new != css else "unchanged")
    new = css.rstrip() + "\n\n" + CSS_BLOCK + "\n"
    return new, "added"


# ===========================================================================
# main
# ===========================================================================

def main() -> int:
    p = argparse.ArgumentParser(
        description="Apply the footer-nav fix to the Kapampangan course (HTML + CSS).",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    p.add_argument("--apply", action="store_true",
                   help="Write changes (default: dry run only).")
    p.add_argument("--no-backup", action="store_true",
                   help="When applying, skip writing .bak files.")
    p.add_argument("--dir", default=".",
                   help="Project directory (default: current working dir).")
    args = p.parse_args()

    root = Path(args.dir).resolve()
    if not root.is_dir():
        print(f"ERROR: not a directory: {root}", file=sys.stderr)
        return 2

    mode = "APPLY (writing changes)" if args.apply else "DRY RUN (no writes)"
    print(f"Project root : {root}")
    print(f"Mode         : {mode}")
    if args.apply and not args.no_backup:
        print("Backups      : yes (.bak alongside each modified file)")
    print()

    def maybe_write(path: Path, original: str, new: str) -> None:
        if not args.apply or new == original:
            return
        if not args.no_backup:
            bak = path.with_suffix(path.suffix + ".bak")
            bak.write_text(original, encoding="utf-8")
        path.write_text(new, encoding="utf-8")

    total_pending = 0

    # ---- 1. Lesson HTMLs ----
    print("== 1. Lesson HTML files ==")
    total = len(LESSONS)
    missing: list[str] = []
    pending = 0
    for i, (fname, _title) in enumerate(LESSONS):
        path = root / fname
        if not path.is_file():
            missing.append(fname)
            print(f"  [missing  ] {fname}")
            continue

        prev = LESSONS[i - 1] if i > 0 else (None, None)
        nxt  = LESSONS[i + 1] if i < total - 1 else (None, None)
        footer = build_footer(prev[0], prev[1], nxt[0], nxt[1])

        original = path.read_text(encoding="utf-8")
        new_html, status = inject_html(original, footer)

        if status == "unchanged":
            print(f"  [ok       ] {fname}")
            continue
        print(f"  [{status:9}] {fname}")
        if new_html != original:
            pending += 1
            maybe_write(path, original, new_html)

    if missing:
        print(f"  Missing files: {len(missing)}  (check LESSONS table)")
    print(f"  HTML changes : {pending} / {total}")
    total_pending += pending
    print()

    # ---- 2. styles/main.css ----
    print("== 2. styles/main.css ==")
    css_path = root / "styles" / "main.css"
    if not css_path.is_file():
        print(f"  [missing  ] {css_path}")
    else:
        original = css_path.read_text(encoding="utf-8")
        new_css, status = inject_css(original)
        if status == "unchanged":
            print(f"  [ok       ] {css_path.name}")
        else:
            print(f"  [{status:9}] {css_path.name}")
            if new_css != original:
                total_pending += 1
                maybe_write(css_path, original, new_css)
    print()

    print(f"Total files needing changes: {total_pending}")
    if not args.apply and total_pending:
        print("Re-run with --apply to write changes.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
