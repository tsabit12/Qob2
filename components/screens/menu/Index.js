import React from "react";
import { View, Text, TouchableOpacity, Image, Alert, ScrollView } from "react-native";
import Menu from "./Menu";
import styles, { colors } from './styles/index.style';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import SliderEntry from './components/SliderEntry';
import { sliderWidth, itemWidth } from './styles/SliderEntry.style';
import { Icon, TopNavigation, TopNavigationAction } from '@ui-kitten/components';
import { connect } from "react-redux";
import Loader from "../../Loader";
import api from "../../api";
import * as Permissions from 'expo-permissions';
import { Notifications } from 'expo';
import apiBaru from "../../apiBaru";

export const ENTRIES1 = [
    {
        title: 'Beautiful and dramatic Antelope Canyon',
        subtitle: 'Lorem ipsum dolor sit amet et nuncat mergitur',
        illustration: 'https://i.imgur.com/UYiroysl.jpg'
    },
    {
        title: 'Earlier this morning, NYC',
        subtitle: 'Lorem ipsum dolor sit amet',
        illustration: 'https://i.imgur.com/UPrs1EWl.jpg'
    },
    {
        title: 'White Pocket Sunset',
        subtitle: 'Lorem ipsum dolor sit amet et nuncat ',
        illustration: 'https://i.imgur.com/MABUbpDl.jpg'
    },
    {
        title: 'Acrocorinth, Greece',
        subtitle: 'Lorem ipsum dolor sit amet et nuncat mergitur',
        illustration: 'https://i.imgur.com/KZsmUi2l.jpg'
    },
    {
        title: 'The lone tree, majestic landscape of New Zealand',
        subtitle: 'Lorem ipsum dolor sit amet',
        illustration: 'https://i.imgur.com/2nCt3Sbl.jpg'
    },
    {
        title: 'Middle Earth, Germany',
        subtitle: 'Lorem ipsum dolor sit amet',
        illustration: 'https://i.imgur.com/lceHsT6l.jpg'
    }
];

const SLIDER_1_FIRST_ITEM = 1;

const ProfileIcon = (style) => (
	<Icon {...style} name='person' fill='#FFF'/>
);

const ProfileAction = (props) => (
  <TopNavigationAction {...props} icon={ProfileIcon}/>
);

const numberWithCommas = (number) => {
	if (isNaN(number)) {
		return '-';
	}else{
		return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
	}
}

const RenderButtonGiro = ({ norek, detail, onPressGiro }) => (
	<React.Fragment>
		{ norek === '-' ? <TouchableOpacity 
				style={{padding: 10, elevation: 5, backgroundColor: 'rgb(245, 90, 12)', margin: 8, borderRadius: 2}}
				activeOpacity={0.5}
				onPress={onPressGiro}
			>
			<View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'center'}}>
				<Image source={require('../../../assets/giro.png')} style={{width: 25, height: 25}} />
				<Text style={{textAlign: 'center', color: '#FFF', paddingLeft: 10, fontWeight: '700'}}>Hubungkan ke akun giro</Text>
			</View>
		</TouchableOpacity> : <View style={{padding: 10, margin: 8, backgroundColor: 'rgb(245, 90, 12)', elevation: 5, borderRadius: 3 }}>
			<View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'center'}}>
				<Image source={require('../../../assets/giro.png')} style={{width: 25, height: 25}} />
				<Text style={{textAlign: 'center', color: '#FFF', paddingLeft: 10, fontWeight: '700'}}>Rp {numberWithCommas(detail.saldo)}</Text>
			</View>
		</View>}
	</React.Fragment>
);

class Index extends React.Component{
	state = {
		slider1ActiveSlide: SLIDER_1_FIRST_ITEM,
		loading: false
	}

	async UNSAFE_componentWillMount(){
		const { userid } = this.props.dataLogin;
		const { email } = this.props.dataLogin.detail;
		const { status: existingStatus } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
		let finalStatus = existingStatus;
		
		if (existingStatus !== 'granted') {
	        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
	        finalStatus = status;
	    }

	    if (finalStatus !== 'granted') {
	        alert('Failed to get push token for push notification!');
	        return;
	    }

	    await Notifications.getExpoPushTokenAsync()
	    	.then(token => {
	    		const payload = {
	    			token,
	    			email: email,
	    			userid: userid
	    		};
	    		apiBaru.qob.pushToken(payload)
	    			.then(res => console.log(res))
	    			.catch(err => console.log(err))
	    	}).catch(err => console.log(err))
      	
	}
	
