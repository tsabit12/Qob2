import React from "react";
import { View, ScrollView, KeyboardAvoidingView, Platform, StatusBar } from "react-native";
import styles from "./styles";
import { Layout, Text, Input, Button, CheckBox, Icon, TopNavigation, TopNavigationAction } from '@ui-kitten/components';
import { Header } from 'react-navigation-stack';

const optionsData = [
  { text: 'Surat', value: 0 },
  { text: 'Paket', value: 1 }
];

const BackIcon = (style) => (
  <Icon {...style} name='arrow-back' fill='#FFF'/>
);


const MyStatusBar = () => (
	<View style={styles.StatusBar}>
		<StatusBar translucent barStyle="light-content" />
	</View>
);


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
			berat: '0',
			panjang: '0',
			lebar: '0',
			tinggi: '0',
			nilai: '0',
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

	onChange = (e, { name }) => {
		if (name === 'jenis') {
			this.setState({ data: { ...this.state.data, [name]: e }});
		}else{
			var val = e.replace(/\D/g, '');
			var x 	= Number(val);
			const value = this.numberWithCommas(x);
			this.setState({ data: { ...this.state.data, [name]: value }});
		}
	}


	onSubmit  = () => {
		const errors = this.validate(this.state.data);
		this.setState({ errors });
		if (Object.keys(errors).length === 0) {
			const { data } = this.state;
			const payload = {
				isiKiriman: data.jenis,
				berat: data.berat.replace(/\D/g, ''),
				panjang: data.panjang.replace(/\D/g, ''),
				lebar: data.lebar.replace(/\D/g, ''),
				tinggi: data.tinggi.replace(/\D/g, ''),
				nilai: data.nilai.replace(/\D/g, ''),
				cod: data.checked
			};

			this.props.navigation.navigate({
				routeName: 'OrderPenerima',
				params: {
					deskripsiOrder: payload
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
		if (!data.nilai) errors.nilai = "Masukan nilai";

		if (!data.berat){
			errors.berat = "Masukan berat kiriman";			
		}else if(data.berat <= 0){
			errors.berat = "Harus lebih dari 0";
		}
		
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
		return errors;
	}

	onCheckedChange = () => this.setState({ data: { ...this.state.data, checked: !this.state.data.checked }})

	BackAction = () => (
  		<TopNavigationAction icon={BackIcon} onPress={() => this.props.navigation.goBack()}/>
	)

	render(){
		const { data, errors  } = this.state;
		return(
			<View style={{flex: 1}}>
				<MyStatusBar />
				<TopNavigation
				    leftControl={this.BackAction()}
				    subtitle='Kelola deskripsi kiriman'
				    title='Order'
				    alignment='start'
				    titleStyle={{fontFamily: 'open-sans-bold', color: '#FFF'}}
				    style={{backgroundColor: 'rgb(240, 132, 0)'}}
				    // subtitle={this.props.navigation.state.params.namaLengkap}
				    subtitleStyle={{color: '#FFF'}}
				/>
				<KeyboardAvoidingView 
					style={{flex:1}} 
					behavior="padding" 
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
						      caption={errors.panjang && `${errors.panjang}`}
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
						      caption={errors.lebar && `${errors.lebar}`}
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
						      caption={errors.tinggi && `${errors.tinggi}`}
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
						      value={data.nilai}
						      keyboardType='numeric'
						      onChangeText={(e) => this.onChange(e, this.nilaiRef.current.props)}
						      status={errors.nilai && 'danger'}
						      caption={errors.nilai && `${errors.nilai}`}
						    />
						</View>
						<CheckBox
					      text='Cod'
					      style={{ marginLeft: 5, marginTop: -5, paddingBottom: 5 }}
					      textStyle={{ color: 'red'}}
					      status='warning'
					      checked={data.checked}
					      onChange={this.onCheckedChange}
					    />
					    <View style={{height: 10}} />
					</Layout>
					<View style={{margin: 6, marginTop: -5}}>
						<Button style={{margin: 2}} status='warning' onPress={this.onSubmit}>Selanjutnya</Button>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
			</View>
		);
	}
}

export default IndexOrder;