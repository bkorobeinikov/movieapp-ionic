export interface PlanetaKinoV2Hall {
    _name: string;
    _id: string;
    _sectorId: string;
    _verticalRatio: string;
    _horizontalRatio: string;
    _purchaseFee: string;
    _bookingFee: string;
    _ticketsLeftForPurchasing: string;

    _width: string;
    _height: string;

    seat: {
        _id: string;
        _row: string;
        _seat: string;
        _price: string;
        _x: string;
        _y: string;
        _state: string;
    }[];
}