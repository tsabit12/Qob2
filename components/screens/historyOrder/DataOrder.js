import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from "react-native";
import { ListItem, Icon } from '@ui-kitten/components';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import Modal from 'react-native-modal';

const capitalize = (string) => {
	if (string) {
		return string.toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ');
	}else{
		return '-';
	}
}

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;
	
const numberWithCommas = (number) => {
	//not number
	if (isNaN(number)) {
		return number;
	}else{
		return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
	}
}

const renderItemAccessory = (style, status, extid, openDetail, cekStatus, cekDriver) => {
	return(
		<React.Fragment>
			<Menu>
				<MenuTrigger>
					<Icon {...style} name='more-vertical-outline' width={23} height={23} fill='#3366ff' />
				</MenuTrigger>
				<MenuOptions>
					<MenuOption onSelect={() => openDetail(extid)}>
			        	<View style={{paddingLeft: 10, paddingBottom: 6, paddingTop: 6}}>
			          		<Text>Lihat Detail</Text>
			          	</View>
					</MenuOption>
					<MenuOption onSelect={() => cekStatus(extid)}>
			        	<View style={{paddingLeft: 10, paddingBottom: 6, paddingTop: 6}}>
			          		<Text>Cek Riwayat Status</Text>
			          	</View>
			        </MenuOption>
			        <MenuOption onSelect={() => cekDriver(extid)}>
			        	<View style={{paddingLeft: 10, paddingBottom: 6, paddingTop: 6}}>
			          		<Text>Tracking Pickup</Text>
			          	</View>
			        </MenuOption>
				</MenuOptions>
			</Menu>
		</React.Fragment>
	)
} 

const RenderModalContent = ({ data }) => (
	<View style={{margin: 15}}>
      	<View style={styles.list}>
	      	<Text style={styles.judul}>External ID</Text>
	      	<Text style={styles.subjudul}>{data.extid}</Text>
      	</View>
      	<View style={styles.list}>
	      	<Text style={styles.judul}>Nama Pengirim</Text>
	      	<Text style={styles.subjudul}>{capitalize(data.shippername)}</Text>
      	</View>
      	<View style={styles.list}>
	      	<Text style={styles.judul}>Nama Penerima</Text>
	      	<Text style={styles.subjudul}>{capitalize(data.receivername)}</Text>
      	</View>
      	<View style={styles.list}>
	      	<Text style={styles.judul}>Alamat Pengirim</Text>
	      	<Text style={styles.subjudul}>{capitalize(data.shipperfulladdress)}</Text>
      	</View>
      	<View style={styles.list}>
	      	<Text style={styles.judul}>Alamat Penerima</Text>
	      	<Text style={styles.subjudul}>{capitalize(data.receiverfulladdress)}</Text>
      	</View>
      	<View style={styles.list}>
	      	<Text style={styles.judul}>Nama Produk</Text>
	      	<Text style={styles.subjudul}>{capitalize(data.productname)}</Text>
      	</View>
      	<View style={styles.list}>
	      	<Text style={styles.judul}>Isi Kiriman</Text>
	      	<Text style={styles.subjudul}>{capitalize(data.desctrans)}</Text>
      	</View>
      	<View style={styles.list}>
	      	<Text style={styles.judul}>Nilai Barang</Text>
	      	<Text style={styles.subjudul}>{numberWithCommas(data.valuegoods)}</Text>
      	</View>
      	<View style={styles.list}>
	      	<Text style={styles.judul}>Riwayat Status Terakhir</Text>
	      	<Text style={styles.subjudul}>{data.lasthistorystatus ? data.lasthistorystatus : '-'}</Text>
      	</View>
      	<View style={styles.lastList}>
	      	<Text style={styles.judul}>Pickup Number</Text>
	      	<Text style={styles.subjudul}>{data.pickupnumber ? data.pickupnumber : '-'}</Text>
      	</View>
    </View>
); 

const ContentHistory = ({ data, allOrder }) => {
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

const DataOrder = ({ data, email, getStatus, history, removeHistory, movToMapView }) => {
	const [isVisible, setVisible] = React.useState({});

	const onOpenDetail = (id) => {
		const newState = data.find(x => x.extid === id);
		setVisible(newState);
	}

	const onCekStatus = (id) => {
		const payload = {
			email,
			extid: id
		}
		getStatus(payload);
	} 

	const onCekDriver = (id) => {
		const detail 	= data.find(x => x.extid === id);
		const payload  = {
			pickupNumber: detail.pickupnumber ? detail.pickupnumber : '0',
			extid: id,
			productname: detail.productname,
			desctrans: detail.desctrans,
			shipperfulladdress: detail.shipperfulladdress,
			receiverfulladdress: detail.receiverfulladdress,
			shippername: detail.shippername,
			receivername: detail.receivername
		};

		movToMapView(payload);
	}

	return(
		<View style={{flex: 1}}>
			<ScrollView>
				{ data.map((x, i) => <React.Fragment key={i}>
						<ListItem 
							title={x.desctrans} 
							titleStyle={{color: '#3366ff', fontFamily: 'open-sans-reg'}}
							description={`Status : (${x.laststatus})`}
							accessory={(e) => renderItemAccessory(e, x.laststatusid, x.extid, onOpenDetail, onCekStatus, onCekDriver)}
							style={{backgroundColor: 'trans'}}
							descriptionStyle={{fontFamily: 'open-sans-reg', fontSize: 10}}
							disabled={true}
						/>
			</React.Fragment> )}
			</ScrollView>
			{/*MODAL DETAIL*/}
			<Modal isVisible={Object.keys(isVisible).length > 0 ? true : false }>
			    <View style={{ backgroundColor: '#FFF', minHeight: deviceHeight / 2, borderRadius: 10 }}>
			    	<TouchableOpacity style={styles.iconClose} onPress={() => setVisible({})}>
			    		<Icon name='close' width={25} height={25} />
			    	</TouchableOpacity>
			    	<ScrollView>
			      		<RenderModalContent data={isVisible} />
			      	</ScrollView>
			    </View>
			</Modal>
			{/*MODAL HISTORY*/}
			<Modal isVisible={history.length > 0 ? true : false }>
				<View style={{ backgroundColor: '#FFF', borderRadius: 10 }}>
					<TouchableOpacity style={styles.iconClose} onPress={() => removeHistory()}>
			    		<Icon name='close' width={25} height={25} />
			    	</TouchableOpacity>
					<ScrollView>
						{ history.length > 0 && <ContentHistory data={history} allOrder={data} /> }
			    	</ScrollView>
				</View>
			</Modal>
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
	},
	list: {
		borderBottomWidth: 0.3,
		marginBottom: 5,
		borderColor: '#bfbfbf'
	},
	lastList: {
		marginBottom: 5
	},
	judul: {
		fontSize: 16,
		color: '#696868'
	},
	subjudul: {
		fontSize: 16,
		marginTop: 4,
		marginBottom: 4,
		color: '#bfbfbf'
	},
	iconClose: {
		position: 'absolute',
		right: 0,
		margin: 6,
		width: deviceWidth / 10,
		justifyContent: 'center',
		alignItems: 'center',
		height: deviceHeight / 19,
		zIndex: 1
	},
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
})

export default DataOrder;