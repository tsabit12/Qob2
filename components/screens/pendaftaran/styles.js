import { StyleSheet } from "react-native";
import Constants from 'expo-constants';

export default StyleSheet.create({
	bottomForm: {
		padding: 10,
		position: 'absolute',
		width: '100%',
		bottom: 0,
		paddingBottom: 15
	},
	safeContainer: {
	    flex: 1,
	    marginTop: Expo.Constants.statusBarHeight
	},
	button: {
	    marginTop: 5
	},
	textToogle: {
		color: 'black', 
		fontSize: 15, 
		fontWeight: '700',
		paddingTop: 5
	},
	toogle:{
		//justifyContent: 'flex-start',
		flexDirection: 'row',
		paddingBottom: 15,
		margin: 6
	},
	form: {
		marginVertical: 8,
		padding: 8
	},
	message: {
		borderRadius: 4,
	    margin: 8,
	    backgroundColor: '#D3D3D3',
	},
	label: {
		color: 'black', 
		fontSize: 15,
		top: 4,
		padding: 2
	},
	labelRed: {
		color: 'red', 
		fontSize: 15,
		top: 4,
		padding: 2
	},
	labelErr: {
		color: 'red',
		top: -2,
		fontSize: 12,
		paddingBottom: 4
	},
	labelSuccess: {
		color: '#7FFFD4',
		fontSize: 15,
		top: 4,
		padding: 2
	},
	StatusBar: {
	  	height: Constants.statusBarHeight,
	  	backgroundColor: '#FFF'
	},
	backgroundImage: {
	    flex: 1,
	    width: null,
    	height: null,
	    justifyContent : 'center',
	}
})