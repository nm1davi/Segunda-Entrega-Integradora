import mongoose from 'mongoose';


export const URI = 'mongodb+srv://developer:gVv8zVirk3lZbGYq@cluster0.0ewcbcb.mongodb.net/ecommerce?retryWrites=true&w=majority'

export const init = async () => {
    try {
        await mongoose.connect(URI);
        console.log("BD conectada correctamente ✔");
    } catch (error) {
        console.error('Ah ocurrido un error al intentar conectarse a la DB ✖');
        console.error(error);
    }
}

