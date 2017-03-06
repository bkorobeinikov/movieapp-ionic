import React, { Component } from 'react';
import { View, Text, PanResponder, Navigator } from 'react-native';
import { connect } from 'react-redux';

var Dimensions = require('Dimensions');
var SCREEN_WIDTH = Dimensions.get('window').width;
var SCREEN_HEIGHT = Dimensions.get('window').height;

interface Props {
    route: React.Route;
    navigator: React.Navigator;

    movies: IMovie[];
    movieId: string;
}

interface State {

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

    componentWillMount() {
    }

    componentDidMount() {
        setTimeout(() => {
            MoviesScene.sceneConfig.gestures.pop.edgeHitWidth = 150;
        }, 4000);
    }

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