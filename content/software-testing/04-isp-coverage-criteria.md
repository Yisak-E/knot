---
title: "Ch 6 Part 2 — Combination Criteria & Constraints"
summary: ACoC, ECC, PWC, TWC, BCC and MBCC with their formulas and worked examples, the subsumption hierarchy, the cost comparison, and how each criterion handles infeasible combinations.
tags: [chapter-6, isp, coverage-criteria, acoc, ecc, pwc, bcc, mbcc]
sort: 4
---

## Choosing Combinations of Blocks

**The question (Step 4 of IDM):** once every characteristic is partitioned into blocks, how should blocks from different characteristics be combined into tests?

- A single test may need, e.g., block 1 of one characteristic and block 3 of another.
- Trying **every** combination quickly becomes impractical beyond two or three partitions.
- Coverage criteria choose combinations **selectively**.
- Each abstract test combines **one block from each characteristic**; concrete values are then chosen to satisfy it.

**Notation**
- **Q** = number of characteristics; **Bi** = number of blocks in characteristic i.

**Running example** (used to compare all criteria)
- Four characteristics: A = [a1, a2], B = [b1, b2], C = [c1, c2, c3], D = [d1, d2].
- Could describe students: level (graduate/undergraduate), mode (full-time/part-time), major (CS/SWE/other), classification (in-state/out-of-state).
- Smaller example: three characteristics [A, B], [1, 2, 3], [x, y].

**In conclusion:** coverage criteria give the tester a principled rule for choosing which block combinations to test, instead of an exponential number of possibilities.

## All Combinations Coverage (ACoC)

**Definition:** every combination of blocks from all characteristics is used.

- **Number of tests:** B1 × B2 × … × BQ (the Cartesian product of the block sets).

**Examples**
- [A, B] × [1, 2, 3] × [x, y] → 2 × 3 × 2 = **12** tests, from (A, 1, x), (A, 1, y) … to (B, 3, x), (B, 3, y).
- Characteristics with 4, 2 and 3 blocks → **24** tests.
- Running student example → 2 × 2 × 3 × 2 = **24**.
- `triang()` with four blocks per side → 4 × 4 × 4 = **64**.
- Pizza ordering: size (3), crust (2), receiving method (2), payment (3) → 3 × 2 × 2 × 3 = **36**; adding toppings (3 blocks) triples it to **108**.

**Pros and cons**
- ✅ Thorough; reveals hidden bugs that depend on interactions; improves test quality.
- ❌ Does not scale; resource intensive; creates redundancy.

**In conclusion:** ACoC is the strongest criterion but also the most expensive, practical only when the input space is small and tests are automated.

## Each Choice Coverage (ECC)

**Definition:** the weakest and lightest criterion — one value from **each block of each characteristic** is used in at least one test.

- **Number of tests:** max(Bi), the block count of the largest characteristic.
- **Running example:** max(2, 2, 3, 2) = **3** tests, e.g. (a1, b1, c1, d1), (a2, b2, c2, d2), (a1, b1, c3, d1).
  - The third test may reuse any blocks for A, B and D, because C (3 blocks) decides the count.

**Pros and cons**
- ✅ Simple; few tests; guarantees every block is tested at least once.
- ❌ **Does not test interactions** between parameters, so it may miss bugs that need specific combinations.

**Example of a missed bug (pizza ordering)**
- Bug: the system crashes when a customer **pays online and chooses delivery**.
- A valid ECC set: (small, thin, pickup, cash), (medium, thick, delivery, card), (large, thin, pickup, online).
- It never pairs online payment with delivery → **bug missed**.

**When to use:** a quick, lightweight design when time is limited, or as a baseline before stronger criteria such as pair-wise or base choice.

**In conclusion:** ECC makes sure no block is ignored, but since it never requires combinations, treat it as a minimum rather than a complete strategy.

## Pair-Wise Coverage (PWC)

