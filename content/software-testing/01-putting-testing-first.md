---
title: "Ch 4 — Putting Testing First"
summary: Cost of change, agile vs traditional, universal vs existential correctness, test harness, TDD, CI, user stories, legacy code, and why happy-path tests fall short.
tags: [chapter-4, agile, tdd, ci, user-stories]
sort: 1
---

## The big idea in one line

Testing moved from an **afterthought at the end** of development to the **centre of development** in agile methods. If high-quality testing isn't embedded deeply in your process, the project is at high risk of failure.

## 1. Why things changed: the cost of change

Traditional (plan-driven) philosophy:

- Heavy **upfront analysis and modelling** before any code is written.
- Goal: reveal problems **as early as possible**.
- **The catch:** the later a problem is found, the more work must be done, and the harder the root cause is to track down.

| Phase found | Original estimate | Actual (with revision) |
|---|---|---|
| Analysis | 1.0 | 1.0 |
| Design | 1.3 | 2.2 |
| Code | 1.8 | 4.0 |
| Test | 2.4 | 6.6 |
| Release | 3.0 | 10.0 |

> **Example — "Discount Code" field at checkout.**
> **Found early** (requirements or unit test): the developer updates the function and its local unit tests, which takes about **15 minutes**.
> **Found late** (production): checkout fails at peak sale, support tickets surge, emergency rollback, re-testing database schemas, redeploying microservices, which costs **days of work plus financial and reputational damage**.

### Traditional assumptions and why they break

| Assumption | Why it fails in practice |
|---|---|
| 1. Modelling & analysis catch problems early | Only works if requirements are **complete and current**, and customers keep changing their minds |
| 2. That upfront investment pays off over the project | **Humans approximate; they don't perfect**, so requirements rarely stay complete or current |

## 2. Why be agile?

Agile starts from the view that **neither traditional assumption holds** for many projects:

- **Requirements change constantly.** Users often don't know what they want until they see it.
- **We can't anticipate everything.** Trying to prevent every future change is unrealistic.
- **Much anticipated work isn't needed.** Build only what real user feedback shows is necessary.
- **Documentation becomes outdated quickly.** Non-executable artifacts are rarely updated.

**Agile's core bet:** change is unavoidable, so don't fight it. Start small and **evolve** the software over time.

### Evolutionary design

- Traditional advice: *anticipate change*. But designers often anticipate changes that **never happen** (wasted effort), and **unanticipated** changes still show up.
- Evolving design accepts both kinds of change as the **normal cost of doing business**, not a failure of planning.

## 3. The test harness as guardian (Section 4.2)

### Universal vs existential correctness ⭐

| | Traditional: **Universal** correctness | Agile: **Existential** correctness |
|---|---|---|
| Definition | A formal, complete spec that holds for **every** input (e.g. ∀ x, y: x ≥ y) | Correct if it **passes this specific set of tests** |
| When | Defined and proven **before** the code runs | Demonstrated by running automated tests |
| Problem / benefit | People are very bad at defining correctness completely | Knowing a test's expected result is far simpler, so it's practical |

Example for "x ≥ y": tests (1,1) pass, (1,0) pass, (0,1) fail, (10,5) pass, (10,12) fail.

> **Exam tip:** Agile *trades completeness for practicality*: correctness is **restricted** to "passes this test set".

### Test harness (testing framework)

A **test harness** runs all automated tests efficiently and reports results to developers.
Cycle: **Change code → Run tests → Oracle checks result → Report pass/fail → repeat.**

- Tests **must be automated**. Automation is a **prerequisite** for TDD (TDD ≠ test automation).
- Every test needs a **test oracle** to judge whether it ran correctly.
- Tests effectively **replace the requirements document**.
- Tests must be **high quality** and **run quickly**.
- The **full test set runs every time** the software changes.

## 4. TDD: Red, Green, Refactor

**Test-Driven Development:** write a test **first**, write **just enough** code to make it pass, then **refactor**.

