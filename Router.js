import React from 'react';
import { View, Text, Button, TouchableOpacity, Image, AsyncStorage } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { connect } from "react-redux";
import { setLocalUser } from "./actions/user";
import IndexRegister from "./components/screens/pendaftaran/IndexRegister";
import { Layout, Icon, Avatar } from '@ui-kitten/components';
import IndexMenu from "./components/screens/menu/Index";
import PilihTarif from "./components/screens/order/PilihTarif";
import ResultOrder from "./components/screens/order/ResultOrder";
import LacakBarcode from "./components/screens/LacakBarcode";
import Pembayaran from "./components/screens/Pembayaran/Pembayaran";
import Barcode from './components/screens/helper/barcode';
import AccountScreen from "./components/screens/account/AccountScreenNew";
import AboutScreen from "./components/screens/about/AboutScreen";
import CekTarif from "./components/screens/CekTarif";
import OrderNonMember from "./components/screens/orderDetail/Order";
import OrderPenerimaNonMember from "./components/screens/orderDetail/Penerima";
import MapsScreen from "./components/screens/historyOrder/MapScreen";
import KelolaPengirim from "./components/screens/orderDetail/Pengirim";
import LacakKiriman from "./components/screens/LacakKiriman";
import RegisterPebisol from "./components/screens/pendaftaran/Pebisol";
import RegistrasiNonPebisol from "./components/screens/pendaftaran/NonPebisol";
// import ValidasiRekening from "./components/screens/ValidasiRekening";
import ChangePinScreen from "./components/screens/ChangePinScreen";
import DetailOrder from "./components/screens/historyOrder/DetailOrder";
import { Aktivasi as AktivasiScreen } from "./components/screens/Aktivasi";
import { History as RiwayatPickup } from "./components/screens/history";

import { 
  Spinner
} from '@ui-kitten/components';

import {
  Home as HomeView,
  Menu as MenuView,
  ValidasiRekening,
  Bantuan as BantuanView,
  Order as OrderView,
  Invoice as InvoiceView,
  Sender as SenderView
} from "./views";

const AppLoading = props => (
  <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', }}>
    <Spinner size='medium' />
    <Text style={{textAlign: 'center'}}>Menyiapkan..</Text>
  </View>
)

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
        screen: OrderView
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
        screen: SenderView
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
      Invoice: {
        screen: InvoiceView
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
    screen: BantuanView,
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

const Router = ({ isLoggedIn, setLocalUser }) => {
  const [mount, setMount] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      const value = await AsyncStorage.getItem("qobUserPrivasi");
      if (value !== null) { //detect user was register
        const toObje  = JSON.parse(value);
        if (value !== null) {
          const payload = {
            email: toObje.email,
            nama: toObje.nama,
            nohp: toObje.nohp,
            pin: toObje.pinMd5,
            userid: toObje.userid,
            username: toObje.username
          };

          setLocalUser(payload);
        }
      }

      setMount(true);
    })();
  }, []);

  return(
    <React.Fragment>
      { mount ? <React.Fragment>
          { isLoggedIn ? <AppContainer /> : <LoginContainer /> } 
        </React.Fragment> : <AppLoading />}
    </React.Fragment>
  )
}

function mapStateToProps(state) {
  return{
    isLoggedIn: state.auth.logged
  }
}

export default connect(mapStateToProps, { setLocalUser })(Router); 