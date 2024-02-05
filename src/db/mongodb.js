import mongoose from 'mongoose';
import config from '../config/config.js';
import { logger } from '../config/logger.js';

export const URI = config.mongodbUri;

export const init = async () => {
    try {
        await mongoose.connect(URI);
        logger.info("BD conectada correctamente ✔");
    } catch (error) {
        logger.error('Ah ocurrido un error al intentar conectarse a la DB ✖');
        console.error(error);
    }
}

