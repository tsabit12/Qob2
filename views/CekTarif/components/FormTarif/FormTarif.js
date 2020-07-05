import React from "react";
import { View, StyleSheet, Image, ScrollView, Dimensions } from "react-native";
import {
	Input,
	Select,
	Button
} from "@ui-kitten/components";
import PropTypes from "prop-types";
import { List, ListItem, Text } from 'native-base';

const device = Dimensions.get('window').width;

const numberWithCommas = (number) => {
	return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

const styles = StyleSheet.create({
	root: {
		margin: 7,
		borderWidth: 0.2,
		padding: 7,
		borderRadius: 3,
		borderColor: '#b0afae',
		backgroundColor: 'white',
		elevation: 5
	},
	input: {
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
	rowInput: {
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	inputRow: {
		flex: 1,
		marginTop: 10,
		marginRight: 3
	},
	viewButton: {
		flexDirection: 'row',
		marginLeft: 7,
		marginRight: 3,
		justifyContent: 'space-between'
	},
	button: {
		flex: 1,
		marginRight: 5
	}
})

const jenisOptions = [
  { text: 'Paket', value: 1},
  { text: 'Surat', value: 0}
];

const RenderListCity = props => {
	return(
		<List style={styles.list}>
			<ScrollView nestedScrollEnabled={true}>
				{ props.data.map((row, index) => 
					<ListItem 
						key={index} 
						noIndent
						onPress={() => props.onPressItem(index, props.name)}
					>
						<Text style={styles.listText}>{row.kecamatan}, {row.kabupaten}, {row.provinsi}</Text>
					</ListItem> )}
			</ScrollView>
	    </List>
	);
}

const FormTarif = props => {
	const senderAddresRef 	= React.useRef();
	const receiverAddresRef = React.useRef();
	const tinggiRef 		= React.useRef();
	const lebarRef 			= React.useRef();
	const panjangRef 		= React.useRef();
	const beratRef			= React.useRef();
	const nilaiRef 			= React.useRef();

	const [state, setState] = React.useState({
		loading: {
			senderAddres: false,
			receiverAddres: false
		},
		data: {
			senderAddres: '',
			receiverAddres: '',
			jenisKiriman: jenisOptions[0],
			panjang: '',
			lebar: '',
			tinggi: '',
			nilai: '0'
		},
		listAddres: {
			senderAddres: [],
			receiverAddres: []
		},
		choosed: {
			senderAddres: false,
			receiverAddres: false
		},
		errors: {}
	});

	const { data, loading, listAddres, choosed, errors } = state;

	React.useEffect(() => {
		if (data.senderAddres.length > 2 && !choosed.senderAddres) {
			let timer = setTimeout(() => {
				setState(prevState => ({
					...prevState,
					loading: {
						...prevState.loading,
						senderAddres: true
					},
					errors: {
						senderAddres: undefined
					}
				}));

				callApi(data.senderAddres, '1', 'senderAddres')

			}, 600);

			return () => {
				clearTimeout(timer)
			}
		}
	}, [data.senderAddres]);

	React.useEffect(() => {
		if (data.receiverAddres.length > 2 && !choosed.receiverAddres) {
			let timer = setTimeout(() => {
				setState(prevState => ({
					...prevState,
					loading: {
						...prevState.loading,
						receiverAddres: true
					},
					errors: {
						receiverAddres: undefined
					}
				}));

				callApi(data.receiverAddres, '2', 'receiverAddres')

			}, 600);

			return () => {
				clearTimeout(timer)
			}
		}
	}, [data.receiverAddres])

	const callApi = (addres, ref, name) => {
		props.getAddres(addres)
			.then(res => {
				setState(prevState => ({
					...prevState,
					loading: {
						...prevState.loading,
						[name]: false
					},
					listAddres: {
						...prevState.listAddres,
						[name]: res.result	
					} 
				}));

				const getRef = ref === '1' ? senderAddresRef : receiverAddresRef;
				getRef.current.blur();
			})
			.catch(err => {
				if (!err.response.data.errors) {
					setState(prevState => ({
						...prevState,
						loading: {
							...prevState.loading,
							[name]: false
						},
						listAddres: {
							...prevState.listAddres,
							[name]: []
						},
						errors: {
							[name]: 'Network error'
						}
					}))
				}else{
					setState(prevState => ({
						...prevState,
						loading: {
							...prevState.loading,
							[name]: false
						},
						listAddres: {
							...prevState.listAddres,
							[name]: []
						},
						errors: {
							[name]: 'Data tidak ditemukan'
						}
					}))
				}
			})
	} 

	const renderIconSenderAddres = (props) => (
		<Image
		      style={{width: 20, height: 20}} 
		      source={loading.senderAddres ? require('../../../../components/icons/loaderInput.gif') : require('../../../../components/icons/location.png')}
		/>
	);

	const renderIconReceiverAddres = (props) => (
		<Image
		      style={{width: 20, height: 20}} 
		      source={loading.receiverAddres ? require('../../../../components/icons/loaderInput.gif') : require('../../../../components/icons/location.png')}
		/>
	);

	const onChangeAddres = (text, { name }) => {
		setState(prevState => ({
			...prevState,
			data: {
				...prevState.data,
				[name]: text
			},
			choosed: {
				...prevState.choosed,
				[name]: false
			}
		}))
	}

	const handlePressItem = (index, name) => {
		const addresChoosed = listAddres[name][index];

		setState(prevState => ({
			...prevState,
			data: {
				...prevState.data,
				[name]: `${addresChoosed.kecamatan}, ${addresChoosed.kabupaten}, ${addresChoosed.provinsi}, ${addresChoosed.kodepos}`
			},
			choosed: {
				...prevState.choosed,
				[name]: true
			}
		}))
	}

	const handleSelect = (e) => setState(prevState => ({
		...prevState,
		data: {
			...prevState.data,
			jenisKiriman: e
		}
	}))

	const onChangNumber = (text, { name }) => {
		var val = text.replace(/\D/g, '');
		var x 	= Number(val);
		const value = numberWithCommas(x);
		setState(prevState => ({
			...prevState,
			data: {
				...prevState.data,
				[name]: value
			}
		}))
	}

	const handleSubmit = () => {
		const errors = validate(state.data);
		setState(prevState => ({
			...prevState,
			errors
		}));
		if (Object.keys(errors).length === 0) {
			const { senderAddres, receiverAddres } = data;

			const payload = {
				jenisKiriman: data.jenisKiriman.value,
				lebar: data.lebar ? parseInt(data.lebar.replace(/\D/g, '')) : 0,
				panjang: data.panjang ? parseInt(data.panjang.replace(/\D/g, '')) : 0,
				tinggi: data.tinggi ? parseInt(data.tinggi.replace(/\D/g, '')) : 0,
				nilai: data.nilai ? parseInt(data.nilai.replace(/\D/g, '')) : 0,
				berat: data.berat ? parseInt(data.berat.replace(/\D/g, '')) : 0,
				senderPostalCode: senderAddres.split(',')[3].trim(),
				senderKec: senderAddres.split(',')[0].trim(),
				senderKab: senderAddres.split(',')[1].trim(),
				senderProv: senderAddres.split(',')[2].trim(),
				receiverPostalCode: receiverAddres.split(',')[3].trim(),
				receiverKec: receiverAddres.split(',')[0].trim(),
				receiverKab: receiverAddres.split(',')[1].trim(),
				receiverProv: receiverAddres.split(',')[2].trim()
			}
			props.onSubmit(payload);
		}
	}

	const validate = (payload) => {
		const errors = {};
		if (!payload.senderAddres){
			errors.senderAddres = "Kecamatan/kota pengirim harap diisi";	
		}else{
			const lengthComma = payload.senderAddres.split(",").length;
			if (lengthComma !== 4) errors.senderAddres = "Detail alamat tidak valid";
		}

		if (!payload.receiverAddres) {
			errors.receiverAddres = "Kecamatan/kota penerima harap diisi";
		}else{
			const lengthComma = payload.receiverAddres.split(",").length;
			if (lengthComma !== 4) errors.receiverAddres = "Detail alamat tidak valid";
		}

		if (!payload.berat){
			errors.berat = "Berat harap diisi";
		}else{
			if (parseInt(payload.berat.replace(/\D/g, '')) <= 0) errors.berat = "Harus lebih dari 0";
		}
		return errors;
	}

	const handleReset = () => {
		setState(prevState => ({
			...prevState,
			data: {
				senderAddres: '',
				receiverAddres: '',
				jenisKiriman: jenisOptions[0],
				panjang: '',
				lebar: '',
				tinggi: '',
				nilai: '0'
			},
		}))

		setTimeout(() => {
			props.removeList();
		}, 10);
	}

	return(
		<React.Fragment>
			<View style={styles.root}>
				<Input 
					ref={senderAddresRef}
					style={styles.input}
					name='senderAddres'
					label='Kecamatan/Kota pengirim'
					labelStyle={styles.label}
					placeholder='Cari Kecamatan/Kota pengirim'
					icon={renderIconSenderAddres}
					value={data.senderAddres}
					onChangeText={(text) => onChangeAddres(text, senderAddresRef.current.props)}
					status={errors.senderAddres ? 'danger' : ''}
					caption={errors.senderAddres && `${errors.senderAddres}`}
				/>
				{ listAddres.senderAddres.length > 0 && !choosed.senderAddres && 
					<RenderListCity 
						data={listAddres.senderAddres}
						name='senderAddres'
						onPressItem={handlePressItem}
					/> }
				<Input 
					ref={receiverAddresRef}
					value={data.receiverAddres}
					style={styles.input}
					name='receiverAddres'
					icon={renderIconReceiverAddres}
					labelStyle={styles.label}
					label='Kecamatan/Kota penerima'
					placeholder='Cari Kecamatan/Kota penerima'
					status={errors.receiverAddres ? 'danger' : ''}
					caption={errors.receiverAddres && `${errors.receiverAddres}`}
					onChangeText={(text) => onChangeAddres(text, receiverAddresRef.current.props)}
				/>
				{ listAddres.receiverAddres.length > 0 && !choosed.receiverAddres && 
					<RenderListCity 
						data={listAddres.receiverAddres}
						name='receiverAddres'
						onPressItem={handlePressItem}
					/> }

				<Select
					label='Jenis Kiriman'
					style={styles.input}
			        data={jenisOptions}
			        labelStyle={styles.label}
			        selectedOption={data.jenisKiriman}
			        onSelect={(e) => handleSelect(e)}
			    />
			    { data.jenisKiriman === jenisOptions[0] && <View style={styles.rowInput}>
			    	<Input 
			    		ref={panjangRef}
			    		name='panjang'
			    		style={styles.inputRow}
			    		labelStyle={styles.label}
			    		label='Panjang'
			    		placeholder='XX (CM)'
			    		keyboardType='numeric'
			    		value={data.panjang}
			    		returnKeyType='next'
			    		onChangeText={(text) => onChangNumber(text, panjangRef.current.props)}
			    		onSubmitEditing={() => lebarRef.current.focus() }
			    	/>
			    	<Input 
			    		ref={lebarRef}
			    		name='lebar'
			    		style={styles.inputRow}
			    		labelStyle={styles.label}
			    		value={data.lebar}
			    		label='Lebar'
			    		placeholder='XX (CM)'
			    		keyboardType='numeric'
			    		returnKeyType='next'
			    		onChangeText={(text) => onChangNumber(text, lebarRef.current.props)}
			    		onSubmitEditing={() => tinggiRef.current.focus() }
			    	/>
			    	<Input 
			    		ref={tinggiRef}
			    		name='tinggi'
			    		style={styles.inputRow}
			    		labelStyle={styles.label}
			    		label='Tinggi'
			    		keyboardType='numeric'
			    		placeholder='XX (CM)'
			    		value={data.tinggi}
			    		returnKeyType='next'
			    		onChangeText={(text) => onChangNumber(text, tinggiRef.current.props)}
			    		onSubmitEditing={() => beratRef.current.focus() }
			    	/>
			    </View> }

			    <Input 
			    	ref={beratRef}
			    	name='berat'
			    	value={data.berat}
			    	label='Berat (gram)'
			    	placeholder='Masukkan berat'
			    	style={styles.input}
			    	labelStyle={styles.label}
			    	onChangeText={(text) => onChangNumber(text, beratRef.current.props)}
			    	keyboardType='numeric'
			    	returnKeyType='next'
			    	onSubmitEditing={() => nilaiRef.current.focus() }
			    	status={errors.berat ? 'danger' : ''}
					caption={errors.berat && `${errors.berat}`}
			    />
			     <Input 
			    	ref={nilaiRef}
			    	name='nilai'
			    	value={data.nilai}
			    	label='Nilai barang'
			    	placeholder='Masukkan nilai barang'
			    	style={styles.input}
			    	labelStyle={styles.label}
			    	onChangeText={(text) => onChangNumber(text, nilaiRef.current.props)}
			    	keyboardType='numeric'
			    />
			</View>
			<View style={styles.viewButton}>
				<Button style={styles.button} onPress={handleSubmit}>Cek Tarif</Button>
				{ props.listLength > 0 && 
					<Button 
						status='danger' 
						style={styles.button}
						onPress={handleReset}
					>Reset
					</Button> }
			</View>
		</React.Fragment>
	);
}

FormTarif.propTypes = {
	getAddres: PropTypes.func.isRequired,
	onSubmit: PropTypes.func.isRequired,
	listLength: PropTypes.number.isRequired,
	removeList: PropTypes.func.isRequired
}

export default FormTarif;