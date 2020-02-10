import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Button, Modal, TouchableHighlight } from "react-native";
import styles from "./styles";
import { Icon, TopNavigation, TopNavigationAction, Spinner } from '@ui-kitten/components';
import { connect } from "react-redux";
import apiWs from "../../apiWs";
import { fetchHistoryPickup } from "../../../actions/pickup";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';

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

const MyIcon = () => (
	<Icon name='eye' fill='#FFF' height={30} width={30}/>
)

const EmptyOrErrMessage = ({ message }) => (
	<View style={{margin: 10, flex: 1}}>
		<View style={{borderWidth: 0.3, height: 50, justifyContent: 'center', alignItems: 'center'}}>
			<Text>{message}</Text>
		</View>
	</View>
); 

const RenderCardWithStatus = ({ children, status, onPressItem }) => (
	<React.Fragment>
	  { status === '2' && <View style={styles.cardSuccess}>{ children }</View> }	
	  { status === '01' && <View style={styles.cardBidding}>{ children }</View> }	
	  { status === '14' && <View style={styles.cardNotFound}>{ children }</View> }	
	  { status === '16' && <View style={styles.cardFinding}>{ children }</View> }	
	  { status === '17' && <View style={styles.cardWasDriver}>{ children }</View> }	
	  { status === '12' && <View style={styles.cardWasPay}>{ children }</View> }	
	  { status === '15' && <View style={styles.card15}>{ children }</View> }	
	</React.Fragment>
);

const RenderOptionsMenu = ({ status, openDetail }) => (
	<Menu>
		<MenuTrigger>
			<Icon style={{marginRight: 10}} name='more-vertical-outline' fill='#FFF' height={25} width={25}/>
		</MenuTrigger>
		 <MenuOptions>
		 	{ status === '14' ? <React.Fragment>
		 		<MenuOption onSelect={() => openDetail()}>
		        	<View style={{paddingLeft: 10, paddingBottom: 6, paddingTop: 6}}>
		          		<Text>Lihat Detail</Text>
		          	</View>
		        </MenuOption>
		        <MenuOption onSelect={() => alert(`Next features`)} >
		        	<View style={{paddingLeft: 10, paddingBottom: 6, paddingTop: 6}}>
		          		<Text>Cari driver</Text>
		          	</View>
		        </MenuOption>
		 	</React.Fragment> :  <MenuOption onSelect={() => openDetail()}>
		        	<View style={{paddingLeft: 10, paddingBottom: 6, paddingTop: 6}}>
		          		<Text>Lihat Detail</Text>
		          	</View>
		        </MenuOption> }
	    </MenuOptions>
	</Menu>
);

const IconMaps = ({ goToMaps }) => (
	<TouchableOpacity
		onPress={() => goToMaps()}
	>
		<Icon style={{marginRight: 10}} name='paper-plane' fill='#FFF' height={25} width={25}/>
	</TouchableOpacity>
);

const RenderList = ({ list, onPressItem, onGoToMaps, onOpenDetail, onSeeStatus }) => {
	var no = 1;
	return(
		<View style={styles.onProgress}>
			<View style={styles.titleCard}>
				<View style={{flexDirection: 'row', flex: 1}}>
					<View style={styles.statusView} />
					<Text style={styles.labelStatus}>Binding</Text>
				</View>
				<View style={{flexDirection: 'row', flex: 1, marginTop: 3}}>
					<View style={styles.sudahTrans} />
					<Text style={styles.labelStatus}>Sudah transaksi</Text>
				</View>
				<View style={{flexDirection: 'row', flex: 1, marginTop: 3}}>
					<View style={styles.driverNotFound} />
					<Text style={styles.labelStatus}>Driver tidak ditemukan</Text>
					<View style={{alignItems: 'flex-end', flex:1, marginTop: -3 }}>
						<TouchableOpacity style={{borderRadius: 5}} onPress={() => onSeeStatus()}>
							<Text style={{fontSize: 13, color: '#0000FF', opacity: 0.7}}>View all status</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
			<View style={{padding: 5}}>
				{list.map((x, i) => 
					<RenderCardWithStatus
						key={i}
						status={x.status}
						onPressItem={() => onPressItem(x.pickup_number, x.shipper_latlong, x.faster_latlong, x.fastername)}
					>
						<View style={styles.listItem}>
							<View style={styles.numberBorder}>
								<Text style={styles.number}>{no++}</Text>
							</View>
							<View style={styles.textView}>
								<Text style={styles.subTitle}>{x.pickup_number}</Text>
								<Text style={styles.subTitle}>Total ({x.jumlahOrder} item)</Text>
							</View>
							<View style={styles.rightIcon}>
								{ x.status === '17' ? 
									<IconMaps 
										goToMaps={() => onGoToMaps(x.pickup_number)}
									/> :  <RenderOptionsMenu 
												status={x.status} 
												openDetail={() => onOpenDetail(x.pickup_number)}
										/> } 
							</View>
						</View>
					</RenderCardWithStatus>
				)}
			</View>
		</View>
	);
}


