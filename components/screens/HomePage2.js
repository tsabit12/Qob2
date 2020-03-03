import React from "react";
import { View, Text, StatusBar, StyleSheet, ImageBackground } from "react-native";
import Constants from 'expo-constants';

const MyStatusBar = () => (
	<View style={styles.StatusBar}>
		<StatusBar translucent barStyle="light-content" />
	</View>
);


class HomePage2 extends React.Component{

	onDaftar = () => {
		this.props.navigation.navigate({
			routeName: 'IndexRegister'
		})
	}

	onHelp = () => {
		this.props.navigation.navigate({
			routeName: 'PemulihanAkun',
			params: {
				titlePemulihan: 'Pemulihan Akun',
				jenis: 2
			}
		})
	}

	render(){
		return(
			<View style={{flex: 1}}>
				<MyStatusBar />
				<ImageBackground source={require('../../assets/homepage.png')} style={styles.backgroundImage}>
				<View style={{flex: 1, position: 'absolute', bottom: 20, left: 0, right: 0}}>
					<View style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
						<Text style={{fontFamily: 'open-sans-bold', fontSize: 15}}>Belum memilik akun?</Text>
						<Text style={{fontFamily: 'open-sans-bold', fontSize: 15, color: 'blue'}} onPress={this.onDaftar}> Daftar disini</Text>
					</View>
					<View style={{flex: 1}}>
						<Text style={{textAlign: 'center', fontFamily: 'open-sans-bold', color: 'blue'}} onPress={this.onHelp}>Pulihkan Akun</Text>
					</View>
				</View>
				</ImageBackground>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	backgroundImage: {
	    flex: 1,
	    justifyContent : 'center'
	},
	StatusBar: {
        height: Constants.statusBarHeight,
        backgroundColor: '#ffcf4f'
    }
})

export default HomePage2;