---
title: "Ch 6 Part 1 — Input Space Partitioning & IDM"
summary: Partitions (disjoint + complete), characteristics and blocks, the five-step IDM process, interface- vs functionality-based modelling, block-choosing strategies, and the triang() and findElement() examples.
tags: [chapter-6, isp, idm, partitioning]
sort: 3
---

## Input Space Partitioning in Software Testing

In a fundamental way, all testing is about choosing elements from the input space of the software under test. Input Space Partitioning (ISP) makes this choice systematic. It divides the input space into regions, called blocks, using a logical partitioning of the inputs, and then selects at least one representative value from each block. ISP is one of four structures used to model software for testing, alongside graphs, logic expressions and syntax. Graphs are applied to source code, specifications, design and use cases. Logic is applied to source code, specifications, finite state machines and DNF (disjunctive normal form: ANDed clauses joined by ORs, such as (A AND B) OR (C AND D)). Syntax is applied to source code, models, integration and inputs. ISP is also independent of the RIPR model (Reachability, Infection, Propagation, Revealability), because it uses only the input space of the software and nothing about its implementation.

The input domain of a program is the set of all its possible inputs. It is usually so large that it is effectively infinite. Its scope is defined by the input parameters, which include method parameters, data read from files, global variables and user inputs. The domain is divided into blocks that are assumed to be equally useful for testing, and the tester chooses at least one value from each block. For example, if the input domain is the alphabetic letters and the partitioning characteristic is the case of the letter, there are two blocks: upper case and lower case.

ISP is popular for several reasons. It can be applied at any level of testing, from unit to integration and system testing. It is easy to apply and needs no automation and very little training. It is adjustable, because the tester can tune the procedure to produce more or fewer tests. It is also a black-box technique: the tester needs no knowledge of the implementation, only of the input space.

In conclusion, ISP turns the overwhelming input space into a manageable set of blocks, so the tester can cover all the important kinds of input with relatively few test cases.

## Valid Partitions and the Equivalence Assumption

A partition is defined over a domain D by a partition scheme q, which produces a set of blocks b1, b2, …, bQ. For the partition to be valid it must satisfy two properties. First, the blocks must be pairwise disjoint: no two blocks may share an element, so the intersection of any two different blocks is empty. Second, the blocks must be complete: together they must cover the whole domain, so the union of all the blocks equals D. These two properties are the most frequently examined idea in this chapter.

ISP rests on one core assumption: equivalence within a block. If the blocks are chosen well, every value in a block makes the program behave in the same way, so one test per block is enough. For example, if age is partitioned into Child (0–17) and Adult (18–64), testing the value 30 is treated as representative of all adults.

Partitions are easy to get wrong. Splitting the integers into {x < 0} and {x > 0} is not complete, because zero belongs to no block; adding {x = 0} fixes it. Partitioning a list by order into {sorted ascending}, {sorted descending} and {arbitrary order} is not disjoint, because a list such as [14] (or an empty list) is sorted both ascending and descending. The fix is to design blocks for one property at a time and use two Boolean characteristics: "is the list sorted ascending?" and "is the list sorted descending?". Lists of length 0 or 1 are true for both, which is fine because each characteristic is now a valid partition on its own. A similar problem occurs with triangles: {scalene, isosceles, equilateral, invalid} is not disjoint because an equilateral triangle is also isosceles, so the second block must become "isosceles but not equilateral".

A grading example shows both kinds of error. Suppose calculateGrade(int score) gives A for 90–100, B for 80–89, C for 70–79, D for 60–69 and F for 0–59, and invalid scores throw an exception. The partition 0–60, 60–69, 70–79, 80–89, 90–100, −1, 101 is not disjoint, because 60 appears in two blocks, and it is not complete, because values such as −50 or 500 belong to no block. A proper partition is x < 0 (exception), 0–59 (F), 60–69 (D), 70–79 (C), 80–89 (B), 90–100 (A) and x > 100 (exception). Valid partitions of all the integers include {negative, zero, positive} and {even, odd}. For sqrt(x), each characteristic gets its own partition: the sign of x (negative, zero, positive), the magnitude of x (normal, very large) and whether x is a whole number (integer, non-integer). Mixing "positive", "large" and "non-integer" in one list would create overlapping blocks.

