import React, { useState, useEffect } from 'react';
import { 
	View, 
	Animated,
	StyleSheet
} from 'react-native';
import PropTypes from 'prop-types';
import { 
	Text, 
	List,
	ListItem,
	Body,
	Right
} from 'native-base';

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

const PageOrder = props => {
	const [state, setState] = useState({
		position: new Animated.Value(-40)
	})

	useEffect(() => {
		Animated.spring(state.position, {
	      toValue: 0,
	      useNativeDriver: true
	    }).start();	
	}, []);

	const { data } = props;

	return(
		<Animated.View
			style={[styles.root, {transform: [{translateX: state.position }] }]} 
		>
			{ data.length > 0 ? 
				<List>
					{data.map((row, index) => (
						<ListItem 
							avatar
		          			//noIndent 
		          			onPress={() => props.handlePressItem(row)} 
		          			key={index}		          			
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
					<Text style={styles.emptyText}>Data Order Kosong</Text>
				</View> }
			
		</Animated.View>
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
	}
})

PageOrder.propTypes = {
	data: PropTypes.array.isRequired,
	handlePressItem: PropTypes.func.isRequired
}

export default PageOrder;