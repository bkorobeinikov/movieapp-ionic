import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text, StyleSheet, ViewStyle, ScrollView, Dimensions, TouchableHighlight, Navigator, TextStyle } from 'react-native';
import { Drawer, Button } from 'native-base';

import MovieItem from './components/MovieItem';

import SideBar from './components/SideBar';
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

    _drawer: Drawer;
    
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

    openDrawer() {
        (this._drawer as any)._root.open();
    }

    renderMain() {
        const { movies } = this.props;

        var currentMovies = movies.filter(m => m.inCinema);
        var futureMovies = movies.filter(m => !m.inCinema);

        return (
            <View style={styles.view}>
                <ScrollView>
                    <View style={styles.currSection}>
                        <Text style={styles.currSectionText}>Showing today</Text>
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
                    </View>
                    <View style={styles.futureSection}>
                        <Text style={styles.futureSectionText}>Future movies</Text>
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
                    </View>
                </ScrollView>
                <View style={styles.header}>
                    <Button onPress={() => this.openDrawer()}>
                        <Text>open drawer</Text>
                    </Button>
                </View>
            </View>
        );
    }

    render() {
        var closeDrawer = () => {
            (this._drawer as any)._root.close()
        };
            return (
                <Drawer
                ref={(ref) => { this._drawer = ref; }}
                content={<SideBar navigator={this.props.navigator} />}
                onClose={() => closeDrawer()}


                type="displace"
                openDrawerOffset={80}
                >
                {this.renderMain()}
            </Drawer>
            );
        
    }
}


const styles = StyleSheet.create({
    view: {
        flex: 1,
    } as ViewStyle,
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 30,
        backgroundColor: 'rgba(255,255,255,0.7)',
    } as ViewStyle,

    currSection: {
        marginTop: 30,
        marginHorizontal: 10,
    } as ViewStyle,
    currSectionText: {
        fontWeight: 'bold',
        marginTop: 10,
        marginLeft: 10,
    } as TextStyle,

    futureSection: {
        marginTop: 10,
        marginHorizontal: 10,
    } as ViewStyle,
    futureSectionText: {
        fontWeight: 'normal',
        marginLeft: 10,
        fontStyle: "italic",
    } as TextStyle,

    currentMovies: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
    } as ViewStyle,

    futureMovies: {
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