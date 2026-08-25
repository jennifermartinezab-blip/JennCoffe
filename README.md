# JennCoffee

## Descripción

JennCoffee es un sistema web para gestionar productos, categorías, clientes, pedidos y usuarios administrativos de una cafetería con temática coreana.

## Estado del proyecto

El proyecto se encuentra en desarrollo.

Hasta el momento se creó la estructura inicial del backend y se configuró un servidor básico con Node.js y Express.

## Módulos del sistema

- Productos
- Categorías
- Clientes
- Pedidos
- Usuarios administrativos

## Estructura actual

```text
JennCoffee/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── app.js
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
├── frontend/
├── .gitignore
└── README.md




```
## Base de datos
El proyecto utiliza MongoDB como base de datos. 

El backend se conecta a MongoDB mediante Mongoose y la configuración de conexión se maneja mediante variables de entorno.

## Categorías

Se implementó el CRUD de categorías mediante la API REST.

Actualmente permite:

- Registrar categorías.
- Consultar categorías.
- Actualizar categorías.
- Eliminar categorías.
- Validar categorías duplicadas.

Las peticiones fueron probadas con Postman y los datos se verificaron en MongoDB Compass.


