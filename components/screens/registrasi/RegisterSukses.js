import React, { Component } from "react";
import { 
    View,
    Text,
    StyleSheet
} from "react-native";

class RegisterSukses extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text>RegisterSukses</Text>
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