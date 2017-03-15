import moment from 'moment';

export interface MovieRating { 
    rating: string; 
} 
 
export interface MovieScreening { 
    type: string; 
    time: string; 
    tech?: string;
} 
 
export interface Movie { 
    id: string; 
 
    name: string; 
    originalName: string;

    picture: string;
    poster: string;

    description: string;

    duration: number; 

    countries?: string[];
    genres?: string[]; 

    soon: boolean;
    sinceDate: moment.Moment;
    endDate: moment.Moment;

    language: string;
    ageLimit?: string;

    showtimes: boolean;

    director: string;
    cast: string[];
 
    ratings?: {
        imdb: MovieRating
    }
}