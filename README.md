# Películas API - Backend con Roles y Autenticación

Solución desarrollada en **Node.js + Express + MongoDB** para el Parcial 1 de Desarrollo Web,
implementando autenticación por token, control de acceso por rol y un endpoint de búsqueda
con múltiples operadores de comparación.

### 📂 Ubicación del Código

El backend completo se encuentra distribuido en las siguientes carpetas:
`models/` · `controllers/` · `routes/` · `helpers/`, con el punto de entrada en `index.js`.

---

## 🛠️ Funcionalidades Implementadas

- **Registro y login de usuarios** – Password hasheado con `bcrypt`, autenticación mediante token (`jwt-simple`).
- **Roles (administrador / básico)** – El rol viaja dentro del token y se valida en cada ruta protegida.
- **Creación de películas restringida** – Solo un usuario con rol `administrador` puede crear películas; cualquier otro rol recibe `403`.
- **Consulta general** – Cualquier usuario logueado (sin importar el rol) puede listar todas las películas.
- **Búsqueda avanzada por parámetros** – Filtro por `anio` y/o `precio`, soportando los 5 operadores de comparación (ver sección 5).

---

## Dependencias principales

- `express`
- `mongoose`
- `bcrypt`
- `jwt-simple`

(instaladas automáticamente con `npm install` a partir de `package.json`)

## Instalación

```
npm install
```

Asegúrate de tener MongoDB corriendo en `mongodb://localhost:27017`.

> **Nota sobre el secreto del JWT:** la clave usada para firmar los tokens está definida directamente en el código (no en variables de entorno), ya que se trata de un proyecto académico. Para un entorno real, esa clave debería ir en un archivo `.env` y no quedar hardcodeada.

## Ejecutar el proyecto

```
node index.js
```

El servidor levanta en el puerto `1309`.

Todas las peticiones con body (`POST`) deben enviarse con el header `Content-Type: application/json`.

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

`rol` es opcional. Si no se envía, queda como `basico`.

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

### 3. Crear película (solo administrador)
`POST /api/pelicula`

Header: `Authorization: Bearer <token>`

```json
{
  "titulo": "Batman Begins",
  "director": "Christopher Nolan",
  "anioLanzamiento": 2005,
  "productora": "Warner Bros",
  "precio": 15000
}
```

Si el usuario logueado no es `administrador`, responde `403`.

### 4. Consultar todas las películas (usuario logueado, cualquier rol)
`GET /api/pelicula`

Header: `Authorization: Bearer <token>`

### 5. Buscar películas por año y/o precio (usuario logueado, cualquier rol)
`GET /api/pelicula/buscar?anio=2010&precio=20000`

Header: `Authorization: Bearer <token>`

El enunciado del parcial pide específicamente: películas cuyo `anioLanzamiento` sea **mayor** a un valor dado, **y** cuyo `precio` sea **menor o igual** a otro valor dado. Ese caso puntual funciona con:

```
GET /api/pelicula/buscar?anio=>2010&precio=<=20000
```

> Se agregaron los demás operadores (igual, mayor o igual, menor) además de los pedidos (`>` y `<=`), para que la búsqueda fuera más completa. Esto no reemplaza lo exigido, lo incluye.

El operador se escribe pegado al valor, dentro del mismo parámetro:

| Operador | Significado | Ejemplo |
|---|---|---|
| (sin símbolo) | igual (`=`) | `anio=2010` |
| `>` | mayor que | `anio=>2010` |
| `>=` | mayor o igual que | `anio=>=2010` |
| `<` | menor que | `anio=<2010` |
| `<=` | menor o igual que | `anio=<=2010` |

Funciona igual para `precio`. Los dos parámetros son independientes entre sí:

- `GET /api/pelicula/buscar?anio=>2010` → solo filtra por año (mayor a 2010)
- `GET /api/pelicula/buscar?precio=<=20000` → solo filtra por precio (menor o igual a 20000)
- `GET /api/pelicula/buscar?anio=>2010&precio=<=20000` → combinado, cada uno con su propio operador
- `GET /api/pelicula/buscar` (sin parámetros) → responde `400`, se exige al menos uno de los dos

---

## 🔢 Códigos de respuesta

| Código | Cuándo ocurre |
|---|---|
| `200` | Operación exitosa (login, registro, listado, búsqueda) |
| `201` | Película creada correctamente |
| `400` | Falta `anio` y `precio` en `/api/pelicula/buscar` |
| `401` | Falta el token o es inválido ("No autorizado, debe iniciar sesión") |
| `403` | Usuario autenticado pero sin el rol requerido (`administrador`) |

---

## 🧪 Guía paso a paso para probar en Postman

Con el servidor corriendo (`node index.js`, puerto `1309`), sigue este orden. Los pasos posteriores dependen de los tokens que obtengas en los pasos 1 y 2. Recuerda que las contraseñas usadas (`123`, `456`) son solo de ejemplo para pruebas rápidas, no valores recomendados en un entorno real.

**1. Registrar un usuario administrador**
`POST http://localhost:1309/api/usuario/registrar`
```json
{
  "username": "admin1",
  "password": "123",
  "rol": "administrador"
}
```
Respuesta esperada: `200`, usuario creado.

**2. Registrar un usuario básico**
`POST http://localhost:1309/api/usuario/registrar`
```json
{
  "username": "user1",
  "password": "456"
}
```
No se manda `rol`, así que queda `basico` por defecto.

**3. Login del administrador**
`POST http://localhost:1309/api/usuario/login`
```json
{
  "username": "admin1",
  "password": "123"
}
```
Copia el `token` de la respuesta, guárdalo como `tokenAdmin`.

**4. Login del usuario básico**
Mismo endpoint, con `user1`. Guarda el token como `tokenBasico`.

**5. Crear una película con el administrador**
`POST http://localhost:1309/api/pelicula`
Header: `Authorization: Bearer tokenAdmin`
Body: el mismo del punto 3 (Batman Begins). Respuesta esperada: `201`, película creada. Repite este paso con 2 o 3 películas más (distinto año y precio) para tener datos con que probar la búsqueda.

**6. Intentar crear una película con el usuario básico**
Mismo endpoint y mismo body, pero con `Authorization: Bearer tokenBasico`.
Respuesta esperada: `403`, no autorizado (así se comprueba que la restricción de rol funciona).

**7. Consultar todas las películas**
`GET http://localhost:1309/api/pelicula`
Header: `Authorization: Bearer tokenBasico` (o `tokenAdmin`, cualquiera de los dos funciona)
Respuesta esperada: `200`, lista completa de películas.

**8. Buscar con un solo filtro**
`GET http://localhost:1309/api/pelicula/buscar?anio=>2010`
Header: `Authorization: Bearer tokenBasico`
Respuesta esperada: solo las películas con `anioLanzamiento` mayor a 2010.

**9. Buscar combinando ambos filtros (caso del enunciado)**
`GET http://localhost:1309/api/pelicula/buscar?anio=>2010&precio=<=20000`
Respuesta esperada: películas que cumplen las dos condiciones a la vez.

**10. Probar sin token**
Repite el paso 7 sin el header `Authorization`.
Respuesta esperada: `401`, "No autorizado, debe iniciar sesión".

---

**Desarrollado por:** Víctor Manuel Córdoba Larez y Ricardo Jaraba Gallego

**Carrera:** Ingeniería Informática

**Materia:** Desarrollo Web

**Institución:** Corporación Universitaria Lasallista
