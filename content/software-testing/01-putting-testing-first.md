---
title: "Ch 4 — Putting Testing First"
summary: Cost of change, agile vs traditional methods, universal vs existential correctness, the test harness, TDD, continuous integration, user stories, legacy code, and why happy-path tests fall short.
tags: [chapter-4, agile, tdd, ci, user-stories]
sort: 1
---

## The Changing Role of Testing

**Definition:** testing has moved from an afterthought at the end of development to a central activity that drives the whole process in agile methods.

- **Old view:** testing was done last, after the code was written.
- **Agile view:** testing is embedded in development from the start.
- **Main lesson:** if high-quality testing is not embedded deeply in the process, the project is at high risk of failure.

**The traditional (plan-driven) philosophy**
- Focuses on extensive upfront analysis and modeling before any code is written.
- Goal: reveal problems as early as possible.
- Why early matters: the later a problem is found, the more work is needed to fix it and the harder its root cause is to track down.

**Cost of change** (fixing a problem found during analysis = 1 unit)

| Phase | Original estimate | Actual revised cost |
|---|---|---|
| Analysis | 1.0 | 1.0 |
| Design | 1.3 | 2.2 |
| Coding | 1.8 | 4.0 |
| Testing | 2.4 | 6.6 |
| After release | 3.0 | 10.0 |

**Example: a "Discount Code" field added at checkout**
- Found early (requirements or unit testing): a developer updates the function and its local unit tests in about 15 minutes.
- Found late (production): checkout may fail during a peak sale, support tickets surge, and a hotfix needs an emergency rollback, re-testing of database schemas and redeployment of services.
- Result: days of work plus financial and reputational damage.

**Two assumptions behind traditional methods**
1. Modeling and analysis can catch problems early.
2. The upfront investment pays off over the life of the project.
- Both hold **only if requirements stay complete and current**.
- In practice, customers keep changing their minds and requirements evolve as users learn what they need.
- People approximate well but are poor at getting things exactly right.

**In conclusion:** testing moved to the centre of development because finding problems late is extremely expensive and the upfront planning of traditional methods rarely survives changing requirements.

## Why Agile Methods Embrace Change

**Definition:** agile methods start by recognising that neither traditional assumption holds for many software projects, so they accept change instead of fighting it.

**Why requirements keep changing**
- Users often do not know what they want until they see it.
- Engineers can misread what is needed.
- It is impossible to anticipate every future change, so preventing all change is unrealistic.

**How agile responds**
- Deliver value **iteratively** and build only what real user feedback shows is needed (much work done "in anticipation" turns out to be unnecessary).
- Start small and let the software **evolve** over time.
- Treat documentation (requirements and other non-executable artifacts) as short-lived, because it is rarely updated and becomes outdated quickly.

**Effect on design**
- Traditional advice: "anticipate change".
- Problem: designers often anticipate changes that never happen (wasted effort), while unanticipated changes arrive anyway.
- Evolutionary design accepts both kinds of change as the normal cost of doing business, not a failure of planning.

**In conclusion:** agile treats change as normal and grows software in small steps, which makes continuous, automated testing essential.

## The Test Harness as Guardian

**Definition:** a test harness (testing framework) runs all the automated tests efficiently and reports results to the developers.

**Two views of correctness**
- **Universal correctness (traditional):**
  - Correct behaviour is defined completely by a formal specification for **every** possible input, e.g. x ≥ y must hold for all x and y.
  - It must be established before the software runs.
  - Problem: people are very bad at defining correctness completely, and software engineers are not mathematicians.
- **Existential correctness (agile):**
  - Software is correct if it **passes a specific set of tests**.
  - Example for x ≥ y: tests (1, 1), (1, 0), (10, 5) pass; (0, 1) and (10, 12) fail.
  - Knowing the expected result of one test is far simpler than knowing correctness for the whole system.
  - Agile trades completeness for something it can actually achieve.

**How the harness works (continuous cycle)**
- Developer changes the code → tests run → a **test oracle** checks each result → harness reports pass or fail.

**Conditions that follow**
- Tests must be **automated** (a prerequisite for TDD, but TDD and automation are not the same thing).
- Every test needs a **test oracle** that can judge whether it ran correctly.
- Tests effectively replace the requirements document, so they must be **high quality**.
- Tests must **run quickly**, because the full set runs every time the software changes.

**In conclusion:** the automated test harness is the guardian of correctness in agile development, where "correct" means "passes this set of tests".

