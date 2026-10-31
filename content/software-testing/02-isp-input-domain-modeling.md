---
title: "Ch 6 Part 1 — Input Space Partitioning & IDM"
summary: Partitions (disjoint + complete), characteristics and blocks, the five-step IDM process, interface- vs functionality-based modelling, block-choosing strategies, triang() and findElement() examples.
tags: [chapter-6, isp, idm, partitioning]
sort: 2
---

## The big idea in one line

**All testing is choosing elements from the input space.** Input Space Partitioning (ISP) divides that space into **blocks** and picks **at least one value from each block**.

## 1. Where ISP fits: four structures for modelling software

| Structure | Applied to |
|---|---|
| **Input space** (this chapter) | Partition the inputs into blocks |
| Graphs | Source, specs, design, use cases |
| Logic | Source, specs, FSMs, DNF |
| Syntax | Source, models, integration, input |

*DNF (disjunctive normal form)*: ANDed clauses joined by ORs, e.g. (A ∧ B) ∨ (C ∧ D).

ISP is **independent of the RIPR model** (Reachability, Infection, Propagation, Revealability). It uses **only the input space**.

## 2. Key definitions ⭐

| Term | Meaning |
|---|---|
| **Input domain** | All possible inputs to a program. Usually so large it is effectively infinite |
| **Input parameters** | Define the domain's scope: method parameters, file data, global variables, user inputs |
| **Characteristic** | A feature/property of the inputs or environment used to partition, e.g. "is X null?", "order of list F" |
| **Partition / blocks** | A characteristic splits the domain into **blocks** b₁…b_Q, assumed equally useful for testing |
| **IDM** | Input Domain Model: an abstract representation of the input space (characteristics + blocks + constraints) |

Example: domain = letters, characteristic = case of letter, blocks = {upper case}, {lower case}.

## 3. A valid partition: the two properties ⭐⭐

For domain **D** and partition scheme **q** with blocks **B_q = {b₁, b₂, …, b_Q}**:

1. **Pairwise disjoint**: no overlap. bᵢ ∩ bⱼ = ∅ for all i ≠ j.
2. **Complete**: blocks cover the domain. ⋃ b = D.

**Core assumption: equivalence within a block.** If blocks are chosen well, every value in a block makes the program behave the same way, so **one test per block** is enough (e.g. age 30 represents all of "Adult 18–64").

### Classic mistakes (exam favourites)

| Partition | Problem | Fix |
|---|---|---|
| Integers: {x < 0}, {x > 0} | **Not complete**: 0 is missing | Add {x = 0} |
| List order: {sorted asc}, {sorted desc}, {arbitrary} | **Not disjoint**: [14] (or an empty list) is both asc and desc | Two Boolean characteristics: "sorted asc?" T/F and "sorted desc?" T/F |
| Triangle: {scalene}, {isosceles}, {equilateral}, {invalid} | **Not disjoint**: equilateral is also isosceles | {isosceles **but not equilateral**} |
| Grades: 0–60, 60–69, 70–79, 80–89, 90–100, −1, 101 | **Not disjoint** (60 twice) and **not complete** (−50, 500 missing) | x<0 · 0–59 · 60–69 · 70–79 · 80–89 · 90–100 · x>100 |
| Quadrilaterals: {square}, {rectangle}, {rhombus}, {other} | **Not disjoint**: a square is a rectangle and a rhombus | {square}, {rectangle not square}, {rhombus not square}, {other} |
| Weight kg: {0–5}, {5–10}, {10–20} | **Not disjoint** (5, 10) and **not complete** (<0, >20) | {<0}, {0–4}, {5–9}, {10–20}, {>20} |

> **Rule:** design blocks for **one property per characteristic**. Prefer more characteristics with fewer blocks.

Valid partitions of the integers: {negative, zero, positive}, or {even, odd}.

### Example: sqrt(x), with one partition per characteristic

| Characteristic | Blocks |
|---|---|
| Sign of x | negative (error) · zero · positive |
| Magnitude of x | normal · very large |
| Whole number? | integer · non-integer |

## 4. Benefits of ISP

- **Any level:** unit, integration, system.
- **Easy to apply:** no automation, little training.
- **Adjustable:** tune to get more or fewer tests.
- **Black-box:** no implementation knowledge needed, just the input space.

