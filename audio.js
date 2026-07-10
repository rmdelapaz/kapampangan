/* audio.js — Filipino pronunciation via the Web Speech API.

   GENERATED FILE, but standalone: the CONFIG block below is the only thing that
   differs between courses, and it is safe to edit here directly.

   Filipino is Latin script and this course has no <th> anywhere, so target columns
   are selected per table shape. Vocabulary tables put the target in the first cell;
   dialogue tables put a speaker label there and the spoken line in the second.

   If the device has no Filipino voice installed the entire layer hides itself.
   An English voice reading Filipino is worse than no audio at all. */
(function () {
    'use strict';

    var CONFIG = {
        /* Voice language prefixes, tried in order. A course may accept a related
           language as a fallback when no native voice exists. */
        langs: ['fil', 'tl', 'es'],
        /* Which of those are the real thing. Anything else triggers the fallback
           transliteration and an on-page notice. */
        nativeLangs: ['fil', 'tl'],
        /* Rewrites applied to the utterance (never the page) when speaking through a
           fallback voice, so its orthography produces the right sounds. */
        fallbackRules: [
            ['\\bng\\b', 'gi', 'nang'],
            ['h', 'g', 'j'],
            ['k(?=[ei])', 'g', 'qu'],
            ['k', 'g', 'c'],
            ['w', 'g', 'u']
        ],
        /* Stand-in language names, keyed by voice-lang prefix. */
        fallbackNames: null,
        /* Lowercase before speaking: engines spell out ALL-CAPS words letter by letter. */
        lowercase: true,
        /* Re-attach when the DOM changes, for content built by page scripts. */
        rescan: false,
        langName: 'Filipino',
        fallbackName: 'Spanish',
        addLanguageAs: 'Filipino',
        mode: 'rules',
        /* `detect` decides whether a cell holds target text; `pattern` decides what
           gets spoken. They differ where a script's punctuation should be read for
           prosody but must never, on its own, mark a cell as target text. */
        detect: null,
        pattern: null,
        strip: null,
        /* Which elements 'unicode' mode inspects. Table cells in most courses; the
           Japanese lessons hold their vocabulary in converted grid spans. */
        cellSelector: null,
        /* 'header': a table column is target text when its <th> matches this. */
        header: null,
        /* ...unless some <th> in the same row matches this, in which case the whole
           table is comparative commentary rather than phrases, and is skipped. */
        headerSkip: null,
        /* 'rules': explicit selectors, for courses whose containers disagree. */
        rules: [
            { selector: '.vocab-card > p > strong', pick: 'self' },
            { selector: '.example-phrase > p > strong', pick: 'self' },
            { selector: '.phrase-pattern > p > strong', pick: 'self' },
            { selector: '.transformation-demo > p > strong', pick: 'self' },
            { selector: '.sentence-builder > p > strong', pick: 'self' },
            { selector: '.particle-guide .pattern-demo > p > strong', pick: 'self' },
            { selector: '.transformation-demo > p > em', pick: 'self' },
            { selector: '.pattern-demo > p > em', pick: 'self' },
            { selector: '.final-challenge p > em', pick: 'self' },
            { selector: '.idiom-card > h4', pick: 'self' },
            { selector: '.vocab-card > h4', pick: 'directText' },
            { selector: '.speaker-a, .speaker-b', pick: 'quotes' },
            { selector: '.dialogue-flow > p', pick: 'quotes' },
            { selector: '.politeness-level > p', pick: 'quotes' },
            { selector: '.pattern-demo > p', pick: 'quotes' },
            { selector: '.cultural-immersion p', pick: 'quotes' },
            { selector: '.diploma-section p', pick: 'self', requireTarget: true },
            { selector: '.canvas-caption .kp-term', pick: 'self' }
        ],
        /* Does this string look like the target language? Used where a container
           holds both target text and English. */
        targetTest: '\\b(ya|ka|ku|mu|mi|ta|ko|na|la|da|ne|pa|po|pu|ni|ing|ning|king|naman|lang|nung|ampong|yang|niyu|keka|keku|tamu|tamo|tayo|kayo|reng|ding|deng|siguru|baka|kaya|ano)\\b',
        /* Strings that must never be spoken (pronunciation respellings). */
        excludeTest: null,
        /* Removed from the utterance but left visible on the page (annotations). */
        stripSpoken: null,
        /* A cell whose remaining text still matches this is not target text at all
           and gets no button. Applied AFTER stripSpoken. */
        rejectTest: ':\\s*$|^[A-Za-z][A-Za-z ]{1,18}:\\s|\\+|\\(|[a-z]-[A-Z]{2}|[A-Z]{2}-[a-z]|^[A-Z]{2,}-|\\b(the|is|are|was|were|this|that|these|those|how|what|where|when|why|who|your|you|will|would|with|from|of|to|and|it|delicious|much|thanks?|studies|study|studied|reads?|writes?|wrote|written|father|mother|book|letter|hello|please|focus|system|structure|pattern|love|like|want|need|know|see|come|go|eat|big|small|good|bad|family|first|second|third|morning|afternoon|evening|night)\\b',
        rate: 0.85
    };

    var OVERRIDES = {};

    var synth = window.speechSynthesis;
    var HAS = CONFIG.detect ? new RegExp(CONFIG.detect) : null;
    var RUN = CONFIG.pattern ? new RegExp(CONFIG.pattern + '+', 'g') : null;
    var STRIP = CONFIG.strip ? new RegExp(CONFIG.strip, 'g') : null;
    var HEADER = CONFIG.header ? new RegExp(CONFIG.header, 'i') : null;
    var HEADER_SKIP = CONFIG.headerSkip ? new RegExp(CONFIG.headerSkip, 'i') : null;
    var STRIP_SPOKEN = CONFIG.stripSpoken ? new RegExp(CONFIG.stripSpoken, 'gu') : null;
    var REJECT_TEST = CONFIG.rejectTest ? new RegExp(CONFIG.rejectTest, 'i') : null;

    /* What will actually be spoken, with printed-but-unspoken annotations removed.
       The reject gate must see this, not the raw cell: "Magnum bellum gessit. — A
       GRAND war" is target text once the gloss after the em dash is gone. */
    function stripAnnotations(text) {
        if (!STRIP_SPOKEN) return text;
        STRIP_SPOKEN.lastIndex = 0;
        return text.replace(STRIP_SPOKEN, '').trim();
    }
    var TARGET_TEST = CONFIG.targetTest ? new RegExp(CONFIG.targetTest, 'i') : null;
    var EXCLUDE_TEST = CONFIG.excludeTest ? new RegExp(CONFIG.excludeTest) : null;
    /* A cell with no letters (an em-dash, a number, an empty spacer) is not speakable. */
    var SPEAKABLE = /[A-Za-zÀ-ɏ]/;
    /* " - ", " – ", " — ": the gloss separator. Requires surrounding spaces so a
       hyphenated word (bien-estar) and a respelling (kee-see-EH-rah) survive intact. */
    var DASH = /\s+[-–—]\s+/;
    var QUOTED = /[“"]([^”"]{2,}?)[”"]/g;

    /* Source HTML wraps long passages across lines and sometimes in quote marks.
       Collapse the whitespace and drop the enclosing quotes so the utterance — and
       the aria-label built from it — is the sentence itself. */
    function clean(text) {
        return text.replace(/\s+/g, ' ').trim().replace(/^[“"]+|[”"]+$/g, '').trim();
    }

    function looksTarget(text) {
        return !TARGET_TEST || TARGET_TEST.test(text);
    }

    function isExcluded(text) {
        return !!EXCLUDE_TEST && EXCLUDE_TEST.test(text);
    }

    function usable(text) {
        if (!text || !SPEAKABLE.test(text) || isExcluded(text)) return false;
        if (REJECT_TEST && REJECT_TEST.test(text)) return false;
        return true;
    }

    var voice = null;
    var activeBtn = null;

    function langOf(v) { return v.lang.replace('_', '-').toLowerCase(); }

    function findVoice() {
        var voices = synth.getVoices();
        if (!voices.length) return null;
        /* Try each accepted language in order, so a native voice always wins over a
           fallback. Voice.lang is 'ru-RU' on most platforms but 'ru_RU' on some
           Android builds. */
        for (var i = 0; i < CONFIG.langs.length; i++) {
            var prefix = CONFIG.langs[i];
            var matches = voices.filter(function (v) { return langOf(v).indexOf(prefix) === 0; });
            if (!matches.length) continue;
            /* Prefer a local voice: no network round-trip, works offline. */
            var local = matches.filter(function (v) { return v.localService; });
            return (local[0] || matches[0]);
        }
        return null;
    }

    function isFallbackVoice(v) {
        if (!v) return false;
        var l = langOf(v);
        return !CONFIG.nativeLangs.some(function (p) { return l.indexOf(p) === 0; });
    }

    /* Which rewrite set applies to the resolved voice. `fallbackRules` is either one
       list (a single stand-in language) or a map keyed by language prefix, because a
       course may accept more than one stand-in and each needs its own orthography. */
    function rulesForVoice() {
        var rules = CONFIG.fallbackRules;
        if (!rules || !isFallbackVoice(voice)) return null;
        if (Array.isArray(rules)) return rules;
        var l = langOf(voice);
        for (var k in rules) {
            if (Object.prototype.hasOwnProperty.call(rules, k) && l.indexOf(k) === 0) return rules[k];
        }
        return null;
    }

    function fallbackNameForVoice() {
        if (!CONFIG.fallbackNames) return CONFIG.fallbackName || '';
        var l = langOf(voice);
        for (var k in CONFIG.fallbackNames) {
            if (Object.prototype.hasOwnProperty.call(CONFIG.fallbackNames, k) && l.indexOf(k) === 0) {
                return CONFIG.fallbackNames[k];
            }
        }
        return CONFIG.fallbackName || '';
    }

    /* Rewrite the utterance for a fallback voice. The page keeps its own spelling; only
       what is handed to the speech engine changes. */
    function forFallback(text) {
        var rules = rulesForVoice();
        if (!rules) return text;
        var out = text;
        rules.forEach(function (r) {
            out = out.replace(new RegExp(r[0], r[1]), r[2]);
        });
        return out;
    }

    /* Keep only target-script runs, so '기역 (giyeok)' speaks as '기역' and a
       transliteration column is never read aloud. Runs join with a space so
       '야채 / 채소' reads as two words. */
    function extractTarget(text) {
        if (!RUN) return text.trim();
        var runs = text.match(RUN);
        if (!runs) return '';
        var out = runs.join(' ');
        return STRIP ? out.replace(STRIP, '') : out;
    }

    function speak(text) {
        if (!voice || !text) return null;
        synth.cancel();
        var u = new SpeechSynthesisUtterance(forFallback(text));
        u.voice = voice;
        u.lang = voice.lang;
        u.rate = CONFIG.rate;
        return u;
    }

    function speakPlain(text) {
        var u = speak(text);
        if (u) synth.speak(u);
    }

    function clearActive() {
        if (activeBtn) activeBtn.classList.remove('speaking');
        activeBtn = null;
    }

    function speakFromButton(btn) {
        var u = speak(btn.dataset.speak);
        if (!u) return;
        clearActive();
        activeBtn = btn;
        btn.classList.add('speaking');
        u.onend = u.onerror = clearActive;
        synth.speak(u);
    }

    function makeButton(text) {
        /* Centralised so every attach path drops annotations from the utterance
           while the cell keeps showing them. */
        var label = text;
        if (STRIP_SPOKEN) {
            STRIP_SPOKEN.lastIndex = 0;
            text = text.replace(STRIP_SPOKEN, '').trim();
            label = text;
        }
        if (CONFIG.lowercase) text = text.toLowerCase();

        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'audio-btn';
        btn.dataset.speak = text;
        btn.textContent = '🔊';
        btn.setAttribute('aria-label', 'Listen to ' + label);
        btn.title = 'Listen';
        return btn;
    }

    function attachByUnicode() {
        Array.prototype.forEach.call(document.querySelectorAll(CONFIG.cellSelector || 'td'), function (cell) {
            if (cell.closest('.no-audio')) return;
            if (cell.querySelector('.audio-btn')) return;
            if (!HAS.test(cell.textContent)) return;

            var raw = extractTarget(cell.textContent);
            if (!raw) return;
            cell.appendChild(makeButton(OVERRIDES[raw] || raw));
        });
    }

    /* Block containers take the button as a trailing child. An inline <strong> takes
       it as a following sibling, so the button sits beside the word rather than
       after the whole line. */
    var BLOCK = { TD: 1, TH: 1, LI: 1, P: 1, DIV: 1 };

    function place(el, text) {
        var btn = makeButton(OVERRIDES[text] || text);
        if (BLOCK[el.tagName]) el.appendChild(btn);
        else el.insertAdjacentElement('afterend', btn);
    }

    /* Map each table's target columns from its header row, then button those cells.
       Column position is not fixed: some tables pair two target/gloss columns
       side by side, and grammar tables put the target in columns 2..5. */
    function attachByHeader() {
        Array.prototype.forEach.call(document.querySelectorAll('table'), function (table) {
            var rows = table.rows;
            if (!rows.length) return;

            var head = null;
            for (var i = 0; i < rows.length; i++) {
                if (rows[i].querySelector('th')) { head = rows[i]; break; }
            }
            if (!head) return;

            if (HEADER_SKIP) {
                var skip = Array.prototype.some.call(head.cells, function (cell) {
                    return cell.tagName === 'TH' && HEADER_SKIP.test(cell.textContent.trim());
                });
                if (skip) return;
            }

            var cols = [];
            Array.prototype.forEach.call(head.cells, function (cell, idx) {
                if (cell.tagName === 'TH' && HEADER.test(cell.textContent.trim())) cols.push(idx);
            });
            if (!cols.length) return;

            Array.prototype.forEach.call(rows, function (row) {
                if (row === head) return;
                cols.forEach(function (idx) {
                    var cell = row.cells[idx];
                    if (!cell || cell.tagName !== 'TD') return;
                    if (cell.closest('.no-audio') || cell.querySelector('.audio-btn')) return;
                    var text = stripAnnotations(cell.textContent.trim());
                    if (!usable(text)) return;
                    place(cell, text);
                });
            });
        });
    }

    /* Text of `el` ignoring an existing button, and ignoring everything up to and
       including the first <strong> label. <p><strong>You:</strong> Muy bien</p> */
    function textAfterStrong(el) {
        var label = el.querySelector('strong');
        if (!label) return ownText(el);
        var out = '';
        for (var n = label.nextSibling; n; n = n.nextSibling) {
            if (n.nodeType === 1 && n.classList.contains('audio-btn')) continue;
            out += n.textContent;
        }
        return clean(out);
    }

    function ownText(el) {
        var clone = el.cloneNode(true);
        Array.prototype.forEach.call(clone.querySelectorAll('.audio-btn'), function (b) {
            b.remove();
        });
        return clean(clone.textContent);
    }

    /* <li>Tengo... - I have...</li> -> "Tengo..." */
    function textBeforeDash(el) {
        return clean(ownText(el).split(DASH)[0]);
    }

    /* Only the element's own direct text nodes, ignoring any child elements. A dictionary
       headword carries a trailing badge span: <h4>Ama <span class="badge">Essential</span></h4>
       -> "Ama", where ownText would read "Ama Essential". */
    function directText(el) {
        var out = '';
        for (var n = el.firstChild; n; n = n.nextSibling) {
            if (n.nodeType === 3) out += n.textContent;
        }
        return clean(out);
    }

    /* "Kumusta ka? (How are you?)" -> "Kumusta ka?" — target sentence, English gloss
       in a trailing parenthetical. */
    function textBeforeParen(el) {
        return clean(ownText(el).split(/\s*\(/)[0]);
    }

    /* A real word split into syllables for drilling: es-tu-dian-te -> estudiante.
       Three or more all-lowercase parts. A two-part lowercase token could be a
       genuine hyphenated word, so it is left alone. */
    var SYLLABIFIED = /^[a-zñáéíóúü]+(-[a-zñáéíóúü]+){2,}$/;

    function deSyllabify(text) {
        return SYLLABIFIED.test(text) ? text.replace(/-/g, '') : text;
    }

    /* Pronunciation-drill list items:
           mesa (MEH-sah) - table       -> "mesa"        (parens = respelling)
           es-tu-dian-te (student)      -> "estudiante"  (parens = English gloss)
       Both shapes put the Spanish first; the parenthetical is never trustworthy.
       A multi-word prefix means English prose rather than a drill item
       ("The pure vowels in "tacos" (TAH-kohs)"), so fall back to the parenthetical
       only there, and demand it look like the target language. */
    function vocabWord(el) {
        var m = ownText(el).match(/^\s*([^()]+?)\s*\(([^)]+)\)\s*(.?)/);
        if (!m) return '';
        var before = m[1].trim(), inside = m[2].trim(), next = m[3];

        /* Not a drill item but a study-plan label: "Morning (15 min): AI warm-up".
           A duration in the parens, or a colon right after it, gives it away — and
           without this the layer happily says "Morning" in a Spanish voice. */
        if (/\d/.test(inside) || next === ':') return '';

        var oneWord = function (s) { return s && !/\s/.test(s); };
        if (oneWord(before)) return isExcluded(before) ? '' : deSyllabify(before);
        if (oneWord(inside) && !isExcluded(inside) && looksTarget(inside)) return inside;
        return '';
    }

    /* Spanish quoted inside English commentary. Each quote gets its own button,
       inserted immediately after the closing quote mark. Matches are applied back
       to front so earlier offsets stay valid after splitText(). */
    function attachQuotes(el) {
        var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null, false);
        var nodes = [], n;
        while ((n = walker.nextNode())) nodes.push(n);

        nodes.forEach(function (node) {
            if (node.parentElement.closest('.audio-btn')) return;
            var hits = [], m;
            QUOTED.lastIndex = 0;
            while ((m = QUOTED.exec(node.nodeValue))) hits.push(m);

            for (var i = hits.length - 1; i >= 0; i--) {
                var inner = hits[i][1].trim();
                if (!usable(inner) || !looksTarget(inner)) continue;
                var end = hits[i].index + hits[i][0].length;
                var tail = node.splitText(end);
                node.parentNode.insertBefore(makeButton(inner), tail);
            }
        });
    }

    /* A syllabified headword: "BA-HAY (house)", "ma-GA-nda (beautiful)". In this course
       the respelling IS the word, just hyphenated and shouted, so de-hyphenating
       recovers it. Anything without that shape (an English bullet) yields nothing. */
    function syllabifiedWord(el) {
        var head = ownText(el).split(/[\s(]/)[0];
        if (!/^[A-Za-z]+(-[A-Za-z]+)+$/.test(head)) return '';
        if (!/[A-Z]/.test(head)) return '';
        return head.replace(/-/g, '');
    }

    var PICK = {
        self: ownText,
        afterStrong: textAfterStrong,
        beforeDash: textBeforeDash,
        beforeParen: textBeforeParen,
        vocabWord: vocabWord,
        syllabifiedWord: syllabifiedWord,
        directText: directText
    };

    function attachByRules() {
        CONFIG.rules.forEach(function (rule) {
            Array.prototype.forEach.call(document.querySelectorAll(rule.selector), function (el) {
                if (el.closest('.no-audio')) return;
                if (el.dataset.audioDone) return;

                if (rule.pick === 'quotes') {
                    el.dataset.audioDone = '1';
                    attachQuotes(el);
                    return;
                }

                var host = el.tagName === 'TD' ? el : el.parentElement;
                if (!host || el.querySelector('.audio-btn')) return;
                if (el.tagName === 'STRONG' && host.querySelector('.audio-btn')) return;

                var text = (PICK[rule.pick] || ownText)(el);
                if (!usable(text)) return;
                if (rule.requireTarget && !looksTarget(text)) return;

                el.dataset.audioDone = '1';
                place(el, text);
            });
        });
    }

    function attachOptedIn() {
        /* Explicit data-speak markers outside tables. Interactive elements are skipped:
           a data-speak <button> (e.g. a clickable diagram) would otherwise receive a
           nested <button>, which is invalid HTML and fires the delegated handler twice. */
        Array.prototype.forEach.call(document.querySelectorAll('[data-speak]'), function (el) {
            if (el.classList.contains('audio-btn')) return;
            if (el.closest('button, a')) return;
            if (el.querySelector('.audio-btn')) return;
            el.appendChild(makeButton(el.dataset.speak));
        });
    }

    function attachButtons() {
        if (CONFIG.mode === 'unicode') attachByUnicode();
        else if (CONFIG.mode === 'header') attachByHeader();
        else if (CONFIG.mode === 'rules') attachByRules();
        attachOptedIn();
    }

    function placeNotice(note) {
        var wrap = document.querySelector('.content-wrap') || document.body;
        var first = wrap.querySelector('h1');
        if (first && first.parentNode) first.parentNode.insertBefore(note, first.nextSibling);
        else wrap.insertBefore(note, wrap.firstChild);
    }

    function addNotice() {
        if (document.querySelector('.audio-notice')) return;
        var note = document.createElement('p');
        note.className = 'audio-notice';
        note.innerHTML = '🔇 <strong>No ' + CONFIG.langName + ' voice found on this device.</strong> ' +
            'Audio playback is hidden. To enable it, install a ' + CONFIG.langName +
            ' language pack (Windows: Settings → Time &amp; Language → Language → ' +
            'Add a language → ' + CONFIG.addLanguageAs + '), then reload.';
        placeNotice(note);
    }

    /* Built only once the voice is known: the wording names the stand-in that actually
       won, which a course with several accepted fallbacks cannot know in advance. */
    function addFallbackNotice() {
        var name = fallbackNameForVoice();
        if (!name || document.querySelector('.audio-fallback')) return;
        var fb = document.createElement('p');
        fb.className = 'audio-fallback';
        fb.innerHTML = '🗣️ <strong>Using a ' + name + ' voice.</strong> ' +
            'No ' + CONFIG.langName + ' voice is installed, so audio is spoken by a ' +
            name + ' voice, which shares most of ' + CONFIG.langName +
            "'s sounds. The pronunciation is close but not native.";
        placeNotice(fb);
    }

    /* Content built by a page script (a JS-populated vocabulary grid) appears after the
       first attach pass. Watch for it, re-attaching once the DOM settles. The observer
       is detached while attaching so our own buttons do not retrigger it. */
    var observer = null;
    var rescanTimer = null;

    function startRescan() {
        if (!CONFIG.rescan || observer || typeof MutationObserver === 'undefined') return;
        observer = new MutationObserver(function () {
            clearTimeout(rescanTimer);
            rescanTimer = setTimeout(function () {
                observer.disconnect();
                attachButtons();
                observer.observe(document.body, { childList: true, subtree: true });
            }, 150);
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    function init() {
        voice = findVoice();
        if (!voice) {
            document.documentElement.classList.add('no-tts-voice');
            document.documentElement.classList.remove('tts-fallback');
            return;
        }
        document.documentElement.classList.remove('no-tts-voice');
        var fallback = isFallbackVoice(voice);
        document.documentElement.classList.toggle('tts-fallback', fallback);
        if (fallback) addFallbackNotice();
        attachButtons();
        startRescan();
    }

    /* Delegated, so buttons injected later still work. site-nav.js binds one
       listener per element at load; nothing here may rely on that. */
    document.addEventListener('click', function (e) {
        var btn = e.target.closest && e.target.closest('.audio-btn');
        if (btn) speakFromButton(btn);
    });

    var api = {
        speak: speakPlain,
        available: function () { return !!voice; },
        syllableFor: function (t) { return OVERRIDES[t] || t; }
    };
    window.CourseAudio = api;
    window.CourseAudio = api;

    if (!synth || typeof SpeechSynthesisUtterance === 'undefined') {
        document.documentElement.classList.add('no-tts-voice');
        document.addEventListener('DOMContentLoaded', addNotice);
        return;
    }

    /* getVoices() is empty on first call in Chrome and fires voiceschanged once the
       list is populated. Firefox populates synchronously.

       voiceschanged can fire several times: local voices arrive first, remote ones
       later. Keep listening until a Filipino voice actually turns up — detaching on
       the first event would permanently give up on a device whose voice is simply
       slow to register. */
    function onVoices() {
        init();
        if (voice) synth.removeEventListener('voiceschanged', onVoices);
    }

    function boot() {
        addNotice();
        init();
        if (!voice) {
            synth.addEventListener('voiceschanged', onVoices);
            setTimeout(init, 1200);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }
})();
