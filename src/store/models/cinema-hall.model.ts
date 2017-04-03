
import { CinemaHallSeat } from "./cinema-hall-seat.model";

export interface CinemaHall {

    id: string;
    name: string;

    sectorId: string;

    purchaseFee: number;
    bookingFee: number;

    ticketsLeftForPurchase: number;

    seats: { [seatId: string]: CinemaHallSeat }
}