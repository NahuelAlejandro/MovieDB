
export class MoviesController {

    constructor ({ movieModel }) {
        this.movieModel = movieModel
      }
 getAllMovies = async (req, res, next) =>{
    const {genres} = req.query;
    try {
        const [movies] = await this.movieModel.getAll({genres})
        const allMovies = {}
    movies.forEach(movie => {
    
    if(!allMovies[movie.id]){
        allMovies[movie.id] = {...movie, genres: []}
    } 
    allMovies[movie.id].genres.push(movie.genres)
    })
    let consolidatedMovies = Object.values(allMovies)
        res.status(200).json(consolidatedMovies);
    } catch (error) {
       next(error)
    }
}
 getAllGenres = async (req, res, next)=>{
    try {
        const [genres] = await this.movieModel.getAllGenres()
        res.json(genres)
    } catch (error) {
        next(error);
    }
}
 createMovie = async (req, res, next) => {
    const {title, year, director, duration, poster, rate, genres, description, image, trailer, heroImage, actors} = req.body
    try {
        const newMovie = await this.movieModel.createMovie({title, year, director, duration, poster, rate, genres, description, image, trailer, heroImage, actors})
        res.status(201).json(newMovie);
    } catch (error) {
        next(error);
    }
}

 getMovieById = async (req, res, next) => {
    const {id} = req.params
    try {
        const [movie] = await this.movieModel.getMovieById({id})
        if (movie) {
            const actors = await this.movieModel.getActorsByMovieId({id})
            const genres = await this.movieModel.getAllGenresByMovie({id})
            const aux = {...movie, genres, actors}
            return res.json(aux)
        }

        res.status(404).json({message: 'Movie not found'})
    } catch (error) {
        next(error);
    }
}
 updateMovie = async (req, res, next) => {
    const {id} = req.params;
    const {title, year, director, duration, poster, rate, genres, description, image, trailer, heroImage, actors} = req.body
   
    try {
        await this.movieModel.updateMovie({id, title, year, director, duration, poster, rate, genres, description, image, trailer, heroImage, actors})
        const [movie] = await this.movieModel.getMovieById({id})
        if (movie) {
            const actors = await this.movieModel.getActorsByMovieId({id})
            const genres = await this.movieModel.getAllGenresByMovie({id})
            const aux = {...movie, genres, actors}
            return res.json(aux)
        }
    } catch (error) {
        next(error);
    }
}
 deleteMovie = async (req, res, next) => {
    const {id} = req.params;
    try {
        await this.movieModel.deleteMovie({id})
        res.json({message: "The movie has been successfully deleted."})
    } catch (error) {
        next(error);
    }
}
 addGenre = async (req, res, next) => {
    const {name} = req.body
    try {
        await this.movieModel.addGenre({name})
        res.json({message: `the Genre ${name} added succesfully`})
    } catch (error) {
        next(error);
    }
}
 addActor = async(req, res, next)=>{
    const {name, thumbnail} = req.body
    try {
        await this.movieModel.addActor({name, thumbnail})
        res.json({message: `the Actor ${name} added succesfully`})
    } catch (error) {
        next(error)
    }
 }
}

