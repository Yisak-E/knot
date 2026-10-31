---
title: "Practice Questions — Class Activities with Answers"
summary: Every Chapter 6 class activity (Part 1 and Part 2) and the Chapter 4 exercises, with answers hidden until you click.
tags: [practice, activities, answers, exam-prep]
sort: 5
---

Try each question first, then click to reveal the answer.

## Chapter 4 exercises

<details><summary>Write a user story for "Withdraw money from a checking account" with a happy path and an edge case.</summary>

**Story:** As an ATM customer, I want to withdraw cash from my checking account, so that I can access physical currency conveniently.
**Happy:** balance $500, request $100: dispenses $100, balance becomes $400.
**Edge (insufficient):** balance $50, request $100: fails with "Insufficient funds", balance stays $50.
**Edge (daily limit):** limit $500, already $450 today, request $100: fails with "Daily withdrawal limit exceeded".

</details>

<details><summary>"As a user, I want to transfer funds to another account." Give one confused, creative and malicious test.</summary>

**Confused:** double-click "Submit Transfer" and check for double processing.
**Creative:** amount −$100, or destination = own account.
**Malicious:** tamper with the destination account ID in the HTTP payload to move money from an arbitrary account.

</details>

## Chapter 6 Part 1

### Activity 1: Is this a valid partition?

<details><summary>a. Integers: {x &lt; 0}, {x &gt; 0}</summary>

**Not complete**: 0 is in no block. Add {x = 0}.

</details>

<details><summary>b. Integers: {even}, {odd}</summary>

**Valid**: disjoint and complete.

</details>

<details><summary>c. List: {sorted ascending}, {sorted descending}, {arbitrary}</summary>

**Not disjoint**: [14] is both ascending and descending. Use two Boolean characteristics: "sorted ascending?" and "sorted descending?".

</details>

<details><summary>d. Quadrilaterals: {square}, {rectangle}, {rhombus}, {other}</summary>

**Not disjoint**: a square is also a rectangle and a rhombus. Use {square}, {rectangle not square}, {rhombus not square}, {other}, or Boolean characteristics.

</details>

<details><summary>e. Package weight kg (integer): {0–5}, {5–10}, {10–20}</summary>

**Not disjoint** (5 and 10 appear twice) and **not complete** (negatives and > 20 missing). Fix: {x &lt; 0}, {0–4}, {5–9}, {10–20}, {x &gt; 20}.

</details>

<details><summary>f. calculateGrade: 0–60, 60–69, 70–79, 80–89, 90–100, −1, 101</summary>

Not disjoint (60 is in two blocks) and not complete (−50, 500 are in no block). Fix: x&lt;0 (exception) · 0–59 F · 60–69 D · 70–79 C · 80–89 B · 90–100 A · x&gt;100 (exception).

</details>

### Activity 2: Combinatorial explosion (10 parameters)

<details><summary>3 blocks each? 4 blocks? 2 blocks? Which hint does this illustrate?</summary>

3¹⁰ = **59,049** (about 16.4 h) · 4¹⁰ = **1,048,576** (about 12.1 days) · 2¹⁰ = **1,024** (about 17 min).
The hint is "more characteristics or blocks means more tests". The risk of going too far is that too few blocks lowers effectiveness and misses faults.

</details>

### Activity 3: IDM for login(username, password)

<details><summary>Show the answer</summary>

1. Function `login`; parameters username, password.
2. Interface-based: "username is null" T/F; "password is empty" T/F.
3. Functionality-based: "username exists" Y/N; "password matches stored" Y/N; "account status" active/locked.
4. The **functionality-based** model finds "correct user, wrong password accepted"; the interface model never tries a real but wrong password.
5. Infeasible: (username exists = no, password matches = yes), which is a **constraint**.

</details>

### Activity 4: ticketPrice(int age)

<details><summary>Show the answer</summary>

Blocks: {<0} invalid · {0–12} child · {13–64} adult · {65–120} senior · {>120} invalid.
Mid values: −5, 6, 30, 80, 150. Boundaries: −1, 0, 12, 13, 64, 65, 120, 121. That is **13 values total**.
Strategies: valid vs invalid, sub-partition, boundaries, normal use.

</details>

### Activity 5: Two views of triang()

<details><summary>Show the answer</summary>

1. Scalene (4,5,6) · isosceles-not-equilateral (3,3,4) · equilateral (3,3,3) · invalid by sign (−1,5,5) or (0,3,3) · invalid by inequality (3,4,8).
2. (4,5,6) and (3,4,8) are both in (>1, >1, >1), but one is scalene and one invalid. Equivalence within a block fails, so the interface model alone is insufficient.
3. Syntax-based covers every way to be invalid by type or sign; behaviour-based covers the logic and every valid outcome, including the triangle inequality. Use both.

</details>

## Chapter 6 Part 2

### Activity 1: Why criteria, and the five steps

<details><summary>5 characteristics × 4 blocks: ACoC tests? At 2 min each? Add a 6th?</summary>

4⁵ = **1,024** tests, which is 2,048 min, about **34 h**. A sixth characteristic gives 4⁶ = **4,096**: 4× more, about 137 h.

</details>

<details><summary>Map each triang() action to a step (a–e).</summary>

a) choose triang() as the unit: **Step 1** · b) list the sides and compare with 0 and 1: **Step 2** · c) define blocks and check overlap: **Step 3** · d) pick BCC and list block combos: **Step 4** · e) replace "side 1 > 1" with 5: **Step 5**.

</details>

### Activity 2: ACoC, pizza (Size 3, Crust 2, Receiving 2, Payment 3)

<details><summary>Show the answer</summary>

