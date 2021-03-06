# Sencha ExtJS 5.1.2 CRUD Web Application

This is a web application implementing **CRUD Operations** using the following software architecture:

## Software prerequisites to use this project

- [x] Visual Studio 2015 ([website](https://www.visualstudio.com/products/vs-2015-product-editions))
- [x] Sencha Architect 3.2 Build 339 ([website](https://www.sencha.com/products/architect/#overview))
- [x] Sencha ExtJS 5.1.2 ([website](https://www.sencha.com/products/extjs/#overview))
- [x] Sencha Command 6.0.2.14 ([website](https://www.sencha.com/products/extjs/cmd-download/))

## Frontend

- [x] Sencha **ExtJS 5.1.2**
- [x] Sencha **Architect 3.2**
- [x] Sencha **Command 6.0.2.14**

> **Note:** In source code, the project called **``PrototipoFrontend``** was made in an ``ASP.NET 5`` project using ``MVC 5`` just to use Razor view engine to render the Single Page Application in browsers instead an *index.html*. This project is the development environment using ``Sencha Arhitect 3.2 and ExtJS 5.1.2``.
> Now, the project called **``Portal``** was made in ASP.NET 5 with MVC 5 that serves as Production when the project ``PrototipoFrontend`` is builded with ``Sencha Command`` in previous step and output the files result in this project.

## Backend

- [x] **ASP.NET 5** with **Web API 2**
- [x] **Memory Data Caching** instead Database just for testing purpouses

> **Note:** The project called **``PrototipoServicios``** was made in ``ASP.NET 5 with Web API 2`` to create API RestFul services that provide the CRUD operations to the Frontend using Memory Data Caching on them, the programming language that was used is ``C#``.

# Use case

The use case for this project example was to create, read, update and delete (CRUD) operations over a Person catalog, with some other read catalogs just to fill some Comboboxes in ``Sencha ExtJS`` using ``Sencha Architect``, additional the need to create the Person ``Ext.data.Model`` dynamically with its ``Ext.data.Store`` too.
The project is capable to consume **``RestFul APIs``** created with any Backend solution like ``Web API 2``, ``Java``, ``php``, ``Node.js``, etc.

# Instructions for setup the project will be soon

1. ...
2. ...
3. ...
4. ...