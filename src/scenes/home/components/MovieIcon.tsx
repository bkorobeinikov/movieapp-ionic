
import React, { Component } from 'react';
import { View, Image, Text, StyleSheet, ImageStyle, ViewStyle, TouchableHighlight } from 'react-native';

interface Props {
    style: ViewStyle;
    movie: IMovie;

    onPress: () => void
}

interface State {

}

export default class MovieIcon extends Component<Props, State> {

    render() {
        var { movie, style } = this.props;

        style = StyleSheet.flatten([style, {
            backgroundColor: 'white',
            borderRadius: 4,
            elevation: 2,
        }]);

        return (
            <View style={style}>
                <TouchableHighlight style={{flex:1}} onPress={this.props.onPress}>
                    <Image style={styles.image} source={{uri: movie.poster}}/>
                </TouchableHighlight>

            </View>
        );

    }

}

const styles = StyleSheet.create({
    image: {
        resizeMode: 'cover',
        flex: 1,
        borderRadius: 4,
    } as ImageStyle
});