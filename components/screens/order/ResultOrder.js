import React from "react";
import { View, Text, StatusBar } from "react-native";
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


class ResultOrder extends React.Component{
	state = {
		loading: false,
		success: false,
		payload: {},
		errors: {},
		idOrder: '',
		visible: true,
		modal: false
	}

	async componentDidMount(){
		const { dataLogin } = this.props;
		const { params } = this.props.navigation.state;
		const { selectedTarif, deskripsiOrder, pengirimnya, deskripsiPenerima } = params;
		const codOrNot = deskripsiOrder.checked ? '1' : '0';
		
		let param1 = `${curdateTime()}|01|${dataLogin.userid}|-`;
		let param2 = `${selectedTarif.id}|0000000099|-|${deskripsiOrder.berat}|${selectedTarif.beadasar}|${selectedTarif.htnb}|${selectedTarif.ppn}|${selectedTarif.ppnhtnb}|${deskripsiOrder.jenis}|${deskripsiOrder.nilai}|-|-`;
		let param3 = `${pengirimnya.nama}|${pengirimnya.alamat}|${pengirimnya.kel}|${pengirimnya.kec}|${pengirimnya.kota}|PROV|Indonesia|${pengirimnya.kodepos}|${pengirimnya.nohp}|${pengirimnya.email}`;
		let param4 = `-|${deskripsiPenerima.nama}|${deskripsiPenerima.alamat2}|-|-|${deskripsiPenerima.kel}|${deskripsiPenerima.kec}|${deskripsiPenerima.kota}|${deskripsiPenerima.kota}|-|-|Indonesia|${deskripsiPenerima.kodepos}|${deskripsiPenerima.nohp}|-|${deskripsiPenerima.email}|-|-`;
		let param5 = `${codOrNot}|0|-|0`;
		const payload = {
			param1: param1,
			param2: param2,
			param3: param3,
			param4: param4,
			param5: param5
		};
		console.log(deskripsiOrder);
		this.setState({ payload });
	}

	getRandomInt = (min, max) => {
	    min = Math.ceil(min);
	    max = Math.floor(max);
	    return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	onSubmit = () => {
		const { modal } = this.state;
		if (modal) {
			this.setState({ loading: true, success: false });
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
		}else{
			this.setState({ loading: true, success: false });
			const { params } = this.props.navigation.state;
			const { selectedTarif, deskripsiOrder, pengirimnya, deskripsiPenerima } = params;
			const { dataLogin } = this.props;

			const payloadWsdl = {
				userid: dataLogin.userid,
				fee: selectedTarif.beadasar,
				feeTax: selectedTarif.ppn,
				insurance: selectedTarif.htnb,
				insuranceTax: selectedTarif.ppnhtnb,
				itemValue: deskripsiOrder.nilaiVal,
				contentDesc: deskripsiOrder.jenis,
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
				cod: deskripsiOrder.checked ? '1' : '0',
				senderPos: pengirimnya.kodepos,
				senderMail: pengirimnya.email,
				senderPhone: pengirimnya.nohp,
				receiverName: deskripsiPenerima.nama,
				receiverAddress: deskripsiPenerima.alamat2,
				receiverKec: deskripsiPenerima.kec,
				receiverCity: deskripsiPenerima.kota,
				receiverProv: '-',
				receiverPos: deskripsiPenerima.kodepos,
				receiverMail: deskripsiPenerima.email,
				receiverPhone: deskripsiPenerima.nohp
			};
			apiWs.qob.booking(payloadWsdl)
				.then(res => {
					console.log(res);
					const { idOrder } = res;
					this.setState({ loading: false, success: true, idOrder: idOrder });
				})
				.catch(err => {
					console.log(err);
					console.log(err.response);
					this.setState({ loading: false, errors: {global: 'Terdapat kesalahan, mohon cobalagi nanti'}});
				});
		}
	}

	onCheckedChange = () => {
		this.setState({ modal: !this.state.modal });
	}

	backHome = () => {
		this.props.navigation.navigate({
			routeName: 'IndexSearch',
			params: {}
		})
	}

	numberWithCommas = (number) => {
		return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
				    // subtitle={this.props.navigation.state.params.namaLengkap}
				    subtitleStyle={{color: '#FFF'}}
				/>
				<View>
					{ errors.global && <Modal loading={!!errors.global} text={errors.global} handleClose={() => this.setState({ errors: {} })} /> } 
					<Loader loading={this.state.loading} />
					{ !this.state.success ? 
						<React.Fragment>
							<View style={{margin: 15, borderWidth: 1, borderColor: '#cbccc4'}}>
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
								<View style={{paddingTop: 10, padding: 5}}>
									<View style={styles.viewResult}>
										<Text style={styles.labelInformasi}>Pengirim</Text>
										<Text style={{ fontSize: 16, fontFamily: 'open-sans-reg', marginLeft: 73 }}>: {capitalize(params.pengirimnya.nama)}</Text>
									</View>
									<View style={styles.viewResult}>
										<Text style={styles.labelInformasi}>Penerima</Text>
										<Text style={{ fontSize: 16, fontFamily: 'open-sans-reg', marginLeft: 68 }}>: {capitalize(params.deskripsiPenerima.nama)}</Text>
									</View>
									<View style={styles.viewResult}>
										<Text style={styles.labelInformasi}>Isi Kiriman</Text>
										<Text style={{ fontSize: 16, fontFamily: 'open-sans-reg', marginLeft: 62 }}>: {params.deskripsiOrder.jenis}</Text>
									</View>
									<View style={styles.viewResult}>
										<Text style={styles.labelInformasi}>Jenis Kiriman</Text>
										<Text style={{ fontSize: 16, fontFamily: 'open-sans-reg', marginLeft: 43 }}>: 
											{ params.deskripsiOrder.checked ? ' Cod' : ' Non Cod' }
										</Text>
									</View>
									<View style={styles.viewResult}>
										<Text style={styles.labelInformasi}>Nilai Barang</Text>
										<Text style={{ fontSize: 16, fontFamily: 'open-sans-reg', marginLeft: 50 }}>: Rp {this.numberWithCommas(params.deskripsiOrder.nilai)}</Text>
									</View>
									<View style={styles.viewResult}>
										<Text style={styles.labelInformasi}>Estimasi Tarif</Text>
										<Text style={{ fontSize: 16, fontFamily: 'open-sans-reg', marginLeft: 40 }}>: Rp {this.numberWithCommas(params.selectedTarif.tarif)}</Text>
									</View>
									<CheckBox
								      text='Order sebagai member'
								      checked={this.state.modal}
								      onChange={this.onCheckedChange}
								    />
								</View>
							</View>
							<Button status='warning' style={{margin: 14, marginTop: -10}} onPress={this.onSubmit}>Simpan</Button>
						</React.Fragment> : <React.Fragment>
							<View style={{ alignItems: 'center'}}>
								<Text style={{fontFamily: 'open-sans-reg', fontSize: 20, textAlign: 'center' }}>SUKSES!</Text>
								<Button status='warning' onPress={() => this.backHome()}>Kembali ke home</Button>
							</View>
							<View>
								<Dialog.Container visible={this.state.visible}>
									<Dialog.Title>BERHASIL/SUKSES</Dialog.Title>
							        <Dialog.Description>
								          	Nomor order   : {this.state.idOrder} {'\n'}
								          	Isi Kiriman     : {params.deskripsiOrder.jenis}
							        </Dialog.Description>
						          <Dialog.Button label="Tutup" onPress={() => this.setState({ visible: false })} />
						        </Dialog.Container>
							</View>
						</React.Fragment> }
					</View>
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