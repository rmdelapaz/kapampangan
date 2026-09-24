# Kapampangan B1–B2 — plan, sourcing, and build guide

## Why 22 lessons (B1 = 12, B2 = 10)

Sized from what the sources actually document and what A1–A2 explicitly deferred — not
copied from the Tagalog intermediate course's 24.

**B1 is heavier than Tagalog's** because Kapampangan's predication system and its
morphophonemics genuinely need the room. Forman devotes whole sections to Action-Goal and
Action-Beneficiary predication, to stative `mi-`/`ka-`, to recent-completion `ka-`, and to
eight separate sound changes in word formation. None of that fits in a lesson or two.

**B2 is lighter than Tagalog's** because Kapampangan has far less contemporary media and
register material than Tagalog does. Tagalog's B2 spends lessons on national news media,
formal correspondence and academic register; Kapampangan's equivalents are thinner and
padding to 12 would mean inventing. Ten honest lessons beat twelve with two of them hollow.

## Sourcing

The primary source is **Michael L. Forman, _Kapampangan Grammar Notes_** (University of
Hawai'i Press, PALI Language Texts, 1971), 100 pp, open access under CC BY-NC-SA 4.0 at
`scholarspace.manoa.hawaii.edu`. It is a fieldwork-based reference grammar and is the
backbone of this tier — section numbers below map onto its chapters.

This matters because the A1–A2 tier was first built from the English Wikipedia article and
later audited against Forman, which turned up five corrections (see
`../docs/a1-a2-roadmap.md`). B1–B2 is built on Forman from the start.

**Do not analogise from Tagalog.** Lesson 11 of the beginner course exists because
`susulat` means "is writing" in Kapampangan and "will write" in Tagalog. The same trap
applies at every level, and it gets harder to spot as the grammar gets more abstract.
Where Forman is silent, say so on the page rather than filling the gap from Tagalog.

Note also that Forman does **not** use the "five voices" framing the encyclopedia uses. He
describes Action-Actor, Action-Goal and Action-Beneficiary predication plus a residual
"other verbal predications". This tier follows Forman's framing and mentions the voice
terminology as an alternative analysis, not the other way round.

## Structure

**B1 — completing the grammar engine (1–12)**
| # | Lesson | Forman |
|---|---|---|
| 1 | Action-Goal Predication | 4.3.2 |
| 2 | Action-Beneficiary Predication | 4.3.3 |
| 3 | Other Verbal Predications — instrument, locative, reason | 4.3.4 |
| 4 | Morphophonemics I — stress shift, vowel loss, root↔derived alternation | 2.3.1–2.3.3 |
| 5 | Morphophonemics II — assimilation, d→r, s/d→y, geminates | 2.3.5–2.3.8 |
| 6 | Stative Predications with mi- and ka- | 4.4 |
| 7 | Recent Completion with ka- | 4.5 |
| 8 | Potentive and Abilitative — maka-, ma- | — |
| 9 | Causative — magpa-, pa- | — |
| 10 | Attributive Phrases, Linked and Unlinked, and Splitting | 3.5 |
| 11 | Two-Verb and Three-Verb Phrases, Complements of Manner | 3.6 |
| 12 | Comparative and Superlative | 4.2.5–4.2.7 |

**B2 — discourse, register and text (13–22)**
| # | Lesson | Forman |
|---|---|---|
| 13 | Non-Verbal Predication in Full — existential, identificational, descriptive | 4.2 |
| 14 | The Lexical Particles in Depth | 6.2 |
| 15 | Coordination, Subordination and Embedding | 6.3 |
| 16 | Relative Clauses and Complex Noun Phrases | 3.5.4 |
| 17 | Minor Sentences and Conversational Fragments | 5 |
| 18 | Deictics Revisited, and the Indefinite Substitutes | 3.3.7–3.3.9 |
| 19 | Writing Systems — the syllabary, the Spanish orthographies, the Tagalog-based one | 2.4 |
| 20 | Kapampangan Literature — crissotan, Juan Crisostomo Soto, the Pasion | 1.6 |
| 21 | Register, Media and the Revival | 1.1–1.2 |
| 22 | Discourse and Fluency | 7 |

Lessons 8 and 9 have no dedicated Forman section; `maka-` appears 23 times and `magpa-`
7 times across his examples, so they are built from attested examples and the pages say so.

## Architecture

Mirrors `../` and the Tagalog intermediate tier, namespaced so the two tiers never collide:

- `learn.js` — localStorage `kapampangan-int-*`; `TOTAL_LESSONS` derived from
  `vocab-data.js` titles; resume href **relative**; index needs `<div class="container">`
  or the dashboard silently does not render.
- Own `vocab-data.js` (field `kp`), `lesson-content.js`, `nav.js`, `index.html`.
- Shares `/styles/*`, `/audio.js` and `/images/vocab/*` with the beginner tier.
- `build_lessons.py` wraps bodies from `lessons/lesson_NN.html` and **fails the build** if a
  lesson has an `(Answer:)` marker without a matching `___` blank.
- Theme key stays `kapampangan-theme` so light/dark follows the learner across both tiers.

## Build order
1. `vocab-data.js` + `lesson-content.js`
2. B1 lessons 1–12, then B2 13–22
3. index.html, then companions (glossary, readings, cheat sheet, can-do, Anki)
4. Forward links from the beginner index and can-do page; second hub entry in rayhome

`build_anki.py` needs its own MODEL_ID/DECK_ID — the beginner deck uses
1607392983 / 2059400391 and a clash would merge the two decks in a learner's Anki.
