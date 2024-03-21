Express Avanzado ✔
Router y Multer ✔
Motores de plantilla (Handlebars) ✔
MongoDb ✔
Mongoose ✔
Mongo Avanzado ( I y II ) ✔
Cookies, Sessions & Storages ( I y II ) ✔
Autorización y autenticación (uuid) ✔
Estrategia de autenticación por terceros + JWT (con GitHub) ✔
Passport Avanzado ✔
Ruteo avanzado y estrategias avanzadas de autorización ✔
Dotenv ✔
Controllers ✔
DAO ✔
FACTORY ✔
DTO ✔
REPOSITORY ✔
ADMIN  CRUD ✔ (ver lo de la imagen)
MAILING (ver lo del attachments) ✔
CREAR TICKET Y RUTA PURCHAS ✔
MOCKING ✔
MANEJOS DE ERRORES ✔
Mocking y manejo de errores (Se visitará el endpoint /mockingproducts y deberá corroborarse una respuesta de 50 productos generados con el formato de un producto real del proyecto. 
Se intentará crear un producto con todos los datos válidos, el producto debe crearse satisfactoriamente. (en postman http://localhost:8080/api/product/)
Se intentará crear un un producto  con todos los campos menos el título y el precio, los cuales deberían ser requeridos, por lo tanto, se debe
recibir un error customizado, en consola debe aparecer una lista de las propiedades requeridas y los tipos (como visto en clase) para reconocer
en qué propiedades no se enviaron los datos.) ✔
IMPLEMENTACION DE LOGGER  ✔
DOCUMENTACIÓN DE API (
Se debe tener documentado el módulo de productos.
Se debe tener documentado el módulo de carrito
No realizar documentación de sesiones
)  ✔
Módulos de testing para proyecto final{
    - Router de products.
    - Router de carts.
    - Router de sessions.
    (npx mocha -timeout 10000 tests/integrations/supertest.test.js) para ejecutar el test
} ✔

🔵 Establecer un nuevo rol para el schema del usuario llamado “premium” el cual estará habilitado también para crear productos
🔵 Modificar el schema de producto para contar con un campo “owner”, el cual haga referencia a la persona que creó el producto
        🔵 Si un producto se crea sin owner, se debe colocar por defecto “admin”.
        🔵 El campo owner deberá guardar sólo el correo electrónico (o _id, lo dejamos a tu conveniencia) del usuario que lo haya creado (Sólo podrá recibir usuarios premium)
🔵 Modificar los permisos de modificación y eliminación de productos para que:
        🔵 Un usuario premium sólo pueda borrar los productos que le pertenecen.
        🔵 El admin pueda borrar cualquier producto, aún si es de un owner.
🔵 Además, modificar la lógica de carrito para que un usuario premium NO pueda agregar a su carrito un producto que le pertenece
🔵 Implementar una nueva ruta en el router de api/users, la cual será /api/users/premium/:uid  la cual permitirá cambiar el rol de un usuario, de “user” a “premium” y viceversa.