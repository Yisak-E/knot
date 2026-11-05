---
title: "Ch 6 Part 1 — Input Space Partitioning & IDM"
summary: Partitions (disjoint + complete), characteristics and blocks, the five-step IDM process, interface- vs functionality-based modelling, block-choosing strategies, and the triang() and findElement() examples.
tags: [chapter-6, isp, idm, partitioning]
sort: 3
---

## Input Space Partitioning in Software Testing

**Definition:** all testing is about choosing elements from the input space of the software under test. **Input Space Partitioning (ISP)** makes that choice systematic.

**How ISP works**
- Divide the input space into regions called **blocks**, using a logical partitioning of the inputs.
- Select **at least one representative value** from each block.

**Where ISP fits**
- ISP is one of **four structures** used to model software for testing:
  - **Input spaces** (ISP).
  - **Graphs:** source code, specifications, design, use cases.
  - **Logic:** source code, specifications, finite state machines, DNF (disjunctive normal form: ANDed clauses joined by ORs, e.g. (A AND B) OR (C AND D)).
  - **Syntax:** source code, models, integration, inputs.
- ISP is independent of the **RIPR** model (Reachability, Infection, Propagation, Revealability): it uses only the input space, nothing about the implementation.

**The input domain**
- The set of all possible inputs; usually so large it is effectively infinite.
- Scope is defined by the input parameters: method parameters, data read from files, global variables, user inputs.
- The domain is divided into blocks assumed to be equally useful for testing.
- Example: domain = alphabetic letters, characteristic = case → 2 blocks (upper case, lower case).

**Why ISP is popular**
- ✅ Applies at **any level** of testing (unit, integration, system).
- ✅ Easy to apply; needs no automation and very little training.
- ✅ **Adjustable:** tune it to produce more or fewer tests.
- ✅ **Black-box:** needs knowledge of the input space only, not the implementation.

**In conclusion:** ISP turns the overwhelming input space into a manageable set of blocks, so the tester covers all the important kinds of input with relatively few test cases.

## Valid Partitions and the Equivalence Assumption

**Definition:** a partition over domain D is defined by a scheme q that produces blocks b1, b2, …, bQ.

**Two properties of a valid partition** (the most examined idea in this chapter)
1. **Pairwise disjoint:** no two blocks share an element (the intersection of any two different blocks is empty).
2. **Complete:** the blocks together cover the whole domain (the union of all blocks equals D).

**The core assumption: equivalence within a block**
- If blocks are well chosen, every value in a block makes the program behave the same way, so **one test per block** is enough.
- Example: age partitioned into Child (0–17) and Adult (18–64); testing 30 represents all adults.

**Common mistakes**
- **Not complete:** {x < 0} and {x > 0} → zero is in no block. Fix: add {x = 0}.
- **Not disjoint:** {sorted ascending}, {sorted descending}, {arbitrary order} → a list like [14] (or an empty list) is both ascending and descending.
  - Fix: design blocks for **one property at a time** using two Boolean characteristics: "is the list sorted ascending?" and "is it sorted descending?". Lists of length 0 or 1 are true for both, which is fine because each characteristic is a valid partition on its own.
- **Not disjoint (triangles):** {scalene, isosceles, equilateral, invalid} → an equilateral triangle is also isosceles. Fix: the second block becomes "isosceles but not equilateral".

**Worked example: `calculateGrade(int score)`**
- Rules: A = 90–100, B = 80–89, C = 70–79, D = 60–69, F = 0–59; invalid scores throw an exception.
- ❌ Bad partition: `0–60, 60–69, 70–79, 80–89, 90–100, −1, 101`
  - Not disjoint: 60 is in two blocks.
  - Not complete: −50 or 500 belong to no block.
- ✅ Proper partition: `x < 0` (exception), `0–59` (F), `60–69` (D), `70–79` (C), `80–89` (B), `90–100` (A), `x > 100` (exception).

**More valid partitions**
- Integers: {negative, zero, positive} and {even, odd}.
- `sqrt(x)`: one partition **per characteristic**:
  - sign of x: negative, zero, positive.
  - magnitude of x: normal, very large.
  - whole number: integer, non-integer.
- Mixing "positive", "large" and "non-integer" in one list creates overlapping blocks.