In conclusion, every partition must be checked for both disjointness and completeness, and keeping each characteristic focused on a single property is the simplest way to avoid mistakes.

## The Combinatorial Explosion

Even after partitioning, the number of tests can grow very quickly. A checkout form might have 15 parameters, such as address, city, zip code, payment method, card number, expiry date, CVV, promo code and gift wrap. If each parameter has only 3 blocks, testing every combination requires 3 to the power 15, which is 14,348,907 tests. At one test per second, non-stop, that would take about 166 days. Even a small search page with three filters (size, colour and brand), each with two options, already needs 2 × 2 × 2 = 8 tests, and every extra option or variable makes the total grow exponentially.

The standard approach therefore has two steps. First, each parameter is partitioned into blocks separately. Second, the blocks are combined selectively rather than exhaustively. Blocks may be combined independently, testing parameters in isolation, which gives fewer tests but may miss bugs, or in conjunction, choosing combinations driven by the program logic, which is smarter. Input Domain Modeling formalises this process and uses coverage criteria (covered in Part 2) to avoid the explosion while keeping the tests effective.

In conclusion, the combinatorial explosion is the reason testers need both careful partitioning and a principled way to choose which combinations of blocks to test.

## The Five-Step Input Domain Modeling Process

Input domain modeling follows five steps. Step 1 is to identify the testable functions. Step 2 is to find all the inputs, parameters and characteristics. Step 3 is to model the input domain by partitioning each characteristic into blocks. Step 4 is to choose combinations of values by applying a coverage criterion. Step 5 is to refine the abstract combinations into concrete test inputs. Steps 1 and 2 happen at the implementation (concrete) level, steps 3 and 4 happen at the design abstraction level, and step 5 returns to the implementation level. Moving from step 2 to step 3 therefore means moving up from the implementation level to the design abstraction level.

Testable functions can be found in several places. In a Java class, each public method is a testable function, and characteristics are often shared across methods, so a common set can be built for the whole class. For example, all the methods of a Calculator class (add, subtract, multiply, divide) take numeric inputs, return numeric outputs and constrain their input ranges. In UML modeling artifacts, each use case maps to an intended functionality. An ATM "withdrawal" use case makes "withdrawing cash" a testable function and suggests characteristics such as "Is the card valid?" and "Relation of the withdrawal policy to the request".

Step 2 is not especially creative, but it is important to find every parameter that can affect behaviour. Consider findElement(List list, Object element), which throws a NullPointerException if the list or the element is null and otherwise returns true if the element is in the list. It has two parameters, list and element. Syntax-based characteristics, each true or false, are "list is null", "list is empty" and "element is null". Behaviour-based characteristics, assuming neither is null, are whether the element is present or absent, the size of the list (0, 1, or more than 1 elements) and, if present, the position of the element (first, last, middle, or the only element). Similarly, for findLast(int[] a, int x), which returns the index of the last occurrence of x or −1, useful characteristics include whether a is null, whether a is empty, how many times x occurs (not at all, once, or more than once) and where the last occurrence is (first, middle or last position).

In conclusion, the five steps move the tester from concrete code up to an abstract model and back down to concrete tests, and the quality of the final tests depends heavily on finding every relevant parameter early on.

## Input Domain Modeling (IDM) in Software Testing

