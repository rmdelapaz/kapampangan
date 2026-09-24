/* cheatsheet.js — renders the printable "most common phrases" cheat sheet.

   A curated (not exhaustive) set of the everyday survival phrases a traveller or
   new learner reaches for first, grouped by situation. Each phrase gets an audio
   button (via audio.js `data-speak`); the layout is print-optimised so it prints
   cleanly onto a couple of pages. Data lives here so it is easy to hand-edit. */
(function () {
    'use strict';

    var SHEET = [
        { title: 'Greetings & Courtesy', items: [
            ['Mayap a abak', 'MA-yap a A-bak', 'Good morning'],
            ['Mayap a ugtu', 'MA-yap a UG-tu', 'Good noon'],
            ['Mayap a gatpanapun', 'MA-yap a gat-pa-NA-pun', 'Good afternoon'],
            ['Mayap a bengi', 'MA-yap a BE-ngi', 'Good evening'],
            ['Komusta ka?', 'ko-mus-TA ka', 'How are you?'],
            ['Mayap ku naman', 'MA-yap ku na-MAN', "I'm fine"],
            ['Salamat', 'sa-LA-mat', 'Thank you'],
            ['Dakal a salamat pu', 'DA-kal a sa-LA-mat pu', 'Thank you very much (polite)'],
            ['Wa', 'wah', 'Yes'],
            ['Opu', 'o-PU', 'Yes (polite)'],
            ['Ali', 'a-LI', 'No'],
            ['Pasensya na pu', 'pa-SEN-sya na pu', 'Sorry / excuse me (polite)'],
            ['Nanung lagyu mu?', 'NA-nung LAG-yu mu', "What is your name?"],
            ['Kaluguran daka', 'ka-lu-GU-ran da-KA', 'I love you']
        ]},
        { title: 'The Markers', items: [
            ['ing', 'ing', 'marks the noun in focus'],
            ['ning', 'ning', 'marks a doer that is not in focus'],
            ['king', 'king', 'to, at, in, for'],
            ['deng / ding', 'deng', 'plural of ing'],
            ['reng / ring', 'reng', 'plural of ning'],
            ['karing', 'ka-RING', 'plural of king'],
            ['i', 'ee', "marks a person's name, in focus"],
            ['nang', 'nang', "marks a person's name as doer"],
            ['kang', 'kang', 'to / for a named person'],
            ['di / ri', 'dee', 'a named person and their company']
        ]},
        { title: 'Pronouns — subject set', items: [
            ['yaku / ku', 'YA-ku', 'I'],
            ['ika / ka', 'i-KA', 'you'],
            ['iya / ya', 'i-YA', 'he, she, it'],
            ['ikata / kata', 'i-KA-ta', 'we two — you and I'],
            ['ikatamu / katamu', 'i-ka-TA-mu', 'we, including you'],
            ['ikami / kami', 'i-ka-MI', 'we, excluding you'],
            ['ikayu / kayu', 'i-KA-yu', 'you (plural)'],
            ['ila / la', 'i-LA', 'they']
        ]},
        { title: 'Pronouns — doer & oblique', items: [
            ['ku', 'ku', 'my / by me'],
            ['mu', 'mu', 'your / by you'],
            ['na', 'na', 'his, her / by him, her'],
            ['mi', 'mi', 'our (excl.) / by us'],
            ['tamu', 'TA-mu', 'our (incl.) / by us'],
            ['yu', 'yu', 'your (pl.) / by you'],
            ['da / ra', 'da', 'their / by them'],
            ['kaku', 'KA-ku', 'to me'],
            ['keka', 'KE-ka', 'to you'],
            ['keya', 'KE-ya', 'to him, to her'],
            ['karela', 'ka-RE-la', 'to them']
        ]},
        { title: 'Fused pronouns', items: [
            ['ke', 'ke', 'I ... him/her/it  (ku + ya)'],
            ['ko', 'ko', 'I ... them  (ku + la)'],
            ['da ka', 'da ka', 'I ... you  (irregular)'],
            ['me', 'me', 'you ... him/her/it  (mu + ya)'],
            ['mo', 'mo', 'you ... them  (mu + la)'],
            ['ne', 'ne', 'he/she ... him/her/it  (na + ya)'],
            ['no', 'no', 'he/she ... them  (na + la)'],
            ['te', 'te', 'we two ... him/her/it  (ta + ya)'],
            ['to', 'to', 'we two ... them  (ta + la)'],
            ['ye', 'ye', 'you all ... him/her/it  (yu + ya)'],
            ['yo', 'yo', 'you all ... them  (yu + la)'],
            ['de / re', 'de', 'they ... him/her/it  (da + ya)'],
            ['do / ro', 'do', 'they ... them  (da + la)']
        ]},
        { title: 'This, that & where', items: [
            ['iti', 'i-TI', 'this — near me, not near you'],
            ['ini', 'i-NI', 'this — near both of us'],
            ['ita', 'i-TA', 'that — near you'],
            ['iyan', 'i-YAN', 'that — away from us both'],
            ['keti', 'KE-ti', 'here — where I am'],
            ['keni', 'KE-ni', 'here — where we both are'],
            ['keta', 'KE-ta', 'there — where you are (also ken, kyan)'],
            ['karin', 'ka-RIN', 'over there — away from us both'],
            ['Nanu ini?', 'NA-nu i-NI', 'What is this?']
        ]},
        { title: 'Verbs & aspect', items: [
            ['sumulat', 'su-MU-lat', 'will write (contemplative)'],
            ['susulat', 'su-SU-lat', 'is writing (progressive) — not "will write"'],
            ['sinulat', 'si-NU-lat', 'wrote (completed)'],
            ['mangan', 'MA-ngan', 'will eat'],
            ['mamangan', 'ma-MA-ngan', 'is eating'],
            ['mengan', 'ME-ngan', 'ate'],
            ['mag- becomes meg-', 'meg', 'completed aspect of mag- verbs'],
            ['maN- becomes meN-', 'men', 'completed aspect of maN- verbs'],
            ['gawa / gewa', 'GA-wa', 'do / did'],
            ['sali / seli', 'SA-li', 'buy / bought it'],
            ['datang / dintang', 'da-TANG', 'arrive / arrived']
        ]},
        { title: 'Negation & existence', items: [
            ['ati', 'A-ti', 'there is; to have'],
            ['ala', 'A-la', 'there is not; to not have'],
            ['ali', 'a-LI', 'not (negates verbs)'],
            ['e', 'eh', 'not (short form of ali)'],
            ['ali pa', 'a-LI pa', 'not yet'],
            ['ali na', 'a-LI na', 'not any more'],
            ['E ku balu', 'e ku BA-lu', "I don't know"],
            ['Ala kung kwalta', 'A-la kung KWAL-ta', 'I have no money'],
            ['Alang problema', 'A-lang pro-BLE-ma', 'No problem']
        ]},
        { title: 'Questions', items: [
            ['nanu', 'NA-nu', 'what'],
            ['ninu', 'NI-nu', 'who'],
            ['nukarin', 'nu-KA-rin', 'where'],
            ['kapilan', 'ka-pi-LAN', 'when'],
            ['obakit', 'o-BA-kit', 'why'],
            ['kaninu', 'ka-NI-nu', 'whose, to whom'],
            ['makananu', 'ma-ka-NA-nu', 'how (by what method)'],
            ['nuanti', 'nu-AN-ti', 'how (to what degree)'],
            ['pilan', 'pi-LAN', 'how many'],
            ['magkanu', 'mag-KA-nu', 'how much (price)'],
            ['isanu', 'i-SA-nu', 'which'],
            ['wari', 'WA-ri', 'yes-or-no question particle']
        ]},
        { title: 'Numbers', items: [
            ['metung / isa', 'me-TUNG', 'one'],
            ['adua', 'a-DU-a', 'two'],
            ['atlu', 'at-LU', 'three'],
            ['apat', 'A-pat', 'four'],
            ['lima', 'li-MA', 'five'],
            ['anam', 'A-nam', 'six'],
            ['pitu', 'pi-TU', 'seven'],
            ['ualu', 'u-A-lu', 'eight'],
            ['siyam', 'si-YAM', 'nine'],
            ['apulu', 'a-PU-lu', 'ten'],
            ['aduang pulu', 'a-DU-ang PU-lu', 'twenty'],
            ['dinalan', 'di-NA-lan', 'one hundred']
        ]},
        { title: 'Describing', items: [
            ['mayap', 'MA-yap', 'good'],
            ['marok', 'ma-ROK', 'bad'],
            ['masanting', 'ma-SAN-ting', 'beautiful, fine, excellent'],
            ['maragul', 'ma-ra-GUL', 'big'],
            ['malati', 'ma-LA-ti', 'small'],
            ['mapali', 'ma-PA-li', 'hot'],
            ['marimla', 'ma-RIM-la', 'cold'],
            ['maniaman', 'ma-ni-A-man', 'delicious'],
            ['a / -ng', 'a', 'linker: a after a consonant, -ng after a vowel'],
            ['masanting a bale', 'ma-SAN-ting a BA-le', 'a beautiful house'],
            ['malagung babai', 'ma-LA-gung ba-BA-i', 'a beautiful woman']
        ]},
        { title: 'Getting things done', items: [
            ['buri', 'BU-ri', 'to like; to want (a thing)'],
            ['bisa', 'BI-sa', 'to want to (+ verb)'],
            ['kailangan', 'ka-i-LA-ngan', 'to need'],
            ['dapat', 'DA-pat', 'should, ought to'],
            ['malyari', 'mal-YA-ri', 'can, may, it is possible'],
            ['Malyari ku waring lumwal?', 'mal-YA-ri ku WA-ring lum-WAL', 'May I go out?'],
            ['pu', 'poo', 'politeness particle'],
            ['naman', 'na-MAN', 'softens a request'],
            ['Mangan tana!', 'MA-ngan TA-na', "Let's eat!"],
            ['Magkanu ya ini?', 'mag-KA-nu ya i-NI', 'How much is this?'],
            ['Pakitawad naman', 'pa-ki-TA-wad na-MAN', 'Could you lower it a bit, please']
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
