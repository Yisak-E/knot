---
title: "Ch 6 Part 2 — Combination Criteria & Constraints"
summary: ACoC, ECC, PWC, TWC, BCC and MBCC with formulas and worked tables, the subsumption hierarchy, the cost comparison, and how each criterion handles infeasible combinations.
tags: [chapter-6, isp, coverage-criteria, acoc, ecc, pwc, bcc, mbcc]
sort: 4
---

## The question Step 4 answers

After partitioning each characteristic (Step 3), **which combinations of blocks** should tests use? "All combinations" is obvious but becomes **impractical** beyond two or three partitions. **Coverage criteria** choose combinations selectively.

**Notation:** Q = number of characteristics; Bᵢ = number of blocks in characteristic i.

Running abstract IDM (used in lecture & exams):
**A = [a1, a2] · B = [b1, b2] · C = [c1, c2, c3] · D = [d1, d2]**
(e.g. students: Level grad/undergrad · Mode full/part-time · Major cs/swe/other · Classification in/out-of-state)

## 1. All Combinations Coverage (ACoC) ⭐

> **Every combination** of blocks from all characteristics must be used.

**Tests = B₁ × B₂ × … × B_Q**, the **Cartesian product** of the block sets.

- [A,B] × [1,2,3] × [x,y] gives 2 × 3 × 2 = **12**
- A(4) × B(2) × C(3) gives **24**
- Running IDM: 2 × 2 × 3 × 2 = **24**
- triang() with 4 blocks per side: 4³ = **64**

| Pros | Cons |
|---|---|
| Thorough; reveals hidden interaction bugs; high test quality | Doesn't scale; resource intensive; redundancy |

## 2. Each Choice Coverage (ECC) ⭐

> **One value from each block** of each characteristic must be used in **at least one** test.

**Tests = max(Bᵢ)**, the size of the largest characteristic. ECC is the **weakest/lightest** criterion.

Running IDM: max(2, 2, 3, 2) = **3**

| Test | A | B | C | D |
|---|---|---|---|---|
| TC1 | a1 | b1 | c1 | d1 |
| TC2 | a2 | b2 | c2 | d2 |
| TC3 | a1 | b1 | c3 | d1 |

TC3 can reuse any blocks for A, B and D.

| Pros | Cons |
|---|---|
| Simple; fewest tests; every block tested at least once | **Does not test interactions**; may miss bugs needing specific combinations |

Use it for a quick design when time is short, or as a **baseline** before PWC or BCC.

> **Bug-hunt lesson:** if "online payment + delivery" crashes, an ECC set may never pair those two blocks, so the bug is missed. Requiring specific pairs is what PWC adds.

## 3. Pair-Wise Coverage (PWC) ⭐

> A value from **each block of each characteristic** must be combined with a value from **every block of every other characteristic**.

**Minimum tests ≥ (largest Bᵢ) × (second-largest Bᵢ)**

**Number of pairs to cover** = Σ over each pair of characteristics of Bᵢ × Bⱼ.

[A, B], [1, 2, 3], [x, y] gives 6 + 4 + 6 = **16 pairs**; minimum tests = 3 × 2 = **6**:

| Test | C1 | C2 | C3 |
|---|---|---|---|
| 1 | A | 1 | x |
| 2 | A | 2 | x |
| 3 | A | 3 | y |
| 4 | B | 1 | y |
| 5 | B | 2 | y |
| 6 | B | 3 | x |

One test covers several pairs at once: (A,1,x) covers (A,1), (A,x) and (1,x), so with 3 characteristics each test covers C(3,2) = **3 pairs**. Many different test sets can satisfy PWC.

## 4. T-Wise Coverage (TWC)

> A value from each block of each group of **T** characteristics must be combined.

- T = 2 is PWC. **T = Q (all characteristics) is ACoC.**
- Minimum test counts come from **covering arrays** (tools: Microsoft PICT, NIST ACTS).
- Counting arguments give only a **lower bound**. E.g. 4 binary parameters: 24 pairs, 6 pairs per test, so ≥ 4, but the true minimum is **5**.
- Number of T-tuples for Q binary params = C(Q, T) × 2ᵀ (Q = 4: T=1: 8, T=2: 24, T=3: 32, T=4: 16).

## 5. Base Choice Coverage (BCC) ⭐⭐

> Choose a **base block** for each characteristic and form the **base test** from all of them. Then build further tests by holding all but one characteristic at base and using **each non-base block** of that one.

