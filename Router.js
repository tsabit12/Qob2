import React from 'react';
import { View, Text, Button, TouchableOpacity, Image } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { connect } from "react-redux";
import Home from "./components/screens/Home";
import IndexRegister from "./components/screens/pendaftaran/IndexRegister";
import { Layout, Icon, Avatar } from '@ui-kitten/components';
import IndexMenu from "./components/screens/menu/Index";
//import IndexMenu from "./components/screens/search/IndexSearch";
import PilihTarif from "./components/screens/order/PilihTarif";
import ResultOrder from "./components/screens/order/ResultOrder";
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import LacakScreen from "./components/screens/search/tab/LacakScreen";
import RekeningScreen from "./components/screens/search/tab/RekeningScreen";
import MyTab from "./components/screens/search/MyTab";
import LacakBarcode from "./components/screens/search/result/LacakBarcode";
import ResultRekeningSearch from "./components/screens/search/result/ResultRekeningSearch";
import Pembayaran from "./components/screens/Pembayaran/Pembayaran";
import Barcode from './components/screens/helper/barcode';
import AccountScreen from "./components/screens/account/AccountScreenNew";
import AboutScreen from "./components/screens/about/AboutScreen";
import CekTarif from "./components/screens/CekTarif";
import PemulihanAkun from "./components/screens/PemulihanAkun";
import ListOrder from "./components/screens/ListOrder";
import SearchOrderScreen from "./components/screens/SearchOrderScreen";
import BantuanScreen from "./components/screens/BantuanScreen";
import RequestPickupScreen from "./components/screens/RequestPickupScreen";
import OrderNonMember from "./components/screens/orderDetail/Order";
import OrderPenerimaNonMember from "./components/screens/orderDetail/Penerima";
import MapsScreen from "./components/screens/historyOrder/MapScreen";
import RiwayatPickup from "./components/screens/historyOrder/Index";
import KelolaPengirim from "./components/screens/orderDetail/Pengirim";
import LacakKiriman from "./components/screens/LacakKiriman";
import RegisterPebisol from "./components/screens/pendaftaran/Pebisol";
import RegistrasiNonPebisol from "./components/screens/pendaftaran/NonPebisol";
import ValidasiRekening from "./components/screens/ValidasiRekening";
import ChangePinScreen from "./components/screens/ChangePinScreen";
import DetailOrder from "./components/screens/historyOrder/DetailOrder";

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
      PilihTarif: {
        screen: PilihTarif
      },
      ResultOrder: {
        screen: ResultOrder
      },
      LacakBarcode: {
        screen: LacakBarcode
      },
      ResultRekeningSearch: {
        screen: ResultRekeningSearch 
      },
      Barcode: {
        screen: Barcode
      },
      Pembayaran: {
        screen: Pembayaran
      },
      DetailSearch: {
        screen: RouteTab
      },
      IndexMenu: {
        screen: IndexMenu
      },
      Account:{
        screen: AccountScreen
      },
      CekTarif: {
        screen: CekTarif
      },
      ListOrder: {
        screen: ListOrder
      },
      SearchOrder: {
        screen: SearchOrderScreen
      },
      RequestPickup: {
        screen: RequestPickupScreen
      },
      OrderNonMember: {
        screen: OrderNonMember
      },
      OrderPenerimaNonMember: {
        screen: OrderPenerimaNonMember
      },
      Maps: {
        screen: MapsScreen
      },
      RiwayatPickup: {
        screen: RiwayatPickup
      },
      KelolaPengirim: {
        screen: KelolaPengirim
      },
      LacakKiriman: {
        screen: LacakKiriman
      },
      ValidasiRekening: {
        screen: ValidasiRekening
      },
      ChangePin: {
        screen: ChangePinScreen
      },
      DetailOrder: {
        screen: DetailOrder
      }
  	},{
  	initialRouteName: 'IndexMenu',
    defaultNavigationOptions: {
      header: null
    },
});

const LoginNavigator = createStackNavigator({
  Home: { 
    screen: Home
  },
  IndexRegister:{
    screen: IndexRegister,
    navigationOptions: { 
      header: null
    }
  },
  RegisterPebisol: {
    screen: RegisterPebisol,
    navigationOptions: { 
      header: null
    }
  },
  RegistrasiNonPebisol: {
    screen: RegistrasiNonPebisol,
    navigationOptions: { 
      header: null
    }
  },
  PemulihanAkun: {
    screen: PemulihanAkun,
    navigationOptions: { 
      header: null
    }
  },
  Bantuan: {
    screen: BantuanScreen,
    navigationOptions: { 
      header: null
    }
  },
  About: {
    screen: AboutScreen,
    navigationOptions: { 
      header: null
    }
  },
  initialRouteName: 'Home'
});
 
const AppContainer = createAppContainer(AppNavigator);

const LoginContainer = createAppContainer(LoginNavigator);

const Router = ({ isLoggedIn }) => (
  <React.Fragment>
      { isLoggedIn ? <AppContainer /> : <LoginContainer /> } 
  </React.Fragment>
);

function mapStateToProps(state) {
  return{
    isLoggedIn: state.auth.logged
  }
}

export default connect(mapStateToProps, null)(Router);