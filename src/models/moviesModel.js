import { connection } from "../database/mysql.js";



export class MovieModel {
    static async getAll({ genres }) {

        if (genres) {
            const lowerCaseGenre = genres.toLowerCase()
            const result = await connection.query(`
                SELECT BIN_TO_UUID(movie_id) AS id, movie.title, movie.year, movie.director, movie.duration, movie.poster, movie.rate, movie.description, movie.image, movie.trailer, movie.heroImage, genre.name AS genre
                FROM movie_genres
                INNER JOIN genre ON movie_genres.genre_id = genre.id
                INNER JOIN movie ON movie_genres.movie_id = movie.id
                HAVING LOWER(genre.name) = ?;`, [lowerCaseGenre])
            return result
        }
        const movies = await connection.query(`
          SELECT BIN_TO_UUID(movie_id) AS id, movie.title, movie.year, movie.director, movie.duration, movie.poster, movie.rate, movie.description, movie.image, movie.trailer, movie.heroImage, genre.name AS genres
FROM movie_genres
INNER JOIN genre ON movie_genres.genre_id = genre.id
INNER JOIN movie ON movie_genres.movie_id = movie.id;  `);

        return movies;
    }
    static async getAllGenres() {
        const genres = await connection.query(`
        SELECT name FROM genre`);
        const result = genres.map(genre => genre.map(e => e.name))
        return result;
    }
    static async getMovieById({ id }) {
        const result = await connection.query(`
        SELECT BIN_TO_UUID(id) AS id, title, year, director, duration, poster, rate , description, image, trailer, heroImage
        FROM movie 
        WHERE id = UUID_TO_BIN(?)`, [id]);
        return result[0];
    }
    static async createMovie({ title, year, director, duration, poster, rate, genres, description, image, trailer, heroImage, actors }) {

        const [uuidResult] = await connection.query(`SELECT UUID() uuid;`)
        const [{ uuid }] = uuidResult


        try {
            await connection.query(`
            INSERT INTO movie
            (id, title, year, director, duration, poster, rate, description, image, trailer, heroImage)
            VALUES (UUID_TO_BIN(?), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [uuid, title, year, director, duration, poster, rate, description, image, trailer, heroImage]);
            if (genres) {
                genres.forEach(async (element) => {
                    await connection.query(`
                    INSERT INTO movie_genres (movie_id, genre_id) 
                    VALUES (UUID_TO_BIN(?), (SELECT id FROM genre WHERE name = ?));
                `, [uuid, element])
                })
                if (actors) {
                    actors.forEach(async actor => {
                        await connection.query(`
                        INSERT INTO movie_actors (movie_id, actor_id) VALUES 
                        (UUID_TO_BIN(?),(SELECT id FROM actors WHERE name = ?));
                        `,[uuid, actor])
                    })
                }

            }
        } catch (error) {
            throw new Error('Error creating movie');
        }

        const [movies] = await connection.query(`
        SELECT BIN_TO_UUID(id) AS id, title, year, director, duration, poster, rate, description, image, trailer, heroImage
        FROM movie 
        WHERE id = UUID_TO_BIN(?)`, [uuid])
        return movies[0]
    }
    static async deleteMovie({ id }) {
        const deleteMovie = await connection.query(`
            DELETE FROM movie 
            WHERE id = UUID_TO_BIN(?);`, [id]);
        return deleteMovie;
    }
    static async getAllGenresByMovie({ id }) {
        const [genres] = await connection.query(`
            SELECT BIN_TO_UUID(movie_id) AS id, genre.name 
            FROM movie_genres
            INNER JOIN genre ON movie_genres.genre_id = genre.id
            where  movie_id = UUID_TO_BIN(?);`, [id]);

        const result = genres.map(genre => genre.name)

        return result;
    }
    static async getActorsByMovieId({ id }) {
        const [actors] = await connection.query(`
            SELECT BIN_TO_UUID(actors.id) as id, actors.name, actors.thumbnail
            FROM movie_actors
            INNER JOIN actors ON movie_actors.actor_id = actors.id
            where  movie_id = UUID_TO_BIN(?);`, [id])

        return actors
    }
    static async addActor ({name, thumbnail}){
        const [isExist] = await connection.query(`
            SELECT BIN_TO_UUID(id) AS id, name, thumbnail FROM actors WHERE name = ?`,[name])
            if(isExist.length > 0){
                throw new Error(`Actor ${name} already exist`)
            }

        const newActor = await connection.query(`
            INSERT INTO actors (name, thumbnail) 
            VALUES (?, ?);
            `, [name, thumbnail])
            return newActor
    }
    static async updateMovie({ id, title, year, director, duration, poster, rate, genres, description, image, trailer, heroImage, actors }) {
        await connection.query(`
                UPDATE movie 
                SET title = ?, year = ?, director = ?, duration = ?, poster = ?, rate = ?, description= ?, image= ?, trailer= ?, heroImage= ?
                WHERE id = UUID_TO_BIN(?)`, [title, year, director, duration, poster, rate, description, image, trailer, heroImage, id]);

                if(actors.length > 0){
                    await connection.query(`
                     DELETE FROM movie_actors 
                     WHERE movie_id = UUID_TO_BIN(?);`, [id]);

                    actors.forEach( async actor => {await connection.query(`
                        INSERT INTO movie_actors (movie_id, actor_id) VALUES 
                        (UUID_TO_BIN(?),(SELECT id FROM actors WHERE name = ?));
                        `, [id, actor])}
                    ) 
                }

        await connection.query(`
                    DELETE FROM movie_genres 
                    WHERE movie_id = UUID_TO_BIN(?);`, [id]);

        if (genres) {
            const updateGenre = genres.forEach(async (e) => {
                    await connection.query(`
                                INSERT INTO movie_genres (movie_id, genre_id) 
                                VALUES (UUID_TO_BIN(?), (SELECT id FROM genre WHERE name = ?));
                            `, [id, e])
            })
            return updateGenre

        }

    }
    static async addGenre({ name }) {
        const newGenre = await connection.query(`
            INSERT INTO genre (name)
            VALUES (?)`, [name])
        return newGenre
    }
}
