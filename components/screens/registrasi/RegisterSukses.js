import React, { Component } from "react";
import { 
    View,
    Text,
    StyleSheet
} from "react-native";
import { Button } from '@ui-kitten/components';

class RegisterSukses extends Component {
    // componentDidMount(){
    //     console.log(this.props.navigation.state.params);
    // }

    render() {
        return (
            <View style={styles.container}>
                <Text>Harap rahasiakan PIN anda!</Text>
                <Text>{this.props.navigation.state.params.responseMessage}</Text>
                <Button 
                    onPress={() => this.props.navigation.navigate({
                        routeName: 'Home'
                    })}
                    status='info'
                >Silahkan Login</Button>
            </View>
        );
    }
}
export default RegisterSukses;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});