1. 3 × 2 × 2 × 3 = **36**.
2. (large, thick) × {pickup, delivery} × {cash, card, online} gives **6 tests**.
3. Adding Toppings(3): 36 × 3 = **108**.
4. Every block is combined with every block of every other characteristic exactly once, which is the definition of a **Cartesian product**.

</details>

### Activity 3: ECC and a bug hunt

<details><summary>Show the answer</summary>

1. max(3, 2, 2, 3) = **3**; Size and Payment tie.
2. e.g. (small, thin, pickup, cash), (medium, thick, delivery, card), (large, thin, pickup, online).
3. The online + delivery crash is **missed**: ECC doesn't require combinations.
4. Add (small, thin, delivery, online). This moves toward **pair-wise** coverage.

</details>

### Activity 4: PWC, Browser(3) · OS(2) · Network(2)

<details><summary>Show the answer</summary>

1. Browser–OS 6 + Browser–Network 6 + OS–Network 4 = **16 pairs**.
2. Minimum = 3 × 2 = **6**.
3. (Chrome, Win, WiFi), (Chrome, mac, 4G), (Firefox, Win, 4G), (Firefox, mac, WiFi), (Safari, Win, 4G), (Safari, mac, WiFi).
4. Each test covers **3 pairs**.
5. Adding Language(2): 16 + 6 + 4 + 4 = **30 pairs**; the minimum is still **6**: (Chrome, Win, WiFi, En), (Chrome, mac, 4G, Ar), (Firefox, Win, 4G, En), (Firefox, mac, WiFi, Ar), (Safari, Win, WiFi, Ar), (Safari, mac, 4G, En).

</details>

### Activity 5: BCC, shippingCost: Weight(light, medium, heavy, over-limit) · Destination(local, domestic, intl) · Speed(standard, express)

<details><summary>Show the answer</summary>

Base: (medium, domestic, standard), the typical order.
Count: 1 + 3 + 2 + 1 = **7**: base; vary weight to light, heavy, over-limit; vary destination to local, international; vary speed to express.
Compare: ACoC = 24, ECC = 4.
A base of (over-limit, international, express) is poor: every test inherits the rejection, so the pricing logic is never exercised. A good base is a **feasible happy path**.

</details>

### Activity 6: MBCC, Weight bases {medium, heavy}

<details><summary>Show the answer</summary>

M = 2 × 1 × 1 = **2**; m₁ = 2, m₂ = 1, m₃ = 1. Bases: (medium, domestic, standard), (heavy, domestic, standard).
Formula: 2 + 2(2) + 2(2) + 2(1) = **12**. Weight variants from both bases duplicate, so **10 unique**.
Duplicates appear when two base tests differ only in the characteristic being varied.
**Challenge:** add "local" as a second destination base: M = 4; formula = 4 + 8 + 4 + 4 = **20**; unique = 4 + 4 + 2 + 4 = **14**.

</details>

### Activity 7: Subsumption on the 6-test set [A,B]·[1,2,3]·[x,y]

<details><summary>Show the answer</summary>

ECC ✓ · PWC ✓ · ACoC ✗ (needs 12) · BCC ✗ (for base (A,1,x), (B,1,x) is missing; every other candidate base fails the same way).
(a) PWC ⇒ ECC: **T** · (b) BCC ⇒ PWC: **F** · (c) ACoC ⇒ MBCC: **T** · (d) TWC with T = Q is ACoC: **T**.
Diagram: ACoC → TWC → PWC → ECC; ACoC → MBCC → BCC → ECC; PWC and BCC incomparable.

</details>

### Activity 8: TWC with four binary parameters

<details><summary>Show the answer</summary>

T-tuples: T=1: **8**, T=2: **24**, T=3: **32**, T=4: **16**.
The 5-test set covers all 6 column pairs (00, 01, 10, 11 each), so it satisfies 2-wise.
It is **not** 3-wise: that needs at least 8 tests (32 triples ÷ 4 per test).
24 ÷ 6 = 4 is only a **lower bound**; the true minimum is 5, found via covering arrays and tools (PICT, ACTS).

</details>

### Activity 9: Cost comparison (pizza)

<details><summary>Show the answer</summary>

ECC **3** · BCC **7** · PWC-min **9** · ACoC **36**.
Prototype demo: ECC (+ BCC). Medication dose: the strongest affordable (ACoC if small, else PWC or higher T). Checkout for millions: PWC or BCC/MBCC on the main flows, automated.
ACoC is fine when the space is small and tests are automated, and stops being practical as characteristics multiply.

</details>

### Activity 10: Constraints, streaming service

<details><summary>Show the answer</summary>

Invalid pairs: (Free, no ads) and (Free, 4K). "Free can only be combined with ads" ≡ "Free cannot be combined with no ads".
ACoC: 18, minus 4 infeasible, gives **14**.
PWC: 21 pairs minus 2 gives **19**. Infeasible pairs can never appear in a valid test, so they can't be reworked.
BCC base (Free, ads, SD): (Std, ads, SD), (Prem, ads, SD), (Free, no ads, SD) changed to **(Std, no ads, SD)**, (Free, ads, HD), (Free, ads, 4K) changed to **(Std, ads, 4K)**. That is **6 tests**.
BCC can adjust other values because it only needs each non-base block to appear; PWC needs that exact pair.

</details>

### Exit ticket

<details><summary>Show the answers</summary>

1. ECC needs the fewest tests; its weakness is no interaction testing.
2. The BCC base must be **feasible** (valid, executable, often the happy path).
3. The MBCC formula is an upper bound because different base tests can generate duplicate variants.
4. ISP is widely used because it is easy to apply without automation, flexible, works at every level, and is based only on the input space.

</details>