## 5. The combinatorial explosion

15 parameters × 3 blocks each gives **3¹⁵ = 14,348,907 tests**, about **166 days** at one test per second.
3 filters (size, colour, brand) × 2 options each gives 2³ = 8 tests. More variables make the count grow **exponentially**.

**Standard approach:** (1) partition each parameter **separately**, (2) **combine blocks selectively** using a coverage criterion (Part 2).

## 6. The five-step IDM process ⭐⭐

| Step | Activity | Level |
|---|---|---|
| **1** | Identify **testable functions** | Implementation |
| **2** | Find all **inputs, parameters, characteristics** | Implementation |
| **3** | **Model the input domain** (partition into blocks); the key *creative* step | **Design abstraction** |
| **4** | Apply a criterion to **choose combinations** of values | Design abstraction |
| **5** | **Refine** abstract combinations into concrete **test inputs** | Back to implementation |

Moving from step 2 to step 3 means moving **up** from the implementation level to the **design abstraction** level.

**Step 1 sources:** every **public method** in a class (characteristics are often shared across methods, e.g. a Calculator class), or each **UML use case** (e.g. ATM "withdraw cash", which suggests "Is card valid?" and "Relation of withdrawal policy to request").

**Step 2:** not especially creative, but **find every parameter** that can affect behaviour.

## 7. Two approaches to modelling (Step 3) ⭐

| | **Interface-based** | **Functionality-based** |
|---|---|---|
| Basis | Each **parameter separately**, using syntax/type | **Intended behaviour** from the spec/requirements |
| Strengths | Almost automatic; easy to identify characteristics; abstract tests translate easily to executable ones | Uses **domain knowledge**, carries more semantics; often **better tests**; can start **early** (before code) |
| Weaknesses | **Misses interactions** between parameters; IDM may be incomplete | Harder to design; needs more thought |
| triang() example | "Relation of side 1 to 0" | "Type of triangle" |

Related wording: **syntax-based IDM** (structure/type of inputs, finds invalid inputs, e.g. triang(−1,5,5) gives Invalid) vs **behaviour-based IDM** (expected outputs/logic, e.g. triang(5,5,5) gives Equilateral). **Use both**: syntax covers every way to be invalid; behaviour covers every valid outcome.

**Interface example (bank transfer):** hold two parameters valid and vary the third: (valid, valid, in range), (invalid, valid, in range), (valid, invalid, in range), (valid, valid, below range), (valid, valid, above range). This is the idea behind **Base Choice Coverage**.

**Functionality example, factorial(n):** n = 0 returns 1; n in range gives a valid result; n negative gives an error; n a float gives an error; n too large overflows (13! overflows a 32-bit int).

**divide(num, den):** C1 denominator (zero/pos/neg), C2 numerator (zero/pos/neg), C3 result type (even/remainder/undefined), C4 sign of result (pos/neg/zero).

## 8. Choosing blocks and values

More blocks means more tests and possibly more faults found. Fewer blocks means fewer tests and possibly lower effectiveness.

| Strategy | Idea |
|---|---|
| **Valid vs invalid** | Include both, to see how the system reacts to unexpected input |
| **Sub-partition** | Split a valid range by functionality (child / adult / senior ticket) |
| **Boundaries** | Values at or near boundaries often cause failures (a form of stress testing) |
| **Normal use** | Happy-path values, matching the operational profile |
| **Enumerated types** | Discrete set of blocks (triangle types) |
| **Balance** | Adding blocks to characteristics with few blocks may be cheap or free |
| **Missing blocks** | Check that the union covers the whole space (**complete**) |
| **Overlapping blocks** | Check that no value is in two blocks (**disjoint**) |

**Special values:** `null` for references; **empty** for containers (Set, List).

### IDM hints

- More characteristics or blocks means more tests.
- Prefer **more characteristics with fewer blocks** (fewer mistakes, fewer tests).
- Stay **independent of the implementation**; base the IDM on the spec.
- Choose values strategically: valid, invalid, special, boundaries; **balance** block counts.

## 9. Running example: triang(s1, s2, s3)

Returns `SCALENE`, `ISOSCELES`, `EQUILATERAL` or `INVALID`.

