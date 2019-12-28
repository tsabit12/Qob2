import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    padding: 10,
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
  }
});