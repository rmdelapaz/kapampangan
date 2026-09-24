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
            id: 'signs',
            title: 'Deng Pasibayu',
            en_title: 'Public Signs',
            kind: 'Authentic texts',
            scene: 'Real signage collected in Pampanga, in the older Spanish-based spelling. Work out each one before reading the translation.',
            recycles: [19, 5, 15],
            lines: [
                { kp: 'Bawal ing mugse basura queni.', en: 'Throwing garbage here is prohibited.' },
                { kp: 'Multa P5 o suculan.', en: 'A 5-peso fine, or jail.' },
                { kp: 'Bawal ing mimi queti.', en: 'Urinating here is forbidden.' },
                { kp: 'E co misusulud imalan a "sleeveless" qng pamakinabang.', en: "Don't wear sleeveless dresses to Communion." },
                { kp: 'Distancia koy.', en: 'Keep your distance, brother.' },
                { kp: 'Pot-pot bayo lusot.', en: 'Toot-toot before you cut in.' }
            ],
            questions: [
                { q: 'In the old spelling, queni is written how today?', a: 'keni', hint: 'qu before e and i becomes k.' },
                { q: 'And qng?', a: 'king', hint: 'The oblique marker.' },
                { q: 'Which word in the last sign means "before"?', a: 'bayo|bayu', hint: 'A relator from lesson 15.' },
                { q: 'In "E co misusulud", what does E do?', a: 'negates|negator|not', hint: 'It is the short negator.' }
            ]
        },
        {
            id: 'goal',
            title: 'Deng Utus',
            en_title: 'Instructions',
            kind: 'Sentence set',
            scene: 'Goal-focus imperatives from Forman. Notice how much of each sentence is a fused pronoun.',
            recycles: [1, 4],
            lines: [
                { kp: 'Patdan me ing radio.', en: 'Turn off the radio.' },
                { kp: 'Isara me ing pasbul.', en: 'Close the door.' },
                { kp: 'Ibuklat me ing libru mu.', en: 'Open your book.' },
                { kp: 'Ilaga mu reng ebun.', en: 'Boil the eggs.' },
                { kp: 'Itiltil me ing asan keng aslam.', en: 'Dip the fish into the vinegar.' },
                { kp: 'Sakmalan me ing pale.', en: 'Grab a handful of the rice.' }
            ],
            questions: [
                { q: 'The fused pronoun me is made of which two pronouns? (two words)', a: 'mu ya', hint: 'Doer plus object.' },
                { q: 'Which marker is on the thing being acted on?', a: 'ing', hint: 'The focus marker.' },
                { q: 'Ibuklat is built on which root?', a: 'buklat', hint: 'Its completed form is biklat.' }
            ]
        },
        {
            id: 'particles',
            title: 'Ing Kaibaan',
            en_title: 'The Difference a Particle Makes',
            kind: 'Contrast set',
            scene: "Forman's own frames. The word stays the same; the particle changes everything.",
            recycles: [14],
            lines: [
                { kp: 'Wa.', en: 'Yes.' },
                { kp: 'Wa pin.', en: 'Yes indeed, for sure.' },
                { kp: 'Wa pala.', en: "Oh yes, that's right, isn't it? (I'd forgotten)" },
                { kp: 'Wa kanu.', en: 'Yes, so they say.' },
                { kp: 'Wa sana.', en: 'Yes, I hope so.' },
                { kp: 'Wa rugu.', en: 'Yes [with sympathy or humility].' },
                { kp: 'Ala pa.', en: 'None yet, still none.' },
                { kp: 'Ala na.', en: 'No more, none now.' },
                { kp: 'Ali pa mu.', en: 'Not just yet.' }
            ],
            questions: [
                { q: 'Which particle marks something as second-hand information?', a: 'kanu', hint: 'So they say.' },
                { q: 'Which particle marks a sudden realisation?', a: 'pala', hint: "Oh, that's right." },
                { q: 'Which particle adds sympathy?', a: 'rugu', hint: 'Forman glosses it in brackets.' },
                { q: 'In "Ala na", what does na mean?', a: 'now|already', hint: 'Its partner is pa.' }
            ]
        },
        {
            id: 'narrative',
            title: 'Metung a Salita',
            en_title: 'A Short Narrative',
            kind: 'Connected text',
            scene: "Forman's example sentences, arranged as a sequence. Watch the relators doing the joining.",
            recycles: [15, 22],
            lines: [
                { kp: 'I Suan, pintalan ne misan a yaldo i Pedro dapot e ne disan.', en: "Suan went to Pedro one day, but he didn't get to him." },
                { kp: 'Buri ra kang paglapakan oneng e ra ka agyu uling maragul ka.', en: "They'd like to beat you up, but they can't overcome you because you're big." },
                { kp: 'Masaya lang masaya ring adua king arakap dang tugak.', en: 'The two were very happy that they were able to catch a frog.' },
                { kp: 'Mayap na ing makasaup ka kang Maria.', en: "It's good that you will be able to help Maria." },
                { kp: 'Kaibatibat kung mengan.', en: 'I have just finished eating.' }
            ],
            questions: [
                { q: 'Which word in the first line means "but"?', a: 'dapot', hint: 'A relator.' },
                { q: 'And which word means "because" in the second?', a: 'uling', hint: 'Another relator.' },
                { q: 'arakap is an ability form of which root?', a: 'dakap', hint: 'The a- prefix from lesson 8.' },
                { q: 'Kaibatibat marks the action as what? (one word)', a: 'recent|just', hint: 'Lesson 7.' }
            ]
        },
        {
            id: 'exclaim',
            title: 'Deng Pamagtaka',
            en_title: 'Exclamations',
            kind: 'Minor sentences',
            scene: "Forman's emphatic descriptives and minor sentences — the ka- construction at work.",
            recycles: [12, 17],
            lines: [
                { kp: 'Kasanting na ning gayak king dalan!', en: 'How beautiful the decorations in the street are!' },
                { kp: 'Katas mu!', en: "You're so tall!" },
                { kp: 'Kanyaman ning makaduyan!', en: 'How delightful to be in a hammock!' },
                { kp: 'Kapormalan mu naman!', en: "Well, you're so very formal!" },
                { kp: 'Oita ya pala ing salamin mu!', en: "So that's where your glasses are!" },
                { kp: 'Dios pu!', en: '(announcing yourself at the gate)' }
            ],
            questions: [
                { q: 'The emphatic exclamation uses which prefix?', a: 'ka|ka-', hint: 'One syllable.' },
                { q: 'Kasanting is built on which root?', a: 'santing', hint: 'Strip the ka-.' },
                { q: 'Which particle in the glasses sentence marks realisation?', a: 'pala', hint: 'From lesson 14.' },
                { q: 'What is "Dios pu" used for? (one word)', a: 'announcing|greeting', hint: 'At a door or gate.' }
            ]
        }
    ];

    var TITLES = (window.KAPAMPANGAN_INT_VOCAB && window.KAPAMPANGAN_INT_VOCAB.titles) || {};

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
