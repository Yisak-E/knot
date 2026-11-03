---
title: "Ch 5 — Criteria-Based Test Design"
summary: Test requirements and coverage criteria, the jelly bean example, coverage level and infeasible requirements, minimal vs minimum test sets, generators vs recognizers, subsumption, the four structures, and the pros and cons of criteria-based design.
tags: [chapter-5, coverage-criteria, test-requirements, subsumption]
sort: 2
---

## Test Design and the Four Testing Activities

Testing involves four distinct activities, and each requires different skills, background knowledge, education and training. The first is test design, which can be either criteria-based or human-based. Criteria-based test design creates tests that satisfy coverage criteria such as statement, branch or path coverage, with the goal of systematically covering code structures or requirements. The second activity is test automation, the engineering task of turning test designs into runnable code. The third is test execution, the mechanical process of running the tests against the software. The fourth is test evaluation, the analytical process of interpreting results, coverage measurements and pass or fail outcomes.

Criteria-based test design is the most technical and mathematical job in software testing. It requires knowledge of discrete mathematics, programming and testing, which covers much of a traditional computer science degree. It is intellectually stimulating, rewarding and challenging, and it is analogous to software architecture on the development side. For this reason, using people who are not qualified to design tests is a sure way to get ineffective tests. Criteria-based design is very different from "monkey testing", in which a person sits at the keyboard, wiggles the mouse and bangs the keyboard. Monkey testing needs no automation and minimal training, but it is highly redundant and leaves serious blind spots. Criteria-based design searches the input space thoroughly, so that the tests cover as many different types of input as possible, and avoids overlap, so that each test case is unique.

This approach also changes how testing levels are viewed. The old, phase-based view treats unit, module, integration and system testing as fundamentally different activities that need different methods. The new, structure-based view focuses on the underlying mathematical structures. The foundational test design stays the same at every phase; only the way the model is extracted and the way the values are chosen change.

In conclusion, test design is a distinct, highly skilled activity, and criteria-based design gives it a systematic, engineering foundation that applies at every testing level.

## Model-Driven Test Design

Model-Driven Test Design (MDTD) explains how criteria fit into the testing process. The tester starts with a software artifact at the implementation level and extracts a mathematical model or structure from it, which moves the work up to the abstraction level. A coverage criterion is applied to that structure to generate test requirements. The test requirements are refined into test specifications and then brought back down to the implementation level as input values, test cases, scripts and finally pass or fail results. The key point is that coverage criteria produce test requirements purely at the level of mathematical abstraction, which is why the same criterion can be used for many kinds of artifact.

This approach should not be confused with model-based testing (MBT). In MBT, the model is created before the code as a specification, it defines the requirements, and it is treated as the truth, with the code derived from it. Its goal is to check that the code conforms to the specification, and it finds gaps between design and implementation. In the model-extracted approach used in this course, the model is extracted directly from the code or design artifacts, it represents the implementation, and the code is treated as the truth. Its goal is to achieve high implementation coverage, and it finds logic errors within the implemented code.

In conclusion, MDTD separates the creative work of designing tests at an abstract level from the mechanical work of turning them into concrete, runnable tests.

## Coverage Criteria and Test Requirements

People often talk about "complete testing", "exhaustive testing" or "full coverage", but these ideas are misleading. The number of potential inputs for most programs is so large that it is effectively infinite and cannot be listed explicitly. Even a simple method such as computeAverage(int A, int B, int C) has 2³² × 2³² × 2³² = 2⁹⁶ possible inputs. Because we cannot test with all inputs, coverage criteria tell us which inputs to use. They divide the input space so as to maximise the number of faults found per test case, and they provide useful rules for when to stop testing.

A tester's job can be described simply: define a model of the software, then find ways to cover it. A test requirement is a specific element of a software artifact that a test case must satisfy or cover, such as "statement 12 must be executed". Test requirements usually come in sets, and the set is written TR. A coverage criterion is a rule or collection of rules that imposes test requirements on a test set, such as "every statement must be executed at least once". A criterion is therefore a technique for generating test requirements systematically, and it describes them completely and unambiguously. For example, branch coverage gives two test requirements for every decision, one for the true outcome and one for the false outcome, and call coverage gives one test requirement for every method, which must be called at least once.

