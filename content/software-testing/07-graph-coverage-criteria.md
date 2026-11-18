---
title: "Ch 7.1–7.2 — Graph Coverage Criteria"
summary: Graph vocabulary (N, N₀, Nf, E, paths, test paths, SESE, visit and tour, reachability) and the structural criteria NC, EC, EPC, CPC, SPC, PPC, SRTC and CRTC, with simple and prime paths, sidetrips and detours, infeasible requirements and the subsumption hierarchy. Every TRY IT exercise is worked.
tags: [chapter-7, graph-coverage, node-coverage, edge-coverage, prime-paths, subsumption]
sort: 5
---

*Lecture 7 Part 1 (Ammann & Offutt, sections 7.1–7.2). Covers all 51 slides and speaker notes. Each TRY IT exercise is followed by its answer.*

## Where Graph Coverage Fits

**Definition:** graphs are one of the **four structures** used to model software for test design. Each structure has its own coverage criteria.

| Structure | Idea | Applied to |
|---|---|---|
| **Input space** (Ch 6) | Partition the possible inputs (ACoC, ECC, PWC, BCC, MBCC) | Source, specs |
| **Graphs** (Ch 7, this note) | Cover **nodes, edges and paths** | Source, specs, design, use cases |
| **Logic** | Cover logical conditions | Source, FSMs, specs, DNF |
| **Syntax** | Cover or mutate the syntax | Source, models, integration, input |

- The criteria are defined on a **generic graph**, regardless of where the graph came from.
- **Learning outcomes:**
  1. Describe a graph (N, N₀, Nf, E) plus paths, test paths and reachability.
  2. Link tests to test paths and say when a test requirement is met.
  3. Apply node, edge, edge-pair, prime path and round-trip criteria.
  4. Compare criteria by strength using **subsumption**.
- **Roadmap:** 7.1 = graph vocabulary → 7.2 = structural (control flow) criteria → next (7.3) = data flow and graphs from real artifacts.

