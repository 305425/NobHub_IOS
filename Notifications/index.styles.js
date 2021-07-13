import {CommonStyles} from '../shared/Constants';
export const styles = {
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
  notification_View: {
    flex: 1,
    // borderBottomWidth: 0.5,
    borderColor: '#e0e0e0',
    flexDirection: 'row',
    marginBottom: 5,
  },
  dotsView: {
    flex: 0.13,
  },
  connectedStatus: {
    flex: 0.13,
    top: 5,
  },
  notificationTitle_View: {
    flex: 1,
  },
  notifications_display: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
  notification_container: {
    flex: 1,
  },
};
