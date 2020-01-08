import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Platform } from "react-native";
import { connect } from "react-redux";
import { ListItem, Button, Icon } from '@ui-kitten/components';
import api from "../api";
import { getOrder } from "../../actions/order";
import Modal from "react-native-modal";

const Judul = ({ navigation }) => {
	const { params } = navigation.state;
	return(
		<View>
			<Text style={styles.judul}>Daftar Order</Text>
			<Text style={{fontFamily: 'open-sans-reg'}}>{params && navigation.state.params.tanggalSearch}</Text>
		</View>
	);
}




const renderItemAccessory = (style, detail, openModal) => (
	<TouchableOpacity
		onPress={() => openModal(detail)}
	>
		<Icon name='eye' width={25} height={25} fill='#3366FF' />
	</TouchableOpacity>
)

const List = ({ listdata, tanggal, openModal }) => {
	 return(
	    	<React.Fragment>
	    		{ listdata.recordnya.map((x, i) => {
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
	    				<ListItem
					      title={x.id_external}
					      key={i}
					      style={styles.listItem}
					      description={`(${x.isikiriman}) Ke ${x.nmpenerima} pada jam ${x.wkt_posting.substring(11, 16)}`}
					      titleStyle={styles.listItemTitle}
					      descriptionStyle={styles.listItemDescription}
					      accessory={(e) => renderItemAccessory(e, detail, openModal)}
					    />
	    			)
	    		})}
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

	state = {
		visible: false,
		dataDetail: {}
	}

	toggleModal = () => {
		this.setState({ visible: !this.state.visible });
	}

	render(){
		const { orderlist, tanggalProps } = this.props;
		const { dataDetail } = this.state;

		return(
			<View style={styles.container}>
				{Object.keys(orderlist).length > 0 && <React.Fragment>
						{ tanggalProps && <List 
							listdata={orderlist[tanggalProps]} 
							tanggal={tanggalProps} 
							openModal={(e) => this.setState({ dataDetail: e, visible: true })}
						/> }
					</React.Fragment> }
			        <Modal 
			        	style={{margin: 50}}
			        	isVisible={this.state.visible}
			        	onSwipeComplete={() => this.setState({ visible: false })}
			        	swipeDirection="left"
			        	animationIn="slideInLeft"
			        	animationInTiming={500}
			        	backdropTransitionInTiming={800}
			        >
			          <View style={styles.contentModal}>
			          	<View style={{margin: 20}}>
			          		<View style={styles.listModal}>
				            	<Text style={styles.titleDetail}>Isi Kiriman</Text>
				            	<Text style={styles.subtitle}>{dataDetail.isikiriman}</Text>
				            </View>
				            <View style={styles.listModal}>
				            	<Text style={styles.titleDetail}>Alamat Penerima</Text>
				            	<Text style={styles.subtitle}>{dataDetail.alamatpenerima}</Text>
				            </View>
				            <View style={styles.listModal}>
				            	<Text style={styles.titleDetail}>Kota Penerima</Text>
					            <Text style={styles.subtitle}>{dataDetail.kotapenerima}</Text>
					        </View>
					        <View style={styles.listModal}>
					        	<Text style={styles.titleDetail}>Nama Penerima</Text>
					         	<Text style={styles.subtitle}>{dataDetail.nmpenerima}</Text>
					        </View>
					        <View style={styles.listModal}>
					        	<Text style={styles.titleDetail}>Status</Text>
				            	<Text style={styles.subtitle}>{dataDetail.status_kiriman}</Text>
				            </View>
				            <View style={styles.listModal}>
				            	<Text style={styles.titleDetail}>Waktu Posting</Text>
				            	<Text style={styles.subtitle}>{dataDetail.wkt_posting}</Text>
				            </View>
			            </View>
			            <View style={{padding: 50}}>
				        	<Button onPress={this.toggleModal}>Tutup</Button>
				        </View>
			          </View>
			        </Modal>
			</View>
		);
	}
}

function mapStateToProps(state) {
	return{
		orderlist: state.order.dataOrder,
		tanggalProps: state.order.searchParam
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