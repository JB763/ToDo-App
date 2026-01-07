import express from 'express';
import cors from 'cors';
import router from './router';
import {connectDB} from './config/database';
import 'dotenv/config';
import {corsConfig} from './config/cors';

const app = express();  
connectDB();

//cors config, importa el orden de las peticiones
app.use(cors(corsConfig));

//parser de json 
app.use(express.json());

//llamada a router
app.use('/', router);


export default app;