Input Domain Modeling (IDM) is an important step in software testing that represents the input space of a system in an abstract way. It involves identifying characteristics of the inputs and dividing each characteristic into partitions called blocks. Values within the same block are considered equivalent for testing purposes. However, some combinations of input values may be invalid, so the IDM must also identify and record restrictions. The main purpose of this step is to organize the input space so that appropriate test cases can be selected. A characteristic is a feature or quality that identifies something, and each partition is based on a characteristic of the program, its inputs or its environment. Examples include whether input X is null, the order of a list F (sorted, inverse sorted, arbitrary), the minimum separation distance of two aircraft, the input device (DVD, CD, computer) and personal attributes such as hair colour, height, major or age. Blocks may be a single value or a set, each value in a block should be equally useful for testing, and each abstract test uses one block from each characteristic.

There are two main approaches to input domain modeling: interface-based input domain modeling and functionality-based input domain modeling. Interface-based input domain modeling considers each parameter separately. Its strengths are that it is easy to follow, its characteristics are easy to identify, and the resulting tests can be translated easily into executable test cases. However, it may miss interactions between parameters because it tests them in isolation, even when the system's behavior depends on combinations of inputs, such as a loop index and the size of an array.

For example, in a bank transfer system, the parameters are the from account, the to account, and the transfer amount. The tester can consider valid and invalid accounts and amounts that are within, below, or above the allowed range. One approach is to hold two parameters at valid values while varying the third parameter, giving tests such as (valid, valid, in range), (invalid, valid, in range), (valid, invalid, in range), (valid, valid, below range) and (valid, valid, above range). This approach helps test each parameter separately and is related to the idea of base choice coverage.

In contrast, functionality-based input domain modeling identifies characteristics according to the intended behavior of the system rather than its interface. It allows the tester to use domain knowledge and include more information from the system requirements in the IDM. Since requirements exist before the code is developed, input domain modeling and test generation can begin early. Many researchers believe that functionality-based modeling produces better tests than interface-based modeling.

For example, consider the factorial function, which takes an integer n and returns the product of all positive integers up to n. When n = 0, the expected result is 1. When n is within the supported range, the function should return a valid result. If n is negative or a floating-point number, the function should return an error. If n exceeds the supported range, it may produce an error or overflow. For example, 13! exceeds the range of a 32-bit signed integer.

Another example is the divide(num, den) method, which divides two integers. Its characteristics include the denominator value, the numerator value, the division result type, and the sign of the result. The denominator can be zero, positive, or negative, while the numerator can also be zero, positive, or negative. The division result can be an integer without a remainder, an integer division with a remainder, or undefined when dividing by zero. When the result is defined, its sign can be positive, negative, or zero. These characteristics help the tester identify different input conditions and expected behaviors.

The same contrast is sometimes described as syntax-based versus behaviour-based modeling. A syntax-based IDM focuses on the structure and type of the input parameters, using a characteristic such as "relation of a side to zero", and aims to find inputs that violate basic data rules; for example, triang(−1, 5, 5) should return Invalid. A behaviour-based IDM focuses on the expected output, using a characteristic such as "type of triangle", and aims to verify the core logic; for example, triang(5, 5, 5) should return Equilateral. The two should be used together: the syntax model covers every way an input can be invalid, while the behaviour model covers every valid outcome.

After identifying the characteristics, the tester must choose appropriate blocks and representative values. This is another important engineering decision because the number of blocks affects the cost and effectiveness of testing. More blocks may lead to more test cases, require additional resources, and potentially reveal more faults. Fewer blocks reduce testing effort but may also reduce the effectiveness of testing.

Several strategies can be used when selecting blocks. First, the tester should include both valid and invalid values to check how the system handles unexpected inputs. Second, valid ranges can be divided into sub-partitions when different parts exercise different functionality, such as child tickets and standard adult tickets. Third, boundary values should be considered because values at or near boundaries can cause problems; this is a form of stress testing. Fourth, normal-use or happy-path values should be included, particularly when failures may depend on inputs that are not near boundaries.

Other strategies include using enumerated types, balancing the number of blocks across characteristics, checking for missing blocks, and checking for overlapping blocks. Enumerated types can be divided into blocks representing their discrete values. Balancing may involve adding blocks to characteristics that initially have fewer blocks when doing so requires little additional effort. Checking for missing blocks ensures that the blocks cover the entire input space of a characteristic, while checking for overlapping blocks ensures that no value belongs to more than one block.

