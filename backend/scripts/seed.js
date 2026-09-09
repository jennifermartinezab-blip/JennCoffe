require('dotenv').config();

const mongoose = require('mongoose');

const Categoria = require('../src/models/Categoria');
const Producto = require('../src/models/Producto');

const categorias = [
  {
    nombre: 'Postres',
    descripcion: 'Postres disponibles en JennCoffee',
    estado: 'Activo'
  },
  {
    nombre: 'Entradas',
    descripcion: 'Entradas disponibles en JennCoffee',
    estado: 'Activo'
  },
  {
    nombre: 'Platos fuertes',
    descripcion: 'Platos fuertes disponibles en JennCoffee',
    estado: 'Activo'
  },
  {
    nombre: 'Bebidas',
    descripcion: 'Bebidas disponibles en JennCoffee',
    estado: 'Activo'
  },
  {
    nombre: 'Promociones',
    descripcion: 'Promociones disponibles en JennCoffee',
    estado: 'Activo'
  }
];

const productos = [
  {
    codigo: 'PROD001',
    nombre: 'Cheesecake coreano de fresa',
    descripcion: 'Producto temporal para prueba de historial',
    categoria: 'Postres',
    precio: 19000,
    imagen: 'cheesecake-coreano.jpg',
    disponibilidad: true,
    estado: 'Activo'
  },
  {
    codigo: 'PROD002',
    nombre: 'Mandu coreano',
    descripcion:
      'Empanadillas coreanas rellenas, servidas como entrada en JennCoffee',
    categoria: 'Entradas',
    precio: 12000,
    imagen: 'mandu-coreano.jpg',
    disponibilidad: true,
    estado: 'Activo'
  },
  {
    codigo: 'PROD003',
    nombre: 'Tteokbokki suave',
    descripcion:
      'Pasteles de arroz coreanos con salsa suave y ligeramente dulce',
    categoria: 'Entradas',
    precio: 14000,
    imagen: 'tteokbokki-suave.jpg',
    disponibilidad: true,
    estado: 'Activo'
  },
  {
    codigo: 'PROD004',
    nombre: 'Mini kimbap',
    descripcion:
      'Rollitos coreanos de arroz y vegetales, servidos en porciones pequeñas',
    categoria: 'Entradas',
    precio: 13000,
    imagen: 'mini-kimbap.jpg',
    disponibilidad: true,
    estado: 'Activo'
  },
  {
    codigo: 'PROD005',
    nombre: 'Hotteok salado',
    descripcion:
      'Panqueque coreano relleno con ingredientes salados, ideal como entrada',
    categoria: 'Entradas',
    precio: 11000,
    imagen: 'hotteok-salado.jpg',
    disponibilidad: true,
    estado: 'Activo'
  },
  {
    codigo: 'PROD006',
    nombre: 'Bibimbap JennCoffee',
    descripcion:
      'Arroz coreano acompañado de vegetales, proteína y huevo al estilo JennCoffee',
    categoria: 'Platos fuertes',
    precio: 26000,
    imagen: 'bibimbap-jenncoffee.jpg',
    disponibilidad: true,
    estado: 'Activo'
  },
  {
    codigo: 'PROD007',
    nombre: 'Bulgogi con arroz',
    descripcion:
      'Carne marinada al estilo coreano acompañada de arroz y vegetales',
    categoria: 'Platos fuertes',
    precio: 28000,
    imagen: 'bulgogi-con-arroz.jpg',
    disponibilidad: true,
    estado: 'Activo'
  },
  {
    codigo: 'PROD008',
    nombre: 'Japchae tradicional',
    descripcion:
      'Fideos de camote salteados con vegetales y sabores tradicionales coreanos',
    categoria: 'Platos fuertes',
    precio: 24000,
    imagen: 'japchae-tradicional.jpg',
    disponibilidad: true,
    estado: 'Activo'
  },
  {
    codigo: 'PROD009',
    nombre: 'Pollo coreano crispy',
    descripcion:
      'Pollo crujiente al estilo coreano acompañado de arroz y salsa especial JennCoffee',
    categoria: 'Platos fuertes',
    precio: 27000,
    imagen: 'pollo-coreano-crispy.jpg',
    disponibilidad: true,
    estado: 'Activo'
  },
  {
    codigo: 'PROD010',
    nombre: 'Strawberry Milk',
    descripcion:
      'Bebida fría de leche con fresa al estilo coreano, suave y refrescante',
    categoria: 'Bebidas',
    precio: 12000,
    imagen: 'strawberry-milk.jpg',
    disponibilidad: true,
    estado: 'Activo'
  },
  {
    codigo: 'PROD011',
    nombre: 'Dalgona Coffee',
    descripcion:
      'Café coreano con una cremosa capa de café batido sobre leche fría',
    categoria: 'Bebidas',
    precio: 14000,
    imagen: 'dalgona-coffee.jpg',
    disponibilidad: true,
    estado: 'Activo'
  },
  {
    codigo: 'PROD012',
    nombre: 'Matcha Latte',
    descripcion:
      'Bebida cremosa preparada con matcha y leche, servida al estilo JennCoffee',
    categoria: 'Bebidas',
    precio: 15000,
    imagen: 'matcha-latte.jpg',
    disponibilidad: true,
    estado: 'Activo'
  },
  {
    codigo: 'PROD013',
    nombre: 'Ade de durazno',
    descripcion:
      'Bebida fría y refrescante de durazno con estilo coreano',
    categoria: 'Bebidas',
    precio: 13000,
    imagen: 'ade-durazno.jpg',
    disponibilidad: true,
    estado: 'Activo'
  },
  {
    codigo: 'PROD014',
    nombre: 'Croffle de fresa',
    descripcion:
      'Croffle crujiente acompañado de fresas y crema dulce al estilo JennCoffee',
    categoria: 'Postres',
    precio: 16000,
    imagen: 'croffle-fresa.jpg',
    disponibilidad: true,
    estado: 'Activo'
  },
  {
    codigo: 'PROD015',
    nombre: 'Bingsu de mango',
    descripcion:
      'Postre coreano de hielo raspado con mango, leche y toppings dulces',
    categoria: 'Postres',
    precio: 18000,
    imagen: 'bingsu-mango.jpg',
    disponibilidad: true,
    estado: 'Activo'
  },
  {
    codigo: 'PROD016',
    nombre: 'Roll cake de matcha',
    descripcion:
      'Bizcocho suave enrollado con crema de matcha, inspirado en la pastelería coreana',
    categoria: 'Postres',
    precio: 16000,
    imagen: 'roll-cake-matcha.jpg',
    disponibilidad: true,
    estado: 'Activo'
  },
  {
    codigo: 'PROD018',
    nombre: 'Combo K-Drama',
    descripcion:
      'Combo inspirado en los cafés coreanos con plato fuerte, bebida y postre JennCoffee',
    categoria: 'Promociones',
    precio: 42000,
    imagen: 'combo-k-drama.jpg',
    disponibilidad: true,
    estado: 'Activo'
  },
  {
    codigo: 'PROD019',
    nombre: 'Combo Pink Coffee',
    descripcion:
      'Combo dulce JennCoffee con bebida rosada y postre inspirado en la estética coreana',
    categoria: 'Promociones',
    precio: 29000,
    imagen: 'combo-pink-coffee.jpg',
    disponibilidad: true,
    estado: 'Activo'
  },
  {
    codigo: 'PROD020',
    nombre: 'Combo JennCoffee',
    descripcion:
      'Combo especial de la casa con plato fuerte, bebida y postre seleccionados de JennCoffee',
    categoria: 'Promociones',
    precio: 45000,
    imagen: 'combo-jenncoffee.jpg',
    disponibilidad: true,
    estado: 'Activo'
  },
  {
    codigo: 'PROD021',
    nombre: 'Combo K-Friends',
    descripcion:
      'Combo promocional con bebida coreana, postre y snack para compartir.',
    categoria: 'Promociones',
    precio: 35000,
    imagen: 'combo-k-friends.jpg',
    disponibilidad: true,
    estado: 'Activo'
  }
];

