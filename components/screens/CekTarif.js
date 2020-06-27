import React from "react";
import { 
	View, 
	Text, 
	StyleSheet, 
	KeyboardAvoidingView, 
	ScrollView, 
	Image, 
	StatusBar, 
	Dimensions, 
	TouchableOpacity, 
	Keyboard 
} from "react-native";
import { Layout, Input, Button, ListItem, Icon,  TopNavigation, TopNavigationAction, Select } from '@ui-kitten/components';
import { Header } from 'react-navigation-stack';
import Loader from "../Loader";
import api from "../api";
import apiWs from "../apiWs";
import { SafeAreaView } from 'react-navigation';
import Constants from 'expo-constants';
import { Ionicons } from '@expo/vector-icons';

const device = Dimensions.get('window').width;

const dataOptions = [
  { text: 'Paket', value: 1},
  { text: 'Surat', value: 0}
];

const capitalize = (string) => {
	if (string) {
		return string.toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ');
	}else{
		return '-';
	}
}

const Judul = ({ navigation }) => (
	<View>
		<Text style={styles.header}>Cek Tarif</Text>
	</View>
);

const BackIcon = (style) => (
  <Icon {...style} name='arrow-back' fill='#FFF'/>
);

const renderItemAccessory = (style, title, kodepos, kota, jenis, onClick) => (
	<TouchableOpacity onPress={() => onClick(jenis, title, kodepos, kota)}>
		<Ionicons
	        style={{ backgroundColor: 'transparent' }}
	        name='ios-add-circle'
	        size={27}
	        color="green"
	    />
	</TouchableOpacity>
);

