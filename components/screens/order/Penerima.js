import React from "react";
import { View, Text, ScrollView, KeyboardAvoidingView, Image, StatusBar } from "react-native";
import { Layout, Input, Button, ListItem, Toggle, Icon, TopNavigation, TopNavigationAction } from '@ui-kitten/components';
import { Header } from 'react-navigation-stack';
import styles from "./styles";
import api from "../../api";
import { connect } from "react-redux";
import { getDetailUser } from "../../../actions/auth";

const MyStatusBar = () => (
	<View style={styles.StatusBar}>
		<StatusBar translucent barStyle="light-content" />
	</View>
);


const BackIcon = (style) => (
  <Icon {...style} name='arrow-back' fill='#FFF'/>
);


String.prototype.replaceAll = function(str1, str2, ignore) {
    return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),(ignore?"gi":"g")),(typeof(str2)=="string")?str2.replace(/\$/g,"$$$$"):str2);
}

class Penerima extends React.Component{

	namaRef = React.createRef();
	alamatRef = React.createRef();
	alamat2Ref = React.createRef();
	emailRef = React.createRef();
	phoneRef = React.createRef();

	namaSendRef = React.createRef();
	alamat2SendRef = React.createRef();
	kotaSendref = React.createRef();
	emailSendRef = React.createRef();
	phoneSendRef = React.createRef();

	state = {
		data: {
			nama: '',
			alamat: '',
			alamat2: '',
			kota: '',
			email: '',
			nohp: '',
			kel: '',
			kec: ''
		},
		pengirim: {
			nama: '',
			alamat: '',
			kota: '',
			kodepos: '',
			nohp: '',
			alamatDet: '',
			kel: '',
			kec: '',
			email: ''
		},
		loadingProv: false,
		show: false,
		show2: false,
		listAlamat: [],
		listAlamat2: [],
		errors: {},
		checked: false,
		hasFetchedUser: false
	}

	async componentDidMount(){
		const { userid } = this.props.dataLogin;
		const { userDetail } = this.props;
		//this should make run faster
		if (Object.keys(userDetail).length > 0) {
			const pengirim = {
				nama: userDetail.namaLengkap,
				alamat: userDetail.alamat,
				kota: userDetail.kota,
				kodepos: userDetail.kodepos,
				nohp: userDetail.noHp,
				alamatDet: '',
				kel: userDetail.kel,
				kec: userDetail.kec,
				email: userDetail.email,
				alamatDet: 'oke'
			}
			this.setState({ checked: true, pengirim });
		}

		this.props.getDetailUser(userid)
			.then(() => this.setState({ hasFetchedUser: true })) 
			.catch(err => {
				this.setState({ hasFetchedUser: false });
				alert("Fetching user failed");
			})
	}

	/* 
		if cheked set to true 
		handle if userdetail is empty
	*/
	UNSAFE_componentWillReceiveProps(nextProps){
		if (nextProps.userDetail) {
			const { userDetail } = nextProps;
			//make sure
			if (Object.keys(userDetail).length > 0) {
				const { userDetail } = nextProps;
				const pengirim = {
					nama: userDetail.namaLengkap,
					alamat: userDetail.alamat,
					kota: userDetail.kota,
					kodepos: userDetail.kodepos,
					nohp: userDetail.noHp,
					alamatDet: '',
					kel: userDetail.kel,
					kec: userDetail.kec,
					email: userDetail.email,
					alamatDet: 'oke'
				}
				this.setState({ pengirim, checked: true });
			}
		}
	}

	onChange = (e, { name }) => this.setState({ data: { ...this.state.data, [name]: e }})

	onSubmit = () => {
		const errors = this.validate(this.state.data, this.state.pengirim);
		this.setState({ errors });
		if (Object.keys(errors).length === 0) {
			this.props.navigation.navigate({
				routeName: 'PilihTarif',
				params: {
					...this.props.navigation.state.params,
					deskripsiPenerima: this.state.data,
					pengirimnya: this.state.pengirim
				}
			})
		}else{
			if (errors.nama){
				this.namaRef.current.focus();	
			}else if (errors.alamat){
				this.alamatRef.current.focus();
			}else if (errors.alamat2){
				this.alamat2Ref.current.focus();
			}else{
				this.phoneRef.current.focus();
			}
		}
	}

