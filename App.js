import React from "react";
import { View, Text, StyleSheet, AsyncStorage } from "react-native";
import * as Font from "expo-font";
import { useFonts } from '@use-expo/font';
import { Notifications } from 'expo';
import { 
  Spinner,
  ApplicationProvider,
  IconRegistry
} from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { mapping, light as lightTheme } from '@eva-design/eva'; 
import * as Updates from 'expo-updates';
import PropTypes from "prop-types";
import { encode } from 'base-64';
import { MenuProvider } from 'react-native-popup-menu';

import Router from './Router';

//settingup redux
import { Provider } from 'react-redux';
import store from './store';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center', 
  },
  font: {
    fontFamily: 'open-sans-bold'
  }
})

const AppLoading = props => (
  <View style={styles.container}>
    <Spinner size='medium' />
    <Text style={{textAlign: 'center'}}>{props.text}</Text>
  </View>
)

AppLoading.propTypes = {
  text: PropTypes.string.isRequired
}

const MainApp = props => {
  return(
    <React.Fragment>
      { Object.keys(props.data).length > 0 ? <Router localUser={props.data} /> : <AppLoading text='Menyiapkan...' />}
    </React.Fragment>
  );
}

MainApp.propTypes = {
  data: PropTypes.object.isRequired
}

const MyApp = props => {
  if (!global.btoa) { global.btoa = encode; }

  const [loaded] = useFonts({
    'open-sans-reg': require('./assets/fonts/OpenSans-Regular.ttf'),
    'open-sans-bold': require('./assets/fonts/OpenSans-Bold.ttf'),
    'Roboto-Regular': require('./assets/fonts/Roboto-Regular.ttf')
  });

  const [state, setState] = React.useState({
    localUser: {},
    text: 'Loading...',
    mount: false
  });

  React.useEffect(() => {
    (async () => {
      AddNotif();

      try {
        const update = await Updates.checkForUpdateAsync();

        if (update.isAvailable) {
          setState(prevState => ({
            ...prevState,
            text: 'Updating app...'
          }));

          await Updates.fetchUpdateAsync();
          await Updates.reloadAsync();
        }

      } catch (e) {
        setState(prevState => ({
          ...prevState,
          text: 'Failed for update app'
        }));
      }

      const value = await AsyncStorage.getItem("qobUserPrivasi");
      if (value !== null) {
        const toObje  = JSON.parse(value);
        setState(prevState => ({
          ...prevState,
          localUser: {
            email: toObje.email,
            nama: toObje.nama,
            nohp: toObje.nohp,
            pin: toObje.pinMd5,
            userid: toObje.userid,
            username: toObje.username
          }
        }))
      }

    })();
  }, []);   

  const AddNotif = () => {
    Notifications.createChannelAndroidAsync('qposin-messages', {
      name: 'Chat messages',
      sound: true,
      priority: 'max',
      vibrate: [0, 250, 250, 250]
    });
  }

  return(
    <Provider store={store}>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider mapping={mapping} theme={lightTheme}>
        <MenuProvider>
          { !loaded ? <AppLoading text={state.text} /> : <MainApp data={state.localUser} /> }
        </MenuProvider>
      </ApplicationProvider>
    </Provider>
  );
}

export default MyApp;