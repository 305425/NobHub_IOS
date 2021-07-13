import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  View,
  //Text,
  StyleSheet,
  Dimensions,
  Image,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Communications from 'react-native-communications';
import {Actions} from 'react-native-router-flux';
import CustomMenuIcon from '../Custom/MenuIconForHeader';
import {Text, BoldText} from '../shared/Text';
import {ArrowLeft} from '../shared/Icon';
import {CommonStyles} from '../shared/Constants';
import {goBack} from '../Services/BackButtonServices';
class privacypolicy extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isChecked: false,
    };
  }
  _handleHeaderProfileIcon = () => {
    const {userProfile} = this.props;
    return (
      <View>
        <CustomMenuIcon
          menutext="Menu"
          menuStyle={styles.headerCustomMenu}
          //Menu Text Style
          textStyle={styles.headerTextMenu}
          //Click functions for the menu items
          option1Click={() => {
            const {userProfile} = this.props;
            const UserId = userProfile.guid;
            const Mobile = userProfile.mobile;
            var CountryCode = userProfile.countryCode;
            Actions.profileBusiness({
              UserId: UserId,
              Mobile: Mobile,
              CountryCode: CountryCode,
              FirstName: userProfile.name + ' ' + userProfile.lastname,
              Title: userProfile.title,
            });
          }}
          option2Click={() => {
            Actions.businessCard({userProfile: userProfile});
          }}
          option3Click={() => {
          Actions.myConnections();
          }}
          option4Click={() => {
            Actions.qrCode({userProfile: userProfile});
          }}
          option5Click={() => {
            Actions.referAfriend({
              userProfile: userProfile,
            });
          }}
          option6Click={() => {
            Actions.rateUs({userProfile: userProfile});
          }}
          option7Click={() => {
            Actions.settings({
              UserId: userProfile.guid,
              IsShow: userProfile.sharecard,
              UserProfile: userProfile,
            });
          }}
          option8Click={() => {
            Actions.helpCenter({userProfile: userProfile});
          }}
          option9Click={() => {
            Actions.premierMembership({userProfile: userProfile});
          }}
          // option5Click={() => {
          //   this._handleClearLocalDB();
          // }}
          userProfile={userProfile}
          IsProfile={false}
          iconColor={'#000000'}
        />
      </View>
    );
  };
  leftArrowPress = () => {
    const {handleGoBack} = this.props;
    handleGoBack();
  };
  render() {
    return (
      <View style={{flex: 1}}>
        <ImageBackground
          style={{width: '100%', height: '100%'}}
          imageStyle={{
            resizeMode: 'stretch',
          }}
          source={require('../Images/curvesbg.jpg')}>
          <View style={{flex: 0.04}} />
          <View
            style={{
              flexDirection: 'row',
              flex: 0.07,
              justifyContent: 'space-between',
            }}>
            <View style={{marginLeft: 10}}>
              <TouchableOpacity onPress={() => this.leftArrowPress()}>
                <View style={styles.arrowBgstyle}>
                  <ArrowLeft
                    style={{fontSize: 20, color: CommonStyles.appColor}}
                  />
                </View>
              </TouchableOpacity>
            </View>

            <View>{this._handleHeaderProfileIcon()}</View>
          </View>
          <View style={{flex: 0.05, margin: 5}}>
            <BoldText style={styles.text}>{'Privacy Policy'}</BoldText>
          </View>
          <View style={{flex: 0.89, marginLeft: 10, marginRight: 10}}>
            <ScrollView>
              <Text style={styles.Textstyle}>
                You acknowledge that in accepting these Terms of Use, you do not
                rely on any statement, representation, assurance or warranty
                (whether made innocently or negligently) that is NOT set out in
                these Terms of Use or our Privacy Policy.
              </Text>
              <Text
                style={[styles.Textstyle, {marginTop: 15, marginBottom: 15}]}>
                NobHub has no obligation to collect personally identifiable
                information from you otherwise you have exclusively given such
                information to NobHub.
              </Text>
              <Text
                style={[styles.Textstyle, {marginBottom: 10, marginTop: 10}]}>
                NobHub’s information practices are further defined in its
                privacy policy, which is available at nobhub. com/privacy policy
                (the “Privacy Policy”). The Privacy Policy is an essential part
                of this Agreement and is integrated explicitly by reference, and
                by entering into this Agreement you agree to all of the terms of
                the Privacy Policy, and (ii) NobHub’s use of data as defined in
                the Privacy Policy is not an atte mpt to infringe on your right
                to privacy or publicity rights.
              </Text>
              <Text
                style={[
                  styles.Textstyle,
                  {fontSize: 13, marginTop: 5, marginBottom: 5},
                ]}>
                Security and Registration
              </Text>
              <Text style={styles.Textstyle}>
                > NobHub understands that by completing the registration process
                for any of our given services whether, via our Website or Mobile
                Application, you agree to subscribe to the selected services
                concerning terms of service of this agreement. You agree to
                provide NobHub accurate and complete registration information
                without any misleading or false personality. {'/n'}
                In case of any changes to your registration details, you shall
                promptly notify NobHub. You shall exclusively take
                responsibility for the security and appropriate use of all user
                IDs, passwords or other security strategies used in connecting
                with the Site and the Services, and shall take all precautionary
                steps to ensure that they are kept.
              </Text>
              <Text style={[styles.Textstyle, {fontSize: 13, marginTop: 10}]}>
                Fees, Payment, and Free Memberships
              </Text>
              <Text style={styles.Textstyle}>
                Accessing NobHub either through the Site or Mobile Application
                takes two forms i. Free Membership ii. Premium Membership which
                is defined below; For free membership, you shall be allowed to
                use the app for its intended purpose which is as a virtual
                business card app on agreeing to the terms of service guiding
                the use of our services and according to our privacy policy. As
                a free member, the use of our services shall be duly restricted
                to you, and you may occasionally see some advertisements through
                which we generate our revenue. You can, therefore, upgrade{' '}
                {'/n'}
                to premium membership to thoroughly enjoy our services with no
                form of advert placement.
              </Text>
              <Text style={[styles.Textstyle,{marginTop: 10}]}>
                For Premium membership, upon the acceptance of our terms of
                service and privacy policy, you will be directed to register by
                submitting your data as described in our privacy policy after
                which you will be subjected to paying a certain fee as stated in
                our Site or on our Mobile Application.
              </Text>
              <Text style={[styles.Textstyle,{marginTop: 10}]}>
                As a Premium member, you enjoy the full service our website and
                application have to offer, and you may not receive any form of
                advertisement.
              </Text>
              <Text style={[styles.Textstyle,{marginTop: 10}]}>
                Making payment for your service can be carried out through your
                debit card or using a third-party payment platform such as
                PayPal. You have the right to agree to the terms provided by the
                third-part we decide to use, and NobHub will not be held
                responsible for any uncertainties that may occur as a result of
                using such a third party.
              </Text>
              <Text style={[styles.Textstyle,{marginTop: 10}]}>
                NobHub reserves the right to revise the fees by either addition
                or reduction in the charge at any time. However, you will be
                notified of such a development some days before the renewal of
                your subscription which we may notify you through the email, pop
                up notification on our Mobile App or our site. You hold the
                right to either cancel or renew your subscription.
              </Text>
              <Text style={[styles.Textstyle,{marginTop: 10}]}>Content Ownership</Text>
              <Text style={styles.Textstyle}>>
                NobHub owns all right, title, and interest in and to the NobHub
                website and mobile application, including all intellectual
                property rights therein. The mobile app is licensed, not sold.
                The structure, organization, and code of the Mobile Application
                are the valuable trade secrets and confidential information of
                NobHub and its suppliers. The mobile application is secured by
                copyright and other intellectual property laws and treaties,
                including, without limitation, the copyright laws of the United
                States and other countries. {'/n'}
                You are also permitted to install the NobHub Mobile Application
                in your device. You may not alter or modify the Mobile
                Application or create a new installer for the Mobile
                Application.
              </Text>
              <Text style={{marginTop: 10, textAlign: 'justify'}}>Restrictions</Text>
              <Text style={styles.Textstyle}>
                You are not legalized to do any of the following:
              </Text>
              <Text style={{marginLeft: 20, textAlign: 'justify'}}>
                a) Create derivative works based on the Product or any part or
                component thereof, including, but not limited to, the Mobile
                Application;{'/n'}
                b) Reproduce the Product, in whole or in part; {'/n'}
                c) You are not entitled to sell, assign, license, disclose, or
                otherwise transfer or make available the Product, in whole or in
                part, to any third party; {'/n'}
                d) Alter, translate, decompile, or attempt to reverse engineer
                the Product or any part of a component thereof, except and only
                to the extent that such activity is expressly permitted by
                applicable law notwithstanding this contractual prohibition;
                {'/n'}
                e) Use the Product to provide services to third parties; or{' '}
                {'/n'}
                f) Remove or alter any proprietary notices or marks on the
                Product {'/n'}
                g) Use the App or any of the Services in any unlawful manner,
                for any unlawful purpose, or in a ny manner inconsistent with
                these Terms of Service, or act fraudulently or maliciously, for
                example, by hacking into or inserting malicious code, including
                viruses, or harmful data, into the App, any Service or any
                related operating system
              </Text>
              <Text style={{marginTop: 10, fontSize: 13,textAlign: 'justify'}}>Indemnity</Text>
              <Text style={{textAlign: 'justify'}}>
                You agree to defend, indemnify and hold us harmless, along with
                our parents, subsidiaries, agents, affiliates, customers,
                vendors, officers and employees from and against any and all
                claims, damages, obligations, losses, liabilities, costs or
                debt, and expenses (including reasonable attorney’s fees and
                cost) arising from: {'/n'}
                (i) your use of and access to the Service; {'/n'}
                (ii) your violation of any term of this Agreement; {'/n'}
                (iii) your violation of any third-party right, including without
                limitation any right of privacy or Intellectual Property Rights;{' '}
                {'/n'}
                (iv) your violation of any applicable law, rule, or regulation{' '}
                {'/n'}
                (v) any claim for damages that arise as a result of any of your
                User Content or any that is submitted via your account
              </Text>
              <Text style={{marginTop: 10, fontSize: 13, textAlign: 'justify'}}>
                Disclaimer of Warranty
              </Text>
              <Text style={{textAlign: 'justify'}}>
                NO WARRANTY. THE PRODUCT IS OFFERED ON AN “AS IS” BASIS AND NO
                WARRANTY, EITHER EXPRESS OR IMPLIED, IS GIVEN. NobHub AND ITS
                SUPPLIERS EXPRESSLY DISCLAIM ALL WARRANTIES OF ANY KIND, WHETHER
                STATUTORY, EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO,
                IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
                PURPOSE AND NON-INFRINGEMENT.
              </Text>
              <Text style={{marginTop: 10, fontSize: 13, textAlign: 'justify'}}>Governing Law</Text>
              <Text style={{textAlign: 'justify'}}>
                You agree that: (i) the Service shall be deemed solely based in
                the United States; and (ii) the Service shall be deemed a
                passive one that does not give rise to personal jurisdiction
                over us, either specific or general, in jurisdictions other than
                the States of United States. This Agreement shall be governed by
                the internal substantive laws of the United States, without 
                respect to its conflict of laws principles. The application of
                the United Nations Convention on Contracts for the International
                Sale of Goods is expressly excluded.
              </Text>
              <Text style={{textAlign: 'justify'}}>
                You agree to submit to the personal jurisdiction of a state
                court located in the United States, for any actions for which we
                retain the right to seek injunctive or other equitable relief in
                a court of competent jurisdiction to prevent the actual or
                threatened infringement, misappropriation or violation of our
                copyrights, trademarks, trade secrets, patents, or other
                intellectual property or proprietary rights.
              </Text>
              <Text style={{textAlign: 'justify'}}>Privacy Policies </Text>
              <Text style={{textAlign: 'justify'}}>Effective date: Oct 6, 2018 </Text>
              <Text style={{fontSize: 13,textAlign: 'justify'}}>
                Understanding Our Private Policy{' '}
              </Text>
              <Text style={{textAlign: 'justify'}}>
                This Privacy Policy (“Policy”) is incorporated into NobHub’s
                Terms of Use and License which can be accessed via
                NobHub.com/terms (the “Terms of Use”) and applies to the
                information obtained by us through your use of NobHub Websites
                and Mobile Application as described in this Policy.{' '}
              </Text>
              <Text style={{textAlign: 'justify'}}>
                NobHub ("us," "we," or "our") operates the www.NobHub.com
                website and the NobHub Mobile Application (hereinafter referred
                to as the "Service").
              </Text>
              <Text style={{textAlign: 'justify'}}>
                This page informs you of our policies regarding the collection,
                use, and disclosure of personal data when you use our Service
                and the choices you have associated with that dat
              </Text>
              <Text style={{textAlign: 'justify'}}>
                We use your data to provide and improve the Service. By using
                the Service, you agree to the collection and use of information
                in accordance with this policy. Unless otherwise defined in this
                Privacy Policy, the terms used in this Privacy Policy have the
                same meanings as in our Terms of Use.
              </Text>
              <Text style={{fontSize: 13, textAlign: 'justify'}}>Definitions</Text>
              <Text style={{textAlign: 'justify'}}>Service</Text>
              <Text style={{textAlign: 'justify'}}>
                Service means the www.NobHub.com website and the NobHub mobile
                application operated by NobHub Inc.
              </Text>
              <Text style={{textAlign: 'justify'}}>Personal Data</Text>
              <Text style={{textAlign: 'justify'}}>
                Personal Data means data about a living individual who can be
                identified from those data (or from those and other information
                either in our possession or likely to come into our possession).
              </Text>
              <Text style={{textAlign: 'justify'}}>Usage Data</Text>
              <Text style={{textAlign: 'justify'}}>
                Usage Data is data collected automatically either generated by
                the use of the Service or from the Service infrastructure itself
                (for example, the duration of a page visit).
              </Text>
              <Text style={{textAlign: 'justify'}}>Cookies</Text>
              <Text style={{textAlign: 'justify'}}>
                Cookies are small files stored on your device (computer or
                mobile device).
              </Text>
              <Text style={{fontSize: 13, textAlign: 'justify'}}>Information Collection and Use</Text>
              <Text style={{textAlign: 'justify'}}>
                When you engage our mobile application or interact with our
                website, we collect several different types of information for
                various purposes which include a user identification (“Personal
                Data” to provide and improve our Service to you.
              </Text>
              <Text style={{textAlign: 'justify'}}> Types of Data Collected </Text>
              <Text style={{textAlign: 'justify'}}>Personal Data</Text>
              <Text style={{textAlign: 'justify'}}>
                While using our Service, we may ask you to provide us with
                specific personally identifiable information that can be used to
                contact or identify you ("Personal Data"). Personally,
                identifiable information may include, but not limited to:
              </Text>
              <Text style={{textAlign: 'justify'}}> Email address </Text>
              <Text style={{textAlign: 'justify'}}>First name and last name </Text>
              <Text style={{textAlign: 'justify'}}> Phone number </Text>
              <Text style={{textAlign: 'justify'}}>Address, State, Province, ZIP/Postal code, City </Text>
              <Text style={{textAlign: 'justify'}}>Cookies and Usage Data </Text>
              <Text style={{textAlign: 'justify'}}>Payment Information for Premium Subscribers </Text>
              <Text style={{textAlign: 'justify'}}>
                This authorizes you as a user to complete your business
                transaction with us. The payment for our service can be enabled
                through the use of credit cards or via a third-party payment
                platform such as PayPal. When using a third-party, the
                information supplied to the third party will be used in
                completing your transaction with us, and that is subjected to
                the third- party privacy policy.
              </Text>
              <Text style={{marginTop: 10, textAlign: 'justify'}}> Usage Data </Text>
              <Text style={{textAlign: 'justify'}}>
                We may also collect information that your browser sends whenever
                you visit our Service or when you access the Service by or
                through a mobile device ("Usage Data").
              </Text>
              <Text style={{textAlign: 'justify'}}>
                This Usage Data may include information such as your computer's
                Internet Protocol address (e.g., IP address), browser type,
                browser version, the pages of our Service that you visit, the
                time and date of your visit, the time spent on those pages,
                unique device identifiers and other diagnostic data.
              </Text>
              <Text style={{marginTop: 10, textAlign: 'justify'}}>
                {' '}
                When you access the Service by or through a mobile device, this
                Usage Data may include information such as the type of mobile
                device you use, your mobile device unique ID, the IP address of
                your mobile device, your mobile operating system, the type of
                mobile Internet browser you use, unique device identifiers and
                other diagnostic data.
              </Text>
              <Text style={{marginTop: 10, textAlign: 'justify'}}> Tracking Cookies Data </Text>
              <Text style={{textAlign: 'justify'}}>
                We use cookies and similar tracking technologies to track the
                activity on our Service, and we hold certain information.{' '}
              </Text>
              <Text style={{textAlign: 'justify'}}>
                Cookies are files with a small amount of data which may include
                a unique anonymous identifier. Cookies are sent to your browser
                from a website and stored on your device. Other tracking t
                echnologies are also used such as beacons, tags, and scripts to
                collect and track information and to improve and analyze our
                Service.{' '}
              </Text>

              <Text style={{textAlign: 'justify'}}>
                You can instruct your browser to refuse all cookies or to
                indicate when a cookie is being sent. However, if you do not
                accept cookies, you may not be able to use some portions of our
                Service.
              </Text>
              <Text style={{marginTop: 10}}>
                {' '}
                Examples o\f Cookies we use:{' '}
              </Text>
              <Text style={{textAlign: 'justify'}}>
                Session Cookies. We use Session Cookies to operate our Service.{' '}
              </Text>
              <Text style={{textAlign: 'justify'}}>
                Preference Cookies. We use Preference Cookies to remember your
                preferences and various settings.
              </Text>
              <Text style={{textAlign: 'justify'}}>
                Security Cookies. We use Security Cookies for security purposes.{' '}
              </Text>
              <Text style={{textAlign: 'justify'}}>Device information</Text>
              <Text style={{textAlign: 'justify'}}>
                These are data from your computer or mobile device, such as the
                type of hardware and software you are using (for example, your
                operating system and browser type), as well as unique device
                identifiers for devices that are using NobHub mobile
                application.
              </Text>
              <Text style={{fontSize: 14, marginTop: 10, textAlign:'justify'}}>Use of Data </Text>
              <Text style={{textAlign: 'justify'}}>NobHub uses the collected data for various purposes: </Text>
              <Text style={{textAlign: 'justify'}}>
                To provide and maintain the Service {'/n'}
                To notify you about changes to our Service {'/n'}
                To allow you to participate in interactive features of our
                Service when you choose to do so {'/n'}
                To provide customer care and support {'/n'}
                To provide analysis or valuable information so that we can
                improve the Service{'/n'}
                To monitor the usage of the Service {'/n'}
                To detect, prevent and address technical issues {'/n'}
                To send you direct marketing mails (optional) and special offers
                about our service which you can unsubscribe from any time you
                want.
              </Text>
              <Text style={{textAlign: 'justify'}}>Transfer of Data</Text>
              <Text style={{textAlign: 'justify'}}>
                Your information, including Personal Data, may be transferred to
                — and maintained on — computers located outside of your state,
                province, country or other governmental jurisdiction where the
                data protection laws may differ than those from your
                jurisdiction.
              </Text>
              <Text style={{marginTop: 10, textAlign: 'justify'}}>
                If you are located outside the United States and choose to
                provide information to us, please note that we transfer the
                data, including Personal Data, to the United States and process
                it there.
              </Text>
              <Text style={{marginTop: 10, textAlign: 'justify'}}>
                Your consent to this Privacy Policy followed by your submission
                of such information represents your agreement to that transfer.
              </Text>
              <Text style={{marginTop: 10, textAlign: 'justify'}}>
                NobHub will take all steps reasonably necessary to ensure that
                your data is treated securely and in accordance with this
                Privacy Policy and no transfer of your Personal Data will take
                place to an organization or a country unless there are adequate
                controls in place including the security of your data and other
                personal information.
              </Text>
              <Text style={{marginTop: 10, textAlign: 'justify'}}>Disclosure of Data</Text>
              <Text style={{textAlign: 'justify'}}>Legal Requirements</Text>
              <Text style={{textAlign: 'justify'}}>
                We will not disclose any personal information to any third
                unless comply with a legal obligation: when we are legally
                required to do so to comply with a court order or other legal
                process To protect and defend the rights or property of NobHub
                either the website or our mobile application To prevent or
                investigate possible wrongdoing in connection with the Service
                To protect the personal safety of users of the Service or the
                general public To protect against legal charges which may be
                levied against us a company
              </Text>
              <Text style={{marginTop: 10, textAlign: 'justify'}}>
                We also may share non-personal information about website usage
                with non-affiliated third parties does not contain in any ways
                contain any personal information about our users.
              </Text>
              <Text style={{marginTop: 10, textAlign: 'justify'}}>Security of Data </Text>
              <Text style={{textAlign: 'justify'}}>
                The security of your data is essential to us but remember that
                no method of transmission over the Internet or method of
                electronic storage is 100% secure. While we strive to use
                commercially acceptable means to protect your Personal Data, we
                cannot guarantee its absolute security.{' '}
              </Text>
              <Text style={{marginTop: 10, textAlign: 'justify'}}>Sale or Rent of Data </Text>
              <Text style={{textAlign: 'justify'}}>
                Under no circumstances does NobHub sell or rent your Personal
                Data to third parties.
              </Text>
              <Text style={{marginTop: 10, textAlign: 'justify'}}>Service Providers </Text>
              <Text style={{textAlign: 'justify'}}>
                We may employ third party companies and individuals to
                facilitate our Service ("Service Providers"), to provide the
                Service on our behalf, to perform Service-related services or to
                assist us in analyzing how our Service is used. These third
                parties have access to your Personal Data only to perform these
                tasks on ou r behalf and are obligated not to disclose or use it
                for any other purpose.
              </Text>
              <Text style={{marginTop: 10,textAlign: 'justify'}}>Links to Other Sites </Text>
              <Text style={{textAlign: 'justify'}}>Security of Data </Text>
              <Text style={{marginTop: 10,textAlign: 'justify'}}>
                Our Service may contain links to other sites that are not
                operated by us. If you click a third-party link, you will be
                directed to that third party's site. We strongly advise you to
                review the Privacy Policy of every site you visit. We have no
                control over and assume no responsibility for the content,
                privacy policies or practices of any third-party sites or
                services.{' '}
              </Text>
              <Text style={{marginTop: 10,textAlign: 'justify'}}>Children's Privacy </Text>
              <Text style={{textAlign: 'justify'}}>
                Our Service does not address anyone under the age of 18
                ("Children"). We do not knowingly collect personally
                identifiable information from anyone under the age of 18. If you
                are a parent or guardian and you are aware that your Child has
                provided us with Personal Data, please contact us. If we become
                aware that we have collected Personal Data from children without
                verification of parental consent, we take steps to remove that
                information from our servers.
              </Text>
              <Text style={{marginTop: 10, textAlign: 'justify'}}>
                Changes to This Privacy Policy{' '}
              </Text>
              <Text style={{textAlign: 'justify'}}>
                As NobHub evolves, we may update our Privacy Policy from time to
                time. However, we will notify you of any changes by posting the
                new Privacy Policy on this page. We will let you know via email
                and/or a prominent notice on our Service, prior to the change
                becoming effective and update the "effective date" at the top of
                this Privacy Policy. You are advised to review this Privacy
                Policy periodically for any changes. Changes to this Privacy
                Policy are effective when they are posted on this page.
              </Text>
              <Text style={{marginTop: 10,textAlign: 'justify'}}>Contact Us </Text>
              <Text style={{textAlign: 'justify'}}>
                If you have any inquiries about this Privacy Policy, please
                contact us:
              </Text>
              <Text style={{textAlign: 'justify'}}> By email: info@NobHub.com </Text>
              <Text style={{textAlign: 'justify'}}>
                 By filling the form on our website and we will duly attend to
                your requests or complaints.{' '}
              </Text>
              <Text style={{marginTop: 10, textAlign: 'justify'}}>User Agreement </Text>
              <Text style={{textAlign: 'justify'}}>
                “…Any participation in this service whether through the website
                or the mobile application will signify the acceptance of this
                agreement…”{' '}
              </Text>
              <Text style={{marginTop: 10,textAlign: 'justify'}}>
                "BY ACCESSING AND USING THIS SERVICE, YOU ACCEPT AND AGREE TO BE
                BOUND BY THE TERMS AND PROVISION OF THIS AGREEMENT. ALSO, WHEN
                USING THESE PARTICULAR SERVICES, YOU SHALL BE SUBJECT TO ANY
                POSTED GUIDELINES OR RULES APPLICABLE TO SUCH SERVICES. ANY
                PARTICIPATION IN THIS SERVICE WILL CONSTITUTE UNDERSTANDING AND
                ACCEPTANCE OF THIS AGREEMENT.”{' '}
              </Text>
              <Text style={{marginTop: 10, textAlign: 'justify'}}>
                By Clicking on “I agree,” you consent to respect the Terms of
                Use of this service and our Privacy Policy. Please do not
                continue if you do not agree.
              </Text>
            </ScrollView>
          </View>
        </ImageBackground>
      </View>
    );
  }
}
const mapDispatchToProps = {
  handleGoBack: goBack,
};

export default connect(
  null,
  mapDispatchToProps,
)(privacypolicy);
const styles = StyleSheet.create({
  headerCustomMenu: {
    marginRight: 5,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderRadius: 100,
  },
  headerTextMenu: {
    color: 'red',
  },
  text: {
    fontSize: 25,
    textAlign: 'center',
    color: '#000',
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
  Textstyle: {textAlign: 'justify'},
});
