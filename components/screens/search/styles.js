import { StyleSheet } from 'react-native';
import Constants from 'expo-constants';

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    // padding: 10,
  },
  tabContainer: {
    minHeight: 64,
  },
  tab: {
    fontSize: 20,
    fontFamily: 'open-sans-reg',
    color: 'black'
  },
  judul: {
    fontFamily: 'open-sans-bold',
    fontSize: 16,
    fontWeight: '600'
  },
  containerTime: {
    flex: 1,
    padding: 10,
  },
  list: {
    flex: 1
  },
  label: {
    fontFamily: 'open-sans-bold', 
    fontSize: 15
  },
  labelList: {
    fontFamily: 'open-sans-reg'
  },
  circle: {
    width: 30, 
    height: 30,
    borderRadius: 30/2, 
    backgroundColor: '#32a899',
    justifyContent: 'center', 
    alignItems: 'center'
  },
  borderVertical: {
    borderStyle: 'dotted',
    borderLeftWidth:3,
    marginLeft: 100,
    borderLeftColor: '#d97716'
  },
  circleAktif:{
    width: 20, 
    height: 20,
    borderRadius: 20/2, 
    backgroundColor: '#d97716'
  },
  labelDate: {
    fontFamily: 'Roboto-Regular',
    margin: 5,
    color: '#5e5d5c'
  },
  labelTime: {
    fontFamily: 'open-sans-reg',
    marginLeft: -50,
    color: '#8f8e8d',
    fontSize: 14
  },
  box: {
    borderLeftWidth: 1, 
    borderRightWidth: 1, 
    borderBottomWidth: 1, 
    borderTopWidth: 1,
    margin: 5,
    borderRadius: 10,
    backgroundColor: '#edeceb'
  },
  description: {
    marginLeft: 3, 
    fontFamily: 'open-sans-reg', 
    fontSize: 12,
    color: '#8f8e8d'
  },
  StatusBar: {
    height: Constants.statusBarHeight,
    backgroundColor: 'rgb(240, 132, 0)'
  },
  card: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    padding: 5, 
    borderBottomWidth: 2, 
    borderRightWidth: 2, 
    borderLeftWidth: 1, 
    borderTopWidth: 1, 
    borderColor: '#f08400',
    borderRadius: 4
  }
});