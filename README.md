# JennCoffee

## Descripción

JennCoffee es un sistema web para gestionar productos, categorías, clientes, pedidos y usuarios administrativos de una cafetería con temática coreana.

## Estado del proyecto

El proyecto se encuentra en desarrollo.

Actualmente se encuentra implementada la estructura principal del backend utilizando Node.js, Express y MongoDB. También se han desarrollado y probado los módulos de categorías, productos, clientes, pedidos, usuarios administrativos y autenticación.

Se inició el desarrollo del frontend utilizando React, TypeScript y Vite. El frontend ya consume información real de la API REST para mostrar el menú de productos y categorías.

Las funcionalidades de la API REST se prueban mediante Postman y los datos almacenados se verifican mediante MongoDB Compass.

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
│   ├── public/
│   │   └── images/
│   │       ├── banners/
│   │       ├── branding/
│   │       └── products/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   └── menu/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── types/
│   │   ├── App.tsx
│   │   ├── index.css
│   │   └── main.tsx
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.ts
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
- Proteger el registro, actualización y eliminación de categorías para que solo puedan ser realizados por administradores autenticados.
- Validar que el nombre de la categoría sea obligatorio.
- Evitar categorías duplicadas, incluso si cambian las mayúsculas o minúsculas.
- Evitar que una categoría sea actualizada con el nombre de otra categoría existente.
- Validar identificadores de categorías y responder correctamente cuando la categoría no exista.
- Impedir la eliminación de categorías que tengan productos asociados.

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
- Validar que los datos obligatorios del producto sean correctos.
- Validar que el código del producto no se repita, incluso si cambia el uso de mayúsculas o minúsculas.
- Validar que la categoría asociada exista antes de registrar o actualizar un producto.
- Validar que el precio sea un número mayor que cero.
- Validar que la disponibilidad sea un valor verdadero o falso.
- Validar que el estado del producto solo pueda ser Activo o Inactivo.
- Validar identificadores de productos y responder correctamente cuando el producto no exista.
- Rechazar identificadores de categoría con formato no válido durante las búsquedas.
- Proteger el registro, actualización y eliminación de productos para que solo puedan ser realizados por administradores autenticados.
- Impedir la eliminación de productos que estén asociados a pedidos registrados.

Los productos contienen los campos código, nombre, descripción, categoría, precio, imagen, disponibilidad y estado.

Las peticiones fueron probadas con Postman y los datos se verificaron en MongoDB Compass.

## Clientes

Se implementó y validó el módulo de clientes mediante la API REST.

Actualmente permite:

- Registrar clientes.
- Consultar clientes.
- Actualizar los datos de los clientes.
- Cambiar el estado del cliente entre Activo e Inactivo.
- Eliminar clientes sin pedidos asociados.
- Impedir la eliminación de clientes que tengan pedidos históricos.
- Validar documentos duplicados.
- Validar correos duplicados.
- Validar los campos obligatorios.
- Validar los tipos de documento permitidos.
- Validar los estados permitidos.
- Validar identificadores incorrectos.
- Validar clientes inexistentes.
- Restringir la consulta, actualización y eliminación de clientes únicamente al administrador.

Los clientes contienen los campos documento, tipo de documento, nombre, apellidos, correo, teléfono, dirección, contraseña y estado.

La contraseña se cifra utilizando bcrypt antes de almacenarse en MongoDB y no se devuelve en las respuestas de la API.

La actualización de clientes no permite modificar ni consultar la contraseña desde las operaciones administrativas.

Se realizaron pruebas positivas y negativas con Postman para los requisitos RF10, RF11, RF12 y RF13. También se verificaron los datos en MongoDB Compass.

## Pedidos

Se implementó el módulo de pedidos.

Actualmente permite:

- Registrar pedidos.
- Consultar los pedidos del cliente autenticado.
- Consultar el detalle de un pedido.
- Cancelar pedidos pendientes.
- Consultar todos los pedidos como administrador.
- Filtrar pedidos por estado.
- Cambiar el estado de los pedidos.
- Validar que un cliente no pueda consultar pedidos pertenecientes a otro cliente.
- Validar que los productos existan, estén activos y disponibles.
- Validar que las cantidades sean mayores que cero.
- Calcular el subtotal y total del pedido desde el backend.
- Conservar el nombre y precio del producto al momento de realizar el pedido.
- Conservar la dirección de entrega utilizada al momento de realizar el pedido.

Los estados utilizados para los pedidos son:

- Pendiente.
- En preparación.
- En camino.
- Entregado.
- Cancelado.

### Pago simulado

Se implementó un proceso de pago simulado para el registro de pedidos.

Los métodos contemplados son:

- Tarjeta simulada.
- Efectivo.