	_renderItemWithParallax ({item, index}, parallaxProps) {
        return (
            <SliderEntry
              data={item}
              even={(index + 1) % 2 === 0}
              parallax={true}
              parallaxProps={parallaxProps}
            />
        );
    }

    renderRightControls = () => {
		const { userid } = this.props.dataLogin;
		return(
				<ProfileAction onPress={() => 
					this.props.navigation.navigate({ 
						routeName: 'Account'
					})} 
				/>
		);
	}

	onAlert = (message) => {
		Alert.alert(
		  'Apakah anda yakin?',
		  `${message}`,
		  [
		  	{
		      text: 'Batal',
		      onPress: () => console.log('Cancel Pressed'),
		      style: 'cancel',
		    },
		    {text: 'Ya', onPress: () => this.generateToken()},
		  ],
		  {cancelable: false},
		);
	}

	generateToken = () => {
		const { userid } = this.props.dataLogin;
		this.setState({ loading: true });
		api.auth.genpwdweb(userid)
			.then(res => {
				this.setState({ loading: false });
				setTimeout(() => {
					Alert.alert(
					  'Sukses',
					  `${res.desk_mess}`,
					  [
					  	{ text: 'Tutup', style: 'cancel' },
					  ],
					  {cancelable: false},
					);
				}, 200);
			})
			.catch(err => {
				this.setState({ loading: false });
				setTimeout(() => {
					Alert.alert(
					  'Oppps',
					  `${err.desk_mess}`,
					  [
					  	{ text: 'Tutup', style: 'cancel' },
					  ],
					  {cancelable: false},
					);
				}, 200);
			})
	}

	render(){
		const { slider1ActiveSlide, loading } = this.state;
		const { userid, norek, detail } = this.props.dataLogin;

		return(
			<View style={{flex: 1, backgroundColor: 'rgb(240, 132, 0)'}}>
				<Loader loading={loading} />
				<TopNavigation
				    //leftControl={this.renderLeftControl()}
				    title='QPOSin AJA'
				    alignment='start'
				    titleStyle={{fontSize: 19, fontWeight: '700', color: '#FFF'}}
				    style={styles.navigation}
				    rightControls={this.renderRightControls()}
				/>
				<ScrollView>
					<View style={styles.exampleContainer}>
						<Carousel
		                  ref={c => this._slider1Ref = c}
		                  data={ENTRIES1}
		                  renderItem={this._renderItemWithParallax}
		                  sliderWidth={sliderWidth}
		                  itemWidth={itemWidth}
		                  hasParallaxImages={true}
		                  firstItem={SLIDER_1_FIRST_ITEM}
		                  inactiveSlideScale={0.94}
		                  inactiveSlideOpacity={0.7}
		                  // inactiveSlideShift={20}
		                  containerCustomStyle={styles.slider}
		                  contentContainerCustomStyle={styles.sliderContentContainer}
		                  loop={true}
		                  autoplay={true}
		                  loopClonesPerSide={2}
		                  autoplayDelay={500}
		                  autoplayInterval={3000}
		                  onSnapToItem={(index) => this.setState({ slider1ActiveSlide: index }) }
		                />
		                <Pagination
		                  dotsLength={ENTRIES1.length}
		                  activeDotIndex={slider1ActiveSlide}
		                  containerStyle={styles.paginationContainer}
		                  dotColor={'rgba(255, 255, 255, 0.92)'}
		                  dotStyle={styles.paginationDot}
		                  inactiveDotColor={colors.black}
		                  inactiveDotOpacity={0.4}
		                  inactiveDotScale={0.6}
		                  carouselRef={this._slider1Ref}
		                  tappableDots={!!this._slider1Ref}
		                />
					</View>
					
					{ /* RENDER BUTTON GIRO*/}
					<RenderButtonGiro 
						norek={norek} 
						detail={detail} 
						onPressGiro={() => this.props.navigation.navigate({
							routeName: 'ValidasiRekening'
						})}
					/>
					
					{ /* MENU WILL BE HERE */ }
					<Menu 
						navigation={this.props.navigation}
						showAlert={this.onAlert}
					/>
				</ScrollView>
			</View>
		);
	}
}

function mapStateToProps(state) {
	return{
		dataLogin: state.auth.dataLogin
	}
}

export default connect(mapStateToProps, null)(Index);