import React from 'react'
import { View, Text, Button, TouchableOpacity, Image, Platform } from 'react-native'
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import Home from "./components/screens/Home";
import Dashboard from "./components/screens/Dashboard";
import IndexRegister from "./components/screens/registrasi/IndexRegister";
import { ApplicationProvider, Layout, IconRegistry, Icon } from '@ui-kitten/components';
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
import ResultRekeningSearch from "./components/screens/search/result/ResultRekeningSearch";
import Pembayaran from "./components/screens/Pembayaran/Pembayaran";
import KonfrimPembayaran from "./components/screens/Pembayaran/KonfrimPembayaran";
import OutputPembayaran from "./components/screens/Pembayaran/OutputPembayaran";
// import Drawer from "./components/screens/Drawer";

import Barcode from './components/screens/helper/barcode';
import { createDrawerNavigator } from "react-navigation-drawer";
import AccountScreen from "./components/screens/account/AccountScreen";
import AboutScreen from "./components/screens/about/AboutScreen";
import Akun from "./components/screens/Akun";
import HistoryPembayaran from "./components/screens/HistoryPembayaran";
import DetailTrans from "./components/screens/DetailTrans";

const iconBarcode = require("./assets/barcode.png");

const Search = ({ navigation }) => {
  const { state } = navigation;
  // console.log(navigation.router.getStateForAction);
  return(
    <React.Fragment>
      <TouchableOpacity 
        onPress={() => navigation.navigate({
              routeName: 'DetailSearch'
          })}
          style={{marginRight: 5}}
      >
        <Icon name='search-outline' fill={Platform.OS === 'ios' ? '#FFF' : 'black'} width={25} height={25} />
      </TouchableOpacity>
      { !state.isDrawerOpen ? 
        <TouchableOpacity 
          onPress={() => navigation.openDrawer()}
            style={{marginRight: 5}}
        >
          <Icon name='more-vertical-outline' fill={Platform.OS === 'ios' ? '#FFF' : 'black'} width={25} height={25} />
        </TouchableOpacity> : <TouchableOpacity 
        onPress={() => navigation.closeDrawer()}
          style={{marginRight: 5}}
      >
        <Icon name='close-outline' fill={Platform.OS === 'ios' ? '#FFF' : 'black'} width={25} height={25} />
      </TouchableOpacity> }
    </React.Fragment>
  );
}

const HeaderKiri = ({ navigation }) => (
  <TouchableOpacity 
    onPress={() => navigation.navigate({
          routeName: 'Barcode'
      })}
      style={{marginLeft: 10}}
  >
    { Platform.OS === 'ios' ? 
        <Icon name='camera-outline' fill='#FFF' width={25} height={25} /> : 
        <Image source={iconBarcode} style={{width: 30, height:30, color: 'white'}} /> }
  </TouchableOpacity>
);

const RoutMenu = createDrawerNavigator(
  {
    IndexMenu: {
      screen: IndexSearch
    },
    Acount:{
      screen: AccountScreen,
    },
    About:{
      screen: AboutScreen
    }
  },{
    drawerWidth: 250,
  }
)

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
      ResultRekeningSearch: {
        screen: ResultRekeningSearch 
      },
      Barcode: {
        screen: Barcode,
        navigationOptions: {
          header: null
        }
      },
      Pembayaran: {
        screen: Pembayaran,
        navigationOptions: {
          title: "Generate Pembayaran"
        }
      },
      KonfrimPembayaran: {
        screen: KonfrimPembayaran,
        navigationOptions: {
          title: "Konfirmasi Pembayaran"
        }
      },
      OutputPembayaran: {
        screen: OutputPembayaran,
        navigationOptions: {
          header: null
        }
      },
      DetailSearch: {
        screen: RouteTab,
        navigationOptions: { 
          header: null
        }
      },
      IndexSearch: {
        screen: RoutMenu,
        navigationOptions: ({ navigation }) => ({
          headerRight: <Search navigation={navigation}/>,
          title: 'QOB',
          headerTitleStyle: { 
            fontFamily: 'open-sans-bold',
            textAlign: 'left',
            marginLeft: -3,
            fontSize: 20,
            fontWeight: '700',
            color: Platform.OS === 'ios' ? 'white' : 'black'
          },
          headerStyle: {
            backgroundColor: Platform.OS === 'ios' ? 'black' : ''
          },
          headerLeft: <HeaderKiri navigation={navigation}/>
        })      
      },
      History: {
        screen: HistoryPembayaran
      },
      DetailTrans: {
        screen: DetailTrans
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