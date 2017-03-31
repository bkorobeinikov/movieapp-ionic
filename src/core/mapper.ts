import {
    PlanetaKinoV2City,
    PlanetaKinoTheater,
    PlanetaKinoV2Theater,
    PlanetaKinoV2Hall,
    PlanetaKinoV2Showtime,
    PlanetaKinoV2Movie,
    PlanetaKinoV2Profile,
    PlanetaKinoV2Login
} from "./planetakino-api/models";

import {
    Cinema, Showtime, CinemaHallSeat,
    CinemaHall, Movie, Ticket, Account
} from "../store/models";

import * as _ from 'lodash';
import moment from 'moment';

export class Mapper {


    static mapToMovie(movieObj: PlanetaKinoV2Movie): Movie {

        let technologies = [];
        if (_.isString(movieObj.technologyId)) {
            technologies.push({
                id: movieObj.technologyId,
                name: movieObj.technologies
            });
        } else if (_.isArray(movieObj.technologyId)) {
            let techs = movieObj.technologies.split(",");
            movieObj.technologyId.map((id, index) => {
                technologies.push({
                    id: id,
                    name: techs[index],
                });
            });
        }

        return {
            id: movieObj.id,
            uid: movieObj.uid,
            name: movieObj.name,
            originalName: movieObj.nameOriginal,

            picture: movieObj.mainPosterUrl,
            poster: movieObj.posterUrl,
            bigPoster: movieObj.altPosterUrl,
            description: movieObj.description,

            duration: parseInt(movieObj.length),

            countries: movieObj.country.split(","),
            genres: movieObj.genre.split(","),

            sinceDate: moment(movieObj.sinceDate),
            endDate: moment(movieObj.endDate),

            language: movieObj.duplicationLang,
            ageLimit: movieObj.ageLimit,

            showtimes: movieObj["has-showtimes"] !== undefined,

            director: movieObj.director,
            cast: movieObj.stars.split(","),

            technologies: technologies,

            trailers: [{ youtubeId: movieObj["youtube-id"], previewUrl: movieObj.trailerPreviewUrl }],

            movieUrl: movieObj.movieLink,
            movieShortUrl: movieObj.movieShortLink,

            ratings: {
                imdb: {
                    rating: "8.9",
                },
            },

        };
    }

    static mapToCinemaWithCityAndTheater(c: PlanetaKinoV2City, theater: PlanetaKinoTheater): Cinema {
        return <Cinema>{
            id: theater._id,
            city: {
                id: c._id,
                groupId: c._cid,
                name: c.__text,
            },
            name: theater.theaterName,
            nameShort: theater.theaterNameShort,
            address: theater.theaterAddress,
            addressShort: theater.theaterAddressShort,
            phone: theater.phone,

            // those fields needs to be updated from .getTheaters() call
            commissionForSaleInBonus: undefined,
            vatRate: undefined,
            technologies: undefined,
        };
    }

    static mapToCinemaWithTheater(t: PlanetaKinoV2Theater) {
        return <Cinema>{
            id: t._id,
            address: t.theaterAddress,
            addressShort: undefined,
            city: undefined,
            name: t.theaterName,
            nameShort: undefined,
            phone: t.phone,
            technologies: _.keyBy(t.technology, t => t.id),
            vatRate: t.VATrate,
            commissionForSaleInBonus: t.CommissionForSaleInBonus
        };
    }

    static mapToHall(h: PlanetaKinoV2Hall): CinemaHall {
        let seats: { [seatId: string]: CinemaHallSeat } = {};

        h.seat.map(s => {
            seats[s._id] = {
                id: s._id,
                row: s._row,
                seat: s._seat,
                x: parseInt(s._x),
                y: parseInt(s._y),
                vip: false,
                available: parseInt(s._state) === 0,
                price: parseFloat(s._price),
                bonus: parseFloat(s._price) * 100,
                width: 18,
                height: 28,
            };
        });

        try {
            let seatsValues = _.values(seats);
            let minPrice = _.minBy(seatsValues, s => s.price).price;
            seatsValues.filter(s => s.price > minPrice).forEach(s => s.vip = true);
            console.log('seats', seats);
        } catch (err) {
            console.log(err);
        }

        return {
            id: h._id,
            name: h._name,
            sectorId: h._sectorId,
            bookingFee: parseFloat(h._bookingFee),
            purchaseFee: parseFloat(h._purchaseFee),
            ticketsLeftForPurchase: parseInt(h._ticketsLeftForPurchasing),
            seats: seats,
        };
    }

    static mapToShowtime(cinemaId: string, movieId: string, s: PlanetaKinoV2Showtime): Showtime {
        return {
            id: s.showtimeId,
            cinemaId: cinemaId,
            hallId: undefined,
            movieId: movieId,
            techId: s.technologyId,
            time: moment(s.time.__text)
        }
    }

    static mapToLogin(data: PlanetaKinoV2Login) {
        return {
            authToken: data.authToken,
        };
    }

    static mapToAccount(data: PlanetaKinoV2Profile): Account {
        return {
            id: data.customerCard,
            cardId: data.customerCard,
            bonuses: parseInt(data.bonuses),
            email: data.email,
            name: data.firstName + " " + data.lastName,
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone,
            notifications: {
                tickets: false,
                updates: false,
            },
        };
    }

    static mapToTickets(data: PlanetaKinoV2Profile): Ticket[] {
        if (_.isEmpty(data.tickets) || _.isEmpty(data.tickets.purchased))
            return [];

        return data.tickets.purchased.map(t => (<Ticket>{
            id: t.transactionId,
            cinemaId: t.theaterId,
            hallId: t.HallId,
            hallName: t.HallName,
            movieUid: t.movieId,
            techId: t.technology.id,
            showtimeId: t.showtimeId,
            time: moment(t.movieDate).toDate(),
            transactionId: t.transactionId,
            transactionDate: moment(t.transactionDate).toDate(),
            seats: t.seats.map(s => ({
                id: s.seatId,
                row: s.row,
                seat: s.seat,
                ticketId: s.ticketId,
                ticketBarcode: s.ticketBarcode,
                vatRate: s.VATRate,
                price: {
                    algorithm: s.price[0].algoritm,
                    amountBonuses: parseFloat(s.price[0].amountBonuses),
                    amountCash: parseFloat(s.price[0].amountCash),
                    bookingFee: parseFloat(s.price[0].bookingFee),
                    discount: parseFloat(s.price[0].discount),
                    method: s.price[0].method,
                    priceTicket: parseFloat(s.price[0].priceTicket),
                    priceTicketInclDiscount: parseFloat(s.price[0].priceTicketInclDiscount),
                    purchaseFee: parseFloat(s.price[0].purchaseFee),
                    typeDiscount: s.price[0].typeDiscount,
                    valueDiscount: s.price[0].valueDiscount,
                }
            }))
        }));
    }

}