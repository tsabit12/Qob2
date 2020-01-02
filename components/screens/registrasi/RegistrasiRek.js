import React from "react";
import { View, ImageBackground, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Image } from "react-native";
import { Input, Text, Button } from '@ui-kitten/components';
import Loader from "../../Loader";
import { connect } from "react-redux";
import { getRek, registerGiro } from "../../../actions/register";
import md5 from "react-native-md5";
import Modal from "../../Modal";


const Judul = ({ navigation }) => (
	<View>
		<Text style = {{fontSize: 16, fontWeight: '700'}}>Registrasi</Text>
		<Text style={{fontStyle: 'italic', fontSize: 12}}>
			Memiliki Rekening Giro
		</Text>
	</View>
);

class RegistrasiRek extends React.Component{
	static navigationOptions = ({ navigation }) => ({
		headerTitle: <Judul navigation={navigation}/>
	})
	
	noRekRef = React.createRef();
	usernameRef = React.createRef();
	passwordRef = React.createRef();
	nmOlshopRef = React.createRef();
	namaPanggilanRef = React.createRef();
	noHpRef = React.createRef();
	npwpRef = React.createRef();
	emailRef = React.createRef();
	imeiRef = React.createRef();
	kodeposRef = React.createRef();
	provRef = React.createRef();
	kabRef = React.createRef();
	kecRef = React.createRef();
	kelRef = React.createRef();
	alamatRef = React.createRef();
	fullnameRef = React.createRef();


	state = {
		data: {
			noRek: '',
			fullname:'',
			namaPanggilan: '',
			noHp: '',
			npwp: '',
			email: '',
			imei: '',
			kodepos: '',
			gender: '',
			username: '',
			password: '',
			nmOlshop: '',
			alamat: '',
			provinsi: '',
			kab: '',
			kec: '',
			kel:'',
		},
		secureTextEntry: true,
		errors: {},
		loading: false,
		modal: true,
		visible: false
	}

	componentDidMount(){
		setTimeout(() => this.noRekRef.current.focus(), 500)
	}

	onChangeText = (e, ref) => {
		const { current: {props: { name }}} = ref;
		this.setState({ data: { ...this.state.data, [name]: e }})
	} 

	onSearch = () => {
		const errors = this.validate(this.state.noRek);
		this.setState({ errors });
		if (Object.keys(errors).length === 0) {
			this.setState({ loading: true });
			this.props.getRek(this.state.noRek)
				.then(() => this.setState({ loading: false }))
				.catch(err => this.setState({ loading: false, errors: { noRek: err.desk_mess } }))
		}
	}

	validate = (noRek) => {
		const errors = {};
		if (!noRek) errors.noRek = "Masukan nomor rekening giro";
		return errors;
	}
	
	renderIcon = (style) => {
		const { secureTextEntry } = this.state;
		return(
			<Image
		      style={style} 
		      source={ secureTextEntry ? require('../../icons/eye-off-outline.png') : require('../../icons/eye-outline.png')}
		    />
		);
	}

	onSubmit = () => {
		this.setState({ loading : true, modal: true });
		const { data } = this.state;
		const pass 		= md5.hex_md5(data.password);
		const param1   = `${data.username}|${pass}|${data.fullname}|${data.namaPanggilan}|${data.noHp}|${data.email}|${data.npwp}|${data.imei}`;
		const param2   = `${data.noRek}`;
		const param3   = `${data.nmOlshop}|${data.nmOlshop}|${data.alamat}|${data.kel}|${data.kec}|${data.kel}|${data.kab}|${data.provinsi}|${data.kodepos}`;
		const payload  ={
			params1: param1,
			params2: param2,
			params3: param3
		}
		
		console.log(payload);

		this.props.registerGiro(payload)
			.then(res => { 
				this.props.navigation.navigate({
					routeName: 'RegisterSukses'
				});
				this.setState({ loading: false, errors: {}, visible: false})
			})
				.catch(err => this.setState({ 
					errors: {global: 'Data tidak ditemukan'},
					visible: true, 
					loading: false }))
	}
	