**In conclusion:** check every partition for both disjointness and completeness, and keep each characteristic focused on a single property to avoid mistakes.

## The Combinatorial Explosion

**The problem:** even after partitioning, the number of tests grows very quickly.

**Example: a checkout form**
- 15 parameters (address, city, zip code, payment method, card number, expiry date, CVV, promo code, gift wrap, …) with 3 blocks each.
- All combinations: 3¹⁵ = **14,348,907** tests.
- At one test per second, non-stop: about **166 days**.
- Even a small search page with three filters (size, colour, brand) with two options each needs 2 × 2 × 2 = **8** tests, and every extra option makes the total grow exponentially.

**The standard two-step approach**
1. Partition each parameter into blocks **separately**.
2. **Combine blocks selectively**, not exhaustively:
   - *Independently:* test parameters in isolation → fewer tests, but may miss bugs.
   - *In conjunction:* choose combinations driven by program logic → smarter.

- Input Domain Modeling formalises this and uses coverage criteria (Part 2) to avoid the explosion while keeping tests effective.

**In conclusion:** the combinatorial explosion is why testers need both careful partitioning and a principled way to choose which block combinations to test.

## The Five-Step Input Domain Modeling Process

**The steps**
1. Identify the **testable functions**. *(implementation level)*
2. Find all **inputs, parameters and characteristics**. *(implementation level)*
3. **Model** the input domain: partition each characteristic into blocks. *(design abstraction level)*
4. **Choose combinations** of values by applying a coverage criterion. *(design abstraction level)*
5. **Refine** the abstract combinations into concrete test inputs. *(back to implementation level)*

- Moving from step 2 to step 3 = moving **up** from the implementation level to the design abstraction level.

**Step 1: where testable functions come from**
- **Java class:** each public method is a testable function; characteristics are often shared across methods, so build a common set for the class.
  - Example: a Calculator class (add, subtract, multiply, divide) — numeric inputs, numeric outputs, constrained input ranges.
- **UML artifacts:** each use case maps to an intended functionality.
  - Example: ATM "withdrawal" → testable function "withdrawing cash"; characteristics such as "Is the card valid?" and "Relation of the withdrawal policy to the request".

**Step 2: find every parameter that can affect behaviour** (not very creative, but important)

*Example: `findElement(List list, Object element)`* — throws `NullPointerException` if the list or element is null, otherwise returns true if the element is in the list.
- Parameters: `list`, `element`.
- **Syntax-based** characteristics (each true/false): "list is null", "list is empty", "element is null".
- **Behaviour-based** characteristics (assuming neither is null):
  - element present or absent;
  - list size: 0, 1, or more than 1;
  - if present, position: first, last, middle, or the only element.

*Example: `findLast(int[] a, int x)`* — returns the index of the last occurrence of x, or −1.
- Whether `a` is null.
- Whether `a` is empty.
- How many times x occurs: not at all, once, more than once.
- Where the last occurrence is: first, middle, last position.

**In conclusion:** the five steps move the tester from concrete code up to an abstract model and back down to concrete tests, and the quality of the final tests depends heavily on finding every relevant parameter early.

## Input Domain Modeling (IDM) in Software Testing

**Definition:** Input Domain Modeling (IDM) represents the input space of a system in an abstract way.

**What IDM involves**
- Identify **characteristics** of the inputs.
- Divide each characteristic into partitions called **blocks**.
- Values in the same block are considered equivalent for testing.
- Some combinations of input values may be invalid, so the IDM must also identify and record **restrictions**.
- Purpose: organise the input space so appropriate test cases can be selected.

**What is a characteristic?** a feature or quality that identifies something; each partition is based on a characteristic of the program, its inputs or its environment.
- Examples: whether input X is null; order of a list F (sorted, inverse sorted, arbitrary); minimum separation distance of two aircraft; input device (DVD, CD, computer); personal attributes (hair colour, height, major, age).

**Rules for blocks**
- A block may be a single value or a set.
- Each value in a block should be equally useful for testing.
- Each abstract test uses **one block from each characteristic**.

### Two approaches to IDM

