---
title: "Ch 8 — Internet Security Protocols and Standards"
summary: Why Internet protocols lacked security, security at the application, transport, network and link layers, web security and HTTPS, SSL/TLS (record, change cipher spec, alert and handshake protocols, sessions vs connections), secure email with MIME and S/MIME, and IPsec (ESP, transport and tunnel modes).
tags: [chapter-8, tls, ssl, https, ipsec, s-mime, wpa]
sort: 8
---

## Why the Internet Needed Security Protocols

**The original assumption: a trustworthy Internet**
- Early protocols were designed when links, networks and devices were assumed trustworthy.
- Only a small number of organisations and universities were connected, and everyone more or less trusted everyone else.
- So IP, TCP, UDP, HTTP, SMTP and FTP were built with **no security mechanisms at all** (no encryption in TCP or IP; no protection in HTTP).

**What changed**
- The Internet grew and was used for commercial transactions and other sensitive tasks.
- Networks and devices became far less trustworthy → the need for security became obvious.

**The fix: extensions, not replacements**
- Designers added extensions that let clients and servers **authenticate** each other and **encrypt** their traffic.
- Main examples:
  - **IPsec** secures IP.
  - **SSL** (later renamed **TLS**) secures TCP.
  - **S/MIME** secures email.

**Security can be added at different layers**
- **Network layer:** IPsec encrypts and authenticates IP packets; rarely used directly by end users but common in VPNs.
- **Transport layer:** SSL, later replaced by and renamed TLS, encrypts TCP traffic.
- **Application layer:** if neither IPsec nor TLS is used, developers build security into their own applications, e.g. protecting remote login with **Secure Shell (SSH)**.
- **Link layer:** e.g. WPA for Wi-Fi.

**In conclusion:** Internet security protocols exist because the original protocols assumed a trustworthy environment, and security was later added as extensions at different layers of the stack.

## Threats to Web Security

**Four categories of threat**

| Category | Threats | Consequences | Countermeasures |
|---|---|---|---|
| **Integrity** | Modification of user data; Trojan horse browsers; modification of memory; modification of messages in transit | Loss of information; compromise of the machine; vulnerability to all other threats | Cryptographic checksums |
| **Confidentiality** | Eavesdropping on the network; theft of information from server or client; gathering network configuration info or which client talks to which server | Loss of information; loss of privacy | Encryption; web proxies |
| **Denial of service** | Killing user threads; flooding a machine with bogus requests; filling up disk or memory; isolating a machine through DNS attacks | Disruptive and annoying; users cannot get work done | Difficult to prevent |
| **Authentication** | Impersonation of legitimate users; data forgery | Misrepresentation of users; belief that false information is valid | Cryptographic techniques |

**Security mechanisms that protect against these threats**
- **Integrity and authenticity:** cryptographic hash functions combined with message authentication such as **HMAC**.
- **Confidentiality:** **encryption** of transmitted information.
- **Identity:** authentication mechanisms such as **digital signatures, certificates and cryptographic authentication protocols**.

**In conclusion:** web security must address integrity, confidentiality, availability and authentication; each threat needs its own countermeasure, although denial of service remains particularly hard to prevent.

## The Internet Topology and Protocol Stack

**The lecture's example network**
- Host A → wireless LAN → access point (acts as a bridge onto Ethernet) → Router X → across the Internet → Router Y → Ethernet → Host B.
- Hosts A and B run the full stack: application, TCP or UDP, IP, data link (DL), physical (PHY).
- The **access point** works only at the data link and physical layers.
- The **routers** work up to the IP layer.

**Layer 2 devices (e.g. a switch)**
- Help traffic between devices **within a LAN** reach each other.
- Keep a table of learned **MAC addresses** and the physical port for each.
- MAC addresses operate at Layer 2, so MAC-switched traffic stays within the LAN.

**Layer 3 devices (e.g. a router)**
- Needed when traffic crosses between LANs or VLANs.
- Look at the source and destination **IP addresses** to decide how to forward each packet.
- Hold information about multiple networks (LAN, WAN, VLAN) and pass traffic between them = **routing**.
- A **Layer 3 switch** sits between a Layer 2 switch and a gateway router: more than a Layer 2 switch, less than a full router.

**In conclusion:** knowing which devices process which layers explains what each security approach protects and what an attacker on the path can still see.

## Application-Level Security

**Definition:** security mechanisms are implemented **inside the application itself**; the application on Host A protects data before transmission.

**Typical mechanisms**
- Encryption with an algorithm such as **AES** (preferably via a well-established cryptographic library, not self-implemented).
- Example: a new instant messaging app needs the UI and messaging features **plus** AES encryption, secure key exchange, authentication, and cryptographic hashes or MACs for integrity.

**How data flows**
1. The application generates data and **encrypts** the parts that need protection.
2. Transport layer: TCP adds its header → segment.
3. Network layer: IP adds its header → packet.
4. Data link layer: packet encapsulated into a frame and transmitted (e.g. over Wi-Fi).

**What an attacker sees (e.g. with Wireshark)**
- Usually the source and destination IP addresses and port numbers (ports may hint at the application).
- If encryption is done correctly, **cannot read** the sensitive data without the keys.
- Some application metadata or headers may still be visible.

**Advantages**
- ✅ **True host-to-host, end-to-end protection**: data is encrypted by the application on Host A and stays encrypted until the application on Host B, so intermediate routers and servers cannot read it.

**Disadvantages**
- ❌ Each application must implement common security mechanisms itself and integrate and configure them correctly.
- ❌ Incorrect implementations introduce serious vulnerabilities → never design your own algorithms or implement primitives from scratch; use trusted, well-tested libraries and established protocols.

**Examples:** SSH, S/MIME for email, OpenPGP.

**In conclusion:** application-level security gives true end-to-end protection tailored to one application, at the cost of every application having to implement security correctly on its own.

## Transport-Level Security (TLS/SSL)

**Definition:** the application does not implement its own encryption but relies on an established security protocol provided by an OS or library API.

- **TLS** (Transport Layer Security) evolved from the older **SSL** (Secure Sockets Layer). SSL is now obsolete; modern applications use TLS.
- A TLS layer sits **between the application protocol and TCP**.
- The application uses a TLS library to set up a secure connection; the library handles encryption, authentication and integrity.
- TCP is normally implemented in the OS, but TLS is usually implemented in **user-space libraries**.

**How data flows**
1. The application passes data to the **TLS layer** instead of directly to TCP.
2. TLS encrypts the data and adds the information needed for secure transmission.
3. The resulting TLS records go to TCP → IP → data link layer.
- Key point: TLS encrypts **before** data reaches TCP; TCP itself encrypts nothing.

