import { Dimensions } from 'react-native';

export const styles = {
  profileImage: {
    alignSelf: 'center',
    zIndex: 999,
    bottom: 60,
    // borderWidth:4,
    // borderColor:"#fff",
    borderRadius: 50,
    // top: -40,
  },
  blankProfileImage: {
    alignSelf: 'center',
    zIndex: 999,
    bottom: 60,
    // borderWidth:4,
    // borderColor:"#27becf",
    borderRadius: 50
    //top: -65,
  },
  profileImageBackground: {
    width: '100%',
    height: 100,
  },
  profileDetailsBackground: {
    width: Dimensions.get('window').width,
    flex: 0.7,
    //paddingVertical: 48,
  },
  viewImageProfileDetailsBackground: {
    width: Dimensions.get('window').width,
    flex: 1.1,
  },
  viewProfileDetailsContainer: { marginBottom: 50 },
  viewEditProfile: {
    alignItems: 'flex-end',
    paddingRight: 35,
    zIndex: 999,
    top: 10,
  },
  viewProfileDetails: {
    flex: 1,
    alignItems: 'center',
    alignSelf: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    zIndex: 999
  },
  iconProfileDetailsEdit: { fontSize: 20 },
  viewModalContainer: {
    backgroundColor: '#FFFF',
    paddingVertical: 30,
    borderWidth: 1,
  },
  viewHeaderContainer: { flexDirection: 'row' },
  textModalTitle: { alignSelf: 'center', fontSize: 25, color: '#089bab' },
  viewModalBodyContainer: { justifyContent: 'space-between' },
  marginTop20: { marginTop: 20 },
  marginTop10: { marginTop: 10 },
  Tabs: {
    flex: 0.5,
    backgroundColor: '#ffff',
    alignItems: 'center',
    borderColor: '#bdbdbd',
    borderWidth: 0.8,
    borderRadius: 50,
    flexDirection: 'column',
    height: 150,
    //marginTop: 35,
    marginLeft: -20,
    width: 40,
  },
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
};