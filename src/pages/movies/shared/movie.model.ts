export interface MovieService { 
    type: string; 
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
 
    services: MovieService[] 
    screening?: MovieScreening[] 
}