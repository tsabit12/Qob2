import React from "react";
import { View, Text, StyleSheet, Alert, Dimensions, TouchableOpacity, ScrollView } from "react-native";
import { ListItem, CheckBox, Icon } from '@ui-kitten/components';
import { omit } from 'lodash';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import { Ionicons } from '@expo/vector-icons';
import Modal from 'react-native-modal';
import ModalContent from "./ModalContent";

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

const convertDate = (date) => {
	var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day 	= '0' + day;
    
    return [year, month, day].join('/');
}

const removeSpace = (text) => {
	return text.replace(/\s+/g, '').toLowerCase();
}

const styles = StyleSheet.create({
	rootEmpty: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	},
	textEmpty: {
		textAlign: 'center',
		color: "#B5B5B4"
	},
	detailTitle: {
		fontSize: 12,
		fontFamily: 'open-sans-reg',
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
})

const capitalize = (string) => {
	if (string) {
		return string.toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ');
	}else{
		return '-';
	}
}

const RenderEmpty = ({ status }) => (
	<View style={styles.rootEmpty}>
		<Text style={styles.textEmpty}>Data order dengan status ({status}) kosong</Text>
	</View>
);

const ResultOrder = props => {
	const [state, setState] = React.useState({
		checked: {},
		visible: {}
	});

	const { data, filterByStatus } = props;

	const list = [];
	if (filterByStatus.value === 0) {
		list.push(...data);
	}else{
		const filter = data.filter(x => x.laststatusid === filterByStatus.value);
		list.push(...filter);
	}


	const renderItemIcon = (index) => (
		<Text>{index+1}</Text>
	);

	const onCheckedChange = (id) => {
		const checkedId = state.checked[id] ? state.checked[id] : false;
		if (checkedId) {
			setState(prevState => ({
				...prevState,
				checked: omit(state.checked, id)
			}))
		}else{
			const firstArr = Object.keys(state.checked)[0];
			if (firstArr) {
				const firstDataChecked 	= data.find(x => x.extid === firstArr);
				const nextDataChecked 	= data.find(x => x.extid === id);
				const alamat1 	= removeSpace(firstDataChecked.shipperfulladdress);
				const alamat2 	= removeSpace(nextDataChecked.shipperfulladdress);
				if (alamat1 !== alamat2) {
					Alert.alert(
					  'Alamat pengirim tidak sama!',
					  'Dalam satu kali pickup hanya bisa dilakukan jika alamat pengirim sama. Harap pastikan kembali bahwa kodepos dan alamat pengirim sudah sama',
					  [
					    {text: 'Tutup', onPress: () => console.log('OK Pressed')},
					  ],
					  {cancelable: false},
					);
				}else{
					setState(prevState => ({
						...prevState,
						checked: {
							...prevState.checked,
							[id]: true
						}
					}))
				}
			}else{
				setState(prevState => ({
					...prevState,
					checked: {
						...prevState.checked,
						[id]: true
					}
				}))
			}
		}
	}

	const openDetail = (id) => {
		const newState = data.find(x => x.extid === id);
		setState(prevState => ({
			...prevState,
			visible: newState
		}))
	}

	const renderAccessory = (style, id, laststatus) => (
		<React.Fragment>
			{ laststatus === 1 ? <React.Fragment>
				<CheckBox
			      checked={state.checked[id]}
			      onChange={() => onCheckedChange(id)}			      
			    />
			    <Menu>
					<MenuTrigger>
						<Ionicons name="md-more" size={24} color="black" style={{marginRight: 10, marginLeft: 20}} />
					</MenuTrigger>
					<MenuOptions>
						<MenuOption>
				        	<View style={{paddingLeft: 10, paddingBottom: 6, paddingTop: 6}}>
				          		<Text>Lihat Detail</Text>
				          	</View>
						</MenuOption>
						<MenuOption>
				        	<View style={{paddingLeft: 10, paddingBottom: 6, paddingTop: 6}}>
				          		<Text>Cek Riwayat Status</Text>
				          	</View>
				        </MenuOption>
					</MenuOptions>
				</Menu> 
		    </React.Fragment> : <React.Fragment> 
		    		<Menu>
						<MenuTrigger>
							<Ionicons name="md-more" size={24} color="black" style={{marginRight: 10}} />
						</MenuTrigger>
						<MenuOptions>
							<MenuOption onSelect={() => openDetail(id)}>
					        	<View style={{paddingLeft: 10, paddingBottom: 6, paddingTop: 6}}>
					          		<Text>Lihat Detail</Text>
					          	</View>
							</MenuOption>
							<MenuOption>
					        	<View style={{paddingLeft: 10, paddingBottom: 6, paddingTop: 6}}>
					          		<Text>Cek Riwayat Status</Text>
					          	</View>
					        </MenuOption>
					        <MenuOption>
					        	<View style={{paddingLeft: 10, paddingBottom: 6, paddingTop: 6}}>
					          		<Text>Tracking Pickup</Text>
					          	</View>
					        </MenuOption>
						</MenuOptions>
					</Menu> 
			</React.Fragment> }
	    </React.Fragment>
	);

	return(
		<React.Fragment>
			{ list.length === 0 ? <RenderEmpty status={filterByStatus.text} /> : <View>
				{list.map((row, index) => <React.Fragment key={index}>
					<ListItem 
						title={row.extid} 
						disabled
						titleStyle={{color: row.va === null ? '#3366ff' : 'red', fontFamily: 'open-sans-reg'}}
						description={`${row.insertdate.substring(0, 10)} - ${row.desctrans} ${row.va !== null ? '(COD)' : '' } - ${row.laststatus}`}
						accessory={(e) => renderAccessory(e, row.extid, row.laststatusid)}
						descriptionStyle={{fontFamily: 'open-sans-reg', fontSize: 10}}
						icon={() => renderItemIcon(index)}
					/> 
			    	<View style={{borderBottomWidth: 0.5, borderBottomColor: '#cbccc4'}}/>
				</React.Fragment>)}
			</View> }

		{/*MODAL DETAIL*/}
		<Modal isVisible={Object.keys(state.visible).length > 0 ? true : false }>
		    <View style={{ backgroundColor: '#FFF', minHeight: deviceHeight / 2, borderRadius: 10 }}>
		    	<TouchableOpacity 
		    		style={styles.iconClose} 
		    		onPress={() => setState(prevState => ({ 
		    			...prevState, 
		    			visible: {}
		    		}))}
		    	>
		    		<Icon name='close' width={25} height={25} />
		    	</TouchableOpacity>
		    	<ScrollView>
		      		<ModalContent data={state.visible} />
		      	</ScrollView>
		    </View>
		</Modal>
		</React.Fragment>
	);
}

export default ResultOrder;