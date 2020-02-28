import React from "react";
import {View, Text, StatusBar } from "react-native";
import styles from "./styles";
import { Icon, TopNavigation, TopNavigationAction } from '@ui-kitten/components';
import { WebView } from "react-native-webview";

const html = `
      <html>
      <head>
      	<meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0">
      </head>
      <body>
        <p style='text-align: justify; font-size: 12;'>
        	QPOSin AJA merupakan aplikasi resmi PT Pos Indonesia (Persero) yang dapat digunakan oleh seluruh masyarakat Indonesia untuk melakukan pemesanan 
			pengiriman surat atau paket yang akan dijemput oleh petugas pickup atau menyerahkan kirimannya ke loket kantor pos terdekat.
			Pada aplikasi ini pelanggan dapat melakukan sendiri entri data pengirimannya dan melakukan permintaan penjemputan kiriman dilokasi pengiriman/pelanggan. 
        </p>
        <h5>Langkah-langkah Penggunaan QPOSin AJA:</h5>
        <p style='font-size: 11; margin-top: -10px;'>1. Unduh aplikasi QPOSin AJA di playstore.</p>
        <p style='font-size: 11; margin-top: -10px;'>2. Install dan isi data registrasi.</p>
        <p style='font-size: 11; margin-top: -10px;'>3. Entry data kiriman.</p>
        <p style='font-size: 11; margin-top: -10px;'>4. Permintaan penjemputan kiriman.</p>
        
    	<h5>Temukan informasi lebih banyak tentang QPOSin AJA di:</h5>
    	<p style='text-align: justify; font-size: 11; margin-top: -10px;'>
    		Website: <span style='color: blue;'>https://www.posindonesia.co.id/</span>
    	</p>
    	<p style='text-align: justify; font-size: 11; margin-top: -10px;'>
    		Email: <span style='color: blue;'>halopos@posindonesia.co.id</span>
    	</p>
    	<p style='text-align: justify; font-size: 11; margin-top: -10px;'>Halopos: 161</p>
    	<p style='text-align: justify; font-size: 11; margin-top: -10px;'>Livechat VIDAPOS:</p>
    	<p style='text-align: justify; font-size: 11; margin-top: -10px;'>
    		Telegram: <span style='color: blue;'>@posindonesia_officialbot</span>
    	</p>
    	<p style='text-align: justify; font-size: 11; margin-top: -10px;'>
    		Line: <span style='color: blue;'>@posindonesia_officialbot</span>
    	</p>
    	<p style='text-align: justify; font-size: 11; margin-top: -10px;'>
    		Webchat: <span style='color: blue;'>www.posindonesia.co.id</span>
    	</p>
      </body>
      </html>`;

const MyStatusBar = () => (
	<View style={styles.StatusBar}>
		<StatusBar translucent barStyle="dark-content" />
	</View>
);

const BackIcon = (style) => (
  <Icon {...style} name='arrow-back' fill='black'/>
);


class AboutScreen extends React.Component{
	state = {}

	BackAction = () => (
  		<TopNavigationAction icon={BackIcon} onPress={() => this.props.navigation.goBack()}/>
	);

	render(){
		return(
			<View style={{flex: 1}}>
				<MyStatusBar />
				<TopNavigation
				    leftControl={this.BackAction()}
				    title='Tentang'
				    alignment='start'
				    titleStyle={{fontFamily: 'open-sans-bold', color: 'black'}}
				    style={{backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#e6e6e6'}}
				/>
				<WebView
					style={{flex: 1, padding: 10}}
			        source={{ html }}
			    />
			</View>
		);
	}
}

export default AboutScreen;