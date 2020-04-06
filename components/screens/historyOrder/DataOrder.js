import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { ListItem, Icon } from '@ui-kitten/components';

const renderItemAccessory = (style) => {
	return(
		<Icon {...style} name='arrow-back' width={20} height={20} />
	)
} 

const DataOrder = ({ data }) => {
	return(
		<View style={{flex: 1, marginLeft: 2, marginRight: 2}}>
			{ data.map((x, i) => <ListItem 
				title={x.extid} 
				// description={x.orderDate.substring(0, 10)}
				titleStyle={{color: '#3366ff', fontFamily: 'open-sans-reg'}}
				// onPress={() => onPressItem(x.extid)}
				description={x.desctrans}
				accessory={(e) => renderItemAccessory(e)}
				descriptionStyle={{fontFamily: 'open-sans-reg', fontSize: 10}}
			/> )}
		</View>
	);
} 

const styles = StyleSheet.create({
	title: {
		minHeight: 50, 
		justifyContent: 'center', 
		alignItems: 'center', 
		margin: 5,
		borderRadius: 5
	},
	card: {
		borderWidth: 0.9,
	    borderColor: '#FFF',
	    borderRadius: 2,
	    margin: 2,
	    marginBottom: 2,
	    backgroundColor: '#228708',
	    flexDirection: 'row'
	},
	nomor: {
		borderRightWidth: 1,
		padding: 10,
	}
})

export default DataOrder;