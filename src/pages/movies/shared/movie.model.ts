export interface MovieRating { 
    rating: string; 
} 
 
export interface MovieScreening { 
    type: string; 
    time: string; 
} 
 
export interface Movie { 
    id: string; 
 
    name: string; 
    poster: string; 
 
    genres?: string[]; 
     
    duration: number; 
 
    ratings?: {
        imdb: MovieRating
    }
    screening?: MovieScreening[] 
}