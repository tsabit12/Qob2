import React from "react";
import { View, Text, Keyboard } from "react-native";
import { Input, Button, Icon, TouchableOpacity, Radio, RadioGroup, Toggle } from '@ui-kitten/components';
import styles from "../styles";
import Loader from "../../../Loader";
import apiWs from "../../../apiWs";
// import Dialog from "react-native-dialog";

const renderIcon = (style, search, checked) => (
	<View style={{backgroundColor: checked ? '#0d4cde' : search ? '#fa4a0a' : '#909190', alignItems: 'center', borderRadius: 13, justifyContent: 'center'}}>
    	{ checked ? <Icon name='checkmark-outline' width={18} height={19} fill='#FFF'/> :
    		<Icon name={search ? 'close-outline' : 'search-outline'} width={18} height={19} fill='#FFF'/> }
    </View>
);

const capitalize = (string) => {
	if (string) {
		return string.toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ');
	}else{
		return string;
	}
}

const ListKabupaten = ({ list, handleChange, selectedIndex, onPress }) => {
	return(
		<View>
	        <View style={{flex: 1, backgroundColor: '#c3c4be', padding: 10 }}>
	        	<View style={{borderBottomWidth: 0.6}}>
	        		<Text style={{textAlign: 'center', fontFamily: 'open-sans-reg'}}>Pilih Alamat Lengkap</Text>
	        	</View>
	        	<RadioGroup
					selectedIndex={selectedIndex}
		        	onChange={(e) => handleChange(e)}
				>
				{ list.map((x, i) => 
					<Radio
						key={i}
				        style={{flex: 1}}
				        status='warning'
				        text={`${x.kelurahan}, ${x.kecamatan}, ${x.kabupaten}, ${x.provinsi}`}
				      /> )}
				</RadioGroup>
	        </View>
        </View>
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
	searchParamsRef = React.createRef();

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
		checked: true,
		searchParams: ''
	}

	onChange = (e, { name }) => this.setState({ data: { ...this.state.data, [name]: e }})

	onChangeParams = (e, { name }) => this.setState({ searchParams: e })

	componentDidMount(){
		const { detail } = this.props.user;
		console.log(detail);
		const { kelurahan, kecamatan, kota, provinsi } = detail;
		this.setState({
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

	onIconPress = () => {
		const { checked } = this.state;
		//only work when not using user profile
		if (!checked) {
			if (!this.state.searchParams) {
				alert("Alamat lengkap harap diisi");
			}else{
				const { search } = this.state;
				if (!search) {
					this.setState({ search: true, loading: true });
					Keyboard.dismiss();
					apiWs.qob.getKodePos(this.state.searchParams)
						.then(res => {
							const { result } = res;
							const responseKodepos = [];
							result.forEach(x => {
								responseKodepos.push({
									kecamatan: x.kecamatan,
									kabupaten: x.kabupaten,
									provinsi: x.provinsi,
									kelurahan: x.kelurahan,
									kodepos: x.kodepos
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
						},
						searchParams: '',
						responseKodepos: [],
						selectedIndex: null
					});
				}
			}
		}
	}

	// handleClose = () => {
	// 	const { responseKodepos, selectedIndex } = this.state;
	// 	if (selectedIndex !== null) {
	// 		const choosed = responseKodepos[selectedIndex];
	// 		this.setState({
	// 			data: {
	// 				...this.state.data,
	// 				kota: choosed.kabupaten,
	// 				alamatDetail: `${choosed.kelurahan}, ${choosed.kecamatan}, ${choosed.kabupaten}, ${choosed.provinsi}`,
	// 				kecamatan: choosed.kecamatan,
	// 				kelurahan: choosed.kelurahan,
	// 				provinsi: choosed.provinsi,
	// 				kodepos: choosed.kodepos
	// 			},
	// 			responseKodepos: []
	// 		});
	// 	}else{
	// 		alert("Choose one");
	// 	}
	// }

	onChoose = (index) => {
		const choosed = this.state.responseKodepos[index];
		this.setState({
			data: {
				...this.state.data,
				kota: choosed.kabupaten,
				alamatDetail: `${choosed.kelurahan}, ${choosed.kecamatan}, ${choosed.kabupaten}, ${choosed.provinsi}`,
				kecamatan: choosed.kecamatan,
				kelurahan: choosed.kelurahan,
				provinsi: choosed.provinsi,
				kodepos: choosed.kodepos
			},
			responseKodepos: [],
			selectedIndex: index
		});	
	}

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
		// console.log(data);
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
						status={errors.nama ? 'danger' : 'primary'}
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
						onSubmitEditing={() => this.searchParamsRef.current.focus() }
						disabled={checked}
						status={errors.alamatUtama ? 'danger' : 'primary'}
						caption={errors.alamatUtama && `${errors.alamatUtama}`}
					/>
					{ !checked && <Input 
						ref={this.searchParamsRef}
					    placeholder='Kodepos/kelurahan/kec/kab'
						name='searchParams'
						label='Cari Alamat Lengkap'
						value={this.state.searchParams}
						style={styles.input}
						labelStyle={styles.label}
						onChangeText={(e) => this.onChangeParams(e, this.searchParamsRef.current.props)}
						icon={(style) => renderIcon(style, this.state.search, checked)}
						onIconPress={this.onIconPress}
						disabled={this.state.search === true || checked === true && true}
						//keyboardType='phone-pad'
						onSubmitEditing={this.onIconPress}
						status={errors.kodepos ? 'danger' : 'primary'}
						caption={errors.kodepos && `${errors.kodepos}`}
					/> }
					{ responseKodepos.length > 0 && 
						<ListKabupaten 
							list={responseKodepos} 
							handleChange={this.onChoose}
							selectedIndex={this.state.selectedIndex}
							onPress={this.handleClose}
						/>}
					<Input 
						ref={this.kodeposRef}
					    placeholder='Cari alamat lengkap dahulu'
						name='kodepos'
						label='Kodepos'
						value={data.kodepos}
						style={styles.input}
						labelStyle={styles.label}
						onIconPress={this.onIconPress}
						disabled={true}
						caption={errors.Kodepos && `${errors.Kodepos}`}
					/>
					<Input 
						ref={this.alamatDetailRef}
					    placeholder='Cari alamat lengkap dahulu'
						name='alamatDetail'
						label='Alamat Lengkap'
						value={data.alamatDetail}
						style={styles.input}
						labelStyle={styles.label}
						// disabled={this.state.search === true || checked === true && true}
						disabled={true}
						onChangeText={(e) => this.onChange(e, this.alamatDetailRef.current.props)}
						status={errors.alamatDetail && 'danger'}
						caption={errors.alamatDetail && `${errors.alamatDetail}`}
						onSubmitEditing={() => this.emailRef.current.focus() }
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
						status='primary'
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
						status={errors.noHp ? 'danger' : 'primary'}
						caption={errors.noHp && `${errors.noHp}`}
					/>
					<Button status='warning' style={{marginTop: 7}} onPress={this.onSubmit}>Selanjutnya</Button>
				</View>
			</React.Fragment>
		);
	}
}

export default FormPengirim;