import React from "react";
import { View, StatusBar, Image, ImageBackground } from "react-native";
import {Text, Button, ButtonGroup } from '@ui-kitten/components';
import styles from "./styles";
// import { connect } from "react-redux";
// import { searchKtp } from "../../../actions/register";
import Modal from "../../Modal";
import { LinearGradient } from 'expo-linear-gradient';
import Constants from 'expo-constants';


const MyStatusBar = () => (
	<View style={{
		height: Constants.statusBarHeight,
	  	backgroundColor: '#f2f5ec'
	}}>
		<StatusBar translucent barStyle="dark-content" />
	</View>
);

class IndexRegister extends React.Component{
	onPebisol = () => {
		this.props.navigation.navigate({
			routeName: 'RegisterPebisol'
		})
	}

	onNonPebisol = () => {
		this.props.navigation.navigate({
			routeName: 'RegistrasiNonPebisol'
		})
	}

	render(){
		// console.log(this.props.detail);
		return(
			<React.Fragment>
				<MyStatusBar />
				<ImageBackground source={require('../../../assets/backgroundGradient.png')} style={styles.backgroundImage}>
					    <View style={{padding: 10, flex: 1}}>
						    <LinearGradient
						    	colors={['#FFF', '#fffefc', '#e6e3df']}
						    	style={{
						    		flex: 1,
						    		margin: 10,
						    		borderRadius: 5,
						    		backgroundColor: '#ededed',
						    		position: 'absolute',
						    		bottom: 0,
						    		width: '100%',
						    		padding: 10
						    	}}
						    >
						    	<View>
							    	<Text style={{
							    		paddingBottom: 10, 
							    		fontSize: 16, 
							    		fontFamily: 'open-sans-bold', 
							    		textAlign: 'center'
							    	}}>Registrasi Sebagai ?</Text>
								</View>
								<Button style={styles.button} status='warning' onPress={this.onPebisol}>PEBISNIS ONLINE</Button>
								<Button style={styles.button} status='warning' onPress={this.onNonPebisol}>NON PEBISNIS ONLINE</Button>
							</LinearGradient>
						</View>
		        </ImageBackground>
	        </React.Fragment>
		);
	}
}

export default IndexRegister;