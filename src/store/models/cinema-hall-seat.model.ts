
export interface CinemaHallSeat {
    id: string;
    
    x: number;
    y: number;

    width: number;
    height: number;

    row: number;
    seat: number;

    available: boolean;

    price: number;
    bonus: number;
}