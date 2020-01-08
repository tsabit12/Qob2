import React from 'react'
import { View, Text, Button, TouchableOpacity, Image, Platform, AsyncStorage } from 'react-native'
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { connect } from "react-redux";
import Home from "./components/screens/Home";
import IndexRegister from "./components/screens/registrasi/IndexRegister";
import { ApplicationProvider, Layout, IconRegistry, Icon, Avatar } from '@ui-kitten/components';
import { mapping, light as lightTheme } from '@eva-design/eva'; 
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import RegistrasiKtp from "./components/screens/registrasi/RegistrasiKtp";
import IndexSearch from "./components/screens/search/IndexSearch";
// import DetailSearch from "./components/screens/report/DetailSearch";
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
import KonfrimPembayaran from "./components/screens/Pembayaran/KonfrimPembayaran";
import OutputPembayaran from "./components/screens/Pembayaran/OutputPembayaran";

import Barcode from './components/screens/helper/barcode';
import AccountScreen from "./components/screens/account/AccountScreen";
import AboutScreen from "./components/screens/about/AboutScreen";
import HistoryPembayaran from "./components/screens/HistoryPembayaran";
import DetailTrans from "./components/screens/DetailTrans";
import CekTarif from "./components/screens/CekTarif";
import LupaPin from "./components/screens/LupaPin";
import ListOrder from "./components/screens/ListOrder";

const iconBarcode = require("./assets/barcode.png");


const getProfileName = async() => {
    const value = await AsyncStorage.getItem('sessionLogin');
    const toObj = JSON.parse(value);
    const nama  = toObj.nama.toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ');
    const saldo = toObj.saldo;
    return {
      nama: nama,
      sisaSaldo: saldo
    };
}

const Search = ({ navigation }) => {
  const { state } = navigation;
  // console.log(navigation.router.getStateForAction);
  return(
    <React.Fragment>
      <TouchableOpacity 
        onPress={() => navigation.navigate({
              routeName: 'DetailSearch'
          })}
          style={{ marginRight: 10 }}
      >
        <Icon name='search-outline' fill={Platform.OS === 'ios' ? '#FFF' : 'black'} width={25} height={25} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => getProfileName().then(obj => {
          navigation.navigate({
            routeName: 'Account',
            params: {
              namaLengkap: obj.nama,
              saldo: obj.sisaSaldo
            }
          })
        })}
      >
      <Avatar style={{marginRight: 10}} size='tiny' source={require('./components/icons/avatar-user.jpg')}/>
      </TouchableOpacity>
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
        <Image source={iconBarcode} style={{width: 30, height:30 }} /> }
  </TouchableOpacity>
);

// const RoutMenu = createDrawerNavigator(
//   {
//     IndexMenu: {
//       screen: IndexSearch
//     },
//     Acount:{
//       screen: AccountScreen,
//     },
//     About:{
//       screen: AboutScreen
//     }
//   },{
//     contentComponent: DrawerComponent,
//     contentOptions: {
//       labelStyle: {
//         fontSize: 20,
//         fontFamily: 'open-sans-bold'
//       }
//     }
//   }
// )

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
        screen: IndexOrder 
      },
      OrderPenerima: {
        screen: Penerima
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
        screen: IndexSearch,
        //if you want using drawe just use screen RoutMenu
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
      Account:{
        screen: AccountScreen,
      },
      History: {
        screen: HistoryPembayaran
      },
      DetailTrans: {
        screen: DetailTrans
      },
      CekTarif: {
        screen: CekTarif
      },
      ListOrder: {
        screen: ListOrder
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
    screen: ValidasiRekening
  },
  LupaPin: {
    screen: LupaPin
  },
  RegistrasiKtp: {
    screen: RegistrasiKtp
  },
  ValidasiRegRek: {
    screen: ValidasiRegRek
  },
  initialRouteName: 'Home'
});
 
const AppContainer = createAppContainer(AppNavigator);

const LoginContainer = createAppContainer(LoginNavigator);

const Router = ({ isLoggedIn }) => {
  return(
    <React.Fragment>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider mapping={mapping} theme={lightTheme}>
        { isLoggedIn ? <AppContainer /> : <LoginContainer />} 
      </ApplicationProvider>
    </React.Fragment>
  )
}

function mapStateToProps(state) {
  return{
    isLoggedIn: state.auth.logged
  }
}

export default connect(mapStateToProps, null)(Router);