	renderIcon = (style) => (
	    <Image 
	    	source={require('../../icons/location.png')}
	    />
	)

	onChangeAlamat = (text) => {
		clearTimeout(this.timer);
		this.setState({ data: { ...this.state.data, alamat: text}});
		if (text.length >= 6) {
			this.timer = setTimeout(() => this.getAlamat(2), 500);
		}
	} 

	onChangeAlamatSend = (text) => {
		clearTimeout(this.timer);
		this.setState({ pengirim: { ...this.state.pengirim, alamatDet: text}});
		if (text.length >= 6) {
			this.timer = setTimeout(() => this.getAlamat(1), 500);
		}
	} 

	getAlamat = (jenis) => {
		if (jenis === 1) { //pengirim
			if (!this.state.pengirim.alamatDet) return;
			this.setState({ loadingProv: true });
			api.qob.getAlamat(this.state.pengirim.alamatDet)
				.then(res => {
					const listAlamat2 = [];
					res.forEach(x => {
						const noSpaceText = x.text.replace('  ', '');
						const removeTitik = noSpaceText.replaceAll(".", '');
						const parsing = removeTitik.split('Kec');

						listAlamat2.push({
							title: x.text.replace('   ',''),
							kodepos: x.id,
							kota: x.kota,
							kel: parsing[0].replace(' ', ''),
							kec: `Kec. ${parsing[1].replace(' ', '')}`	
						})
					})
					this.setState({ listAlamat2, show2: true });
				})
				.catch(err => console.log(err))
		}else{
			if (!this.state.data.alamat) return;
			this.setState({ loadingProv: true });
			api.qob.getAlamat(this.state.data.alamat)
				.then(res => {
					const listAlamat = [];
					res.forEach(x => {
						const noSpaceText = x.text.replace('  ', '');
						const removeTitik = noSpaceText.replaceAll(".", '');
						const parsing = removeTitik.split('Kec');

						listAlamat.push({
							title: x.text.replace('   ',''),
							kodepos: x.id,
							kota: x.kota,
							kel: parsing[0].replace(' ', ''),
							kec: `Kec. ${parsing[1].replace(' ', '')}`	
						})
					})
					this.setState({ listAlamat, show: true });
				})
				.catch(err => console.log(err))
		}
	}

	onClickAlamat = (title, kodepos, kota, kel, kec, jenis) => {
		if (jenis === '1') {
			this.setState({ 
				pengirim: { 
					...this.state.pengirim, 
					alamatDet: title, 
					kodepos: kodepos, 
					kota: kota,
					kel: kel,
					kec: kec
				}, 
				show2: false
			});
			this.emailSendRef.current.focus()	
		}else{
			this.setState({ 
				data: { 
					...this.state.data, 
					alamat: title, 
					kodepos: kodepos, 
					kota: kota,
					kel: kel,
					kec: kec
				}, 
				show: false
			});
			this.emailRef.current.focus()	
		}
	}

	validate = (data, pengirim) => {
		const errors = {};
		if (!data.nama) errors.nama = "Harap diisi";
		if (!data.alamat) errors.alamat = "Harap diisi";
		if (!data.alamat2) errors.alamat2 = "Harap diisi";
		// if (!data.email) errors.email = "Harap diisi";
		if (!data.nohp) errors.nohp = "Harap diisi";
		if (!pengirim.nama) errors.namaSend = "Harap diisi";
		if (!pengirim.alamat) errors.alamatSend = "Harap diisi";
		if (!pengirim.alamatDet) errors.alamatDet = "Harap diisi";
		// if (!pengirim.email) errors.emailSend = "Harap diisi";
		if (!pengirim.nohp) errors.noHpSend = "Harap diisi";
		return errors;
	}

	onCheckedChange = (e) => {
		const { checked, hasFetchedUser } = this.state;
		if (!checked) {
			if (hasFetchedUser) {
				const { userDetail } = this.props;
				const pengirim = {
					nama: userDetail.namaLengkap,
					alamat: userDetail.alamat,
					kota: userDetail.kota,
					kodepos: userDetail.kodepos,
					nohp: userDetail.noHp,
					alamatDet: '',
					kel: userDetail.kel,
					kec: userDetail.kec,
					email: userDetail.email,
					alamatDet: 'oke'
				}
				this.setState({ pengirim, checked: true });
			}else{
				this.setState({ checked: false});
				alert("Terdapat kesalahan saat memuat data anda, tutup aplikasi untuk mencoba lagi atau lakukan entri manual data pengirim");
			}
		}else{
			this.setState({
				pengirim: {
					nama: '',
					alamat: '',
					kota: '',
					kodepos: '',
					nohp: '',
					alamatDet: '',
					kel: '',
					kec: '',
					email: ''
				},
				checked: false
			})
		}	
	} 

