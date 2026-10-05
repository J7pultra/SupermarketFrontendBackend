# 📋 Plan Maestro de Integración: Diseños Stitch a Frontend React
### Integración Basada en Componentes, Conexión REST API y Control de Acceso por Roles (RBAC)

> **Documento:** Plan de Trabajo y Hoja de Ruta de Implementación  
> **Origen Visual:** Stitch UI Projects (`17528085145926432441` - Fresh Market Ops & `289035682736226612`)  
> **Destino:** Frontend Web React 19 + Vite (`frontend-app-ing-web`)  
> **Backend:** Spring Boot 3 REST API (`SupermarketApi` en `http://localhost:3000`)  
> **Estándares Aplicados:** Vercel React Best Practices + UI/UX Pro Max Intelligence  
> **Fecha de Emisión:** Octubre 2026  

---

## 🗺️ 1. Visión General del Proyecto y Mapeo de Pantallas Stitch

En Stitch se han generado **7 pantallas de alta fidelidad** adaptadas a los contratos de datos y endpoints de `SupermarketApi`. El objetivo de este plan es trasladar cada una de estas pantallas a componentes React limpios, modulares, reutilizables y con conexión real al backend.

### Matriz de Pantallas Stitch vs Arquitectura Frontend

| ID de Pantalla en Stitch | Nombre de Pantalla en Stitch | Endpoint API Vinculado | Ruta Frontend Destino | Componente Principal |
| :--- | :--- | :--- | :--- | :--- |
| `fbe37e6f91f54830b27294bf4912ba23` | **Autenticación & Acceso** | `POST /api/auth/login` | `/login` | `src/pages/LoginPage.jsx` |
| `b94be7ba24eb4b98a8cf06928c984c19` | **Registro Inteligente Multirrol** | `POST /api/auth/register` | `/register` | `src/pages/RegisterPage.jsx` |
| `af87ace837e24d4aaac6828a5421d168` | **Perfil de Usuario & Puntos** | `GET /api/auth/profile` | `/profile` | `src/pages/ProfilePage.jsx` |
| `966f1496fbcf49138cf9a01db92ab319` | **Terminal POS de Cajero** | `GET /api/auth/cashier-area` | `/cashier` | `src/pages/CashierPOSPage.jsx` |
| `616c4721217f47bab994e0b7db261e30` | **Consola de Mando Admin** | `GET /api/auth/admin-only` | `/admin` | `src/pages/AdminConsolePage.jsx` |
| `386ed25c1cf04f86bb136ac427225067` | **Acceso Denegado (HTTP 403)** | *Error Handler Interceptor* | `/forbidden` | `src/pages/ForbiddenPage.jsx` |
| `a5f2afc0ac0f4c0e8e87a1688a48d227` | **Comprobante Electrónico (Ticket)** | `GET /api/auth/cashier-area` | `/cashier/ticket` | `src/components/pos/ReceiptModal.jsx` |
| Global (Header / Navbar) | **Monitor de Salud del Servidor** | `GET /health` | Global en Layouts | `src/components/common/ApiHealthPill.jsx`|

---

## 📂 2. Estructura de Carpetas del Frontend (`frontend-app-ing-web`)

Se respeta de forma estricta la arquitectura de carpetas modular establecida en el proyecto:

