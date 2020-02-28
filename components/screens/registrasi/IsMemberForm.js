import React from "react";
import { View, Text } from "react-native";
import Constants from 'expo-constants';
import { Input, Select, Button } from '@ui-kitten/components';
import styles from "./styles";
import kepercayaan from "../../json/agama";
import pekerjaan from "../../json/pekerjaan";
import status from "../../json/status";
import penghasilan from "../../json/penghasilan";
import sumber from "../../json/sumber";
import tujuan from "../../json/tujuan";

class IsMemberForm extends React.Component{
	nmOlshopRef = React.createRef();
	namaPanggilanRef = React.createRef();
	noHpRef = React.createRef();
	npwpRef = React.createRef();
	emailRef = React.createRef();
	kodeposRef = React.createRef();

	state = {
		data: {
			noHp: '',
			npwp: '',
			imei: Constants.deviceId,
			email: '',
			kodepos: '',
			nmOlshop: '',
			kepercayaan: '',
			pekerjaan: '',
			status: '',
			penghasilan: '',
			sumber: '',
			tujuan: '',
			namaPanggilan: ''
		},
		errors: {}
	}

	componentDidMount(){
		setTimeout(() => this.namaPanggilanRef.current.focus(), 500)
	}

	onSelectText = ({ name, value }) => {
		// const key = this.getKeyByName(name, value);
		this.setState({ 
			data: { ...this.state.data, [name]: value },
		})
	}

	onSubmit = () => {
		const errors = this.validate(this.state.data);
		this.setState({ errors });
		if (Object.keys(errors).length === 0) {
			this.props.onSubmit(this.state.data);
		}
	}

	onChangeText = (e, ref) => {
		const { current: {props: { name }}} = ref;
		this.setState({ data: { ...this.state.data, [name]: e }})
	} 

	validate = (data) => {
		const errors = {};
		if (!data.noHp) errors.noHp = "Nomor handphone tidak boleh kosong";
		if (!data.npwp) errors.npwp = "Npwp tidak boleh kosong";
		if (!data.email) errors.email = "Npwp tidak boleh kosong";
		if (!data.nmOlshop) errors.nmOlshop = "Nama online shop tidak boleh kosong";
		if (!data.namaPanggilan) errors.namaPanggilan = "Nama panggilan tidak boleh kosong";
		if (!data.kodepos) errors.kodepos = "Kodepos tidak boleh kosong";
		if (!data.kepercayaan) errors.kepercayaan = "Kepercayaan belum dipilih";
		if (!data.pekerjaan) errors.pekerjaan = "Pekerjaan belum dipilih";
		if (!data.status) errors.status = "Status perkawinan belum dipilih";
		if (!data.penghasilan) errors.penghasilan = "Penghasilan belum dipilih";
		if (!data.sumber) errors.sumber = "Penghasilan belum dipilih";
		if (!data.tujuan) errors.tujuan = "Tujuan penghasilan belum dipilih";
		return errors;
	}

