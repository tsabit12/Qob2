import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;
	
const styles = StyleSheet.create({
	point: {
		backgroundColor: 'red', 
		height: deviceHeight / 30,
		width: deviceWidth / 15,
		marginBottom: 20,
		marginTop: 20,
		marginLeft: -15,
		borderRadius: 15,
		borderWidth: 9
	},
	progress: {
		borderLeftWidth: 2,
		justifyContent: 'center',
		margin: 10
	}
});

const  ModalContentHistory = props => {
	const { data, allOrder } = props;
	const extId = data[0].extid;
	const detailOrder = allOrder.find(x => x.extid === extId);
	
	return(
		<View style={{margin: 20 }}>
			<View style={{marginTop: 10, marginBottom: 10}}>
				<Text>External ID : {extId}</Text>
				<Text>Isi Kiriman : {detailOrder.desctrans}</Text>
			</View>
			<View style={styles.progress}>
				{ data.map((x, i) => <View style={{flexDirection: 'row'}} key={i}>
					<View style={styles.point} />
					<View style={{justifyContent: 'flex-end', margin: 8, marginTop: 15}}>
						<Text>Status ({x.status})</Text>
						<Text>Waktu Update ({x.insertdate})</Text>
						<Text>Driver Name ({x.driver ? x.driver : '-'})</Text>
						<Text>Driver Phone ({x.driverphone ? x.driverphone : '-'})</Text>
					</View>
				</View> )}			
			</View>
		</View>
	);
}

export default ModalContentHistory;