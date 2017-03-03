
const addMovie = (state: any, action: any) => {

}

export default (state: {[key:number]: IMovie} = {}, action: any) => {
    switch(action.type) {
        case 'ADD_MOVIE':
            return addMovie(state, action);
        default:
            return state;
    }
}