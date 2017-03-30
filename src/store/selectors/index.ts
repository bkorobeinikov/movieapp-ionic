import { createSelector } from 'reselect';

import { State } from './../reducers';

import * as fromMovie from './../reducers/movie';
import * as fromUi from './../reducers/ui';
import * as fromCinema from './../reducers/cinema';
import * as fromBooking from './../reducers/booking';
import * as fromTicket from './../reducers/ticket';
import * as fromAccount from './../reducers/account';

import * as _ from 'lodash';

// movie state
const getMovieState = (state: State) => state.movie;

export const getMovieEntities = createSelector(getMovieState, fromMovie.getEntities);
const getMovieMapToCinema = createSelector(getMovieState, fromMovie.getMapToCinema);
const getMovieLoading = createSelector(getMovieState, fromMovie.getLoading);

export const getMovieSelectedId = createSelector(getMovieState, fromMovie.getSelectedId);
export const getMovieSelected = createSelector(getMovieState, fromMovie.getSelected);

// ui state
const getUiState = (state: State) => state.ui;

export const getUiRootTabIndex = createSelector(getUiState, fromUi.getRootTabIndex);
export const getUiMoviesCategory = createSelector(getUiState, fromUi.getMoviesCategory);

// cinema state
export const getCinemaState = (state: State) => state.cinema;

export const getCinemaEntities = createSelector(getCinemaState, fromCinema.getCinemas);
export const getCinemas = createSelector(getCinemaEntities, (cinemas) => {
    return Object.keys(cinemas).map(key => cinemas[key]);
});
export const getCinemaCurrentId = createSelector(getCinemaState, fromCinema.getCurrentCinemaId);
export const getCinemaCurrent = createSelector(getCinemaState, fromCinema.getCurrentCinema);
export const getCinemaAllScreeningsEntities = createSelector(getCinemaState, fromCinema.getAllScreeningEntities);
const getCinemaCurrentScreenings = createSelector(getCinemaState, fromCinema.getCurrentCinemaShowtimes);

export const getCinemaCurrentMovies = createSelector(getUiMoviesCategory, getMovieEntities, getCinemaCurrentId, getMovieMapToCinema,
    (category, allMovies, cinemaId, movieMapToCinema) => {
        if (_.isEmpty(allMovies) || _.isEmpty(movieMapToCinema[cinemaId]))
            return [];

        let map = movieMapToCinema[cinemaId];

        if (category == "future")
            return map.otherIds.map(id => allMovies[id]);
        else if (category == "current")
            return map.releasedIds.map(id => allMovies[id]);
        else
            return [];
    });

export const getCinemaCurrentLoading = createSelector(getMovieLoading, (loading) => {
    return loading;
});

export const getCinemaUpdates = createSelector(getCinemaState, fromCinema.getUpdates);

// booking state
const getBookingState = (state: State) => state.booking;

export const getBookingLoading = createSelector(getMovieSelectedId, getCinemaCurrentScreenings, (movieId, screenings) => {
    if (movieId == null || _.isEmpty(screenings) || _.isEmpty(screenings[movieId])) {
        return false;
    }

    return screenings[movieId].loading;
})

export const getBookingAvailableShowtimes = createSelector(getMovieSelectedId, getCinemaCurrentScreenings, (movieId, screenings) => {
    if (movieId == null || _.isEmpty(screenings) || _.isEmpty(screenings[movieId])) {
        return [];
    }

    return _.values(screenings[movieId].showtimes);
});

const getBookingShowtimeId = createSelector(getBookingState, fromBooking.getShowtimeId);
export const getBookingShowtime = createSelector(getBookingAvailableShowtimes, getBookingShowtimeId, (showtimes, showtimeId) => {
    return showtimes.find(s => s.id == showtimeId);
});

export const getBookingHallLoading = createSelector(getBookingState, fromBooking.getHallLoading);
export const getBookingHall = createSelector(getBookingState, fromBooking.getHall);
export const getBookingSeats = createSelector(getBookingState, fromBooking.getSelectedSeats);

const getBookingShowtimeCinema = createSelector(getCinemaEntities, getBookingShowtime, (cinemas, showtime) => {
    if (showtime == null)
        return null;

    return cinemas[showtime.cinemaId];
});
const getBookingShowtimeMovie = createSelector(getMovieEntities, getBookingShowtime, (movies, showtime) => {
    if (showtime == null)
        return null;

    return movies[showtime.movieId];
})
export const getBookingOrder = createSelector(getBookingShowtimeCinema, getBookingHall, getBookingShowtimeMovie, getBookingShowtime, getBookingSeats, (cinema, hall, movie, showtime, seats) => {
    if (showtime == null)
        return null;

    return {
        cinema: cinema,
        hall: hall,
        movie: movie,
        showtime: showtime,
        seats: seats,
    };
})

// ticket state

const getTicketState = (state: State) => state.ticket;
export const getTicketAll = createSelector(getTicketState, fromTicket.getTickets);
export const getTicketSelected = createSelector(getTicketState, fromTicket.getSelectedTicket);

// account state

const getAccountState = (state: State) => state.account;
export const getAccount = createSelector(getAccountState, fromAccount.getAccount);
export const getAccountLoggingIn = createSelector(getAccountState, fromAccount.getLoggingIn);
export const getAccountLoggedIn = createSelector(getAccountState, fromAccount.getLoggedIn);
export const getAccountUpdating = createSelector(getAccountState, fromAccount.getUpdating);