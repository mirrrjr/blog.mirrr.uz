---
id: building-a-simple-dependency-injection-container-in-php-en
title: Building a simple Dependency Injection container in PHP
date: 2026-06-15
author: Khaled Zeitar
readingTime: 30
tags: [php, di]
excerpt: Dependency Injection (DI) is a widely adopted design pattern used in software development to decouple code modules and facilitate testing, maintenance, and extensibility.
---

![banner](https://miro.medium.com/v2/resize:fit:720/format:webp/1*KZs0DkkwQPayqRQPcvpOmA.png)

Dependency Injection (DI) is a widely adopted design pattern used in software development to decouple code modules and facilitate testing, maintenance, and extensibility. A DI container is a tool that manages object creation, lifetime, and dependencies resolution. In this article, we will learn how to build a simple dependency injection container in PHP.

## Prerequisites:

> PHP 7.2 or higher
> Basic knowledge of object-oriented programming (OOP) and DI.

## Creating the Container:

A DI container class acts as a registry for object definitions and instances. We can create a container class as follows:

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
            throw new Exception("Target binding [$id] does not exist.");
        }

        $factory = $this->bindings[$id];

        return $factory($this);
    }
}
```

The `Container` class has a single private property called `$bindings`, which is an associative array that maps object IDs to their factory functions.

The `set()` method is used to register object definitions. It takes two arguments: `$id` (a string representing the object ID) and` $factory` (a callable that returns the object instance). We use the `callable` type hint to ensure that the `$factory` argument is a function or a method that can be invoked.

The `get()` method is used to retrieve objects from the container. It takes one argument: `$id` (a string representing the object ID). If the object has already been created (i.e., its instance exists in the container), the method returns the instance. Otherwise, it looks up the object definition in `$bindings`, creates the object instance by invoking the factory function with `$this` (i.e., the container) as an argument, and stores the instance in the container for later use.

## Using the Container:

To use the container, we need to define objects and their dependencies. There are different ways to do this, but we will use factory functions.

A factory function is a function that returns an object instance. It can take dependencies as arguments, which are resolved by the container. For example, suppose we have two classes, `Logger` and `Database`, that need to be injected into a `UserController` class:

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
            $this->logger->log('User ' . $user['name'] . ' logged in');
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

In this example, we define four objects: `logger`, `database`, `config`, and `userController`. The `logger` and `database` objects are created using their respective classes and their dependencies are resolved by calling `$container->get('config')`. The `config` object is a simple array that stores configuration values.

The `userController` object is created using the `UserController` class and its dependencies are resolved by calling `$container->get('logger')` and `$container->get('database')`.

To use the container, we can retrieve objects using their IDs:

```php
$userController = $container->get('userController');
$userController->index();
```

When we call `$container->get('userController')`, the container creates the `logger` and `database` objects and injects them into the `UserController` constructor. The `userController` object is then returned and can be used as any other PHP object.

## Auto Dependency Resolution:

In addition to defining objects and their dependencies using factory functions, we can also use PHP’s reflection capabilities to automatically resolve dependencies for classes.

To do this, we can define a `build()` method in the container that takes a class name as an argument and uses PHP's reflection capabilities to create an instance of the class and inject its dependencies. Here's an example implementation:

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
            throw new Exception("Target binding [$id] does not exist.");
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
            throw new Exception("Target class [$class] does not exist.", 0, $e);
        }

        // If the type is not instantiable, such as an Interface or Abstract Class
        if (! $reflector->isInstantiable()) {
            throw new Exception("Target [$class] is not instantiable.");
        }

        $constructor = $reflector->getConstructor();

        // If there are no constructor, that means there are no dependencies
        if ($constructor === null) {
            return new $class;
        }

        $parameters = $constructor->getParameters();
        $dependencies = [];

        foreach ($parameters as $parameter) {
            $type = $parameter->getType();

            if (! $type instanceof ReflectionNamedType || $type->isBuiltin()) {
                // Resolve a non-class hinted primitive dependency.
                if ($parameter->isDefaultValueAvailable()) {
                    $dependencies[] = $parameter->getDefaultValue();
                } else if ($parameter->isVariadic()) {
                    $dependencies[] = [];
                } else {
                    throw new Exception("Unresolvable dependency [$parameter] in class {$parameter->getDeclaringClass()->getName()}");
                }
            }

            $name = $type->getName();

            // Resolve a class based dependency from the container.
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

In this example, the `build()` method takes a class name as an argument and uses PHP's reflection capabilities to create an instance of the class and inject its dependencies.

First, we create a new `ReflectionClass` object for the given class name. We check if the class is instantiable and if not, throw an exception. If the class is instantiable, we get its constructor using the `getConstructor()` method.

If the class doesn’t have a constructor, we can simply return a new class instance. If the class does have a constructor, we loop through its parameters and try to resolve each dependency using the `get()` method of the container.

Finally, we create a new instance of the class using the newInstanceArgs() method of the ReflectionClass object and pass in the resolved dependencies.

## Using Auto Dependency Resolution:

To use the container with an auto-dependency resolution, we can simply call the `build()` method instead of the `get()` method:

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

In this example, we call the `build()` method of the container and pass in the `UserController::class` string as an argument. The container automatically resolves the `Logger` and `Database` dependencies of the `UserController` class using reflection and the bindings we defined earlier using the `set()` method.

> Using auto-dependency resolution can simplify our code and reduce the amount of configuration we need to write. However, it can also have some performance overhead due to the use of reflection.

Therefore, it’s important to consider the trade-offs and choose the appropriate approach for your specific use case. If performance is a concern, you may want to use factory functions and manually specify all dependencies. In contrast, if flexibility and ease of use are more important, you may prefer to use auto dependency resolution.

Overall, dependency injection containers are a powerful tool for managing dependencies and improving the flexibility and maintainability of our code. By using them, we can make our code more modular, easier to test, and easier to change over time.

## Dependency Injection Container Packages for PHP:

Consider using a package like [PHP-DI](https://php-di.org/doc/) for your PHP dependency injection needs. [PHP-DI](https://php-di.org/doc/) is a popular and powerful package with support for auto wiring, annotations, and other useful features like lazy-loading and caching. By using a package like PHP-DI, you can save time and ensure that your code follows best practices for maintainability.

## Conclusion:

In this article, we learned how to build a simple dependency injection container in PHP. We defined objects and their dependencies using factory functions and used the container to retrieve objects and inject their dependencies. A DI container can help us decouple our code and make it more maintainable, testable, and extensible.
