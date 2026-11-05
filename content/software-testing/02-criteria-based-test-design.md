---
title: "Ch 5 — Criteria-Based Test Design"
summary: Test requirements and coverage criteria, the jelly bean example, coverage level and infeasible requirements, minimal vs minimum test sets, generators vs recognizers, subsumption, the four structures, and the pros and cons of criteria-based design.
tags: [chapter-5, coverage-criteria, test-requirements, subsumption]
sort: 2
---

## Test Design and the Four Testing Activities

**Definition:** testing involves four distinct activities, each needing different skills, background knowledge, education and training.

**The four activities**
1. **Test design:** creating tests; either criteria-based or human-based.
   - *Criteria-based:* tests satisfy coverage criteria such as statement, branch or path coverage, to systematically cover code structures or requirements.
2. **Test automation:** the engineering task of turning test designs into runnable code.
3. **Test execution:** the mechanical process of running the tests against the software.
4. **Test evaluation:** the analytical process of interpreting results, coverage measurements and pass or fail outcomes.

**Why criteria-based design is demanding**
- It is the **most technical and mathematical** job in testing.
- Requires discrete mathematics, programming and testing knowledge (much of a traditional computer science degree).
- Analogous to **software architecture** on the development side.
- Using unqualified people to design tests is a sure way to get ineffective tests.

**Criteria-based design vs "monkey testing"**
- *Monkey testing:* a person wiggles the mouse and bangs the keyboard. Needs no automation and minimal training, but is highly redundant and leaves serious blind spots.
- *Criteria-based design:* searches the input space thoroughly (covers as many different types of input as possible) and avoids overlap (every test case is unique).

**Old view vs new view of testing levels**
- *Old (phase-based):* unit, module, integration and system testing are fundamentally different and need different methods.
- *New (structure-based):* focus on the underlying mathematical structures. The foundational test design is the same at every phase; only the way the model is extracted and the way values are chosen change.

**In conclusion:** test design is a distinct, highly skilled activity, and criteria-based design gives it a systematic, engineering foundation that applies at every testing level.

## Model-Driven Test Design

**Definition:** Model-Driven Test Design (MDTD) explains how criteria fit into the testing process.

**The flow**
1. Start with a software artifact at the **implementation level**.
2. Extract a mathematical model or structure → moves up to the **abstraction level**.
3. Apply a **coverage criterion** to the structure to generate **test requirements**.
4. Refine requirements into **test specifications**.
5. Come back down to the implementation level as input values, test cases, scripts and finally pass/fail results.

- **Key point:** coverage criteria produce test requirements purely at the abstraction level, so the same criterion can be used for many kinds of artifact.

**MDTD (model-extracted) vs model-based testing (MBT)**

| | Model-based testing (MBT) | Model-extracted (this course) |
|---|---|---|
| Where the model comes from | Created **before** the code, as a specification | Extracted **from** the code or design artifacts |
| What it represents | The requirements | The implementation |
| What is "the truth" | The model (code derived from it) | The code |
| Goal | Check that code conforms to the specification | Achieve high implementation coverage |
| Finds | Gaps between design and implementation | Logic errors within the implemented code |

**In conclusion:** MDTD separates the creative work of designing tests at an abstract level from the mechanical work of turning them into concrete, runnable tests.

## Coverage Criteria and Test Requirements

**Why "complete testing" is misleading**
- Phrases like "exhaustive testing" or "full coverage" mislead: the input space is effectively infinite.
- Example: `computeAverage(int A, int B, int C)` has 2³² × 2³² × 2³² = **2⁹⁶** possible inputs.
- Coverage criteria tell us **which** inputs to use: they divide the input space to maximise faults found per test case and give rules for when to stop.

**A tester's job:** define a model of the software, then find ways to cover it.

**Key definitions**
- **Test requirement (tr):** a specific element of a software artifact that a test case must satisfy or cover, e.g. "statement 12 must be executed". Sets of requirements are written **TR**.
- **Coverage criterion (C):** a rule or collection of rules that imposes test requirements on a test set, e.g. "every statement must be executed at least once".
  - It is a technique for generating test requirements systematically, completely and unambiguously.
- **Examples of criteria**
  - *Branch coverage:* two requirements per decision (true outcome, false outcome).
  - *Call coverage:* one requirement per method (it must be called at least once).

**When does a test set satisfy a criterion?**
- Test set **T satisfies C** if and only if, for every test requirement tr in TR, there is **at least one** test t in T that satisfies tr.
- Satisfying a requirement with more than one test is allowed but creates **redundancy** (and every test has a cost).

**In conclusion:** coverage criteria turn an effectively infinite input space into a finite, well-defined set of test requirements, and coverage measures how well a test set meets them.

## The Jelly Bean Example

**The setup:** a bag of jelly beans with six flavours and four colours.

