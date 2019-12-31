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
    Input
  } from '@ui-kitten/components';

class Pembayaran extends Component {
    CardFooter = () => (
        <View style={styles.footerContainer}>
        <Button
          style={styles.footerControl}
          size='small'
          status='basic'>
          ULANG
        </Button>
        <Button
          style={styles.footerControl}
          size='small'
          onPress={() => this.props.navigation.navigate({
            routeName: 'KonfrimPembayaran'
            })}	
          >
          CEK
        </Button>
      </View>
    );

    render() {
        return (
            <Layout style={styles.container}>
                <Card footer={this.CardFooter}>
                    <Text>Nominal</Text>
                    <Input
                        placeholder='Masukan Jumlah Nominal'
                    />
                </Card>
            </Layout>
        );
    }
}
export default Pembayaran;

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
        width: 120
    }
});