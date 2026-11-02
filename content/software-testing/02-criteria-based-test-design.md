---
title: "Ch 5 — Criteria-Based Test Design"
summary: Test requirements and coverage criteria, the jelly bean example, coverage level and infeasible requirements, minimal vs minimum test sets, generators vs recognizers, subsumption, the four structures, and the pros and cons of criteria-based design.
tags: [chapter-5, coverage-criteria, test-requirements, subsumption]
sort: 2
---

## The big idea in one line

We can never test every input, so **coverage criteria** turn an effectively infinite input space into a **finite set of test requirements (TR)**. The criteria also tell us **when to stop**.

## 1. Four test activities and where criteria fit

| Stage | Activity | What it needs |
|---|---|---|
| **1. Test design** | **(a) Criteria-based**: design tests to satisfy coverage criteria. **(b) Human-based**: design tests from domain knowledge and intuition | (a) is the **most technical and mathematical job** in testing: discrete math, programming, testing |
| 2. Test automation | Turn designs into runnable scripts | Programming |
| 3. Test execution | Run the tests and record results | Mechanical, little training |
| 4. Test evaluation | Interpret results, coverage, pass/fail | Domain knowledge, analysis |

- Each activity needs **different skills, background, education and training**.
- Criteria-based test design is **analogous to software architecture** on the development side.
- ⭐ **Using people who are not qualified to design tests is a sure way to get ineffective tests.**

**"Monkey testing" vs criteria:** monkey testing is a human wiggling the mouse and banging the keyboard. It needs no automation and minimal training, and it is redundant and full of blind spots. Criteria-based design searches the input space systematically and removes redundancy.

**Phases vs structures:** the old view treats unit, module, integration and system testing as different activities. The new view: test design is **largely the same at every phase**. Only how the model is extracted and how values are chosen change.

## 2. Model-Driven Test Design (MDTD)

```
Abstraction level:    Model / Structure  ──criterion──▶  Test Requirements (TR)
                            ▲                                    │
                            │ extract                            ▼ refine
Implementation level: Software artifact          Input values → Test cases → Scripts → Pass/Fail
```

Coverage criteria produce test requirements **purely at the level of mathematical abstraction**. That is why one criterion works for many kinds of artifacts.

### Model-based vs model-extracted testing

| | Model-Based Testing (MBT) | Model-extracted (criteria-based, this course) |
|---|---|---|
| Model origin | Created **before code**, as a specification | **Extracted** from code or design artifacts |
| Nature of model | A definition of requirements | A representation of the implementation |
| Source of truth | Model is "truth", code is derived | Code is "truth", model is derived |
| Goal | Check conformance to a specification | Achieve high implementation coverage |
| Bugs found | Gaps between design and implementation | Logic errors in the implemented code |

## 3. Core definitions ⭐⭐

