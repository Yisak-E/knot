---
title: "Ch 6 — Access Control"
summary: Access control definitions and context (authentication, authorization, audit), subjects, objects and access rights, DAC with the access matrix, ACLs, capability tickets and authorization tables, the Lampson–Graham–Denning model and rules R1–R8, UNIX file permissions, MAC, RBAC (RBAC0–RBAC3, hierarchies, constraints), ABAC, ICAM, identity federation and the bank RBAC case study.
tags: [chapter-6, access-control, dac, mac, rbac, abac, icam]
sort: 6
---

*Covers all 38 slides and their speaker notes. The lecture uses the textbook's Chapter 4 figures (Figure 4.1–4.13, Tables 4.2–4.5). Points marked (general knowledge) go beyond the slides.*

## What Access Control Is

**Definition:** access control is a **central element of computer security**. It decides who may use which resources and how.

**Two formal definitions**
- **NISTIR 7298:** "the process of granting or denying specific requests to (1) obtain and use information and related information processing services; and (2) enter specific physical facilities."
- **RFC 4949:** "a process by which use of system resources is regulated according to a security policy and is permitted only by authorized entities (users, programs, processes, or other systems) according to that policy."

**The three objectives of computer security that access control serves**
1. **Prevent unauthorized users** from gaining access to resources.
2. **Prevent legitimate users** from accessing resources **in an unauthorized manner**.
3. **Enable legitimate users** to access resources **in an authorized manner**.

- Note: access control covers both **logical** access (information, services) and **physical** access (entering facilities).

