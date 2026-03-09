---
id: session-and-cookies-in-php
title: PHP da Cookie va Sessiyalarga Umumiy Ko'rinish
date: 2026-03-09
author: MIRRR jr.
readingTime: 5
tags: [php, session, cookies]
excerpt: Cookie va sessiyalar PHP da foydalanuvchi ma'lumotlarini saqlash uchun ishlatiladi, lekin ular turlicha ishlaydi va turli maqsadlarga xizmat qiladi.
---

## Cookie va sessiyalar PHP da foydalanuvchi ma'lumotlarini saqlash uchun ishlatiladi, lekin ular turlicha ishlaydi va turli maqsadlarga xizmat qiladi.

## Cookielar

- Saqlash joyi: Cookie-lar foydalanuvchining brauzerida saqlanadi.
- Ma'lumot turi: Ular kichik ma'lumot bo'laklarini (kalit/qiymat juftliklari) saqlaydi.
- Muddati: Cookie-larga muddат belgilash mumkin. Agar belgilanmasa, brauzer yopilganda o'chib ketadi.
- Kirish: Cookie-larga `$_COOKIE` superglobali orqali kirish mumkin.
- Xavfsizlik: Cookie-lar XSS va CSRF kabi xavfsizlik muammolariga moyil bo'lishi mumkin. Maxfiy ma'lumotlardan qochish lozim.
- Hajm chegarasi: Odatda har bir cookie uchun taxminan 4KB bilan chegaralangan.

## Sessiyalar

- Saqlash joyi: Sessiya ma'lumotlari serverda saqlanadi.
- Ma'lumot turi: Sessiyalar cookie-larga nisbatan ko'proq ma'lumot saqlashi mumkin.
- Muddati: Sessiyalar odatda faolsizlik davridan keyin tugaydi (standart — taxminan 20 daqiqa).
- Kirish: Sessiya ma'lumotlariga `$_SESSION` superglobali orqali kirish mumkin.
- Xavfsizlik: Sessiyalar odatda xavfsizroq, chunki ma'lumotlar mijoz tomoniga chiqarilmaydi.
- Sessiya ID: Foydalanuvchi brauzeriga cookie sifatida yuborilgan noyob sessiya ID foydalanuvchini uning sessiya ma'lumotlari bilan bog'laydi.

Asosiy Farqlar

| Xususiyat      | Cookie-lar                                      | Sessiyalar                        |
| -------------- | ----------------------------------------------- | --------------------------------- |
| Saqlash        | Mijoz tomoni (brauzer)                          | Server tomoni                     |
| Ma'lumot hajmi | Cheklangan (taxminan 4KB)                       | Katta ma'lumot saqlash imkoniyati |
| Muddati        | Belgilanishi mumkin; brauzer yopilganda tugaydi | Faolsizlikdan keyin tugaydi       |
| Xavfsizlik     | Kam xavfsiz, manipulyatsiya qilinishi mumkin    | Xavfsizroq, serverda saqlanadi    |
| Kirish         | `$_COOKIE` superglobali                         | `$_SESSION` superglobali          |

Cookie-lar foydalanuvchi sozlamalarini eslab qolish uchun qulay, sessiyalar esa foydalanuvchi autentifikatsiyasi va vaqtinchalik ma'lumotlarni boshqarish uchun idealdir.