class Index extends React.Component{
	state = {
		errors: {},
		isLoading: true,
		visible: false
	}

	componentDidMount(){
		const { userid } = this.props;
		this.props.fetchHistoryPickup(userid)
			.catch(err => {
				console.log(err.response);
				this.setState({ 
					errors: {
						global: 'Data tidak ditemukan'
					}, 
					isLoading: false
				})
			});
	}

	// componentDidUpdate(){
	// 	apiWs.
	// }

	BackAction = () => (
  		<TopNavigationAction icon={BackIcon} onPress={() => this.props.navigation.goBack()}/>
	)

	goToDetail = (pickupNumber) => {
		this.props.navigation.navigate({
			routeName: 'DetailPickup',
			params: {
				pickupNumber
			}
		})
	}

	searchLocation = (pickupNumber) => {
		this.props.navigation.navigate({
			routeName: 'Maps',
			params: {
				pickupNumber
			}
		})
	}

	showAllStatus = () => this.setState({ visible: true })

	render(){
		const { listPickup } = this.props;
		const { errors, visible } = this.state;
		return(
			<View style={{flex: 1}}>
				<TopNavigation
				    leftControl={this.BackAction()}
				    title='Riwayat Pickup'
				    titleStyle={{fontFamily: 'open-sans-bold', color: '#FFF', marginTop: 5}}
				    style={styles.navigationStyle}
				/>
				{ errors.global ? <EmptyOrErrMessage message={errors.global} /> :
					<React.Fragment>
						{ listPickup.length > 0 ? 
							<ScrollView keyboardShouldPersistTaps='always'>
								<RenderList 
									list={listPickup} 
									onPressItem={this.handelClickList}
									onGoToMaps={this.searchLocation}
									onOpenDetail={this.goToDetail}
									onSeeStatus={this.showAllStatus}
								/> 
							</ScrollView>: <Loading /> }
					</React.Fragment> }
					<Modal
			          animationType="slide"
			          transparent={true}
			          style={{margin: 0}}
			          visible={visible}
			          onRequestClose={() => {
			            alert('Modal has been closed.');
			          }}>
			          	<View 
			          		style={{
					          flex: 1,
					          justifyContent: 'center',
					          alignItems: 'center'
					      	}}>
					    <View style={styles.modalContent}>
					    	<View style={{padding: 20, flex: 1}}>
					    		<View style={{borderBottomWidth: 0.7, marginBottom: 6, padding: 5}}>
					    			<Text style={{textAlign: 'center', fontSize: 17, fontFamily: 'open-sans-bold'}}>Daftar Status</Text>
					    		</View>
					    		<View style={{flexDirection: 'row', paddingBottom: 5}}>
									<View style={styles.statusView} />
									<Text style={styles.labelStatus}>Binding</Text>
								</View>
								<View style={{flexDirection: 'row', paddingBottom: 5}}>
									<View style={styles.finding} />
									<Text style={styles.labelStatus}>Pencarian Driver</Text>
								</View>
								<View style={{flexDirection: 'row', paddingBottom: 5}}>
									<View style={styles.driverFound} />
									<Text style={styles.labelStatus}>Driver ditemukan</Text>
								</View>
								<View style={{flexDirection: 'row', paddingBottom: 5}}>
									<View style={styles.driverNotFound} />
									<Text style={styles.labelStatus}>Driver tidak ditemukan</Text>
								</View>
								<View style={{flexDirection: 'row', paddingBottom: 5}}>
									<View style={styles.wasPay} />
									<Text style={styles.labelStatus}>Paket sudah dibayar</Text>
								</View>
								<View style={{flexDirection: 'row', paddingBottom: 5}}>
									<View style={styles.inHub} />
									<Text style={styles.labelStatus}>Paket dibawa kurir dan Proses pergantian Hub</Text>
								</View>
								<View style={{flexDirection: 'row', paddingBottom: 5}}>
									<View style={styles.sudahTrans} />
									<Text style={styles.labelStatus}>Paket sudah di transaksikan</Text>
								</View>
					    	</View>
						    <TouchableHighlight
						    	style={styles.buttonCloseModal}
				                onPress={() => {
				                  this.setState({ visible: false });
				                }}>
				                <Text style={{textAlign: 'center', fontSize: 16, fontFamily: 'open-sans-reg', color: '#FFF'}}>
				                	Tutup
				                </Text>
			              	</TouchableHighlight>
					    </View>
					  </View>
			        </Modal>
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