---
title: "Ch 8 — Internet Security Protocols and Standards"
summary: Why Internet protocols lacked security, security at the application, transport, network and link layers, web security and HTTPS, SSL/TLS (record, change cipher spec, alert and handshake protocols, sessions vs connections), secure email with MIME and S/MIME, and IPsec (ESP, transport and tunnel modes).
tags: [chapter-8, tls, ssl, https, ipsec, s-mime, wpa]
sort: 8
---

## Why the Internet Needed Security Protocols

Most of the protocols used on the Internet were designed when its links, networks and devices were assumed to be trustworthy. In those early days only a small number of organisations and universities were connected, and everyone more or less trusted everyone else. As a result, protocols such as IP, TCP, UDP, HTTP, SMTP and FTP were built with no security mechanisms at all. There is no encryption inside TCP or IP, and HTTP has no built-in protection either.

As the Internet grew and people began to use it for commercial transactions and other sensitive tasks, networks and devices became far less trustworthy, and the need for security became obvious. Rather than replacing the existing protocols, designers developed extensions that add security to them. These extensions let clients and servers authenticate each other, so that each side knows it is talking to the right entity, and let them encrypt their traffic as it crosses the Internet. The main examples are IPsec, which secures IP; SSL, later renamed TLS, which secures TCP; and S/MIME, which secures email.

Security can be added at different layers of the protocol stack: the application layer, the transport layer, the network layer and the link layer. At the network layer, the extension to IP is IPsec (IP Security), which encrypts and authenticates IP packets; it is rarely used directly by end users but is common in VPNs. At the transport layer, TCP traffic can be encrypted with the Secure Sockets Layer (SSL), which was eventually replaced by, and renamed, Transport Layer Security (TLS). If neither IPsec nor TLS is used, developers can build security into their own applications, for example by protecting a remote login facility with Secure Shell (SSH).

In conclusion, Internet security protocols exist because the original Internet protocols assumed a trustworthy environment, and security was later added as extensions at different layers of the stack.

## Threats to Web Security

Web-based communication faces many security threats that can compromise data and services. They are usually grouped into four categories. Integrity threats include modification of user data, Trojan horse browsers, modification of memory and modification of messages in transit; their consequences include loss of information, compromise of the machine and vulnerability to all other threats, and the countermeasure is cryptographic checksums. Confidentiality threats include eavesdropping on the network, theft of information from the server or the client, and gathering information about the network configuration or about which client talks to which server; they lead to loss of information and loss of privacy, and the countermeasures are encryption and web proxies. Denial-of-service threats include killing user threads, flooding a machine with bogus requests, filling up disk or memory, and isolating a machine through DNS attacks; they are disruptive and annoying and prevent users from getting work done, and they are difficult to prevent. Authentication threats include impersonation of legitimate users and data forgery; they lead to misrepresentation of users and belief that false information is valid, and the countermeasure is cryptographic techniques.

To protect against these threats, appropriate security mechanisms must be used. For example, cryptographic hash functions combined with message authentication mechanisms such as HMAC ensure data integrity and authenticity. Encryption protects the confidentiality of transmitted information. Authentication mechanisms, such as digital signatures, certificates and cryptographic authentication protocols, verify the identities of the communicating parties.

In conclusion, web security must address integrity, confidentiality, availability and authentication, and each kind of threat calls for its own countermeasure, although denial of service remains particularly hard to prevent.

## The Internet Topology and Protocol Stack

The lecture uses a common example network to compare where security can be applied. Host A is connected by a wireless LAN to an access point, which acts as a bridge onto an Ethernet network. Traffic then passes through Router X, across the Internet to Router Y, and over another Ethernet network to Host B. Hosts A and B run the full protocol stack: application, TCP or UDP, IP, data link (DL) and physical (PHY) layers. The access point works only at the data link and physical layers, and the routers work up to the IP layer.

A Layer 2 device, such as a switch, helps traffic between devices within a LAN reach each other. It keeps a table of the MAC addresses it has learned and the physical port on which each can be found. MAC addresses operate at Layer 2 of the OSI model, so traffic switched by MAC address stays within the LAN. When traffic must cross between LANs or VLANs, a Layer 3 device is needed. The most common Layer 3 device is the router, which looks at the source and destination IP addresses in each packet to decide how to forward it. Because a router holds information about multiple networks (LAN, WAN and VLAN), it can pass traffic between them, which is called routing. A Layer 3 switch sits between a Layer 2 switch and a gateway router: it does more than a Layer 2 switch but less than a full router.

