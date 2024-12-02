import express from 'express';
import cors from 'cors';
import {createMovieRouter} from '../src/routes/moviesRoutes.js';
import { PORT, SECRET_JWT_KEY } from '../config.js';
import { createUserRouter } from '../src/routes/userRoutes.js';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import serverless from 'serverless-http'
import { MovieModel } from './src/models/moviesModel.js';
import { UserModel } from './src/models/userModel.js';

const app = express();
    app.use(express.json({ limit: '10mb' }));
    app.use(cookieParser())
    app.use(cors({
        origin: 'http://localhost:5173', 
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
    }));
    app.disable('x-powered-by');
    app.use((req, res, next)=>{
        const token = req.cookies.access_token
        req.session = {user: null}
        try {
            const data = jwt.verify(token, SECRET_JWT_KEY)
            req.session.user = data
        } catch {}
        next()
    })
    app.use('/api/movies', createMovieRouter({movieModel}));
    app.use('/api/user', createUserRouter({userModel}))
   
   export const handler = serverless(app)

