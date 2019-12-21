import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { connect } from "react-redux";
import { SafeAreaView } from 'react-navigation';
import {
  Card,
  CardHeader,
  Layout,
  Text,
} from '@ui-kitten/components';
const convertList = (array) => {
	if (array) { //determine if array not undefined
		var initialBalance = array[0].split(":");
		var finalBalance = array[1].split(":");
		var transaction = array[2].replace('Transaksi : ', '');
		return{
			initialBalance: initialBalance[1].replace(/ /g, ''),
			finalBalance: finalBalance[1].replace(/ /g, ''),
			transaction: transaction.split('~')
		}
	}else{
		return null;
	}
}

const TextList = ({ detail }) => (
	<React.Fragment>
		<View style={styles.oneRow}>
			<Text>Initial Balance</Text>
			<Text style={{marginLeft: 'auto'}}>{ detail.initialBalance }</Text>
		</View>
		<View style={styles.oneRow}>
			<Text>Final Balance</Text>
			<Text style={{marginLeft: 'auto'}}>{ detail.finalBalance }</Text>
		</View>
		<View
		  style={{
		    borderBottomColor: '#C0C0C0',
		    borderBottomWidth: 1,
		    paddingTop: 8
		  }}
		/>
		<View style={{paddingTop: 8}}>
			{detail.transaction.map((x, i) => <Text key={i}>{x}</Text> )}
		</View>
	</React.Fragment>
);

const List = ({ list }) => {
	const data = convertList(list);
	return(
		<Layout>
			{list ? <TextList detail={data} /> : <Text>No result found</Text> }
		</Layout>
	);
}



const ResultRekening = ({ listSearch, searchText }) => {
	return(
		<SafeAreaView style={{marginTop: -30, paddingBottom: 20}}>
			<ScrollView>
				<View style={styles.container}>
					{ Object.keys(listSearch).length > 0 && searchText.length > 0 && <List list={listSearch[searchText]} /> }
				</View>
			</ScrollView>
		</SafeAreaView>
	);
} 

let styles = StyleSheet.create({
	container:{
		paddingBottom: 100,
		margin: 15
	},
	card: {
	    marginHorizontal: 8,
	    backgroundColor: '#F5F5F5'
	},
	oneRow: {
		flexDirection: 'row'
	}
})

function mapStateToProps(state) {
	return{
		listSearch: state.search.rekening 
	}
}

export default connect(mapStateToProps, null)(ResultRekening);