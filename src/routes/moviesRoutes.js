import { Router } from 'express';
import {MoviesController} from '../controllers/moviesController.js';
import { validationMovie } from '../middleware/validators/movieValidator.js';

export const createMovieRouter = ({movieModel}) => {

     const moviesRouter = Router();
    
    const movieController = new MoviesController({movieModel: movieModel})
    
    moviesRouter.get('/', movieController.getAllMovies);
    moviesRouter.get('/allGenres', movieController.getAllGenres);
    moviesRouter.post('/', validationMovie, movieController.createMovie);
    moviesRouter.post('/addGenre', movieController.addGenre)
    moviesRouter.post('/addActor', movieController.addActor)
    
    moviesRouter.route('/:id')
        .get(movieController.getMovieById)
        .put(validationMovie, movieController.updateMovie)
        .delete(movieController.deleteMovie);

        return moviesRouter
}

