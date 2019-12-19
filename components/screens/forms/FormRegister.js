import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import kepercayaan from "../../json/agama";
import pekerjaan from "../../json/pekerjaan";
import status from "../../json/status";
import penghasilan from "../../json/penghasilan";
import sumber from "../../json/sumber";
import tujuan from "../../json/tujuan";
import { Layout, Input, Select, Button, Icon } from '@ui-kitten/components';

const gender = [
	{text: 'Laki-Laki', value: 'P'},
	{text: 'Permepuan', value: 'W'}
];

class FormRegister extends React.Component{
	state = {
		data: {
			fullname: this.props.ktp.fullname,
			gender: this.props.ktp.gender,
			kepercayaan: this.props.dataForm.kepercayaan ? this.props.dataForm.kepercayaan : '',
			pekerjaan: this.props.dataForm.pekerjaan ? this.props.dataForm.pekerjaan : '',
			status: this.props.dataForm.status ? this.props.dataForm.status : '',
			penghasilan: this.props.dataForm.penghasilan ? this.props.dataForm.penghasilan : '',
			sumber: this.props.dataForm.sumber ? this.props.dataForm.sumber : '',
			tujuan: this.props.dataForm.tujuan ? this.props.dataForm.tujuan : '',
			noHp: this.props.dataForm.noHp ? this.props.dataForm.noHp : '',
			email: this.props.dataForm.noHp ? this.props.dataForm.noHp : '',
			imei: this.props.dataForm.imei ? this.props.dataForm.imei : '',
			namaPanggilan: this.props.dataForm.namaPanggilan ? this.props.dataForm.namaPanggilan : ''
		},
		selectedOption: {
			kepercayaan: this.props.selected.kepercayaan ? this.props.selected.kepercayaan : -1,
			pekerjaan: this.props.selected.pekerjaan ? this.props.selected.pekerjaan : -1,
			status: this.props.selected.status ? this.props.selected.status : -1,
			penghasilan: this.props.selected.penghasilan ? this.props.selected.penghasilan : -1,
			sumber: this.props.selected.sumber ? this.props.selected.sumber : -1,
			tujuan: this.props.selected.tujuan ? this.props.selected.tujuan : -1
		},
		errors: {},
		secureTextEntry: true
	}

	componentDidMount(){
		this.props.navigation.setParams({
			form2: false
		})
	}

	onSelectText = ({ name, value }) => {
		const key = this.getKeyByName(name, value);
		this.setState({ 
			data: { ...this.state.data, [name]: value },
			selectedOption: {
				...this.state.selectedOption,
				[name]: key
			},
			errors: {...this.state.errors, [name]: undefined }
		})
	} 

	getKeyByName = (name, value) => {
		var key = -1;
		if (name === 'kepercayaan') {
			key = kepercayaan.findIndex(x => x.value === value);
		}else if (name === 'pekerjaan') {
			key = pekerjaan.findIndex(x => x.value === value);
		}else if (name === 'status') {
			key = status.findIndex(x => x.value === value);
		}else if (name === 'penghasilan'){
			key = penghasilan.findIndex(x => x.value === value);
		}else if(name === 'sumber'){
			key = sumber.findIndex(x => x.value === value);
		}else if(name === 'tujuan'){
			key = tujuan.findIndex(x => x.value === value);
		}
		return key;
	}


	onChangeUsername = (e) => this.setState({ data: { ...this.state.data, username: e }})
	onChangePassword = (e) => this.setState({ data: { ...this.state.data, password: e }})
	onChangeEmail = (e) => this.setState({ data: { ...this.state.data, email: e }})
	onChangeImei = (e) => this.setState({ data: { ...this.state.data, imei: e }})
	
	onSubmit = () => {
		const errors = this.validate(this.state.data);
		this.setState({ errors });
		if (Object.keys(errors).length === 0) {
			this.props.submit(this.state.data, this.state.selectedOption);
		}
	}

	validate = (data) => {
		const errors = {};
		if (!data.kepercayaan) errors.kepercayaan = "Harap pilih kepercayaan";
		if (!data.pekerjaan) errors.pekerjaan = "Harap pilih pekerjaan";
		if (!data.status) errors.status = "Harap pilih status";
		if (!data.penghasilan) errors.penghasilan = "Harap pilih penghasilan";
		if (!data.sumber) errors.sumber = "Harap pilih sumber penghasilan";
		if (!data.tujuan) errors.tujuan = "Harap pilih tujuan penggunaan";
		if (!data.noHp) errors.noHp = "Nomor handphone belum diisi";
		if (!data.email) errors.email = "Alamat email belum diisi";
		if (!data.imei) errors.imei = "IMEI harap diisi";
		if (!data.namaPanggilan) errors.namaPanggilan = "Masukan nama panggilan anda";
		return errors;
	}

	onChangePhone = (e) => this.setState({ data: { ...this.state.data, noHp: e }})
	onChangeName = (e) => this.setState({ data: { ...this.state.data, namaPanggilan: e }})