| | Interface-based | Functionality-based |
|---|---|---|
| Idea | Consider **each parameter separately** | Identify characteristics from the **intended behaviour** of the system, not its interface |
| Strengths | Easy to follow; characteristics easy to identify; tests translate easily into executable tests | Uses domain knowledge; includes more requirements information; can begin early (requirements exist before code); many researchers believe it produces better tests |
| Weaknesses | May miss **interactions between parameters** (e.g. a loop index and array size) | Harder to design |

**Example (interface-based): bank transfer** — parameters: from account, to account, amount.
- Consider valid/invalid accounts and amounts within, below, or above the allowed range.
- Hold two parameters valid while varying the third:
  - (valid, valid, in range)
  - (invalid, valid, in range)
  - (valid, invalid, in range)
  - (valid, valid, below range)
  - (valid, valid, above range)
- Tests each parameter separately; related to **base choice coverage**.

**Example (functionality-based): factorial(n)**
- n = 0 → expected result 1.
- n within the supported range → valid result.
- n negative or floating-point → error.
- n above the supported range → error or overflow (e.g. 13! exceeds a 32-bit signed integer).

**Example (functionality-based): `divide(num, den)`**
- Characteristics: denominator value, numerator value, result type, sign of result.
- Denominator: zero, positive, negative. Numerator: zero, positive, negative.
- Result type: integer without remainder, integer division with remainder, undefined (divide by zero).
- When defined, the sign is positive, negative, or zero.

### Syntax-based vs behaviour-based modeling
- **Syntax-based IDM:** structure and type of the input parameters (e.g. "relation of a side to zero"); finds inputs that violate basic data rules.
  - Example: `triang(−1, 5, 5)` should return Invalid.
- **Behaviour-based IDM:** expected output (e.g. "type of triangle"); verifies the core logic.
  - Example: `triang(5, 5, 5)` should return Equilateral.
- **Use both:** syntax covers every way an input can be invalid; behaviour covers every valid outcome.

### Choosing blocks and values
- The number of blocks affects cost and effectiveness:
  - More blocks → more tests, more resources, potentially more faults found.
  - Fewer blocks → less effort, but possibly less effective testing.

**Strategies**
1. Include both **valid and invalid** values.
2. Divide valid ranges into **sub-partitions** when parts exercise different functionality (e.g. child tickets vs standard adult tickets).
3. Consider **boundary values** (at or near boundaries; a form of stress testing).
4. Include **normal-use / happy-path** values, especially when failures depend on inputs not near boundaries.
5. Use **enumerated types** (blocks = discrete values).
6. **Balance** the number of blocks across characteristics (add blocks to characteristics with fewer when it costs little).
7. Check for **missing blocks** (blocks cover the whole input space of a characteristic).
8. Check for **overlapping blocks** (no value in more than one block).

**Special values**
- Reference variables: **null** is a special case, treated differently from non-null.
- Containers (sets, lists): whether the container is **empty** is often a useful characteristic.

**General hints**
- More characteristics or more blocks always means more tests.
- Better: **more characteristics with fewer blocks each** → fewer mistakes and fewer tests.
- Keep the IDM independent of the implementation: base it on requirements and specifications, not code.
- Choose values strategically: valid, invalid, special, boundaries, balanced blocks.

**Worked example: `ticketPrice(int age)`** — valid ages 0–120: child 0–12, adult 13–64, senior 65–120.
- Blocks: `age < 0` (invalid), `0–12`, `13–64`, `65–120`, `age > 120` (invalid).
- Mid-block values: −5, 6, 30, 80, 150 → **5** values.
- Boundary values: −1, 0, 12, 13, 64, 65, 120, 121 → **8** more.
- Total: **13** test values.

**In conclusion:** IDM provides a structured way to identify input characteristics, divide them into blocks and select representative values; with suitable characteristics and block-selection strategies, testers balance cost and effectiveness while representing the input space and its restrictions properly.

## The Triangle Example: triang()

**The function:** `triang(s1, s2, s3)` takes three integer side lengths and returns Scalene, Isosceles, Equilateral or Invalid.
- Invalid if any side is zero or negative.
- Equilateral if all three sides are equal.
- Isosceles if any two sides are equal.
- Scalene otherwise.

