import React from 'react';
import { View, Text } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import Home from "./components/screens/Home";
import Register from "./components/screens/Register";

const RootStack = createStackNavigator(
  {
    Home:  { 
      screen: Home
    }, 
    Register: { screen: Register }
  },{
    initialRouteName: 'Home',
    headerTransitionPreset: 'uikit'
  }
);

const AppContainer = createAppContainer(RootStack);

export default class App extends React.Component{
  render(){
    return(
      <AppContainer />
    );
  }
}