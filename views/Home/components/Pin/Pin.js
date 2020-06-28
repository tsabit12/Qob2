import React from "react";
import { StyleSheet, View, ImageBackground, Text } from "react-native";
import PinView from 'react-native-pin-view';
import PropTypes from "prop-types";

const styles = StyleSheet.create({
	backgroundImage: {
	    flex: 1,
	    width: null,
    	height: null,
	    justifyContent : 'center',
	}
})

const Pin = props => {
	return(
		<ImageBackground source={require('../../../../assets/HomeScreen.png')} style={styles.backgroundImage}>
			<PinView
	            onComplete={(val, clear) => props.onLogin(val, clear) }
	            pinLength={6}
	            buttonActiveOpacity={0.4}
	        />
	        <Text 
				style={{color: 'blue', textAlign: 'center', fontFamily: 'open-sans-bold'}}
				onPress={() => props.onHelp()}
			>LUPA PIN</Text>
		</ImageBackground>
	);
}

Pin.propTypes = {
	onLogin: PropTypes.func.isRequired,
	onHelp: PropTypes.func.isRequired
}

export default Pin;