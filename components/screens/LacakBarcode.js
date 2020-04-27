import React from "react";
import { View, Text, ScrollView, StatusBar, Image, Dimensions, StyleSheet } from "react-native";
import { connect } from "react-redux";
import { Icon, TopNavigation, TopNavigationAction, Spinner } from '@ui-kitten/components';
import { removeErrors } from "../../actions/search";
import Constants from 'expo-constants';

const iconQ9 = require("../../assets/q9/01.png");
const device = Dimensions.get('window').width;

const MyStatusBar = () => (
	<View style={styles.StatusBar}>
		<StatusBar translucent barStyle="light-content" />
	</View>
);


const BackIcon = (style) => (
  <Icon {...style} name='arrow-back' fill='#FFF'/>
);


const capitalize = (string) => {
	return string.toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ');
}

const getOfficeTujuan = (description) => {
	const parsing = description.split(';');
	const officeValue = parsing[2].split(':');
	//remove office number
	const office = officeValue[1].replace(/[0-9]/g, '');
	return capitalize(office);
} 

const getStatusAntar = (description) => {
	const parsing = description.split(';');
	const status = parsing[1];
	const statusValue = status.split(':');
	return statusValue[1];
}

const getPenerima = (description) => {
	const parsing = description.split(';');
	const receiver = parsing[2];
	const receiverValue = receiver.split(':');
	return receiverValue[1];
}

const getLayanan = (description) => {
	const parsing = description.split(';');
	const layanan = parsing[0];
	const valueLayanan = layanan.split(':');
	const pengirim = parsing[1];
	const valuePengirim = pengirim.split(':');
	return {
		layanan: valueLayanan[1],
		pengirim: valuePengirim[1]
	};
}

const getKantorAsal = (description) => {
	const parsing = description.split(';');
	const office = parsing[2];
	const officeValue = office.split(':');
	const officeResult = officeValue[1].replace(/[0-9]/g, '');
	return capitalize(officeResult);
}

const PointInHours = () => (
	<View style={{alignItems: 'flex-end'}}>
		<View style={{ 
			width: 10, 
			height: 10,
			borderRadius: 10/2, 
			backgroundColor: 'green', 
			marginLeft: 8,
			marginTop: 4,
			marginLeft: -6
		}} />
	</View>
);

const DescriptionView = ({ item }) => (
	<View style={{flex: 1}}>
		<Text style={styles.description}>
			{ item.eventName === 'MANIFEST SERAH' && 'Diteruskan ke kantor' + getOfficeTujuan(item.description)}
			{ item.eventName === 'SELESAI ANTAR' && 'Selesai antar di ' + capitalize(item.officeName) + 
			' Status (' + getStatusAntar(item.description) + ') diterima oleh ' + getPenerima(item.description)}
			{ item.eventName === 'PROSES ANTAR' && 'Proses antar di ' + capitalize(item.officeName) }
			{ item.eventName === 'POSTING LOKET' && 'Posting Loket ('+ capitalize(item.officeName) + ')\nLayanan : ' + getLayanan(item.description).layanan + 
			 	'\nPengirim :' + getLayanan(item.description).pengirim }
			{ item.eventName === 'MANIFEST TERIMA' && 'Diterima di kantor ' + capitalize(item.officeName) 
				+ ' dari kantor' + getKantorAsal(item.description) }
		</Text>
	</View>
); 

const ListTrace = ({ listdata }) => {
	let groupByDate = '';
	const listContent 	= []; 
	const length 		= listdata.length;
	if (length > 0) {
		for(var key = 0; key < length; key++){
			let item = listdata[key];
			let date = item.eventDate.substr(0, 10);
			let time = item.eventDate.substr(11, 5);
			if (groupByDate !== date) {
				groupByDate = date;
				listContent.push(
					<React.Fragment key={key}>
						<View style={{flexDirection: 'row'}}>
							<Text style={styles.labelDate}>{date}</Text>
							<View style={styles.circle}>
								<View style={styles.circleAktif} />
							</View>
						</View>
						<View style={styles.borderVertical}>
							<View style={{flexDirection: 'row', marginBottom: 8, marginTop: 8, flex: 1}}>
								<View style={{alignItems: 'flex-start'}}>
									<Text style={styles.labelTime}>{time}</Text>
								</View>
								<PointInHours />
								<DescriptionView item={item} />
							</View>
						</View>
					</React.Fragment>
				);
			}else{
				listContent.push(
					<View style={styles.borderVertical} key={key}>
						<View style={{flexDirection: 'row', marginBottom: 8, marginTop: 8, flex: 1}}>
							<View style={{alignItems: 'flex-start'}}>
								<Text style={styles.labelTime}>{time}</Text>
							</View>
							<PointInHours />
							<DescriptionView item={item} />
						</View>
					</View>);
			}
		}
	}else{
		listContent.push(<Text>Kosong</Text>);
	}

	return(
		<View style={{flex: 1}}>
			<View style={styles.card}>
				<View style={{ alignItems: 'center', marginTop: 4, marginBottom: 10}}>
					<Image source={iconQ9} style={{width: device*0.4, height: device*0.4, borderWidth: 2, borderColor: '#f08400', borderRadius: 75}}/>
				</View>
				{listContent}
			</View>
		</View>
	);
}