| Flavour | Colour |
|---|---|
| Lemon | yellow |
| Pistachio | green |
| Cantaloupe | orange |
| Pear | white |
| Tangerine | orange |
| Apricot | yellow |

**Two criteria**
- **Flavour criterion:** taste one bean of each flavour → 6 test requirements (Lemon, Pistachio, Cantaloupe, Pear, Tangerine, Apricot).
- **Colour criterion:** taste one bean of each colour → 4 test requirements (yellow, green, orange, white).

**Controllability problem:** if you pick a yellow bean it could be Lemon or Apricot. Forcing the system into the exact state a requirement needs is a core challenge of testing.

**Test sets**
- **T1** = {3 Lemon, 1 Pistachio, 2 Cantaloupe, 1 Pear, 1 Tangerine, 4 Apricot}
  - ✅ Satisfies the flavour criterion (all six appear).
  - ⚠️ Contains redundancy (several flavours tasted more than once).
- **T2** = {1 Lemon, 2 Pistachio, 1 Pear, 3 Tangerine}
  - ❌ Does **not** satisfy the flavour criterion (Cantaloupe and Apricot missing).
  - ✅ Does satisfy the colour criterion (yellow, green, white, orange).

**In conclusion:** a criterion generates a precise set of test requirements, and the same test set can satisfy one criterion while failing another.

## Coverage Level and Infeasible Requirements

**Definition:** coverage level = (test requirements satisfied ÷ total test requirements) × 100%.

**Why it matters**
- Satisfying a criterion completely is expensive, so teams often aim for a target coverage level.
- Some requirements **cannot be satisfied at all**.
- Jelly bean example: if a bag contains no Tangerine beans, maximum flavour coverage is 5/6 ≈ **83%**. It often makes sense to drop unsatisfiable requirements from TR or replace them with less demanding ones.

**Software example (online shop, 6 requirements)**
- Requirements: user login, product search, add to cart, payment, order confirmation, refund.
- Tests satisfy 5 (the refund system is unavailable) → 5/6 × 100 = **83.33%**.
- If refund is genuinely impossible to test, remove it from TR → 5/5 = **100%**.

**Infeasible test requirements:** no test case values exist that meet them. Three typical cases:
1. **Contradictory condition**
   - `if (x > 10 && x < 5) print("Hello");` has no value of x that is greater than 10 and less than 5.
2. **Dead code** (can never execute)
   - Follows a `return` or `throw`, or sits behind an always-true/always-false condition.
   - `x = 10; return x; print("Hello");` → the print can never be reached.
3. **Infeasibility cannot always be detected**
   - Example: `isPrime(x) && isPrime(x + 1) && isPrime(x² + 1) && isPrime(x³ + 1)`.
   - Deciding whether any input makes it true can be as hard as deciding whether the program ever reaches a statement.

- Detecting infeasible requirements is **formally undecidable** for most criteria (no algorithm always gives the right answer).
- So **100% coverage is impossible in practice**.

**In conclusion:** coverage level gives a realistic measure of progress, and infeasible requirements explain why testers rarely reach, or even aim for, 100% coverage.

## Minimal and Minimum Test Sets

**Why:** every test has a cost, so testers want test sets without unnecessary redundancy.

**Definitions**
- **Minimal:** removing any single test causes T to no longer satisfy all test requirements (no redundant tests).
- **Minimum:** no smaller set of tests also satisfies all test requirements.
- Every minimum set is minimal, but a minimal set is **not necessarily** minimum. Finding a minimum set is hard.

**Set-covering example**
- Features F = {f1, f2, f3}; candidate tests: e1 covers f1, e2 covers f2, e3 covers f3, e4 covers all three.
- **S1 = {e1, e2, e3}:** covers everything, and removing any test leaves a feature uncovered → **minimal** (3 elements), but not minimum.
- **S2 = {e4}:** covers everything with one test, and no smaller valid set exists → **minimum** (and minimal).

**In conclusion:** a minimal test set has no redundant tests, while a minimum test set is the smallest possible, which is harder to find.

## Two Ways to Use Test Criteria

| | Generator approach | Recognizer approach |
|---|---|---|
| Idea | Directly generate test values that satisfy the criterion | Generate values externally (by hand or pseudo-randomly), then **measure** coverage against the criterion |
| Favoured by | Research community | Industry |
| Strength | Direct, efficient when code is simple | Practical |
| Weakness | Very hard without automated tools | Can mislead: if coverage is below 100%, it is not always clear what that means |

- Because of the recognizer approach, test criteria are sometimes called **metrics**.
- Both are provably undecidable for most criteria, but recognising whether tests satisfy a criterion is far more achievable than generating tests that do.

