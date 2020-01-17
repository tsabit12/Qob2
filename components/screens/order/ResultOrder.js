import React from "react";
import { View, Text } from "react-native";
import styles from "./styles";
import { Button } from '@ui-kitten/components';
import Loader from "../../Loader";
import Modal from "../../Modal";
import { curdateTime } from "../../utils/helper";
import api from "../../api";
import Dialog from "react-native-dialog";
import { connect } from "react-redux";

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
		// console.log(payload);
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

function mapStateToProps(state) {
	return{
		dataLogin: state.auth.dataLogin
	}
}

export default connect(mapStateToProps, null)(ResultOrder);