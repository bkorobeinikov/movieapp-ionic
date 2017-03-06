import React, {Component} from 'react';
import { Text, View, Navigator } from 'react-native';

import { Container, Header, Body, Title, Content, Button } from 'native-base';
import { Provider } from 'react-redux';

import HomeScene from './scenes/home';
import SplashScene from './scenes/splash';

import store from './store';

var routeStack: React.Route[] = [
    { name: 'Splash', component: SplashScene },
    { name: 'Home', component: HomeScene }
];

interface Props {

}

interface State {
    initialRoute: React.Route;
}

export default class App extends Component<Props, State> {

    constructor() {
        super();

        this.state = {
            initialRoute: routeStack[0]
        }
    }
    
    render() {
        return (
            <Navigator 
                initialRoute={this.state.initialRoute}
                renderScene={(route, navigator) =>
                    <Provider store={store}>
                        {React.createElement(route.component, {...route.passProps, route, navigator })}
                    </Provider>
                }
                configureScene={(route, routeStack) => {
                    if ((route.component as any).getSceneConfig)
                        return (route.component as any).getSceneConfig();

                    return Navigator.SceneConfigs.PushFromRight;
                }}
        />);
    }
}