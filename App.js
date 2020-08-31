import React from "react";
import { View, Text, StyleSheet, AsyncStorage, Vibration, Animated, ActivityIndicator } from "react-native";
import { useFonts } from '@use-expo/font';
import { Notifications } from 'expo';
import { Root } from "native-base";
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
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

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
  },
  notification: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: '#ffae00',
    margin: 7,
    padding: 7,
    borderRadius: 3,
    elevation: 2,
    justifyContent: 'center'
  },
  textNotif:{
    color: '#FFFF',
    fontSize: 16,
    fontWeight: 'bold'
  }
})

const AppLoading = props => (
  <View style={styles.container}>
    <ActivityIndicator size="large" />
    <Text style={{textAlign: 'center'}}>{props.text}</Text>
  </View>
)

AppLoading.propTypes = {
  text: PropTypes.string.isRequired
}

const MyApp = props => {
  if (!global.btoa) { global.btoa = encode; }

  const [loaded] = useFonts({
    'open-sans-reg': require('./assets/fonts/OpenSans-Regular.ttf'),
    'open-sans-bold': require('./assets/fonts/OpenSans-Bold.ttf'),
    'Roboto-Regular': require('./assets/fonts/Roboto-Regular.ttf'),
    Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
    Roboto: require('native-base/Fonts/Roboto.ttf'),
     ...Ionicons.font
  });

  const [state, setState] = React.useState({
    localUser: {},
    text: 'Loading...',
    mount: false,
    notif: false,
    bounceValueNotif: new Animated.Value(200)
  });

  React.useEffect(() => {
    (async () => {
      AddNotif();
      if (loaded) { //only fetch update when font is loaded
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

        setState(prevState => ({
          ...prevState,
          mount: true
        }))
      }
    })();
  }, [loaded]);   

  React.useEffect(() => {
    if (state.notif) {
      Animated.spring(state.bounceValueNotif, {
          toValue: 0,
          useNativeDriver: true
        }).start(); 

        setTimeout(function() {
          Animated.spring(state.bounceValueNotif, {
            toValue: 200,
            useNativeDriver: true
          }).start(); 

          setTimeout(function() {
            setState(state => ({
              ...state,
              notif: false
            }))
          }, 10);
        }, 5000);

        // dispatch()
    }
  }, [state.notif])

  React.useEffect(() => {
    if (state.mount) {
      console.log('oke');
    }
  }, [state.mount]);

  const AddNotif = () => {
    Notifications.createChannelAndroidAsync('qposin-messages', {
      name: 'Chat messages',
      sound: true,
      priority: 'max',
      vibrate: [0, 250, 250, 250]
    });

    setTimeout(function() {
      Notifications.addListener(_handleNotification);
    }, 10);
  }

  const _handleNotification = (notif) => {
    Vibration.vibrate();
    setState(state => ({
      ...state,
      notif: true
    }))
  }

  return(
    <Root>
      <Provider store={store}>
        <IconRegistry icons={EvaIconsPack} />
        <ApplicationProvider mapping={mapping} theme={lightTheme}>
          <MenuProvider>
            { !state.mount ? <AppLoading text={state.text} /> : <Router /> }
          </MenuProvider>
        </ApplicationProvider>
      </Provider>
      { state.notif && <Animated.View style={[styles.notification, {transform: [{translateX: state.bounceValueNotif }] }]}>
        <Text style={styles.textNotif}>Notifikasi</Text>
        <Text style={{color: '#FFFF'}}>Kamu mempunyai notifikasi baru <Text style={{color: 'blue'}}>cek disini</Text></Text>
      </Animated.View> }
      <StatusBar style="auto" />
    </Root>
  );
}

export default MyApp;