import React from 'react'
import { View, Text, Button, TouchableOpacity, Image, Platform, AsyncStorage } from 'react-native'
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { connect } from "react-redux";
import Home from "./components/screens/Home";
import IndexRegister from "./components/screens/registrasi/IndexRegister";
import { Layout, Icon, Avatar } from '@ui-kitten/components';
import RegistrasiKtp from "./components/screens/registrasi/RegistrasiKtp";
import IndexSearch from "./components/screens/search/IndexSearch";
import ValidasiRekening from "./components/screens/registrasi/ValidasiRekening";
import ValidasiRegRek from "./components/screens/registrasi/ValidasiRegRek";
import IndexHelper from "./components/screens/helper/IndexHelper";
import IndexOrder from "./components/screens/order/IndexOrder";
import Penerima from "./components/screens/order/Penerima";
import PilihTarif from "./components/screens/order/PilihTarif";
import ResultOrder from "./components/screens/order/ResultOrder";
import LacakKiriman from "./components/screens/LacakKiriman";
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import LacakScreen from "./components/screens/search/tab/LacakScreen";
import RekeningScreen from "./components/screens/search/tab/RekeningScreen";
import MyTab from "./components/screens/search/MyTab";
import LacakBarcode from "./components/screens/search/result/LacakBarcode";
import ResultRekeningSearch from "./components/screens/search/result/ResultRekeningSearch";
import Pembayaran from "./components/screens/Pembayaran/Pembayaran";
// import KonfrimPembayaran from "./components/screens/Pembayaran/KonfrimPembayaran";
// import OutputPembayaran from "./components/screens/Pembayaran/OutputPembayaran";
import Barcode from './components/screens/helper/barcode';
import AccountScreen from "./components/screens/account/AccountScreen";
import AboutScreen from "./components/screens/about/AboutScreen";
import CekTarif from "./components/screens/CekTarif";
import PemulihanAkun from "./components/screens/PemulihanAkun";
import ListOrder from "./components/screens/ListOrder";
import SearchOrderScreen from "./components/screens/SearchOrderScreen";
import BantuanScreen from "./components/screens/BantuanScreen";

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
      Helper: {
        screen: IndexHelper
      },
      Order: {
        screen: IndexOrder,
        navigationOptions: {
          header: null
        }
      },
      OrderPenerima: {
        screen: Penerima,
        navigationOptions: {
          header: null
        }
      },
      PilihTarif: {
        screen: PilihTarif,
        navigationOptions: {
          header: null
        }
      },
      ResultOrder: {
        screen: ResultOrder,
        navigationOptions: {
          header: null
        }
      },
      LacakBarcode: {
        screen: LacakBarcode,
        navigationOptions: {
          header: null
        }
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
        screen: IndexSearch,
        navigationOptions: {
          header: null
        }
      },
      Account:{
        screen: AccountScreen,
        navigationOptions: {
          header: null
        }
      },
      CekTarif: {
        screen: CekTarif,
        navigationOptions: {
          header: null
        }
      },
      ListOrder: {
        screen: ListOrder,
        navigationOptions: {
          header: null
        }
      },
      SearchOrder: {
        screen: SearchOrderScreen,
        navigationOptions: { 
          header: null
        }
      },
  	},{
  	initialRouteName: 'IndexSearch'
});

const LoginNavigator = createStackNavigator({
  Home: { 
    screen: Home
  },
  IndexRegister:{
    screen: IndexRegister
  },
  RegistrasiRek: {
    screen: ValidasiRekening,
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
  RegistrasiKtp: {
    screen: RegistrasiKtp,
    navigationOptions: { 
      header: null
    }
  },
  ValidasiRegRek: {
    screen: ValidasiRegRek,
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
  initialRouteName: 'Home'
});
 
const AppContainer = createAppContainer(AppNavigator);

const LoginContainer = createAppContainer(LoginNavigator);

const Router = ({ isLoggedIn }) => {
  return(
    <React.Fragment>
        { isLoggedIn ? <AppContainer /> : <LoginContainer />} 
    </React.Fragment>
  )
}

function mapStateToProps(state) {
  return{
    isLoggedIn: state.auth.logged
  }
}

export default connect(mapStateToProps, null)(Router);