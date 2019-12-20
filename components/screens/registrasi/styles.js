import { StyleSheet } from "react-native";

export default StyleSheet.create({
	centerForm: {
		padding: 10
	},
	safeContainer: {
	    flex: 1,
	    justifyContent : 'center'
	},
	button: {
	    top: 5
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
		fontSize: 12
	}
})