To judge how good a set of tests is, we measure it against a criterion in terms of coverage. Given a set of test requirements TR for a coverage criterion C, a test set T satisfies C if and only if, for every test requirement tr in TR, there is at least one test t in T that satisfies tr. It is acceptable to satisfy a requirement with more than one test, but that creates redundancy, and because every test has a cost, testers usually prefer to avoid it.

In conclusion, coverage criteria turn an effectively infinite input space into a finite, well-defined set of test requirements, and coverage measures how well a test set meets them.

## The Jelly Bean Example

The textbook illustrates these ideas with a bag of jelly beans. The beans come in six flavours and four colours: Lemon is yellow, Pistachio is green, Cantaloupe is orange, Pear is white, Tangerine is orange and Apricot is yellow. The flavour criterion says that one jelly bean of each flavour must be tasted, so its test requirements are flavour = Lemon, flavour = Pistachio, flavour = Cantaloupe, flavour = Pear, flavour = Tangerine and flavour = Apricot, giving six requirements. The colour criterion says that one bean of each colour must be tasted, giving four requirements: yellow, green, orange and white. The example also shows the controllability problem: if you pick a yellow bean, it could be Lemon or Apricot, and forcing the system into the exact state a test requirement needs is a core challenge of software testing.

Consider the test set T1 = {three Lemon, one Pistachio, two Cantaloupe, one Pear, one Tangerine, four Apricot}. It satisfies the flavour criterion, because all six flavours appear at least once, but it contains redundancy because several flavours are tasted more than once. Now consider T2 = {one Lemon, two Pistachio, one Pear, three Tangerine}. It does not satisfy the flavour criterion, because Cantaloupe and Apricot are missing. It does satisfy the colour criterion, however, because Lemon gives yellow, Pistachio gives green, Pear gives white and Tangerine gives orange.

In conclusion, the jelly bean example shows how a criterion generates a precise set of test requirements and how the same test set can satisfy one criterion while failing another.

## Coverage Level and Infeasible Requirements

The coverage level of a test set is the number of test requirements it satisfies divided by the total number of test requirements, multiplied by 100%. Coverage level matters for two reasons. First, satisfying a coverage criterion completely is expensive, so teams often compromise by aiming for a certain coverage level. Second, and more importantly, some requirements cannot be satisfied at all. If Tangerine jelly beans are so rare that a bag contains none, the flavour criterion cannot be fully satisfied and the maximum possible coverage is 5/6, about 83%. In such cases it often makes sense to drop the unsatisfiable requirements from TR or to replace them with less demanding ones.

A software example works the same way. Suppose an online shop has six test requirements: user login, product search, adding an item to the cart, payment, order confirmation and refund. If the tests satisfy five of them because the payment provider's refund system is unavailable, the coverage level is 5/6 × 100 = 83.33%. If the refund requirement is genuinely impossible to test, it can be removed from TR, and the remaining five requirements give 5/5 = 100% coverage.

Test requirements that cannot be satisfied are called infeasible: no test case values exist that meet them. There are three typical cases. The first is a contradictory condition, such as `if (x > 10 && x < 5) print("Hello");`, because no value of x can be greater than 10 and less than 5 at the same time. The second is dead code, which can never be executed because it follows a return or throw statement, or sits behind a condition that is always true or always false; for example, in `x = 10; return x; print("Hello");` the print statement can never be reached. The third case shows that infeasibility cannot always be detected: for a condition such as `isPrime(x) && isPrime(x + 1) && isPrime(x² + 1) && isPrime(x³ + 1)`, deciding whether any input makes it true can be as hard as deciding whether the program will ever reach a particular statement. Detecting infeasible test requirements is formally undecidable for most test criteria, meaning that no algorithm can always give the correct answer. As a result, 100% coverage is impossible in practice.

In conclusion, coverage level gives a realistic measure of progress, and infeasible requirements explain why testers rarely reach, or even aim for, 100% coverage.

## Minimal and Minimum Test Sets

Because each test has a cost, testers want test sets without unnecessary redundancy. A test set T is minimal if removing any single test from it would cause T to no longer satisfy all the test requirements. A test set is minimum if there is no smaller set of tests that also satisfies all the test requirements. Every minimum set is also minimal, but a minimal set is not necessarily minimum, and finding a minimum set is hard.

A set-covering example makes the difference clear. Suppose the target features are F = {f1, f2, f3} and the candidate tests are e1, which covers f1; e2, which covers f2; e3, which covers f3; and e4, which covers all three features. The subset S1 = {e1, e2, e3} covers all the features, and removing any one of its tests leaves a feature uncovered, so S1 is minimal, with three elements. The subset S2 = {e4} also covers all the features with only one test, and no smaller valid set can exist, so S2 is minimum, and also minimal.

