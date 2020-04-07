import { StyleSheet, Dimensions } from 'react-native';
import Constants from 'expo-constants';
const height = Dimensions.get('window').height;

export default StyleSheet.create({
	StatusBar: {
	    height: Constants.statusBarHeight,
	    backgroundColor: 'rgb(240, 132, 0)'
	},
	navigation:{
		backgroundColor: 'rgb(240, 132, 0)', 
		minHeight: height / 15 ,
		justifyContent: 'center',
		paddingLeft: 10,
		paddingRight: 10
	},
	navigationContent:{
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	leftContent: {
		flex: 1,
	    flexDirection: 'row',
	    justifyContent: 'flex-start'
	},
	rightContent: {
		flex: 1,
		flexDirection: 'row',
    	justifyContent: 'flex-end',
	},
	tab: {
		backgroundColor: '#f2f1f0',
		minHeight: 50,
		flexDirection: 'row',
		justifyContent: 'space-between',
		position: 'absolute',
		bottom: 0,
		padding: 10,
		borderTopWidth: 0.4,
		elevation: 5,
		borderColor: '#cbccc4',
		zIndex: 1,
	},
	tabLeft: {
		flex: 1,
		justifyContent: 'center'
	},
	tabRight: {
		flex: 1,
		justifyContent: 'center'
	},
	detailTitle: {
		fontSize: 14,
		fontFamily: 'open-sans-reg',
	},
	subTitleText: {
		fontSize: 14,
		fontFamily: 'open-sans-reg',
		color: '#8a8a88',
		paddingBottom: 3
	},
	searchButton: {
		alignItems: 'center', 
		justifyContent: 'center', 
		marginLeft: 10,
		backgroundColor: '#FFF',
		padding: 8,
		borderRadius: 20
	}
})