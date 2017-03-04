import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

import {
    Spinner
} from 'native-base';

import HomeScene from './../home';

interface Props {
    route: React.Route;
    navigator: React.Navigator;
}

interface State {

}

export default class Splash extends Component<Props, State> {

    componentDidMount() {

        const { navigator } = this.props;

        setTimeout(() => {
            navigator.replace({
                name: 'Home',
                component: HomeScene
            })
        }, 500);

    }
    
    render() {

        console.log('splash is rendered');

        return (
            <View>
                <Spinner size="small" color="#000000" />
            </View>
        );
    }

}