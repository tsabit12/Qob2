import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Icon, TopNavigation, TopNavigationAction, Spinner, ListItem } from '@ui-kitten/components';
import styles from "./styles";
import apiWs from "../../apiWs";

const BackIcon = (style) => (
	<View style={{marginTop: 7}}>
  		<Icon {...style} name='arrow-back' fill='#FFF'/>
  	</View>
);

const capitalize = (string) => {
	return string.toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ');
}


const LoadingView = () => (
	<View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
		<Spinner size='medium' />
		<Text>Memuat...</Text>
	</View>
);

const EmptyOrError = ({ message }) => (
	<View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
		<Text>{message}</Text>
	</View>
);

const renderAccessory = (style, onShow, data, visible) => {
	return(
		<TouchableOpacity 
			style={{backgroundColor: '#f08400', borderRadius: 18, height: 35, justifyContent: 'center', alignItems: 'center', elevation: 2}}
			onPress={() => onShow(data.externalId)}
		>
			<Icon 
				{ ...style}
				name={visible[data.externalId] ? 'arrow-ios-downward-outline' : 'arrow-ios-forward-outline' } 
				width={20} 
				height={20} 
				fill='#FFF' 
			/>
		</TouchableOpacity>
	)
}

const DetailView = ({ dataDetail, onShow, visible }) => (
	<View style={{flex: 1}}>
		{ dataDetail.length > 0 && <React.Fragment>
			{ dataDetail.map((x, i) => 
				<React.Fragment key={i}>
					<ListItem
				      title={x.externalId}
				      description={x.contentDesc}
				      accessory={(e) => renderAccessory(e, onShow, x, visible)}
				      descriptionStyle={styles.titleList}
				      titleStyle={styles.titleList}
				    />
				    { visible[x.externalId] && <View style={{marginLeft: 15, paddingBottom: 10}}>
				    		<View>
				    			<Text style={styles.detailTitle}>Nama Pengirim</Text>
				    			<Text style={styles.subTitleText}>{capitalize(x.senderName)}</Text>
				    		</View>
				    		<View>
				    			<Text style={styles.detailTitle}>Alamat Pengirim</Text>
				    			<Text style={styles.subTitleText}>{capitalize(x.senderAddr)}, {x.senderVill}, {x.senderSubDist}, {x.senderCity}, {x.senderProv} ({x.senderPosCode})</Text>
				    		</View>
				    		<View>
				    			<Text style={styles.detailTitle}>Nama Penerima</Text>
				    			<Text style={styles.subTitleText}>{x.receiverName}</Text>
				    		</View>
				    		<View>
				    			<Text style={styles.detailTitle}>Alamat Penerima</Text>
				    			<Text style={styles.subTitleText}>{x.receiverAddr}, {x.receiverVill}, {x.receiverSubDist}, {x.receiverCity}, {x.receiverProv} ({x.receiverPosCode})</Text>
				    		</View>
				    		<View>
				    			<Text style={styles.detailTitle}>Berat</Text>
				    			<Text style={styles.subTitleText}>{x.weight} gram</Text>
				    		</View>
				    		<View>
				    			<Text style={styles.detailTitle}>Diametrik</Text>
				    			<Text style={styles.subTitleText}>P = {x.panjang}, L = {x.lebar}, T = {x.tinggi} </Text>
				    		</View>
				    		<View>
				    			<Text style={styles.detailTitle}>Waktu Order</Text>
				    			<Text style={styles.subTitleText}>{x.orderDate.substring(0, 10)}{x.orderDate.substring(10, 16)}</Text>
				    		</View>
				    	</View> }
				    <View style={{borderBottomWidth: 0.5, borderBottomColor: '#cbccc4'}}/>
			    </React.Fragment> )}
		</React.Fragment>}
	</View>
);

class DetailPickup extends React.Component{
	state = {
		isLoading: true,
		data: {},
		errors: {},
		detailVisible: {}
	}

	componentDidMount(){
		const { pickupNumber } = this.props.navigation.state.params;
		apiWs.fetch.getDetailPickup(pickupNumber)
			.then(res => {
				this.setState({
					data: res,
					isLoading: false
				})
			})
			.catch(err => {
				console.log(err);
				if (err.response.data.errors) {
					this.setState({ isLoading: false, errors: err.response.data.errors });
				}else{
					this.setState({ isLoading: false, errors: {global: 'Whooppps, terdapat keslahan'} });
				}
			})
	}

	BackAction = () => (
  		<TopNavigationAction icon={BackIcon} onPress={() => this.props.navigation.goBack()}/>
	)

	onShowDetail = (externalId) => {

		this.setState({
			detailVisible: {
				...this.state.detailVisible,
				[externalId]: !this.state.detailVisible[externalId]
			}
		})
	}

	render(){
		const { isLoading, errors } = this.state;

		return(
			<View style={{flex: 1}}>
				<TopNavigation
				    leftControl={this.BackAction()}
				    title='Detail Pickup'
				    subtitle={this.props.navigation.state.params.pickupNumber}
				    titleStyle={{fontFamily: 'open-sans-bold', color: '#FFF', marginTop: 5}}
				    style={styles.navigationStyle}
				    subtitleStyle={{color: '#FFF'}}
				/>
				
				{ isLoading ? <LoadingView /> : 
					<ScrollView>
						{ errors.global ? 
							<EmptyOrError message={errors.global} /> : 
							<ScrollView>
								<DetailView 
									dataDetail={this.state.data} 
									onShow={this.onShowDetail}
									visible={this.state.detailVisible}
								/>
							</ScrollView> }
					</ScrollView>}
			</View>
		);
	}
}

export default DetailPickup;