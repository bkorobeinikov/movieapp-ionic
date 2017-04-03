export interface Cinema {
    id: string;

    city: {
        /**
         * this is _id field from /cities request.
         */
        id: string;
        /**
         * this is _cid field from /cities (like group 'city group id')
         * for example: Lviv has two cinemas so the group id gonna be the same for them
         */
        groupId: string;
        name: string;
    }

    name: string;
    nameShort: string;

    address: string;
    addressShort: string;

    phone: string;

    vatRate: string;
    commissionForSaleInBonus: string;

    technologies: {
        [techId: string]: {
            id: string;
            name: string;

            idFormat: string;
            nameFormat: string;

            idAggrTechnology: string;
            nameAggrTechnology: string;
        }
    };
}