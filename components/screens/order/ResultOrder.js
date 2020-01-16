import React from "react";
import { View, Text, AsyncStorage } from "react-native";
import styles from "./styles";
import { Button } from '@ui-kitten/components';
import Loader from "../../Loader";
import Modal from "../../Modal";
import { curdateTime } from "../../utils/helper";
import api from "../../api";
import Dialog from "react-native-dialog";

const capitalize = (string) => {
	return string.toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ');
}

const Judul = () => (
	<Text style={styles.header}>Summary Order</Text>
)

class ResultOrder extends React.Component{
	static navigationOptions = ({ navigation }) => ({
		headerTitle: <Judul/>
	}) 

	state = {
		loading: false,
		success: false,
		payload: {},
		errors: {},
		idOrder: '',
		visible: true
	}

	async componentDidMount(){
		const value 	= await AsyncStorage.getItem('qobUserPrivasi');
		const toObje 	= JSON.parse(value);

		const { params } = this.props.navigation.state;
		const { selectedTarif, deskripsiOrder, deskripsiPengirim, deskripsiPenerima } = params;
		console.log(deskripsiPengirim);
		let param1 = `${curdateTime()}|01|${toObje.userid}|-`;
		let param2 = `${selectedTarif.id}|0000000099|-|${deskripsiOrder.berat}|${selectedTarif.beadasar}|${selectedTarif.htnb}|${selectedTarif.ppn}|${selectedTarif.ppnhtnb}|${deskripsiOrder.jenis}|${deskripsiOrder.nilai}|-|-`;
		let param3 = `${deskripsiPengirim.nama}|${deskripsiPengirim.alamat}|KEL|KEC|${deskripsiPengirim.kota}|PROV|Indonesia|${deskripsiPengirim.kodepos}|${toObje.nohp}|${toObje.email}`;
		let param4 = `-|${deskripsiPenerima.nama}|${deskripsiPenerima.alamat2}|-|-|${deskripsiPenerima.alamat}|KEL|KEC|${deskripsiPenerima.kota}|PROV|Indonesia|${deskripsiPenerima.kodepos}|${deskripsiPenerima.nohp}|${deskripsiPenerima.email}|-|-`;
		let param5 = `0|0|-|0`;
		const payload = {
			param1: param1,
			param2: param2,
			param3: param3,
			param4: param4,
			param5: param5
		};
		console.log(payload);
		this.setState({ payload });
	}

	getRandomInt = (min, max) => {
	    min = Math.ceil(min);
	    max = Math.floor(max);
	    return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	onSubmit = () => {
		this.setState({ loading: true, success: false });
			api.qob.booking(this.state.payload)
				.then(res => {
					console.log(res);
					const { response_data1 } = res;
					let x = response_data1.split('|');
					// let idOrder = x
					this.setState({ loading: false, success: true, idOrder: x[3] });

					const { params } = this.props.navigation.state;
					const { deskripsiPengirim, deskripsiPenerima, deskripsiOrder } = params;
					
					const payload = {
						idorder: x[3],
						nmPenrima:  deskripsiPenerima.nama,
						nmPengirim: deskripsiPengirim.nama,
						jenis: deskripsiOrder.jenis,
						tgl: res.wkt_mess
					};
					//save to stroe redux
					// this.props.orderAdded(x[3], payload);
				})
				.catch(err => {
					// console.log(err);
					if (Object.keys(err).length === 10) {
						this.setState({ loading: false, errors: {global: err.desk_mess }});	
					}else{
						this.setState({ loading: false, errors: {global: 'Terdapat kesalahan, mohon cobalagi nanti'}});
					}
				})
		// setTimeout(() => this.setState({loading: false, success: true }), 1000);	
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

	render(){
		const { params } = this.props.navigation.state;
		const { selectedTarif } = this.props.navigation.state.params;
		const { errors } = this.state;

		return(
			<React.Fragment>
				{ errors.global && <Modal loading={!!errors.global} text={errors.global} handleClose={() => this.setState({ errors: {} })} /> } 
				<Loader loading={this.state.loading} />
				{ !this.state.success ? <View style={{margin: 15}}>
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
						<View style={{paddingTop: 10}}>
							<View style={styles.viewResult}>
								<Text style={styles.labelInformasi}>Pengirim</Text>
								<Text style={{ fontSize: 16, fontFamily: 'open-sans-reg', marginLeft: 73 }}>: {capitalize(params.deskripsiPengirim.nama)}</Text>
							</View>
							<View style={styles.viewResult}>
								<Text style={styles.labelInformasi}>Penerima</Text>
								<Text style={{ fontSize: 16, fontFamily: 'open-sans-reg', marginLeft: 68 }}>: {capitalize(params.deskripsiPenerima.nama)}</Text>
							</View>
							<View style={styles.viewResult}>
								<Text style={styles.labelInformasi}>Jenis Kiriman</Text>
								<Text style={{ fontSize: 16, fontFamily: 'open-sans-reg', marginLeft: 44 }}>: {params.deskripsiOrder.jenis}</Text>
							</View>
							<View style={styles.viewResult}>
								<Text style={styles.labelInformasi}>Nilai Barang</Text>
								<Text style={{ fontSize: 16, fontFamily: 'open-sans-reg', marginLeft: 50 }}>: Rp {this.numberWithCommas(params.deskripsiOrder.nilai)}</Text>
							</View>
							<View style={styles.viewResult}>
								<Text style={styles.labelInformasi}>Estimasi Tarif</Text>
								<Text style={{ fontSize: 16, fontFamily: 'open-sans-reg', marginLeft: 40 }}>: Rp {this.numberWithCommas(params.selectedTarif.tarif)}</Text>
							</View>
						</View>
						<Button status='info' style={{marginTop: 10}} onPress={this.onSubmit}>Simpan</Button>
					</View> : <React.Fragment>
						<View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
							<Text style={{fontFamily: 'open-sans-reg', fontSize: 20, textAlign: 'center' }}>SUKSES!</Text>
							<Button status='info' onPress={() => this.backHome()}>Kembali ke home</Button>
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
					</React.Fragment>}
			</React.Fragment>
		);
	}
}

export default ResultOrder;