import {createApp} from './functions/app.js';
import { MovieModel } from './src/models/moviesModel.js';
import { UserModel } from './src/models/userModel.js';


createApp({movieModel:MovieModel, userModel: UserModel});