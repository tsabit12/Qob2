import React from "react";
import { ScrollView, View, Text } from 'react-native';
import { SafeAreaView, Themed } from 'react-navigation';
import { TextField } from 'react-native-material-textfield';
import { RaisedTextButton } from 'react-native-material-buttons';


class Register extends React.Component {
  static navigationOptions = {
    title: 'Registrasi',
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
      nik: '0',
      errors: {},
      submit: false
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
      this.setState({ submit: true });
    }
  }

  formatText = (text) => {
    return text.replace(/[^+\d]/g, '');
  }

	render() {
    let { errors, submit, nik } = this.state;

		return (
		  <SafeAreaView style={styles.safeContainer}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps='handled'
        >
          <View style={styles.container}>
            { submit && <Text>Oke</Text> }
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
            />
            <RaisedTextButton
              onPress={this.onSubmit}
              title='Cek Data Kependudukan'
              color={TextField.defaultProps.tintColor}
              titleColor='white'
            />
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