El pago simulado no procesa ni almacena información financiera real.

Cuando se utiliza la tarjeta simulada, el sistema permite comprobar dos escenarios:

- Si el pago simulado es aprobado, el pedido se registra y comienza con estado `Pendiente`.
- Si el pago simulado falla, el pedido no se registra en la base de datos.

El estado del pago y el estado del pedido se manejan de forma independiente.

Por ejemplo, un pedido puede tener:

```text
Pago: Aprobado
Pedido: Pendiente
```

El flujo de pago aprobado y el flujo de pago fallido fueron probados mediante Postman. También se verificó mediante MongoDB Compass que un pago fallido no genera un nuevo pedido.

## Usuarios administrativos

Se implementó y auditó el módulo de gestión de usuarios administrativos correspondiente al RF30.

Actualmente permite:

- Registrar usuarios administrativos.
- Consultar todos los usuarios administrativos.
- Consultar un usuario administrativo por su identificador.
- Actualizar los datos de un usuario administrativo.
- Actualizar la contraseña de un usuario administrativo.
- Cambiar el estado entre Activo e Inactivo.
- Eliminar usuarios administrativos.
- Validar campos obligatorios y tipos de datos.
- Evitar usuarios administrativos duplicados, sin distinguir entre mayúsculas y minúsculas.
- Validar identificadores con formato incorrecto y usuarios inexistentes.

Las operaciones de gestión de usuarios están protegidas mediante autenticación JWT y autorización por rol. Únicamente un usuario con rol Administrador puede acceder a estos endpoints.

Las contraseñas de los usuarios administrativos se protegen utilizando bcrypt y no se muestran en las respuestas de la API.

También se validó que los clientes autenticados no puedan acceder a la gestión de usuarios administrativos y que las solicitudes sin token sean rechazadas.

## Autenticación

Se implementó la autenticación para clientes y administradores utilizando JWT.

Actualmente permite:

- Iniciar sesión como cliente.
- Iniciar sesión como administrador.
- Generar un token JWT.
- Proteger rutas mediante autenticación.
- Diferenciar permisos entre cliente y administrador.
- Bloquear el acceso de usuarios inactivos.
- Cerrar sesión mediante el endpoint de logout.

También se validó que un usuario inactivo no pueda seguir utilizando rutas protegidas aunque tenga un token creado anteriormente.

### Cierre de sesión - RF15

Se implementó el cierre de sesión mediante la API REST.

El endpoint de logout requiere un token JWT válido. Al realizar el cierre de sesión, el backend valida el token y confirma la operación.

Como la autenticación utiliza JWT, el cliente será responsable de eliminar el token almacenado cuando se implemente el frontend.

Se realizaron pruebas de:

- Logout con token válido.
- Intento de logout sin token.

Las pruebas fueron realizadas mediante Postman.

## Frontend

Se inició el desarrollo del frontend utilizando React, TypeScript y Vite.

El frontend se comunica con la API REST del backend mediante Axios. El backend permite las solicitudes provenientes del servidor local de desarrollo del frontend mediante la configuración de CORS.

La interfaz mantiene como referencia visual los mockups definidos para JennCoffee y utiliza una identidad gráfica basada en tonos pastel.

### Consulta del menú - RF16

Se implementó la primera pantalla funcional del menú correspondiente al requisito RF16.

Actualmente permite:

- Consultar las categorías registradas mediante la API REST.
- Consultar los productos registrados mediante la API REST.
- Mostrar información real almacenada en MongoDB.
- Mostrar nombre, descripción, precio, imagen y disponibilidad del producto.
- Mostrar las categorías disponibles.
- Mostrar un estado de carga mientras se obtiene la información.
- Mostrar un mensaje de error cuando no es posible cargar el menú.
- Manejar visualmente el caso en que no existan categorías o productos.
- Adaptar la interfaz a diferentes tamaños de pantalla.

La pantalla del menú se encuentra organizada mediante componentes independientes para el encabezado, banner principal, categorías, cuadrícula de productos, tarjeta de producto y navegación inferior.

La navegación inferior, los iconos, la búsqueda y otras acciones visibles se mantienen por el momento como elementos visuales. Su funcionalidad se incorporará en los requisitos correspondientes.

El diseño responsive fue verificado en vista móvil de 375 px y en escritorio.

También se verificó que la consola del navegador no presentara errores durante la ejecución del menú.

El frontend fue compilado correctamente para producción mediante:

```bash
npm run buildcls
```
### RF17 - Filtrar productos por categoría

Se agregó la opción para filtrar los productos según la categoría seleccionada.