## Test-Driven Development: Red, Green, Refactor

**Definition:** Test-Driven Development (TDD) is a practice where the developer writes a test first, then writes just enough code to make it pass, then refactors.

**The three steps**
1. 🔴 **Red:** write a test for behaviour that does not exist yet, so it fails.
2. 🟢 **Green:** write the minimal code needed to make the test pass.
3. 🔵 **Refactor:** clean up the code's structure without changing its behaviour; all tests must stay green.

**Example: `calculateDiscount(double price, boolean isVIP)`** (sample solution: VIPs get 20% off)
- **Red:** write two tests, both failing because the method does not exist yet.
  - `calculateDiscount(100.0, true)` should return 80.0.
  - `calculateDiscount(100.0, false)` should return 100.0.
- **Green:** simplest passing code returns price × 0.8 when `isVIP` is true, otherwise the price unchanged.
- **Refactor:** replace the magic number with a named constant `VIP_RATE = 0.20`, returning price × (1 − VIP_RATE) for VIPs. Tests still pass, so behaviour is unchanged.

```java
@Test void vipGets20PercentOff() { assertEquals(80.0, calculateDiscount(100.0, true), 0.001); }
@Test void nonVipPaysFullPrice() { assertEquals(100.0, calculateDiscount(100.0, false), 0.001); }

static final double VIP_RATE = 0.20;
double calculateDiscount(double price, boolean isVIP) {
    return isVIP ? price * (1 - VIP_RATE) : price;
}
```

**In conclusion:** TDD lets tests drive the design in small, safe steps, and refactoring keeps the code clean without breaking existing behaviour.

## Continuous Integration

**Definition:** Continuous Integration (CI) is a service that continuously rebuilds and retests the system as it changes.

**The workflow**
1. A developer pulls a clean copy of the system.
2. Builds it and runs the existing tests.
3. Makes a change and verifies it.
4. Pushes the change to the repository.
5. The **CI server** rebuilds the system and reruns the tests.

**Benefits**
- Mistakes made by one developer are caught quickly.
- The whole team becomes aware of divergent design decisions immediately.
- CI does not just run tests: it **decides whether the modified system is still correct**.

**Requirement**
- The rebuild and verification must be fast, so the tests must run quickly.

**In conclusion:** CI turns the test suite into a shared safety net that checks every change the moment it is made.

## User Stories and Acceptance Tests

**Why system tests are hard in agile**
- Little or no functionality exists when system tests are written (often at the start of a sprint).
- Requirements are not documented the traditional way.
- Traditionally, system tests come from requirements, so agile testers derive them from **user stories** instead.

**Definition:** a user story is a few sentences, in the end user's own language, describing what a user does with the software as part of their job.

**Form of a user story**
- Template: *"As a [role], I want to [action], so that [benefit]."*
- Looser form: actor + verb + object, e.g. "Withdraw money from a checking account".
- Written in the user's language, small in scale, with just enough detail to capture the intent.
- **Not archived** themselves: the tests derived from them are archived.

**How stories drive development (acceptance tests)**
1. Write a user story, ideally with input from real users.
2. Turn it into one or more **acceptance tests**, which fail at first.
3. Each failing acceptance test drives a sequence of **TDD tests**, each forcing a little more implementation.
4. When enough functionality exists to pass the acceptance test, move to the next story.
5. **Refactor** along the way to avoid maintenance debt.

**From story to concrete test cases** (stories say *what*, test cases bridge to *how*)

*Story: "As a support technician, I want to view a customer's history on demand, so that I can quickly understand their past issues."*
- ✅ Happy path: search existing customer John Smith → full history appears immediately.
- ⚠️ Edge case: search new customer Jane Doe → message "No history found for this customer".

*Story: "As an ATM customer, I want to withdraw cash from my checking account, so that I can access physical currency conveniently."*
- ✅ Happy path: balance $500, request $100 → ATM dispenses $100, balance becomes $400.
- ⚠️ Edge case 1: balance $50, request $100 → fails with "Insufficient funds", balance stays $50.
- ⚠️ Edge case 2: daily limit $500, already withdrawn $450, request $100 → fails with "Daily withdrawal limit exceeded".

**In conclusion:** user stories replace traditional requirements in agile projects, and the acceptance tests derived from them become the lasting record of what the system must do.

## Adding Tests to Legacy Systems

