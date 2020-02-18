import React from "react";
import { View, Text, Keyboard } from "react-native";
import { Input, Button, Icon, TouchableOpacity, Radio, RadioGroup, Toggle } from '@ui-kitten/components';
import styles from "../styles";
import Loader from "../../../Loader";
import apiWs from "../../../apiWs";
import Dialog from "react-native-dialog";

const renderIcon = (style, search, checked) => (
	<View style={{backgroundColor: checked ? '#0d4cde' : search ? '#fa4a0a' : '#909190', alignItems: 'center', borderRadius: 13, justifyContent: 'center'}}>
    	{ checked ? <Icon name='checkmark-outline' width={18} height={19} fill='#FFF'/> :
    		<Icon name={search ? 'close-outline' : 'search-outline'} width={18} height={19} fill='#FFF'/> }
    </View>
);

const capitalize = (string) => {
	return string.toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ');
}

const ListKabupaten = ({ list, handleChange, selectedIndex, onPress }) => {
	return(
		<Dialog.Container visible={true}>
			<Dialog.Title>Pilih Kelurahan</Dialog.Title>
	        <View style={{margin: 16}}>
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
	)
}


class FormPengirim extends React.PureComponent{
	namaRef = React.createRef();
	alamatUtamaRef = React.createRef();
	kodeposRef = React.createRef();
	emailRef = React.createRef();
	phoneRef = React.createRef();
	alamatDetailRef = React.createRef();
	noHpRef = React.createRef();

	state = {
		data: {
			nama: '',
			alamatUtama: '',
			kodepos: '',
			kota: '',
			kecamatan: '',
			kelurahan: '',
			provinsi: '',
			alamatDetail: '',
			email: '',
			noHp: ''
		},
		search: false,
		loading: false,
		responseKodepos: [],
		errors: {},
		selectedIndex: null,
		checked: false
	}

	onChange = (e, { name }) => this.setState({ data: { ...this.state.data, [name]: e }})

	onIconPress = () => {
		const { checked } = this.state;
		//only work when not using user profile
		if (!checked) {
			if (!this.state.data.kodepos) {
				alert("Kodepos harap diisi");
			}else{
				const { search } = this.state;
				if (!search) {
					this.setState({ search: true, loading: true });
					Keyboard.dismiss();
					apiWs.qob.getKodePos(this.state.data.kodepos)
						.then(res => {
							const { result } = res;
							const responseKodepos = [];
							result.forEach(x => {
								responseKodepos.push({
									kecamatan: x.kecamatan,
									kabupaten: x.kabupaten,
									provinsi: x.provinsi,
									kelurahan: x.kelurahan
								})
							});
							this.setState({ loading: false, responseKodepos });
						})
						.catch(err => {
							if (err.response) {
								this.setState({ loading: false });
							}else{
								this.setState({ loading: false });
								alert("Network error");
							}
						})
				}else{
					this.setState({
						search: false,
						data: {
							...this.state.data,
							kodepos: '',
							kota: '',
							kecamatan: '',
							kelurahan: '',
							provinsi: '',
							alamatDetail: ''
						}
					});
				}
			}
		}
	}

	handleClose = () => {
		const { responseKodepos, selectedIndex } = this.state;
		if (selectedIndex !== null) {
			const choosed = responseKodepos[selectedIndex];
			this.setState({
				data: {
					...this.state.data,
					kota: choosed.kabupaten,
					alamatDetail: `${choosed.kelurahan}, ${choosed.kecamatan}, ${choosed.kabupaten}, ${choosed.provinsi}`,
					kecamatan: choosed.kecamatan,
					kelurahan: choosed.kelurahan,
					provinsi: choosed.provinsi
				},
				responseKodepos: []
			});
		}else{
			alert("Choose one");
		}
	}

	onChoose = (index) => this.setState({ selectedIndex: index })

	onSubmit = () => {
		const errors = this.validate(this.state.data);
		this.setState({ errors });
		if (Object.keys(errors).length === 0) {
			const { data } = this.state;
			if (!data.kelurahan) {
				alert("Data belum lengkap, harap pastikan ketika entri kodepos.. tombol pencarian harap diklik terlebih dahulu");
			}else{
				this.props.onSubmit(this.state.data);
			}
		}
	}

	onCheckedChange = () => {
		const { checked } = this.state;
		const { detail } = this.props.user;
		if (checked) {
			this.setState({
				checked: false,
				data: {
					nama: '',
					alamatUtama: '',
					kodepos: '',
					kota: '',
					kecamatan: '',
					kelurahan: '',
					provinsi: '',
					alamatDetail: '',
					email: '',
					noHp: ''	
				}
			})
		}else{
			const { kelurahan, kecamatan, kota, provinsi } = detail;
			this.setState({
				checked: true,
				data: {
					nama: capitalize(detail.nama),
					alamatUtama: capitalize(detail.alamatOl),
					kodepos: detail.kodepos,
					kota: capitalize(kota),
					kecamatan: capitalize(kecamatan),
					kelurahan: capitalize(kelurahan),
					provinsi: capitalize(provinsi),
					alamatDetail: `${capitalize(kelurahan)}, ${capitalize(kecamatan)}, ${capitalize(kota)}, ${capitalize(provinsi)}`,
					email: detail.email,
					noHp: detail.nohp
				},
				search: false
			})
		}
	}

