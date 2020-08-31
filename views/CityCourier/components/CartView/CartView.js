import React from 'react';
import { 
	View, 
	StyleSheet, 
	ActivityIndicator, 
	Animated, 
	ScrollView, 
	Dimensions, 
	TouchableOpacity, 
	Modal,
	TouchableWithoutFeedback,
	Alert
} from 'react-native';
import Constants from 'expo-constants';
import { 
	Content, 
	Text, 
	ListItem, 
	List, 
	Right, 
	Icon, 
	Left, 
	Body, 
	Button, 
	Item, 
	Label, 
	Input,
	Footer,
	FooterTab
} from 'native-base';
import PropTypes from 'prop-types';
import { Ionicons } from '@expo/vector-icons'; 
import { ApiYuyus } from '../../../../api';
import {
	PageOrder,
	BatalOrder,
	SelesaiOrder
} from './components';

const { width, height } = Dimensions.get('window');

// ref status
// 0 order:
// 1 bidding:
// 2 bayar: 
// 3 terima:
// 9 batal (order & bidding):

const numberWithCommas = (number) => {
	return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

const CencelForm = props => {
	const opacity = new Animated.Value(0);
	const inputRef = React.useRef();
	const [text, setText] = React.useState('');

	React.useEffect(() => {
		Animated.timing(opacity, {
	        toValue: 1,
	        duration: 200,
	        useNativeDriver: true
	    }).start();
	}, []);

	const onSubmit = () => {
		if (text.length > 0) {
			props.onCencel(text);
		}else{
			alert('Masukkan keterangan terlebih dahulu');
		}
	}

	return(
		<Animated.View style={{opacity: opacity}}>
			<Item inlineLabel last>
				<Label>Keterangan :</Label>
				<Input 
					ref={inputRef}
					value={text}
					onChangeText={(text) => setText(text)}
				/>
				<TouchableOpacity
					onPress={onSubmit}
				>
					<Icon active name='send' style={{color: 'blue'}} />
				</TouchableOpacity>
			</Item>
		</Animated.View>
	);
}

CencelForm.propTypes = {
	onCencel: PropTypes.func.isRequired
}

const LoadingApp = () => (
	<View style={styles.loading}>
		<ActivityIndicator size="large" />
	</View>
);

const CartView = props => {
	const [state, setState] = React.useState({
		loading: true,
		presedItem: {},
		bounceValue: new Animated.Value(300),
		data: [],
		data2: [],
		data3: [],
		visible: false,
		sendLoading: false,
		errors: {},
		confirmCancel: false,
		loadingCancel: false,
		activePage: 1
	})

	const { loading, presedItem, errors, activePage } = state;

	React.useEffect(() => {
		//ApiYuyus.cityCourier.getOrder(props.userid)
		ApiYuyus.cityCourier.getOrder('440000214')
			.then(res => {
				const { rc_mess, response_data2 } = res;
				
				if (response_data2.length > 0) {
					const responseData = [];
					const responseData2 = [];
					const responseData3 = [];

					const sorted = response_data2.sort(dynamicSort("wkt_order"));

					const data = sorted.filter(list => list.stat === '1' || list.stat === '0');
					const data2 = sorted.filter(list => list.stat === '9');
					const data3 = sorted.filter(list => list.stat === '3' || list.stat === '2');

					data.forEach(row => {
						const convertJson = JSON.parse(row.jsonnya);
						responseData.push({
							nomorOrder: row.no_order, 
							status : row.stat,  
							wkt_order: row.wkt_order,
							...convertJson 
						});
					})

					data2.forEach(row => {
						const convertJson = JSON.parse(row.jsonnya);
						responseData2.push({
							nomorOrder: row.no_order, 
							status : row.stat, 
							wkt_order: row.wkt_order, 
							...convertJson 
						});
					})

					data3.forEach(row => {
						const convertJson = JSON.parse(row.jsonnya);
						responseData3.push({
							nomorOrder: row.no_order, 
							status : row.stat, 
							wkt_order: row.wkt_order,
							...convertJson 
						});
					})

					setState(state => ({
						...state,
						data: responseData,
						data2: responseData2,
						data3: responseData3,
						loading: false
					}))

				}else{
					setState(state => ({
						...state,
						loading: false,
						errors: {
							global: 'Data not found'
						}
					}))
				}
			})
			.catch(err => {
				setState(state => ({
					...state,
					loading: false,
					errors: {
						global: 'Internal Server Error'
					}
				}))
			});
	}, []);

	React.useEffect(() => {
		if (state.visible) {
			animateConfirm();
		}
	}, [state.visible])

	React.useEffect(() => {
		if (errors.code) {
			handleClose();
			Alert.alert(
		      `STATUS ${errors.code}`,
		      `${errors.msg}`,
		      [
		        { text: "OK", onPress: () => console.log("OK Pressed") }
		      ]
		    );
		}
	}, [state.errors])

	const dynamicSort = (property) => {
	    var sortOrder = 1;
	    if(property[0] === "-") {
	        sortOrder = -1;
	        property = property.substr(1);
	    }

	    return function (a,b) {
	        var result = (a[property] > b[property]) ? -1 : (a[property] < b[property]) ? 1 : 0;
	        return result * sortOrder;
	    }
	}

	const animateConfirm = () => {
		// state.bounceValue.setValue(100);
		Animated.spring(state.bounceValue,{
		    toValue: 0,
		    velocity: 3,
		    tension: 2,
		    friction: 8,
		    useNativeDriver: true
		}).start();
	}

	const handlePressItem = (choosed) => {
		setState(state => ({
			...state,
			presedItem: choosed,
			visible: true
		}))
	}

	const handleClose = () => {
		//cant close when user submit
		if (!state.sendLoading) {
			Animated.spring(state.bounceValue,{
			    toValue: 400,
			    useNativeDriver: true
			}).start();

			setTimeout(function() {
				setState(state => ({
					...state,
					visible: false,
					presedItem: {},
					confirmCancel: false
				}))
			}, 100);
		}
	}

	const handleBayar = () => {
		if (!state.sendLoading) {
			setState(state => ({
				...state,
				sendLoading: true,
				errors: {}
			}))

			const param2 = {
				userid: props.userid,
				no_order: presedItem.nomorOrder,
				norek_user: props.user.norek,
				channel_id: '8002',
				nominal: presedItem.order.tariff
			}

			ApiYuyus.cityCourier.pembayaran(props.userid, JSON.stringify(param2))
				.then(response => {
					Alert.alert(
				      `STATUS 00`,
				      `${response.desk_mess}`,
				      [
				        { text: "OK", onPress: () => handleCloseModalBayar() }
				      ]
				    );
				    
					setState(state => ({
						...state,
						sendLoading: false
					}))
				})
				.catch(err => {
					if (err.code) {
						setState(state => ({
							...state,
							errors: {
								...err,
								msg: err.code === '044' ? 'SALDO ANDA TIDAK BOLEH KURANG DARI 10.000 SETELAH TRANSAKSI' : err.msg.toUpperCase()
							},
							sendLoading: false
						}));
					}else{
						console.log(err.response.data);
						const errors = {
							code: 500,
							msg: 'Tidak dapat memproses permintaan anda, silahkan coba kembali'
						}

						setState(state => ({
							...state,
							errors,
							sendLoading: false
						}));
					}
				});
		}
	}

	const handleCloseModalBayar = () => {
		const newData = state.data.filter(row => row.nomorOrder !== presedItem.nomorOrder);
		setState(state => ({
	    	...state,
	    	data: newData,
	    	data3: [
	    		state.presedItem,
	    		...state.data3
	    	],
	    	// presedItem: {},
	    	visible: false
	    }))

		// setState(state => ({
		// 	...state,
		// 	presedItem: {},
		// 	visible: false,

		// }))
	}

	const handleCancle = (text) => {
		if (Object.keys(state.presedItem).length > 0) {
			
			setState(state => ({
				...state,
				sendLoading: true,
				visible: false
			}))

			const { customer, destination, order, nomorOrder, userid } = state.presedItem;
			const payload = {
				userid,
				no_order: nomorOrder,
				keterangan: text
			}

			ApiYuyus.cityCourier.cancle(payload)
				.then(res => {
					//add back saldo
					if (order.payment_type === '2') {
						props.calculateSaldo(order.tariff, 'add');
					}

					Alert.alert(
				      `STATUS ${res.rc_mess}`,
				      `ORDER TELAH DIBATALKAN`,
				      [
				        { text: "OK", onPress: () => console.log("OK Pressed") }
				      ]
				    );

					const newData = state.data.filter(row => row.nomorOrder !== presedItem.nomorOrder);

				    setState(state => ({
				    	...state,
				    	sendLoading: false,
				    	data: newData,
				    	data2: [
				    		state.presedItem,
				    		...state.data2
				    	],
				    	confirmCancel: false
				    }))
				})
				.catch(err => {
					if (err.msg) {
						setError(err.msg, err.status);
					}else{
						setError('Tidak dapat memproses permintaan anda', '500');
					}
				});
		}
	}

	const setError = (msg, status) => {
		
		setState(state => ({
			...state,
			sendLoading: false
		}))

		setTimeout(function() {
			Alert.alert(
		      `STATUS ${status}`,
		      `${msg.toUpperCase()}`,
		      [
		        { text: "OK", onPress: () => console.log("OK Pressed") }
		      ]
		    );
		}, 10); 
	}

	const handlePressTab = (page) => setState(state => ({
		...state,
		activePage: page
	}))

	// const viewDetail = (row) => {
	// 	setState(state => ({
	// 		...state,
	// 		detailVisible: {
	// 			status: true,
	// 			data: row
	// 		}
	// 	}))
	// }


	if (loading) {
		return(
			<LoadingApp />
		);
	}else{
		return(
			<View style={styles.root}>
				<View style={styles.card}>
					<TouchableOpacity style={{marginRight: 10}} onPress={() => props.goBack()}>
						<Ionicons name="md-arrow-back" size={20} color="white" />
					</TouchableOpacity>
					<Text style={styles.textNavigation}>Daftar Order</Text>
				</View>
				<Footer>
		          <FooterTab style={{backgroundColor: 'white', elevation: 0}}>
		            <Button 
		            	vertical 
		            	style={{
		            		backgroundColor: activePage === 1 ? '#ebebeb' : 'transparent', 
		            		borderRadius: 0
		            	}}
		            	onPress={() => handlePressTab(1)}
		            >
		              <Icon name="ios-wallet" style={{color: '#ff9500'}}/>
		              <Text style={{color: '#ff9500'}}>Order ({state.data.length})</Text>
		            </Button>
		            <Button 
		            	vertical 
		            	style={{
		            		backgroundColor: activePage === 2 ? '#ebebeb' : 'transparent', 
		            		borderRadius: 0
		            	}}
		            	onPress={() => handlePressTab(2)}
		            >
		              <Icon name="ios-close-circle" style={{color: '#ff9500'}}/>
		              <Text style={{color: '#ff9500'}}>Batal ({state.data2.length})</Text>
		            </Button>
		            <Button 
		            	vertical 
		            	style={{
		            		backgroundColor: activePage === 3 ? '#ebebeb' : 'transparent', 
		            		borderRadius: 0
		            	}}
		            	onPress={() => handlePressTab(3)}
		            >
		              <Icon name="ios-checkmark-circle" style={{color: '#ff9500'}}/>
		              <Text style={{color: '#ff9500'}}>Selesai ({state.data3.length})</Text>
		            </Button>
		          </FooterTab>
		        </Footer>
		        <ScrollView>
			        <View style={{flex: 1}}>
						{ activePage === 1 && 
							<PageOrder 
								data={state.data} 
								handlePressItem={handlePressItem}
							/> }

				        { activePage === 2 && 
				        	<BatalOrder 
				        		data={state.data2}
				        	/> }

				         { activePage === 3 && 
				         	<SelesaiOrder 
				         		data={state.data3}
				         		userid={props.userid}
				         	/>
				         }
				    </View>
				</ScrollView>
		        <Modal 
		        	transparent={true}
		        	visible={state.visible}
		        	onRequestClose={() => handleClose()}
		        	animationType="fade"
		        >
		        	{ state.visible &&  
		        		<TouchableOpacity 
		        			activeOpacity={1} 
		        			onPressOut={handleClose}
		        			style={{backgroundColor: 'rgba(0,0,0,0.5)', flex: 1}}
		        		>
					      	<TouchableWithoutFeedback>
				        		<Animated.View
					        		style={[styles.subView, {transform: [{translateY: state.bounceValue }]}]}
					      		>
					      			{ !state.confirmCancel ? <Content style={styles.content}>
								        	<View style={styles.confirmContent}>
								        		<Text style={styles.title}>KONFIRMASI PEMBAYARAN {presedItem.order.payment_type === '1' && '(TUNAI)'}</Text>
								        		<View style={styles.list}>
								        			<Text numberOfLines={1}>Isi Kiriman</Text>
									        		<Text note numberOfLines={1}>{presedItem.order.information}</Text>
								        		</View>
								        		<View style={styles.list}>
									        		<Text numberOfLines={1}>Pengirim ({presedItem.source.name})</Text>
									        		<Text note numberOfLines={1}>{presedItem.source.address_name}</Text>
									        		<Text note numberOfLines={1}>{presedItem.source.address}</Text>
								        		</View>
								        		<View style={styles.list}>
									        		<Text numberOfLines={1}>Penerima ({presedItem.destination.name})</Text>
									        		<Text note numberOfLines={1}>{presedItem.destination.address_name}</Text>
									        		<Text note numberOfLines={1}>{presedItem.destination.address}</Text>
								        		</View>
								        	</View>
								        	{ presedItem.order.payment_type === '2' && <Button 
								        		style={{justifyContent: 'space-between', backgroundColor: "#FF9501"}}
								        		onPress={handleBayar}
								        		disabled={state.sendLoading}
								        	>
								        		{ state.sendLoading ? <Text>Sedang diproses...</Text> : <React.Fragment>
								        			<Text style={styles.btntext}>VIA PGM</Text>
								        			<Text>RP {presedItem.order ? numberWithCommas(presedItem.order.tariff) : 0 }</Text>
								        		</React.Fragment>}
								        	</Button>} 
								        	<Button 
								        		transparent 
								        		style={{justifyContent: 'center', alignItems: 'center'}}
								        		onPress={() => setState(state => ({
								        			...state,
								        			confirmCancel: true
								        		}))}
								        	>
									        	<Text>BATALKAN ORDER</Text>	
									      	</Button>
								        </Content> : <CencelForm onCencel={handleCancle} />}
						      	</Animated.View> 
							</TouchableWithoutFeedback>
				    </TouchableOpacity>}
			    </Modal>
			</View>
		);
	}
	
}

CartView.propTypes = {
	goBack: PropTypes.func.isRequired,
	userid: PropTypes.string.isRequired,
	calculateSaldo: PropTypes.func.isRequired
}

const styles = StyleSheet.create({
	root: {
		position: 'absolute',
		top: 0,
		bottom: 0,
		backgroundColor: 'white',
		flex: 1,
		width: '100%',
		zIndex: 2
	},
	card: {
		backgroundColor: '#ff9500',
		alignItems: 'center',
		flexDirection: 'row',
		padding: 10,
		paddingTop: Constants.statusBarHeight + 10,
		height: height / 10 + 5
	},
	textNavigation: {
		fontFamily: 'Roboto_medium',
		color: '#FFFF',
		fontSize: 18
	},
	loading: {
		position:'absolute',
		zIndex: 1,
		backgroundColor: '#FFFF',
		top: 0,
		bottom: 0,
		width: '100%',
		justifyContent: 'center',
		alignItems: 'center'
	},
	subView: {
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
		borderTopWidth: 0.2,
		borderColor: '#c4c4c2',
		backgroundColor: "white"
	},
	content: {
		margin: 5
	},
	title: {
		fontFamily: 'Roboto_medium',
		marginBottom: 7,
		fontWeight: 'bold'
		// color: '#FFFF'
	},
	btntext: {
		textAlign: 'center'
	},
	confirmContent: {
		padding: 7,
		marginBottom: 7
	},
	list: {
		marginBottom: 4
	},
	group: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	}
})

export default CartView;