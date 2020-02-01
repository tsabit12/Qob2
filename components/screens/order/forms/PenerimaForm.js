import React from "react";
import { View, Text, StyleSheet, Keyboard } from "react-native";
import { Input, Button, CheckBox, Icon, Radio, RadioGroup } from '@ui-kitten/components';
import apiWs from "../../../apiWs";
import Dialog from "react-native-dialog";

const capitalize = (string) => {
	return string.toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ');
}

const ListKodePos = ({ list, visible, onPress, selectedIndex, handleChange }) => (
	<Dialog.Container visible={visible}>
		<Dialog.Title>Pilih Kelurahan</Dialog.Title>
        <View style={{margin: 17}}>
        	<RadioGroup
				selectedIndex={selectedIndex}
	        	onChange={(e) => handleChange(e)}
			>
			{ list.map((x, i) => 
				<Radio
					key={i}
			        style={styles.radio}
			        status='warning'
			        text={x.kelurahan}
			      /> )}
			</RadioGroup>
        </View>
        { selectedIndex !== null &&  <Dialog.Button label="Pilih" onPress={() => onPress()}/> }
    </Dialog.Container>
); 

class PenerimaForm extends React.Component{
	namRef = React.createRef();
	alamatUtamaRef = React.createRef();
	kodeposRef = React.createRef();
	emailRef = React.createRef();
	phoneRef = React.createRef();

	namaPengirimRef = React.createRef();
	alamatUtamaPengirimRef = React.createRef();
	kodeposPengirimRef = React.createRef();
	emailPengirimRef = React.createRef();
	phonePengirimRef = React.createRef();

	state = {
		data: {
			nama: '',
			alamatUtama: '',
			kodepos: '',
			kelurahan: '',
			kecamatan: '',
			kabupaten: '',
			provinsi: '',
			email: '',
			nohp: ''
		},
		pengirim: {
			nama: '',
			alamatUtama: '',
			kodepos: '',
			kelurahan: '',
			kecamatan: '',
			kabupaten: '',
			provinsi: '',
			email: '',
			nohp: ''
		},
		errors: {},
		checked: false,
		defaultPengirim: this.props.detailPengirim,
		loading: false,
		loading2: false,
		responseKodepos: [],
		responseKodepos2: [],
		showModal: false,
		choosed: null,
		choosed2: null
	}

	//handle refresh data
	UNSAFE_componentWillReceiveProps(nextProps){
		if (nextProps.detailPengirim) {
			const { detailPengirim } = nextProps;
			this.setState({
				defaultPengirim: detailPengirim,
				pengirim: {
					nama: capitalize(detailPengirim.namaLengkap),
					alamatUtama: detailPengirim.alamat,
					kodepos: detailPengirim.kodepos,
					kelurahan: detailPengirim.kel,
					kecamatan: detailPengirim.kec,
					kabupaten: detailPengirim.kota,
					provinsi: '-',
					email: detailPengirim.email,
					nohp: detailPengirim.noHp
				}
			})
		}
	}

	onChange = (e, { name }) => this.setState({ data: { ...this.state.data, [name]: e }})
	onChangePengirim = (e, { name }) => this.setState({ pengirim: { ...this.state.pengirim, [name]: e }})

	onCheckedChange = () => {
		const { defaultPengirim, checked } = this.state;
		
		if (checked) {
			this.setState({ 
				checked: false, 
				pengirim: {
					nama: '',
					alamatUtama: '',
					kodepos: '',
					kelurahan: '',
					kecamatan: '',
					kabupaten: '',
					provinsi: '',
					email: '',
					nohp: ''
				} 
			});	
		}else{
			this.setState({ checked: true });
			this.props.onGetProfile();	
			//handle if data already exist
			//in redux store
			if (Object.keys(defaultPengirim).length > 0) {
				this.setState({
					pengirim: {
						nama: capitalize(defaultPengirim.namaLengkap),
						alamatUtama: defaultPengirim.alamat,
						kodepos: defaultPengirim.kodepos,
						kelurahan: defaultPengirim.kel,
						kecamatan: defaultPengirim.kec,
						kabupaten: defaultPengirim.kota,
						provinsi: '-',
						email: defaultPengirim.email,
						nohp: defaultPengirim.noHp
					}
				})
			}
		}
	}

