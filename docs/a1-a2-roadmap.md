# Kapampangan A1–A2 — course plan and rationale

## Why 20 lessons (not 16, not 24)

Per the course-size SOP, the count comes from the material, not from a sibling course's
shape. The Tagalog beginner course is 16 lessons. Kapampangan needs **20**, and the extra
four are all in one place: **the pronoun and marker system.**

Tagalog teaches its `ang`/`ng`/`sa` markers and its two pronoun sets in essentially one
lesson. Kapampangan cannot, because it has three things Tagalog does not:

1. **A separate marker series for common and personal nouns, singular and plural**
   (`ing / ning / king`, `deng / reng / karing`, `i / nang / kang`, `di / ri / kari`).
2. **Portmanteau (fused) pronouns.** An ergative pronoun and an absolutive pronoun
   routinely fuse into one syllable: `ku + ya = ke`, `na + ya = ne`, `mu + la = mo`,
   `ku + ika = da ka`. There is no Tagalog equivalent; a learner who never meets this
   cannot parse ordinary speech.
3. **Obligatory pronoun agreement.** Kapampangan requires the pronoun *even when the
   noun is already there* — `Dintang ya i Erning`, never `*Dintang i Erning`. This trips
   up every Tagalog speaker and has to be drilled from the start.

So lessons 3, 4 and 5 are markers, pronoun sets, and fused pronouns respectively. A
four-way demonstrative system (`ini / iti / iyan / ita` with locatives `keni / keti /
ken / keta`) earns lesson 6 rather than a paragraph.

24 would mean padding thin topics; 16 would mean compressing exactly the material that
makes Kapampangan hard. 20 is the honest number.

## Structure

**A1 — Breakthrough (1–10)**
1. Sounds, Spelling & Stress
2. Greetings & Courtesy
3. The Markers: ing, ning, king
4. Pronouns I — the two core sets
5. Pronouns II — the fused pronouns (ke, me, ne, da ka)
6. This, That & Where — the four-way demonstratives
7. Pamilya — family and people
8. Bilang, Salapi at Oras — numbers, money, time
9. Pamangan — food and the Pampanga table
10. Ati, Ala & Ing Bale — existence, possession, the house

**A2 — Waystage (11–20)**
11. Verbs & Aspect
12. Who Does What — actor vs object focus
13. Ali, Ala, E — negation
14. Asking Questions
15. Describing Things — adjectives and the linker
16. Buri ku, Kailangan ku — wants, needs, ability
17. Requests & Commands
18. King Palengke — shopping and transactions
19. Katawan, Lasa ampong Panaun — body, health, weather, calendar
20. Kapampangan Culture & Fiesta

Plus Study Tools: glossary · readings · cheat sheet · can-do checklist · Anki deck.

## Sourcing and accuracy

Paradigm tables (pronouns, portmanteau chart, markers, demonstratives, conjugation
classes, question words, negation, numerals) were checked against the English Wikipedia
`Kapampangan language` article's cited grammar material (Forman 1971; Bergaño 1736/1860)
rather than carried over from the previous version of this site.

**Errors corrected from the retired 6-page course** (do not reintroduce):
- It claimed Kapampangan has *tone* and that "pitch can affect meaning." It does not.
  **Stress** is phonemic; tone is not a feature of the language.
- It claimed the schwa is a sound "that doesn't exist in other Philippine languages."
  Backwards on both counts: in Kapampangan [ə] is an unstressed allophone of /a/, and
  Ilocano and Pangasinan have schwa phonemes of their own.
- It taught **Sinulog** festival material as Kapampangan. Sinulog is Cebu. Pampanga's
  are Ligligan Parul, Kuraldal, Maleldo and Aguman Sanduk.
- It gave `Pakawari` as the everyday "excuse me / sorry."

**Deliberately deferred to a future B1–B2 tier** (the material exists in the retired
pages and in the sources, but is above A2): the full five-voice system (goal, locative,
circumstantial/instrument and benefactee triggers), `ipaN-`/`ka-` focus affixes,
the `bayaran`/`binayad` completed-aspect split, `kasebyan` proverbs in depth, and
register/rhetoric.

## Conventions
- Vocabulary field is **`kp`** (not `tl`) in `vocab-data.js`.
- localStorage is namespaced `kapampangan-*`.
- Audio uses a Filipino/Tagalog TTS voice as a **stand-in** — no Kapampangan voice
  exists. Lessons say so rather than implying the playback is authentic.

---

## Audit against Forman (2026-09-23)

After the course shipped, Michael Forman's **_Kapampangan Grammar Notes_** (University of
Hawai'i Press, 1971) turned out to be open access under CC BY-NC-SA 4.0
(scholarspace.manoa.hawaii.edu, 100 pp). It is a proper reference grammar from fieldwork and
outranks the encyclopedia article this course was first built from. The A1–A2 material was
audited against it.

**Confirmed unchanged:** all four pronoun sets, the `-e` portmanteau series, the existential
special forms `yu`/`lu`, `ing`/`ning`/`king`, obligatory pronoun agreement, the absence of a
copula, `ali`/`e`/`ala`, the `a`/`-ng` linker, `ampong`, `ka-` quality forms, and 58 of 88
spot-checked vocabulary items.

**Corrected:**
1. **`ati` vs `atin`** (L10, L13). Forman separates them: `ati` = BE (present, located), taking
   the special pronouns `yu`/`lu`; `atin` = HAVE, taking the ordinary short pronouns plus the
   `-ng` linker. The course had taught `ati` for both.
2. **Fusion in questions** (L5). The course said fused pronouns are "avoided in questions."
   Forman records a *second series* used in interrogatives — `kya`, `mya`, `nya`, `tya`,
   `dya` — so this is an alternative paradigm, not avoidance.
3. **`bakit`** (L14). The course asserted "obakit, not bakit," claiming `bakit` marks you as
   speaking Tagalog. Forman lists `obat`, `ot` **and `bakit`** as Kapampangan words for "why."
   The false distinction was removed.
4. **`keng` / `neng`** (L3) added as ordinary variants of `king` / `ning`.
5. **Deictics** (L6) — see below.

**Deictics: a genuine source conflict.** Forman and the Wikipedia table assign the four
demonstratives to *different* distance slots, close to reversed on two of the four:

| slot | Forman (now taught) | Wikipedia (was taught) |
|---|---|---|
| near speaker only | `iti` / `keti` | `ini` / `keni` |
| near both | `ini` / `keni` | `iti` / `keti` |
| near addressee | `ita` / `keta`,`ken`,`kyan` | `iyan` / `ken` |
| far from both | `iyan` / `karin` | `ita` / `keta` |

Ray's call: **follow Forman, state the disagreement on the page.** Lesson 6 now teaches
Forman's arrangement and carries a callout saying other descriptions order them differently,
that deictics vary by locality, and that learners should follow the speakers around them.
Forman himself notes the `keta`/`ken`/`kyan` variation "is not yet well understood."

**Still open:** a handful of everyday nouns remain unattested in Forman because a grammar is
not a dictionary — `asbuk`, `pisali`, `dake`, `pusu`, `katawan`. These want a dictionary
(Bergaño) or a native-speaker check. Note Forman spells "market" `palengki`, not `palengke`.
