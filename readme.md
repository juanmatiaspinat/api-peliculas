# API REST - Catálogo de Películas

Trabajo Práctico Individual del módulo de Backend con Node.js, Express, TypeScript y MongoDB. Permite gestionar un catálogo personal y colaborativo de películas con autenticación mediante JWT, encriptación de contraseñas con bcrypt y validaciones de negocio.

## Tecnologías utilizadas

- **Node.js & Express**: Servidor HTTP y enrutamiento REST.
- **TypeScript**: Tipado estático en toda la aplicación.
- **MongoDB & Mongoose**: Base de datos NoSQL en la nube con esquemas, validaciones y relaciones (`populate`).
- **bcrypt & jsonwebtoken (JWT)**: Hashing seguro de contraseñas y protección de rutas privadas.
- **dotenv & cors**: Gestión de variables de entorno y habilitación de CORS.

## Arquitectura y estructura del proyecto

El proyecto sigue una arquitectura por componentes de negocio dividida en capas (`routes`, `controller`, `service`, `dao`, `model`) para desacoplar el manejo HTTP de la lógica de negocio y el acceso a datos:

```text
api-peliculas/
├── screenshots/                        # Capturas de evidencia de pruebas en Thunder Client
│   ├── 01-register-201.png
│   ├── 02-login-jwt-200.png
│   ├── 03-create-movie-sin-token-401.png
│   ├── 04-create-movie-bearer-auth.png
│   ├── 05-create-movie-201.png
│   ├── 06-create-movie-rating-invalido-400.png
│   ├── 07-get-movies-filtro-genre-200.png
│   ├── 08-get-movie-not-found-404.png
│   ├── 09-update-movie-auth.png
│   ├── 10-update-movie-200.png
│   └── 11-delete-movie-200.png
├── src/
│   ├── app.ts                          # Configuración de Express, middlewares globales (cors, json, logger) y rutas
│   ├── db.ts                           # Conexión a MongoDB Atlas mediante Mongoose
│   ├── middlewares/
│   │   └── auth.ts                     # Middleware verifyToken para proteger endpoints con JWT
│   └── components/
│       ├── user/                       # Módulo de usuarios y autenticación
│       │   ├── model.ts                # Esquema User (con select: false en password y roles user/admin)
│       │   ├── dao.ts                  # Consultas a la colección de usuarios
│       │   ├── service.ts              # Lógica de registro (bcrypt) y login (firma de JWT)
│       │   ├── controller.ts           # Manejo de peticiones HTTP (/register, /login)
│       │   └── routes.ts               # Definición de rutas de autenticación
│       └── movie/                      # Módulo principal del catálogo de películas
│           ├── model.ts                # Esquema Movie vinculado al usuario creador (userId)
│           ├── dao.ts                  # Operaciones CRUD y filtros en MongoDB
│           ├── service.ts              # Reglas de negocio, antiduplicados y control de permisos
│           ├── controller.ts           # Manejo de peticiones HTTP y códigos de estado
│           └── routes.ts               # Rutas públicas y protegidas de películas
├── .env.example                        # Plantilla de variables de entorno requeridas
├── .gitignore                          # Exclusión de node_modules, .env y dist
├── package.json                        # Dependencias y scripts de ejecución
├── package-lock.json                   # Árbol exacto de versiones instaladas
├── readme.md                           # Documentación del proyecto
└── tsconfig.json                       # Configuración del compilador de TypeScript
```

## Instalación y ejecución local

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/juanmatiaspinat/api-peliculas.git
   cd api-peliculas
   ```

2. Instalar las dependencias:
   ```bash
   npm install
   ```

3. Configurar las variables de entorno:
   Crear un archivo `.env` en la raíz del proyecto tomando como base el archivo `.env.example`:
   ```env
   PORT=3000
   MONGO_URI=mongodb+srv://<usuario>:<password>@<cluster>.mongodb.net/peliculas?retryWrites=true&w=majority
   JWT_SECRET=tu_clave_secreta
   ```

4. Iniciar el servidor en modo desarrollo:
   ```bash
   npm run dev
   ```
   El servidor quedará disponible en `http://localhost:3000`.

## Endpoints disponibles

### Autenticación (`/api/auth`)

| Método | Ruta | Descripción | Acceso |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Registra un nuevo usuario (`user` o `admin`) | Público |
| `POST` | `/api/auth/login` | Inicia sesión y devuelve el token JWT | Público |

### Películas (`/api/movies`)

| Método | Ruta | Descripción | Acceso |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/movies` | Lista todas las películas (soporta `?genre=...` y `?watched=true`) | Público |
| `GET` | `/api/movies/:id` | Obtiene el detalle de una película por su ID | Público |
| `POST` | `/api/movies` | Crea una película nueva asociada al usuario del token | Protegido (JWT) |
| `PUT` | `/api/movies/:id` | Actualiza una película existente | Protegido (JWT) |
| `DELETE` | `/api/movies/:id` | Elimina una película del catálogo | Protegido (JWT) |

## Reglas de negocio implementadas

- **Puntaje válido (`rating`)**: Solo se aceptan calificaciones numéricas entre `1` y `10`.
- **Año de estreno (`releaseYear`)**: Debe estar comprendido entre `1888` (primera película de la historia) y el año actual.
- **Control de duplicados**: No se permite registrar dos películas con el mismo `title` y `director`.
- **Control de propiedad y roles**: Únicamente el usuario que creó la película o un usuario con rol `admin` puede modificarla (`PUT`) o eliminarla (`DELETE`).
- **Protección de credenciales**: El campo `password` está configurado con `select: false` en el esquema y nunca se incluye en respuestas ni dentro del payload del JWT.

## Códigos de respuesta HTTP

- `200 OK`: Consulta, actualización o eliminación exitosa.
- `201 Created`: Usuario o película creados correctamente.
- `400 Bad Request`: Datos obligatorios faltantes, ID con formato inválido o incumplimiento de reglas de negocio.
- `401 Unauthorized`: Token JWT ausente, mal formado, expirado o credenciales de login incorrectas.
- `403 Forbidden`: El usuario autenticado no es el propietario del recurso ni posee rol `admin`.
- `404 Not Found`: Película no encontrada en la base de datos.

## Evidencia de pruebas

En la carpeta `/screenshots` se adjuntan las capturas de las pruebas realizadas en **Thunder Client**, verificando tanto los casos exitosos (`200`, `201`) como el manejo de errores (`400`, `401`, `404`).
