import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions
} from "react-native";


const iconAkun = require('../../assets/profile.png');
var Device = Dimensions.get('window').width;

export default class Akun extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Image
            style={styles.imageTopRow}
            source={iconAkun}
            resizeMode = 'cover'
          />
        </View>
        <View style={styles.container}>
          <Text>NAMA</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width : Device * 0.25,
  },
  imageContainer: {
    marginTop: 10,
    marginLeft: 10,
    justifyContent: 'flex-start'
  },
  imageTopRow: {
    height: 80,
    width: 80,
    borderRadius: 80,
    borderWidth: 0.5,
    borderColor: 'black'
  }
});