**What an attacker sees**
- IP addresses, TCP port numbers, some TLS handshake information and other unencrypted metadata.
- Cannot read the application data without the keys.

**Example library: OpenSSL**
- The developer implements the main functionality and calls OpenSSL's programming interfaces.
- OpenSSL negotiates algorithms, performs key exchange, verifies certificates and encrypts data before sending it over TCP.
- The developer must still configure and use it correctly, but writes no cryptographic code.
- TLS is used by TCP-based applications such as **HTTPS, FTPS and SMTP**.

**Advantages**
- ✅ Host-to-host encryption between the TLS endpoints (protects against eavesdropping and modification).
- ✅ Simpler applications: standardised, well-tested libraries instead of custom security.
- ✅ Widely supported across operating systems, languages and applications.

**Disadvantages**
- ❌ Applies only to specific transport protocols; applications must be written to use the security API.
- ❌ Traditional TLS runs over reliable, connection-oriented TCP; for UDP there is **DTLS** (Datagram TLS).
- ❌ Using TCP does not give encryption: developers must establish TLS connections, validate certificates properly and configure security settings.
- ❌ Protects data only between TLS endpoints → **not true end-to-end** if an intermediate server terminates the TLS connection.

**Combining levels**
- Example: an email encrypted with **S/MIME** (application level) sent over a **TLS-protected connection**. S/MIME protects the message itself; TLS protects the channel.

**In conclusion:** transport-level security lets any TCP application gain strong, standardised protection through a library such as OpenSSL, as long as the application is built to use it.

## Network-Level Security (IPsec)

**Definition:** security is applied at the **IP layer** using IPsec (Internet Protocol Security).

- The application needs **no special encryption code**; TCP and UDP need no modification.
- Flow: application → TCP/UDP adds header with port numbers → network layer protects the packet with IPsec → transmit.
- IPsec usually uses **ESP (Encapsulating Security Payload)** for encryption, integrity and data-origin authentication.
- Unlike TLS (specific application connections), IPsec protects **any IP traffic**: TCP, UDP or other IP-based protocols.

**What an attacker sees depends on the mode**

| Mode | What is protected | What the attacker sees |
|---|---|---|
| **Transport mode** | Payload of the original IP packet (TCP/UDP header + application data); original IP header stays visible so routers can forward | Source and destination IP addresses, but not port numbers or data |
| **Tunnel mode** | The entire original IP packet, including its IP header; a new outer IP header is added for routing | Only the addresses of the tunnel endpoints; internal IP addresses, ports and data stay hidden |

- Hiding transport-layer information (and in tunnel mode the internal addresses) is an important advantage.

**IPsec can be used end to end or router to router**
- Router-to-router case: Router X and Router Y apply IPsec.
  1. A → X: ordinary packet (A to B, data).
  2. Across the Internet: protected packet with an outer header X→Y wrapping the encrypted A-to-B packet.
  3. At Y: unwrapped, then travels on to B.
- This is **tunnelling**: packets at one layer encapsulated inside packets at the same layer (IP inside IPsec).
- Tunnelling creates a **Virtual Private Network (VPN)**; security support and configuration can sit on routers instead of every host.
- Other tunnelling protocols: Point-to-Point Tunneling Protocol, Layer 2 Tunneling Protocol.
- ⚠️ Router-to-router tunnelling is **not end-to-end**: traffic is unprotected inside each internal network.

**Advantages**
- ✅ Supports all applications and transport protocols.
- ✅ Provides host-to-host encryption transparently.
- ✅ Example: an IPsec VPN between two offices → every application communicates securely without its own encryption.

**Disadvantages**
- ❌ Needs support and configuration in the operating system.
- ❌ Mostly used for tunnelling.
- ❌ Configuration and management (security associations, keys, network policies) are more complex than TLS.
- ❌ Extra headers and encryption overhead can affect performance.

**In conclusion:** IPsec protects all IP traffic independently of applications and transport protocols, and in tunnel mode can hide ports and internal addresses, but it does not always give true application-to-application protection.

## Link-Level Security (WPA)

**Definition:** security applied at the **data link layer (Layer 2)**, protecting communication over **one specific network link**.

- Common example: **Wi-Fi Protected Access (WPA)** — currently WPA2 and WPA3 — securing wireless communication.
- Others: older **WEP**, Bluetooth encryption, ZigBee encryption.
- Security is established between the laptop and the wireless access point.

**How it works**
- Data flow: application → TCP/UDP → IP header → packet encapsulated into a Wi-Fi frame.
- WPA then **encrypts and integrity-protects the frame's payload**, so the whole IP packet (including TCP/UDP header and data) is encrypted inside the frame.
- Some Wi-Fi header fields stay visible because the network needs them to deliver and manage frames.
- Before encryption, devices must **authenticate and establish keys**. In WPA2-Personal:
  1. The user enters the Wi-Fi password.
  2. Keying material is derived from it.
  3. Laptop and access point perform the **4-Way Handshake** to establish encryption keys.
- WPA2 commonly uses **AES-based CCMP** for confidentiality and integrity.

**What a nearby attacker (adapter in monitor mode) sees**
- Unencrypted Wi-Fi header info: MAC addresses, frame sizes, timing.
- Cannot read IP addresses, port numbers or data inside the encrypted payload.

**How the approaches differ in what stays visible**

| Approach | Visible to an attacker |
|---|---|
| TLS | IP addresses and ports |
| IPsec ESP | Transport info hidden; IP addresses depend on mode |
| WPA | Whole IP packet hidden over the wireless link; MAC addresses remain visible |

- At the access point the frame is decrypted and forwarded, so **protection ends there**.
- Example: on public Wi-Fi, WPA protects an HTTP request between laptop and access point but not across the rest of the Internet; HTTPS adds TLS protection all the way to the TLS endpoint.

**Advantages**
- ✅ Covers all data on the link, independent of application, transport and network protocols.
- ✅ Transparent to applications (OS, drivers and hardware handle it).

**Disadvantages**
- ❌ Encryption covers only the link.
- ❌ Both endpoints of the link must be configured.
- ❌ Strength depends on configuration: weak passwords, outdated settings or compromised access points reduce protection.

**In conclusion:** link-level security such as WPA2 or WPA3 protects everything sent over one link, but because protection ends at the access point, TLS or IPsec is still needed beyond the local network.

## Comparing the Security Options in TCP/IP

