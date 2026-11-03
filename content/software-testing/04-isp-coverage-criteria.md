---
title: "Ch 6 Part 2 — Combination Criteria & Constraints"
summary: ACoC, ECC, PWC, TWC, BCC and MBCC with their formulas and worked examples, the subsumption hierarchy, the cost comparison, and how each criterion handles infeasible combinations.
tags: [chapter-6, isp, coverage-criteria, acoc, ecc, pwc, bcc, mbcc]
sort: 4
---

## Choosing Combinations of Blocks

Step 4 of input domain modeling answers a question that Part 1 left open: once every characteristic has been partitioned into blocks, how should blocks from different characteristics be combined into tests? A single test might need, for example, block 1 of one characteristic and block 3 of another. The obvious answer is to try every combination, but that quickly becomes impractical once more than two or three partitions are defined. Coverage criteria solve this problem by choosing combinations selectively. Each abstract test starts by combining one block from each characteristic, and concrete values are then chosen to satisfy that combination.

Throughout this chapter, Q is the number of characteristics and Bi is the number of blocks in characteristic i. A running example is used to compare the criteria: four characteristics A = [a1, a2], B = [b1, b2], C = [c1, c2, c3] and D = [d1, d2]. These could describe students, for instance, by level (graduate or undergraduate), mode (full-time or part-time), major (CS, SWE or other) and classification (in-state or out-of-state). A smaller example with three characteristics, [A, B], [1, 2, 3] and [x, y], is also used.

In conclusion, coverage criteria give the tester a principled rule for deciding which block combinations to test, instead of facing an exponential number of possibilities.

## All Combinations Coverage (ACoC)

All Combinations Coverage requires every combination of blocks from all characteristics to be used. The number of tests is the product of the block counts, B1 × B2 × … × BQ. In set terms, an ACoC test set is the Cartesian product of the block sets, because every block of each characteristic is combined with every block of every other characteristic exactly once. For [A, B] × [1, 2, 3] × [x, y], ACoC needs 2 × 3 × 2 = 12 tests, from (A, 1, x) and (A, 1, y) through to (B, 3, x) and (B, 3, y). Three characteristics with 4, 2 and 3 blocks need 24 tests, the running student example needs 2 × 2 × 3 × 2 = 24 tests, and triang() with four blocks per side needs 4 × 4 × 4 = 64 tests.

ACoC is thorough, it reveals hidden bugs that depend on interactions, and it improves test quality. However, it does not scale, it is resource intensive and it creates redundancy. For a pizza-ordering function with size (3 blocks), crust (2), receiving method (2) and payment (3), ACoC already needs 3 × 2 × 2 × 3 = 36 tests, and adding a toppings characteristic with 3 blocks triples that to 108.

In conclusion, ACoC is the strongest criterion but also the most expensive, so it is practical only when the input space is small and the tests are automated.

## Each Choice Coverage (ECC)

Each Choice Coverage is the weakest and lightest criterion. It requires that one value from each block of each characteristic is used in at least one test. The number of tests needed is the maximum of the Bi, the block count of the largest characteristic. For the running example this is max(2, 2, 3, 2) = 3 tests, for instance (a1, b1, c1, d1), (a2, b2, c2, d2) and (a1, b1, c3, d1). The third test may reuse any blocks for A, B and D, because characteristic C, with three blocks, is the one that decides the count.

ECC is simple, needs few tests and guarantees that every block is tested at least once. Its main weakness is that it does not test interactions between parameters, so it may miss bugs that need specific combinations. For example, suppose a pizza ordering system crashes whenever a customer pays online and chooses delivery. A valid ECC set such as (small, thin, pickup, cash), (medium, thick, delivery, card) and (large, thin, pickup, online) never pairs online payment with delivery, so the bug is missed. ECC is best used for a quick, lightweight design when time is limited, or as a baseline before stronger criteria such as pair-wise or base choice coverage.

In conclusion, ECC makes sure no block is ignored, but because it never requires combinations, it should be treated as a minimum rather than a complete strategy.

## Pair-Wise Coverage (PWC)

Pair-Wise Coverage addresses ECC's weakness by explicitly requiring combinations. A value from each block of each characteristic must be combined with a value from every block of every other characteristic. The number of pairs to cover is the sum of Bi × Bj over every pair of characteristics. For [A, B], [1, 2, 3] and [x, y], there are 6 + 4 + 6 = 16 pairs. The minimum number of tests is at least the product of the two largest block counts, here 3 × 2 = 6. One valid set is (A, 1, x), (A, 2, x), (A, 3, y), (B, 1, y), (B, 2, y) and (B, 3, x). Each test covers several pairs at once: with three characteristics, a test such as (A, 1, x) covers the three pairs (A, 1), (A, x) and (1, x). Several different test sets can satisfy PWC.

