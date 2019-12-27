import React, { Component } from "react";
<<<<<<< HEAD
import Constants from 'expo-constants';
=======
>>>>>>> da30ccbe8c172e1a82e7f0540f4486a549525b5e
import { StyleSheet,
    TouchableHighlight,
    TouchableOpacity,
    StatusBar, 
    Image, 
    FlatList, 
    Dimensions,
    View } from "react-native";
import { Input, 
    Text, 
    Button, 
    Card, 
    CardHeader, 
    Layout ,
    BottomNavigation,
    BottomNavigationTab,
    Icon} from '@ui-kitten/components';
<<<<<<< HEAD
import { SliderBox } from  "react-native-image-slider-box";
import { Linking } from "expo";



=======
import { Linking } from "expo";


>>>>>>> da30ccbe8c172e1a82e7f0540f4486a549525b5e
var device = Dimensions.get('window').width;

{/*Icon Image */}
const iconBooking = require("../../assets/order.png");
const iconCekTarif = require("../../assets/cek-tarif.png");
const iconRekening = require("../../assets/rekening.png");
const iconPembayaran = require("../../assets/pembayaran.png");
const iconBarcode = require("../../assets/barcode.png");
const iconRiwayat = require("../../assets/riwayat.png");
const iconProfile = require("../../assets/profile.png");
const iconPhone = require("../../assets/phone.png");



