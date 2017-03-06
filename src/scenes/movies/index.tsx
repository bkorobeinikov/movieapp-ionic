import React, { Component } from 'react';
import { View, Text, PanResponder, Navigator, StyleSheet, ViewStyle, ScrollViewStyle, TextStyle } from 'react-native';
import { connect } from 'react-redux';

var Dimensions = require('Dimensions');
var SCREEN_WIDTH = Dimensions.get('window').width;
var SCREEN_HEIGHT = Dimensions.get('window').height;

import Carousel from 'react-native-snap-carousel';

interface Props {
    route: React.Route;
    navigator: React.Navigator;

    movies: IMovie[];
    movieId: string;
}

interface State {
    movieId: string;
}

class MoviesScene extends Component<Props, State> {

    static sceneConfig: React.SceneConfig = null;

    static getSceneConfig(): React.SceneConfig {

        var sceneConfig: React.SceneConfig = MoviesScene.sceneConfig = {
            ...Navigator.SceneConfigs.FloatFromBottom,
            gestures: {
                pop: {
                    ...Navigator.SceneConfigs.FloatFromBottom.gestures.pop,
                    edgeHitWidth: 0
                }
            }
        };

        return sceneConfig;
    }

    constructor() {
        super();
        this.state = {
            movieId: null,
        };
    }

    componentWillMount() {
    }

    componentDidMount() {
        setTimeout(() => {
            if (MoviesScene.sceneConfig != null)
                MoviesScene.sceneConfig.gestures.pop.edgeHitWidth = SCREEN_HEIGHT;
        }, 4000);
    }

    onSnapToIndex(index: number) {
        var { movies } = this.props;

        var movie = movies.find((m, i) => {
            return i == index;
        });

        this.setState({
            movieId: movie.id,
        });

    }

    render() {

        var {movies, movieId} = this.props;
        if (this.state != null && this.state.movieId != null)
            movieId = this.state.movieId;

        var movie = movies.find(m => m.id == movieId);
        var movieIndex = movies.findIndex(m => m.id == movieId);

        const slides = movies.map((entry, index) => {
            return (
                <View key={`entry-${index}`} style={movieId == entry.id ? styles.selectedMovie : styles.movie}>
                    <View style={styles.movieHeader}>
                    </View>
                    <View style={styles.movieContent}>
                         <Text style={styles.movieTitle}>{ entry.name }</Text>
                        
                    </View>
                </View>
            );
        });

        if (movie != null)
            return (
                <View style={styles.view}>
                    <View style={styles.top}>
                    </View>
                    <View style={styles.content}>
                        <Carousel
                        ref={'carousel'}
                        style={styles.carousel}
                        sliderWidth={SCREEN_WIDTH}
                        itemWidth={SCREEN_WIDTH*0.8}
                        onSnapToItem={(i:number) => this.onSnapToIndex(i)}
                        showsHorizontalScrollIndicator={false}
                        firstItem={movieIndex}>
                        { slides }
                    </Carousel>
                    </View>
                </View>
            )

        return (
            <View>
                <Text>no movie selected </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    view: {
        flex: 1,
        backgroundColor: 'black',
    } as ViewStyle,
    top: {
        height: 50,
    } as ViewStyle,
    content: {
        flex: 1,

    } as ViewStyle,
    carousel: {
        flex: 1,

        marginTop: 60,
        marginBottom: 60,

    } as ScrollViewStyle,
    movie: {
        flex: 1,
        width: SCREEN_WIDTH*0.8,

        borderRadius: 10,
    } as ViewStyle,
    selectedMovie: {
        flex: 1,
        width: SCREEN_WIDTH*0.8,

        borderRadius: 10,
    },
    movieHeader: {
        backgroundColor: 'gray',
        flex: 1,

        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    } as ViewStyle,
    movieContent: {
        flex: 6,
        backgroundColor: 'white',

        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
    } as ViewStyle,
    movieTitle: {

        fontSize: 20,
        alignSelf: 'center',

    } as TextStyle

});

const mapStoreToProps = (store: any) => {
    return {
        movies: store.data.movies as IMovie[]
    };
}

export default connect(mapStoreToProps)(MoviesScene);