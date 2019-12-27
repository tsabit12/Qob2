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
  import Dialog from "react-native-dialog";

class Pembayaran extends Component {
    state = {
        dialogVisible: false
    };
    
    showDialog = () => {
        this.setState({ dialogVisible: true });
    };

    CardFooter = () => {
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
          onPress={this.showDialog}>
          CEK
        </Button>
      </View>
    };
    

    render() {
        return (
            <Layout style={styles.container}>
                <Card footer={this.CardFooter}>
                    <Text>Nominal</Text>
                    <Input
                        placeholder='Masukan Jumlah Nominal'
                    />
                </Card>

                <Dialog.Container visible={this.state.dialogVisible}>
                    <Dialog.Title>Account delete</Dialog.Title>
                        <Dialog.Description>
                            Do you want to delete this account? You cannot undo this action.
                        </Dialog.Description>
                        <Dialog.Button label="Cancel" />
                        <Dialog.Button label="Delete"/>
                </Dialog.Container>
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