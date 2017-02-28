import React, {Component} from 'react';

import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

interface Props {

}

interface State {

}

export default class App extends Component<Props, State> {
    render() {
        return (
            <View>
                <Text>
                    Hello World!
                </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF'
    },
    text: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10
    }
})