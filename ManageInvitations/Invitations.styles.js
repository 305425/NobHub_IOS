import {
  CommonStyles,
  GilRoyMediumColor,
  GilRoyRegularColor,
} from '../shared/Constants';
export const styles = {
  container: {
    flex: 4,
    borderColor: '#e0e0e0',
    flexDirection: 'row',
    borderBottomWidth: 1,
    margin: 10,
  },
  iconViewStyle: {
    height: 25,
    width: 25,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#ffffff',
    borderColor: CommonStyles.appColor,
    borderWidth: 1,
  },
  name: {
    fontSize: 26,
    color: '#ffffff',
    height: 55,
    width: 55,
    borderRadius: 110,
    backgroundColor: CommonStyles.appColor,
    justifyContent: 'center',
  },
  iconStyle: {
    color: CommonStyles.appColor,
    fontSize: 18,
  },
  fromUser: {
    color: GilRoyMediumColor.fontColor,
    fontSize: 16,
    paddingBottom: 5,
  },
  title: {
    color: GilRoyRegularColor.fontColor,
    fontSize: 12,
  },
  fab: {
    height: 55,
    width: 55,
    borderRadius: 110,
    justifyContent: 'center',
    alignItems: 'center',
  },
};
