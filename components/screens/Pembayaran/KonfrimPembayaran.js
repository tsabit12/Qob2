import React, { Component } from "react";
import { 
    View,
    StyleSheet
} from "react-native";
import {
    Layout,
    Text,
    Card,
    Button,
    Input,
    CardHeader
  } from '@ui-kitten/components';
  


class KonfrimPembayaran extends Component {

    componentDidMount(){
        console.log(this.props.navigation.state.params);
    }

    render() {
        const { nominal } = this.props.navigation.state.params;
        const { pin, desc } = this.props.navigation.state.params.resGenerate;
        return (
            <Layout style={styles.container}>
                <Card status='success' style={{marginVertical: 8}}>
                    <View style={{padding: 10}}>
                    <Text style={{fontSize: 20, textAlign: 'center', margin: 5, fontWeight: '700'}}>{desc} </Text>
                        <Text style={{fontSize: 16, textAlign: 'center', margin: 5}}>Nominal Transaksi</Text>
                        <Text style={{fontSize: 16, textAlign: 'center', margin: 5}}> {nominal}</Text>
                        <Text style={{fontSize: 16, textAlign: 'center', margin: 5}}>Bea Transaksi</Text>
                        <Text style={{fontSize: 16, textAlign: 'center', margin: 5}}> 0</Text>
                        <Text style={{fontSize: 16, textAlign: 'center', margin: 5}}>Total Transaksi</Text>
                        <Text style={{fontSize: 16, textAlign: 'center', margin: 5}}> {nominal} </Text>
                        <Text style={{fontSize: 16, textAlign: 'center', margin: 5}}>PASSCODE</Text>
                        <Text style={{fontSize: 20, textAlign: 'center', margin: 5, fontWeight: '700'}}>{pin} </Text>
                        <Text style={{fontSize: 14, textAlign: 'center', margin: 5}}> Mohon untuk disimpan dan jangan diberikan kepada siapapun.</Text>
                    </View>
                </Card>
            </Layout>
        );
    }
}
export default KonfrimPembayaran;

const styles = StyleSheet.create({
    container: {
        padding: 10,     
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    footerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    footerControl: {
        marginHorizontal: 4,
        width: 250
    }
});