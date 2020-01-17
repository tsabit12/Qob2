import React from "react";
import { View, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import styles from "./styles";
import { Layout, Text, Input, Button, CheckBox } from '@ui-kitten/components';
import { Header } from 'react-navigation-stack';

const optionsData = [
  { text: 'Surat', value: 0 },
  { text: 'Paket', value: 1 }
];


const Judul = () => (
	<View>
		<Text style={styles.header}>Order</Text>
		<Text style={{fontFamily: 'open-sans-reg'}}>Kelola deskripsi kiriman</Text>
	</View>
);

class IndexOrder extends React.Component{
	static navigationOptions = {
		headerTitle: <Judul/>
	};

	jenisRef = React.createRef();
	beratRef = React.createRef();
	panjangRef = React.createRef();
	lebarRef = React.createRef();
	tinggiRef = React.createRef();
	nilaiRef = React.createRef();
	// tipeKirimanRef = React.createRef();

	state = {
		data: {
			jenis: '',
			berat: '',
			panjang: '0',
			lebar: '0',
			tinggi: '0',
			nilaiVal: '',
			nilai: '',
			checked: false
		},
		errors: {}
	}

	componentDidMount(){
		setTimeout(() => this.jenisRef.current.focus(), 500);	
	}

	numberWithCommas = (number) => {
		return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
	}

	onChange = (e, { name }) => this.setState({ data: { ...this.state.data, [name]: e }})

	onChangeNilai = (e) => {
		var val = e.replace(/\D/g, '');
		var x 	= Number(val);
		const value = this.numberWithCommas(x);
		this.setState({ data: { ...this.state.data, nilaiVal: value, nilai: val }})
	}

	onSubmit  = () => {
		const errors = this.validate(this.state.data);
		this.setState({ errors });
		if (Object.keys(errors).length === 0) {
			this.props.navigation.navigate({
				routeName: 'OrderPenerima',
				params: {
					deskripsiOrder: this.state.data
				}
			})
		}else{

			if (errors.jenis){
				this.jenisRef.current.focus();
			}else if(errors.berat){
				this.beratRef.current.focus();
			}else if (errors.panjang) {
				this.panjangRef.current.focus();
			}else if (errors.lebar) {
				this.lebarRef.current.focus();
			}else if (errors.tinggi) {
				this.tinggiRef.current.focus();
			}else{
				this.nilaiRef.current.focus();
			}
		}
	}

	// onSelectText = (e) => {
	// 	this.beratRef.current.focus();
	// 	this.setState({ data: { ...this.state.data, tipe: e.value }});
	// }

	validate = (data) => {
		const errors = {};
		if (!data.jenis) errors.jenis = "Masukan jenis kiriman";
		if (!data.berat) errors.berat = "Masukan berat kiriman";
		if (!data.panjang) errors.panjang = "Masukan panjang kiriman";
		if (!data.lebar) errors.lebar = "Masukan lebar kiriman";
		if (!data.tinggi) errors.tinggi = "Masukan tinggi kiriman";
		if (!data.nilai) errors.nilai = "Masukan nilai";
		return errors;
	}

	onCheckedChange = () => this.setState({ data: { ...this.state.data, checked: !this.state.data.checked }})

	render(){
		const { data, errors  } = this.state;
		return(
				<KeyboardAvoidingView 
					style={{flex:1}} 
					behavior="padding" 
					keyboardVerticalOffset = {Header.HEIGHT + 40}
					enabled
				>
				<ScrollView keyboardShouldPersistTaps='always'>
					<Layout style={styles.container}>
						<View style={{padding: 10}}>
							<Input
						      placeholder='Laptop, baju, sepatu dll'
						      ref={this.jenisRef}
						      name='jenis'
						      label='Isi kiriman'
						      labelStyle={styles.label}
						      style={styles.input}
						      value={data.jenis}
						      onChangeText={(e) => this.onChange(e, this.jenisRef.current.props)}
						      status={errors.jenis && 'danger'}
						      onSubmitEditing={() => this.beratRef.current.focus() }
						      caption={errors.jenis && `${errors.jenis}`}
						    />
						    <Input
						      placeholder='Berat kiriman dalam gram'
						      ref={this.beratRef}
						      label='Berat'
						      name='berat'
						      labelStyle={styles.label}
						      keyboardType='numeric'
						      style={styles.input}
						      value={data.berat}
						      status={errors.berat && 'danger'}
						      onChangeText={(e) => this.onChange(e, this.beratRef.current.props)}
						      onSubmitEditing={() => this.panjangRef.current.focus() }
						      caption={errors.berat && `${errors.berat}`}
						    />
					    </View>
					    <View style={styles.hitung}>
						    <Input
						      placeholder='XX (CM)'
						      ref={this.panjangRef}
						      label='Panjang (CM)'
						      name='panjang'
						      labelStyle={styles.label}
						      keyboardType='numeric'
						      style={styles.inputHitung}
						      value={data.panjang}
						      status={errors.panjang && 'danger'}
						      onChangeText={(e) => this.onChange(e, this.panjangRef.current.props)}
						      onSubmitEditing={() => this.lebarRef.current.focus() }
						    />
						    <Input
						      placeholder='XX (CM)'
						      ref={this.lebarRef}
						      label='Lebar (CM)'
						      name='lebar'
						      labelStyle={styles.label}
						      keyboardType='numeric'
						      style={styles.inputHitung}
						      value={data.lebar}
						      status={errors.lebar && 'danger'}
						      onChangeText={(e) => this.onChange(e, this.lebarRef.current.props)}
						      onSubmitEditing={() => this.tinggiRef.current.focus() }
						    />
						    <Input
						      placeholder='XX (CM)'
						      ref={this.tinggiRef}
						      label='Tinggi (CM)'
						      name='tinggi'
						      labelStyle={styles.label}
						      keyboardType='numeric'
						      style={styles.inputHitung}
						      value={data.tinggi}
						      status={errors.tinggi && 'danger'}
						      onChangeText={(e) => this.onChange(e, this.tinggiRef.current.props)}
						      onSubmitEditing={() => this.nilaiRef.current.focus() }
						    />
					    </View>
					    <View style={{padding: 4}}>
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
						      onSubmitEditing={this.onSubmit}
						      caption={errors.nilai && `${errors.nilai}`}
						    />
						</View>
						<CheckBox
					      text={data.checked ? 'Cod' : 'Non cod'}
					      style={{ marginLeft: 5, marginTop: -5, paddingBottom: 5 }}
					      textStyle={{ color: data.checked ? 'blue': 'red', fontFamily: 'open-sans-reg'}}
					      checked={data.checked}
					      onChange={this.onCheckedChange}
					    />
					    <Button style={{margin: 2}} onPress={this.onSubmit}>Selanjutnya</Button>
					</Layout>
				</ScrollView>
			</KeyboardAvoidingView>
		);
	}
}

export default IndexOrder;