class Dashboard extends Component {
<<<<<<< HEAD
    constructor(props){
        super(props);
    
    state = {
        position : 1,
        interval : null,
        haloPos: '161',
        images: [
            "https://source.unsplash.com/1024x768/?nature",
            "https://source.unsplash.com/1024x768/?water",
            "https://source.unsplash.com/1024x768/?girl",
            "https://source.unsplash.com/1024x768/?tree", // Network image
          ]
        };
=======
    state = {
        haloPos: '161'
>>>>>>> da30ccbe8c172e1a82e7f0540f4486a549525b5e
    }

    static navigationOptions = {
		headerMode: 'none',
		header: null
    };
    
    render() {
        return (
<<<<<<< HEAD
            <Layout style={styles.container}>
                <SliderBox images={this.state.images} />
            <View style={{paddingTop: 2, backgroundColor: "#FF5000"}}>
                <Text>Lacak kiriman</Text>
                <View style={{ flex: -1, flexDirection: 'row' }}>
                    <View style={{ width: device/1.5}}>
                    <Input style={{fontSize:10, height: 5}}
                        placeholder='Masukan Nomor Resi'/>
=======
            <Layout style={{ padding: 1}}>
                <StatusBar 
                    backgroundColor={'transparent'}
                    translucent
                    />
            <Card style={{paddingTop: 2, backgroundColor: "#FF5000"}}>
                <View style={{flex: -1, justifyContent: 'center', alignItems: 'center' }}>
                    <CardHeader title='Lacak Kirim' style={{backgroundColor: "#FF5000"}}/>
                </View>
                <View style={{ flex: -1, flexDirection: 'row' }}>
                    <View style={{ width: device/1.3}}>
                    <Input style={{fontSize:10, height: 5}}
                        placeholder='Masukan Nomor Resi'/>
                        
>>>>>>> da30ccbe8c172e1a82e7f0540f4486a549525b5e
                    </View>
                <View style={{width: device/4 }}>
                    <TouchableOpacity style={{paddingVertical:5, paddingLeft: 2 }}>
                    <Image source={iconBarcode} style={{width: 30, height: 30}} />
                    </TouchableOpacity>
                </View>
                </View>
<<<<<<< HEAD
            </View>

            {/*MENU*/}
            <Card style={{paddingTop: 20}}>
            
                <Text>
                The Maldives, officially the Republic of Maldives, is a small country in South Asia,
                located in the Arabian Sea of the Indian Ocean.
                It lies southwest of Sri Lanka and India, about 1,000 kilometres (620 mi) from the Asian continent
                </Text>
            
=======
            </Card>
            {/*MENU*/}
            <Card style={{paddingTop: 20}}>
>>>>>>> da30ccbe8c172e1a82e7f0540f4486a549525b5e
            <View style={{justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', 
                            backgroundColor: "E6E6E6"}}>
                    <View>
<<<<<<< HEAD
                        <TouchableHighlight 
                            underlayColor="#D8D8D8" 
                            onPress={() => this.props.navigation.navigate({
                                routeName: 'Order'
                            })}>
                        <View style={{width: device*0.3, height: device*0.3, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF'}} >
                            <Image source={iconBooking} style={{width: 50, height: 50 }}/>
                            <Text style={{ fontSize: 12, textAlign: 'center'}}> QOBDFDSDF</Text>
=======
                        <TouchableHighlight underlayColor="#D8D8D8">
                        <View style={{width: device*0.3, height: device*0.3, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF'}} >
                            <Image source={iconBooking} style={{width: 50, height: 50 }}/>
                            <Text style={{ fontSize: 12, textAlign: 'center'}}> QOB </Text>
>>>>>>> da30ccbe8c172e1a82e7f0540f4486a549525b5e
                        </View>
                        </TouchableHighlight>
                        <TouchableHighlight underlayColor="#D8D8D8">
                        <View style={{width: device*0.3, height: device*0.3, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF'}} >
                        <Image source={iconPembayaran} style={{width: 50, height: 50 }}/>
                            <Text style={{ fontSize: 12, textAlign: 'center'}}> Generate Pembayaran </Text>
                        </View>
                        </TouchableHighlight>
                    </View>
                    <View>
<<<<<<< HEAD
                        <TouchableHighlight underlayColor="#D8D8D8">
=======
                        <TouchableHighlight underlayColor="#D8D8D8"  
                            onPress={() => this.props.navigation.navigate({
                            routeName: 'CekTarif'
                        })}>
>>>>>>> da30ccbe8c172e1a82e7f0540f4486a549525b5e
                        <View style={{width: device*0.3, height: device*0.3, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF'}} >
                            <Image source={iconCekTarif} style={{width: 50, height: 50 }}/>
                            <Text style={{ fontSize: 12, textAlign: 'center'}}>Cek Tarif</Text>
                        </View>
                        </TouchableHighlight>
                        <TouchableHighlight underlayColor="#D8D8D8">
                        <View style={{width: device*0.3, height: device*0.3, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF'}} >
                            <Image source={iconRiwayat} style={{width: 50, height: 50 }}/>
                            <Text style={{ fontSize: 12, textAlign: 'center'}}>Riwayat Transaksi</Text>
                        </View>
                        </TouchableHighlight>
                    </View>
                    <View>
                        <TouchableHighlight underlayColor="#D8D8D8" 
                        onPress={() => this.props.navigation.navigate({
                            routeName: 'IndexSearch'
                        })}>
                        <View style={{width: device*0.3, height: device*0.3, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF'}} >
                            <Image source={iconRekening} style={{width: 50, height: 50 }}/>
                            <Text style={{ fontSize: 12, textAlign: 'center'}}> Rekening Koran</Text>
                        </View>
                        </TouchableHighlight>
                        <TouchableHighlight underlayColor="#D8D8D8">
                        <View style={{width: device*0.3, height: device*0.3, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF'}} >
                            <Image source={iconProfile} style={{width: 50, height: 50 }}/>
                            <Text style={{ fontSize: 12, textAlign: 'center'}}>Profil Saya</Text>
                        </View>
                        </TouchableHighlight>
                    </View>
<<<<<<< HEAD
=======

>>>>>>> da30ccbe8c172e1a82e7f0540f4486a549525b5e
                </View>
            </View>
            </Card>
            {/*addtional menus */}
            <Card>
            <View style={{justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', 
                            backgroundColor: "E6E6E6"}}>
                    <View>
                        <TouchableHighlight underlayColor="#D8D8D8" onPress={() => Linking.openURL('tel:' + this.state.haloPos)}>
                        <View style={{width: device*0.3, height: device*0.3, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF'}} >
                            <Image source={iconPhone} style={{width: 50, height: 50 }}/>
                            <Text style={{ fontSize: 12, textAlign: 'center'}}> Halo Pos </Text>
                        </View>
                        </TouchableHighlight>
                    </View>
                </View>
            </View>
            </Card>
            </Layout>
        );
    }
}
<<<<<<< HEAD

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: Expo.Constants.statusBarHeight
    }
});

export default Dashboard;
=======
export default Dashboard;

>>>>>>> da30ccbe8c172e1a82e7f0540f4486a549525b5e
