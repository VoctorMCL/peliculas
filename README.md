# Peliculas API

Backend con Node.js, Express y MongoDB para el Parcial 1 de Desarrollo Web.

## Integrantes

- Victor Manuel Cordoba Larez
- Ricardo Jaraba Gallego

## Tecnologias

- Node.js
- Express
- MongoDB / Mongoose
- bcrypt (hash de password)
- jwt-simple (autenticacion por token)

## Instalacion

\```
npm install
\```

Asegurate de tener MongoDB corriendo en `mongodb://localhost:27017`.

## Ejecutar el proyecto

\```
node index.js
\```

El servidor levanta en el puerto `1309`.

## Endpoints

### 1. Registrar usuario
`POST /api/usuario/registrar`

\```json
{
  "username": "admin1",
  "password": "123456",
  "rol": "administrador"
}
\```
`rol` es opcional. Si no se envia, queda como `basico`.

### 2. Login
`POST /api/usuario/login`

\```json
{
  "username": "admin1",
  "password": "123456"
}
\```

Respuesta:
\```json
{
  "token": "..."
}
\```

Ese token se usa en el header `Authorization: Bearer <token>` para los siguientes endpoints.

### 3. Crear pelicula (solo administrador)
`POST /api/pelicula`

Header: `Authorization: Bearer <token>`

\```json
{
  "titulo": "Interstellar",
  "director": "Christopher Nolan",
  "anioLanzamiento": 2014,
  "productora": "Paramount",
  "precio": 15000
}
\```

Si el usuario logueado no es `administrador`, responde 403.

### 4. Consultar todas las peliculas (usuario logueado, cualquier rol)
`GET /api/pelicula`

Header: `Authorization: Bearer <token>`

### 5. Buscar peliculas por anio y/o precio (usuario logueado, cualquier rol)
`GET /api/pelicula/buscar?anio=2010&precio=20000`

Header: `Authorization: Bearer <token>`

El enunciado del parcial pide especificamente: peliculas cuyo `anioLanzamiento` sea **mayor** a un valor dado, **y** cuyo `precio` sea **menor o igual** a otro valor dado. Ese caso puntual funciona tal cual con:

\```
GET /api/pelicula/buscar?anio=>2010&precio=<=20000
\```

**Nota:** aunque el punto 4 del parcial solo pedia ese filtro puntual (mayor / menor o igual), decidimos complementarlo agregando el resto de operadores de comparacion (igual, mayor, mayor o igual, menor, menor o igual), para que la busqueda sea mas completa y no quede limitada a un solo caso. Esto no reemplaza lo pedido, lo incluye: si se usa exactamente `anio=>X&precio=<=Y` se obtiene el mismo resultado que exige el enunciado.

El operador se escribe pegado al valor, dentro del mismo parametro:

| Operador | Significado | Ejemplo |
|---|---|---|
| (sin simbolo) | igual (`=`) | `anio=2010` |
| `>` | mayor que | `anio=>2010` |
| `>=` | mayor o igual que | `anio=>=2010` |
| `<` | menor que | `anio=<2010` |
| `<=` | menor o igual que | `anio=<=2010` |

Funciona igual para `precio`. Los dos parametros son independientes entre si:

- `GET /api/pelicula/buscar?anio=>2010` → solo filtra por anio (mayor a 2010)
- `GET /api/pelicula/buscar?precio=<=20000` → solo filtra por precio (menor o igual a 20000)
- `GET /api/pelicula/buscar?anio=>2010&precio=<=20000` → combinado, cada uno con su propio operador
- `GET /api/pelicula/buscar` (sin parametros) → responde `400`, se exige al menos uno de los dos