const MyStatusBar = () => (
	<View style={styles.StatusBar}>
		<StatusBar translucent barStyle="light-content" />
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
					    disabled={true}
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
		show2: false,
		keyboardOpen: false,
		jenisKiriman: dataOptions[0]
	}

	componentDidMount () {
	    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow);
	    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide);
	}

	keyboardDidShow = (event) => this.setState({ keyboardOpen: true })

	keyboardDidHide = () => this.setState({ keyboardOpen: false })

	componentWillUnmount () {
	    this.keyboardDidShowListener.remove();
	    this.keyboardDidHideListener.remove();
	}


	onClick = () => {
		const errors = this.validate(this.state.data);
		this.setState({ errors });
		if (Object.keys(errors).length === 0) {
			const { data, jenisKiriman } = this.state;
			this.setState({ loading: true });
			const payload = {
				kodePosA: data.kodeposA,
				kodePosB: data.kodeposB,
				berat: Number(data.nilai.replace(/\D/g, '')),
				nilai: Number(0),
				panjang: Number(data.panjang.replace(/\D/g, '')),
				lebar: Number(data.lebar.replace(/\D/g, '')),
				tinggi: Number(data.tinggi.replace(/\D/g, '')),
				itemtype: jenisKiriman.value
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
		if (!data.kotaAsal){
			errors.kotaAsal = "Kota asal belum dipilih";	
		}else{
			if (!data.kodeposA) errors.kotaAsal = "Alamat asal tidak lengkap";	
		}

		if (!data.kotaTujuan){
			errors.kotaTujuan = "Kota tujuan belum dipilih";	
		}else{
			if (!data.kodeposB) errors.kotaTujuan = "Alamat tujuan tidak lengkap";	
		}

		if (!data.panjang) errors.panjang = "Required";
		if (!data.tinggi) errors.tinggi = "Required";
		if (!data.lebar) errors.lebar = "Required";
		if (!data.nilai) errors.nilai = "Berat barang masih kosong";
		return errors;
	}

	numberWithCommas = (number) => {
		return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
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

	onChange = (e, { name }) => {
		if (name === 'lebar' || name === 'tinggi' || name === 'nilai' || name === 'panjang') {
			var val = e.replace(/\D/g, '');
			var x 	= Number(val);
			const value = this.numberWithCommas(x);
			this.setState({ 
				data: { ...this.state.data, [name]: value },
				errors: { ...this.state.errors, [name]: undefined}
			})
		}else{
			this.setState({ 
				data: { ...this.state.data, [name]: e },
				errors: { ...this.state.errors, [name]: undefined}
			})
		}
	}

	onChangeKotaA = (e) => {
		clearTimeout(this.timer);
		this.setState({ 
			data: { ...this.state.data, kotaAsal: e },
			errors: { ...this.state.errors, kotaAsal: undefined }
		});
		this.timer = setTimeout(() => this.getKodepos('A'), 500);
	}

	onChangeKotaB = (e) => {
		clearTimeout(this.timer);
		this.setState({ 
			data: { ...this.state.data, kotaTujuan: e },
			errors: { ...this.state.errors, kotaTujuan: undefined }
		});
		this.timer = setTimeout(() => this.getKodepos('B'), 500);	
	}

	getKodepos = (jenis) => {
		const { data } = this.state;
		// var value = null;
		if (jenis === 'A') {
			if (!data.kotaAsal || data.kotaAsal.length <= 2) return;
			let value = data.kotaAsal;
			this.setState({ loadingGet: true });
			apiWs.qob.getKodePos(value)
				.then(res => {
					const listAlamat1 = [];
					res.result.forEach(x => {
						listAlamat1.push({
							title: capitalize(`${x.kecamatan}, ${x.kabupaten}, ${x.provinsi}`),
							kodepos: x.kodepos,
							kota: x.kabupaten		
						});
					});
					this.setState({ loadingGet: false, listAlamat1, show1: true });
				}).catch(err => {
					console.log(err);
					this.setState({ loadingGet: false });
				});
		}else{
			let value = data.kotaTujuan;
			if (!data.kotaTujuan || data.kotaTujuan.length <= 2) return;
			this.setState({ loadingGet2: true });	
			apiWs.qob.getKodePos(value)
				.then(res => {
					const listAlamat2 = [];
					res.result.forEach(x => {
						listAlamat2.push({
							title: capitalize(`${x.kecamatan}, ${x.kabupaten}, ${x.provinsi}`),
							kodepos: x.kodepos,
							kota: x.kabupaten	
						});
					});
					this.setState({ loadingGet2: false, listAlamat2, show2: true });
				}).catch(err => {
					console.log(err);
					this.setState({ loadingGet2: false });
				});
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

	BackAction = () => (
  		<TopNavigationAction icon={BackIcon} onPress={() => this.props.navigation.goBack()}/>
	)


	render(){
		const { loading, success, data, errors, listAlamat1, show1, listAlamat2, show2 } = this.state;
		// console.log(this.state.listAlamat1);
		return(
			<View style={{flex: 1}}>
				<MyStatusBar />
				<TopNavigation
				    leftControl={this.BackAction()}
				    title='Cek Tarif'
				    alignment='start'
				    titleStyle={{fontFamily: 'open-sans-bold', color: '#FFF'}}
				    style={{backgroundColor: 'rgb(240, 132, 0)'}}
				/>
				<KeyboardAvoidingView 
					behavior="padding" 
					enabled={this.state.keyboardOpen}
					style={{flex: 1}}
				>
					<Loader loading={loading} />
					<ScrollView keyboardShouldPersistTaps='always'>
						<Layout style={styles.container}>
							<View style={{borderWidth: 1, borderRadius: 4, padding: 5, borderColor: '#dbdad9'}}>
								<View style={{padding: 4}}>
									<Input
								      placeholder='Masukan kecamatan/kota'
								      ref={this.kotaAsalRef}
								      name='kotaAsal'
								      label='Kecamatan/kota Asal'
								      labelStyle={styles.label}
								      style={styles.input}
								      value={data.kotaAsal}
								      status={errors.kotaAsal && 'danger'}
								      onChangeText={this.onChangeKotaA}
								      icon={(style) => this.renderIcon(style,'A')}
								    />
								    { errors.kotaAsal && <Text style={{fontSize: 12, color: 'red'}}>{errors.kotaAsal}</Text>}

								    { listAlamat1.length > 0 && show1 && 
								    	<View style={styles.scroll}>
									    	<ScrollView nestedScrollEnabled={true}>
									    		<Text style={styles.textPilih}>Pilih Alamat</Text>
											   	{ listAlamat1.map((x, i) => 
											   		<ListItem
											   			key={i}
												    	titleStyle={styles.listItemTitle}
												    	descriptionStyle={styles.listItemDescription}
												    	title={x.title}
												    	onPress={() => this.onClickGet('A', x.title, x.kodepos, x.kota)}
												    	//accessory={(e) => renderItemAccessory(e, x.title, x.kodepos, x.kota, 'A', this.onClickGet)}
													/> )}
									    	</ScrollView> 
								    	</View>}
								</View>
								<View style={{padding: 4}}>
									<Input
								      placeholder='Masukan kecamatan/kota'
								      ref={this.kotaTujuanRef}
								      name='kotaTujuan'
								      label='Kecamatan/kota Tujuan'
								      labelStyle={styles.label}
								      style={styles.input}
								      value={data.kotaTujuan}
								      status={errors.kotaTujuan && 'danger'}
								      onChangeText={this.onChangeKotaB}
								      icon={(style) => this.renderIcon(style,'B')}
								    />
								    { errors.kotaTujuan && <Text style={{fontSize: 12, color: 'red'}}>{errors.kotaTujuan}</Text>}

								     { listAlamat2.length > 0 && show2 && <View style={styles.scroll}>
								     	<ScrollView nestedScrollEnabled={true}>
									     	<Text style={styles.textPilih}>Pilih Alamat</Text>
										   	{ listAlamat2.map((x, i) => 
										   		<ListItem
										   			key={i}
											    	titleStyle={styles.listItemTitle}
											    	title={x.title}
											    	// accessory={(e) => renderItemAccessory(e, x.title, x.kodepos, x.kota, 'B', this.onClickGet)}
											    	onPress={() => this.onClickGet('B', x.title, x.kodepos, x.kota)}
												/> )}
									   	</ScrollView>
								    </View> }
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
								<View style={{padding: 4}}>
									<Select
										label='Jenis Kiriman'
								        data={dataOptions}
								        labelStyle={styles.label}
								        selectedOption={this.state.jenisKiriman}
								        onSelect={(e) => this.setState({ jenisKiriman: e })}
								        // placeholder='Pilih jenis Kiriman'
								    />
								</View>
							</View>
						</Layout>
						<View style={styles.button}>
							<Button style={{margin: 2, flex: 1}} status='warning' onPress={this.onClick}>Cek Tarif</Button>
							{ success.length > 0 && <Button style={{margin: 2, flex: 1}} status='danger' onPress={this.onReset}>Reset</Button>}
						</View>
						{ success.length > 0 && <ListTarif list={success} /> }
						{ errors.global && <Text style={{fontSize: 20, textAlign: 'center', fontFamily: 'open-sans-bold'}}>{errors.global}</Text> }
					</ScrollView>
				</KeyboardAvoidingView>
			</View>
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
	    padding: 5,
	},
	inputHitung: {
	  	paddingRight: 4,
	  	padding: 3,
	  	flex: 1
	},
	button: {
		flexDirection: 'row',
		alignSelf: 'stretch',
		marginLeft: 5,
		marginRight: 5
	},
	scroll: {
		height: device*0.5,
		//backgroundColor: '#d6d7da',
		borderWidth: 0.3
	},
	StatusBar: {
	    height: Constants.statusBarHeight,
	    backgroundColor: 'rgb(240, 132, 0)'
	},
	textPilih: {
		fontSize: 14, 
		textAlign: 'center', 
		fontWeight: '700',
		borderBottomWidth: 0.3,
		paddingBottom: 3
	}
});

export default CekTarif;