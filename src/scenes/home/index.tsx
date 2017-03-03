import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text } from 'react-native';


interface Props {
    movies: IMovie[]
}

interface State {
}

class Home extends Component<Props, State> {

    render() {
        return (
            <View>
                <Text>Home Screen</Text>
                {this.props.movies.map((m) => 
                        <Text>{m.name}</Text>
                )}
            </View>
        );
    }
}

const mapStoreToProps = (store: any) => {
    console.log('mapStoreToProps', store);
    return {
        movies: store.data.movies
    };
};

export default connect(mapStoreToProps)(Home);