**Tests = 1 + Σ (Bᵢ − 1)**

[A, B], [1, 2, 3], [x, y] with base (A, 1, x): 1 + (1 + 2 + 1) = **5**

| Test | C1 | C2 | C3 |
|---|---|---|---|
| Base | A | 1 | x |
| vary 1 | B | 1 | x |
| vary 2 | A | 2 | x |
| vary 2 | A | 3 | x |
| vary 3 | A | 1 | y |

Running IDM with base (a1, b1, c1, d1): 1 + 1 + 1 + 2 + 1 = **6**: base, (a2 b1 c1 d1), (a1 b2 c1 d1), (a1 b1 c2 d1), (a1 b1 c3 d1), (a1 b1 c1 d2).
triang() with 4 blocks per side: 1 + 3 + 3 + 3 = **10**.

**Choosing the base:**

- The base test **must be feasible**: all base choices compatible (e.g. 3 sides that form a real triangle).
- Typical picks: **happy path**, simplest, smallest, most common, first in some ordering, or the end-user view.
- If the base is valid and the other blocks are invalid, BCC naturally produces **stress / robustness tests**.
- **Document why** each base was chosen.
- A poor base, e.g. (over-the-limit weight, …), makes every test hit the same rejection error, so the rest of the logic is never exercised.

| Pros | Cons |
|---|---|
| Uses **domain knowledge**; fewer tests than ACoC; tests interactions around key scenarios; easy | Depends on the tester's base choice; may miss important combinations; base must be feasible |

## 6. Multiple Base Choice Coverage (MBCC)

> Choose **one or more** base blocks per characteristic and form base tests from **every combination** of base choices. For **each** base test, vary one characteristic at a time over its **non-base** blocks.

**Tests = M + Σ M × (Bᵢ − mᵢ)** (an **upper bound**, since duplicates may appear)

- M = number of base tests = ∏ mᵢ
- mᵢ = number of base blocks in characteristic i

**triang() example:** Bᵢ = 4 for each side. Side 1 bases {>1, =1} so m₁ = 2; sides 2 and 3 base {>1} so m₂ = m₃ = 1. M = 2 × 1 × 1 = **2** base tests: (2,2,2) and (1,2,2).

| Term | Calc | Tests |
|---|---|---|
| Base tests | M | 2 |
| Vary side 1 | 2 × (4 − 2) | 4 |
| Vary side 2 | 2 × (4 − 1) | 6 |
| Vary side 3 | 2 × (4 − 1) | 6 |
| **Total** | | **18** |

Varying side 1 from **both** bases to 0 and −1 gives (0,2,2) and (−1,2,2) **twice**, so these are duplicates. **Duplicates appear when two base tests differ only in the characteristic being varied.** That's why the formula is an upper bound (here 18 − 2 = **16 unique**).

## 7. Subsumption ⭐⭐

**A subsumes B**: every test set that satisfies A also satisfies B.

```
            ACoC
           /    \
        TWC      MBCC
         |         |
        PWC       BCC
           \     /
             ECC
```

- ACoC subsumes everything; ECC is subsumed by everything.
- ACoC → TWC → PWC → ECC and ACoC → MBCC → BCC → ECC.
- **PWC and BCC are not comparable.** The 6-test PWC set above does not satisfy BCC, and the 5-test BCC set misses the pair (B, y), so it doesn't satisfy PWC.
- TWC with T = Q is the same as ACoC.

## 8. Cost comparison (running IDM)

| Criterion | Tests | What you get |
|---|---|---|
| ECC | **3** | No interactions |
| BCC | **6** | One variation at a time around a base |
| PWC | **6** (min = 3 × 2) | Every pair |
| ACoC | **24** | Every combination |

Choosing in practice: **prototype demo**: ECC (+ BCC on the happy path). **Safety-critical** (medication dose): the strongest affordable criterion (ACoC if small, else PWC / higher T). **High-traffic checkout**: PWC or BCC/MBCC on the main flows, automated.

## 9. Constraints among characteristics (Section 6.3) ⭐

Some block combinations are **infeasible** and must be **documented in the IDM**, either as a list of invalid block pairs or as a set of inequalities.

**Two types:**

| Type | Meaning | Example |
|---|---|---|
| **Cannot be combined** | Block X never goes with block Y | (User = Child, Content = R-rated) |
| **Can only be combined** | Block X goes **only** with block Y | (License = Enterprise, Support = Dedicated) |

