import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Input, Text, Button } from '@ui-kitten/components';
import Loader from "../../Loader";
import { connect } from "react-redux";
import { searchKtp } from "../../../actions/register";
import Modal from "../../Modal";

const Judul = () => (
	<Text>Registrasi</Text>
);

class IndexRegister extends React.Component{
	static navigationOptions = {
		
		headerTitle: null,
		headerMode: 'none',
		header: null
	};

	state = {
		nik: '',
		success: false,
		errors: {},
		loading: false,
		checked: false,
		visible: false
	}

	onChange = (e) => this.setState({ nik: e })

	onSearchKtp = () => {
		const errors = this.validate(this.state.nik);
		this.setState({ errors });
		if (Object.keys(errors).length === 0) {
			this.setState({ loading: true });
			this.props.searchKtp(this.state.nik)
				.then(() => {
					this.props.navigation.navigate({
						routeName: 'RegistrasiKtp'
					});
					this.setState({ loading: false })
				})
				.catch(err => this.setState({ errors: {global: 'Data tidak ditemukan'}, visible: true, loading: false }))
		}
	}

	validate = (nik) => {
		const errors = {};
		if (!nik) errors.nik = "Nomor Nik belum dilengkapi";
		return errors;
	}

	onCheckedChange = () => {
		if (!this.state.checked) {
			this.setState({ checked: true });
		}else{
			this.setState({ checked: false });
		}
	}

	render(){
		// console.log(this.props.detail);
		const { nik, success, errors, loading } = this.state;
		return(
			<View style={styles.container}>
				<Loader loading={loading} />
				{ errors.global && 
					<Modal 
						loading={this.state.visible} 
						text={errors.global} 
						handleClose={() => this.setState({ visible: false })} 
					/>}
			    <View style={styles.centerForm}>
				    <Input
						placeholder='Masukan nomor KTP'
						value={nik}
						onChangeText={this.onChange}
						status={errors.nik && 'danger' }
					/>
					{ errors.nik && <Text style={{color: 'red'}}>{errors.nik}</Text>}
					<Button 
						style={styles.button}
						disabled={success}
						onPress={this.onSearchKtp}
					>Cari</Button>
					<View style={{flexDirection: 'row', top: 8}}>
						<Text>Atau jika memiliki akun Pos Giro </Text>
						<Text 
				        	style={{color: 'blue', fontStyle: 'italic'}}
				        	onPress={() => {
				        		this.props.navigation.navigate({
					        		routeName: 'RegistrasiRek'
					        	});
					        	this.setState({ errors: {}})
				        	}}
				        >
				        	disini
				        </Text>
			        </View>
				</View>
			</View>
		);
	}
}

function mapStateToProps(state) {
	return {
		detail: state.register.ktp
	}
}	

export default connect(mapStateToProps, { searchKtp })(IndexRegister);

const styles = StyleSheet.create({
	container: {
	  flex: 1,
	  backgroundColor: '#FF5000',
	  alignItems: 'center',
	  justifyContent: 'center',
	},
	button: {
    backgroundColor:"#fb5b5a",
    height:50,
    alignItems:"center",
    justifyContent:"center",
    marginTop:10,
    marginBottom:10
  },
  });
  