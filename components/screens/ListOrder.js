import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Platform , ScrollView} from "react-native";
import { connect } from "react-redux";
import { ListItem, Button, Icon } from '@ui-kitten/components';
import api from "../api";
import { getOrder } from "../../actions/order";
import Barcode from 'react-native-barcode-builder';

const Judul = ({ navigation }) => {
	const { params } = navigation.state;
	return(
		<View>
			<Text style={styles.judul}>Daftar Order</Text>
			<Text style={{fontFamily: 'open-sans-reg'}}>{params && navigation.state.params.tanggalSearch}</Text>
		</View>
	);
}




const renderItemAccessory = (style, detail, showDetail, visible, id) => (
	<TouchableOpacity
		onPress={() => showDetail(detail)}
	>
		<Icon name={ visible && detail.id_external === id ? 'arrow-ios-downward-outline' : 'arrow-ios-forward-outline'} width={25} height={25} fill='#3366FF' />
	</TouchableOpacity>
)

const List = ({ listdata, tanggal, showDetail, visible, detailProps }) => {
	//only show with status 1 or null
	const filterList = listdata.recordnya.filter(x => x.status_kiriman !== '2');
	// console.log(detailProps.id_external);
	 return(
	    	<React.Fragment>
	    		{ filterList.map((x, i) => {
	    			let detail = {
	    				alamatpenerima: x.alamatpenerima,
	    				isikiriman: x.isikiriman,
	    				kotapenerima: x.kotapenerima,
	    				nmpenerima: x.nmpenerima,
	    				status_kiriman: x.status_kiriman,
	    				id_external: x.id_external,
	    				nmpengirim: x.nmpengirim,
	    				wkt_posting: x.wkt_posting
	    			};
	    			return(
	    				<React.Fragment key={i}>
		    				<ListItem
						      title={x.id_external}
						      description={x.isikiriman}
						      titleStyle={styles.listItemTitle}
						      descriptionStyle={styles.listItemDescription}
						      accessory={(e) => renderItemAccessory(e, detail, showDetail, visible, detailProps.id_external)}
						      onPress={() => showDetail(detail)}
						    />
						    { visible && <React.Fragment>
						    	{ x.id_external === detailProps.id_external && 
						    		<View style={{ paddingBottom: 5 }}>
						    			<View style={{paddingBottom: 5 }}>
						    				<Barcode value={detailProps.id_external} format="CODE128" height={50} />
						    				<Text style={{textAlign: 'center', marginTop: -10, color: '#83857e'}}>{detailProps.id_external}</Text>
					    				</View>
					    				<View style={{ marginLeft: 15 }}>
							    			<View style={{ paddingBottom: 5 }}>
								    			<Text style={{fontFamily: 'open-sans-reg'}}>Nama Penerima</Text>
								    			<Text style={{fontFamily: 'open-sans-reg', color: '#83857e'}}>{detailProps.nmpenerima}</Text>
							    			</View>
							    			<View style={{ paddingBottom: 5 }}>
								    			<Text style={{fontFamily: 'open-sans-reg'}}>Alamat Penerima</Text>
								    			<Text style={{fontFamily: 'open-sans-reg', color: '#83857e'}}>{detailProps.alamatpenerima}</Text>
							    			</View>
							    			<View style={{ paddingBottom: 5 }}>
								    			<Text style={{fontFamily: 'open-sans-reg'}}>Kota Penerima</Text>
								    			<Text style={{fontFamily: 'open-sans-reg', color: '#83857e'}}>{detailProps.kotapenerima}</Text>
							    			</View>
							    			<View style={{ paddingBottom: 5 }}>
								    			<Text style={{fontFamily: 'open-sans-reg'}}>Waktu</Text>
								    			<Text style={{fontFamily: 'open-sans-reg', color: '#83857e'}}>{detailProps.wkt_posting.substring(11, 16)}</Text>
							    			</View>
							    			<View style={{ paddingBottom: 5 }}>
								    			<Text style={{fontFamily: 'open-sans-reg'}}>Status Kiriman</Text>
								    			<Text style={{fontFamily: 'open-sans-reg', color: '#83857e'}}>{detailProps.status_kiriman}</Text>
							    			</View>
						    			</View>
						    		</View> }
						    </React.Fragment> }
						    <View style={{borderBottomWidth: 1, borderBottomColor: '#cbccc4'}}/>
					    </React.Fragment>
	    			)
	    		}) }
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
		visible: false,
		dataDetail: {},
		scrollOffset: null
	}

	onShowDetail = (e) => {
		this.setState({ visible: !this.state.visible, dataDetail: e });
	}

	render(){
		const { tanggalSearch } = this.props.navigation.state.params;
		const { orderlist } = this.props;
		const { dataDetail } = this.state;

		return(
			<ScrollView>
				<View style={styles.container}>
					{ orderlist ? <React.Fragment>
							<List 
								listdata={orderlist} 
								tanggal={tanggalSearch} 
								showDetail={(e) => this.onShowDetail(e)}
								visible={this.state.visible}
								detailProps={this.state.dataDetail}
							/>
						</React.Fragment> : <Text style={{marginTop: 20, textAlign: 'center'}}>Data Tidak Ditemukan</Text>}
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