In conclusion, understanding which devices process which layers explains what each security approach can protect and what an attacker on the path can still see.

## Application-Level Security

In application-level security, the security mechanisms are implemented inside the application itself. If Host A wants to communicate securely with Host B, the application on Host A must protect the data before it is transmitted. The most obvious mechanism is encryption: the application can encrypt its data with an algorithm such as AES (Advanced Encryption Standard), preferably by using a well-established cryptographic library rather than implementing the algorithm itself. For example, a developer building a new instant messaging application would implement the user interface and messaging features, but would also need AES encryption, secure key exchange, authentication, and cryptographic hashes or message authentication to ensure integrity.

The data flows through the stack as follows. The application generates the data and encrypts the parts that need protection. The encrypted data is passed to the transport layer, where TCP adds its header to form a segment; the network layer adds the IP header to form a packet; and the data link layer encapsulates the packet into a frame and transmits it, for example over Wi-Fi. The application data is therefore already encrypted before it reaches the lower layers. If an attacker captures the traffic with a packet analyser such as Wireshark, they can usually see the source and destination IP addresses and port numbers, and the ports may hint at which application is being used. However, if the application has encrypted its sensitive data correctly, the attacker cannot read it without the keys, although some application metadata or headers may still be visible.

The main advantage of application-level security is host-to-host, end-to-end protection. With true end-to-end encryption, the data is encrypted by the application on Host A and stays encrypted until it reaches the application on Host B, so intermediate routers and servers cannot read it. The main disadvantage is that each application must implement common security mechanisms itself, and the developer must integrate and configure them correctly. Incorrect implementations can introduce serious vulnerabilities, so developers should not design their own cryptographic algorithms or implement cryptographic primitives from scratch, but should rely on trusted, well-tested libraries and established protocols. Common examples of application-level security are SSH, S/MIME for email, and OpenPGP.

In conclusion, application-level security gives true end-to-end protection tailored to one application, at the cost of every application having to implement security correctly on its own.

## Transport-Level Security (TLS/SSL)

In transport-level security, the application does not implement its own encryption but relies on an established security protocol, provided by an operating-system or library API. The most widely used protocol is TLS (Transport Layer Security), which evolved from the older SSL (Secure Sockets Layer). SSL is now obsolete, and modern applications use TLS. A TLS layer sits between the application protocol and TCP. The application uses a TLS library to set up a secure connection, and the library handles encryption, authentication and integrity protection. TCP is normally implemented in the operating system, but TLS is usually implemented in user-space libraries.

When data moves through the stack, the application generates its data and passes it to the TLS layer instead of directly to TCP. TLS encrypts the data and adds the information needed for secure transmission, and the resulting TLS records are passed to TCP, then IP, then the data link layer. The key point is that TLS performs the encryption before the data reaches TCP; TCP itself does not encrypt anything. An attacker using Wireshark can still see the IP addresses and TCP port numbers, along with some TLS handshake information and other unencrypted metadata, but once the TLS connection is established they cannot read the application data without the keys. A widely used TLS library is OpenSSL. In a client-server application, the developer implements the main functionality and calls OpenSSL's programming interfaces, and OpenSSL negotiates the encryption algorithms, performs key exchange, verifies certificates and encrypts the data before sending it over TCP. The developer must still configure and use the library correctly but does not have to write cryptographic code. TLS is used by TCP-based applications such as HTTPS, FTPS and SMTP.

The advantages of transport-level security are that it provides host-to-host encryption between the TLS endpoints, protecting data against eavesdropping and modification, and that it makes applications simpler, because developers use standardised, well-tested libraries instead of implementing complex security mechanisms. It is also widely supported across operating systems, programming languages and applications. Its disadvantages are that it applies only to specific transport protocols and that applications must be written to use the security API. Traditional TLS runs over reliable, connection-oriented TCP; for UDP-based communication, a related protocol called DTLS (Datagram Transport Layer Security) is used. Simply using TCP does not provide encryption, so developers must establish TLS connections, validate certificates properly and configure the security settings. TLS also protects data only between the TLS endpoints, so it does not provide true end-to-end message encryption when an intermediate server terminates the TLS connection.

Application-level and transport-level security can be combined. For example, an email can be encrypted with S/MIME at the application level and then sent over a TLS-protected connection. S/MIME protects the message itself, while TLS protects the channel through which it travels.

In conclusion, transport-level security lets any TCP application gain strong, standardised protection through a library such as OpenSSL, as long as the application is built to use it.

## Network-Level Security (IPsec)

