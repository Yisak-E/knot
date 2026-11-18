---
title: "Ch 7.3 — Graph Coverage for Source Code"
summary: Building control flow graphs (CFGs) from Java code: nodes, edges and basic blocks; if, if-else and if-return; while, for and do-while loops with dummy nodes; break, continue, switch with fall-through and try-catch exceptions; then EC, EPC and PPC test requirements and test paths for the computeStats example.
tags: [chapter-7, cfg, control-flow-graph, basic-block, statement-coverage, branch-coverage, prime-paths]
sort: 6
---

*Lecture 7 Part 2 (Ammann & Offutt, section 7.3). Covers all 21 slides and speaker notes. Each "Try it: draw the graph" slide is answered with its node list and edges.*

## From Source Code to Coverage

**Definition:** most graph coverage criteria were **developed for source code**. Each general idea from 7.1–7.2 has a concrete meaning in a program.

| Graph concept | In source code |
|---|---|
| Graph | Usually the **control flow graph (CFG)** |
| Node coverage | Execute **every statement** |
| Edge coverage | Execute **every branch** |
| Loops | for, while and do loops need **extra structure** in the graph |
| Data flow coverage | Augment the CFG with **defs** (A = 5;) and **uses** (Y = A + 1;) |

- **Def:** a place where a variable **gets a value**. **Use:** a place where that value is **read**.
- The details vary between languages, but the pattern is the same. The **first step** in applying any graph criterion is to **define the graph**.