	renderIcon = (style) => {
		return(
			<Icon {...style} name= {!!this.state.pengirim.kelurahan ? 'checkmark-outline' : 'search-outline'} />
		)
	}

	renderIcon2 = (style) => {
		return(
			<Icon {...style} name= {!!this.state.data.kelurahan ? 'checkmark-outline' : 'search-outline'} />
		)
	}
 
	onIconPress = () => {
		const { checked, pengirim } = this.state;
		const errors = this.validateKodepos(pengirim.kodepos);
		this.setState({ errors });
		if (Object.keys(errors).length === 0) {
			if (!!this.state.pengirim.kelurahan === false) {
				this.setState({ loading: true, choosed: null });
				Keyboard.dismiss();
				apiWs.qob.getKodePos(pengirim.kodepos)
					.then(res => {
						const { result } = res;
						const responseKodepos = [];
						result.forEach(x => {
							responseKodepos.push({
								kelurahan: x.kelurahan,
								kecamatan: x.kecamatan,
								kabupaten: x.kabupaten,
								provinsi: x.provinsi
							})
						});
						this.setState({ loading: false, responseKodepos, showModal: true });
					})
					.catch(err => {
						console.log(err.response);
						this.setState({ loading: false, errors: { kodeposPengirim: 'Kodepos tidak ditemukan'} });
					})
			}
		}
	}

	onIconPress2 = () => {
		const { data } = this.state;
		const errors = this.validateKodepos2(data.kodepos);
		this.setState({ errors });
		if (Object.keys(errors).length === 0) {
			if (!!this.state.data.kelurahan === false) {
				this.setState({ loading2: true, choosed2: null });
				Keyboard.dismiss();
				apiWs.qob.getKodePos(data.kodepos)
					.then(res => {
						const { result } = res;
						const responseKodepos2 = [];
						result.forEach(x => {
							responseKodepos2.push({
								kelurahan: x.kelurahan,
								kecamatan: x.kecamatan,
								kabupaten: x.kabupaten,
								provinsi: x.provinsi
							})
						});
						this.setState({ loading2: false, responseKodepos2, showModal: true });
					})
					.catch(err => {
						console.log(err.response);
						this.setState({ loading2: false, errors: { kodepos: 'Kodepos tidak ditemukan'} });
					})
			}
		}
	}

	validateKodepos = (kodepos) => {
		const errors = {};
		if (!kodepos) errors.kodeposPengirim = 'Harap masukan kodepos';
		return errors;
	}

	validateKodepos2 = (kodepos) => {
		const errors = {};
		if (!kodepos) errors.kodepos = 'Harap masukan kodepos';
		return errors;
	}

	onChangeKodepos = (e) => this.setState({ choosed: e })
	onChangeKodepos2 = (e) => this.setState({ choosed2: e })

	onPilihKodePos = () => {
		const { responseKodepos, choosed } = this.state;
		const choosedKelurahan = responseKodepos[choosed];
		
		this.setState({ 
			showModal: false,
			pengirim: {
				...this.state.pengirim,
				kelurahan: choosedKelurahan.kelurahan,
				kecamatan: choosedKelurahan.kecamatan,
				kabupaten: choosedKelurahan.kabupaten,
				provinsi: choosedKelurahan.provinsi
			},
			responseKodepos: []
		});
	}

	onPilihKodePos2 = () => {
		const { responseKodepos2, choosed2 } = this.state;
		const choosedKelurahan = responseKodepos2[choosed2];
		
		this.setState({ 
			showModal: false,
			data: {
				...this.state.data,
				kelurahan: choosedKelurahan.kelurahan,
				kecamatan: choosedKelurahan.kecamatan,
				kabupaten: choosedKelurahan.kabupaten,
				provinsi: choosedKelurahan.provinsi
			},
			responseKodepos2: []
		});
	}

	onSubmit = () => {
		const errors = this.validate(this.state.pengirim, this.state.data);
		this.setState({ errors });
		if (Object.keys(errors).length === 0) {
			const { pengirim, data } = this.state;
			const payload = {
				pengirim,
				penerima: data
			};
			this.props.onSubmit(payload);
		}
	}

