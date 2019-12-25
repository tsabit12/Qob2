import React from 'react';
import { Provider } from 'react-redux'
import Router from './Router';
import store from './store';
import { Text, StyleSheet, View } from "react-native";
// import { View, Text } from 'react-native';
// import { createAppContainer } from 'react-navigation';
// import { createStackNavigator } from 'react-navigation-stack';
// import Home from "./components/screens/Home";
// // import Register from "./components/screens/Register"; 
// // import RegistrasiGiro from "./components/screens/RegistrasiGiro";
// import IndexRegister from "./components/screens/registrasi/IndexRegister";
// import { ApplicationProvider, Layout } from '@ui-kitten/components';
// import { mapping, light as lightTheme } from '@eva-design/eva';
import { encode } from 'base-64';
import * as Font from "expo-font";
 
const LoadFont = () => (
  <View style={styles.container}>
    <Text style={{textAlign: 'center'}}>Loading font...</Text>
  </View>
);

class App extends React.Component{
  state = {
    fontLoaded: false,
  };

  async componentDidMount(){
    if (!global.btoa) { global.btoa = encode; }
    await Font.loadAsync({
      'open-sans-reg': require('./assets/fonts/OpenSans-Regular.ttf'),
      'open-sans-bold': require('./assets/fonts/OpenSans-Bold.ttf'),
    });
    this.setState({ fontLoaded: true });
  }

  render(){
    const { fontLoaded } = this.state;
    return(
      <Provider store={store}>
        { fontLoaded ? <Router /> : <LoadFont /> }
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // marginTop: Expo.Constants.statusBarHeight
    justifyContent: 'center',
    padding: 20
  },
})

export default App;