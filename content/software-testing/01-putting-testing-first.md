---
title: "Ch 4 — Putting Testing First"
summary: Cost of change, agile vs traditional methods, universal vs existential correctness, the test harness, TDD, continuous integration, user stories, legacy code, and why happy-path tests fall short.
tags: [chapter-4, agile, tdd, ci, user-stories]
sort: 1
---

## The Changing Role of Testing

The role of testing in software development has changed radically in recent years. In the past, testing was often an afterthought performed at the end of development. In agile methods, it has become a central activity that drives the whole development process. This chapter traces that evolution and the key enablers behind it. The main lesson is that if high-quality testing is not embedded deeply in the development process, the project is at high risk of failure.

The traditional, plan-driven philosophy focuses on extensive upfront analysis and modeling before any code is written. Its goal is to reveal problems as early as possible, because the later a problem is found, the more work is needed to fix it and the harder its root cause is to track down. Studies of the cost of change show this clearly. If fixing a problem found during analysis costs 1 unit, the original estimates were 1.3 units in design, 1.8 in coding, 2.4 in testing and 3.0 after release, but the actual revised costs were 2.2, 4.0, 6.6 and 10.0. For example, suppose a requirement says a "Discount Code" field must be added during checkout. If the problem is found early, during requirements or unit testing, a developer updates the function and its local unit tests in about 15 minutes. If it is found late, in production, checkout may fail during a peak sale, support tickets surge, and a hotfix requires an emergency rollback, re-testing of database schemas and redeployment of services. That costs days of work as well as financial and reputational damage.

Traditional methods rest on two assumptions. The first is that modeling and analysis can catch problems early, and the second is that this upfront investment pays off over the life of the project. Both assumptions hold only if the requirements stay complete and current. In practice, customers keep changing their minds, and requirements evolve as users learn what they actually need. People are also naturally good at approximating but poor at getting things exactly right, which is a problem for methods that assume perfection.

In conclusion, testing moved to the centre of development because finding problems late is extremely expensive and because the upfront planning that traditional methods rely on rarely survives changing requirements.

## Why Agile Methods Embrace Change

Agile methods start by recognising that neither traditional assumption holds for many software projects. Requirements change constantly, because users often do not know what they want until they see it and engineers can misread what is needed. It is also impossible to anticipate every future change, so trying to prevent all change is unrealistic. Much of the work done in anticipation of change turns out to be unnecessary, so agile delivers value iteratively and builds only what real user feedback shows is needed. Finally, documentation such as requirements and other non-executable artifacts becomes outdated quickly, because it is rarely updated once written.

Agile's core bet is that change is unavoidable, so the team should not fight it. Software should start small and evolve over time. This affects design as well. Traditional design advice says to anticipate change, but designers often anticipate changes that never happen, which is wasted effort, while unanticipated changes still arrive whether or not the design prepared for them. Evolutionary design accepts both kinds of change as the normal cost of doing business rather than a failure of planning.

In conclusion, agile methods treat change as normal and grow the software in small steps, which makes continuous, automated testing essential.

## The Test Harness as Guardian

Agile methods, and especially test-driven development, take a novel and more restricted view of correctness. Earlier chapters argued that full correctness is not a meaningful concept for large, complex programs. Traditional thinking uses universal correctness: correct behaviour is defined completely by a formal specification for every possible input, such as a rule that x ≥ y must hold for all x and y, and it must be established before the software runs. People are very bad at defining correctness completely, and software engineers are not mathematicians. Agile methods instead use existential correctness: the software is considered correct if it passes a specific set of tests. For the rule x ≥ y, tests such as (1, 1), (1, 0) and (10, 5) pass, while (0, 1) and (10, 12) fail. Knowing the expected result of a test is far simpler than knowing correctness for the whole system, so this is a fundamental and practical shift: agile trades completeness for something it can actually achieve.

A test harness, also called a testing framework, runs all the automated tests efficiently and reports the results to the developers. It works in a continuous cycle: the developer changes the code, the tests run, a test oracle checks each result, and the harness reports pass or fail. Several conditions follow from this. Tests must be automated, because automation is a prerequisite for TDD, although TDD and automation are not the same thing. Every test needs a test oracle that can judge whether it ran correctly. The tests effectively replace the requirements document, so they must be of high quality and must run quickly, because the full test set runs every time the software changes.

In conclusion, the automated test harness becomes the guardian of correctness in agile development, with "correct" meaning "passes this set of tests".

## Test-Driven Development: Red, Green, Refactor

Test-Driven Development (TDD) is a practice in which the developer writes a test first, then writes just enough code to make it pass, and then refactors. The cycle has three steps. In the Red step, the developer writes a test for behaviour that does not exist yet, so it fails. In the Green step, the developer writes the minimal code needed to make the test pass. In the Refactor step, the developer cleans up the code's structure without changing its behaviour, and all the tests must stay green.

For example, consider calculateDiscount(double price, boolean isVIP). As a sample solution, assume VIP customers get 20% off. In the Red step, the developer writes two tests: calculateDiscount(100.0, true) should return 80.0, and calculateDiscount(100.0, false) should return 100.0. Both fail because the method does not exist yet. In the Green step, the simplest passing code returns price × 0.8 when isVIP is true and the price unchanged otherwise. In the Refactor step, the magic number is replaced by a named constant VIP_RATE = 0.20, and the method returns price × (1 − VIP_RATE) for VIPs. The tests still pass, so the behaviour is unchanged.

```java
@Test void vipGets20PercentOff() { assertEquals(80.0, calculateDiscount(100.0, true), 0.001); }
@Test void nonVipPaysFullPrice() { assertEquals(100.0, calculateDiscount(100.0, false), 0.001); }

static final double VIP_RATE = 0.20;
double calculateDiscount(double price, boolean isVIP) {
    return isVIP ? price * (1 - VIP_RATE) : price;
}
```

