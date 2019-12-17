import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { Toggle, Layout, Input, Select, Button } from '@ui-kitten/components';
import { SafeAreaView } from 'react-navigation';
import { titleCase } from "../utils/helper";
import agama from "../json/agama";
import pekerjaan from "../json/pekerjaan";
import status from "../json/status";
import penghasilan from "../json/penghasilan";
import sumber from "../json/sumber";
import tujuan from "../json/tujuan";

const Test = ({ navigation }) => (
	<View> 
		<Text style = {{fontSize: 16, fontWeight: '700'}}>Registrasi</Text>
		<Text style={{textTransform: 'capitalize'}}>{navigation.state.params.fullname}</Text>
	</View>
);

class RegistrasiGiro extends React.Component{
	static navigationOptions = ({ navigation }) => ({
	  headerTitle: <Test navigation={navigation} />
	});

	state = {
		checked: false,
		data: {
			fullname: titleCase(this.props.navigation.state.params.fullname),
			kepercayaan: '',
			pekerjaan: '',
			status: '',
			penghasilan: '',
			sumber: '',
			tujuan: ''
		},
		errors: {}
	}

	componentDidMount(){
		this.props.navigation.setParams({
			myTitle: this.props.navigation.state.params.fullname
		})
	}

	onCheck = () => {
		const { checked } = this.state;
		if (checked) {
			this.setState({ checked: false });
		}else{
			this.setState({ checked: true });
		}
	}

	onSelectAgama = (e) => this.setState({ data: { ...this.state.data, kepercayaan: e.value }, errors: { ...this.state.errors, kepercayaan: undefined }})
	onSelectJob = (e) => this.setState({ data: { ...this.state.data, pekerjaan: e.value }, errors: { ...this.state.errors, pekerjaan: undefined }})
	onSelectStatus = (e) => this.setState({ data: { ...this.state.data, status: e.value }, errors: { ...this.state.errors, status: undefined }})
	onSelectSumber = (e) => this.setState({ data: { ...this.state.data, sumber: e.value }, errors: { ...this.state.errors, sumber: undefined }})
	onSelectTujuan = (e) => this.setState({ data: { ...this.state.data, tujuan: e.value }, errors: { ...this.state.errors, tujuan: undefined }})
	onSelectPenghasilan = (e) => this.setState({ data: { ...this.state.data, penghasilan: e.value }, errors: { ...this.state.errors, penghasilan: undefined }})

	onChange = (e) => this.setState({ data: { ...this.state.data, fullname: e }})

	onSubmit = () => {
		const errors = this.validate(this.state.data);
		this.setState({ errors });
	}

	validate = (data) => {
		const errors = {};
		if (!data.kepercayaan) errors.kepercayaan = "Harap pilih kepercayaan";
		if (!data.pekerjaan) errors.pekerjaan = "Harap pilih pekerjaan";
		if (!data.status) errors.status = "Harap pilih status";
		if (!data.penghasilan) errors.penghasilan = "Harap pilih penghasilan";
		if (!data.sumber) errors.sumber = "Harap pilih sumber penghasilan";
		if (!data.tujuan) errors.tujuan = "Harap pilih tujuan penggunaan";
		return errors;
	}

	render(){
		const { checked, data, errors } = this.state;
		return(
			<SafeAreaView style={styles.safeContainer}>
				<Layout style={styles.container}>
		        	<Toggle
				      text='Saya sudah memiliki akun giro'
				      checked={checked}
				      onChange={this.onCheck}
				    />
			    </Layout>
				    <ScrollView keyboardShouldPersistTaps='handled'>
				    { !checked && <View style={styles.containerForm}>
				    	<Input
					      placeholder='Place your Text'
					      label='Nama'
					      value={data.fullname}
					      onChangeText={this.onChange}
					      disabled={true}
					      style={styles.select}
					    />
					    <Select
					    	label='Kepercayaan'
					        data={agama}
					        placeholder='Pilih Kepercayaan'
					        onSelect={this.onSelectAgama}
					        style={styles.select}
					        status={errors.kepercayaan && 'danger' }
					    />
					    { errors.kepercayaan && <Text style={{color: 'red'}}>{errors.kepercayaan}</Text>}
					    <Select
					    	label='Pekerjaan'
					        data={pekerjaan}
					        placeholder='Pilih Jenis Pekerjaan'
					        onSelect={this.onSelectJob}
					        style={styles.select}
					        status={errors.pekerjaan && 'danger' }
					    />
					    { errors.pekerjaan && <Text style={{color: 'red'}}>{errors.pekerjaan}</Text>}
					    <Select
					    	label='Status Perkawinan'
					        data={status}
					        placeholder='Pilih Status'
					        onSelect={this.onSelectStatus}
					        style={styles.select}
					        status={errors.status && 'danger' }
					    />
					    { errors.status && <Text style={{color: 'red'}}>{errors.status}</Text>}
					    <Select
					    	label='Penghasilan'
					        data={penghasilan}
					        placeholder='Pilih penghasilan pertahun'
					        onSelect={this.onSelectPenghasilan}
					        style={styles.select}
					        status={errors.penghasilan && 'danger' }
					    />
					    { errors.penghasilan && <Text style={{color: 'red'}}>{errors.penghasilan}</Text>}
					    <Select
					    	label='Sumber Penghasilan'
					        data={sumber}
					        placeholder='Pilih Sumber Penghasilan'
					        onSelect={this.onSelectSumber}
					        style={styles.select}
					        status={errors.sumber && 'danger' }
					    />
					    { errors.sumber && <Text style={{color: 'red'}}>{errors.sumber}</Text>}
					    <Select
					    	label='Tujuan'
					        data={tujuan}
					        placeholder='Pilih Tujuan Penggunaan Dana'
					        onSelect={this.onSelectTujuan}
					        style={styles.select}
					        status={errors.tujuan && 'danger' }
					    />
					    { errors.tujuan && <Text style={{color: 'red'}}>{errors.tujuan}</Text>}
					    <Button style={styles.button} size='medium' onPress={this.onSubmit}>Daftar</Button>
				    </View> }
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
  select: {
  	paddingTop: 7
  },
  button: {
    marginTop: 8,

  },
});

export default RegistrasiGiro;