import http from 'http';
import config from './config/config.js';
import app from  './app.js';
import { init } from './db/mongodb.js';
import { logger } from './config/logger.js';

if(config.persistence === 'mongodb'){
      await init();
}

const server = http.createServer(app);
const PORT = config.port;



server.listen(PORT, ()=>{
      logger.info(`Server running on http://localhost:${PORT} 🚀`);
})