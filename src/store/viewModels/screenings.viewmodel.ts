import { Showtime } from "./../models/";

export interface ScreeningsViewModel {

    showtimes: { [showtimeId: string]: Showtime },

    loading: boolean,
    loaded: boolean,
    loadedAt: Date,
}