**Further reading:** [Access Control and Its Types (GeeksforGeeks)](https://www.geeksforgeeks.org/ethical-hacking/access-control-and-its-types/) · [Access Control in Computer Network (GeeksforGeeks)](https://www.geeksforgeeks.org/computer-networks/access-control-in-computer-network/)

**In conclusion:** access control regulates the use of resources according to a security policy, keeping out unauthorized users and limiting legitimate users to what they are allowed to do.

## The Access Control Context (Figure 4.1)

**The flow of a request**
- **User** → **authentication function** → **access control function** → **system resources**.
- A **security administrator** maintains the **authorization database**.
- An **auditing** function watches the whole process.

**The related functions**
- **Authentication:** verifying that the **credentials** of a user or other system entity are **valid**.
  - Decides whether the user may access the **system at all**.
- **Authorization:** **granting a right or permission** to a system entity to access a resource.
  - Determines **who is trusted for a given purpose**.
- **Access control:** decides whether a **specific requested access** by this (authenticated) user is permitted, by **consulting the authorization database**.
- **Audit:** an independent review of system records and activities to:
  - test whether system controls are adequate;
  - ensure compliance with policy and operational procedures;
  - detect security breaches;
  - recommend changes in control, policy and procedures.

**Where the access control function lives**
- Shown as one logical module, but in practice **several components share it**:
  - **operating systems** (all have at least a basic access control component);
  - **add-on security packages**;
  - **applications** such as a database management system;
  - **external devices** such as **firewalls**.
- It mediates between users (or processes acting for them) and resources: applications, operating systems, firewalls, routers, files, databases.

**Further reading:** [Authentication vs Authorization (GeeksforGeeks)](https://www.geeksforgeeks.org/computer-networks/difference-between-authentication-and-authorization/) · [Access Control in Computer Network (GeeksforGeeks)](https://www.geeksforgeeks.org/computer-networks/access-control-in-computer-network/)

**In conclusion:** authentication answers "who are you?", access control answers "may you do this?", and audit records and reviews what happened.

## The Four Access Control Policies

**Definition:** an **access control policy**, stored in an **authorization database**, dictates **what types of access** are permitted, **under what circumstances**, and **by whom**.

| Policy | Controls access based on | Why it has this name / key idea |
|---|---|---|
| **DAC** (Discretionary) | The **identity** of the requestor + **access rules** saying what requestors may or may not do | "Discretionary": an entity may, **by its own volition**, let another entity access a resource |
| **MAC** (Mandatory) | Comparing **security labels** (how sensitive a resource is) with **security clearances** (what an entity is eligible to access) | "Mandatory": an entity with clearance **cannot**, by its own volition, let another entity access the resource |
| **RBAC** (Role-based) | The **roles** users have in the system + rules saying what accesses each role allows | Rights belong to **job functions**, not individuals |
| **ABAC** (Attribute-based) | **Attributes** of the user, the resource, and current **environment conditions** | Most flexible and expressive |

- **DAC** is the traditional method.
- **MAC** grew out of **military** information security requirements.
- **RBAC and ABAC** have become increasingly popular.
- The policies are **not mutually exclusive**: one mechanism can use several of them for different classes of resources.

**Example levels (speaker notes)**
- Security levels (labels): Top Secret, Secret, Confidential, Unclassified.
- Clearance levels: No Clearance, Confidential, Secret, Top Secret.

**Further reading:** [Access Control and Its Types (GeeksforGeeks)](https://www.geeksforgeeks.org/ethical-hacking/access-control-and-its-types/) · [Difference Between DAC and MAC (GeeksforGeeks)](https://www.geeksforgeeks.org/computer-networks/difference-between-dac-and-mac/)

**In conclusion:** DAC uses identity and owner discretion, MAC uses labels and clearances, RBAC uses roles and ABAC uses attributes, and a system may combine them.

## Subjects, Objects and Access Rights

**The three basic elements of access control**

**1. Subject:** an entity **capable of accessing objects**.
- In practice a subject is a **process** acting for a user or application; the process takes on the user's attributes, such as access rights.
- Subjects are held **accountable**; an **audit trail** may record their security-relevant actions.
- Three classes of subject, with different rights:
  - **Owner:** the creator of a resource (e.g. a file); for system resources, a system administrator; for project resources, a project leader.
  - **Group:** a named group of users; membership is enough to use the group's rights. A user may belong to **several groups**.
  - **World:** everyone else who can access the system; gets the **least** access.

**2. Object:** a **resource to which access is controlled**, used to contain and/or receive information.
- Examples: records, blocks, pages, segments, files, portions of files, directories, directory trees, mailboxes, messages, programs.
- Some systems also include: bits, bytes, words, processors, communication ports, clocks, network nodes.
- How many objects to protect depends on the trade-off between **security** and **complexity, processing burden and ease of use**.

**3. Access right:** the **way** a subject may access an object.
- **Read:** view information; **includes the ability to copy or print**.
- **Write:** add, modify or delete data; **includes read access**.
- **Execute:** run specified programs.
- **Delete:** delete resources such as files or records.
- **Create:** create new files, records or fields.
- **Search:** list the files in a directory or otherwise search it.
- **Own** (Figure 4.2 notes): full control, including changing permissions, deleting the resource, and granting or revoking access for others.

**Further reading:** [Access Matrix in Operating System (GeeksforGeeks)](https://www.geeksforgeeks.org/access-matrix-in-operating-system/) · [Access Control and Its Types (GeeksforGeeks)](https://www.geeksforgeeks.org/ethical-hacking/access-control-and-its-types/)

**In conclusion:** every access control decision answers one question: may this **subject** perform this **access right** on this **object**?

## Discretionary Access Control (DAC) and the Access Matrix

**Definition:** DAC is a scheme where an entity may be granted access rights that let it, **by its own discretion**, enable another entity to access a resource.

**The access matrix** (concept by **Lampson**, refined by **Graham and Denning** and by **Harrison et al.**)
- **One dimension:** the **subjects** (users, groups, or also terminals, hosts, applications).
- **Other dimension:** the **objects** (from single data fields up to records, files or a whole database).
- **Each entry:** the access rights of that subject for that object.

**Example: Figure 4.2(a) access matrix**

| | File 1 | File 2 | File 3 | File 4 |
|---|---|---|---|---|
| **User A** | Own, Read, Write | — | Own, Read, Write | — |
| **User B** | Read | Own, Read, Write | Write | Read |
| **User C** | Read, Write | Read | — | Own, Read, Write |

- User A owns files 1 and 3 and can read and write them; User B can read File 1; and so on.

**The problem:** in practice the matrix is **sparse** (mostly empty), so it is stored by **decomposing** it in one of two ways.

### Access Control Lists (ACLs): decompose by **columns**
- **One list per object**: the users and their permitted rights.
  - File 1 → A (Own, R, W) → B (R) → C (R, W)
  - File 2 → B (Own, R, W) → C (R)
  - File 3 → A (Own, R, W) → B (W)
  - File 4 → B (R) → C (Own, R, W)
- May contain a **default (public) entry** for users not listed; defaults should follow **least privilege** or read-only access.
- Entries may be individual users or **groups**.
- ✅ Easy to find **which subjects have which rights on a given resource**.
- ❌ Hard to find **all the rights a given user has**.

### Capability tickets: decompose by **rows**
- **One list per user**: the authorized objects and operations.
  - User A → File 1 (Own, R, W) → File 3 (Own, R, W)
  - User B → File 1 (R) → File 2 (Own, R, W) → File 3 (W) → File 4 (R)
  - User C → File 1 (R, W) → File 2 (R) → File 4 (Own, R, W)
- Users may **lend or give** tickets to others.
- ⚠️ Tickets are spread around the system, so they are a **bigger security problem than ACLs**: each ticket must be **unforgeable**.
  - Option 1: the **OS holds all tickets** in memory inaccessible to users.
  - Option 2: include an **unforgeable token** (a large random password or a cryptographic **MAC**), checked by the resource on every access; suited to **distributed** environments.
- ✅ Easy to find **all the rights a given user has**.
- ❌ Hard to find **all users with rights on a given resource**.

**Bank analogy (speaker notes):** Carla keeps valuables in a safe deposit box and lets trusted friends use it.

| | ACL approach (bank keeps a list of authorized people) | Capability approach (bank gives Carla keys) |
|---|---|---|
| Bank's involvement | Must **store the list** and **verify users** | **Not involved** in transactions |
| Forging access | Bank must **safeguard the list** and **authenticate** | The **key cannot be forged** |
| Adding a person | Owner must **visit the bank** | Owner **gives a key** to the new person |
| Delegation | A friend **cannot** pass the privilege on | A friend **can** pass the key on |
| Revocation | Owner **removes the name** from the list | Owner asks for the key back, but **cannot know if it was copied** |

### Authorization table (Table 4.2)
- **Not sparse** like the matrix, and more convenient than either ACLs or capability lists.
- **One row per access right of one subject to one resource**: columns are **Subject | Access Mode | Object**.
  - e.g. (A, Own, File 1), (A, Read, File 1), (A, Write, File 1), (B, Read, File 1), … — 18 rows for Figure 4.2.
- **Sort by subject** → equivalent to a **capability list**.
- **Sort by object** → equivalent to an **ACL**.
- Easily implemented in a **relational database**.

**Further reading:** [Difference Between Access Control List and Capability List (GeeksforGeeks)](https://www.geeksforgeeks.org/operating-systems/difference-between-access-control-list-and-capability-list/) · [Access Matrix in Operating System (GeeksforGeeks)](https://www.geeksforgeeks.org/access-matrix-in-operating-system/) · [Implementation of Access Matrix in Distributed OS (GeeksforGeeks)](https://www.geeksforgeeks.org/operating-systems/implementation-of-access-matrix-in-distributed-os/)

**In conclusion:** the access matrix is the logical model of DAC, and it is stored as ACLs (by object), capability tickets (by subject) or an authorization table that can be sorted either way.

## The General DAC Model (Lampson, Graham and Denning)

**Protection state:** the set of information, at a given time, that specifies the access rights of every subject to every object.

**The model meets three requirements**
1. **Represent** the protection state.
2. **Enforce** access rights.
3. Allow subjects to **alter** the protection state in controlled ways.

**Extended access matrix (Figure 4.3):** objects now include more than files:
- **Processes:** rights to **delete**, **stop** (block) and **wake up** a process.
- **Devices:** rights to **read/write**, **control** operation (e.g. a disk **seek**), and block/unblock.
- **Memory locations or regions:** read/write protected regions (default is to disallow).
- **Subjects:** rights to **grant or delete** that subject's access rights to other objects.
- Notation: each entry **A[S, X]** holds **access attributes** = the rights of subject S on object X.
  - Example: S1 may read file F1 because 'read' is in A[S1, F1].
- In Figure 4.3, **S1 owns S2 and S3**, so S2 and S3 are subordinate to S1.

**Access control function (Figure 4.4):** a separate **controller** for each type of object.
1. Subject **S0** issues a request of type **α** for object **X**.
2. The system generates a message **(S0, α, X)** to the controller for X.
3. The controller checks whether **α is in A[S0, X]**:
   - yes → access **allowed**;
   - no → access **denied**, a **protection violation** occurs, which should trigger a **warning** and appropriate action.
- Changes to the matrix itself are also accesses, mediated by an **access matrix controller**.

**Access control system commands (Table 4.3)**
- Special rights: **'owner'**, **'control'**, and the **copy flag** (written **α\***), which allows a right to be passed on.

| Rule | Command (by S0) | Authorization needed | Operation |
|---|---|---|---|
| **R1** | **transfer** α\* or α to S, X | 'α\*' in A[S0, X] | store α\* or α in A[S, X] |
| **R2** | **grant** α\* or α to S, X | 'owner' in A[S0, X] | store α\* or α in A[S, X] |
| **R3** | **delete** α from S, X | 'control' in A[S0, S] **or** 'owner' in A[S0, X] | delete α from A[S, X] |
| **R4** | w ← **read** S, X | 'control' in A[S0, S] **or** 'owner' in A[S0, X] | copy A[S, X] into w |
| **R5** | **create object** X | none | add column for X; store 'owner' in A[S0, X] |
| **R6** | **destroy object** X | 'owner' in A[S0, X] | delete column for X |
| **R7** | **create subject** S | none | add row for S; execute create object S; store 'control' in A[S, S] |
| **R8** | **destroy subject** S | 'owner' in A[S0, S] | delete row for S; execute destroy object S |

**What the rules mean**
- **R1 (transfer):** with the copy flag (α\*), S0 can pass the right on, **with or without** the copy flag. Leaving out the flag stops the new subject passing it further (e.g. to a malicious subject).
- **R2 (grant):** an **owner** can grant any right on its object to any subject.
- **R3 (delete):** S0 can delete rights in a **row it controls** or a **column it owns**.
- **R4 (read):** a subject can read the part of the matrix it **owns or controls**.
- **R5:** any subject can **create an object**, which it then **owns**.
- **R6:** the owner can **destroy** an object (its column is deleted).
- **R7:** any subject can **create a subject**; the creator **owns** it and the new subject has **control** over itself.
- **R8:** the owner of a subject can **delete** its row (and column).

**Possible extra rules**
- A **transfer-only** right: the right moves to the target and is **removed** from the giver.
- Limit an object to **one owner** by not allowing the copy flag on 'owner'.

**Hierarchy of subjects:** a subject can create another subject with a **subset of its own rights**, e.g. to run an application that is not fully trusted without letting it pass rights on.

**Further reading:** [Access Matrix in Operating System (GeeksforGeeks)](https://www.geeksforgeeks.org/access-matrix-in-operating-system/) · [Types of Discretionary Privileges (GeeksforGeeks)](https://www.geeksforgeeks.org/dbms/types-of-discretionary-privileges/)

**In conclusion:** the general DAC model represents the protection state as an extended access matrix, checks every request with a controller, and uses the 'owner', 'control' and copy-flag rules R1–R8 to change rights safely.

## UNIX File Access Control

**Background: inodes and directories**
- Every UNIX file is managed through an **inode** (index node): a control structure holding the file's **attributes, permissions and control information**.
- One active inode ↔ exactly one file.
- On disk, an **inode table** holds all inodes; when a file is opened, its inode is loaded into a memory-resident inode table.
- **Directories** form a hierarchical tree; a directory is itself a **file** containing file names plus pointers to inodes.

**Users, groups and files**
- Each user has a unique **user ID**.
- Each user is in a **primary group** (and possibly other groups), each with a **group ID**.
- A new file is **owned by its creator's user ID** and belongs to a group: the creator's primary group, or the **parent directory's group** if that directory has **SetGID** set.
- The **owner ID, group ID and protection bits** are stored in the file's **inode**.

**Protection bits: 12 in total**
- **9 permission bits:** read (r), write (w), execute (x) for **owner**, **group** and **others**.
  - Example (Figure 4.5): `rw- r-- ---` → owner can read and write, group can read, others have no access.
  - This is a **minimal ACL**: `user::rw-`, `group::r--`, `other::---`.
  - The **highest relevant set** of permissions is used (owner → group → others).
- **On directories:**
  - **read** = list the directory;
  - **write** = create, rename or delete files in it;
  - **execute** = descend into the directory or search it for a filename.
- **3 special bits:**
  - **SUID** (user + s): the file always **executes as its owner**, whoever runs it.
  - **SGID** (group + s): on a file, it executes as the **owning group**; on a directory, new files inherit the directory's group.
  - **Sticky bit** (other + t): on a directory, **only the file's owner (and root) can delete** a file in it (e.g. `/tmp`). Does not affect individual files.

**Lab commands from the slides**
- List all users: `cat /etc/passwd` *(the slide writes `ls /etc/passwd`, which only shows the file name)*.
- Read the password-hash file: `cat /etc/shadow` (needs root).
- See the "ACL" (permission bits) of a file: `ls -l /etc/shadow`.
- Switch user: `su username`.
- Create a file and check its permissions: `echo "Hello" > file1.txt`, then `ls -l file1.txt`.
- Change permissions: `chmod 660 file1.txt` → 6 = rw-, 6 = rw-, 0 = --- → owner and group can read/write, others nothing.
- Switch to another user and test: `cd /home/username`, `cat file1.txt` → "Permission denied" for others.

**Octal permissions** (general knowledge): r = 4, w = 2, x = 1, so 7 = rwx, 6 = rw-, 5 = r-x, 4 = r--. Example: `chmod 754` = rwx r-x r--.

**Further reading:** [SetUID, SetGID, and Sticky Bits in Linux File Permissions (GeeksforGeeks)](https://www.geeksforgeeks.org/linux-unix/setuid-setgid-and-sticky-bits-in-linux-file-permissions/) · [Advance File Permissions in Linux (GeeksforGeeks)](https://www.geeksforgeeks.org/linux-unix/advance-file-permissions-in-linux/) · [How to Set File Permissions in Linux (GeeksforGeeks)](https://www.geeksforgeeks.org/techtips/set-file-permissions-linux/)

**In conclusion:** UNIX implements DAC with 12 protection bits in each inode: nine rwx bits for owner, group and others, plus SUID, SGID and the sticky bit.

## Mandatory Access Control (MAC)

**Definition:** MAC enforces strict access control based on **security labels**, **clearances** and **policies** set centrally; users **cannot change** them.

**How it works**
- Based on **multilevel security (MLS)**.
- Levels (slide): **Top Secret > Secret > Confidential > Restricted > Unclassified**.
- Each **subject** has a **security clearance**; each **object** has a **security classification**.
- **Clearances and classifications are set by the administrator**; users **cannot override** the policy.

**Two properties required for confidentiality**
- **No read up:** a subject can only read objects at its **own or a lower** level.
- **No write down:** a subject cannot write into a lower level (the slide says a subject "can only write into an object of **equal** security level"; in the classic **Bell-LaPadula** model writing to an **equal or higher** level is allowed) (general knowledge).
- Together they stop information flowing from high to low levels.

**Key features (speaker notes)**
- **Security labels** on both subjects and objects (classifications, categories, sensitivity levels).
- **Centralized control** by security administrators.
- **Need-to-know:** access only to the data needed for one's duties.
- **Non-discretionary:** unlike DAC, users have no discretion over permissions.
- **Examples:** **SELinux** and **AppArmor** in Linux; formal models **Bell-LaPadula** (confidentiality) and **Biba** (integrity).
- **Use cases:** government, military, intelligence, critical infrastructure.
- **Trade-off:** very strong, but **complex to implement** and **less flexible**.

**MAC vs RBAC (speaker notes)**

| | MAC | RBAC |
|---|---|---|
| Based on | Labels, classifications and clearances | Roles (job functions) |
| Flexibility | Very rigid; users cannot change permissions | Flexible; add or remove roles easily |
| Granularity | **Fine-grained** (per subject and object label) | **Coarser** (everyone in a role gets the same rights) |
| Complexity | Complex: careful labelling of all data | Easier to implement and manage |
| Typical use | Government, military, critical infrastructure | Commercial organisations and enterprises |

**Further reading:** [Difference Between DAC and MAC (GeeksforGeeks)](https://www.geeksforgeeks.org/computer-networks/difference-between-dac-and-mac/) · [Introduction to Classic Security Models (GeeksforGeeks)](https://www.geeksforgeeks.org/introduction-to-classic-security-models/) · [Trusted Systems in Network Security (GeeksforGeeks)](https://www.geeksforgeeks.org/trusted-systems-in-network-security/)

**In conclusion:** MAC compares clearances with classifications under "no read up, no write down", giving strong, centrally controlled confidentiality at the cost of flexibility.

## Role-Based Access Control (RBAC)

**Definition:** RBAC gives access rights to **roles** (job functions in an organisation) instead of individual users; users are then assigned to roles, **statically or dynamically**, according to their responsibilities.

**Key facts**
- Widely used commercially and still an active research area.
- NIST's **FIPS PUB 140-3** requires support for access control and administration **through roles** (as stated in the lecture).
- Relationships (Figure 4.6):
  - **users ↔ roles: many-to-many**;
  - **roles ↔ resources: many-to-many**.
- The **set of users changes often**; the **set of roles is fairly static**; the rights of each role change **infrequently**.

**Access matrix view of RBAC (Figure 4.7)**
- **Upper matrix:** users (U1 … Um) × roles (R1 … Rn). A mark = user has that role.
  - One user can have **several roles**; one role can have **several users**.
  - Typically **many more users than roles**.
- **Lower matrix:** roles × objects, same structure as the DAC matrix with **roles as subjects**.
  - Objects include files, processes, disk drives, and even **other roles** (allowing **role hierarchies**).
- RBAC supports **least privilege**: each role holds the **minimum** rights needed for the job.

### The RBAC reference models [SAND96]

| Model | Role hierarchies | Constraints | Contains |
|---|---|---|---|
| **RBAC0** | ❌ No | ❌ No | Minimum functionality (base model) |
| **RBAC1** | ✅ Yes | ❌ No | RBAC0 + hierarchies |
| **RBAC2** | ❌ No | ✅ Yes | RBAC0 + constraints |
| **RBAC3** | ✅ Yes | ✅ Yes | RBAC0 + RBAC1 + RBAC2 |

**The four entities of RBAC0**
- **User:** an individual with access to the system, with a user ID.
- **Role:** a **named job function** in the organisation, with a description of its authority and responsibility.
- **Permission:** approval of a mode of access to one or more objects (also called **access right, privilege, authorization**).
- **Session:** a mapping between a user and an **activated subset** of the user's roles.
  - Temporary **one-to-many** (user → roles).
  - The user activates **only the roles needed for the task** = **least privilege**.
- Users ↔ roles and roles ↔ permissions are **many-to-many** → more flexibility and granularity than conventional DAC.
  - NIST examples: users may need to list directories and modify existing files **without creating new files**, or append records **without modifying existing ones**.

### Role hierarchies (RBAC1)
- Reflect the organisation's structure: **higher roles inherit the rights of lower roles** plus extra rights.
- **Example (Figure 4.9):**
  - Engineering Dept → Engineer 1 → Production Engineer 1 and Quality Engineer 1 → Project Lead 1 → **Director** (and the same chain for Engineer 2 / Project Lead 2).
  - **Project Lead** includes all rights of **Production Engineer** and **Quality Engineer**.
  - Both Production and Quality Engineer include all rights of **Engineer**, plus their own different extra rights (so they **overlap** in the Engineer rights).
- One role can inherit from **several** subordinate roles; several roles can inherit from the **same** subordinate role.

### Constraints (RBAC2)
- Adapt RBAC to the organisation's administrative and security policies; a **constraint** is a defined relationship among roles or a condition on roles.
- **1. Mutually exclusive roles**
  - A user can be assigned to **only one role in the set** (statically, or per session = dynamically).
  - Supports **separation of duties**.
  - With mutually exclusive **permission** assignments too: any permission can be granted to **only one role** in the set → **non-overlapping permissions**.
  - Purpose: make **collusion** harder.
  - Example: **Accountant** and **Auditor** roles are mutually exclusive, reducing fraud risk.
- **2. Cardinality:** setting a **maximum number**:
  - max users per role (e.g. only **one** project leader or department head);
  - max roles per user, or roles activated per session;
  - max roles that can hold a **sensitive permission**.
- **3. Prerequisite roles:** a user can be given a role **only if already assigned** another specified role.
  - Example: a Project Lead must also hold the Production Engineer and Quality Engineer roles, and can then start a session with only the junior role needed.
  - Prerequisites tied to hierarchies require **RBAC3**.

**Further reading:** [Identity and Access Management (IAM) in Cyber Security Roles (GeeksforGeeks)](https://www.geeksforgeeks.org/computer-networks/identity-and-access-management-iam-in-cyber-security-roles/) · [Role Based and Permission Based Access Control (GeeksforGeeks)](https://www.geeksforgeeks.org/java/spring-security-role-based-and-permission-based-access-control/) · [Access Control and Its Types (GeeksforGeeks)](https://www.geeksforgeeks.org/ethical-hacking/access-control-and-its-types/)

**In conclusion:** RBAC ties rights to job roles, supports least privilege through sessions, and grows from RBAC0 to RBAC3 by adding role hierarchies and constraints such as separation of duties.

## Attribute-Based Access Control (ABAC)

**Definition:** ABAC controls access by evaluating **rules against the attributes** of the **subject**, the **object**, the requested **operation** and the **environment**.

**Strengths and obstacle**
- ✅ **Flexibility and expressive power**: one rule can cover many cases.
  - Example: if every resource has a "creator" attribute, **one rule** gives ownership rights to the creator of every resource.
- ✅ **Fine-grained**: unlimited attributes can be combined into any rule.
- ✅ Can **enforce DAC, RBAC and MAC** concepts.
- ❌ Main obstacle: the **performance cost** of evaluating predicates on each access.
  - Less noticeable for **web services and cloud computing**, where each access is already relatively costly.
  - Web services pioneered ABAC through **XACML** (eXtensible Access Control Markup Language).

**Three key elements of an ABAC model**
1. **Attributes** defined for entities.
2. A **policy model** defining the ABAC policies.
3. An **architecture model** that enforces the policies.

**Three types of attributes**
- Attributes have a **class, name and value**, e.g. Class = HospitalRecordsAccess, Name = PatientInformationAccess, Value = MFBusinessHoursOnly.
- **Subject attributes:** identity and characteristics of the active entity (user, application, process, device): identifier, name, organisation, job title; a **role** can also be an attribute.
- **Object attributes:** properties of the passive resource (devices, files, records, tables, processes, programs, networks, domains), often taken from **metadata**: e.g. a Word document's title, subject, date, author; web-service ownership, taxonomy, QoS.
- **Environment attributes:** the context of the access, **not tied to subject or object**: current **date and time**, current **virus/hacker activity**, network security level (**Internet vs intranet**). Largely ignored by older policies.

**ABAC logical architecture (Figure 4.10)**
1. A subject **requests** access to an object; the request goes to the **access control mechanism**.
2. The mechanism uses **rules (2a)** from a preconfigured **access control policy**, and checks:
   - **subject attributes (2b)**,
   - **object attributes (2c)**,
   - **environment conditions (2d)**.
3. Access is **granted** if authorized, otherwise **denied**.
- **Four independent sources** of information: rules, subject, object, environment.
- Trade-off: very **powerful and flexible**, but more **complex** and slower than other approaches.

**Further reading:** [Authentication and Authorization in Microservices (GeeksforGeeks)](https://www.geeksforgeeks.org/system-design/authentication-and-authorization-in-microservices/) · [Access Control and Its Types (GeeksforGeeks)](https://www.geeksforgeeks.org/ethical-hacking/access-control-and-its-types/)

**In conclusion:** ABAC decides access from rules over subject, object and environment attributes, giving the most expressive control at the price of complexity and performance.

## Identity, Credential and Access Management (ICAM)

**Definition:** ICAM is a set of security disciplines that let **the right individual access the right resources, at the right time, for the right reason**. Often simply called **IAM** (Identity and Access Management).

**Background**
- Developed by the **U.S. government**, but usable by any enterprise wanting a unified approach.
- Designed to:
  1. Create **trusted digital identities** for individuals and **nonperson entities (NPEs)**: processes, applications, automated devices.
  2. **Bind** those identities to **credentials** that act as a proxy for them in access transactions.
     - **Credential:** an object or data structure that authoritatively binds an identity (and optionally attributes) to a **token** possessed and controlled by a subscriber.
  3. Use the credentials to give **authorized access** to resources.

**The four components (Figure 4.12)**

### 1. Identity management
- Assigns **attributes** to a digital identity and links it to an individual or NPE.
- Goal: a trustworthy identity **independent of any one application**.
  - Traditional approach: a separate identity per application → identity protection treated as secondary, and lots of duplicated effort.
  - **Enterprise identity:** one digital representation per person, reused across departments; job title, duties and location are **attributes**, not the identity.
- Steps: **on-boarding** (collect identity data) → optional **background investigation** → attributes stored in **authoritative attribute sources** → **provisioning** into applications → **de-provisioning** when access is no longer needed.
- **Lifecycle management** includes:
  - protecting personal identity information;
  - controlling access to identity data;
  - sharing authoritative identity data with applications;
  - **revoking** an enterprise identity.

### 2. Credential management
- Manages the **life cycle of credentials** such as **smart cards, private/public keys, digital certificates**.
- Five logical components:
  1. **Sponsorship:** an authorized person sponsors someone for a credential (e.g. a supervisor sponsors an employee).
  2. **Enrollment:** identity proofing and capture of biographic and **biometric** data.
  3. **Production:** the credential is made (encryption, digital signature, smart card production…).
  4. **Issuance:** the credential is issued to the individual or NPE.
  5. **Maintenance:** revocation, reissuance/replacement, re-enrollment, expiration, **PIN reset**, suspension, reinstatement.

### 3. Access management
- Manages how entities are granted access; covers **logical and physical access**.
- Ensures proper identity verification for access to **buildings, systems or data**, using credentials and digital identity.
- Three support elements:
  - **Resource management:** identify, classify, label and inventory the resources to protect.
  - **Privilege management:** define and assign roles and permissions; handle access requests and approvals; keep a record of who has access to what; enforce **least privilege**.
  - **Policy management:** create, enforce and maintain the rules on who can access what and when, including authentication, authorization and auditing rules.

### 4. Identity federation
- The technology, standards, policies and processes that let an organisation **trust identities, attributes and credentials issued by another organisation**.
- Answers two questions:
  1. How do you **trust identities from external organisations** who need access to your systems?
  2. How do you **vouch for your own people** when they collaborate with external organisations?
- Partners shown in Figure 4.12: external agencies, state or local government, business partners, citizens.
- **Key components (speaker notes)**
  - **Single Sign-On (SSO):** log in once at home, then use services in other organisations without logging in again.
  - **Identity Provider (IdP):** creates and manages identities and authenticates users.
  - **Service Provider (SP):** offers the service and **relies on the IdP** to verify the user.
  - **Trust relationship** between IdP and SP, based on shared protocols, standards and certificates.
  - **Standards:** **SAML**, **OAuth**, **OpenID Connect**.
- ✅ Benefits: user convenience (fewer passwords), better security (central authentication), lower cost, easier cross-organisation collaboration.

**Trust and the exchange of identity information (Figure 4.13)**
- Three parties: the **user**, the **identity service provider**, and the **relying party** (who provides the service).
- Each needs assurance:
  - **Relying party:** the user was authenticated to a suitable level, the attributes are **accurate**, and the provider is **authoritative** for them.
  - **Identity service provider:** its information is accurate, and the relying party will use shared data according to **contract and law**.
  - **User:** both parties can be trusted with sensitive information and will **respect privacy** and preferences.
  - **All parties** want to know the others actually follow their stated practices, and how reliable they are.

**Further reading:** [Identity and Access Management (GeeksforGeeks)](https://www.geeksforgeeks.org/cloud-computing/identity-and-access-management/) · [IAM in Cyber Security Roles (GeeksforGeeks)](https://www.geeksforgeeks.org/computer-networks/identity-and-access-management-iam-in-cyber-security-roles/) · [Standards and Protocols in IAM for Cloud Services (GeeksforGeeks)](https://www.geeksforgeeks.org/cloud-computing/standards-and-protocols-in-iam-for-cloud-services/) · [What are Digital Certificates? (GeeksforGeeks)](https://www.geeksforgeeks.org/computer-networks/what-are-digital-certificates/)

**In conclusion:** ICAM joins identity, credential and access management into one framework, and identity federation extends that trust across organisations with SSO, IdPs, SPs and standards like SAML.

## Case Study: RBAC at Dresdner Bank

**Before (prior to 1990)**
- A simple **DAC** system on each server and mainframe.
- Administrators kept a **local access control file on each host**, defining each employee's rights on each application.
- ❌ **Cumbersome, time-consuming and error-prone.**

**After: a system-wide RBAC scheme**
- Rights are decided by **three separate administrative units** for greater security.
- A **role = official position + job function** (slightly different from NIST, where a role is a job function only).

**(a) Functions and official positions (examples)**

| Role | Function | Official position |
|---|---|---|
| A | financial analyst | Clerk |
| B | financial analyst | Group Manager |
| C | financial analyst | Head of Division |
| D | financial analyst | Junior |
| E | financial analyst | Senior |
| F | financial analyst | Specialist |
| G | financial analyst | Assistant |
| X | share technician | Clerk |
| Y | support e-commerce | Junior |
| Z | office banking | Head of Division |

**(b) Permission assignments (access-right numbers per application)**

| Role | Application | Access rights |
|---|---|---|
| A | money market instruments | 1, 2, 3, 4 |
| A | derivatives trading | 1, 2, 3, 7, 10, 12 |
| A | interest instruments | 1, 4, 8, 12, 14, 16 |
| B | money market instruments | 1, 2, 3, 4, 7 |
| B | derivatives trading | 1, 2, 3, 7, 10, 12, 14 |
| B | interest instruments | 1, 4, 8, 12, 14, 16 |
| B | private consumer instruments | 1, 2, 4, 7 |

**(c) Permission assignments with inheritance**
- Because **B is superior to A** (same function, higher position), B **inherits** all of A's rights.
- So B only needs its **extra** rights listed:
  - money market instruments: **7**;
  - derivatives trading: **14**;
  - private consumer instruments: **1, 2, 4, 7**.

**How the hierarchy works**
- Positions within each organisation are strictly ordered, e.g. **Head of Division > Group Manager > Clerk**.
- **Role B (analyst/Group Manager)** has as many or more rights than **role A (analyst/Clerk)** in three applications, plus a **fourth** application.
- **No hierarchy** between Office banking/Group Manager and financial analyst/Clerk, because they work in **different functional areas**.
- Rule: one role is superior to another if its **position is superior and the functions are identical**.
- ✅ The hierarchy **economises on access-right definitions** (table c is much shorter than table b).

**Further reading:** [IAM in Cyber Security Roles (GeeksforGeeks)](https://www.geeksforgeeks.org/computer-networks/identity-and-access-management-iam-in-cyber-security-roles/) · [Access Control and Its Types (GeeksforGeeks)](https://www.geeksforgeeks.org/ethical-hacking/access-control-and-its-types/)

**In conclusion:** the bank replaced error-prone per-host DAC with system-wide RBAC, where roles combine position and function and inheritance removes duplicated permission definitions.

## Chapter Summary

- **Access control principles:** the access control context (authentication, authorization, audit) and the four policies (DAC, MAC, RBAC, ABAC).
- **Subjects, objects and access rights.**
- **Discretionary access control:** the access matrix, ACLs, capability tickets, authorization table, the general access control model and protection domains.
- **UNIX file access control:** traditional permission bits and ACLs in UNIX.
- **Role-based access control:** RBAC reference models RBAC0–RBAC3, hierarchies and constraints.
- **Attribute-based access control:** attributes, ABAC logical architecture, ABAC policies.
- **Identity, credential and access management:** identity, credential and access management, and identity federation.
- **Bank RBAC system** case study.

**Quick comparison of the four policies**

| | DAC | MAC | RBAC | ABAC |
|---|---|---|---|---|
| Decision based on | Identity + owner's rules | Labels vs clearances | Roles | Attributes + environment |
| Who sets permissions | Owner (discretion) | Central administrator | Administrator assigns roles | Policy authority writes rules |
| Flexibility | High | Low | Medium | Very high |
| Typical example | UNIX file permissions | SELinux, military systems | Enterprise and bank systems | Cloud and web services (XACML) |

**In conclusion:** access control turns a security policy into concrete decisions about subjects, objects and rights, and the choice of DAC, MAC, RBAC or ABAC depends on how much control, flexibility and central management the organisation needs.

## Self-test

<details><summary>Q1. Give the RFC 4949 definition of access control and the three objectives it serves.</summary>

"A process by which use of system resources is regulated according to a security policy and is permitted only by authorized entities according to that policy." The objectives: prevent unauthorized users from gaining access, prevent legitimate users from accessing resources in an unauthorized way, and enable legitimate users to access resources in an authorized way.

</details>

<details><summary>Q2. Distinguish authentication, authorization, access control and audit.</summary>

**Authentication** verifies credentials (may you use the system at all?). **Authorization** grants rights (who is trusted for what). **Access control** checks a specific request against the authorization database. **Audit** independently reviews records to test controls, ensure compliance, detect breaches and recommend changes.

</details>

<details><summary>Q3. Why is DAC "discretionary" and MAC "mandatory"?</summary>

In DAC, an entity can **by its own volition** give another entity access to a resource. In MAC, an entity with clearance **cannot** pass access on by its own volition, because access is set by labels and clearances from a central policy.

</details>

<details><summary>Q4. ACL vs capability ticket: how is each formed from the access matrix, and what is each good and bad at?</summary>

**ACL** = decompose by **columns** (one list per object). It makes it easy to see who can access a resource, but hard to see all of one user's rights. **Capability** = decompose by **rows** (one list per user). It makes it easy to see a user's rights, but hard to see who can access a resource. Capabilities must also be unforgeable.

</details>

<details><summary>Q5. Using the bank analogy, compare ACLs and capabilities for delegation and revocation.</summary>

ACL: a friend **cannot** delegate, and the owner revokes by removing the name. Capability: a friend **can** pass the key on, and the owner can ask for the key back but **cannot know whether it was copied**.

</details>

<details><summary>Q6. How does an authorization table relate to ACLs and capability lists?</summary>

One row per (subject, access mode, object). Sorted by **object** it acts as an ACL; sorted by **subject** it acts as a capability list. It is not sparse and fits easily in a relational database.

</details>

<details><summary>Q7. What do rules R1, R2, R5 and R7 allow, and what is the copy flag?</summary>

The copy flag (α\*) means the right can be passed on. **R1** transfer: if α\* is in A[S0, X], S0 can store α or α\* in A[S, X]. **R2** grant: an owner of X can grant any right on X. **R5**: any subject can create an object, which it then owns. **R7**: any subject can create a subject; the creator owns it and the new subject controls itself.

</details>

<details><summary>Q8. A file shows rw-r-----. Who can do what? What does chmod 660 give? What do SUID and the sticky bit do?</summary>

Owner: read and write. Group: read. Others: nothing. `chmod 660` = rw-rw----. **SUID**: the file runs as its owner. **Sticky bit** on a directory: only a file's owner (or root) can delete it.

</details>

<details><summary>Q9. State MAC's two confidentiality properties.</summary>

**No read up**: a subject reads only objects at its own or a lower level. **No write down**: a subject cannot write to a lower level (the slide says "only equal"; Bell-LaPadula allows equal or higher).

</details>

<details><summary>Q10. Name the four RBAC reference models and the four RBAC0 entities.</summary>

RBAC0 (base), RBAC1 (+ hierarchies), RBAC2 (+ constraints), RBAC3 (all). Entities: **user, role, permission, session**. A session activates only the roles needed, which supports least privilege.

</details>

<details><summary>Q11. Name and explain the three RBAC constraints, with an example of one.</summary>

**Mutually exclusive roles**: a user can hold only one role in the set (separation of duties, e.g. Accountant vs Auditor). **Cardinality**: a maximum number, e.g. only one department head. **Prerequisite roles**: a role can be given only if the user already has another role.

</details>

<details><summary>Q12. What are the three types of ABAC attributes? Give one example of each.</summary>

**Subject** (job title, organisation, role), **object** (document author, date, title), **environment** (time of day, current threat level, Internet vs intranet).

</details>

<details><summary>Q13. List the five credential management steps.</summary>

**Sponsorship → enrollment → production → issuance → maintenance** (revocation, reissue, PIN reset, suspension…).

</details>

<details><summary>Q14. What two questions does identity federation answer? What are the IdP and SP?</summary>

How do you trust identities from external organisations, and how do you vouch for your own people when working with others? The **IdP** creates and manages identities and authenticates users. The **SP** offers the service and relies on the IdP (SSO via SAML, OAuth or OpenID Connect).

</details>

<details><summary>Q15. In the bank case study, why does role B only list rights 7, 14 and 1, 2, 4, 7 in the inheritance table?</summary>

B (analyst/Group Manager) is superior to A (analyst/Clerk) because it has the same function and a higher position, so it **inherits** all of A's rights. Only B's **extra** rights need listing.

</details>
