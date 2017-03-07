
interface IMovieService {
    type: string;
    rating: string;
}

interface IMovieScreening {
    type: string;
    time: string;
}

interface IMovie {
    id: string;

    name: string;
    poster: string;

    genre?: string[];
    
    inCinema: boolean;

    duration: number;

    services: IMovieService[]

    screening?: IMovieScreening[]
}