**Example: print "Adult" if `age >= 18`, else "Minor"** (branch coverage → 2 requirements)
- *Generator:* tester chooses age = 20 (true) and age = 15 (false) → 2/2 = **100%**.
- *Recognizer:* random ages 20, 25, 30 all take the true branch → 1/2 = **50%**.
- Generator is efficient here, but hard for complex code: reaching a branch guarded by x × y + z > 100 and x² − y > 50 and z ≠ 0 by hand is extremely difficult.

**In conclusion:** generating tests from a criterion is more direct but harder, while measuring existing tests against a criterion is more practical but can be misleading.

## Comparing Criteria with Subsumption

**Definition:** criterion **C1 subsumes C2** if and only if every test set that satisfies C1 also satisfies C2.

**Examples**
- **Jelly beans:** the flavour criterion subsumes the colour criterion (Lemon/Apricot → yellow, Pistachio → green, Cantaloupe/Tangerine → orange, Pear → white). Not the other way round.
- **Software:** **branch coverage subsumes statement coverage** (covering every branch guarantees every statement executes).
- **From Chapter 6:** all combinations coverage subsumes pair-wise coverage.

**Test requirements only make sense for a specific artifact**
- Jelly beans: "colour = purple" is meaningless (no purple beans).
- Software: "execute statement 42" only makes sense if the program has a statement 42.
- Good practice: start with a software artifact, then choose a coverage criterion; combining the two gives the relevant set of requirements.

**In conclusion:** subsumption shows which criteria are stronger, so testers avoid redundant effort by satisfying the stronger criterion.

## The Four Structures for Criteria-Based Testing

**Overview**
- Dozens of criteria exist, but they apply to just **four types of structure**: input domains, graphs, logic expressions, syntax descriptions (grammars).
- This is *model-extracted* testing, not "model-based testing" (which derives tests from a separate model of the system).

**1. Input space**
- Divide the input domain into **disjoint, complete blocks**, using function signatures and data types, specifications and system limits, and use cases.
- Example: `transfer(amount, account)`
  - Amount: invalid (≤ 0), valid (0 < amount ≤ 10,000), over the limit (> 10,000).
  - Account: same bank, external bank, invalid IBAN.
  - `transfer(−50, "External")` should be rejected immediately.
- Key criteria: base choice coverage, all combinations coverage.

**2. Graphs**
- Extracted from UML use cases, finite state machines and source code.
  - Control flow graph: nodes = code blocks, edges = control decisions.
  - Finite state machine: nodes = states, edges = transitions.
  - Use case graph: nodes = user actions, edges = workflow paths.
- Example (authentication FSM): states Logged Out, Authenticating, Active Session, Account Locked; valid password → Active Session; three invalid passwords → Account Locked. An **edge coverage** test verifies the Authenticating → Account Locked transition.
- Key criteria: node coverage, edge coverage, prime path coverage.

**3. Logic expressions**
- Extracted from decisions in code, guards on transitions, conditionals in use cases, business rules or decision tables (may be in disjunctive normal form).
- Example: loan rule P = (CreditScore > 700 AND Income > $50k) OR HasGuarantor.
  - Correlated active clause coverage tests HasGuarantor while the first part is false.
  - (score 650, income $40k, guarantor true) → passes; (same, guarantor false) → fails. So HasGuarantor alone determines the outcome.
- Key criteria: clause coverage, combinatorial coverage, active clause coverage.

**4. Syntax (grammars)**
- Described by BNF, XML or JSON schemas.
- Generates valid and invalid input strings to test parsers and message formats; also uses **mutation analysis** (seed faults to evaluate the test suite).
- Example: original `if (balance >= amount)`, mutant `if (balance > amount)`. A test with balance equal to amount must fail on the mutant to **kill** it.
- Grammar-based fuzzing might pass the string "100" where integer 100 is expected.
- Key criteria: terminal symbol coverage, production coverage, mutation score.

**In conclusion:** input spaces, graphs, logic and syntax are the four structures behind every coverage criterion, so a small set of ideas applies to all kinds of software artifact.

## Advantages and Disadvantages of Criteria-Based Test Design

**Background**
- Traditionally testers entered test cases manually, ran them and checked responses: time-consuming and costly.
- Formal criteria make testing systematic by deciding which inputs are necessary.

**Advantages**
- ✅ More likely to find problems; greater assurance of quality and reliability.
- ✅ Defines a **goal or stopping rule**, with advance knowledge of how many tests are needed.
- ✅ Maximises "bang for the buck": fewer tests than human-based approaches, with minimal overlap in fault-revealing ability.
- ✅ **Traceability** from software artifacts to tests (the reason for every test is answered).
- ✅ Built-in support for **regression testing**.
- ✅ Natural to automate.

**Disadvantages**
- ❌ Can be time-consuming and costly.
- ❌ May produce a large number of test cases.
- ❌ Requires testing expertise.
- ❌ Coverage ≠ defect detection; may miss unexpected faults.
- ❌ Tests need maintenance when the system changes; some tests may be unnecessary or low value.

