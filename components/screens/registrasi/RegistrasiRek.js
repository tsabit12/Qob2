import React from "react";
import { View, ImageBackground, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { Input, Text, Button } from '@ui-kitten/components';
import Loader from "../../Loader";
import { connect } from "react-redux";
import { getRek } from "../../../actions/register";

const Judul = ({ navigation }) => (
	<View>
		<Text style = {{fontSize: 16, fontWeight: '700'}}>Registrasi</Text>
		<Text>Rekening giro</Text>
	</View>
);

class RegistrasiRek extends React.Component{
	static navigationOptions = ({ navigation }) => ({
		headerTitle: <Judul navigation={navigation}/>
	})
	
	noRekRef = React.createRef();


	state = {
		noRek: '',
		errors: {},
		loading: false
	}

	componentDidMount(){
		setTimeout(() => this.noRekRef.current.focus(), 500)
	}

	onChangeText = (e, ref) => {
		const { current: {props: { name }}} = ref;
		this.setState({ [name]: e, errors: { ...this.state.errors, [name]: undefined } });
	}

	onSearch = () => {
		const errors = this.validate(this.state.noRek);
		this.setState({ errors });
		if (Object.keys(errors).length === 0) {
			this.setState({ loading: true });
			this.props.getRek(this.state.noRek)
				.then(() => this.setState({ loading: false }))
				.catch(err => this.setState({ loading: false, errors: { noRek: err.desk_mess } }))
		}
	}

	validate = (noRek) => {
		const errors = {};
		if (!noRek) errors.noRek = "Masukan nomor rekening giro";
		return errors;
	}

	render(){
		const { noRek, errors, loading } = this.state;

		return(
			<ImageBackground 
				style={styles.backgroundImage}
				source={require('../../../assets/login.jpg')}
			>
				<View style={styles.content}> 
					<Loader loading={loading} />
					<KeyboardAvoidingView 
						behavior="padding" 
						keyboardVerticalOffset={
						  Platform.select({
						     ios: () => 0,
						     android: () => 100
						  })()
						}
					>
						<View style={styles.input}>
					        <Input
					        	placeholder='Masukan nomor rekening disini'
					        	ref={this.noRekRef}
					        	name='noRek'
					        	value={noRek}
					        	onChangeText={(e) => this.onChangeText(e, this.noRekRef)}
					        	status={errors.noRek && 'danger'}
					        	onSubmitEditing={this.onSearch}
					        	keyboardType='numeric'
					        />
					        { errors.noRek && <Text style={styles.errors}>{errors.noRek}</Text>}
					    </View>
				        <Button 
				        	style={styles.button} 
				        	status='info'
				        	onPress={this.onSearch}
				        >Selanjutnya</Button>
			    	</KeyboardAvoidingView>
			    </View>
			</ImageBackground>
		);
	}
}

let styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // or 'stretch'
  },
  content:{
	flex: 1,
  	padding: 10
  },
  button: {
  	marginTop: 5
  },
  input: {
  	paddingTop: 5
  },
  errors: {
  	color: 'red',
  	marginTop: -3,
  	fontSize: 13
  }
});

export default connect(null, { getRek })(RegistrasiRek);