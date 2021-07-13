import React, {Component} from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
export default class Accordian extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data,
      expanded: false,
    };
  }

  render() {
    return (
      <View>
        <TouchableOpacity
          style={styles.row}
          onPress={() => this.toggleExpand()}>
          <Text style={[styles.title, styles.font]}>{this.props.title}</Text>
        </TouchableOpacity>
        <View style={styles.parentHr} />
        {this.state.expanded && (
          <View style={styles.child}>
            <Text>{this.props.data}</Text>
          </View>
        )}
      </View>
    );
  }

  toggleExpand = () => {
    this.setState({expanded: !this.state.expanded});
  };
}

const styles = StyleSheet.create({
  title: {
    fontSize: 14,
    fontWeight: 'bold',

    //  color: Colors.DARKGRAY,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 36,
    paddingLeft: 25,
    paddingRight: 18,
    margin: 2,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
  },
  parentHr: {
    height: 1,
    color: 'blue',
    width: '100%',
  },
  child: {
    //  backgroundColor: 'pink',
    padding: 12,
    borderWidth: 1,
  },
});
