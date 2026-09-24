/* cando.js — CEFR A1/A2 "can-do" self-assessment checklist. Standalone
   (like glossary.js / readings.js). Renders the CANDO data below, persists
   ticks in localStorage (kapampangan-int-cando), and shows live progress bars.
   Each item links to the lesson(s) that teach it. */
(function () {
    'use strict';

    var CANDO = [
        {
            level: 'B1', title: 'B1 — Threshold (Intermediate)',
            groups: [
                {
                    name: 'The predication system', items: [
                        { id: 'b1-goal', text: 'Recognise an action-goal predication and read its markers', ln: [[1]] },
                        { id: 'b1-classes', text: 'Sort an -an verb into one of the four classes', ln: [[1], [4]] },
                        { id: 'b1-benef', text: 'Tell an action-beneficiary predication from an action-goal one', ln: [[2]] },
                        { id: 'b1-pan', text: 'Recognise paN- and pag- beneficiary forms', ln: [[2]] },
                        { id: 'b1-other', text: 'Recognise locative, instrumental and reason predications', ln: [[3]] },
                        { id: 'b1-king', text: 'Explain the range of jobs king does', ln: [[3]] }
                    ]
                },
                {
                    name: 'Reading unfamiliar forms', items: [
                        { id: 'b1-stress', text: 'Recognise stress shift as meaning-bearing', ln: [[4]] },
                        { id: 'b1-vowel', text: 'Apply the u-to-i and a-to-e changes', ln: [[4]] },
                        { id: 'b1-ay', text: 'Handle the final -e/-ay and -o/-aw alternations', ln: [[4]] },
                        { id: 'b1-assim', text: 'Apply paN- assimilation to get pam-, pan- and pang-', ln: [[5]] },
                        { id: 'b1-sdy', text: 'Undo the s/d-to-y change to find a root', ln: [[5]] },
                        { id: 'b1-dr', text: 'Explain why da and ra are one word', ln: [[5]] },
                        { id: 'b1-method', text: 'Work back from an unfamiliar derived form to its root', ln: [[5], [4]] }
                    ]
                },
                {
                    name: 'States, ability and causation', items: [
                        { id: 'b1-mi', text: 'Form a stative predication with mi-', ln: [[6]] },
                        { id: 'b1-ka', text: 'Use ka- statives and read their causative sense', ln: [[6]] },
                        { id: 'b1-recip', text: 'Use the number-inflected reciprocals', ln: [[6]] },
                        { id: 'b1-recent', text: 'Recognise the ka- recent-completion construction', ln: [[7]] },
                        { id: 'b1-maka', text: 'Use maka- correctly \u2014 and not as the Tagalog potentive', ln: [[8]] },
                        { id: 'b1-abil', text: 'Use the a- ability forms', ln: [[8]] },
                        { id: 'b1-caus', text: 'Recognise pa-, ipa-, magpa- and magpaka-', ln: [[9]] }
                    ]
                },
                {
                    name: 'Phrases', items: [
                        { id: 'b1-link', text: 'Choose a or -ng correctly in any attributive phrase', ln: [[10]] },
                        { id: 'b1-unlink', text: 'Recognise unlinked attributives', ln: [[10]] },
                        { id: 'b1-split', text: 'Read a split attributive without losing the head', ln: [[10], [14]] },
                        { id: 'b1-chain', text: 'Chain two verbs with a pseudo-verb', ln: [[11]] },
                        { id: 'b1-manner', text: 'Add a complement of manner', ln: [[11]] },
                        { id: 'b1-comp', text: 'Compare two things with king, with or without mas', ln: [[12]] },
                        { id: 'b1-equal', text: 'Use the mising- equal comparative', ln: [[12]] },
                        { id: 'b1-excl', text: 'Use the emphatic ka- exclamation', ln: [[12]] }
                    ]
                }
            ]
        },
        {
            level: 'B2', title: 'B2 — Vantage (Upper Intermediate)',
            groups: [
                {
                    name: 'Sentences without verbs', items: [
                        { id: 'b2-nonverb', text: 'Name the four non-verbal predication types', ln: [[13]] },
                        { id: 'b2-atin', text: 'Use ati and atin correctly and negate both with ala', ln: [[13]] },
                        { id: 'b2-ident', text: 'Build and negate an identificational sentence', ln: [[13]] },
                        { id: 'b2-descten', text: 'Recognise descriptives inflected for tense and number', ln: [[13]] }
                    ]
                },
                {
                    name: 'Particles and texture', items: [
                        { id: 'b2-part', text: 'Use kanu, pala, pin, sana and rugu appropriately', ln: [[14]] },
                        { id: 'b2-order', text: 'Order a string of particles correctly', ln: [[14]] },
                        { id: 'b2-place', text: 'Place a particle cluster after the first constituent', ln: [[14]] },
                        { id: 'b2-back', text: 'Backchannel with varied short responses', ln: [[17], [22]] }
                    ]
                },
                {
                    name: 'Building sentences', items: [
                        { id: 'b2-coord', text: 'Coordinate and subordinate clauses with the right relator', ln: [[15]] },
                        { id: 'b2-embed', text: 'Embed a clause with nung or ing', ln: [[15]] },
                        { id: 'b2-multiing', text: 'Explain why a sentence can have several ing phrases', ln: [[15]] },
                        { id: 'b2-rel', text: 'Build a relative clause with the linker', ln: [[16]] },
                        { id: 'b2-unpack', text: 'Unpack a long noun phrase and find its head', ln: [[16]] },
                        { id: 'b2-three', text: 'Produce a three-clause sentence with a concession and a reason', ln: [[15], [22]] }
                    ]
                },
                {
                    name: 'Speaking naturally', items: [
                        { id: 'b2-minor', text: 'Use minor sentences \u2014 greetings, exclamations, short answers', ln: [[17]] },
                        { id: 'b2-dios', text: 'Announce yourself properly at someone\u2019s gate', ln: [[17]] },
                        { id: 'b2-deic', text: 'Use the deictic case forms, not just the plain ones', ln: [[18]] },
                        { id: 'b2-indef', text: 'Form indefinites with man and with reduplication', ln: [[18]] },
                        { id: 'b2-narr', text: 'Shape a narrative with time words and aspect contrast', ln: [[22]] }
                    ]
                },
                {
                    name: 'Text and context', items: [
                        { id: 'b2-ortho', text: 'Read the Spanish-based orthography', ln: [[19]] },
                        { id: 'b2-signs', text: 'Read real Kapampangan signage in the old spelling', ln: [[19]] },
                        { id: 'b2-lit', text: 'Name the main literary forms and figures', ln: [[20]] },
                        { id: 'b2-dialect', text: 'Describe how the western and eastern varieties differ', ln: [[21]] },
                        { id: 'b2-socio', text: 'Explain the pressure on the language and what the revival argues', ln: [[21]] },
                        { id: 'b2-limits', text: 'State honestly which parts of this description are uncertain', ln: [[21], [22]] }
                    ]
                }
            ]
        }
    ];

    var KEY = 'kapampangan-int-cando';

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