**Further reading:** [Structural Software Testing (GeeksforGeeks)](https://www.geeksforgeeks.org/software-engineering/structural-software-testing/) · [White Box Testing (GeeksforGeeks)](https://www.geeksforgeeks.org/software-testing/software-engineering-white-box-testing/)

**In conclusion:** graph coverage is the second of the four modelling structures, and its criteria work on any graph, whatever artifact it came from.

## Graphs Are Everywhere in Testing

**Where graphs come from**
- **Control flow graphs:** statements and branches of source code.
- **Design structure:** modules, classes and their relationships.
- **FSMs and state-charts:** states and transitions of a model.
- **Use cases:** scenarios of user interaction.

**Key ideas**
- **Coverage = traversal:** tests "cover" a graph by traversing specific nodes, edges or subpaths. Directed graphs are the foundation of many criteria.
- **Artifact:** anything associated with the software: requirements, design documents, code, tests, user manuals…

**From artifact → graph → test paths (example)**

```java
if (x > 0)   // node 1
    a();     // node 2
else
    b();     // node 3
return;      // node 4
```

- Test t1 (x > 0) → test path [1, 2, 4]; test t2 (x ≤ 0) → [1, 3, 4].
- **The graph is not the artifact:** it is an abstraction that usually omits details.
- **One artifact, many graphs:** several abstractions can be useful.
- **Criteria judge test paths:** they measure how well test paths cover the **graph**, not the artifact directly.

**Further reading:** [Control Flow Graph (CFG) (GeeksforGeeks)](https://www.geeksforgeeks.org/software-engineering/software-engineering-control-flow-graph-cfg/) · [Introduction to Graph Theory (GeeksforGeeks)](https://www.geeksforgeeks.org/maths/mathematics-graph-theory-basics-set-1/)

**In conclusion:** many software artifacts can be modelled as graphs, and testing them means choosing which parts of the graph the tests must traverse.

## Definition of a Graph

**A graph has four parts**

| Symbol | Name | Meaning | Rule |
|---|---|---|---|
| **N** | Nodes | Statements, blocks, states or components | **Non-empty** |
| **N₀** | Initial nodes (⊆ N) | Where paths start, e.g. a program entry point; drawn with an incoming arrow | **Non-empty**; there may be **several** |
| **Nf** | Final nodes (⊆ N) | Where paths end; drawn with a **heavy border** | **Non-empty**; may equal N |
| **E** | Edges (⊆ N × N) | **Ordered pairs** (ni, nj): ni = predecessor, nj = successor | **May be empty** |

- **Why must N₀ and Nf be non-empty?** Every test **starts** at some initial node and **ends** at some final node.
- Edges have a **direction**: (6, 2) is not the same as (2, 6).

**Worked example**
- Graph: 1 → 2, 1 → 3, 2 → 4, 3 → 4 (initial node 1, final node 4).
- N = {1, 2, 3, 4} · N₀ = {1} · Nf = {4} · E = {(1,2), (1,3), (2,4), (3,4)}

**TRY IT: read the 10-node graph (slide 9)** → **Answer**
- N₀ = {1, 2, 3}
- Nf = {8, 9, 10}
- E = {(1,4), (1,5), (2,5), (3,6), (3,7), (4,8), (5,8), (5,9), (6,2), (6,10), (7,10), (9,6)}
- Watch the two edges that point **upward**: (6, 2) and (9, 6). Common slips: forgetting several initial nodes are allowed, and reversing edge direction.
- *(This 10-node graph is reused below for paths and test paths.)*

**Is it a graph? Two edge cases**
- One node, N₀ = {1}, Nf = {1}, E = { } → ✅ **Yes**: the smallest possible graph (one node is its own initial and final node).
- Four nodes with N₀ = { }, Nf = {4} → ❌ **No**: N₀ must not be empty, so no test could start.

**Further reading:** [Introduction to Graph Theory (GeeksforGeeks)](https://www.geeksforgeeks.org/maths/mathematics-graph-theory-basics-set-1/) · [Basic Properties of a Graph (GeeksforGeeks)](https://www.geeksforgeeks.org/dsa/basic-properties-of-a-graph/)

**In conclusion:** a graph is (N, N₀, Nf, E), where nodes, initial nodes and final nodes are never empty and edges are directed ordered pairs.

## Paths, Cycles and Subpaths

**Definitions**
- **Path:** a sequence of nodes [n1, n2, …, nM] in which **each consecutive pair is an edge**.
- **Length:** the number of **edges**. A single node is a path of **length 0**.
- **Cycle:** a path that **begins and ends at the same node**.
- **Subpath:** a subsequence of **consecutive** nodes of a path. It does **not** have to start at the initial node or end at the final node of the original path.

**Examples (10-node graph)**
- Cycle **[2, 5, 9, 6, 2]**, length **4**.
- **[2, 5, 9]** is a subpath of that cycle (consecutive nodes), length **2**.

**TRY IT: which are paths?** → **Answer** (check every consecutive pair against E)

| Sequence | Path? | Reason |
|---|---|---|
| [1, 4, 8] | ✅ | (1,4) and (4,8) exist |
| [2, 5, 9, 6, 2] | ✅ | A cycle of length 4 |
| [3, 7, 10] | ✅ | (3,7) and (7,10) exist |
| [1, 8] | ❌ | No edge (1, 8) |
| [4, 5] | ❌ | No edge (4, 5) |
| [3, 7, 9] | ❌ | No edge (7, 9) |

**Further reading:** [Short Notes: Graph (GeeksforGeeks)](https://www.geeksforgeeks.org/dsa/short-notes-graph/) · [Fundamentals of Graph Theory (GeeksforGeeks)](https://www.geeksforgeeks.org/maths/fundamentals-of-graph-theory/)

**In conclusion:** a path follows real edges in order, its length counts edges, and a cycle returns to its starting node.

## Test Paths and SESE Graphs

**Definition:** a **test path** is a path that **starts at an initial node (in N₀)** and **ends at a final node (in Nf)**.
- Its length may be 0 only when an initial node is also a final node.
- Test paths represent the **execution of test cases**.
- Some test paths can be executed by **many** tests; some by **no** test at all (infeasible).
- "Just because a route is possible doesn't mean our tests have followed it!"

**Examples (10-node graph)**
- **[3, 6, 2, 5, 8]** is a test path (3 ∈ N₀, 8 ∈ Nf).
- **[4, 8]** is a path but **not** a test path (4 ∉ N₀).

**SESE graphs**
- **SESE (Single-Entry, Single-Exit):** exactly **one** initial node n₀ and **one** final node nf.
- **Double diamond:** the CFG of **two if-then-else statements in sequence**.
  - Edges: 1→2, 1→3, 2→4, 3→4, 4→5, 4→6, 5→7, 6→7; n₀ = 1, nf = 7.

**TRY IT: list every test path from 1 to 7** → **Answer: four test paths**
- [1, 2, 4, 5, 7] · [1, 2, 4, 6, 7] · [1, 3, 4, 5, 7] · [1, 3, 4, 6, 7]
- Two independent binary choices → 2 × 2 = **4** test paths.

**Further reading:** [Path Testing in Software Engineering (GeeksforGeeks)](https://www.geeksforgeeks.org/software-engineering/path-testing-in-software-engineering/) · [Basis Path Testing (GeeksforGeeks)](https://www.geeksforgeeks.org/software-engineering/basis-path-testing-in-software-testing/)

**In conclusion:** a test path runs from an initial node to a final node and stands for one execution of a test.

## Visiting and Touring

**Definitions**
- A test path p **visits node n** if n is in p, and **visits edge e** if e is in p.
- A test path p **tours subpath q** if q is a **subpath of p**.
- Use **"visit"** for nodes and edges, **"tour"** for longer subpaths.

**TRY IT: p = [1, 2, 4, 5, 7] on the double diamond** → **Answer**
- **Visits nodes:** 1, 2, 4, 5, 7
- **Visits edges:** (1,2), (2,4), (4,5), (5,7)
- **Tours subpaths:** [1,2,4], [2,4,5], [4,5,7], [1,2,4,5], [2,4,5,7], [1,2,4,5,7]
- Each edge is also a subpath of length 1; subpaths must be **consecutive** nodes of p.

**Further reading:** [Control Flow Software Testing (GeeksforGeeks)](https://www.geeksforgeeks.org/software-testing/control-flow-software-testing/)

**In conclusion:** nodes and edges are visited, longer subpaths are toured, and only consecutive pieces of the test path count.

## Linking Tests to Test Paths

**Notation**
- **path(t):** the test path executed by test t.
- **path(T):** the set of test paths executed by test set T.
- Each test executes one test path: a complete run from an initial to a final node.
  - Example: T = {t1, t2, t3} → path(T) = {p1, p2, p3}.

**Deterministic vs non-deterministic**

| | Deterministic | Non-deterministic |
|---|---|---|
| Behaviour | Same input → same output and **same path** | Same input may follow **different paths** |
| Example | An if statement | Random numbers, threads and timing, external state, input during a run |
| Mapping | Many tests may share one path (**many-to-one**) | path(t) is **not a single path** |

- The definitions in this chapter **assume deterministic** behaviour.

**Reachability**
- **Syntactic reachability:** a path from ni to n **exists in the graph**.
  - Example: `if (x > 0) {node 2} else {node 3}; node 4` → node 2 is syntactically reachable from node 1 because [1, 2] is a path.
- **Semantic reachability:** **some input** actually executes a path from ni to n.
  - With x = 5, [1, 2, 4] runs. If every input had x ≤ 0, node 2 would be syntactically but **not semantically** reachable.
- The criteria are defined over **syntactically reachable** nodes; semantically unreachable ones become **infeasible requirements**.

**Further reading:** [Reachability in Compiler Design (GeeksforGeeks)](https://www.geeksforgeeks.org/compiler-design/reachability-in-compiler-design/) · [Unreachable Code Error in Java (GeeksforGeeks)](https://www.geeksforgeeks.org/java/unreachable-code-error-in-java/)

**In conclusion:** path(t) and path(T) connect tests to the graph, and reachability decides whether a requirement can actually be met.

## TRY IT: Model a Flowchart as a Graph (Discount Calculator)

**The flowchart:** Start → "Is premium member?" → Yes: 20% discount; No → "Is first purchase?" → Yes: 10%; No: 0% → all → "Calculate final price" → End.
- Hint: treat **Start and the first decision as one node**.

**Answer**
- Nodes: 1 = Start/premium?, 2 = 20%, 3 = first purchase?, 4 = 10%, 5 = 0%, 6 = final price, 7 = End.
- N = {1, 2, 3, 4, 5, 6, 7} · N₀ = {1} · Nf = {7}
- E = {(1,2), (1,3), (2,6), (3,4), (3,5), (4,6), (5,6), (6,7)}

| Test | Test path |
|---|---|
| t1: premium, not first | [1, 2, 6, 7] |
| t2: standard, first | [1, 3, 4, 6, 7] |
| t3: standard, not first | [1, 3, 5, 6, 7] |

- **A path that is not a test path** *(sample answer)*: e.g. [3, 4, 6] (a real path, but it does not start in N₀).
- **[1, 3, 6, 7] is not even a path**, because (3, 6) ∉ E.

**Further reading:** [Control Flow Graph (CFG) (GeeksforGeeks)](https://www.geeksforgeeks.org/software-engineering/software-engineering-control-flow-graph-cfg/)

**In conclusion:** three tests give three test paths here, and a plausible-looking sequence is only a path if every step is a real edge.

## Test Requirements, Criteria and Satisfaction

**Process**
1. **Model** the software as a graph.
2. A **criterion** defines **test requirements (TR)**.
3. Tests run; each gives a **test path** in path(T).
4. **Satisfied** if every TR is met.

**Definitions**
- **Test requirement (TR):** a property of test paths in graph G, e.g. "visit node 4" or "tour subpath [2, 4, 5]".
- **Test criterion:** a rule that defines the test requirements for **any** graph.
- **Satisfaction:** T satisfies criterion C on G **iff for every tr in TR, some path in path(T) meets tr**.

**Exercise from the slide**
```java
if (age >= 18) { System.out.println("Adult"); }   // 1 → 2
else           { System.out.println("Minor"); }   // 1 → 3
System.out.println("Done");                       // 4
```
- *(sample solution)* Graph: 1→2, 1→3, 2→4, 3→4. NC/EC need two tests, e.g. age = 20 → [1,2,4] and age = 15 → [1,3,4].

**Two families of criteria**
- **Structural coverage (control flow criteria):** defined only in terms of **nodes, edges and subpaths** (this note, 7.2).
- **Data flow coverage:** the graph is **annotated with variable definitions and uses** (section 7.3).
- A typical TR is met by **visiting** a node or edge or **touring** a path.

**Further reading:** [Test Coverage vs Code Coverage (GeeksforGeeks)](https://www.geeksforgeeks.org/software-engineering/test-coverage-vs-code-coverage/) · [Data Flow Testing (GeeksforGeeks)](https://www.geeksforgeeks.org/software-testing/data-flow-testing/)

**In conclusion:** a criterion turns a graph into test requirements, and a test set is good enough when its test paths meet every one.

## The Ladder of Structural Criteria

| Criterion | TR covers | Note |
|---|---|---|
| **NC** Node | Each node | ≈ statement coverage |
| **EC** Edge | Each edge | ≈ branch coverage |
| **EPC** Edge-pair | Each pair of consecutive edges | How control enters and leaves a node |
| **PPC** Prime path | Each maximal simple path | Practical answer to loops |
| **CPC** Complete path | Every path | Infinite with loops |

- Roughly **increasing strength**, and each step **demands more tests**.
- Also covered: **Specified Path (SPC)**, **Simple Round-Trip (SRTC)** and **Complete Round-Trip (CRTC)** coverage.

**Further reading:** [Structural Software Testing (GeeksforGeeks)](https://www.geeksforgeeks.org/software-engineering/structural-software-testing/) · [Control Structure Testing (GeeksforGeeks)](https://www.geeksforgeeks.org/software-engineering/control-structure-testing/)

**In conclusion:** each step up the ladder covers longer pieces of the graph and costs more tests.

## Node Coverage (NC) and Edge Coverage (EC)

**Node Coverage (NC)**
- **TR contains each reachable node in G.**
- T satisfies NC iff every syntactically reachable node is visited by some path in path(T).
- Example (double diamond): TR = {visit 1, …, visit 7}; p1 = [1, 2, 4, 5, 7] and p2 = [1, 3, 4, 6, 7] → **two tests** satisfy NC.

**Edge Coverage (EC)**
- **TR contains each reachable path of length up to 1 in G** → every edge traversed at least once.
- **Example where NC ≠ EC** (if without else: 1→2, 1→3, 2→3)
  - NC: TR = {1, 2, 3} → one test path [1, 2, 3] is enough.
  - EC: TR = {(1,2), (1,3), (2,3)} → needs [1, 2, 3] **and** [1, 3].
  - With only [1, 2, 3], all nodes are covered but **edge (1,3) is missed**.
- **NC ≈ statement coverage, EC ≈ branch coverage.**
- They differ only when **an edge and another subpath join the same pair of nodes** (e.g. an if without else).

**Why "length up to 1"?**
- A graph with **one node** has no edges. If EC asked only for paths of length exactly 1, it would demand **nothing** there and would **not subsume NC**.
- "Up to 1" includes the length-0 path [1].
- To keep TR sets readable, only the **maximal-length** paths are listed.

**Further reading:** [Statement Coverage Testing (GeeksforGeeks)](https://www.geeksforgeeks.org/software-testing/statement-coverage-testing/) · [Control Flow Software Testing (GeeksforGeeks)](https://www.geeksforgeeks.org/software-testing/control-flow-software-testing/)

**In conclusion:** NC visits every node and EC traverses every edge; EC is slightly stronger and differs from NC when a branch can be skipped.

## Edge-Pair Coverage (EPC)

**Definition:** **TR contains each reachable path of length up to 2, inclusive, in G.**
- Requires pairs of **consecutive edges** (subpaths of length 2).
- Tests how control **enters and leaves** a node.
- "Up to 2" also covers graphs with fewer than two edges.

**Example (slide 32)**
- Graph: initial nodes 1, 2, 3, each with an edge to 4; edges 4→5 and 4→6; final nodes 5 and 6.
- **3 incoming × 2 outgoing** edges at node 4 = **6 requirements**:
  - [1, 4, 5], [1, 4, 6], [2, 4, 5], [2, 4, 6], [3, 4, 5], [3, 4, 6]
- Longer paths are **not** EPC requirements themselves; a longer path simply tours every edge pair inside it. *(Note: the slide's side remark mentions [1,2,4,6], but this graph has no edge (1,2).)*

**Further reading:** [Path Testing in Software Engineering (GeeksforGeeks)](https://www.geeksforgeeks.org/software-engineering/path-testing-in-software-engineering/)

**In conclusion:** EPC checks every way control can pass through a node, one incoming edge combined with one outgoing edge.

## Complete Path and Specified Path Coverage

**Definitions**
- **Complete Path Coverage (CPC):** TR contains **all paths** in G.
- **Specified Path Coverage (SPC):** TR contains a **set S of test paths** supplied as a parameter, e.g. **customer usage scenarios**.

**Examples**
- **No loop** (1→2, 1→3, 2→4, 3→4): two paths, [1, 2, 4] and [1, 3, 4] → CPC is **feasible**.
- **Loop 2→4→5→2:** any number of repetitions → **infinitely many paths** → CPC is **impossible**.

**In conclusion:** CPC is the logical top of the ladder but loops make it infinite, so we either specify the paths (SPC) or use prime paths.

## TRY IT: Apply Four Criteria (Loop Graph)

**Graph:** 1→2, 1→3, 2→3, 3→4, 3→5, 4→7, 5→7, 5→6, 6→5; N₀ = {1}, Nf = {7}. (5 and 6 point at each other, forming a loop.)

**Answer**
- **Node coverage**
  - TR = {1, 2, 3, 4, 5, 6, 7}
  - Test paths: [1, 2, 3, 4, 7], [1, 2, 3, 5, 6, 5, 7]
- **Edge coverage**
  - TR = {(1,2), (1,3), (2,3), (3,4), (3,5), (4,7), (5,6), (5,7), (6,5)} (9 edges)
  - Test paths: [1, 2, 3, 4, 7], [1, 3, 5, 6, 5, 7]
- **Edge-pair coverage**
  - TR = {[1,2,3], [1,3,4], [1,3,5], [2,3,4], [2,3,5], [3,4,7], [3,5,6], [3,5,7], [5,6,5], [6,5,6], [6,5,7]} (11)
  - Test paths: [1,2,3,4,7], [1,2,3,5,7], [1,3,4,7], [1,3,5,6,5,6,5,7]
- **Complete path coverage:** infinitely many paths
  - [1,2,3,4,7], [1,2,3,5,7], [1,2,3,5,6,5,7], [1,2,3,5,6,5,6,5,7], …
- Watch for: forgetting [6, 5] is an edge, which creates the loop 5 → 6 → 5.
- Other correct answers exist: **any** test set that meets every requirement satisfies the criterion.

**In conclusion:** each stronger criterion needs more test paths, and with a loop CPC never ends.

## Handling Loops: Simple and Prime Paths

**The loop problem**
- A graph with a loop has an **infinite** number of paths, so CPC is not feasible.
- Restricting to simple paths limits looping, but deciding how to traverse them is still subjective. *(Slide 36 calls this "SPC (Simple Path Coverage)"; elsewhere in the lecture SPC means Specified Path Coverage.)*

**History of loop testing**

| Era | Approach |
|---|---|
| 1970s | Execute the loop **once** (ad hoc, informal) |
| 1980s | Execute **each loop exactly once** (formalised criteria) |
| 1990s | Execute loops **0 times, once, more than once** (informal) |
| 2000s | **Prime paths**: touring, sidetrips, detours (systematic) |

**Definitions**
- **Simple path:** no node appears more than once, **except** that the first and last may be the same. No internal loops; a **cycle can be simple**.
- **Prime path:** a simple path of **maximal length**: a simple path that is **not a proper subpath of any other simple path**.
  - It cannot contain internal sub-loops or repeated internal nodes.
  - It is a simple path that **cannot be extended** at either end.

**Examples (graph 1→2, 1→3, 2→4, 3→4, 4→1)**
- ✅ [1, 2, 4, 1] is simple (a cycle).
- ❌ [1, 2, 4, 1, 3] repeats node 1, so it is not simple.
- [1, 2] is **simple but not prime**: it is a proper subpath of the simple path [1, 2, 4].

**TRY IT: all simple and prime paths of that graph** → **Answer**

| Length | Simple paths |
|---|---|
| 0 | [1], [2], [3], [4] |
| 1 | [1,2], [1,3], [2,4], [3,4], [4,1] |
| 2 | [1,2,4], [1,3,4], [2,4,1], [3,4,1], [4,1,2], [4,1,3] |
| 3 | **[1,2,4,1], [1,3,4,1], [2,4,1,2], [2,4,1,3], [3,4,1,2], [3,4,1,3], [4,1,2,4], [4,1,3,4]** |

- **23 simple paths** (4 + 5 + 6 + 8); only the **8 of length 3 are prime**.
- Method: list by length, then **delete every path that can be extended** at either end.
- Here prime paths happen to be the longest simple paths, which is **not always** true.

**Further reading:** [Loop Software Testing (GeeksforGeeks)](https://www.geeksforgeeks.org/loop-software-testing/) · [Path Testing in Software Engineering (GeeksforGeeks)](https://www.geeksforgeeks.org/software-engineering/path-testing-in-software-engineering/)

**In conclusion:** prime paths are maximal simple paths, giving a finite set of paths that still handles loops.

## TRY IT: Find the Nine Prime Paths

**Graph:** the loop graph above (1→2, 1→3, 2→3, 3→4, 3→5, 4→7, 5→7, 5→6, 6→5). It has **38 simple paths** but only **9 prime paths**.

**Answer, grouped by what they demand of the loop**
- **Loop skipped (0 times):** [1,2,3,4,7], [1,2,3,5,7], [1,3,4,7], [1,3,5,7]
- **Loop once:** [1,2,3,5,6], [1,3,5,6], [5,6,5], [6,5,7]
- **Loop more than once:** [6,5,6]

**How to find them (slide 42)**
- List simple paths by length 0 → 4.
- Mark paths that **cannot extend forward** (!) and cycles that **return to their start** (\*).
- A path marked ! may still extend **backward**: [2,3,4,7] extends to [1,2,3,4,7], so it is **not** prime.
- Prime = cannot be extended in **either** direction.
- So PPC forces the loop to be **skipped, executed once and executed more than once** (the 1990s idea, now precise).

**In conclusion:** grouping prime paths by loop behaviour shows how PPC tests a loop 0, 1 and many times.

## Prime Path Coverage (PPC)

**Definition:** **TR contains each prime path in G.**
- ✅ Simple, elegant and **finite**.
- ✅ Requires loops to be **executed as well as skipped**.
- ✅ Tours all paths of length 0, 1, … → **subsumes NC and EC**.
- ⚠️ **Almost, but not quite, subsumes EPC.**

**Example (graph 1→2, 2→3, 2→4, 4→5, 5→2; Nf = {3})**
- Prime paths: [1,2,3], [1,2,4,5], [2,4,5,2], [4,5,2,4], [5,2,4,5], [4,5,2,3]
- **Two test paths suffice:** [1,2,3] (skips the loop) and [1,2,4,5,2,4,5,2,3] (goes round twice).

**Why PPC does not subsume EPC: the self-loop exception**
- Graph: 1→2, **2→2** (self-edge), 2→3.
- EPC TR = {[1,2,3], [1,2,2], [2,2,3], [2,2,2]}
- PPC TR = {[1,2,3], [2,2]}
- [1,2,2], [2,2,3] and [2,2,2] **repeat node 2**, so they are not simple and therefore not prime.

**Further reading:** [Basis Path Testing (GeeksforGeeks)](https://www.geeksforgeeks.org/software-engineering/basis-path-testing-in-software-testing/) · [Loop Software Testing (GeeksforGeeks)](https://www.geeksforgeeks.org/loop-software-testing/)

**In conclusion:** PPC is finite, loop-aware and stronger than NC and EC, with one exception: a node with a self-edge.

## Touring with Sidetrips and Detours

**Target prime path:** q = [1, 2, 3, 5, 6] (graph also has 3→4, 4→3 and 4→5)

| Kind | Example p | Rule |
|---|---|---|
| **Tour** | [1, 2, 3, 5, 6] | p tours q if q is a **subpath** of p |
| **Tour with sidetrips** | [1, 2, 3, **4, 3**, 5, 6] | Every **edge** of q is in p in the same order; p may leave q and **come back to the same node** |
| **Tour with detours** | [1, 2, 3, **4**, 5, 6] | Every **node** of q is in p in the same order; p may leave q at ni and **rejoin at a successor** of ni |

- Sidetrip: leaves node 3 and returns to node 3.
- Detour: leaves node 3 and rejoins at node 5 (a successor of 3), so edge (3,5) is skipped.

**Infeasible requirements**
- An **infeasible** test requirement **cannot be satisfied**:
  - unreachable statement (**dead code**);
  - a subpath that needs a **contradiction**, e.g. x > 0 and x < 0.
- Most criteria have some infeasible requirements; in general it is **undecidable** whether all requirements are feasible.
- **Best-effort touring:**
  1. Satisfy as many requirements as possible **without sidetrips**.
  2. **Allow sidetrips** to try to satisfy the rest.
- Trade-off: no sidetrips → more infeasible requirements; always allowing them → **weaker** criteria (more executions accepted as satisfying a requirement).

**Further reading:** [Unreachable Code Error in Java (GeeksforGeeks)](https://www.geeksforgeeks.org/java/unreachable-code-error-in-java/) · [Control Flow Software Testing (GeeksforGeeks)](https://www.geeksforgeeks.org/software-testing/control-flow-software-testing/)

**In conclusion:** sidetrips return to the same node and detours rejoin at a successor, and best-effort touring uses sidetrips only when a direct tour is impossible.

## Round Trips (SRTC and CRTC)

**Definitions**
- **Round-trip path:** a **prime path that starts and ends at the same node** (a cycle or loop).
- **SRTC (Simple Round-Trip Coverage):** at least **one** round-trip path for **each node that can start a round trip**.
- **CRTC (Complete Round-Trip Coverage):** **all** round-trip paths for each such node.

**Example (graph 1→2, 1→3, 2→4, 3→4, 4→1)**
- Round trips: [1,2,4,1], [1,3,4,1], [2,4,1,2], [3,4,1,3], [4,1,2,4], [4,1,3,4]
- **SRTC** needs one per node: **4 paths**. **CRTC** needs all **6**.

**Subsumption warning**
- Round-trip criteria focus only on loops, so they **ignore** nodes and edges outside round trips (straight-line entry or exit paths).
- So they do **not subsume NC, EC or EPC**.

**In conclusion:** SRTC and CRTC check the loops of a graph, one or all round trips per node, but say nothing about non-loop parts.

## Subsumption: How Criteria Relate

**Definition:** A **subsumes** B when every test set that satisfies A also satisfies B.

**The hierarchy (arrows mean "subsumes")**
- **CPC → PPC**
- **PPC → EPC** (*almost*: the self-loop exception) **→ EC → NC**
- **PPC → CRTC → SRTC**
- **PPC → ADUP** (All-DU-paths) **→ AUC** (All-uses) **→ ADC** (All-defs) *(data flow, section 7.3)*
- **AUC → EC**

**Criteria cheat sheet**

| Criterion | Test requirements (TR) | Remember |
|---|---|---|
| NC | Each reachable node | Statement coverage |
| EC | Each reachable path of length ≤ 1 | Branch coverage |
| EPC | Each reachable path of length ≤ 2 | Pairs of consecutive edges |
| CPC | All paths in G | Infinite when there are loops |
| SPC | A given set S of paths | Tester or customer scenarios |
| PPC | Each prime path | Loops skipped, once, many |
| SRTC | One round trip per node that has one | Misses nodes outside round trips |
| CRTC | All round-trip paths per node that has one | Misses nodes outside round trips |

**Summary messages**
- Graphs are a **powerful abstraction** for designing tests.
- Criteria let you **trade test effort against thoroughness**: weaker criteria are cheap but miss behaviour; stronger ones cost more tests.
- 7.1–7.2 sit at the **design abstraction level** (Chapter 2).
- Graphs arise from **code, designs, specs and use cases**.

**Further reading:** [Structural Software Testing (GeeksforGeeks)](https://www.geeksforgeeks.org/software-engineering/structural-software-testing/) · [Software Testing Techniques (GeeksforGeeks)](https://www.geeksforgeeks.org/software-testing/software-testing-techniques/)

**In conclusion:** CPC is the strongest and NC the weakest, PPC is the practical, finite middle ground, and round-trip criteria form a separate branch.

## Self-test

<details><summary>Q1. Why must N₀ and Nf be non-empty? Can E be empty?</summary>

Every test starts at an initial node and ends at a final node, so neither can be empty. E **can** be empty: a single node with no edges is a valid graph, and it is its own initial and final node.

</details>

<details><summary>Q2. What makes a path a test path? Is [4, 8] a test path in the 10-node graph?</summary>

It must start in N₀ and end in Nf. [4, 8] is a path, but 4 ∉ N₀, so it is **not** a test path.

</details>

<details><summary>Q3. Syntactic vs semantic reachability?</summary>

Syntactic: a path exists in the graph. Semantic: some input actually executes that path. A node can be syntactically reachable but not semantically reachable (infeasible).

</details>

<details><summary>Q4. When do NC and EC need different test sets? Give an example.</summary>

When an edge and another subpath join the same nodes, e.g. an if without else (1→2, 1→3, 2→3). [1,2,3] covers every node but misses edge (1,3), so EC also needs [1,3].

</details>

<details><summary>Q5. Why does EC say "length up to 1" and EPC "up to 2"?</summary>

So they still demand something on graphs with fewer edges. A one-node graph has no edges, so "exactly 1" would demand nothing and EC would not subsume NC. The same applies to EPC on a one-edge graph.

</details>

<details><summary>Q6. A node has 3 incoming and 2 outgoing edges. How many EPC requirements pass through it?</summary>

3 × 2 = **6**.

</details>

<details><summary>Q7. Why is CPC infeasible with loops? What are the alternatives?</summary>

A loop gives infinitely many paths. The alternatives are **SPC** (a specified set of paths, e.g. customer scenarios) or **PPC** (prime paths).

</details>

<details><summary>Q8. Define simple path and prime path. Why is [1,2] not prime in the graph 1→2, 1→3, 2→4, 3→4, 4→1?</summary>

A simple path has no repeated node except possibly first = last. A prime path is a simple path that is not a proper subpath of any other simple path. [1,2] is a proper subpath of the simple path [1,2,4].

</details>

<details><summary>Q9. How does PPC treat loops?</summary>

Its prime paths force each loop to be **skipped**, **executed once** and **executed more than once** (e.g. [1,3,5,7], [5,6,5], [6,5,6]).

</details>

<details><summary>Q10. Why does PPC not fully subsume EPC?</summary>

With a self-edge (2→2), EPC needs [1,2,2], [2,2,3] and [2,2,2]. These repeat node 2, so they aren't simple and can't be prime. PPC only asks for [1,2,3] and [2,2].

</details>

<details><summary>Q11. How does a sidetrip differ from a detour?</summary>

A **sidetrip** leaves q and returns to the **same node** (every edge of q still appears in order). A **detour** leaves at ni and rejoins at a **successor** of ni (every node of q appears in order, but an edge is skipped).

</details>

<details><summary>Q12. Do SRTC and CRTC subsume NC? How many SRTC and CRTC paths does the graph 1→2, 1→3, 2→4, 3→4, 4→1 need?</summary>

No. Round-trip criteria ignore nodes and edges outside round trips. That graph needs **4** paths for SRTC (one per node) and **6** for CRTC (all round trips).

</details>

<details><summary>Q13. List the double-diamond test paths and give a minimal NC test set.</summary>

[1,2,4,5,7], [1,2,4,6,7], [1,3,4,5,7], [1,3,4,6,7]. For NC: {[1,2,4,5,7], [1,3,4,6,7]}.

</details>
