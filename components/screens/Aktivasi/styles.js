import { StyleSheet, Dimensions } from 'react-native';
import Constants from 'expo-constants';

const heightDevice = Dimensions.get('window').height;

export default StyleSheet.create({
	StatusBar: {
	  	height: Constants.statusBarHeight,
	  	backgroundColor: '#FFF'
	},
	image: {
		height: heightDevice / 3,
		width: heightDevice / 2,
		borderRadius: 10
	},
	formContainer: {
		flex: 1,
		padding: 10,
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		elevation: 2
	},
	form: {
		borderWidth: 0.3, 
		padding: 10,
		margin: 7,
		borderRadius: 1,
		borderColor: '#B3B1B1',
		elevation: 2,
		backgroundColor: 'white',
	},
	title: {
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'white',
		padding: 15,
		elevation: 5,
		borderRadius: 3,
		margin: 7 
	},
	info: {
		fontSize: 13,
		color: '#5D5959'
	},
	input: {
		marginBottom: 6
	},
	navigation: {
		backgroundColor: 'transparent', 
		borderBottomWidth: 0.9, 
		borderBottomColor: '#e6e6e6',
	},
	root: {
		paddingTop: Constants.statusBarHeight,
		flex: 1
	}
});