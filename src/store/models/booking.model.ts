
import moment from 'moment';

export class Booking {

    cinemaId: string;
    hallId: string;

    movieId: string;

    techId: string;
    time: moment.Moment;

    seats: { row: number, place: number }[];
}