Finally, special values should also be considered when modeling the input domain. For reference variables, null is typically a special case that must be treated differently from non-null values. For containers such as sets and lists, whether the container is empty is often a useful characteristic.

Some general hints help when building an IDM. More characteristics or more blocks always means more tests. It is better to use more characteristics with fewer blocks each, because this leads to fewer mistakes and fewer tests. The IDM should stay independent of the implementation and be based on the requirements and specifications rather than the code. Values should be chosen strategically, including valid, invalid and special values, exploring boundaries and balancing the number of blocks per characteristic. As a worked example, consider ticketPrice(int age), where valid ages are 0–120 and tickets are priced for a child (0–12), an adult (13–64) and a senior (65–120). The blocks are age < 0 (invalid), 0–12, 13–64, 65–120 and age > 120 (invalid). Mid-block values such as −5, 6, 30, 80 and 150 cover normal use, and the boundary values −1, 0, 12, 13, 64, 65, 120 and 121 add eight more, giving 13 test values in total.

In conclusion, input domain modeling provides a structured way to identify input characteristics, divide them into blocks, and select representative test values. By choosing appropriate characteristics and applying suitable block-selection strategies, testers can balance testing cost and effectiveness while ensuring that the input space and its restrictions are properly represented.

## The Triangle Example: triang()

The running example in this chapter is triang(s1, s2, s3), which takes three integer side lengths and returns Scalene, Isosceles, Equilateral or Invalid. It returns Invalid if any side is zero or negative, Equilateral if all three sides are equal, Isosceles if any two sides are equal, and Scalene otherwise.

```java
if (s1 <= 0 || s2 <= 0 || s3 <= 0) return INVALID;
if (s1 == s2 && s2 == s3)            return EQUILATERAL;
if (s1 == s2 || s2 == s3 || s1 == s3) return ISOSCELES;
return SCALENE;
```

The first, interface-based partitioning uses three characteristics, each relating one side to zero, with the blocks greater than zero, equal to zero and less than zero. Example tests include (7, 0, −3), (0, 3, 5) and (−5, 4, 8). With three blocks per side, all combinations give 3 × 3 × 3 = 27 tests, and because valid triangles need positive sides, many of these combinations are invalid. A refined characterisation splits each side into four blocks: greater than 1, equal to 1, equal to 0 and negative, with the candidate values 2, 1, 0 and −1. This gives 4 × 4 × 4 = 64 combinations. It is complete only because the inputs are integers, and it deliberately includes the boundary values 0 and 1. Choosing candidate values early makes the tester think concretely about the predicates that describe each block. Because this partitioning uses only syntactic information (three integer inputs), it is interface-based and ignores the program logic.

A functionality-based alternative uses the geometric classification as a single characteristic. As noted earlier, it must use the blocks scalene, isosceles-but-not-equilateral, equilateral and invalid, with values such as (4, 5, 6), (3, 3, 4), (3, 3, 3) and (3, 4, 8). A triangle with sides a, b and c is valid only if a + b > c, a + c > b and b + c > a, so (3, 4, 8) is invalid because 3 + 4 is not greater than 8. Yet another IDM breaks the geometric characterisation into four Boolean characteristics (Scalene, Isosceles, Equilateral and Valid, each true or false) and records the constraints between them: if Equilateral is true then Isosceles must be true, and if Valid is false then Scalene, Isosceles and Equilateral must all be false.

These models reveal an important weakness. The triples (4, 5, 6) and (3, 4, 8) both fall into the same combination (greater than 1, greater than 1, greater than 1) in the refined interface-based model, yet one is scalene and the other is invalid. The assumption of equivalence within a block fails, which shows that the interface-based model alone is not enough.

In conclusion, the triangle example shows that different IDMs of the same function expose different faults, and that combining a syntax-based and a behaviour-based model gives far better coverage than either one alone.

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
