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
	cardBidding: {
	    borderWidth: 0.9,
	    borderColor: '#FFF',
	    borderRadius: 2,
	    elevation: 5,
	    margin: 2,
	    marginBottom: 5,
	    backgroundColor: '#f08400'
	},
	cardSuccess: {
	    borderWidth: 0.9,
	    borderColor: '#FFF',
	    borderRadius: 2,
	    elevation: 5,
	    margin: 2,
	    marginBottom: 5,
	    backgroundColor: '#228708'
	},
	cardNotFound: {
	    borderWidth: 0.9,
	    borderColor: '#FFF',
	    borderRadius: 2,
	    elevation: 5,
	    margin: 2,
	    marginBottom: 5,
	    backgroundColor: '#f74e00'
	},
	cardFinding: {
	    borderWidth: 0.9,
	    borderColor: '#FFF',
	    borderRadius: 2,
	    elevation: 5,
	    margin: 2,
	    marginBottom: 5,
	    backgroundColor: '#1d8a78'
	},
	cardWasDriver: {
	    borderWidth: 0.9,
	    borderColor: '#FFF',
	    borderRadius: 2,
	    elevation: 5,
	    margin: 2,
	    marginBottom: 5,
	    backgroundColor: '#c9bc06'
	},
	cardWasPay: {
	    borderWidth: 0.9,
	    borderColor: '#FFF',
	    borderRadius: 2,
	    elevation: 5,
	    margin: 2,
	    marginBottom: 5,
	    backgroundColor: '#531dd1'
	},
	card15: {
	    borderWidth: 0.9,
	    borderColor: '#FFF',
	    borderRadius: 2,
	    elevation: 5,
	    margin: 2,
	    marginBottom: 5,
	    backgroundColor: '#c90039'
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
	},
	statusView: {
		width: 15, 
		backgroundColor: '#fc9003', 
		height: 15, 
		borderRadius: 7, 
		justifyContent: 'center'
	},
	sudahTrans: {
		width: 15, 
		backgroundColor: '#228708', 
		height: 15, 
		borderRadius: 7, 
		justifyContent: 'center',
	},
	driverNotFound: {
		backgroundColor: '#f74e00',
		height: 15, 
		width: 15, 
		borderRadius: 7, 
		justifyContent: 'center',
	},
	wasPay:{
		backgroundColor: '#531dd1',
		height: 15, 
		width: 15, 
		borderRadius: 7, 
		justifyContent: 'center'
	},
	inHub: {
		backgroundColor: '#c90039',
		height: 15, 
		width: 15, 
		borderRadius: 7, 
		justifyContent: 'center'
	},
	finding: {
		backgroundColor: '#1d8a78',
		height: 15, 
		width: 15, 
		borderRadius: 7, 
		justifyContent: 'center'
	},
	driverFound: {
		backgroundColor: '#c9bc06',
		height: 15, 
		width: 15, 
		borderRadius: 7, 
		justifyContent: 'center',
	},
	labelStatus: {
		fontSize: 12, 
		marginLeft: 10, 
		justifyContent: 'center',
		fontFamily: 'open-sans-reg'
	},
	modalContent: {
		width: 300,
		height: 350, 
		backgroundColor: '#FFF',
		borderRadius: 6,
		borderWidth: 0.7,
		borderColor: '#bfbebb'
	},
	buttonCloseModal: {
		position: 'absolute', 
		bottom: 0, 
		left: 0, 
		right: 0,
		alignItems: 'center',
		width: '100%',
		flex: 1,
		backgroundColor: 'rgb(240, 132, 0)',
		padding: 15
	},
	titleList: {
		fontSize: 14,
		fontFamily: 'open-sans-reg'
	},
	judulDetail: {
		textAlign: 'center', fontFamily: 'open-sans-reg'
	},
	detailTitle: {
		fontSize: 14,
		fontFamily: 'open-sans-reg',
	},
	subTitleText: {
		fontSize: 14,
		fontFamily: 'open-sans-reg',
		color: '#b8b6b6'
	}
})