import { CommonStyles, GilRoyMediumColor } from '../shared/Constants';
import { Dimensions } from 'react-native';
import { PixelRatio } from 'react-native';
export const styles = {
  viewContactContainer: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#e0e0e0',
    //marginVertical: 1,
    marginTop: 4,
    borderBottomStartRadius: 25,
    borderBottomEndRadius: 25,
  },
  viewContact: {
    flex: 1,
    alignSelf: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 4,
  },
  viewFabContainer: {
    flex: 1,
    alignItems: 'center',
    marginBottom: 8,
    //marginLeft: 25,
  },

  viewName: {
    //marginBottom: 8,
  },
  viewContactDetails: {
    flex: 3,
    //flexDirection: 'column',
    // marginLeft: 10,
  },
  ListStyles: {
    flex: 2,
    flexDirection: 'column',
    marginLeft: 10,
  },
  FavContactStyle: {
    height: 80,
    width: 70,
    marginLeft: 5,
    alignItems: "center",
    // flexDirection: 'column',
    backgroundColor: 'transparent',
  },
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
  chatArrowBgstyle: {
    flexDirection: 'column',
    height: 35,
    width: 35,
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#ffffff',
    right: 10
  },
  DialogButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  DialogButton: {
    borderRadius: 20,
    width: 20,
    borderColor: '#fff',
    height: 10,
    margin: 10,
    borderWidth: 1,
    backgroundColor: CommonStyles.appColor,
  },
  RenderImage: {
    flex: 1,
    alignItems: 'stretch',

  },
  textName: {
    color: GilRoyMediumColor.fontColor,
    fontSize: 16,
    paddingBottom: 5,
  },
  textNameteal: {
    color: CommonStyles.appColor,
    fontSize: 12,
    paddingBottom: 5,
  },
  textDesignation: {
    color: '#a9a9a9',
    fontSize: 14,
  },
  CreateNeGroupStyle: {
    margin: 20,
    alignItems: 'center',
    borderRadius: 60,
    paddingVertical: 12,
  },
  viewTabsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#bdbdbd',
    borderTopWidth: 1,
    borderWidth: 0.8,
    borderRadius: 50,
  },
  touchableOpacityView_InviteUser: {
    flex: 0.5,
    // backgroundColor: '#089bab',
    alignItems: 'center',
    borderRadius: 50,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  touchableOpacityView_Nearby: {
    flex: 0.5,

    // backgroundColor: '#089bab',
    alignItems: 'center',
    borderRadius: 50,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  iconStyle: {
    fontSize: 22,
  },
  FavoriteContactsstyle: {
    flexDirection: 'column',
    flex: 1,
  },
  iconSearch: { color: '#a9a9a9', fontSize: 20 },
  iconSearch1: { fontSize: 15, color: 'grey' },
  SectionStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    borderTopWidth: 1,
    borderLeftWidth: 0.5,
    borderRightWidth: 0.5,
    borderBottomWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 0.1,
    marginTop: 10,
    borderColor: CommonStyles.appColor,
  },
  TextInputStyleClass: {
    backgroundColor: 'white',
    underlineColor: 'transparent',

    width: '80%',
    fontSize: 15,
  },
  FavContactstyle: {
    // marginRight: 8,
    borderBottomColor: 'lightgray',
  },
  fab: {
    flexDirection: 'column',
    height: 55,
    width: 55,
    borderRadius: 110,
    justifyContent: 'center',
    backgroundColor: CommonStyles.appColor,
  },
  fab1: {
    //flex: 1,
    //flexDirection: 'column',
    height: 58,
    width: 58,
    borderRadius: 116,
    justifyContent: 'center',
   // backgroundColor: '#ffffff',
    // marginBottom: 2,
  },
  headerprofile: {
    height: 60,
    width: 60,
    borderRadius: 120,
    justifyContent: 'center',
    backgroundColor: CommonStyles.appColor,
  },
  defaultprofilestyle: {
    flex: 1,
    flexDirection: 'row',
    height: 60,
    width: 60,
    borderRadius: 160,
    // position: 'absolute',
    // marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#ffffff',
    // marginBottom: 2,
  },
  BgIconStyle: {
    // flexDirection: 'column',
    height: 39,
    width: 39,
    borderRadius: 78,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#ffffff'
  },
  searchIconStyle: {
    // flexDirection: 'column',
    height: 39,
    width: 39,
    borderRadius: 78,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#ffffff',
    // bottom:7
  },
  chatimage: {
    borderRadius: 10,
    flex: 1,
    borderColor: '#9B9B9B',
    borderWidth: 1 / PixelRatio.get(),
    justifyContent: 'center',
    alignItems: 'center',
    resizeMode: 'cover'
  },
  imageStyle: {
    flex: 0.8,
    // height: 300,
    // width: 200,
    //borderRadius: 10,
    // alignSelf: "center",
    overflow: "hidden",
    tintColor: CommonStyles.appColor
  },
  iconsListStyle: {
    borderBottomColor: 'lightgray',
    borderBottomWidth: 1,
    height: 2,
    width: 20,
  },
  floatingmenustyle: {
    backgroundColor: '#ffff',
    alignItems: 'center',
    borderColor: '#bdbdbd',
    borderWidth: 0.8,
    borderRadius: 70,
    position: 'absolute',
    right: 5,
    top: -50,
    width: 25,
    flexDirection: 'column',
    height: 60,
    marginTop: 80,
    marginRight: 20,
  },
  floatingstyle: {
    position: 'absolute',
    right: 5,
    top: -50,
    height: 87,
    //flex: 0.47,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    borderRadius: 50,
    flexDirection: 'column',
    marginTop: 80,
    marginRight: 20,
    width: 33,
  },
  DialogYesORNo: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#fff',
    height: 40,
    marginTop: 35,
    margin: 10,
    backgroundColor: CommonStyles.appColor,
  },
  Tickmark: {
    flex: 1,
    position: 'absolute',
    top: 37,
    left: 42,
    backgroundColor: '#ffffff',
    borderRadius: 50,
    width: 20,
    height: 20,
    alignItems: 'center',
    alignSelf: 'center',
  },
  msgCountStyle: {
    fontSize: 12,
    color: '#ffffff',
    backgroundColor: CommonStyles.appColor,
    height: 20,
    width: 20,
    borderRadius: 20,
    alignSelf: 'center',
    textAlign: 'center',
  },
  ChatSearchStyle: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    width: Dimensions.get('window').width * 0.56,
  },
};