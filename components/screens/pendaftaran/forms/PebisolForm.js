import React from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { Input, Button,TouchableOpacity, Icon, RadioGroup, Radio } from '@ui-kitten/components';
import Loader from "../../../Loader";
import apiWs from "../../../apiWs";

const RenderListAlamat = ({ list, handleChange, selectedIndex }) => {
	return(
		<View style={{backgroundColor: '#c3c4be', padding: 10 }}>
			<View style={{height: 30, borderBottomWidth: 0.7}}>
				<Text style={{textAlign: 'center'}}>Pilih Alamat Lengkap</Text>
			</View>
			<RadioGroup
				selectedIndex={selectedIndex}
	        	onChange={(e) => handleChange(e)}
			>
			{ list.map((x, i) => 
				<Radio
					key={i}
			        style={styles.radio}
			        status='warning'
			        text={`${x.kelurahan}, ${x.kecamatan}, ${x.kabupaten}, ${x.provinsi} (${x.kodepos})`}
			      /> )}
			</RadioGroup>
		</View>
	);
}

const numberWithCommas = (number) => {
	return number.toString().replace(/\B(?=(\d{4})+(?!\d))/g, "-");
}

const renderIconInput = (style) => (
	<View 
		style={{
			backgroundColor: '#fa4a0a', 
			alignItems: 'center', 
			justifyContent: 'center', 
			borderRadius: 16, width: 30, height: 29 
		}}
	>
		<Icon {...style} name='close-outline' fill='#FFF' height={19} width={18}/>
	</View>
)

const RenderInputAlamat = ({ datanya, resetSearchParams }) => (
	<Input 
		label='Alamat lengkap'
		value={`Kel ${datanya.kelurahan}, Kec. ${datanya.kecamatan}, Kab. ${datanya.kabupaten}, Prov. ${datanya.provinsi}`}
		style={styles.input}
		labelStyle={styles.label}
		disabled
		onIconPress={resetSearchParams}
		icon={(style) => renderIconInput(style)}
	/>	
);

class PebisolForm extends React.Component{
	alamatUtamaRef = React.createRef();
	namaRef = React.createRef();
	noHpRef = React.createRef();
	searchParamsRef = React.createRef();
	emailRef = React.createRef();
	jenisUsahaRef = React.createRef();
	namaUsahaRef = React.createRef();

	state = {
		data: {
			alamatUtama: '',
			nama: '',
			noHp: '',
			email: '',
			namaUsaha: '',
			jenisUsaha: ''
		},
		searchParams: '',
		disabledKodePos: false,
		errors: {},
		responseKodepos: [],
		loading: false,
		selectedIndex: null,
		alamat: {}
	}

	onChange = (e, { name }) => {
		if (name === 'noHp') {
			var val = e.replace(/\D/g, '');
			var x 	= Number(val);
			const value = numberWithCommas(x);
			this.setState({ 
				data: { ...this.state.data, [name]: value },
				errors: {
					...this.state.errors, [name]: undefined
				}
			});
		}else{
			 this.setState({ 
			 	data: { ...this.state.data, [name]: e },
			 	errors: {
			 		...this.state.errors, [name]: undefined
			 	}
			 })
		}
	}


	renderIcon = (style) => (
		<View 
			style={{
				backgroundColor: '#fa4a0a', 
				alignItems: 'center', 
				justifyContent: 'center', 
				borderRadius: 16, width: 30, height: 29 
			}}
		>
    		<Icon {...style} name='search-outline' fill='#FFF' height={19} width={18}/>
    	</View>
  	)

  	onChangeParams = (e) => this.setState({ searchParams: e }) 

