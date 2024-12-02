import jwt  from "jsonwebtoken";
import {SECRET_JWT_KEY} from '../../config.js'

export class UserController {
    constructor({userModel}){
        this.userModel = userModel
    }
     LogIn = async(req, res) =>{
        const {email, password} = req.body
        try {
            const user = await this.userModel.logIn({email, password})
            
            const token = jwt.sign(
                {id: user.id, email: user.email, username: user.username},
                SECRET_JWT_KEY,
                {expiresIn: '1h'})
            res
            .cookie('access_token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 1000 * 60 * 60
            })
            .json({user, token})
        } catch (error) {
            res.status(500).json({message: error.message});
        }
    }
     createUser = async (req, res, next)=>{
        const {username, email, password} = req.body
        try {
            const register = await this.userModel.createUser({username, email, password})
            res.status(201).json({user: register, message: "User created successfully"});
        } catch (error) {
            res.status(500).json({message: error.message});
        }
    }
    updateUser = async (req, res, next)=>{
        const {id, username, email, password, thumbnail, image} = req.body
        try {
            await this.userModel.updateUser({id, username, email, password, thumbnail, image})
            res.json({message: "User Updates successfully"})
        } catch (error) {
            next(error)
        }
    }
    getFavorites = async(req,res)=>{
        const {id} = req.params
        try {
            const favorites = await this.userModel.getFavorites({id})
            const allGenres = {}

            favorites.forEach(movie => {
                if(!allGenres[movie.id]){
                    allGenres[movie.id] = {...movie, genres:[]}
                }
                allGenres[movie.id].genres.push(movie.genres)
            });
        let moviesWithGenres = Object.values(allGenres)
            res.json(moviesWithGenres)
        } catch (error) {
            res.status(500).json({message: error.message})
        }
       
    }
    addFavorites = async (req, res)=>{
        const {user_id, movie_id} = req.body
        try {  
            await this.userModel.addFavorites({user_id, movie_id})
            res.status(201).json({message: 'Added to favorites successfully'}) 
        } catch (error) {
            res.status(500).json({message: error.message})
        }
    }
    deleteFavorites = async (req, res)=>{
        const {user_id, movie_id} = req.body
        try {
            await this.userModel.deleteFavorites({user_id, movie_id})
            res.json({message: 'Movie successfully removed from favorites'})
        } catch (error) {
            res.status(500).json({message: error.message})
        }
    }
    loginWithToken = async (req, res, next) =>{

            const authorization = req.get('authorization')
            let token = ""
            if(authorization ){
                 token = authorization.split(' ')[1]
            }
            let decodedToken = {}
            try {
                decodedToken = jwt.verify(token, SECRET_JWT_KEY)
                
            } catch(error) {
                next(error);
            }
            
            const id = decodedToken.id

            try {
                const user = await this.userModel.loginWithToken({id});
                res.json({user, token})
            } catch (error) {
                next(error);
            }
    }
    
    logOut = async (req, res)=>{
        res
        .clearCookie('access_token')
        .json({message: 'Logout successfully'})
    }
}