```java
if (s1 <= 0 || s2 <= 0 || s3 <= 0) return INVALID;
if (s1 == s2 && s2 == s3)            return EQUILATERAL;
if (s1 == s2 || s2 == s3 || s1 == s3) return ISOSCELES;
return SCALENE;
```

**Model 1: interface-based, three blocks per side**
- Three characteristics, each relating one side to zero: greater than zero, equal to zero, less than zero.
- Example tests: (7, 0, −3), (0, 3, 5), (−5, 4, 8).
- All combinations: 3 × 3 × 3 = **27** tests; many are invalid because valid triangles need positive sides.

**Model 2: interface-based, refined (four blocks per side)**
- Blocks: greater than 1, equal to 1, equal to 0, negative → candidate values 2, 1, 0, −1.
- All combinations: 4 × 4 × 4 = **64**.
- Complete only because inputs are integers; deliberately includes boundary values 0 and 1.
- Choosing candidate values early makes the tester think concretely about the predicates describing each block.
- Uses only syntactic information (three integers), so it ignores the program logic.

**Model 3: functionality-based, one characteristic**
- Blocks: scalene, isosceles-but-not-equilateral, equilateral, invalid.
- Values: (4, 5, 6), (3, 3, 4), (3, 3, 3), (3, 4, 8).
- A triangle is valid only if a + b > c, a + c > b and b + c > a → (3, 4, 8) is invalid because 3 + 4 is not greater than 8.

**Model 4: functionality-based, four Boolean characteristics**
- Characteristics (each true/false): Scalene, Isosceles, Equilateral, Valid.
- Constraints:
  - Equilateral = true → Isosceles must be true.
  - Valid = false → Scalene, Isosceles and Equilateral must all be false.

**An important weakness**
- (4, 5, 6) and (3, 4, 8) both fall into (greater than 1, greater than 1, greater than 1) in the refined interface-based model, yet one is **scalene** and the other **invalid**.
- The equivalence-within-a-block assumption fails → the interface-based model alone is not enough.

**In conclusion:** different IDMs of the same function expose different faults, and combining a syntax-based and a behaviour-based model gives far better coverage than either alone.

## Self-test

<details><summary>Q1. State the two properties of a valid partition.</summary>

**Pairwise disjoint** (no two blocks share an element) and **complete** (the union of the blocks equals the domain).

</details>

<details><summary>Q2. Why is {sorted ascending, sorted descending, arbitrary} a defective partition?</summary>

It is not disjoint: a list of length 0 or 1, such as [14], is both ascending and descending. The fix is two separate Boolean characteristics.

</details>

<details><summary>Q3. List the five IDM steps. At which step do we move to the design abstraction level?</summary>

1 identify testable functions, 2 find inputs, parameters and characteristics, 3 model the input domain, 4 choose combinations, 5 refine into test inputs. Moving from step 2 to step 3 goes from the implementation level to the design abstraction level.

</details>

<details><summary>Q4. Interface-based vs functionality-based: give one strength and one weakness of each.</summary>

Interface-based is easy and almost automatic, but misses interactions between parameters. Functionality-based uses domain knowledge, gives better tests and can start early, but is harder to design.

</details>

<details><summary>Q5. ticketPrice(age), valid 0–120: child 0–12, adult 13–64, senior 65–120. Give the blocks and boundary values.</summary>

Blocks: {<0} invalid, {0–12}, {13–64}, {65–120}, {>120} invalid. Boundaries: −1, 0, 12, 13, 64, 65, 120, 121. With mid-block values (−5, 6, 30, 80, 150), that makes **13 test values**.

</details>

<details><summary>Q6. 10 parameters with 3 blocks each: how many all-combination tests? With 4 blocks? With 2?</summary>

3¹⁰ = 59,049 (about 16.4 hours at one test per second); 4¹⁰ = 1,048,576 (about 12.1 days); 2¹⁰ = 1,024 (about 17 minutes).

</details>

<details><summary>Q7. login(username, password): give one interface-based and one functionality-based characteristic. Which finds "right user + wrong password accepted"?</summary>

Interface-based: "username is null" T/F, "password is empty" T/F. Functionality-based: "username exists" Y/N, "password matches" Y/N, "account status" active/locked. The **functionality-based** model finds it, because it actually tries a real user with a wrong password. Infeasible combination: (username exists = no, password matches = yes).

</details>
