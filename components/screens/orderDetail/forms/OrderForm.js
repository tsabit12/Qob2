import React from "react";
import { View, Text, StyleSheet, ToastAndroid } from "react-native";
import { Input, Button, CheckBox, Select } from '@ui-kitten/components';

const dataOptions = [
  { text: 'Paket', value: 1},
  { text: 'Surat', value: 0}
];

class OrderForm extends React.Component{
	jenisRef = React.createRef();
	beratRef = React.createRef();
	panjangRef = React.createRef();
	lebarRef = React.createRef();
	tinggiRef = React.createRef();
	nilaiRef = React.createRef();

	state = {
		data: {
			jenis: '',
			berat: '0',
			panjang: '0',
			lebar: '0',
			tinggi: '0',
			nilaiVal: '0',
			checked: false,
			jenisKiriman: dataOptions[0]
		},
		errors: {}
	}

	shortToast = message => {
	    ToastAndroid.showWithGravityAndOffset(
	      message,
	      ToastAndroid.LONG,
	      ToastAndroid.BOTTOM,
	      25,
	      50
	    );
	}

	numberWithCommas = (number) => {
		return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
	}

	onChange = (e, { name }) => {
		if (name === 'jenis') {
			this.setState({ 
				data: { ...this.state.data, [name]: e },
				errors: { ...this.state.errors, [name]: undefined }
			});
		}else{
			var val = e.replace(/\D/g, '');
			var x 	= Number(val);
			const value = this.numberWithCommas(x);
			this.setState({ 
				data: { ...this.state.data, [name]: value },
				errors: { ...this.state.errors, [name]: undefined }
			});
		}
	}

	onChangeNilai = (e) => {
		var val = e.replace(/\D/g, '');
		var x 	= Number(val);
		const value = this.numberWithCommas(x);
		this.setState({ data: { ...this.state.data, nilaiVal: value }})
	}

	onSubmit = () => {
		const errors = this.validate(this.state.data);
		this.setState({ errors });
		if (Object.keys(errors).length === 0) {
			const { data } = this.state;
			const payload = {
				...data,
				itemtype: data.jenisKiriman.value
			}
			this.props.onSubmit(payload);
		}
	}

	validate = (data) => {
		const errors = {};

		if (!data.jenis) errors.jenis = "Masukan jenis kiriman";
		if (!data.nilaiVal){
			errors.nilai = "Masukan nilai";		
		}else{
			var nilaiii = data.nilaiVal.replace(/\D/g, '');
			if (data.checked && parseInt(nilaiii) < 1500) errors.nilai = "Nilai barang untuk COD minimal 1.500";
		}

		if (!data.berat){
			errors.berat = "Masukan berat kiriman";			
		}else if(data.berat <= 0){
			errors.berat = "Harus lebih dari 0";
		}
		
		//only run when jenis kiriman = paket
		if (data.jenisKiriman === dataOptions[0]) {
			if (!data.panjang){
				errors.panjang = "Masukan panjang kiriman";	
			}else{
				if (data.panjang <= 0){
					errors.panjang = "Harus lebih dari 0";		
				}else if (data.panjang > 50) {
					errors.panjang = "Maksimal 50";
				}
			}

			if (!data.lebar){
				errors.lebar = "Masukan lebar kiriman";	
			}else{
				if (data.lebar <= 0){
					errors.lebar = "Harus lebih dari 0";		
				}else if (data.lebar > 30) {
					errors.lebar = "Maksimal 30";
				}
			}

			if (!data.tinggi){
				errors.tinggi = "Masukan tinggi kiriman";
			}else{
				if (data.tinggi <= 0){
					errors.tinggi = "Harus lebih dari 0";		
				}else if (data.tinggi > 25) {
					errors.tinggi = "Maksimal 25";
				}
			}
		}

		return errors;
	}

	onCheckedChange = () => {
		this.setState({ 
			data: { 
				...this.state.data, 
				checked: !this.state.data.checked,
				codvalue: ''
			},
			errors: { ...this.state.errors, codvalue: undefined }
		});
	} 

