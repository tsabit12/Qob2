import React from "react";
import { View, Text, StyleSheet, Keyboard, ScrollView, Dimensions } from "react-native";
import { Input, Button, Radio, RadioGroup, Icon } from '@ui-kitten/components';
import apiWs from "../../../apiWs";

const device = Dimensions.get('window').width;

const capitalize = (string) => {
	return string.toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ');
}

const OptionsKodepos = ({ list, handleChange, selectedIndex }) => (
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
		        text={`${x.kecamatan}, ${x.kabupaten}, ${x.provinsi}`}
		      /> )}
		</RadioGroup>
	</View>
);

class PenerimaForm extends React.Component{
	namRef = React.createRef();
	alamatUtamaRef = React.createRef();
	kodeposRef = React.createRef();
	emailRef = React.createRef();
	phoneRef = React.createRef();
	searchParamsRef = React.createRef();

	state = {
		data: {
			nama: '',
			alamatUtama: '',
			kodepos: '',
			email: '',
			nohp: '',
			kabupaten: '',
			kecamatan: '',
			kelurahan: '',
			provinsi: '',
			alamatDetail: ''
		},
		errors: {},
		loading: false,
		responseKodepos: [],
		choosed: null,
		disabledKodePos: false,
		searchParams: ''
	}

	onChange = (e, { name }) => this.setState({ 
		data: { ...this.state.data, [name]: e },
		errors: { ...this.state.errors, [name]: undefined }
	})

	onChangeParams = (e, { name }) => this.setState({ 
		searchParams: e,
		errors: { ...this.state.errors, kodepos: undefined } 
	})