As another example, a web app tested on browser (Chrome, Firefox, Safari), operating system (Windows, macOS) and network (WiFi, 4G) has 6 + 6 + 4 = 16 pairs and needs at least 3 × 2 = 6 tests. Adding a language characteristic (English, Arabic) raises the number of pairs to 30, but the minimum stays at 6 because the two largest characteristics are unchanged.

In conclusion, PWC catches faults caused by any two interacting inputs while needing far fewer tests than ACoC.

## T-Wise Coverage (TWC)

T-Wise Coverage extends pair-wise coverage to groups of T characteristics: a value from each block of each group of T characteristics must be combined. PWC is the special case where T = 2, and when T equals the number of characteristics Q, TWC becomes the same as ACoC. The minimum number of tests is determined by mathematical results called covering arrays, and tools such as Microsoft PICT and NIST ACTS can generate them. Simple counting arguments only give a lower bound. For example, four binary parameters have 24 pairs and each test covers 6 of them, which suggests 4 tests, but the true minimum is 5. For Q binary parameters, the number of T-tuples to cover is the number of ways to choose T parameters multiplied by 2 to the power T; for four binary parameters, that is 8 for T = 1, 24 for T = 2, 32 for T = 3 and 16 for T = 4.

In conclusion, TWC lets the tester raise the strength of interaction testing step by step, with ACoC as its upper limit.

## Base Choice Coverage (BCC)

Base Choice Coverage recognises that some blocks are more important than others and brings domain knowledge into the choice of tests. The tester first chooses one base block for each characteristic and combines all the base blocks into a base test. Further tests are then created by holding every characteristic at its base block except one, and replacing that one with each of its non-base blocks in turn. The number of tests is 1 + Σ(Bi − 1). For [A, B], [1, 2, 3] and [x, y] with base (A, 1, x), BCC gives 1 + (1 + 2 + 1) = 5 tests: the base test (A, 1, x), then (B, 1, x), (A, 2, x), (A, 3, x) and (A, 1, y). For the running example with base (a1, b1, c1, d1), it gives 1 + 1 + 1 + 2 + 1 = 6 tests, and for triang() with four blocks per side it gives 1 + 3 + 3 + 3 = 10 tests.

The base test must be feasible, meaning all the base choices are compatible and form a valid, executable test, such as three sides that really form a triangle. Common choices for a base are the end-user view, the simplest or smallest value, the first value in some ordering, or the happy path. If the base choices are valid and the other blocks invalid, BCC naturally produces stress tests that expose robustness problems, and the tester should document why each base was chosen. A poor base can ruin the test set. For a shippingCost() function with weight (light, medium, heavy, over the limit), destination (local, domestic, international) and speed (standard, express), a sensible base is (medium, domestic, standard), which gives 1 + 3 + 2 + 1 = 7 tests. If "over the limit" were chosen as the base weight, every test would hit the same rejection error and never exercise the pricing logic.

BCC uses domain knowledge, needs far fewer tests than ACoC, tests interactions around key scenarios and is easy to apply. Its disadvantages are that it depends on the tester's choice of base, it may miss important combinations, and the base test must be feasible.

In conclusion, BCC focuses testing around the most important scenario and varies one input at a time, which makes it efficient and well suited to robustness testing.

## Multiple Base Choice Coverage (MBCC)

Sometimes a characteristic has more than one logical base choice. Multiple Base Choice Coverage allows one or more base blocks per characteristic. A base test is formed for every combination of base choices, and for each base test, one characteristic at a time is varied over its non-base blocks. The number of tests is M + Σ M × (Bi − mi), where M is the number of base tests (the product of the mi) and mi is the number of base blocks in characteristic i.

For triang(), each side has Bi = 4 blocks. Suppose side 1 has two base choices, greater than 1 and equal to 1, so m1 = 2, while sides 2 and 3 have one base choice each, greater than 1. Then M = 2 × 1 × 1 = 2, and the base tests are (2, 2, 2) and (1, 2, 2). Varying side 1 gives 2 × (4 − 2) = 4 tests, varying side 2 gives 2 × (4 − 1) = 6 tests and varying side 3 gives 2 × (4 − 1) = 6 tests, for a total of 2 + 4 + 6 + 6 = 18. However, varying side 1 to 0 and to −1 from both base tests produces (0, 2, 2) and (−1, 2, 2) twice, so only 16 tests are unique. Duplicates appear whenever two base tests differ only in the characteristic being varied, which is why the formula is an upper bound.

