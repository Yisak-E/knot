---
title: "Ch 7 — Firewalls and Intrusion Prevention Systems"
summary: Why firewalls are needed, design goals and the four control techniques, access policy and filter characteristics, capabilities and limits, packet filtering (rules, default policies, attacks), stateful inspection, application-level and circuit-level gateways, bastion hosts, host-based and personal firewalls, VPNs, topologies and DMZs, intrusion and intruder behaviour, IDS types and analysis approaches, HIPS and NIPS.
tags: [chapter-7, firewalls, packet-filter, stateful, proxy, dmz, vpn, ids, ips]
sort: 7
---

*Covers all 39 slides and their speaker notes. The lecture uses the textbook's Chapter 9 figures (Figures 9.1–9.4, Table 9.2). Points marked (general knowledge) go beyond the slides.*

## The Need for Firewalls

**How organisations' networks evolved**
1. **Centralized data processing:** a mainframe with directly connected terminals.
2. **LANs** connecting PCs and terminals to each other and the mainframe.
3. **Premises network:** several LANs connecting PCs, servers and maybe a mainframe.
4. **Enterprise-wide network:** several premises networks joined by a private **WAN**.
5. **Internet connectivity:** premises networks connect to the Internet (with or without a private WAN).
6. **Enterprise cloud computing:** virtualized servers in data centers offering internal and Internet services.

**The problem**
- **Internet connectivity is essential**, but it lets the outside world **reach and interact with internal assets** → a threat.
- Securing **every** host individually (host-based security) is possible but hard:
  - hundreds or thousands of systems running different OS versions (Windows, macOS, Linux);
  - every new flaw means **patching every affected system**;
  - needs scalable configuration management and aggressive patching.

**The solution: a firewall**
- **Inserted between the premises network and the Internet** to create a **controlled link** and an **outer security wall (perimeter)**.
- Can be **one computer** or **two or more systems** working together.
- Used as a **perimeter defense**:
  - a **single choke point** where security and auditing are imposed;
  - **insulates internal systems** from external networks.
- An alternative to, or better a **complement** of, host-based security → follows the military doctrine of **defense in depth**.

