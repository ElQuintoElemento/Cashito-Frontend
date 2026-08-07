# Cashito — La interfaz que le da vida a tus finanzas

Aplicación web SPA en Angular con autenticación, layout modular y utilidades financieras listas para conectarse al backend de Cashito.

---

## Descripción del sistema

**Cashito Frontend** es la capa de presentación de Cashito, una plataforma orientada a la gestión de finanzas personales. Ofrece a los usuarios una interfaz para registrarse, iniciar sesión y acceder a un entorno protegido donde, en etapas posteriores, podrán administrar su información económica.

En su estado actual, la aplicación cuenta con la base de autenticación, el layout principal y utilidades compartidas preparadas para integrarse con la API.

**Funcionalidades implementadas:**

- Vistas de login y registro de usuario
- Layout principal con header y sidebar
- Guards de autenticación e interceptor HTTP con JWT
- Servicio base para consumir la API REST
- Utilidades compartidas para formato de moneda, fechas y validaciones (preparadas para módulos financieros)
- Soporte de internacionalización (i18n) con `@ngx-translate`

---

## Tecnologías usadas

- **Angular 19** — Framework SPA
- **TypeScript 5.7** — Lenguaje principal
- **RxJS 7** — Programación reactiva
- **Angular Router** — Enrutamiento de vistas
- **Angular HttpClient** — Comunicación con la API REST
- **@ngx-translate** — Internacionalización (i18n)
- **Tailwind CSS 3** — Estilos utilitarios
- **SCSS** — Hojas de estilo por componente

---

## Arquitectura

Estructura modular por responsabilidad (`src/app/`):

```
src/app/
├── app.routes.ts                       # Definición de rutas
├── app.config.ts                       # Providers (HTTP, i18n, interceptors)
├── core/
│   ├── auth/
│   │   ├── services/                   # AuthService (token en localStorage)
│   │   ├── interceptors/               # authInterceptor (Bearer JWT)
│   │   └── guards/                     # authGuard, guestGuard
│   ├── config/                         # themeService, settingsService
│   └── http/                           # BaseService (HttpClient + baseUrl)
├── layout/
│   ├── header/                         # Barra superior
│   ├── sidebar/                        # Menú lateral
│   └── main-layout/                    # Layout principal de la app
├── pages/
│   ├── login/                          # Vista de inicio de sesión
│   ├── register/                       # Vista de registro
│   └── not-found/                      # Página 404
└── shared/
    ├── pipes/                          # currencyPipe, datePipe
    └── utils/                          # validators, format-currency, format-date
```

---

## Cómo ejecutar en local

### Requisitos previos

- [Node.js 20+](https://nodejs.org/) y npm
- [Cashito Backend](https://github.com/tuusuario/cashito-backend) en ejecución (para consumir la API)

1. **Clonar el repositorio:**

   ```bash
   git clone https://github.com/tuusuario/cashito-frontend.git
   cd cashito-frontend
   ```

2. **Configurar la URL del backend** en `src/environments/environmet.ts`:

   ```typescript
   export const environment = {
     production: false,
     serverBaseUrl: 'http://localhost:5210/api/v1',
   };
   ```

3. **Instalar dependencias:**

   ```bash
   npm install
   ```

4. **Ejecutar el servidor de desarrollo:**

   ```bash
   npm start
   ```

5. **Abrir en el navegador:** `http://localhost:4200`

---

## Vistas principales implementadas

| Vista | Descripción |
|-------|-------------|
| **Login** | Formulario de inicio de sesión. Autentica al usuario contra la API y almacena el JWT en `localStorage`. |
| **Registro** | Formulario de creación de cuenta. Envía los datos de registro al endpoint `sign-up` del backend. |
| **Layout principal** | Estructura base de la app con `header`, `sidebar` y área de contenido. Punto de partida para futuros módulos financieros. |
| **Página no encontrada (404)** | Vista de error para rutas inexistentes. |

---

## Capturas de pantalla


### Login

![Vista de inicio de sesión](docs/login.png)

### Registro

![Vista de registro de usuario](docs/register.png)

### Layout principal

![Layout con header y sidebar](docs/main-layout.png)

### Página no encontrada

![Vista 404](docs/not-found.png)

---

## Proyecto relacionado

- [Cashito Backend](https://github.com/tuusuario/cashito-backend) — API REST con autenticación JWT y gestión de usuarios.

---

## Autor

**Victor Andres Cruz Ibarra** | **andrestheb@gmail.com** | **+51 960 938 630**

*Cashito Frontend — Interfaz Angular para gestión financiera personal, desacoplada del backend y preparada para escalar.*
