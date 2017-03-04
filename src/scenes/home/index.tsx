import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text, StyleSheet, ViewStyle, ScrollView, Dimensions, TouchableHighlight } from 'react-native';

import MovieItem from './components/MovieItem';

import MoviesScene from './../movies';

interface Props {
    route: React.Route;
    navigator: React.Navigator;

    movies: IMovie[]
}

interface State {
    layout: {x: number, y: number, width: number, height: number}
}

class Home extends Component<Props, State> {

    currentMovieItemWidth: number = 0;
    futureMovieItemWidth: number = 0;

    constructor() {
        super();

        this.state = {
            layout: {x: 0, y: 0, width: 0, height: 0}
        };
    }

    temp: number = 0;

    onLayout(e: any) {

        var width = e.nativeEvent.layout.width;

        const calculateMovieItemWidth = (container: ViewStyle, item: ViewStyle, count: number) => {
            var result = width - 10*2 - 10*count - width*0.01*count;
            return result / count;
        }

        this.currentMovieItemWidth = calculateMovieItemWidth(styles.currentMovies, styles.currentMoviesItem, 2);
        this.futureMovieItemWidth = calculateMovieItemWidth(styles.futureMovies, styles.futureMoviesItem, 3);

        styles.currentMoviesItem = StyleSheet.flatten([styles.currentMoviesItem, {width: this.currentMovieItemWidth}]);
        styles.futureMoviesItem = StyleSheet.flatten([styles.futureMoviesItem, {width: this.futureMovieItemWidth}]);

        this.forceUpdate();
        
    }

    onMovie(movieId: string) {
        this.props.navigator.push({
            name: 'Movies',
            component: MoviesScene,
            passProps: {
                movieId: movieId
            }
        })
    }

    render() {

        const { movies } = this.props;

        var currentMovies = movies.filter(m => m.inCinema);
        var futureMovies = movies.filter(m => !m.inCinema);

        return (
            <ScrollView>
                <View style={styles.currentMovies} onLayout={e => this.onLayout(e)}>
                    {currentMovies.map((m) => 
                        <MovieItem style={styles.currentMoviesItem} 
                            key={m.id} movie={m}
                            onPress={() => this.onMovie(m.id)}/>
                    )}
                    {currentMovies.length % 2 == 1 &&
                        <View style={styles.currentMoviesItem}></View>
                    }
                </View>
                <View style={styles.futureMovies}>
                    {futureMovies.map((m) => 
                        <MovieItem style={styles.futureMoviesItem} key={m.id} movie={m}
                            onPress={() => this.onMovie(m.id)}/>
                    )}
                    {(futureMovies.length % 3 == 1) &&
                        <View style={styles.futureMoviesItem}></View> &&
                        <View style={styles.futureMoviesItem}></View>
                    }
                    {(futureMovies.length % 3 == 2) &&
                        <View style={styles.futureMoviesItem}></View>
                    }
                </View>
            </ScrollView>
        );
    }
}


const styles = StyleSheet.create({
    currentMovies: {
        marginHorizontal: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
    } as ViewStyle,

    futureMovies: {
        marginHorizontal: 10,
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap'
    } as ViewStyle,

    currentMoviesItem: {
        margin: 10,
    } as ViewStyle,

    futureMoviesItem: {
        margin: 10,
    } as ViewStyle,
})

const mapStoreToProps = (store: any) => {
    return {
        movies: store.data.movies
    };
};

export default connect(mapStoreToProps)(Home);