	render(){
		const { noRek, errors, loading, data, secureTextEntry  } = this.state;

		return(
			<ImageBackground 
				style={styles.backgroundImage}
				
			>
				<View style={styles.content}> 
					<Loader loading={loading} />
					{ errors.global && 
					<Modal 
						loading={!!errors.global} 
						text={errors.global} 
						handleClose={() => this.setState({ errors : {} })}
					/>}
					<KeyboardAvoidingView 
						behavior="padding" 
						keyboardVerticalOffset={
						  Platform.select({
						     ios: () => 0,
						     android: () => 100
						  })()
						}
					>
					<ScrollView>
						<View style={styles.input}>
					        <Input
								label='Rekening Giro'
					        	placeholder='Masukan nomor rekening disini'
					        	ref={this.noRekRef}
					        	name='noRek'
					        	value={data.noRek}
					        	onChangeText={(e) => this.onChangeText(e, this.noRekRef)}
					        	status={errors.noRek && 'danger'}
					        	// onSubmitEditing={this.onSearch}
								keyboardType='numeric'
								size='small'
								onSubmitEditing={() => this.fullnameRef.current.focus() }
					        />
							{ errors.noRek && <Text style={styles.errors}>{errors.noRek}</Text>}
							<Input
								ref={this.fullnameRef}
								placeholder='Masukan Nama Lengkap'
								label='Nama Lengkap'
								name='fullname'
								value={data.fullname}
								labelStyle={styles.label}
								onChangeText={(e) => this.onChangeText(e, this.fullnameRef)}
								size='small'
								status={errors.username && 'danger' }
								onSubmitEditing={() => this.usernameRef.current.focus() }
							/>
							<Input
								ref={this.usernameRef}
								placeholder='Masukan username'
								label='Username'
								name='username'
								value={data.username}
								labelStyle={styles.label}
								onChangeText={(e) => this.onChangeText(e, this.usernameRef)}
								size='small'
								status={errors.username && 'danger' }
								onSubmitEditing={() => this.passwordRef.current.focus() }
							/>
							{ errors.username && <Text style={styles.labelErr}>{errors.username}</Text> }
							<Input
								ref={this.passwordRef}
								value={data.password}
								labelStyle={styles.label}
								label='Password'
								name='password'
								size='small'
								placeholder='********'
								icon={this.renderIcon}
								status={errors.password && 'danger'}
								secureTextEntry={secureTextEntry}
								onIconPress={this.onIconPress}
								onChangeText={(e) => this.onChangeText(e, this.passwordRef)}
								onSubmitEditing={() => this.nmOlshopRef.current.focus() }
							/>
							{ errors.password && <Text style={styles.labelErr}>{errors.password}</Text> }
							<Input
								ref={this.nmOlshopRef}
								placeholder='Masukan nama online shop'
								label='Nama Online Shop'
								value={data.nmOlshop}
								name='nmOlshop'
								labelStyle={styles.label}
								onChangeText={(e) => this.onChangeText(e, this.nmOlshopRef)}
								status={errors.nmOlshop && 'danger'}
								size='small'
								onSubmitEditing={() => this.namaPanggilanRef.current.focus() }
							/>
							{ errors.nmOlshop && <Text style={styles.labelErr}>{errors.nmOlshop}</Text> }
							<Input
								ref={this.namaPanggilanRef}
								name='namaPanggilan'
								placeholder='Masukan nama panggilan'
								label='Nama Panggilan'
								value={data.namaPanggilan}
								labelStyle={styles.label}
								onChangeText={(e) => this.onChangeText(e, this.namaPanggilanRef)}
								status={errors.namaPanggilan && 'danger'}
								size='small'
								onSubmitEditing={() => this.noHpRef.current.focus() }
							/>
							{ errors.namaPanggilan && <Text style={styles.labelErr}>{errors.namaPanggilan}</Text> }
							<Input
								ref={this.noHpRef}
								placeholder='628/08 XXXX'
								label='Nomor Hp'
								name='noHp'
								value={data.noHp}
								labelStyle={styles.label}
								onChangeText={(e) => this.onChangeText(e, this.noHpRef)}
								keyboardType='numeric'
								status={errors.noHp && 'danger'}
								size='small'
								onSubmitEditing={() => this.npwpRef.current.focus() }
							/>
							{ errors.noHp && <Text style={styles.labelErr}>{errors.noHp}</Text> }
							<Input
								ref={this.npwpRef}
								label='NPWP'
								name='npwp'
								labelStyle={styles.label}
								placeholder='Masukan nomor NPWP'
								value={data.npwp}
								keyboardType='numeric'
								onChangeText={(e) => this.onChangeText(e, this.npwpRef)}
								status={errors.npwp && 'danger'}
								size='small'
								onSubmitEditing={() => this.emailRef.current.focus() }
							/>
							{ errors.npwp && <Text style={styles.labelErr}>{errors.npwp}</Text> }
							<Input
								ref={this.emailRef}
								value={data.email}
								name='email'
								label='Email'
								labelStyle={styles.label}
								placeholder='example@example.com'
								onChangeText={(e) => this.onChangeText(e, this.emailRef)}
								size='small'
								status={errors.email && 'danger'}
								onSubmitEditing={() => this.imeiRef.current.focus() }
							/>
								{ errors.email && <Text style={styles.labelErr}>{errors.email}</Text> }
							<Input
								ref={this.imeiRef}
								value={data.imei}
								label='IMEI phone'
								name='imei'
								placeholder='Masukan imei smartphone anda'
								keyboardType='numeric'
								labelStyle={styles.label}
								onChangeText={(e) => this.onChangeText(e, this.imeiRef)}
								status={errors.imei && 'danger'}
								size='small'
								onSubmitEditing={() => this.kodeposRef.current.focus() }
							/>
							{ errors.imei && <Text style={styles.labelErr}>{errors.imei}</Text> }
							<Input
								ref={this.alamatRef}
								value={data.alamat}
								name='alamat'
								label='Alamat'
								placeholder='Masukan Alamat'
								
								labelStyle={styles.label}
								onChangeText={(e) => this.onChangeText(e, this.alamatRef)}
								status={errors.kodepos && 'danger'}
								size='small'
							/>
							<Input
								ref={this.provRef}
								value={data.provinsi}
								name='provinsi'
								label='Provinsi'
								placeholder='Masukan Provinsi'
								labelStyle={styles.label}
								onChangeText={(e) => this.onChangeText(e, this.provRef)}
								status={errors.kodepos && 'danger'}
								size='small'
							/>
							<Input
								ref={this.kabRef}
								value={data.kab}
								name='kab'
								label='Kab. / Kota'
								placeholder='Masukan Kab. / Kota'
								labelStyle={styles.label}
								onChangeText={(e) => this.onChangeText(e, this.kabRef)}
								status={errors.kodepos && 'danger'}
								size='small'
							/>
							<Input
								ref={this.kecRef}
								value={data.kec}
								name='kec'
								label='Kecamatan'
								placeholder='Masukan Kecamatan'
								
								labelStyle={styles.label}
								onChangeText={(e) => this.onChangeText(e, this.kecRef)}
								status={errors.kodepos && 'danger'}
								size='small'
							/>
							<Input
								ref={this.kelRef}
								value={data.kel}
								name='kel'
								label='Kelurahan / Desa'
								placeholder='Masukan Kelurahan / Desa'
								
								labelStyle={styles.label}
								onChangeText={(e) => this.onChangeText(e, this.kelRef)}
								status={errors.kodepos && 'danger'}
								size='small'
							/>
							<Input
								ref={this.kodeposRef}
								value={data.kodepos}
								name='kodepos'
								label='Kodepos'
								placeholder='Masukan kodepos'
								keyboardType='numeric'
								labelStyle={styles.label}
								onChangeText={(e) => this.onChangeText(e, this.kodeposRef)}
								status={errors.kodepos && 'danger'}
								size='small'
							/>
					    </View>

				        <Button 
				        	style={styles.button} 
				        	status='info'
				        	onPress={this.onSubmit}
				        >Selanjutnya</Button>
						</ScrollView>
			    	</KeyboardAvoidingView>
			    </View>
			</ImageBackground>
		);
	}
}

let styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
	resizeMode: 'cover', // or 'stretch'
  },
  content:{
	flex: 1,
  	padding: 10
  },
  button: {
  	marginTop: 5
  },
  input: {
  	paddingTop: 5
  },
  errors: {
  	color: 'red',
  	marginTop: -3,
  	fontSize: 13
  }
});

export default connect(null, { getRek, registerGiro })(RegistrasiRek);