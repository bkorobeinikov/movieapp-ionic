export interface Account {
    id: string;
    name: string;
    email: string;
    phone: string;

    cardId: string;

    bonuses: number;

    cinemaId: string;

    notifications: {
        tickets: boolean,
        updates: boolean,
    };
}