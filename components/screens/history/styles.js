import { StyleSheet } from 'react-native';
import Constants from 'expo-constants';

export default StyleSheet.create({
	StatusBar: {
      height: Constants.statusBarHeight,
      backgroundColor: 'rgb(240, 132, 0)'
  	},
  	container: {
  		margin: 10
  	},
	card: {
	    borderWidth: 0.9,
	    borderColor: '#FFF',
	    borderRadius: 2,
	    elevation: 5,
	    margin: 2,
	    backgroundColor: '#f08400'
	},
	navigationStyle: {
		backgroundColor: 'rgb(240, 132, 0)',
	    elevation: 7,
	    paddingTop: Constants.statusBarHeight,
	    height: 80
	},
	listItem: {
		flexDirection: 'row',
		justifyContent: 'center',
	},
	subTitle: {
		color: '#FFF',
		fontFamily: 'open-sans-reg',
		fontSize: 13
	},
	rightIcon: {
		alignItems: 'flex-end', 
		justifyContent: 'center', 	
		marginTop: 13,
		marginBottom: 13
	},
	numberBorder:{
		justifyContent: 'center', 
		borderRightWidth: 1,
		borderColor: '#FFF'
	},
	textView:{
		flexDirection: 'column', 
		flex: 1,
		justifyContent: 'center',
		marginLeft: 10,
		marginTop: 5,
		marginBottom: 5
	},
	number: {
		fontSize: 20,
		margin: 15,
		color: "#FFF"
	},
	onProgress: {
		marginTop: 5, 
		marginLeft: 3, 
		marginRight: 3, 
		borderWidth: 0.9,
		borderColor: '#c9c7c7',
		borderRadius: 6
	},
	textOnprogress: {
		textAlign: 'center',
		fontFamily: 'open-sans-bold',
		fontSize: 16
	},
	titleCard: {
		borderBottomWidth: 0.9,
		borderColor: '#c9c7c7', 
		padding: 7,
		backgroundColor: '#e3e3e3'
	}
})