/* learn.js — learning-experience layer for the Kapampangan course.

   A single, dependency-free progressive-enhancement script loaded on every
   page. It never edits the lesson bodies: all new UI is injected at runtime,
   so lessons stay hand-authored and this file is the single source of the
   learning features.

   Features
     • Reading-progress bar (scroll indicator)
     • End-of-lesson "Words You Learned" review, from vocab-data.js, with
       audio (via the existing audio.js, using data-speak), a per-word
       "I know this" toggle, and a flashcard practice mode.
     • Self-check quiz auto-generated from the lesson's vocabulary.
     • Autosaving learning journal (per lesson) + one-click Markdown export.
     • "Mark lesson complete" + course progress, surfaced on the home page.

   All state is per-device in localStorage; nothing leaves the browser.
   Every storage access is wrapped so a private/blocked browser degrades
   gracefully rather than throwing. */
(function () {
    'use strict';

    /* ---------- storage helpers (never throw) ---------- */
    var LS = {
        get: function (k, fallback) {
            try { var v = localStorage.getItem(k); return v == null ? fallback : v; }
            catch (_) { return fallback; }
        },
        set: function (k, v) { try { localStorage.setItem(k, v); } catch (_) {} },
        getJSON: function (k, fallback) {
            try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : fallback; }
            catch (_) { return fallback; }
        },
        setJSON: function (k, v) { this.set(k, JSON.stringify(v)); }
    };

    var K_PROGRESS = 'kapampangan-adv-progress';   // { "1": {completed, visited, ts}, ... }
    var K_KNOWN    = 'kapampangan-adv-known';      // legacy flat map { "salamat": ts, ... } — migrated into SRS
    var K_SRS      = 'kapampangan-adv-srs';        // { "salamat": {box,due,reps}, ... }
    var K_JOURNAL  = 'kapampangan-adv-journal:';   // + page slug

    // Derive the lesson count from the vocab titles map so the dashboard stays
    // correct as lessons are added (this was hardcoded to 9 while the course
    // grew to 16, so progress read "x/9" and could exceed 100%).
    var TOTAL_LESSONS = (function () {
        try {
            var t = (window.KAPAMPANGAN_ADV_VOCAB && window.KAPAMPANGAN_ADV_VOCAB.titles) || {};
            var n = Object.keys(t).filter(function (k) { return /^\d+$/.test(k); }).length;
            return n || 16;
        } catch (_) { return 16; }
    })();

    /* ---------- page identity ---------- */
    var page = (location.pathname.split('/').pop() || 'index').replace('.html', '') || 'index';
    var lessonMatch = page.match(/kapampangan_lesson_(\d+)/);
    var lessonNum = lessonMatch ? lessonMatch[1] : null;
    var isHome = (page === 'index' || page === '');

    var VOCAB = window.KAPAMPANGAN_ADV_VOCAB || {};
    var TITLES = (VOCAB.titles) || {};
    var LESSON_INFO = window.KAPAMPANGAN_ADV_LESSON_INFO || {};

    function esc(s) {
        return String(s).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }
    /* Vocabulary illustrations (manga-style, generated set). Bump VOCAB_IMG_VER
       when an image file is replaced so browsers pick up the new bytes. */
    var VOCAB_IMG_VER = '1';
    function vocabImg(w, alt) {
        if (!w || !w.img) return '';
        var src = '/images/vocab/' + encodeURIComponent(w.img) + '.webp?v=' + VOCAB_IMG_VER;
        return '<img class="lx-word-img" src="' + src + '" alt="' + esc(alt || w.en || w.kp) +
               '" loading="lazy" decoding="async" width="512" height="512">';
    }
    function fmt(ts) { try { return new Date(ts).toLocaleString(); } catch (_) { return ''; } }
    function debounce(fn, ms) { var t; return function () { var a = arguments, c = this; clearTimeout(t); t = setTimeout(function () { fn.apply(c, a); }, ms); }; }
    function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }

    /* ---------- spaced-repetition store (Leitner boxes) ----------
       kapampangan-adv-srs: { "<kp>": { box: 1..5, due: <ts>, reps: <n> } }
       A word enters the deck at box 1 (due now). In a review session, "Got it"
       promotes it a box and pushes the due date further out; "Missed" resets it
       to box 1 due soon — so hard words come back often and easy ones fade to
       occasional. The older flat kapampangan-adv-known map is migrated in on first read. */
    var DAY = 86400000;
    // interval before a word is due again, indexed by box (1..5); box 0 unused.
    var BOX_INTERVAL = [0, DAY, 3 * DAY, 7 * DAY, 16 * DAY, 40 * DAY];
    var MAX_BOX = 5;

    function srsMap() {
        var m = LS.getJSON(K_SRS, null);
        if (m) return m;
        m = {};
        var legacy = LS.getJSON(K_KNOWN, null);   // one-time migration
        if (legacy && typeof legacy === 'object') {
            for (var k in legacy) if (legacy.hasOwnProperty(k)) m[k] = { box: 2, due: Date.now(), reps: 0 };
            LS.setJSON(K_SRS, m);
        }
        return m;
    }
    function isTracked(kp) { return !!srsMap()[kp]; }
    function trackWord(kp, on) {
        var m = srsMap();
        if (on) { if (!m[kp]) m[kp] = { box: 1, due: Date.now(), reps: 0 }; }
        else delete m[kp];
        LS.setJSON(K_SRS, m);
    }
    function reviewWord(kp, good) {
        var m = srsMap();
        var e = m[kp] || { box: 1, due: Date.now(), reps: 0 };
        e.box = good ? Math.min(MAX_BOX, e.box + 1) : 1;
        e.reps = (e.reps || 0) + 1;
        e.due = Date.now() + BOX_INTERVAL[e.box];
        m[kp] = e;
        LS.setJSON(K_SRS, m);
    }
    function trackedCount() { return Object.keys(srsMap()).length; }
    function dueFrom(words) {
        var m = srsMap(), now = Date.now(), out = [];
        words.forEach(function (w) { var e = m[w.kp]; if (e && e.due <= now) out.push(w); });
        return out;
    }
    function trackedFrom(words) {
        var m = srsMap(), seen = {}, out = [];
        words.forEach(function (w) { if (m[w.kp] && !seen[w.kp]) { seen[w.kp] = 1; out.push(w); } });
        return out;
    }
    function flatVocab() {
        var all = [], seen = {};
        for (var ln in VOCAB) {
            if (ln === 'titles' || !Array.isArray(VOCAB[ln])) continue;
            VOCAB[ln].forEach(function (w) { if (!seen[w.kp]) { seen[w.kp] = 1; all.push(w); } });
        }
        return all;
    }

    /* ---------- progress store ---------- */
    function progress() { return LS.getJSON(K_PROGRESS, {}); }
    function markVisited(n) {
        if (!n) return;
        var p = progress();
        p[n] = p[n] || {};
        p[n].visited = true;
        p[n].ts = Date.now();
        LS.setJSON(K_PROGRESS, p);
    }
    function setCompleted(n, on) {
        var p = progress();
        p[n] = p[n] || {};
        p[n].completed = on;
        p[n].visited = true;
        p[n].ts = Date.now();
        LS.setJSON(K_PROGRESS, p);
    }
    function completedCount() {
        var p = progress(), c = 0;
        for (var k in p) if (p.hasOwnProperty(k) && p[k].completed) c++;
        return c;
    }

    /* ==========================================================
       Reading-progress bar
       ========================================================== */
    function initProgressBar() {
        var bar = document.createElement('div');
        bar.className = 'lx-progress-bar';
        document.body.appendChild(bar);
        function update() {
            var h = document.documentElement.scrollHeight - window.innerHeight;
            var pct = h > 0 ? Math.min((window.scrollY / h) * 100, 100) : 0;
            bar.style.width = pct + '%';
        }
        window.addEventListener('scroll', update, { passive: true });
        window.addEventListener('resize', update);
        update();
    }

    /* Where lesson sections should be inserted: before the prev/next nav. */
    function insertPoint() {
        return document.querySelector('.lesson-nav') || null;
    }
    function mount(el) {
        var at = insertPoint();
        if (at && at.parentNode) at.parentNode.insertBefore(el, at);
        else document.body.appendChild(el);
    }

    /* ==========================================================
       Lesson objectives (top of lesson) — "What you'll learn"
       ========================================================== */
    function initObjectives() {
        var info = LESSON_INFO[lessonNum];
        if (!info || !Array.isArray(info.objectives) || !info.objectives.length) return;

        var sec = document.createElement('section');
        sec.className = 'lx-card lx-objectives';
        sec.id = 'objectives';
        sec.innerHTML =
            '<h2>🎯 What You\'ll Learn</h2>' +
            '<p class="lx-sub">By the end of this lesson you\'ll be able to:</p>' +
            '<ul class="lx-check-list">' +
                info.objectives.map(function (o) { return '<li>' + esc(o) + '</li>'; }).join('') +
            '</ul>';

        // Place just below the lesson hero, above the first content section.
        var hero = document.querySelector('.hero');
        if (hero && hero.parentNode) hero.parentNode.insertBefore(sec, hero.nextSibling);
        else document.body.insertBefore(sec, document.body.firstChild);
    }

    /* ==========================================================
       Lesson summary (end of lesson) — key takeaways
       ========================================================== */
    function initSummary() {
        var info = LESSON_INFO[lessonNum];
        if (!info || !Array.isArray(info.summary) || !info.summary.length) return;

        var sec = document.createElement('section');
        sec.className = 'lx-card lx-summary';
        sec.id = 'lesson-summary';
        sec.innerHTML =
            '<h2>📝 Lesson Summary</h2>' +
            '<p class="lx-sub">The key things to take away from this lesson:</p>' +
            '<ul class="lx-sum-list">' +
                info.summary.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') +
            '</ul>';
        mount(sec);   // inserted before .lesson-nav; called before the vocab review so it sits above it
    }

    /* ==========================================================
       Words You Learned  (+ flashcard practice)
       ========================================================== */
    function initVocabReview() {
        var list = VOCAB[lessonNum];
        if (!Array.isArray(list) || !list.length) return;

        var sec = document.createElement('section');
        sec.className = 'lx-card lx-vocab';
        sec.id = 'words-learned';

        function cardHTML(w) {
            var on = isTracked(w.kp);
            return '<div class="lx-word' + (on ? ' lx-known' : '') + (w.img ? ' lx-word-has-img' : '') + '" data-kp="' + esc(w.kp) + '">' +
                     vocabImg(w) +
                     '<div class="lx-word-tl"><span data-speak="' + esc(w.kp) + '">' + esc(w.kp) + '</span></div>' +
                     (w.pron ? '<div class="lx-word-pron">' + esc(w.pron) + '</div>' : '') +
                     '<div class="lx-word-en">' + esc(w.en) + '</div>' +
                     '<button type="button" class="lx-know-btn">' + (on ? '✓ In review deck' : '+ Add to review') + '</button>' +
                   '</div>';
        }

        /* Grouped display when the words carry a `cat`; otherwise one flat grid.
           The array is authored already ordered by category and alphabetised
           within each, so a single pass preserves that structure. */
        var vocabHTML;
        if (list.some(function (w) { return w.cat; })) {
            var groups = [], cur = null;
            list.forEach(function (w) {
                if (!cur || cur.cat !== (w.cat || '')) { cur = { cat: w.cat || '', items: [] }; groups.push(cur); }
                cur.items.push(w);
            });
            vocabHTML = groups.map(function (g) {
                return '<div class="lx-vocab-cat">' +
                        (g.cat ? '<h3 class="lx-cat-title">' + esc(g.cat) + '</h3>' : '') +
                        '<div class="lx-vocab-grid">' + g.items.map(cardHTML).join('') + '</div>' +
                    '</div>';
            }).join('');
        } else {
            vocabHTML = '<div class="lx-vocab-grid">' + list.map(cardHTML).join('') + '</div>';
        }

        sec.innerHTML =
            '<h2>📒 Words You Learned</h2>' +
            '<p class="lx-sub">' + list.length + ' key words &amp; phrases from this lesson. Tap 🔊 to hear each one, ' +
                'and add any to your <strong>spaced-repetition review deck</strong> — they\'ll resurface for practice ' +
                'at growing intervals so they actually stick.</p>' +
            vocabHTML +
            '<div class="lx-toolbar">' +
                '<button type="button" class="lx-btn lx-btn-primary lx-flash-start">🃏 Practice all with flashcards</button>' +
                '<button type="button" class="lx-btn lx-review-due" hidden>🔁 Review due (<span class="lx-due-n">0</span>)</button>' +
                '<button type="button" class="lx-btn lx-mark-all">+ Add all to review</button>' +
                '<span class="lx-count"></span>' +
            '</div>';
        mount(sec);

        var dueBtn = sec.querySelector('.lx-review-due');
        var markAllBtn = sec.querySelector('.lx-mark-all');

        function refresh() {
            var k = 0;
            list.forEach(function (w) { if (isTracked(w.kp)) k++; });
            sec.querySelector('.lx-count').textContent = k + ' / ' + list.length + ' in your review deck';
            markAllBtn.textContent = (k === list.length) ? '✕ Remove all from review' : '+ Add all to review';
            var due = dueFrom(list);
            if (due.length) { dueBtn.hidden = false; sec.querySelector('.lx-due-n').textContent = due.length; }
            else dueBtn.hidden = true;
        }
        refresh();

        sec.addEventListener('click', function (e) {
            var btn = e.target.closest('.lx-know-btn');
            if (!btn) return;
            var card = btn.closest('.lx-word');
            var kp = card.getAttribute('data-kp');
            var on = !isTracked(kp);
            trackWord(kp, on);
            card.classList.toggle('lx-known', on);
            btn.textContent = on ? '✓ In review deck' : '+ Add to review';
            refresh();
        });

        markAllBtn.addEventListener('click', function () {
            var allOn = list.every(function (w) { return isTracked(w.kp); });
            list.forEach(function (w) { trackWord(w.kp, !allOn); });
            Array.prototype.forEach.call(sec.querySelectorAll('.lx-word'), function (card) {
                var on = isTracked(card.getAttribute('data-kp'));
                card.classList.toggle('lx-known', on);
                card.querySelector('.lx-know-btn').textContent = on ? '✓ In review deck' : '+ Add to review';
            });
            refresh();
        });

        sec.querySelector('.lx-flash-start').addEventListener('click', function () {
            openFlashcards(shuffle(list), 'Lesson ' + lessonNum + ' — flashcards', { onClose: refresh });
        });
        dueBtn.addEventListener('click', function () {
            openFlashcards(shuffle(dueFrom(list)), 'Lesson ' + lessonNum + ' — review', { review: true, onClose: refresh });
        });
    }

    /* ---------- flashcard modal ----------
       Two modes, chosen by opts.review:
         browse  — free flip + prev/next (revision, no scheduling)
         review  — spaced-repetition session: flip, then rate "Missed"/"Got it",
                   which updates each word's Leitner box and advances the deck.
       opts.onClose() (optional) runs after the modal closes, so callers can
       refresh due counts. */
    function openFlashcards(deck, title, opts) {
        opts = opts || {};
        if (!deck.length) return;
        var review = !!opts.review;
        var i = 0, flipped = false, got = 0, missed = 0, done = false;

        var overlay = document.createElement('div');
        overlay.className = 'lx-modal';
        overlay.innerHTML =
            '<div class="lx-flash" role="dialog" aria-modal="true" aria-label="Flashcard practice">' +
                '<div class="lx-flash-head"><h3>' + esc(title) + '</h3>' +
                    '<button type="button" class="lx-flash-close" aria-label="Close">&times;</button></div>' +
                '<div class="lx-flash-card">' +
                    '<div class="lx-flash-face"></div>' +
                    '<div class="lx-flash-hint">Tap the card to flip</div>' +
                '</div>' +
                '<div class="lx-flash-controls"></div>' +
            '</div>';
        document.body.appendChild(overlay);

        var faceEl = overlay.querySelector('.lx-flash-face');
        var cardEl = overlay.querySelector('.lx-flash-card');
        var ctrlEl = overlay.querySelector('.lx-flash-controls');

        function renderCard() {
            var w = deck[i];
            if (!flipped) {
                faceEl.innerHTML = (w.img ? '<div class="lx-flash-img">' + vocabImg(w) + '</div>' : '') +
                    '<div class="lx-flash-front"><span data-speak="' + esc(w.kp) + '">' + esc(w.kp) + '</span></div>' +
                    (w.pron ? '<div class="lx-flash-pron">' + esc(w.pron) + '</div>' : '');
            } else {
                faceEl.innerHTML = '<div class="lx-flash-back">' + esc(w.en) + '</div>';
            }
        }

        function renderControls() {
            if (review) {
                ctrlEl.innerHTML =
                    '<button type="button" class="lx-btn lx-rate-miss">✕ Missed</button>' +
                    '<span class="lx-flash-progress">' + (i + 1) + ' / ' + deck.length + '</span>' +
                    '<button type="button" class="lx-btn lx-btn-primary lx-rate-got">✓ Got it</button>';
                ctrlEl.querySelector('.lx-rate-miss').addEventListener('click', function () { rate(false); });
                ctrlEl.querySelector('.lx-rate-got').addEventListener('click', function () { rate(true); });
            } else {
                ctrlEl.innerHTML =
                    '<button type="button" class="lx-btn lx-flash-prev">← Prev</button>' +
                    '<span class="lx-flash-progress">' + (i + 1) + ' / ' + deck.length + '</span>' +
                    '<button type="button" class="lx-btn lx-flash-next">Next →</button>';
                ctrlEl.querySelector('.lx-flash-next').addEventListener('click', function () { go(1); });
                ctrlEl.querySelector('.lx-flash-prev').addEventListener('click', function () { go(-1); });
            }
        }

        function render() { renderCard(); renderControls(); }

        function go(d) { i = (i + d + deck.length) % deck.length; flipped = false; render(); }

        function rate(good) {
            reviewWord(deck[i].kp, good);
            if (good) got++; else missed++;
            if (i < deck.length - 1) { i++; flipped = false; render(); }
            else finish();
        }

        function finish() {
            done = true;
            var msg = got + missed > 0
                ? 'Reviewed ' + (got + missed) + ' cards · <strong>' + got + ' got</strong> · ' + missed + ' to revisit.' +
                  '<div class="lx-flash-hint" style="margin-top:.5rem">Missed cards come back soon; the rest are scheduled further out.</div>'
                : 'Nothing to review right now.';
            faceEl.innerHTML = '<div class="lx-flash-back" style="font-size:1.05rem">🎉 Session complete</div>' +
                '<div class="lx-flash-hint" style="margin-top:.6rem">' + msg + '</div>';
            cardEl.style.cursor = 'default';
            ctrlEl.innerHTML = '<span></span><button type="button" class="lx-btn lx-btn-primary lx-flash-done">Done</button>';
            ctrlEl.querySelector('.lx-flash-done').addEventListener('click', close);
        }

        function close() { overlay.remove(); document.removeEventListener('keydown', onKey); if (opts.onClose) opts.onClose(); }

        cardEl.addEventListener('click', function () { if (done) return; flipped = !flipped; renderCard(); });
        overlay.querySelector('.lx-flash-close').addEventListener('click', close);
        overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });

        function onKey(e) {
            if (e.key === 'Escape') { close(); return; }
            if (done) return;
            if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); flipped = !flipped; renderCard(); return; }
            if (review) {
                if (e.key === '1' || e.key === 'ArrowLeft') rate(false);
                else if (e.key === '2' || e.key === 'ArrowRight') rate(true);
            } else {
                if (e.key === 'ArrowRight') go(1);
                else if (e.key === 'ArrowLeft') go(-1);
            }
        }
        document.addEventListener('keydown', onKey);
        render();
    }

    /* ==========================================================
       Self-check quiz  (Kapampangan → English, auto-generated)
       ========================================================== */
    function initQuiz() {
        var list = VOCAB[lessonNum];
        if (!Array.isArray(list) || list.length < 4) return;

        var sec = document.createElement('section');
        sec.className = 'lx-card lx-quiz';
        sec.id = 'self-check';
        sec.innerHTML =
            '<h2>✅ Quick Self-Check</h2>' +
            '<p class="lx-sub">Test what stuck. Choose the correct meaning — you get instant feedback, no grading, no pressure.</p>' +
            '<div class="lx-quiz-body"></div>' +
            '<div class="lx-toolbar">' +
                '<button type="button" class="lx-btn lx-btn-primary lx-quiz-new">↻ New questions</button>' +
                '<span class="lx-quiz-score" aria-live="polite"></span>' +
            '</div>';
        mount(sec);

        var body = sec.querySelector('.lx-quiz-body');
        var scoreEl = sec.querySelector('.lx-quiz-score');
        var answered, total;

        function build() {
            var pool = list.slice();
            var n = Math.min(5, pool.length);
            var picks = shuffle(pool).slice(0, n);
            answered = 0; total = n;
            scoreEl.textContent = '';
            scoreEl.className = 'lx-quiz-score';

            body.innerHTML = picks.map(function (ans, qi) {
                var distractors = shuffle(list.filter(function (w) { return w.en !== ans.en; })).slice(0, 3);
                var opts = shuffle(distractors.concat([ans]));
                var optHTML = opts.map(function (o) {
                    return '<button type="button" class="lx-opt" data-correct="' + (o.en === ans.en) + '">' + esc(o.en) + '</button>';
                }).join('');
                return '<div class="lx-quiz-q" data-qi="' + qi + '">' +
                         '<p class="lx-quiz-stem">' + (qi + 1) + '. What does <span class="lx-q-word" data-speak="' + esc(ans.kp) + '">' + esc(ans.kp) + '</span> mean?</p>' +
                         '<div class="lx-quiz-opts">' + optHTML + '</div>' +
                       '</div>';
            }).join('');
        }

        var right = 0;
        body.addEventListener('click', function (e) {
            var opt = e.target.closest('.lx-opt');
            if (!opt || opt.disabled) return;
            var q = opt.closest('.lx-quiz-q');
            if (q.dataset.done) return;
            q.dataset.done = '1';
            var correct = opt.dataset.correct === 'true';
            if (correct) right++;
            Array.prototype.forEach.call(q.querySelectorAll('.lx-opt'), function (b) {
                b.disabled = true;
                if (b.dataset.correct === 'true') b.classList.add('lx-correct');
            });
            if (!correct) opt.classList.add('lx-wrong');
            answered++;
            if (answered === total) {
                var pct = Math.round((right / total) * 100);
                scoreEl.textContent = 'Score: ' + right + ' / ' + total + (pct >= 80 ? ' — excellent! 🎉' : pct >= 50 ? ' — nice work, keep going!' : ' — review the words above and try again.');
                scoreEl.className = 'lx-quiz-score' + (pct >= 80 ? ' lx-good' : '');
            }
        });

        sec.querySelector('.lx-quiz-new').addEventListener('click', function () { right = 0; build(); });
        build();
    }

    /* ==========================================================
       Learning journal (autosaved per lesson) + export
       ========================================================== */
    function initJournal() {
        var sec = document.createElement('section');
        sec.className = 'lx-card lx-journal';
        sec.id = 'journal';
        var key = K_JOURNAL + page;

        sec.innerHTML =
            '<h2>✍️ Learning Journal</h2>' +
            '<label class="lx-journal-label" for="lx-journal-text">Your reflection for this lesson ' +
                '<span class="lx-journal-note">— autosaved on this device</span></label>' +
            '<div class="lx-journal-prompts">Reflection helps it stick. Try: <strong>What clicked?</strong> · ' +
                '<strong>One word or rule I want to remember.</strong> · <strong>Something still confusing.</strong> · ' +
                '<strong>A sentence I can now say in Kapampangan.</strong></div>' +
            '<textarea id="lx-journal-text" class="lx-textarea" ' +
                'placeholder="Isulat mo ang mga saloobin mo… (Write your thoughts here.)"></textarea>' +
            '<div class="lx-journal-meta">' +
                '<span class="lx-status" aria-live="polite"></span>' +
                '<button type="button" class="lx-btn lx-journal-export" style="margin-left:auto">⬇ Export all my entries</button>' +
            '</div>';
        mount(sec);

        var ta = sec.querySelector('#lx-journal-text');
        var status = sec.querySelector('.lx-status');

        var saved = LS.getJSON(key, null);
        if (saved && saved.text) { ta.value = saved.text; status.textContent = 'Last saved ' + fmt(saved.ts); }

        var save = debounce(function () {
            try {
                localStorage.setItem(key, JSON.stringify({ text: ta.value, ts: Date.now() }));
                status.textContent = 'Saved ✓ ' + fmt(Date.now());
            } catch (_) { status.textContent = '⚠️ Could not save (browser storage is blocked).'; }
        }, 500);

        ta.addEventListener('input', function () { status.textContent = 'Saving…'; save(); });
        sec.querySelector('.lx-journal-export').addEventListener('click', exportJournal);
    }

    function exportJournal() {
        var entries = [];
        try {
            for (var i = 0; i < localStorage.length; i++) {
                var k = localStorage.key(i);
                if (!k || k.indexOf(K_JOURNAL) !== 0) continue;
                var v = JSON.parse(localStorage.getItem(k));
                if (v && v.text && v.text.trim()) entries.push({ page: k.slice(K_JOURNAL.length), text: v.text, ts: v.ts });
            }
        } catch (_) {}
        entries.sort(function (a, b) { return a.page.localeCompare(b.page); });

        function label(slug) {
            var m = slug.match(/kapampangan_lesson_(\d+)/);
            if (m) return 'Lesson ' + m[1] + (TITLES[m[1]] ? ' — ' + TITLES[m[1]] : '');
            return slug;
        }
        var md = entries.length
            ? '# My Kapampangan Learning Journal\n\n' + entries.map(function (e) {
                return '## ' + label(e.page) + '\n_saved ' + fmt(e.ts) + '_\n\n' + e.text + '\n';
              }).join('\n---\n\n')
            : 'No journal entries saved yet.';

        var blob = new Blob([md], { type: 'text/markdown' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url; a.download = 'my-kapampangan-journal.md';
        document.body.appendChild(a); a.click(); a.remove();
        setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    }

    /* ==========================================================
       Mark lesson complete
       ========================================================== */
    function initComplete() {
        var done = !!(progress()[lessonNum] && progress()[lessonNum].completed);
        var box = document.createElement('div');
        box.className = 'lx-complete' + (done ? ' lx-done' : '');
        box.innerHTML =
            '<span class="lx-complete-text"></span>' +
            '<button type="button" class="lx-btn lx-btn-primary lx-complete-btn" style="margin-left:auto"></button>';
        var at = insertPoint();
        if (at && at.parentNode) at.parentNode.insertBefore(box, at);
        else document.body.appendChild(box);

        var textEl = box.querySelector('.lx-complete-text');
        var btn = box.querySelector('.lx-complete-btn');
        function paint() {
            var d = !!(progress()[lessonNum] && progress()[lessonNum].completed);
            box.classList.toggle('lx-done', d);
            textEl.textContent = d ? '🎉 Lesson complete — magaling! (well done!)' : 'Finished this lesson?';
            btn.textContent = d ? '✓ Completed — undo' : '✓ Mark lesson complete';
        }
        btn.addEventListener('click', function () {
            var d = !!(progress()[lessonNum] && progress()[lessonNum].completed);
            setCompleted(lessonNum, !d);
            paint();
        });
        paint();
    }

    /* ==========================================================
       Interactive exercises
       ---------------------------
       Auto-upgrades the static gap-fill exercises. Any practice list/box whose
       items contain a blank ("_____") and an inline answer ("(Answer: X)" or
       "— Answer: X") is turned into checkable inputs with Check / Show-answers
       controls and a live score. Alternatives may be listed as "a|b". Items
       without both a blank and an answer are left untouched, so identification
       and open-ended tasks stay as they are.
       ========================================================== */
    function initExercises() {
        function norm(s) { return (s || '').trim().toLowerCase().replace(/[.!?,;:]+$/, '').replace(/\s+/g, ' '); }

        var boxes = document.querySelectorAll('.practice-box ul, .practice-box ol, .practice-box .example-box');
        Array.prototype.forEach.call(boxes, function (box) {
            if (box.dataset.lxEx) return;
            var items = (box.tagName === 'UL' || box.tagName === 'OL')
                ? box.querySelectorAll(':scope > li')
                : box.querySelectorAll('li, p');
            var fields = [];

            Array.prototype.forEach.call(items, function (li) {
                var text = li.textContent;
                if (!/_{3,}/.test(text)) return;
                var m = text.match(/\(answer:\s*([^)]+)\)/i) || text.match(/[-–—]\s*answer:\s*(.+)$/i);
                if (!m) return;
                var answer = m[1].trim();
                li.innerHTML = li.innerHTML
                    .replace(/\s*\(answer:[^)]*\)/i, '')
                    .replace(/\s*[-–—]\s*answer:[^<]*$/i, '')
                    .replace(/_{3,}/, '<input type="text" class="lx-blank" data-answer="' + esc(answer) +
                        '" autocomplete="off" autocapitalize="none" spellcheck="false" aria-label="Answer">');
                var input = li.querySelector('.lx-blank');
                if (input) fields.push(input);
            });
            if (!fields.length) return;

            box.dataset.lxEx = '1';
            var bar = document.createElement('div');
            bar.className = 'lx-ex-controls';
            bar.innerHTML =
                '<button type="button" class="lx-btn lx-btn-primary lx-ex-check">Check</button>' +
                '<button type="button" class="lx-btn lx-ex-reveal">Show answers</button>' +
                '<span class="lx-ex-feedback" aria-live="polite"></span>';
            box.parentNode.insertBefore(bar, box.nextSibling);
            var feedback = bar.querySelector('.lx-ex-feedback');

            function accepted(f) { return f.getAttribute('data-answer').split('|').map(norm); }
            function evaluate() {
                var ok = 0;
                fields.forEach(function (f) {
                    var good = f.value.trim() !== '' && accepted(f).indexOf(norm(f.value)) >= 0;
                    f.classList.remove('lx-correct', 'lx-wrong');
                    f.classList.add(good ? 'lx-correct' : 'lx-wrong');
                    if (good) ok++;
                });
                var all = ok === fields.length;
                feedback.textContent = ok + ' / ' + fields.length + ' correct' +
                    (all ? ' — great job! 🎉' : ' — try the ones in red again.');
                feedback.className = 'lx-ex-feedback' + (all ? ' lx-good' : '');
            }
            function reveal() {
                fields.forEach(function (f) {
                    f.value = f.getAttribute('data-answer').split('|')[0];
                    f.classList.remove('lx-wrong');
                    f.classList.add('lx-correct');
                });
                feedback.textContent = 'Answers shown.';
                feedback.className = 'lx-ex-feedback';
            }
            bar.querySelector('.lx-ex-check').addEventListener('click', evaluate);
            bar.querySelector('.lx-ex-reveal').addEventListener('click', reveal);
            fields.forEach(function (f) {
                f.addEventListener('input', function () { f.classList.remove('lx-correct', 'lx-wrong'); });
                f.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); evaluate(); } });
            });
        });
    }

    /* ==========================================================
       Keyboard shortcuts (← prev, → next, h home)
       ========================================================== */
    function initShortcuts() {
        document.addEventListener('keydown', function (e) {
            if (['INPUT', 'TEXTAREA', 'SELECT'].indexOf(e.target.tagName) !== -1) return;
            if (e.metaKey || e.ctrlKey || e.altKey) return;
            if (document.querySelector('.lx-modal')) return; // modal owns the arrows
            if (e.key === 'ArrowRight') { var n = document.querySelector('.next-lesson'); if (n) location.href = n.href; }
            else if (e.key === 'ArrowLeft') { var p = document.querySelector('.prev-lesson, .lesson-nav a[href*="lesson"]:not(.next-lesson)'); if (p) location.href = p.href; }
            else if (e.key.toLowerCase() === 'h') { location.href = 'index.html'; }
        });
    }

    /* ==========================================================
       Home dashboard
       ========================================================== */
    function initDashboard() {
        var container = document.querySelector('.container');
        if (!container) return;

        var comp = completedCount();
        var pct = Math.round((comp / TOTAL_LESSONS) * 100);
        var tracked = trackedCount();
        var dueNow = dueFrom(flatVocab()).length;
        var p = progress();
        var visited = 0; for (var k in p) if (p.hasOwnProperty(k) && p[k].visited) visited++;

        // Resume: highest-numbered visited lesson, else lesson 1.
        var resume = 1;
        for (var i = 1; i <= TOTAL_LESSONS; i++) { if (p[i] && p[i].visited) resume = i; }

        var dash = document.createElement('div');
        dash.className = 'lx-dash';
        dash.innerHTML =
            '<div class="lx-dash-card">' +
                '<h2>📈 Your Progress</h2>' +
                '<div class="lx-stats">' +
                    '<div class="lx-stat"><div class="lx-stat-num">' + comp + '<span style="font-size:1rem;color:var(--text-muted)">/' + TOTAL_LESSONS + '</span></div><div class="lx-stat-label">Lessons completed</div></div>' +
                    '<div class="lx-stat"><div class="lx-stat-num">' + pct + '%</div><div class="lx-stat-label">Course progress</div></div>' +
                    '<div class="lx-stat"><div class="lx-stat-num">' + tracked + '</div><div class="lx-stat-label">Words in review</div></div>' +
                    '<div class="lx-stat"><div class="lx-stat-num">' + dueNow + '</div><div class="lx-stat-label">Due now</div></div>' +
                '</div>' +
                '<div class="lx-track"><div class="lx-track-fill"></div></div>' +
                '<div class="lx-toolbar">' +
                    '<a class="lx-btn lx-btn-primary" href="kapampangan_lesson_' + resume + '.html">▶ ' + (visited ? 'Continue' : 'Start') + ': Lesson ' + resume + '</a>' +
                    '<button type="button" class="lx-btn lx-review-due"' + (dueNow ? '' : ' disabled') + '>🔁 Review due words (' + dueNow + ')</button>' +
                    '<button type="button" class="lx-btn lx-review-known">🃏 Browse my review deck</button>' +
                    '<button type="button" class="lx-btn lx-export-journal">⬇ Export journal</button>' +
                    '<button type="button" class="lx-btn lx-reset">↺ Reset progress</button>' +
                '</div>' +
            '</div>';

        // Insert dashboard right after the intro, before the lesson grid.
        var grid = container.querySelector('.lesson-grid');
        if (grid) container.insertBefore(dash, grid);
        else container.appendChild(dash);

        // animate the track after paint
        requestAnimationFrame(function () { dash.querySelector('.lx-track-fill').style.width = pct + '%'; });

        // Completion ticks on the lesson cards
        Array.prototype.forEach.call(container.querySelectorAll('.lesson-card'), function (card) {
            var href = card.getAttribute('href') || '';
            var m = href.match(/kapampangan_lesson_(\d+)/);
            if (!m) return;
            var st = p[m[1]] || {};
            var tick = document.createElement('div');
            tick.className = 'lx-tick';
            tick.textContent = st.completed ? '✓' : '•';
            card.appendChild(tick);
            if (st.completed) card.classList.add('lx-completed');
            else if (st.visited) card.classList.add('lx-visited');
        });

        dash.querySelector('.lx-export-journal').addEventListener('click', exportJournal);

        dash.querySelector('.lx-review-due').addEventListener('click', function () {
            var due = dueFrom(flatVocab());
            if (!due.length) { alert('Nothing is due right now — come back later, or add more words to your review deck from any lesson.'); return; }
            openFlashcards(shuffle(due), 'Review · ' + due.length + ' due', { review: true, onClose: function () { location.reload(); } });
        });

        dash.querySelector('.lx-review-known').addEventListener('click', function () {
            var uniq = trackedFrom(flatVocab());
            if (!uniq.length) { alert('Your review deck is empty. Open a lesson and use "+ Add to review" in "Words You Learned".'); return; }
            openFlashcards(shuffle(uniq), 'Browse · ' + uniq.length + ' words in review');
        });

        dash.querySelector('.lx-reset').addEventListener('click', function () {
            if (!confirm('Reset lesson completion and your review deck on this device? Your journal entries are kept.')) return;
            LS.set(K_PROGRESS, JSON.stringify({}));
            LS.set(K_SRS, JSON.stringify({}));
            LS.set(K_KNOWN, JSON.stringify({}));
            location.reload();
        });
    }

    /* ==========================================================
       Boot
       ========================================================== */
    function boot() {
        initProgressBar();
        initShortcuts();

        if (lessonNum) {
            markVisited(lessonNum);
            initObjectives();     // top of lesson
            initSummary();        // end of lesson, above the review sections
            initVocabReview();
            initQuiz();
            initJournal();
            initComplete();
            initExercises();
        } else if (isHome) {
            initDashboard();
        } else {
            // Other pages (reader): still offer the journal.
            initJournal();
        }
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
    else boot();
})();
