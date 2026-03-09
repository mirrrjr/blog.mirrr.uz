---
id: example-post
title: PHP, Nginx, MySQL, Redis va Scheduler bilan To'liq Dockerlashtirilgan Laravel Muhitini Yaratish
date: 2024-07-17
author: MIRRR jr.
readingTime: 15
tags: [php, laravel, nginx, mysql, redis, docker, scheduler]
excerpt: Ushbu maqolada men sizga LEMP stekidan iborat barqaror va ishonchli Docker muhitini qanday yaratishni ko'rsataman.
---

![baner](https://miro.medium.com/v2/resize:fit:720/format:webp/1*fuBQ92euM2g3W6gizteU3A.png)

Docker ishlab chiqish maqsadlari uchun to'liq mahalliy muhitga ega bo'lish nuqtai nazaridan ajoyib moslashuvchanlik taqdim etadi. Ushbu maqolada men sizga LEMP stekidan (framework sifatida Laravel tanlangan holda) iborat barqaror va ishonchli Docker muhitini qanday yaratishni ko'rsataman.

Maqola oxirida siz PHP, Nginx, MySQL, Redis, Mailhog va phpMyAdmin ishlaydigan konteynerlar to'plamiga ega bo'lasiz. Bularning barchasi birgalikda PHP ilovalarini yaratish uchun juda qulay mahalliy stekni tashkil etadi.

## Taxminlar

Bu bosqichda sizda Docker allaqachon o'rnatilgan va ishlab turgan deb taxmin qilinadi. Agar bunday bo'lmasa, Mac'da Docker'ni qanday o'rnatish bo'yicha rasmiy qo'llanmaga amal qiling. Agar boshqa operatsion tizimdan foydalansangiz, o'z OTingizga mos Docker'ning rasmiy yo'riqnomasiga amal qiling.

## Tayyorgarlik

Yaratayotgan loyihamizni joylashtirish uchun ~/Code ichida bir qator yangi kataloglar yarating.

```bash
mkdir -p foo-com/docker/services/{app,web} foo-com/docker/volumes/{mysql,redis} foo-com/src
cd foo-com
tree
```

Bu sizga quyidagi katalog tuzilmasini berishi kerak:

```bash
$ tree
.
├── docker
│   ├── services
│   │   ├── app
│   │   └── web
│   └── volumes
│       ├── mysql
│       └── redis
└── src

8 directories, 0 files
```

## Manba Nazorati

Siz Git'ni manba nazorati sifatida ishlatishingiz juda ehtimoldan yiroq emas, shuning uchun bir necha qo'shimcha qadamlar zarur. Mysql va redis kataloglarining har ikkalasida yangi bo'sh fayl yarating va uni .gitkeep deb nomlang.

```bash
touch docker/volumes/mysql/.gitkeep
touch docker/volumes/redis/.gitkeep
```

Endi ildizda quyidagi mazmundagi .gitignore faylini yarating:

```bash
!docker/volumes/mysql
docker/volumes/mysql/*
!docker/volumes/mysql/.gitkeep

!docker/volumes/redis
docker/volumes/redis/*
!docker/volumes/redis/.gitkeep

.DS_Store
.idea
```

Biz ma'lumotlarimizni saqlash usuli sifatida Docker volume'lardan foydalanamiz. Ushbu sozlama Docker konteynerlarini o'chirib yuborganimizda yoki hatto host mashinamizni o'chirib qo'yganimizda ham hech qanday ma'lumot yo'qolmasligini kafolatlaydi. Albatta, biz hech qanday keraksiz narsani repository'ning bir qismi bo'lishini istamaymiz, shuning uchun biz shunchaki ichidagi kontentni (kataloglarning o'zini emas) e'tiborsiz qoldiramiz. Oxirgi ikki qator ixtiyoriy bo'lib, ham IDE, ham OTga bog'liq.

## Docker Xizmatlari

Bu maqolaning asosiy qismi.