In network-level security, the security mechanisms are applied at the IP layer. The computer is configured to apply security to IP packets using IPsec (Internet Protocol Security). Unlike the previous approaches, the application needs no special encryption code, and neither TCP nor UDP needs to be modified. When Host A sends data to Host B, the application passes data to TCP or UDP, which adds its header with the port numbers, and the network layer then protects the packet with IPsec before transmission. IPsec usually uses ESP (Encapsulating Security Payload) to provide encryption, integrity and data-origin authentication. Unlike TLS, which protects specific application connections, IPsec can protect any IP traffic, whether it uses TCP, UDP or another IP-based protocol.

What an attacker can see depends on the IPsec mode. In transport mode, IPsec protects the payload of the original IP packet, including the TCP or UDP header and the application data, but the original IP header stays visible so that routers can forward the packet. The attacker sees the source and destination IP addresses but not the port numbers or the data. In tunnel mode, IPsec encrypts the entire original IP packet, including its IP header, and adds a new outer IP header for routing. The attacker sees only the addresses of the tunnel endpoints, while the original internal IP addresses, port numbers and data stay hidden. This ability to hide transport-layer information, and in tunnel mode the internal addresses, is an important advantage of network-level security.

IPsec can be used end to end, between Host A and Host B, or router to router. In the router-to-router case, Router X and Router Y apply IPsec, so the packet travels from A to X as an ordinary packet (A to B, data), crosses the Internet as a protected packet with an outer header from X to Y wrapping the encrypted A-to-B packet, and is unwrapped at Y before travelling on to B. This is an example of tunnelling, in which packets at one layer are encapsulated inside packets at the same layer, here IP inside IPsec. Tunnelling creates a Virtual Private Network (VPN), and the security support and configuration can be provided on routers rather than on every host. Other tunnelling protocols include the Point-to-Point Tunneling Protocol and the Layer 2 Tunneling Protocol. However, router-to-router tunnelling does not provide end-to-end encryption, because traffic is unprotected inside each internal network.

The advantages of network-level security are that it supports all applications and transport protocols and can provide host-to-host encryption transparently. For example, an organisation can set up an IPsec VPN between two offices, and every application on those networks then communicates securely without its own encryption. The disadvantages are that IPsec requires support and configuration in the operating system, that it is mostly used for tunnelling, and that its configuration and management (security associations, cryptographic keys and network policies) are more complex than TLS. It also adds headers and encryption overhead that can affect performance.

In conclusion, IPsec protects all IP traffic independently of applications and transport protocols, and in tunnel mode it can hide ports and internal addresses, but it does not always give true application-to-application protection.

## Link-Level Security (WPA)

Link-level security applies security at the data link layer (Layer 2) and protects communication over one specific network link. A common example is Wi-Fi Protected Access (WPA), currently WPA2 and WPA3, which secures wireless communication. Other examples include the older WEP for wireless LANs, Bluetooth encryption and ZigBee encryption. When a laptop connects to a WPA2- or WPA3-protected network, security is established between the laptop and the wireless access point.

The data moves through the stack as usual: the application passes data to TCP or UDP, IP adds its header, and the packet is encapsulated into a Wi-Fi frame. WPA then encrypts and integrity-protects the frame's payload before transmission, so the whole IP packet, including the TCP or UDP header and the data, is encrypted inside the frame. Some Wi-Fi header fields remain visible because the network needs them to deliver and manage frames. Before encryption begins, the devices must authenticate and establish keys. In a typical WPA2-Personal network, the user enters the Wi-Fi password, keying material is derived from it, and the laptop and access point perform the 4-Way Handshake to establish the encryption keys. WPA2 commonly uses AES-based CCMP for confidentiality and integrity.

An attacker nearby with a wireless adapter in monitor mode can see unencrypted Wi-Fi header information, such as MAC addresses, frame sizes and timing, but cannot read the IP addresses, port numbers or data inside the encrypted payload. This differs from the other approaches: with TLS the IP addresses and ports are visible, with IPsec ESP the transport information is hidden and the IP addresses depend on the mode, and with WPA the whole IP packet is hidden over the wireless link while the MAC addresses remain visible. When the frame reaches the access point, it is decrypted and the packet is forwarded toward its destination, so the protection ends there. For example, on public Wi-Fi, WPA protects an HTTP request between the laptop and the access point but not across the rest of the Internet; using HTTPS adds TLS protection all the way to the TLS endpoint.

Link-level security applies to all data sent across the link, independently of the application, transport and network protocols, and it is transparent to applications because the operating system, drivers and hardware handle it. Its disadvantages are that encryption covers only the link, that both endpoints of the link must be configured, and that its strength depends on the network configuration; weak passwords, outdated settings or compromised access points reduce protection.