const HasErrorView = ({ message }) => (
	<View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
		<View style={{backgroundColor: '#e0ddda', margin: 10, borderRadius: 4, padding: 10}}>
			<Text style={{textAlign: 'center', fontFamily: 'open-sans-reg'}}>{message}</Text>
		</View>
	</View>
);

const LoadingView = () => (
	<View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
		<Spinner size='medium' />
	</View>
);

class LacakBarcode extends React.Component{
	
	state={}

	dynamicSort = (property) => {
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

	BackAction = () => (
  		<TopNavigationAction icon={BackIcon} onPress={() => { 
  			this.props.navigation.goBack();
  			this.props.removeErrors();
  		}}/>
	);

	render(){
		const { listKiriman, hasError } = this.props;
		const sorted = listKiriman ? listKiriman.sort(this.dynamicSort("-eventDate")) : [];
		return(
			<View style={{flex: 1}}>
				<MyStatusBar />
				<TopNavigation
				    leftControl={this.BackAction()}
				    title='Lacak Kiriman'
				    subtitle={this.props.navigation.state.params.externalId}
				    subtitleStyle={{color: '#FFF'}}
				    alignment='start'
				    titleStyle={{fontFamily: 'open-sans-bold', color: '#FFF'}}
				    style={{backgroundColor: 'rgb(240, 132, 0)'}}
				/>
		       	{ listKiriman ? 
		       		<ScrollView>
						<View style={styles.containerTime}>
		       				<ListTrace listdata={sorted} /> 
		       			</View>
		       		</ScrollView> : <React.Fragment> 
		       		{ hasError.global ? <HasErrorView message={hasError.global} /> : <LoadingView />}
		       	</React.Fragment> }
			</View>
		);
	}
}

function mapStateToProps(state, nextProps) {
	const { externalId } = nextProps.navigation.state.params;
	return{
		listKiriman: state.search.trace[externalId],
		hasError: state.search.errors
	}
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    // padding: 10,
  },
  tabContainer: {
    minHeight: 64,
  },
  tab: {
    fontSize: 20,
    fontFamily: 'open-sans-reg',
    color: 'black'
  },
  judul: {
    fontFamily: 'open-sans-bold',
    fontSize: 16,
    fontWeight: '600'
  },
  containerTime: {
    flex: 1,
    padding: 10,
  },
  list: {
    flex: 1
  },
  label: {
    fontFamily: 'open-sans-bold', 
    fontSize: 15
  },
  labelList: {
    fontFamily: 'open-sans-reg'
  },
  circle: {
    width: 30, 
    height: 30,
    borderRadius: 30/2, 
    backgroundColor: '#32a899',
    justifyContent: 'center', 
    alignItems: 'center'
  },
  borderVertical: {
    borderStyle: 'dotted',
    borderLeftWidth:3,
    marginLeft: 100,
    borderLeftColor: '#d97716'
  },
  circleAktif:{
    width: 20, 
    height: 20,
    borderRadius: 20/2, 
    backgroundColor: '#d97716'
  },
  labelDate: {
    fontFamily: 'Roboto-Regular',
    margin: 5,
    color: '#5e5d5c'
  },
  labelTime: {
    fontFamily: 'open-sans-reg',
    marginLeft: -50,
    color: '#8f8e8d',
    fontSize: 14
  },
  box: {
    borderLeftWidth: 1, 
    borderRightWidth: 1, 
    borderBottomWidth: 1, 
    borderTopWidth: 1,
    margin: 5,
    borderRadius: 10,
    backgroundColor: '#edeceb'
  },
  description: {
    marginLeft: 3, 
    fontFamily: 'open-sans-reg', 
    fontSize: 12,
    color: '#8f8e8d'
  },
  StatusBar: {
    height: Constants.statusBarHeight,
    backgroundColor: 'rgb(240, 132, 0)'
  },
  card: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    padding: 5, 
    borderBottomWidth: 2, 
    borderRightWidth: 2, 
    borderLeftWidth: 1, 
    borderTopWidth: 1, 
    borderColor: '#f08400',
    borderRadius: 4
  }
});

export default connect(mapStateToProps, { removeErrors })(LacakBarcode);