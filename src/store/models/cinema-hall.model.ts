
import { CinemaHallSeat } from "./cinema-hall-seat.model";

export interface CinemaHall {

    id: string;
    name: string;

    seats: { [seatId: string]: CinemaHallSeat }
}