| Option | Protects | Scope | Implemented in |
|---|---|---|---|
| **IPsec** | IP datagrams | General solution for all Internet traffic | Operating system |
| **SSL/TLS** | TCP segments | General solution for all TCP-based applications | Libraries or applications |
| **Application-specific security** | Application messages | Specific to each application | A single application |

**Key principle:** the **lower** the layer at which security is implemented, the **broader** the traffic it can protect.
- Security built for email does not protect web browsing.
- **TLS** can protect many TCP applications (web, email transmission, file transfer) but is not automatic: applications must be designed or configured to use it.
  - For UDP: **DTLS**. HTTP/3 uses TLS 1.3 integrated into QUIC over UDP.
- **IPsec** protects traffic regardless of TCP, UDP or other IP protocol, so an IPsec VPN can protect many applications without changing any.

**In practice**
- Most widely used: **application-level security and TLS** — SSH for remote access, S/MIME and OpenPGP for email/messages, TLS for the web (HTTPS).
- IPsec is widely used in **VPNs, enterprise networks and site-to-site links**, but rarely as the main protection for ordinary web browsing.

**In conclusion:** the right choice depends on what must be protected, where protection must apply, and whether it must cover the whole communication path.

## Web Browsing with HTTP and Dynamic Web Applications

**HTTP basics**
- **Request/response** protocol: the user agent (browser) sends a request message; the server sends a response message.
- Messages are **plain text**.
- **Stateless:** no dependence between one request and the previous one.
  - Another page = another request; each image on a page is fetched with its own request and response.
- Before any HTTP request, the browser establishes a **TCP connection** to the server.
- Ports identify applications: server default port for HTTP = **80**; the browser's port is chosen unpredictably by its OS.
- TCP segments are carried across the Internet by IP (which specifies the IP addresses).

**Static vs dynamic content**
- Static pages: HTML, images and other files served as-is.
- **Dynamic content:** what the server returns depends on the request and is tailored to the user.
  - Client-side technologies: JavaScript, Flash, Java.
  - Server-side technologies: ASP, PHP, Java; content stored in databases.
  - Example: browser requests a PHP page → web server passes it to the PHP engine → engine retrieves data from the database after authentication → response returned over HTTP.
  - Because content is user-specific, such sites need **authentication**.

**Security issues and their solutions**

| Issue | Solution |
|---|---|
| Data between browser and server needs confidentiality (anyone on the path can see unprotected data) | Encryption with **HTTPS** |
| Browser must be sure it talks to the intended server (e.g. a reply really from your bank) | **Digital certificates** |
| Server must be sure it talks to the intended user | **Password authentication and session management** |
| Actions performed by the server must be appropriate | **Authentication and access control** |

- Session management is needed because HTTP is stateless: the server uses something like a **session ID** to link one request to the next.
- The username and password must themselves be sent encrypted.

**In conclusion:** plain HTTP is stateless and unencrypted, so web applications need HTTPS, certificates, password authentication, session management and access control to be secure.

## HTTPS (HTTP over SSL/TLS)

**Definition:** HTTPS is the combination of HTTP and SSL/TLS used to secure communication between a browser and a web server.

**Key facts**
- Built into all modern browsers; URLs begin with **https://**.
- Normal HTTP uses port **80**; HTTPS uses port **443** (invokes SSL/TLS).
- The **server** is authenticated using a **certificate** (through SSL/TLS); the **client** is authenticated using a **password** (through HTTP).
- Documented in **RFC 2818** (HTTP Over TLS). Because there is no fundamental difference between HTTP over SSL or TLS, both are called HTTPS.
- *Note:* the lecture says search engines do not support HTTPS; this comes from an older edition of the textbook. Today most search engines use HTTPS by default.

**What is encrypted in HTTPS**
- The URL of the requested document.
- The contents of the document.
- The contents of browser forms filled in by the user.
- Cookies sent in both directions.
- The contents of the HTTP header.

**Connection initiation**
1. The agent acting as HTTP client also acts as the **TLS client**.
2. It opens a connection to the server on the appropriate port.
3. It sends the TLS **ClientHello** to begin the handshake.
4. After the handshake, the client sends its first HTTP request; all HTTP data is sent as **TLS application data**.

- Three levels of connection awareness:
  - **HTTP level:** client requests a connection from the next lowest layer (usually TCP, may be TLS).
  - **TLS level:** a **session** is established between TLS client and server; it can support one or more connections.
  - **TCP level:** a TLS connection begins with a TCP connection.

**Connection closure**
- HTTP client or server can include **"Connection: close"** to show the connection will be closed after the current record.
- Closing an HTTPS connection requires TLS to close with its peer, which also closes the underlying TCP connection.
- Proper way: each side sends a **close_notify** alert (TLS alert protocol) before closing.
- **Incomplete close:** an implementation sends its closure alert and closes without waiting for the peer's. It may reuse the session if it knows it has received all the data it needs.
- HTTP clients must cope with a TCP connection that ends **without** close_notify or "Connection: close". It may be a programming error or communication failure, but could be evidence of an **attack** → the client should issue a security warning.

**How TLS secures HTTPS (from the speaker notes)**
1. The server presents its **digital certificate** (contains its public key; issued by a trusted **Certificate Authority**, CA).
2. The browser checks the certificate is signed by a trusted CA and has not expired.
3. The browser generates a **pre-master secret**, encrypts it with the server's public key and sends it.
4. The server decrypts it with its private key; both sides derive the **session keys**.
5. Data is protected with **symmetric encryption** using the session keys.
6. Integrity is protected with hash-based MACs such as **HMAC** (detect unauthorised modification).

- **Perfect forward secrecy (PFS):** new session keys per connection, so even if the server's private key is stolen later, past communication cannot be decrypted.
- **Renegotiation:** client and server can refresh session keys without opening a new connection.

**In conclusion:** HTTPS runs ordinary HTTP inside TLS on port 443, encrypting URLs, content, forms, cookies and headers, authenticating the server with a certificate, and requiring careful handling of connection closure.

## Secure Sockets Layer and Transport Layer Security

**Definition:** SSL is one of the most widely used security services — a general-purpose service implemented as a set of protocols that rely on **TCP**. It later became the Internet standard **TLS (RFC 2246)**, securing application protocols that use TCP.

**Two implementation choices**
- Provided as part of the underlying protocol suite, **transparent** to applications.
- **Embedded** in specific packages.
  - Browsers (Chrome, Firefox) have built-in HTTP and TLS; most web servers implement the protocol.
  - Libraries such as **OpenSSL**; a Python program can use the `requests` library to talk securely to an HTTPS server.
