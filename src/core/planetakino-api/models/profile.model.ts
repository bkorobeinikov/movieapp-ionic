export interface PlanetaKinoV2Profile {
    addItems: any;
    avatar: any;
    bonuses: string;
    customerCard: string;
    dob: string;
    email: string;
    emailConfirmed: string;
    firstName: string;
    gender: string;
    isClubMember: string;
    lastName: string;
    loyalityCard: string;
    password: string;
    phone: string;
    phoneConfirmed: string;
    promoCodes: any;

    tickets: {
        purchased: [
            {
                HallId: string;
                HallName: string;
                movieDate: string;
                movieId: string;
                movieName: string;
                paymentStatus: string;
                showtimeId: string;
                theaterId: string;
                theaterName: string;
                transactionDate: string;
                transactionId: string;
                technology: {
                    id: string;
                    idAggrTechnology: string;
                    idFormat: string;
                    name: string;
                    nameAggrTechnology: string;
                    nameFormat: string;
                },
                seats: [
                    {
                        price: {
                            algoritm: string;
                            amountBonuses: string;
                            amountCash: string;
                            bookingFee: string;
                            discount: string;
                            method: string;
                            priceTicket: string;
                            priceTicketInclDiscount: string;
                            purchaseFee: string;
                            typeDiscount: string;
                            valueDiscount: string;
                        }[],
                        row: string;
                        seat: string;
                        seatId: string;
                        statusDate: string;
                        ticketBarcode: string;
                        ticketId: string;
                        VATRate: string;
                    }
                ]
            }
        ]
    }
}