```
frontend-app-ing-web/
├── index.html                   # Importación de fuentes (Outfit, Inter, JetBrains Mono)
├── package.json                 # React 19, react-router-dom, axios
├── vite.config.js
└── src/
    ├── api/                     # Servicios HTTP desacoplados
    │   ├── axios.js             # Instancia configurada e interceptores (Bearer JWT + 401/403)
    │   ├── authApi.js           # register(), login(), getProfile()
    │   ├── cashierApi.js        # getCashierArea()
    │   ├── adminApi.js          # getAdminArea()
    │   └── healthApi.js         # checkHealth()
    ├── assets/                  # Imágenes, logotipos y SVGs
    ├── components/              # Componentes UI reutilizables
    │   ├── common/              # Átomos y moléculas transversales
    │   │   ├── Button.jsx
    │   │   ├── Input.jsx
    │   │   ├── RoleBadge.jsx
    │   │   ├── ApiHealthPill.jsx
    │   │   └── AlertBanner.jsx
    │   ├── auth/                # Componentes exclusivos de Login/Registro
    │   │   ├── PasswordValidator.jsx
    │   │   ├── RoleSelectorCards.jsx
    │   │   ├── EmployeeIdField.jsx
    │   │   └── DemoCredentialsBar.jsx
    │   ├── profile/             # Componentes del perfil
    │   │   ├── LoyaltyPointsCard.jsx
    │   │   └── UserDetailsCard.jsx
    │   ├── pos/                 # Componentes del Terminal de Cajero
    │   │   ├── ProductScanner.jsx
    │   │   ├── CartItemsTable.jsx
    │   │   ├── POSSummaryTotals.jsx
    │   │   └── ReceiptModal.jsx
    │   └── admin/               # Componentes de la consola de Administrador
    │       ├── MetricKpiCard.jsx
    │       ├── EmployeeTable.jsx
    │       └── ServerTelemetryCard.jsx
    ├── layouts/                 # Plantillas de estructura de página
    │   ├── AuthLayout.jsx       # Layout centrado con fondo sutil para Login y Registro
    │   ├── MainLayout.jsx       # Layout general con Navbar reactivo al rol y Footer
    │   └── DashboardLayout.jsx  # Layout con barra lateral para Cajeros y Administradores
    ├── pages/                   # Vistas principales vinculadas a rutas
    │   ├── LoginPage.jsx
    │   ├── RegisterPage.jsx
    │   ├── ProfilePage.jsx
    │   ├── CashierPOSPage.jsx
    │   ├── AdminConsolePage.jsx
    │   ├── ForbiddenPage.jsx
    │   └── NotFoundPage.jsx
    ├── routes/                  # Configuración de enrutamiento y guardias RBAC
    │   ├── AppRouter.jsx        # Enrutador principal de React
    │   └── ProtectedRoute.jsx   # Guardia que evalúa token y roles (CLIENTE/CAJERO/ADMIN)
    ├── store/                   # Estado global liviano (Context API)
    │   ├── AuthContext.jsx      # Sesión, token, rol del usuario, login(), logout()
    │   └── CartContext.jsx      # Estado de productos en caja registradora
    ├── App.jsx                  # Proveedores de Contexto y Enrutador
    ├── main.jsx                 # Entrypoint de React 19
    └── index.css                # Design Tokens y Tailwind / CSS utilitario
```

---

## 🚀 3. Fases de Desarrollo e Integración

### 🔹 Fase 0: Preparación de Entorno, Rutas y Configuración Base
**Objetivo:** Dejar el proyecto preparado con las librerías necesarias, fuentes tipográficas de Stitch y configuración de temas.
- [ ] **0.1.** Instalar dependencias esenciales de navegación: `react-router-dom` y `lucide-react` (o soporte nativo para Material Symbols Outlined).
- [ ] **0.2.** Actualizar `index.html` con las fuentes oficiales de Stitch: **Outfit** (Display), **Inter** (Body) y **JetBrains Mono** (Datos técnicos / Códigos).
- [ ] **0.3.** Integrar los tokens de diseño (`designTheme` de Stitch: verde esmeralda `#006948`, índigo `#4648d4`, ámbar `#825100`, superficies `#faf8ff` y `#131b2e`) en `src/index.css`.
- [ ] **0.4.** Configurar cliente Axios en `src/api/axios.js` con soporte para interceptores Bearer y captura de estados 401 y 403.
- [ ] **0.5.** Crear documento de seguimiento `ESTADO_DEL_PROYECTO.md` para auditar el avance.

---

### 🔹 Fase 1: Capa de Estado Global, Autenticación y Guardias RBAC
**Objetivo:** Gestionar la sesión del usuario (`token`, `role`, `user`) y proteger las rutas del sistema.
- [ ] **1.1.** Crear `src/store/AuthContext.jsx`:
  - Almacenamiento seguro del JWT y objeto `user` en `localStorage`.
  - Funciones `login(email, password)`, `register(payload)`, `logout()`.
  - Propiedades computadas: `isAuthenticated`, `role`, `isAdmin`, `isCashier`, `isClient`.
- [ ] **1.2.** Crear componente de protección de rutas `src/routes/ProtectedRoute.jsx`:
  - Valida si el usuario tiene sesión activa. Si no, redirige a `/login`.
  - Valida si el rol del usuario está dentro de los permitidos para la ruta (`allowedRoles`). Si no, redirige a `/forbidden` (HTTP 403).
