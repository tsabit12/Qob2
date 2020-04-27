import React from "react";
import { View, Text, StatusBar, StyleSheet, ImageBackground } from "react-native";
import Constants from 'expo-constants';

const MyStatusBar = () => (
	<View style={styles.StatusBar}>
		<StatusBar translucent barStyle="light-content" />
	</View>
);

const HomePage2 = ({ navigation }) => (
	<View style={{flex: 1}}>
		<MyStatusBar />
		<ImageBackground source={require('../../assets/homepage.png')} style={styles.backgroundImage}>
		<View style={{flex: 1, position: 'absolute', bottom: 20, left: 0, right: 0}}>
			<View style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
				<Text style={{fontFamily: 'open-sans-bold', fontSize: 15}}>Belum memilik akun?</Text>
				<Text 
					style={{fontFamily: 'open-sans-bold', fontSize: 15, color: 'blue'}} 
					onPress={() => navigation.navigate({ routeName: 'IndexRegister'})}
				> Daftar disini</Text>
			</View>
			<View style={{flex: 1}}>
				<Text 
					style={{textAlign: 'center', fontFamily: 'open-sans-bold', color: 'blue'}}
					onPress={() => navigation.navigate({ 
						routeName: 'Pemulihan',
						params: {
							title: 'Pemulihan Akun',
							jenis: 2
						}
					})}
				>Pulihkan Akun</Text>
			</View>
		</View>
		</ImageBackground>
	</View>
);

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