  	searchAlamat = () => {
  		if (!this.state.searchParams) {
  			Alert.alert(
			  'Oppps',
			  'Field alamat lengkap harap diisi',
			  [
			    {text: 'OK', onPress: () => this.searchParamsRef.current.focus()},
			  ],
			  {cancelable: false},
			);
  		}else{
  			this.setState({ loading: true, errors: {}, responseKodepos: [], selectedIndex: null });
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
					if (err.status) {
						this.setState({ loading: false, errors: { searchParams: 'Data tidak ditemukan' } });
					}else{
						this.setState({ loading: false, errors: { searchParams: 'Internal Server error'} });
					}
				})
		}
  	}

  	onChangeAlamat = (index) => {
  		const { responseKodepos } = this.state;
  		this.setState({ 
  			selectedIndex: index, 
  			responseKodepos: [], 
  			alamat: {
  				kecamatan: responseKodepos[index].kecamatan,
  				kelurahan: responseKodepos[index].kelurahan,
  				kabupaten: responseKodepos[index].kabupaten,
  				provinsi: responseKodepos[index].provinsi,
  				kodepos: responseKodepos[index].kodepos
  			} 
  		});
  		this.noHpRef.current.focus()
  	}

  	onResetSearchParams = () => {
  		this.setState({ searchParams: '', alamat: {} });
  		setTimeout(() => this.searchParamsRef.current.focus(), 500);	
  	}

  	onSubmit = () => {
  		const errors = this.validate(this.state.data);
  		this.setState({ errors });
  		if (Object.keys(errors).length === 0) {
  			//checking alamat
  			if (Object.keys(this.state.alamat).length === 5) {
  				const { data, alamat } = this.state;
  				const payload = {
  					...data,
  					noHp: `0${data.noHp.replace(/\D/g, '')}`,
  					...alamat
  				}
  				this.props.onSubmit(payload);
  			}else{
  				Alert.alert(
				  'Oppps',
				  'Alamat belum lengkap, harap pastikan bahwa kel/kec/kab/prov sudah dipilih dari field pencarian alamat lengkap',
				  [
				    {text: 'OK', onPress: () => this.searchParamsRef.current.focus()},
				  ],
				  {cancelable: false},
				);
  			}
  		}
  	}

  	validate = (data) => {
  		const errors = {};
  		if (!data.nama) errors.nama = "Nama lengkap harap diisi";
  		if (!data.alamatUtama) errors.alamatUtama = "Alamat utama harap diisi";
  		if (!data.noHp) errors.noHp = "Nomor handphone harap diisi";
  		if (!data.email) errors.email = "Email harap diisi";
  		if (!data.namaUsaha) errors.namaUsaha = "Nama usaha harap diisi";
  		if (!data.jenisUsaha) errors.jenisUsaha = "Jenis usaha harap diisi";
  		
  		if (data.noHp) {
  			var regex 			= /^(^\+62\s?|^0)(\d{3,4}-?){2}\d{3,4}$/;
  			const phoneValues 	= `0${data.noHp.replace(/\D/g, '')}`;
  			if (!regex.test(phoneValues)) errors.noHp = "Nomor handphone tidak valid"; 
  		}

  		if (data.email) {
			//regex email
			var re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
			if (!re.test(data.email)) errors.email = "Email tidak valid";
		}

  		return errors;
  	}

	render(){
		const { data, errors, loading, responseKodepos } = this.state;
		return(
			<React.Fragment>
				<Loader loading={loading} />
				<View style={{flex: 1, margin: 5, borderWidth: 0.6, borderColor: '#bdbbb7', padding: 7, borderRadius: 3}}>
					<Input 
						ref={this.namaRef}
					    placeholder='Masukkan nama lengkap anda'
						name='nama'
						label='* Nama Lengkap'
						value={data.nama}
						style={styles.input}
						autoCapitalize='words'
						labelStyle={styles.label}
						onChangeText={(e) => this.onChange(e, this.namaRef.current.props)}
						onSubmitEditing={() => this.namaUsahaRef.current.focus() }
						status={errors.nama ? 'danger' : 'primary'}
						caption={errors.nama && `${errors.nama}`}
					/>
					<Input 
						ref={this.namaUsahaRef}
					    placeholder='Masukkan nama usaha'
						name='namaUsaha'
						label='* Nama Usaha'
						value={data.namaUsaha}
						style={styles.input}
						autoCapitalize='words'
						labelStyle={styles.label}
						onChangeText={(e) => this.onChange(e, this.namaUsahaRef.current.props)}
						onSubmitEditing={() => this.jenisUsahaRef.current.focus() }
						status={errors.namaUsaha ? 'danger' : 'primary'}
						caption={errors.namaUsaha && `${errors.namaUsaha}`}
					/>
					<Input 
						ref={this.jenisUsahaRef}
					    placeholder='contoh: sepatu/pakaian dll'
						name='jenisUsaha'
						label='* Jenis Usaha'
						value={data.jenisUsaha}
						style={styles.input}
						labelStyle={styles.label}
						onChangeText={(e) => this.onChange(e, this.jenisUsahaRef.current.props)}
						onSubmitEditing={() => this.alamatUtamaRef.current.focus() }
						status={errors.jenisUsaha ? 'danger' : 'primary'}
						caption={errors.jenisUsaha && `${errors.jenisUsaha}`}
					/>
					<Input 
						ref={this.alamatUtamaRef}
					    placeholder='Masukkan alamat utama (jln/jl/ds/kp)'
						name='alamatUtama'
						label='* Alamat Utama'
						value={data.alamatUtama}
						style={styles.input}
						labelStyle={styles.label}
						onChangeText={(e) => this.onChange(e, this.alamatUtamaRef.current.props)}
						onSubmitEditing={() => this.searchParamsRef.current.focus() }
						status={errors.alamatUtama ? 'danger' : 'primary'}
						caption={errors.alamatUtama && `${errors.alamatUtama}`}
					/>
					{ Object.keys(this.state.alamat).length === 5 ? 
						<RenderInputAlamat datanya={this.state.alamat} resetSearchParams={this.onResetSearchParams} /> : 
						<Input 
						ref={this.searchParamsRef}
						value={this.state.searchParams}
						name='searchParams'
						style={styles.input}
						labelStyle={styles.label}
						label='Cari Alamat Lengkap'
						placeholder='Kodepos/kelurahan/kec/kab'
						onIconPress={this.searchAlamat}
						icon={(style) => this.renderIcon(style)}
						onChangeText={this.onChangeParams}
						caption={errors.searchParams && `${errors.searchParams}`}
						status={errors.searchParams ? 'danger' : 'primary'}
						onSubmitEditing={this.searchAlamat}
					/> }
					{ responseKodepos.length > 0 && 
						<RenderListAlamat 
							list={responseKodepos} 
							handleChange={this.onChangeAlamat} 
							selectedIndex={this.state.selectedIndex}
						/> }
					<View style={{marginTop: 5, marginBottom: 5}}>
						<Text style={styles.label}>* Nomor Handphone (WhatsApp)</Text>
						<View style={{flexDirection: 'row', alignItems: 'center'}}>
							<Text style={{fontSize: 16}}>+62</Text>
							<Input 
								ref={this.noHpRef}
							    placeholder='8XX-XXXX-XXXX'
								name='noHp'
								// label='* Nomor Handphone'
								value={data.noHp}
								style={{ marginTop: 5, flex: 1, marginLeft: 5 }}
								labelStyle={styles.label}
								keyboardType='phone-pad'
								onChangeText={(e) => this.onChange(e, this.noHpRef.current.props)}
								onSubmitEditing={() => this.emailRef.current.focus() }
								status={errors.noHp ? 'danger' : 'primary'}
								caption={errors.noHp && `${errors.noHp}`}
							/>
						</View>
					</View>
					<Input 
						ref={this.emailRef}
					    placeholder='Masukkan alamat email'
						name='email'
						label='* Email'
						value={data.email}
						style={styles.input}
						labelStyle={styles.label}
						onChangeText={(e) => this.onChange(e, this.emailRef.current.props)}
						onSubmitEditing={this.onSubmit}
						status={errors.email ? 'danger' : 'primary'}
						caption={errors.email && `${errors.email}`}
						keyboardType='email-address'
						autoCapitalize='none'
					/>
				</View>
				<Button style={{margin: 6}} onPress={this.onSubmit}>Daftar</Button>
			</React.Fragment>
		);
	}
}

const styles = StyleSheet.create({
	input: {
		marginTop: 5
	},
	label: {
	  	color: 'black',
	  	fontSize: 14,
	  	fontFamily: 'open-sans-reg'
	},
})

export default PebisolForm;