	validate = (pengirim, penerima) => {
		const errors = {};
		if (!pengirim.nama) errors.namaPengirim = "Masukkan nama pengirim";
		if (!pengirim.alamatUtama) errors.alamatUtamaPengirim = "Masukkan alamat utama pengirim";
		if (!pengirim.kodepos) errors.kodeposPengirim = "Masukkan kodepos pengirim";
		if (!pengirim.nohp) errors.nohpPengirim = "Masukkan nomor handphone";
		if (!penerima.nama) errors.namaPenerima = "Masukkan nama penerima";
		if (!penerima.alamatUtama) errors.alamatUtama = "Masukkan alamat utama penerima";
		if (!penerima.kodepos) errors.kodepos = "Masukkan kodepos penerima";
		if (!penerima.nohp) errors.nohp = "Masukkan nomor handphone penerima";
		return errors;
	}

	render(){
		const { data, errors, pengirim, checked, loading, responseKodepos, loading2, responseKodepos2 } = this.state;

		return(
			<React.Fragment>
				<View style={styles.container}>
					<Input 
				      ref={this.namaPengirimRef}
				      placeholder='Masukkan nama pengirim'
				      name='nama'
				      label='* Nama Pengirim'
				      labelStyle={styles.label}
				      style={styles.input}
				      value={pengirim.nama}
				      autoCapitalize='words'
				      onChangeText={(e) => this.onChangePengirim(e, this.namaPengirimRef.current.props)}
				      status={errors.namaPengirim && 'danger'}
				      onSubmitEditing={() => this.alamatUtamaPengirimRef.current.focus() }
				      caption={errors.namaPengirim && `${errors.namaPengirim}`}
				      disabled={checked}
					/>
					<Input 
				      ref={this.alamatUtamaPengirimRef}
				      placeholder='Masukkan alamat utama (Jln dll)'
				      name='alamatUtama'
				      label='* Alamat Utama Pengirim'
				      labelStyle={styles.label}
				      style={styles.input}
				      value={pengirim.alamatUtama}
				      onChangeText={(e) => this.onChangePengirim(e, this.alamatUtamaPengirimRef.current.props)}
				      status={errors.alamatUtamaPengirim && 'danger'}
				      onSubmitEditing={() => this.kodeposPengirimRef.current.focus() }
				      caption={errors.alamatUtamaPengirim && `${errors.alamatUtamaPengirim}`}
				      disabled={checked}
					/>
					<Input 
				      ref={this.kodeposPengirimRef}
				      placeholder='Masukkan kodepos pengirim'
				      name='kodepos'
				      label='* Kodepos Pengirim'
				      labelStyle={styles.label}
				      style={styles.input}
				      value={pengirim.kodepos}
				      keyboardType='phone-pad'
				      icon={(style) => this.renderIcon(style)}
				      onChangeText={(e) => this.onChangePengirim(e, this.kodeposPengirimRef.current.props)}
				      onIconPress={this.onIconPress}
				      status={errors.kodeposPengirim && 'danger'}
				      onSubmitEditing={this.onIconPress}
				      caption={errors.kodeposPengirim && `${errors.kodeposPengirim}`}
				      disabled={pengirim.kelurahan ? true : false }
					/>
					<React.Fragment>
						{ loading && <Text style={styles.loading}>Searching....</Text> }
						{ responseKodepos.length > 0 && 
							<ListKodePos 
								list={responseKodepos} 
								visible={this.state.showModal}
								onPress={this.onPilihKodePos}
								selectedIndex={this.state.choosed}
								handleChange={this.onChangeKodepos}
							/> }
					</React.Fragment>
					<Input 
				    	placeholder='Masukan email'
				    	ref={this.emailPengirimRef}
				    	name='email'
						label='Email (optional)'
						keyboardType='email-address'
				    	labelStyle={styles.label}
				    	value={pengirim.email}
				    	style={styles.input}
				    	disabled={checked}
				    	onChangeText={(e) => this.onChangePengirim(e, this.emailPengirimRef.current.props)}
				    	onSubmitEditing={() => this.phonePengirimRef.current.focus() }
				    />
				    <Input 
				      ref={this.phonePengirimRef}
				      placeholder='Masukkan nomor handphone'
				      name='nohp'
				      label='* Nomro Handphone'
				      labelStyle={styles.label}
				      style={styles.input}
				      value={pengirim.nohp}
				      keyboardType='phone-pad'
				      onChangeText={(e) => this.onChangePengirim(e, this.phonePengirimRef.current.props)}
				      status={errors.nohpPengirim && 'danger'}
				      // onSubmitEditing={() => this.kodeposPengirimRef.current.focus() }
				      caption={errors.nohpPengirim && `${errors.nohpPengirim}`}
				      disabled={checked}
					/>
					<CheckBox
				      text='Gunakan data saya'
				      checked={checked}
				      status='warning'
				      style={{margin: 5}}
				      onChange={this.onCheckedChange}
				    />
				</View>

				<View style={styles.container}>
					<Input 
				      ref={this.namRef}
				      placeholder='Masukkan nama penerima'
				      name='nama'
				      label='* Nama Penerima'
				      labelStyle={styles.label}
				      style={styles.input}
				      value={data.nama}
				      autoCapitalize='words'
				      onChangeText={(e) => this.onChange(e, this.namRef.current.props)}
				      status={errors.namaPenerima && 'danger'}
				      onSubmitEditing={() => this.alamatUtamaRef.current.focus() }
				      caption={errors.namaPenerima && `${errors.namaPenerima}`}
					/>
					<Input 
				      ref={this.alamatUtamaRef}
				      placeholder='Masukkan alamat utama (Jln dll)'
				      name='alamatUtama'
				      label='* Alamat Utama Penerima'
				      labelStyle={styles.label}
				      style={styles.input}
				      value={data.alamatUtama}
				      onChangeText={(e) => this.onChange(e, this.alamatUtamaRef.current.props)}
				      status={errors.alamatUtama && 'danger'}
				      onSubmitEditing={() => this.kodeposRef.current.focus() }
				      caption={errors.alamatUtama && `${errors.alamatUtama}`}
					/>
					<Input 
				      ref={this.kodeposRef}
				      placeholder='Masukkan kodepos penerima'
				      name='kodepos'
				      label='* Kodepos Penerima'
				      labelStyle={styles.label}
				      style={styles.input}
				      keyboardType='phone-pad'
				      value={data.kodepos}
				      onChangeText={(e) => this.onChange(e, this.kodeposRef.current.props)}
				      status={errors.kodepos && 'danger'}
				      icon={(style) => this.renderIcon2(style)}
				      onIconPress={this.onIconPress2}
				      onSubmitEditing={this.onIconPress2}
				      caption={errors.kodepos && `${errors.kodepos}`}
				      disabled={!!data.kelurahan}
					/>
					<React.Fragment>
						{ loading2 && <Text style={styles.loading}>Searching....</Text> }
						{ responseKodepos2.length > 0 && 
							<ListKodePos 
								list={responseKodepos2} 
								visible={this.state.showModal}
								onPress={this.onPilihKodePos2}
								selectedIndex={this.state.choosed2}
								handleChange={this.onChangeKodepos2}
							/> }
					</React.Fragment>
					<Input 
				    	placeholder='Masukan email penerima'
				    	ref={this.emailRef}
				    	name='email'
						label='Email penerima (optional)'
						keyboardType='email-address'
				    	labelStyle={styles.label}
				    	value={data.email}
				    	style={styles.input}
				    	onChangeText={(e) => this.onChange(e, this.emailRef.current.props)}
				    	onSubmitEditing={() => this.phoneRef.current.focus() }
				    />
				    <Input 
				      ref={this.phoneRef}
				      placeholder='Masukkan nomor handphone'
				      name='nohp'
				      label='* Nomro Handphone'
				      labelStyle={styles.label}
				      style={styles.input}
				      value={data.nohp}
				      keyboardType='phone-pad'
				      onChangeText={(e) => this.onChange(e, this.phoneRef.current.props)}
				      status={errors.nohp && 'danger'}
				      caption={errors.nohp && `${errors.nohp}`}
					/>
				</View>
				<Button status='warning' style={{flex: 1, margin: 10, marginTop: -5}} onPress={this.onSubmit}>Selanjutnya</Button>
			</React.Fragment>
		);
	}
}

export default PenerimaForm;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		margin: 10,
		borderWidth: 0.6,
		borderColor: '#c9c7c7',
		borderRadius: 5,
		padding: 5
	},
	input: {
		padding: 5
	},
	label: {
		color: 'black',
		fontSize: 14,
		fontFamily: 'open-sans-reg'
	},
	loading: {
		fontSize: 12,
		marginTop: -5,
		marginLeft: 5
	}
})