In conclusion, TDD lets tests drive the design of the code in small, safe steps, and refactoring keeps the code clean without breaking existing behaviour.

## Continuous Integration

Continuous Integration (CI) is one of agile's key advances: a service that continuously rebuilds and retests the system as it changes. A developer pulls a clean copy of the system, builds it and runs the existing tests, makes and verifies a change, and pushes the change to the repository. The CI server then rebuilds the system and reruns the tests.

CI has several benefits. Mistakes made by one developer are caught quickly, and the whole team becomes aware of divergent design decisions immediately. Because the rebuild and verification must happen fast, the tests must run quickly. CI does not just run tests: it decides whether the modified system is still correct.

In conclusion, CI turns the test suite into a shared safety net that checks every change the moment it is made.

## User Stories and Acceptance Tests

System tests are hard for agile methods, for two reasons. Little or no functionality exists when the system tests are written, since they are often written at the start of a sprint. Requirements are also not documented in the way traditional engineering expects. Traditionally, system tests are derived from requirements, so agile testers derive them from user stories instead.

A user story is a few sentences, in the end user's own language, describing what a user does with the software as part of their job. The usual template is "As a [role], I want to [action], so that [benefit]", and a looser form is simply actor, verb and object, such as "Withdraw money from a checking account". User stories are written in the user's language, they are small in scale with just enough detail to capture the intent, and they are not archived themselves. Instead, tests are derived from them and the tests are archived.

User stories drive development through acceptance tests. A user story is written, ideally with input from real users, and turned into one or more acceptance tests, which fail at first because the functionality does not exist yet. Each failing acceptance test drives a sequence of TDD tests, each forcing a little more implementation. Once enough functionality exists to pass the acceptance test, the developers move on to the next story. Refactoring, which improves the code's structure without changing its behaviour, avoids maintenance debt along the way.

User stories describe what the software should do but not how, and concrete test cases bridge that gap. For the story "As a support technician, I want to view a customer's history on demand, so that I can quickly understand their past issues", a happy-path test searches for an existing customer, John Smith, and expects his complete history to appear immediately, while an edge case searches for a new customer, Jane Doe, and expects the message "No history found for this customer". Similarly, for the story "As an ATM customer, I want to withdraw cash from my checking account, so that I can access physical currency conveniently", the happy path has a balance of $500 and a request for $100, so the ATM dispenses $100 and the balance becomes $400. One edge case has a balance of $50 and a request for $100, so the withdrawal fails with "Insufficient funds" and the balance stays at $50. Another edge case has a daily limit of $500, of which $450 has already been withdrawn, so a request for $100 fails with "Daily withdrawal limit exceeded".

In conclusion, user stories replace traditional requirements in agile projects, and the acceptance tests derived from them become the lasting record of what the system must do.

## Adding Tests to Legacy Systems

Most of today's software is legacy software, and most of it has no tests. Its requirements are hopelessly outdated and its designs, if they were ever written down, are long lost. Some companies avoid changing old software at all, simply out of fear of failure. This raises the question of how to apply TDD to software that has no tests. Creating an entirely new test set is too expensive to be practical, and giving up on testing leaves a mixed, unmanageable project.

The agile answer is incremental TDD. When a change is made, the developer adds TDD tests for just that change and then refactors, improving the code's structure without changing its behaviour. Tests are provided only for the section of code currently being changed or refactored. As the project continues, the TDD test collection keeps growing; in the lecture example, the tests covering legacy code grow from 10 to 22, 38, 55, 72 and 88 over six releases. Eventually the software builds up a strong, trustworthy test suite.

In conclusion, incremental TDD lets teams bring legacy systems under test gradually, focusing effort exactly where the code is changing.

## The Testing Shortfall

Do TDD tests, acceptance or otherwise, test the software well? Do they achieve good coverage, find most of the faults, and give management confidence that the software is reliable? The answer is no. A green build only tells you that the tests you wrote all pass. It says nothing about the faults you never thought to test for, so passing tests do not mean reliable software.

The main reason is that most agile tests focus on happy paths, which describe what should happen under normal use. Three other kinds of path are usually missed. Confused-user paths arise when users make mistakes or do unusual, unexpected things. Creative-user paths arise when users invent new ways to use the software that nobody planned for. Malicious-user paths arise when users try to break through security barriers or abuse the system. For a story such as "As a user, I want to transfer funds to another account", a confused user might click "Submit Transfer" twice rapidly to see whether the transfer is processed twice, a creative user might enter a negative amount such as −$100 or their own account as the destination, and a malicious user might modify the destination account ID in the HTTP payload to move money from an arbitrary account. The agile literature offers little guidance on any of these paths.

In conclusion, a passing agile test suite is necessary but not sufficient, because happy-path tests leave confused, creative and malicious behaviour untested.

## What Testers Should Do

There are two answers to the question of how testers should design better tests. The human-based approach creates additional user stories that describe the non-happy paths. Its problems are that it is hard to know when you are finished, and that some people are naturally very good at it while others are bad at it and it is hard to teach. The modeling and criteria approach models the input domain, or models the software's behaviour with graphs, logic or grammars, and designs tests from those models. It gives a built-in sense of completion and is much easier to teach, because it is engineering rather than art, although it requires some knowledge of discrete mathematics. This approach is the focus of Part 2 of the book.

In conclusion, more companies now put testing first, which cuts costs and raises quality. Agile methods use a restricted but practical idea of correctness (passing a specific test set), embrace evolutionary design, and depend on automation, which is a prerequisite for TDD rather than the same thing. Because agile tests concentrate on happy paths, testers also need the model-based, criteria-driven techniques of the following chapters.

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