const ejecutarSeed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log('MongoDB conectado para ejecutar seed');

    const mapaCategorias = {};

    for (const categoria of categorias) {
      const categoriaGuardada =
        await Categoria.findOneAndUpdate(
          {
            nombre: categoria.nombre
          },
          categoria,
          {
            upsert: true,
            returnDocument: 'after',
            setDefaultsOnInsert: true
          }
        );

      mapaCategorias[categoria.nombre] =
        categoriaGuardada._id;
    }

    for (const producto of productos) {
      const categoriaId =
        mapaCategorias[producto.categoria];

      if (!categoriaId) {
        throw new Error(
          `No se encontró la categoría ${producto.categoria}`
        );
      }

      await Producto.findOneAndUpdate(
        {
          codigo: producto.codigo
        },
        {
          codigo: producto.codigo,
          nombre: producto.nombre,
          descripcion: producto.descripcion,
          categoria: categoriaId,
          precio: producto.precio,
          imagen: producto.imagen,
          disponibilidad: producto.disponibilidad,
          estado: producto.estado
        },
        {
          upsert: true,
          returnDocument: 'after',
          setDefaultsOnInsert: true
        }
      );
    }

    const totalCategorias =
      await Categoria.countDocuments();

    const totalProductos =
      await Producto.countDocuments();

    console.log(
      `Categorías disponibles: ${totalCategorias}`
    );

    console.log(
      `Productos disponibles: ${totalProductos}`
    );

    console.log(
      'Seed ejecutado correctamente'
    );
  } catch (error) {
    console.error(
      'Error al ejecutar seed:',
      error.message
    );

    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

ejecutarSeed();