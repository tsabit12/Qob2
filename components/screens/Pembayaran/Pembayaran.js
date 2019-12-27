import React, { Component } from "react";
import { 
    View,
    Text,
    StyleSheet
} from "react-native";

class Pembayaran extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text>Oke</Text>
            </View>
        );
    }
}
export default Pembayaran;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});