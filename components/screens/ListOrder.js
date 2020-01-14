import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Platform , ScrollView} from "react-native";
import { connect } from "react-redux";
import { ListItem, Button, Icon, Toggle } from '@ui-kitten/components';
import api from "../api";
import { getOrder } from "../../actions/order";
import Barcode from 'react-native-barcode-builder';

const Judul = ({ navigation }) => {
	const { params } = navigation.state;
	return(
		<View>
			<Text style={styles.judul}>Riwayat Order</Text>
			<Text style={{fontFamily: 'open-sans-reg'}}>{params && navigation.state.params.tanggalSearch}</Text>
		</View>
	);
}

const capitalize = (string) => {
	return string.toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ');
}


const renderItemAccessory = (style, detail, showDetail, visible) => {
	return(
		<TouchableOpacity
			onPress={() => showDetail(detail)}
		>
			<Icon 
				name={ 
					visible[detail.id_external] ? 
						'arrow-ios-downward-outline' : 'arrow-ios-forward-outline' 
				} 
				width={25} 
				height={25} 
				fill='#3366FF' 
			/>
		</TouchableOpacity>
	)
}

const DetailView = ({ listDetail }) => (
	<View style={{ paddingBottom: 5 }}>
		<View style={{paddingBottom: 5 }}>
			<Barcode value={listDetail.id_external} format="CODE128" height={50} />
			<Text style={{textAlign: 'center', marginTop: -10, color: '#83857e'}}>
				{listDetail.id_external}
			</Text>
		</View>
		<View style={{ marginLeft: 15 }}>
			<View style={{ paddingBottom: 5 }}>
    			<Text style={{fontFamily: 'open-sans-reg'}}>Penerima</Text>
    			<Text style={{fontFamily: 'open-sans-reg', color: '#83857e'}}>
    				{listDetail.nmpenerima}
    			</Text>
			</View>
			<View style={{ paddingBottom: 5 }}>
    			<Text style={{fontFamily: 'open-sans-reg'}}>Alamat Penerima</Text>
    			<Text style={{fontFamily: 'open-sans-reg', color: '#83857e'}}>
    				{listDetail.alamatpenerima}, {listDetail.kotapenerima}
    			</Text>
			</View>
			<View style={{ paddingBottom: 5 }}>
    			<Text style={{fontFamily: 'open-sans-reg'}}>Pengirim</Text>
    			<Text style={{fontFamily: 'open-sans-reg', color: '#83857e'}}>
    				{capitalize(listDetail.nmpengirim)}
    			</Text>
			</View>
			<View style={{ paddingBottom: 5 }}>
    			<Text style={{fontFamily: 'open-sans-reg'}}>Alamat Pengirim</Text>
    			<Text style={{fontFamily: 'open-sans-reg', color: '#83857e'}}>
    				{capitalize(listDetail.alamatpengirim)}, {capitalize(listDetail.kotapengirim)}
    			</Text>
			</View>
			<View style={{ paddingBottom: 5 }}>
    			<Text style={{fontFamily: 'open-sans-reg'}}>Waktu</Text>
    			<Text style={{fontFamily: 'open-sans-reg', color: '#83857e'}}>
    				{listDetail.wkt_posting.substring(11, 16)}
    			</Text>
			</View>
			<View style={{ paddingBottom: 5 }}>
    			<Text style={{fontFamily: 'open-sans-reg'}}>Status Kiriman</Text>
    			<Text style={{fontFamily: 'open-sans-reg', color: '#83857e'}}>
    				{ listDetail.status_kiriman === '1' && 'Kolekting' }
    				{ listDetail.status_kiriman === null && 'Order' }
    				{ listDetail.status_kiriman === '2' && 'Selesai Transaksi' }
    			</Text>
			</View>
		</View>
	</View>
)

const List = ({ listdata, tanggal, showDetail, visible, detailProps, checked }) => {
	//only show with status 1 or null
	const filterList = !checked ? listdata.recordnya.filter(x => x.status_kiriman !== '2') : listdata.recordnya.filter(x => x.status_kiriman === '2');
	// console.log(detailProps.id_external);
	 return(
	    	<React.Fragment>
	    		{ filterList.length > 0 ? <React.Fragment>
	    			{ filterList.map((x, i) => {
		    			let detail = {
		    				alamatpenerima: x.alamatpenerima,
		    				isikiriman: x.isikiriman,
		    				kotapenerima: x.kotapenerima,
		    				nmpenerima: x.nmpenerima,
		    				status_kiriman: x.status_kiriman,
		    				id_external: x.id_external,
		    				nmpengirim: x.nmpengirim,
		    				wkt_posting: x.wkt_posting,
		    				kotapengirim: x.kotapengirim,
		    				nmpengirim: x.nmpengirim,
		    				alamatpengirim: x.alamatpengirim
		    			};
		    			return(
		    				<React.Fragment key={i}>
			    				<ListItem
							      title={x.id_external}
							      description={x.isikiriman}
							      titleStyle={styles.listItemTitle}
							      descriptionStyle={styles.listItemDescription}
							      accessory={(e) => renderItemAccessory(e, detail, showDetail, visible)}
							      onPress={() => showDetail(detail)}
							    />
							    { visible[x.id_external] && <React.Fragment>
							    	{ x.id_external === detailProps[x.id_external].id_external &&  <DetailView listDetail={detailProps[x.id_external]} />}
							    </React.Fragment> }
							    <View style={{borderBottomWidth: 1, borderBottomColor: '#cbccc4'}}/>
						    </React.Fragment>
		    			)
		    		}) }
	    		</React.Fragment> : <Text style={{textAlign: 'center', marginTop: 15}}>No result found</Text> }
	    	</React.Fragment>
	    );
} 

