import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

import {
    Spinner
} from 'native-base';

interface Props {

}

interface State {

}

export default class Splash extends Component<Props, State> {
    
    render() {
        return (
            <View>
                <Spinner size="small" color="#000000" />
            </View>
        );
    }

}