In conclusion, link-level security such as WPA2 or WPA3 protects everything sent over one link, but because protection ends at the access point, TLS or IPsec is still needed for security beyond the local network.

## Comparing the Security Options in TCP/IP

The options can be compared by layer. IPsec provides security for IP datagrams; it is a general solution for all Internet traffic and is implemented in the operating system. SSL/TLS provides security for TCP segments; it is a general solution for all TCP-based applications and is implemented in libraries or applications. Application-specific security protects application messages; it is specific to each application and is implemented in a single application.

A key principle is that the lower the layer at which security is implemented, the broader the range of traffic it can protect. Security built for email does not protect web browsing. TLS can protect many TCP applications, such as web browsing, email transmission and file transfer, but it is not applied automatically and applications must be designed or configured to use it; for UDP there is DTLS, and HTTP/3 uses TLS 1.3 integrated into QUIC over UDP. IPsec protects traffic regardless of whether it uses TCP, UDP or another IP protocol, so an IPsec VPN can protect many applications without changing any of them. In practice, application-level security and TLS are the most widely used: SSH for secure remote access, S/MIME and OpenPGP for email and messages, and TLS for the web through HTTPS. IPsec is widely used in VPNs, enterprise networks and site-to-site links, but rarely as the main protection for ordinary web browsing.

In conclusion, the right choice depends on what must be protected, where the protection must apply, and whether it must extend across the whole communication path.

## Web Browsing with HTTP and Dynamic Web Applications

HTTP is a request/response protocol for web browsing. The user agent (the browser) sends an HTTP request message, and the server responds with an HTTP response message. HTTP messages are plain text. HTTP is stateless: there is no dependence between one request and the previous one. Fetching another page means sending another request, and because most pages contain images, each image is fetched with its own request and response. Before any HTTP request is sent, the browser establishes a TCP connection to the web server. Port numbers identify the applications: the server's default port for HTTP is 80, while the browser's port is chosen unpredictably by its operating system. The TCP segments are then carried across the Internet by IP, which specifies the IP addresses of the browser's and server's computers.

Plain, static web pages consist of HTML, images and other files served to the browser, but many applications use dynamic content, where what the server returns depends on the request and is tailored to the user. Dynamic content uses client-side technologies such as JavaScript, Flash and Java, and server-side technologies such as ASP, PHP and Java, with the content stored in databases. For example, the browser requests a PHP page, the web server passes it to the PHP engine, the engine retrieves data from the database after authentication, and the response is returned to the browser over HTTP. Because the content is specific to each user, such sites need authentication.

This raises several security issues. Data sent between browser and server often needs to be confidential, because requests and responses may contain information that others should not see, and anyone on the path between them can see unprotected data. There is also the question of how the browser can be sure it is communicating with the intended server. The solutions are as follows. Confidentiality of transmitted data is achieved by encryption with HTTPS. The browser is assured that it is talking to the intended server through digital certificates, so that a reply really comes from your bank and not from someone pretending to be it. The server is assured that it is talking to the intended user through password authentication and session management; session management is needed because HTTP is stateless, so the server uses something like a session ID to link one request to the next, and the username and password must themselves be sent encrypted. Finally, authentication and access control ensure that the actions performed by the server are appropriate.

In conclusion, plain HTTP is stateless and unencrypted, so web applications need HTTPS, certificates, password authentication, session management and access control to be secure.

## HTTPS (HTTP over SSL/TLS)

HTTPS is the combination of HTTP and SSL/TLS used to secure communication between a web browser and a web server. It is built into all modern web browsers, and the user sees URLs that begin with https:// instead of http://. A normal HTTP connection uses port 80, while HTTPS uses port 443, which invokes SSL/TLS. The server is authenticated using a certificate (through SSL/TLS), and the client is authenticated using a password (through HTTP). HTTPS is documented in RFC 2818, HTTP Over TLS, and because there is no fundamental difference between running HTTP over SSL or over TLS, both are called HTTPS. (The lecture notes mention that search engines do not support HTTPS, which comes from an older edition of the textbook; today most search engines use HTTPS by default.)

When HTTPS is used, the following parts of the communication are encrypted: the URL of the requested document, the contents of the document, the contents of browser forms filled in by the user, the cookies sent in both directions, and the contents of the HTTP header.

