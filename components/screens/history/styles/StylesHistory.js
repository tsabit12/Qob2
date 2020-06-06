import { StyleSheet, Dimensions } from 'react-native';
import Constants from 'expo-constants';

var device = Dimensions.get('window').width;

export default StyleSheet.create({
	header: {
		// justifyContent: 'center',
		// alignItems: 'center',
		height: device / 4.5,
		backgroundColor: 'rgb(240, 132, 0)',
    paddingLeft: 15,
		paddingRight: 10,
	},
	content: {
		flex: 1
	},
	StatusBar: {
      height: Constants.statusBarHeight,
      backgroundColor: 'rgb(255, 159, 15)'
  	},
  	title: {
  		color: "#FFFF",
  		fontSize: 16,
  		fontWeight: "700",
  		marginLeft: 10
  	},
  	navigation: {
  		flexDirection: 'row',
  		alignItems: 'center',
  		marginTop: 4
  	},
  	form: {
  		position: 'absolute',
  		bottom: 5,
  		left: 0,
  		right: 0,
  		flexDirection: 'row',
  		alignItems: 'center',
  		flex: 1,
  		justifyContent: 'space-between'
  		// backgroundColor: 'rgb(255, 159, 15)'
  	},
    select: {
      backgroundColor: "transparent", 
      width: "100%",
      borderColor: "white"
    },
  	input: {
  		borderRadius: 0,
  		backgroundColor: 'transparent',
  		flex: 1,
  		borderColor: "transparent"
  	},
  	label: {
  		marginLeft: 5,
  		marginRight: 5,
  		color: "#FFFF"
  	},
  	labelDate: {
  		flex: 1,
  		margin: 5,
  		alignItems: 'center',
  		flexDirection: 'row',
  		justifyContent: "center"
  	}
})