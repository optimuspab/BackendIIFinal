# Comisión 70100 - Programación Backend II: Entrega Final

# Documentación del Proyecto

## Objetivos

### Objetivo General
Profesionalizar la aplicación de servidor aplicando una arquitectura profesional y asegurando que las funcionalidades se alineen con patrones de diseño y mejores prácticas.

### Objetivos Específicos
1. **Aplicar una Arquitectura Profesional para el Servidor**:
   - Estructura modular con archivos separados para configuración, controladores, DAOs, servicios, DTOs y rutas.
   
2. **Implementar Patrones de Diseño y Variables de Entorno**:
   - Utilizar patrones como DAO (Data Access Object) y DTO (Data Transfer Object) para separar el manejo de datos de la lógica de negocio.
   - Utilizar variables de entorno para gestionar configuraciones sensibles como credenciales de base de datos, secretos de JWT y credenciales de servicio de correo electrónico.

3. **Sistema de Autorización y Recuperación de Contraseña**:
   - Implementar control de acceso basado en roles con funciones middleware para restringir el acceso de usuario y administrador.
   - Crear un sistema de recuperación de contraseña que envíe correos electrónicos de restablecimiento de contraseña con enlaces de expiración segura.

---

## Guía de Uso

### Rutas Clave

#### 1. **Registro de Usuario**
   - **Ruta**: `POST /api/register`
   - **Descripción**: Registra un nuevo usuario con `first_name`, `last_name`, `email` y `password`. El rol se establece como `user` por defecto.
   - **Ejemplo de Solicitud**:
     ```json
     {
       "first_name": "Juan",
       "last_name": "Pérez",
       "email": "juan.perez@example.com",
       "password": "contraseñaSegura123"
     }
     ```
   
#### 2. **Inicio de Sesión de Usuario**
   - **Ruta**: `POST /api/login`
   - **Descripción**: Autentica a un usuario y devuelve un token JWT si es exitoso.
   - **Ejemplo de Solicitud**:
     ```json
     {
       "email": "juan.perez@example.com",
       "password": "contraseñaSegura123"
     }
     ```

#### 3. **Agregar Producto al Carrito** (Solo Usuario)
   - **Ruta**: `POST /api/cart/add`
   - **Descripción**: Permite a un usuario autenticado agregar un producto a su carrito especificando el ID del producto y la cantidad.
   - **Ejemplo de Solicitud**:
     ```json
     {
       "product_id": 1,
       "quantity": 2
     }
     ```

#### 4. **Gestión de Productos para Administradores**
   - **Crear Producto**
     - **Ruta**: `POST /api/products`
     - **Descripción**: Permite a un administrador crear un nuevo producto.
     - **Ejemplo de Solicitud**:
       ```json
       {
         "name": "Nombre del Producto",
         "description": "Descripción del producto",
         "price": 19.99,
         "category": "Electrónica",
         "stock": 100,
         "images": ["imagen1.jpg", "imagen2.jpg"]
       }
       ```

#### 5. **Restablecimiento de Contraseña**
   - **Solicitar Enlace de Restablecimiento**
     - **Ruta**: `POST /api/password-reset/request`
     - **Descripción**: Envía un correo electrónico de restablecimiento de contraseña al correo especificado.
     - **Ejemplo de Solicitud**:
       ```json
       {
         "email": "juan.perez@example.com"
       }
       ```

---

## Creación de Tablas en PostgreSQL

Para configurar las tablas de la base de datos en PostgreSQL, usa los siguientes comandos SQL:

```sql
CREATE TABLE carts (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    cart_id INT REFERENCES carts(id),
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    category VARCHAR(100),
    stock INT NOT NULL,
    images JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cart_items (
    id SERIAL PRIMARY KEY,
    cart_id INT REFERENCES carts(id),
    product_id INT REFERENCES products(id),
    quantity INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

## Instalación

Sigue estos pasos para clonar el repositorio, instalar las dependencias y ejecutar el proyecto:

1. Clona el repositorio:
    ```sh
    git clone https://github.com/optimuspab/BackendIIFinal.git
    ```

2. Navega al directorio del proyecto:
    ```sh
    cd BackendIIFinal
    ```

3. Instala las dependencias:
    ```sh
    npm install
    ```

4. Configura las variables de entorno en un archivo `.env` en la raíz del proyecto:

    ### Ejemplo de Archivo `.env`
    ```plaintext
    # Selección de base de datos: usa "mongo" para MongoDB o "postgresql" para PostgreSQL
    DB_TYPE=postgresql  # "mongo" o "postgresql"

    # Configuración de MongoDB
    MONGO_URI=tu_uri_de_mongodb
    MONGO_CERT_PATH=./config/cert.pem

    # Configuración de PostgreSQL (añadir si usas PostgreSQL)
    PG_USER=postgres
    PG_HOST=localhost
    PG_DATABASE=my_database
    PG_PASSWORD=password
    PG_PORT=5432

    # Secretos y configuraciones para autenticación y sesiones
    JWT_SECRET=tu_clave_secreta_para_jwt
    SESSION_SECRET=tu_clave_secreta_para_sesiones

    # Configuración del email
    EMAIL=tu_email
    PASS=tu_password

    # Base URL para restablecimiento de contraseña
    BASE_URL=http://localhost:8080
    ```

    **Nota:** Asegúrate de ajustar `DB_TYPE` según la base de datos que deseas usar (`mongo` o `postgresql`).

5. Inicia el servidor:
    ```sh
    npm start
    ```

El servidor se ejecutará en `http://localhost:8080`.

---

## Ejemplo de Uso
Puedes utilizar Postman o cualquier cliente HTTP para interactuar con las rutas de productos y carritos. Además, la vista de inicio, registro de usuario y demás están disponibles en el navegador.
