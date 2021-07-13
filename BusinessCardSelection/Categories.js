import React, {Component} from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  StyleSheet,
  Alert,
  BackHandler,
  ScrollView,
  Keyboard,
  Text,
  Dimensions,
  Platform,
} from 'react-native';
import {connect} from 'react-redux';
import {goBack} from '../Services/BackButtonServices';
import {Actions} from 'react-native-router-flux';
import CommonHeader from '../shared/CommonHeader';
import {ArrowLeft, Search, Cancel} from '../shared/Icon';
import {CommonStyles} from '../shared/Constants';
import {BoldText} from '../shared/Text';
import ChooseCards from './ChooseBusinessCard';
import CustomMenuIcon from '../Custom/MenuIconForHeader';
import {setUserProfile, clearUserProfile} from '../state/operations';
class CardCategories extends Component {
  constructor(props) {
    const {CategorieId} = props;
    super(props);
    this.state = {
      SearchValue: '',
      IsShowCardsView: false,
      CategorieId: CategorieId,
      IsCancel: false,
      SearchPlaceHolder: 'Search..',
      CategoryName: '',
      leftArrowVisible: true,
      rightArrowVisible: true,
      scrollViewWidth: 0,
      currentXOffset: 0,
      TextInputPlaceHolder: 'CardName',
      otherCardDetails: [],
      tempotherCardDetails: [],
      popularCardDetails: [],
      temppopularCardDetails: [],
    };
    BackHandler.addEventListener('hardwareBackPress', this.back_Button_Press);
  }
  leftArrow = () => {
    var eachItemOffset = this.state.scrollViewWidth / 10; // Divide by 10 because I have 10 <View> items
    var _currentXOffset = this.state.currentXOffset - eachItemOffset;
    this.refs.scrollView.scrollTo({x: _currentXOffset, y: 0});
  };
  rightArrow = () => {
    var eachItemOffset = this.state.scrollViewWidth / 10; // Divide by 10 because I have 10 <View> items
    var _currentXOffset = this.state.currentXOffset + eachItemOffset;
    this.refs.scrollView.scrollTo({x: _currentXOffset, y: 0, animated: true});
  };
  back_Button_Press = () => {
    global.BusinessCardSelection.setState({
      BusinessCardTabColor: ['rgb(255,255,255)', 'rgb(255,255,255)'],
      EditBusinessCardTabColor: ['rgb(255,255,255)', 'rgb(255,255,255)'],
      BusinessCardIconColor: '#777777',
      EditBusinessCardIconColor: '#777777',
    });
  };
  _handleGetCategoryCards = categorieID => {
    try {
      fetch(
        global.APIURL +
          `api/Card/GetCardsByCategoryId?CategoryId=${categorieID}`,
        {
          method: 'GET',
        },
      )
        .then(response => response.json())
        .then(responseJson => {
          this.setState({
            otherCardDetails: responseJson.otherCards,
            tempotherCardDetails: responseJson.otherCards,
            popularCardDetails: responseJson.popularList,
            temppopularCardDetails: responseJson.popularList,
          });
          this._handleGetOtherCards();
          this._handleGetPopularCard();
        });
    } catch (e) {
      Alert.alert(e.message);
    }
  };
  componentDidMount = () => {
    const {CategorieId, CardCategories} = this.props;
    this._handleGetCategoryCards(CategorieId);
  //  const {UserProfile} = this.props;
   // let initialData = CardCategories.filter(x=>{return x.categorieName === UserProfile.profession})[0]
    // this.setState({CategoryName: initialData && initialData.categorieName ? initialData.categorieName: "", 
    //                CategorieId: initialData && initialData.categorieID ? initialData.categorieID : CategorieId});
    // this._handleGetCategoryCards(initialData.categorieID ? initialData.categorieID : CategorieId);
  };
  _handleRedirectToChooseCard = (categoryID, CategoryName) => {
    this.setState({CategoryName: CategoryName, CategorieId: categoryID});
    this._handleGetCategoryCards(categoryID);
  };
  renderItem = ({item}) => {
    return (
      <View style={styles.categoriesView}>
        <TouchableOpacity
          onPress={() => {
            this._handleRedirectToChooseCard(
              item.categorieID,
              item.categorieName,
            );
          }}>
          <View
            style={{
              height: 50,
              width: 50,
              borderRadius: 70,
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
              backgroundColor: '#ffffff',
            }}>
            <Image
              style={styles.image}
              source={{
                uri: global.APIURL + 'uploadimgs/categoryIcons/' + item.image,
              }}
            />
          </View>
        </TouchableOpacity>
        <View style={{width: 80}}>
          <Text
            style={[
              styles.categoryText,
              {
                color:
                  item.categorieID == this.state.CategorieId
                    ? CommonStyles.appColor
                    : '#000',
              },
            ]}>
            {item.categorieName}
          </Text>
        </View>
      </View>
    );
  };
  _handleHeaderRightIcon = () => {
    return null;
  };
  _handleHeaderLeftIconPress = () => {
    const {handleGoBack} = this.props;
    global.BusinessCardSelection.setState({
      BusinessCardTabColor: ['rgb(255,255,255)', 'rgb(255,255,255)'],
      EditBusinessCardTabColor: ['rgb(255,255,255)', 'rgb(255,255,255)'],
      BusinessCardIconColor: '#777777',
      EditBusinessCardIconColor: '#777777',
    });
    handleGoBack();
  };
  _handleHeaderText = () => {
    return (
      <View>
        <BoldText style={{color: '#ffffff', fontSize: 16, textAlign: 'center'}}>
          Cards & Category
        </BoldText>
      </View>
    );
  };
  _handleHeaderLeftIcon = () => {
    return (
      <View style={styles.leftHeader}>
        <ArrowLeft style={{color: CommonStyles.appColor, fontSize: 20}} />
      </View>
    );
  };
  onCardDetailsSearch = value => {
    var objotherCards = [];
    var objpopularCards = [];
    this.setState({SearchValue: value, IsCancel: true});
    value = value.trim().toLowerCase();
    objotherCards = this.state.tempotherCardDetails.filter(_cards => {
      if (
        _cards.cardname != null &&
        _cards.cardname.toLowerCase().match(value)
      ) {
        return true;
      }
    });
   // console.log("CardDetailsSearch",objotherCards)
    this.setState({otherCardDetails: objotherCards});
    objpopularCards = this.state.temppopularCardDetails.filter(_cards => {
      if (
        _cards.cardname != null &&
        _cards.cardname.toLowerCase().match(value)
      ) {
        return true;
      }
    });
    this.setState({popularCardDetails: objpopularCards});
    if (value === '') {
      this.setState({IsCancel: false});
    }
    this._handleGetOtherCards();
    this._handleGetPopularCard();
  };
  _handleOnkeyPress = Element => {
    if (Element.key === 'Backspace') {
      if (this.state.SearchValue.length === 0) {
        Keyboard.dismiss();
      }
    }
  };
  _handleHeaderCenterIcon = () => {
    return (
      <View style={styles.headerCenterView}>
        <View
          style={{
            flex: 0.4,
            paddingTop: 10,
            marginLeft: 8,
            flexDirection: 'row',
          }}>
          <Search style={styles.iconSearch} />
        </View>
        <View style={{flex: 1.5}}>
          <TextInput
            underlineColorAndroid={'rgba(0,0,0,0)'}
            placeholder={this.state.TextInputPlaceHolder}
            placeholderTextColor={'#a9a9a9'}
            style={styles.TextInputStyleClass}
            onChangeText={value => this.onCardDetailsSearch(value)}
            onFocus={() => this._handleOnTextInputFocus()}
            value={this.state.SearchValue}
            onKeyPress={({nativeEvent}) => {
              this._handleOnkeyPress(nativeEvent);
            }}
          />
        </View>
        <View style={styles.viewScanner}>
          {this.state.IsCancel ? (
            <View style={{flex: 0.8, marginTop: 10}}>
              <TouchableOpacity onPress={() => this._handleOnClearPress()}>
                <Cancel style={styles.icnScanner} />
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
      </View>
    );
  };
  _handleOnTextInputFocus = () => {
    this.setState({IsCancel: true});
  };
  _handleOnClearPress = () => {
    this.onCardDetailsSearch('');
    Keyboard.dismiss();
    this.setState({
      SearchValue: '',
      IsCancel: false,
    });
  };
  _handleHeaderProfileIcon = () => {
    const {UserProfile} = this.props;
    return (
      <View
        style={[
          styles.leftHeader,
          {borderRadius: 0, backgroundColor: '', right: 8},
        ]}>
        <CustomMenuIcon
          menutext="Menu"
          menuStyle={styles.headerCustomMenu}
          //Menu Text Style
          textStyle={styles.headerTextMenu}
          //Click functions for the menu items
          option1Click={() => {
            const {UserProfile} = this.props;
            const UserId = UserProfile.guid;
            const Mobile = UserProfile.mobile;
            var CountryCode = UserProfile.countryCode;
            Actions.profileBusiness({
              UserId: UserId,
              Mobile: Mobile,
              CountryCode: CountryCode,
              FirstName: UserProfile.name + ' ' + UserProfile.lastname,
              Title: UserProfile.title,
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
          userProfile={UserProfile}
          IsProfile={false}
          iconColor={'#ffffff'}
        />
      </View>
    );
  };
  _handleOnFlipPopularCardPress = CardId => {
    try {
      var _popularCards = this.state.popularCardDetails;
      _popularCards.map(data => {
        if (data.cardId === CardId) {
          data.check = !data.check;
        }
        this.setState({popularCardDetails: _popularCards});
      });
    } catch (e) {
      Alert.alert(e.message);
    }
  };
  _handleOnFlipOtherCardPress = CardId => {
    try {
      var _otherCards = this.state.otherCardDetails;
      _otherCards.map(data => {
        if (data.cardId === CardId) {
          data.check = !data.check;
        }
        this.setState({otherCardDetails: _otherCards});
      });
    } catch (e) {
      Alert.alert(e.message);
    }
  };
  _handleGetPopularCard = () => {
    const {UserProfile} = this.props;
    return (
      <View style={{flex: 1, marginRight:10}}>
        <ChooseCards
          CategoryCards={this.state.popularCardDetails}
          UserProfile={UserProfile}
          IsHorizontal={true}
          onSelectCard={CardId => this._handleApplySelectedTheme(CardId)}
          onFlipPopularCardPress={CardId =>
            this._handleOnFlipPopularCardPress(CardId)
          }
        />
      </View>
    );
  };
  _handleGetOtherCards = () => {
    const {UserProfile} = this.props;
    return (
      <ChooseCards
        CategoryCards={this.state.otherCardDetails}
        UserProfile={UserProfile}
        IsHorizontal={false}
        onSelectCard={CardId => this._handleApplySelectedTheme(CardId)}
        onFlipOtherCardPress={CardId =>
          this._handleOnFlipOtherCardPress(CardId)
        }
      />
    );
  };
  _handleApplySelectedTheme = CardId => {
    const {userProfile} = this.props;
    try {
      var dataToSend = {
        Theme: CardId,
        UserId: userProfile.guid,
      };
      var formBody = [];
      for (var key in dataToSend) {
        var encodedKey = encodeURIComponent(key);
        var encodedValue = encodeURIComponent(dataToSend[key]);
        formBody.push(encodedKey + '=' + encodedValue);
      }
      formBody = formBody.join('&');
      fetch(global.APIURL + 'api/Card/UpdateCardThemeforUser', {
        method: 'POST', //Request Type
        body: formBody, //post body
        headers: {
          //Header Defination
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
      })
        .then(response => response.json())
        .then(responseJson => {
          var obj = responseJson;
          this.props.clearUserProfile();
          this.props.setUserProfile(obj);
          Actions.businessCard({userProfile: obj});
        });
    } catch (e) {
      Alert.alert(e.message);
    }
  };
  render() {
    const {CardCategories} = this.props;
  //  console.log("CardCategories",CardCategories)
    return (
      <View style={styles.container}>
        <View style={styles.headerFlex}>
          <CommonHeader
            HeaderLeftIcon={() => this._handleHeaderLeftIcon()}
            HeaderRightIcon={() => this._handleHeaderRightIcon()}
            HeaderCenterIcon={() => this._handleHeaderCenterIcon()}
            HeaderLeftIconPress={this._handleHeaderLeftIconPress}
            HeaderText={() => this._handleHeaderText()}
            HeaderProfileIcon={() => this._handleHeaderProfileIcon()}
            HeaderProfileIconPress={this._handleHeaderProfileIconPress}
            IsShowTextForTabs={false}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 10,
            flex: 0.17,
          }}>
          <FlatList
            data={CardCategories}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            renderItem={item => this.renderItem(item)}
          />
        </View>
        <View style={{borderWidth:0.9, borderColor:"gray"}}/>
        <ScrollView style={{flex: 2}}>
          <View style={{flex: 0.1, margin: 5}}>
            <BoldText>Popular Cards</BoldText>
          </View>
          {this._handleGetPopularCard()}
          <View style={{borderWidth:0.9, borderColor:"gray"}}/>
          <View style={{flex: 1}}>
            <View
              style={{
                flex: 0.1,
                // borderBottomWidth: 0.9,
                // borderColor: 'gray',
              }}
            />
            {this._handleGetOtherCards()}
          </View>
        </ScrollView>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f9',
  },
  iconSearch: {flex: 1, fontSize: 17, color: '#a9a9a9'},
  TextInputStyleClass: {
    flex: 2,
  },
  image: {
    width: 50,
    height: 40,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  categoryText: {
    flexWrap: 'wrap',
    fontSize: 13,
    textAlign: 'center',
  },
  headerFlex: {
    flex: 0.22,
  },
  viewAll: {
    flex: 0.12,
    margin: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoriesView: {
    flex: 0.2,
    marginRight: 10,
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
  headerCustomMenu: {
    marginRight: 5,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderRadius: 100,
  },
  headerTextMenu: {
    color: 'red',
  },
  viewScanner: {
    flex: 0.3,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    right: Platform.OS == 'android' ? 10 : 20,
    //marginTop: 5,
    //marginRight: 10,
  },
  icnScanner: {color: '#a9a9a9', fontSize: 16},
  headerCenterView: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    top:10
  },
});
const mapStateToProps = state => {
  return {
    userProfile: state.user.userProfile,
  };
};
const mapDispatchToProps = {
  setUserProfile,
  clearUserProfile,
  handleGoBack: goBack,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CardCategories);