**What makes a good criterion**
- Test requirements are easy to compute automatically.
- Test values are efficient to generate.
- Resulting tests reveal as many faults as possible.
- Researchers still need to provide more data on how to compare criteria.

**The big picture (an optimisation pipeline)**
- Software is mapped as **structures**.
- **Criteria** filter the infinite input space down to finite test requirements.
- **Subsumption** removes overlap between criteria.
- **Minimal test sets** strip out redundancy.
- All limited only by **infeasibility**.

**In conclusion:** criteria-based design trades some cost and required expertise for tests that are more effective, traceable and easier to automate.

## Criteria-Based Testing in Practice

**Current state**
- Many companies still use monkey testing (no automation, minimal training); some automate human-designed tests.
- Companies using **both automation and criteria-based testing** save money, find more faults and build better software.

**Four roadblocks to adoption**
1. Lack of education (few CS programs require testing courses).
2. Need to change the development process (fundamental and expensive).
3. Tools are hard to use (require understanding the underlying mathematics).
4. Tools are weak and rarely solve the central problem of generating test values automatically.

**Recommended changes in practice**
- Test and QA teams: better tools, more education, more technical expertise, more specialisation (as happened in development in the 1990s).
- Reorganise teams to use individual abilities (one "math-head" can support many testers).
- Retrain teams to use a process such as MDTD and learn more testing concepts.
- Embed researchers in teams where needed; involve industry in curriculum design through advisory boards.

**Recommended changes for researchers and educators**
- Hide the deep theory inside usable tools.
- Embed mathematical ideas in practitioner-focused tools.
- Show the economic return of automated test data generation through experiments.
- Teach test design, automation and TDD as core subjects.

**In conclusion:** criteria-based testing works best when organisations combine it with automation, skilled test designers and good tools.

## Summary of Chapters 1 to 5

- We test to **reduce the risk** of using software; key concepts are faults, failures and the **RIPR** model.
- In the test process maturity levels, **level 4** is a mental discipline that improves the quality of the software.
- **Model-driven test design** separates testing into four activities: design, automation, execution, evaluation.
- Test automation depends on **testability, observability, controllability** and test automation frameworks; **test-driven development** puts tests first.
- Criteria-based test design rests on **four structures**, from which test requirements and criteria are defined.

**In conclusion:** earlier and better testing empowers test managers, and criteria-based test design is the engineering foundation that makes better testing possible.

## Self-test

<details><summary>Q1. Define test requirement and coverage criterion, with an example of each.</summary>

A **test requirement** is a specific element of an artifact a test must cover (e.g. "execute statement 12"). A **coverage criterion** is a rule or set of rules that imposes test requirements on a test set (e.g. "execute every statement at least once").

</details>

<details><summary>Q2. When does a test set T satisfy criterion C?</summary>

When for **every** test requirement tr in TR there is **at least one** test t in T that satisfies tr.

</details>

<details><summary>Q3. Why is 100% coverage impossible in practice?</summary>

Some test requirements are **infeasible** (dead code, contradictory conditions), and detecting infeasible requirements is **formally undecidable** for most criteria.

</details>

<details><summary>Q4. A test set satisfies 5 of 6 test requirements. What is the coverage level, and what can you do about the sixth?</summary>

5/6 × 100 ≈ **83.3%**. If the sixth is infeasible, drop it (coverage becomes 5/5 = 100%) or replace it with a less demanding requirement.

</details>

<details><summary>Q5. Minimal vs minimum test set?</summary>

**Minimal**: removing any one test breaks coverage (no redundancy). **Minimum**: no smaller set satisfies all TRs. Every minimum set is minimal, but not every minimal set is minimum.

</details>

<details><summary>Q6. Generator vs recognizer: who uses each, and what is the weakness of each?</summary>

**Generator** (directly create values to satisfy the criterion): favoured by researchers, and very hard without tools. **Recognizer** (measure externally created tests): favoured by industry, and can be misleading (what does 80% mean?).

</details>

<details><summary>Q7. Define subsumption and give two examples.</summary>

C1 subsumes C2 iff every test set satisfying C1 also satisfies C2. Examples: the flavour criterion subsumes the colour criterion; branch coverage subsumes statement coverage (also ACoC subsumes PWC).

</details>

<details><summary>Q8. What are the four structures for test criteria?</summary>

**Input space**, **graphs**, **logic expressions**, and **syntax (grammars)**.

</details>

<details><summary>Q9. Give three advantages and two disadvantages of criteria-based test design.</summary>

Advantages: fewer, less redundant tests; traceability; regression support; a stopping rule; easy to automate. Disadvantages: costly and needs expertise; many tests; coverage ≠ defect detection; may miss unexpected faults; needs maintenance.

</details>
