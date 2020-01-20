import React, { Component } from "react";
import { 
    View,
    StyleSheet,
    AsyncStorage,
    StatusBar,
    Text
} from "react-native";
import {
    Layout,
    Button,
    Input,
    Icon,
    TopNavigation,
    TopNavigationAction
  } from '@ui-kitten/components';
import api from '../../api';
import Loader from "../../Loader";
import Constants from 'expo-constants';

const MyStatusBar = () => (
    <View style={styles.StatusBar}>
        <StatusBar translucent barStyle="light-content" />
    </View>
);

const BackIcon = (style) => (
  <Icon {...style} name='arrow-back' fill='#FFF'/>
);

const numberWithCommas = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

class Pembayaran extends Component {
    state = {
        nominal : '',
        nominalVal: 0,
        loading: false,
        errors: {},
        localUser: {
			norek: '-',
			userid: '-'
        },
        success: false,
        response: {}
    }

    nominalRef = React.createRef();

    validate = (nominal) => {
		const errors = {};
		if (!nominal) errors.nominal = "Masukan nomor rekening";
		return errors;
    }
    
    async componentDidMount() {
        const value     = await AsyncStorage.getItem('sessionLogin');
        const value2     = await AsyncStorage.getItem('qobUserPrivasi');
        const toObje    = JSON.parse(value);
        const toObje2    = JSON.parse(value2);
        this.setState({
            localUser: {
                userid: toObje2.userid,
                norek: toObje.norek
            }
        });
    }

    onSubmit = () => {
            this.setState({ loading: true });
            const { nominal , localUser } = this.state;
            const payload = { 
                param1: `${localUser.userid}|${localUser.norek}|${nominal}`
            }
            console.log(payload);

            api.Pembayaran.generate(payload)
                .then(res => {
                    const response = {
                        desc : res.desk_mess,
                        pin : res.response_data1
                    };
                    this.setState ({ loading : false, response, success: true });
                    // this.props.navigation.navigate({
                    //     routeName : 'KonfrimPembayaran',
                    //     params: {
                    //         resGenerate: response,
                    //         nominal : nominal
                    //     }
                    // })
                })
                .catch(err => {
                    this.setState({loading : false, success: false, response: {} });
                    alert(err.desk_mess)
                });
    }

    BackAction = () => (
        <TopNavigationAction icon={BackIcon} onPress={() => this.props.navigation.goBack()}/>
    )

    onChangeText = (e) => {
        const value     = e.replace(/\D+/g, "");
        const addComma  = numberWithCommas(value);
        this.setState({ nominalVal: addComma, nominal: value });
        // (e) => this.setState({ nominal: e })
    }

    render() {
        const { nominal, errors, loading, response } = this.state;
        return (
            <View style={{flex: 1}}>
                <MyStatusBar />
                <TopNavigation
                    leftControl={this.BackAction()}
                    title='Generate Pembayaran'
                    alignment='center'
                    titleStyle={{fontFamily: 'open-sans-bold', color: '#FFF'}}
                    style={{backgroundColor: 'rgb(240, 132, 0)'}}
                />

                <Loader loading={loading}/>

                <View style={styles.container}>
                    { Object.keys(response).length > 0 ?   
                         <View style={styles.result}>
                            <Text style={{fontSize: 13, textAlign: 'center'}}>
                                SIMPAN PESAN INI SEBAGAI BUKTI PEMBAYARAN INFOKAN PESAN INI KEPADA PETUGAS LOKET KANTOR POS TERDEKAT
                            </Text>
                            <View style={{borderWidth: 0.3, marginTop: 6}}/>
                            <View style={{padding: 5}}>
                                <View style={{flexDirection: 'row'}}>
                                    <Text>TOKEN</Text>
                                    <Text style={{marginLeft: 40}}>: {response.pin}</Text>
                                </View>
                                <View style={{flexDirection: 'row'}}>
                                    <Text>NOMINAL</Text>
                                    <Text style={{marginLeft: 22}}>: {this.state.nominalVal}</Text>
                                </View>
                            </View>
                            <Button status='warning' style={{marginTop: 6}} onPress={() => this.setState({ nominal: 0, nominalVal: 0, response: {}, success: false })}>RESET</Button>
                        </View> :
                         <View style={styles.form}>
                            <Input
                                label='Nominal'
                                placeholder='Masukan Jumlah Nominal'
                                ref={this.nominalRef}
                                value={this.state.nominalVal}
                                name='nominal'
                                onChangeText={this.onChangeText}
                                onSubmitEditing={this.onSubmit}
                                keyboardType='numeric'
                                autoFocus
                                labelStyle={{fontSize: 16, color: 'black', fontFamily: 'open-sans-reg'}}
                            />
                            <Button status='warning' onPress={this.onSubmit}>BAYAR</Button>
                        </View> }
                </View>
            </View>
        );
    }
}
export default Pembayaran;

const styles = StyleSheet.create({
    container: {
        margin: 10, 
        padding: 3    
    },
    footerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    footerControl: {
        marginHorizontal: 4,
        width: 120
    },
    form:{
        borderWidth: 1,
        padding: 10,
        borderRadius: 10,
        borderColor: '#dbdad9'
    },
    StatusBar: {
        height: Constants.statusBarHeight,
        backgroundColor: 'rgb(240, 132, 0)'
    },
    result: {
        borderWidth: 0.6,
        borderRadius: 10,
        marginTop: 10,
        padding: 10,
        backgroundColor: '#d9d8d7'
    }
});