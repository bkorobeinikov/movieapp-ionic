import React, {Component} from 'react';

import { Text, View, Navigator } from 'react-native';

import { Container, Header, Body, Title, Content, Button } from 'native-base';
import { Provider } from 'react-redux';

import HomeScene from './scenes/home';
import SplashScene from './scenes/splash';

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
        }, 500);
    }

    renderContent() {
        if (!this.state.initialized)
            return <SplashScene />;
        
        return <HomeScene />
    }
    
    render() {
        return (
            <Navigator 
                initialRoute={{ title: 'Awesome Scene', index: 0 }}
                renderScene={(route, navigator) =>
                   <View>
                        <Provider store={store}>
                            {this.renderContent()}
                        </Provider>
                    </View>
                }
        />);
    }
}