---
id: containerization-laravel
title: Laravel Ilova Dasturlarining Konteynerizatsiyasi
date: 2024-07-17
author: MIRRR jr.
readingTime: 8
tags: [docker, laravel, nginx]
excerpt: Laravel ilova dasturlarini tutashgan ishlab chiqish va ishlab chiqarish muhitida konteynerizatsiya qilishni o'rganing.
---

# Laravel Ilova Dasturlarining Konteynerizatsiyasi

Konteynerizatsiya veb-ilova dasturlarini joylashtirish uchun sanoat standartiga aylangan. Docker sizning butun ilova dasturini, bog'liqliklarni va runtime muhitini bitta konteynerga paketlash imkonini beradi, bu har qanday tizimda izchil ishlaydi.

## Nima uchun Docker?

Docker bir necha asosiy afzalliklarni beradi:

- **Izchillik**: Sizning ilova dasturi ishlab chiqish, sinab ko'rish va ishlab chiqarish muhitida bir xil ishlaydi
- **Izolyatsiya**: Bog'liqliklar sizning tizimingiz yoki boshqa ilova dasturlar bilan ziddiyat kelatmaydi
- **Masshtablilik**: Bir nechta serverlar bo'ylab konteynerlarni osongina ko'paytiring
- **Soddalik**: Yangi ishlab chiquvchilarni shunchaki konteynerni tortib olish va ishga tushirish orqali taqdim eting

## Docker Asoslari

Docker tasviri - bu chizmasi kabi: u sizning ilova dasturining ishga tushishi uchun kerak bo'lgan hamma narsani o'z ichiga oladi. Konteyner - bu shu tasvirning ishlab turgan misoli.

### Dockerfile Tuzilishi

```dockerfile
FROM php:8.2-fpm

# Tizim paketlarini o'rnating
RUN apt-get update && apt-get install -y \
    git \
    curl \
    unzip

# PHP kengaytmalarini o'rnating
RUN docker-php-ext-install pdo pdo_mysql

# Ishlash katalogini o'rnatish
WORKDIR /app

# Ilova dastur fayllarini nusxalash
COPY . .

# Composer bog'liqliklarini o'rnating
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
RUN composer install

EXPOSE 9000
CMD ["php-fpm"]
```

## Docker Compose bilan Laravel

Docker Compose bir nechta xizmatlarni (Laravel ilova, ma'lumotlar bazasi, kesh va boshqalar) aniqlash va ularni birga ishga tushirish imkonini beradi:

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "8000:8000"
    volumes:
      - .:/app
    environment:
      - DB_HOST=database
      - DB_DATABASE=laravel
      - DB_USERNAME=laravel
      - DB_PASSWORD=secret

  database:
    image: mysql:8.0
    environment:
      - MYSQL_DATABASE=laravel
      - MYSQL_USER=laravel
      - MYSQL_PASSWORD=secret
      - MYSQL_ROOT_PASSWORD=secret
    volumes:
      - dbdata:/var/lib/mysql

volumes:
  dbdata:
```

## Eng Yaxshi Amaliyotlar

1. **Tasvirlarni kichik tutung** - Ishlab chiqish bog'liqliklarini istisno qilish uchun ko'p bosqichli qurilishdan foydalaning
2. **Xavfsizlik** - Konteynerlarni root sifatida ishga tushirmang
3. **Sog'lik tekshiruvlari** - Konteynerlarning to'g'ri ishlab turganligini ta'minlash uchun sog'lik tekshiruvlarini qo'shing
4. **Muhit o'zgaruvchilari** - Konfiguratsiya uchun `.env` fayllaridan foydalaning
5. **Jurnal** - Konteyner jurnallashtirish uchun jurnallar stdout/stderr-ga yuborilganligini ta'minlang

## Xulosa

Docker Laravel ilova dasturlarini ishlab chiqish va joylashtirish usulumuzu o'zgartiradi. Ilova dasturlarini konteynerizatsiya qilish orqali siz izchillik, ishonchlilik va osongina masshtablilik imkonini olasiz.
