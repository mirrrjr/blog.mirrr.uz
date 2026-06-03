---
id: building-a-simple-dependency-injection-container-in-php-uz
title: Dependency Injection (DI) Konteyneri PHP da
date: 2026-06-15
author: Khaled Zeitar
readingTime: 30
tags: [php, di]
excerpt: Dependency Injection (DI) — bu dasturiy ta'minotda kod modullarini ajratish va testlash, texnik xizmat ko'rsatish va kengaytirishni osonlashtirish uchun keng qo'llaniladigan dizayn namunasi.
---

![banner](https://miro.medium.com/v2/resize:fit:720/format:webp/1*KZs0DkkwQPayqRQPcvpOmA.png)

# Dependency Injection (DI) Konteyneri PHP da

Dependency Injection (DI) — bu dasturiy ta'minotda kod modullarini ajratish va testlash, texnik xizmat ko'rsatish va kengaytirishni osonlashtirish uchun keng qo'llaniladigan dizayn namunasi. DI konteyneri — obyektlarni yaratish, ularning umr bo'yi va bog'liqliklarini hal qilishni boshqaradigan vosita. Ushbu maqolada PHP da oddiy dependency injection konteynerini qanday yaratishni o'rganamiz.

## Talablar

- PHP 7.2 yoki yuqori versiya
- Obyektga yo'naltirilgan dasturlash (OOP) va DI haqida asosiy bilimlar

## Konteynerni Yaratish

DI konteyner klassi obyekt ta'riflari va nusxalari uchun ro'yxat sifatida ishlaydi. Konteyner klassini quyidagicha yaratishimiz mumkin:

```php
class Container
{
    private $bindings = [];

    public function set(string $id, callable $factory): void
    {
        $this->bindings[$id] = $factory;
    }

    public function get(string $id)
    {
        if (! isset($this->bindings[$id])) {
            throw new Exception("Maqsadli bog'liq [$id] mavjud emas.");
        }

        $factory = $this->bindings[$id];

        return $factory($this);
    }
}
```

`Container` klassida `$bindings` nomli yagona xususiy xususiyat mavjud bo'lib, u obyekt identifikatorlarini ularning fabrika funksiyalariga moslashtiruvchi assotsiativ massivdir.

`set()` metodi obyekt ta'riflarini ro'yxatdan o'tkazish uchun ishlatiladi. U ikkita argument qabul qiladi: `$id` (obyekt identifikatorini ifodalovchi satr) va `$factory` (obyekt nusxasini qaytaruvchi chaqiriladigan funksiya). `$factory` argumenti chaqirilishi mumkin bo'lgan funksiya yoki metod ekanligini ta'minlash uchun `callable` turidan foydalanamiz.

`get()` metodi konteynerdan obyektlarni olish uchun ishlatiladi. U bir argument qabul qiladi: `$id` (obyekt identifikatorini ifodalovchi satr). Agar obyekt allaqachon yaratilgan bo'lsa, metod nusxani qaytaradi. Aks holda, `$bindings` dan obyekt ta'rifini qidiradi, fabrika funksiyasini `$this` (ya'ni konteyner) bilan chaqirib obyekt nusxasini yaratadi va nusxani keyingi foydalanish uchun konteynerda saqlaydi.

## Konteynerdan Foydalanish

Konteynerdan foydalanish uchun obyektlar va ularning bog'liqliklarini aniqlashimiz kerak. Buning turli usullari mavjud, biz fabrika funksiyalaridan foydalanamiz.

Fabrika funksiyasi — obyekt nusxasini qaytaradigan funksiya. U konteyner tomonidan hal qilinadigan bog'liqliklarni argument sifatida qabul qilishi mumkin. Masalan, `Logger` va `Database` klasslarini `UserController` klassiga kiritish kerak bo'lsin:

```php
class Logger
{
    public function log(string $message): void
    {
        echo "LOG: $message\n";
    }
}

class Database
{
    private $host;
    private $username;
    private $password;
    private $dbname;

    public function __construct(string $host, string $username, string $password, string $dbname)
    {
        $this->host = $host;
        $this->username = $username;
        $this->password = $password;
        $this->dbname = $dbname;
    }

    public function query(string $sql): array
    {
        // ...
    }
}

class UserController
{
    private $logger;
    private $db;

    public function __construct(Logger $logger, Database $db)
    {
        $this->logger = $logger;
        $this->db = $db;
    }

    public function index()
    {
        $users = $this->db->query('SELECT * FROM users');

        foreach ($users as $user) {
            $this->logger->log('Foydalanuvchi ' . $user['name'] . ' tizimga kirdi');
        }
    }
}

$container = new Container();

$container->set('logger', function () {
    return new Logger();
});

$container->set('database', function ($container) {
    $config = $container->get('config');

    return new Database(
        $config['db']['host'],
        $config['db']['username'],
        $config['db']['password'],
        $config['db']['dbname']
    );
});

$container->set('config', function () {
    return [
        'db' => [
            'host' => 'localhost',
            'username' => 'root',
            'password' => 'password',
            'dbname' => 'mydatabase'
        ]
    ];
});

$container->set('userController', function ($container) {
    $logger = $container->get('logger');
    $db = $container->get('database');

    return new UserController($logger, $db);
});
```

Bu misolda to'rtta obyekt aniqlanadi: `logger`, `database`, `config` va `userController`. `logger` va `database` obyektlari o'z klasslari yordamida yaratiladi va ularning bog'liqliklari `$container->get('config')` chaqiruvi orqali hal qilinadi. `config` obyekti sozlash qiymatlarini saqlaydigan oddiy massivdir.

`userController` obyekti `UserController` klassi yordamida yaratiladi va uning bog'liqliklari `$container->get('logger')` va `$container->get('database')` chaqiruvlari orqali hal qilinadi.

Konteynerdan foydalanish uchun obyektlarni identifikatorlari orqali olishimiz mumkin:

```php
$userController = $container->get('userController');
$userController->index();
```

`$container->get('userController')` chaqirilganda, konteyner `logger` va `database` obyektlarini yaratadi va ularni `UserController` konstruktoriga kiritadi. `userController` obyekti qaytariladi va boshqa PHP obyektlari kabi ishlatilishi mumkin.

## Avtomatik Bog'liqlikni Hal Qilish

Fabrika funksiyalari yordamida obyektlar va ularning bog'liqliklarini aniqlashdan tashqari, klasslar uchun bog'liqliklarni avtomatik hal qilishda PHP ning reflection imkoniyatlaridan ham foydalanishimiz mumkin.

Buning uchun konteynerda klass nomini argument sifatida qabul qiladigan va PHP ning reflection imkoniyatlaridan foydalanib klass nusxasini yaratadigan hamda uning bog'liqliklarini kiritadigan `build()` metodini aniqlaymiz:

```php
class Container
{
    private array $bindings = [];

    public function set($id, $factory)
    {
        $this->bindings[$id] = $factory;
    }

    /**
     * @throws Exception
     */
    public function get($id)
    {
        if (! isset($this->bindings[$id])) {
            throw new Exception("Maqsadli bog'liq [$id] mavjud emas.");
        }

        $factory = $this->bindings[$id];

        return $factory($this);
    }

    /**
     * @throws Exception
     */
    public function build(string $class)
    {
        try {
            $reflector = new ReflectionClass($class);
        } catch (ReflectionException $e) {
            throw new Exception("Maqsadli klass [$class] mavjud emas.", 0, $e);
        }

        // Agar tur ishga tushirilmaydigan bo'lsa, masalan Interface yoki Abstract Class
        if (! $reflector->isInstantiable()) {
            throw new Exception("Maqsad [$class] ishga tushirilishi mumkin emas.");
        }

        $constructor = $reflector->getConstructor();

        // Agar konstruktor bo'lmasa, bog'liqliklar ham yo'q
        if ($constructor === null) {
            return new $class;
        }

        $parameters = $constructor->getParameters();
        $dependencies = [];

        foreach ($parameters as $parameter) {
            $type = $parameter->getType();

            if (! $type instanceof ReflectionNamedType || $type->isBuiltin()) {
                // Klass ko'rsatilmagan primitiv bog'liqlikni hal qilish
                if ($parameter->isDefaultValueAvailable()) {
                    $dependencies[] = $parameter->getDefaultValue();
                } else if ($parameter->isVariadic()) {
                    $dependencies[] = [];
                } else {
                    throw new Exception("Hal qilib bo'lmaydigan bog'liqlik [$parameter] {$parameter->getDeclaringClass()->getName()} klassida");
                }
            }

            $name = $type->getName();

            // Konteynerdan klass asosidagi bog'liqlikni hal qilish
            try {
                $dependency = $this->get($name);
                $dependencies[] = $dependency;
            } catch (Exception $e) {
                if ($parameter->isOptional()) {
                    $dependencies[] = $parameter->getDefaultValue();
                } else {
                    $dependency = $this->build($parameter->getType()->getName());
                    $this->set($name, $dependency);
                    $dependencies[] = $dependency;
                }
            }
        }

        return $reflector->newInstanceArgs($dependencies);
    }
}
```

Bu misolda `build()` metodi klass nomini argument sifatida qabul qiladi va PHP ning reflection imkoniyatlaridan foydalanib klass nusxasini yaratadi hamda uning bog'liqliklarini kiritadi.

Avval berilgan klass nomi uchun yangi `ReflectionClass` obyekti yaratamiz. Klassning ishga tushirilishi mumkinligini tekshiramiz, aks holda istisno tashlaymiz. Agar klass ishga tushirilishi mumkin bo'lsa, `getConstructor()` metodi yordamida uning konstruktorini olamiz.

Agar klassda konstruktor bo'lmasa, yangi klass nusxasini qaytarsa bo'ladi. Agar konstruktor mavjud bo'lsa, parametrlar bo'ylab aylanib, konteynerning `get()` metodi yordamida har bir bog'liqlikni hal qilishga harakat qilamiz.

Va nihoyat, `ReflectionClass` obyektining `newInstanceArgs()` metodi yordamida klassning yangi nusxasini yaratamiz va hal qilingan bog'liqliklarni uzatamiz.

## Avtomatik Bog'liqlikni Hal Qilishdan Foydalanish

Avtomatik bog'liqlikni hal qilish bilan konteynerdan foydalanish uchun `get()` o'rniga `build()` metodini chaqirish kifoya:

```php
$container = new Container();

$container->set(Database::class, function () {
    $config = [
        'host' => 'localhost',
        'username' => 'root',
        'password' => 'password',
        'dbname' => 'mydatabase'
    ];

    return new Database(
        $config['host'],
        $config['username'],
        $config['password'],
        $config['dbname']
    );
});

$userController = $container->build(UserController::class);
$userController->index();
```

Bu misolda konteynerning `build()` metodi chaqiriladi va argument sifatida `UserController::class` satri uzatiladi. Konteyner reflection va oldin `set()` metodi yordamida aniqlagan bog'liqlardan foydalanib, `UserController` klassining `Logger` va `Database` bog'liqliklarini avtomatik ravishda hal qiladi.

> Avtomatik bog'liqlikni hal qilish kodimizni soddalashtirishga va yozishimiz kerak bo'lgan sozlash miqdorini kamaytirishga yordam beradi. Biroq, reflection ishlatilishi tufayli ba'zi ishlash xarajatlari ham bo'lishi mumkin.

Shuning uchun muvozenani ko'rib chiqish va o'zingizning maxsus foydalanish holatingiz uchun mos yondashuvni tanlash muhimdir. Agar ishlash tezligi muhim bo'lsa, fabrika funksiyalaridan foydalanib barcha bog'liqliklarni qo'lda ko'rsatish yaxshiroq. Aksincha, moslashuvchanlik va foydalanish qulayligi muhimroq bo'lsa, avtomatik bog'liqlikni hal qilishni afzal ko'rish mumkin.

## PHP uchun Dependency Injection Konteyner Paketlari

PHP dependency injection ehtiyojlaringiz uchun [PHP-DI](https://php-di.org/doc/) kabi paketdan foydalanishni ko'rib chiqing. PHP-DI — avtomatik ulash (auto wiring), annotatsiyalar va lazy-loading hamda keshlash kabi boshqa foydali xususiyatlarni qo'llab-quvvatlaydigan mashhur va kuchli paket. Bunday paketdan foydalanib, vaqtni tejashingiz va kodingiz qo'llab-quvvatlanish bo'yicha eng yaxshi amaliyotlarga rioya qilishini ta'minlashingiz mumkin.

## Xulosa

Ushbu maqolada PHP da oddiy dependency injection konteynerini qanday yaratishni o'rgandik. Fabrika funksiyalari yordamida obyektlar va ularning bog'liqliklarini aniqladik va obyektlarni olish hamda ularning bog'liqliklarini kiritish uchun konteynerdan foydalandik. DI konteyneri kodimizni ajratishga va uni yanada qo'llab-quvvatlanadigan, testlanadigan va kengaytirilishi mumkin qilishga yordam beradi.
