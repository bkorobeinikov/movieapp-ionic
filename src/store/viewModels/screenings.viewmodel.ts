import { Showtime } from "./../models/";

import { AsyncOperation } from "./../utils";

export interface ScreeningsViewModel {
    showtimes: { [showtimeId: string]: Showtime };
    loadingOp: AsyncOperation;
}