	render(){
		const { errors, data, selectedOption } = this.state;
		const genderProps = this.props.ktp.gender; 
		return(
			<View>
				<Input
					placeholder='Nama Lengkap'
					label='Nama'
					labelStyle={{color: 'black'}}
					value={this.props.ktp.fullname}
					disabled={true}
					style={styles.select}
				/>
				<Select
			    	label='Jenis Kelamin'
			        data={gender}
			        labelStyle={{color: 'black'}}
			        style={styles.select}
			        selectedOption={genderProps === 'Laki-Laki' ? gender[0] : gender[1]}
			        disabled={true}
			    />
			    <Input
			    	ref='namaPanggilan'
					placeholder='Masukan nama panggilan anda'
					label='Nama Panggilan*'
					labelStyle={{color: 'black'}}
					value={data.namaPanggilan}
					style={styles.select}
					onChangeText={this.onChangeName}
					status={errors.namaPanggilan && 'danger' }
					onSubmitEditing={() => this.refs.noHp.focus() }
				/>
				{ errors.namaPanggilan && <Text style={{color: 'red'}}>{errors.namaPanggilan}</Text>}
			    <Input
			    	ref='noHp'
					placeholder='628/08 XXXX'
					label='Nomor Hp *'
					value={data.noHp}
					labelStyle={{color: 'black'}}
					style={styles.select}
					onChangeText={this.onChangePhone}
					keyboardType='numeric'
					status={errors.noHp && 'danger' }
					onSubmitEditing={() => this.refs.email.focus() }
				/>
				{ errors.noHp && <Text style={{color: 'red'}}>{errors.noHp}</Text>}
				<Input
				  value={data.email}
				  ref='email'
				  label='Email *'
				  labelStyle={{color: 'black'}}
				  placeholder='example@example.com'
				  style={styles.select}
				  onChangeText={this.onChangeEmail}
				  status={errors.email && 'danger' }
				  onSubmitEditing={() => this.refs.imei.focus() }
				/>
				{ errors.email && <Text style={{color: 'red'}}>{errors.email}</Text>}
				<Input
				  value={data.imei}
				  label='IMEI phone *'
				  placeholder='Masukan imei smartphone anda'
				  style={styles.select}
				  keyboardType='numeric'
				  labelStyle={{color: 'black'}}
				  onChangeText={this.onChangeImei}
				  ref='imei'
				  status={errors.imei && 'danger' }
				/>
				{ errors.email && <Text style={{color: 'red'}}>{errors.email}</Text>}
			    <Select
			    	label='Kepercayaan *'
			        data={kepercayaan}
			        labelStyle={{color: 'black'}}
			        selectedOption={kepercayaan[selectedOption.kepercayaan]}
			        placeholder='Pilih Kepercayaan'
			        onSelect={this.onSelectText}
			        style={styles.select}
			        status={errors.kepercayaan && 'danger' }
			    />
			    { errors.kepercayaan && <Text style={{color: 'red'}}>{errors.kepercayaan}</Text>}
			    <Select
			    	label='Pekerjaan *'
			        data={pekerjaan}
			        placeholder='Pilih Jenis Pekerjaan'
			        labelStyle={{color: 'black'}}
			        selectedOption={pekerjaan[selectedOption.pekerjaan]}
			        onSelect={this.onSelectText}
			        style={styles.select}
			        status={errors.pekerjaan && 'danger' }
			    />
			    { errors.pekerjaan && <Text style={{color: 'red'}}>{errors.pekerjaan}</Text>}
			    <Select
			    	label='Status Perkawinan *'
			        data={status}
			        placeholder='Pilih Status'
			        labelStyle={{color: 'black'}}
			        onSelect={this.onSelectText}
			        style={styles.select}
			        selectedOption={status[selectedOption.status]}
			        status={errors.status && 'danger' }
			    />
			    { errors.status && <Text style={{color: 'red'}}>{errors.status}</Text>}
			    <Select
			    	label='Penghasilan *'
			        data={penghasilan}
			        placeholder='Pilih penghasilan pertahun'
			        onSelect={this.onSelectText}
			        labelStyle={{color: 'black'}}
			        selectedOption={penghasilan[selectedOption.penghasilan]}
			        style={styles.select}
			        status={errors.penghasilan && 'danger' }
			    />
			    { errors.penghasilan && <Text style={{color: 'red'}}>{errors.penghasilan}</Text>}
			    <Select
			    	label='Sumber Penghasilan *'
			        data={sumber}
			        placeholder='Pilih Sumber Penghasilan'
			        onSelect={this.onSelectText}
			        labelStyle={{color: 'black'}}
			        style={styles.select}
			        selectedOption={sumber[selectedOption.sumber]}
			        status={errors.sumber && 'danger' }
			    />
			    { errors.sumber && <Text style={{color: 'red'}}>{errors.sumber}</Text>}
			    <Select
			    	label='Tujuan *'
			        data={tujuan}
			        placeholder='Pilih Tujuan Penggunaan Dana'
			        onSelect={this.onSelectText}
			        labelStyle={{color: 'black'}}
			        selectedOption={tujuan[selectedOption.tujuan]}
			        style={styles.select}
			        status={errors.tujuan && 'danger' }
			    />
			    { errors.tujuan && <Text style={{color: 'red'}}>{errors.tujuan}</Text>}
			    <Button style={styles.button} size='medium' onPress={this.onSubmit}>Selanjutnya</Button>
			</View>
		);
	}
}

const styles = StyleSheet.create({
  select: {
  	paddingTop: 7
  },
  button: {
    marginTop: 8,

  }
});

export default FormRegister;