import React from 'react'
import { View, Text, Button } from 'react-native'
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import Home from "./components/screens/Home";
import IndexRegister from "./components/screens/registrasi/IndexRegister";

const AppNavigator = createStackNavigator({
  		Home: { 
  			screen: Home 
  		},
  		IndexRegister:{
  			screen: IndexRegister
  		}
  	},{
  	initialRouteName: 'Home'
});

export default createAppContainer(AppNavigator);