- [ ] **1.3.** Crear `src/routes/AppRouter.jsx` configurando las rutas públicas (`/login`, `/register`), protegidas (`/profile`, `/cashier`, `/admin`) y de fallback (`/forbidden`, `*`).

---

### 🔹 Fase 2: Layouts Base y Componentes Átomos Reutilizables
**Objetivo:** Construir la base de componentes UI comunes que comparten todas las páginas de Stitch.
- [ ] **2.1. Átomos Comunes:**
  - `src/components/common/Button.jsx`: Variantes (`primary`, `secondary`, `danger`, `outline`, `ghost`, estado `loading` con spinner).
  - `src/components/common/Input.jsx`: Inputs estilizados con soporte de iconos a la izquierda y derecha.
  - `src/components/common/RoleBadge.jsx`: Píldora de rol con colores semánticos (`CLIENTE` en esmeralda, `CAJERO` en ámbar, `ADMIN` en índigo).
  - `src/components/common/ApiHealthPill.jsx`: Píldora con pulso animado conectada a `GET /health` en tiempo real.
  - `src/components/common/AlertBanner.jsx`: Banner para alertas de error (`400`, `401`, `403`) y confirmaciones de éxito.
- [ ] **2.2. Plantillas de Layout:**
  - `src/layouts/AuthLayout.jsx`: Contenedor estilizado para vistas de acceso con fondos degradados y píldora de API Health.
  - `src/layouts/MainLayout.jsx`: Navbar superior con avatar de usuario, saldo de puntos de lealtad, selector de módulos y botón de cierre de sesión.

---

### 🔹 Fase 3: Integración del Módulo de Autenticación (`/login` y `/register`)
**Objetivo:** Convertir las pantallas de Stitch `fbe37e6f91f54830b27294bf4912ba23` y `b94be7ba24eb4b98a8cf06928c984c19` en componentes funcionales.
- [ ] **3.1. Pantalla de Login (`src/pages/LoginPage.jsx`):**
  - Formulario con campos de Email y Password con botón de revelación (`visibility toggle`).
  - Barra de credenciales Demo de Stitch (`DemoCredentialsBar.jsx`) para auto-rellenar cuentas de Admin, Cajero y Cliente para pruebas rápidas.
  - Conexión con `POST /api/auth/login`. Manejo del error 401 con alerta visual animada.
  - Redirección automática según el rol del usuario tras autenticación exitosa.
- [ ] **3.2. Pantalla de Registro (`src/pages/RegisterPage.jsx`):**
  - Formulario con campos de Nombre, Email y Contraseña.
  - Componente `PasswordValidator.jsx`: Validación visual en tiempo real de los requisitos de Spring Boot (mínimo 8 caracteres, 1 mayúscula, 1 número).
  - Selector de Roles (`RoleSelectorCards.jsx`): Tarjetas interactivas para elegir entre Cliente, Cajero o Admin.
  - Campo condicional `EmployeeIdField.jsx`: Se despliega automáticamente cuando el rol seleccionado es Cajero o Admin.
  - Conexión con `POST /api/auth/register`. Manejo de respuestas 201 y redirección a login con notificación de éxito.

---

### 🔹 Fase 4: Integración del Módulo de Perfil y Lealtad (`/profile`)
**Objetivo:** Convertir la pantalla de Stitch `af87ace837e24d4aaac6828a5421d168` en la vista de perfil del usuario.
- [ ] **4.1.** Servicio API `src/api/authApi.js`: Función `getProfile()` que llama a `GET /api/auth/profile` enviando el Bearer token.
- [ ] **4.2.** Componente `LoyaltyPointsCard.jsx`:
  - Tarjeta con estética de supermercado que muestra los `loyaltyPoints` acumulados.
  - Barra de progreso hacia el siguiente nivel de beneficios y cálculo del equivalente en dinero canjeable.
  - Código de barras o QR digital para escaneo directo en caja.
- [ ] **4.3.** Vista Principal `src/pages/ProfilePage.jsx`:
  - Despliegue de datos del usuario autenticado (ID UUID, correo, nombre, fecha de registro, rol con `RoleBadge`).
  - Botón de cierre de sesión seguro con limpieza de almacenamiento local.

---

