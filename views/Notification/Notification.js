import React from 'react';
import { 
	View, 
	StyleSheet,
	Dimensions,
	TouchableOpacity,
	TouchableHighlight,
	ToastAndroid
} from 'react-native';
import PropTypes from 'prop-types';
import Constants from 'expo-constants';
import { Ionicons } from '@expo/vector-icons'; 
import { SwipeListView } from 'react-native-swipe-list-view';
import { Spinner, Text } from 'native-base';
import { connect } from 'react-redux';
import { getNotification, removeNotif } from '../../actions/notification';
import TimeSince from './helper/TimeSince';

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

const { height, widht } = Dimensions.get('window');

const LoadingApp = () => {
	return(
		<View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
			<Spinner color='blue' />
		</View>
	);
}

const Notification = props => { 
	const [state, setState] = React.useState({
		loading: true,
		// listData: []
	})

	React.useEffect(() => {
		const payload = {
			userid: props.user.userid
		}

		props.getNotification(payload);

		setTimeout(function() {
			setState(state => ({
				...state,
				loading: false
			}))
		}, 100);
	}, [])

	// React.useEffect(() => {
	// 	if (props.notification.data.length > 0 && state.listData.length === 0) {
	// 		const { data } = props.notification;
	// 		//console.log(props.notification.data);
	// 		const newData = data.map((row, i) => ({ 
	// 			key: `${i}`, 
	// 			text: row.body, 
	// 			date: row.create_time, 
	// 			nomor: row.title,
	// 			id: row.key
	// 		}));
	// 		setState(state => ({
	// 			...state,
	// 			listData: newData
	// 		}))
	// 	}
	// }, [props.notification, state.listData]);

	const handlePress = (id) => alert(id);

	const renderItem = data => (
	    <TouchableHighlight
	        style={styles.rowFront}
	        underlayColor={'#d9d9d9'}
	        onPress={()  => handlePress(data.item.nomor)}
	    >
	        <View>
	        	<View style={styles.titleCard}>
	            	<Text>{data.item.nomor}</Text>
	            	<Text note>
	            		{ TimeSince(new Date(), data.item.date.toDate("yyyy-mm-dd hh:ii:ss"))}
	            	</Text>
	            </View>
	            <View style={styles.subCard}>
		            <Text 
		            	note
		            	numberOfLines={3}
		            >
		            	{data.item.text}
		            </Text>
	            </View>
	        </View>
	    </TouchableHighlight>
	);

	const deleteRow = (id) => {
		props.removeNotif(id)
			.then(() => {
				ToastAndroid.showWithGravity(
			      "Berhasil dihapus",
			      ToastAndroid.SHORT,
			      ToastAndroid.BOTTOM
			    );
			})
	}

	//  const onRowDidOpen = rowKey => {
	//     console.log('This row opened', rowKey);
	// };

	const renderHiddenItem = (data, rowMap) => (
	    <TouchableOpacity 
	    	style={styles.rowBack}
	    	onPress={() => deleteRow(data.item.id)}
	    >
	        <Ionicons name='ios-trash' size={40} color='red'/>
	    </TouchableOpacity>
	);

	return(
		<View style={styles.root}>
			<View style={styles.header}>
				<View style={styles.leftHeader}>
					<TouchableOpacity 
						onPress={() => props.navigation.goBack()}
					>
						<Ionicons name="md-arrow-back" size={24} color="white" />
					</TouchableOpacity>
					<Text style={styles.title}>Notifikasi</Text>
				</View>
			</View>
			<View style={styles.content}>
				{ state.loading ? <LoadingApp /> : <React.Fragment>
						{ props.notification.data.length > 0 ? <SwipeListView
			                data={props.notification.data}
			                renderItem={renderItem}
			                renderHiddenItem={renderHiddenItem}
			                leftOpenValue={75}
			                //rightOpenValue={-150}
			                previewRowKey={'0'}
			                previewOpenValue={75}
			                previewOpenDelay={100}
			                //onRowDidOpen={onRowDidOpen}
			            /> : <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
			            		<View style={{height: 50, justifyContent: 'center', backgroundColor: 'white', padding: 30, elevation: 1, borderRadius: 5}}>
			            			<Text>Anda tidak mempunyai notifikasi baru</Text>
			            		</View>
			            </View> }
					</React.Fragment> }
			</View>
		</View>
	);	
}

const styles = StyleSheet.create({
	root: {
		flex: 1,
		backgroundColor: '#f7f5f5'
	},
	header: {
		height: height / 9.6,
		backgroundColor: 'rgb(240, 132, 0)',
		paddingTop: Constants.statusBarHeight,
		justifyContent: 'center',
		elevation: 3
	},
	title: {
		color: 'white',
		fontWeight: 'bold',
		fontSize: 19,
		fontFamily: 'Roboto_medium',
		marginLeft: 7
	},
	leftHeader: {
		marginLeft: 7,
		flexDirection: 'row',
		alignItems: 'center',
		//backgroundColor: 'red',
		flex: 1
		//justifyContent: 'center'
	},
	content: {
		flex: 1
	},
	rowFront: {
        backgroundColor: 'white',
        justifyContent: 'center',
        minHeight: height / 8,
        margin: 5,
        elevation: 2
    },
	rowBack: {
		alignItems: 'center',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 27,
	},
	backRightBtn: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 75,
    },
    backRightBtnLeft: {
        backgroundColor: 'blue',
        right: 75,
    },
     backRightBtnRight: {
        backgroundColor: 'red',
        right: 0,
    },
    titleCard: {
    	flexDirection: 'row', 
    	justifyContent: 'space-between', 
    	//marginBottom: 7,
    	borderBottomWidth: 0.3,
    	padding: 10,
    	borderBottomColor: '#bfbfbf'
    },
    subCard: {
    	padding: 10,
    }
})

Notification.propTypes = {
	notification: PropTypes.object.isRequired,
	user: PropTypes.object.isRequired,
	getNotification: PropTypes.func.isRequired,
	removeNotif: PropTypes.func.isRequired
}

function mapStateToProps(state) {
	return{
		notification: state.notification,
		user: state.auth.dataLogin
	}
}

export default connect(mapStateToProps, { getNotification, removeNotif  })(Notification);