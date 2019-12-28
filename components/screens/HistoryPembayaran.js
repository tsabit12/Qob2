import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { ListItem, Button, Icon } from '@ui-kitten/components';

const Judul = ({ navigation }) => (
	<View>
		<Text style={styles.header}>History</Text>
		<Text style={{fontFamily: 'open-sans-reg'}}>Riwayat Transaksi</Text>
	</View>
);

class HistoryPembayaran extends React.Component{
	static navigationOptions = ({ navigation }) => ({
		headerTitle: <Judul navigation={navigation}/>
	})

	renderItemAccessory = (style, id) => {
		return(
	    	<Button style={style} size='small' status='info' icon={this.BtnIcon} onPress={() =>  	this.onKlik(id)} />
		)
	}

	BtnIcon = (style) => (
	  <Icon {...style} name='paper-plane-outline'/>
	)

	onKlik = (id) => {
		this.props.navigation.navigate({
			routeName: 'DetailTrans',
			params: {
				kodeTrans: id
			}
		})
	}

	render(){
		return(
			<View>
				<ListItem
				    style={styles.listItem}
				    titleStyle={styles.listItemTitle}
				    descriptionStyle={styles.listItemDescription}
				    title='TRX0001'
				    description='1 hari yang lalu (5 item)'
				    accessory={(e) => this.renderItemAccessory(e, 'TRX0001')}
				/>
				<ListItem
				    style={styles.listItem}
				    titleStyle={styles.listItemTitle}
				    descriptionStyle={styles.listItemDescription}
				    title='TRX0002'
				    description='2 hari yang lalu (2 item)'
				    accessory={(e) => this.renderItemAccessory(e, 'TRX0002')}
				/>
				<ListItem
				    style={styles.listItem}
				    titleStyle={styles.listItemTitle}
				    descriptionStyle={styles.listItemDescription}
				    title='TRX0003'
				    description='3 hari yang lalu (10 item)'
				    accessory={(e) => this.renderItemAccessory(e, 'TRX0003')}
				/>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	header: {
	  	fontFamily: 'open-sans-bold',
	  	fontSize: 16,
	  	fontWeight: '700'
	},
	listItem: { borderRadius: 1 },
	listItemTitle: { color: '#3366ff' },
	listItemDescription: { color: '#2E3A59' },
});

export default HistoryPembayaran;