**Further reading:** [Introduction of Firewall in Computer Network (GeeksforGeeks)](https://www.geeksforgeeks.org/computer-networks/introduction-of-firewall-in-computer-network/) · [Types of Network Firewall (GeeksforGeeks)](https://www.geeksforgeeks.org/computer-networks/types-of-network-firewall/)

**In conclusion:** a firewall protects a whole network from Internet threats at one controlled choke point, adding a layer of defense in depth on top of host security.

## Firewall Characteristics: Design Goals and Control Techniques

**Three design goals [BELL94]**
1. **All traffic** from inside to outside, and vice versa, **must pass through the firewall** (all other access is physically blocked).
2. **Only authorized traffic**, as defined by the local security policy, is allowed to pass.
3. The firewall itself is **immune to penetration**: a **hardened** system with a secured OS (trusted computer systems are suitable, often required in government).

**Four techniques to control access [SMIT97]** (firewalls started with service control and now do all four)
- **Service control:** which **Internet services** can be accessed, inbound or outbound.
  - Filters on **IP address, protocol or port number**; may use **proxy software**; or may host the server itself (e.g. web or mail).
- **Direction control:** in which **direction** service requests may be **initiated** and flow.
- **User control:** access depends on **which user** is trying.
  - Usually for **local users** inside the perimeter; for external users it needs **secure authentication** such as **IPsec**.
- **Behavior control:** **how** services are used.
  - Examples: filter email to remove **spam**; allow external access to **only part** of a local web server.

**Further reading:** [Firewall Methodologies (GeeksforGeeks)](https://www.geeksforgeeks.org/computer-networks/firewall-methodologies/) · [Introduction of Firewall in Computer Network (GeeksforGeeks)](https://www.geeksforgeeks.org/computer-networks/introduction-of-firewall-in-computer-network/)

**In conclusion:** a firewall must see all traffic, pass only authorized traffic and resist attack itself, and it controls access by service, direction, user and behaviour.

## Firewall Access Policy and Filter Characteristics

**Access policy**
- A **critical** part of planning a firewall.
- Lists the **types of traffic authorized** to pass: **address ranges, protocols, applications and content types**.
- Developed from the organisation's **information security risk assessment and policy**.
- Process: start from a **broad specification** of the traffic types needed → **refine** into detailed **filter elements** → implement within a suitable **firewall topology**.

**Filter characteristics (NIST SP 800-41)**

| Characteristic | Filters on | Used by | Example |
|---|---|---|---|
| **IP address and protocol values** | Source/destination addresses and port numbers, inbound/outbound direction, other network and transport layer fields | Packet filter and stateful inspection firewalls | Limit access to specific services |
| **Application protocol** | Authorized application protocol data | Application-level gateway | Check SMTP email for spam; allow HTTP only to authorized sites |
| **User identity** | Who the user is (inside users, authenticated e.g. with IPsec) | Firewalls with user authentication | Only staff in finance may reach the payroll server |
| **Network activity** | Time of request, rate of requests, other activity patterns | Various | Allow only during **business hours**; detect **scanning** attempts by request rate |

**Further reading:** [Firewall Methodologies (GeeksforGeeks)](https://www.geeksforgeeks.org/computer-networks/firewall-methodologies/) · [Extended Access-List (GeeksforGeeks)](https://www.geeksforgeeks.org/computer-networks/extended-access-list/)

**In conclusion:** the access policy, built from risk assessment, defines what traffic is allowed, and filters can act on addresses and ports, application protocol, user identity or network activity.

## Firewall Capabilities and Limits

**Capabilities**
1. **Single choke point:** keeps unauthorized users out, blocks vulnerable services from entering or leaving, and protects against **IP spoofing and routing attacks**. Simplifies security management.
2. A place to **monitor security events**: audits and alarms.
3. A platform for **non-security Internet functions**:
   - **NAT** (network address translator: maps local addresses to Internet addresses);
   - **network management** (audit or log Internet usage).
4. A platform for **IPsec**: using tunnel mode, it can implement **VPNs**.

**Limitations**
1. ❌ Cannot protect against attacks that **bypass** it: e.g. internal systems with dial-out or **mobile broadband** to an ISP, or a **modem pool** for travelling staff.
2. ❌ May not fully protect against **internal threats**: a disgruntled employee, or one who unknowingly helps an attacker.
3. ❌ An **improperly secured wireless LAN** can be reached from outside; an internal firewall cannot stop **wireless traffic** between systems on different sides of it.
4. ❌ A **laptop, PDA or portable storage device** can be infected outside and then used inside.

**Further reading:** [Introduction of Firewall in Computer Network (GeeksforGeeks)](https://www.geeksforgeeks.org/computer-networks/introduction-of-firewall-in-computer-network/) · [Difference Between Firewall and Proxy Server (GeeksforGeeks)](https://www.geeksforgeeks.org/computer-networks/difference-between-firewall-and-proxy-server/)

**In conclusion:** firewalls centralise filtering, monitoring, NAT and VPNs, but they cannot stop traffic that bypasses them, insider threats, insecure wireless or infected portable devices.

## Types of Firewalls (Overview)

**How firewalls differ**
- They can inspect traffic at different levels:
  - individual **packets** (alone or as part of a flow);
  - all traffic in a **transport connection**;
  - details of **application protocols**.
- They act as a **positive filter** (pass only packets meeting criteria) or a **negative filter** (reject packets meeting criteria).
- Depending on the type, they examine **protocol headers**, the **payload**, or the **pattern of a sequence of packets**.

**The four main types (Figure 9.1)**

| Type | Works at | Inspects | Keeps state? |
|---|---|---|---|
| **Packet filtering** | Network + transport | IP and TCP/UDP headers of each packet | ❌ No (stateless) |
| **Stateful inspection** | Network + transport | Headers + **TCP connection state** | ✅ Yes |
| **Application-level gateway (proxy)** | Application | Application data, user authentication | ✅ Per connection (two spliced connections) |
| **Circuit-level gateway** | Transport (session) | Which **connections** are allowed (not content) | ✅ Per connection (two connections) |

**Further reading:** [Types of Network Firewall (GeeksforGeeks)](https://www.geeksforgeeks.org/computer-networks/types-of-network-firewall/) · [Packet Filter Firewall and Application Level Gateway (GeeksforGeeks)](https://www.geeksforgeeks.org/computer-networks/types-of-firewall-and-possible-attacks/)

**In conclusion:** the four firewall types differ in how deeply they look, from packet headers up to application content, and in whether they track connections.

## Packet Filtering Firewall

**Definition:** applies a **set of rules** to **each incoming and outgoing IP packet**, then **forwards or discards** it. Usually filters in **both directions**.

**Fields used in the rules**
- **Source IP address** (e.g. 192.178.1.1).
- **Destination IP address** (e.g. 192.168.1.2).
- **Source and destination transport-level address:** TCP/UDP **port numbers**, which identify applications such as SNMP or HTTP.
- **IP protocol field:** the transport protocol (**ICMP = 1**, **TCP = 6**; UDP = 17, general knowledge).
- **Interface:** for a firewall with three or more ports, which interface the packet came from or is going to.
- From the slide figures: IP header → **Protocol, Source IP, Destination IP**; TCP header → **Source Port, Destination Port**.

**How the rule list works**
- Rules match fields in the **IP or TCP header**.
- First match → that rule decides **forward or discard**.
- **No match** → a **default action** is taken.

**Two default policies**

| | Default = **discard** | Default = **forward** |
|---|---|---|
| Meaning | "That which is not expressly **permitted** is **prohibited**" | "That which is not expressly **prohibited** is **permitted**" |
| Approach | Block everything, then add services case by case | Allow everything, react to each new threat |
| Security | ✅ More conservative and controlled | ❌ Less secure |
| Users | More **visible**; seen as a hindrance at first (less so as rules are added) | Easier to use |
| Typical users | **Businesses and government** | More open organisations, e.g. **universities** |

**Worked example: block ping on a host firewall (slide 10)**
- Goal: stop host **.35** (in 3.3.3.0/24) pinging the protected host **.12** (in 1.1.1.0/24); default action = **accept**.
- Ping uses **ICMP**, so ports do not apply.

| Source address | Destination address | Source port | Destination port | Protocol | Action |
|---|---|---|---|---|---|
| 3.3.3.35 | 1.1.1.12 | N/A | N/A | 1 (ICMP) | **Block** |
| any | any | any | any | any | Accept (default) |

*(The full addresses are read from the slide's network figure.)*

**Advantages**
- ✅ **Simplicity**; easy to configure.
- ✅ **Very fast** (checks only a few header values).
- ✅ **Transparent** to users.

**Weaknesses (NIST SP 800-41)**
- ❌ Cannot stop attacks on **application-specific vulnerabilities or functions**: if an application is allowed, **all** its functions are allowed (it never looks at the content, e.g. a malicious web page).
- ❌ **Limited logging**: logs only hold the same info used for decisions (addresses, traffic type).
- ❌ No **advanced user authentication**.
  - Example (notes): allowing only user Steve to reach Facebook is hard, because a source IP does not reliably identify a person across phone, laptop and tablet.
- ❌ Vulnerable to attacks on **TCP/IP protocol bugs**, such as **network-layer address spoofing**.
- ❌ Few variables → easy to **misconfigure** and allow traffic that should be denied.

**Further reading:** [Stateless vs Stateful Packet Filtering Firewalls (GeeksforGeeks)](https://www.geeksforgeeks.org/computer-networks/stateless-vs-stateful-packet-filtering-firewalls/) · [Packet Filter Firewall and Application Level Gateway (GeeksforGeeks)](https://www.geeksforgeeks.org/computer-networks/types-of-firewall-and-possible-attacks/) · [Extended Access-List (GeeksforGeeks)](https://www.geeksforgeeks.org/computer-networks/extended-access-list/)

**In conclusion:** a packet filter is a fast, simple, stateless rule list on header fields, best with a default-discard policy, but it is blind to application content and easy to misconfigure.

## Attacks on Packet Filters and Countermeasures

| Attack | How it works | Countermeasure |
|---|---|---|
| **IP address spoofing** | The intruder sends packets **from outside** with a source address of an **internal host**, hoping systems that trust internal addresses will accept them | **Discard packets with an inside source address arriving on an external interface** (often done at the router outside the firewall) |
| **Source routing attack** | The sender specifies the **route** the packet takes, hoping to bypass security that does not analyse source-routing information | **Discard all packets** that use the source-routing option |
| **Tiny fragment attack** | The intruder uses **IP fragmentation** to make tiny fragments, forcing the **TCP header into a separate fragment** so filters that check TCP headers are bypassed (filters usually decide on the **first fragment**) | Require the **first fragment** to contain a **minimum amount of the transport header**; if the first fragment is rejected, **remember** the packet and drop all later fragments |

- **IP fragmentation** (notes): breaking packets into smaller pieces so they pass links with a smaller **MTU** (maximum transmission unit); the receiving host reassembles them.

**Further reading:** [What is Anti-Spoofing? (GeeksforGeeks)](https://www.geeksforgeeks.org/computer-networks/what-is-anti-spoofing/) · [Types of Evasion Technique for IDS (GeeksforGeeks)](https://www.geeksforgeeks.org/ethical-hacking/types-of-evasion-technique-for-ids/) · [Basic Network Attacks in Computer Network (GeeksforGeeks)](https://www.geeksforgeeks.org/basic-network-attacks/)

**In conclusion:** spoofing, source routing and tiny fragments all try to trick header-based filters, and each is countered by a specific rule on interfaces, options or fragments.

## Stateful Inspection Firewall

**The problem with plain packet filters**
- Most TCP applications are **client/server**.
  - Example: **SMTP** server uses **port 25**; the client uses a port between **1024 and 65535** chosen by the client.
- **Well-known ports** (below 1024) are permanently assigned (e.g. 25 for SMTP); ports **1024–65535** are dynamic and temporary.
- A stateless packet filter must therefore **allow inbound traffic on all high-numbered ports** for TCP replies → a **vulnerability**.

**Definition:** a stateful firewall inspects packets like a packet filter **and keeps a table of active connections**, using the connection state to decide whether to allow or drop a packet.
- Enforces the **TCP session lifecycle**: **SYN → SYN-ACK → ACK → ESTABLISHED**, then FIN.
- Allows incoming traffic to high-numbered ports **only for packets that match an existing entry** in the directory of outbound connections.

**Example connection state table (Table 9.2)**

| Source address | Source port | Destination address | Destination port | State |
|---|---|---|---|---|
| 192.168.1.100 | 1030 | 210.9.88.29 | 80 | Established |
| 192.168.1.102 | 1031 | 216.32.42.123 | 80 | Established |
| 192.168.1.101 | 1033 | 173.66.32.122 | 25 | Established |
| 192.168.1.106 | 1035 | 177.231.32.12 | 79 | Established |
| 223.43.21.231 | 1990 | 192.168.1.6 | 80 | Established |
| 219.22.123.32 | 2112 | 192.168.1.6 | 80 | Established |
| 210.99.212.18 | 3321 | 192.168.1.6 | 80 | Established |
| 24.102.32.23 | 1025 | 192.168.1.6 | 80 | Established |
| 223.21.22.12 | 1046 | 192.168.1.6 | 80 | Established |

- The first four rows are **internal clients** (192.168.1.x) reaching outside web (80), mail (25) and finger (79) servers.
- The last five are **outside clients** reaching the internal **web server 192.168.1.6** on port 80.

**What the state table records (speaker notes)**
- **5-tuple:** source IP, source port, destination IP, destination port, protocol.
- **Connection state:** SYN-SENT, ESTABLISHED, FIN-WAIT, CLOSED…
- **Sequence/ACK tracking:** expected sequence and ACK numbers (windows).
- **TCP flags** seen (SYN, SYN-ACK, FIN, RST).
- Window sizes, **timestamps/expiry**, policy metadata (rule, QoS tag, **NAT mapping**).

**How tracking sequence numbers stops attacks**
- **Validates sequence/ACK ranges:** drops packets outside the expected window.
  - Example: if the next expected sequence from A → B is 1000–2000, a spoofed packet with seq = 50000 is **dropped**.
- **Enforces the handshake:** packets cannot jump into ESTABLISHED without a valid 3-way handshake.
- **Detects desynchronization or replay** (sudden jumps in sequence numbers).
- **Stops blind spoofing:** attackers who cannot see the traffic must guess sequence numbers.
- Some stateful firewalls also inspect limited application data (e.g. **FTP, IM, SIPS** commands) to track related connections.

**Practical details**
- A provisional entry is created on **SYN**, marked ESTABLISHED after the final **ACK**.
- Different **timeouts** per state (ESTABLISHED idle longer than SYN-SENT).
- Uses **memory and CPU**; matters for high-throughput designs.

**What it helps prevent vs not**
- ✅ Prevents: **TCP session hijacking** relying on predictable sequence numbers; **blind TCP spoofing**; simple **forged-packet injection**.
- ❌ Does not fully prevent:
  - attackers who can **sniff** the connection (they see real sequence numbers) → use **encryption (TLS)**;
  - **TCP RST injection** (reduced, not removed);
  - **SYN flood DoS** (many half-open connections can overwhelm it) → mitigate with **SYN cookies**, backlog tuning, rate limits;
  - **application-layer attacks** (HTTP exploits, SQL injection) → need application inspection.

**Further reading:** [What is Stateful Inspection? (GeeksforGeeks)](https://www.geeksforgeeks.org/computer-networks/what-is-stateful-inspection/) · [Stateless vs Stateful Packet Filtering Firewalls (GeeksforGeeks)](https://www.geeksforgeeks.org/computer-networks/stateless-vs-stateful-packet-filtering-firewalls/) · [What is Session Hijacking? (GeeksforGeeks)](https://www.geeksforgeeks.org/ethical-hacking/session-hijacking/) · [How SYN Cookies Prevent SYN Flood Attacks (GeeksforGeeks)](https://www.geeksforgeeks.org/computer-networks/how-syn-cookies-are-used-to-preventing-syn-flood-attack/)

**In conclusion:** a stateful firewall remembers TCP connections, so it opens high ports only for real replies and blocks forged or out-of-sequence packets, though it still needs help against sniffing, SYN floods and application attacks.

## Application-Level Gateway (Application Proxy)

**Definition:** an application-level gateway, or **application proxy**, **relays application-level traffic** between the user and the remote server.
- A **proxy server** in general: an intermediary that receives client requests for resources on other servers and evaluates them.

**How it works**
1. The user contacts the gateway using a TCP/IP application (e.g. **Telnet, FTP**).
2. The gateway asks for the **remote host** to access.
3. The user gives a **valid user ID and authentication** information.
4. The gateway contacts the application on the remote host and **relays TCP segments** with the application data between the two ends.

**Key properties**
- Needs **proxy code for each application**; without it, the service is **not supported** and cannot cross the firewall.
- Can allow **only specific features** of an application and deny the rest.

**Advantages**
- ✅ **More secure than packet filters**: only a few allowed applications need checking, instead of all TCP/IP combinations.
- ✅ Easy to **log and audit** all incoming traffic at the application level.
- ✅ Supports **user authentication** and **content inspection**.

**Disadvantage**
- ❌ **Extra processing overhead** on every connection: there are effectively **two spliced connections**, and the gateway must examine and forward all traffic both ways.

**Further reading:** [What is a Proxy Firewall? (GeeksforGeeks)](https://www.geeksforgeeks.org/computer-networks/what-is-a-proxy-firewall/) · [Difference Between Firewall and Proxy Server (GeeksforGeeks)](https://www.geeksforgeeks.org/computer-networks/difference-between-firewall-and-proxy-server/) · [What is a Web Application Firewall? (GeeksforGeeks)](https://www.geeksforgeeks.org/computer-networks/what-is-a-web-application-firewall/)

**In conclusion:** an application proxy inspects and relays traffic per application with user authentication, which is more secure than packet filtering but costs more processing.

## Circuit-Level Gateway

**Definition:** a **circuit-level gateway** (circuit-level proxy) is a stand-alone system, or a function of an application gateway, that **does not allow an end-to-end TCP connection**.

**How it works**
- Sets up **two TCP connections**: inner host ↔ gateway, and gateway ↔ outside host.
- Then **relays TCP segments** between them **without examining the contents**.
- The security function = deciding **which connections are allowed**.

**Typical use**
- When the administrator **trusts internal users**:
  - **application-level (proxy) service for inbound** connections (examine incoming data);
  - **circuit-level for outbound** connections (no overhead on outgoing data).

**Advantages and disadvantage (speaker notes)**
- ✅ Comparatively **inexpensive**.
- ✅ Gives **anonymity** to the private network.
- ❌ Does **not filter individual packets**: once a connection is set up, an attacker may exploit it.

**SOCKS: a common implementation**
- The SOCKS service runs on **TCP port 1080**.
1. The client opens a TCP connection to the SOCKS port on the SOCKS server.
2. It **negotiates an authentication method** and **authenticates**.
3. It sends a **relay request**.
4. The SOCKS server **establishes or denies** the connection.
- **UDP:** a TCP connection is opened to authenticate the user; UDP segments are forwarded **as long as that TCP connection is open**.

**Further reading:** [What is Circuit-Level Gateway? (GeeksforGeeks)](https://www.geeksforgeeks.org/what-is-circuit-level-gateway/) · [Types of Network Firewall (GeeksforGeeks)](https://www.geeksforgeeks.org/computer-networks/types-of-network-firewall/)

**In conclusion:** a circuit-level gateway controls which TCP connections are allowed and relays them without looking at content, often via SOCKS on port 1080.

## Bastion Hosts

**Definition:** a **bastion host** is a system the firewall administrator identifies as a **critical strong point** in the network's security. It usually hosts an **application-level or circuit-level gateway**.

**Common characteristics**
- Runs a **secure (hardened) OS**.
- Has **only essential services** installed, e.g. proxy applications for **DNS, FTP, HTTP, SMTP**.
- May require **extra authentication** before users reach the proxies, and each proxy may require its own.
- Each proxy supports only a **subset of the application's commands**.
- Each proxy allows access only to **specific host systems**.
  - Example (notes): an **SMTP proxy** policy can set timeouts, maximum email size and line length; customise deny messages; filter content by **MIME type** and name patterns; limit recipient addresses; block specific senders.
- Each proxy keeps **detailed audit logs** (all traffic, each connection and its duration), essential for finding and stopping intruders.
- Each proxy is **small and simple**, so easy to check for flaws.
  - Example: a typical UNIX mail application may have **over 20,000 lines** of code; a mail proxy **fewer than 1,000**.
- Each proxy is **independent**: one can be removed or added without affecting the others.
- A proxy does **no disk access** except reading its initial configuration → the executable code can be **read-only**, making it hard to install Trojan horses or sniffers.
- Each proxy runs as a **non-privileged user** in a private, secured directory.

**Further reading:** [What is AWS Bastion Host (GeeksforGeeks)](https://www.geeksforgeeks.org/blogs/what-is-aws-bastion-host/) · [What is a Proxy Firewall? (GeeksforGeeks)](https://www.geeksforgeeks.org/computer-networks/what-is-a-proxy-firewall/)

**In conclusion:** a bastion host is a hardened, minimal platform for proxies, where every proxy is small, independent, read-only, unprivileged and fully logged.

## Host-Based and Personal Firewalls

**Host-based firewall**
- A **software module** that secures **an individual host**.
- Built into many operating systems or available as an **add-on package**.
- Filters and restricts packet flows like a stand-alone firewall.
- Common location: a **server**.
- **Advantages**
  - ✅ Rules can be **tailored to the host**: different filters for servers with different applications.
  - ✅ Protection is **independent of topology**: both **internal and external** attacks must pass through it.
  - ✅ Adds a **further layer** with stand-alone firewalls; a new server can be added with its own firewall **without changing** the network firewall.

**Personal firewall**
- Controls traffic between a **personal computer or workstation** and the **Internet or enterprise network**.
- For **home or corporate** use.
- Usually a **software module on the PC**; at home it can also be in the **router** connecting all home computers to DSL, cable modem or another Internet interface.
- **Much less complex** than server-based or stand-alone firewalls.
- **Primary role:** **deny unauthorized remote access** to the computer.
- Can also **monitor outgoing traffic** to detect and block **worms and malware**.

**Further reading:** [Network Firewall vs Host-Based Firewall (GeeksforGeeks)](https://www.geeksforgeeks.org/questions/what-is-the-key-difference-between-a-network-firewall-and-a-host-based-firewall/) · [Types of Network Firewall (GeeksforGeeks)](https://www.geeksforgeeks.org/computer-networks/types-of-network-firewall/)

**In conclusion:** host-based firewalls protect individual servers with tailored rules, and personal firewalls stop unauthorized remote access to a single PC.

## Virtual Private Networks (VPNs) and Firewalls

**Definition:** a VPN uses **encryption and authentication** in the lower protocol layers to give a **secure connection through an insecure network**, usually the Internet.

**Why VPNs**
- Organisations have LANs at **dispersed sites** and **remote workers**.
- The public Internet is **cheaper** than private lines and offloads WAN management to the provider.
- But public networks expose traffic to **eavesdropping** and give **an entry point** for unauthorized users → VPN needed.
- VPNs are **cheaper than real private networks** but need the **same encryption and authentication system at both ends**.

**How it works (Figure 9.3)**
- The most common mechanism is **IPsec** at the IP level.
- Encryption is done by **firewall software** or possibly **routers**.
- The IPsec device at each site **encrypts and compresses** traffic going into the WAN and **decrypts and uncompresses** traffic coming from it; authentication may also be provided.
- Transparent to workstations and servers on each LAN.
- **Remote users** connecting directly over the Internet must run IPsec themselves and need **strong host security**, as they are attractive targets.

**Where to put IPsec relative to the firewall**
- ✅ **In the firewall itself:** the logical choice.
- ❌ **In a separate box behind the firewall:** VPN traffic crossing the firewall is **encrypted**, so the firewall **cannot filter**, control access, log or scan for viruses.
- ❌ **In the boundary router outside the firewall:** the router is likely **less secure** than the firewall.

**Further reading:** [Virtual Private Network (VPN) (GeeksforGeeks)](https://www.geeksforgeeks.org/computer-networks/what-is-vpn-how-it-works-types-of-vpn/) · [Types of VPN and its Protocols (GeeksforGeeks)](https://www.geeksforgeeks.org/computer-networks/types-of-virtual-private-network-vpn-and-its-protocols/) · [IPsec Tunnel and Transport Modes (GeeksforGeeks)](https://www.geeksforgeeks.org/computer-networks/ipsec-internet-protocol-security-tunnel-and-transport-modes/)

**In conclusion:** a VPN uses IPsec to join sites and remote users securely over the Internet, and the firewall is the best place to run it so traffic can still be inspected.

## Firewall Topologies and the DMZ

**Topologies**

| Topology | Description | Typical users |
|---|---|---|
| **Host-resident firewall** *(textbook, not on slides)* | Personal and host-based firewall software on each host | Alone or with others |
| **Screening router** *(textbook, not on slides)* | A single router between inside and outside doing stateless or full packet filtering | Small office / home |
| **Single bastion inline** | **One firewall** between an internal and external router; stateful filters and/or proxies | **Small to medium** organisations |
| **Single bastion T** | Like inline, but the bastion has a **third interface to a DMZ** for externally visible servers | **Medium to large** organisations |
| **Double bastion inline** | The **DMZ is sandwiched** between an external and an internal firewall (Figure 9.2) | **Large businesses and government** |
| **Double bastion T** *(textbook, not on slides)* | The DMZ is on a separate interface of the inner bastion | Large businesses and government |
| **Distributed firewall configuration** | Stand-alone **plus host-based** firewalls under **central control** (Figure 9.4) | Some **large businesses and government** |

**The DMZ (demilitarized zone) (Figure 9.2)**
- **External firewall:** at the edge of the network, just inside the **boundary router** to the Internet/WAN.
- **Internal firewalls:** protect the bulk of the enterprise network.
- **DMZ:** the network segment **between** them, holding systems that must be **reachable from outside but still need protection**: corporate **website, email server, DNS server**.
- The **external firewall** protects the DMZ (matching its need for outside access) and gives basic protection to the rest of the network.
- The **internal firewall** has two purposes:
  1. **Stricter filtering** to protect enterprise servers and workstations from external attack.
  2. **Two-way protection** for the DMZ:
     - protects the internal network from attacks **launched from a compromised DMZ system** (worms, rootkits, bots);
     - protects DMZ systems from attacks **from the internal network**.

**Distributed firewall configuration (Figure 9.4)**
- Administrators configure **host-resident firewalls** on hundreds of servers and workstations, and **personal firewalls** on local and remote user systems, all from **central tools**.
- Protects against **internal attacks** with protection tailored to each machine and application.
- Stand-alone (internal and external) firewalls still give **global protection**.
- May use both an **internal and an external DMZ**: less critical web servers can sit in the **external DMZ, outside the external firewall**, protected by their own host-based firewalls.
- **Security monitoring** is essential: log aggregation and analysis, firewall statistics, fine-grained remote monitoring of hosts.

**Further reading:** [What is Demilitarized Zone? (GeeksforGeeks)](https://www.geeksforgeeks.org/computer-networks/what-is-demiltarized-zone/) · [What is a DMZ Network in CCNA? (GeeksforGeeks)](https://www.geeksforgeeks.org/computer-networks/what-is-a-dmz-network-in-ccna/) · [Zone-Based Firewall Configuration (GeeksforGeeks)](https://www.geeksforgeeks.org/computer-networks/zone-based-firewall-configuration/)

**In conclusion:** topologies range from a single inline bastion to distributed configurations, and the DMZ places public-facing servers between external and internal firewalls so a compromise there does not reach the internal network.

## Intrusions and Intruder Behaviour

**Definitions**
- **Security intrusion:** an **unauthorized act of bypassing** the security mechanisms of a system.
- **Intrusion detection:** a hardware or software function that **gathers and analyzes** information from a computer or network to **identify possible intrusions**.
- **Intrusion detection and prevention:** the same, but also able to **stop** them.

**Examples of intrusions (speaker notes)**
- Remote **root compromise**.
- Web server **defacement**.
- **Guessing or cracking passwords**.
- **Copying databases** containing credit card numbers.
- Viewing sensitive data **without authorization**.
- Running a **packet sniffer**.
- **Impersonating an executive** to get information.
- Using an **unattended workstation**.

**The typical intruder methodology [MCCL12]**
1. **Target acquisition and information gathering:** identify and characterise targets using public information and network exploration tools.
2. **Initial access:** exploit a remote vulnerability, e.g. guessing **weak credentials** or installing **malware via social engineering**.
3. **Privilege escalation:** increase privileges on the system.
4. **Information gathering or system exploit:** access or modify data, or move to another target system.
5. **Maintaining access:** install **backdoors** or malware, add covert credentials or change configuration.
6. **Covering tracks:** disable or edit **audit logs**, use **rootkits** to hide files and code.
- Example [VERI16]: **phishing** → malware installed → **login credentials stolen** → **Point-of-Sale terminal** compromised.

**Further reading:** [Intrusion Detection System (IDS) (GeeksforGeeks)](https://www.geeksforgeeks.org/ethical-hacking/intrusion-detection-system-ids/) · [Threat, Vulnerability, Risk and Exploit (GeeksforGeeks)](https://www.geeksforgeeks.org/computer-networks/threat-vulnerability-risk-and-exploit/)

**In conclusion:** an intrusion bypasses security controls, and most attackers follow the same six steps from reconnaissance to covering their tracks.

## Intrusion Detection Systems (IDS)

**Three logical components**
- **Sensors:** **collect data** that may contain evidence of intrusion: network packets, log files, system call traces.
- **Analyzers:** receive sensor (or other analyzer) input, **decide whether an intrusion occurred**, give evidence and possibly guidance on what to do; inputs may be stored for later review.
- **User interface:** lets a user **view output** and **control** the system (a manager, director or console).
- Simple IDS: one sensor + one analyzer (e.g. HIDS on a host, NIDS in a firewall). Sophisticated IDS: many sensors feeding a **central analyzer** (distributed).

**Three types of IDS**

| Type | Monitors | Looks at |
|---|---|---|
| **Host-based IDS (HIDS)** | A **single host** | Process IDs, the **system calls** they make, events on the host |
| **Network-based IDS (NIDS)** | **Network traffic** for segments or devices | Network, transport and application protocols |
| **Distributed or hybrid IDS** | Many **host and network sensors** | Combined in a **central analyzer** for better detection and response |

**Requirements: detection vs false alarms**
- Must detect a **high percentage of intrusions** with an **acceptable false alarm rate**.
  - Too few detections → a **false sense of security**.
  - Too many false alarms → managers **ignore alarms** or waste time.
- This is very hard because intrusions are **rare compared with legitimate use**: the **base-rate fallacy**. Current systems have not overcome it [AXEL00].

**Desirable IDS properties [BALA98]**
- Run **continually** with minimal human supervision.
- Be **fault tolerant**: recover from crashes and reinitializations.
- **Resist subversion**: monitor itself and detect if an attacker modified it.
- Impose **minimal overhead**.
- Be **configurable** to the system's security policy.
- **Adapt** to changes in system and user behaviour.
- **Scale** to monitor many hosts.
- **Degrade gracefully**: if some parts fail, the rest are affected as little as possible.
- Allow **dynamic reconfiguration** without restarting.

**Two analysis approaches**

| | **Anomaly detection** | **Signature / heuristic detection** (misuse detection) |
|---|---|---|
| Idea | Learn **normal behaviour** of legitimate users over time; flag deviations | Compare behaviour with known **malicious patterns (signatures)** or **attack rules (heuristics)** |
| Defines | What is **normal** | What is **malicious** |
| Detects unknown (**zero-day**) attacks? | ✅ Yes | ❌ No, only known attacks with patterns or rules |
| Speed and accuracy on known attacks | Slower | ✅ Quick and efficient |
| Main problem | Hard to collect and analyse data; **high false alarm rate** | Must keep signatures **up to date** |

**Further reading:** [Intrusion Detection System (IDS) (GeeksforGeeks)](https://www.geeksforgeeks.org/ethical-hacking/intrusion-detection-system-ids/) · [Approaches to Intrusion Detection and Prevention (GeeksforGeeks)](https://www.geeksforgeeks.org/computer-networks/approaches-to-intrusion-detection-and-prevention/) · [Types of Evasion Technique for IDS (GeeksforGeeks)](https://www.geeksforgeeks.org/ethical-hacking/types-of-evasion-technique-for-ids/)

**In conclusion:** an IDS uses sensors, analyzers and a user interface on hosts, networks or both, detecting attacks by anomaly or signature while fighting the base-rate problem of false alarms.

## Intrusion Prevention Systems (IPS)

**Definition:** an **IPS**, also called an **intrusion detection and prevention system (IDPS)**, is an **extension of an IDS** that can also **try to block or prevent** detected malicious activity.
- Can be **host-based, network-based, or distributed/hybrid**.
- Uses **anomaly detection** and/or **signature/heuristic detection**.
- Responds by **modifying or blocking packets** (at a perimeter or into a host) or **modifying or blocking system calls**.
- A network IPS **blocks traffic like a firewall** but uses **IDS algorithms** to decide when; whether it is a new product or a type of firewall is a matter of terminology.

**IDS vs IPS vs firewall (general knowledge summary)**

| | Firewall | IDS | IPS |
|---|---|---|---|
| Main job | Enforce an access policy | **Detect** and alert | **Detect and block** |
| Position | Inline | Usually passive (copy of traffic) | **Inline** |
| Decision basis | Rules on headers, state, application | Signatures / anomalies | Signatures / anomalies |

### Host-based IPS (HIPS)
- Uses **signature/heuristic** detection (malicious content in application traffic or **sequences of system calls**) or **anomaly** detection (behaviour patterns of malware).
- **Malicious behaviour it addresses**
  - **Modification of system resources:** rootkits, Trojan horses and backdoors change libraries, directories, **registry settings** and user accounts.
  - **Privilege-escalation exploits:** giving ordinary users root access.
  - **Buffer-overflow exploits.**
  - **Access to the email contact list:** worms that mail themselves to everyone in the address book.
  - **Directory traversal:** a web server flaw that lets an attacker read files outside the allowed area.
- **Tailored** to the platform: general tools for desktops and servers, or packages for specific servers (**web, database**) looking for their particular attacks.
- **Sandbox approach:** suited to **mobile code** (Java applets, scripts). The HIPS **quarantines** the code in an isolated area, runs it and monitors it; if it breaks policy or matches a bad signature, it is **halted**.
- **Areas of desktop protection [ROBB06a]**
  - **System calls:** every exploit makes at least one; each can be checked.
  - **File system access:** file-access calls must meet policy.
  - **System registry settings:** often modified to make an exploit persist; integrity is enforced.
  - **Host input/output:** local or network I/O can spread malware; proper interaction is enforced.
- **Role of HIPS**
  - The **endpoint** (desktops, laptops) is now seen as the **main target** of attackers, so vendors focus on endpoint security.
  - Traditionally: separate **antivirus, antispyware, antispam and personal firewall** products.
  - HIPS aims for an **integrated single-product suite**: tools work together, prevention is more comprehensive, management is easier.
  - Example: the **San Diego Supercomputer Center** reported **no intrusions in four years** with endpoint security only and no firewalls.
  - Still, the prudent approach is to use HIPS as **one element of defense in depth**, together with **firewalls or network IPSs**.

### Network-based IPS (NIPS)
- Essentially an **inline NIDS** with authority to **modify or discard packets** and **tear down TCP connections**.
- Uses **signature/heuristic** and **anomaly** detection.
- **Flow data protection** (not common in firewalls):
  - **reassembles the application payload** across a sequence of packets;
  - applies filters to the **full flow content** every time a new packet arrives;
  - once a flow is malicious, the **latest and all later packets** of that flow are dropped.
- **Methods to identify malicious packets**
  - **Pattern matching:** scans packets for byte sequences (**signatures**) from a database of known attacks.
  - **Stateful matching:** looks for signatures in the **context of a traffic stream**, not single packets.
  - **Protocol anomaly:** looks for deviations from **RFC standards** (e.g. drops packets with invalid TCP sequence numbers; drops SYNs during a flood from sources that have not completed the handshake).
  - **Traffic anomaly:** unusual activity, e.g. a **flood of UDP packets** or a **new service** appearing on the network.
  - **Statistical anomaly:** builds **baselines** of normal traffic and throughput and alerts on deviations.

### Distributed or hybrid IPS
- Combines **host and network sensors** with a **central analysis and management** system, like a distributed IDS (listed in the chapter summary).

**Further reading:** [Intrusion Prevention System (IPS) (GeeksforGeeks)](https://www.geeksforgeeks.org/intrusion-prevention-system-ips/) · [IDS vs IPS (GeeksforGeeks)](https://www.geeksforgeeks.org/ethical-hacking/intrusion-detection-systems-ids-vs-intrusion-prevention-systems-ips/) · [Approaches to Intrusion Detection and Prevention (GeeksforGeeks)](https://www.geeksforgeeks.org/computer-networks/approaches-to-intrusion-detection-and-prevention/)

**In conclusion:** an IPS adds blocking to an IDS: HIPS protects system calls, files, registry and I/O on endpoints, while NIPS sits inline and drops malicious flows using pattern, stateful, protocol, traffic and statistical analysis.

## Chapter Summary

- **The need for firewalls:** a perimeter choke point for an Internet-connected network.
- **Firewall characteristics and access policy:** three design goals, four control techniques, NIST filter characteristics.
- **Types of firewalls:** packet filtering, stateful inspection, application-level gateway, circuit-level gateway.
- **Firewall basing:** bastion host, host-based firewalls, personal firewall.
- **Firewall location and configurations:** DMZ networks, VPNs, distributed firewalls, topologies.
- **Intrusion prevention systems:** host-based, network-based, distributed or hybrid.

**All four firewall types at a glance**

| | Packet filter | Stateful inspection | Application gateway | Circuit-level gateway |
|---|---|---|---|---|
| Looks at | IP/TCP headers | Headers + connection state | Application data | Connection set-up only |
| Speed | ✅ Fastest | Fast | ❌ Slowest | Fast after set-up |
| Security | Lowest | Medium | ✅ Highest | Medium |
| User authentication | ❌ No | ❌ No | ✅ Yes | ✅ Yes (e.g. SOCKS) |
| Main weakness | Blind to content, spoofing, misconfiguration | Sniffing, SYN floods, application attacks | Processing overhead, proxy per app | Does not inspect packets after set-up |

**In conclusion:** firewalls and IPSs work together in defense in depth: firewalls enforce what traffic may pass at well-placed choke points, and IPSs detect and block malicious activity that the rules alone would miss.

## Self-test

<details><summary>Q1. State the three firewall design goals and the four control techniques.</summary>

Goals: all traffic passes through the firewall, only authorized traffic passes, and the firewall is immune to penetration. Techniques: **service**, **direction**, **user** and **behavior** control.

</details>

<details><summary>Q2. List the four NIST SP 800-41 filter characteristics with one example each.</summary>

**IP address and protocol values** (allow port 443 to the web server). **Application protocol** (check SMTP for spam). **User identity** (only authenticated finance users). **Network activity** (business hours only, or rate limits against scanning).

</details>

<details><summary>Q3. Give two firewall capabilities and three limitations.</summary>

Capabilities: a single choke point (also against spoofing and routing attacks), a monitoring location, NAT and logging, a platform for an IPsec VPN. Limitations: attacks that bypass it (mobile broadband, modems), insider threats, insecure wireless LANs, infected laptops or USB drives.

</details>

<details><summary>Q4. Compare the default-discard and default-forward policies.</summary>

**Discard**: anything not expressly permitted is prohibited. It is more secure and conservative, and used by business and government. **Forward**: anything not expressly prohibited is permitted. It is easier for users but less secure, and used by open organisations such as universities.

</details>

<details><summary>Q5. Write a packet-filter rule to block ping from 3.3.3.35 to 1.1.1.12. Why are the ports N/A?</summary>

Source 3.3.3.35, destination 1.1.1.12, protocol **1 (ICMP)**, action block (default accept). ICMP has **no port numbers**; ports belong to TCP and UDP.

</details>

<details><summary>Q6. Explain the tiny fragment attack and its countermeasure.</summary>

The attacker fragments packets so the TCP header lands in a later fragment, bypassing rules that check TCP fields on the first fragment. Countermeasure: the first fragment must contain a minimum amount of the transport header. If it is rejected, remember the packet and drop all its fragments.

</details>

<details><summary>Q7. How do you counter IP address spoofing and source routing attacks?</summary>

Spoofing: drop packets with an **inside source address arriving on an external interface**. Source routing: **drop all packets using the source-routing option**.

</details>

<details><summary>Q8. Why does a stateless filter have a problem with high-numbered ports, and how does stateful inspection fix it?</summary>

TCP clients use temporary ports 1024–65535, so a stateless filter must open all of them for replies. A stateful firewall keeps a **connection table** and admits inbound packets only if they match an existing connection (and valid sequence numbers).

</details>

<details><summary>Q9. Name two attacks stateful inspection helps prevent and two it does not.</summary>

It helps against session hijacking with predictable sequence numbers, blind spoofing and forged-packet injection. It does not fully stop sniffing-based injection (use TLS), SYN floods (use SYN cookies) or application-layer attacks.

</details>

<details><summary>Q10. Application-level vs circuit-level gateway: what does each examine, and what are their main pros and cons?</summary>

Application gateway: relays and **examines application data** with user authentication. It is the most secure and logs well, but has high overhead and needs a proxy per application. Circuit-level: sets up two TCP connections and **relays without examining content**. It is cheap and gives anonymity, but doesn't filter packets once connected (e.g. SOCKS, port 1080).

</details>

<details><summary>Q11. Give five characteristics of a bastion host.</summary>

A hardened OS, only essential services, extra authentication, proxies limited to command subsets and specific hosts, detailed audit logs, small and simple proxies (under 1,000 lines vs over 20,000), independent proxies, read-only code, and proxies running as non-privileged users.

</details>

<details><summary>Q12. What is a DMZ, what goes in it, and what are the two purposes of the internal firewall?</summary>

A network segment between the external and internal firewalls for externally reachable servers (web, email, DNS). The internal firewall applies **stricter filtering** to protect internal systems, and gives **two-way protection**: internal network from a compromised DMZ, and DMZ from internal attacks.

</details>

<details><summary>Q13. Why should IPsec for a VPN run on the firewall rather than behind it or on the boundary router?</summary>

Behind the firewall, VPN traffic is encrypted when it crosses the firewall, so the firewall can't filter, log or scan it. The boundary router is less secure than the firewall.

</details>

<details><summary>Q14. Name the three IDS components and the three IDS types.</summary>

Components: **sensors, analyzers, user interface**. Types: **HIDS** (single host, system calls), **NIDS** (network traffic and protocols), **distributed/hybrid** (many sensors, central analyzer).

</details>

<details><summary>Q15. Compare anomaly and signature detection. What is the base-rate fallacy?</summary>

Anomaly detection models normal behaviour and can catch zero-day attacks, but has many false alarms. Signature (misuse) detection matches known patterns: it is fast, but catches only known attacks. The **base-rate fallacy**: because intrusions are rare compared with legitimate activity, even a small false-positive rate yields many false alarms.

</details>

<details><summary>Q16. List four HIPS desktop protection areas and five NIPS detection methods.</summary>

HIPS: **system calls, file system access, registry settings, host I/O** (plus sandboxing). NIPS: **pattern matching, stateful matching, protocol anomaly, traffic anomaly, statistical anomaly** (plus flow data protection).

</details>

<details><summary>Q17. List the six steps of the intruder methodology.</summary>

Target acquisition and information gathering → initial access → privilege escalation → information gathering or system exploit → maintaining access → covering tracks.

</details>
