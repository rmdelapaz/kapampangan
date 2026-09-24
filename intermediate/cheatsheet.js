/* cheatsheet.js — renders the printable "most common phrases" cheat sheet.

   A curated (not exhaustive) set of the everyday survival phrases a traveller or
   new learner reaches for first, grouped by situation. Each phrase gets an audio
   button (via audio.js `data-speak`); the layout is print-optimised so it prints
   cleanly onto a couple of pages. Data lives here so it is easy to hand-edit. */
(function () {
    'use strict';

    var SHEET = [
        { title: 'Predication types', items: [
            ['Action-Actor', 'AF', '-um-, mag-, maN- \u2014 the doer takes ing'],
            ['Action-Goal', 'GF', '-an or i- \u2014 the thing acted on takes ing, agent drops to ning'],
            ['Action-Beneficiary', 'BF', 'i-, paN-, pag- \u2014 the person it is for takes ing'],
            ['Locative / directional', 'LF', '-an or i- \u2014 the place or goal takes ing'],
            ['Instrumental', 'IF', 'pag-/pan- with i- \u2014 the thing used takes ing'],
            ['Place-forms', 'pi-', 'pi-, pipan-, pipag- \u2014 "a place where..."'],
            ['Stative', 'mi- / ka-', 'the ing phrase is in a state; ka- often causative'],
            ['Recent completion', 'ka- + doubling', 'just this minute finished; usually with pa']
        ]},
        { title: 'The -an verb classes', items: [
            ['List A', 'A', '-an drops, no vowel change: aus \u2192 inaus'],
            ['List B', 'B', '-an stays, no vowel change: alila \u2192 inalilan'],
            ['List C', 'C', '-an drops, vowel changes: buklat \u2192 biklat, sali \u2192 seli'],
            ['List D', 'D', '-an stays, vowel changes: busbus \u2192 bisbusan']
        ]},
        { title: 'Sound changes', items: [
            ['u \u2192 i', 'u to i', 'buklat \u2192 biklat, kutang \u2192 kitnan'],
            ['a \u2192 e', 'a to e', 'sali \u2192 seli, mag- \u2192 meg-, maN- \u2192 meN-'],
            ['paN- + p, b', 'pam-', 'balbas \u2192 mamalbas'],
            ['paN- + t, d', 'pan-', 'damdam \u2192 panamdam'],
            ['paN- + k, g', 'pang-', 'kutang \u2192 mangutang'],
            ['s, d \u2192 y', 'after mang-/pang-', 'sali \u2192 panyali, danum \u2192 panyanuman'],
            ['d \u2192 r', 'between vowels', 'dakal \u2192 marakal, ding \u2192 ring'],
            ['final -e \u2192 -ay', 'before a suffix', 'abe \u2192 abayan'],
            ['final -o \u2192 -aw', 'before a suffix', 'laso \u2192 lasawan'],
            ['glottal \u2192 y, w', '', 'abak \u2192 mayap a yabak']
        ]},
        { title: 'Non-verbal predication', items: [
            ['ati', 'A-ti', 'BE \u2014 is present, is located; takes yu / lu'],
            ['atin', 'A-tin', 'HAVE \u2014 takes the short pronouns plus -ng'],
            ['ala', 'A-la', 'negates both'],
            ['mika-', 'mi-KA', 'another HAVE construction'],
            ['aliwa', 'a-li-WA', 'other \u2014 negates identity'],
            ['ali', 'a-LI', 'can stand for a whole predicate']
        ]},
        { title: 'Lexical particles', items: [
            ['na', 'na', 'now, already'],
            ['pa', 'pa', 'still, yet'],
            ['mu', 'mu', 'only, just'],
            ['man', 'man', 'even'],
            ['pin', 'pin', 'indeed, for sure'],
            ['pala', 'pa-LA', 'realisation \u2014 oh, that\u2019s right'],
            ['kanu', 'ka-NU', 'reportedly, so they say'],
            ['sana', 'SA-na', 'hope, unrealised wish'],
            ['yata', 'ya-TA', 'probably, it seems'],
            ['kaya', 'ka-YA', 'I wonder, how about'],
            ['wari', 'WA-ri', 'question marker'],
            ['rugu', 'RU-gu', 'sympathy or humility'],
            ['galang', 'GA-lang', 'respect']
        ]},
        { title: 'Particle order', items: [
            ['rank 1', '1', 'mu, kanu, rugu'],
            ['rank 2', '2', 'na, pa, pin, yata, sana'],
            ['rank 3', '3', 'man, pala, kaya'],
            ['rank 4', '4', 'galang'],
            ['rank 5', '5', 'wari'],
            ['Ali na pa mu sana', '', 'four particles stacked \u2014 Forman\u2019s maximum']
        ]},
        { title: 'Relators', items: [
            ['at, at saka, ampo', '', 'and'],
            ['dapot, pero, oneng', '', 'but'],
            ['u / o', '', 'or'],
            ['uling, kasi', '', 'because'],
            ['nung, istung, pota', '', 'if, when'],
            ['agyang, maski', '', 'even though'],
            ['bayu, kabang, angga', '', 'before, while, until'],
            ['ban, inya', '', 'so that']
        ]},
        { title: 'Deictics (Bergaño)', items: [
            ['ini / keni', 'i-NI', 'a place mine alone'],
            ['iti / keti', 'i-TI', 'a place common to us both'],
            ['iyan / keyan, ken', 'i-YAN', 'near you'],
            ['ita / keta', 'i-TA', 'further off'],
            ['niti, nini, nita, niyan', '', 'the ning-case forms'],
            ['kaniti, kanini, kanita, kanyan', '', 'the king-case forms'],
            ['oiti, oini, oita, oyan', '', 'presentatives \u2014 here it is'],
            ['ninuman, nanuman', '', 'whosoever, whatever'],
            ['ninuninu, nanunanu', '', 'everybody, all sorts of things']
        ]},
        { title: 'Comparison', items: [
            ['mising-', 'MI-sing', 'equal: both phrases ing-marked'],
            ['king / keng', 'king', 'than \u2014 marks the standard'],
            ['mas', 'mas', 'more (optional, Spanish)'],
            ['kesa', 'KE-sa', 'than (optional, Spanish)'],
            ['peka-', 'PE-ka', 'most'],
            ['ka- + root', 'ka', 'emphatic: Kasanting! Katas mu!']
        ]},
        { title: 'Minor sentences', items: [
            ['Dios pu', 'di-YOS pu', 'announcing yourself at a gate'],
            ['Kumusta abe?', 'ku-mus-TA A-be', 'how are you, friend?'],
            ['Muduran ya', 'mu-DU-ran ya', 'it is raining'],
            ['Aray!', 'a-RAY', 'ouch!'],
            ['Aru!', 'a-RU', 'wow! hey!'],
            ['Naku!', 'na-KU', 'mother of mine! (dismay)'],
            ['Wa pin', 'wa pin', 'yes indeed'],
            ['Wa pala', 'wa pa-LA', 'oh yes, that\u2019s right'],
            ['Wa rugu', 'wa RU-gu', 'yes [with sympathy]']
        ]},
        { title: 'Old orthography', items: [
            ['c before a, o, u', 'c', 'modern k \u2014 Capampangan'],
            ['qu before e, i', 'qu', 'modern k \u2014 queni, queti'],
            ['qng', 'qng', 'modern king'],
            ['co', 'co', 'modern ko / ku'],
            ['Guagua', 'GWA-gwa', 'the town also written Wawa']
        ]}
    ];

    function esc(s) {
        return String(s).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }

    var root = document.getElementById('cheatsheet-root');
    if (!root) return;

    root.innerHTML = SHEET.map(function (cat) {
        var rows = cat.items.map(function (it) {
            return '<div class="cs-row">' +
                '<div class="cs-tl"><span data-speak="' + esc(it[0]) + '">' + esc(it[0]) + '</span></div>' +
                '<div class="cs-pron">' + esc(it[1]) + '</div>' +
                '<div class="cs-en">' + esc(it[2]) + '</div>' +
            '</div>';
        }).join('');
        return '<section class="cs-card"><h3 class="cs-cat">' + esc(cat.title) +
            '<button type="button" class="cs-cat-practice" data-cat="' + esc(cat.title) + '" ' +
            'aria-label="Practice ' + esc(cat.title) + ' flashcards" title="Practice these">🃏</button>' +
            '</h3>' + rows + '</section>';
    }).join('');

    var total = SHEET.reduce(function (n, c) { return n + c.items.length; }, 0);
    var count = document.getElementById('cs-count');
    if (count) count.textContent = total + ' essential phrases across ' + SHEET.length + ' situations';

    /* ---------- flashcard practice ----------
       Flip through every phrase (front = Kapampangan + pronunciation, back = English).
       Reuses the .lx-flash modal styles from learn.css. Browse-only: the cheat
       sheet is a quick reference, not tied to the spaced-repetition deck. */
    var DECK = [];
    SHEET.forEach(function (cat) { cat.items.forEach(function (it) { DECK.push({ kp: it[0], pron: it[1], en: it[2], cat: cat.title }); }); });

    function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }

    function openFlashcards(deck, title) {
        if (!deck.length) return;
        var i = 0, flipped = false;
        var overlay = document.createElement('div');
        overlay.className = 'lx-modal';
        overlay.innerHTML =
            '<div class="lx-flash" role="dialog" aria-modal="true" aria-label="Flashcard practice">' +
                '<div class="lx-flash-head"><h3>' + esc(title) + '</h3>' +
                    '<button type="button" class="lx-flash-close" aria-label="Close">&times;</button></div>' +
                '<div class="lx-flash-card"><div class="lx-flash-face"></div>' +
                    '<div class="lx-flash-hint">Tap the card to flip</div></div>' +
                '<div class="lx-flash-controls">' +
                    '<button type="button" class="lx-btn lx-flash-prev">← Prev</button>' +
                    '<span class="lx-flash-progress"></span>' +
                    '<button type="button" class="lx-btn lx-flash-next">Next →</button>' +
                '</div>' +
            '</div>';
        document.body.appendChild(overlay);

        var faceEl = overlay.querySelector('.lx-flash-face');
        var progEl = overlay.querySelector('.lx-flash-progress');
        function render() {
            var w = deck[i];
            if (!flipped) {
                faceEl.innerHTML = '<div class="lx-flash-front"><span data-speak="' + esc(w.kp) + '">' + esc(w.kp) + '</span></div>' +
                    (w.pron ? '<div class="lx-flash-pron">' + esc(w.pron) + '</div>' : '') +
                    (w.cat ? '<div class="lx-flash-hint" style="margin-top:.3rem">' + esc(w.cat) + '</div>' : '');
            } else {
                faceEl.innerHTML = '<div class="lx-flash-back">' + esc(w.en) + '</div>';
            }
            progEl.textContent = (i + 1) + ' / ' + deck.length;
        }
        function go(d) { i = (i + d + deck.length) % deck.length; flipped = false; render(); }
        function close() { overlay.remove(); document.removeEventListener('keydown', onKey); }
        overlay.querySelector('.lx-flash-card').addEventListener('click', function () { flipped = !flipped; render(); });
        overlay.querySelector('.lx-flash-next').addEventListener('click', function () { go(1); });
        overlay.querySelector('.lx-flash-prev').addEventListener('click', function () { go(-1); });
        overlay.querySelector('.lx-flash-close').addEventListener('click', close);
        overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
        function onKey(e) {
            if (e.key === 'Escape') close();
            else if (e.key === 'ArrowRight') go(1);
            else if (e.key === 'ArrowLeft') go(-1);
            else if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); flipped = !flipped; render(); }
        }
        document.addEventListener('keydown', onKey);
        render();
    }

    var practiceBtn = document.querySelector('.cs-practice');
    if (practiceBtn) practiceBtn.addEventListener('click', function () {
        openFlashcards(shuffle(DECK), 'Cheat sheet · ' + DECK.length + ' phrases');
    });

    // Per-category practice (delegated on the grid).
    root.addEventListener('click', function (e) {
        var b = e.target.closest('.cs-cat-practice');
        if (!b) return;
        var cat = b.getAttribute('data-cat');
        var deck = DECK.filter(function (w) { return w.cat === cat; });
        if (deck.length) openFlashcards(shuffle(deck), cat + ' · ' + deck.length + ' phrases');
    });
})();