const Search = ({ navigation }) => {
	return(
		<TouchableOpacity 
			style={{marginRight: 8}}
			onPress={() => navigation.navigate({ routeName: 'SearchOrder' })}
		>
	        <Icon name='search-outline' fill={Platform.OS === 'ios' ? '#FFF' : 'black'} width={25} height={25} />
	    </TouchableOpacity>
	)
}


class ListOrder extends React.Component{
	static navigationOptions = ({ navigation }) => ({
		headerTitle: <Judul navigation={navigation}/>,
		headerRight: <Search navigation={navigation} />,
	})

	scrollViewRef = React.createRef();

	state = {
		visible: {
			idorder: false
		},
		dataDetail: {
			idorder: {}
		},
		checked: false
	}

	onShowDetail = (e) => {
		// this.setState({ visible: !this.state.visible, dataDetail: e });
		this.setState({ 
			dataDetail: {
				...this.state.dataDetail,
				[e.id_external]: e 
			},
			visible: {
				...this.state.visible,
				[e.id_external]: !this.state.visible[e.id_external]
			}
		});
	}

	onCheckedChange = () => {
		this.setState({ checked: !this.state.checked })
	}

	render(){
		const { tanggalSearch } = this.props.navigation.state.params;
		const { orderlist } = this.props;
		const { dataDetail, checked } = this.state;

		return(
			<ScrollView>
				<View style={styles.container}>
					<View style={{flexDirection: 'row' }}>
						<View style={{flex: 1, alignItems: 'flex-start', marginTop: 14, marginLeft: 15 }}>
							<Text style={{fontFamily: 'open-sans-reg', fontWeight: '700'}}>
								Data order dengan status ({ checked ? 'selesai transaksi' : 'belum transaksi' })
							</Text>
						</View>
						<View style={{flex: 1, alignItems: 'flex-end', marginTop: 17, marginRight: 20 }}>
							<Toggle
						      checked={checked}
						      onChange={this.onCheckedChange}
						      status='info'
						    />
					    </View>
				    </View>
				    <View style={{borderBottomWidth: 1, borderBottomColor: '#cbccc4', marginTop: 14}}/>
					{ orderlist ? <React.Fragment>
							<List 
								listdata={orderlist} 
								tanggal={tanggalSearch} 
								showDetail={(e) => this.onShowDetail(e)}
								visible={this.state.visible}
								detailProps={this.state.dataDetail}
								checked={checked}
							/>
						</React.Fragment> : <Text style={{textAlign: 'center', marginTop: 15}}>No result found</Text>}
				</View>
			</ScrollView>
		);
	}
}

function mapStateToProps(state, nextProps) {
	const { tanggalSearch } = nextProps.navigation.state.params;
	return{
		orderlist: state.order.dataOrder[tanggalSearch]
	}
}

export default connect(mapStateToProps, { getOrder })(ListOrder);


const styles = StyleSheet.create({
	container: {
	  flex: 1,
	},
	judul: {
		fontFamily: 'open-sans-bold',
	  	fontSize: 16,
	  	fontWeight: '700'
	},
	status: {
		fontFamily: 'open-sans-bold',
		fontSize: 20,
		fontWeight: '800',
		textAlign: 'center',
		marginTop: 20
	},
	listItem: { 
		borderRadius: 1,
		borderBottomWidth: 1, 
		borderBottomColor: '#cbccc4'
	},
	listItemTitle: { color: '#3366ff', fontFamily: 'open-sans-reg' },
	listItemDescription: { 
		fontSize: 13,
		fontFamily: 'open-sans-reg'
	},
	contentModal: {		
	  backgroundColor: 'white',
	  borderColor: 'rgba(0, 0, 0, 0.1)',
	  flex: 1,
	  borderRadius: 6,
	  height: 50,
	},
	titleDetail: {
		fontFamily: 'open-sans-bold',
		color: 'black',
		fontSize: 15
	},
	subtitle: {
		fontFamily: 'open-sans-reg',
		color: '#9c9b97',
		paddingBottom: 5
	},
	listModal: {
		borderBottomWidth: 1,
		borderBottomColor: '#cbccc4',
		marginTop: 5
	}
});