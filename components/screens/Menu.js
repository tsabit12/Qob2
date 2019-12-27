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
import { Input, 
    Text, 
    Button, 
    Card, 
    CardHeader, 
    Layout ,
    BottomNavigation,
    BottomNavigationTab,
    Icon} from '@ui-kitten/components';
import { Linking } from "expo";
import { SliderBox } from "react-native-image-slider-box";


var device = Dimensions.get('window').width;
const iconBooking = require("../../assets/order.png");
const iconCekTarif = require("../../assets/cek-tarif.png");
const iconRekening = require("../../assets/rekening.png");
const iconPembayaran = require("../../assets/pembayaran.png");
const iconBarcode = require("../../assets/barcode.png");
const iconRiwayat = require("../../assets/riwayat.png");
const iconProfile = require("../../assets/profile.png");
const iconPhone = require("../../assets/phone.png");


const Menu = ({ navigation }) => (
	<View style={styles.container}>
		<SliderBox images={[
				require('../../assets/qob.jpg'),
				require('../../assets/qob2.jpg'),
				require('../../assets/qob3.jpg')
			]} 
			sliderBoxHeight={200}
			resizeMode={'stretch'}
			circleLoop
			parentWidth={300}
			autoplay={true}
			paginationBoxStyle={{
				alignItems: "center",
				alignSelf: "center",
				justifyContent: "center",
				
			  }}
			/>
		<View style={styles.content}>
			<TouchableHighlight 
            underlayColor="#D8D8D8" 
            onPress={() => navigation.navigate({
                routeName: 'Order'
            })}>
            	<View style={styles.icon}>
            		<Image source={iconBooking} style={styles.img}/>
            		<Text style={styles.textIcon}> QOB </Text>
            	</View>
            </TouchableHighlight>
            <TouchableHighlight underlayColor="#D8D8D8">
            	<View style={styles.icon}>
	        	    <Image source={iconCekTarif} style={styles.img}/>
                    <Text style={{ fontSize: 12, textAlign: 'center'}}>Cek Tarif</Text>
            	</View>
            </TouchableHighlight>
            <TouchableHighlight underlayColor="#D8D8D8">
            	<View style={styles.icon}>
	        	    <Image source={iconRiwayat} style={styles.img}/>
                    <Text style={styles.textIcon}>Riwayat Transaksi</Text>
            	</View>
            </TouchableHighlight>
		</View>
		<View style={styles.content}>
			<TouchableHighlight 
			underlayColor="#D8D8D8"
			onPress={() => navigation.navigate({
                routeName: 'Order'
            })}>
	            <View style={styles.icon}>
	            	<Image source={iconPembayaran} style={styles.img}/>
	                <Text style={styles.textIcon}>Generate Pembayaran</Text>
	            </View>
            </TouchableHighlight>
            <TouchableHighlight underlayColor="#D8D8D8">
	            <View style={styles.icon}>
	            	<Image source={iconProfile} style={styles.img}/>
                    <Text style={styles.textIcon}>Akun</Text>
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
	</View>
);

const styles = StyleSheet.create({
	container: {
		margin: 5,
		flex: 1
	},
	content: {
		flexDirection: 'row',
		marginTop: 15
	},
	icon: {
		width: device*0.3, height: device*0.3,
		justifyContent: 'center', alignItems: 'center'
	},
	textIcon: {
		fontSize: 12, 
		textAlign: 'center',
		fontFamily: 'open-sans-reg'
	},
	img: {
		width: 70, height: 70
	}
})

export default Menu;
