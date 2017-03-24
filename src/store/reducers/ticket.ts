import { createSelector } from 'reselect';

import * as actionsTicket from './../actions/ticket';
import * as _ from 'lodash';

import { Ticket } from './../models';

export interface State {
    tickets: { [ticketId: string]: Ticket };

    loading: boolean;
    loaded: boolean;

    selectedTicketId: string;
}

export const initialState: State = {
    tickets: {},

    loading: false,
    loaded: false,

    selectedTicketId: null,
};

export function reducer(state: State, actionRaw: actionsTicket.Actions) {
    switch (actionRaw.type) {
        case actionsTicket.ActionTypes.LOAD: {
            return Object.assign({}, state, {
                loading: true,
                loaded: false,
            });
        }
        case actionsTicket.ActionTypes.LOAD_SUCCESS: {
            let action = <actionsTicket.LoadSuccessAction>actionRaw;

            var newTickets = _.keyBy(action.payload, t => t.id);

            return Object.assign({}, state, {
                tickets: Object.assign({}, state.tickets, newTickets),
                loading: false,
                loaded: true,
            });
        }
        case actionsTicket.ActionTypes.LOAD_FAIL: {

            return Object.assign({}, state, {
                loading: false,
                loaded: false,
            });
        }
        case actionsTicket.ActionTypes.SELECT: {
            let action = <actionsTicket.SelectAction>actionRaw;

            return Object.assign({}, state, {
                selectedTicketId: action.payload,
            });
        }
        default: {
            return state;
        }
    }
}

const getTicketsEntities = (state: State) => state.tickets;
export const getTickets = createSelector(getTicketsEntities, (entities) => {
    return _.values(entities);
})
export const getLoading = (state: State) => state.loading;
export const getLoaded = (state: State) => state.loaded;
const getSelectedTicketId = (state: State) => state.selectedTicketId;

export const getSelectedTicket = createSelector(getTicketsEntities, getSelectedTicketId, (entities, selectedId) => {
    return entities[selectedId];
});