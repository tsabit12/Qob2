import React from "react";
import { View, Text, StatusBar, TouchableOpacity, Alert, ScrollView } from "react-native";
import styles from "./styles";
import { Icon, RangeDatepicker, Input, NativeDateService, ListItem } from '@ui-kitten/components';
import Loader from "../../Loader";
import { connect } from "react-redux";
import { getDetailOrder } from "../../../actions/order";

const MyStatusBar = () => (
	<View style={styles.StatusBar}>
		<StatusBar translucent barStyle="light-content" />
	</View>
);

const RenderListHistory = ({ list, onPressLink }) => {
	return(
		<View style={{flex: 1}}>
			{ Object.keys(list).map((x, i) => 
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

const RenderIcon = (style, range, onPressIcon) => (
	<TouchableOpacity onPress={onPressIcon}>
		{ !range.endDate || !range.startDate ?
			<Icon {...style} name='close-outline' /> : 
			<Icon {...style} name='search-outline' /> }
	</TouchableOpacity>
)

const TopNavigationSearch = ({ goBack, isSearching, setSearching, onSubmit }) => {
	const dateRef = React.useRef();

	const dateService = new NativeDateService('en', { format: 'YYYY/MM/DD' });

	const [range, setRange] = React.useState({});

	const onSearching = () => {
		setSearching();
		setTimeout(() => dateRef.current.focus(), 100);
	}

	const onSetRange = (e) => {
		setRange(e);
		if (e.endDate !== null && e.startDate !== null) {
    		dateRef.current.blur();
    	}
	} 

	const onPress = () => {
		//detect if icon is icon close
		if (!range.endDate || !range.startDate) {
			setSearching();
			setRange({});
		}else{
			onSubmit(range);
		}
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
			</View> : <RangeDatepicker
		        range={range}
		        onSelect={onSetRange}
		        icon={(style) => RenderIcon(style, range, onPress)}
		        placeholder='Pilih tanggal order'
		        ref={dateRef}
		        dateService={dateService}
		    /> }
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

	onSubmit = (range) => {
		const { endDate, startDate } = range;
		this.setState({ loading: true });
		const payload = {
			startdate: this.convertDate(startDate, 1),
			enddate: this.convertDate(endDate, 1),
			status: "0",
			idorder: "",
			email: this.props.dataLogin.detail.email
		}
		this.props.getDetailOrder(payload)
			.then(() => {
				const dateranges = `${this.convertDate(startDate, 2)}-${this.convertDate(endDate, 2)}`;
				this.setState({ loading: false });
				this.props.navigation.navigate({
					routeName: 'DetailOrder',
					params: {
						dateranges
					}
				})
			})
			.catch(err => {
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

	onPressHistory = (dateranges) => this.props.navigation.navigate({
		routeName: 'DetailOrder',
		params: {
			dateranges
		}
	})

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
						<Text style={{fontSize: 16, color: '#cbccc4'}}>Riwayat pencarian tidak ditemukan</Text>
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