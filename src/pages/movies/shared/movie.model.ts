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
    poster: string; 

    release?: string;
 
    countries?: string[];
    genres?: string[]; 
     
    duration: number; 
 
    ratings?: {
        imdb: MovieRating
    }
    screening?: MovieScreening[],
}