import React from 'react';
import { View, Text } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import Home from "./components/screens/Home";
import Register from "./components/screens/Register"; 
import RegistrasiGiro from "./components/screens/RegistrasiGiro";
import { ApplicationProvider, Layout } from '@ui-kitten/components';
import { mapping, light as lightTheme } from '@eva-design/eva';
import { encode } from 'base-64';
import {PermissionsAndroid} from 'react-native';

const RootStack = createStackNavigator(
  {
    Home:  { 
      screen: Home
    }, 
    Register: { screen: Register },
    RegistrasiGiro: {screen: RegistrasiGiro }
  },{
    initialRouteName: 'Home',
    headerTransitionPreset: 'uikit'
  }
);

const AppContainer = createAppContainer(RootStack);


export default class App extends React.Component{
  async componentDidMount(){
    if (!global.btoa) { global.btoa = encode; }
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
        {
          title: 'Izinkan Aplikasi Ini Mengelola Data?',
          message:
            'oke ya' +
            'baik',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the camera');
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  }

  render(){
    return(
      <ApplicationProvider mapping={mapping} theme={lightTheme}>
        <AppContainer />
      </ApplicationProvider>
    );
  }
}