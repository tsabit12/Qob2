import React from "react";
import { ScrollView, View, Text } from 'react-native';
import { SafeAreaView, Themed } from 'react-navigation';
import { TextField } from 'react-native-material-textfield';
import { RaisedTextButton } from 'react-native-material-buttons';
import DetailRegistrasi from "./DetailRegistrasi";
import api from "../api";
// import MaterialButton from 'react-native-material-loading-button';
import Loader from "../Loader";

class Register extends React.Component {
  static navigationOptions = {
    headerTitle: <Text style = {{fontSize: 16, fontWeight: '700'}}>Registrasi</Text>,
  };

	constructor(props) {
    super(props);

    this.onFocus = this.onFocus.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onChangeText = this.onChangeText.bind(this);
    this.onSubmitNik = this.onSubmitNik.bind(this);
    this.formatText = this.formatText.bind(this);

    this.nikRef = this.updateRef.bind(this, 'nik');

    this.state = {
      secureTextEntry: true,
      nik: '',
      errors: {},
      loading: false,
      dataDetail: {}
    };
  }

  updateRef = (name, ref) => {
    this[name] = ref;
  }

  onFocus = () => {
    let { errors = {} } = this.state;

    for (let name in errors) {
      let ref = this[name];

      if (ref && ref.isFocused()) {
        delete errors[name];
      }
    }

    this.setState({ errors });
  }

  onSubmitNik = () => {
    this.nik.blur();
  }

  onChangeText(text) {
    ['nik']
      .map((name) => ({ name, ref: this[name] }))
      .forEach(({ name, ref }) => {
        if (ref.isFocused()) {
          this.setState({ [name]: text });
        }
      });
  }
 
  onSubmit = () => {
    let errors = {};

    ['nik']
      .forEach((name) => {
        let value = this[name].value();

        if (!value) {
          errors[name] = 'Harap diisi';
        }
      });

    this.setState({ errors, submit: false });
    if (Object.keys(errors).length === 0) {
      this.setState({ loading: true });
      api.registrasi.cekKtp(this.state.nik)
        .then(res => {
          if (res === ''|| !res) {
            this.setState({ loading: false, dataDetail: {}, errors: {nik: 'Data tidak ditemukan'}  })
          }else{
            this.setState({ dataDetail: res, loading: false });
          }
        })
        .catch(err => {
          const newErrors = {
            nik: 'Terdapat kesalahan'
          };
          this.setState({ loading: false, dataDetail: {}, errors: newErrors  })
        })
    }
  }

  formatText = (text) => {
    return text.replace(/[^+\d]/g, '');
  }

  onCancelValidasi = () => {
    this.setState({ dataDetail: {} });
  }


	render() {
    let { errors, loading, nik, dataDetail } = this.state;
    const { navigation } = this.props;
    const { push } = navigation;

		return (
		  <SafeAreaView style={styles.safeContainer}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps='handled'
        >
        <Loader loading={loading} />
          <View style={styles.container}>
            <TextField
              ref={this.nikRef}
              value={nik}
              keyboardType='numeric'
              autoCorrect={false}
              onFocus={this.onFocus}
              onChangeText={this.onChangeText}
              formatText={this.formatText}
              onSubmitEditing={this.onSubmitNik}
              returnKeyType='next'
              label='Nomor Kartu Tanda Penduduk'
              error={errors.nik}
              autoFocus
            />
            <RaisedTextButton
              onPress={this.onSubmit}
              title='Cek Data Kependudukan'
              color={TextField.defaultProps.tintColor}
              titleColor='white'
              disabled={Object.keys(dataDetail).length > 0 ? true : false }
            />

            { Object.keys(dataDetail).length > 0  && 
              <DetailRegistrasi 
                listdata={dataDetail} 
                onCancel={this.onCancelValidasi}
                doneValidation={(detail) => this.props.navigation.navigate({
                  routeName: 'RegistrasiGiro',
                  params: detail
                })}
              /> 
            }
          </View>
        </ScrollView>
        <Themed.StatusBar />
		  </SafeAreaView>
		);
	}
}

let styles = {
  scroll: {
    backgroundColor: 'transparent',
  },

  container: {
    flex: 1,
  },

  contentContainer: {
    padding: 8,
  },

  safeContainer: {
    flex: 1,
  },
};


export default Register;