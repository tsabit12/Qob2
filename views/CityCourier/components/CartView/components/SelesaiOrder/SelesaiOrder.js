import React, { useState, useEffect } from 'react';
import {
	Animated,
	View,
	StyleSheet,
	Modal,
	TouchableOpacity,
	TouchableWithoutFeedback
} from 'react-native';
import PropTypes from 'prop-types';
import { 
	Text, 
	List,
	ListItem,
	Body,
	Right,
	Content
} from 'native-base';
import { ApiQposin } from '../../../../../../api';

const numberWithCommas = (number) => {
	return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

const timeDifference = (current, previous) => {
    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsed = current - previous;

    if (elapsed < msPerMinute) {
         return Math.round(elapsed/1000) + ' detik yang lalu';   
    }else if (elapsed < msPerHour) {
         return Math.round(elapsed/msPerMinute) + ' menit yang lalu';   
    }else if (elapsed < msPerDay ) {
         return Math.round(elapsed/msPerHour ) + ' jam yang lalu';   
    }else if (elapsed < msPerMonth) {
        return  Math.round(elapsed/msPerDay) + ' hari yang lalu';   
    }else if (elapsed < msPerYear) {
        return  Math.round(elapsed/msPerMonth) + ' bulan yang lalu';   
    }else {
        return Math.round(elapsed/msPerYear ) + ' tahun yang lalu';   
    }
}

String.prototype.toDate = function(format){
  var normalized      = this.replace(/[^a-zA-Z0-9]/g, '-');
  var normalizedFormat= format.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-');
  var formatItems     = normalizedFormat.split('-');
  var dateItems       = normalized.split('-');

  var monthIndex  = formatItems.indexOf("mm");
  var dayIndex    = formatItems.indexOf("dd");
  var yearIndex   = formatItems.indexOf("yyyy");
  var hourIndex     = formatItems.indexOf("hh");
  var minutesIndex  = formatItems.indexOf("ii");
  var secondsIndex  = formatItems.indexOf("ss");

  var today = new Date();

  var year  = yearIndex>-1  ? dateItems[yearIndex]    : today.getFullYear();
  var month = monthIndex>-1 ? dateItems[monthIndex]-1 : today.getMonth()-1;
  var day   = dayIndex>-1   ? dateItems[dayIndex]     : today.getDate();

  var hour    = hourIndex>-1      ? dateItems[hourIndex]    : today.getHours();
  var minute  = minutesIndex>-1   ? dateItems[minutesIndex] : today.getMinutes();
  var second  = secondsIndex>-1   ? dateItems[secondsIndex] : today.getSeconds();

  return new Date(year,month,day,hour,minute,second);
};

const SelesaiOrder = props => {
	const [state, setState] = useState({
		position: new Animated.Value(-40),
		presedItem: {
			status: false,
			data: {}
		},
		bounceValue: new Animated.Value(300),
		loading: false,
		history: {
			status: false,
			data: []
		}
	})

	const { data } = props;
	const { presedItem, history } = state;

	useEffect(() => {
		Animated.spring(state.position, {
	      toValue: 0,
	      useNativeDriver: true
	    }).start();	
	}, []);

	useEffect(() => {
		if (state.presedItem.status) {
			state.bounceValue.setValue(300);
			Animated.spring(state.bounceValue,{
			    toValue: 0,
			    tension: 10,
			    useNativeDriver: true
			}).start();
		}
	}, [state.presedItem.status]) 

	useEffect(() => {
		if (history.status) {
			state.bounceValue.setValue(190);
			
			Animated.spring(state.bounceValue,{
			    toValue: 0,
			    tension: 10,
			    useNativeDriver: true
			}).start();
		}
	}, [history.status])

	

	const handlePress = (item) => {
		setState(state => ({
			...state,
			presedItem: {
				status: true,
				data: item
			}
		}))
	}

	const handleClose = () => {
		setState(state => ({
			...state,
			presedItem: {
				status: false,
				data: []
			},
			history: {
				status: false,
				data: []
			}
		}))
	}


	const onPressHistory = () => {
		if (presedItem.status) {
			const payload = {
				userid: props.userid,
				// userid: '440000214',
				nomorOrder: presedItem.data.nomorOrder
			}

			setState(state => ({
				...state,
				loading: true
			}))

			ApiQposin.getNotification(payload)
			.then(notifications => {
				setState(state => ({
					...state,
					loading: false,
					history: {
						status: true,
						data: notifications
					}
				}))
			})
		}
	}

	return(
		<React.Fragment>
			<Animated.View 
				style={[styles.root, {transform: [{translateX: state.position }] }]} 
			>
				{ data.length > 0 ? <List>
					{data.map((row, index) => (
						<ListItem 
							avatar
		          			onPress={() => handlePress(row)} 
		          			key={index}		          	
		          			selected={row.nomorOrder === presedItem.data.nomorOrder ? true : false }		
		          		>
	          				<Body style={{marginLeft: -10}}>
								<Text style={styles.subTitle}>Nomor Order</Text>
								<Text note>{row.nomorOrder}</Text>
							</Body>
							<Right>
								<Text note numberOfLines={1} style={{fontSize: 12}}>
								 	{ timeDifference(new Date(), row.wkt_order.toDate("yyyy-mm-dd hh:ii:ss"))}
								</Text>
							</Right>
		          		</ListItem>
					))}
				</List> : 
				<View style={styles.empty}>
					<Text style={styles.emptyText}>Data Selesai Order Kosong</Text>
				</View> }
			</Animated.View>
			<Modal
				transparent={true}
	        	visible={state.presedItem.status}
	        	onRequestClose={handleClose}
	        	animationType="fade"
			>
				<TouchableOpacity 
        			activeOpacity={1} 
        			onPressOut={handleClose}
        			style={{backgroundColor: 'rgba(0,0,0,0.5)', flex: 1}}
        		>
        			<TouchableWithoutFeedback>
						<Animated.View style={[styles.modal, {transform: [{translateY: state.bounceValue }]}]}>
							{ Object.keys(presedItem.data).length > 0 && <Content style={styles.content}>
								<View style={styles.confirmContent}>
					        		<Text style={styles.title}>DETAIL ORDER ({presedItem.data.nomorOrder})</Text>
					        		<View style={styles.list}>
					        			<Text 
						        			numberOfLines={1}
						        			style={styles.subTitle}
						        		>
						        			Isi Kiriman
						        		</Text>
						        		<Text note numberOfLines={1}>{presedItem.data.order.information}</Text>
					        		</View>
					        		<View style={styles.list}>
						        		<Text 
						        			numberOfLines={1}
						        			style={styles.subTitle}
						        		>
						        			Pengirim ({presedItem.data.source.name})
						        		</Text>
						        		<Text note numberOfLines={1}>{presedItem.data.source.address_name}</Text>
						        		<Text note numberOfLines={1}>{presedItem.data.source.address}</Text>
					        		</View>
					        		<View style={styles.list}>
						        		<Text 
						        			numberOfLines={1}
						        			style={styles.subTitle}
						        		>
						        			Penerima ({presedItem.data.destination.name})
						        		</Text>
						        		<Text note numberOfLines={1}>{presedItem.data.destination.address_name}</Text>
						        		<Text note numberOfLines={1}>{presedItem.data.destination.address}</Text>
					        		</View>
					        		<View style={styles.list}>
					        			<Text 
						        			numberOfLines={1}
						        			style={styles.subTitle}
						        		>
						        			Tarif
						        		</Text>
						        		<Text note numberOfLines={1}>{numberWithCommas(presedItem.data.order.tariff)}</Text>
					        		</View>
					        		<View>
					        			<Text 
						        			numberOfLines={1}
						        			style={styles.subTitle}
						        		>
						        			Jenis Pembayaran
						        		</Text>
						        		<Text note numberOfLines={1}>{presedItem.data.order.payment_type === '2' ? 'Non Tunai' : 'Tunai'}</Text>
					        		</View>
					        	</View>

					        	{ history.status ? <View style={styles.cardHistory}>
					        		<Text style={styles.cardTitleText}>Riwayat Order</Text>
					        		<View style={{padding: 7}}>
						        		{history.data.map((row, index) => (
						        			<View key={index} style={{flexDirection: 'row'}}>
						        				<View style={styles.circle} />
							        			<View style={{borderLeftWidth: 1, borderColor: '#ff9900', paddingLeft: 10, paddingBottom: 5}}>
							        				<Text>{row.create_time.substring(0, 10)} 
							        					<Text note> ({row.create_time.substring(11, 16)})</Text>
							        				</Text>
								        			<Text note>
								        				{row.body}
								        			</Text>
							        			</View>
						        			</View>
						        		))}
					        		</View>
					        	</View> : <View style={styles.footer}>
					        		<Text 
					        			style={styles.link}
					        			onPress={onPressHistory}
					        		>
					        			{ state.loading ? 'Sedang memuat...' : 'Tampilkan riwayat order'}
					        		</Text>
					        	</View> }
							</Content> }
						</Animated.View>
					</TouchableWithoutFeedback>

        		</TouchableOpacity>
			</Modal>
		</React.Fragment>
	);
}

const styles = StyleSheet.create({
	root: {
		flex: 1
	},
	empty: {
		//backgroundColor: 'red',
		padding: 5,
		margin: 5,
		height: 60,
		justifyContent: 'center',
		alignItems: 'center',
	},
	emptyText: {
		fontFamily: 'Roboto_medium',
		fontSize: 15
	},
	modal: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		backgroundColor: 'white'
	},
	content: {
		margin: 5
	},
	confirmContent: {
		padding: 7,
		marginBottom: 7
	},
	list: {
		marginBottom: 4
	},
	title: {
		fontFamily: 'Roboto_medium',
		marginBottom: 7,
		fontWeight: 'bold'
		// color: '#FFFF'
	},
	footer: {
		alignItems: 'center',
		marginBottom: 4,
		marginTop: -4
	},
	link: {
		color: '#5880bf',
		fontFamily: 'Roboto',
		fontSize: 15
	},
	subTitle: {
		fontFamily: 'Roboto_medium'
	},
	cardHistory: {
		margin: 4,
		borderWidth: 0.3,
		borderRadius: 6,
		borderColor: '#b6b8b6'
	},
	circle:{
		width: 10,
		height: 10,
		borderRadius: 10 / 2,
		backgroundColor: '#ff9900',
		borderWidth: 1,
		borderColor: '#53bf00',
		marginRight: -6,
		marginTop: 7
	},
	cardTitleText: {
		backgroundColor: '#56afbf', 
		textAlign: 'center', 
		borderTopLeftRadius: 6, 
		borderTopRightRadius: 6,
		color: 'white',
		fontFamily: 'Roboto_medium',
		fontSize: 17,
		padding: 5
	}
})

SelesaiOrder.propTypes = {
	data: PropTypes.array.isRequired,
	userid: PropTypes.string.isRequired
}

export default SelesaiOrder;