import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import {Scene, Router} from 'react-native-router-flux';
import {Scenes} from '../shared/Constants';
import {connect} from 'react-redux';
import SplashScreen from '../SplashScreen';
import StartPage from '../Account/StartPage';
import ViewCard from '../Cards/ViewCardForUser';
import ProfileCards from '../Profile/ProfileCards';
import ProfileBusiness from '../Profile/ProfileBusiness';
import Setting from '../Settings/Setting';
import MyConnections from '../MyConnections';
import Cards from '../BusinessCardSelection';
import Login1 from '../shared/Login';
import OTP from '../shared/OTP';
import VerifiedView from '../Account/VerifiedView';
import PersonalDetails from '../Account/PersonalDetails';
import CompanyDetails from '../Account/CompanyDetails';
import SelectBusinessCard from '../Account/SelectBusinessCard';
import HomePage from '../Home/HomePage';
import ChangeNumber from '../Settings/ChangeNumber';
import AboutNobHub from '../Settings/AboutNobHub';
import Help from '../Settings/Help';
import TermsAndConditions from '../Settings/TermsAndConditions';
import PrivacyPolicy from '../Settings/PrivacyPolicy';
import Groups from '../Groups';
import GroupsAdd from '../GroupsAdd';
import ConnectedPeople from '../ConnectedPeople';
import imageView from '../ImageView';
import Chat from '../Chats/Chats';
import ChattingUI from '../Chats/ChattingUI';
import FlagsList from '../shared/FlagsList';
import ManageInvitations from '../ManageInvitations';
import CommonHeader from '../shared/CommonHeader';
import PhoneContacts from '../PhoneContacts';
import Meetings from '../Meetings';
import ScheduleMetting from '../Meetings/ScheduleMeeting';
import MeetingUsers from '../Meetings/MeetingUsers';
import MeetingLocation from '../Meetings/MeetingLocation';
import MeetingInvitations from '../Meetings/MeetingInvitations';
import Notifications from '../Notifications';
import ChooseBusinessCard from '../BusinessCardSelection/ChooseBusinessCard';
import ChatContacts from '../Chats/ChatContacts';
import GroupChatting from '../Chats/groupChatting';
import GroupChatContacts from '../Chats/GroupChatContacts';
import groupMembers from '../Chats/groupMembers';
import ChatGroups from '../Chats/Chatgroups';
import BusinessShoutOut from '../BusinessShoutouts';
import PostShoutOut from '../BusinessShoutouts/PostShoutOut';
import ScannedCards from '../ScannedCards';
import ScannedImage from '../ScannedCards/ScannedImage';
import SelectedPhotos from '../Chats/Selectedphotos';
import Categories from '../BusinessCardSelection/Categories';
import NearByProfilesPage from '../NearByProfiles/index';
import MapView from '../NearByProfiles/MapView';
import ReferFriend from '../ReferFriend';
import ManageShoutout from '../BusinessShoutouts/ManageShoutOuts';
import EditShoutout from '../BusinessShoutouts/EditShoutout';
import Helpcenter from '../HelpCenter/Helpcenter';
import ContactUs from '../HelpCenter/ContactUs';
import Accordian from '../HelpCenter/Accordian';
import QRCode from '../QRcode';
import Rateus from '../RateUs/Rateus';
import Features from '../Settings/Features';
import PremierMembership from '../Settings/PremierMembership';
import Support from '../Support/Support';
import ShareBusinessCard from '../MyConnections/ShareBusinessCardView';
import OpenImage from '../BusinessShoutouts/OpenImage';
import DeleteAccount from '../DeleteAccount';
import ReferalList from '../ReferFriend/ReferalList';
import Language from '../shared/Language';

const styles = StyleSheet.create({
  container: {flex: 1},
});

