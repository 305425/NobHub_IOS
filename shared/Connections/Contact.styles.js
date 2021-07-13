import {
  CommonStyles,
  GilRoyMediumColor,
  GilRoyRegularColor,
  LightGrayColor,
} from '../Constants';
import { Dimensions } from 'react-native';
const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

export const styles = {
  viewContactContainer: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#e0e0e0',
    //marginVertical: 1,
    marginBottom: 8,
    borderBottomStartRadius: 25,
    borderBottomEndRadius: 25,
  },
  viewContact: {
    flex: 1,
    alignSelf: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    //right:40
  },
  textContactShortName: {
    fontSize: 18,
  },
  viewContactDetails: {
    flex: 3,
    //flexDirection: 'column',
    //marginBottom: 8,
  },
  textName: {
    color: GilRoyMediumColor.fontColor,
    fontSize: 16,
    paddingBottom: 5,
  },
  textDesignation: {
    color: GilRoyRegularColor.fontColor,
    fontSize: 12,
    paddingBottom: 5,
  },
  viewFabContainer: {
    flex: 1,
    alignItems: 'center',
    marginBottom: 8,
    //marginLeft: 25,
  },
  Image: {
    height: 100,
    width: 100,
    backgroundColor: 'black',
    borderWidth: 1,
    borderRadius: 60,
  },
  viewDetails: {
    flex: 1,
    flexDirection: 'row',
  },
  ContactIcons: {
    fontSize: 16,
    marginRight: 5,
    color: '#a9a9a9',
  },
  textContactDetails: {
    color: '#a9a9a9',
  },
  fab: {
    flexDirection: 'column',
    height: 55,
    width: 55,
    borderRadius: 110,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: CommonStyles.appColor,
  },
  Tabs: {
    flex: 0.5,
    backgroundColor: '#ffff',
    alignItems: 'center',
    borderColor: '#bdbdbd',
    borderWidth: 0.8,
    borderRadius: 50,
    flexDirection: 'column',
    height: 200,
    marginTop: 35,
    marginLeft: -20,
    width: 40,
  },
  CircleView: {
    flex: 1,
    position: 'absolute',
    bottom: -5,
    right: 2,
    backgroundColor: '#ffffff',
    borderRadius: 50,
    width: 20,
    height: 20,
    alignItems: 'center',
    alignSelf: 'center',
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
  DialogButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  iconColor: {
    color: LightGrayColor.fontColor,
    fontSize: 25,
  },
  containerModal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    //padding: 45,
    //backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modal: {
    height: HEIGHT - 80,
    paddingBottom: 5,
    //backgroundColor: "white",
    borderRadius: 5,
    width: WIDTH - 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
};