In conclusion, a minimal test set has no redundant tests, while a minimum test set is the smallest possible one, which is harder to find.

## Two Ways to Use Test Criteria

Test criteria can be used in two ways. The first is to directly generate test values that satisfy the criterion, sometimes called the generator approach. This is often assumed by the research community and is the most obvious way to use criteria, but it is very hard without automated tools to support test value generation. The second is to generate test values externally, by hand or with a pseudo-random tool, and then measure the tests against the criterion in terms of coverage. This recognizer approach is usually favoured by industry, because generating tests to directly satisfy a criterion is too hard. However, it is sometimes misleading: if the tests do not reach 100% coverage, it is not always clear what that means. For this reason, test criteria are sometimes called metrics. Both approaches are provably undecidable for most criteria, but recognising whether tests satisfy a criterion is far more achievable than generating tests that do.

Consider a program that prints "Adult" if age >= 18 and "Minor" otherwise. Branch coverage gives two test requirements: the true branch and the false branch. With the generator approach, the tester knows what must be covered and chooses age = 20 for the true branch and age = 15 for the false branch, giving 2/2 = 100% coverage. With the recognizer approach, the tester might randomly generate ages 20, 25 and 30, all of which take the true branch, so the coverage is only 1/2 = 50%. The generator approach is efficient here, but it can be very difficult for complex code. For a branch guarded by a condition such as x × y + z > 100 and x² − y > 50 and z ≠ 0, choosing values of x, y and z that reach it by hand is extremely difficult.

In conclusion, generating tests from a criterion is more direct but harder, while measuring existing tests against a criterion is more practical but can be misleading.

## Comparing Criteria with Subsumption

Coverage criteria are often related to one another and are compared using subsumption. A criterion C1 subsumes a criterion C2 if and only if every test set that satisfies C1 also satisfies C2. In the jelly bean example, satisfying the flavour criterion automatically satisfies the colour criterion, because Lemon and Apricot cover yellow, Pistachio covers green, Cantaloupe and Tangerine cover orange and Pear covers white. Tasting only four well-chosen flavours is enough to cover the colours, so the flavour criterion subsumes the colour criterion but not the other way round. In software, branch coverage subsumes statement coverage: if a test set covers every branch in a program, it is guaranteed to execute every statement. Similarly, from Chapter 6, all combinations coverage subsumes pair-wise coverage.

Test requirements also only make sense for a specific artifact. In the jelly bean example, the requirement "colour = purple" means nothing, because the factory makes no purple beans. In software, the requirement "execute statement 42" makes sense only if the program has a statement 42. In good practice, the test engineer starts with a software artifact and then chooses a coverage criterion, and combining the two produces the specific set of test requirements that is relevant to the task.

In conclusion, subsumption shows which criteria are stronger, so testers can avoid redundant effort by satisfying the stronger criterion.

## The Four Structures for Criteria-Based Testing

Testing researchers have defined dozens of criteria, but they all apply to just four types of structure: input domains, graphs, logic expressions and syntax descriptions (grammars). This is model-extracted testing, not "model-based testing", which derives tests from a separate model that describes some aspects of the system.

The first structure is the input space. The tester divides the input domain into disjoint, complete blocks, using information from function signatures and data types, specifications and system limits, and use cases. For a bank transfer feature transfer(amount, account), the amount might be invalid (amount ≤ 0), valid (0 < amount ≤ 10,000) or over the limit (amount > 10,000), and the target account might be at the same bank, at an external bank, or an invalid IBAN. The test transfer(−50, "External") should be rejected immediately. Key criteria include base choice coverage and all combinations coverage.

The second structure is graphs, which are extracted from UML use cases, finite state machines and source code. In a control flow graph, nodes are code blocks and edges are control decisions; in a finite state machine, nodes are states and edges are transitions; and in a use case graph, nodes are user actions and edges are workflow paths. For a user authentication state machine, the states might be Logged Out, Authenticating, Active Session and Account Locked, with a valid password leading to Active Session and three invalid passwords leading to Account Locked. An edge coverage test would verify the transition from Authenticating to Account Locked. Key criteria include node coverage, edge coverage and prime path coverage.

