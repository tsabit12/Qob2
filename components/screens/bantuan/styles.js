import { StyleSheet } from 'react-native';
import Constants from 'expo-constants';

export default StyleSheet.create({
  	StatusBar: {
	  	height: Constants.statusBarHeight,
	  	backgroundColor: '#FFF'
	},
	container: {
		margin: 5,
		padding: 5,
		borderWidth: 0.3,
		borderRadius: 3,
		borderColor: '#919492'
	},
	label: {
		color: 'black',
		fontSize: 14,
		fontFamily: 'open-sans-reg'
	},
	input: {
		marginBottom: 6
	}
})