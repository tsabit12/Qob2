import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import styles from "./styles";
import { Icon, TopNavigation, TopNavigationAction, Spinner } from '@ui-kitten/components';
import { connect } from "react-redux";
import apiWs from "../../apiWs";
import { fetchHistoryPickup } from "../../../actions/pickup";
// import { Card, CardTitle, CardContent, CardAction, CardButton, CardImage } from 'react-native-cards';

const BackIcon = (style) => (
	<View style={{marginTop: 7}}>
  		<Icon {...style} name='arrow-back' fill='#FFF'/>
  	</View>
);

const Loading = () => (
	<View style={{alignItems: 'center', 'justifyContent': 'center', flex: 1}}>
		<Spinner size='medium' />
	</View>
);

const RenderList = ({ list, onPressItem }) => {
	var no = 1;
	return(
		<View style={styles.onProgress}>
			<View style={styles.titleCard}>
				<Text style={styles.textOnprogress}>On Progress</Text>
			</View>
			<View style={{padding: 5}}>
				{list.map((x, i) => 
					<TouchableOpacity 
						key={i} 
						style={styles.card} 
						activeOpacity={0.6}
						onPress={() => onPressItem(x.pickup_number, x.shipper_latlong, x.faster_latlong, x.fastername)}
					>
						<View style={styles.listItem}>
							<View style={styles.numberBorder}>
								<Text style={styles.number}>{no++}</Text>
							</View>
							<View style={styles.textView}>
								<Text style={styles.subTitle}>Nomor ({x.pickup_number})</Text>
								<Text style={styles.subTitle}>Total ({x.jumlahOrder} item)</Text>
								<Text style={styles.subTitle}>Waktu ({x.pickupTime.substring(0, 16)})</Text>
							</View>
							<View style={styles.rightIcon}>
								<Icon name='arrow-ios-forward-outline' width={30} height={30} fill='#FFF' />
							</View>
						</View>
					</TouchableOpacity>
				)}
			</View>
		</View>
	);
}


class Index extends React.Component{
	state = {
		errors: {}
	}

	componentDidMount(){
		const { userid } = this.props;
		this.props.fetchHistoryPickup(userid)
			.catch(err => {
				this.setState({ errors: {
					global: 'Data tidak ditemukan'
				}})
			});
	}

	BackAction = () => (
  		<TopNavigationAction icon={BackIcon} onPress={() => this.props.navigation.goBack()}/>
	)

	handelClickList = (nopickup, latlong, fasterLat, driverName) => {
		const valuesLatLong = latlong.split('|');
		const valuesLatLong2 = fasterLat.split('|');
		const payload = {
			nopickup: nopickup,
			latitude: parseFloat(valuesLatLong[0]),
			longitude: parseFloat(valuesLatLong[1]),
			latitudeFaster: parseFloat(valuesLatLong2[0]),
			longitudeFaster: parseFloat(valuesLatLong2[1]),
			driverName
		};

		this.props.navigation.navigate({
			routeName: 'Maps',
			params: payload
		})
	}

	render(){
		const { listPickup } = this.props;
		const { errors } = this.state;
		return(
			<View style={{flex: 1}}>
				<TopNavigation
				    leftControl={this.BackAction()}
				    title='Riwayat Pickup'
				    titleStyle={{fontFamily: 'open-sans-bold', color: '#FFF', marginTop: 5}}
				    style={styles.navigationStyle}
				/>
				<ScrollView keyboardShouldPersistTaps='always'>
					{ errors.global ? <EmptyOrErrMessage /> :
						<React.Fragment>
							{ listPickup.length > 0 ? 
								<RenderList 
									list={listPickup} 
									onPressItem={this.handelClickList}
								/> : <Loading /> }
						</React.Fragment> }
				</ScrollView>
			</View>
		);
	}
}

function mapStateToProps(state) {
	return{
		userid: state.auth.dataLogin.userid,
		listPickup: state.order.historyPickup
	}
}

export default connect(mapStateToProps, { fetchHistoryPickup })(Index);