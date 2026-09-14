# Peliculas API - Backend con Roles y Autenticacion

Solucion desarrollada en **Node.js + Express + MongoDB** para el Parcial 1 de Desarrollo Web,
implementando autenticacion por token, control de acceso por rol y un endpoint de busqueda
con multiples operadores de comparacion.

### 📂 Ubicacion del Codigo

El backend completo se encuentra distribuido en las siguientes carpetas:
`models/` · `controllers/` · `routes/` · `helpers/`, con el punto de entrada en `index.js`.

---

## 🛠️ Funcionalidades Implementadas

- **Registro y login de usuarios** – Password hasheado con `bcrypt`, autenticacion mediante token (`jwt-simple`).
- **Roles (administrador / basico)** – El rol viaja dentro del token y se valida en cada ruta protegida.
- **Creacion de peliculas restringida** – Solo un usuario con rol `administrador` puede crear peliculas; cualquier otro rol recibe `403`.
- **Consulta general** – Cualquier usuario logueado (sin importar el rol) puede listar todas las peliculas.
- **Busqueda avanzada por parametros** – Filtro por `anio` y/o `precio`, soportando los 5 operadores de comparacion (ver seccion 5).

---

## Instalacion

```
npm install
```

Asegurate de tener MongoDB corriendo en `mongodb://localhost:27017`.

## Ejecutar el proyecto

```
node index.js
```

El servidor levanta en el puerto `1309`.

---

## 📡 Endpoints

### 1. Registrar usuario
`POST /api/usuario/registrar`

```json
{
  "username": "admin1",
  "password": "123456",
  "rol": "administrador"
}
```

`rol` es opcional. Si no se envia, queda como `basico`.

### 2. Login
`POST /api/usuario/login`

```json
{
  "username": "admin1",
  "password": "123456"
}
```

Respuesta:
```json
{
  "token": "..."
}
```

Ese token se usa en el header `Authorization: Bearer <token>` para los siguientes endpoints.

### 3. Crear pelicula (solo administrador)
`POST /api/pelicula`

Header: `Authorization: Bearer <token>`

```json
{
  "titulo": "Interstellar",
  "director": "Christopher Nolan",
  "anioLanzamiento": 2014,
  "productora": "Paramount",
  "precio": 15000
}
```

Si el usuario logueado no es `administrador`, responde `403`.

### 4. Consultar todas las peliculas (usuario logueado, cualquier rol)
`GET /api/pelicula`

Header: `Authorization: Bearer <token>`

### 5. Buscar peliculas por anio y/o precio (usuario logueado, cualquier rol)
`GET /api/pelicula/buscar?anio=2010&precio=20000`

Header: `Authorization: Bearer <token>`

El enunciado del parcial pide especificamente: peliculas cuyo `anioLanzamiento` sea **mayor** a un valor dado, **y** cuyo `precio` sea **menor o igual** a otro valor dado. Ese caso puntual funciona tal cual con:

```
GET /api/pelicula/buscar?anio=>2010&precio=<=20000
```

> **Nota:** aunque el punto 4 del parcial solo pedia ese filtro puntual (mayor / menor o igual), decidimos complementarlo agregando el resto de operadores de comparacion (igual, mayor, mayor o igual, menor, menor o igual), para que la busqueda fuera mas completa y no quedara limitada a un solo caso. Esto no reemplaza lo pedido, lo incluye: usando exactamente `anio=>X&precio=<=Y` se obtiene el mismo resultado que exige el enunciado.

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

---

**Desarrollado por:** Víctor Manuel Cordoba Larez y Ricardo Jaraba Gallego

**Carrera:** Ingeniería Informática  

**Materia:** Desarrollo Web  

**Institución:** Corporación Universitaria Lasallista
