import {Platform, Dimensions} from 'react-native';
import {CommonStyles} from '../Constants';
export const styles = {
  container: {
    flexDirection: 'column',
    flex: 1,
    marginLeft: Platform.OS == 'ios' ? 15 : 20,
    marginRight: Platform.OS == 'ios' ? 20 : 30,
  },
  activeStyle: {
    backgroundColor: '#08a0af',
  },
  inactiveStyle: {
    backgroundColor: '#dcdcdc',
  },
  countryCodeinput: {
    fontSize: 18,
    color: CommonStyles.appColor,
    paddingRight: 15,
    marginTop: 10,
  },
  infoContainer: {
    flex: Platform.OS == 'android' ? 1 : 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    paddingVertical: Platform.OS == 'ios' ? 4 : 26,
    paddingLeft: Platform.OS == 'ios' ? 3 : 5,
    paddingRight: Platform.OS == 'ios' ? 3 : 5,
  },

  closeButtonStyle: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    backgroundColor: '#4b230d',
  },

  viewLogin: {alignSelf: 'center', borderRadius: 5, marginTop: 100},
  textLogin: {color: 'white', fontSize: 15},
  mobileNumberText: {
    flexDirection: 'row',
    fontSize: Platform.OS == 'android' ? 20 : 16,
    color: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 5,
    marginLeft: 10,
  },
  flagContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: Platform.OS == 'ios' ? 0 : 5,
    marginTop: Platform.OS == 'ios' ? 0 : 30,
    marginRight: Platform.OS == 'ios' ? 0 : 5,
  },
  mobileNumberTextBox: {
    flex: Platform.OS == 'android' ? 1 : 0,
    borderRadius: 10,
    paddingLeft: 5,
  },
  imageBackGround: {width: '100%', height: '100%'},
  logo: {alignSelf: 'center'},
  viewHeight: {marginTop: 10},
  flagImage: {flex: 2, fontSize: 30, marginTop: 10},
  subViewFlag: {
    flex: Platform.OS == 'ios' ? 1.6 : 1.3,
    marginRight: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#6e8f94',
    marginTop: Platform.OS == 'ios' ? 5 : 0,
   // paddingVertical: Platform.OS == 'ios' ? 0 : 19,
  },
  textView: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: Platform.OS == 'ios' ? 0 : 10,
  },
  phoneImage: {marginTop: 5},
  loginButtonContainer: {justifyContent: 'flex-end', flex: 1},
  viewSearchIcon: {flex: 0.5, alignItems: 'flex-end'},

  viewLoginPageContainer: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  imageLogo: {alignSelf: 'center', marginTop: 30},
  imageBackgroundCurve: {
    width: 32,
    height: 95,
    position: 'absolute',
    right: 0,
    top: 70,
  },
  viewIamgeBackgroundTopShape: {marginTop: 50},
  viewMobileNumberContainer: {
    flex: 4,
    paddingHorizontal: Platform.OS == 'ios' ? 6 : 5,
    marginTop: 20,
  },
  imageBackgroundTopShape: {width: '100%', height: 70},
  viewMobileNumber: {
    flex: Platform.OS == 'ios' ? 2.2 : 2,
    marginTop: Platform.OS == 'ios' ? 5 : 10,
  },
  iconDropDown: {fontSize: 20, marginTop: 15},
  arrowBgstyle: {
    flexDirection: 'column',
    height: 35,
    width: 35,
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#ffffff',
  },
  textInputMobileNumber: {fontSize: 18, color: '#000080'},
  //labelMobileNumber: {alignSelf: 'center'},
};