Keling, asosiy app.dockerfile xizmatidan boshlaymiz.

```bash
touch docker/services/app/app.dockerfile
```

app.dockerfile mazmuni:

```bash
FROM php:8.4-fpm

WORKDIR /var/www

RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    git \
    jpegoptim optipng pngquant gifsicle \
    locales \
    unzip \
    vim \
    zip

# Keshni tozalash
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# PHP kengaytmalarini o'rnatish

# Graphics Draw
RUN apt-get update && apt-get install -y \
    libfreetype6-dev \
    libjpeg62-turbo-dev \
    libpng-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) gd

# Multibyte String
RUN apt-get update && apt-get install -y libonig-dev && docker-php-ext-install mbstring

# Qo'shimcha
RUN docker-php-ext-install bcmath
RUN docker-php-ext-install exif
RUN docker-php-ext-install pdo_mysql

# Composer'ni o'rnatish
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# nvm orqali npm bilan Node.js'ning muayyan versiyasini o'rnatish
SHELL ["/bin/bash", "--login", "-c"]
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
RUN nvm install 24

# Cron'ni o'rnatish
RUN apt-get update && apt-get install -y cron
RUN echo "* * * * * root php /var/www/artisan schedule:run >> /var/log/cron.log 2>&1" >> /etc/crontab
RUN touch /var/log/cron.log

CMD bash -c "cron && php-fpm"
```

1. Bizning Laravel ilovamiz PHP 8.1-fpm image'iga asoslanadi
2. Biz ilova fayllarining manzil joylashuviga nisbiy yo'lni ifodalovchi WORKDIR'ni aniqlaymiz
3. Keyinchalik kerak bo'ladigan majburiy vositalarni o'rnatamiz
4. Muhim PHP kengaytmalarini o'rnatamiz (framework uchun zarur)

- Rasm yaratish va qayta ishlash uchun Graphics Draw kutubxonasi
- Multibyte String kutubxonasi bcmath yoki pdo_mysql kabi boshqa kengaytmalar bilan birga Laravel tomonidan talab qilinadi. Bizning ro'yxatimiz rasmiy Laravel hujjatida ko'rsatilgan barcha kengaytmalarni o'z ichiga olmaydi, chunki ularning aksariyati allaqachon o'rnatilgan va standart holda yoqilgan. Keyinchalik biz har doim ilova konteyneriga kirib, php -m yordamida mavjud kengaytmalarni tekshirishimiz mumkin

5. Bu bizning backend paket menejerimiz bo'lgani uchun Composer'ni o'rnatamiz
6. Frontend aktivlarimiz bilan ishlash uchun npm paket menejeridan foydalanish maqsadida Node.js'ni o'rnatamiz. Bu kutilmaganda ushbu faylda eng og'riqli qism bo'ldi. 🤮 Men o'rnatmoqchi bo'lgan Node.js versiyasi ustidan to'liq nazoratga ega bo'lishni xohladim, ammo uni o'rnatishning hech bir usuli men tanlagan PHP image'i bilan kutilganidek ishlamadi. 🥴 Ko'p urinishlardan so'ng, eng oson yo'l nvm deb ataladigan qo'shimcha vositadan foydalanib Node.js'ning muayyan versiyasini (keyinchalik hech qanday muammosiz) o'rnatish bo'ldi 🎉
7. Va nihoyat, biz Laravel Scheduler'ni fonda ishlatishni xohlaymiz. Biz cron paketini o'rnatamiz, keyin bizga kerak bo'lgan yagona yozuvni crontab'ga qo'shamiz. Va nihoyat, zarur bo'lganda kuzatib borish uchun log faylini yaratamiz

Endi web xizmati uchun 2 ta muhim fayl yarating.

```bash
touch docker/services/web/web.dockerfile
touch docker/services/web/vhost.conf
```

web.dockerfile mazmuni:

