
import moment from 'moment';

export class Ticket {

    cinemaId: string;
    hallId: string;

    movieId: string;

    techId: string;
    time: moment.Moment;

    seats: { row: number, place: number }[];
}