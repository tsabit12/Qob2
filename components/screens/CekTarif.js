import React from "react";
import { View, Text, StyleSheet, KeyboardAvoidingView, ScrollView, Image, Platform } from "react-native";
import { Layout, Input, Button, ListItem } from '@ui-kitten/components';
import { Header } from 'react-navigation-stack';
import Loader from "../Loader";
import api from "../api";
import { SafeAreaView } from 'react-navigation';

const Judul = ({ navigation }) => (
	<View>
		<Text style={styles.header}>Cek Tarif</Text>
	</View>
);

const numberWithCommas = (number) => {
	return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const ListTarif = ({ list }) => {
	return(
		<View>
		{list.map((x, i) => {
			const parsing = x.split('*');
			let produk = parsing[0];
			if (x.length > 0) {
				const tarif = x.split('|');
				let totalTarif = Math.floor(tarif[4]);
				return(
					<ListItem
						key={i}
					    title={`Rp. ${numberWithCommas(totalTarif)}`}
					    description={`${produk}`}
					/>
				);
			}
		})}
	</View>
	)
} 

class CekTarif extends React.Component{
	static navigationOptions = ({ navigation }) => ({
		headerTitle: <Judul navigation={navigation}/>
	})

	kotaAsalRef = React.createRef();
	kotaTujuanRef = React.createRef();
	panjangRef = React.createRef();
	lebarRef = React.createRef();
	tinggiRef = React.createRef();
	nilaiRef = React.createRef();

	state = {
		loading: false,
		success: false,
		data: {
			kotaAsal: '',
			kotaTujuan: '',
			panjang: '',
			lebar: '',
			tinggi: '',
			nilai: '',
			kotaA: '',
			kotaB: '',
			kodeposA: '',
			kodeposB: '',
		},
		errors: {},
		loadingGet: false,
		loadingGet2: false,
		listAlamat1: [],
		listAlamat2: [],
		show1: false,
		show2: false
	}

	onClick = () => {
		const errors = this.validate(this.state.data);
		this.setState({ errors });
		if (Object.keys(errors).length === 0) {
			this.setState({ loading: true });
			const payload = {
				kodePosA: this.state.data.kodeposA,
				kodePosB: this.state.data.kodeposB,
				berat: this.state.data.nilai
			}

			api.qob.getTarif(payload)
				.then(res => {
					///console.log(res);
					// console.log(res);
					const response = res.split('#');
					this.setState({ loading: false, success: response });
					// this.setState({ success: response });
				})
				.catch(err => {
					// console.log(err);
					this.setState({ loading: false, success:[], errors: {global: 'Data tarif tidak ditemukan'}});
				});
		}
	}

	validate = (data) => {
		const errors = {};
		if (!data.kotaAsal) errors.kotaAsal = "Kota asal belum dipilih";
		if (!data.kotaTujuan) errors.kotaTujuan = "Kota tujuan belum dipilih";
		if (!data.panjang) errors.panjang = "Required";
		if (!data.tinggi) errors.tinggi = "Required";
		if (!data.lebar) errors.lebar = "Required";
		if (!data.nilai) errors.nilai = "Berat barang masih kosong";
		return errors;
	}

	onReset = () => this.setState({ 
		success: [],
		data: {
			kotaAsal: '',
			kotaTujuan: '',
			panjang: '',
			lebar: '',
			tinggi: '',
			nilai: '',
			kotaA: '',
			kotaB: '',
			kodeposA: '',
			kodeposB: '',
		}
	})

	onChange = (e, { name }) => this.setState({ data: { ...this.state.data, [name]: e }})

	onChangeKotaA = (e) => {
		clearTimeout(this.timer);
		this.setState({ data: { ...this.state.data, kotaAsal: e }});
		this.timer = setTimeout(() => this.getKodepos('A'), 500);
	}

	onChangeKotaB = (e) => {
		clearTimeout(this.timer);
		this.setState({ data: { ...this.state.data, kotaTujuan: e }});
		this.timer = setTimeout(() => this.getKodepos('B'), 500);	
	}

	getKodepos = (jenis) => {
		const { data } = this.state;
		// var value = null;
		if (jenis === 'A') {
			let value = data.kotaAsal;
			if (value.length >= 6) {
				this.setState({ loadingGet: true });
				api.qob.getAlamat(value)
					.then(res => {
						const listAlamat1 = [];
						res.forEach(x => {
							listAlamat1.push({
								title: x.text.replace('   ',''),
								kodepos: x.id,
								kota: x.kota		
							});
						});
						this.setState({ loadingGet: false, listAlamat1, show1: true });
					}).catch(err => {
						console.log(err);
						this.setState({ loadingGet: false });
					});
			}
		}else{
			let value = data.kotaTujuan;
			if (value.length >= 6) {
				this.setState({ loadingGet2: true });	
				api.qob.getAlamat(value)
					.then(res => {
						const listAlamat2 = [];
						res.forEach(x => {
							listAlamat2.push({
								title: x.text.replace('   ',''),
								kodepos: x.id,
								kota: x.kota		
							});
						});
						this.setState({ loadingGet2: false, listAlamat2, show2: true });
					}).catch(err => {
						console.log(err);
						this.setState({ loadingGet2: false });
					});
			}
		}

	}

	renderIcon = (style, jenis) => {
		const { loadingGet, loadingGet2 } = this.state;
		return(
			<React.Fragment>
				{ jenis === 'A' ?
					<Image
				      style={{width: 20, height: 20}} 
				      source={ loadingGet ? require('../icons/loaderInput.gif') : require('../icons/location.png')}
				    /> : 
				    <Image
				      style={{width: 20, height: 20}} 
				      source={ loadingGet2 ? require('../icons/loaderInput.gif') : require('../icons/location.png')}
				    />
				}
		    </React.Fragment>
		);
	} 

	onClickGet = (jenis, title, kodepos, kota) => {
		if (jenis === 'A') {
			this.setState({
				data: {
					...this.state.data,
					kotaAsal: title,
					kodeposA: kodepos,
					kotaA: kota
				},
				show1: false,
				errors: {
					...this.state.errors,
					kotaAsal: undefined
				}
			})
			this.kotaTujuanRef.current.focus();
		}else{
			this.setState({
				data: {
					...this.state.data,
					kotaTujuan: title,
					kodeposB: kodepos,
					kotaB: kota
				},
				show2: false,
				errors: {
					...this.state.errors,
					kotaTujuan: undefined
				}
			})
			this.panjangRef.current.focus();
		}
	}



	render(){
		const { loading, success, data, errors, listAlamat1, show1, listAlamat2, show2 } = this.state;
		// console.log(this.state.listAlamat1);
		return(
			<SafeAreaView>
				<KeyboardAvoidingView 
					behavior="padding" 
					keyboardVerticalOffset={
					  Platform.select({
					     ios: () => 0,
					     android: () => 90
					  })()
					}
				>
					<Loader loading={loading} />
					<ScrollView keyboardShouldPersistTaps='always'>
						<Layout style={styles.container}>
							<View style={{padding: 4}}>
								<Input
							      placeholder='Kota/kab/kec/kel'
							      ref={this.kotaAsalRef}
							      name='kotaAsal'
							      label='Kota Asal (Min 6 karakter)'
							      labelStyle={styles.label}
							      style={styles.input}
							      value={data.kotaAsal}
							      status={errors.kotaAsal && 'danger'}
							      onChangeText={this.onChangeKotaA}
							      icon={(style) => this.renderIcon(style,'A')}
							    />
							    { errors.kotaAsal && <Text style={{fontSize: 12, color: 'red'}}>{errors.kotaAsal}</Text>}

							    { listAlamat1.length > 0 && show1 && <ScrollView style={styles.scroll} nestedScrollEnabled={true}>
								   	{ listAlamat1.map((x, i) => 
								   		<ListItem
								   			key={i}
									    	style={{backgroundColor: '#d6d7da'}}
									    	titleStyle={styles.listItemTitle}
									    	descriptionStyle={styles.listItemDescription}
									    	title={x.title}
									    	onPress={() => this.onClickGet('A', x.title, x.kodepos, x.kota)}
										/> )}
							    </ScrollView> }
							</View>
							<View style={{padding: 4}}>
								<Input
							      placeholder='Kota/kab/kec/kel'
							      ref={this.kotaTujuanRef}
							      name='kotaTujuan'
							      label='Kota Tujuan (Min 6 karakter)'
							      labelStyle={styles.label}
							      style={styles.input}
							      value={data.kotaTujuan}
							      status={errors.kotaTujuan && 'danger'}
							      onChangeText={this.onChangeKotaB}
							      icon={(style) => this.renderIcon(style,'B')}
							    />
							    { errors.kotaTujuan && <Text style={{fontSize: 12, color: 'red'}}>{errors.kotaTujuan}</Text>}

							     { listAlamat2.length > 0 && show2 && <ScrollView style={styles.scroll} nestedScrollEnabled={true}>
								   	{ listAlamat2.map((x, i) => 
								   		<ListItem
								   			key={i}
									    	style={{backgroundColor: '#d6d7da'}}
									    	titleStyle={styles.listItemTitle}
									    	title={x.title}
									    	onPress={() => this.onClickGet('B', x.title, x.kodepos, x.kota)}
										/> )}
							    </ScrollView> }
							</View>
							<View style={styles.hitung}>
							    <Input
							      placeholder='XX (CM)'
							      ref={this.panjangRef}
							      label='Panjang'
							      name='panjang'
							      labelStyle={styles.label}
							      style={styles.inputHitung}
							      keyboardType='numeric'
							      value={data.panjang}
							      status={errors.panjang && 'danger'}
							      onChangeText={(e) => this.onChange(e, this.panjangRef.current.props)}
							      onSubmitEditing={() => {
							      	this.lebarRef.current.focus();
							      	this.setState({ errors: {...this.state.errors, panjang: undefined }})
							      }}
							    />
							    <Input
							      placeholder='XX (CM)'
							      ref={this.lebarRef}
							      label='Lebar'
							      name='lebar'
							      labelStyle={styles.label}
							      style={styles.inputHitung}
							      keyboardType='numeric'
							      style={styles.inputHitung}
							      value={data.lebar}
							      status={errors.lebar && 'danger'}
							      onChangeText={(e) => this.onChange(e, this.lebarRef.current.props)}
							      onSubmitEditing={() => {
							      	this.tinggiRef.current.focus();
							      	this.setState({ errors: {...this.state.errors, lebar: undefined }})
							      }}
							    />
							    <Input
							      placeholder='XX (CM)'
							      ref={this.tinggiRef}
							      label='Tinggi'
							      name='tinggi'
							      labelStyle={styles.label}
							      keyboardType='numeric'
							      style={styles.inputHitung}
							      value={data.tinggi}
							      status={errors.tinggi && 'danger'}
							      onChangeText={(e) => this.onChange(e, this.tinggiRef.current.props)}
							      onSubmitEditing={() => {
							      	this.nilaiRef.current.focus();
							      	this.setState({ errors: {...this.state.errors, tinggi: undefined }})
							      }}
							    />
							</View>
							<View style={{padding: 4}}>
								<Input
							      placeholder='Masukan berat barang (GRAM)'
							      ref={this.nilaiRef}
							      name='nilai'
							      label='Berat'
							      keyboardType='numeric'
							      labelStyle={styles.label}
							      style={styles.input}
							      value={data.nilai}
							      status={errors.nilai && 'danger'}
							      onChangeText={(e) => this.onChange(e, this.nilaiRef.current.props)}
							      onSubmitEditing={() => this.onClick()}
							    />
							    { errors.nilai && <Text style={{fontSize: 12, color: 'red'}}>{errors.nilai}</Text>}
							</View>
							<View style={styles.button}>
								<Button style={{margin: 2, flex: 1}} status='info' onPress={this.onClick}>Cek Tarif</Button>
								{ success.length > 0 && <Button style={{margin: 2, flex: 1}} status='danger' onPress={this.onReset}>Reset</Button>}
							</View>
						</Layout>
						{ success.length > 0 && <ListTarif list={success} /> }
						{ errors.global && <Text style={{fontSize: 20, textAlign: 'center', fontFamily: 'open-sans-bold'}}>{errors.global}</Text> }
					</ScrollView>
				</KeyboardAvoidingView>
			</SafeAreaView>
		);
	}
}

const styles = StyleSheet.create({
	header: {
	  	fontFamily: 'open-sans-bold',
	  	fontSize: 16,
	  	fontWeight: '700'
	},
	hitung: {
	  	flexDirection: 'row',
		alignSelf: 'stretch',
		paddingBottom: 7
	},
	label: {
	  	color: 'black',
	  	fontSize: 15,
	  	fontFamily: 'open-sans-reg'
	},
	container: {
	    padding: 10,
	},
	inputHitung: {
	  	paddingRight: 4,
	  	padding: 3,
	  	flex: 1
	},
	button: {
		flexDirection: 'row',
		alignSelf: 'stretch'
	},
	scroll: {
		height: 100,
		paddingBottom: 50
	}
});

export default CekTarif;