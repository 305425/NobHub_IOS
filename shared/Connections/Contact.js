import React, { Component } from 'react';
import { View, TouchableOpacity, TextInput } from 'react-native';
import { styles } from './Contact.styles';
import Images from '../../Images';
import { Thumbnail } from 'native-base';
import { Text, MediumBoldText } from '../Text';
import { CommonStyles } from '../Constants';
import { CircleCheck, Cross } from '../Icon';
import ImageViewer from 'react-native-image-zoom-viewer';
import Modal from 'react-native-modal';
const colors= [
  '#994F14','#DA291C','#FFCD00','#007A33', '#27BECF','#EB9CA8', '#7C878E',
  '#8A004F','#000000','#10069F','#00a3e0','#4CC1A1'
]
export default class ContactsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalVisible: false,
      selectedUserData: {}
    };
  }
  openModal = (contactData) => {
    this.setState({
      isModalVisible: true,
      //currentImageIndex: index
      selectedUserData: contactData,
    })
  }
  toggleModal = () => {
    this.setState({
      isModalVisible: !this.state.isModalVisible
    })
  }
  closeModal = () => {
    this.setState({
      isModalVisible: false,
      //customStarCount: 0
    })
  }
  _renderImageData = () => {
    const {contactData,contactIndex} = this.props;
    if (contactData.image !== '' && contactData.image !== null) {
      return (
        <TouchableOpacity onPress={() => this.openModal(contactData)} style={{ flexDirection: 'row', position: 'relative' }}>
          <Thumbnail
            medium
            source={{
              uri:
                global.APIURL +
                'uploadimgs/ProfilePictures/' +
                contactData.image,
            }}
          />
          {contactData.check ? (
            <View style={styles.CircleView}>
              <CircleCheck
                style={{
                  color: CommonStyles.appColor,
                  fontSize: 13,
                  marginTop: 4,
                }}
              />
            </View>
          ) : null}
        </TouchableOpacity>
      );
    }
    //return <Thumbnail medium source={Images.defaultProfile} />;
    return (
      <View style={{ flexDirection: 'column',
      height: 55,
      width: 55,
      borderRadius: 110,
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      backgroundColor: colors[contactIndex%colors.length]}}>
        <MediumBoldText
          style={{
            fontSize: 22,
            color: '#ffffff',
            textAlign: 'center',
          }}>
          {contactData.initials}
        </MediumBoldText>
        {contactData.check ? (
          <View style={styles.CircleView}>
            <CircleCheck
              style={{
                color: CommonStyles.appColor,
                fontSize: 13,
                marginTop: 4,
              }}
            />
          </View>
        ) : null}
      </View>
    );
  };
  _renderContactDetails = () => {
    const { contactData } = this.props;
    return (
      <View style={styles.viewContactDetails}>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 2 }}>
            <MediumBoldText style={styles.textName}>
              {contactData.displayname}
            </MediumBoldText>
            <Text style={styles.textDesignation}>
              {contactData.title + ', ' + contactData.companyname}
            </Text>
            <Text style={styles.textDesignation}>
              {contactData.connectedStatus}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  render() {
    const { contactData, onContactPress, OnLongPress } = this.props;
    return (
      <TouchableOpacity
      style={{flex: 1}}
      onPress={() => onContactPress(contactData)}
      onLongPress={() => OnLongPress(contactData)}>
      <View style={styles.viewContactContainer}>
        <View style={[styles.viewContact]}>
          <View style={styles.viewFabContainer}>
            {this._renderImageData()}
          </View>
          {this._renderContactDetails()}
        </View>
      </View>
          <View>
          <Modal
              animationIn="slideInUp"
              animationOut="slideOutDown"
              onBackdropPress={() => this.closeModal()}
              onSwipeComplete={() => this.closeModal()}
              onBackButtonPress={() => this.closeModal()}
              swipeDirection="right"
              isVisible={this.state.isModalVisible}
            //backdropColor="transparent"
            >
              <View style={styles.containerModal}>
                <View style={styles.modal}>
                  <ImageViewer imageUrls={[{
                    url: global.APIURL +
                      'uploadimgs/ProfilePictures/' +
                      this.state.selectedUserData.image,
                    props: {}
                  }]} />
                </View>
                <TouchableOpacity onPress={() => this.closeModal()}>
                  <Cross
                    style={{
                      fontSize: 40,
                      color: "white",
                    }}
                  />
                </TouchableOpacity>
              </View >
            </Modal>
          </View>
        </TouchableOpacity>
    );
  }
}