export class RoutesComponent extends Component {
  render() {
    const ConnectedRouter = connect()(Router);
    return (
      <View style={styles.container}>
        <ConnectedRouter>
          <Scene key="root">
            <Scene
              //initial={true}
              key={Scenes.startPage}
              component={StartPage}
              hideNavBar
            />
            <Scene
              initial={true}
              key={Scenes.splashScreen}
              component={SplashScreen}
              hideNavBar
            />

            <Scene key={Scenes.viewCard} component={ViewCard} hideNavBar />
            <Scene
              key={Scenes.profileBusiness}
              component={ProfileBusiness}
              hideNavBar
            />
            <Scene
              key={Scenes.profileCard}
              component={ProfileCards}
              hideNavBar
            />
            <Scene key={Scenes.settings} component={Setting} hideNavBar />
            <Scene key={'login1'} component={Login1} hideNavBar />
            <Scene key={Scenes.otp} component={OTP} hideNavBar />
            <Scene
              key={Scenes.verifiedView}
              component={VerifiedView}
              hideNavBar
            />
            <Scene
              key={Scenes.personalDetails}
              component={PersonalDetails}
              hideNavBar
            />
            <Scene
              key={Scenes.companyDetails}
              component={CompanyDetails}
              hideNavBar
            />
            <Scene
              key={Scenes.selectBusinessCard}
              component={SelectBusinessCard}
              hideNavBar
            />
            <Scene
              key={Scenes.changeNumber}
              component={ChangeNumber}
              hideNavBar
            />
            <Scene
              key={Scenes.aboutNobHub}
              component={AboutNobHub}
              hideNavBar
            />
            <Scene key={Scenes.businessCard} component={Cards} hideNavBar />
            <Scene key={Scenes.help} component={Help} hideNavBar />
            <Scene key={Scenes.homePage} component={HomePage} hideNavBar />
            <Scene key={Scenes.groups} component={Groups} hideNavBar />
            <Scene key={Scenes.groupsAdd} component={GroupsAdd} hideNavBar />
            <Scene
              key={Scenes.connectedPeople}
              component={ConnectedPeople}
              hideNavBar
            />
            <Scene key={Scenes.imageView} component={imageView} hideNavBar />
            <Scene key={Scenes.chattingUI} component={ChattingUI} hideNavBar />
            <Scene key={Scenes.flagsList} component={FlagsList} hideNavBar />
            <Scene key={Scenes.Language} component={Language} hideNavBar />
            <Scene
              key={Scenes.manageInvitations}
              component={ManageInvitations}
              hideNavBar
            />
            <Scene
              key={Scenes.myConnections}
              component={MyConnections}
              hideNavBar
            />
            <Scene key={Scenes.Chats} component={Chat} hideNavBar />
            <Scene
              key={Scenes.commonHeader}
              component={CommonHeader}
              hideNavBar
            />
            <Scene
              key={Scenes.phoneContacts}
              component={PhoneContacts}
              hideNavBar
            />
            <Scene key={Scenes.Meetings} component={Meetings} hideNavBar />
            <Scene
              key={Scenes.ScheduleMetting}
              component={ScheduleMetting}
              hideNavBar
            />
            <Scene
              key={Scenes.MeetingUsers}
              component={MeetingUsers}
              hideNavBar
            />
            <Scene
              key={Scenes.MeetingLocation}
              component={MeetingLocation}
              hideNavBar
            />

            <Scene
              key={Scenes.MeetingInvitations}
              component={MeetingInvitations}
              hideNavBar
            />
            <Scene
              key={Scenes.notifications}
              component={Notifications}
              hideNavBar
            />
            <Scene
              key={Scenes.chooseBusinessCard}
              component={ChooseBusinessCard}
              hideNavBar
            />
            <Scene
              key={Scenes.ChatContacts}
              component={ChatContacts}
              hideNavBar
            />
            <Scene
              key={Scenes.GroupChatting}
              component={GroupChatting}
              hideNavBar
            />
            <Scene
              key={Scenes.GroupChatContacts}
              component={GroupChatContacts}
              hideNavBar
            />
            <Scene
              key={Scenes.groupMembers}
              component={groupMembers}
              hideNavBar
            />
            <Scene
              key={Scenes.businessShoutOut}
              component={BusinessShoutOut}
              hideNavBar
            />
            <Scene
              key={Scenes.postShoutOut}
              component={PostShoutOut}
              hideNavBar
            />
            <Scene key={Scenes.ChatGroups} component={ChatGroups} hideNavBar />
            <Scene
              key={Scenes.scannedCards}
              component={ScannedCards}
              hideNavBar
            />
            <Scene
              key={Scenes.scannedImages}
              component={ScannedImage}
              hideNavBar
            />
            <Scene
              key={Scenes.SelectedPhotos}
              component={SelectedPhotos}
              hideNavBar
            />
            <Scene key={Scenes.categories} component={Categories} hideNavBar />
            <Scene
              key={Scenes.nearByProfilesPage}
              component={NearByProfilesPage}
              hideNavBar
            />
            <Scene key={Scenes.mapView} component={MapView} hideNavBar />
            <Scene
              key={Scenes.referAfriend}
              component={ReferFriend}
              hideNavBar
            />
            <Scene
              key={Scenes.referAfriendList}
              component={ReferalList}
              hideNavBar
            />
            <Scene
              key={Scenes.manageShoutout}
              component={ManageShoutout}
              hideNavBar
            />
            <Scene
              key={Scenes.editShoutout}
              component={EditShoutout}
              hideNavBar
            />
            <Scene key={Scenes.helpCenter} component={Helpcenter} hideNavBar />
            <Scene key={Scenes.ContactUs} component={ContactUs} hideNavBar />
            <Scene key={Scenes.accordian} component={Accordian} hideNavBar />
            <Scene key={Scenes.qrCode} component={QRCode} hideNavBar />
            <Scene key={Scenes.rateUs} component={Rateus} hideNavBar />
            <Scene key={Scenes.features} component={Features} hideNavBar />
            <Scene key={Scenes.support} component={Support} hideNavBar />
            <Scene
              key={Scenes.premierMembership}
              component={PremierMembership}
              hideNavBar
            />
            <Scene
              key={Scenes.shareBusinessCard}
              component={ShareBusinessCard}
              hideNavBar
            />
            <Scene
              key={Scenes.termsAndCondtitions}
              component={TermsAndConditions}
              hideNavBar
            />
            <Scene
              key={Scenes.privacyPolicy}
              component={PrivacyPolicy}
              hideNavBar
            />
            <Scene key={Scenes.openImage} component={OpenImage} hideNavBar />
            <Scene key={Scenes.DeleteAccount} component={DeleteAccount} hideNavBar />
            
          </Scene>
        </ConnectedRouter>
      </View>
    );
  }
}

export default RoutesComponent;
