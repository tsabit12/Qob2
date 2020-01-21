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
    <View style={styles.container}>
        <Loader loading={loading} />
        <View style={{margin: 5}}>
            <View style={styles.content}>
                <TouchableOpacity 
                    underlayColor="#D8D8D8"
                    onPress={() => navigation.navigate({
                        routeName: 'Order'
                    })}
                >
                    <View style={styles.icon}>
                        <Image source={iconBooking} style={styles.img}/>
                        <Text style={styles.textIcon}>QOB</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity 
                    underlayColor="#D8D8D8"
                    onPress={() => navigation.navigate({
                        routeName: 'CekTarif'
                    })}
                >
                    <View style={styles.icon}>
                        <Image source={iconCekTarif} style={styles.img}/>
                        <Text style={styles.textIcon}>Cek Tarif</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity 
                    underlayColor="#D8D8D8"
                    onPress={() => Linking.openURL('tel:' + '161')}
                >
                    <View style={styles.icon}>
                        <Image source={iconPhone} style={styles.img}/>
                        <Text style={styles.textIcon}>Halo Pos</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <View style={styles.content}>
                <TouchableOpacity 
                underlayColor="#D8D8D8"
                onPress={() => navigation.navigate({
                    routeName: 'Pembayaran'
                })}>
                    <View style={styles.icon}>
                        <Image source={iconPembayaran} style={styles.img}/>
                        <Text style={styles.textIcon}>Generate{'\n'}Pembayaran</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity 
                    underlayColor="#D8D8D8"
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
                    <View style={styles.icon}>
                        <Image source={iconRiwayat} style={styles.img}/>
                        <Text style={styles.textIcon}>Riwayat{'\n'}Order</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity 
                    underlayColor="#D8D8D8"
                    onPress={() => onShowModal(dataLogin.userid) } 
                >
                    <View style={styles.icon}>
                        <Image source={genPwd} style={styles.img}/>
                        <Text style={styles.textIcon}>Generate{'\n'}Password Web</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    content: {
        flexDirection: 'row',
        margin: 5,
        alignItems: 'center',
    },
    icon: {
        width: device*0.3, 
        height: device*0.3,
        justifyContent: 'center', 
        alignItems: 'center'
    },
    textIcon: {
        fontSize: 14, 
        textAlign: 'center',
        fontFamily: 'Roboto-Regular'
    },
    img: {
        width: device*0.2, height: device*0.2
    }
})

function mapStateToProps(state) {
    return{
        dataLogin: state.auth.dataLogin
    }
}

export default connect(mapStateToProps, { getOrder })(Menu);