| Term | Definition | Example |
|---|---|---|
| **Test requirement (tr)** | A specific element of a software artifact that a test case must **satisfy or cover**. They come in sets, written **TR** | "Statement 12 must be executed" |
| **Coverage criterion (C)** | A **rule or collection of rules** that impose test requirements on a test set | "Every statement must be executed at least once" |
| **Coverage** | T satisfies C **iff** for **every** tr in TR there is **at least one** t in T that satisfies tr | |
| **Infeasible test requirement** | A tr that **cannot be satisfied**: no test values exist that meet it | Dead code; `if (x > 10 && x < 5)` |
| **Coverage level** | (# TRs satisfied by T) ÷ \|TR\| × 100% | 5 of 6 gives 83% |

Why we need criteria: `computeAverage(int A, int B, int C)` has 2³² × 2³² × 2³² = **2⁹⁶** possible inputs. Criteria **divide the input space to maximise faults found per test** and give a **stopping rule**.

More examples of criteria and their TRs:
- **Branch coverage**: each decision gives **2 TRs** (true and false).
- **Call coverage**: each method gives **1 TR** (it is called at least once).

## 4. The jelly bean example ⭐

A bag of jelly beans has **6 flavours** and **4 colours**:

| Flavour | Lemon | Pistachio | Cantaloupe | Pear | Tangerine | Apricot |
|---|---|---|---|---|---|---|
| Colour | Yellow | Green | Orange | White | Orange | Yellow |

- **Flavour criterion**: taste one of each flavour. **TR = {flavour = Lemon, flavour = Pistachio, flavour = Cantaloupe, flavour = Pear, flavour = Tangerine, flavour = Apricot}**, so 6 TRs.
- **Colour criterion**: taste one of each colour. TR = {Yellow, Green, Orange, White}, so 4 TRs.
- Satisfying a TR with more than one test is allowed, but it is **redundancy**. Each test costs something.
- **Controllability problem:** if you pick a yellow bean, is it Lemon or Apricot? Forcing the system into the exact state a TR needs is a core testing challenge.

<details><summary>T1 = {3 Lemon, 1 Pistachio, 2 Cantaloupe, 1 Pear, 1 Tangerine, 4 Apricot}. Does T1 satisfy the flavour criterion?</summary>

**Yes.** All 6 flavours appear at least once. It has redundancy (3 Lemons, 2 Cantaloupes, 4 Apricots), so it is **not minimal**.

</details>

<details><summary>T2 = {1 Lemon, 2 Pistachio, 1 Pear, 3 Tangerine}. Does T2 satisfy the flavour criterion? The colour criterion?</summary>

**Flavour: No.** Cantaloupe and Apricot are missing.
**Colour: Yes.** Lemon gives Yellow, Pistachio gives Green, Pear gives White and Tangerine gives Orange, so all 4 colours are covered.

</details>

## 5. Coverage level and infeasible requirements ⭐⭐

**Coverage level = (number of TRs satisfied ÷ total number of TRs) × 100%**

It matters for two reasons:
1. **Satisfying a criterion is expensive**, so teams often settle for a target level (e.g. 80%).
2. **Some requirements cannot be satisfied.** If no Tangerine beans exist in the bag, the best flavour coverage possible is **5/6 ≈ 83%**. It often makes sense to **drop** unsatisfiable TRs or **replace them with less demanding ones**.

**Example: online shop.** TR₁ login, TR₂ search, TR₃ add to cart, TR₄ payment, TR₅ order confirmation, TR₆ refund. The tests satisfy 5 of 6, because the refund provider is down. Coverage = 5/6 × 100 = **83.33%**. If TR₆ is truly impossible to test, remove it, and coverage = 5/5 = **100%**.

### Three kinds of infeasibility

| Kind | Example | Why |
|---|---|---|
| **Contradictory condition** | `if (x > 10 && x < 5) print("Hello");` | No x is both > 10 and < 5 |
| **Dead code** | `x = 10; return x; print("Hello");` | Code after `return` can never run |
| **Undecidable** | `if (isPrime(x) && isPrime(x+1) && isPrime(x²+1) && isPrime(x³+1))` | No algorithm can always decide whether some input reaches it |

> **Exam tip:** detecting infeasible test requirements is **formally undecidable** for most criteria, so **100% coverage is impossible in practice**.

## 6. Minimal vs minimum test sets ⭐

| Term | Definition |
|---|---|
| **Minimal** | Removing **any single test** from T makes T stop satisfying all TRs (no redundancy) |
| **Minimum** | **No smaller set** of tests satisfies all TRs (smallest possible size). This is hard to find |

Every minimum set is minimal, but a minimal set need not be minimum.

**Set-covering example:** features F = {f₁, f₂, f₃}; tests e₁ covers {f₁}, e₂ covers {f₂}, e₃ covers {f₃}, e₄ covers {f₁, f₂, f₃}.
- S₁ = {e₁, e₂, e₃} covers everything, and removing any test loses a feature, so it is **minimal** (size 3), but **not minimum**.
- S₂ = {e₄} covers everything with 1 test, and nothing is smaller, so it is **minimum** (and also minimal).

## 7. Two ways to use test criteria ⭐

| | **1. Generator** (direct generation) | **2. Recognizer** (external measurement) |
|---|---|---|
| How | Directly create test values that satisfy the criterion | Create tests some other way (by hand, pseudo-random), then **measure** their coverage |
| Who favours it | The **research** community | **Industry** (tools measure line/branch coverage) |
| Problem | **Very hard without automated tools** | Sometimes **misleading**: what does 80% coverage actually mean? |

Both are **provably undecidable** for most criteria, but recognising satisfaction is far easier than generating it. Test criteria are sometimes called **metrics**.

**Example:** `if (age >= 18) Adult else Minor` gives TR₁ (true branch) and TR₂ (false branch).
- **Generate:** choose age = 20 and age = 15, so coverage is 2/2 = **100%**.
- **Measure:** random ages 20, 25, 30 are all true, so coverage is 1/2 = **50%**.
- Generation is hard for complex code: which x, y, z reach `if (x*y + z > 100 && x² − y > 50 && z != 0)`?

## 8. Subsumption ⭐⭐

> **Criterion C1 subsumes C2 if and only if every test set that satisfies C1 also satisfies C2.**

- Jelly beans: the **flavour criterion subsumes the colour criterion**. Tasting all 6 flavours guarantees all 4 colours, but 4 well-chosen flavours already cover all colours, so colour does not subsume flavour.
- Code: **branch coverage subsumes statement coverage**. Covering every branch executes every statement.
- Ch 6 example: ACoC subsumes PWC, which subsumes ECC.

A TR only makes sense for a real artifact: "execute statement 42" requires a statement 42, and "colour = purple" means nothing if no purple beans exist. Engineers start with an **artifact**, then choose a **criterion**, and the two together give the concrete TR.

## 9. The four structures for test criteria ⭐⭐

Dozens of criteria exist, but they all apply to just **four structures**:

| Structure | Applied to | Key criteria | Example |
|---|---|---|---|
| **Input space** (input domain) | Source, specs, use cases | ECC, PWC, BCC, ACoC | `transfer(amount, account)`: amount ≤ 0 / 0 < amount ≤ 10,000 / > 10,000; account same bank / external / invalid IBAN. `transfer(−50, "External")` should be rejected immediately |
| **Graphs** | Source (CFG), specs, design (FSM), use cases | Node (NC), Edge (EC), Prime Path (PPC) | Login FSM: Logged Out → Authenticating → Active Session or Account Locked (3 invalid passwords). EC test: Authenticating → Locked |
| **Logic expressions** | Source decisions, specs, FSM guards, DNF | Clause (CC), Combinatorial (CoC), Active Clause (CACC/MACC) | P = (Score > 700 ∧ Income > 50k) ∨ HasGuarantor. CACC pair: (650, 40k, **T**) passes and (650, 40k, **F**) fails |
| **Syntax** (grammars) | Source, models, integration, input (BNF/XML/JSON) | Terminal symbol, production, **mutation score** | Mutant `balance >= amount` becomes `balance > amount`. A test with balance == amount **kills** it |

Graphs come from UML use cases, FSMs and source code. Logic comes from decisions in source, transition guards and conditionals in use cases.

> **Note:** these are criteria on structures **extracted** from software, not "model-based testing", which derives tests from a separate specification model.

## 10. Advantages and disadvantages of criteria-based design ⭐

| Advantages | Disadvantages |
|---|---|
| Maximum **"bang for the buck"**: fewer tests than human-based design, minimal overlap in fault-revealing ability | Time-consuming and potentially costly |
| **Traceability** from artifacts to tests: the "why" of each test is answered | May produce many test cases |
| Built-in support for **regression testing** | Requires testing expertise |
| A **stopping rule**: you know in advance how many tests are needed | **Coverage ≠ defect detection** |
| Natural to **automate** | May miss unexpected faults; needs maintenance as the system changes; can create low-value tests |

What we want from a criterion:
- It should be **easy to compute** the test requirements automatically.
- It should be **efficient to generate** test values.
- The tests should **reveal as many faults as possible**.

Researchers still need more data on how to compare criteria.

**The optimisation pipeline:** (1) **map** the software as structures, (2) **filter** the infinite input space with criteria into TRs, (3) **eliminate overlap** with subsumption, (4) **strip redundancy** with minimal test sets, bounded by infeasibility.

## 11. Criteria-based testing in practice

- Many companies still use **monkey testing**; some automate human-designed tests.
- Companies that use **both automation and criteria-based testing** **save money, find more faults, and build better software**.
- **Roadblocks:** lack of education (few testing courses), the need to change process, tools that are hard to use, and weak tools that rarely generate test values automatically.
- **Changes in practice:** reorganise teams by ability (**one "math-head" can support many testers**), retrain teams using **MDTD**, and embed researchers in teams.
- **Needed from researchers and educators:** isolate and hide the theory inside usable tools, embed the ideas in tools, show the ROI of automated test data generation by experiment, and restructure curricula to teach test design, automation and TDD.

## 12. Quick summary of Chapters 1–5

- **Why test:** to reduce the risk of using software. Faults, failures, the **RIPR** model.
- **Process maturity:** level 4 is a mental discipline that improves software quality.
- **MDTD**, and the **four test activities**: design, automation, execution, evaluation.
- **Test automation:** testability, observability, controllability, frameworks. **TDD**.
- **Criteria-based design:** four structures, test requirements and criteria.
- Earlier and better testing empowers test managers.

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

Advantages: fewer, less redundant tests; traceability; regression support; a stopping rule; easy to automate. Disadvantages: costly and needs expertise; many tests; coverage ≠ defect detection; may miss unexpected faults; maintenance.

</details>