The third structure is logic expressions, which are extracted from decisions in source code, guards on transitions, conditionals in use cases, and business rules or decision tables, and may be written in disjunctive normal form. For a loan approval rule P = (CreditScore > 700 AND Income > $50k) OR HasGuarantor, correlated active clause coverage tests the HasGuarantor clause while keeping the first part false. The pair (score 650, income $40k, guarantor true), which passes, and (score 650, income $40k, guarantor false), which fails, shows that HasGuarantor alone determines the outcome. Key criteria include clause coverage, combinatorial coverage and active clause coverage.

The fourth structure is syntax, described by grammars such as BNF, XML or JSON schemas. Syntax-based testing generates valid and invalid input strings to test parsers and message formats, and it also uses mutation analysis, which deliberately seeds faults into code to evaluate the quality of a test suite. For example, if the original code is `if (balance >= amount)` and a mutant changes it to `if (balance > amount)`, a test with balance equal to amount must fail on the mutant in order to "kill" it. Grammar-based fuzzing might also pass the string "100" where an integer 100 is expected. Key criteria include terminal symbol coverage, production coverage and the mutation score.

In conclusion, input spaces, graphs, logic and syntax are the four structures behind every coverage criterion, which means that a small set of ideas can be applied across all kinds of software artifact.

## Advantages and Disadvantages of Criteria-Based Test Design

Traditionally, testers entered test cases manually, ran them and checked the software's response, which is time-consuming and costly. Formal coverage criteria make testing more systematic by helping testers decide which test inputs are necessary to assess the software thoroughly. Following them makes it more likely that the tester will find problems, gives greater assurance that the software is of high quality and reliability, defines a goal or stopping rule for testing, and makes testing more efficient and effective.

Criteria maximise the "bang for the buck". They need fewer tests than human-based approaches while producing a comprehensive test set with minimal overlap in fault-revealing ability. They provide traceability from software artifacts to tests, so the reason for every test is answered. They have built-in support for regression testing. They give a stopping rule, with advance knowledge of how many tests are needed. They are also natural to automate. On the other hand, criteria-based design can be time-consuming and potentially costly, it may produce a large number of test cases, and it requires testing expertise. Coverage does not equal defect detection, criteria may miss unexpected or unanticipated faults, the tests need maintenance when the system changes, and some tests may be unnecessary or of low value.

A good criterion should make it easy to compute the test requirements automatically and efficient to generate test values, and the resulting tests should reveal as many faults as possible. Researchers still need to provide more data on how to compare criteria. Taken together, the approach works like an optimisation pipeline: the software is mapped as structures, criteria filter the infinite input space down to a finite set of test requirements, subsumption eliminates overlap between criteria, and minimal test sets strip out redundancy, limited only by infeasibility.

In conclusion, criteria-based design trades some cost and required expertise for tests that are more effective, traceable and easier to automate.

## Criteria-Based Testing in Practice

Many companies still use monkey testing, with no automation and minimal training, and some automate tests designed by humans. However, companies that use both automation and criteria-based testing save money, find more faults and build better software. Adoption faces four roadblocks: a lack of education, since few computer science programs require testing courses; the need to change the development process, which is fundamental and expensive; tools that are hard to use because they require users to understand the underlying mathematics; and weak tools that rarely solve the central problem of generating test values automatically.

Several changes in practice are recommended. Test and QA teams need better tools, more education, more technical expertise and more specialisation, a trend that already happened in development in the 1990s. Teams should be reorganised to use individual abilities effectively, since one "math-head" can support many testers. Teams should be retrained to use a process such as MDTD and to learn more testing concepts. Researchers should be embedded in teams where needed, and industry should get involved in curriculum design through advisory boards. Researchers and educators, in turn, should hide the deep theory inside usable tools, embed mathematical ideas in practitioner-focused tools, show the economic return of automated test data generation through experiments, and teach test design, automation and TDD as core subjects.

In conclusion, criteria-based testing works best when organisations combine it with automation, skilled test designers and good tools.

## Summary of Chapters 1 to 5

We test to reduce the risk of using software, and the key concepts are faults, failures and the RIPR model. In the test process maturity levels, level 4 is a mental discipline that improves the quality of the software. Model-driven test design separates testing into four types of activity: test design, automation, execution and evaluation. Test automation depends on testability, observability, controllability and test automation frameworks, and test-driven development puts tests first. Criteria-based test design rests on four structures, from which test requirements and criteria are defined.

In conclusion, earlier and better testing empowers test managers, and criteria-based test design is the engineering foundation that makes better testing possible.

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