**The problem**
- Most software today is legacy software, and most of it has **no tests**.
- Requirements are hopelessly outdated; designs, if ever written, are long lost.
- Some companies avoid changing old software out of fear of failure.
- Writing a whole new test set is too expensive; giving up on testing leaves a mixed, unmanageable project.

**The agile answer: incremental TDD**
- When a change is made, add TDD tests for **just that change**, then refactor (improve structure without changing behaviour).
- Provide tests only for the code currently being changed or refactored.
- The test collection keeps growing: in the lecture example, tests covering legacy code grow **10 → 22 → 38 → 55 → 72 → 88** over six releases.
- Eventually the software has a strong, trustworthy test suite.

**In conclusion:** incremental TDD brings legacy systems under test gradually, focusing effort exactly where the code is changing.

## The Testing Shortfall

**The question:** do TDD tests (acceptance or otherwise) test the software well, achieve good coverage, find most faults and give management confidence?

**The answer: no.**
- A green build only says the tests you wrote all pass.
- It says nothing about faults you never thought to test for.
- Passing tests do not mean reliable software.

**Why: most agile tests focus on happy paths** (what should happen under normal use). Three kinds of path are usually missed:
- **Confused-user paths:** users make mistakes or do unusual, unexpected things.
- **Creative-user paths:** users invent new ways to use the software that nobody planned for.
- **Malicious-user paths:** users try to break security barriers or abuse the system.

**Example story: "As a user, I want to transfer funds to another account."**
- Confused user: clicks "Submit Transfer" twice rapidly to see if the transfer is processed twice.
- Creative user: enters a negative amount such as −$100, or their own account as the destination.
- Malicious user: modifies the destination account ID in the HTTP payload to move money from an arbitrary account.

The agile literature offers little guidance on any of these paths.

**In conclusion:** a passing agile test suite is necessary but not sufficient, because happy-path tests leave confused, creative and malicious behaviour untested.

## What Testers Should Do

**Two approaches to designing better tests**

| | Human-based approach | Modeling and criteria approach |
|---|---|---|
| Idea | Write extra user stories describing non-happy paths | Model the input domain, or model behaviour with graphs, logic or grammars, then design tests from the models |
| Strengths | Natural fit for people who are good at it | Built-in sense of completion; easier to teach (engineering, not art) |
| Weaknesses | Hard to know when you are finished; some people are bad at it and it is hard to teach | Needs some discrete mathematics |

- The modeling and criteria approach is the focus of Part 2 of the book.

**In conclusion:**
- More companies now put testing first, which cuts costs and raises quality.
- Agile uses a restricted but practical idea of correctness (passing a specific test set), embraces evolutionary design, and depends on automation (a prerequisite for TDD, not the same thing).
- Because agile tests concentrate on happy paths, testers also need the model-based, criteria-driven techniques of the following chapters.

## Self-test

<details><summary>Q1. What is the difference between universal and existential correctness?</summary>

Universal: correct behaviour is fully specified for **every** input before the software runs (e.g. ∀x,y: x ≥ y). Existential (agile): the software is correct if it **passes a specific set of tests**. It is restricted but practical.

</details>

<details><summary>Q2. Is TDD the same as test automation?</summary>

No. Automation is a **prerequisite** for TDD. TDD is a development practice (Red, Green, Refactor) where tests are written before the code.

</details>

<details><summary>Q3. List the three steps of TDD.</summary>

**Red** (write a failing test), **Green** (write minimal code to pass), **Refactor** (improve structure without changing behaviour).

</details>

<details><summary>Q4. Why are system tests hard in agile? What replaces requirements?</summary>

Little or no functionality exists when they're written, and requirements aren't documented traditionally. **User stories** replace requirements, and the tests derived from them are archived instead of the stories.

</details>

<details><summary>Q5. How do you apply TDD to legacy software with no tests?</summary>

**Incremental TDD**: add tests only for the code being changed or refactored. The suite grows over time.

</details>

<details><summary>Q6. Name the three non-happy paths and give an example of each.</summary>

Confused-user (double-clicking submit), creative-user (a negative amount, or sending to your own account), malicious-user (tampering with the HTTP payload).

</details>

<details><summary>Q7. Why does a passing test suite not mean the software is reliable?</summary>

It only proves the tests you wrote pass. It says nothing about faults you never tested for, and most agile tests cover only happy paths.

</details>

<details><summary>Q8. Give two benefits of Continuous Integration.</summary>

Mistakes are caught quickly, and the team becomes aware of divergent design decisions immediately. CI also decides whether the modified system is still correct.

</details>
