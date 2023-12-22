import path from "path";
import bcrypt from 'bcrypt'
import url from 'url';

const __filename = url.fileURLToPath(import.meta.url)
export const __dirname = path.dirname(__filename)

//Creamos un hash para encriptar la password
export const createHash = password =>  bcrypt.hashSync(password, bcrypt.genSaltSync(10)); //tenemos nuestro password haseado

//Nos permite saber si el password que estamos obteniendo y compararlo con el hasado coincide
export const isValidPassword = (password, user) => bcrypt.compareSync(password, user.password);