### 🔹 Fase 5: Integración del Módulo de Terminal de Cajero (`/cashier`)
**Objetivo:** Convertir la pantalla de Stitch `966f1496fbcf49138cf9a01db92ab319` y `a5f2afc0ac0f4c0e8e87a1688a48d227` en la terminal POS.
- [ ] **5.1.** Servicio API `src/api/cashierApi.js`: Función `getCashierArea()` que consume `GET /api/auth/cashier-area`.
- [ ] **5.2.** Estado de Caja `src/store/CartContext.jsx`:
  - Gestión de items en la transacción actual, cantidades, subtotales, IVA y total neto.
- [ ] **5.3.** Componentes de la Terminal POS:
  - `ProductScanner.jsx`: Input simulado de código de barras y buscador rápido de abarrotes/productos.
  - `CartItemsTable.jsx`: Tabla de productos escaneados con modificación de cantidades y eliminación.
  - `POSSummaryTotals.jsx`: Desglose financiero y botones de cobro rápido con tecla de acceso directo.
  - `ReceiptModal.jsx`: Modal con el diseño de comprobante electrónico imprimible de Stitch (`a5f2afc0ac0f4c0e8e87a1688a48d227`).
- [ ] **5.4.** Vista Principal `src/pages/CashierPOSPage.jsx`:
  - Protegida exclusivamente para roles `CAJERO` y `ADMIN`.

---

### 🔹 Fase 6: Integración del Módulo de Consola Administrativa (`/admin`)
**Objetivo:** Convertir la pantalla de Stitch `616c4721217f47bab994e0b7db261e30` en el panel de control administrativo.
- [ ] **6.1.** Servicio API `src/api/adminApi.js`: Función `getAdminArea()` que consume `GET /api/auth/admin-only`.
- [ ] **6.2.** Componentes del Dashboard Administrativo:
  - `MetricKpiCard.jsx`: Tarjetas de resumen métrico (usuarios registrados, puntos emitidos, cajas activas).
  - `EmployeeTable.jsx`: Tabla con listado de personal y asignación de `employeeId`.
  - `ServerTelemetryCard.jsx`: Visualización del estado del backend, latencia y endpoints operativos.
- [ ] **6.3.** Vista Principal `src/pages/AdminConsolePage.jsx`:
  - Protegida exclusivamente para rol `ADMIN`.

---

### 🔹 Fase 7: Manejo de Seguridad, Pantalla 403 y Auditoría de Calidad
**Objetivo:** Convertir la pantalla de Stitch `386ed25c1cf04f86bb136ac427225067` y auditar la experiencia de usuario.
- [ ] **7.1.** Vista de Error `src/pages/ForbiddenPage.jsx`:
  - Diseño fiel a la pantalla Stitch para `HTTP 403 Forbidden`.
  - Explicación amigable de por qué se denegó el acceso (ej. un Cliente intentando acceder a la caja o consola de administración).
  - Botones de acción directa: *"Volver a mi perfil"* o *"Cambiar de cuenta"*.
- [ ] **7.2.** Verificación de Vercel React Best Practices:
  - Validar que no existan waterfalls en peticiones asíncronas.
  - Carga diferida (`React.lazy` y `Suspense`) en las páginas de `/cashier` y `/admin` para aligerar el bundle inicial.
  - Cero fugas de memoria en efectos e intervalos del `ApiHealthPill`.
- [ ] **7.3.** Verificación de UI/UX Pro Max:
  - Ratios de contraste WCAG AA en modo claro y oscuro.
  - Navegación por teclado completa (Tab, Enter, Escape).
  - Feedback visual táctil e inmediato en todos los botones y campos interactivos.

---

## 📊 4. Protocolo de Actualización del Estado del Proyecto

Para cumplir con la solicitud:  
> *"Además por cada avance, quiero que se vaya actualizando el estado del proyecto."*

Se mantiene el archivo de control maestro:  
📄 **[`ESTADO_DEL_PROYECTO.md`](file:///c:/Users/Usuario/OneDrive/Desktop/VINCULACION/wachapa/Prouecto%20ingenieria%20web/ESTADO_DEL_PROYECTO.md)**

Cada vez que se complete una fase o sub-fase:
1. Se actualiza el porcentaje de completitud global y por módulo.
2. Se marca el checklist con la fecha y hora de implementación.
3. Se documentan los archivos creados o modificados y las pruebas de conexión realizadas contra `SupermarketApi`.

---

> **Aprobación de Inicio:**  
> Este plan proporciona una hoja de ruta 100% clara, ordenada y sin improvisaciones. Una vez aprobado, podemos dar inicio a la **Fase 0 y Fase 1**.