**Definition:** a value from each block of each characteristic must be combined with a value from **every block of every other characteristic** (fixes ECC's weakness).

- **Pairs to cover:** the sum of Bi × Bj over every pair of characteristics.
- **Minimum number of tests:** at least the product of the **two largest** block counts.
- Each test covers several pairs at once (a test such as (A, 1, x) covers (A, 1), (A, x) and (1, x)).
- Several different test sets can satisfy PWC.

**Example: [A, B], [1, 2, 3], [x, y]**
- Pairs: 6 + 4 + 6 = **16**.
- Minimum tests: 3 × 2 = **6**.
- One valid set: (A, 1, x), (A, 2, x), (A, 3, y), (B, 1, y), (B, 2, y), (B, 3, x).

**Example: web app** — browser (Chrome, Firefox, Safari), OS (Windows, macOS), network (WiFi, 4G)
- Pairs: 6 + 6 + 4 = **16**; minimum tests: 3 × 2 = **6**.
- Add language (English, Arabic) → **30** pairs, but the minimum stays **6** (two largest characteristics unchanged).

**In conclusion:** PWC catches faults caused by any two interacting inputs with far fewer tests than ACoC.

## T-Wise Coverage (TWC)

**Definition:** extends pair-wise to groups of **T** characteristics — a value from each block of each group of T characteristics must be combined.

- **T = 2** → PWC.
- **T = Q** (all characteristics) → same as ACoC.
- The minimum number of tests comes from **covering arrays**; tools such as **Microsoft PICT** and **NIST ACTS** generate them.
- Simple counting only gives a **lower bound**.
  - Four binary parameters: 24 pairs, each test covers 6 → suggests 4 tests, but the true minimum is **5**.

**Number of T-tuples to cover for Q binary parameters:** (ways to choose T parameters) × 2ᵀ.

| T (four binary parameters) | Tuples to cover |
|---|---|
| 1 | 8 |
| 2 | 24 |
| 3 | 32 |
| 4 | 16 |

**In conclusion:** TWC lets the tester raise the strength of interaction testing step by step, with ACoC as its upper limit.

## Base Choice Coverage (BCC)

**Definition:** recognises that some blocks are more important than others and uses **domain knowledge** to choose tests.

**How it works**
1. Choose **one base block** for each characteristic.
2. Combine all base blocks into the **base test**.
3. Create further tests by holding every characteristic at its base block **except one**, replacing that one with each of its non-base blocks in turn.

- **Number of tests:** 1 + Σ(Bi − 1).

**Examples**
- [A, B], [1, 2, 3], [x, y] with base (A, 1, x) → 1 + (1 + 2 + 1) = **5** tests: (A, 1, x), (B, 1, x), (A, 2, x), (A, 3, x), (A, 1, y).
- Running example with base (a1, b1, c1, d1) → 1 + 1 + 1 + 2 + 1 = **6**.
- `triang()` with four blocks per side → 1 + 3 + 3 + 3 = **10**.

**The base test**
- Must be **feasible**: all base choices compatible, forming a valid executable test (e.g. three sides that really form a triangle).
- Common base choices: end-user view, simplest/smallest value, first value in some ordering, the **happy path**.
- If base choices are valid and the other blocks invalid, BCC naturally produces **stress tests** that expose robustness problems.
- Document why each base was chosen.

**A poor base ruins the test set — `shippingCost()`**
- Weight (light, medium, heavy, over the limit), destination (local, domestic, international), speed (standard, express).
- Good base: (medium, domestic, standard) → 1 + 3 + 2 + 1 = **7** tests.
- Bad base: "over the limit" weight → every test hits the same rejection error and never exercises the pricing logic.

**Pros and cons**
- ✅ Uses domain knowledge; far fewer tests than ACoC; tests interactions around key scenarios; easy to apply.
- ❌ Depends on the tester's choice of base; may miss important combinations; base test must be feasible.

**In conclusion:** BCC focuses testing on the most important scenario and varies one input at a time — efficient and well suited to robustness testing.

## Multiple Base Choice Coverage (MBCC)

**Definition:** allows **one or more base blocks per characteristic** when there is more than one logical base choice.

- A base test is formed for **every combination of base choices**; for each base test, one characteristic at a time is varied over its non-base blocks.
- **Number of tests:** M + Σ M × (Bi − mi), where M = number of base tests (the product of the mi) and mi = number of base blocks in characteristic i.

**Example: `triang()`** (each side has Bi = 4 blocks)
- Side 1 has two base choices (greater than 1, equal to 1) → m1 = 2; sides 2 and 3 have one base choice each (greater than 1).
- M = 2 × 1 × 1 = **2** base tests: (2, 2, 2) and (1, 2, 2).
- Vary side 1: 2 × (4 − 2) = 4 tests.
- Vary side 2: 2 × (4 − 1) = 6 tests.
- Vary side 3: 2 × (4 − 1) = 6 tests.
- Total: 2 + 4 + 6 + 6 = **18**.

**Duplicates**
- Varying side 1 to 0 and to −1 from both base tests produces (0, 2, 2) and (−1, 2, 2) **twice** → only **16 unique** tests.
- Duplicates appear whenever two base tests differ only in the characteristic being varied, so the formula is an **upper bound**.

**In conclusion:** MBCC generalises BCC to several important scenarios, but the tester should remove duplicates the formula counts twice.

## Subsumption Among the Criteria

**Definition:** C1 subsumes C2 when every test set that satisfies C1 also satisfies C2.

**The hierarchy**
- **ACoC subsumes every other criterion.**
- **Every criterion subsumes ECC.**
- Two chains:
  - ACoC → TWC → PWC → ECC
  - ACoC → MBCC → BCC → ECC
- **PWC and BCC are not comparable:**
  - The six-test PWC set for [A, B], [1, 2, 3], [x, y] does **not** satisfy BCC (for any candidate base, the required single-variation tests are missing).
  - The five-test BCC set does **not** satisfy PWC (it never covers the pair (B, y)).

**In conclusion:** subsumption shows which criteria are strictly stronger, but stronger is not always better because stronger criteria cost more tests.

## Comparing the Cost of the Criteria

| Criterion | Running example (A=2, B=2, C=3, D=2) | Pizza model (3, 2, 2, 3) | What it covers |
|---|---|---|---|
| ECC | 3 | 3 | Every block once; no interactions |
| BCC | 6 | 7 | One input varied at a time around a base |
| PWC | at least 6 | at least 9 | Every pair |
| ACoC | 24 | 36 | Every combination |

**Choosing the right criterion depends on the project**
- Prototype demo next week → ECC, possibly BCC on the happy path.
- Safety-critical system (e.g. medication dose calculator) → the strongest affordable criterion: ACoC if the space is small, otherwise PWC or a higher T.
- Checkout page used by millions → PWC, or BCC/MBCC focused on the main flows, with automation.
- ACoC is acceptable when the space is small and tests are automated, but stops being practical as characteristics are added (the count multiplies).

**In conclusion:** choosing a criterion is a trade-off between thoroughness and cost; match the criterion to the risk of the software.

## Constraints Among Characteristics

**Why constraints:** some combinations of blocks are **infeasible**. They must be documented in the IDM, either as a list of invalid block pairs or as a set of inequalities (e.g. a "less than zero" side length cannot be combined with a valid triangle).

**Two types of constraint**
- **"Cannot be combined":** a block of one characteristic cannot go with a specific block of another.
  - Example: a child user account cannot access R-rated content.
- **"Can only be combined":** a block can go only with a specific block of another.
  - Example: an Enterprise licence always comes with dedicated support.
- The two forms are interchangeable: "the Free plan can only be combined with ads" = "the Free plan cannot be combined with no ads".

**Example: `findElement()`**
- Characteristic A (list length and contents): one element; more than one, unsorted; more than one, sorted; more than one, all identical.
- Characteristic B (match): not found; found once; found more than once.
- Two infeasible combinations:
  - A one-element list cannot contain the element more than once.
  - A list of several identical elements cannot contain the element exactly once.

**How each criterion handles constraints**
- **ACoC, PWC, TWC:** infeasible combinations are simply **dropped**. If PWC requires an infeasible pair, no rework can make it feasible (the pair can never appear in a valid test).
- **BCC, MBCC:** the tester **changes a value to another non-base block** to find a feasible combination, since these criteria only need each non-base block to appear in some test close to the base.

**Example: streaming service** — plan (Free, Standard, Premium), ads (with ads, no ads), quality (SD, HD, 4K); Free always shows ads and cannot stream in 4K.
- **ACoC:** 18 combinations; 4 infeasible (3 with Free + no ads, 2 with Free + 4K, minus 1 counted twice) → **14** remain.
- **PWC:** 21 pairs; 2 must be dropped → **19** remain.
- **BCC** with base (Free, with ads, SD):
  - Vary plan to Standard and Premium.
  - Repair infeasible (Free, no ads, SD) as (Standard, no ads, SD).
  - Keep (Free, with ads, HD).
  - Repair (Free, with ads, 4K) as (Standard, with ads, 4K).
  - Result: **6** tests.

**In conclusion:** record constraints in the IDM so infeasible combinations are dropped under ACoC, PWC and TWC and repaired under BCC and MBCC.

## Summary: Why Input Space Partitioning Is Widely Used

- Fairly easy to apply, even with **no automation**.
- Easy to add more or less testing by simply **changing the criterion**.
- Applicable at **all levels**: unit, class, integration, system.
- Based only on the **input space**, not the implementation.

**In conclusion:** input space partitioning is simple, straightforward, effective and widely used, and the combination criteria give the tester full control over how much testing to do.

## Self-test

<details><summary>Q1. Pizza IDM: Size(3) · Crust(2) · Receiving(2) · Payment(3). Give the ACoC, ECC, BCC and PWC-minimum counts.</summary>

ACoC = 3·2·2·3 = **36**. ECC = max = **3**. BCC = 1 + 2 + 1 + 1 + 2 = **7**. PWC minimum = 3 × 3 = **9**. Adding Toppings(3) makes ACoC = **108**.

</details>

<details><summary>Q2. Browser(3) · OS(2) · Network(2): how many pairs, and what is the minimum PWC test count?</summary>

Pairs = 3·2 + 3·2 + 2·2 = **16**; minimum = 3 × 2 = **6**. Adding Language(2) gives 16 + 6 + 4 + 4 = **30** pairs, and the minimum is still 6.

</details>

<details><summary>Q3. shippingCost: Weight(4) · Destination(3) · Speed(2). BCC count? ACoC? ECC?</summary>

BCC = 1 + 3 + 2 + 1 = **7** (base e.g. medium, domestic, standard). ACoC = **24**. ECC = **4**.

</details>

<details><summary>Q4. Same model, MBCC with Weight bases {medium, heavy}, others one base. Formula count and unique count?</summary>

M = 2. Formula: 2 + 2(4−2) + 2(3−1) + 2(2−1) = 2 + 4 + 4 + 2 = **12**. The weight variants (light and over-limit) come out the same from both bases, so **10 unique**.

</details>

<details><summary>Q5. True/false: (a) PWC ⇒ ECC (b) BCC ⇒ PWC (c) ACoC ⇒ MBCC (d) TWC with T = Q is ACoC.</summary>

(a) **True** (b) **False**: the BCC example misses the pair (B, y) (c) **True** (d) **True**.

</details>

<details><summary>Q6. Why is the MBCC formula an upper bound?</summary>

Two base tests can generate the **same variant** (when they differ only in the characteristic being varied), so some tests are counted twice.

</details>

<details><summary>Q7. Why can BCC repair an infeasible test but PWC cannot?</summary>

BCC only needs each non-base block to appear in some test, so another characteristic can be changed to a non-base block. PWC needs a specific pair; an infeasible pair can never be in any valid test, so it is dropped.

</details>

<details><summary>Q8. What must be true of the BCC base test?</summary>

It must be **feasible**: all base choices compatible, giving a valid, executable test (usually the happy path).

</details>