```java
if (s1 <= 0 || s2 <= 0 || s3 <= 0) return INVALID;
if (s1 == s2 && s2 == s3)            return EQUILATERAL;
if (s1 == s2 || s2 == s3 || s1 == s3) return ISOSCELES;
return SCALENE;
```

**IDM 1: interface-based, relation of each side to 0.** Blocks: > 0, = 0, < 0. Gives **3³ = 27** combinations.

**IDM 2: refined.** Blocks per side: **> 1, = 1, = 0, < 0**, with values 2, 1, 0, −1. Gives **4³ = 64** combinations. Complete only because inputs are integers; includes the boundaries 0 and 1.

**IDM 3: functionality-based, geometric type.** {scalene, isosceles-not-equilateral, equilateral, invalid}, with values (4,5,6), (3,3,4), (3,3,3), (3,4,8).
Triangle inequality: a + b > c, a + c > b, b + c > a. (3, 4, 8) is invalid since 3 + 4 ≯ 8.

**IDM 4: four Boolean characteristics** (Scalene?, Isosceles?, Equilateral?, Valid?) with **constraints**: Equilateral = T ⇒ Isosceles = T; Valid = F ⇒ the others are all F.

> **Insight:** (4,5,6) and (3,4,8) both fall into (>1, >1, >1) in IDM 2, yet one is scalene and one invalid. Equivalence within a block fails, so the interface model **alone is not enough**.

## 10. Example: findElement(list, element)

```java
public boolean findElement(List list, Object element)
// if list or element is null throw NullPointerException
// else return true if element is in list, false otherwise
```

- **Syntax-based (T/F each):** list is null · list is empty · element is null.
- **Behaviour-based (list, element ≠ null):** element present/absent · list size 0 / 1 / >1 · position if present: first / last / middle / only.

Example of creating an IDM: `findLast(int[] a, int x)` returns the last index of x or −1. Characteristics: a is null? · a empty? · x in a (no / once / more than once) · position of last occurrence (first / middle / last).

## Self-test

<details><summary>Q1. State the two properties of a valid partition.</summary>

**Pairwise disjoint** (bᵢ ∩ bⱼ = ∅ for i ≠ j) and **complete** (the union of the blocks equals the domain).

</details>

<details><summary>Q2. Why is {sorted ascending, sorted descending, arbitrary} a defective partition?</summary>

Not disjoint: a list of length 0 or 1 (e.g. [14]) is both ascending and descending. Fix: two separate Boolean characteristics.

</details>

<details><summary>Q3. List the five IDM steps. At which step do we move to the design abstraction level?</summary>

1 identify functions, 2 find parameters/characteristics, 3 model the input domain, 4 choose combinations, 5 refine into test inputs. Moving from step 2 to step 3 goes from implementation to design abstraction.

</details>

<details><summary>Q4. Interface-based vs functionality-based: one strength and one weakness each.</summary>

Interface: easy/almost automatic, but misses parameter interactions. Functionality: uses domain knowledge, gives better tests and can start early, but is harder to design.

</details>

<details><summary>Q5. ticketPrice(age), valid 0–120, child 0–12, adult 13–64, senior 65–120. Give the blocks and boundary values.</summary>

Blocks: {<0} invalid, {0–12}, {13–64}, {65–120}, {>120} invalid. Boundaries: −1, 0, 12, 13, 64, 65, 120, 121. With mid-values (−5, 6, 30, 80, 150) that is **13 test values**.

</details>

<details><summary>Q6. 10 parameters with 3 blocks each: how many all-combination tests? With 4 blocks? With 2?</summary>

3¹⁰ = 59,049 (about 16.4 h at 1 test/s); 4¹⁰ = 1,048,576 (about 12.1 days); 2¹⁰ = 1,024 (about 17 min).

</details>

<details><summary>Q7. login(username, password): one interface-based and one functionality-based characteristic. Which finds "right user + wrong password accepted"?</summary>

Interface: "username is null" T/F, "password empty" T/F. Functionality: "username exists" Y/N, "password matches" Y/N, "account status" active/locked. The **functionality-based** model finds it, because it actually tries a real user with a wrong password. Infeasible combination: (username exists = no, password matches = yes).

</details>
