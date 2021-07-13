import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Image,
    ScrollView,
    TextInput,
    Text, Dimensions,
    ImageBackground
} from 'react-native';
import { connect } from 'react-redux';
import CommonHeader from '../shared/CommonHeader';
import { CommonStyles } from '../shared/Constants';
import Footer from '../shared/Footer';
import { MediumBoldText } from '../shared/Text';
import {
    GilRoyMediumColor,
    GilRoyRegularColor,
    PlayStoreLink,
} from '../shared/Constants';
import { ArrowLeft } from '../shared/Icon';
import FloatingTextInput from '../shared/FloatingTextInput';
import { Close } from '../shared/Icon';
import Dialog, { DialogContent, ScaleAnimation } from 'react-native-popup-dialog';
import { setUserProfile, clearUserProfile } from '../state/operations';
import CustomMenuIcon from '../Custom/MenuIconForHeader';
import { Actions } from 'react-native-router-flux';
import Share from 'react-native-share';
import files from '../files/filesBase64';


class ReferalList extends Component {
    constructor(props) {
        super(props);

    }
    _handleHeaderLeftIcon = () => {
        const { userProfile } = this.props;
        return (
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                <View style={styles.leftHeader}>
                    <ArrowLeft style={{ color: '#27BECF', fontSize: 20 }} />
                </View>
            </TouchableOpacity>
        );
    };
    _handleHeaderRightIcon = () => {
        return null;
    };
    _handleHeaderCenterIcon = () => {
        return (
            <View>
                <Text style={{ color: '#ffffff', fontSize: 18 }}>Referral List</Text>
            </View>
        );
    }
    _handleHeaderText = () => {
        return null;
    };
    _handleHeaderProfileIcon = () => {
        return null;
    };
    render() {
        const { userProfile } = this.props;
        return (
            <View style={{ flex: 1, backgroundColor: '#f4f6f9' }}>
                <View style={{ flex: 0.18 }}>
                    <CommonHeader
                        HeaderLeftIcon={() => this._handleHeaderLeftIcon()}
                        HeaderRightIcon={() => this._handleHeaderRightIcon()}
                        HeaderCenterIcon={() => this._handleHeaderCenterIcon()}
                        HeaderText={() => this._handleHeaderText()}
                        HeaderProfileIcon={() => this._handleHeaderProfileIcon()}
                    />
                </View>
                <View style={styles.cardsWrapper}>
                    <View style={styles.card}>
                        <View style={styles.cardImgWrapper}>
                            <ImageBackground
                                source={require('../Images/bgcolor.png')}
                                resizeMode="cover"
                                style={styles.cardImg}
                            >
                                <Image
                                    source={require('../Images/defaultProfile.png')}
                                    //resizeMode="cover"
                                    style={styles.fab}
                                />
                            </ImageBackground>
                        </View>
                        <View style={styles.cardInfo}>
                            <MediumBoldText style={styles.cardTitle}>Parvez Musaraf</MediumBoldText>
                            <Text style={styles.cardDetails}>
                                Ex. President
                            </Text>
                            <Text style={styles.cardDetails}>
                                Karachi,Pakistan.
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}
const mapStateToProps = state => {
    return {
        userProfile: state.user.userProfile,
    };
};
const mapDispatchToProps = {
    setUserProfile,
    clearUserProfile,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(ReferalList);

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    leftHeader: {
        flexDirection: 'column',
        height: 38,
        width: 38,
        borderRadius: 80,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: '#ffffff',
    },
    cardsWrapper: {
        marginTop: 20,
        width: '90%',
        alignSelf: 'center',
    },
    card: {
        height: 100,
        marginVertical: 2,
        flexDirection: 'row',
        shadowColor: '#999',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
        borderRadius: 8,
    },
    cardImgWrapper: {
        flex: 1,
    },
    cardImg: {
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: 8,
        borderBottomRightRadius: 0,
        borderTopRightRadius: 0,
        borderBottomLeftRadius: 8,
        borderTopLeftRadius: 8,
        overflow: "hidden"
    },
    cardInfo: {
        flex: 2,
        padding: 10,
        borderColor: '#ccc',
        borderWidth: 1,
        borderLeftWidth: 0,
        borderBottomRightRadius: 8,
        borderTopRightRadius: 8,
        backgroundColor: '#fff',
    },
    cardTitle: {
        fontWeight: 'bold',
    },
    cardDetails: {
        fontSize: 12,
        color: '#444',
    },
    fab: {
        //flex: 0.8,
        //flexDirection: 'column',
        height: 80,
        width: 80,
        borderRadius: 180,
        position: 'absolute',
        //marginTop: 10,
        //justifyContent: 'center',
        //alignItems: 'center',
        //alignSelf: 'center',
        // backgroundColor: '#ffffff',
        // borderWidth: 1,
        // borderColor: 'black',
        // marginBottom: 2,
    },
});