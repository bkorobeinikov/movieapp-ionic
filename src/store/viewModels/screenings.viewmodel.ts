import { Showtime } from "./../models/";

import { AsyncOperation } from "./async-operation";

export interface ScreeningsViewModel {
    showtimes: { [showtimeId: string]: Showtime };
    loadingOp: AsyncOperation;
}