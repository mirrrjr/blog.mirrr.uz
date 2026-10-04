---
id: laravel-docker-starterkit
title: PHP, Nginx, MySQL, Redis va Mailpit bilan to‘liq Dockerized Laravel muhiti
date: 2026-10-04
author: MIRRR jr.
readingTime: 12
tags: [php, laravel, nginx, mysql, redis, docker, mailpit]
excerpt: Ushbu maqolada Laravel loyihasi uchun PHP, Nginx, MySQL, Redis, Mailpit va Node.js asosida tayyor Docker development muhitini qanday ishlatish va sozlashni ko‘rib chiqamiz.
---

![banner](https://miro.medium.com/v2/resize:fit:720/format:webp/1*fuBQ92euM2g3W6gizteU3A.png)

Laravel loyihalarida development muhitini har safar qo‘lda sozlash vaqt talab qiladi. PHP versiyasi, Composer, Node.js, MySQL, Redis va web serverni alohida o‘rnatish esa bir nechta loyihada ishlaganda yanada noqulay bo‘lishi mumkin.

Shu sababli men Laravel loyihalari uchun **Docker asosidagi starter kit** tayyorladim.

Ushbu starter kit yordamida Laravel loyihasini quyidagi servislar bilan birga ishga tushirish mumkin:

- PHP 8.4-FPM
- Nginx 1.28.1
- MySQL 8.4
- Redis 7
- Node.js 22
- Composer 2
- Mailpit
- phpMyAdmin
- Laravel 13

Barcha servislar Docker Compose orqali boshqariladi.

---

## Loyiha tuzilishi

Repository taxminan quyidagi tuzilishga ega:

```text
laravel-docker-starterkit/
├── docker/
│   └── services/
│       ├── app/
│       │   ├── app.dockerfile
│       │   └── entrypoint.sh
│       └── web/
│           ├── web.dockerfile
│           └── vhost.conf
├── src/
│   ├── app/
│   ├── bootstrap/
│   ├── config/
│   ├── database/
│   ├── public/
│   ├── resources/
│   ├── routes/
│   ├── .env.example
│   ├── composer.json
│   └── package.json
├── docker-compose.yml
└── local.sh
```

`src` — Laravel application joylashadigan asosiy katalog.

`docker` katalogida esa application va web server uchun Docker konfiguratsiyalari mavjud.

---

## Docker arxitekturasi

Bu starter kit ikki asosiy application qatlamidan foydalanadi:

```text
                    Browser
                       │
                       ▼
                ┌─────────────┐
                │    Nginx    │
                │   :8000     │
                └──────┬──────┘
                       │
                       │ FastCGI
                       ▼
                ┌─────────────┐
                │ PHP-FPM 8.4 │
                │    app      │
                └──────┬──────┘
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
       MySQL         Redis        Mailpit
```

Nginx HTTP so‘rovlarini qabul qiladi va PHP so‘rovlarini `app:9000` orqali PHP-FPM containeriga yuboradi.

Laravel application esa MySQL, Redis va Mailpit bilan Docker network orqali bog‘lanadi.

---

## PHP application container

Application container `php:8.4-fpm-bookworm` image asosida quriladi.

Unda Laravel development uchun kerak bo‘ladigan PHP extensionlar mavjud:

- `bcmath`
- `gd`
- `intl`
- `mbstring`
- `opcache`
- `pcntl`
- `pdo_mysql`
- `zip`
- Redis extension

Bundan tashqari container ichida:

- Composer 2
- Node.js 22
- npm

ham mavjud.

Shuning uchun host tizimga PHP yoki Node.js o‘rnatmasdan turib Laravel development qilish mumkin.

Container ichidagi working directory:

```text
/var/www
```

Hostdagi:

```text
./src
```

shu katalog bilan bog‘langan.

---

## Nginx

Web server sifatida Nginx 1.28.1 ishlatiladi.

Nginx Laravel'ning:

```text
/var/www/public
```

katalogini web root sifatida ishlatadi.

PHP fayllari esa PHP-FPM containeriga yuboriladi:

```nginx
fastcgi_pass app:9000;
```

Bu yerda `app` — Docker Compose service nomi.

Hostdagi application porti default holatda:

```text
8000
```

Shuning uchun browser orqali:

```text
http://localhost:8000
```

manzilidan Laravel application'ni ochish mumkin.

---

## MySQL

Database uchun MySQL 8.4 ishlatiladi.

Docker Compose'dagi database service:

```text
database
```

Laravel containeridan MySQL'ga ulanishda `localhost` emas, aynan service nomi ishlatiladi:

```env
DB_CONNECTION=mysql
DB_HOST=database
DB_PORT=3306
DB_DATABASE=laravel
DB_USERNAME=laravel
DB_PASSWORD=secret
```

MySQL ma'lumotlari Docker named volume orqali saqlanadi.

Shuning uchun container qayta yaratilganda database ma'lumotlari avtomatik ravishda yo‘qolmaydi.

---

## Redis

Redis 7 Alpine image asosida ishlaydi.

Laravel ichidan Redis service'iga quyidagicha murojaat qilish mumkin:

```env
REDIS_HOST=redis
REDIS_PORT=6379
```

Redis ham alohida Docker volume'ga ega.

Bu setup Laravel cache, session yoki queue kabi vazifalar uchun Redis'dan foydalanishga imkon beradi.

---

## Mailpit

Email development uchun Mailpit ishlatiladi.

Laravel'dan yuborilgan email haqiqiy email serverga jo‘natilmaydi. U Mailpit tomonidan ushlab qolinadi va development vaqtida browser orqali ko‘rish mumkin.

Laravel `.env`:

```env
MAIL_MAILER=smtp
MAIL_HOST=mailpit
MAIL_PORT=1025
```

Mailpit web interfeysi:

```text
http://localhost:8025
```

SMTP server esa:

```text
localhost:1025
```

Bu ayniqsa registration, password reset va notification kabi funksiyalarni development vaqtida test qilish uchun qulay.

---

## phpMyAdmin

Database bilan ishlash uchun optional phpMyAdmin service ham mavjud.

U Docker Compose'da `tools` profile orqali ishga tushiriladi.

Default manzil:

```text
http://localhost:8888
```

phpMyAdmin orqali MySQL database'ni browserdan boshqarish mumkin.

Agar phpMyAdmin kerak bo‘lmasa, asosiy Laravel environment undan foydalanmasdan ham ishlayveradi.

---

## Environment sozlamalari

Avval `.env` faylini yarating:

```bash
cp src/.env.example src/.env
```

Keyin database va boshqa Docker servislarini Laravel bilan bog‘lang:

```env
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=database
DB_PORT=3306
DB_DATABASE=laravel
DB_USERNAME=laravel
DB_PASSWORD=secret

REDIS_HOST=redis
REDIS_PORT=6379

MAIL_MAILER=smtp
MAIL_HOST=mailpit
MAIL_PORT=1025
```

Muhim nuqta: Docker ichidagi Laravel application uchun `DB_HOST=localhost` ishlatilmaydi.

Docker network ichida boshqa containerlarga service nomi orqali murojaat qilinadi:

```text
database
redis
mailpit
```

---

## Birinchi ishga tushirish

Repository'ni clone qiling:

```bash
git clone https://github.com/mirrrjr/laravel-docker-starterkit.git

cd laravel-docker-starterkit
```

`.env` yarating:

```bash
cp src/.env.example src/.env
```

Keyin:

```bash
./local.sh init
```

`init` command quyidagi ishlarni bajaradi:

1. Docker image'larni build qiladi.
2. Containerlarni ishga tushiradi.
3. Composer dependency'larini o‘rnatadi.
4. Laravel application key yaratadi.
5. Database migration'larini ishga tushiradi.
6. npm dependency'larini o‘rnatadi.

Birinchi ishga tushirishda Docker image'lar yuklanishi sababli jarayon biroz vaqt olishi mumkin.

Shundan keyin application:

```text
http://localhost:8000
```

manzilida ishlaydi.

---

## `local.sh`

Starter kitdagi `local.sh` Docker commandlarini qisqartirish uchun yozilgan helper script.

Masalan:

```bash
./local.sh up
```

containerlarni ishga tushiradi.

```bash
./local.sh down
```

containerlarni to‘xtatadi va olib tashlaydi.

```bash
./local.sh restart
```

restart qiladi.

```bash
./local.sh rebuild
```

Docker image'larni qayta build qiladi.

Loglarni ko‘rish:

```bash
./local.sh logs
```

Ma'lum service loglarini ko‘rish:

```bash
./local.sh logs app
```

Application containeriga kirish:

```bash
./local.sh shell
```

Laravel Artisan commandlari:

```bash
./local.sh artisan migrate
```

Composer:

```bash
./local.sh composer install
```

npm:

```bash
./local.sh npm install
```

Bu yondashuv uzun `docker compose exec ...` commandlarini har safar yozish zaruratini kamaytiradi.

---

## Frontend development

Application containerida Node.js 22 va npm mavjud.

Dependency o‘rnatish:

```bash
./local.sh npm install
```

Development server:

```bash
./local.sh npm run dev
```

Production build:

```bash
./local.sh npm run build
```

Laravel frontend assetlari Vite orqali boshqariladi.

---

## Database bilan ishlash

Migration:

```bash
./local.sh artisan migrate
```

Fresh migration:

```bash
./local.sh artisan migrate:fresh
```

Seeder bilan:

```bash
./local.sh artisan migrate:fresh --seed
```

Laravel Tinker:

```bash
./local.sh artisan tinker
```

Shunday qilib Artisan commandlarini host tizimga PHP o‘rnatmasdan ham ishlatish mumkin.

---

## Docker servislarining portlari

Default portlar:

| Service         | Host port | Container port |
| --------------- | --------: | -------------: |
| Laravel / Nginx |    `8000` |           `80` |
| MySQL           |    `3306` |         `3306` |
| Redis           |    `6379` |         `6379` |
| Mailpit SMTP    |    `1025` |         `1025` |
| Mailpit Web     |    `8025` |         `8025` |
| phpMyAdmin      |    `8888` |           `80` |

Portlarni `.env` orqali o‘zgartirish mumkin.

Masalan:

```env
APP_PORT=8080
```

Shunda Laravel:

```text
http://localhost:8080
```

orqali ochiladi.

---

## Nima uchun Docker?

Bunday environment'ning asosiy afzalligi — development muhitini loyihadan ajratish.

Host tizimda:

```text
PHP
MySQL
Redis
Node.js
Composer
Nginx
```

o‘rnatib, har bir loyihada alohida versiyalar bilan kurashish shart emas.

Docker esa kerakli environment'ni loyiha bilan birga olib yuradi.

Masalan, boshqa developer repository'ni clone qilgach, bir xil PHP, Node.js, MySQL va Redis environment'ini oladi.

Bu esa:

- environment inconsistency'ni kamaytiradi;
- project setup vaqtini qisqartiradi;
- dependency versiyalarini boshqarishni osonlashtiradi;
- yangi developer uchun onboarding'ni soddalashtiradi.

---

## Xulosa

Laravel Docker Starter Kit — Laravel loyihalarini lokal development qilish uchun tayyor Docker environment.

Uning asosiy qismlari:

```text
Laravel
   │
   ├── PHP 8.4-FPM
   ├── Nginx 1.28
   ├── MySQL 8.4
   ├── Redis 7
   ├── Node.js 22
   ├── Mailpit
   └── phpMyAdmin
```

Maqsad esa oddiy: **Docker environment bilan uzoq vaqt konfiguratsiya qilmasdan Laravel development'ni boshlash.**

Repository'ni clone qiling, `.env`ni sozlang va:

```bash
./local.sh init
```

buyrug‘i bilan development muhitini ishga tushiring.
