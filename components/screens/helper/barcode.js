import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, Dimensions, StatusBar, TouchableOpacity } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Icon } from '@ui-kitten/components';
import { connect } from "react-redux";
import { lacakKiriman, removeErrors } from "../../../actions/search";

const { width } = Dimensions.get('window');

const barcode = (props) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  // const { navigate } = useNavigation();

  useEffect(() => {
    (async () => {
      StatusBar.setHidden(true);
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  //unmount
  useEffect( () => () => StatusBar.setHidden(false), [] );

  const handleBarCodeScanned = ({ data, type }) => {
    setScanned(true);
    props.removeErrors();
    setTimeout(() => {
      props.lacakKiriman(data)
      .then(() => StatusBar.setHidden(false))
      .catch(err => StatusBar.setHidden(false));
      props.navigation.navigate({
        routeName: 'LacakBarcode',
        params: {
          externalId: data
        }
      })
    }, 100);
    // alert(`No Resi ${data} terdeteksi ${type}`);
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
      >
          <View style={{alignItems: 'flex-end', flex: 1, margin: 10}}>
            <TouchableOpacity onPress={() => props.navigation.navigate({ routeName: 'IndexSearch' })}>
              <Icon name='close-outline' width={25} height={25} fill='#FFF' />
            </TouchableOpacity>
          </View>
        <View style={{ alignItems: 'center'}}>
          <Text style={{color: 'white', textAlign: 'center'}}>Scan barcode untuk melacak kiriman anda</Text>
          <View style={{height: 20}}/>
        </View>
      </BarCodeScanner>
      {scanned && (
        <Button title={'Ulangi Scan Barcode'} onPress={() => setScanned(false)} />
      )}
    </View>
  );
}

export default connect(null, { lacakKiriman, removeErrors })(barcode);

const opacity = 'rgba(0, 0, 0, .6)';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000'
  },
  layerTop: {
    flex: 1,
    backgroundColor: opacity
  },
  layerCenter: {
    flex: 1,
    flexDirection: 'row'
  },
  layerLeft: {
    flex: 1,
    backgroundColor: opacity
  },
  focused: {
    flex: 10
  },
  layerRight: {
    flex: 1,
    backgroundColor: opacity
  },
  layerBottom: {
    flex: 1,
    backgroundColor: opacity
  },
  cameraContainer: {
      marginHorizontal: 0, marginLeft: 0, marginStart: 0,
      paddingHorizontal: 0, paddingLeft: 0, paddingStart: 0,
      height: '115%',
      padding: 0
  }
});