- Unlike TCP/IP (usually in the OS), HTTP and TLS are usually in **user-space applications or libraries**.
- Normal browser stack: HTTP sits directly on TCP. Secure stack: **SSL sits between HTTP and TCP**.

**SSL is two layers of protocols**
- **Lower layer: SSL Record Protocol** — sits on TCP; provides **confidentiality** and **message integrity** to the protocols above it (including HTTP).
- **Upper layer: three SSL-specific protocols**
  - **Handshake Protocol:** authenticates entities and negotiates parameter values.
  - **Change Cipher Spec Protocol:** changes the cipher in use for the connection.
  - **Alert Protocol:** alerts the peer to status, warnings and errors.
- Before communicating securely, client and server perform the handshake to negotiate the **TLS version, encryption algorithms and key exchange mechanism**.

**In conclusion:** SSL/TLS is a layered set of protocols on top of TCP; the record protocol provides protection and three higher protocols manage the handshake, cipher changes and alerts.

## SSL Sessions and Connections

| | SSL **connection** | SSL **session** |
|---|---|---|
| What it is | Temporary peer-to-peer communication channel between client and server | Logical association between client and server |
| Created by | Underlying TCP connection (every TCP connection = an SSL connection) | The Handshake Protocol |
| Lifetime | Same as the TCP connection: opened with the three-way handshake (SYN, SYN-ACK, ACK), closed with FIN | Can outlive many connections |
| Holds | Connection state | Cryptographic security parameters shared by its connections |

- A client and server may have **multiple connections**; each connection is associated with **one session**.
- A session can be shared by many connections.
  - Example: negotiate a session at the start, then use the same algorithms and parameters for every TCP connection opened over the next five minutes.
- Setting up a session takes considerable effort, so **reusing it avoids repeating a full handshake**.

**State stored after the handshake**
- **Session state:** session ID, certificate, compression method, cipher spec.
- **Connection state:** random values, encryption keys, MAC secrets, sequence numbers.

**Session resumption (via SSL session IDs)**
1. After a fully negotiated connection ends, client and server keep the session parameters for a while.
2. The server assigns a unique **session ID** and sends it to the client in **ServerHello**.
3. To resume, the client sends that session ID in its **ClientHello**.
4. If the server finds the session in its cache and accepts it → returns the same session ID and continues with an **abbreviated handshake**.
5. Otherwise → issues a new session ID and performs a **full handshake**.

**In conclusion:** a session holds the negotiated security parameters and can be shared by many connections, which reduces the cost of repeated handshakes.

## The SSL Record Protocol

**Two services for SSL connections**
- **Confidentiality:** the Handshake Protocol defines a shared secret key for symmetric encryption of SSL payloads.
- **Message integrity:** the Handshake Protocol also defines a shared secret key used to form a **message authentication code (MAC)**.

**Five steps for processing application data**
1. **Fragment** each upper-layer message into blocks of 2¹⁴ bytes (16,384) or less.
2. **Compress** (optional).
3. Compute a **MAC** over the compressed data.
4. **Encrypt** the compressed message plus MAC with symmetric encryption.
5. Prepend an **SSL record header**.

**The SSL record header**
- **Content type** (8 bits): the higher-layer protocol that should process the fragment.
- **Major version** (8 bits): 3 for SSLv3 (plus a minor version field).
- **Compressed length** (16 bits): length in bytes of the plaintext or compressed fragment; maximum 2¹⁴ + 2048.

**Defined content types:** change_cipher_spec, alert, handshake, application_data.
- The first three are the SSL-specific protocols.
- SSL makes no distinction between applications (e.g. HTTP) that use it; their data is opaque to SSL.

**Receiving:** the record travels in a TCP segment; on receipt the data is **decrypted, verified, decompressed and reassembled**, then delivered to the higher layer.

**In conclusion:** the Record Protocol fragments, optionally compresses, authenticates with a MAC, encrypts and labels every piece of data that SSL carries.

## The Change Cipher Spec and Alert Protocols

**Change Cipher Spec Protocol** (the simplest of the three SSL-specific protocols)
- Consists of **one message**: a single byte with the value **1**.
- Only purpose: cause the **pending state** to be copied into the **current state**, updating the cipher suite used on the connection.
- Signals that all following records will be protected with the parameters negotiated in the handshake → the switch to the encrypted state.

**Alert Protocol**
- Conveys SSL-related alerts to the peer.
- Alert messages are compressed and encrypted according to the current state, like other SSL data.
- Each message is **two bytes**:
  - **Byte 1 — severity:** warning (1) or fatal (2).
    - Fatal → SSL terminates the connection immediately; other connections on the same session may continue, but **no new connections** may be established on that session.
  - **Byte 2 — code** for the specific alert.