1. **Red:** write a failing test (the behaviour doesn't exist yet).
2. **Green:** write the *minimal* code to make it pass.
3. **Refactor:** clean up the structure **without changing behaviour**; all tests must stay green.

Class exercise: `calculateDiscount(double price, boolean isVIP)`. *Sample solution, assuming VIPs get 20% off:*

```java
// RED: write the test first. It fails because calculateDiscount doesn't exist yet.
@Test void vipGets20PercentOff()  { assertEquals(80.0,  calculateDiscount(100.0, true),  0.001); }
@Test void nonVipPaysFullPrice()  { assertEquals(100.0, calculateDiscount(100.0, false), 0.001); }

// GREEN: minimal code to pass
double calculateDiscount(double price, boolean isVIP) {
    if (isVIP) return price * 0.8;
    return price;
}

// REFACTOR: remove the magic number; tests still pass
static final double VIP_RATE = 0.20;
double calculateDiscount(double price, boolean isVIP) {
    return isVIP ? price * (1 - VIP_RATE) : price;
}
```

## 5. Continuous Integration (CI)

A service that **continuously rebuilds and retests** the system as it changes.

Flow: developer **pulls a clean copy**, then **builds and runs the existing tests**, then **makes and verifies a change**, then **pushes it to the repository**. The **CI server rebuilds and reruns the tests**.

- One developer's mistakes are **caught quickly**.
- The whole team sees **divergent design decisions immediately**.
- Rebuild and verify must be **fast**, so tests must run quickly.
- CI doesn't just run tests. It **decides whether the modified system is still correct**.

## 6. System tests in agile and user stories

System tests are hard in agile for two reasons:

1. **Little or no functionality exists** when system tests are written (often at the start of a sprint).
2. **Requirements aren't documented** the traditional way.

So agile testers derive tests from **user stories** instead of requirements.

### User story

A few sentences, **in the end user's own language**, describing what a user does with the software as part of their job.

**Template:** *As a [role], I want to [action], so that [benefit].* A looser form is also used: *[Actor] + [verb] + [object]*, e.g. "Withdraw money from a checking account."

| Property | Meaning |
|---|---|
| In the user's language | Written the way an end user would describe the job |
| Small in scale | Few details, just enough to capture intent |
| Not archived themselves | Used to derive tests, and **the tests are archived instead** |

### From story to passing software

1. A **user story** is written (ideally with real users).
2. It is turned into one or more **acceptance tests**, which **fail at first**.
3. The failing acceptance test drives a sequence of **TDD tests**, each forcing a bit more implementation.
4. Once the acceptance test passes, move to the **next story**.

**Refactoring** (improving structure without changing behaviour) avoids **maintenance debt**.

### Worked example: ATM withdrawal

**Story:** *As an ATM customer, I want to withdraw cash from my checking account, so that I can access physical currency conveniently.*

| Test | Scenario | Expected result |
|---|---|---|
| Happy path | Balance $500, request $100 | Dispenses $100; balance becomes $400 |
| Edge: insufficient funds | Balance $50, request $100 | Fails; "Insufficient funds"; balance stays $50 |
| Edge: daily limit | Limit $500, already withdrew $450, request $100 | Fails; "Daily withdrawal limit exceeded" |

(Slide example: *Support technician views customer history.* Happy path: "John Smith" shows full history. Edge case: new customer "Jane Doe" shows "No history found for this customer".)

## 7. Adding tests to legacy systems

Most software today is **legacy** and has **no tests**. Requirements are outdated and designs are lost, and some companies avoid changing old code out of fear.

| Option | Verdict |
|---|---|
| Create an entirely new test set | ✗ Too expensive |
| Give up on testing it | ✗ Leaves a mixed, unmanageable project |
| **Incremental TDD** | ✓ Add tests **only where the code actually changes** |

**Incremental TDD:** when a change is made, add TDD tests **for just that change**, then refactor. The test collection **grows over time** (e.g. coverage 10 → 22 → 38 → 55 → 72 → 88 across releases) until the system has a strong, trustworthy suite.

## 8. The testing shortfall ⭐

Do TDD tests test the software well? Good coverage? Find most faults? Should management feel confident? **No.**

> **Passing tests ≠ reliable software.** A green build only tells you the tests you wrote all pass. It says nothing about the faults you never thought to test for.

Agile tests focus on **happy paths**. They miss:

| Missing path | What it is | Example ("transfer funds") |
|---|---|---|
| **Confused-user** | Users make mistakes, do unusual things | Clicks "Submit Transfer" twice rapidly; is the transfer double-processed? |
| **Creative-user** | Users invent unplanned ways to use it | Enters a negative amount (−$100) or their own account as destination |
| **Malicious-user** | Users try to break security or abuse the system | Modifies the destination account ID in the HTTP payload |

The agile literature offers **little guidance** on these paths.

## 9. What should testers do? Two approaches

| | 1. Human-based | 2. Modelling & criteria ⭐ |
|---|---|---|
| How | Write extra user stories for non-happy paths | **Model the input domain**, or model behaviour with **graphs, logic or grammars** |
| When are you done? | Hard to say | Built-in **sense of completion** (coverage criteria) |
| Teachability | Some people are naturally good, and it's hard to teach | Easier to teach: **engineering, not art** |
| Requirement | Intuition | Some **discrete math** |

Modelling & criteria is the focus of Part 2 of the book (Chapter 6 onwards).

## Summary

- **Testing moves earlier**: cuts cost and raises quality.
- **A different "correctness"**: restricted but practical (passes a specific test set).
- **Evolutionary design**: embrace change instead of resisting it.
- **TDD ≠ test automation**: automation is a *prerequisite* for TDD.
- **Agile tests aren't enough**: happy-path tests miss confused, creative and malicious use.

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

Little or no functionality exists when they're written, and requirements aren't documented traditionally. **User stories** replace requirements, and tests derived from them are archived instead of the stories.

</details>

<details><summary>Q5. How do you apply TDD to legacy software with no tests?</summary>

**Incremental TDD**: add tests only for the code being changed or refactored. The suite grows over time.

</details>

<details><summary>Q6. Name the three non-happy paths and give an example of each.</summary>

Confused-user (double-clicking submit), creative-user (negative amount or sending to own account), malicious-user (tampering with the HTTP payload).

</details>

<details><summary>Q7. Why does a passing test suite not mean the software is reliable?</summary>

It only proves the tests you wrote pass. It says nothing about faults you never tested for, and most agile tests are happy-path only.

</details>

<details><summary>Q8. Give two benefits of Continuous Integration.</summary>

Mistakes are caught quickly; the team becomes aware of divergent design decisions immediately. (Also: CI decides whether the modified system is still correct.)

</details>
