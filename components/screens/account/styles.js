import { StyleSheet } from 'react-native';
import Constants from 'expo-constants';

export default StyleSheet.create({
	header: {
	  	fontFamily: 'open-sans-bold',
	  	fontSize: 16,
	  	fontWeight: '700'
	},
	text: {
	  	fontFamily: 'open-sans-reg'
	},
	labelInformasi: {
		fontSize: 13,
		fontFamily: 'open-sans-reg',
	},
	contentLabel: {
		marginTop: 5,
		paddingBottom: 10, 
		flexDirection: 'row',
		borderBottomWidth: 1, 
		borderBottomColor: '#cfcfcf'
	},
	leftContent: {
		alignItems: 'flex-start',
		marginLeft: 10
	},
	labelTitle:{
		fontFamily: 'open-sans-reg', 
		fontSize: 15
	},
	labelSubTitle: {
		fontFamily: 'Roboto-Regular', 
		color: '#a6a3a2',
		marginRight: 10
	},
	icon: {
		marginTop: 8
	},
	linkIcon: {
		flex: 1,
		alignItems: 'flex-end',
		marginTop: 8
	},
	contentLabelBot: {
		marginTop: 5,
		paddingBottom: 10, 
		flexDirection: 'row',
	},
	footer: {
		backgroundColor: '#cccbca',
		width: '100%',
		height: 50
	},
	textFooter: {
		textAlign: 'center',
		margin: 15,
		fontFamily: 'Roboto-Regular',
		fontWeight: '700'
	},
	oneRow: {
		flexDirection: 'row', 
		alignItems: 'flex-start'
	},
	StatusBar: {
	    height: Constants.statusBarHeight,
	    backgroundColor: 'rgb(240, 132, 0)'
	}
})