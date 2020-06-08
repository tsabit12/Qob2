import React from "react";
import { View, Text, StatusBar, TouchableOpacity, ScrollView, ToastAndroid } from "react-native";
import {
	StylesHistory
} from "./styles";
import { Ionicons } from '@expo/vector-icons';
import { Input, Calendar, Select } from "@ui-kitten/components";
import { Loader, Message, ResultOrder } from "./components";
import api from "../../apiBaru";
import { connect } from "react-redux";

shortToast = message => {
    ToastAndroid.showWithGravityAndOffset(
      message,
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
      25,
      50
    );
}

const convertToLabel = (date) => {
	const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni",
	  "Juli", "Augustus", "September", "Oktober", "November", "Desember"
	];
	const d = new Date(date),
	month = '' + monthNames[d.getMonth()],
	day = '' + d.getDate(),
	year = '' + d.getFullYear();
	return `${day} ${month} ${year}`;
}

const convertDate = (date, jenis) => {
	var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    
    return [year, month, day].join('-');
}

const listStatus = [
  { text: 'Semua Status', value: 0 },
  { text: 'Order', value: 1 },
  { text: 'Pickup', value: 19 },
  { text: 'Sudah di transaksikan', value: 5 },
  { text: 'Transaksi Loket', value: 2 },
];

const History = props => {
	var datee = new Date();
	
	const [state, setState] = React.useState({
		calendarStart: false,
		calendarEnd: false,
		start: new Date(datee.getFullYear(), datee.getMonth(), 1),
		end: new Date(),
		loading: true,
		errors: {},
		listOrder: [],
		selectedOption: listStatus[0],
		historyStatus: []
	});

	React.useEffect(() => {
		const payload = {
			startdate: convertDate(new Date(datee.getFullYear(), datee.getMonth(), 1)),
			enddate: convertDate(new Date()),
			status: "0",
			extid: "",
			email: props.dataLogin.detail.email
		}
		
		api.qob.getDetailOrder(payload)
		.then(res => {
			const { data } = res;
			setState(prevState => ({
				...prevState,
				loading: false,
				listOrder: data
			}))
		})
		.catch(err => {
			setState(prevState => ({
				...prevState,
				loading: false,
				errors: {
					global: 'Data tidak ditemukan'
				}
			}));

		})

	}, [props.dataLogin.detail.email]);

	const setSelectedOption = (value) => {
		setState(prevState => ({
			...prevState,
			selectedOption: value
		}))
	}

	const onSelectEnd = (value) => {
		setState(prevState => ({
			...prevState,
			end: value,
			calendarEnd: false,
			loading: true,
			errors: {}
		}))

		const payload = {
			startdate: convertDate(state.start),
			enddate: convertDate(value),
			status: "0",
			extid: "",
			email: props.dataLogin.detail.email
		}
		api.qob.getDetailOrder(payload)
			.then(res => {
				const { data } = res;
				setState(prevState => ({
					...prevState,
					loading: false,
					listOrder: data
				}))
			})
			.catch(err => {
				setState(prevState => ({
					...prevState,
					loading: false,
					errors: {
						global: 'Data tidak ditemukan'
					}
				}));

			})
	}

	const handleShowCalendar = (type) => {
		if (type === 2) {//end date
			if (!state.calendarStart) {//only run when another date is false
				setState(prevState => ({
					...prevState,
					calendarEnd: !prevState.calendarEnd
				}))
			}
		}else{
			if (!state.calendarEnd) {
				setState(prevState => ({
					...prevState,
					calendarStart: !prevState.calendarStart
				}))
			}
		}
	}

	const dynamicSort = (property) => {
	    var sortOrder = 1;
	    if(property[0] === "-") {
	        sortOrder = -1;
	        property = property.substr(1);
	    }

	    return function (a,b) {
	        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
	        return result * sortOrder;
	    }
	}

	const onGetHistoryStatus = (id) => {
		const payload = {
			email: props.dataLogin.detail.email,
			extid: id
		}
		setState(prevState => ({
			...prevState,
			loading: true,
			historyStatus: []
		}));

		api.qob.getHistoryStatus(payload)
			.then(res => {
				const datanya = res.data.sort(dynamicSort("-insertdate"));
				setState(prevState => ({
					...prevState,
					loading: false,
					historyStatus: datanya
				}));
			})
			.catch(err => {
				setState(prevState => ({
					...prevState,
					loading: false
				}));
				shortToast("Terdapat kesalahan");
			});
	}

	const { calendarStart, calendarEnd, start, end, loading, errors } = state;

	return(
		<View style={StylesHistory.content}>
			<Loader loading={loading} />
			<View style={StylesHistory.StatusBar}>
				<StatusBar translucent barStyle="light-content" />
			</View>
			<View style={StylesHistory.header}>
				<View style={StylesHistory.navigation}>
					<TouchableOpacity onPress={() => props.navigation.goBack()}>
						<Ionicons 
							name="ios-arrow-round-back" 
							size={35} 
							color="#FFFF" 
						/>
					</TouchableOpacity>
					<Text style={StylesHistory.title}>RIWAYAT ORDER</Text>
					{ state.listOrder.length > 0 && <View style={{flex: 1, marginLeft: 15}}>
						<Select
					        data={listStatus}
					        selectedOption={state.selectedOption}
					        onSelect={setSelectedOption}
					        controlStyle={StylesHistory.select}
					        textStyle={{color: "white"}}
					        size="small"
					        status='control'
					    />
					</View> }
				</View>
				<View style={StylesHistory.form}>
					<TouchableOpacity
						style={StylesHistory.labelDate}
						onPress={() => handleShowCalendar(1)}
						disabled={calendarEnd}
					>
						<Text style={{color: "#FFFF", textAlign: "center"}}>{convertToLabel(start)}</Text>
						<Ionicons 
							name={calendarStart ? "md-arrow-dropup" : "md-arrow-dropdown"}
							size={25} 
							color="white" 
							style={{marginLeft: 10}}
						/>	
					</TouchableOpacity>

					<Text style={StylesHistory.label}>Sampai</Text>

					<TouchableOpacity
						style={StylesHistory.labelDate}
						onPress={() => handleShowCalendar(2)}
						disabled={calendarStart}
					>
						<Text style={{color: "#FFFF", textAlign: "center"}}>{convertToLabel(end)}</Text>
						<Ionicons 
							name={calendarEnd ? "md-arrow-dropup" : "md-arrow-dropdown"}
							size={25} 
							color="white" 
							style={{marginLeft: 10}}
						/>	
					</TouchableOpacity>
				</View>
			</View>
			<ScrollView contentContainerStyle={{flexGrow: 1}}>
				{ calendarStart && <Calendar
					date={start}
					style={{width: '100%'}}
					onSelect={(value) => setState(prevState => ({
						...prevState,
						start: value,
						calendarStart: false
					}))}
				/> } 

				{ calendarEnd && <Calendar
					date={end}
					style={{width: '100%'}}
					onSelect={(value) => onSelectEnd(value)}
				/> } 
				
				{ errors.global ? <Message message={errors.global} /> : 
				<ResultOrder 
					data={state.listOrder} 
					filterByStatus={state.selectedOption}
					getHistoryStatus={onGetHistoryStatus}
					historyStatus={state.historyStatus}
					closeModalHistory={() => setState(prevState => ({ ...prevState, historyStatus: [] }))}
				/> }
			</ScrollView>
		</View>
	);
}

function mapStateToProps(state) {
	return{
		dataLogin: state.auth.dataLogin
	}
}

export default connect(mapStateToProps, null)(History);