```bash
FROM nginx:1.26.3

COPY vhost.conf /etc/nginx/conf.d/default.conf

RUN ln -sf /dev/stdout /var/log/nginx/access.log
RUN ln -sf /dev/stderr /var/log/nginx/error.log
```

vhost.conf mazmuni:

```bash
server {
    listen 80;
    index index.php index.html;
    root /var/www/public;

    location / {
        try_files $uri /index.php?$args;
    }

    location ~ \.php$ {
        fastcgi_split_path_info ^(.+\.php)(/.+)$;
        fastcgi_pass app:9000;
        fastcgi_index index.php;
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        fastcgi_param PATH_INFO $fastcgi_path_info;
    }
}
```

1. Bizning veb serverimiz (xizmat) Nginx 1.26.3 image'iga asoslanadi
2. Biz server sozlamalarini (vhost.conf) uni bekor qilish uchun konteynerning joylashuviga (standart fayl joylashgan joyga) ko'chiramiz

- Server 80-portni tinglaydi
- Serverning ildiz katalogi Laravel'ning public katalogining aniq joylashuvi hisoblanadi
- Biz web xizmati va kiruvchi PHP so'rovlari uchun 9000-portni (fastcgi_pass app:9000) tinglaydi app xizmati o'rtasida bir turdagi ulanish o'rnatamiz

3. Loglarni faylga chiqarish uchun 2 ta ramziy havola yaratamiz

## Asosiy docker-compose.yml Fayli

Ildizda yozing:

```bash
touch docker-compose.yml
```

Mazmun sifatida:

```bash
services:
  # Ilova
  app:
    build:
      context: ./docker/services/app
      dockerfile: app.dockerfile
    working_dir: /var/www
    volumes:
      - ./src:/var/www
  # Veb Server
  web:
    build:
      context: ./docker/services/web
      dockerfile: web.dockerfile
    working_dir: /var/www
    volumes:
      - ./src:/var/www
    ports:
      - "80:80"
  # Ma'lumotlar bazasi
  database:
    image: mysql:8.0.25
    volumes:
      - ./docker/volumes/mysql:/var/lib/mysql
    environment:
      MYSQL_DATABASE: ${DB_DATABASE}
      MYSQL_ROOT_PASSWORD: ${DB_PASSWORD}
      MYSQL_PASSWORD: ${DB_PASSWORD}
      MYSQL_USER: ${DB_USERNAME}
    ports:
      - "3306:3306"
  # Ma'lumotlar bazasini boshqarish
  pma:
    image: phpmyadmin:5.1
    environment:
      - PMA_ARBITRARY=1
      - PMA_HOST=${DB_HOST}
      - PMA_USER=${DB_USERNAME}
      - PMA_PASSWORD=${DB_PASSWORD}
      - PMA_PORT=${DB_PORT}
    depends_on:
      - "database"
    ports:
      - "8888:80"
  # Keshlash
  redis:
    image: redis:alpine
    volumes:
      - ./docker/volumes/redis:/data
    ports:
      - "6379:6379"
  # Pochta serveri
  mailhog:
    image: mailhog/mailhog:latest
    logging:
      driver: "none"
    ports:
      - "1025:1025"
      - "8025:8025"
```

Bu biz yaratayotgan ko'p konteynerli Docker ilovasi uchun barcha quyidagilarni aniqlaydigan asosiy YAML fayli:

- xizmatlar
- tarmoqlar
- volume'lar

Aslida bu faylning faqat ikkita asosiy bo'limi bor:

1. services — biz birgalikda ko'p konteynerli Laravel ilovamizni yaratadigan barcha konteynerlarni aniqlaymiz

- Ilova `app`
- Veb Server `web`
- Ma'lumotlar bazasi `database`
- Ma'lumotlar bazasini boshqarish `pma`
- Keshlash `redis`
- Pochta serveri `mailhog`

Ilova mahalliy app.dockerfile fayli asosida quriladi. Bu yerda asosiy narsa mahalliy src katalogi va konteynerdagi /var/www o'rtasida volume aniqlashdir, chunki bu namuna ilova uchun joy hisoblanadi.

