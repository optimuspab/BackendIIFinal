# Comisión 70100 - Programación Backend II: Entrega Final

Objetivos generales

Profesionalizar el servidor desarrollado en la primera preentrega
Objetivos específicos

Aplicar una arquitectura profesional para nuestro servidor
Aplicar prácticas como patrones de diseño, mailing, variables de entorno. etc.
Se debe entregar

Modificar nuestra capa de persistencia para aplicar los conceptos de DAO y DTO.
Implementar el patrón Repository para trabajar con el DAO en la lógica de negocio.
Modificar la ruta  /current Para evitar enviar información sensible, enviar un DTO del usuario sólo con la información necesaria.
Realizar un middleware que pueda trabajar en conjunto con la estrategia “current” para hacer un sistema de autorización y delimitar el acceso a dichos endpoints:

Sólo el administrador puede crear, actualizar y eliminar productos.
Sólo el usuario puede agregar productos a su carrito.
Realizar un sistema de recuperación de contraseña, la cual envíe por medio de un correo un botón que redireccione a una página para restablecer la contraseña (no recuperarla).
El link del correo debe expirar después de 1 hora de enviado.
Si se trata de restablecer la contraseña con la misma contraseña del usuario, debe impedirlo e indicarle que no se puede colocar la misma contraseña.
Si el link expiró, debe redirigir a una vista que le permita generar nuevamente el correo de restablecimiento, el cual contará con una nueva duración de 1 hora.
