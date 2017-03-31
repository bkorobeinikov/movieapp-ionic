export interface PlanetaKinoTheater {
    _id: string;
    theaterName: string;
    theaterNameShort: string;
    theaterAddress: string;
    theaterAddressShort: string;
    phone: string;
    lat: string;
    lon: string;
    city: string;
    technology: string;
}

export interface PlanetaKinoV2Theater {
    _id: string;
    theaterName: string;
    description: string;
    theaterAddress: string;
    phone: string;
    lat: string;
    lon: string;
    city: string;
    VATrate: string;
    CommissionForSaleInBonus: string;
    technology: {
        id: string;
        name: string;

        idFormat: string;
        nameFormat: string;

        idAggrTechnology: string;
        nameAggrTechnology: string;
    }[];
}