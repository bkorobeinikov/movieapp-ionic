export interface Ticket {
    id: string;

    movieId: string;
    movieName: string;

    cinemaId: string;
    hallId: string;
    hallName: string;

    techId: string;
    time: Date;

    seats: { row: number, seat: number, price: number }[]
}