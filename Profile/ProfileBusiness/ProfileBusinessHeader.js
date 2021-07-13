import React, { Component } from 'react';
import {
  View,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Keyboard,
} from 'react-native';
import { Thumbnail } from 'native-base';
import images from '../../Images';
import { styles } from './ProfileBusinessHeader.styles';
import {
  Edit,
  Save,
  Cancel,
  Camera,
  PhotoGraph,
  Remove,
} from '../../shared/Icon';
import { CommonStyles, LightGrayColor } from '../../shared/Constants';
import CustomMenuIcon from '../../Custom/MenuIconForHeader';
import { Actions } from 'react-native-router-flux';
export default class Header extends Component {
  getImageSource = () => {
    const { tempUserData, Ispersonal, onProfilePicturePress } = this.props;
    if (Ispersonal) {
      if (tempUserData.image !== null && tempUserData.image !== '') {
        if (global.PersonalPhoto === '') {
          return (
            <TouchableOpacity
              onPress={onProfilePicturePress}
              style={styles.profileImage}>
              <Thumbnail
                large={true}
                source={{
                  uri:
                    global.APIURL +
                    'uploadimgs/ProfilePictures/' +
                    tempUserData.image,
                }}
              />
            </TouchableOpacity>
          );
        } else {
          return (
            <TouchableOpacity
              onPress={onProfilePicturePress}
              style={styles.profileImage}>
              <Thumbnail large source={global.PersonalPhoto} />
            </TouchableOpacity>
          );
        }
      } else {
        return (
          <TouchableOpacity
            onPress={onProfilePicturePress}
            style={styles.blankProfileImage}>
            <Thumbnail
              large
              source={require('../../Images/ProfileIcon.png')}
            // style={{tintColor:"#fff", backgroundColor:"#27becf"}}
            />
          </TouchableOpacity>
        );
      }
    }
    if (
      tempUserData.businessImage !== null &&
      tempUserData.businessImage !== ''
    ) {
      if (global.BusinessLogo === '') {
        return (
          <TouchableOpacity
            onPress={onProfilePicturePress}
            style={styles.profileImage}>
            <Thumbnail
              large
              source={{
                uri:
                  global.APIURL +
                  'uploadimgs/BusinessProfilePictures/' +
                  tempUserData.businessImage,
              }}
            />
          </TouchableOpacity>
        );
      } else {
        return (
          <TouchableOpacity
            onPress={onProfilePicturePress}
            style={styles.profileImage}>
            <Thumbnail large source={global.BusinessLogo} />
          </TouchableOpacity>
        );
      }
    } else {
      return (
        <TouchableOpacity
          onPress={onProfilePicturePress}
          style={styles.blankProfileImage}>
          <Thumbnail
            large
            source={require('../../Images/BusinessProfileIcon1.png')}
          // style={{tintColor:"#fff", backgroundColor:"#27becf"}}
          />
        </TouchableOpacity>
      );
    }
  };
  _handleHeaderRightIcon = () => {
    const { tempUserData } = this.props;
    return (
      <View style={[styles.leftHeader, { borderRadius: 0, backgroundColor: '' }]}>
        <CustomMenuIcon
          menutext="Menu"
          menuStyle={styles.customMenu}
          //Menu Text Style
          textStyle={styles.textMenu}
          //Click functions for the menu items
          option1Click={() => {
            const { tempUserData } = this.props;
            const UserId = tempUserData.guid;
            const Mobile = tempUserData.mobile;
            var CountryCode = tempUserData.countryCode;
            Actions.profileBusiness({
              UserId: UserId,
              Mobile: Mobile,
              CountryCode: CountryCode,
              FirstName: tempUserData.name + ' ' + tempUserData.lastname,
              Title: tempUserData.title,
            });
          }}
          option2Click={() => {
            Actions.businessCard({ userProfile: tempUserData });
          }}
          option3Click={() => {
            Actions.myConnections();
          }}
          option4Click={() => {
            Actions.qrCode({ userProfile: tempUserData });
          }}
          option5Click={() => {
            Actions.referAfriend({
              userProfile: userProfile,
            });
          }}
          option6Click={() => {
            Actions.rateUs({ userProfile: tempUserData });
          }}
          option7Click={() => {
            Actions.settings({
              UserId: tempUserData.guid,
              IsShow: tempUserData.sharecard,
              UserProfile: tempUserData,
            });
          }}
          option8Click={() => {
            Actions.helpCenter({ userProfile: tempUserData });
          }}
          option9Click={() => {
            Actions.premierMembership({ userProfile: tempUserData });
          }}
          // option5Click={() => {
          //   this._handleClearLocalDB();
          // }}
          userProfile={tempUserData}
          IsProfile={false}
          iconColor={'#ffffff'}
        />
      </View>
    );
  };
  getCoverImageSource = () => {
    const { tempUserData, Ispersonal, onCoverPiturePress } = this.props;
    if (Ispersonal) {
      if (
        tempUserData.profielCoverImage !== null &&
        tempUserData.profielCoverImage !== ''
      ) {
        if (global.PersonalCoverPhoto === '') {
          return (
            <TouchableOpacity
              onPress={onCoverPiturePress}
              style={styles.profileImageBackground}>
              <ImageBackground
                source={{
                  uri:
                    global.APIURL +
                    'uploadimgs/ProfilePictures/' +
                    tempUserData.profielCoverImage,
                }}
                style={styles.profileImageBackground}
              />
            </TouchableOpacity>
          );
        } else {
          return (
            <TouchableOpacity
              onPress={onCoverPiturePress}
              style={styles.profileImageBackground}>
              <ImageBackground
                source={global.PersonalCoverPhoto}
                style={styles.profileImageBackground}
              />
            </TouchableOpacity>
          );
        }
      } else {
        return (
          <TouchableOpacity
            onPress={onCoverPiturePress}
            style={styles.profileImageBackground}>
            <ImageBackground
              source={require('../../Images/bgcolor.png')}
              style={styles.profileImageBackground}
            />
          </TouchableOpacity>
        );
      }
    }
    if (
      tempUserData.businessCoverImage !== null &&
      tempUserData.businessCoverImage !== ''
    ) {
      if (global.BusinessCoverPhoto === '') {
        return (
          <TouchableOpacity
            onPress={onCoverPiturePress}
            style={styles.profileImageBackground}>
            <ImageBackground
              source={{
                uri:
                  global.APIURL +
                  'uploadimgs/BusinessProfilePictures/' +
                  tempUserData.businessCoverImage,
              }}
              style={styles.profileImageBackground}
            />
          </TouchableOpacity>
        );
      } else {
        return (
          <TouchableOpacity
            onPress={onCoverPiturePress}
            style={styles.profileImageBackground}>
            <ImageBackground
              source={global.BusinessCoverPhoto}
              style={styles.profileImageBackground}
            />
          </TouchableOpacity>
        );
      }
    } else {
      return (
        <TouchableOpacity
          onPress={onCoverPiturePress}
          style={styles.profileImageBackground}>
          <ImageBackground
            source={require('../../Images/bgcolor.png')}
            style={styles.profileImageBackground}
          />
        </TouchableOpacity>
      );
    }
  };
  _handleOnEditPress = () => {
    const { onEditPress } = this.props;
    onEditPress();
    // this.refs.myInput.focus();
  };
  _handleOnCameraPress = () => {
    const { onCameraPress } = this.props;
    onCameraPress();
  };
  _handleOnGalleryPress = () => {
    const { onGalleryPress } = this.props;
    onGalleryPress();
  };
  render() {
    const {
      isEditUserData,
      onUserDataUpdate,
      onUserDataModalClose,
      tempUserData,
      Ispersonal,
      onFirstNameChange,
      onLastNameChanged,
      onCompanyNameChanged,
      onJobTitleChanged,
      isShowTabs,
      onClosePress,
      onCompanyTagLineChanged,
      onRemovePress,
    } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <View style={{ flex: 0.5 }}>
            {this.getCoverImageSource()}
            {this.getImageSource()}
          </View>
          <View style={styles.viewImageProfileDetailsBackground}>
            <ImageBackground
              style={styles.profileDetailsBackground}
              source={images.personalProfileBackgroundImage1}>
              {/* <View>
            {this.getImageSource()}
            </View> */}
              {isEditUserData ? (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'flex-end',
                    justifyContent: 'flex-end',
                    marginRight: 20,
                    zIndex: 999,
                    top: 10
                  }}>
                  <View style={{ marginRight: 10 }}>
                    <TouchableOpacity
                      onPress={() => onUserDataUpdate(tempUserData)}>
                      <Save style={styles.iconProfileDetailsEdit} />
                    </TouchableOpacity>
                  </View>
                  <View>
                    <TouchableOpacity onPress={onUserDataModalClose}>
                      <Cancel style={styles.iconProfileDetailsEdit} />
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View style={styles.viewEditProfile}>
                  <TouchableOpacity onPress={() => this._handleOnEditPress()}>
                    <Edit style={styles.iconProfileDetailsEdit} />
                  </TouchableOpacity>
                </View>
              )}
              <View style={{ flex: 1 }}>
                {Ispersonal ? (
                  <View style={styles.viewProfileDetails}>
                    <View style={{ flexDirection: 'row', top: 5, marginTop: "1%" }}>
                      <View>
                        <TextInput
                          ref="myInput"
                          style={{
                            left: 10,
                            color: '#000',
                            fontWeight: 'bold',
                            textAlign: "right",
                            top: 3,
                            marginHorizontal: 3,
                          }}
                          maxLength={15}
                          placeholder={'First Name'}
                          onChangeText={value => {
                            onFirstNameChange(value);
                          }}
                          value={
                            tempUserData.name == null || tempUserData.name === 'null'
                              ? ''
                              : tempUserData.name
                          }
                          editable={isEditUserData}
                        // autoFocus={true}
                        />
                      </View>
                      <View>
                        <TextInput
                          ref="myInput"
                          style={{
                            color: '#000',
                            fontWeight: 'bold',
                            textAlign: "left",
                            top: 3,
                            marginHorizontal: 3,
                          }}
                          maxLength={15}
                          placeholder={'Last Name'}
                          onChangeText={value => {
                            onLastNameChanged(value);
                          }}
                          value={
                            tempUserData.lastname == null ||
                              tempUserData.lastname === 'null'
                              ? ''
                              : tempUserData.lastname
                          }
                          editable={isEditUserData}
                        // autoFocus={true}
                        />
                      </View>
                    </View>
                    <View style={{ bottom: 15 }}>
                      <TextInput
                        placeholder={'Title'}
                        maxLength={15}
                        onChangeText={value => {
                          onJobTitleChanged(value);
                        }}
                        style={{
                          color: '#000',
                        }}
                        value={
                          tempUserData.title == null ||
                            tempUserData.title === 'null'
                            ? ''
                            : tempUserData.title
                        }
                        editable={isEditUserData}
                      />
                    </View>
                  </View>
                ) : (
                  <View style={styles.viewProfileDetails}>
                    <View style={{ top: 5, marginTop: "1%" }}>
                      <View >
                        <TextInput
                          ref="myInput"
                          style={{
                            color: '#000',
                            fontWeight: 'bold',
                            textAlign: 'center',
                            top: 13,
                          }}
                          placeholder={'Company name'}
                          onChangeText={value => {
                            onCompanyNameChanged(value);
                          }}
                          value={
                            tempUserData.companyname == null &&
                              tempUserData.companyname === 'null'
                              ? ''
                              : tempUserData.companyname
                          }
                          editable={isEditUserData}
                          maxLength={30}
                        />
                      </View>
                      <View >
                        <TextInput
                          placeholder={'Tagline'}
                          placeholderTextColor="#808080"
                          maxLength={30}
                          style={{
                            bottom: 17,
                            color: (tempUserData.companytagline == null ||
                              tempUserData.companytagline === 'null') ||
                              tempUserData.companytagline === 'Tagline' ? "#808080" : '#000',
                            textAlign: 'center',
                            //width: 250
                          }}
                          onChangeText={value => {
                            onCompanyTagLineChanged(value);
                          }}
                          numberOfLines={1}
                          value={
                            (tempUserData.companytagline == null ||
                              tempUserData.companytagline === 'null') ||
                              tempUserData.companytagline === 'Tagline'
                              ? 'Tagline'
                              : tempUserData.companytagline
                          }
                          editable={isEditUserData}
                        />
                      </View>
                    </View>
                  </View>
                )}
              </View>
            </ImageBackground>
          </View>
          <View
            style={{
              flex: 1,
              position: 'absolute',
              left: Dimensions.get('window').width - 40,
              margin: 10,
            }}>
            {this._handleHeaderRightIcon()}
          </View>

        </View>
        {isShowTabs ? (
          <View
            style={{
              flex: 1,
              position: 'absolute',
              left: Dimensions.get('window').width / 2 + 90,
              top: 50,
            }}>
            <View style={styles.Tabs}>
              <View style={{ flex: 0.5, paddingTop: 10 }}>
                <TouchableOpacity
                  onPress={() => this._handleOnCameraPress(this)}>
                  <Camera
                    style={{ color: LightGrayColor.fontColor, fontSize: 25 }}
                  />
                </TouchableOpacity>
              </View>
              <View style={{ flex: 0.5 }}>
                <TouchableOpacity
                  onPress={() => this._handleOnGalleryPress(this)}>
                  <PhotoGraph
                    style={{ color: LightGrayColor.fontColor, fontSize: 25 }}
                  />
                </TouchableOpacity>
              </View>
              <View style={{ flex: 0.5 }}>
                <TouchableOpacity onPress={onRemovePress}>
                  <Remove
                    style={{ color: LightGrayColor.fontColor, fontSize: 25 }}
                  />
                </TouchableOpacity>
              </View>
              <View style={{ flex: 0.5 }}>
                <TouchableOpacity onPress={onClosePress}>
                  <Cancel
                    style={{ color: LightGrayColor.fontColor, fontSize: 25 }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ) : null}
      </View>
    );
  }
}

export const { width, height } = Dimensions.get('window');