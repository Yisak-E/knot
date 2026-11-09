---
title: "Mock Exam — Ch 6 & Ch 7 (Access Control, Firewalls, IPS)"
summary: Two full practice papers in the doctor's exam pattern (Q1 5 MCQs = 1 mark, Q2 MAC vs DAC + ACL auditing = 1.5, Q3 stateful firewall = 1.5, Q4 HIPS vs NIPS + risk of blocking every anomaly = 1), with model answers and marking points.
tags: [chapter-6, chapter-7, mock-exam, practice, mac, dac, acl, stateful, hips, nips]
sort: 10
---

*Each paper follows the same structure as the real exam. Try each question first, then open the answer. "Marking points" lists what an examiner will look for.*

**Exam pattern (5 marks)**

| Q | Marks | Topic | Form |
|---|---|---|---|
| 1 | 1 | IPS + access control | 5 MCQs (0.2 each) |
| 2 | 1.5 | (a) MAC vs DAC: compare, contrast, example · (b) ACL auditing: good and bad, example (ACL vs capability) | Short answer |
| 3 | 1.5 | Stateful inspection firewall: what it does, how, vulnerabilities | Short answer |
| 4 | 1 | (a) HIPS vs NIPS: what they monitor + real example · (b) risk of blocking/deleting everything flagged as an anomaly | Short answer |

---

## Paper A

### Q1. Multiple choice (1 mark, 0.2 each)

**1.** Which access control policy lets the **owner of a file decide, by their own volition**, who else may access it?

- A. MAC
- B. DAC
- C. RBAC
- D. ABAC

<details><summary>Answer</summary>

**B. DAC.** "Discretionary" means the entity with access can, at its own discretion, grant access to others. In MAC, a user cannot pass access on.

</details>

**2.** An access control list (ACL) is obtained from the access matrix by decomposing it by:

- A. Rows, giving one list per subject
- B. Columns, giving one list per object
- C. Diagonals
- D. Roles

<details><summary>Answer</summary>

**B.** An ACL = **one list per object** (column). Decomposing by **rows** gives **capability tickets** (one list per subject).

</details>

**3.** An IPS differs from an IDS mainly because an IPS:

- A. Only uses signature detection
- B. Only monitors a single host
- C. Can also **block** detected malicious activity
- D. Does not need sensors

<details><summary>Answer</summary>

**C.** An IPS (IDPS) is an **extension of an IDS** that can **block or prevent** the activity, e.g. by modifying or dropping packets or blocking system calls.

</details>

**4.** A network-based IPS that looks for deviations from **RFC standards**, such as packets with invalid TCP sequence numbers, is using:

- A. Pattern matching
- B. Statistical anomaly
- C. Protocol anomaly
- D. Traffic anomaly

<details><summary>Answer</summary>

**C. Protocol anomaly.** Pattern matching = byte signatures; traffic anomaly = unusual activity such as a UDP flood; statistical anomaly = deviation from a baseline.

</details>

**5.** In RBAC, the constraint that stops one user from holding both the **Accountant** and **Auditor** roles is:

- A. Cardinality
- B. Prerequisite role
- C. Mutually exclusive roles
- D. Role hierarchy

<details><summary>Answer</summary>

**C. Mutually exclusive roles.** This enforces **separation of duties** and makes collusion or fraud harder.

</details>

### Q2. (1.5 marks)

**(a)** Compare and contrast **Mandatory Access Control (MAC)** and **Discretionary Access Control (DAC)**. Give an example of each. *(0.75)*

<details><summary>Model answer</summary>

**Similarities**
- Both are access control policies that decide whether a **subject** may perform an **access right** on an **object**.
- Both are enforced by the system's access control function, and both can be audited.

**Differences**

