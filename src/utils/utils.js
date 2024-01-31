import path from "path";
import bcrypt from 'bcrypt'
import url from 'url';
import { faker } from '@faker-js/faker';


const __filename = url.fileURLToPath(import.meta.url)
export const __dirname = path.dirname(__filename)

//Creamos un hash para encriptar la password
export const createHash = password =>  bcrypt.hashSync(password, bcrypt.genSaltSync(10)); //tenemos nuestro password haseado

//Nos permite saber si el password que estamos obteniendo y compararlo con el hasado coincide
export const isValidPassword = (password, user) => bcrypt.compareSync(password, user.password);

export const generateProduct = () =>{
    const descriptionWords = 15;
    const description = faker.lorem.words(descriptionWords);
    return {
        id: faker.database.mongodbObjectId(),
        description: description,
        title: faker.commerce.productName(),
        price: faker.commerce.price(),
        image:faker.image.url(),
        code:faker.string.alphanumeric({ length: 10}),
        stock: faker.number.int({min: 10000, max: 99000}),
        category: faker.commerce.department(),
        status: faker.datatype.boolean() ? 'True' : 'False',
    }
};


