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
// import {PermissionsAndroid} from 'react-native';
 
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
  }

  render(){
    return(
      <ApplicationProvider mapping={mapping} theme={lightTheme}>
        <AppContainer />
      </ApplicationProvider>
    );
  }
}