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

    CardFooter = () => (
        <View style={styles.footerContainer}>
        <Button
          style={styles.footerControl}
          size='small'
          onPress={() => this.props.navigation.navigate({
            routeName: 'OutputPembayaran'
            })}	
          >
          SETUJU
        </Button>
      </View>
    );

    render() {
        return (
            <Layout style={styles.container}>
                <Card footer={this.CardFooter} status='success' style={{marginVertical: 8}}>
                    <View style={{padding: 5}}>
                        <Text style={{fontSize: 13}}>Nominal :Rp. -</Text>
                    </View>
                    <View style={{padding: 5}}>
                        <Text style={{fontSize: 13}}>Bea Transaksi : Rp. -</Text>
                    </View>
                    <View style={{padding: 5}}>
                        <Text style={{fontSize: 13}}>Total : Rp. -</Text>
                    </View>
                    <Input
                        placeholder='Masukkan Passcode Anda'
                        style={{marginTop: 20}}
                    />
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