These are interchangeable: "Free can only have ads" is the same rule as "Free cannot have no-ads".

**findElement() example:**

| Characteristic | Block 1 | Block 2 | Block 3 | Block 4 |
|---|---|---|---|---|
| A: length & contents | one element | >1, unsorted | >1, sorted | >1, all identical |
| B: match | not found | found once | found more than once | |

Infeasible: **(A1, B3)**, since a 1-element list can't contain the element twice; **(A4, B2)**, since if all elements are identical the element can't be found exactly once.

### Handling constraints depends on the criterion ⭐

| Criterion | What to do |
|---|---|
| **ACoC, PWC, TWC** | **Drop** the infeasible combinations. An infeasible pair can **never** be covered, so no rework can fix it |
| **BCC, MBCC** | **Change a value** to another **non-base** block to find a feasible combination |

Why the difference: BCC only needs each non-base block to appear in *some* test close to the base, so other values can be adjusted. PWC needs **one exact pair**; change it and it's no longer that pair.

**Worked example (streaming service):** Plan {Free, Standard, Premium} · Ads {with, none} · Quality {SD, HD, 4K}. Rules: Free must have ads; Free can't do 4K.

- ACoC: 18 total. Infeasible: 3 (Free, no ads) + 2 (Free, 4K) − 1 counted twice = 4. **14 feasible**.
- PWC: 21 pairs, drop (Free, no ads) and (Free, 4K), leaving **19**.
- BCC with base (Free, ads, SD): vary plan gives 2 tests; vary ads gives (Free, no ads, SD), which is infeasible, so change Plan to Standard: (Standard, no ads, SD); vary quality gives (Free, ads, HD) ✓ and (Free, ads, 4K), which is infeasible, so use (Standard, ads, 4K). Total **6**.

## Summary: why ISP is widely used

- Fairly **easy to apply**, even with no automation.
- **Convenient** ways to add more or less testing (choose a criterion).
- Applicable at **all levels**: unit, class, integration, system.
- Based **only on the input space**, not the implementation.
- Simple, straightforward, effective and widely used.

## Self-test

<details><summary>Q1. Pizza IDM: Size(3) · Crust(2) · Receiving(2) · Payment(3). Give ACoC, ECC, BCC, PWC-min.</summary>

ACoC = 3·2·2·3 = **36**. ECC = max = **3**. BCC = 1 + 2 + 1 + 1 + 2 = **7**. PWC min = 3 × 3 = **9**. Adding Toppings(3) makes ACoC = **108**.

</details>

<details><summary>Q2. Browser(3) · OS(2) · Network(2): how many pairs, and what is the minimum PWC test count?</summary>

Pairs = 3·2 + 3·2 + 2·2 = **16**; minimum = 3 × 2 = **6**. Adding Language(2) gives 16 + 6 + 4 + 4 = **30** pairs, and the minimum is still 6.

</details>

<details><summary>Q3. shippingCost: Weight(4) · Destination(3) · Speed(2). BCC count? ACoC? ECC?</summary>

BCC = 1 + 3 + 2 + 1 = **7** (base e.g. medium, domestic, standard). ACoC = **24**. ECC = **4**.

</details>

<details><summary>Q4. Same model, MBCC with Weight bases {medium, heavy}, others one base. Formula count and unique count?</summary>

M = 2. Formula: 2 + 2(4−2) + 2(3−1) + 2(2−1) = 2 + 4 + 4 + 2 = **12**. Weight variants duplicate (light and over-limit from both bases), so **10 unique**.

</details>

<details><summary>Q5. True/false: (a) PWC ⇒ ECC (b) BCC ⇒ PWC (c) ACoC ⇒ MBCC (d) TWC with T = Q is ACoC.</summary>

(a) **True** (b) **False**: the slide-18 BCC set misses (B, y) (c) **True** (d) **True**.

</details>

<details><summary>Q6. Why is the MBCC formula an upper bound?</summary>

Two base tests can generate the **same variant** (when they differ only in the characteristic being varied), so some tests are counted twice.

</details>

<details><summary>Q7. Why can BCC repair an infeasible test but PWC cannot?</summary>

BCC only needs each non-base block to appear in some test, so another characteristic can be changed to a non-base block. PWC needs a specific pair; an infeasible pair can never be in any valid test, so it is dropped.

</details>

<details><summary>Q8. What must be true of the BCC base test?</summary>

It must be **feasible**: all base choices compatible, producing a valid, executable test (usually the happy path).

</details>
