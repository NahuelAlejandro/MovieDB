import dotenv from 'dotenv'

dotenv.config();

export const {
    PORT,
    HOST,
    DATABASE,
    USER,
    PASSWORD,
    SALT_ROUNDS,
    SECRET_JWT_KEY 
} = process.env