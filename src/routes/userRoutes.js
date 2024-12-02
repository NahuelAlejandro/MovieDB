import {Router} from'express';
import { UserController } from '../controllers/userController.js';
import { validationJWT } from '../middleware/validators/jsonWebTokenValidator.js';
import { validateUser } from '../middleware/validators/userValidator.js';

export const createUserRouter =({userModel})=>{

    const userController = new UserController({userModel: userModel})
     const userRoutes = Router();
    
    userRoutes.post('/token', validationJWT, userController.loginWithToken );
    userRoutes.post('/login', userController.LogIn);
    userRoutes.post('/register', validateUser, userController.createUser);
    userRoutes.post('/logout', userController.logOut);
    userRoutes.post('/Favorites', userController.addFavorites);
    userRoutes.delete('/Favorites', userController.deleteFavorites);
    userRoutes.get('/Favorites/:id', userController.getFavorites);
    userRoutes.put('/Update', userController.updateUser);

    return userRoutes;
}    


