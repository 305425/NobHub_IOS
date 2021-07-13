import React, {Component} from 'react';
import {
  View,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  FlatList,
  StyleSheet,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {connect} from 'react-redux';
import {goBack} from '../Services/BackButtonServices';
import {Flip} from '../shared/Icon';
import {setUserProfile, clearUserProfile} from '../state/operations';
import FlipComponent from 'react-native-flip-component';
class ChooseBusinessCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      CardId: 0,
    };
  }
  _handleOnPopularPressFlip = CardId => {
    // if (this.state.CardId != CardId) {
    //   this.setState({CardId: CardId});
    // } else {
    //   this.setState({CardId: 0});
    // }
    const {onFlipPopularCardPress} = this.props;
    onFlipPopularCardPress(CardId);
  };
  _handleOnOtherPressFlip = CardId => {
    const {onFlipOtherCardPress} = this.props;
    onFlipOtherCardPress(CardId);
  };
  _handleApplySelectedTheme = CardId => {
    const {onSelectCard} = this.props;
    onSelectCard(CardId);
  };
  renderItem = item => {
   // console.log("RenderData",item)
    return (
      <View
        style={{
          flex: 1,
          marginLeft: 10,
          marginBottom: 10,
        }}>
        <TouchableOpacity
          onPress={() => this._handleApplySelectedTheme(item.cardId)}>
          <FlipComponent
            isFlipped={item.check ? true : false}
            frontView={
              <View style={styles.categoriesView}>
                <FastImage
                  style={{flex: 1, overflow:"hidden", borderRadius:10}}
                  resizeMode={FastImage.resizeMode.stretch}
                  imageStyle={{borderRadius: item.borderradius}}
                  source={{
                    uri:
                      global.APIURL +
                      'uploadimgs/samplecards/' +
                      item.sampleCardfrontfile,
                  }}
                />
              </View>
            }
            backView={
              <View style={styles.categoriesView}>
                <FastImage
                  style={{flex: 1, overflow:"hidden", borderRadius:10}}
                  imageStyle={{borderRadius: item.borderradius}}
                  source={{
                    uri:
                      global.APIURL +
                      'uploadimgs/samplecards/' +
                      item.sampleCardbackfile,
                  }}
                  resizeMode={FastImage.resizeMode.stretch}
                />
              </View>
            }
          />
        </TouchableOpacity>
        {item.sampleCardfrontfile != null && item.sampleCardfrontfile != '' ? (
          <View style={styles.FlipIconView}>
            <TouchableOpacity
              onPress={() => this._handleOnOtherPressFlip(item.cardId)}>
              <Flip />
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    );
  };
  renderSeparator = () => {
    return <View style={{width: '100%'}} />;
  };
  renderPopularCardsItem = item => {
   // console.log("CardChoose Item", item)
    return (
      <View
        style={{
          flex: 1,
          marginLeft: 10,
          marginBottom: 10,
          flexDirection: 'row',
        }}>
        <TouchableOpacity
          onPress={() => this._handleApplySelectedTheme(item.cardId)}>
          <FlipComponent
            isFlipped={item.check ? true : false}
            frontView={
              <View style={styles.categoriesView}>
                <FastImage
                  style={{flex: 1, overflow:"hidden", borderRadius:10}}
                  imageStyle={{borderRadius: item.borderradius}}
                  resizeMode={FastImage.resizeMode.stretch}
                  source={{
                    uri:
                      global.APIURL +
                      'uploadimgs/samplecards/' +
                      item.sampleCardfrontfile,
                  }}
                />
              </View>
            }
            backView={
              <View style={styles.categoriesView}>
                <FastImage
                  style={{flex: 1, overflow:"hidden", borderRadius:10}}
                  imageStyle={{borderRadius: item.borderradius}}
                  resizeMode={FastImage.resizeMode.stretch}
                  source={{
                    uri:
                      global.APIURL +
                      'uploadimgs/samplecards/' +
                      item.sampleCardbackfile,
                  }}
                />
              </View>
            }
          />
        </TouchableOpacity>
        {item.sampleCardfrontfile != null && item.sampleCardfrontfile != '' ? (
          <View style={styles.FlipIconView}>
            <TouchableOpacity
              onPress={() => this._handleOnPopularPressFlip(item.cardId)}>
              <Flip />
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    );
  };

  render() {
    const {CategoryCards, IsHorizontal} = this.props;
   // console.log("CategoryCardsLength",CategoryCards.length)
    return (
      <View style={{flex: 1}}>
        {IsHorizontal ? (
          <View style={{flex: 1, marginTop: 10}}>
            <FlatList
              data={CategoryCards}
              renderItem={item => this.renderPopularCardsItem(item.item)}
              horizontal={true}
            />
          </View>
        ) : (
          <View style={{flex: 1, marginTop: 10}}>
            <FlatList
              data={CategoryCards}
              numColumns={2}
              initialNumToRender={2}
              maxToRenderPerBatch={10}
              keyExtractor={(item)=>{return item.cardId}}
              renderItem={item => this.renderItem(item.item)}
              ItemSeparatorComponent={this.renderSeparator}
            />
          </View>
        )}
      </View>
    );
  }
}
const styles = StyleSheet.create({
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
  FlipIconView: {
    position: 'absolute',
    right: 10,
    top: 5,
    height: 30,
    width: 30,
    borderRadius: 75,
    backgroundColor: '#ffffff',
  },
  TextInputStyleClass: {
    flex: 2,
    height: 18,
    paddingRight: 90,
  },
  iconSearch: {flex: 1, fontSize: 17, color: '#a9a9a9'},
  categoriesView: {
    width: Dimensions.get('window').width / 2.2,
    height: Dimensions.get('window').width / 1.5,
    flex: 1,
    alignItems: 'stretch',
    //alignSelf: 'center',
    //justifyContent: 'center',
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
)(ChooseBusinessCard);
