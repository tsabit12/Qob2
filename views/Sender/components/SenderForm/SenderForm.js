import React from "react";
import { View, StyleSheet, TouchableOpacity, Image, Dimensions, ScrollView } from "react-native";
import { Input, Button } from "@ui-kitten/components";
import PropTypes from "prop-types";
import axios from "axios";
import { List, ListItem, Text } from 'native-base';

const device = Dimensions.get('window').width;

const styles = StyleSheet.create({
	root: {
		margin: 5,
		padding: 7,
		borderWidth: 0.2,
		borderColor: '#bdbdbd',
		borderRadius: 3,
		backgroundColor: 'white',
		elevation: 5
	},
	input: {
		marginTop: 5
	},
	inputSearch: {
		marginTop: 5
	},
	label: {
	  	color: 'black',
	  	fontSize: 14,
	  	fontFamily: 'Roboto'
	},
	listText: {
		fontSize: 14,
		fontFamily: 'Roboto'
	},
	list: {
		borderLeftWidth: 0.2, 
		borderRightWidth: 0.2, 
		borderColor: '#c2bfba',
		elevation: 2,
		backgroundColor: 'white',
		height: device*0.5,
	},
	button: {
		marginTop: 4
	}
})

const RenderListCity = props => {
	return(
		<List style={styles.list}>
			<ScrollView nestedScrollEnabled={true}>
				{ props.data.map((row, index) => 
					<ListItem 
						key={index} 
						noIndent
						onPress={() => props.onPressItem(index)}
					>
						<Text style={styles.listText}>{row.kecamatan}, {row.kabupaten}, {row.provinsi}</Text>
					</ListItem> )}
			</ScrollView>
	    </List>
	);
}


