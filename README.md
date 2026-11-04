# Clickmóvil - Sistema de Gestión de Solicitudes

## Integrantes

- Vasquez Perez, Gabriel Alexander 
- Casanova Ito, Diego Andre
- Puelles Centurion, Anthony Jesús 

##  Descripción

**Clickmóvil** es una aplicación móvil de comercio electrónico enfocada en el sector tecnológico y de telefonía móvil. Diseñada para ofrecer una experiencia fluida y moderna, permite a los clientes explorar un catálogo de dispositivos inteligentes y registrar solicitudes de compra, cotización, soporte o servicio técnico mediante un sistema de gestión en memoria (CRUD).

---

## 🛠️ Tecnologías Utilizadas

* **React Native** (v0.86+) — Desarrollo de interfaz nativa multiplataforma para Android e iOS.
* **Expo** (SDK 57) & **Expo Router** — Ecosistema y arquitectura de navegación basada en archivos.
* **TypeScript** — Tipado estricto, interfaces sólidas (`FormRequest`, `CustomInputProps`, `CustomButtonProps`) y prevención de errores en tiempo de compilación.
* **Custom Hooks & Hooks de React** (`useState`, `useEffect`, `useContext`) — Gestión del estado local del formulario, ciclo de vida de componentes y persistencia temporal en memoria.
* **Safe Area Handling** — Manejo dinámico de márgenes para prevenir solapamientos con la barra de estado y notch del dispositivo.

---

##  Requerimientos Cumplidos

- [x] **Pantalla de Login con validación**:
  - Control de estados para correo electrónico y contraseña.
  - Validación dinámica: activación de estados visuales de error cuando los campos están vacíos o no cumplen con el formato.
  - Autenticación contra usuarios almacenados en memoria (`admin@edu.pe` / `admin123`).
  - Navegación hacia la pantalla principal (Home) al autenticar con éxito.

- [x] **Pantalla Home con mensaje de bienvenida y navegación**:
  - Encabezado superior con saludo personalizado utilizando el nombre del usuario activo.
  - Barra de búsqueda reactiva por modelo y marca.
  - Filtros interactivos por categorías de productos en píldoras horizontales (*Apple, Samsung, Xiaomi, Motorola*).
  - Catálogo de productos organizado en cuadrícula (grid) de dos columnas.
  - Barra de navegación inferior (*Bottom Navigation*) con acceso directo a la pantalla de solicitudes.

- [x] **Formulario de Registro (CRUD en memoria) con validaciones visibles**:
  - Interfaz estricta `FormRequest` (`id`, `nombre`, `telefono`, `tipo`, `descripcion`).
  - Validaciones obligatorias en tiempo real para **Nombre del cliente**, **Teléfono** y **Tipo de solicitud**.
  - Activación visual de estado de error (`hasError={true}`) con bordes rojos y alertas explicativas ante campos vacíos.
  - **Create**: Adición reactiva del registro al arreglo temporal en memoria y reinicio del formulario.
  - **Read**: Renderizado inmediato de la lista de solicitudes registradas en tarjetas blancas estilizadas.
  - **Delete**: Botón de eliminación en cada tarjeta con diálogo de confirmación para retirar registros de memoria.

- [x] **Componentes Reutilizables tipados con Props (`CustomInput` y `CustomButton`)**:
  - `CustomInput`: Campo de texto moderno con label superior en mayúsculas, bordes redondeados (12px), feedback de error y soporte multilínea.
  - `CustomButton`: Botón modular con soporte para variantes sólido (azul corporativo `#0449C4`) y *outline*, indicadores de carga (`ActivityIndicator`) y estados deshabilitados.

---

## 🔑 Credenciales de Acceso para Evaluación

Para probar el flujo de inicio de sesión, utilice las siguientes credenciales configuradas en memoria:

| Campo | Credencial |
| --- | --- |
| **Correo / Usuario** | `admin@edu.pe` |
| **Contraseña** | `admin123` |

---

## 🚀 Instrucciones de Ejecución

Para ejecutar y probar el proyecto en un entorno local o emulador, siga estos pasos:

1. **Clonar o situarse en el directorio del proyecto:**
   ```bash
   cd login-crud-memoria
   ```

2. **Instalar las dependencias del proyecto:**
   ```bash
   npm install
   ```

3. **Iniciar el servidor de desarrollo de Expo:**
   ```bash
   npx expo start
   ```

4. **Visualizar la aplicación:**
   - **En Emulador Android:** Presione la tecla <kbd>a</kbd> en la terminal con su emulador abierto.
   - **En Dispositivo Físico:** Abra la app **Expo Go** y escanee el código QR mostrado en la terminal.
   - **En Navegador Web:** Presione la tecla <kbd>w</kbd> para abrir en modo web.
