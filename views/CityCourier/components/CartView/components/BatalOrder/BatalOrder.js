import React, { useState, useEffect } from 'react';
import {
	View,
	Animated,
	Modal,
	StyleSheet,
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

const BatalOrder = props => {
	const [state, setState] = useState({
		position: new Animated.Value(-40),
		presedItem: {
			status: false,
			data: []
		},
		bounceValue: new Animated.Value(300)
	})

	useEffect(() => {
		Animated.spring(state.position, {
	      toValue: 0,
	      useNativeDriver: true
	    }).start();	
	}, []);

	useEffect(() => {
		if (state.presedItem.status) {
			Animated.spring(state.bounceValue,{
			    toValue: 0,
			    tension: 10,
			    useNativeDriver: true
			}).start();
		}
	}, [state.presedItem.status]) 

	const { data } = props;

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
			}
		}))
	}

	const { presedItem } = state;
	
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
								<Text>Nomor Order</Text>
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
					<Text style={styles.emptyText}>Data Batal Order Kosong</Text>
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
					        			<Text numberOfLines={1}>Isi Kiriman</Text>
						        		<Text note numberOfLines={1}>{presedItem.data.order.information}</Text>
					        		</View>
					        		<View style={styles.list}>
						        		<Text numberOfLines={1}>Pengirim ({presedItem.data.source.name})</Text>
						        		<Text note numberOfLines={1}>{presedItem.data.source.address_name}</Text>
						        		<Text note numberOfLines={1}>{presedItem.data.source.address}</Text>
					        		</View>
					        		<View style={styles.list}>
						        		<Text numberOfLines={1}>Penerima ({presedItem.data.destination.name})</Text>
						        		<Text note numberOfLines={1}>{presedItem.data.destination.address_name}</Text>
						        		<Text note numberOfLines={1}>{presedItem.data.destination.address}</Text>
					        		</View>
					        		<View style={styles.list}>
					        			<Text numberOfLines={1}>Tarif</Text>
						        		<Text note numberOfLines={1}>{numberWithCommas(presedItem.data.order.tariff)}</Text>
					        		</View>
					        		<View style={styles.list}>
					        			<Text numberOfLines={1}>Jenis Pembayaran</Text>
						        		<Text note numberOfLines={1}>{presedItem.data.order.payment_type === '2' ? 'Non Tunai' : 'Tunai'}</Text>
					        		</View>
					        	</View>
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
})

BatalOrder.propTypes = {
	data: PropTypes.array.isRequired
}

export default BatalOrder;