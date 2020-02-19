import React from "react";
import { View, Text, StyleSheet, Keyboard } from "react-native";
import { Input, Button, Radio, RadioGroup, Icon } from '@ui-kitten/components';
import apiWs from "../../../apiWs";

const OptionsKodepos = ({ list, handleChange, selectedIndex }) => (
	<View style={{borderWidth: 0.7, borderColor: '#e0e0e0', padding: 10 }}>
		<View style={{height: 30, borderBottomWidth: 0.7}}>
			<Text style={{textAlign: 'center'}}>Pilih kelurahan</Text>
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
		        text={x.kelurahan}
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

	state = {
		data: {
			nama: '',
			alamatUtama: '',
			kodepos: '',
			email: '',
			nohp: ''
		},
		errors: {},
		loading: false,
		responseKodepos: [],
		choosed: null,
		disabledKodePos: false
	}

	onChange = (e, { name }) => this.setState({ data: { ...this.state.data, [name]: e }})

	searchKodepos = () => {
		const { kodepos } = this.state.data;
		if (!kodepos) {
			alert("Kode pos harap diisi");
		}else{
			Keyboard.dismiss();
			this.setState({ loading: true, errors: {}, responseKodepos: [] });
			apiWs.qob.getKodePos(kodepos)
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
					if (err.response.status === '500') {
						this.setState({ loading: false, errors: { global: 'Internal Server error' } });
					}else{
						this.setState({ loading: false, errors: { global: 'Data kodepos tidak ditemukan'} });
					}
				})
		}
	}

	onChangeOptions = (index) => this.setState({ choosed: index, disabledKodePos: true })

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
  			this.setState({ responseKodepos: [], data: { ...this.state.data, kodepos: ''}, choosed: null, disabledKodePos: false });
  		}else{
  			this.searchKodepos();
  		}
  	}

  	onSubmit = () => {
  		const errors = this.validate(this.state.data);
  		this.setState({ errors });
  		if (Object.keys(errors).length === 0) {
  			const { choosed, responseKodepos, data } = this.state;
  			// console.log(choosed);
  			if (choosed === null) {
  				alert("Whopppps, kelurahan/kecamatan/kabupaten belum dipilih. Harap klik cari pada kolom kodepos, lalu pilih kelurahan penerima");
  			}else{
  				const selected = responseKodepos[choosed];
  				const payload = {
  					nama: data.nama,
  					kodepos: data.kodepos,
					email: data.email,
					nohp: data.nohp,
					kabupaten: selected.kabupaten,
					kecamatan: selected.kecamatan,
					kelurahan: selected.kelurahan,
					provinsi: selected.provinsi,
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
				      status={errors.nama && 'danger'}
				      onSubmitEditing={() => this.alamatUtamaRef.current.focus() }
				      caption={errors.nama && `${errors.nama}`}
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
						value={data.kodepos}
						name='kodepos'
						style={styles.inputFlex}
						labelStyle={styles.label}
						label='* Kodepos Penerima'
						placeholder='Masukkan kodepos'
						keyboardType='phone-pad'
						onIconPress={this.handlePressIcon}
						disabled={this.state.disabledKodePos}
						icon={(style) => this.renderIcon(style)}
						onChangeText={(e) => this.onChange(e, this.kodeposRef.current.props)}
						caption={errors.kodepos && `${errors.kodepos}`}
						status={errors.kodepos && 'danger'}
						onSubmitEditing={this.searchKodepos}
					/>
					{ loading && <Text>Searching...</Text>}
					{ responseKodepos.length > 0 && 
						<OptionsKodepos 
							list={responseKodepos} 
							handleChange={this.onChangeOptions}
							selectedIndex={this.state.choosed}
						/> }
					{ errors.global && <Text style={{color:'red', fontSize: 12, marginTop: -7}}>{errors.global}</Text>}
					<Input 
				    	placeholder='Masukan email'
				    	ref={this.emailRef}
				    	name='email'
						label='Email Penerima'
						keyboardType='email-address'
				    	style={{ paddingTop: 7 }}
				    	labelStyle={styles.label}
				    	value={data.email}
				    	onChangeText={(e) => this.onChange(e, this.emailRef.current.props)}
				    	onSubmitEditing={() => this.phoneRef.current.focus() }
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
				    	status={errors.nohp && 'danger'}
				    	caption={errors.nohp && `${errors.nohp}`}
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
		flex: 1
	}
})

export default PenerimaForm;