For connection initiation, the agent acting as the HTTP client also acts as the TLS client. The client opens a connection to the server on the appropriate port and sends the TLS ClientHello to begin the handshake. Once the handshake is finished, the client sends its first HTTP request, and all HTTP data is sent as TLS application data. There are three levels of awareness of a connection in HTTPS. At the HTTP level, the client requests a connection from the next lowest layer, which is usually TCP but may be TLS. At the TLS level, a session is established between a TLS client and a TLS server, and it can support one or more connections. A TLS connection in turn begins with a TCP connection between the client and server.

For connection closure, an HTTP client or server can include the line "Connection: close" to show that the connection will be closed after the current record. Closing an HTTPS connection requires TLS to close the connection with its peer, which also closes the underlying TCP connection. The proper way is for each side to send a close_notify alert using the TLS alert protocol, and TLS implementations must exchange closure alerts before closing. An implementation may send its closure alert and close without waiting for the peer's, which is called an "incomplete close", and may reuse the session if the application knows it has received all the data it needs. HTTP clients must also cope with a TCP connection that ends without a close_notify alert or a "Connection: close" line. This might be caused by a programming error or a communication failure, but it could also be evidence of an attack, so the HTTPS client should issue a security warning.

The speaker notes also summarise how TLS secures HTTPS. In the handshake, the server presents its digital certificate, which contains its public key and is issued by a trusted Certificate Authority (CA). The browser checks that the certificate is signed by a trusted CA and has not expired. The browser then generates a pre-master secret, encrypts it with the server's public key and sends it to the server, which decrypts it with its private key, and both sides derive the session keys from it. The two sides then use symmetric encryption with the session keys to protect the data, and integrity is protected with hash-based MACs such as HMAC, which detect unauthorised modification. Many modern TLS implementations support perfect forward secrecy (PFS), which generates new session keys for each connection so that even if the server's private key is stolen later, past communication cannot be decrypted. TLS also allows renegotiation, so the client and server can refresh their session keys without opening a new connection.

In conclusion, HTTPS runs ordinary HTTP inside TLS on port 443, encrypting URLs, content, forms, cookies and headers, authenticating the server with a certificate, and requiring careful handling of connection closure.

## Secure Sockets Layer and Transport Layer Security

SSL is one of the most widely used security services. It is a general-purpose service implemented as a set of protocols that rely on TCP, and it later became the Internet standard TLS, defined in RFC 2246. SSL provides security to application protocols that use TCP. There are two implementation choices: SSL/TLS can be provided as part of the underlying protocol suite and be transparent to applications, or it can be embedded in specific packages. For example, browsers such as Chrome and Firefox have built-in implementations of HTTP and TLS, and most web servers implement the protocol. Applications can also use libraries such as OpenSSL, and a Python program can use the requests library to talk securely to an HTTPS server. Unlike TCP/IP, which is generally implemented in the operating system, HTTP and TLS are usually implemented in user-space applications or libraries. In a normal browser stack, HTTP sits directly on TCP; in a secure stack, SSL sits between HTTP and TCP.

SSL is not a single protocol but two layers of protocols. The lower layer is the SSL Record Protocol, which sits on TCP and provides basic security services, confidentiality and message integrity, to the protocols above it, including HTTP. Above it are three SSL-specific protocols that manage secure communication: the Handshake Protocol, which authenticates the entities and negotiates parameter values; the Change Cipher Spec Protocol, which changes the cipher in use for the connection; and the Alert Protocol, which alerts the peer entity to status, warnings and errors. Before a client and server can communicate securely, they perform the handshake to negotiate the TLS version, encryption algorithms and key exchange mechanism.

In conclusion, SSL/TLS is a layered set of protocols on top of TCP, with the record protocol providing protection and three higher protocols managing the handshake, cipher changes and alerts.

## SSL Sessions and Connections

SSL distinguishes between sessions and connections. An SSL connection is a temporary, peer-to-peer communication channel between a client and a server. It uses an underlying TCP connection, and every TCP connection corresponds to an SSL connection. A TCP connection is set up with the three-way handshake (SYN, SYN-ACK, ACK) and closed with a FIN message, and the SSL connection follows the same lifetime. A client and server may have multiple connections, and each connection is associated with one session.

An SSL session is a logical association between a client and a server, created by the Handshake Protocol. It defines the cryptographic security parameters, and multiple connections can be associated with one session and share its security parameters. For example, a client and server might negotiate a session at the start and then use the same algorithms and parameters for every TCP connection they open over the next five minutes. Because setting up a session takes considerable effort, reusing it avoids repeating a full handshake for every new connection. After the handshake, state information is stored. The session state includes the session ID, the certificate, the compression method and the cipher spec. The connection state includes the random values, the encryption keys, the MAC secrets and the sequence numbers.

