/* glossary.js — builds the course-wide vocabulary glossary from vocab-data.js.

   Aggregates every word across all lessons into one searchable, filterable,
   deduplicated reference. Each unique Kapampangan word appears once, linked back to
   every lesson it is taught in, with audio (via audio.js `data-speak`) and a
   one-tap "add to review" that writes to the same spaced-repetition deck the
   lessons use (localStorage `kapampangan-int-srs`). No dependency on learn.js. */
(function () {
    'use strict';

    var VOCAB = window.KAPAMPANGAN_INT_VOCAB || {};
    var TITLES = VOCAB.titles || {};
    var K_SRS = 'kapampangan-int-srs';

    /* ---- shared spaced-repetition store (same shape learn.js uses) ---- */
    function srsMap() {
        try { var v = localStorage.getItem(K_SRS); return v ? JSON.parse(v) : {}; }
        catch (_) { return {}; }
    }
    function isTracked(tl) { return !!srsMap()[tl]; }
    function trackWord(tl, on) {
        var m = srsMap();
        if (on) { if (!m[tl]) m[tl] = { box: 1, due: Date.now(), reps: 0 }; }
        else delete m[tl];
        try { localStorage.setItem(K_SRS, JSON.stringify(m)); } catch (_) {}
    }
    /* Leitner review: "Got it" promotes a box and pushes the due date out,
       "Missed" resets to box 1 due soon. Same shape/keys learn.js uses, so a
       word reviewed here also updates the lesson decks. */
    var DAY = 86400000;
    var BOX_INTERVAL = [0, DAY, 3 * DAY, 7 * DAY, 16 * DAY, 40 * DAY];
    var MAX_BOX = 5;
    function reviewWord(tl, good) {
        var m = srsMap();
        var e = m[tl] || { box: 1, due: Date.now(), reps: 0 };
        e.box = good ? Math.min(MAX_BOX, e.box + 1) : 1;
        e.reps = (e.reps || 0) + 1;
        e.due = Date.now() + BOX_INTERVAL[e.box];
        m[tl] = e;
        try { localStorage.setItem(K_SRS, JSON.stringify(m)); } catch (_) {}
    }
    function dueFrom(words) {
        var m = srsMap(), now = Date.now(), out = [];
        words.forEach(function (w) { var e = m[w.kp]; if (e && e.due <= now) out.push(w); });
        return out;
    }
    function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }

    function esc(s) {
        return String(s).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }
    function debounce(fn, ms) { var t; return function () { var a = arguments, c = this; clearTimeout(t); t = setTimeout(function () { fn.apply(c, a); }, ms); }; }

    /* ---- build the deduplicated word list ---- */
    var byKey = {}, order = [];
    var LESSON_KEYS = Object.keys(VOCAB).filter(function (k) { return /^\d+$/.test(k); })
        .map(Number).sort(function (a, b) { return a - b; });
    LESSON_KEYS.forEach(function (ln) {
        var list = VOCAB[String(ln)];
        if (!Array.isArray(list)) return;
        list.forEach(function (w) {
            var key = w.kp.toLowerCase();
            if (!byKey[key]) { byKey[key] = { kp: w.kp, pron: w.pron || '', en: w.en || '', lessons: [ln] }; order.push(key); }
            else if (byKey[key].lessons.indexOf(ln) < 0) byKey[key].lessons.push(ln);
        });
    });
    var WORDS = order.map(function (k) { return byKey[k]; });

    // strip diacritics for accent-insensitive search and A–Z bucketing
    function fold(s) { return s.toLowerCase().normalize ? s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '') : s.toLowerCase(); }

    var root = document.getElementById('glossary-root');
    if (!root) return;

    root.innerHTML =
        '<div class="g-controls">' +
            '<input type="search" id="g-search" class="g-search" placeholder="Search Kapampangan or English…" aria-label="Search vocabulary" autocomplete="off">' +
            '<select id="g-lesson" class="g-select" aria-label="Filter by lesson"></select>' +
            '<select id="g-sort" class="g-select" aria-label="Sort order">' +
                '<option value="tl">Sort: Kapampangan A–Z</option>' +
                '<option value="en">Sort: English A–Z</option>' +
                '<option value="lesson">Sort: by lesson</option>' +
            '</select>' +
        '</div>' +
        '<div class="g-actions">' +
            '<button type="button" class="lx-btn lx-btn-primary g-practice">🃏 Practice these (<span class="g-practice-n">0</span>)</button>' +
            '<button type="button" class="lx-btn g-review-due" disabled>🔁 Review due (<span class="g-due-n">0</span>)</button>' +
        '</div>' +
        '<div class="g-azbar" id="g-azbar" aria-label="Jump to letter"></div>' +
        '<p class="g-stats" id="g-stats" aria-live="polite"></p>' +
        '<div class="table-wrap"><table class="g-table"><thead><tr>' +
            '<th>Kapampangan</th><th>Pronunciation</th><th>English</th><th>Lesson</th><th class="g-th-act">Review</th>' +
        '</tr></thead><tbody id="g-body"></tbody></table></div>' +
        '<p class="g-empty" id="g-empty" hidden>No words match your search.</p>';

    var searchEl = document.getElementById('g-search');
    var lessonEl = document.getElementById('g-lesson');
    var sortEl = document.getElementById('g-sort');
    var bodyEl = document.getElementById('g-body');
    var statsEl = document.getElementById('g-stats');
    var emptyEl = document.getElementById('g-empty');
    var azEl = document.getElementById('g-azbar');
    var practiceBtn = root.querySelector('.g-practice');
    var reviewDueBtn = root.querySelector('.g-review-due');
    var practiceN = root.querySelector('.g-practice-n');
    var dueN = root.querySelector('.g-due-n');

    function updateActionCounts(visibleCount) {
        if (typeof visibleCount === 'number') practiceN.textContent = visibleCount;
        var due = dueFrom(WORDS).length;
        dueN.textContent = due;
        reviewDueBtn.disabled = due === 0;
    }

    // lesson filter options
    var opt = '<option value="">All lessons</option>';
    LESSON_KEYS.forEach(function (i) { opt += '<option value="' + i + '">Lesson ' + i + (TITLES[i] ? ' — ' + esc(TITLES[i]) : '') + '</option>'; });
    lessonEl.innerHTML = opt;

    function lessonLinks(lessons) {
        return lessons.slice().sort(function (a, b) { return a - b; }).map(function (n) {
            return '<a class="g-lesson-link" href="kapampangan_lesson_' + n + '.html" title="' + esc(TITLES[n] || ('Lesson ' + n)) + '">L' + n + '</a>';
        }).join(' ');
    }

    function rowHTML(w) {
        var on = isTracked(w.kp);
        return '<tr data-kp="' + esc(w.kp) + '">' +
            '<td class="g-tl"><span data-speak="' + esc(w.kp) + '">' + esc(w.kp) + '</span></td>' +
            '<td class="g-pron">' + esc(w.pron) + '</td>' +
            '<td class="g-en">' + esc(w.en) + '</td>' +
            '<td class="g-les">' + lessonLinks(w.lessons) + '</td>' +
            '<td class="g-act"><button type="button" class="g-review' + (on ? ' g-on' : '') + '" ' +
                'aria-pressed="' + on + '" title="Add to spaced-repetition review deck">' + (on ? '✓' : '+') + '</button></td>' +
        '</tr>';
    }

    function currentFiltered() {
        var q = fold(searchEl.value.trim());
        var lf = lessonEl.value;
        var sort = sortEl.value;

        var rows = WORDS.filter(function (w) {
            if (lf && w.lessons.indexOf(parseInt(lf, 10)) < 0) return false;
            if (!q) return true;
            return fold(w.kp).indexOf(q) >= 0 || fold(w.en).indexOf(q) >= 0 || fold(w.pron).indexOf(q) >= 0;
        });

        rows.sort(function (a, b) {
            if (sort === 'en') return a.en.localeCompare(b.en);
            if (sort === 'lesson') {
                var d = Math.min.apply(null, a.lessons) - Math.min.apply(null, b.lessons);
                return d || a.kp.localeCompare(b.kp);
            }
            return fold(a.kp).localeCompare(fold(b.kp));
        });
        return rows;
    }

    function render() {
        var rows = currentFiltered();
        bodyEl.innerHTML = rows.map(rowHTML).join('');
        statsEl.textContent = 'Showing ' + rows.length + ' of ' + WORDS.length + ' words';
        emptyEl.hidden = rows.length > 0;
        azEl.style.display = (sortEl.value === 'tl' && !searchEl.value.trim()) ? '' : 'none';
        practiceBtn.disabled = rows.length === 0;
        updateActionCounts(rows.length);
    }

    /* ---------- flashcard modal (browse + spaced-repetition review) ----------
       Reuses the .lx-modal / .lx-flash styles from learn.css so it looks and
       behaves like the in-lesson flashcards. */
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
                '<div class="lx-flash-card"><div class="lx-flash-face"></div>' +
                    '<div class="lx-flash-hint">Tap the card to flip</div></div>' +
                '<div class="lx-flash-controls"></div>' +
            '</div>';
        document.body.appendChild(overlay);

        var faceEl = overlay.querySelector('.lx-flash-face');
        var cardEl = overlay.querySelector('.lx-flash-card');
        var ctrlEl = overlay.querySelector('.lx-flash-controls');

        function renderCard() {
            var w = deck[i];
            if (!flipped) {
                faceEl.innerHTML = '<div class="lx-flash-front"><span data-speak="' + esc(w.kp) + '">' + esc(w.kp) + '</span></div>' +
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
        function render2() { renderCard(); renderControls(); }
        function go(d) { i = (i + d + deck.length) % deck.length; flipped = false; render2(); }
        function rate(good) {
            reviewWord(deck[i].kp, good);
            if (good) got++; else missed++;
            if (i < deck.length - 1) { i++; flipped = false; render2(); } else finish();
        }
        function finish() {
            done = true;
            faceEl.innerHTML = '<div class="lx-flash-back" style="font-size:1.05rem">🎉 Session complete</div>' +
                '<div class="lx-flash-hint" style="margin-top:.6rem">Reviewed ' + (got + missed) + ' cards · <strong>' + got +
                ' got</strong> · ' + missed + ' to revisit.</div>';
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
            if (review) { if (e.key === '1' || e.key === 'ArrowLeft') rate(false); else if (e.key === '2' || e.key === 'ArrowRight') rate(true); }
            else { if (e.key === 'ArrowRight') go(1); else if (e.key === 'ArrowLeft') go(-1); }
        }
        document.addEventListener('keydown', onKey);
        render2();
    }

    practiceBtn.addEventListener('click', function () {
        var rows = currentFiltered();
        if (rows.length) openFlashcards(shuffle(rows), 'Practice · ' + rows.length + ' words');
    });
    reviewDueBtn.addEventListener('click', function () {
        var due = dueFrom(WORDS);
        if (due.length) openFlashcards(shuffle(due), 'Review · ' + due.length + ' due', { review: true, onClose: render });
    });

    // A–Z quick jump (active when sorted by Kapampangan with no search)
    (function buildAZ() {
        var letters = {};
        WORDS.forEach(function (w) { var c = fold(w.kp).charAt(0).toUpperCase(); if (/[A-Z]/.test(c)) letters[c] = 1; });
        azEl.innerHTML = Object.keys(letters).sort().map(function (c) {
            return '<button type="button" class="g-az" data-letter="' + c + '">' + c + '</button>';
        }).join('');
        azEl.addEventListener('click', function (e) {
            var b = e.target.closest('.g-az'); if (!b) return;
            var c = b.getAttribute('data-letter').toLowerCase();
            var target = Array.prototype.find.call(bodyEl.querySelectorAll('.g-tl'), function (td) {
                return fold(td.textContent).charAt(0) === c;
            });
            if (target) target.closest('tr').scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    })();

    // review toggle (delegated)
    bodyEl.addEventListener('click', function (e) {
        var btn = e.target.closest('.g-review');
        if (!btn) return;
        var tl = btn.closest('tr').getAttribute('data-kp');
        var on = !isTracked(tl);
        trackWord(tl, on);
        btn.classList.toggle('g-on', on);
        btn.setAttribute('aria-pressed', String(on));
        btn.textContent = on ? '✓' : '+';
        updateActionCounts();
    });

    searchEl.addEventListener('input', debounce(render, 150));
    lessonEl.addEventListener('change', render);
    sortEl.addEventListener('change', render);

    render();
})();
