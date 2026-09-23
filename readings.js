/* readings.js — graded Kapampangan dialogues & reading passages that recycle
   vocabulary from across the lessons. Standalone (like glossary.js /
   cheatsheet.js): renders from the DIALOGUES data below, wires audio via
   data-speak (audio.js adds the 🔊 buttons), a hide-English comprehension
   toggle, an optional "Play all" (only when a TTS voice is installed), and
   check-your-understanding questions with a self-contained answer checker. */
(function () {
    'use strict';

    /* ---- content: each piece recycles earlier lessons' words ---- */
    var DIALOGUES = [
        {
            id: 'greetings',
            title: 'Mayap a Abak!',
            en_title: 'Good Morning!',
            kind: 'Dialogue',
            scene: 'Two people meet for the first time outside a house in Angeles City.',
            recycles: [2, 4, 7],
            lines: [
                { sp: 'Ana', kp: 'Mayap a abak pu!', en: 'Good morning!' },
                { sp: 'Ben', kp: 'Mayap a abak. Komusta ka?', en: 'Good morning. How are you?' },
                { sp: 'Ana', kp: 'Mayap ku naman, salamat. Ika?', en: "I'm fine, thank you. And you?" },
                { sp: 'Ben', kp: 'Mayap ku naman. Nanung lagyu mu?', en: "I'm fine too. What is your name?" },
                { sp: 'Ana', kp: 'Ana ya ing lagyu ku. Ika?', en: 'My name is Ana. And you?' },
                { sp: 'Ben', kp: 'Ben ya ing lagyu ku. Taga-Angeles ku.', en: "My name is Ben. I'm from Angeles." },
                { sp: 'Ana', kp: 'Masanting! Kaluguran ta na.', en: "Wonderful! We're friends now." }
            ],
            questions: [
                { q: 'How does Ana greet Ben? (three words)', a: 'mayap a abak', hint: '"___ pu!"' },
                { q: 'What does Ben ask for, after saying he is fine? (one word)', a: 'lagyu|name', hint: '"Nanung ___ mu?"' },
                { q: 'Which particle does Ana add to be polite?', a: 'pu', hint: 'Two letters.' }
            ]
        },
        {
            id: 'palengke',
            title: 'King Palengke',
            en_title: 'At the Market',
            kind: 'Dialogue',
            scene: 'Buying bananas at a market stall in San Fernando.',
            recycles: [8, 14, 17, 18],
            lines: [
                { sp: 'Lita', kp: 'Mayap a abak pu! Magkanu la reng saging?', en: 'Good morning! How much are the bananas?' },
                { sp: 'Tindera', kp: 'Limang piso ya ing metung.', en: 'Five pesos each.' },
                { sp: 'Lita', kp: 'Mal ya naman pu. Pakitawad naman.', en: "That's a bit expensive. Could you lower it a little?" },
                { sp: 'Tindera', kp: 'Sige, apat a piso.', en: 'All right, four pesos.' },
                { sp: 'Lita', kp: 'Salamat pu. Bisa kung lima.', en: "Thank you. I'd like five." },
                { sp: 'Tindera', kp: 'Aduang pulu a piso sablan.', en: 'Twenty pesos altogether.' },
                { sp: 'Lita', kp: 'Ini ing bayad ku.', en: "Here's my payment." },
                { sp: 'Tindera', kp: 'Dakal a salamat pu!', en: 'Thank you very much!' }
            ],
            questions: [
                { q: 'What is the first price the vendor gives? (the number word)', a: 'lima|limang|five', hint: '"___ piso ya ing metung."' },
                { q: 'What price does she settle on? (the number word)', a: 'apat|four', hint: '"Sige, ___ a piso."' },
                { q: 'How does Lita say "it is expensive"? (one word)', a: 'mal', hint: '"___ ya naman pu."' },
                { q: 'What is the total? (the number phrase, two words)', a: 'aduang pulu|twenty', hint: '"___ a piso sablan."' }
            ]
        },
        {
            id: 'pamilya',
            title: 'Ing Pamilya Ku',
            en_title: 'My Family',
            kind: 'Short passage',
            scene: 'A short self-introduction of the kind you might give when you meet someone new.',
            recycles: [4, 7, 10, 15],
            lines: [
                { kp: 'Ini ing pamilya ku.', en: 'This is my family.' },
                { kp: 'Ati kung ibpa, indu, ampong aduang kapatad.', en: 'I have a father, a mother, and two siblings.' },
                { kp: 'Mestru ya ing ibpa ku.', en: 'My father is a teacher.' },
                { kp: 'Masanting a tau ing indu ku.', en: 'My mother is a fine person.' },
                { kp: 'Ati kung metung a koya ampong metung a atsi.', en: 'I have one older brother and one older sister.' },
                { kp: 'Ati kami king Pampanga.', en: 'We are in Pampanga.' },
                { kp: 'Kaluguran ke ing pamilya ku.', en: 'I love my family.' }
            ],
            questions: [
                { q: 'How many siblings does the speaker have? (the number word)', a: 'adua|aduang|two', hint: '"... ampong ___ kapatad."' },
                { q: 'What is the father’s job? (one word)', a: 'mestru|teacher', hint: '"___ ya ing ibpa ku."' },
                { q: 'Which fused pronoun appears in the last line?', a: 'ke', hint: 'ku + ya, from lesson 5.' }
            ]
        },
        {
            id: 'pamangan',
            title: 'Mangan Tana!',
            en_title: "Let's Eat!",
            kind: 'Dialogue',
            scene: 'A neighbour is invited in for a meal. Sisig is involved.',
            recycles: [9, 16, 17],
            lines: [
                { sp: 'Rosa', kp: 'Mangan tana! Ati kaming sisig.', en: "Let's eat! We have sisig." },
                { sp: 'Mario', kp: 'Salamat pu! Danup ku naman.', en: "Thank you! I am hungry, actually." },
                { sp: 'Rosa', kp: 'Bisa kang nasi?', en: 'Would you like rice?' },
                { sp: 'Mario', kp: 'Wa pu, salamat.', en: 'Yes please, thank you.' },
                { sp: 'Mario', kp: 'Maniaman ya! Ninu ing meglutu?', en: 'It is delicious! Who cooked?' },
                { sp: 'Rosa', kp: 'Ing indu ku. Mabanglu ya, ali wa?', en: "My mother. It smells wonderful, doesn't it?" },
                { sp: 'Mario', kp: 'Wa pu. Busug ku na. Dakal a salamat!', en: "Yes. I'm full now. Thank you very much!" }
            ],
            questions: [
                { q: 'What dish are they eating?', a: 'sisig', hint: 'Pampanga’s most famous export.' },
                { q: 'How does Mario say "delicious"? (one word)', a: 'maniaman', hint: '"___ ya!"' },
                { q: 'What is the completed form of "cooked" in the passage?', a: 'meglutu', hint: 'mag- becomes meg-.' },
                { q: 'How does Mario say he is full? (one word)', a: 'busug', hint: '"___ ku na."' }
            ]
        },
        {
            id: 'pista',
            title: 'Ing Ligligan Parul',
            en_title: 'The Giant Lantern Festival',
            kind: 'Short passage',
            scene: 'A description of San Fernando in December, using the culture vocabulary from lesson 20.',
            recycles: [11, 15, 19, 20],
            lines: [
                { kp: 'Kapilan ya ing Ligligan Parul? Dominggo bayu ing Pasku.', en: 'When is the Giant Lantern Festival? The Sunday before Christmas.' },
                { kp: 'Maragul la reng parul.', en: 'The lanterns are big.' },
                { kp: 'Masanting la, at malutu, dilo ampong berde la.', en: 'They are beautiful, and they are red, yellow and green.' },
                { kp: 'Dakal a tau ing datang king San Fernando.', en: 'Many people come to San Fernando.' },
                { kp: 'Marimla ya ing bengi, pero matula la ring tau.', en: 'The night is cold, but the people are happy.' },
                { kp: 'Ini ing pista ning Kapampangan.', en: 'This is the fiesta of the Kapampangan.' }
            ],
            questions: [
                { q: 'Where is the festival held?', a: 'san fernando', hint: '"... king ___."' },
                { q: 'How does the passage describe the lanterns’ size? (one word)', a: 'maragul|big', hint: '"___ la reng parul."' },
                { q: 'Which word means "cold"?', a: 'marimla', hint: '"___ ya ing bengi."' },
                { q: 'Which word means "happy"?', a: 'matula', hint: '"... pero ___ la ring tau."' }
            ]
        }
    ];

    var TITLES = (window.KAPAMPANGAN_VOCAB && window.KAPAMPANGAN_VOCAB.titles) || {};

    function esc(s) {
        return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }
    function norm(s) {
        return (s || '').trim().toLowerCase().replace(/[.!?,;:]+$/, '').replace(/\s+/g, ' ');
    }

    function chip(n) {
        var t = TITLES[n] ? ' — ' + TITLES[n] : '';
        return '<a class="rd-chip" href="kapampangan_lesson_' + n + '.html" title="Lesson ' + n + esc(t) + '">Lesson ' + n + '</a>';
    }

    function lineHTML(l) {
        var sp = l.sp ? '<span class="rd-sp">' + esc(l.sp) + '</span>' : '';
        return '<div class="rd-line' + (l.sp ? '' : ' rd-line-narr') + '">' +
            sp +
            '<div class="rd-line-body">' +
            '<p class="rd-tl"><span data-speak="' + esc(l.kp) + '">' + esc(l.kp) + '</span></p>' +
            '<p class="rd-en">' + esc(l.en) + '</p>' +
            '</div></div>';
    }

    function qHTML(q, i) {
        return '<li class="rd-q" data-answer="' + esc(q.a) + '">' +
            '<p class="rd-q-text">' + esc(q.q) + '</p>' +
            '<div class="rd-q-row">' +
            '<input type="text" class="rd-q-input" autocomplete="off" autocapitalize="none" spellcheck="false" aria-label="Your answer">' +
            '<button type="button" class="lx-btn lx-btn-primary rd-q-check">Check</button>' +
            '<button type="button" class="lx-btn rd-q-reveal">Show answer</button>' +
            '</div>' +
            '<p class="rd-q-fb" role="status"></p>' +
            (q.hint ? '<p class="rd-q-hint">Hint: ' + esc(q.hint) + '</p>' : '') +
            '</li>';
    }

    function cardHTML(d) {
        return '<article class="rd-card" id="rd-' + esc(d.id) + '">' +
            '<header class="rd-head">' +
            '<span class="rd-kind">' + esc(d.kind) + '</span>' +
            '<h2 class="rd-title"><span data-speak="' + esc(d.title) + '">' + esc(d.title) + '</span>' +
            ' <span class="rd-title-en">' + esc(d.en_title) + '</span></h2>' +
            '<p class="rd-scene">' + esc(d.scene) + '</p>' +
            '<p class="rd-recycles">Recycles: ' + d.recycles.map(chip).join(' ') + '</p>' +
            '<div class="rd-controls">' +
            '<button type="button" class="lx-btn rd-toggle-en" aria-pressed="false">Hide English</button>' +
            '<button type="button" class="lx-btn rd-playall" hidden>&#9654; Play all</button>' +
            '</div>' +
            '</header>' +
            '<div class="rd-lines">' + d.lines.map(lineHTML).join('') + '</div>' +
            '<div class="rd-quiz"><h3 class="rd-quiz-title">Check your understanding</h3>' +
            '<ol class="rd-qs">' + d.questions.map(qHTML).join('') + '</ol></div>' +
            '</article>';
    }

    /* ---- self-contained "Play all" (only if a TTS voice exists) ---- */
    function pickVoice() {
        var synth = window.speechSynthesis;
        if (!synth) return null;
        var voices = synth.getVoices() || [];
        var saved;
        try { saved = localStorage.getItem('kapampangan-tts-voice'); } catch (e) { saved = null; }
        if (saved) { var m = voices.filter(function (v) { return v.voiceURI === saved; })[0]; if (m) return m; }
        var order = [/fil/i, /tl[-_]/i, /kapampangan/i, /^tl$/i, /es[-_]/i, /spanish/i];
        for (var i = 0; i < order.length; i++) {
            var v = voices.filter(function (vv) { return order[i].test(vv.lang) || order[i].test(vv.name); })[0];
            if (v) return v;
        }
        return null;
    }
    function savedRate() {
        try { return parseFloat(localStorage.getItem('kapampangan-tts-rate')) || 0.9; } catch (e) { return 0.9; }
    }
    function playAll(card, btn) {
        var synth = window.speechSynthesis;
        var voice = pickVoice();
        if (!synth || !voice) return;
        synth.cancel();
        var lines = Array.prototype.map.call(card.querySelectorAll('.rd-tl [data-speak]'), function (el) { return el.getAttribute('data-speak'); });
        var rate = savedRate(), i = 0;
        btn.classList.add('rd-playing');
        function next() {
            if (i >= lines.length) { btn.classList.remove('rd-playing'); return; }
            var u = new SpeechSynthesisUtterance(lines[i++]);
            u.voice = voice; u.lang = voice.lang; u.rate = rate;
            u.onend = next; u.onerror = next;
            synth.speak(u);
        }
        next();
    }

    /* ---- boot ---- */
    document.addEventListener('DOMContentLoaded', function () {
        var root = document.getElementById('readings-root');
        if (!root) return;
        root.innerHTML = DIALOGUES.map(cardHTML).join('');

        var count = document.getElementById('rd-count');
        if (count) {
            var qs = DIALOGUES.reduce(function (n, d) { return n + d.questions.length; }, 0);
            count.textContent = DIALOGUES.length + ' passages · ' + qs + ' comprehension questions';
        }

        var audioReady = window.CourseAudio && window.CourseAudio.available && window.CourseAudio.available();
        if (audioReady) {
            Array.prototype.forEach.call(root.querySelectorAll('.rd-playall'), function (b) { b.hidden = false; });
        }

        root.addEventListener('click', function (e) {
            var t = e.target;

            var tog = t.closest('.rd-toggle-en');
            if (tog) {
                var card = tog.closest('.rd-card');
                var hidden = card.classList.toggle('rd-hide-en');
                tog.setAttribute('aria-pressed', String(hidden));
                tog.textContent = hidden ? 'Show English' : 'Hide English';
                return;
            }

            var pa = t.closest('.rd-playall');
            if (pa) { playAll(pa.closest('.rd-card'), pa); return; }

            var chk = t.closest('.rd-q-check');
            if (chk) {
                var li = chk.closest('.rd-q');
                var input = li.querySelector('.rd-q-input');
                var fb = li.querySelector('.rd-q-fb');
                var alts = li.getAttribute('data-answer').split('|').map(norm);
                var ok = alts.indexOf(norm(input.value)) >= 0;
                li.classList.toggle('rd-correct', ok);
                li.classList.toggle('rd-wrong', !ok);
                fb.textContent = ok ? 'Tama! (Correct!) 🎉' : 'Not quite — try again, or reveal the answer.';
                return;
            }

            var rev = t.closest('.rd-q-reveal');
            if (rev) {
                var li2 = rev.closest('.rd-q');
                var ans = li2.getAttribute('data-answer').split('|')[0];
                var input2 = li2.querySelector('.rd-q-input');
                input2.value = ans;
                li2.classList.remove('rd-wrong');
                li2.classList.add('rd-correct');
                li2.querySelector('.rd-q-fb').textContent = 'Answer: ' + ans;
                return;
            }
        });

        root.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' && e.target.classList.contains('rd-q-input')) {
                e.preventDefault();
                var btn = e.target.closest('.rd-q').querySelector('.rd-q-check');
                if (btn) btn.click();
            }
        });
    });
})();
