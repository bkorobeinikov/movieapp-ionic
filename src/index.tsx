import React, {Component} from 'react';

import {
    Text,
    View,
} from 'react-native';

import { Container, Header, Body, Title, Content, Button } from 'native-base';
import { Provider } from 'react-redux';

import { Splash, Home } from './scenes';

import store from './store';

interface Props {

}

interface State {
    initialized: boolean;
}

export default class App extends Component<Props, State> {

    constructor() {
        super();

        this.state = {
            initialized: false
        }
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({
                initialized: true
            });
        }, 2000);
    }

    renderContent() {
        if (!this.state.initialized)
            return <Splash/>;
        
        return <Home/>
    }
    
    render() {
        return (
            <View>
                <Provider store={store}>
                    {this.renderContent()}
                </Provider>
            </View>
        );
    }
}