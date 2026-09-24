/* cheatsheet.js — renders the printable "most common phrases" cheat sheet.

   A curated (not exhaustive) set of the everyday survival phrases a traveller or
   new learner reaches for first, grouped by situation. Each phrase gets an audio
   button (via audio.js `data-speak`); the layout is print-optimised so it prints
   cleanly onto a couple of pages. Data lives here so it is easy to hand-edit. */
(function () {
    'use strict';

    var SHEET = [
        { title: 'Old orthography', items: [
            ['c', 'k', 'before a, o, u \u2014 catauan = katawan'],
            ['qu', 'k', 'before e, i \u2014 queni = keni'],
            ['gu', 'g', 'before e, i \u2014 guinu = ginu'],
            ['u', 'w', 'between vowels'],
            ['o', 'u', 'often, in final syllables \u2014 asboc = asbuk'],
            ['\u00f1y', 'ny', 'ma\u00f1yulat = manyulat'],
            ['\u00f1g', 'ng', 'Capampa\u00f1gan = Kapampangan']
        ]},
        { title: 'Berga\u00f1o\u2019s accent marks', items: [
            ['(pp.)', 'pp', 'penultimate accent'],
            ['(a.) (pc.)', 'a', 'acute \u2014 final accent'],
            ['(g.)', 'g', 'guttural'],
            ['(cort.)', 'cort', 'clipped'],
            ['(dipht.)', 'dipht', 'diphthong'],
            ['P. 1.', 'P1', 'first passive \u2014 the i- passive'],
            ['P. 2.', 'P2', 'second passive \u2014 the -an passive']
        ]},
        { title: 'His terms', items: [
            ['ra\u00edz', 'raiz', 'root'],
            ['part\u00edcula', 'particula', 'affix'],
            ['activa', 'activa', 'actor focus'],
            ['pasiva', 'pasiva', 'goal / locative / benefactive focus'],
            ['protocompuesto', 'proto', 'the maN- / paN- derivation'],
            ['verbo neutro', 'neutro', 'intransitive or stative'],
            ['frecuentativo', 'frec', 'repeated or habitual action']
        ]},
        { title: 'The three passives', items: [
            ['pasiva de i', 'i-', 'prefixed i \u2014 Forman\u2019s goal focus with i-'],
            ['pasiva de an', '-an', 'suffixed an \u2014 goal, locative, benefactive'],
            ['pasiva de anan', '-anan', 'suffixed anan; an often stands for it'],
            ['isulat / sinulat', '', 'future / preterite of the first passive'],
            ['iaral / inaral', '', 'the same, vowel-initial root']
        ]},
        { title: 'Protocompuestos', items: [
            ['vowel, l, n, ng', 'attach', 'aral \u2192 manaral'],
            ['b, p, m', 'becomes m', 'paco \u2192 mamaco'],
            ['g, c, q', 'becomes ng', 'calas \u2192 mangalas'],
            ['y', 'becomes \u00f1y', 'yaus \u2192 ma\u00f1yaus'],
            ['d, s', 'become y', 'sulat \u2192 ma\u00f1yulat'],
            ['t', 'always lost', 'tulac \u2192 manulac'],
            ['second d or s in root', 'first drops, n enters', 'daldac \u2192 manaldac'],
            ['present', 'stress the particle', 'm\u00e1naral'],
            ['future', 'stress the penultimate', 'man\u00e1ral']
        ]},
        { title: 'Reduplication', items: [
            ['doubled root', 'diminishes', 'matamad-tamad \u2014 a bit lazy'],
            ['doubled root', 'piecemeal', 'sulat-sulat \u2014 bits of writing'],
            ['doubled twice', 'insistent', 'kikiling-kiling \u2014 over and over'],
            ['with pronoun between', 'careless', 'kine ku neng kinay'],
            ['disyllabic root', 'double it whole', ''],
            ['trisyllabic root', 'double the second syllable', ''],
            ['following vowel not a', 'insert a', 'balictad \u2192 balabalictad']
        ]},
        { title: 'The six senses of maca-', items: [
            ['de perfecci\u00f3n', 'perf', 'has done, has finished'],
            ['potencial', 'pot', 'can, is able to'],
            ['de engorro', 'eng', 'is a bother'],
            ['causal', 'caus', 'causes \u2014 makatamad'],
            ['de estar', 'est', 'is in a state \u2014 makasalikut'],
            ['de intensi\u00f3n', 'int', 'is very'],
            ['maca- vs sukat', '', 'proximate only vs proximate and remote']
        ]},
        { title: 'Active and passive particles', items: [
            ['ma-', 'pa-', ''],
            ['mi-', 'pi-', ''],
            ['man-', 'pan-', ''],
            ['maca-', 'paca-', ''],
            ['maqui-', 'paqui-', '']
        ]},
        { title: 'Numerals', items: [
            ['isa / metung', '1', 'reciting / individuating'],
            ['labing + digit', '11-19', 'labin metung, not labin isa'],
            ['digit + polo', 'tens', 'aduang polo = 20'],
            ['dinalan', '100', 'a round hundred only; otherwise dalan'],
            ['lacsa', '10,000', ''],
            ['cata-cata', 'innumerable', ''],
            ['meca- + next decade', 'intermediates', 'mecatlon metung = 21, not 31'],
            ['ca- + digit', 'ordinals', 'cadua = second'],
            ['balang + ordinal', 'every nth', 'balang capolo = every tenth']
        ]},
        { title: 'Berga\u00f1o\u2019s chapter map', items: [
            ['Ch. I', 'markers, pronouns', 'declensions, demonstratives, interrogatives'],
            ['Ch. II', 'be, be at, have', 'ser, estar, haber'],
            ['Ch. III-IV', 'conjugations', 'active and the three passives'],
            ['Ch. V', 'protocompuestos', 'plus frequentatives'],
            ['Ch. VI-X', 'particles', 'mag, mi, maqui, ma, ca'],
            ['Ch. XI-XIV', 'maca, pa, various', 'plus maguin, si, pasi'],
            ['Ch. XV', 'adverbs', 'ten sections, incl. interjections and irony'],
            ['Ch. XVII', 'numerals', 'cardinals, ordinals, distributives, money'],
            ['Ch. XVIII', 'accents', 'reduplications, syncopes, letter changes']
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
