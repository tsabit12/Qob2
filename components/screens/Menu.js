import React from "react";
import Constants from 'expo-constants';
import { StyleSheet,
    TouchableOpacity,
    StatusBar, 
    Image, 
    FlatList, 
    Dimensions,
    View } from "react-native";
import { Text, Icon } from '@ui-kitten/components';
import { Linking } from "expo";
import { connect } from "react-redux";
import { getCurdateWithStrip } from "../utils/helper";
import { getOrder } from "../../actions/order";
import api from "../api";
import Loader from "../Loader";

var device = Dimensions.get('window').width;
const iconBooking = require("../../assets/calendar.png");
const iconCekTarif = require("../../assets/truck.png");
const iconPembayaran = require("../../assets/banking.png");
const iconRiwayat = require("../../assets/history.png");
const iconPhone = require("../../assets/phone2.png");
const genPwd = require("../../assets/generatePwd.png");


const Menu = ({ navigation, dataLogin, getOrder, loading, onShowModal }) => (
    <React.Fragment>
        <View style={styles.container}>
            <Loader loading={loading} />
            <View style={styles.content}>
                <TouchableOpacity 
                    style={styles.iconPress}
                    onPress={() => navigation.navigate({
                        routeName: 'Order'
                    })}
                >
                    <Image source={iconBooking} style={styles.img}/>
                    <View style={styles.subtitle}>
                        <Text style={styles.titleText}>QOB</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.iconPress}
                    onPress={() => navigation.navigate({
                        routeName: 'CekTarif'
                    })}
                >
                    <Image source={iconCekTarif} style={styles.img}/>
                    <View style={styles.subtitle}>
                        <Text style={styles.titleText}>Cek Tarif</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.iconPress}
                    onPress={() => Linking.openURL('tel:' + '161')}
                >
                    <Image source={iconPhone} style={styles.img}/>
                    <View style={styles.subtitle}>
                        <Text style={styles.titleText}>Halo Pos</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <View style={styles.content}>
                <TouchableOpacity 
                    style={styles.iconPress}
                    onPress={() => navigation.navigate({
                        routeName: 'Pembayaran'
                    })}
                >
                    <Image source={iconPembayaran} style={styles.img}/>
                    <View style={styles.subtitle}>
                        <Text style={styles.titleText}>Generate{'\n'}Pembayaran</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.iconPress}
                    onPress={() => {
                        const curdate = getCurdateWithStrip();
                        const { userid, norek } = dataLogin;
                        const payload = {
                            sp_nama  : `Ipos_getPostingPebisol`,
                            par_data : `${userid}|${curdate}|${curdate}`
                            // par_data : `440000016|${curdate}|${curdate}`
                        };
                        //get data order on this button
                        //with curdate
                        getOrder(payload, curdate).catch(err => console.log("kosong"));
                        
                        navigation.navigate({
                            routeName: 'ListOrder',
                            params: {
                                tanggalSearch: curdate
                            }
                        })
                    }}
                >
                    <Image source={iconRiwayat} style={styles.img}/>
                    <View style={styles.subtitle}>
                        <Text style={styles.titleText}>Riwayat{'\n'}Order</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.iconPress}
                    onPress={() => onShowModal(dataLogin.userid) } 
                >
                    <Image source={genPwd} style={styles.img}/>
                    <View style={styles.subtitle}>
                        <Text style={styles.titleText}>Password Web</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    </React.Fragment>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        margin: 3,
        marginTop: 20,
        height: '100%'
    },
    content:{
        flex: 1,
        flexDirection: 'row',
        marginTop: 5
    },
    iconPress: {
        width: device*0.3 - 10,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 7,
        marginTop: -15,
        borderColor: 'black'
    },
    img: {
        width: device*0.3 - 25, height: device*0.3 - 30
    },
    subtitle: {
        width: '100%', 
        alignItems: 'center',
        padding: 4,
        height: 45
    },
    textMenuTitle: {
        fontFamily: 'open-sans-bold',
        fontSize: 16
    },
    titleText: {
        color: 'black', 
        textAlign: 'center',
        fontFamily: 'Roboto-Regular'
    }
})

function mapStateToProps(state) {
    return{
        dataLogin: state.auth.dataLogin
    }
}

export default connect(mapStateToProps, { getOrder })(Menu);
