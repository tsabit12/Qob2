import React from "react";
import Constants from 'expo-constants';
import { StyleSheet,
    TouchableHighlight,
    TouchableOpacity,
    StatusBar, 
    Image, 
    FlatList, 
    Dimensions,
    View } from "react-native";
import { Text, Icon } from '@ui-kitten/components';
import { Linking } from "expo";
import { connect } from "react-redux";
import { getCurdateWithStrip } from "../utils/helper";
import { getOrder } from "../../actions/order";

var device = Dimensions.get('window').width;
const iconBooking = require("../../assets/calendar.png");
const iconCekTarif = require("../../assets/truck.png");
const iconRekening = require("../../assets/rekening.png");
const iconPembayaran = require("../../assets/banking.png");
const iconBarcode = require("../../assets/barcode.png");
const iconRiwayat = require("../../assets/history.png");
const iconProfile = require("../../assets/profile.png");
const iconPhone = require("../../assets/phone2.png");
const cartIcon = require("../../assets/cart.png");


const Menu = ({ navigation, dataLogin, getOrder }) => (
	<View style={styles.container}>
        <View style={styles.content}>
            <TouchableHighlight 
            underlayColor="#D8D8D8"
            onPress={() => navigation.navigate({
                routeName: 'Order'
            })}>
                <View style={styles.icon}>
                    <Image source={iconBooking} style={styles.img}/>
                    <Text style={styles.textIcon}>QOB</Text>
                </View>
            </TouchableHighlight>
            <TouchableHighlight 
                underlayColor="#D8D8D8"
                onPress={() => navigation.navigate({
                    routeName: 'CekTarif'
                })}
            >
                <View style={styles.icon}>
                    <Image source={iconCekTarif} style={styles.img}/>
                    <Text style={styles.textIcon}>Cek Tarif</Text>
                </View>
            </TouchableHighlight>
            <TouchableHighlight 
                underlayColor="#D8D8D8"
                onPress={() => Linking.openURL('tel:' + '161')}
            >
                <View style={styles.icon}>
                    <Image source={iconPhone} style={styles.img}/>
                    <Text style={styles.textIcon}>Halo Pos</Text>
                </View>
            </TouchableHighlight>
        </View>
		<View style={styles.content}>
			<TouchableHighlight 
			underlayColor="#D8D8D8"
			onPress={() => navigation.navigate({
                routeName: 'Pembayaran'
            })}>
	            <View style={styles.icon}>
	            	<Image source={iconPembayaran} style={styles.img}/>
	                <Text style={styles.textIcon}>Generate Pembayaran</Text>
	            </View>
            </TouchableHighlight>
            <TouchableHighlight 
            	underlayColor="#D8D8D8"
            	onPress={() => navigation.navigate({
	                routeName: 'History'
	            })}
            >
            	<View style={styles.icon}>
	        	    <Image source={iconRiwayat} style={styles.img}/>
                    <Text style={styles.textIcon}>Riwayat Transaksi</Text>
            	</View>
            </TouchableHighlight>

             <TouchableHighlight 
                underlayColor="#D8D8D8"
                onPress={() => {
                    const curdate = getCurdateWithStrip();
                    const { userid, norek } = dataLogin;
                    const payload = {
                        sp_nama  : `Ipos_getPostingPebisol`,
                        par_data : `${userid}|${curdate}|${curdate}`
                    };
                    //get data order on this button
                    //with curdate
                    getOrder(payload, curdate).catch(err => console.log("kosong"));
                    
                    navigation.navigate({
                        routeName: 'ListOrder',
                        params: {
                            tanggalSearch: curdate
                        }
                    })
                }}
            >
                <View style={styles.icon}>
                    <Image source={cartIcon} style={styles.img}/>
                    <Text style={styles.textIcon}>List {'\n'}Order</Text>
                </View>
            </TouchableHighlight>
        </View>
	</View>
);

const styles = StyleSheet.create({
	container: {
		margin: 5,
		flex: 1
	},
	content: {
		flexDirection: 'row',
		margin: 10,
		alignItems: 'center'
	},
	icon: {
		width: device*0.3, 
        height: device*0.3,
		justifyContent: 'center', 
        alignItems: 'center'
	},
	textIcon: {
		fontSize: 14, 
		textAlign: 'center',
		fontFamily: 'Roboto-Regular'
	},
	img: {
		width: 75, height: 75
	}
})

function mapStateToProps(state) {
    return{
        dataLogin: state.auth.dataLogin
    }
}

export default connect(mapStateToProps, { getOrder })(Menu);
