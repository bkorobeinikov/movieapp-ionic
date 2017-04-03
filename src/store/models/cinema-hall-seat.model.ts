
export interface CinemaHallSeat {
    id: string;

    x: number;
    y: number;

    width: number;
    height: number;

    row: string;
    seat: string;

    vip: boolean;
    available: boolean;

    price: number;
    bonus: number;
}