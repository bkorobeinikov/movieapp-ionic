import { CinemaMovie, Showtime } from "./../models/";

export interface ScreeningsViewModel {
    movies: CinemaMovie[],
    showtimes: { [showtimeId: string]: Showtime },

    /**
     * Map showtimes to a movie
     * { [movieId]: showtimeIds[] }
     */
    map: { [movieId: string]: string[] },

    loading: boolean,
    loaded: boolean,
    loadedAt: Date,
}