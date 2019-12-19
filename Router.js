import React from 'react'
import { View, Text, Button } from 'react-native'
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import Home from "./components/screens/Home";
import IndexRegister from "./components/screens/registrasi/IndexRegister";
import { ApplicationProvider, Layout } from '@ui-kitten/components';
import { mapping, light as lightTheme } from '@eva-design/eva';

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

const AppContainer = createAppContainer(AppNavigator);

const Router = () => (
	<ApplicationProvider mapping={mapping} theme={lightTheme}>
        <AppContainer />
    </ApplicationProvider>
);

export default Router;