Session resumption works through SSL session IDs. After a fully negotiated connection ends, both the client and server keep the session security parameters for a while. The server assigns a unique session ID and sends it to the client in the ServerHello message. To resume the session, the client sends that session ID in its ClientHello. If the server finds the session in its cache and accepts it, it returns the same session ID and continues with an abbreviated handshake; otherwise, it issues a new session ID and performs a full handshake.

In conclusion, a session holds the negotiated security parameters and can be shared by many connections, which reduces the cost of repeated handshakes.

## The SSL Record Protocol

The SSL Record Protocol provides two services for SSL connections. It provides confidentiality, because the Handshake Protocol defines a shared secret key used for symmetric encryption of SSL payloads, and it provides message integrity, because the Handshake Protocol also defines a shared secret key used to form a message authentication code (MAC).

The Record Protocol processes application data in five steps. First, each upper-layer message is fragmented into blocks of 2 to the power 14 bytes (16,384 bytes) or less. Second, compression is optionally applied. Third, a MAC is computed over the compressed data. Fourth, the compressed message plus the MAC is encrypted with symmetric encryption. Fifth, an SSL record header is prepended. The header contains the content type (8 bits), which names the higher-layer protocol that should process the fragment; the major version (8 bits), which is 3 for SSLv3, together with a minor version field; and the compressed length (16 bits), the length in bytes of the plaintext or compressed fragment, with a maximum of 2 to the power 14 plus 2048. The defined content types are change_cipher_spec, alert, handshake and application_data. The first three are the SSL-specific protocols, and SSL makes no distinction between the applications, such as HTTP, that use it, because their data is opaque to SSL. The resulting unit is sent in a TCP segment, and on receipt the data is decrypted, verified, decompressed and reassembled before being delivered to the higher layer.

In conclusion, the Record Protocol fragments, optionally compresses, authenticates with a MAC, encrypts and labels every piece of data that SSL carries.

## The Change Cipher Spec and Alert Protocols

The Change Cipher Spec Protocol is one of the three SSL-specific protocols that use the Record Protocol, and it is the simplest. It consists of a single message, which is a single byte with the value 1. Its only purpose is to cause the pending state to be copied into the current state, which updates the cipher suite used on the connection. In other words, it signals that all following records will be protected with the parameters negotiated in the handshake, marking the switch to the encrypted state.

