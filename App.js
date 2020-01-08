import React from 'react';
import { Provider } from 'react-redux'
import Router from './Router';
import store from './store';
import { Text, StyleSheet, View } from "react-native";
import { ApplicationProvider, IconRegistry, Icon, Spinner } from '@ui-kitten/components';
import { mapping, light as lightTheme } from '@eva-design/eva'; 
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { encode } from 'base-64';
import * as Font from "expo-font";
 
const LoadFont = () => (
    <Spinner size='medium' />
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
      'Roboto-Regular': require('./assets/fonts/Roboto-Regular.ttf'),
    });
    this.setState({ fontLoaded: true });
  }

  render(){
    const { fontLoaded } = this.state;
    return(
      <Provider store={store}>
        <IconRegistry icons={EvaIconsPack} />
        <ApplicationProvider mapping={mapping} theme={lightTheme}>
        { fontLoaded ? <Router /> : <View style={styles.container}><LoadFont /></View> }
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