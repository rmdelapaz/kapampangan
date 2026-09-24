# Kapampangan C1–C2 — plan, sourcing, and build guide

## Why 14 lessons (C1 = 8, C2 = 6)

Sized from what can actually be sourced, not from the Tagalog advanced tier's 18.

The tier exists because **Bergaño turned out to be reachable**. Without him there would be
no honest C1–C2 course: B2 lesson 22 said so in print, and that was true when it was written.

What Bergaño supports is **deep morphology and reading the tradition** — eight solid C1
lessons. What he supports less well is literary study: he is a grammarian, not an anthology.
So C2 is six lessons on lexical depth, register and craft, and it stops short of poetics
and close literary reading, for which no primary Kapampangan verse texts were in hand.

Deliberately **not** built: metre and rhyme, the *kuriru* romances as texts, *crissotan* as
texts, close reading of Soto. Those need an anthology. If one is sourced later they would
make a genuine C2 extension.

## Sourcing

| Source | Status | Used for |
|---|---|---|
| **Bergaño, _Arte de la Lengua Pampanga_** (1736; 1916 reprint) | Internet Archive, `aqn8190.0001.001.umich.edu`, ~550 KB OCR, **Spanish** | the backbone of C1 |
| **Bergaño, _Vocabulario_** | Internet Archive, `BerganoVocabulario`, ~2 MB, **English translation** | lexical lessons, attestation |
| **Forman, _Kapampangan Grammar Notes_** (1971) | ScholarSpace, CC BY-NC-SA | the B1–B2 backbone; contrast partner here |

Bergaño was **Prior of the Convento de Bacolor** — the same town Forman did fieldwork in 235
years later. The two describe one community's speech at two dates, which is what makes the
historical comparison in this tier possible at all.

**Orthography note:** Bergaño writes `c` before a/o/u and `qu` before e/i for /k/, and `u` for
/w/. Searching his text for a modern spelling fails. `asbuk` is `asboc`; `katawan` is
`catauan`. This cost a false negative during the A1–A2 vocabulary audit.

## What Bergaño has that Forman does not

- **Protocompuestos** (Ch. V) — a whole derivational system, with variation, meaning and
  frequentatives. Forman does not treat it.
- **Six sections on `maca-`** (perfection, potential, nuisance, causal, being, intensity)
  against Forman's handful of stative examples.
- **Dedicated chapters** on `mag-`, `mi-`, `maqui-`, `ma-`, `ca-`, `pa-`, plus "various
  particles".
- **The three passives** (Ch. III–IV) — an 18th-century analysis of what Forman calls
  predication types.
- **Adverbs** in ten sections, including interjections and ironies.
- **Numerals** including ordinals, distributives and money-counting.
- **Accents, reduplications, syncopes and letter-suppressions** (Ch. XVIII).

## Structure

**C1 — deep morphology and reading the tradition (1–8)**
| # | Lesson | Bergaño |
|---|---|---|
| 1 | Reading Bergaño — the 1736 grammar and its terms | front matter, Ch. I |
| 2 | The Old Orthography in Depth | Ch. XVIII §IV |
| 3 | The Three Passives — Bergaño against Forman | Ch. III §III–IV, Ch. IV |
| 4 | Protocompuestos | Ch. V §I–II |
| 5 | Frequentatives, Reduplication and Syncope | Ch. V §IV, Ch. XVIII §II–III |
| 6 | The Particle Chapters — mag, mi, maqui, ma, ca | Ch. VI–X |
| 7 | maca in Full — five senses of one prefix | Ch. XI §I–VI |
| 8 | pa-, maguin and the Remaining Particles | Ch. XII–XIV |

**C2 — lexicon, register and craft (9–14)**
| # | Lesson | Source |
|---|---|---|
| 9 | Using the Vocabulario | Vocabulario |
| 10 | Lexical Depth and Near-Synonyms | Vocabulario |
| 11 | Numerals, Money and Measure | Ch. XVII |
| 12 | Adverbs, Interjections and Irony | Ch. XV |
| 13 | Translation Craft | all three |
| 14 | Language, Identity and What Is Not Known | all three |

## Corrections this tier's sourcing forced elsewhere

Finding Bergaño changed two things already shipped:

1. **Deictics** — he sides with the encyclopedia against Forman, with a worked example
   (*ining pluma* vs *iting tintero*). Beginner lesson 6 was reverted and now shows all three
   sources. See `../docs/a1-a2-roadmap.md`.
2. **`maca-`** — B1 lesson 8 said flatly it is "not the potentive." Bergaño has a section
   headed *MACA potencial* with *macasúlat co*, "I can write." The lesson now says the prefix
   is polysemous, and adds Bergaño's `sukat` contrast (proximate vs remote ability).

**The standing rule for this tier:** where two sources disagree, show both and say which the
course follows and why. Do not let one grammar's silence become a claim.

## Architecture
Mirrors `../intermediate/`: `learn.js` namespaced **`kapampangan-adv-*`**, own `vocab-data.js`
(field `kp`), `lesson-content.js`, `nav.js`, `index.html` with `<div class="container">`,
`build_lessons.py` failing the build on an `(Answer:)` without a blank. Shares `/styles/*`,
`/audio.js` and `/images/vocab/*`. `build_anki.py` uses MODEL_ID 1607393161 / DECK_ID
2059400563 — distinct from the beginner and intermediate decks.
