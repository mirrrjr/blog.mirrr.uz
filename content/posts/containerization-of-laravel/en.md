---
id: laravel-docker-starterkit
title: Build a Complete Dockerized Laravel Environment with PHP, Nginx, MySQL, Redis and Mailpit
date: 2026-10-04
author: MIRRR jr.
readingTime: 12
tags: [php, laravel, nginx, mysql, redis, docker, mailpit]
excerpt: In this article, we will build and use a ready-to-use Docker development environment for Laravel with PHP, Nginx, MySQL, Redis, Mailpit and Node.js.
---

![banner](https://miro.medium.com/v2/resize:fit:720/format:webp/1*fuBQ92euM2g3W6gizteU3A.png)

Setting up a Laravel development environment manually can take a significant amount of time. Installing PHP, Composer, Node.js, MySQL, Redis and a web server separately also becomes inconvenient when working on multiple projects.

That is why I created a **Docker-based starter kit for Laravel projects**.

The starter kit provides a complete development environment with:

- PHP 8.4-FPM
- Nginx 1.28.1
- MySQL 8.4
- Redis 7
- Node.js 22
- Composer 2
- Mailpit
- phpMyAdmin
- Laravel 13

All services are managed through Docker Compose.

---

## Project Structure

The repository has the following structure:

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

The `src` directory contains the Laravel application.

The `docker` directory contains the Docker configuration for the application and web server.

---

## Docker Architecture

The starter kit uses separate containers for the main application layers:

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

Nginx receives HTTP requests and forwards PHP requests to the PHP-FPM container through `app:9000`.

The Laravel application communicates with MySQL, Redis and Mailpit through the Docker network.

---

## PHP Application Container

The application container is based on:

```text
php:8.4-fpm-bookworm
```

It contains the PHP extensions required by the application, including:

- `bcmath`
- `gd`
- `intl`
- `mbstring`
- `opcache`
- `pcntl`
- `pdo_mysql`
- `zip`
- Redis

The container also includes:

- Composer 2
- Node.js 22
- npm

This means that PHP and Node.js do not need to be installed directly on the host machine.

The container working directory is:

```text
/var/www
```

and the local:

```text
./src
```

directory is mounted there.

---

## Nginx

Nginx 1.28.1 is used as the web server.

The Laravel public directory is configured as the web root:

```text
/var/www/public
```

PHP requests are forwarded to PHP-FPM:

```nginx
fastcgi_pass app:9000;
```

Here, `app` is the Docker Compose service name.

The default host port is:

```text
8000
```

Therefore, the application is available at:

```text
http://localhost:8000
```

---

## MySQL

MySQL 8.4 is used as the database server.

The Docker Compose service is named:

```text
database
```

Inside the Docker network, Laravel connects to MySQL using the service name rather than `localhost`:

```env
DB_CONNECTION=mysql
DB_HOST=database
DB_PORT=3306
DB_DATABASE=laravel
DB_USERNAME=laravel
DB_PASSWORD=secret
```

MySQL data is stored in a Docker named volume, so recreating containers does not automatically remove the database data.

---

## Redis

Redis 7 is used for caching and other Laravel-related workloads.

The Laravel configuration can point to the Redis service using:

```env
REDIS_HOST=redis
REDIS_PORT=6379
```

Redis also uses a persistent Docker volume.

This allows the application to use Redis for cache, sessions, queues or other supported Laravel features.

---

## Mailpit

Mailpit is included for local email development.

Instead of sending emails to real recipients, Laravel sends them to Mailpit where they can be inspected through a browser.

Laravel configuration:

```env
MAIL_MAILER=smtp
MAIL_HOST=mailpit
MAIL_PORT=1025
```

The Mailpit web interface is available at:

```text
http://localhost:8025
```

and the SMTP server listens on:

```text
localhost:1025
```

This is especially useful for testing registration emails, password resets and notifications during development.

---

## phpMyAdmin

An optional phpMyAdmin service is also included for database management.

It is available through the Docker Compose `tools` profile.

Default URL:

```text
http://localhost:8888
```

This provides a convenient browser-based interface for managing the MySQL database.

The main Laravel environment does not depend on phpMyAdmin, so it can be omitted when it is not needed.

---

## Environment Configuration

First create the Laravel environment file:

```bash
cp src/.env.example src/.env
```

Then configure Laravel to communicate with the Docker services:

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

One important detail is that `localhost` should not be used as the database host from inside the Laravel container.

Docker services communicate using their Compose service names:

```text
database
redis
mailpit
```

---

## First Boot

Clone the repository:

```bash
git clone https://github.com/mirrrjr/laravel-docker-starterkit.git

cd laravel-docker-starterkit
```

Create the environment file:

```bash
cp src/.env.example src/.env
```

Then run:

```bash
./local.sh init
```

The `init` command:

1. Builds the Docker images.
2. Starts the containers.
3. Installs Composer dependencies.
4. Generates the Laravel application key.
5. Runs the database migrations.
6. Installs npm dependencies.

The first boot may take some time because Docker needs to build images and download the required layers.

Once everything is ready, open:

```text
http://localhost:8000
```

---

## The `local.sh` Helper

The repository includes `local.sh` as a helper for common Docker and Laravel commands.

Start the environment:

```bash
./local.sh up
```

Stop and remove containers:

```bash
./local.sh down
```

Restart the environment:

```bash
./local.sh restart
```

Rebuild the Docker environment:

```bash
./local.sh rebuild
```

View logs:

```bash
./local.sh logs
```

View logs for a specific service:

```bash
./local.sh logs app
```

Enter the application container:

```bash
./local.sh shell
```

Run an Artisan command:

```bash
./local.sh artisan migrate
```

Run Composer:

```bash
./local.sh composer install
```

Run npm:

```bash
./local.sh npm install
```

The main purpose of this helper is to avoid repeatedly typing long `docker compose exec` commands.

---

## Frontend Development

The application container includes Node.js 22 and npm.

Install dependencies:

```bash
./local.sh npm install
```

Start the Vite development server:

```bash
./local.sh npm run dev
```

Build frontend assets:

```bash
./local.sh npm run build
```

Laravel frontend assets are managed through Vite.

---

## Working with the Database

Run migrations:

```bash
./local.sh artisan migrate
```

Reset the database:

```bash
./local.sh artisan migrate:fresh
```

Reset and seed:

```bash
./local.sh artisan migrate:fresh --seed
```

Open Laravel Tinker:

```bash
./local.sh artisan tinker
```

All of these commands can be executed without installing PHP directly on the host system.

---

## Docker Service Ports

The default ports are:

| Service         | Host port | Container port |
| --------------- | --------: | -------------: |
| Laravel / Nginx |    `8000` |           `80` |
| MySQL           |    `3306` |         `3306` |
| Redis           |    `6379` |         `6379` |
| Mailpit SMTP    |    `1025` |         `1025` |
| Mailpit Web     |    `8025` |         `8025` |
| phpMyAdmin      |    `8888` |           `80` |

Ports can be changed through the environment configuration.

For example:

```env
APP_PORT=8080
```

would make the application available at:

```text
http://localhost:8080
```

---

## Why Docker?

The main advantage of this setup is that the development environment is isolated from the host operating system.

You do not need to install and configure:

```text
PHP
MySQL
Redis
Node.js
Composer
Nginx
```

separately for every project.

Docker keeps the required environment together with the project.

Another developer can clone the repository and use the same PHP, Node.js, MySQL and Redis setup.

This helps to:

- reduce environment inconsistencies;
- simplify dependency management;
- shorten project setup time;
- make onboarding easier;
- keep development environments reproducible.

---

## Conclusion

The Laravel Docker Starter Kit provides a ready-to-use development environment for Laravel applications.

The main stack is:

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

The goal is simple: **start Laravel development without spending time manually configuring the entire local environment.**

Clone the repository, configure `.env`, and run:

```bash
./local.sh init
```

Your Dockerized Laravel development environment is then ready to use.