- Al seleccionar una categoría se muestran sus productos.
- Si la categoría no tiene productos, se muestra un mensaje.
- La categoría seleccionada queda resaltada.
- La opción **Ver todas** vuelve a mostrar todos los productos.
- Se realizaron pruebas y funciona correctamente sin errores.
### RF18 - Agregar productos al carrito

Se agregó la opción para añadir productos disponibles al carrito.

- Los productos disponibles se pueden agregar desde el menú.
- Los productos no disponibles no se pueden agregar.
- El carrito guarda temporalmente los productos en el frontend.
- Se muestra un contador en el icono del carrito.
- El mismo producto no se duplica al agregarlo nuevamente.
- Se realizaron pruebas y funciona correctamente sin errores.

### RF19 - Eliminar productos del carrito

Se agregó la opción para eliminar productos del carrito.

- El cliente puede abrir el carrito desde la navegación inferior.
- Los productos agregados se muestran en la vista del carrito.
- Cada producto puede eliminarse individualmente.
- Al eliminar un producto, se actualiza el contenido del carrito.
- Si el carrito queda vacío, se muestra un mensaje indicando que no hay productos.
- El cliente puede volver al menú desde el carrito.
- Se realizaron pruebas funcionales y de compilación correctamente.

### RF20 - Modificar cantidades del carrito

Se agregó la opción para modificar la cantidad de los productos agregados al carrito.

- El cliente puede aumentar la cantidad de cada producto.
- El cliente puede disminuir la cantidad de cada producto.
- La cantidad mínima permitida es 1.
- Los productos del carrito mantienen cantidades independientes.
- La eliminación del producto continúa disponible de forma separada.
- Se realizaron pruebas funcionales con varios productos.
- La compilación del frontend se realizó correctamente.

### RF21 - Calcular total del carrito

Se agregó el cálculo automático de subtotales y del total del carrito.

- Cada producto muestra su subtotal según el precio y la cantidad.
- El subtotal se calcula multiplicando el precio unitario por la cantidad.
- El total del carrito corresponde a la suma de todos los subtotales.
- Los valores se actualizan automáticamente al modificar cantidades.
- Al eliminar productos, el total se recalcula automáticamente.
- El total solo se muestra cuando existen productos en el carrito.
- Se realizaron pruebas funcionales con varios productos y cantidades.
- La compilación del frontend se realizó correctamente.cd
### RF14 - Inicio de sesión del cliente

Se implementó el inicio de sesión del cliente en el frontend.

- El cliente inicia sesión con correo y contraseña.
- El frontend consume el endpoint de autenticación del backend.
- Al iniciar sesión correctamente se recibe y almacena un token JWT.
- El token se agrega automáticamente a las peticiones protegidas.
- Las credenciales inválidas muestran un mensaje de error.
- La sesión permanece activa mientras el token sea válido.
- Se agregó una pantalla de login con el diseño visual de JennCoffee.

### RF15 - Cerrar sesión

Se implementó el cierre de sesión del cliente en el frontend.

- Se agregó la opción Cerrar sesión en el encabezado del menú.
- El frontend consume el endpoint de logout del backend.
- Al cerrar sesión se elimina el token almacenado.
- Se limpia el carrito temporal del cliente.
- El usuario regresa automáticamente a la pantalla de inicio de sesión.
- Después de cerrar sesión, la aplicación permanece en el login al recargar.
- Se realizaron pruebas funcionales y de compilación correctamente.

### RF22 - Registrar pedido

Se implementó el registro de pedidos desde el frontend.

- El cliente puede continuar desde el carrito hacia la confirmación del pedido.
- Se muestra un resumen con productos, cantidades, subtotales y total.
- Se solicita una dirección de entrega.
- Se permite seleccionar un método de pago simulado.
- El frontend envía únicamente los productos, cantidades, dirección y pago simulado.
- El cliente autenticado se obtiene desde el token JWT.
- Los precios, subtotales y total son recalculados y validados por el backend.
- Los pedidos aprobados se almacenan en MongoDB con estado Pendiente.
- Después de registrar correctamente el pedido, el carrito se limpia.
- Se realizaron pruebas funcionales y de compilación correctamente.

### RF23 - Historial de pedidos del cliente

Se implementó la consulta del historial de pedidos del cliente autenticado.

- Se habilitó la opción Mis pedidos en la navegación inferior.
- El frontend consulta el endpoint protegido GET /api/pedidos/mis.
- La consulta utiliza el token JWT del cliente autenticado.
- Solo se muestran los pedidos asociados al cliente que inició sesión.
- Cada pedido muestra fecha, dirección, productos, cantidades, total y estado.
- Los estados del pedido se diferencian visualmente.
- Los pedidos más recientes se muestran primero.
- Después de registrar un pedido, el cliente puede acceder a su historial.
- Se realizaron pruebas funcionales con pedidos en diferentes estados.
- La compilación del frontend se realizó correctamente.

