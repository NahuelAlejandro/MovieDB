import { UserValidationError } from "../errors/error.js";


export const validateUser = (req, res, next)=>{
    const {username, password, email}= req.body
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
if (!username) throw new UserValidationError("Username is required");
if (!password) throw new UserValidationError("Password is required");
if (!email) throw new UserValidationError('Email is required');
if (!regex.test(email)) throw new UserValidationError('Invalid Email adress '); 
next()
}

