import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { connect } from "react-redux";
import { ListItem, Button, Icon } from '@ui-kitten/components';

const Judul = ({ navigation }) => (
	<View>
		<Text style={styles.judul}>Daftar Order</Text>
	</View>
);

const List = ({ listdata }) => {
	const a = [];
	for (var key in listdata) {
	    if (!listdata.hasOwnProperty(key)) continue;

	    var obj = listdata[key];
	    for (var prop in obj) {
	        if (!obj.hasOwnProperty(prop)) continue;

	        // your code
	        // a.push({
	        // 	test: obj[prop] 
	        // })
	        //console.log(prop + " = " + obj[prop]);
	        console.log(obj[prop]);
	        // return(
	        // 	<View>
	        // 		<Text>Test</Text>
	        // 		<Text>Test</Text>
	        // 		<Text>Test</Text>
	        // 	</View>
	        // );
	    }
	}

	 return(
	    	<View>
	    		<Text>Test</Text>
	    		<Text>Test</Text>
	    		<Text>Test</Text>
	    	</View>
	    );
} 

class ListOrder extends React.Component{
	static navigationOptions = ({ navigation }) => ({
		headerTitle: <Judul navigation={navigation}/>
	})

	render(){
		const { orderlist } = this.props;
		return(
			<View style={styles.container}>
				{Object.keys(orderlist).length > 0 ? <List listdata={orderlist} /> : <Text style={styles.status}>Not found</Text>}
			</View>
		);
	}
}

function mapStateToProps(state) {
	return{
		orderlist: state.order.dataOrder
	}
}

export default connect(mapStateToProps, null)(ListOrder);


const styles = StyleSheet.create({
	container: {
	  marginTop: 10,
	  flex: 1,
	},
	judul: {
		fontFamily: 'open-sans-bold',
	  	fontSize: 16,
	  	fontWeight: '700'
	},
	status: {
		fontFamily: 'open-sans-bold',
		fontSize: 20,
		fontWeight: '800',
		textAlign: 'center',
		marginTop: 20
	},
	listItem: { borderRadius: 1 },
	listItemTitle: { color: '#3366ff' },
	listItemDescription: { color: '#2E3A59' },
});