| | DAC | MAC |
|---|---|---|
| Decision based on | **Identity** of the requestor + access rules (owner's permissions) | **Security labels** of objects vs **clearances** of subjects |
| Who controls access | The **owner**, at their own discretion | A **central administrator**; users **cannot** change or pass on access |
| Rules | Owner can grant, transfer or revoke rights (e.g. with the copy flag) | **No read up** (read only own level or lower) and **no write down** |
| Flexibility | High, easy to use | Rigid, harder to manage |
| Security | Weaker: a careless owner or malware running as the user can share data | Stronger: stops information flowing from high to low levels |
| Typical use | Ordinary operating systems, businesses | Military, government, critical infrastructure |

**Examples**
- **DAC:** UNIX/Linux file permissions. The owner runs `chmod 640 report.txt`, so their group can read the file and others can't. Windows file sharing is another example.
- **MAC:** a military system where a document is labelled **Secret**. A user with **Confidential** clearance cannot read it (no read up), and a Top Secret user cannot copy its content into an Unclassified file (no write down). Implementations: **SELinux**, **AppArmor**; models: **Bell-LaPadula**.

**Marking points:** the meaning of discretionary vs mandatory · basis (identity vs labels/clearances) · who controls access · at least one similarity · one valid example each.

</details>

**(b)** An organisation uses **Access Control Lists (ACLs)** for all its resources. What kind of **audit** is this good for, and what kind is it bad for? Give an example. Explain using the comparison with **capability lists**. *(0.75)*

<details><summary>Model answer</summary>

**Key idea:** an ACL is stored **per object** (one list attached to each file or resource, listing users and their rights). A capability list is stored **per user** (subject).

**Good for: object-based (resource) audits**
- Question: "**Who can access this resource?**"
- Easy: open the resource's ACL and every user and right is listed in one place.
- Example: an auditor checks who can read the **payroll.xlsx** file. The ACL shows HR Manager (read/write), Finance group (read). It's done in one step, and revoking someone's access only means removing their entry.

**Bad for: subject-based (user) audits**
- Question: "**What can this user access?**"
- Hard: the system must **search the ACL of every object** in the organisation to find all entries for that user.
- Example: employee **Ali leaves the company**, or an account is suspected of being hacked. To find and remove **all** of Ali's rights, the admin must scan the ACLs of thousands of files, folders, databases and printers. It's slow, and some rights may be **missed**, so Ali keeps access.

**Capability lists are the opposite**
- Easy to see **all the rights of one user** (good for the user audit above).
- Hard to see **all users with rights on one object**; tickets can also be passed on, so revocation is hard to confirm.

| Audit question | ACL (per object) | Capability (per user) |
|---|---|---|
| Who can access file X? | ✅ Easy | ❌ Hard (search all users) |
| What can user U access? | ❌ Hard (search all objects) | ✅ Easy |

- **Fix:** an **authorization table** (subject, access mode, object) can be **sorted by object** (acts like an ACL) or **by subject** (acts like a capability list), so both audits are easy. RBAC also helps, because you audit roles instead of individual entries.

**Marking points:** ACL = per object · good audit = who can access a resource · bad audit = everything a user can access · a realistic example · link to capability lists as the opposite.

</details>

### Q3. (1.5 marks)

A packet filtering firewall checks each packet on its own. The next type of firewall improves on this.
**(a)** Name it and explain **what it does and how it works**. **(b)** Why is it more secure than a packet filter? **(c)** What are its **vulnerabilities**?

<details><summary>Model answer</summary>

**(a) Stateful inspection firewall: what it does**
- Inspects packet headers like a packet filter (IP addresses, ports, protocol) **and also keeps a table of active TCP connections** (the **connection state table**).
- Uses the **state of the connection** to decide whether to allow or drop each packet.
- **How it works**
  1. An internal client sends **SYN** → the firewall creates a provisional entry.
  2. After **SYN-ACK → ACK** the entry is marked **ESTABLISHED**.
  3. It records the **5-tuple** (source IP, source port, destination IP, destination port, protocol), the **state**, the expected **sequence/ACK numbers**, TCP flags and timeouts.
  4. Incoming packets are allowed only if they **match an existing entry** with a valid sequence number; otherwise they are dropped.
  5. The entry is removed on **FIN/RST** or after a **timeout**.
- Example table row: `192.168.1.100 : 1030 → 210.9.88.29 : 80   ESTABLISHED`.

**(b) Why it is better than a packet filter**
- TCP clients use temporary **high ports (1024–65535)**. A stateless filter must leave **all** of them open for replies, which is a big hole.
- A stateful firewall opens a high port **only for the reply of a real outgoing connection**.
- It enforces the **3-way handshake**: a packet cannot jump into ESTABLISHED.
- It checks **sequence numbers**, so it drops spoofed or out-of-window packets (e.g. seq 50000 when 1000–2000 is expected).
- So it stops **blind spoofing**, simple **packet injection** and **session hijacking** based on predictable sequence numbers.

**(c) Vulnerabilities**
- ❌ **SYN flood / state-table exhaustion (DoS):** many fake SYNs fill the connection table with half-open entries, so real users can't connect. *Mitigation:* SYN cookies, rate limiting, shorter timeouts.
- ❌ **Attacker who can sniff the traffic** sees the real sequence numbers and can inject or hijack anyway. *Mitigation:* encryption (TLS/IPsec).
- ❌ **TCP RST injection** is reduced, not removed.
- ❌ **Application-layer attacks** pass through on allowed connections (SQL injection, malicious HTTP, malware in a download), because it mostly does **not inspect the payload**. *Mitigation:* application-level gateway, WAF or IPS.
- ❌ **Resource use:** keeping state costs **memory and CPU**; it can become a bottleneck on fast networks.
- ❌ It still inherits packet-filter limits: **no strong user authentication**, can be **misconfigured**, can't stop traffic that **bypasses** it or **insider** attacks.

**Marking points:** name (stateful inspection) · connection state table + 5-tuple + handshake/sequence tracking · why better (high ports, spoofing) · at least two vulnerabilities, ideally with mitigation.

</details>

### Q4. (1 mark)

**(a)** What do a **HIPS** and a **NIPS** each monitor? Give a **real example** of how each one's monitoring helps. *(0.5)*

<details><summary>Model answer</summary>

**HIPS (host-based IPS)**
- **Monitors activity on one host** (desktop, laptop, server):
  - **system calls**, **file system access**, **registry settings**, **host input/output**;
  - processes and their behaviour; can **sandbox** mobile code.
- **Real example:** ransomware arrives in an email attachment and starts **encrypting hundreds of files** and **changing registry keys** so it runs at start-up. The HIPS sees the abnormal file-write and registry calls and **blocks the process** before the files are lost. A network device can't see this because the attachment arrived encrypted inside TLS.
- Other examples: blocking a **buffer-overflow** or **privilege-escalation** exploit; stopping a worm from **reading the email contact list** to mail itself out.

**NIPS (network-based IPS)**
- **Monitors network traffic inline** for a whole segment: packets and **reassembled flows** at the network, transport and application layers.
- Uses **pattern matching, stateful matching, protocol anomaly, traffic anomaly and statistical anomaly**; can **drop packets** and **tear down TCP connections**.
- **Real example:** an attacker sends an **SQL-injection** or known exploit (e.g. Log4Shell `${jndi:ldap://…}`) to the company web server. The NIPS matches the signature in the reassembled HTTP flow and **drops that flow** before it reaches the server. It also protects **every** server on the segment at once.
- Other example: it detects a sudden **flood of UDP packets** (traffic anomaly) or a **port scan** and blocks the source.

| | HIPS | NIPS |
|---|---|---|
| Where | On each host | Inline on the network |
| Sees | System calls, files, registry, processes, I/O | Packets and flows |
| Strength | Sees what happens **after** decryption, on the endpoint | Protects **many hosts** at once |
| Weakness | Must be installed on every host | Cannot see inside encrypted traffic or local activity |

</details>

**(b)** What is the **risk** if the system is set to **block or delete everything that looks like an anomaly**? *(0.5)*

<details><summary>Model answer</summary>

- Anomaly detection flags anything **different from normal behaviour**, and not everything unusual is an attack. It has a **high false-positive rate**.
- **Base-rate fallacy:** real intrusions are **rare** compared with legitimate activity, so even a small false-alarm rate means **most alerts are false**.
- **Risks of automatically blocking/deleting every anomaly:**
  - ❌ **Legitimate users and traffic are blocked:** the IPS causes a **denial of service against its own organisation**.
    - Example: a new software update, a backup job at 2 a.m., or a big sale-day traffic spike looks abnormal and gets blocked, so the website or payroll goes down.
  - ❌ **Legitimate files or processes are deleted** (HIPS): e.g. a newly installed program or a system file is quarantined or deleted, so applications crash and **data is lost** permanently.
  - ❌ **Attackers can abuse it:** by **spoofing** traffic from important IPs (e.g. the DNS server or a partner), they make the IPS block them = a self-inflicted DoS.
  - ❌ **Loss of evidence:** deleted files and dropped sessions can't be investigated later.
  - ❌ **Loss of trust:** admins get frustrated and **switch the IPS off** or ignore it.
- **Better approach:** alert and **quarantine** first instead of deleting, tune baselines, combine with signature detection, whitelist known-good behaviour, and only auto-block **high-confidence** detections.

**Marking points:** anomaly ≠ attack → false positives · consequence: legitimate traffic or files blocked/deleted (self-DoS, data loss) · a concrete example · optional: base-rate fallacy, attacker abuse, quarantine instead.

</details>

---

## Paper B

### Q1. Multiple choice (1 mark, 0.2 each)

**1.** In MAC, the rule "**no read up**" means a subject:

- A. Cannot read objects at a lower level
- B. Can only read objects at its own or a lower security level
- C. Can read any object if it owns it
- D. Must ask the owner before reading

<details><summary>Answer</summary>

**B.** It stops a low-clearance user reading higher-classified data. "No write down" stops copying high data into lower levels.

</details>

**2.** In the access matrix model, which right allows a subject to **pass a right on to another subject**?

- A. The 'control' right
- B. The copy flag (α\*)
- C. The 'execute' right
- D. The 'search' right

<details><summary>Answer</summary>

**B. The copy flag.** Rule R1 (transfer): if α\* is in A[S0, X], S0 can store α or α\* in A[S, X].

</details>

**3.** Which IDS/IPS detection approach can detect **zero-day (new) attacks**, but has a **high false alarm rate**?

- A. Signature detection
- B. Heuristic (rule-based) detection
- C. Anomaly detection
- D. Pattern matching

<details><summary>Answer</summary>

**C. Anomaly detection.** It models normal behaviour, so new attacks look abnormal, but so do many harmless changes. Signature detection catches only known attacks.

</details>

**4.** A HIPS that runs untrusted mobile code (e.g. a script) in an **isolated area** and stops it if it breaks policy is using:

- A. A sandbox
- B. A DMZ
- C. A bastion host
- D. Stateful matching

<details><summary>Answer</summary>

**A. Sandbox.** The code is quarantined, run and monitored; if it breaks policy or matches a bad signature, it is halted.

</details>

**5.** In ABAC, the **current time of day** and the **current threat level** are examples of:

- A. Subject attributes
- B. Object attributes
- C. Environment attributes
- D. Roles

<details><summary>Answer</summary>

**C. Environment attributes.** They describe the context of the access, independent of the subject or object.

</details>

### Q2. (1.5 marks)

**(a)** A hospital stores patient records. Explain how they would be protected under **DAC** and under **MAC**, and say which is more suitable and why. *(0.75)*

<details><summary>Model answer</summary>

**Under DAC**
- The record's **owner** (e.g. the doctor who created it) sets permissions, e.g. gives read access to a nurse and a specialist.
- ✅ Flexible: the doctor can quickly share with a colleague in an emergency.
- ❌ Risky: the doctor could **share with the wrong person** by mistake, and malware running under the doctor's account has the doctor's rights. There is no central guarantee the policy is followed.

**Under MAC**
- Records get a **label** (e.g. Confidential, or Restricted for psychiatric records). Staff get a **clearance** from the security administrator.
- A receptionist with low clearance **cannot read up** to medical details; a doctor **cannot write** record content into a lower-classified (public) file.
- ✅ Strong and consistent: users **cannot override** it.
- ❌ Rigid: an emergency doctor without clearance is blocked, and labelling every record is a lot of work.

**Which is more suitable?**
- Sensitive medical data suits **MAC-style central control** (or, in practice, **RBAC**: Doctor, Nurse, Receptionist roles), because a privacy breach is very serious and policy must not depend on individual owners.
- Either answer can earn marks if justified.

**Marking points:** who controls access in each · how the record is protected (owner permissions vs labels/clearances, no read up / no write down) · a pro and con of each · a justified choice.

</details>

**(b)** A company stores permissions as **capability lists** instead of ACLs. Which audit becomes **easy**, which becomes **hard**, and what happens when an employee leaves? *(0.75)*

<details><summary>Model answer</summary>

- **Capability list** = **one list per user** of the objects they can access and how.
- ✅ **Easy audit:** "What can user Sara access?" Read Sara's capability list and every right is in one place. Useful for reviewing whether her rights match her job (least privilege).
- ❌ **Hard audit:** "Who can access the **customer database**?" The admin must **search every user's capability list**.
- ❌ **Revocation/delegation problem:** capabilities (tickets) can be **lent or given** to other users. Like the bank-key analogy, the owner can ask for the key back but **can't know whether it was copied**, so it's hard to prove all access is gone.
- **When an employee leaves:** with capabilities, delete the employee's list. Easy for **their own** rights, but copies they passed to others may remain. With ACLs, you would have to search every object's list.
- Tickets must be **unforgeable**: kept by the OS, or protected with a random token or cryptographic MAC.

**Marking points:** capability = per user · easy = user audit · hard = resource audit · delegation/revocation issue · an example.

</details>

### Q3. (1.5 marks)

Look at the connection state table:

| Source address | Source port | Destination address | Destination port | State |
|---|---|---|---|---|
| 192.168.1.100 | 1030 | 210.9.88.29 | 80 | Established |
| 223.43.21.231 | 1990 | 192.168.1.6 | 80 | Established |

**(a)** What type of firewall keeps this table, and what does each row mean? **(b)** An outside packet arrives: `210.9.88.29 : 80 → 192.168.1.100 : 1030`. A second one arrives: `210.9.88.29 : 80 → 192.168.1.100 : 1044`. What does the firewall do with each, and why? **(c)** Give two attacks this firewall still cannot fully stop.

<details><summary>Model answer</summary>

**(a)**
- A **stateful inspection firewall**.
- **Row 1:** internal client **192.168.1.100** (temporary port 1030) has an open connection to an outside **web server** (port 80).
- **Row 2:** outside client **223.43.21.231** is connected to the **internal web server 192.168.1.6** on port 80.

**(b)**
- Packet 1 (`→ 192.168.1.100 : 1030`): **allowed**. It matches row 1 in reverse, so it's the server's **reply** on an established connection (if its sequence number is in the expected window).
- Packet 2 (`→ 192.168.1.100 : 1044`): **dropped**. There is **no entry** for port 1044, so no internal host started that connection. It could be a scan or a spoofed packet.
- A **stateless packet filter** would have had to allow **both**, because it must keep all high ports (1024–65535) open for replies.

**(c)** Any two:
- **SYN flood:** fills the state table with half-open connections (DoS).
- **Sniffing-based hijacking/injection:** an attacker on the path sees the real sequence numbers.
- **Application-layer attacks** inside an allowed connection, e.g. SQL injection to 192.168.1.6 on port 80, or malware in a web download.
- **Insider attacks** or traffic that **bypasses** the firewall (e.g. mobile broadband).

**Marking points:** stateful identified · rows explained (client vs server, ports) · packet 1 allowed and packet 2 dropped, with reasons · two valid limitations.

</details>

### Q4. (1 mark)

**(a)** A company has both a **HIPS** on its laptops and a **NIPS** at the Internet edge. Give one attack that **only the HIPS** would catch and one that **only the NIPS** would catch. Explain why. *(0.5)*

<details><summary>Model answer</summary>

**Caught by the HIPS, not the NIPS**
- An employee plugs in an **infected USB drive**, and the malware tries to **modify registry settings** and install a **backdoor**.
- The traffic never crosses the network edge, so the NIPS sees nothing. The HIPS sees the **system calls, file writes and registry changes** on the laptop and blocks them.
- Also: malware arriving inside **encrypted HTTPS**. The NIPS can't read it, but the HIPS sees it after decryption on the host.

**Caught by the NIPS, not the HIPS**
- An attacker runs a **port scan and exploit** against a **server or printer without a HIPS** installed, or floods the network with **UDP packets**.
- The NIPS sits **inline**, sees all traffic for the whole segment, matches the **signature / traffic anomaly**, and **drops the packets** before they reach any device, including ones that can't run HIPS software.

**Point:** they complement each other, which is **defense in depth**.

</details>

**(b)** An IPS uses **anomaly detection** and is set to **automatically drop or delete everything abnormal**. Explain the risk, with an example, and suggest a safer setting. *(0.5)*

<details><summary>Model answer</summary>

- **Risk: false positives.** Normal-but-unusual activity is treated as an attack. Because attacks are rare (**base-rate fallacy**), most anomalies are actually legitimate.
- **Consequences:** legitimate traffic dropped and files deleted → a **self-inflicted denial of service**, **data loss**, broken business processes, and attackers can **trigger blocks on purpose** (e.g. spoofing a partner's IP).
- **Example:** at month-end, the finance team runs a large payroll export at night. The traffic volume and time are "abnormal", so the IPS drops the connection and the HIPS deletes the export file. Salaries are delayed.
- **Safer setting:** **alert or quarantine** instead of deleting; auto-block only high-confidence detections (e.g. signature matches); **tune the baseline** and whitelist known jobs; have a human review anomalies.

</details>

---

## Last-Minute Checklist

- **DAC** = owner decides (discretion); **MAC** = labels + clearances, no read up / no write down, admin decides.
- **ACL** = per **object** → easy "who can access X?", hard "what can user U access?". **Capability** = per **user** → the opposite.
- **Authorization table** = sort by object (ACL) or by subject (capability).
- **Stateful firewall** = packet filter + **connection table** (5-tuple, state, sequence numbers) → opens high ports only for real replies; weak against **SYN flood, sniffing, application-layer attacks**.
- **HIPS** monitors **system calls, files, registry, I/O** on one host; **NIPS** monitors **network flows inline** (pattern, stateful, protocol, traffic, statistical).
- **Anomaly** = catches zero-days but has **many false positives** → auto-deleting or blocking everything causes **self-DoS and data loss**.
- RBAC constraints: **mutually exclusive roles, cardinality, prerequisite**.
- ABAC attributes: **subject, object, environment**.