	onChangePengirim = (e, { name }) => this.setState({ pengirim: { ...this.state.pengirim, [name]: e }})

	BackAction = () => (
  		<TopNavigationAction icon={BackIcon} onPress={() => this.props.navigation.goBack()}/>
	)

	render(){
		const { data, listAlamat, show, errors, checked, pengirim, listAlamat2, show2 } = this.state;
		
		return(
			<View style={{flex: 1}}>
				<MyStatusBar />
				<TopNavigation
				    leftControl={this.BackAction()}
				    subtitle='Pengirim & Penerima'
				    title='Order'
				    alignment='start'
				    titleStyle={{fontFamily: 'open-sans-bold', color: '#FFF'}}
				    style={{backgroundColor: 'rgb(240, 132, 0)'}}
				    subtitleStyle={{color: '#FFF'}}
				/>
				<KeyboardAvoidingView 
					style={{flex:1}} 
					behavior="padding" 
					enabled
				>
					<ScrollView keyboardShouldPersistTaps='always'>
						<Layout style={styles.container}>
							<View style={{padding: 10 }}>
								<View style={{ flexDirection: 'row', paddingBottom: 15}}>
									<View style={{alignItems: 'flex-start', flex: 1}}>
										<Text>Gunakan data saya sebagai data pengirim</Text>
									</View>
									<View style={{alignItems: 'flex-end', flex: 1}}>
										<Toggle
									      checked={this.state.checked}
									      onChange={this.onCheckedChange}
									    />
								    </View>
							    </View>
							    { !checked && <React.Fragment>
							    	<Input
										placeholder='Nama pengirim'
										label='* Nama'
										ref={this.namaSendRef}
										name='nama'
										labelStyle={styles.label}
										value={pengirim.nama}
										style={{paddingTop: 7}}
										onChangeText={(e) => this.onChangePengirim(e, this.namaSendRef.current.props)}
										onSubmitEditing={() => this.alamat2SendRef.current.focus() }
										status={errors.namaSend && 'danger'}
								    />
								    <Input 
								    	placeholder='jalan, gang, rt/rw'
								    	ref={this.alamat2SendRef}
								    	name='alamat'
								    	label='* Alamat'
								    	style={{ paddingTop: 7 }}
								    	labelStyle={styles.label}
								    	value={pengirim.alamat}
								    	icon={this.renderIcon}
								    	onChangeText={(e) => this.onChangePengirim(e, this.alamat2SendRef.current.props)}
								    	onSubmitEditing={() => this.kotaSendref.current.focus() }
								    	status={errors.alamatSend && 'danger'}
								    />
								    <Input 
								    	ref={this.kotaSendref}
								    	label='* Kota/kab/kec/kel'
								    	labelStyle={styles.label}
								    	style={{paddingTop: 7}}
								    	value={pengirim.alamatDet}
								    	onChangeText={this.onChangeAlamatSend}
								    	icon={this.renderIcon}
								    	status={errors.alamatDet && 'danger'}
								    	placeholder='Cari...'
								    />
								    { listAlamat2.length > 0 && show2 && <ScrollView style={{height: 100}} nestedScrollEnabled={true}>
									    <View style={styles.triangle}>
										   	{ listAlamat2.map((x, i) => 
										   		<ListItem
										   			key={i}
											    	style={styles.listItem}
											    	titleStyle={styles.listItemTitle}
											    	descriptionStyle={styles.listItemDescription}
											    	title={x.title}
											    	onPress={() => this.onClickAlamat(x.title, x.kodepos, x.kota, x.kel, x.kec, '1')}
												/> )}
									    </View>
								    </ScrollView> }
								    <Input 
								    	placeholder='Masukan email'
								    	ref={this.emailSendRef}
								    	name='email'
										label='Email'
										keyboardType='email-address'
								    	style={{ paddingTop: 7 }}
								    	labelStyle={styles.label}
								    	value={pengirim.email}
								    	onChangeText={(e) => this.onChangePengirim(e, this.emailSendRef.current.props)}
								    	onSubmitEditing={() => this.phoneSendRef.current.focus() }
								    />
								    <Input 
								    	placeholder='Masukan nomor handphone'
								    	ref={this.phoneSendRef}
								    	name='nohp'
										label='* No Handphone'
										keyboardType='numeric'
								    	style={{ paddingTop: 7 }}
								    	labelStyle={styles.label}
								    	value={pengirim.nohp}
								    	onChangeText={(e) => this.onChangePengirim(e, this.phoneSendRef.current.props)}
								    	onSubmitEditing={() => this.namaRef.current.focus() }
								    	status={errors.noHpSend && 'danger'}
								    />
							    </React.Fragment> }

								<View style={{flexDirection: 'row'}}>
								    <View style={{backgroundColor: '#cfcfcf', height: 1, flex: 1, alignSelf: 'center'}} />
								    <Text style={{ 
								    	alignSelf:'center', 
								    	paddingHorizontal:5, 
								    	fontSize: 15, 
								    	color: '#484a4a',
								    	fontFamily: 'Roboto-Regular'
								    }}>Penerima</Text>
								    <View style={{backgroundColor: '#cfcfcf', height: 1, flex: 1, alignSelf: 'center'}} />
								</View>
								<Input
									placeholder='Nama penerima'
									label='* Nama'
									ref={this.namaRef}
									name='nama'
									labelStyle={styles.label}
									value={data.nama}
									style={{paddingTop: 7}}
									onChangeText={(e) => this.onChange(e, this.namaRef.current.props)}
									onSubmitEditing={() => this.alamat2Ref.current.focus() }
									status={errors.nama && 'danger'}
							    />
							    <Input 
							    	placeholder='jalan, gang, rt/rw'
							    	ref={this.alamat2Ref}
							    	name='alamat2'
							    	label='* Alamat'
							    	style={{ paddingTop: 7 }}
							    	labelStyle={styles.label}
							    	value={data.alamat2}
							    	icon={this.renderIcon}
							    	onChangeText={(e) => this.onChange(e, this.alamat2Ref.current.props)}
							    	onSubmitEditing={() => this.alamatRef.current.focus() }
							    	status={errors.alamat2 && 'danger'}
							    />
							    <Input 
							    	ref={this.alamatRef}
							    	label='* Kota/kab/kec/kel'
							    	labelStyle={styles.label}
							    	style={{paddingTop: 7}}
							    	value={data.alamat}
							    	onChangeText={this.onChangeAlamat}
							    	icon={this.renderIcon}
							    	status={errors.alamat && 'danger'}
							    	placeholder='Cari...'
							    />
							    { listAlamat.length > 0 && show && <ScrollView style={{height: 100}} nestedScrollEnabled={true}>
								    <View style={styles.triangle}>
									   	{ listAlamat.map((x, i) => 
									   		<ListItem
									   			key={i}
										    	style={styles.listItem}
										    	titleStyle={styles.listItemTitle}
										    	descriptionStyle={styles.listItemDescription}
										    	title={x.title}
										    	onPress={() => this.onClickAlamat(x.title, x.kodepos, x.kota, x.kel, x.kec, '2')}
											/> )}
								    </View>
							    </ScrollView> }
							    <Input 
							    	placeholder='Masukan email'
							    	ref={this.emailRef}
							    	name='email'
									label='Email'
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
									label='* No Handphone'
									keyboardType='numeric'
							    	style={{ paddingTop: 7 }}
							    	labelStyle={styles.label}
							    	value={data.nohp}
							    	onChangeText={(e) => this.onChange(e, this.phoneRef.current.props)}
							    	onSubmitEditing={this.onSubmit}
							    	status={errors.nohp && 'danger'}
							    />
							</View>
						</Layout>
						<Button style={{margin: 10, marginTop: -5 }} status='warning' onPress={this.onSubmit}>Selanjutnya</Button>
					</ScrollView>
				</KeyboardAvoidingView>
			</View>
		);
	}
}

function mapStateToProps(state) {
	return{
		userDetail: state.auth.user,
		dataLogin: state.auth.dataLogin
	}
}

export default connect(mapStateToProps, { getDetailUser })(Penerima);