import bcrypt from 'bcrypt'
import { SALT_ROUNDS } from '../../config.js';
import { connection } from '../database/mysql.js';


export class UserModel {

   static async logIn({email, password}){

   
    const [user] = await connection.query(`
        SELECT BIN_TO_UUID(id) AS id, username, email, password, thumbnail 
        FROM user 
        WHERE email = ?`,[email]);
    if (user == "") throw new Error(`Email does not exist email:${email}`);

    const validPassword = await bcrypt.compare(password, user[0].password);
    if(!validPassword) throw new Error('Password is invalid');
    return {
        id: user[0].id,
        email: user[0].email,
        username: user[0].username,
        thumbnail: user[0].thumbnail
    };
    }

    static async createUser({username, email, password}){
        const [isExist] = await connection.query(`
            SELECT BIN_TO_UUID(id) AS id, username, email, password  
            FROM user
            WHERE email = ?`, [email])
        
           if(isExist[0]) throw new Error("Email already exists ")
           
           
        const [uuidResult] = await connection.query(`SELECT UUID() uuid;`);
        const [{uuid}] = uuidResult;
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        try {
           await connection.query(`
                INSERT INTO user (id, username, email,  password) 
                VALUES (UUID_TO_BIN(?),?,?,?)`, [uuid, username, email, hashedPassword]);
        } catch (error) {
            throw new Error('Error Register user');
        }

        const [newUser] = await connection.query(`
            SELECT BIN_TO_UUID(id) AS id, username, email, password  
            FROM user
            WHERE id = UUID_TO_BIN(?)`, [uuid]);

        return {
            id: newUser[0].id,
            username: newUser[0].username
        } 
    }
    static async updateUser ({id, username, email, password, thumbnail}){

        if(password){
            const hashedNewPassword = await bcrypt.hash(password, SALT_ROUNDS);
            await connection.query(`
                UPDATE user
                SET username = ?, email = ?, password = ?, thumbnail = ?
                WHERE id = UUID_TO_BIN(?)`, [username, email, hashedNewPassword, thumbnail, id])
                return;
        }
            await connection.query(`
            UPDATE user
            SET username = ?, email = ?, thumbnail = ?
            WHERE id = UUID_TO_BIN(?)`, [username, email, thumbnail, id])
       

    }
    static async getFavorites({id}){
        const [favorites] = await connection.query(`
            SELECT BIN_TO_UUID(movie.id) AS id, movie.title, movie.year, movie.director, movie.duration, movie.poster, movie.rate, movie.description, genre.name AS genres
            FROM movie_genres
            INNER JOIN genre ON movie_genres.genre_id = genre.id
            INNER JOIN movie ON movie_genres.movie_id = movie.id 
            INNER JOIN favorites ON movie_genres.movie_id = favorites.movie_id
            WHERE favorites.user_id = UUID_TO_BIN(?);`, [id]);
           
            return favorites
    }
    static async addFavorites({user_id, movie_id}){
            const addFavorites = await connection.query(`
                INSERT INTO favorites (user_id, movie_id) VALUES 
                ((SELECT id FROM user where id = UUID_TO_BIN(?)),(SELECT id FROM movie WHERE id = UUID_TO_BIN(?)))`,[user_id, movie_id])
                return addFavorites
    }
    static async deleteFavorites({user_id, movie_id}){
        const deleteFavorites = await connection.query(`
            DELETE FROM favorites  
            WHERE user_id = UUID_TO_BIN(?)
            AND movie_id = UUID_TO_BIN(?);`,[user_id, movie_id])
            return deleteFavorites
    }
    static async loginWithToken( {id} ){
        const [user] = await connection.query(`
            SELECT BIN_TO_UUID(id) AS id, username, email, password, thumbnail
            FROM user 
            WHERE id = UUID_TO_BIN(?)`,[id])
            return {
                id:user[0].id,
                email:user[0].email,
                username:user[0].username,
                thumbnail:user[0].thumbnail
            }
    }
}