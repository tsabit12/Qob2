import React from "react";
import { View, Text, StatusBar, TouchableOpacity, Alert, ScrollView } from "react-native";
import styles from "./styles";
import { Icon, Datepicker, Input, NativeDateService, ListItem } from '@ui-kitten/components';
import Loader from "../../Loader";
import { connect } from "react-redux";
import { getDetailOrder } from "../../../actions/order";

const MyStatusBar = () => (
	<View style={styles.StatusBar}>
		<StatusBar translucent barStyle="light-content" />
	</View>
);


const RenderListHistory = ({ list, onPressLink }) => {
	// const datanya = list.sort(dynamicSort("-insertdate"));
	const sorting = {}
	Object.keys(list).sort().forEach(function(key) {
	  sorting[key] = list[key];
	});

	return(
		<View style={{flex: 1}}>
			{ Object.keys(sorting).map((x, i) => 
				<ListItem
					key={i}
					title={x}
					titleStyle={{color: '#3366ff', fontSize: 14}}
					style={{borderBottomWidth: 0.3, borderColor: '#cbccc4'}}
					onPress={() => onPressLink(x)}
				/> )}
		</View>
	);
}

const RenderIcon = (style, onPressIcon) => (
	<TouchableOpacity onPress={onPressIcon}>
		<Icon {...style} name='close-outline' /> 
	</TouchableOpacity>
)

const TopNavigationSearch = ({ goBack, isSearching, setSearching, onSubmit }) => {
	const dateRef = React.useRef();
	const [dateVal, setDate] = React.useState(null);

	// const dateService = new NativeDateService('en', { format: 'YYYY/MM/DD' });

	const onSearching = () => {
		setSearching();
		setTimeout(() => dateRef.current.focus(), 100);
	}


	const onSetDate = (e) => {
		setDate(e);
		setTimeout(() => dateRef.current.blur(), 100);
	} 

	const onPress = () => {
		setSearching();
		setDate(null);
	}

	return(
		<View style={styles.navigation}>
			{!isSearching ? <View style={styles.navigationContent}>
				<TouchableOpacity style={styles.leftContent} onPress={() => goBack()}>
					<Icon name='arrow-back' fill='#FFF' width={23} height={23}/>
				</TouchableOpacity>
				<Text style={{color: '#FFF', fontFamily: 'open-sans-bold', fontSize: 15}}>Riwayat Order</Text>
				<TouchableOpacity style={styles.rightContent} onPress={onSearching}>
					<Icon name='search-outline' fill='#FFF' width={23} height={23}/>
				</TouchableOpacity>
			</View> : 
			<View style={styles.navigationContent}>
				<Datepicker
			        date={dateVal}
			        onSelect={(e) => onSetDate(e)}
			        icon={(style) => RenderIcon(style, onPress)}
			        placeholder='Pilih tanggal order'
			        ref={dateRef}
			        style={{flex: 1}}
			    />
			    { dateVal && <TouchableOpacity style={styles.searchButton} onPress={() => onSubmit(dateVal)}>
			    		<Icon name='search-outline' width={23} height={23} fill="black" />
			    	</TouchableOpacity>}
			</View> }
		</View>
	);
}

class Index extends React.Component{
	dateRef = React.createRef();
	state={
		isSearching: false,
		loading: false
	}

	onSearching = () => {
		this.setState({ isSearching: !this.state.isSearching });
	}

	onSubmit = (date) => {
		this.setState({ loading: true });

		const payload = {
			startdate: this.convertDate(date, 1),
			enddate: this.convertDate(date, 1),
			status: "0",
			extid: "",
			email: this.props.dataLogin.detail.email
		}

		this.props.getDetailOrder(payload)
			.then(() => {
				const dateReal = this.convertDate(date, 2);
				this.setState({ loading: false });
				// this.props.navigation.replace('DetailOrder', {
				// 	dateReal
				// })
				this.props.navigation.navigate({
					routeName: 'DetailOrder',
					params: {
						dateReal
					}
				})	
			})
			.catch(err => {
				console.log(err);
				this.setState({ loading: false });
				if (err.result) {
					Alert.alert(
					  'Notifikasi',
					  'Data tidak ditemukan',
					  [
					  	{
					      text: 'Tutup',
					      style: 'cancel',
					    },
					  ],
					  {cancelable: false},
					);
				}else{
					Alert.alert(
					  'Notifikasi',
					  'Terdapat kesalahan, harap cobalagi',
					  [
					  	{
					      text: 'Tutup',
					      style: 'cancel',
					    },
					  ],
					  {cancelable: false},
					);
				}
			});
	}

	convertDate = (date, jenis) => {
		var d = new Date(date),
	        month = '' + (d.getMonth() + 1),
	        day = '' + d.getDate(),
	        year = d.getFullYear();

	    if (month.length < 2) 
	        month = '0' + month;
	    if (day.length < 2) 
	        day = '0' + day;
	    if (jenis === 1) {
	    	return [year, month, day].join('-');
	    }else{
	    	return [year, month, day].join('/');
	    }
	}

	onPressHistory = (dateReal) => {
		const payload = {
			startdate: this.convertDate(dateReal, 1),
			enddate: this.convertDate(dateReal, 1),
			status: "0",
			extid: "",
			email: this.props.dataLogin.detail.email
		}

		//dont need loading
		this.props.getDetailOrder(payload);

		this.props.navigation.navigate({
			routeName: 'DetailOrder',
			params: {
				dateReal
			}
		})	
	} 

	render(){
		const { pickup } = this.props.dataorder;
		return(
			<View style={{flex: 1}}>
				<Loader loading={this.state.loading} />
				<MyStatusBar />
				<TopNavigationSearch 
					goBack={() => this.props.navigation.goBack()}
					isSearching={this.state.isSearching}
					setSearching={this.onSearching}
					onSubmit={this.onSubmit}	
				/>
				{ Object.keys(pickup).length > 0 ? <ScrollView style={{flex: 1}}>
						<RenderListHistory list={pickup} onPressLink={this.onPressHistory} />
					</ScrollView> : <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
						<Text style={{fontSize: 16, color: '#cbccc4', textAlign: 'center'}}>Riwayat pencarian tidak ditemukan. Silahkan klik tombol pencarian di pojok kanan atas</Text>
					</View> }
			</View>
		);
	}
}

function mapStateToProps(state) {
	return{
		dataLogin: state.auth.dataLogin,
		dataorder: state.order.detailOrder
	}
}

export default connect(mapStateToProps, { getDetailOrder })(Index);