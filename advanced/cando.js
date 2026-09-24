/* cando.js — CEFR A1/A2 "can-do" self-assessment checklist. Standalone
   (like glossary.js / readings.js). Renders the CANDO data below, persists
   ticks in localStorage (kapampangan-adv-cando), and shows live progress bars.
   Each item links to the lesson(s) that teach it. */
(function () {
    'use strict';

    var CANDO = [
        {
            level: 'C1', title: 'C1 — Effective Operational Proficiency',
            groups: [
                {
                    name: 'Handling the sources', items: [
                        { id: 'c1-open', text: 'Open Berga\u00f1o\u2019s Arte and know what I am looking at', ln: [[1]] },
                        { id: 'c1-terms', text: 'Read his grammatical terms and translate them to modern ones', ln: [[1]] },
                        { id: 'c1-diff', text: 'State what he covers that Forman does not', ln: [[1]] },
                        { id: 'c1-toc', text: 'Find a topic in his table of contents without help', ln: [[8]] },
                        { id: 'c1-judge', text: 'Judge a grammar by whether it marks its own limits', ln: [[1], [8]] }
                    ]
                },
                {
                    name: 'The old orthography', items: [
                        { id: 'c1-sub', text: 'Convert c, qu, gu and u between the old spelling and the modern one', ln: [[2]] },
                        { id: 'c1-rev', text: 'Convert a modern word to the old spelling before searching', ln: [[2], [9]] },
                        { id: 'c1-syll', text: 'Hear where a consonant closes a syllable rather than opening the next', ln: [[2]] },
                        { id: 'c1-len', text: 'Recognise that length alone distinguishes sulat from sulat', ln: [[2]] },
                        { id: 'c1-acc', text: 'Read his (pp) and (agudo) accent marks', ln: [[2], [9]] }
                    ]
                },
                {
                    name: 'Morphology in depth', items: [
                        { id: 'c1-pass', text: 'Read his three passives and map them onto Forman\u2019s predication types', ln: [[3]] },
                        { id: 'c1-form', text: 'Form the first passive across root shapes', ln: [[3]] },
                        { id: 'c1-proto', text: 'Apply the full protocompuesto assimilation rules', ln: [[4]] },
                        { id: 'c1-dsrule', text: 'Apply the rule about a second d or s in the root', ln: [[4]] },
                        { id: 'c1-stress', text: 'Distinguish present from future by stress alone', ln: [[4]] },
                        { id: 'c1-dim', text: 'Read a doubled root as diminishing, not intensifying', ln: [[5]] },
                        { id: 'c1-redup', text: 'Tell apart the several jobs reduplication does', ln: [[5]] },
                        { id: 'c1-sync', text: 'Recognise a syncope and restore the root', ln: [[5]] }
                    ]
                },
                {
                    name: 'The particles', items: [
                        { id: 'c1-mi', text: 'Use the reflexive and reciprocal mi-', ln: [[6]] },
                        { id: 'c1-pi', text: 'Use the pi- passive that names the instrument', ln: [[6]] },
                        { id: 'c1-maki', text: 'Use maqui- only where reciprocation is presupposed', ln: [[6]] },
                        { id: 'c1-abund', text: 'Recognise the ma- of abundance and lalo', ln: [[6]] },
                        { id: 'c1-maca6', text: 'List Berga\u00f1o\u2019s six senses of maca-', ln: [[7]] },
                        { id: 'c1-maca4', text: 'Read one maca- form four different ways', ln: [[7]] },
                        { id: 'c1-sukat', text: 'Distinguish proximate from remote ability with sukat', ln: [[7]] },
                        { id: 'c1-pairs', text: 'Give the passive counterpart of any active particle', ln: [[8]] }
                    ]
                }
            ]
        },
        {
            level: 'C2', title: 'C2 — Mastery',
            groups: [
                {
                    name: 'The dictionary', items: [
                        { id: 'c2-entry', text: 'Read a Berga\u00f1o entry and decode its abbreviations', ln: [[9]] },
                        { id: 'c2-search', text: 'Search it without generating a false negative', ln: [[9]] },
                        { id: 'c2-gloss', text: 'Search the English glosses when I do not know the Kapampangan', ln: [[9], [10]] },
                        { id: 'c2-att', text: 'Tell attestation apart from current usage', ln: [[9]] }
                    ]
                },
                {
                    name: 'The lexicon', items: [
                        { id: 'c2-sala', text: 'Read a six-way accent contrast', ln: [[10]] },
                        { id: 'c2-spec', text: 'Appreciate how specific a Kapampangan root can be', ln: [[10]] },
                        { id: 'c2-syn', text: 'Separate the several roots behind one English word', ln: [[10]] },
                        { id: 'c2-build', text: 'Build vocabulary in a semantic field from primary sources', ln: [[10]] }
                    ]
                },
                {
                    name: 'Number, manner and feeling', items: [
                        { id: 'c2-meca', text: 'Read the anticipatory meca- numerals correctly', ln: [[11]] },
                        { id: 'c2-ord', text: 'Form ordinals and distributives', ln: [[11]] },
                        { id: 'c2-adv', text: 'Navigate his ten sections of adverbs', ln: [[12]] },
                        { id: 'c2-interj', text: 'Use the interjections in their proper situations', ln: [[12]] },
                        { id: 'c2-irony', text: 'Recognise irony as a documented category', ln: [[12]] }
                    ]
                },
                {
                    name: 'Craft and judgement', items: [
                        { id: 'c2-focus', text: 'Translate focus without calling it voice', ln: [[13]] },
                        { id: 'c2-part', text: 'Compensate for a particle that will not carry over', ln: [[13]] },
                        { id: 'c2-choice', text: 'State which trade a translation of mine made', ln: [[13]] },
                        { id: 'c2-open', text: 'List what both grammars say they do not know', ln: [[14]] },
                        { id: 'c2-fail', text: 'Name the two failure modes this course fell into', ln: [[14]] },
                        { id: 'c2-limit', text: 'Say what is missing from the record and why it matters', ln: [[14]] },
                        { id: 'c2-check', text: 'Check a claim about Kapampangan against a primary source', ln: [[14]] }
                    ]
                }
            ]
        }
    ];

    var KEY = 'kapampangan-adv-cando';

    function load() {
        try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; }
    }
    function save(state) {
        try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* private mode */ }
    }
    function esc(s) {
        return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }

    function lessonLink(spec) {
        // spec is [n] for a lesson number, or ['slug','Label'] for a page
        if (typeof spec[0] === 'number') {
            return '<a class="ck-lesson" href="kapampangan_lesson_' + spec[0] + '.html">L' + spec[0] + '</a>';
        }
        return '<a class="ck-lesson" href="' + esc(spec[0]) + '.html">' + esc(spec[1]) + '</a>';
    }

    function allItems() {
        var out = [];
        CANDO.forEach(function (lvl) { lvl.groups.forEach(function (g) { g.items.forEach(function (it) { out.push(it); }); }); });
        return out;
    }

    document.addEventListener('DOMContentLoaded', function () {
        var root = document.getElementById('cando-root');
        if (!root) return;
        var state = load();

        var html = '';
        CANDO.forEach(function (lvl) {
            html += '<section class="ck-level" data-level="' + esc(lvl.level) + '">';
            html += '<div class="ck-level-head"><h2>' + esc(lvl.title) + '</h2>' +
                '<div class="ck-level-meter"><div class="ck-bar"><span class="ck-bar-fill" data-level="' + esc(lvl.level) + '"></span></div>' +
                '<span class="ck-level-count" data-level="' + esc(lvl.level) + '"></span></div></div>';
            lvl.groups.forEach(function (g) {
                html += '<h3 class="ck-group">' + esc(g.name) + '</h3><ul class="ck-list">';
                g.items.forEach(function (it) {
                    var on = !!state[it.id];
                    html += '<li class="ck-item' + (on ? ' ck-on' : '') + '">' +
                        '<label><input type="checkbox" class="ck-box" data-id="' + esc(it.id) + '"' + (on ? ' checked' : '') + '> ' +
                        '<span class="ck-text">' + esc(it.text) + '</span></label> ' +
                        '<span class="ck-lessons">' + it.ln.map(lessonLink).join(' ') + '</span></li>';
                });
                html += '</ul>';
            });
            html += '</section>';
        });
        root.innerHTML = html;

        function refresh() {
            var items = allItems();
            var total = items.length, done = 0;
            items.forEach(function (it) { if (state[it.id]) done++; });
            var overall = document.getElementById('ck-overall');
            if (overall) overall.textContent = done + ' / ' + total + ' can-do statements (' + Math.round(done / total * 100) + '%)';
            var ofill = document.getElementById('ck-overall-fill');
            if (ofill) ofill.style.width = Math.round(done / total * 100) + '%';

            CANDO.forEach(function (lvl) {
                var lt = 0, ld = 0;
                lvl.groups.forEach(function (g) { g.items.forEach(function (it) { lt++; if (state[it.id]) ld++; }); });
                var pct = Math.round(ld / lt * 100);
                var fill = root.querySelector('.ck-bar-fill[data-level="' + lvl.level + '"]');
                var cnt = root.querySelector('.ck-level-count[data-level="' + lvl.level + '"]');
                if (fill) fill.style.width = pct + '%';
                if (cnt) cnt.textContent = ld + '/' + lt + ' (' + pct + '%)';
            });
        }
        refresh();

        root.addEventListener('change', function (e) {
            var box = e.target.closest('.ck-box');
            if (!box) return;
            var id = box.getAttribute('data-id');
            if (box.checked) state[id] = true; else delete state[id];
            box.closest('.ck-item').classList.toggle('ck-on', box.checked);
            save(state);
            refresh();
        });

        var resetBtn = document.getElementById('ck-reset');
        if (resetBtn) resetBtn.addEventListener('click', function () {
            if (!confirm('Clear all your ticks and start fresh?')) return;
            state = {};
            save(state);
            Array.prototype.forEach.call(root.querySelectorAll('.ck-box'), function (b) { b.checked = false; b.closest('.ck-item').classList.remove('ck-on'); });
            refresh();
        });
    });
})();
