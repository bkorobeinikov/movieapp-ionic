/// <reference path="./../node_modules/native-base/index.d.ts"/>

import React, {Component} from 'react';

import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { Container, Header, Body, Title, Content, Button } from 'native-base';

interface Props {

}

interface State {

}

export default class App extends Component<Props, State> {

    clickMe() {
        //alert("You clicked the button! its alive!");

        var a = 5;
        a += 10;

        alert('You clicked ' + a);
    }

    render() {
        return (
            <Container>
                <Header>
                    <Body>
                        <Title>Title</Title>
                    </Body>
                </Header>
                <Content>
                    <Button success block onPress={this.clickMe}>
                        <Text>Click Me Again!</Text>
                    </Button>
                </Content>
            </Container>
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
    } as React.TextStyle
})