	validate = (data) => {
		const errors = {};
		if (!data.nama) errors.nama = "Nama harap diisi";
		if (!data.alamatUtama) errors.alamatUtama = "Alamat utama harap diisi";
		if (!data.kodepos) errors.kodepos = "Kodepos harap diisi";
		if (!data.noHp) errors.noHp = "Nomor handphone harap diisi";
		if (!data.alamatDetail) errors.alamatDetail = "Kelurahan, kecamatan, kabupaten harap diisi";
		return errors;
	}

	render(){
		const { data, loading, responseKodepos, checked, errors } = this.state;

		return(
			<React.Fragment>
				<View style={{marginTop: 6, flex: 1, alignItems: 'flex-start', marginBottom: 6}}>
					<Toggle
				      text={`Gunakan data saya = ${checked ? 'On' : 'Off'}`}
				      checked={checked}
				      onChange={this.onCheckedChange}
				    />
				</View>
				<View style={styles.cardForm}>
					<Loader loading={loading} />
					{ responseKodepos.length > 0 && 
						<ListKabupaten 
							list={responseKodepos} 
							handleChange={this.onChoose}
							selectedIndex={this.state.selectedIndex}
							onPress={this.handleClose}
						/>}
					<Input 
						ref={this.namaRef}
					    placeholder='Masukkan nama pengirim'
						name='nama'
						label='* Nama'
						value={data.nama}
						style={styles.input}
						labelStyle={styles.label}
						onChangeText={(e) => this.onChange(e, this.namaRef.current.props)}
						onSubmitEditing={() => this.alamatUtamaRef.current.focus() }
						disabled={checked}
						status={errors.nama && 'danger'}
						caption={errors.nama && `${errors.nama}`}
					/>
					<Input 
						ref={this.alamatUtamaRef}
					    placeholder='Masukan jln, kp dll'
						name='alamatUtama'
						label='* Alamat utama'
						value={data.alamatUtama}
						style={styles.input}
						labelStyle={styles.label}
						onChangeText={(e) => this.onChange(e, this.alamatUtamaRef.current.props)}
						onSubmitEditing={() => this.kodeposRef.current.focus() }
						disabled={checked}
						status={errors.alamatUtama && 'danger'}
						caption={errors.alamatUtama && `${errors.alamatUtama}`}
					/>
					<Input 
						ref={this.kodeposRef}
					    placeholder='Masukan kodepos'
						name='kodepos'
						label='* Kodepos'
						value={data.kodepos}
						style={styles.input}
						labelStyle={styles.label}
						onChangeText={(e) => this.onChange(e, this.kodeposRef.current.props)}
						icon={(style) => renderIcon(style, this.state.search, checked)}
						onIconPress={this.onIconPress}
						disabled={this.state.search === true || checked === true && true}
						keyboardType='phone-pad'
						onSubmitEditing={this.onIconPress}
						status={errors.kodepos && 'danger'}
						caption={errors.kodepos && `${errors.kodepos}`}
					/>
					<Input 
						ref={this.alamatDetailRef}
					    placeholder='Kota/kab/kec/kel'
						name='alamatDetail'
						label='* Kota'
						value={data.alamatDetail}
						style={styles.input}
						labelStyle={styles.label}
						disabled={this.state.search === true || checked === true && true}
						onChangeText={(e) => this.onChange(e, this.alamatDetailRef.current.props)}
						status={errors.alamatDetail && 'danger'}
						caption={errors.alamatDetail && `${errors.alamatDetail}`}
					/>
					<Input 
						ref={this.emailRef}
					    placeholder='Masukan email'
						name='email'
						label='Email'
						value={data.email}
						style={styles.input}
						labelStyle={styles.label}
						onChangeText={(e) => this.onChange(e, this.emailRef.current.props)}
						onSubmitEditing={() => this.noHpRef.current.focus() }
						disabled={checked}
					/>
					<Input 
						ref={this.noHpRef}
					    placeholder='Masukan nomor handphone'
						name='noHp'
						keyboardType='phone-pad'
						label='* Nomor Handphone'
						value={data.noHp}
						style={styles.input}
						labelStyle={styles.label}
						onChangeText={(e) => this.onChange(e, this.noHpRef.current.props)}
						disabled={checked}
						status={errors.noHp && 'danger'}
						caption={errors.noHp && `${errors.noHp}`}
					/>
					<Button status='warning' style={{marginTop: 7}} onPress={this.onSubmit}>Selanjutnya</Button>
				</View>
			</React.Fragment>
		);
	}
}

export default FormPengirim;