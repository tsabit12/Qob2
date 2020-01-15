import React from "react";
import { View, Text, ScrollView } from "react-native";
import styles from "../styles";
import { connect } from "react-redux";
import { Card, CardHeader } from '@ui-kitten/components';

const numberWithCommas = (number) => {
	if (isNaN(number)) {
		return '-';
	}else{
		return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
	}
}

const Judul = ({ navigation }) => (
	<View>
		<Text style={styles.judul}>Rekening Koran</Text>
		<Text>{ navigation ? navigation : 'Loading...'}</Text>
	</View>
)

const Header = (jenis) => {
	const desc = jenis === 'D' ? 'Debit' : 'Credit';
	return(
		<CardHeader title={desc} titleStyle={{textAlign: 'center'}}/>
	);
}

const ListItem = ({ listitem }) => {
	let initialBalance = listitem[0];
	let finalBalance = listitem[1];
	let transaksi = listitem[2];
	let detailTrans = transaksi.split('#');
	// console.log(detailTrans);
	// console.log(finalBalance);
	return(
		<React.Fragment>
				<View style={{padding: 10}}>
					<View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
						<Text style={styles.label}>Intial Balance</Text>
						<Text style={styles.label}>{numberWithCommas(initialBalance)}</Text>
					</View>
					<View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
						<Text style={styles.label}>Final Balance</Text>
						<Text style={styles.label}>{numberWithCommas(finalBalance)}</Text>
					</View>
				</View>
				<ScrollView>
					{detailTrans.map((x, i) => {
						if (x.length > 0) {
							let valuesOfDetail = x.split('~');
							return(
								<Card status='success' key={i} style={{marginTop: 7, marginHorizontal: 10}}>
							      	<View style={{paddingBottom: 5}}>
							      		<Text style={{fontFamily: 'open-sans-bold'}}>Keterangan</Text>
										<Text style={styles.labelList}>{valuesOfDetail[1]}</Text>
									</View>
									<View style={{paddingBottom: 5}}>
										<Text style={{fontFamily: 'open-sans-bold'}}>Waktu</Text>
										<Text style={styles.labelList}>
											{ valuesOfDetail[2] ? `${valuesOfDetail[2]} ${valuesOfDetail[3]}` : '-' } 
										</Text>
									</View>
									<View style={{paddingBottom: 5}}>
										<Text style={{fontFamily: 'open-sans-bold'}}>Tujuan</Text>
										<Text style={styles.labelList}>{ valuesOfDetail[4] ? valuesOfDetail[4] : '-'}</Text>
									</View>
									<View style={{paddingBottom: 5}}>
										<Text style={{fontFamily: 'open-sans-bold'}}>Nominal</Text>
										<Text style={styles.labelList}>{numberWithCommas(valuesOfDetail[5])} ({valuesOfDetail[0]})</Text>
									</View>
							    </Card>
							)
						}
					})}
				</ScrollView>
				<View style={{marginTop: 20}}/>
		</React.Fragment>
	);
} 

class ResultRekeningSearch extends React.Component{
	static navigationOptions = ({ navigation }) => ({
	    headerTitle: <Judul navigation={navigation.state.params.noRek} />
	    /* No more header config here! */
	});

	render(){
		const { list } = this.props;
		return(
			<React.Fragment>
				{list.length > 0 && <ListItem listitem={list} />}
			</React.Fragment>
		);
	}
}

function mapStateToProps(state, nextProps) {
	const rek = nextProps.navigation.state.params.noRek;
	return{
		list: state.search.rekening[rek]
	}
}

export default connect(mapStateToProps)(ResultRekeningSearch);