In conclusion, MBCC generalises BCC to several important scenarios, but the tester should remove duplicate tests that the formula counts twice.

## Subsumption Among the Criteria

A criterion C1 subsumes a criterion C2 when every test set that satisfies C1 also satisfies C2. ACoC subsumes every other criterion, and every criterion subsumes ECC. There are two chains: ACoC subsumes TWC, which subsumes PWC, which subsumes ECC; and ACoC subsumes MBCC, which subsumes BCC, which subsumes ECC. PWC and BCC are not comparable. The six-test PWC set for [A, B], [1, 2, 3], [x, y] does not satisfy BCC, because for any candidate base the required single-variation tests are missing. The five-test BCC set does not satisfy PWC, because it never covers the pair (B, y).

In conclusion, subsumption shows which criteria are strictly stronger, but stronger is not always better, because the stronger criteria cost more tests.

## Comparing the Cost of the Criteria

For the running example A = [a1, a2], B = [b1, b2], C = [c1, c2, c3], D = [d1, d2], ECC needs 3 tests and tests no interactions, BCC needs 6 tests and varies one input at a time around a base, PWC needs at least 6 tests and covers every pair, and ACoC needs 24 tests and covers every combination. For the pizza model, the counts are 3 for ECC, 7 for BCC, at least 9 for PWC and 36 for ACoC.

The right criterion depends on the project. A prototype demo next week may only need ECC, possibly with BCC on the happy path. A safety-critical system such as a medication dose calculator should use the strongest affordable criterion: ACoC if the space is small, otherwise PWC or a higher T. A checkout page used by millions of customers would suit PWC or BCC/MBCC focused on the main flows, with automation. ACoC is acceptable when the space is small and the tests are automated, but it stops being practical as characteristics are added, because the count multiplies.

In conclusion, choosing a criterion is a trade-off between thoroughness and cost, and the tester should match the criterion to the risk of the software.

## Constraints Among Characteristics

Some combinations of blocks are infeasible, and these constraints must be documented in the IDM, either as a list of invalid block pairs or as a set of inequalities. For example, a "less than zero" side length cannot be combined with a valid triangle. There are two types of constraint. A "cannot be combined" constraint says that a block of one characteristic cannot go with a specific block of another; for example, a child user account cannot access R-rated content. A "can only be combined" constraint says that a block can go only with a specific block of another; for example, an Enterprise licence always comes with dedicated support. The two forms are interchangeable: "the Free plan can only be combined with ads" is the same rule as "the Free plan cannot be combined with no ads".

The findElement() example shows constraints in practice. If characteristic A describes the list's length and contents (one element; more than one, unsorted; more than one, sorted; more than one, all identical) and characteristic B describes the match (not found; found once; found more than once), then two combinations are infeasible. A one-element list cannot contain the element more than once, and a list of several identical elements cannot contain the element exactly once.

How constraints are handled depends on the criterion. For ACoC, PWC and TWC, the infeasible combinations are simply dropped. If PWC requires an infeasible pair, no rework by the tester can make it feasible, because the pair can never appear in a valid test. For BCC and MBCC, the tester changes a value to another non-base block to find a feasible combination, because these criteria only need each non-base block to appear in some test close to the base.

Consider a streaming service with plan (Free, Standard, Premium), ads (with ads, no ads) and quality (SD, HD, 4K), where the Free plan always shows ads and cannot stream in 4K. ACoC has 18 combinations, of which 4 are infeasible (3 with Free and no ads, 2 with Free and 4K, minus 1 counted twice), leaving 14. PWC has 21 pairs, of which 2 must be dropped, leaving 19. A BCC set with base (Free, with ads, SD) varies the plan to Standard and Premium, repairs the infeasible variant (Free, no ads, SD) as (Standard, no ads, SD), keeps (Free, with ads, HD) and repairs (Free, with ads, 4K) as (Standard, with ads, 4K), giving 6 tests.

In conclusion, constraints must be recorded in the IDM so the tester can drop infeasible combinations under ACoC, PWC and TWC and repair them under BCC and MBCC.

## Summary: Why Input Space Partitioning Is Widely Used

Input space partitioning is fairly easy to apply, even with no automation. It offers convenient ways to add more or less testing simply by changing the criterion. It is applicable at all levels: unit, class, integration and system. It is based only on the input space, not the implementation.

In conclusion, input space partitioning is simple, straightforward, effective and widely used, and the combination criteria in this chapter give the tester full control over how much testing to do.

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
