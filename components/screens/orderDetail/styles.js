import { StyleSheet } from 'react-native';
import Constants from 'expo-constants';

export default StyleSheet.create({
	StatusBar: {
      height: Constants.statusBarHeight,
      backgroundColor: 'rgb(240, 132, 0)'
  	},
  	input: {
		marginTop: 5
	},
	label: {
	  	color: 'black',
	  	fontSize: 14,
	  	fontFamily: 'open-sans-reg'
	},
	labelRek:{
		color: 'blue',
	  	fontSize: 14,
	  	fontFamily: 'open-sans-reg'
	},
	cardForm:{
		padding: 6, 
		// borderRightWidth: 0.1, 
		// borderLeftWidth: 0.1,
		borderWidth: 0.4,
		// borderBottomWidth: 0.4,
		borderColor: '#909190', 
		borderRadius: 5, 
		marginTop: 5,
		flex: 1
	},
	notif:{
		backgroundColor: '#c4c1c0', 
		margin: 10, 
		marginBottom: 5, 
		borderRadius: 3, 
		minHeight: 60, 
		padding: 10
	},
	navigation: {
		backgroundColor: 'rgb(240, 132, 0)',
		marginTop: Constants.statusBarHeight,
		elevation: 5
	}
})