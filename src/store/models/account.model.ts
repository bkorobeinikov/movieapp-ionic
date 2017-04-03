export interface Account {
    id: string;
    name: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;

    cardId: string;

    bonuses: number;

    notifications: {
        tickets: boolean,
        updates: boolean,
    };

    fake?: boolean;
}