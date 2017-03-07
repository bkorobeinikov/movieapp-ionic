import React, { Component } from 'react';
import { View, Image, Text, StyleSheet, ImageStyle, ViewStyle, TouchableHighlight, TextStyle } from 'react-native';

import { Button } from 'native-base';

import moment from 'moment';
import _ from 'lodash';

var Dimensions = require('Dimensions');
var SCREEN_WIDTH = Dimensions.get('window').width;
var SCREEN_HEIGHT = Dimensions.get('window').height;

interface Props {
    style: ViewStyle;
    movie: IMovie;

    onPress: () => void
}

interface State {

}

export default class MovieItem extends Component<Props, State> {

    renderGenres(genres: string[], movie: IMovie) {

        var d = moment.duration(movie.duration, "minutes");

        if (genres == null || genres.length == 0)
            return null;

        return (
            <View style={styles.genres.view}>
                {genres.map((g, i) => 
                    <Text style={styles.genres.genre}>
                        {g}
                        { " |"}
                    </Text>
                )}
                <Text style={styles.genres.duration}>{d.hours()}h {d.minutes()}min</Text>
            </View>
        );
    }

    renderServices(services: IMovieService[]) {
        if (services == null || services.length == 0)
            return null;

        return (
            <View style={styles.services.view}>
                {services.map(s => {
                    switch (s.type) {
                        case 'imdb':
                            return (<Text style={styles.services.imdb}>
                                <Text style={styles.services.imdbLogo}>IMDB </Text>
                                {s.rating}
                            </Text>)
                        default:
                            break;
                    }
                }
                )}
            </View>
        );
    }

    renderScreening(screening: IMovieScreening[]) {
        if (screening == null || screening.length == 0)
            return null;

        var now = moment();
        var times = _.chain(screening).map(s => {
            var time = moment(s.time);
            return {
                time: time.format("HH:mm"),
                active: time.isSame(now, 'day') && time.isAfter(now)
            }
        })
            .uniqBy(t => t.time).value();

        return (
            <View style={styles.screening.view}>
                {times.map(t =>
                    <Text style={t.active ? styles.screening.time : styles.screening.timeInactive}>{t.time}</Text>
                )}
            </View>
        );
    }

    render() {
        var { movie, style } = this.props;

        return (
            <View style={style}>
                <TouchableHighlight style={{ flex: 1 }} onPress={this.props.onPress}>
                    <View style={styles.main.view}>
                        <View style={styles.main.icon}>
                            <Image style={styles.main.image} source={{ uri: movie.poster }} />
                        </View>
                        <View style={styles.main.content}>
                            <Text style={styles.main.title}>{movie.name}</Text>
                            {this.renderGenres(movie.genres, movie)}
                            {this.renderServices(movie.services)}
                            {this.renderScreening(movie.screening)}
                        </View>
                    </View>
                </TouchableHighlight>
            </View>
        );

    }

}

var mainContentPaddingHorizontal = 20;
const styles = {
    main: StyleSheet.create({
        view: {
            flexDirection: 'row',
        } as ViewStyle,
        icon: {
            width: Math.round((SCREEN_WIDTH - (mainContentPaddingHorizontal * 2) - mainContentPaddingHorizontal * 2) / 2.5),
            height: Math.round((SCREEN_WIDTH - (mainContentPaddingHorizontal * 2) - mainContentPaddingHorizontal * 2) / 2.5) * 1.5,

            backgroundColor: 'white',
            borderRadius: 4,

            elevation: 10,
        } as ViewStyle,
        content: {
            marginVertical: 4,
            paddingVertical: 5,
            flex: 1,
            paddingLeft: mainContentPaddingHorizontal / 2,
            flexDirection: 'column',

            backgroundColor: 'white',
        } as ViewStyle,
        image: {
            resizeMode: 'cover',
            flex: 1,
            borderRadius: 4,
        } as ImageStyle,
        title: {
            color: 'black',
            fontSize: 20,
            fontWeight: 'bold',
            fontFamily: 'Open Sans',
        } as TextStyle,
    }),
    services: StyleSheet.create({
        view: {
            marginTop: 10,
            flexDirection: 'row',
        } as ViewStyle,
        imdb: {
            marginRight: 5,
            paddingVertical: 2,
            paddingHorizontal: 4,
            backgroundColor: '#FFB10A',
            borderRadius: 4,

            color: 'white',

            fontSize: 10,
            fontWeight: 'bold',
            fontFamily: 'Helvetica',
        } as TextStyle,
        imdbLogo: {
            color: 'black',
        } as TextStyle,
    }),
    screening: StyleSheet.create({
        view: {
            marginTop: 15,
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignItems: 'flex-start'
        } as ViewStyle,
        time: {
            marginRight: 4,
            marginBottom: 4,

            backgroundColor: '#43B8A3',
            color: 'white',
            paddingVertical: 2,
            paddingHorizontal: 4,
            borderRadius: 4,

            fontWeight: 'bold',
            fontFamily: 'Open Sans',
        } as TextStyle,

        timeInactive: {
            marginRight: 4,
            marginBottom: 4,

            backgroundColor: '#F3F3F3',
            color: '#B0B0B0',
            paddingVertical: 2,
            paddingHorizontal: 4,
            borderRadius: 4,

            fontWeight: 'bold',
            fontFamily: 'Open Sans',
        } as TextStyle,
    }),
    genres: StyleSheet.create({
        view: {
            marginTop: 2,
            flexDirection: 'row'
        } as ViewStyle,
        duration: {
            color: 'black',
            fontWeight: 'normal',
            fontSize: 12
        } as TextStyle,
        genre: {
            marginRight: 4,

            color: '#B9B9B9',
            fontSize: 12,
        } as TextStyle,
    }),
};