	render(){
		const { data, errors } = this.state;
		return(
			<View style={{borderWidth: 0.6, padding: 5, borderRadius: 5, borderColor: '#d5d7db'}}>
				<Input
			    	ref={this.namaPanggilanRef}
			    	name='namaPanggilan'
					placeholder='Masukan nama panggilan anda'
					label='Nama Panggilan'
					value={data.namaPanggilan}
					labelStyle={styles.label}
					onChangeText={(e) => this.onChangeText(e, this.namaPanggilanRef)}
					status={errors.namaPanggilan && 'danger'}
					onSubmitEditing={() => this.nmOlshopRef.current.focus() }
				/>
				{ errors.namaPanggilan && <Text style={styles.labelErr}>{errors.namaPanggilan}</Text> }
				<Input
			    	ref={this.nmOlshopRef}
					placeholder='Masukan nama online shop'
					label='Nama Online Shop'
					value={data.nmOlshop}
					name='nmOlshop'
					labelStyle={styles.label}
					onChangeText={(e) => this.onChangeText(e, this.nmOlshopRef)}
					status={errors.nmOlshop && 'danger'}
					onSubmitEditing={() => this.noHpRef.current.focus() }
				/>
				{ errors.nmOlshop && <Text style={styles.labelErr}>{errors.nmOlshop}</Text> }
				<Input
			    	ref={this.noHpRef}
					placeholder='628/08 XXXX'
					label='Nomor Hp'
					name='noHp'
					value={data.noHp}
					labelStyle={styles.label}
					onChangeText={(e) => this.onChangeText(e, this.noHpRef)}
					keyboardType='phone-pad'
					status={errors.noHp && 'danger'}
					onSubmitEditing={() => this.npwpRef.current.focus() }
				/>
				{ errors.noHp && <Text style={styles.labelErr}>{errors.noHp}</Text> }
				<Input
				  ref={this.npwpRef}
				  label='NPWP'
				  name='npwp'
				  labelStyle={styles.label}
				  placeholder='Masukan nomor NPWP'
				  value={data.npwp}
				  onChangeText={(e) => this.onChangeText(e, this.npwpRef)}
				  keyboardType='phone-pad'
				  status={errors.npwp && 'danger'}
				  onSubmitEditing={() => this.emailRef.current.focus() }
				/>
				{ errors.npwp && <Text style={styles.labelErr}>{errors.npwp}</Text> }
				<Input
				  ref={this.emailRef}
				  value={data.email}
				  name='email'
				  label='Email'
				  labelStyle={styles.label}
				  placeholder='example@example.com'
				  onChangeText={(e) => this.onChangeText(e, this.emailRef)}
				  status={errors.email && 'danger'}
				  onSubmitEditing={() => this.kodeposRef.current.focus() }
				/>
				 { errors.email && <Text style={styles.labelErr}>{errors.email}</Text> }
				<Input
				  ref={this.kodeposRef}
				  value={data.kodepos}
				  name='kodepos'
				  label='Kodepos'
				  placeholder='Masukan kodepos'
				  keyboardType='numeric'
				  labelStyle={styles.label}
				  onChangeText={(e) => this.onChangeText(e, this.kodeposRef)}
				  status={errors.kodepos && 'danger'}
				/>
				{ errors.kodepos && <Text style={styles.labelErr}>{errors.kodepos}</Text> }
				<Select
			    	label='Agama'
			        data={kepercayaan}
			        labelStyle={styles.label}
			        placeholder='Pilih agama'
			        onSelect={this.onSelectText}
			        status={errors.kepercayaan && 'danger'}
			    />
			     <Select
			    	label='Pekerjaan'
			        data={pekerjaan}
			        placeholder='Pilih Jenis Pekerjaan'
			        labelStyle={styles.label}
			        onSelect={this.onSelectText}
			        status={errors.pekerjaan && 'danger'}
			    />
			    <Select
			    	label='Status Perkawinan'
			        data={status}
			        placeholder='Pilih Status'
			        labelStyle={styles.label}
			        onSelect={this.onSelectText}
			        status={errors.status && 'danger'}
			    />
			    <Select
			    	label='Penghasilan'
			        data={penghasilan}
			        placeholder='Pilih penghasilan pertahun'
			        onSelect={this.onSelectText}
			        labelStyle={styles.label}
			        status={errors.penghasilan && 'danger'}
			    />
			    <Select
			    	label='Sumber Penghasilan'
			        data={sumber}
			        placeholder='Pilih Sumber Penghasilan'
			        labelStyle={styles.label}
			        onSelect={this.onSelectText}
			        status={errors.sumber && 'danger'}
			    />
			    <Select
			    	label='Tujuan'
			        data={tujuan}
			        placeholder='Pilih Tujuan Penggunaan Dana'
			        onSelect={this.onSelectText}
			        labelStyle={styles.label}
			        status={errors.tujuan && 'danger'}
			    />
				<Button 
					style={styles.button}
					onPress={this.onSubmit}
				>Daftar</Button>
			</View>
		);
	}
}

export default IsMemberForm;