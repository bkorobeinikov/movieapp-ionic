
import React, { Component } from 'react';
import { View, Image, Text, StyleSheet, ImageStyle, ViewStyle, TouchableHighlight } from 'react-native';

interface Props {
    style: ViewStyle;
    movie: IMovie;

    onPress: () => void
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
            <View style={style}
                onLayout={e => this.onLayout(e)}>
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
        borderRadius: 5,

    } as ImageStyle
});