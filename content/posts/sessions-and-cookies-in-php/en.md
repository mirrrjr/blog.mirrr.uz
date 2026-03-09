---
id: session-and-cookies-in-php
title: Overview of Cookies and Sessions in PHP
date: 2026-03-09
author: MIRRR jr.
readingTime: 5
tags: [php, session, cookies]
excerpt: Cookies and sessions are both used to store user data in PHP, but they function differently and serve different purposes.
---

## Cookies and sessions are both used to store user data in PHP, but they function differently and serve different purposes.

## Cookies

- Storage Location: Cookies are stored on the user's browser.
- Data Type: They hold small pieces of data (key/value pairs).
- Expiration: Cookies can have an expiration time set. If not set, they expire when the browser is closed.
- Access: Cookies are accessible via the $\_COOKIE superglobal.
- Security: Cookies can be vulnerable to security issues like XSS and CSRF. Sensitive data should be avoided.
- Size Limit: Typically limited to about 4KB per cookie.

## Sessions

- Storage Location: Session data is stored on the server.
- Data Type: Sessions can hold larger amounts of data compared to cookies.
- Expiration: Sessions usually expire after a period of inactivity (default is around 20 minutes).
- Access: Session data is accessed using the $\_SESSION superglobal.
- Security: Sessions are generally more secure as they do not expose data to the client side.
- Session ID: A unique session ID is sent to the user's browser as a cookie, linking the user to their session data.

Key Differences

| Feature    | Cookies                                         | Sessions                      |
| ---------- | ----------------------------------------------- | ----------------------------- |
| Storage    | Client-side (browser)                           | Server-side                   |
| Data Size  | Limited (around 4KB)                            | Larger data storage           |
| Expiration | Can be set; expires on browser close if not set | Expires after inactivity      |
| Security   | Less secure, can be manipulated                 | More secure, stored on server |
| Access     | `$_COOKIE` superglobal                          | `$_SESSION` superglobal       |

Cookies are useful for remembering user preferences, while sessions are ideal for managing user authentication and temporary data.