- Examples: **incorrect MAC** (fatal); **close_notify** (non-fatal; sender will send no more messages on the connection).
- Alerts can report:
  - handshake failures (cannot agree on a cipher suite, cannot verify the server's certificate);
  - certificate problems (expired, revoked, untrusted);
  - compression or decompression failures;
  - unexpected termination;
  - protocol version mismatches.

**In conclusion:** the Change Cipher Spec Protocol switches the connection to the newly negotiated cipher with a single byte, and the Alert Protocol reports warnings and fatal errors in two-byte messages.

## The SSL Handshake Protocol

**Definition:** the most complex part of SSL. Used **before** any application data is transmitted. It lets server and client:
- authenticate each other,
- negotiate encryption and MAC algorithms,
- negotiate the cryptographic keys used to protect SSL records.

It is a series of messages organised into **four phases**.

**Phase 1 — Establish security capabilities**
- Client sends **client_hello** containing:
  - highest SSL version it understands;
  - a **random** structure: 32-bit timestamp + 28 bytes from a secure random generator (used in key exchange to prevent replay attacks);
  - a **session ID**: non-zero = update an existing connection or create a new connection on an existing session; zero = new connection on a new session;
  - a **cipher suite list** in decreasing order of preference (each defines a key exchange algorithm and a CipherSpec);
  - a list of supported **compression methods**.
- Server replies with **server_hello** containing the same parameters.

**Phase 2 — Server authentication and key exchange** (details depend on the public-key scheme)
- The server may send: its **certificate**, additional key information (**server_key_exchange**), and a request for the client's certificate (**certificate_request**).
- The final message, always required: **server_hello_done**; then the server waits for the client.

**Phase 3 — Client authentication and key exchange**
- Client verifies that the server provided a valid certificate (if required) and that the server_hello parameters are acceptable.
- Then sends: its certificate (if requested), its key exchange message (**client_key_exchange**), and possibly a **certificate_verify** message.

**Phase 4 — Finish**
- Client sends **change_cipher_spec** (strictly part of the Change Cipher Spec Protocol, not the Handshake Protocol) → copies pending CipherSpec into the current one.
- Client immediately sends **finished** under the new algorithms and keys (verifies key exchange and authentication succeeded).
- Server responds with its own change_cipher_spec and finished.
- Handshake complete → **application data** can be exchanged.

**In conclusion:** the four-phase handshake lets client and server agree on algorithms, authenticate each other and establish keys before any application data is sent.

## Secure Email: MIME and S/MIME

**Background: from plain text to MIME**
- Email was originally plain text with predefined headers (To, From, Subject, CC).
- **MIME** (Multipurpose Internet Mail Extensions) allows different message and header formats: other character sets, attachments and new headers.
- MIME **extends RFC 822**, which defines a simple header (To, From, Subject) for routing and assumes plain ASCII text; RFC 822 does not specify how to carry binary data.

**What MIME adds**
- New header fields (e.g. **Content-Type**, **Content-Disposition**) describing the body's format and how to display it.
- Content types for text, HTML, images, audio, video and applications (e.g. `image/jpeg`, `application/pdf`).
- Encodings such as **base64** and **quoted-printable** so binary data can travel safely through SMTP.
- Result: messages can mix plain and rich text, have several parts, include attachments (PDFs, Word documents), and be fragmented transparently to the recipient.

**Two requirements of secure email**
- **Authentication:** the receiver can confirm the actual sender and that content is unmodified.
- **Confidentiality:** only sender and receiver can read the content.

**Two implementations:** **S/MIME** (Secure/MIME) and **OpenPGP** (Pretty Good Privacy). Both:
1. Sign the message with the sender's **private key**.
2. Encrypt the message with **symmetric encryption** using a secret key.
3. Encrypt that secret key with the **recipient's public key**.

- S/MIME is a security enhancement to the MIME format, based on technology from RSA Data Security; it can sign and/or encrypt messages.

**A typical S/MIME process (textbook Figure 22.1): Bob sends to Alice**
1. Bob starts with the plaintext message.
2. Adds a **digital signature** made with his private key (DSS/SHA in the figure).
3. Encrypts message + signature with a **one-time session key** (Triple DES in the figure).
4. Encrypts the session key with **Alice's public key** (ElGamal in the figure) and attaches it.
5. Converts the whole document to **radix-64**.

**S/MIME's four functions**
- **Enveloped data:** encrypted content of any type + content-encryption keys, encrypted for one or more recipients.
- **Signed data:** message digest encrypted with the signer's private key; content + signature encoded in base64 → only recipients with S/MIME can view it.
- **Clear-signed data:** also forms a signature, but **only the signature** is base64-encoded → recipients without S/MIME can still read the message (though cannot verify the signature).
- **Signed and enveloped data:** signed and encrypted entities can be nested (encrypted data may be signed; signed data may be encrypted).

**Signing algorithms**
- Slide: **RSA with SHA-1**; RSA can also be used with SHA-1 or MD5 to form signatures.
- Speaker notes (modern process with **SHA-256**):
  1. Map the message to a **256-bit digest** (practically unique, so the message cannot be altered or substituted undetected).
  2. Encrypt the digest with RSA and the sender's private key → the **signature**, attached to the message.
  3. A recipient recomputes the digest and decrypts the signature with the sender's public key to compare.
  - Only a 256-bit block is encrypted/decrypted → fast.

**Why radix-64?**
- The signature is binary; some email software interprets control characters such as line feeds, which could alter it.
- So the signature (or signature + message) is mapped into printable ASCII using **radix-64 (base64)**: every **3 bytes** of binary data → **4 ASCII characters**.

**In conclusion:** MIME lets email carry rich content, and S/MIME adds signatures and encryption by combining a private-key signature, a symmetric session key and the recipient's public key, with base64 encoding for safe transport.

## Email Standards in Detail: RFC 822, SMTP, MIME and Radix-64

*Quick-revision bullet notes. Each topic ends with text-based reference articles (GeeksforGeeks and others) for more detail.*

### RFC 822: the Internet text message format

**What it is**
- "Standard for the Format of ARPA Internet Text Messages", published in **1982**.
- Defines the **format of an email message**, not how it is sent (sending is SMTP's job).
- Later updated by **RFC 2822** (2001) and **RFC 5322** (2008), which are still based on it.

**Properties**
- A message = **envelope** + **contents**.
  - Envelope: the information needed for transmission and delivery (used by SMTP).
  - Contents: the object to be delivered = **header lines** + **a blank line** + **body**.
- Each header line has the form **`Keyword: value`**, e.g. `From:`, `To:`, `Cc:`, `Bcc:`, `Subject:`, `Date:`, `Reply-To:`, `Message-ID:`, `Received:`.
- A header can continue onto the next line if that line starts with whitespace (folding).
- The body is **plain US-ASCII text** only (7-bit characters).
- Lines end with **CRLF**.
- Defines the standard address syntax, e.g. `user@domain`.

**Advantages**
- **Simple**: plain text, easy for people to read and write.
- **Easy to parse and implement**, so it was adopted universally.
- **Standard headers** give consistent routing and basic information (sender, recipients, subject, date).
- **Extensible**: new header fields can be added, which is how MIME was later built on top of it.

**Disadvantages and limitations**
- ❌ **No attachment support**: it cannot carry executable files or other binary objects.
- ❌ **ASCII only**: no national-language characters (8-bit codes such as Arabic, Chinese or accented letters).
- ❌ **No multimedia**: no images, audio or video; text only.
- ❌ **No structure in the body**: a message cannot contain several parts.
- ❌ **No security**: no encryption, no integrity check, and the `From:` field can be forged (spoofing).
- ❌ Problems in transit with SMTP:
  - servers may reject mail over a certain size;
  - gateways translating between ASCII and EBCDIC use inconsistent mappings;
  - gateways to X.400 networks cannot handle non-text data;
  - some SMTP implementations alter messages: adding or removing CR/LF, wrapping or truncating lines longer than 76 characters, removing trailing whitespace, padding lines to the same length, and converting tabs into spaces.
- ➡️ These limitations are exactly why **MIME** was created.

**Further reading:** [RFC 822 full text (RFC Editor)](https://www.rfc-editor.org/rfc/rfc822) · [RFC 822 at W3C](https://w3.org/Protocols/rfc822) · [Working of Email (GeeksforGeeks)](https://www.geeksforgeeks.org/computer-networks/working-of-email/)

### SMTP: Simple Mail Transfer Protocol

**What it is**
- The application-layer protocol that **sends and relays email** between mail servers.
- Defined in **RFC 821** (1982), now **RFC 5321**.
- Runs over **TCP**, so delivery is reliable and connection-oriented.
- It is a **push protocol**: it pushes mail from the sender toward the receiver's server. It **cannot fetch mail**, so users read mail with **POP3** or **IMAP**.

**Ports**
- **25**: server-to-server relay.
- **587**: mail submission from a client, usually upgraded to TLS with **STARTTLS**.
- **465**: SMTPS (SMTP over implicit TLS).

**Components (the mail path)**
- **MUA (Mail User Agent)**: the email client, e.g. Outlook or Gmail, where you write and read mail.
- **MSA (Mail Submission Agent)**: accepts mail from the MUA.
- **MTA (Mail Transfer Agent)**: relays mail between servers using SMTP.
- **MDA (Mail Delivery Agent)**: stores the mail in the recipient's mailbox.
- Path: sender MUA → (SMTP) → sender's server → (SMTP) → receiver's server → (POP3/IMAP) → receiver MUA.

**How a session works (three phases)**
1. **Connection establishment**: TCP connection, server replies `220` (ready), client says `HELO` or `EHLO` (extended SMTP).
2. **Mail transfer**:
   - `MAIL FROM:<sender>` gives the envelope sender.
   - `RCPT TO:<recipient>` gives each recipient (one command per recipient).
   - `DATA`, then the server replies `354`; the client sends the RFC 822 message (headers + blank line + body) and ends it with a line containing only `.`.
   - The server replies `250 OK`.
3. **Connection termination**: `QUIT`, and the server replies `221` and closes.
- Other commands: `RSET` (reset), `VRFY` (verify an address), `NOOP` (no operation), `HELP`.
- Replies are **3-digit codes**: 2xx success, 3xx more input needed, 4xx temporary failure, 5xx permanent failure.

**Properties**
- Text-based commands and replies, so it is human-readable.
- Classic SMTP carries only **7-bit ASCII** data, matching RFC 822.
- Uses the **envelope** (MAIL FROM / RCPT TO) separately from the message headers (From: / To:).

**Limitations**
- ❌ Cannot carry binary data or non-ASCII text without MIME encoding.
- ❌ **No built-in security**: originally no encryption and no sender authentication, which allows **spoofing** and **spam**.
  - Fixes are extensions: **STARTTLS** (encryption), **SMTP-AUTH** (login), plus SPF, DKIM and DMARC (sender verification).
- ❌ Some servers limit message size.
- ❌ Push-only: a separate protocol is needed to retrieve mail.

**Further reading:** [Simple Mail Transfer Protocol (GeeksforGeeks)](https://www.geeksforgeeks.org/computer-networks/simple-mail-transfer-protocol-smtp/) · [SMTP Commands (GeeksforGeeks)](https://www.geeksforgeeks.org/computer-networks/smtp-commands/) · [IMAP vs POP3 vs SMTP (GeeksforGeeks)](https://www.geeksforgeeks.org/computer-networks/imap-vs-pop3-vs-smtp/)

### MIME: Multipurpose Internet Mail Extensions

**What it is**
- An **extension of RFC 822** that fixes its limitations, defined in **RFC 2045–2049** (1996).
- Lets email carry **non-ASCII text, attachments, images, audio, video and multi-part messages**.
- It is **compatible with RFC 822 and SMTP**: it converts everything into 7-bit ASCII-safe text before sending, so old servers still work.

**Properties: the five new header fields**
- **`MIME-Version`**: must be `1.0`; shows that the message follows MIME.
- **`Content-Type`**: the type and subtype of the data, e.g. `text/plain`, `image/jpeg`, `application/pdf`.
- **`Content-Transfer-Encoding`**: how the body was encoded for transport, e.g. `base64`.
- **`Content-ID`**: a unique identifier for a body part (used to reference it, e.g. an inline image).
- **`Content-Description`**: a plain-text description of the object, e.g. "Photo of the lab".
- (Also commonly used: **`Content-Disposition`**, which says whether a part is shown inline or as an attachment, with a filename.)

**Properties: the seven content types**
- **text**: `plain`, `enriched`, `html`; character sets other than ASCII are allowed.
- **multipart**: several parts separated by a **boundary** string.
  - `mixed`: independent parts in order (body + attachments).
  - `parallel`: parts with no order.
  - `alternative`: the same content in different formats (e.g. plain text and HTML); the client shows the best one.
  - `digest`: each part is itself an RFC 822 message.
- **message**: `rfc822` (an encapsulated email), `partial` (a large message fragmented into pieces, reassembled transparently for the recipient), `external-body` (a pointer to data stored elsewhere).
- **image**: `jpeg`, `gif`.
- **video**: `mpeg`.
- **audio**: `basic`.
- **application**: `postscript`, `octet-stream` (generic binary), and others such as `pdf`.

**Properties: transfer encodings**
- **7bit**: short lines of ASCII; no encoding needed (the default).
- **8bit**: short lines that may contain non-ASCII characters.
- **binary**: any data, any line length (not safe over classic SMTP).
- **quoted-printable**: mostly-ASCII text stays readable; only special bytes become `=XX` in hex (e.g. `=E9` for é).
- **base64 (radix-64)**: any binary data becomes ASCII-safe text (see below).
- **x-token**: a non-standard, named encoding.

**Further reading:** [MIME Protocol (GeeksforGeeks)](https://www.geeksforgeeks.org/computer-networks/multipurpose-internet-mail-extension-mime-protocol/) · [MIME Media Types (GeeksforGeeks)](https://www.geeksforgeeks.org/html/mime-media-types/) · [What is S/MIME? (GeeksforGeeks)](https://www.geeksforgeeks.org/computer-networks/what-is-s-mime/) · [PGP vs S/MIME (GeeksforGeeks)](https://www.geeksforgeeks.org/difference-between-pgp-and-s-mime/)

### Radix-64 (Base64) encoding

**Why it is needed**
- Encrypted data and digital signatures are **binary** (any byte value 0–255).
- Email (RFC 822 / SMTP) safely carries only printable 7-bit ASCII, and some mail software alters control characters such as CR/LF.
- Radix-64 maps binary data into **printable ASCII characters** that survive every mail system unchanged. S/MIME and PGP use it for signatures and encrypted messages.

**How it works**
1. Take the input **3 bytes (24 bits)** at a time.
2. Split the 24 bits into **four 6-bit groups**.
3. Each 6-bit value (0–63) is an index into the **64-character alphabet**:
   - `A`–`Z` = 0–25
   - `a`–`z` = 26–51
   - `0`–`9` = 52–61
   - `+` = 62, `/` = 63
4. Output the **4 characters**: so **3 bytes in → 4 characters out**.
5. **Padding**: if the last group has only 1 or 2 bytes, pad with zero bits and add `=`:
   - 2 bytes left → 3 characters + `=`
   - 1 byte left → 2 characters + `==`

**Worked example: encoding "Man"**
- ASCII: `M` = 77, `a` = 97, `n` = 110.
- Binary: `01001101 01100001 01101110` (24 bits).
- Regroup into 6 bits: `010011 | 010110 | 000101 | 101110`.
- Decimal: 19, 22, 5, 46.
- Characters: 19 = `T`, 22 = `W`, 5 = `F`, 46 = `u`.
- Result: **`Man` → `TWFu`**.
- With padding: `Ma` → **`TWE=`**, and `M` → **`TQ==`**.

**Properties**
- ✅ **Size grows by about 33%** (every 3 bytes become 4 characters, a ratio of 4/3).
- ✅ The character set is **universally representable**: it avoids characters with special meaning to SMTP (such as `.` or CR/LF), so it is safe through all gateways.
- ✅ Encoding is **blind to the content**: it works the same for any binary data, including compressed or encrypted data.
- ✅ In MIME, encoded lines are limited to **76 characters**.
- ✅ In PGP, radix-64 output also includes a **CRC-24 checksum** to detect transmission errors (called "ASCII armor").
- ⚠️ It is **encoding, not encryption**: anyone can decode it, so it gives no confidentiality.

**Further reading:** [Base64 (Wikipedia, with the encoding table)](https://en.wikipedia.org/wiki/Base64) · [Encode an ASCII string into Base-64 (GeeksforGeeks, step-by-step example)](https://www.geeksforgeeks.org/dsa/encode-ascii-string-base-64-format/) · [Binary-to-text encoding (Wikipedia)](https://en.wikipedia.org/wiki/Binary-to-text_encoding)


## IP Security (IPsec)

**Definition:** IPsec provides general IP security mechanisms that can secure communication across a LAN, private and public WANs, and the Internet.

**Three functional areas**
- **Authentication:** a received packet was actually sent by the party named as its source and was not altered in transit.
- **Confidentiality:** nodes can encrypt messages to prevent eavesdropping.
- **Key management:** secure exchange of keys.

- Current version **IPsecv3** covers authentication and confidentiality.
- Key management is provided by **IKEv2** (Internet Key Exchange), which uses the **Diffie-Hellman** key exchange protocol.

**Key feature**
- Can encrypt and/or authenticate **all traffic at the IP level**, so every distributed application (remote logon, client/server, email, file transfer, web access) can be secured.
- Typical scenario: a user system with IPsec and networking devices with IPsec at the edge of each LAN communicate across a public or private network.
  - Inside each LAN: ordinary IP header + payload.
  - Across the public network: IPsec header + secure payload.

**Benefits**
- ✅ In a firewall or router: strong security for all traffic crossing the perimeter, with no overhead for traffic inside the company.
- ✅ In a firewall: resistant to bypass if all outside traffic must use IP and the firewall is the only way in.
- ✅ Below the transport layer → **transparent to applications** (no software changes on user or server systems).
- ✅ Can be transparent to end users: no training, no per-user keys, no revoking keys when users leave.
- ✅ Can still secure individual users when needed (e.g. off-site workers, or a secure virtual subnetwork for sensitive applications).

**Scope**
- **ESP (Encapsulating Security Payload):** combined authentication and encryption function.
- **Key exchange:** manual and automated.
- VPNs want both authentication and encryption: keep unauthorised users out and stop eavesdroppers from reading messages.
- **AH (Authentication Header):** authentication-only function. Because ESP already provides message authentication, **AH is deprecated** (kept in IPsecv3 only for backward compatibility).

**Key documents** (the specification is complex and spread over many documents)
- RFC 2401 — Security Architecture for the Internet Protocol
- RFC 4302 — IP Authentication Header
- RFC 4303 — IP Encapsulating Security Payload
- RFC 4306 — Internet Key Exchange (IKEv2)

**ESP header** (comes before the encrypted payload; two fields)
- **Security Parameters Index (SPI, 32 bits):** identifies the **security association (SA)** for the packet — tells the receiver which key and algorithms to use.
- **Sequence number (32 bits):** increases monotonically; unique number per packet in an SA for **anti-replay** protection.
- ESP also adds a **trailer** and an **authentication field** after the data.

**In conclusion:** IPsec secures all IP traffic through ESP and IKEv2 key exchange, and its placement in firewalls and routers makes it strong, hard to bypass and transparent to applications and users.

## IPsec Transport and Tunnel Modes

| | Transport mode | Tunnel mode |
|---|---|---|
| Protects | The **payload** of an IP packet (e.g. a TCP or UDP segment) — mainly upper-layer protocols | The **entire IP packet** |
| Typical use | End-to-end communication between two **hosts** (e.g. client and server) | When one or both ends of an SA are a **security gateway** (firewall or router with IPsec); hosts behind firewalls need no IPsec themselves |
| ESP encrypts (and optionally authenticates) | IP payload, **not** the IP header | The whole inner IP packet, **including** the inner IP header |
| Resulting packet | Original IP header → ESP header → data → ESP trailer → ESP authentication | **New outer IP header** → ESP header → original IP header → data → ESP trailer → ESP authentication |

**Transport mode details**
- IPv4: the payload is the data following the IP header.
- IPv6: the payload is the data following the IP header and any extension headers (possibly including the destination options header).

**Tunnel mode details**
- After the ESP fields are added, the whole packet plus security fields becomes the payload of a **new outer IP packet**.
- The original inner packet travels through a **tunnel** from one network point to another; no router along the way can examine the inner header.
- The outer packet can have completely different source and destination addresses → added security.

**Example: tunnel mode**
1. Host A sends a packet addressed to Host B on another network.
2. It is routed to the **firewall or secure router** at the edge of A's network, which checks whether it needs IPsec processing.
3. If so, the firewall encapsulates it with an outer IP header: source = this firewall, destination = the firewall at the edge of B's network.
4. Intermediate routers see **only the outer header**.
5. At B's firewall the outer header is removed and the inner packet is delivered to B.

**In conclusion:** transport mode protects the payload between two hosts, while tunnel mode protects the whole packet between security gateways and is the basis of IPsec VPNs.

## Chapter Summary

**What the chapter covered**
- Secure email and **S/MIME**.
- **SSL and TLS:** the SSL architecture; the Record, Change Cipher Spec, Alert and Handshake protocols.
- **HTTPS:** connection initiation and closure.
- **IPv4 and IPv6 security through IPsec:** overview and scope, security associations, the Encapsulating Security Payload, transport and tunnel modes.
- A comparison of security at the **application, transport, network and link** layers.

**Security by layer**

| Layer | Example protocols |
|---|---|
| Application | S/MIME, SSH, OpenPGP |
| Transport | TLS |
| Network | IPsec |
| Link | WPA |

**In conclusion:** the Internet's original protocols were not secure, and modern protection comes from layered extensions, each with its own trade-offs between coverage, transparency and end-to-end protection.

## Self-test

<details><summary>Q1. Why were most Internet protocols designed without security, and how was security added later?</summary>

They were designed when links, networks and devices were trusted (few, mutually trusting organisations). Security was later added as **extensions**: IPsec for IP, SSL/TLS for TCP, and S/MIME for email.

</details>

<details><summary>Q2. Name the four layers at which security can be applied and one example protocol for each.</summary>

Application (SSH, S/MIME, OpenPGP), transport (SSL/TLS), network (IPsec), link (WPA/WPA2/WPA3, Bluetooth, ZigBee).

</details>

<details><summary>Q3. Give one advantage and one disadvantage each of application-, transport-, network- and link-level security.</summary>

Application: end-to-end encryption, but every application must implement security. Transport: simpler applications using a standard library, but only for specific transport protocols and apps must use the API. Network: supports all applications and transports, but needs OS support and configuration and is mostly used for tunnelling. Link: protects all data on the link, but encryption only covers that link and both ends must be configured.

</details>

<details><summary>Q4. What can an attacker with Wireshark see under TLS, IPsec transport mode, IPsec tunnel mode and WPA2?</summary>

**TLS**: IP addresses, port numbers and handshake metadata, but not the data. **IPsec transport**: IP addresses only. **IPsec tunnel**: only the tunnel endpoints' addresses. **WPA2**: MAC addresses, frame sizes and timing, but not the IP packet.

</details>

<details><summary>Q5. What does HTTPS encrypt, and which ports do HTTP and HTTPS use?</summary>

The URL of the requested document, the document contents, browser form contents, cookies in both directions, and the HTTP header. HTTP uses port **80**; HTTPS uses port **443**.

</details>

<details><summary>Q6. Name the SSL protocols and what each does.</summary>

**Record**: confidentiality and message integrity. **Handshake**: authenticate entities and negotiate algorithms and keys. **Change Cipher Spec**: switch to the negotiated cipher (one byte, value 1). **Alert**: report warnings and errors (two bytes: severity, then code).

</details>

<details><summary>Q7. List the steps of the SSL Record Protocol.</summary>

Fragment (≤ 2^14 = 16,384 bytes), optionally compress, add MAC, encrypt, append the SSL record header (content type, version, compressed length).

</details>

<details><summary>Q8. Session vs connection in SSL?</summary>

A **connection** is a temporary channel tied to one TCP connection (state: random values, keys, MAC secrets, sequence numbers). A **session** is a logical association created by the handshake that many connections can share (state: session ID, certificate, compression, cipher spec), avoiding repeated full handshakes.

</details>

<details><summary>Q9. Describe the four phases of the SSL handshake.</summary>

1: client_hello / server_hello establish capabilities. 2: the server may send its certificate, key exchange and a certificate request, then server_hello_done. 3: the client verifies the server and sends its certificate, key exchange and certificate_verify. 4: both sides send change_cipher_spec and finished.

</details>

<details><summary>Q10. What does a fatal alert do? Give an example of a fatal and a non-fatal alert.</summary>

It terminates the connection immediately; other connections on the session may continue but no new ones can be opened. Fatal: incorrect MAC. Non-fatal: close_notify.

</details>

<details><summary>Q11. What are the four S/MIME functions?</summary>

**Enveloped data** (encrypted content + encrypted keys), **signed data** (content + signature, base64), **clear-signed data** (only the signature base64, readable without S/MIME), **signed and enveloped data** (nested).

</details>

<details><summary>Q12. Why does S/MIME use radix-64 (base64)?</summary>

Signatures are binary, and email software may alter control characters such as line feeds. Radix-64 maps every 3 bytes into 4 printable ASCII characters so the message travels safely.

</details>

<details><summary>Q12a. Give three limitations of RFC 822 that MIME was designed to fix.</summary>

No binary objects or attachments; ASCII-only text (no national-language characters); no multimedia or multi-part bodies. Also size limits on some servers and gateways that alter messages.

</details>

<details><summary>Q12b. Which SMTP commands send one email, in order? Which ports does SMTP use?</summary>

`HELO`/`EHLO` → `MAIL FROM` → `RCPT TO` (one per recipient) → `DATA` (end with `.`) → `QUIT`. Port 25 for relay, 587 for submission (STARTTLS), 465 for SMTPS.

</details>

<details><summary>Q12c. Name the five MIME header fields.</summary>

`MIME-Version`, `Content-Type`, `Content-Transfer-Encoding`, `Content-ID`, `Content-Description`.

</details>

<details><summary>Q12d. Encode "Man" in radix-64. How much does radix-64 increase the size?</summary>

`TWFu` (19, 22, 5, 46). Size grows by about **33%** (3 bytes become 4 characters).

</details>

<details><summary>Q13. What are IPsec's three functional areas, and which standard handles key management?</summary>

Authentication, confidentiality and key management. Key management uses **IKEv2**, based on Diffie-Hellman.

</details>

<details><summary>Q14. Why is AH deprecated?</summary>

ESP already provides message authentication as well as encryption, so the authentication-only AH is kept only for backward compatibility.

</details>

<details><summary>Q15. Transport mode vs tunnel mode in IPsec?</summary>

**Transport**: protects the IP payload, not the header; used end to end between hosts. **Tunnel**: protects the whole original packet inside a new outer IP header; used between security gateways (firewalls, routers) for VPNs.

</details>

<details><summary>Q16. What are the two fields of the ESP header?</summary>

The **SPI** (32 bits), which identifies the security association, and the **sequence number** (32 bits), which provides anti-replay protection.

</details>
