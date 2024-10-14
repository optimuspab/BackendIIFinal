# Comisión 70100 - Programación Backend II: Primer Entrega

## Descripción del Proyecto

Se implementará en el proyecto ecommerce facilitado al inicio del curso un CRUD de usuarios, junto con un sistema de Autorización y Autenticación.

### Características del Proyecto

- Crear un modelo `User` el cual contará con los campos:
    - `first_name`: String
    - `last_name`: String
    - `email`: String (único)
    - `age`: Number
    - `password`: String (Hash)
    - `cart`: Id con referencia a `Carts`
    - `role`: String (default: 'user')
  
- Encriptar la contraseña del usuario mediante el paquete bcrypt (Utilizar el método `hashSync`).

- Desarrollar las estrategias de Passport para que funcionen con este modelo de usuarios.

- Implementar un sistema de login del usuario que trabaje con jwt.

- Desarrollar una estrategia `current` para extraer la cookie que contiene el token y con dicho token obtener el usuario asociado. En caso de tener el token, devolver al usuario asociado al token, caso contrario devolver un error de passport, utilizar un extractor de cookie.

- Agregar al router `/api/sessions/` la ruta `/current`, la cual validará al usuario logueado y devolverá en una respuesta sus datos (Asociados al JWT).

### Rutas del proyecto

#### Base URL: `http://localhost:8080/api`

- **POST `/api/sessions/register`:** Esta ruta permite registrar un nuevo usuario.
  - Durante el registro:
    - Se verifica si el email ya está registrado.
    - Si el usuario no existe, se crea un nuevo carrito y se asocia al usuario.
    - La contraseña se encripta con bcrypt antes de almacenar el usuario en la base de datos.
  - **Ejemplo de uso (payload)**:
    ```json
    {
      "first_name": "John",
      "last_name": "Doe",
      "email": "john.doe@example.com",
      "age": 30,
      "password": "password123"
    }
    ```
  - **Ejemplo de respuesta**:
    ```json
    {
      "message": "Usuario registrado exitosamente.",
      "user": { /* detalles del usuario registrado */ }
    }
    ```

- **POST `/api/sessions/login`:** Esta ruta permite a un usuario iniciar sesión utilizando su email y contraseña. Si las credenciales son correctas, se genera un token JWT que se guarda en una cookie.registrar un nuevo usuario.
  - **Ejemplo de uso (payload)**:
    ```json
    {
      "email": "john.doe@example.com",
      "password": "password123"
    }
    ```
  - **Ejemplo de respuesta**:
    ```json
    {
      "message": "Inicio de sesión exitoso"
    }
    ```

- **GET `/api/sessions/current`:** Esta ruta valida el token JWT del usuario actual y devuelve la información del usuario (sin la contraseña).
  - **Ejemplo de uso**: No se requiere payload. Solo se debe haber iniciado sesión para tener la cookie JWT.
  - **Ejemplo de respuesta**:
    ```json
    {
        "first_name": "John",
        "last_name": "Doe",
        "email": "john.doe@example.com",
        "age": 30,
        "role": "user"
    }
    ```

## Instalación

Sigue estos pasos para clonar el repositorio, instalar las dependencias y ejecutar el proyecto:

1. Clona el repositorio:
    ```sh
    git clone https://github.com/optimuspab/BackendIIPrimeraEntrega.git
    ```

2. Navega al directorio del proyecto:
    ```sh
    cd tu-repositorio
    ```

3. Instala las dependencias:
    ```sh
    npm install
    ```

4. Configura las variables de entorno en un archivo .env:
    ```sh
    MONGO_URI=tu_uri_de_mongodb
    MONGO_CERT_PATH=./config/cert.pem
    JWT_SECRET=tu_clave_secreta_para_jwt
    SESSION_SECRET=tu_clave_secreta_para_sesiones

    Inicia el servidor:
    ```
5. Inicia el servidor:
    ```sh
    npm start
    ```

El servidor se ejecutará en `http://localhost:8080`.

## Ejemplo de Uso
Puedes utilizar Postman o cualquier cliente HTTP para interactuar con las rutas de productos y carritos. Además, las vistas en tiempo real y de home están disponibles en el navegador.