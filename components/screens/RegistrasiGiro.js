import React from "react";
import { View, Text, ScrollView, StyleSheet, Image } from "react-native";
import { SafeAreaView } from 'react-navigation';
import { Ionicons } from '@expo/vector-icons';
import FormRegister from "./forms/FormRegister";
import { Button, ButtonGroup } from '@ui-kitten/components';
import { HeaderBackButton } from "react-navigation-stack";
import RegisterUsername from "./forms/RegisterUsername";
import md5 from "react-native-md5";
import { convertDate } from "../utils/helper";

const Judul = ({ navigation }) => (
	<View> 
		<Text style = {{fontSize: 16, fontWeight: '700'}}>Registrasi</Text>
		{ navigation.state.params.form2 ? 
			<Text>Username & Password</Text> : 
			<Text style={{textTransform: 'capitalize'}}>{navigation.state.params.fullname}</Text>}
	</View>
)

class RegistrasiGiro extends React.Component{
	static navigationOptions = ({ navigation }) => ({
	  headerTitle: <Judul navigation={navigation} />,
	  headerLeft: <HeaderBackButton onPress={() => 
	  	{ navigation.state.params.form2 ? 
	  		navigation.getParam('backToForm1')() : 
	  		navigation.navigate({
	  			routeName: 'Register'
	  		}) 
	  	} 
	  }/>
	});

	state = {
		submitform1: false,
		data1: {
			birtDate: this.props.navigation.state.params.birtDate,
			birthPlace: this.props.navigation.state.params.birthPlace,
			nik: this.props.navigation.state.params.nik,
			motherName: this.props.navigation.state.params.motherName,
			kecamatan: this.props.navigation.state.params.kec,
			kabupaten: this.props.navigation.state.params.city,
			provinsi: this.props.navigation.state.params.prov,
			rw: this.props.navigation.state.params.rw,
			rt: this.props.navigation.state.params.rt,
			alamat: this.props.navigation.state.params.alamat,
			desa: this.props.navigation.state.params.desa
		},
		selected: {}
	}
    	
	async componentDidMount(){
		this.props.navigation.setParams({
			myTitle: this.props.navigation.state.params.fullname,
			backToForm1: this.onBackForm1
		});
	}

	onSubmit = (value, selected) => {
		const { data1 } = this.state;
		this.setState({ 
			submitform1: true,  
			data1: Object.assign(data1, value), 
			selected: selected 
		});	
		this.props.navigation.setParams({
			form2: true
		})
	} 

	onBackForm1 = () => {
		this.setState({ submitform1: false });
		this.props.navigation.setParams({
			form2: false
		})
	}

	onSubmitUsername = (data) => {
		const { data1 } = this.state;
		this.setState({ data1: Object.assign(data1, data) });
		const pass 		= md5.hex_md5(data.password);
		const tglLahir 	= convertDate(data1.birtDate);
		const kd 		= 1;
		const param1 	= `${data.username}|${pass}|${data1.fullname}|${data1.namaPanggilan}|${data1.noHp}|${data1.email}|${data1.npwp}|${data1.imei}`;
		const param2 	= `${data1.birthPlace}|${tglLahir}|${data1.gender}|${data1.kepercayaan}|${data1.pekerjaan}|${data1.status}|${kd}|${data1.nik}|30/12/2050|${data1.alamat}|${data1.rt}|${data1.rw}|${data1.desa}|${data1.kecamatan}|${data1.kabupaten}|${data1.provinsi}|${data1.kodepos}|${data1.tujuan}|${data1.sumber}|${data1.penghasilan}|${data1.motherName}`;
		const payload  	= {
			params1: param1,
			params2: param2
		};
		console.log(payload);
	}

	render(){
		const { submitform1 } = this.state;
		// console.log(this.state.data1);
		return(
			<SafeAreaView style={styles.safeContainer}>
				 <ScrollView keyboardShouldPersistTaps='handled'>
				    <View style={styles.containerForm}>
				    	{ !submitform1 ? 
				    		<FormRegister 
				    			ktp={this.props.navigation.state.params} 
				    			submit={this.onSubmit} 
				    			dataForm={this.state.data1}
				    			selected={this.state.selected} 
				    			navigation={this.props.navigation}
				    		/> : 
				    		<RegisterUsername submit={this.onSubmitUsername} />
				    	}
				    </View>
			    </ScrollView>
		    </SafeAreaView>
		);
	}
}


const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'flex-start'
  },
  containerForm: {
  	padding: 16,
  	marginTop: -15,
  	textTransform: 'capitalize'
  },
  safeContainer: {
    flex: 1,
  },
  buttonGroup: {
    flex: 1,
    flexDirection: 'row',
    paddingTop: 7
  },
});


export default RegistrasiGiro;