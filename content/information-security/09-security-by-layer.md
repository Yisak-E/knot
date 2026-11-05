---
title: "Ch 8 (Detail) — Security at Each Network Layer"
summary: A layer-by-layer guide to network security — physical, link, network, transport and application — covering what each layer does, its threats, its security protocols (WPA, IPsec, TLS, SSH, S/MIME), what an attacker can still see, pros and cons, and how the layers combine.
tags: [chapter-8, layers, osi, tcp-ip, wpa, ipsec, tls, ssh, s-mime]
sort: 9
---

*Companion to the Chapter 8 note. Points marked (general knowledge) go beyond the lecture slides. Every topic ends with text-based reference articles.*

## The Layers: OSI vs TCP/IP

**Definition:** network communication is split into **layers**, each doing one job and serving the layer above it.

**OSI model (7 layers) and the TCP/IP model (4–5 layers)**

| OSI layer | TCP/IP layer | Unit of data | Example protocols | Example devices |
|---|---|---|---|---|
| 7 Application | Application | Message / data | HTTP, SMTP, FTP, DNS, SSH | — |
| 6 Presentation | Application | Data | TLS (often placed here), MIME, encoding | — |
| 5 Session | Application | Data | Session set-up (e.g. TLS sessions) | — |
| 4 Transport | Transport | **Segment** (TCP) / datagram (UDP) | TCP, UDP | — |
| 3 Network | Internet (network) | **Packet** | IP, ICMP, IPsec | Router, Layer 3 switch |
| 2 Data link | Link (network access) | **Frame** | Ethernet, Wi-Fi (802.11), WPA | Switch, bridge, access point |
| 1 Physical | Link (network access) | **Bits** | Cables, radio signals | Hub, repeater, cable |

**Encapsulation (sending)**
1. Application creates the **data**.
2. Transport adds a TCP/UDP header (with **port numbers**) → **segment**.
3. Network adds an IP header (with **IP addresses**) → **packet**.
4. Data link adds a frame header (with **MAC addresses**) and trailer → **frame**.
5. Physical sends it as **bits**.
- The receiver reverses this (**de-encapsulation**).

**Why layers matter for security**
- Security can be added at **any** layer.
- **Whatever a layer encrypts, all the layers above it are protected too**; the headers of the layers below stay visible.
- **Lower layer → broader coverage** (protects more kinds of traffic), but protection usually stops sooner (at a device, not the final application).
- **Higher layer → more specific** (one application), but can be truly end-to-end.

