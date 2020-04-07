import { StyleSheet } from 'react-native';
import Constants from 'expo-constants';

export default StyleSheet.create({
  container: {
    margin: 8,
    borderWidth: 1,
    // borderRightWidth: 1,
    borderColor: '#cfcfcf',
    borderRadius: 5,
  },
  text: {
  	fontFamily: 'open-sans-reg'
  },
  header: {
  	fontFamily: 'open-sans-bold',
  	fontSize: 16,
  	fontWeight: '700'
  },
  label: {
  	color: 'black',
  	fontSize: 15,
  	fontFamily: 'open-sans-reg'
  },
  input: {
  	paddingBottom: 7
  },
  hitung: {
  	flexDirection: 'row',
	alignSelf: 'stretch',
	paddingBottom: 7
  },
  inputHitung: {
  	paddingRight: 4,
  	padding: 3,
  	flex: 1
  },
  labelResult: {
    color: 'black',
    fontSize: 15,
    fontFamily: 'open-sans-reg',
    paddingTop: 10
  },
  listItem: { borderRadius: 1},
  listItemTitle: { color: '#3366ff' },
  listItemDescription: { color: '#2E3A59' },
  labelInformasi: {
    fontSize: 16,
    fontFamily: 'open-sans-reg'
  },
  subTitle: {
    fontSize: 15,
    fontFamily: 'open-sans-reg',
    color: '#bcbdbb'
  },
  labelRight: {
    fontSize: 16, 
    fontFamily: 'open-sans-reg', 
    marginLeft: 73 
  },
  viewResult: {
    paddingBottom: 4
  },
  labelTarif: {
    borderBottomWidth: 0.4, 
    borderBottomColor: '#cbccc4', 
  },
  StatusBar: {
      height: Constants.statusBarHeight,
      backgroundColor: 'rgb(240, 132, 0)'
  }
});