const SenderForm = props => {
	const namaRef 			= React.useRef();
	const alamatUtamaRef 	= React.useRef();
	const queryRef 			= React.useRef();
	const phoneRef 			= React.useRef();
	const emailRef 			= React.useRef();

	const [state, setState] = React.useState({
		value: null,
		data: {
			kodepos: '',
			alamatUtama: '',
			nama: '',
			phone: '',
			email: '',
			kecamatan: '',
			kabupaten: '',
			provinsi: '',
			kelurahan: ''
		},
		cities: [],
		loading: false,
		query: '',
		errors: {},
		choosed: false
	});

	const { data, cities, query, errors } = state;

	React.useEffect(() => {
		if (query.length > 2 && !state.choosed) {
			let timer = setTimeout(() => {
				setState(prevState => ({
					...prevState,
					loading: true,
					errors: {
						global: undefined
					}
				}));

				props.onSearch(query)
					.then(res => {
						setState(prevState => ({
							...prevState,
							loading: false,
							cities: res.result
						}));
						queryRef.current.blur();
					})
					.catch(err => {
						console.log(err);
						if (!err.response.data.errors) {
							setState(prevState => ({
								...prevState,
								loading: false,
								cities: [],
								errors: {
									global: 'Network error'
								}
							}))
						}else{
							setState(prevState => ({
								...prevState,
								loading: false,
								cities: [],
								errors: err.response.data.errors
							}))
						}
					})
			}, 600);

			return () => {
				clearTimeout(timer)
			}
		}
	}, [query, state.choosed])

	React.useEffect(() => {
		if (props.checked) {
			const { detail } = props.user;
			setState(prevState => ({
				...prevState,
				data: {
					...prevState.data,
					kodepos: `${detail.kodepos}`,
					email: `${detail.email}`,
					nama: `${detail.nama}`,
					phone: `${detail.nohp}`,
					alamatUtama: `${detail.alamatOl}`,
					kecamatan: detail.kecamatan,
					kelurahan: detail.kelurahan,
					kabupaten: detail.kota,
					provinsi: detail.provinsi
				},
				choosed: true,
				query: `${detail.kecamatan}, ${detail.kota}, ${detail.provinsi}`,
				errors: {}
			}))
		}else{
			setState(prevState => ({
				...prevState,
				query: '',
				data: {
					...prevState.data,
					kodepos: '',
					alamatUtama: '',
					phone: '',
					email: '',
					nama: '',
					kecamatan: '',
					kelurahan: '-',
					provinsi: '',
					kabupaten: ''
				}
			}))
		}
	}, [props.checked]);


	const handleChangeSearch = (text) => {
		setState(prevState => ({
			...prevState,
			query: text,
			choosed: false
		}))
	}

	const renderIcon = (props) => (
		<Image
		      style={{width: 20, height: 20}} 
		      source={state.loading ? require('../../../../components/icons/loaderInput.gif') : require('../../../../components/icons/location.png')}
		/>
	);

	const onChange = (e, { name }) => setState(prevState => ({
		...prevState,
		data: {
			...prevState.data,
			[name]: e
		}
	}))

	const onChooseCity = (index) => {
		const citiesChoosed = cities[index];
		setState(prevState => ({
			...prevState,
			data: {
				...prevState.data,
				kodepos: citiesChoosed.kodepos,
				kecamatan: citiesChoosed.kecamatan,
				kabupaten: citiesChoosed.kabupaten,
				provinsi: citiesChoosed.provinsi,
				kelurahan: '-'
			},
			choosed: true,
			query: `${citiesChoosed.kecamatan}, ${citiesChoosed.kabupaten}, ${citiesChoosed.provinsi}`
		}))
	}

	const handlePress = () => {
		const errors = validate(state.data);
		setState(prevState => ({
			...prevState,
			errors: {
				...prevState.errors,
				...errors
			}
		}))

		if (Object.keys(errors).length === 0) {
			props.onSubmit(state.data);
		}
	}

	const validate = (data) => {
		const errors = {};
		if (!data.kodepos) errors.kodepos = "Kodepos tidak boleh kosong";
		if (!data.phone) errors.phone = "Nomor handphone harap diisi";
		if (!data.nama) errors.nama = "Nama harap diisi";
		if (!data.alamatUtama) errors.alamatUtama = "Alamat utama tidak boleh kosong";
		if (!state.query) errors.global = "Kecamatan/kota boleh kosong";
		if (data.email) {
			//regex email
			var re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
			if (!re.test(data.email)) errors.email = "Email tidak valid";
		}
		return errors;
	}

	return(
		<View style={styles.root}>
			<Input 
				ref={namaRef}
			    placeholder='Masukkan nama pengirim'
				name='nama'
				label='* Nama'
				value={data.nama}
				style={styles.input}
				labelStyle={styles.label}
				onChangeText={(e) => onChange(e, namaRef.current.props)}
				onSubmitEditing={() => alamatUtamaRef.current.focus() }
				disabled={props.checked}
				status={errors.nama ? 'danger' : ''}
				caption={errors.nama && `${errors.nama}`}
				autoCapitalize='words'
				returnKeyType='next'
			/>

			<Input 
				ref={alamatUtamaRef}
			    placeholder='Jalan/kp, Desa'
				name='alamatUtama'
				label='* Alamat utama'
				value={data.alamatUtama}
				style={styles.input}
				labelStyle={styles.label}
				onChangeText={(e) => onChange(e, alamatUtamaRef.current.props)}
				onSubmitEditing={() => queryRef.current.focus() }
				disabled={props.checked}
				status={errors.alamatUtama ? 'danger' : ''}
				caption={errors.alamatUtama && `${errors.alamatUtama}`}
				returnKeyType='next'
			/>
			<Input 
				ref={queryRef}
				nama='query'
				placeholder='Masukkan kecamatan/kota'
				label='* Kecamatan/Kota'
				labelStyle={styles.label}
				style={styles.inputSearch}
				icon={renderIcon}
				value={query}
				disabled={props.checked}
				onChangeText={handleChangeSearch}
				status={errors.global ? 'danger' : ''}
				caption={errors.global && `${errors.global}`}
			/>
			{ cities.length > 0 && !state.choosed &&
				<RenderListCity 
					data={cities}
					onPressItem={onChooseCity}
				/> }
			<Input 
				nama='kodepos'
				value={data.kodepos}
				label='* Kodepos'
				disabled
				style={styles.input}
				labelStyle={styles.label}
				placeholder='Cari kecamatan/kota dahulu'
			/>
			<Input 
				ref={phoneRef}
				value={data.phone}
				name='phone'
				keyboardType='phone-pad'
				label='* Nomor handphone pengirim'
				labelStyle={styles.label}
				style={styles.input}
				disabled={props.checked}
				placeholder='Masukkan nomor handphone'
				onChangeText={(e) => onChange(e, phoneRef.current.props)}
				onSubmitEditing={() => emailRef.current.focus() }
				returnKeyType='next'
				status={errors.phone ? 'danger' : ''}
				caption={errors.phone && `${errors.phone}`}
			/>
			<Input 
				ref={emailRef}
				value={data.email}
				name='email'
				style={styles.input}
				labelStyle={styles.label}
				placeholder='Masukkan email'
				disabled={props.checked}
				label='Email pengirim'
				onChangeText={(e) => onChange(e, emailRef.current.props)}
				keyboardType='email-address'
				autoCapitalize='none'
				status={errors.email ? 'danger' : ''}
				caption={errors.email && `${errors.email}`}
			/>
			<Button 
				status='warning' 
				style={styles.button}
				onPress={handlePress}
			>Selanjutnya</Button>
		</View>
	);
}

SenderForm.propTypes = {
	onSearch: PropTypes.func.isRequired,
	user: PropTypes.object.isRequired,
	checked: PropTypes.bool.isRequired,
	onSubmit: PropTypes.func.isRequired
}

export default SenderForm;