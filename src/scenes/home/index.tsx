import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text, StyleSheet, ViewStyle, ScrollView, TouchableHighlight, Navigator, TextStyle, ScrollViewStyle } from 'react-native';
import { Drawer, Button } from 'native-base';

import MovieIcon from './components/MovieIcon';
import MovieDetails from './components/MovieDetails';

import SideBar from './components/SideBar';
import MoviesScene from './../movies';

var Dimensions = require('Dimensions');
var SCREEN_WIDTH = Dimensions.get('window').width;
var SCREEN_HEIGHT = Dimensions.get('window').height;

interface Props {
    route: React.Route;
    navigator: React.Navigator;

    movies: IMovie[]
}

interface State {
}

class Home extends Component<Props, State> {

    currentMovieItemWidth: number = 0;
    futureMovieItemWidth: number = 0;

    _drawer: Drawer;

    constructor() {
        super();

        this.initialize()
    }

    private initialize() {
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

    closeDrawer() {
        (this._drawer as any)._root.close()
    }

    openDrawer() {
        (this._drawer as any)._root.open();
    }

    renderCurrent(movies: IMovie[]) {
        return (
            <View style={styles.current.view}>
                <Text style={styles.current.currSectionText}>Showing today</Text>
                <View style={styles.current.list}>

                    {movies.map((m) =>
                        <MovieDetails key={m.id}
                            style={styles.current.listItem}
                            movie={m}
                            onPress={() => this.onMovie(m.id)} />
                    )}

                </View>
            </View>
        );
    }

    renderFuture(movies: IMovie[]) {
        return (
            <View style={styles.future.view}>
                <Text style={styles.future.futureSectionText}>Future movies</Text>
                <View style={styles.future.list}>

                    {movies.map((m) =>
                        <MovieIcon key={m.id}
                            style={styles.future.listItem}
                            movie={m}
                            onPress={() => this.onMovie(m.id)} />
                    )}

                    {/* make it look pretty */}
                    {(movies.length % 3 == 1) &&
                        <View style={styles.future.listItem}></View> &&
                        <View style={styles.future.listItem}></View>
                    }
                    {(movies.length % 3 == 2) &&
                        <View style={styles.future.listItem}></View>
                    }
                </View>
            </View>
        );
    }

    renderMain() {
        const { movies } = this.props;

        var currentMovies = movies.filter(m => m.screening != null);
        var futureMovies = movies.filter(m => m.screening == null);

        return (
            <View style={styles.main.view}>
                <ScrollView style={styles.main.content}>
                    {this.renderCurrent(currentMovies)}
                    {this.renderFuture(futureMovies)}
                </ScrollView>
            </View>
        );
    }

    render() {
        return this.renderMain();
    }
}

const mainContentPaddingHorizontal = 20;
const styles = {
    main: StyleSheet.create({
        view: {
            flex: 1,
        } as ViewStyle,

        content: {
            flex: 1,
            paddingHorizontal: mainContentPaddingHorizontal,

            backgroundColor: '#EDF1F2',
        } as ScrollViewStyle
    }),
    current: StyleSheet.create({
        view: {
            marginTop: 10,
            marginBottom: 10,
        } as ViewStyle,
        currSectionText: {
            fontWeight: 'bold',
        } as TextStyle,

        list: {
            flexDirection: 'column',
            alignItems: 'flex-start',
        } as ViewStyle,

        listItem: {
            alignSelf: 'stretch',
            marginTop: 10,
        } as ViewStyle,
    }),
    future: StyleSheet.create({
        view: {
            marginVertical: 10,
        } as ViewStyle,
        futureSectionText: {
            fontWeight: 'normal',
            fontStyle: "italic",
        } as TextStyle,

        list: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            flexWrap: 'wrap'
        } as ViewStyle,

        listItem: {
            marginVertical: 10,
            width: Math.round((SCREEN_WIDTH - (mainContentPaddingHorizontal * 2) - mainContentPaddingHorizontal*2) / 3),
            height: Math.round((SCREEN_WIDTH - (mainContentPaddingHorizontal * 2) - mainContentPaddingHorizontal*2) / 3) * 1.5
        } as ViewStyle,
    }),
};

const mapStoreToProps = (store: any) => {
    return {
        movies: store.data.movies
    };
};

export default connect(mapStoreToProps)(Home);