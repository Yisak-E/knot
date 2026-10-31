---
title: "Exam Cheat Sheet — Formulas & Definitions"
summary: One-page revision sheet with every formula, definition and must-know list from Chapters 4 and 6.
tags: [cheat-sheet, formulas, revision]
sort: 4
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

## Triangle facts

- Valid iff a + b > c, a + c > b, b + c > a (and all sides > 0).
- Equilateral ⊂ isosceles, so use "isosceles **not** equilateral".
- Refined blocks per side: >1, =1, =0, <0 (values 2, 1, 0, −1). ACoC 64 · BCC 10 · ECC 4 · PWC-min 16.