**Further reading:** [Control Flow Graph (CFG) (GeeksforGeeks)](https://www.geeksforgeeks.org/software-engineering/software-engineering-control-flow-graph-cfg/) · [Data Flow Testing (GeeksforGeeks)](https://www.geeksforgeeks.org/software-testing/data-flow-testing/)

**In conclusion:** for source code the graph is the CFG, node coverage means every statement and edge coverage means every branch.

## Control Flow Graph Building Blocks

**Three building blocks**
1. **Nodes:** a statement, or a sequence of statements called a **basic block**.
2. **Edges:** **transfers of control**: every possible branch in the program.
3. **Basic block:** **one entry, one exit, no branches**. If the first statement runs, they all run.

**Example: three statements, one node**
```java
a = 1;
b = a + 2;
c = b * 3;   // all three form node 1
```

- A **node** is a graph concept; a **basic block** is a code concept.
- A basic block is a **maximal** sequence of statements such that if any one executes, all of them execute.
- CFGs can also be annotated with **branch predicates, defs and uses**.

**Further reading:** [Flow Graph in Code Generation (basic blocks) (GeeksforGeeks)](https://www.geeksforgeeks.org/compiler-design/flow-graph-in-code-generation/) · [Control Flow Graph (CFG) (GeeksforGeeks)](https://www.geeksforgeeks.org/software-engineering/software-engineering-control-flow-graph-cfg/)

**In conclusion:** a CFG uses basic blocks as nodes and possible transfers of control as edges.

## CFGs for Selection: if, if-else and if-return

### if-else
```java
if (x < y) { y = 0; x = x + 1; }
else       { x = y; }
```
- **Nodes:** 1 = decision (x < y), 2 = `y = 0; x = x + 1;`, 3 = `x = y;`, 4 = join.
- **Edges:** 1→2 (x < y), 1→3 (x >= y), 2→4, 3→4.
- The if-else gives **two basic blocks** (2 and 3), a **decision node** (1) and a **join node** (4).

### if without else
```java
if (x < y) { y = 0; x = x + 1; }
```
- **Nodes:** 1 = decision, 2 = `y = 0; x = x + 1;`, 3 = after the if.
- **Edges:** 1→2 (x < y), 1→3 (x >= y), 2→3.
- A test with x < y **visits every node but not every edge**: edge **1→3 is missed**. This is why EC is stronger than NC.

### if-return
```java
if (x < y) { return; }
print (x);
return;
```
- **Nodes:** 1 = decision, 2 = `return;`, 3 = `print (x); return;`
- **Edges:** 1→2 (x < y), 1→3 (x >= y).
- A **return** ends the method, so node 2 is a **final node with no outgoing edge**. There is **no edge 2→3**.
- Nodes 2 and 3 are **both final nodes**; the return nodes must be **distinct**.

**Further reading:** [Decision Making in Java (if, else, switch, break, continue) (GeeksforGeeks)](https://www.geeksforgeeks.org/java/decision-making-javaif-else-switch-break-continue-jump/) · [Control Structure Testing (GeeksforGeeks)](https://www.geeksforgeeks.org/software-engineering/control-structure-testing/)

**In conclusion:** each decision becomes a node with one outgoing edge per outcome, and a return creates a final node with no outgoing edge.

## Representing Loops

**Two kinds of nodes**
1. **Statement nodes:** come from statements or basic blocks in the source.
2. **Extra (dummy) nodes:** hold **no statement**. They give a loop edge somewhere to go and represent the **decision**.

### while loop
```java
x = 0;
while (x < y) { y = f (x, y); x = x + 1; }
return (x);
```
- **Nodes:** 1 = `x = 0;`, 2 = **dummy node** (loop test x < y), 3 = `y = f(x, y); x = x + 1;`, 4 = `return (x);`
- **Edges:** 1→2, 2→3 (x < y), **3→2** (iteration), 2→4 (x >= y).
- ⚠️ **Common mistake:** sending the loop edge back to **node 1** would re-run `x = 0` on every iteration.
- The call f(x, y) is not expanded here.

### for loop
```java
for (x = 0; x < y; x++) { y = f (x, y); }
return (x);
```
- **Nodes:** 1 = `x = 0` (implicit initialisation), 2 = test x < y, 3 = `y = f(x, y)`, 4 = `x = x + 1` (implicit increment), 5 = `return (x)`.
- **Edges:** 1→2, 2→3 (x < y), 3→4, **4→2**, 2→5 (x >= y).
- Initialisation, test and increment share **one line of code** but become **three different nodes**.

### do-while loop
```java
x = 0;
do { y = f (x, y); x = x + 1; } while (x < y);
return (y);
```
- **Nodes:** 1 = `x = 0;`, 2 = body `y = f(x, y); x = x + 1;` (with the test), 3 = `return (y);`
- **Edges:** 1→2, **2→2** (self-edge, x < y), 2→3 (x >= y).
- The test comes **after** the body, so the body **always runs at least once**.

| Loop | Nodes | Back edge | Key point |
|---|---|---|---|
| while | 4 | 3→2 to the dummy test node | Test before the body |
| for | 5 | 4→2 from the increment node | Init, test, increment = 3 nodes |
| do-while | 3 | 2→2 self-edge | Body runs at least once |

**Further reading:** [Loop Software Testing (GeeksforGeeks)](https://www.geeksforgeeks.org/loop-software-testing/) · [Control Flow Software Testing (GeeksforGeeks)](https://www.geeksforgeeks.org/software-testing/control-flow-software-testing/)

**In conclusion:** loops need a decision node that the back edge returns to; never send the back edge to the initialisation.

## break and continue

```java
x = 0;
while (x < y) {
    y = f(x, y);
    if (y == 0) { break; }
    if (y < 0)  { y = -2 * y; continue; }
    x = x + 1;
}
return (y);
```

**Graph (blocks from the slide figure)**
- **B1** entry `x = 0` → **B2** loop test `x < y?`
- B2 **true** → **B3** `y = f(x, y)` → **B4** test `y == 0?`
  - B4 **true** → **B5** `break` → **B9** `return y` (exit the loop).
  - B4 **false** → **B6** test `y < 0?`
    - B6 **true** → **B7** `y = -2 * y; continue` → back to **B2** (loop test).
    - B6 **false** → **B8** `x = x + 1` → back to **B2**.
- B2 **false** → **B9** `return y`.

**Rules**
- **break** jumps **out of the loop** to the statement after it (edge to the return).
- **continue** jumps **back to the loop test** (edge to B2).
- Both create **extra edges**.

**Further reading:** [Java Break Statement (GeeksforGeeks)](https://www.geeksforgeeks.org/java/break-statement-in-java/) · [Decision Making in Java (GeeksforGeeks)](https://www.geeksforgeeks.org/java/decision-making-javaif-else-switch-break-continue-jump/)

**In conclusion:** break adds an edge out of the loop and continue adds an edge back to the loop test.

## The switch Structure

```java
read (c);
switch (c) {
    case 'N': z = 25;           // no break → falls through
    case 'Y': x = 50; break;
    default:  x = 0;  break;
}
print (x);
```

- **Nodes:** 1 = `read (c)`, 2 = `z = 25;`, 3 = `x = 50;`, 4 = `x = 0;`, 5 = `print (x);`
- **Edges:**
  - 1→2 (c == 'N'), 1→3 (c == 'Y'), 1→4 (default)
  - **2→3 (fall through)**, because case 'N' has no break
  - 3→5 (break), 4→5 (break)
- A switch can be graphed as **one node with multi-way branching** or as a **series of if-then-else** structures.
- Cases **without a break fall through** to the next case.

**Further reading:** [Switch Statements in Java (GeeksforGeeks)](https://www.geeksforgeeks.org/java/switch-statement-in-java/)

**In conclusion:** a switch is a multi-way branch, and a missing break adds a fall-through edge into the next case.

## Exceptions (try-catch)

```java
// reads one line from a BufferedReader and checks its length is 1–96
try {
    s = br.readLine();
    if (s.length() > 96) throw new Exception ("too long");
    if (s.length() == 0) throw new Exception ("too short");
} catch (IOException e) {
    e.printStackTrace();
} catch (Exception e) {
    e.getMessage();
}
return (s);
```

- **Nodes:** 1 = `s = br.readLine()`, 2 = `e.printStackTrace()`, 3 = test len > 96, 4 = throw "too long", 5 = test len == 0, 6 = `e.getMessage()`, 7 = throw "too short", 8 = `return (s)`.
- **Edges:**
  - 1→2 (**IOException** from readLine), 1→3
  - 3→4 (len > 96), 3→5 (len <= 96)
  - 5→7 (len == 0), 5→8 (len != 0)
  - 4→6 and 7→6 (thrown Exception caught by the **Exception** handler)
  - 2→8 and 6→8
- **Rule:** every statement that **can throw** gets an edge to the **matching catch block**.

**Further reading:** [Java Try Catch Block (GeeksforGeeks)](https://www.geeksforgeeks.org/java/java-try-catch-block/) · [Flow Control in try-catch-finally (GeeksforGeeks)](https://www.geeksforgeeks.org/java/flow-control-in-try-catch-finally-in-java/) · [Java Exception Handling (GeeksforGeeks)](https://www.geeksforgeeks.org/java/exceptions-in-java/)

**In conclusion:** exceptions add edges from every statement that can throw to the catch block that handles it.

## Visual Guide: DataProcessor Example

```java
public void processData(List<String> items) {
    int count = 0;
    for (String item : items) {
        if (item.startsWith("A"))      { System.out.println("Processing A: " + item); count++; }
        else if (item.startsWith("B")) { System.out.println("Processing B: " + item); count += 2; }
        else                           { System.out.println("Skipping: " + item); }
    }
    if (count > 10) { System.out.println("High activity"); }
    else            { System.out.println("Low activity"); }
}
```

**CFG blocks (from the slide figure)**
- **B1** entry `count = 0` → **B2** loop test "more items?"
- B2 **yes** → **B3** test `startsWith("A")?`
  - true → **B4** print A, `count++` → back to B2.
  - false → **B5** test `startsWith("B")?`
    - true → **B6** print B, `count += 2` → back to B2.
    - false → **B7** print "Skipping" → back to B2.
- B2 **no more items** → **B8** test `count > 10?`
  - true → **B9** "High activity"; false → **B10** "Low activity".
- B9 and B10 → **B11** exit.
- **11 blocks**: an enhanced for loop with an if / else-if / else inside, then an if-else after the loop.

**Further reading:** [Control Flow Graph (CFG) (GeeksforGeeks)](https://www.geeksforgeeks.org/software-engineering/software-engineering-control-flow-graph-cfg/) · [Basis Path Testing (GeeksforGeeks)](https://www.geeksforgeeks.org/software-engineering/basis-path-testing-in-software-testing/)

**In conclusion:** combining the loop, if-else-if and if-else patterns gives an 11-block CFG where every branch inside the loop returns to the loop test.

## Coverage Criteria on Source Code: Only the Names Change

| Graph criterion (7.1–7.2) | Name on source code |
|---|---|
| Node Coverage | **Statement Coverage** / **Basic Block Coverage** |
| Edge Coverage | **Branch Coverage** |

- The criteria from 7.1 and 7.2 apply **directly** to CFGs.

**Further reading:** [Statement Coverage Testing (GeeksforGeeks)](https://www.geeksforgeeks.org/software-testing/statement-coverage-testing/) · [Test Coverage vs Code Coverage (GeeksforGeeks)](https://www.geeksforgeeks.org/software-engineering/test-coverage-vs-code-coverage/)

**In conclusion:** on source code, node coverage is statement (basic block) coverage and edge coverage is branch coverage.

## Worked Example: computeStats

```java
public static void computeStats (int [] numbers) {
    int length = numbers.length;
    double med, var, sd, mean, sum, varsum;
    sum = 0;
    for (int i = 0; i < length; i++) { sum += numbers [i]; }
    med  = numbers [length / 2];
    mean = sum / (double) length;
    varsum = 0;
    for (int i = 0; i < length; i++) {
        varsum += (numbers [i] - mean) * (numbers [i] - mean);
    }
    var = varsum / (length - 1.0);
    sd  = Math.sqrt (var);
    // print length, mean, median, variance, sd
}
```

- Computes **length**, **mean** (average), **median** (middle of sorted data), **variance** (spread) and **standard deviation** (square root of variance).

**The CFG (8 nodes)**

| Node | What it holds |
|---|---|
| 1 | `length = numbers.length; sum = 0;` |
| 2 | `i = 0` |
| 3 | `i < length ?` (loop test) |
| 4 | `sum += numbers[i]; i++` |
| 5 | `med = ...; mean = ...; varsum = 0; i = 0` |
| 6 | `i < length ?` (loop test) |
| 7 | `varsum += ...; i++` |
| 8 | `var = ...; sd = ...;` print results (exit) |

- **Edges (9):** 1→2, 2→3, 3→4, 4→3, 3→5, 5→6, 6→7, 7→6, 6→8.
- Nodes 3 and 6 are the **loop tests**; node 8 is the **exit**.
- Tools that give every statement its own node give the **same coverage**; only the bookkeeping differs.

### Edge Coverage
- **TRs (9, one per edge):** A [1,2], B [2,3], C [3,4], D [3,5], E [4,3], F [5,6], G [6,7], H [6,8], I [7,6]
- **One test path tours all edges:** **[1, 2, 3, 4, 3, 5, 6, 7, 6, 8]** → EC needs just **one test** here.

### Edge-Pair Coverage
- **TRs (12):** A [1,2,3], B [2,3,4], C [2,3,5], D [3,4,3], E [3,5,6], F [4,3,5], G [5,6,7], H [5,6,8], I [6,7,6], J [7,6,8], K [4,3,4], L [7,6,7]

| TP | Path | TRs toured | Via sidetrips |
|---|---|---|---|
| i | [1,2,3,4,3,5,6,7,6,8] | A B D E F G I J | C H |
| ii | [1,2,3,5,6,8] | A C E H | none |
| iii | [1,2,3,4,3,4,3,5,6,7,6,7,6,8] | A B D E F G I J K L | C H |

- **TP iii makes TP i redundant.** A **minimal** set of test paths is cheaper: {ii, iii} covers all 12.
- K [4,3,4] and L [7,6,7] need each loop to run **at least twice**.

### Prime Path Coverage
- **TRs (10 prime paths):** A [3,4,3], B [4,3,4], C [7,6,7], D [7,6,8], E [6,7,6], F [1,2,3,4], G [4,3,5,6,7], H [4,3,5,6,8], I [1,2,3,5,6,7], J [1,2,3,5,6,8]

| TP | Path | TRs toured | Via sidetrips |
|---|---|---|---|
| i | [1,2,3,4,3,5,6,7,6,8] | A D E F G | H I J |
| ii | [1,2,3,4,3,4,3,5,6,7,6,7,6,8] | A B C D E F G | H I J |
| iii | [1,2,3,4,3,5,6,8] | A F H | J |
| iv | [1,2,3,5,6,7,6,8] | D E I | J |
| v | [1,2,3,5,6,8] | J | none |

- **TP ii makes TP i redundant.** TPs iii, iv and v tour **H, I and J directly** instead of by sidetrip. So {ii, iii, iv, v} tours all 10 directly.
- *Correction noted on the slide:* the original slide listed F as toured by path iv, which is impossible (F = [1,2,3,4] needs node 4, and path iv never visits 4).
- ⚠️ **Feasibility** *(general knowledge)*: TP v [1,2,3,5,6,8] skips both loops, which means length = 0. The code then reads numbers[0] on an empty array, so the program throws an exception and that path can't actually run to node 8. Watch for infeasible paths like this in real code.

**Further reading:** [Path Testing in Software Engineering (GeeksforGeeks)](https://www.geeksforgeeks.org/software-engineering/path-testing-in-software-engineering/) · [Basis Path Testing (GeeksforGeeks)](https://www.geeksforgeeks.org/software-engineering/basis-path-testing-in-software-testing/) · [Loop Software Testing (GeeksforGeeks)](https://www.geeksforgeeks.org/loop-software-testing/)

**In conclusion:** on computeStats, EC needs one test, EPC adds loop pairs that need two iterations, and PPC needs paths that skip each loop, run it once and run it more than once.

## Summary

1. **Direct application:** graph criteria apply to CFGs almost unchanged; most of the research on graph criteria was done with CFGs.
2. **Subtle decisions:** translating control structures needs a few choices: **dummy nodes, breaks, fall-through and exceptions**.
3. **Basic blocks:** some tools give each statement its own node; the book uses basic blocks. **Coverage is the same**; only the bookkeeping differs.

**Quick reference: control structure → CFG shape**

| Structure | Shape |
|---|---|
| if-else | Decision → two blocks → join |
| if (no else) | Decision → block → join, plus a direct edge decision → join |
| if-return | Decision → return node (final, no out-edge) and the rest |
| while | Init → dummy test ⇄ body; test → exit |
| for | Init → test → body → increment → test; test → exit |
| do-while | Init → body with self-edge → exit |
| break / continue | Edge out of the loop / edge back to the loop test |
| switch | Multi-way branch; missing break = fall-through edge |
| try-catch | Edge from each throwing statement to its catch block |

**In conclusion:** to test source code with graph criteria, first draw the CFG correctly from these patterns, then apply EC, EPC or PPC exactly as in 7.2.

## Self-test

<details><summary>Q1. What is a basic block, and how does it relate to a node?</summary>

A maximal sequence of statements with one entry, one exit and no branches: if the first statement runs, they all run. A basic block is a code concept, and in the CFG each basic block becomes one node.

</details>

<details><summary>Q2. Draw the CFG for if (x < y) { y = 0; x = x + 1; } with no else. Which edge does a test with x < y miss?</summary>

Nodes 1 (decision), 2 (body), 3 (after). Edges 1→2, 1→3, 2→3. A test with x < y visits every node but misses edge **1→3**.

</details>

<details><summary>Q3. In the if-return CFG, why is there no edge from node 2 to node 3?</summary>

Node 2 holds `return;`, which ends the method. It is a final node with no outgoing edge, and the two return nodes are distinct.

</details>

<details><summary>Q4. Why does a while loop need a dummy node, and what is the common mistake?</summary>

The dummy node holds the loop test and gives the back edge (3→2) somewhere to go. The common mistake is sending the back edge to node 1, which would re-run the initialisation (x = 0) on every iteration.

</details>

<details><summary>Q5. How many nodes does a for loop need, and why?</summary>

Five: init (x = 0), test (x < y), body, increment (x = x + 1) and the exit statement. Init, test and increment share one line of code but are different nodes.

</details>

<details><summary>Q6. How does a do-while CFG differ from a while CFG?</summary>

The test comes after the body, so the body always runs at least once. The graph is init → body with a **self-edge** → exit (3 nodes).

</details>

<details><summary>Q7. Where do break and continue send control?</summary>

**break** goes out of the loop to the statement after it (here, the return). **continue** goes back to the loop test.

</details>

<details><summary>Q8. In the switch example, why is there an edge from z = 25 to x = 50?</summary>

case 'N' has no break, so control **falls through** into case 'Y'.

</details>

<details><summary>Q9. In the try-catch example, which nodes have edges to the Exception handler (node 6)?</summary>

The two throw nodes, 4 ("too long") and 7 ("too short"). readLine (node 1) has an edge to the IOException handler, node 2.

</details>

<details><summary>Q10. For computeStats, how many EC and EPC requirements are there, and what single test path satisfies EC?</summary>

EC: **9** (one per edge). EPC: **12**. One path covers all 9 edges: [1,2,3,4,3,5,6,7,6,8].

</details>

<details><summary>Q11. Why does TP iii make TP i redundant for EPC?</summary>

TP iii [1,2,3,4,3,4,3,5,6,7,6,7,6,8] tours everything TP i tours (A B D E F G I J) plus K [4,3,4] and L [7,6,7]. Removing TP i loses nothing, and a minimal test set is cheaper.

</details>

<details><summary>Q12. Name the 10 prime paths of computeStats. Why can't TP iv tour F?</summary>

[3,4,3], [4,3,4], [7,6,7], [7,6,8], [6,7,6], [1,2,3,4], [4,3,5,6,7], [4,3,5,6,8], [1,2,3,5,6,7], [1,2,3,5,6,8]. F = [1,2,3,4] needs node 4, and TP iv [1,2,3,5,6,7,6,8] never visits node 4.

</details>

<details><summary>Q13. Node coverage and edge coverage are called what on source code?</summary>

Node coverage = **statement coverage** (or basic block coverage). Edge coverage = **branch coverage**.

</details>
