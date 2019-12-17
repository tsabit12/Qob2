import React from 'react';
import { View, Text } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import Home from "./components/screens/Home";
import Register from "./components/screens/Register"; 
import RegistrasiGiro from "./components/screens/RegistrasiGiro";
import { ApplicationProvider, Layout } from '@ui-kitten/components';
import { mapping, light as lightTheme } from '@eva-design/eva';

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


const HomeScreen = () => (
  <Layout style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
    <Text category='h1'>HOME</Text>
  </Layout>
);

export default class App extends React.Component{
  render(){
    return(
      <ApplicationProvider mapping={mapping} theme={lightTheme}>
        <AppContainer />
      </ApplicationProvider>
    );
  }
}