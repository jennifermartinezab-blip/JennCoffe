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


## Productos

Se implementó el CRUD de productos mediante la API REST.

Cada producto se relaciona con una categoría registrada en la base de datos.

Actualmente permite:

- Registrar productos.
- Consultar productos.
- Actualizar productos.
- Eliminar productos.
- Buscar productos por nombre.
- Buscar productos por código.
- Buscar productos por categoría.
- Validar códigos de producto duplicados.
- Validar que la categoría exista.
- Validar los datos obligatorios del producto.

Los productos contienen los campos código, nombre, descripción, categoría, precio, imagen, disponibilidad y estado.

Las peticiones fueron probadas con Postman y los datos se verificaron en MongoDB Compass.

## Clientes

Se implementó el CRUD de clientes mediante la API REST.

Actualmente permite:

- Registrar clientes.
- Consultar clientes.
- Actualizar los datos de los clientes.
- Cambiar el estado del cliente entre Activo e Inactivo.
- Eliminar clientes.
- Validar documentos duplicados.
- Validar correos duplicados.
- Validar los campos obligatorios.
- Validar los tipos de documento permitidos.
- Validar los estados permitidos.
- Validar identificadores incorrectos.

Los clientes contienen los campos documento, tipo de documento, nombre, apellidos, correo, teléfono, dirección, contraseña y estado.

La contraseña se cifra utilizando bcrypt antes de almacenarse en MongoDB y no se devuelve en las respuestas de la API.

Las peticiones fueron probadas con Postman y los datos se verificaron en MongoDB Compass.