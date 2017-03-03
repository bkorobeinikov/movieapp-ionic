

const addMovie = (state: any, action: any) => {

}


const initialState = [
    {
        id: 0,
        name: 'Avangers'
    },
    {
        id: 1,
        name: 'Avangers Civil War'
    }
];

export default (state = initialState, action: any) => {
    switch(action.type) {
        case 'ADD_MOVIE':
            return addMovie(state, action);
        default:
            return state;
    }
}