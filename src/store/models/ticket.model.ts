export interface Ticket {
    id: string;

    movieUid: string;

    cinemaId: string;

    hallId: string;
    hallName: string;

    techId: string;
    time: Date;

    showtimeId: string;

    seats: {
        id: string;
        row: string;
        seat: string;

        ticketId: string;
        ticketBarcode: string;
        price: {
            algorithm: string;
            amountBonuses: number;
            amountCash: number;
            bookingFee: number;
            discount: number;
            method: string;
            priceTicket: number;
            priceTicketInclDiscount: number;
            purchaseFee: number;
            typeDiscount: string;
            valueDiscount: string;
        };
        vatRate: string;
    }[];

    transactionId: string;
    transactionDate: Date;
}