**Further reading:** [TCP/IP Model (GeeksforGeeks)](https://www.geeksforgeeks.org/computer-networks/tcp-ip-model/) · [OSI Model (GeeksforGeeks)](https://www.geeksforgeeks.org/computer-networks/open-systems-interconnection-model-osi/) · [OSI and TCP/IP Model (GeeksforGeeks)](https://www.geeksforgeeks.org/computer-networks/difference-between-osi-model-and-tcp-ip-model/) · [How Data Encapsulation and De-encapsulation Works (GeeksforGeeks)](https://www.geeksforgeeks.org/computer-networks/how-data-encapsulation-de-encapsulation-works/)

**In conclusion:** each layer adds its own header, so the layer where security is applied decides what is protected and what stays visible.

## Physical Layer Security (Layer 1)

*Not covered in the slides; included for completeness (general knowledge).*

**What the layer does:** sends raw **bits** over a medium (copper cable, fibre, radio waves).

**Threats**
- **Wiretapping / tapping** a cable.
- **Eavesdropping on radio signals** (anyone in range can receive Wi-Fi signals).
- **Jamming** radio frequencies (a denial-of-service attack).
- **Physical damage or theft** of cables and equipment.
- Plugging an unauthorised device into an open network port.

**Protections**
- Locked server rooms and network cabinets; access control to buildings.
- Shielded cables and **fibre optics** (hard to tap without detection).
- Disabling unused switch ports.
- Limiting radio range and placing access points carefully.
- Note: the physical layer has **no encryption of its own**; confidentiality comes from the layers above (e.g. WPA at Layer 2).

**Further reading:** [7 Layers of IT Security (GeeksforGeeks)](https://www.geeksforgeeks.org/ethical-hacking/7-layers-of-it-security/) · [Network Devices (GeeksforGeeks)](https://www.geeksforgeeks.org/computer-networks/network-devices-hub-repeater-bridge-switch-router-gateways/)

**In conclusion:** physical security protects the hardware and the medium itself; it is the foundation the other layers rely on.

## Link Layer Security (Layer 2)

**What the layer does**
- Moves **frames** between devices on the **same local network** (LAN or Wi-Fi), using **MAC addresses**.
- Devices: **switches** (keep a table of MAC address → port), **bridges**, **wireless access points**.
- Traffic switched by MAC address **stays within the LAN**.

**Threats** (general knowledge, except eavesdropping on Wi-Fi from the lecture)
- **Eavesdropping on Wi-Fi:** anyone nearby with an adapter in **monitor mode** can capture frames.
- **MAC spoofing:** pretending to be another device's MAC address.
- **ARP spoofing / poisoning:** tricking devices into sending traffic to the attacker (man-in-the-middle).
- **MAC flooding:** filling a switch's MAC table so it broadcasts traffic everywhere.
- **Rogue access points / "evil twin"** Wi-Fi networks.

**Security protocols**
- **WPA (Wi-Fi Protected Access)** *(lecture)*
  - Versions: **WEP** (old, broken) → **WPA** → **WPA2** → **WPA3** (current).
  - **WPA2** uses **AES-based CCMP** for confidentiality and integrity *(lecture)*.
  - **WPA2-Personal:** user enters the Wi-Fi password → keying material derived → laptop and access point run the **4-Way Handshake** to create the encryption keys *(lecture)*.
  - **WPA3** replaces the password exchange with **SAE** (Simultaneous Authentication of Equals), which resists offline password guessing (general knowledge).
  - **Enterprise mode** uses **802.1X** with a RADIUS server so each user logs in with their own credentials (general knowledge).
- Other link-layer security *(lecture)*: **Bluetooth** encryption, **ZigBee** encryption.
- **MACsec (IEEE 802.1AE)** encrypts wired Ethernet links (general knowledge).
- Switch features such as **port security** and **dynamic ARP inspection** (general knowledge).

**What is protected and what is visible**
- WPA encrypts the **frame's payload**, which is the **whole IP packet**: IP header, TCP/UDP header and data.
- An attacker nearby **still sees** Wi-Fi header information: **MAC addresses, frame sizes, timing**.
- **Cannot see:** IP addresses, port numbers or data.

**Where protection ends**
- Only on **one link**: between the laptop and the **access point**.
- At the access point the frame is **decrypted** and forwarded as normal traffic.
- Example: on public Wi-Fi, WPA protects an HTTP request only as far as the access point; HTTPS is needed for the rest of the path.

**Advantages**
- ✅ Protects **all** traffic on the link, whatever the application, transport or network protocol.
- ✅ **Transparent** to applications: the OS, drivers and hardware handle it.

**Disadvantages**
- ❌ Covers **only one link**, not the full path.
- ❌ **Both ends** of the link must be configured.
- ❌ Weak passwords, outdated settings (e.g. WEP) or compromised access points reduce protection.

**Further reading:** [What is WPA3 vs WPA2? (GeeksforGeeks)](https://www.geeksforgeeks.org/computer-networks/what-is-wpa3-vs-wpa2/) · [Difference between WEP and WPA (GeeksforGeeks)](https://www.geeksforgeeks.org/computer-networks/difference-between-wep-and-wpa/) · [Wireless Attacks (GeeksforGeeks)](https://www.geeksforgeeks.org/computer-networks/types-of-wireless-and-mobile-device-attacks/) · [Difference between Layer-2 and Layer-3 Switches (GeeksforGeeks)](https://www.geeksforgeeks.org/computer-networks/difference-between-layer-2-and-layer-3-switches/)

**In conclusion:** link-layer security (WPA2/WPA3) hides everything inside the frame on one link, but protection ends at the access point.

## Network Layer Security (Layer 3)

**What the layer does**
- Moves **packets** between **different networks** using **IP addresses**.
- Devices: **routers** (forward packets by destination IP; connect LAN, WAN and VLANs = **routing**) and **Layer 3 switches** (more than a Layer 2 switch, less than a full router).

**Threats** (general knowledge)
- **IP spoofing:** forging the source IP address.
- **Eavesdropping** on packets crossing the Internet.
- **Packet modification** in transit.
- **Route hijacking** and **ICMP-based attacks**.
- **Denial of service**, e.g. packet floods.

**Security protocol: IPsec** *(lecture)*
- Protects **IP packets**, so it covers **any** traffic carried by IP: TCP, UDP, ICMP and others.
- Implemented in the **operating system** or in **gateways** (firewalls, routers).
- **No changes** needed to applications, TCP or UDP.
- Main parts:
  - **ESP (Encapsulating Security Payload):** encryption + integrity + data-origin authentication.
  - **AH (Authentication Header):** authentication only; **deprecated**.
  - **IKEv2:** key management using **Diffie-Hellman**.
- **Two modes**
  - **Transport mode:** protects the payload; original IP header visible → attacker sees IP addresses but not ports or data. Used **end to end** between hosts.
  - **Tunnel mode:** protects the whole original packet inside a new outer packet → attacker sees only the tunnel endpoints. Used **router to router** or for **VPNs**.

**Other network-layer protections** (general knowledge)
- **Firewalls** with packet filtering (allow or block by IP address, protocol and port).
- **VPNs** built on IPsec; other tunnelling protocols include **PPTP** and **L2TP** *(lecture)*.

**Where protection ends**
- End to end (transport mode): from host to host.
- Router to router (tunnel mode): only between the gateways; **unprotected inside each internal network**.

**Advantages**
- ✅ Supports **all applications and transport protocols**.
- ✅ **Transparent** host-to-host encryption.
- ✅ Can **hide port numbers** and, in tunnel mode, **internal IP addresses**.
- ✅ Example: one IPsec VPN between two offices protects every application on both networks.

**Disadvantages**
- ❌ Needs support and configuration in the **operating system**.
- ❌ **Complex** to configure and manage (security associations, keys, policies).
- ❌ Extra headers and encryption **overhead**.
- ❌ Mostly used for **tunnelling (VPNs)**, rarely as the main protection for ordinary web browsing.

**Further reading:** [IP Security (IPSec) (GeeksforGeeks)](https://www.geeksforgeeks.org/computer-networks/ip-security-ipsec/) · [IPsec Tunnel and Transport Modes (GeeksforGeeks)](https://www.geeksforgeeks.org/computer-networks/ipsec-internet-protocol-security-tunnel-and-transport-modes/) · [Virtual Private Network (VPN) (GeeksforGeeks)](https://www.geeksforgeeks.org/computer-networks/what-is-vpn-how-it-works-types-of-vpn/) · [Types of VPN and its Protocols (GeeksforGeeks)](https://www.geeksforgeeks.org/computer-networks/types-of-virtual-private-network-vpn-and-its-protocols/) · [Difference Between Router and Layer-3 Switch (GeeksforGeeks)](https://www.geeksforgeeks.org/computer-networks/difference-between-router-and-layer-3-switch/)

**In conclusion:** network-layer security (IPsec) protects all IP traffic without changing applications, and it is the basis of most VPNs.

## Transport Layer Security (Layer 4)

**What the layer does**
- Delivers data between **applications** on two hosts, identified by **port numbers**.
- **TCP:** reliable, connection-oriented (three-way handshake SYN, SYN-ACK, ACK; closed with FIN).
- **UDP:** fast, connectionless, no delivery guarantee.

**Threats** (general knowledge, except eavesdropping from the lecture)
- **Eavesdropping** on TCP traffic (TCP itself has **no encryption**).
- **Session hijacking:** taking over an existing TCP connection.
- **Man-in-the-middle** attacks.
- **SYN flooding:** sending many half-open connections (denial of service).
- **Port scanning** to find open services.

**Security protocol: SSL/TLS** *(lecture)*
- **TLS** (Transport Layer Security) evolved from **SSL** (Secure Sockets Layer); **SSL is obsolete**.
- Sits **between the application and TCP**.
- Usually implemented in **user-space libraries** (e.g. **OpenSSL**), not in the OS.
- **Two layers of protocols**
  - **Record Protocol:** fragments, (optionally) compresses, adds a MAC, encrypts, and adds a header.
  - **Handshake, Change Cipher Spec, Alert** protocols: set up and manage the secure connection.
- **What the handshake does:** negotiates the TLS version and algorithms, authenticates the server (and optionally the client) with **certificates**, and creates the **session keys**.
- **Session vs connection:** a session holds the security parameters and can be reused by many connections, avoiding a full handshake each time.
- **For UDP:** **DTLS** (Datagram TLS). **HTTP/3** uses **TLS 1.3 inside QUIC** over UDP *(lecture)*.
- **Used by:** HTTPS (port 443), FTPS, SMTP (e.g. STARTTLS) and many other TCP applications.

**What is protected and what is visible**
- **Encrypted:** the application data (e.g. HTTP URL, headers, cookies, page content).
- **Still visible:** **IP addresses**, **TCP port numbers**, some TLS handshake information and other metadata.

**Where protection ends**
- At the **TLS endpoints**. If an intermediate server terminates TLS (e.g. a proxy or load balancer), the data is readable there, so it is **not true end-to-end**.

**Advantages**
- ✅ Host-to-host encryption between the TLS endpoints (prevents eavesdropping and modification).
- ✅ Applications stay **simple**: standard, well-tested libraries do the cryptography.
- ✅ **Widely supported** across operating systems, languages and applications.

**Disadvantages**
- ❌ Only for **specific transport protocols** (TLS for TCP; DTLS for UDP).
- ❌ Applications **must be written to use** the TLS API; using TCP alone gives no encryption.
- ❌ Developers must **validate certificates** and configure settings correctly.
- ❌ Not true end-to-end if TLS is terminated in the middle.

**Further reading:** [Transport Layer Security (TLS) (GeeksforGeeks)](https://www.geeksforgeeks.org/computer-networks/transport-layer-security-tls/) · [Secure Socket Layer (SSL) (GeeksforGeeks)](https://www.geeksforgeeks.org/computer-networks/secure-socket-layer-ssl/) · [Transport Layer Security (TLS) Handshake (GeeksforGeeks)](https://www.geeksforgeeks.org/computer-networks/transport-layer-security-tls-handshake/) · [HTTPS (GeeksforGeeks)](https://www.geeksforgeeks.org/html/explain-working-of-https/) · [What is QUIC and HTTP/3? (GeeksforGeeks)](https://www.geeksforgeeks.org/computer-networks/what-is-quic-and-http-3/)

**In conclusion:** transport-layer security (TLS) gives any TCP application strong, standard protection through a library, as long as the application is built to use it.

## Application Layer Security (Layer 7)

**What the layer does**
- Provides services directly to users and programs: web (**HTTP**), email (**SMTP**, POP3, IMAP), file transfer (**FTP**), remote login, name lookup (**DNS**).

**Threats** (general knowledge, plus spoofing and forgery from the lecture)
- **Malware and phishing** delivered by email or web.
- **Injection attacks** (e.g. SQL injection, cross-site scripting) on web applications.
- **Email spoofing** and **message forgery**.
- **Weak authentication** (stolen passwords, session hijacking through stolen cookies).
- **Data leaks** from servers.

**Security mechanisms** *(lecture)*
- The application itself encrypts and protects its data **before** passing it down the stack.
- Typical building blocks:
  - **Encryption** with algorithms such as **AES**.
  - **Secure key exchange** and **authentication**.
  - **Cryptographic hashes / MACs** (e.g. **HMAC**) for integrity.
  - **Digital signatures** for sender authentication.
- Rule: **never write your own cryptography**; use trusted, well-tested libraries and established protocols.

**Examples of application-layer security protocols**
- **SSH (Secure Shell):** secure remote login and command execution; replaces insecure Telnet. Also used for secure file transfer (SFTP).
- **S/MIME:** signs and/or encrypts email using certificates; the content is radix-64 encoded *(lecture)*.
- **OpenPGP (PGP):** signs and encrypts email and files; uses a "web of trust" instead of certificate authorities (general knowledge).
- **HTTPS:** HTTP running over TLS (application protocol + transport-layer security).
- **DNSSEC:** signs DNS records so answers cannot be forged (general knowledge).

**What is protected and what is visible**
- With correct encryption, the **application data** cannot be read without the keys.
- **Still visible:** IP addresses, port numbers (which may hint at the application) and some application metadata or headers (e.g. email To/From headers with S/MIME).

**Where protection ends**
- **True end-to-end:** encrypted by the application on Host A and stays encrypted until the application on Host B; routers and servers in the middle cannot read it.

**Advantages**
- ✅ **True end-to-end** protection, application to application.
- ✅ Security can be **tailored** to the application's needs (e.g. signing individual emails).

**Disadvantages**
- ❌ **Every application** must implement security itself.
- ❌ Developers must integrate and configure it **correctly**; mistakes create serious vulnerabilities.
- ❌ Protects **only that one application** (email security does not protect web browsing).

**Further reading:** [Introduction to SSH (Secure Shell) Keys (GeeksforGeeks)](https://www.geeksforgeeks.org/introduction-to-sshsecure-shell-keys/) · [Difference between SSH and Telnet (GeeksforGeeks)](https://www.geeksforgeeks.org/computer-networks/difference-ssh-telnet/) · [PGP vs S/MIME (GeeksforGeeks)](https://www.geeksforgeeks.org/computer-networks/difference-between-pgp-and-s-mime/) · [What is Secure Email? (GeeksforGeeks)](https://www.geeksforgeeks.org/what-is-secure-email/) · [What is HMAC? (GeeksforGeeks)](https://www.geeksforgeeks.org/computer-networks/what-is-hmachash-based-message-authentication-code/)

**In conclusion:** application-layer security gives true end-to-end protection for one application, at the cost of every application having to get security right on its own.

## Comparing All the Layers

**Overview table**

| | Link (L2) | Network (L3) | Transport (L4) | Application (L7) |
|---|---|---|---|---|
| Main protocol | WPA2/WPA3 | IPsec (ESP, IKE) | TLS (SSL), DTLS | SSH, S/MIME, PGP |
| Protects | Frames on one link | IP packets | TCP segments (UDP with DTLS) | One application's messages |
| Covers | All traffic on that link | All IP traffic | All apps that use TLS | Only that application |
| Implemented in | NIC drivers, hardware, access point | Operating system, routers, firewalls | Libraries / applications (e.g. OpenSSL) | The application itself |
| Apps need changes? | No | No | Yes (must use TLS API) | Yes (built in) |
| Protection ends at | The access point | The other host, or the tunnel gateway | The TLS endpoint | The receiving application |
| End-to-end? | ❌ No | ✅ Transport mode / ❌ tunnel mode | ⚠️ Only if not terminated in the middle | ✅ Yes |

**What an attacker capturing traffic can still see**

| Layer used | MAC addresses | IP addresses | Port numbers | Application data |
|---|---|---|---|---|
| None (plain HTTP) | Visible | Visible | Visible | **Visible** |
| WPA (on the Wi-Fi link) | Visible | Hidden | Hidden | Hidden |
| IPsec transport mode | Visible | Visible | Hidden | Hidden |
| IPsec tunnel mode | Visible | Only tunnel endpoints | Hidden | Hidden |
| TLS (HTTPS) | Visible | Visible | Visible | Hidden |
| Application (e.g. S/MIME) | Visible | Visible | Visible | Hidden (some headers visible) |

**Key rule** *(lecture)*
- The **lower** the layer, the **broader** the range of traffic protected.
- The **higher** the layer, the **closer to true end-to-end** protection.

**In practice** *(lecture)*
- Most used: **application-level security and TLS** (SSH, S/MIME, OpenPGP, HTTPS).
- **IPsec:** VPNs, enterprise networks, site-to-site links.
- **WPA2/WPA3:** every Wi-Fi network.

**Further reading:** [Types of Internet Security Protocols (GeeksforGeeks)](https://www.geeksforgeeks.org/types-of-internet-security-protocols/) · [OSI Security Architecture (GeeksforGeeks)](https://www.geeksforgeeks.org/computer-networks/osi-security-architecture/) · [7 Layers of IT Security (GeeksforGeeks)](https://www.geeksforgeeks.org/ethical-hacking/7-layers-of-it-security/)

**In conclusion:** each layer trades coverage against how far the protection reaches; no single layer does everything.

## Combining Layers: Defense in Depth

**Idea:** use security at **several layers at once**, so if one fails the others still protect the data (general knowledge term; the lecture gives the S/MIME + TLS example).

**Examples**
- **Email:** S/MIME encrypts the **message** (application) + TLS protects the **channel** to the mail server (transport) *(lecture)*.
- **Public Wi-Fi:** WPA2/WPA3 protects the **wireless link** + HTTPS protects the data **all the way to the web server**.
- **Remote worker:** an IPsec **VPN** to the office (network) + HTTPS to internal web apps (transport) + SSH for server administration (application).
- **Office-to-office:** IPsec **tunnel** between the routers protects every application crossing the Internet, while TLS still protects sensitive applications inside each office.

**Choosing a layer: quick guide**

| Need | Best layer / protocol |
|---|---|
| Protect a single website or API | Transport: **TLS / HTTPS** |
| Protect every application between two sites | Network: **IPsec tunnel (VPN)** |
| Protect messages even on the mail server | Application: **S/MIME or PGP** |
| Secure remote login to a server | Application: **SSH** |
| Stop neighbours reading your Wi-Fi traffic | Link: **WPA2/WPA3** |
| UDP application (e.g. VoIP, gaming) | Transport: **DTLS**, or network: IPsec |

**Further reading:** [What is Network Security? (GeeksforGeeks)](https://www.geeksforgeeks.org/network-security/) · [Security Measures in System Design (GeeksforGeeks)](https://www.geeksforgeeks.org/system-design/essential-security-measures-in-system-design/)

**In conclusion:** real systems layer several protections together, choosing each layer for what it protects best.

## Self-test

<details><summary>Q1. Name the unit of data and one security protocol at the link, network, transport and application layers.</summary>

Link: **frame**, WPA2/WPA3. Network: **packet**, IPsec. Transport: **segment**, TLS. Application: **message**, SSH / S/MIME / PGP.

</details>

<details><summary>Q2. Why does security at a lower layer protect more traffic?</summary>

Everything above that layer is carried inside it. For example, IPsec protects all IP traffic (TCP, UDP, ICMP) for every application, while S/MIME protects only email.

</details>

<details><summary>Q3. With WPA2 on public Wi-Fi, what can a nearby attacker see? Where does WPA's protection end?</summary>

MAC addresses, frame sizes and timing, but not IP addresses, ports or data. Protection ends at the **access point**, so HTTPS is needed beyond it.

</details>

<details><summary>Q4. With TLS (HTTPS), what is still visible to someone capturing packets?</summary>

**IP addresses**, **TCP port numbers**, some handshake information and metadata. The application data (URL, headers, cookies, content) is encrypted.

</details>

<details><summary>Q5. Which layer gives true end-to-end protection, and what is its main drawback?</summary>

The **application layer**: the data stays encrypted from application to application. The drawback is that every application must implement security correctly itself.

</details>

<details><summary>Q6. Why does IPsec need no changes to applications, while TLS does?</summary>

IPsec works at the network layer, below TCP/UDP, in the OS or gateway, so it is transparent. TLS sits between the application and TCP, so the application must call the TLS library.

</details>

<details><summary>Q7. Give one example of combining two layers and say what each layer protects.</summary>

S/MIME + TLS for email: S/MIME protects the **message itself** end to end, and TLS protects the **channel** to the mail server.

</details>

<details><summary>Q8. Name two threats at the link layer and two at the network layer.</summary>

Link: Wi-Fi eavesdropping, ARP spoofing, MAC flooding, rogue access points. Network: IP spoofing, packet modification, route hijacking, packet floods.

</details>
