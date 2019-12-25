import React, { Component } from "react";
import { Image,
     Dimensions,
     StatusBar,
     ScrollView, StyleSheet, 
     View,
     KeyboardAvoidingView
} from "react-native";
import { Input, 
        Text, 
        Button, 
        Card, 
        Layout 
} from '@ui-kitten/components';
var deviceWidth = Dimensions.get("window").width;

class CekTarif extends Component {
    render() {
        return (
            
            <Layout style={styles.container}>
                <StatusBar backgroundColor="#f26623" barStyle="light-content"/>
                <KeyboardAvoidingView behavior="padding" enabled>
                <ScrollView>
                <Card style={{flex:1, justifyContent: 'flex-start', alignItems: 'stretch'}}>
                    <View>
                        <View>
                        <Input
                            label='Kode Pos Asal'
                            placeholder='Masukan Kode Pos Asal'
                            returnKeyType= "next"
                            size='small'
                        />
                        </View>
                        <View>
                        <Input
                            label='Kode Pos Tujuan'
                            placeholder='Masukan Kode Pos Tujuan'
                            returnKeyType= "next"
                            size='small'
                        />
                        </View>
                        <View>
                        <Input
                            label='Berat Barang'
                            placeholder='Masukan Berat Barang'
                            returnKeyType= "next"
                            size='small'
                        />
                        </View>
                        <View>
                        <Input
                            label='Nilai Barang (Optional)'
                            placeholder='Masukan Nilai Barang'
                            returnKeyType= "next"
                            size='small'
                        />
                        </View>
                        <View style={{flex :1 , flexDirection: 'row'}}>
                            <View style={{width: deviceWidth/5 + 22, marginRight: 12 }}>
                                <Input
                                    label='Pangjang'
                                    placeholder='Panjang'
                                    returnKeyType= "next"
                                    size='small'
                                />
                            </View>
                            <View style={{width: deviceWidth/5 + 10, marginRight: 12 }}>                                
                                 <Input
                                    label='Lebar'
                                    placeholder='Lebar'
                                    returnKeyType= "next"
                                    size='small'
                                />
                            </View>
                            <View style={{width: deviceWidth/5 + 22, marginRight: 12 }}>
                                <Input
                                    label='Tinggi'
                                    placeholder='Tinggi'
                                    returnKeyType= "next"
                                    size='small'
                                />
                            </View>
                        </View>
                        <Button style={{marginTop: 70, borderRadius: 25, 
                            backgroundColor: '#ff5000', borderColor: 'white'}}>
                                Cari Tarif
                        </Button>
                    </View>
                </Card>
                
                </ScrollView>
                </KeyboardAvoidingView>
            </Layout>
            
        );
    }
}
export default CekTarif;

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});