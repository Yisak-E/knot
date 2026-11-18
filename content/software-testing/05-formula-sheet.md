---
title: "Exam Cheat Sheet — Formulas & Definitions"
summary: One-page revision sheet with every formula, definition and must-know list from Chapters 4, 5 and 6.
tags: [cheat-sheet, formulas, revision]
sort: 7
---

## Coverage-criteria formulas

| Criterion | Rule | # Tests |
|---|---|---|
| **ACoC** | Every combination of blocks | **∏ Bᵢ** (B₁ × B₂ × … × B_Q) |
| **ECC** | Every block used at least once | **max(Bᵢ)** |
| **PWC** | Every block paired with every block of every other characteristic | **≥ largest × 2nd-largest** |
| **TWC** | Every T-tuple of blocks | from covering arrays; T = Q gives ACoC |
| **BCC** | Base test + vary one characteristic at a time | **1 + Σ (Bᵢ − 1)** |
| **MBCC** | Several bases; vary each base | **M + Σ M × (Bᵢ − mᵢ)**, M = ∏ mᵢ (upper bound) |

Pairs to cover for PWC = **Σᵢ<ⱼ Bᵢ × Bⱼ**. Each test covers **C(Q, 2)** pairs.

## Quick reference: running IDM A[2] B[2] C[3] D[2]

| ECC | BCC | PWC-min | ACoC |
|---|---|---|---|
| 3 | 6 | 6 | 24 |

## Subsumption

ACoC → TWC → PWC → ECC · ACoC → MBCC → BCC → ECC · **PWC ⟂ BCC (incomparable)**

## Valid partition

1. **Pairwise disjoint**: bᵢ ∩ bⱼ = ∅
2. **Complete**: ⋃ bᵢ = D

## Five IDM steps

1. Identify testable functions
2. Find inputs, parameters, characteristics
3. Model the input domain *(the move to the design-abstraction level)*
4. Choose combinations (criterion)
5. Refine into test inputs

## Constraint handling

- **ACoC / PWC / TWC**: drop infeasible combos.
- **BCC / MBCC**: swap in another non-base block.
- Types: **cannot be combined** · **can only be combined**.

## Block strategies (8)

Valid vs invalid · Sub-partition · Boundaries · Normal use · Enumerated types · Balance · Missing blocks · Overlapping blocks. Special values: **null**, **empty container**.

## Chapter 4 must-knows

- **Universal** correctness (full spec, ∀ inputs) vs **existential** correctness (passes this test set).
- **TDD** = Red → Green → Refactor. **Automation is a prerequisite**; TDD ≠ automation.
- **Test harness**: runs automated tests and reports; each test needs an **oracle**; tests replace requirements.
- **CI**: continuously rebuild and retest; decides whether the modified system is still correct.
- **User story**: *As a [role], I want [action], so that [benefit]*. In the user's language, small, not archived (the tests are).
- Story → **acceptance test** (fails) → **TDD tests** → pass → next story.
- **Legacy**: incremental TDD, testing only the code being changed.
- **Shortfall**: happy paths miss **confused**, **creative** and **malicious** users. Passing ≠ reliable.
- Fix: **model-based criteria** (engineering, with a sense of completion) over human-based (art).

## Chapter 5 must-knows

- **Test requirement (tr)**: a specific element of an artifact a test must cover. **TR** is the set.
- **Coverage criterion**: a rule (or rules) that imposes TRs on a test set.
- **T satisfies C** iff every tr in TR is satisfied by at least one t in T.
- **Coverage level** = (# TRs satisfied ÷ |TR|) × 100%. E.g. 5/6 ≈ 83%.
- **Infeasible TR**: cannot be satisfied (dead code, `x > 10 && x < 5`). Detecting them is **undecidable**, so 100% coverage is impossible in practice.
- **Minimal** set: removing any test breaks coverage. **Minimum** set: no smaller set works (hard to find).
- **Generator** (create values to satisfy C; research, needs tools) vs **recognizer** (measure existing tests; industry, can mislead).
- **Subsumption**: C1 subsumes C2 iff every T satisfying C1 also satisfies C2. Flavour ⊇ colour; branch ⊇ statement.
- **Four structures**: input space · graphs · logic · syntax.
- Four test activities: **design** (criteria-based / human-based), automation, execution, evaluation.
- Jelly beans: Lemon Y · Pistachio G · Cantaloupe O · Pear W · Tangerine O · Apricot Y.

## Triangle facts

- Valid iff a + b > c, a + c > b, b + c > a (and all sides > 0).
- Equilateral ⊂ isosceles, so use "isosceles **not** equilateral".
- Refined blocks per side: >1, =1, =0, <0 (values 2, 1, 0, −1). ACoC 64 · BCC 10 · ECC 4 · PWC-min 16.

## Chapter 7 must-knows (graph coverage)

- **Graph** = (N, N₀, Nf, E); N, N₀, Nf non-empty; E may be empty; edges are **ordered** pairs.
- **Path** length = number of **edges** (single node = length 0). **Test path** = starts in N₀, ends in Nf.
- **Visit** nodes/edges, **tour** subpaths. path(t) = test path of t; path(T) = set for T.
- **Syntactic** reachability = a path exists; **semantic** = some input executes it.

| Criterion | TR | Code name / note |
|---|---|---|
| NC | each reachable node | statement / basic block coverage |
| EC | each path of length ≤ 1 | branch coverage |
| EPC | each path of length ≤ 2 | in × out edges per node |
| PPC | each prime path | loops 0, 1, many times |
| CPC | all paths | infinite with loops |
| SPC | given set S | customer scenarios |
| SRTC / CRTC | one / all round trips per node | do **not** subsume NC/EC/EPC |

- **Simple path:** no repeated node except first = last. **Prime path:** simple path that is not a proper subpath of another simple path.
- **Subsumption:** CPC → PPC → (almost) EPC → EC → NC; PPC → CRTC → SRTC; PPC → ADUP → AUC → ADC; AUC → EC.
- **PPC ⊅ EPC:** a self-edge (2→2) gives EPC requirements that repeat a node, so they can't be prime.
- **Sidetrip** = leave and return to the **same** node; **detour** = leave and rejoin at a **successor**.
- **Double diamond:** 2 × 2 = 4 test paths. Counts: 4-node cycle graph 23 simple / 8 prime; 5–6 loop graph 38 simple / 9 prime.
- **CFG patterns:** while = dummy test node (never loop back to init); for = 5 nodes (init, test, body, increment, exit); do-while = self-edge; if-return = final node, no out-edge; switch without break = fall-through edge; throw → edge to catch.
- **computeStats:** 8 nodes, 9 edges → EC 9 TRs (one path), EPC 12 TRs, PPC 10 prime paths.
