import React from "react";
import { View, Text, ScrollView } from "react-native";
import styles from "../styles";
// import Timeline from 'react-native-timeline-flatlist';
import { connect } from "react-redux";

const Judul = ({ navigation }) => {
	const { externalId } = navigation.state.params;
	return(
		<View>
			<Text style={styles.judul}>Lacak Kiriman</Text>
			<Text>{externalId}</Text>
		</View>
	)
}

const capitalize = (string) => {
	return string.toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ');
}

const getOfficeTujuan = (description) => {
	const parsing = description.split(';');
	const officeValue = parsing[2].split(':');
	//remove office number
	const office = officeValue[1].replace(/[0-9]/g, '');
	return capitalize(office);
} 

const getStatusAntar = (description) => {
	const parsing = description.split(';');
	const status = parsing[1];
	const statusValue = status.split(':');
	return statusValue[1];
}

const getPenerima = (description) => {
	const parsing = description.split(';');
	const receiver = parsing[2];
	const receiverValue = receiver.split(':');
	return receiverValue[1];
}

const getLayanan = (description) => {
	const parsing = description.split(';');
	const layanan = parsing[0];
	const valueLayanan = layanan.split(':');
	const pengirim = parsing[1];
	const valuePengirim = pengirim.split(':');
	return {
		layanan: valueLayanan[1],
		pengirim: valuePengirim[1]
	};
}

const getKantorAsal = (description) => {
	const parsing = description.split(';');
	const office = parsing[2];
	const officeValue = office.split(':');
	const officeResult = officeValue[1].replace(/[0-9]/g, '');
	return capitalize(officeResult);
}


const ListTrace = ({ listdata }) => {
	let lastDate = '';
	return(
		<React.Fragment>
			{ listdata.length > 0 && <View style={styles.box}>
				<View style={{margin: 5}}>
					{ listdata.map((x, i) => {
						let date = x.eventDate.substr(0, 10);
						let time = x.eventDate.substr(11, 5);
						if (lastDate !== date) {
							lastDate = date;
						}else{
							lastDate = '-';
						}

						return(
							<React.Fragment key={i}>
								<View style={{flexDirection: 'row'}}>
									{ lastDate === date && <React.Fragment>
											<Text style={styles.labelDate}>{date}</Text>
											<View style={styles.circle}>
												<View style={styles.circleAktif} />
											</View>
										</React.Fragment> }
								</View>
								<View style={styles.borderVertical}>
									<View style={{flexDirection: 'row', marginBottom: 8, marginTop: 8, flex: 1}}>
										<View style={{alignItems: 'flex-start'}}>
											<Text style={styles.labelTime}>{time}</Text>
										</View>
										<View style={{alignItems: 'flex-end'}}>
											<View style={{ 
												width: 10, 
												height: 10,
												borderRadius: 10/2, 
												backgroundColor: 'green', 
												marginLeft: 8,
												marginTop: 4,
												marginLeft: -6
											}} />
										</View>
										<View style={{flex: 1}}>
											<Text style={styles.description}>
												{ x.eventName === 'MANIFEST SERAH' && 'Diteruskan ke kantor' + getOfficeTujuan(x.description)}
												{ x.eventName === 'SELESAI ANTAR' && 'Selesai antar di ' + capitalize(x.officeName) + 
												' Status (' + getStatusAntar(x.description) + ') diterima oleh ' + getPenerima(x.description)}
												{ x.eventName === 'PROSES ANTAR' && 'Proses antar di ' + capitalize(x.officeName) }
												{ x.eventName === 'POSTING LOKET' && 'Posting Loket ('+ capitalize(x.officeName) + ')\nLayanan : ' + getLayanan(x.description).layanan + 
												 	'\nPengirim :' + getLayanan(x.description).pengirim }
												{ x.eventName === 'MANIFEST TERIMA' && 'Diterima di kantor ' + capitalize(x.officeName) 
													+ ' dari kantor' + getKantorAsal(x.description) }
											</Text>
										</View>
									</View>
								</View>
							</React.Fragment>
						)
					} )}
				</View> 
			</View>}
		</React.Fragment>
	);
}

class LacakBarcode extends React.Component{
	static navigationOptions = ({ navigation }) => ({
	    headerTitle: <Judul navigation={navigation} />
	});

	//sort list array 
	//by event date desc
	dynamicSort = (property) => {
	    var sortOrder = 1;
	    if(property[0] === "-") {
	        sortOrder = -1;
	        property = property.substr(1);
	    }

	    return function (a,b) {
	        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
	        return result * sortOrder;
	    }
	}

	render(){
		const { listKiriman } = this.props;
		const sorted = listKiriman ? listKiriman.sort(this.dynamicSort("-eventDate")) : [];
		return(
			<ScrollView>
				<View style={styles.containerTime}>
			       { listKiriman ? <ListTrace listdata={sorted} /> : <Text>No result found</Text> }
			    </View>
		    </ScrollView>
		);
	}
}

function mapStateToProps(state, nextProps) {
	const { externalId } = nextProps.navigation.state.params;
	return{
		listKiriman: state.search.trace[externalId]
	}
}

export default connect(mapStateToProps, null)(LacakBarcode);