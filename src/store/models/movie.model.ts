import moment from 'moment';

export interface MovieRating {
    rating: string;
}

export interface Movie {
    id: string;
    uid: string;

    name: string;
    originalName: string;

    picture: string;
    poster: string;
    bigPoster: string;

    description: string;

    duration: number;

    countries?: string[];
    genres?: string[];

    sinceDate: moment.Moment;
    endDate: moment.Moment;

    language: string;
    ageLimit?: string;

    showtimes: boolean;

    director: string;
    cast: string[];

    trailers: { youtubeId: string, previewUrl: string }[],

    technologies: {
        id: string,
        name: string,
    }[];

    movieUrl: string;
    movieShortUrl: string;

    ratings?: {
        imdb: MovieRating
    }
}