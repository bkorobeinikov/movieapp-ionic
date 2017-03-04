
import React, { Component } from 'react';
import { View, Image, Text, StyleSheet, ImageStyle, ViewStyle } from 'react-native';

interface Props {
    style: ViewStyle,
    movie: IMovie
}

interface State {

}

export default class MovieItem extends Component<Props, State> {

    height: number = 0;

    onLayout(e: any) {
        this.height = e.nativeEvent.layout.width * 1.5;
        this.forceUpdate();
    }

    render() {
        var { movie, style } = this.props;

        style = StyleSheet.flatten([style, {
            height: this.height
        }]);

        return (
            <View style={style} onLayout={e => this.onLayout(e)}>
                <Image style={styles.image} source={{uri: movie.poster}}/>
            </View>
        );

    }

}

const styles = StyleSheet.create({
    image: {
        resizeMode: 'cover',
        flex: 1,
        borderRadius: 5,

    } as ImageStyle
});