### RF24 - Detalle del pedido

Se implementó la consulta y visualización del detalle de un pedido del cliente autenticado.

- Desde Mis pedidos se agregó la opción Ver detalle.
- Se consulta el endpoint protegido GET /api/pedidos/:id.
- El detalle muestra número del pedido, fecha, estado, dirección de entrega, productos, cantidades, precio unitario, subtotal y total.
- Se muestra el método de pago y el estado del pago.
- Se mantiene la validación del backend para que el cliente solo pueda consultar sus propios pedidos.
- Se agregó compatibilidad con pedidos históricos que no contienen información de pago.
- Los estados del pedido se diferencian visualmente.
- La interfaz fue adaptada al diseño visual de JennCoffee y al mockup de detalle de pedido.
- Se realizaron pruebas funcionales con pedidos Pendiente, En camino y Cancelado.
- La compilación del frontend se realizó correctamente.

### RF25 - Actualización del estado de pedidos por administrador

Se implementó el acceso administrativo y la gestión de estados de los pedidos.

- Se agregó acceso separado para clientes y administradores.
- El administrador inicia sesión mediante POST /api/auth/login utilizando el tipo Administrador.
- Se separaron los tokens de cliente y administrador para evitar conflictos de sesión.
- Se implementó cierre de sesión administrativo.
- Se creó un layout administrativo reutilizable con navegación para Dashboard, Productos, Categorías, Clientes, Pedidos y Usuarios.
- Se implementó la consulta administrativa de pedidos mediante GET /api/pedidos.
- Se muestran cliente, fecha, dirección, estado y total de cada pedido.
- Los estados se diferencian visualmente.
- Se implementó la actualización del estado mediante PATCH /api/pedidos/:id/estado.
- Se respetan las transiciones Pendiente → En preparación → En camino → Entregado.
- Los pedidos Entregado y Cancelado no ofrecen un siguiente estado.
- El backend continúa siendo responsable de validar las transiciones permitidas.
- Se verificó la persistencia de los cambios de estado.
- Se corrigió la conservación de los datos del cliente después de actualizar un pedido.
- Se realizaron pruebas funcionales de autenticación, cierre de sesión, consulta y actualización de pedidos.
- La compilación del frontend se realizó correctamente.

### RF26 - Cancelación de pedidos por cliente

Se implementó la cancelación de pedidos desde el historial del cliente autenticado.

- El cliente puede cancelar únicamente pedidos en estado Pendiente.
- Se utiliza el endpoint PATCH /api/pedidos/:id/cancelar.
- Antes de cancelar se solicita confirmación al usuario.
- Después de una cancelación exitosa el pedido cambia a estado Cancelado.
- Los pedidos En preparación, En camino, Entregado y Cancelado no muestran la opción Cancelar pedido.
- La cancelación se refleja tanto en la vista del cliente como en la vista administrativa.
- Se verificó que un pedido cancelado no pueda continuar avanzando de estado.
- Se mantuvo el acceso a Ver detalle para pedidos en cualquier estado.
- Se realizaron pruebas funcionales con pedidos Pendiente y Cancelado.

### Mejora - Paginación de pedidos

Se agregó paginación al historial de pedidos del cliente y al listado administrativo.

- Se muestran máximo 5 pedidos por página.
- Los pedidos se ordenan del más reciente al más antiguo.
- Se agregaron controles Anterior, números de página y Siguiente.
- Los controles se deshabilitan correctamente en la primera y última página.
- La paginación se adapta a dispositivos móviles.
- Las operaciones de cancelación y actualización de estado continúan funcionando sin perder la navegación actual.

### RF27 - RF29 Gestión de pedidos por estado

Se implementaron filtros administrativos para consultar pedidos por estado: Pendiente, En preparación, En camino, Entregado y Cancelado.

También se mantuvo la paginación de 5 pedidos por página.

### RF30 - Gestión de usuarios administradores

Se implementó la gestión de usuarios administradores, permitiendo crear, editar, activar/inactivar y eliminar usuarios de forma segura.

### Gestión administrativa de productos

Se implementó la gestión de productos con listado, búsqueda, filtro por categoría, creación, edición, eliminación, estado, disponibilidad y paginación.

### Gestión administrativa de categorías

Se implementó la gestión de categorías con listado, búsqueda, creación, edición, estado, eliminación y paginación.

### Gestión administrativa de clientes

Se implementó la gestión de clientes con listado, búsqueda, edición, estado, eliminación controlada y paginación.

### Registro de clientes

Se implementó el registro de clientes desde el frontend con validación e inicio de sesión posterior.

### Perfil del cliente

Se implementó la consulta y actualización del perfil del cliente autenticado.