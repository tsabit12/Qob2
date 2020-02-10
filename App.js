import React from 'react';
import { Provider } from 'react-redux'
import Router from './Router';
import store from './store';
import { Text, StyleSheet, View } from "react-native";
import { ApplicationProvider, IconRegistry, Icon, Spinner } from '@ui-kitten/components';
import { mapping, light as lightTheme } from '@eva-design/eva'; 
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { encode } from 'base-64';
import { Notifications } from 'expo';
import * as Font from "expo-font";
import * as Permissions from 'expo-permissions';
import Dialog from "react-native-dialog";
import { MenuProvider } from 'react-native-popup-menu';

const ModalDialog = ({ onPress }) => (
  <Dialog.Container visible={true}>
    <Dialog.Title>Notifications</Dialog.Title>
        <View style={{margin: 17}}>
            <Text>Dirver pickup ditemukan</Text>
        </View>
        <Dialog.Button label="Oke" onPress={() => onPress()}/>
    </Dialog.Container>
);  

const LoadFont = () => (
    <Spinner size='medium' />
);

class App extends React.Component{
  state = {
    fontLoaded: false,
    notification:  {},
    visible: false
  };

  async componentDidMount(){
    this._notificationSubscription = Notifications.addListener(this.handleNotification);
    if (!global.btoa) { global.btoa = encode; }
    await Font.loadAsync({
      'open-sans-reg': require('./assets/fonts/OpenSans-Regular.ttf'),
      'open-sans-bold': require('./assets/fonts/OpenSans-Bold.ttf'),
      'Roboto-Regular': require('./assets/fonts/Roboto-Regular.ttf'),
    });
    this.setState({ fontLoaded: true });

    const { status } = await Permissions.getAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      const response = await Permissions.askAsync(Permissions.LOCATION);
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
        { visible && <ModalDialog onPress={this.onPressOke} /> }
        <MenuProvider>
          { fontLoaded ? <Router /> : <View style={styles.container}><LoadFont /></View> }
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