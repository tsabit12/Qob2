import React from 'react';
import { Provider } from 'react-redux'
import Router from './Router';
import store from './store';
import { Text, StyleSheet, View, Platform, AsyncStorage } from "react-native";
import { ApplicationProvider, IconRegistry, Icon, Spinner } from '@ui-kitten/components';
import { mapping, light as lightTheme } from '@eva-design/eva'; 
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { encode } from 'base-64';
import { Notifications } from 'expo';
import * as Font from "expo-font";
import * as Permissions from 'expo-permissions';
//import Dialog from "react-native-dialog";
import { MenuProvider } from 'react-native-popup-menu';
import * as Updates from 'expo-updates';

// const ModalDialog = ({ onPress }) => (
//   <Dialog.Container visible={true}>
//     <Dialog.Title>Notifications</Dialog.Title>
//         <View style={{margin: 17}}>
//             <Text>Dirver pickup ditemukan</Text>
//         </View>
//         <Dialog.Button label="Oke" onPress={() => onPress()}/>
//     </Dialog.Container>
// );  

const LoadFont = ({ text }) => (
  <View style={{alignItems: 'center'}}>
    <Spinner size='medium' />
    <Text style={{textAlign: 'center'}}>{text}</Text>
  </View>
);

class App extends React.Component{
  state = {
    fontLoaded: false,
    notification:  {},
    visible: false,
    mount: false,
    textUpdate: 'Memuat...',
    localUser: {}
  };

  UNSAFE_componentWillMount(){
    if (Platform.OS === 'android') {
      Notifications.createChannelAndroidAsync('qposin-messages', {
        name: 'Chat messages',
        sound: true,
        priority: 'max',
        vibrate: [0, 250, 250, 250]
      });
    }
  
    this.setState({ mount: true });
  }


  async componentDidMount(){
    // this._notificationSubscription = Notifications.addListener(this.handleNotification);
    if (!global.btoa) { global.btoa = encode; }

    if (this.state.mount) {

      await Font.loadAsync({
        'open-sans-reg': require('./assets/fonts/OpenSans-Regular.ttf'),
        'open-sans-bold': require('./assets/fonts/OpenSans-Bold.ttf'),
        'Roboto-Regular': require('./assets/fonts/Roboto-Regular.ttf'),
      });

      //get user data
      const value = await AsyncStorage.getItem("qobUserPrivasi");
      if (value !== null) {
        const toObje  = JSON.parse(value);
        this.setState({ 
         localUser: {
            email: toObje.email,
            nama: toObje.nama,
            nohp: toObje.nohp,
            pin: toObje.pinMd5,
            userid: toObje.userid,
            username: toObje.username
          }
        });
      }

      //checking update
      try {
        const update = await Updates.checkForUpdateAsync();
        this.setState({ textUpdate: 'Checking updates...'});
        if (update.isAvailable) {
          this.setState({ textUpdate: 'Updating app...'});
          await Updates.fetchUpdateAsync();
          this.setState({ textUpdate: 'Apps updated...'});
          await Updates.reloadAsync();
        }
      } catch (e) {
        this.setState({ textUpdate: 'Cannot updated apps'});
        // handle or log error
      }

      this.setState({ fontLoaded: true });
      
      // const { status } = await Permissions.getAsync(Permissions.LOCATION);
      // if (status !== 'granted') {
      //   const response = await Permissions.askAsync(Permissions.LOCATION);
      // }
    }
  }

  handleNotification = (notification) => {
    this.setState({ notification: notification, visible: true });
  }

  onPressOke = () => {
    this.setState({ visible: false });
  }

  render(){
    const { fontLoaded, visible } = this.state;
    return(
      <Provider store={store}>
        <IconRegistry icons={EvaIconsPack} />
        <ApplicationProvider mapping={mapping} theme={lightTheme}>
        
        <MenuProvider>
          { fontLoaded ? <Router 
                localUser={this.state.localUser}
            /> : 
            <View style={styles.container}>
              <LoadFont text={this.state.textUpdate} />
            </View> }
        </MenuProvider>
        </ApplicationProvider>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default App;