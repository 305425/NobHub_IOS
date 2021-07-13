import React, {Component} from 'react';
import {Dimensions} from 'react-native';
import Personal from './Personal';
import Business from './Business';
export default class PersonalProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      UserData: {},
    };
  }
  renderView() {
    var Ispersonal = this.props.Ispersonal;
    const {
      objectElements,
      userProfile,
      onChangeHandler,
      toggleEmail,
      toggleHome,
      toggleAddres,
      toggleFacebook,
      toggleSkype,
      toggleTwitter,
      toggleLinkedin,
      toggleDepartment,
      toggleCompanyWebsite,
      toggleExtension,
      toggleCompanyPhone,
      toggleFax,
      updateUserPersonalProfile,
      isPersonalProfileEditEabled,
      isBusinessProfileEditEabled,
      OnAddressSelect,
    } = this.props;

    if (Ispersonal) {
      return (
        <Personal
          userProfile={userProfile}
          objectElements={objectElements}
          toggleEmail={toggleEmail}
          toggleHome={toggleHome}
          toggleAddres={toggleAddres}
          toggleFacebook={toggleFacebook}
          toggleSkype={toggleSkype}
          toggleTwitter={toggleTwitter}
          toggleLinkedin={toggleLinkedin}
          onChangeHandler={(id, value) => onChangeHandler(id, value)}
          updateUserPersonalProfile={updateUserPersonalProfile}
          isPersonalProfileEditEabled={isPersonalProfileEditEabled}
          OnAddressSelect={(value, id) => OnAddressSelect(value, id)}
        />
      );
    } else {
      return (
        <Business
          userProfile={userProfile}
          objectElements={objectElements}
          toggleDepartment={toggleDepartment}
          toggleCompanyWebsite={toggleCompanyWebsite}
          toggleExtension={toggleExtension}
          toggleCompanyPhone={toggleCompanyPhone}
          toggleFax={toggleFax}
          onChangeHandler={(id, value) => onChangeHandler(id, value)}
          updateUserPersonalProfile={updateUserPersonalProfile}
          isBusinessProfileEditEabled={isBusinessProfileEditEabled}
          OnAddressSelect={(value, id) => OnAddressSelect(value, id)}
        />
      );
    }
  }
  render() {
    return this.renderView();
  }
}

export const {width, height} = Dimensions.get('window');
