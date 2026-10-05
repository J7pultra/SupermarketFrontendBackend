# SupermarketApi (Spring Boot REST API)

API RESTful profesional para la gestión de un supermercado, desarrollada desde cero en **Java 17** y **Spring Boot 3**, utilizando arquitectura por capas, **Spring Security** para autenticación basada en JWT y control de acceso basado en roles (RBAC), y **Spring Data JPA (Hibernate)** con **PostgreSQL**.

---

## 🏛 Arquitectura del Proyecto

El proyecto sigue las mejores prácticas de la arquitectura en capas de Spring Boot:

`	ext
com.supermarket.api
├── config/             # Configuración general y de seguridad
├── controller/         # Controladores REST (endpoints HTTP)
├── dto/                # Data Transfer Objects y objetos de petición/respuesta
├── entity/             # Entidades JPA de base de datos (User, Role)
├── exception/          # Excepciones de negocio y GlobalExceptionHandler (@RestControllerAdvice)
├── repository/         # Interfaces Spring Data JPA para acceso a datos
├── security/           # Filtros JWT, generador/validador de tokens y SecurityConfig
└── service/            # Lógica de negocio (AuthService y su implementación)
`

---

## 🚀 Requisitos Previos

- **Java 17 o superior** (OpenJDK, Eclipse Temurin, Oracle JDK, etc.)
- *Nota*: No es necesario tener Maven instalado (el repositorio incluye `mvnw` y `mvnw.cmd`). Tampoco es necesario tener Docker ni PostgreSQL instalado; la API utiliza por defecto una base de datos **H2 en memoria** lista para usar.

---

## ⚡ Ejecución Rápida (Recomendada para Evaluación y Pruebas)

1. Clona el repositorio y abre una terminal en la carpeta raíz `SupermarketApi`.
2. Ejecuta el comando correspondiente a tu sistema operativo:

   **En Windows:**
   ```cmd
   mvnw.cmd spring-boot:run
   ```

   **En Linux / macOS:**
   ```bash
   ./mvnw spring-boot:run
   ```

3. La API arrancará de inmediato en:
   - **API Base URL**: `http://localhost:3000`
   - **Health Check**: `http://localhost:3000/health`
   - **Consola H2 (Base de Datos en Memoria)**: `http://localhost:3000/h2-console`
     - **JDBC URL**: `jdbc:h2:mem:supermercado_db`
     - **User Name**: `sa`
     - **Password**: *(dejar en blanco)*

---

## 🐳 Ejecución Alternativa con Docker y PostgreSQL (Opcional)

Si dispones de Docker Desktop y deseas levantar la base de datos PostgreSQL persistente:

1. Abre una terminal en la raíz del proyecto.
2. Levanta los contenedores:
   ```bash
   docker compose up --build
   ```
3. Para detenerlos:
   ```bash
   docker compose down
   ```

---

## 📡 Referencia de Endpoints

### 1. Health Check
- **Método**: GET
- **URL**: http://localhost:3000/health
- **Acceso**: Público
- **Respuesta Exitosa (200 OK)**:
  `json
  {
    status: OK,
    message: API funcionando correctamente
  }
  `

---

### 2. Registro de Usuario
- **Método**: POST
- **URL**: http://localhost:3000/api/auth/register
- **Acceso**: Público
- **Validaciones**:
  - email: Formato válido y único.
  - password: Mínimo 8 caracteres, al menos 1 mayúscula y 1 número.
  - 
ame: Mínimo 2 caracteres.
  - ole: Opcional (CLIENTE, CAJERO, ADMIN). Por defecto es CLIENTE.
  - employeeId: Requerido si el rol es CAJERO o ADMIN.

#### Ejemplo: Registro de Cliente
`ash
curl -X POST http://localhost:3000/api/auth/register \
  -H Content-Type: application/json \
  -d {"email": "cliente@correo.com", "password": "Password123", "name": "Juan Perez"}
`
**Respuesta (201 Created)**:
`json
{
  status: success,
  message: Usuario registrado exitosamente,
  data: {
    id: c1f10bc4-8b65-4a6c-9c71-0810db61a7a0,
    email: cliente@correo.com,
    name: Juan Perez,
    role: CLIENTE,
    loyaltyPoints: 0,
    employeeId: null,
    createdAt: 2026-09-21T17:30:00,
    updatedAt: 2026-09-21T17:30:00
  }
}
`

#### Ejemplo: Registro de Administrador o Cajero
`ash
curl -X POST http://localhost:3000/api/auth/register \
  -H Content-Type: application/json \
  -d {"email": "admin@correo.com", "password": "Admin1234", "name": "Admin Super", "role": "ADMIN", "employeeId": "EMP-001"}
`

---

### 3. Inicio de Sesión (Login)
- **Método**: POST
- **URL**: http://localhost:3000/api/auth/login
- **Acceso**: Público

`ash
curl -X POST http://localhost:3000/api/auth/login \
  -H Content-Type: application/json \
  -d {"email": "admin@correo.com", "password": "Admin1234"}
`
**Respuesta (200 OK)**:
`json
{
  status: success,
  message: Autenticación exitosa,
  data: {
    token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...,
    user: {
      id: ...,
      email: admin@correo.com,
      name: Admin Super,
      role: ADMIN
    }
  }
}
`

---

### 4. Perfil de Usuario Autenticado
- **Método**: GET
- **URL**: http://localhost:3000/api/auth/profile
- **Acceso**: Requiere autenticación (Bearer Token)

`ash
curl -X GET http://localhost:3000/api/auth/profile \
  -H Authorization: Bearer <TU_TOKEN_JWT>
`
**Respuesta (200 OK)**:
`json
{
  message: Perfil de usuario,
  user: {
    userId: ...,
    role: ADMIN
  }
}
`

---

### 5. Área Exclusiva de Cajeros y Administradores
- **Método**: GET
- **URL**: http://localhost:3000/api/auth/cashier-area
- **Acceso**: Requiere rol ADMIN o CAJERO

`ash
curl -X GET http://localhost:3000/api/auth/cashier-area \
  -H Authorization: Bearer <TU_TOKEN_JWT>
`
**Respuesta (200 OK)**:
`json
{
  message: Área de facturación y validación
}
`

---

### 6. Área Exclusiva de Administradores
- **Método**: GET
- **URL**: http://localhost:3000/api/auth/admin-only
- **Acceso**: Requiere rol ADMIN

`ash
curl -X GET http://localhost:3000/api/auth/admin-only \
  -H Authorization: Bearer <TU_TOKEN_JWT>
`
**Respuesta (200 OK)**:
`json
{
  message: Bienvenido, Administrador
}
`

---

## 🛡 Formato Estándar de Errores

En caso de error, la API responde con una estructura uniforme:

`json
{
  status: error,
  message: Descripción detallada del error
}
`

| Código HTTP | Motivo |
| :--- | :--- |
| **400 Bad Request** | Email ya registrado, formato de contraseña inválido o falta employeeId en roles de empleado. |
| **401 Unauthorized**| Credenciales incorrectas o token no proporcionado / inválido / expirado. |
| **403 Forbidden**   | El usuario no posee los permisos/rol requeridos para acceder a la ruta. |
| **404 Not Found**   | Recurso solicitado no encontrado. |
| **500 Internal**    | Error inesperado del servidor. |
