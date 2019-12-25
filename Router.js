import React from 'react'
import { View, Text, Button } from 'react-native'
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import Home from "./components/screens/Home";
import IndexRegister from "./components/screens/registrasi/IndexRegister";
import { ApplicationProvider, Layout } from '@ui-kitten/components';
import { mapping, light as lightTheme } from '@eva-design/eva'; 
import RegistrasiKtp from "./components/screens/registrasi/RegistrasiKtp";
import IndexSearch from "./components/screens/report/IndexSearch";
import DetailSearch from "./components/screens/report/DetailSearch";
import RegistrasiRek from "./components/screens/registrasi/RegistrasiRek"; 
import Dashboard from './components/screens/Dashboard';
import CekTarif from "./components/screens/cektarif/CekTarif";
 
const AppNavigator = createStackNavigator({
  		Home: { 
        screen: Home 
  		},
  		IndexRegister:{
  			screen: IndexRegister
  		},
      RegistrasiKtp: {
        screen: RegistrasiKtp
      },
      IndexSearch: {
        screen: IndexSearch
      },
      DetailSearch: {
        screen: DetailSearch
      },
      RegistrasiRek: {
        screen: RegistrasiRek
      },
      Dashboard: {
        screen: Dashboard
      },
      CekTarif :{
        screen: CekTarif
      },
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