The Alert Protocol conveys SSL-related alerts to the peer entity. Alert messages are compressed and encrypted according to the current state, like any other SSL data. Each message consists of two bytes. The first byte gives the severity, either warning (1) or fatal (2). If the level is fatal, SSL immediately terminates the connection; other connections on the same session may continue, but no new connections may be established on that session. The second byte contains a code for the specific alert. An example of a fatal alert is an incorrect MAC, and an example of a non-fatal alert is close_notify, which tells the recipient that the sender will send no more messages on the connection. Alerts can report handshake failures (such as being unable to agree on a cipher suite or verify the server's certificate), certificate problems (expired, revoked or untrusted certificates), compression or decompression failures, unexpected termination, and protocol version mismatches.

In conclusion, the Change Cipher Spec Protocol switches the connection to the newly negotiated cipher with a single byte, and the Alert Protocol reports warnings and fatal errors with two-byte messages.

## The SSL Handshake Protocol

The Handshake Protocol is the most complex part of SSL. It is used before any application data is transmitted, and it allows the server and client to authenticate each other, negotiate the encryption and MAC algorithms, and negotiate the cryptographic keys used to protect data sent in SSL records. It consists of a series of messages exchanged by the client and server, organised into four phases.

Phase 1 establishes the security capabilities. The client starts by sending a client_hello message containing the highest SSL version it understands; a random structure made of a 32-bit timestamp and 28 bytes from a secure random number generator, used during key exchange to prevent replay attacks; a session ID, where a non-zero value means the client wants to update an existing connection or create a new connection on an existing session and zero means a new connection on a new session; a cipher suite list of the cryptographic algorithm combinations it supports, in decreasing order of preference, each defining a key exchange algorithm and a CipherSpec; and a list of supported compression methods. The server replies with a server_hello containing the same parameters.

Phase 2 covers server authentication and key exchange, and its details depend on the public-key scheme in use. The server may send its certificate, additional key information (server_key_exchange) and a request for the client's certificate (certificate_request). The final message of phase 2, which is always required, is server_hello_done, after which the server waits for the client. In phase 3, the client verifies that the server provided a valid certificate if one was required and that the server_hello parameters are acceptable. It then sends its certificate if one was requested, its key exchange message (client_key_exchange), and possibly a certificate_verify message. Phase 4 finishes the setup. The client sends a change_cipher_spec message, which strictly belongs to the Change Cipher Spec Protocol rather than the Handshake Protocol, copies the pending CipherSpec into the current one, and immediately sends a finished message under the new algorithms and keys, which verifies that key exchange and authentication succeeded. The server responds with its own change_cipher_spec and finished messages. At this point the handshake is complete and application data can be exchanged.

In conclusion, the four-phase handshake lets the client and server agree on algorithms, authenticate each other and establish keys before any application data is sent.

## Secure Email: MIME and S/MIME

Email messages were originally plain text with predefined headers such as To, From, Subject and CC. Multipurpose Internet Mail Extensions (MIME) allows different message and header formats, including other character sets, attachments and new headers. MIME extends the old RFC 822 Internet mail format, which defines a simple header with To, From and Subject fields for routing and assumes plain ASCII text. RFC 822 handles only plain text and does not specify how to carry binary data. MIME adds new header fields, such as Content-Type and Content-Disposition, that describe the body's format and how it should be displayed, defines content types for text, HTML, images, audio, video and applications (for example image/jpeg or application/pdf), and defines encodings such as base64 and quoted-printable that let binary data travel safely through SMTP. With MIME, a message can mix plain and rich text, contain several parts, include attachments such as PDFs and Word documents, and be fragmented transparently to the recipient.

Secure email has two requirements. Authentication means the receiver can confirm the actual sender and that the content has not been modified, and confidentiality means that only the sender and receiver can read the content. There are two ways to implement secure email: S/MIME (Secure/Multipurpose Internet Mail Extensions) and OpenPGP (Pretty Good Privacy). Both follow a similar approach: the sender signs the message with their private key, encrypts the message with symmetric encryption using a secret key, and encrypts that secret key with the recipient's public key. S/MIME is a security enhancement to the MIME format, based on technology from RSA Data Security, and it can sign and/or encrypt messages.

A typical S/MIME process (textbook Figure 22.1) has Bob sending a message to Alice. Bob starts with the plaintext message, adds a digital signature made with his private key (DSS/SHA in the figure), encrypts the message and signature with a one-time session key (Triple DES in the figure), encrypts the session key with Alice's public key (ElGamal in the figure) and attaches it, and finally converts the whole document to radix-64 format.

S/MIME content types support four functions. Enveloped data consists of encrypted content of any type plus the content-encryption keys, encrypted for one or more recipients. Signed data is formed by taking the message digest, encrypting it with the signer's private key, and encoding the content plus signature in base64, so only a recipient with S/MIME capability can view it. Clear-signed data also forms a signature, but only the signature is base64-encoded, so recipients without S/MIME can read the message even though they cannot verify the signature. Signed and enveloped data allows signed and encrypted entities to be nested, so encrypted data may be signed and signed data may be encrypted.

For signing, the default algorithms listed on the slide are RSA with SHA-1, and RSA can also be used with SHA-1 or MD5 to form signatures. The speaker notes describe the modern process with SHA-256: the message is mapped to a 256-bit digest, which is practically unique to that message so it cannot be altered or substituted without detection; the digest is encrypted with RSA and the sender's private key to form the signature, which is attached to the message; and any recipient can recompute the digest and decrypt the signature with the sender's public key to compare them. Because only a 256-bit block is encrypted and decrypted, this is fast. The signature is binary, and some email software interprets control characters such as line feeds, which could alter it, so the signature, or the signature plus the message, is mapped into printable ASCII using radix-64 (base64), which maps each group of three bytes of binary data into four ASCII characters.

In conclusion, MIME lets email carry rich content, and S/MIME adds signatures and encryption by combining a private-key signature, a symmetric session key and the recipient's public key, with base64 encoding for safe transport.

## IP Security (IPsec)

IPsec provides general IP security mechanisms that can secure communication across a LAN, across private and public WANs, and across the Internet. IP-level security covers three functional areas. Authentication ensures that a received packet was actually sent by the party named as its source and was not altered in transit. Confidentiality lets nodes encrypt messages to prevent eavesdropping. Key management handles the secure exchange of keys. The current version, IPsecv3, covers authentication and confidentiality, while key management is provided by the Internet Key Exchange standard, IKEv2, which uses the Diffie-Hellman key exchange protocol.

The key feature of IPsec is that it can encrypt and/or authenticate all traffic at the IP level, so every distributed application, including remote logon, client/server, email, file transfer and web access, can be secured. In a typical scenario, a user system with IPsec and networking devices with IPsec at the edge of each LAN communicate across a public or private network. Inside each LAN, packets travel as an ordinary IP header plus payload, while across the public network they carry an IPsec header and a secure payload.

IPsec has several benefits. When implemented in a firewall or router, it provides strong security for all traffic crossing the perimeter, while traffic inside the company does not incur the security overhead. IPsec in a firewall is resistant to bypass if all outside traffic must use IP and the firewall is the only way into the organisation. IPsec is below the transport layer, so it is transparent to applications, and no software on user or server systems needs to change. It can be transparent to end users, so there is no need to train users, issue keys per user or revoke keys when users leave. It can also provide security for individual users when needed, such as off-site workers or a secure virtual subnetwork for sensitive applications.

The scope of IPsec covers two main functions: a combined authentication and encryption function called Encapsulating Security Payload (ESP), and a key exchange function, which allows both manual and automated key exchange. VPNs want both authentication and encryption, to keep unauthorised users out of the VPN and to stop eavesdroppers on the Internet from reading its messages. There is also an authentication-only function called the Authentication Header (AH), but because ESP already provides message authentication, AH is deprecated; it remains in IPsecv3 only for backward compatibility. The specification is complex and spread over many documents, the most important being RFC 2401 (Security Architecture for the Internet Protocol), RFC 4302 (IP Authentication Header), RFC 4303 (IP Encapsulating Security Payload) and RFC 4306 (Internet Key Exchange, IKEv2).

The ESP header comes before the encrypted payload and contains two fields. The Security Parameters Index (SPI, 32 bits) identifies the security association (SA) for the packet, telling the receiver which key and algorithms to use. The sequence number (32 bits) increases monotonically, giving each packet in an SA a unique number for anti-replay protection. ESP also adds a trailer and an authentication field after the data.

In conclusion, IPsec secures all IP traffic through ESP and IKEv2 key exchange, and its placement in firewalls and routers makes it strong, hard to bypass and transparent to applications and users.

## IPsec Transport and Tunnel Modes

IPsec supports two modes. Transport mode protects mainly the upper-layer protocols, so its protection extends to the payload of an IP packet, such as a TCP or UDP segment. It is typically used for end-to-end communication between two hosts, such as a client and a server. For IPv4, the payload is the data following the IP header; for IPv6, it is the data following the IP header and any extension headers, possibly including the destination options header. ESP in transport mode encrypts and optionally authenticates the IP payload but not the IP header. The resulting packet has the original IP header, then the ESP header, the data, the ESP trailer and the ESP authentication field.

Tunnel mode protects the entire IP packet. After the ESP fields are added, the whole packet plus security fields becomes the payload of a new outer IP packet with a new outer IP header, so the packet has a new IP header, then the ESP header, the original IP header, the data, the ESP trailer and the ESP authentication field. The original inner packet travels through a tunnel from one point of the network to another, and no router along the way can examine the inner header. Because the new outer packet can have completely different source and destination addresses, this adds to the security. Tunnel mode is used when one or both ends of a security association are a security gateway, such as a firewall or router that implements IPsec, and it lets hosts behind firewalls communicate securely without implementing IPsec themselves.

For example, Host A sends a packet addressed to Host B on another network. The packet is routed to the firewall or secure router at the edge of A's network, which checks whether it needs IPsec processing. If it does, the firewall encapsulates it with an outer IP header whose source is the firewall and whose destination is the firewall at the edge of B's network. Intermediate routers see only the outer header. At B's firewall, the outer header is removed and the inner packet is delivered to B. ESP in tunnel mode encrypts and optionally authenticates the entire inner IP packet, including the inner IP header.

In conclusion, transport mode protects the payload between two hosts, while tunnel mode protects the whole packet between security gateways and is the basis of IPsec VPNs.

## Chapter Summary

This chapter covered secure email and S/MIME; SSL and TLS, including the SSL architecture, the Record, Change Cipher Spec, Alert and Handshake protocols; HTTPS, including connection initiation and closure; and IPv4 and IPv6 security through IPsec, including its overview and scope, security associations, the Encapsulating Security Payload, and transport and tunnel modes. It also compared security at the application, transport, network and link layers.

In conclusion, the Internet's original protocols were not secure, and modern protection comes from layered extensions: S/MIME and SSH at the application level, TLS at the transport level, IPsec at the network level and WPA at the link level, each with its own trade-offs between coverage, transparency and end-to-end protection.

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
