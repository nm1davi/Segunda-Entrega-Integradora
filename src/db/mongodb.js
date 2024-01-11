import mongoose from 'mongoose';
import config from '../config/config.js';

export const URI = config.mongodbUri;

export const init = async () => {
    try {
        await mongoose.connect(URI);
        console.log("BD conectada correctamente ✔");
    } catch (error) {
        console.error('Ah ocurrido un error al intentar conectarse a la DB ✖');
        console.error(error);
    }
}

