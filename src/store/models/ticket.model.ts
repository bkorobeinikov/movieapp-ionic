export interface Ticket {
    id: string;

    movieId: string;

    cinemaId: string;
    hallId: string;
    hallName: string;

    techId: string;
    time: Date;

    seats: { id: string, row: string, seat: string, price: number }[]
}