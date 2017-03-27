export interface Ticket {
    id: string;

    movieId: string;

    cinemaId: string;
    hallId: string;
    hallName: string;

    techId: string;
    time: Date;

    seats: { id: string, row: number, seat: number, price: number }[]
}