Veb Server avvalgidek, mahalliy web.dockerfile fayli Docker image yaratish uchun manba hisoblanadi. Biz avvalgidek bir xil turdagi volume aniqlaymiz, ammo eng muhimi biz veb serverimiz Laravel bilan qaysi portda ishlashini belgilaymiz. Ba'zida macOS 80-portni egallashi mumkin bo'lgani uchun xavfsizlik maqsadida hostda 8080 (chap tomon) dan foydalanamiz. Bu konteynerdagi 80-portga (o'ng tomon) yo'naltiriladi. Web xizmatini ishga tushirishdan oldin barcha muhim xizmatlar mavjudligini ta'minlash uchun biz Docker web xizmatidan oldin ishga tushiradigan boshqa xizmatlar ro'yxati bilan depends_on kalitini ko'rsatamiz.

Ma'lumotlar bazasi MySQL'ning muayyan versiyasining tashqi image'i asosida quriladi. Konteyner ishga tushirishlari o'rtasida ma'lumotlarni doimiy saqlash uchun volume ulaymiz. Bu host'ning ./docker/volumes/mysql'ini konteynerdagi /var/lib/mysql'ga ulaydi. Port raqami bo'yicha ikkala tomonda ham 3306 tanlanadi.

Biz Laravel'ning .env faylidan (./src/.env) foydalanamiz. O'qishni davom eting va hamma narsa aniq bo'ladi.

Ma'lumotlar bazasini boshqarish Laravel'ning ma'lumotlar bazasini qulay boshqarish uchun ixtiyoriy konteyner hisoblanadi. phpMyAdmin brauzer vositasi bo'lgani uchun konteyner ichidagi 80-portga yo'naltirish uchun hostda boshqa port (8888) ko'rsatamiz. Agar ma'lumotlar bazasiga ulanish uchun tashqi dasturdan foydalanishni afzal ko'rsangiz, host manzili sifatida 127.0.0.1 dan foydalanishni unutmang. Qolgan hisob ma'lumotlari (avval aytib o'tilganidek) .env faylidan olinadi. Bu konteyner albatta database'ga depends_on hisoblanadi.

Keshlash Redis image'ining alpine versiyasidan yuklab olinadi. Ma'lumotlar bazasidagi kabi, biz kesh qilingan ma'lumotlarni saqlash uchun host'ning ./docker/volumes/redis'ini konteynerdagi /data'ga ulaymiz.

Pochta serveri eng so'nggi Mailhog Docker image'idir. Biz bir juft port ko'rsatamiz. SMTP server uchun 1025 va HTTP server uchun 8025, chunki Mailhog phpMyAdmin'ga o'xshab veb vositasi hisoblanadi. Shuningdek, biz konteynerning hech qanday log saqlamasligini xohlaymiz. Bu sof bir martalik xizmat.

## Ilova Manbasi

Hozirgacha biz ilovaning o'zi haqida hech narsa ko'rib chiqmadik. Agar sizda mavjud Laravel ilovasi bo'lsa, uni Laravel'ning .env fayli va public katalogi bevosita ostida bo'lishi uchun ./src katalogiga ko'chiring (nusxalang). Agar noldan boshlayotgan bo'lsangiz, shunchaki ushbu katalogga o'ting va u yerda Laravel repository'ni klonlang.

```bash
cd src
git clone git@github.com:laravel/laravel.git .
```

Oxiridagi nuqta yozish xatosi emas. U git'ga qo'shimcha katalog yaratmasdan to'g'ridan-to'g'ri src'ga klonlashni buyuradi.

## Foydalanish

Loyihangizning ildizida local.sh nomli yangi fayl yarating.

```bash
touch local.sh
```

Quyidagi kodni mazmun sifatida joylashtiring:

```bash
#!/bin/bash

function _up() {
  docker compose --env-file ./src/.env up -d
}

function _stop() {
  docker compose --env-file ./src/.env stop
}

function _rebuild() {
  docker compose --env-file ./src/.env up -d --build --force-recreate --remove-orphans
}

function _ssh() {
  docker compose --env-file ./src/.env exec app bash
}

case $1 in
"start") _up ;;
"stop") _stop ;;
"rebuild") _rebuild ;;
"ssh") _ssh ;;
esac
```

Bu konteynerlarni har safar ishga tushirish, to'xtatish yoki qayta qurish kerak bo'lganda foydalanadigan yordamchi skript. U shuningdek app.dockerfile tomonidan taqdim etilgan barcha imkoniyatlardan foydalanish uchun ilova konteyneringizga "kirishga" ham imkon beradi. Bularning barchasi ko'plab argumentlar bilan uzun buyruqlarni yodlash zaruriyatisiz.

Loyihangizning ildizida:

- barcha konteynerlarni ishga tushirish uchun ./local.sh start yozing (-d argumenti konteynerlarni ajratilgan rejimda, ya'ni fonda ishlashini bildiradi, bu sizga boshqa buyruqlar bilan davom etish imkonini beradi)
- barcha konteynerlarni to'xtatish uchun ./local.sh stop yozing
- dockerfile yoki docker-compose.yml'ni o'zgartirgan taqdirda konteynerlarni qayta qurish uchun ./local.sh rebuild yozing
- Ilova konteyneriga kirish uchun ./local.sh ssh yozing

Har bir docker-compose chaqiruvida biz Docker'ni Laravel'ning .env'iga yo'naltirish orqali muhit o'zgaruvchilarini taqdim etamiz. Hech qanday hisob ma'lumotlarini qattiq kodlash shart emas.

Agar shunday bo'lsa, uni shunchaki yarating va .env.example asosida barcha qiymatlarni to'ldiring. Faqat quyidagi sozlamalarni yodda tuting. DB_HOST Docker xizmat nomiga teng bo'lishi kerak! DB_PORT docker-compose.yml'da aniqlangan port bilan mos kelishi kerak.

```bash
DB_CONNECTION=mysql
DB_HOST=database
DB_PORT=3306
DB_DATABASE=foo
DB_USERNAME=user
DB_PASSWORD=password
```

Keshlash bo'limi uchun:

```bash
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379
```

Pochta bo'limi uchun:

```bash
MAIL_MAILER=smtp
MAIL_HOST=mailhog
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS="foo@bar"
MAIL_FROM_NAME="${APP_NAME}"
```

## Birinchi Ishga Tushirish

Endi nihoyat hamma narsani birlashtirish va qurishga vaqt keldi. Loyihangizning ildizida ./local.sh start yozing. Birinchi ishga tushirish har doim ko'p vaqt oladi, chunki ko'pincha hech narsa keshlanmagan va Docker ko'plab image'larni yuklab olishi kerak.

Agar hamma narsa yaxshi ketgan bo'lsa, quyidagiga o'xshash chiqishni ko'rishingiz kerak:

```bash
$ ./local.sh start
[+] Running 6/6
 ⠿ Container foo-com-database-1  Started                                     1.2s
 ⠿ Container foo-com-mailhog-1   Started                                     1.1s
 ⠿ Container foo-com-redis-1     Started                                     1.1s
 ⠿ Container foo-com-app-1       Started                                     0.5s
 ⠿ Container foo-com-web-1       Started                                     0.6s
 ⠿ Container foo-com-pma-1       Started                                     1.5s
```

Bu bosqichda biz localhost:80 da ilovamizga kirish imkoniyatiga ega bo'lishimiz kerak.

Xohlagan brauzeringizda http://localhost:80 ni oching.

![localhost:80](https://mattkomarnicki.com/resources/files/e2943556-248e-4758-a9a2-cd6350d10084.png)

> Ushbu Fatal error ni ko'rish sizni qo'rqitmasin. Bu bog'liqliklar hali o'rnatilmaganligining ko'rsatkichidir. Biz hali Composer bilan shug'ullanmaganimiz uchun bu mantiqan to'g'ri. Backend uchun vendor katalogi shunchaki yo'q. Buni keyingi bosqichda tuzatamiz.

Keling, ilova konteyneriga kiramiz.

Buning uchun ./local.sh ssh yozing.

```bash
$ ./local.sh ssh
root@43e8b64ef81f:/var/www#
```

Biz hozir konteyner ichidagi WORKDIR'damiz. Bu loyihamizning ildiz joylashuvi.

Quyidagilardan birini yozib muhim buyruqlar mavjudligini tekshiring:

- php -v
- php -m
- which composer
- which node
- which npm

Siz tegishli chiqishni olishingiz kerak, masalan:

```bash
root@43e8b64ef81f:/var/www# php -v
PHP 8.4.13 (cli) (built: Oct  1 2025 20:25:45) (NTS)
Copyright (c) The PHP Group
Built by Debian
Zend Engine v4.4.13, Copyright (c) Zend Technologies
    with Zend OPcache v8.4.13, Copyright (c), by Zend Technologies
```

yoki

```bash
root@43e8b64ef81f:/var/www# composer
   ______
  / ____/___  ____ ___  ____  ____  ________  _____
 / /   / __ \/ __ `__ \/ __ \/ __ \/ ___/ _ \/ ___/
/ /___/ /_/ / / / / / / /_/ / /_/ (__  )  __/ /
\____/\____/_/ /_/ /_/ .___/\____/____/\___/_/
                    /_/
```

Keling, endi barcha bog'liqliklarni yuklab olamiz.

composer install yozing.

![composer install](https://mattkomarnicki.com/resources/files/edd41c2f-1bfa-43c8-907d-f1bbfd5c90b1.png)

Endi brauzeringizni yangilang.
![refresh browser](https://mattkomarnicki.com/resources/files/ba8a3995-7dd5-4620-8397-5ce7168901cb.png)

> Deyarli yetib keldik. Endi Laravel biz bilan gaplashmoqda. Biz albatta ilova kalitini yo'qotdik. Keling, uni tegishli buyruq bilan yarataylik.

`php artisan key:generate` yozing

Chiqish quyidagiga o'xshash bo'lishi kerak:

```bash
root@43e8b64ef81f:/var/www# php artisan key:generate

   INFO  Application key set successfully.

root@43e8b64ef81f:/var/www#
```

Sahifani yangilang:

![refresh page](https://mattkomarnicki.com/resources/files/dd26faec-6f8c-41e0-b90d-a9a7b0d777c3.png)

> Uyga xush kelibsiz!

Agar loyihangizda package.json bo'lsa, kutilganidek npm ci yoki npm run production kabi buyruqlarni ishga tushirish node_modules katalogini yaratishi, kerakli hamma narsani yuklab olishi va frontend aktivlarini kompilyatsiya qilishi kerak (bu butunlay sizning holatingazga bog'liq). Biz bu yerda frontend va JavaScript bilan ko'p shug'ullanmaymiz.

## Ma'lumotlar Bazasiga Kirish

Ushbu bobda biz tezda ma'lumotlar bazasi konteynerini ko'rib chiqamiz va ma'lumotlar bazasi hamda Laravel o'rtasidagi ulanish to'g'ri o'rnatilayotganligini ta'minlaymiz. phpMyAdmin bilan boshlaylik. Bu ma'lumotlar bazamizga kirishning eng tezkor usuli hisoblanadi.

http://localhost:8888 ga o'ting — bu port raqami phpMyAdmin'ga berilgan.

![pma](https://mattkomarnicki.com/resources/files/871dd321-b8c7-4186-9ecb-a154ef2d5307.png)

> foo deb ataladigan maqsadli ma'lumotlar bazasi chap tomondagi yon panelda ko'rinadi. U mavjud, ammo hech narsa yo'q. Keyingi qadam uni bir nechta boshlang'ich ma'lumotlar bilan to'ldirish va shu bilan ulanishning hech qanday muammosiz o'rnatilayotganligini baholashdir.

Ilova konteynerida (./local.sh ssh) php artisan migrate:fresh --seed yozing.

![migration](https://mattkomarnicki.com/resources/files/16963f17-e449-4f0f-9b61-6f0fb377e7a3.png)

phpMyAdmin'ni yangilang. Bingo! Ma'lumotlar bazasi ham migratsiya qilindi, ham to'ldirildi.

Yozing:

```bash
ls -alh ~/Code/foo-com/docker/volumes/mysql/
```

Docker'ning ma'lumotlarni saqlash uchun maxsus volume'dan qanday foydalanishini ko'rish uchun, bu hamma narsa to'g'ri ekanligining yakuniy isboti.

## Keshga Kirish

Ushbu bobda biz Redis konteyneri bilan qanday ishlashini ko'rish uchun Laravel'ning keshlashidan foydalanamiz. Boshlash uchun Composer yordamida predis/predis paketini o'rnatishimiz kerak.

Endi keshlashni tezda sinab ko'rish uchun, vaqtincha bosh marshrutni (ehtimol web.php ostida) quyidagi kod bilan yopiq funksiyaga o'rnataylik.

```php
<?php

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    $key = 'hello';

    dump('hello is', Cache::get($key));

    Cache::put($key, 'cached world', now()->addMinutes(10));

    dump('hello is', Cache::get($key));
});
```

Endi ushbu tartibda amallarni bajaring:

1. Ilova konteynerida php artisan cache:clear orqali keshni tozalang
2. http://localhost'ni oching. Satr hali hech qachon keshlanmagani uchun birinchi dump null bo'lishi kerak
3. Sahifani yangilang, ikkala dump ham kesh qilingan satrni ko'rsatadi

## Pochta va Laravel Scheduler

Oxirgi bobda biz Mailhog asosidagi Pochta serverini ham sinab ko'ramiz, shuningdek Laravel Scheduler'ning to'g'ri ishlashini baholaymiz. Keling, ikkisini bir vaqtda amalga oshiramiz — buning uchun soxta elektron pochta yuborish uchun mas'ul bo'lgan Artisan Console buyrug'ini yaratamiz. Buyruq har daqiqada ishlash uchun rejalashtiriladi.

`php artisan make:command SendDummyEmail` yozing.

```bash
root@43e8b64ef81f:/var/www# php artisan make:command SendDummyEmail

   INFO  Console command [app/Console/Commands/SendDummyEmail.php] created successfully.

