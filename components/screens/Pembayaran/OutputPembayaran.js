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
import Constants from 'expo-constants';

class OutputPembayaran extends Component {
    
    CardFooter = () => (
        <View style={styles.footerContainer}>
        <Button
          style={styles.footerControl}
          size='small'
          onPress={() => this.props.navigation.navigate({
            routeName: 'OutputPembayaran'
            })}	
          >
          Halaman Utama
        </Button>
      </View>
    );

    render() {
        return (
            <Layout style={styles.container}>
                <Card footer={this.CardFooter} status='success' style={{marginVertical: 8}}>
                    <View style={{padding: 5}}>
                        <Text style={{fontSize: 13}}>SIMPAN PESAN INI SEBAGAI BUKTI PENARIKAN INFOKAN PESAN INI KEPADA PETUGAS LOKET KANTOR POS TERDEKAT</Text>
                    </View>
                </Card>
            </Layout>
        );
    }
}
export default OutputPembayaran;

const styles = StyleSheet.create({
    container: {
        padding: 10,     
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: Expo.Constants.statusBarHeight
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