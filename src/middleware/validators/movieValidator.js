import { MovieValidationError } from "../errors/error.js";

export const validationMovie = (req, res, next)=>{
    const {title, year, director, duration, poster, rate, genres, description, image, trailer, heroImage}= req.body;
    const regex = /^-?\d{1,2}(?:\.\d{1})?$/
    const genresIsString = genres.every(element => typeof element === 'string')
    if(!title) throw new MovieValidationError("Title is required");
    if(title.length <= 3) throw new MovieValidationError("invalid title must be more than 3 characters");
    if(!year) throw new MovieValidationError("Year is required");
    if(year < 1977) throw new MovieValidationError("Invalid year must be greater than 1988")
    if(!director) throw new MovieValidationError("Director is required");
    if(director.length <= 6) throw new MovieValidationError("invalid director must be more than 6 characters");
    if(!duration) throw new MovieValidationError("Duration is required");
    if(duration < 20) throw new MovieValidationError("Duration invalid must be greater than 20 minutes")
    if(!poster) throw new MovieValidationError("Poster is required");
    if(!poster.includes("https://")) throw new MovieValidationError("Invalid poster must be a url")
    if(!description) throw new MovieValidationError("Description is required");
    if(!image) throw new MovieValidationError("Description is required");
    if(!trailer) throw new MovieValidationError("Description is required");
    if(!heroImage) throw new MovieValidationError("Description is required");
    if(!regex.test(rate)  ) throw new MovieValidationError("Rate must be a decimal")
    if(rate > 10.0) throw new MovieValidationError("Rate must be less than 10.0")
    if(!genresIsString) throw new MovieValidationError("Genres must be a string");
    
    next()
}