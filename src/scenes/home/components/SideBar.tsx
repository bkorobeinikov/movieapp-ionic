
import React, { Component } from 'react';
import { View, Text } from 'react-native';

import { connect } from 'react-redux';

interface Props {
    navigator: any;
}

interface State {

}

export default class SideBar extends Component<Props, State> {

    render() {
        return (
            <View>
                <Text>Hello world</Text>
            </View>
        );
    }
}

//export default connect()(SideBar);