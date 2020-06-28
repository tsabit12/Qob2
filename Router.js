import React from 'react';
import { View, Text, Button, TouchableOpacity, Image } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { connect } from "react-redux";
import { setLocalUser } from "./actions/user";
import IndexRegister from "./components/screens/pendaftaran/IndexRegister";
import { Layout, Icon, Avatar } from '@ui-kitten/components';
import IndexMenu from "./components/screens/menu/Index";
import PilihTarif from "./components/screens/order/PilihTarif";
import ResultOrder from "./components/screens/order/ResultOrder";
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import LacakBarcode from "./components/screens/LacakBarcode";
import Pembayaran from "./components/screens/Pembayaran/Pembayaran";
import Barcode from './components/screens/helper/barcode';
import AccountScreen from "./components/screens/account/AccountScreenNew";
import AboutScreen from "./components/screens/about/AboutScreen";
import CekTarif from "./components/screens/CekTarif";
import OrderNonMember from "./components/screens/orderDetail/Order";
import OrderPenerimaNonMember from "./components/screens/orderDetail/Penerima";
import MapsScreen from "./components/screens/historyOrder/MapScreen";
// import RiwayatPickup from "./components/screens/historyOrder/Index";
import KelolaPengirim from "./components/screens/orderDetail/Pengirim";
import LacakKiriman from "./components/screens/LacakKiriman";
import RegisterPebisol from "./components/screens/pendaftaran/Pebisol";
import RegistrasiNonPebisol from "./components/screens/pendaftaran/NonPebisol";
import ValidasiRekening from "./components/screens/ValidasiRekening";
import ChangePinScreen from "./components/screens/ChangePinScreen";
import DetailOrder from "./components/screens/historyOrder/DetailOrder";
import Pemulihan from "./components/screens/bantuan/Pemulihan";
import { Aktivasi as AktivasiScreen } from "./components/screens/Aktivasi";
import { History as RiwayatPickup } from "./components/screens/history";

import {
  Home as HomeView,
  Menu as MenuView
} from "./views";

const AppNavigator = createStackNavigator({
      IndexMenu: {
        screen: MenuView
      },
      PilihTarif: {
        screen: PilihTarif
      },
      ResultOrder: {
        screen: ResultOrder
      },
      LacakBarcode: {
        screen: LacakBarcode
      },
      Barcode: {
        screen: Barcode
      },
      Pembayaran: {
        screen: Pembayaran
      },
      Account:{
        screen: AccountScreen
      },
      CekTarif: {
        screen: CekTarif
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
      },
  	},{
  	initialRouteName: 'IndexMenu',
    defaultNavigationOptions: {
      header: null
    },
});

const LoginNavigator = createStackNavigator({
  Home: { 
    screen: HomeView,
    navigationOptions: { 
      header: null
    }
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
  Pemulihan: {
    screen: Pemulihan,
    navigationOptions: { 
      header: null
    }
  },
  Aktivasi: {
    screen: AktivasiScreen,
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

const Router = ({ isLoggedIn, localUser, setLocalUser }) => {
  React.useEffect(() => {
    if (Object.keys(localUser).length > 0) {
      setLocalUser(localUser);
    }
  }, []);

  return(
    <React.Fragment>
      { isLoggedIn ? <AppContainer /> : <LoginContainer /> } 
    </React.Fragment>
  )
}

function mapStateToProps(state) {
  return{
    isLoggedIn: state.auth.logged
  }
}

export default connect(mapStateToProps, { setLocalUser })(Router); 