import React from 'react'
import { View, Text, Button } from 'react-native'
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import Home from "./components/screens/Home";
import Dashboard from "./components/screens/Dashboard";
import IndexRegister from "./components/screens/registrasi/IndexRegister";
import { ApplicationProvider, Layout, IconRegistry } from '@ui-kitten/components';
import { mapping, light as lightTheme } from '@eva-design/eva'; 
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import RegistrasiKtp from "./components/screens/registrasi/RegistrasiKtp";
import IndexSearch from "./components/screens/search/IndexSearch";
// import DetailSearch from "./components/screens/report/DetailSearch";
import RegistrasiRek from "./components/screens/registrasi/RegistrasiRek"; 
import IndexHelper from "./components/screens/helper/IndexHelper";
import IndexOrder from "./components/screens/order/IndexOrder";
import Pengirim from "./components/screens/order/Pengirim";
import LacakKiriman from "./components/screens/LacakKiriman";
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import LacakScreen from "./components/screens/search/tab/LacakScreen";
import RekeningScreen from "./components/screens/search/tab/RekeningScreen";
import MyTab from "./components/screens/search/MyTab";
import LacakBarcode from "./components/screens/search/result/LacakBarcode";


const RouteTab = createMaterialTopTabNavigator(
  {
    Lacak: LacakScreen,
    Rekening: RekeningScreen,
  },
  {
    tabBarComponent: ({ navigation }) => <MyTab navigation={navigation} />,
  }
);

const AppNavigator = createStackNavigator({
  		Home: { 
  			screen: Home
  		},
      Dashboard: { 
        screen: Dashboard
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
        screen: RouteTab,
        navigationOptions: {
          header: null
        }
      },
      RegistrasiRek: {
        screen: RegistrasiRek
      },
      Helper: {
        screen: IndexHelper
      },
      Order: {
        screen: IndexOrder 
      },
      OrderPengirim: { 
        screen: Pengirim
      },
      LacakBarcode: {
        screen: LacakBarcode
      },
  	},{
  	initialRouteName: 'Home'
});
 
const AppContainer = createAppContainer(AppNavigator);

const Router = () => (
  <React.Fragment>
    <IconRegistry icons={EvaIconsPack} />
  	<ApplicationProvider mapping={mapping} theme={lightTheme}>
      <AppContainer />
    </ApplicationProvider>
  </React.Fragment>
);

export default Router;