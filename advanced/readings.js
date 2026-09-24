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
            id: 'bergano-pen',
            title: 'Ing Pluma at ing Tintero',
            en_title: "Bergaño on the Demonstratives",
            kind: 'Primary source',
            scene: "Bergaño's own explanation of ini and iti, in his 1736 Spanish, with the Kapampangan he cites. This passage decided a question this course had already got wrong twice.",
            recycles: [1, 2],
            lines: [
                { kp: 'ini, iti, iyang, ita', en: 'The four demonstratives, in his spelling.' },
                { kp: 'ining pluma', en: 'this pen — the one I am writing with, in a place belonging to me alone' },
                { kp: 'iting tintero', en: 'this inkwell — if the two of us dip into one, the place is common to us both' },
                { kp: 'iyang', en: 'says the thing is near you' },
                { kp: 'ita', en: 'says more distance in the thing; that is, over there' },
                { kp: 'queni, queti, queyang, queta', en: 'the locative adverbs, each carrying its own distance' }
            ],
            questions: [
                { q: 'Which demonstrative is for a place belonging to the speaker alone?', a: 'ini', hint: 'The pen.' },
                { q: 'Which is for a place common to both?', a: 'iti', hint: 'The inkwell.' },
                { q: 'In modern spelling, queti is written how?', a: 'keti', hint: 'qu becomes k before e.' },
                { q: 'What does ita add, compared with iyang? (one word)', a: 'distance', hint: 'His word is distancia.' }
            ]
        },
        {
            id: 'entries',
            title: 'Deng Amanu king Vocabulario',
            en_title: 'Four Entries from the Vocabulario',
            kind: 'Primary source',
            scene: "Entries exactly as they stand in the English translation of Bergaño's dictionary. Note the accent classes, the derived forms, and how specific the glosses are.",
            recycles: [9, 10],
            lines: [
                { kp: 'ASBOC. (pp.)', en: 'Noun, the mouth, including the mouth of a jar or pitcher. Mayasboc, talkative, morally, the gossiper.' },
                { kp: 'PUSU. (g.)', en: 'Noun, the heart of living things, and of various fruits. Pusuan, the plant that has heart-shaped fruits, like the coconut palm, the banana.' },
                { kp: 'ANGAB. (pp.)', en: 'Be with the mouth open, like a birdling being fed by the parent bird, or an infant waiting to suck.' },
                { kp: 'BUGUS. (a.)', en: 'Adjective, scarred from little itches; in Candava there are many who have these scars. Neutral verb of Ma, to become scarred thus.' },
                { kp: 'ALUAL. (pp.)', en: 'Active verb, manalual, to clean the mouth with the tongue, like when some food remains between the molars.' }
            ],
            questions: [
                { q: 'What accent class is ASBOC? (two letters)', a: 'pp', hint: 'Penultimate.' },
                { q: 'In modern spelling, ASBOC is written how?', a: 'asbuk', hint: 'c to k, o to u.' },
                { q: 'Which root means holding the mouth open like a fed birdling?', a: 'angab', hint: 'One of the entries above.' },
                { q: 'Which town does he mention under BUGUS?', a: 'candava|Candava', hint: 'He records where a thing is common.' }
            ]
        },
        {
            id: 'maca',
            title: 'Ing Mekasulat',
            en_title: 'One Form, Four Readings',
            kind: 'Primary source',
            scene: "Bergaño's demonstration that maca- is the most ambiguous composition in the language — a single sentence with four unrelated meanings.",
            recycles: [7],
            lines: [
                { kp: 'Mekasulat ku.', en: 'I have written.' },
                { kp: 'Mekasulat ku.', en: 'I have finished writing.' },
                { kp: 'Mekasulat ku.', en: 'I wrote by mistake.' },
                { kp: 'Mekasulat ku.', en: 'I was able to write.' },
                { kp: 'Makasulat ku.', en: 'I can write. (the potential, in the present)' },
                { kp: 'Sukat yang lumakad, dapot ali ya makalakad.', en: 'He is able to walk, but he cannot walk.' }
            ],
            questions: [
                { q: 'How many readings does Bergaño give for mekasulat ku?', a: 'four|4', hint: 'Five, counting the maca of misgiving.' },
                { q: 'Which form is the present potential?', a: 'makasulat|macasulat', hint: 'Not the me- form.' },
                { q: 'Which word covers remote ability, where maca- does not?', a: 'sukat', hint: 'The man in shackles.' }
            ]
        },
        {
            id: 'redup',
            title: 'Ing Pamagdobla',
            en_title: 'Doubling Makes It Smaller',
            kind: 'Primary source',
            scene: "Bergaño's general rule for reduplication, with his examples. This is the sense the B1 tier did not give you.",
            recycles: [5],
            lines: [
                { kp: 'makuyad-kuyad', en: 'somewhat short, shortish' },
                { kp: 'mapait-pait', en: 'somewhat bitter' },
                { kp: 'matamad-tamad', en: 'somewhat lazy' },
                { kp: 'abut-abut', en: 'to barely reach' },
                { kp: 'dagdag-dagdagan', en: 'add a little' },
                { kp: 'kikiling-kiling', en: 'tilting over and over — doubled twice, so insistent' }
            ],
            questions: [
                { q: 'Does doubling a descriptive strengthen or weaken it?', a: 'weaken|weakens|diminish|diminishes', hint: 'Bergaño: disminuye su significacion.' },
                { q: 'matamad-tamad means somewhat what?', a: 'lazy', hint: 'Not very lazy.' },
                { q: 'What does doubling twice express?', a: 'insistent|insistence|repeated|again and again', hint: 'Dale y mas dale.' }
            ]
        },
        {
            id: 'interj',
            title: 'Deng Interjeksyun',
            en_title: 'Interjections, with Their Situations',
            kind: 'Primary source',
            scene: "Bergaño does not gloss his interjections — he gives the social situation that licenses each. This is pragmatics documented in 1736.",
            recycles: [12],
            lines: [
                { kp: 'Auo, aku na pa sa ngeta!', en: 'Said when you ask me for a loan at the very moment I am looking for someone to lend to me.' },
                { kp: 'Auo, e na ngeti paninapan man!', en: 'Asked whether Juan is a good student, when I know he does nothing but play.' },
                { kp: 'Acaya!', en: 'Said with a sneer, of a servant you await who I know never went.' },
                { kp: 'Ba, makananu ka?', en: 'Greeting a relative or friend not seen for a long time.' },
                { kp: 'Salamat pu king lugud mu.', en: 'Thank you for your love.' },
                { kp: 'Salamat pu king ati ka.', en: 'How good that you are here — the congratulatory use.' }
            ],
            questions: [
                { q: 'Which interjection signals that the opposite of what is sought is the case?', a: 'auo', hint: 'The loan.' },
                { q: 'Which is used ironically, with a sneer?', a: 'acaya', hint: 'Bergaño: con retintin.' },
                { q: 'Besides thanking, what does salamat do?', a: 'congratulate|congratulating|congratulation', hint: 'Salamat pu king ati ka.' },
                { q: 'Which root appears in "salamat pu king lugud mu"?', a: 'lugud', hint: 'The root behind kaluguran.' }
            ]
        }
    ];

    var TITLES = (window.KAPAMPANGAN_ADV_VOCAB && window.KAPAMPANGAN_ADV_VOCAB.titles) || {};

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