	searchKodepos = () => {
		if (!this.state.searchParams) {
			alert("Kode pos harap diisi");
		}else{
			Keyboard.dismiss();
			this.setState({ loading: true, errors: {}, responseKodepos: [] });
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
						this.setState({ loading: false, errors: { searchParams: 'Alamat tidak ditemukan' } });
					}else{
						this.setState({ loading: false, errors: { searchParams: 'Network Error'} });
					}
				})
		}
	}

	onChangeOptions = (index) => {
		const { responseKodepos } = this.state;
		const choos = responseKodepos[index];
		this.setState({ 
			choosed: index, 
			disabledKodePos: true,
			data: {
				...this.state.data,
				kodepos: choos.kodepos,
				kabupaten: choos.kabupaten,
				kecamatan: choos.kecamatan,
				kelurahan: choos.kelurahan,
				provinsi: choos.provinsi,
				alamatDetail: `${choos.kecamatan}, ${choos.kabupaten}, ${choos.provinsi}`,
			},
			responseKodepos: []
		})
	} 

	renderIcon = (style) => (
		<View 
			style={{
				backgroundColor: this.state.disabledKodePos ? '#0d4cde' : '#fa4a0a', 
				alignItems: 'center', 
				justifyContent: 'center', 
				borderRadius: 16, width: 30, height: 29 
			}}
		>
    		<Icon 
    			{...style} 
    			name={this.state.disabledKodePos ? 'close-outline' : 'search-outline'} 
    			fill='#FFF' height={19} width={18}/>
    	</View>
  	)

  	handlePressIcon = () => {
  		const { disabledKodePos } = this.state;
  		if (disabledKodePos) {
  			this.setState({ 
  				responseKodepos: [], 
  				data: { 
  					...this.state.data, 
  					kodepos: '',
  					kabupaten: '',
					kecamatan: '',
					kelurahan: '',
					provinsi: '',
					alamatDetail: ''
  				}, 
  				choosed: null, 
  				disabledKodePos: false,
  				searchParams: ''
  			});
  		}else{
  			this.searchKodepos();
  		}
  	}

  	onSubmit = () => {
  		const errors = this.validate(this.state.data);
  		this.setState({ errors });
  		if (Object.keys(errors).length === 0) {
  			const { choosed, data } = this.state;
  			// console.log(choosed);
  			if (choosed === null) {
  				alert("Kelurahan/kecamatan/kabupaten belum dipilih. Harap klik cari pada kolom kodepos, lalu pilih kelurahan penerima");
  			}else{
  				const payload = {
  					nama: data.nama,
  					kodepos: data.kodepos,
					email: data.email,
					nohp: data.nohp,
					kabupaten: data.kabupaten,
					kecamatan: data.kecamatan,
					kelurahan: data.kelurahan,
					provinsi: data.provinsi,
					alamatUtama: data.alamatUtama
  				};
  				this.props.onSubmit(payload);
  			}
  		}
  	}

  	validate = (data) => {
  		const errors = {};
  		if (!data.nama) errors.nama = 'Field harap diisi';
  		if (!data.alamatUtama) errors.alamatUtama = 'Field harap diisi';
  		if (!data.kodepos) errors.kodepos = 'Field harap diisi';
  		if (!data.nohp) errors.nohp = 'Field harap diisi';
  		return errors;
  	}

	render(){
		const { data, errors, loading, responseKodepos } = this.state;

		return(
			<React.Fragment>
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
				      status={errors.nama ? 'danger' : 'primary'}
				      onSubmitEditing={() => this.alamatUtamaRef.current.focus() }
				      caption={errors.nama && `${errors.nama}`}
				      returnKeyType='next'
					/>
					<Input 
				      ref={this.alamatUtamaRef}
				      placeholder='Masukkan alamat utama (Jln/jl/ds/kp)'
				      name='alamatUtama'
				      label='* Alamat Utama Penerima'
				      labelStyle={styles.label}
				      style={styles.input}
				      value={data.alamatUtama}
				      onChangeText={(e) => this.onChange(e, this.alamatUtamaRef.current.props)}
				      status={errors.alamatUtama ? 'danger' : 'primary'}
				      onSubmitEditing={() => this.searchParamsRef.current.focus() }
				      caption={errors.alamatUtama && `${errors.alamatUtama}`}
				      returnKeyType='next'
					/>
					<Input 
						ref={this.searchParamsRef}
						value={this.state.searchParams}
						name='searchParams'
						style={styles.inputFlex}
						labelStyle={styles.label}
						label='Cari Kecamatan/Kota'
						placeholder='Masukkan kecamatan/Kota'
						onIconPress={this.handlePressIcon}
						disabled={this.state.disabledKodePos}
						icon={(style) => this.renderIcon(style)}
						onChangeText={(e) => this.onChangeParams(e, this.searchParamsRef.current.props)}
						caption={errors.searchParams || errors.kodepos && `Field harap diisi`}
						status={errors.searchParams || errors.kodepos ? 'danger' : 'primary'}
						onSubmitEditing={this.searchKodepos}
						returnKeyType='search'
					/>
					{ loading && <Text style={{marginTop: 5, marginBottom: 5}}>Searching...</Text>}
					{ responseKodepos.length > 0 && 
						<ScrollView style={{height: device*0.5}} nestedScrollEnabled={true}>
							<OptionsKodepos 
								list={responseKodepos} 
								handleChange={this.onChangeOptions}
								selectedIndex={this.state.choosed}
							/> 
						</ScrollView>}
					<Input 
						value={data.kodepos}
						name='kodepos'
						style={styles.inputFlex}
						labelStyle={styles.label}
						label='Kodepos'
						placeholder='Cari kecamatan/kota dahulu'
						disabled={true}
					/>
					<Input 
					    placeholder='Cari kecamatan/kota dahulu'
						name='alamatDetail'
						label='Alamat Lengkap'
						value={data.alamatDetail}
						style={styles.input}
						labelStyle={styles.label}
						disabled={true}
					/>
					<Input 
				    	placeholder='Masukan email'
				    	ref={this.emailRef}
				    	name='email'
						label='Email Penerima'
				    	style={{ paddingTop: 7 }}
				    	labelStyle={styles.label}
				    	value={data.email}
				    	status='primary'
				    	onChangeText={(e) => this.onChange(e, this.emailRef.current.props)}
				    	onSubmitEditing={() => this.phoneRef.current.focus() }
				    	keyboardType='email-address'
						autoCapitalize='none'
						returnKeyType='next'
				    />
				    <Input 
				    	placeholder='Masukan nomor handphone'
				    	ref={this.phoneRef}
				    	name='nohp'
						label='* No Handphone penerima'
						keyboardType='phone-pad'
				    	style={{ paddingTop: 7 }}
				    	labelStyle={styles.label}
				    	value={data.nohp}
				    	onChangeText={(e) => this.onChange(e, this.phoneRef.current.props)}
				    	onSubmitEditing={this.onSubmit}
				    	status={errors.nohp ? 'danger' : 'primary'}
				    	caption={errors.nohp && `${errors.nohp}`}
				    	returnKeyType='done'
				    />
				</View>
				<View style={{ margin: 10, marginTop: -6}}>
					<Button status='warning' onPress={this.onSubmit}>Selanjutnya</Button>
				</View>
			</React.Fragment>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		margin: 10,
		borderWidth: 0.9,
		borderColor: '#dee0de',
		borderRadius: 5,
		padding: 5
	},
	label: {
	  	color: 'black',
	  	fontSize: 14,
	  	fontFamily: 'open-sans-reg'
	},
	input: {
		marginTop: 5
	},
	groupInput:{
		flexDirection: 'row',
		alignSelf: 'stretch',
		paddingBottom: 7,
		marginTop: 5
	},
	inputFlex: {
		flex: 1,
		marginTop: 5
	}
})

export default PenerimaForm;