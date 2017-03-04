import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';

interface Props {
    route: React.Route;
    navigator: React.Navigator;

    movies: IMovie[];
    movieId: string;
}

interface State {

}

class MoviesScene extends Component<Props, State> {

    render() {

        const {movies, movieId} = this.props;

        var movie = movies.find(m => m.id == movieId);

        if (movie != null)
            return (
                <View>
                    <Text>Movie - {movie.name}</Text>
                </View>
            )

        return (
            <View>
                <Text>no movie selected </Text>
            </View>
        );
    }
}

const mapStoreToProps = (store: any) => {
    return {
        movies: store.data.movies as IMovie[]
    };
}

export default connect(mapStoreToProps)(MoviesScene);