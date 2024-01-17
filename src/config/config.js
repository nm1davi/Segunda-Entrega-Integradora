import dotenv from 'dotenv';

dotenv.config();

export default {
      env: process.env.NODE_ENV || 'development',
      port: process.env.PORT || 8080,
      mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce',
}