import {Dimensions} from 'react-native';
export const styles = {
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  headerLinerGradient: {
    width: Dimensions.get('window').width,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    flex: 1,
  },
  viewHeaderContainer: {
    flexDirection: 'row',
    backgroundColor: 'teal',
    //paddingVertical: 10,
  },
  ViewHeaderGroupCount: {
    flex: 2,
  },
  textHeaderGroupCount: {
    flex: 0.8,
  },
  viewHeaderLeftContainer: {
    flex: 2,
    // marginLeft: 20,
    // marginRight: 10,
    // marginBottom: 10,
  },
  viewHeaderCenterContainer: {
    // flex: 4,
    // justifyContent: 'space-between',
    // flexDirection: 'row',
    // backgroundColor: 'white',
    // borderBottomLeftRadius: 40,
    // borderBottomRightRadius: 40,
    // borderTopLeftRadius: 40,
    // borderTopRightRadius: 40,
    height: 38,
    alignItems: 'center',
  },
  viewHeaderRightContainer: {
    // flex: 1,
    // alignItems: 'flex-end',
    //marginBottom: 10,
  },
  imageLogo: {
    flex: 1,
    width: 300,
    height: 92,
    position: 'absolute',
    top: 0,
    right: 0,
  },
};