root@43e8b64ef81f:/var/www#
```

Yangi yaratilgan klassni oching. Mazmun sifatida quyidagi kodni ishlating:

```php
<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class SendDummyEmail extends Command
{
    protected $signature = 'send:dummy-email';
    protected $description = 'Sends dummy e-mail';

    public function handle()
    {
        Mail::raw('Hello foo-bar!', function ($message) {
            $message->to('foo@bar')->subject('You should get this message every minute…');
        });

        return Command::SUCCESS;
    }
}
```

Buyruqni qo'lda ishga tushiramiz:

```bash
php artisan send:dummy-email
```

Endi Mailhog'ni ochish uchun http://localhost:8025 ga o'ting. Yangi xabar sizni kutib turgan bo'lishi kerak.

Va nihoyat, Laravel'ning xuddi shunday narsani takroriy asosda amalga oshira olishini ko'ramiz.

## Xulosa

Mana sizning ilovangiz. Dockerlashtirilgan LEMP muhitida to'liq ishlaydi. Bu har qanday turdagi dasturiy ta'minotni qurishni boshlash uchun mukammal boshlang'ich nuqta. Mono-repo'dan mikro-xizmat yo'naltirilgan yondashuvgacha.

Umid qilamanki, ushbu qo'llanma sizga foydali bo'ldi. Har bir qismni o'z ehtiyojlaringizga moslab erkin o'zgartiring.
```
