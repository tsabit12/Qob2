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
		<View style={styles.label}>
			<Text style={{textAlign: 'center'}}>
				<Text style={styles.text}>Belum memiliki akun?</Text>
				<Text 
					style={[styles.text,{color: 'blue'}]} 
					onPress={() => navigation.navigate({ routeName: 'IndexRegister'})}
				> Daftar disini</Text>
				<Text style={styles.text}>{'\n'}Sudah registrasi di web qposin?</Text>
				<Text 
					style={[styles.text, {color: 'blue'}]}
					onPress={() => navigation.navigate({ 
						routeName: 'Aktivasi'
					})}
				> Aktifasi disini</Text>
				<Text style={styles.text}>{'\n'}Atau pulihkan akun</Text>
				<Text 
					style={[styles.text, {color: 'blue'}]}
					onPress={() => navigation.navigate({ 
						routeName: 'Pemulihan',
						params: {
							title: 'Pemulihan Akun',
							jenis: 2
						}
					})}
				> disini</Text>
			</Text>
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
    },
    text: {
    	fontFamily: 'open-sans-bold', 
    	fontSize: 13
    },
    label: {
    	flex: 1, 
    	position: 'absolute', 
    	bottom: 10, 
    	left: 10, 
    	right: 10, 
    	backgroundColor: 'white',
    	borderRadius: 5,
    	padding: 5,
    	elevation: 5
    }
})

export default HomePage2;