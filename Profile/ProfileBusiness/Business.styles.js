import { CommonStyles } from '../../shared/Constants';
export const styles = {
  scrollviewstyle: { marginTop: 10, marginRight: 20, marginBottom: 20 },
  viewSingleElementInRow: {
    flex: 1,
    paddingVertical: 5,
  },
  viewSingleElementInRow1: {
    flex: 1,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    //backgroundColor:"red",
    //paddingBottom: 5,
  },
  viewMultipleElementsInRow: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 5,
    borderBottomColor: "gray",
    borderBottomWidth: 1
  },
  viewFlex2: { flex: 1 },
  viewFlex1: { flex: 1 },
  viewSwitch: { flex: 0.5, marginTop: 10, zIndex: 999, },
  labelTextColor: { fontSize: 15, color: '#6e8f94' },

  CompanyAddressTextInputContainer: {
    height: 50,
    borderBottomColor: '#6e8f94',
    //borderBottomWidth: 1,
    borderTopWidth: 0,
    backgroundColor: '#f4f6f9',
    borderBottomStartRadius: 25,
    borderBottomEndRadius: 25,

  },
  CompanyAddressTextInput: {
    backgroundColor: '#f4f6f9',
    marginLeft: 5,
  },
  CompanyAddressTextInputDescription: {
    fontWeight: 'bold',
    backgroundColor: '#f5f6fa',
    borderBottomColor: '#6e8f94',
    borderBottomWidth: 0.2,
    marginLeft: 10,
    padding: 7,
  },
  professionAutoCompleteView: {
    borderRadius: 10,
    position: 'relative',
    color: '#000',
    fontSize: 16,
    paddingVertical: 15,
    paddingLeft: 5,
    paddingRight: 7,
    paddingTop: 2,
    paddingBottom: 2,
    marginLeft:10
  },
  autocompleteContainer: {
    borderColor: 'transparent',
    fontSize: 15,
  },
  professionRender: {
    //marginVertical: 3,
    flex: 1,
    borderBottomColor: '#000000',
    borderBottomWidth: 0.2,
    height: 40,
    backgroundColor: "#f5f6fa",
    justifyContent: "center"
  },
  professionTouchableView: {
    flexDirection: 'column',
    alignSelf: 'flex-start',
    marginLeft: 15,
  },
  profText: {
    color: 'black',
    fontSize: 15,
    textAlign: 'left',
    marginRight: 40,
    flexWrap: 'wrap',
    fontWeight: "bold",
  },
  dropDownProfession: {
    fontSize: 15,
    color: "gray",
    // position:"absolute",
    alignSelf: "flex-end",
    //bottom:20
  },
};