/* cando.js — CEFR A1/A2 "can-do" self-assessment checklist. Standalone
   (like glossary.js / readings.js). Renders the CANDO data below, persists
   ticks in localStorage (kapampangan-cando), and shows live progress bars.
   Each item links to the lesson(s) that teach it. */
(function () {
    'use strict';

    var CANDO = [
        {
            level: 'A1', title: 'A1 — Breakthrough (Beginner)',
            groups: [
                {
                    name: 'Getting started', items: [
                        { id: 'a1-sounds', text: 'Pronounce the five vowels and put the stress on the right syllable', ln: [[1]] },
                        { id: 'a1-tone', text: 'Explain why Kapampangan has stress but no tones', ln: [[1]] },
                        { id: 'a1-greet', text: 'Greet someone correctly at any hour of the day', ln: [[2]] },
                        { id: 'a1-pu', text: 'Use pu and opu to show respect', ln: [[2], [17]] },
                        { id: 'a1-thanks', text: 'Say yes, no, thank you and sorry', ln: [[2]] },
                        { id: 'a1-name', text: 'Give my name and ask for someone else\u2019s', ln: [[2]] }
                    ]
                },
                {
                    name: 'The grammatical core', items: [
                        { id: 'a1-markers', text: 'Use ing, ning and king to show what each noun is doing', ln: [[3]] },
                        { id: 'a1-plural', text: 'Switch to deng, reng and karing for plurals', ln: [[3]] },
                        { id: 'a1-personal', text: 'Mark people\u2019s names with i, nang and kang', ln: [[3]] },
                        { id: 'a1-pron1', text: 'Use the subject pronouns and the doer pronouns', ln: [[4]] },
                        { id: 'a1-we', text: 'Choose correctly between ikata, ikatamu and ikami', ln: [[4]] },
                        { id: 'a1-agree', text: 'Remember the pronoun even when the noun is already there', ln: [[4]] },
                        { id: 'a1-fused', text: 'Recognise and use ke, me, ne, no and da ka', ln: [[5]] },
                        { id: 'a1-fused2', text: 'Hear the difference between Dintang ya and Dintang ne', ln: [[5]] }
                    ]
                },
                {
                    name: 'Pointing and naming', items: [
                        { id: 'a1-demo', text: 'Choose between ini, iti, iyan and ita', ln: [[6]] },
                        { id: 'a1-loc', text: 'Say where something is with keni, keti, ken and keta', ln: [[6]] },
                        { id: 'a1-family', text: 'Name the members of a family and address older siblings correctly', ln: [[7]] },
                        { id: 'a1-poss', text: 'Say whose something is, two different ways', ln: [[7], [10]] }
                    ]
                },
                {
                    name: 'Everyday life', items: [
                        { id: 'a1-count', text: 'Count from one to ten, and build bigger numbers', ln: [[8]] },
                        { id: 'a1-metung', text: 'Choose correctly between metung and isa', ln: [[8]] },
                        { id: 'a1-time', text: 'Name the parts of the day and say yesterday, now and tomorrow', ln: [[8]] },
                        { id: 'a1-age', text: 'Ask and answer how old someone is', ln: [[8]] },
                        { id: 'a1-food', text: 'Name everyday food and drink, and praise a meal', ln: [[9]] },
                        { id: 'a1-invite', text: 'Invite someone to eat with Mangan tana!', ln: [[9], [17]] },
                        { id: 'a1-have', text: 'Say what I have and don\u2019t have with ati and ala', ln: [[10]] },
                        { id: 'a1-house', text: 'Name the rooms and everyday objects of a house', ln: [[10]] }
                    ]
                }
            ]
        },
        {
            level: 'A2', title: 'A2 — Waystage (Elementary)',
            groups: [
                {
                    name: 'Verbs', items: [
                        { id: 'a2-aspect', text: 'Use the contemplative, progressive and completed aspects', ln: [[11]] },
                        { id: 'a2-meg', text: 'Recognise the a\u2192e change that signals a completed verb', ln: [[11]] },
                        { id: 'a2-false', text: 'Avoid the susulat trap that catches Tagalog speakers', ln: [[11]] },
                        { id: 'a2-focus', text: 'Explain what focus is and why the markers move', ln: [[12]] },
                        { id: 'a2-af', text: 'Build an actor-focus sentence', ln: [[12]] },
                        { id: 'a2-of', text: 'Build an object-focus sentence with i- or -an', ln: [[12]] }
                    ]
                },
                {
                    name: 'Saying no, and asking', items: [
                        { id: 'a2-neg', text: 'Choose correctly between ali, ala and e', ln: [[13]] },
                        { id: 'a2-notyet', text: 'Say not yet, not any more, and I don\u2019t know', ln: [[13]] },
                        { id: 'a2-qw', text: 'Use the twelve question words', ln: [[14]] },
                        { id: 'a2-pilan', text: 'Distinguish pilan from magkanu', ln: [[14], [8]] },
                        { id: 'a2-yesno', text: 'Form a yes-or-no question with wari', ln: [[14]] }
                    ]
                },
                {
                    name: 'Describing and wanting', items: [
                        { id: 'a2-ma', text: 'Form and use the ma- adjectives', ln: [[15]] },
                        { id: 'a2-linker', text: 'Attach an adjective to a noun with a or -ng', ln: [[15]] },
                        { id: 'a2-colour', text: 'Name the basic colours', ln: [[15]] },
                        { id: 'a2-ka', text: 'Make a quality noun with ka- and a superlative with peka-', ln: [[15]] },
                        { id: 'a2-buri', text: 'Say what I like and want with buri and bisa', ln: [[16]] },
                        { id: 'a2-need', text: 'Express need, obligation and ability', ln: [[16]] }
                    ]
                },
                {
                    name: 'Getting things done', items: [
                        { id: 'a2-cmd', text: 'Give a command and soften it appropriately', ln: [[17]] },
                        { id: 'a2-perm', text: 'Ask permission politely', ln: [[17], [16]] },
                        { id: 'a2-lets', text: 'Make a let\u2019s suggestion with tana', ln: [[17]] },
                        { id: 'a2-market', text: 'Complete a whole market transaction', ln: [[18]] },
                        { id: 'a2-bargain', text: 'Ask a price and bargain politely', ln: [[18]] },
                        { id: 'a2-health', text: 'Say what hurts and ask for help', ln: [[19]] },
                        { id: 'a2-weather', text: 'Describe the weather and name the days of the week', ln: [[19]] }
                    ]
                },
                {
                    name: 'Culture', items: [
                        { id: 'a2-fiesta', text: 'Name Pampanga\u2019s festivals and say what happens at each', ln: [[20]] },
                        { id: 'a2-amanu', text: 'Explain what Amanung Sisuan means and why it matters', ln: [[20]] },
                        { id: 'a2-dialect', text: 'Explain why Kapampangan is a language, not a dialect of Tagalog', ln: [[20], [11]] }
                    ]
                }
            ]
        }
    ];

    var KEY = 'kapampangan-cando';

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