	render(){
		const { data, errors } = this.state;
		const { isCod, invalid } = this.props;

		return(
			<React.Fragment>
				{ invalid.global && <View style={styles.message}>
					<Text style={{color: 'white'}}>{invalid.global}</Text>
				</View> }
				<View style={styles.container}>
					<Input 
				      ref={this.jenisRef}
				      placeholder='Laptop, baju, sepatu dll'
				      name='jenis'
				      label='Isi kiriman'
				      labelStyle={styles.label}
				      style={styles.input}
				      value={data.jenis}
				      onChangeText={(e) => this.onChange(e, this.jenisRef.current.props)}
				      status={errors.jenis && 'danger'}
				      onSubmitEditing={() => this.beratRef.current.focus() }
				      caption={errors.jenis && `${errors.jenis}`}
				      returnKeyType='next'
					/>
					<Input
				      placeholder='Berat kiriman dalam gram'
				      ref={this.beratRef}
				      label='Berat (gram)'
				      name='berat'
				      labelStyle={styles.label}
				      keyboardType='phone-pad'
				      style={styles.input}
				      value={data.berat}
				      status={errors.berat && 'danger'}
				      onChangeText={(e) => this.onChange(e, this.beratRef.current.props)}
				      onSubmitEditing={() => this.panjangRef.current.focus() }
				      caption={errors.berat && `${errors.berat}`}
				      returnKeyType='next'
				    />
				    { data.jenisKiriman === dataOptions[0] && <View style={styles.diametrikInput}>
				    	<Input
					      placeholder='XX (CM)'
					      ref={this.panjangRef}
					      label='Panjang (CM)'
					      name='panjang'
					      labelStyle={styles.label}
					      keyboardType='phone-pad'
					      style={styles.inputHitung}
					      value={data.panjang}
					      status={errors.panjang && 'danger'}
					      onChangeText={(e) => this.onChange(e, this.panjangRef.current.props)}
					      onSubmitEditing={() => this.lebarRef.current.focus() }
					      caption={errors.panjang && `${errors.panjang}`}
					      returnKeyType='next'
					    />
					    <Input
					      placeholder='XX (CM)'
					      ref={this.lebarRef}
					      label='Lebar (CM)'
					      name='lebar'
					      labelStyle={styles.label}
					      keyboardType='phone-pad'
					      style={styles.inputHitung}
					      value={data.lebar}
					      status={errors.lebar && 'danger'}
					      onChangeText={(e) => this.onChange(e, this.lebarRef.current.props)}
					      onSubmitEditing={() => this.tinggiRef.current.focus() }
					      caption={errors.lebar && `${errors.lebar}`}
					      returnKeyType='next'
					    />
					    <Input
					      placeholder='XX (CM)'
					      ref={this.tinggiRef}
					      label='Tinggi (CM)'
					      name='tinggi'
					      labelStyle={styles.label}
					      keyboardType='phone-pad'
					      style={styles.inputHitung}
					      value={data.tinggi}
					      status={errors.tinggi && 'danger'}
					      onChangeText={(e) => this.onChange(e, this.tinggiRef.current.props)}
					      onSubmitEditing={() => this.nilaiRef.current.focus() }
					      caption={errors.tinggi && `${errors.tinggi}`}
					      returnKeyType='next'
					    />
				    </View> }
				    <Input
				      placeholder='Masukan nilai barang'
				      ref={this.nilaiRef}
				      name='nilai'
				      label='Nilai barang'
				      labelStyle={styles.label}
				      style={styles.input}
				      value={data.nilaiVal}
				      keyboardType='numeric'
				      onChangeText={(e) => this.onChangeNilai(e)}
				      status={errors.nilai && 'danger'}
				      caption={errors.nilai && `${errors.nilai}`}
				      returnKeyType='done'
				    />
				    <Select
						label='Jenis Kiriman'
				        data={dataOptions}
				        labelStyle={styles.label}
				        style={{marginTop: 8, marginBottom: 8}}
				        name='jenisKiriman'
				        selectedOption={data.jenisKiriman}
				        onSelect={(e) => this.setState({ data: { ...this.state.data, jenisKiriman: e} })}
				    />
				    <React.Fragment>
				    	{ isCod && data.jenisKiriman === dataOptions[0] && <CheckBox
						      text='COD'
						      style={{ marginTop: 5 }}
						      textStyle={{ color: 'red'}}
						      status='warning'
						      checked={data.checked}
						      onChange={this.onCheckedChange}
						      disabled={!!invalid.global}
						    /> }
				    </React.Fragment>
				</View>
				<View style={{ margin: 10, marginTop: -6}}>
					<Button status='warning' onPress={this.onSubmit}>Selanjutnya</Button>
				</View>
			</React.Fragment>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		margin: 10,
		borderWidth: 0.9,
		borderColor: '#dee0de',
		borderRadius: 5,
		padding: 5
	},
	label: {
	  	color: 'black',
	  	fontSize: 14,
	  	fontFamily: 'open-sans-reg'
	},
	diametrikInput: {
	  	flexDirection: 'row',
		alignSelf: 'stretch',
		paddingBottom: 7,
		marginTop: 5
	},
	inputHitung: {
	  	paddingRight: 4,
	  	padding: 3,
	  	flex: 1
	},
	input: {
		marginTop: 5
	},
	message: {
		marginLeft: 10,
		marginRight: 10,
		marginTop: 10,
		borderRadius: 5,
		padding: 10,
		backgroundColor: '#95857D',
		elevation: 4
	}
})

export default OrderForm;