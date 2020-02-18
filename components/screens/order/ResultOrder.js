import React from "react";
import { View, Text, StatusBar, ScrollView, TouchableOpacity } from "react-native";
import styles from "./styles";
import { Button, Icon, TopNavigation, TopNavigationAction, CheckBox } from '@ui-kitten/components';
import Loader from "../../Loader";
import Modal from "../../Modal";
import { curdateTime } from "../../utils/helper";
import api from "../../api";
import apiWs from "../../apiWs";
import Dialog from "react-native-dialog";
import { connect } from "react-redux";


const MyStatusBar = () => (
	<View style={styles.StatusBar}>
		<StatusBar translucent barStyle="light-content" />
	</View>
);

const BackIcon = (style) => (
  <Icon {...style} name='arrow-back' fill='#FFF'/>
);

const capitalize = (string) => {
	return string.toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ');
}

const numberWithCommas = (number) => {
	return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const RenderInfo = ({ params, onSimpan, checked, onCheckedChange, userid }) => (
	<View style={{margin: 10, borderWidth: 1, borderColor: '#cbccc4', flex: 1}}>
		<View style={styles.labelTarif}>
			<Text style={{
				fontFamily: 'open-sans-reg', 
				fontWeight: '700',
				textAlign: 'center',
				fontSize: 16,
				paddingBottom: 12,
				paddingTop: 12
			}}>{params.selectedTarif.description}</Text>
		</View>
		<View style={{padding: 10, flex: 1}}>
			<View style={styles.viewResult}>
				<Text style={styles.labelInformasi}>Pengirim</Text>
				<Text style={styles.subTitle}>{capitalize(params.pengirimnya.nama)}</Text>
			</View>
			<View style={styles.viewResult}>
				<Text style={styles.labelInformasi}>Alamat Pengirim</Text>
				<Text style={styles.subTitle}>
					{params.pengirimnya.alamat}, 
					{params.pengirimnya.kel}, 
					{params.pengirimnya.kec}, 
					{params.pengirimnya.kota}, 
					{params.pengirimnya.provinsi} ({params.pengirimnya.kodepos})
				</Text>
			</View>
			<View style={styles.viewResult}>
				<Text style={styles.labelInformasi}>Penerima</Text>
				<Text style={styles.subTitle}>{capitalize(params.deskripsiPenerima.nama)}</Text>
			</View>
			<View style={styles.viewResult}>
				<Text style={styles.labelInformasi}>Alamat Penerima</Text>
				<Text style={styles.subTitle}>
					{params.deskripsiPenerima.alamatUtama}, 
					{params.deskripsiPenerima.kelurahan},  
					{params.deskripsiPenerima.kecamatan},  
					{params.deskripsiPenerima.kabupaten},  
					{params.deskripsiPenerima.provinsi} ({params.deskripsiPenerima.kodepos})
				</Text>
			</View>
			<View style={styles.viewResult}>
				<Text style={styles.labelInformasi}>Isi Kiriman</Text>
				<Text style={styles.subTitle}>{params.deskripsiOrder.isiKiriman}</Text>
			</View>
			{ userid.substring(0, 3) !== '540' && <View style={styles.viewResult}>
				<Text style={styles.labelInformasi}>Jenis Kiriman</Text>
				<Text style={styles.subTitle}>{ params.deskripsiOrder.cod ? 'Cod' : 'Non Cod' }</Text>
			</View> }
			<View style={styles.viewResult}>
				<Text style={styles.labelInformasi}>Nilai Barang</Text>
				<Text style={styles.subTitle}>Rp {numberWithCommas(params.deskripsiOrder.nilai)}</Text>
			</View>
			<View style={styles.viewResult}>
				<Text style={styles.labelInformasi}>Estimasi Tarif</Text>
				<Text style={styles.subTitle}>Rp {numberWithCommas(params.selectedTarif.tarif)}</Text>
			</View>
			<View 
				style={{
					flex: 1, 
					flexDirection: 'row', 
					marginBottom: 5, 
					marginTop: 5, 
					borderWidth: 0.8,
					borderColor: '#9e9d9d',
					flexWrap: 'wrap',
					borderRadius: 5,
					backgroundColor: '#dbdad7',
					alignItems: 'flex-start',
					padding: 6}}>
				<CheckBox
			      status='warning'
			      style={{marginRight: 6}}
			      checked={checked}
			      onChange={onCheckedChange}
			    />
			    <Text style={{fontFamily: 'open-sans-reg'}}>Saya menyetujui</Text>
				<Text style={{color: '#0000FF', fontFamily: 'open-sans-reg'}} onPress={() => alert("Oke")}> Syarat dan ketentuan </Text>
				<Text style={{fontFamily: 'open-sans-reg'}}>yang berlaku di PT.POS INDONESIA</Text>
		    </View>
		    <View style={{width: '40%'}}>
				<Button status='warning' onPress={() => onSimpan()}>Simpan</Button>
			</View>
		</View>
	</View>	
);

class ResultOrder extends React.Component{
	state = {
		loading: false,
		success: false,
		payload: {},
		errors: {},
		idOrder: '',
		visible: true,
		checked: false
	}

	async componentDidMount(){
		const { dataLogin } = this.props;
		const { params } = this.props.navigation.state;
		const { selectedTarif, deskripsiOrder, pengirimnya, deskripsiPenerima } = params;
		const codOrNot = deskripsiOrder.cod ? '1' : '0';		
		
		let param1 = `${curdateTime()}|01|${dataLogin.userid}|-`;
		let param2 = `${selectedTarif.id}|0000000099|-|${deskripsiOrder.berat}|${selectedTarif.beadasar}|${selectedTarif.htnb}|${selectedTarif.ppn}|${selectedTarif.ppnhtnb}|${deskripsiOrder.isiKiriman}|${deskripsiOrder.nilai}|-|-`;
		let param3 = `${pengirimnya.nama}|${pengirimnya.alamat}|${pengirimnya.kel}|${pengirimnya.kec}|${pengirimnya.kota}|${pengirimnya.provinsi}|Indonesia|${pengirimnya.kodepos}|${pengirimnya.nohp}|${pengirimnya.email}`;
		let param4 = `-|${deskripsiPenerima.nama}|${deskripsiPenerima.alamatUtama}|-|-|${deskripsiPenerima.kelurahan}|${deskripsiPenerima.kecamatan}|${deskripsiPenerima.kabupaten}|${deskripsiPenerima.kabupaten}|${deskripsiPenerima.provinsi}|-|Indonesia|${deskripsiPenerima.kodepos}|${deskripsiPenerima.nohp}|-|${deskripsiPenerima.email}|-|-`;
		let param5 = `${codOrNot}|0|-|0`;
		const payload = {
			param1: param1,
			param2: param2,
			param3: param3,
			param4: param4,
			param5: param5
		};
		
		this.setState({ payload });
	}

	getRandomInt = (min, max) => {
	    min = Math.ceil(min);
	    max = Math.floor(max);
	    return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	saveOrder = () => {
		this.setState({ loading: true, success: false });
		const { dataLogin } = this.props;
		if (dataLogin.userid.substring(0, 3) === '540') { //non member
			const { params } = this.props.navigation.state;
			const { selectedTarif, deskripsiOrder, pengirimnya, deskripsiPenerima } = params;
			const { dataLogin } = this.props;

			const payloadWsdl = {
				userid: dataLogin.userid,
				fee: selectedTarif.beadasar,
				feeTax: selectedTarif.ppn,
				insurance: selectedTarif.htnb,
				insuranceTax: selectedTarif.ppnhtnb,
				itemValue: deskripsiOrder.nilai,
				contentDesc: deskripsiOrder.isiKiriman,
				berat: deskripsiOrder.berat,
				serviceId: selectedTarif.id,
				senderName: pengirimnya.nama,
				senderAddress: pengirimnya.alamat,
				senderKec: pengirimnya.kec,
				senderCity: pengirimnya.kota,
				senderProv: '-',
				length: deskripsiOrder.panjang,
				width: deskripsiOrder.lebar,
				height: deskripsiOrder.tinggi,
				cod: deskripsiOrder.cod ? '1' : '0',
				senderPos: pengirimnya.kodepos,
				senderMail: pengirimnya.email,
				senderPhone: pengirimnya.nohp,
				receiverName: deskripsiPenerima.nama,
				receiverAddress: deskripsiPenerima.alamatUtama,
				receiverKec: deskripsiPenerima.kecamatan,
				receiverCity: deskripsiPenerima.kabupaten,
				receiverProv: deskripsiPenerima.provinsi,
				receiverPos: deskripsiPenerima.kodepos,
				receiverMail: deskripsiPenerima.email,
				receiverPhone: deskripsiPenerima.nohp,
				receiverVill: deskripsiPenerima.kelurahan
			};
			apiWs.qob.booking(payloadWsdl)
				.then(res => {
					console.log(res);
					const { idOrder } = res;
					this.setState({ loading: false, success: true, idOrder: idOrder });
				})
				.catch(err => {
					// console.log(err);
					console.log(err.response);
					if (err.response.data.errors.global) {
						this.setState({ loading: false, errors: err.response.data.errors });
					}else{
						this.setState({ loading: false, errors: {global: 'Whooopps, untuk saat ini kami tidak dapat menghubungkan ke server, mohon cobalagi nanti'}});
					}
				});

		}else{//member
			api.qob.booking(this.state.payload)
				.then(res => {
					console.log(res);
					const { response_data1 } = res;
					let x = response_data1.split('|');
					// let idOrder = x
					this.setState({ loading: false, success: true, idOrder: x[3] });
				})
				.catch(err => {
					// console.log(err);
					if (Object.keys(err).length === 10) {
						this.setState({ loading: false, errors: {global: err.desk_mess }});	
					}else{
						this.setState({ loading: false, errors: {global: 'Terdapat kesalahan, mohon cobalagi nanti'}});
					}
			})
		}
	}

	onSubmit = () => {
		const { checked } = this.state;
		if (!checked) {
			alert("Harap centang persyaratan dan ketentuan terlebih dahulu");
		}else{
			this.saveOrder();
		}
	}

	backHome = () => {
		this.props.navigation.navigate({
			routeName: 'IndexSearch',
			params: {}
		})
	}

	BackAction = () => (
  		<TopNavigationAction icon={BackIcon} onPress={() => this.props.navigation.goBack()}/>
	)

	render(){
		const { params } = this.props.navigation.state;
		const { selectedTarif } = this.props.navigation.state.params;
		const { errors } = this.state;

		return(
			<View style={{flex: 1}}>
				<MyStatusBar />
				<TopNavigation
				    leftControl={this.BackAction()}
				    title='Order'
				    subtitle='Summary'
				    alignment='start'
				    titleStyle={{fontFamily: 'open-sans-bold', color: '#FFF'}}
				    style={{backgroundColor: 'rgb(240, 132, 0)'}}
				    subtitleStyle={{color: '#FFF'}}
				/>
				{ errors.global && <Modal loading={!!errors.global} text={errors.global} handleClose={() => this.setState({ errors: {} })} /> } 
				
				<Loader loading={this.state.loading} />
				
				{ !this.state.success ? 
					<ScrollView>
						<RenderInfo 
							params={params} 
							onSimpan={this.onSubmit} 
							checked={this.state.checked} 
							onCheckedChange={() => this.setState({ checked: !this.state.checked})}
							userid={this.props.dataLogin.userid} 
						/>
					</ScrollView> : <React.Fragment>
						<View style={{ alignItems: 'center', flex: 1, justifyContent: 'center'}}>
							<Button status='warning' onPress={() => this.backHome()}>Kembali ke menu utama</Button>
						</View>
						<Dialog.Container visible={this.state.visible}>
							<Dialog.Title>BERHASIL/SUKSES</Dialog.Title>
							{ this.state.visible && <View style={{margin: 13}}>
					        	<Text style={{fontFamily: 'open-sans-reg', fontSize: 16}}>Nomor order : {this.state.idOrder}</Text>
					        	<Text style={{fontFamily: 'open-sans-reg', fontSize: 16}}>Isi Kiriman      : {params.deskripsiOrder.jenis} </Text>
					        </View> }
				          <Dialog.Button label="Tutup" onPress={() => this.setState({ visible: false })} />
				        </Dialog.Container>
					</React.Fragment> }
			</View>
		);
	}
}

function mapStateToProps(state) {
	return{
		dataLogin: state.auth.dataLogin
	}
}

export default connect(mapStateToProps, null)(ResultOrder);