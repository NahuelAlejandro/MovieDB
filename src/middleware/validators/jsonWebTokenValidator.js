import { jsonwebtokenError } from "../errors/error.js";

export const validationJWT = (err, req, res ,next)=> {
    if (err.name === 'JsonWebTokenError') {
        throw new jsonwebtokenError("token is missing or invalid");  
    }
    if(err.name === 'TokenExpiredError'){
        throw new jsonwebtokenError( 'token expired')
    }
    next(err)
}
