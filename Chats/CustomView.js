import PropTypes from 'prop-types';
import React from 'react';
import {
    View,
    WebView,
    Image,
    Linking,
    Platform,
    StyleSheet,
    TouchableOpacity,
    ViewPropTypes,
    Text
} from 'react-native';
import { Actions } from 'react-native-router-flux';
//import apiConfig from '../../config/client.js';
//import Lightbox from 'react-native-lightbox';

export default class CustomView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            image: this.props.currentMessage.image ? this.props.currentMessage.image.split('//')[1] : ""
        }
        let newData =this.props.currentMessage.image ? this.props.currentMessage.image.toLowerCase().match(/\.(jpg|png|gif|jpeg|pdf|undefined)/g)[0] :""
        console.log("Image",this.props.currentMessage.image?  newData :this.props.currentMessage);
    }

    renderPdf() {
        let image = this.state.image;
      //  console.log("Image", this.props.currentMessage);
        return (
            <TouchableOpacity onPress={() => {console.log('Press!!');
            Linking.openURL(`https://docs.google.com/viewerng/viewer?url=${image}`)}
            }>
             <View>
                      <Text>Some sample text</Text>
               </View>
          </TouchableOpacity>
            //     <TouchableOpacity style={[styles.container, this.props.containerStyle]} onPress={() => {
            //         console.log("Image onPress", image);
            //         Linking.openURL(`https://docs.google.com/viewerng/viewer?url=${image}`)

            //     }}>
            //         {/* <Image
            //   {...this.props.imageProps}
            //   style={[styles.image, this.props.imageStyle]}
            //   source={{uri: `${apiConfig.url}/images/messages/${this.props.currentMessage._id}/preview.jpg`}}
            // /> */}
            //     </TouchableOpacity>
        );
    }

    renderHtml() {
        return (
            <TouchableOpacity style={[styles.container, this.props.containerStyle]} onPress={() => {
                Actions.chat_html({ properties: this.props.currentMessage });
            }}>
                <Image
                    {...this.props.imageProps}
                    style={[styles.image, this.props.imageStyle]}
                    source={{ uri: this.props.currentMessage.template_image }}
                />
            </TouchableOpacity>
        );
    }

    render() {
        if (this.props.currentMessage.image && this.props.currentMessage.image.toLowerCase().match(/\.(jpg|png|gif|jpeg|pdf|undefined)/g)[0] == '.pdf') {
            return this.renderPdf();
          } else if (this.props.currentMessage.template && this.props.currentMessage.template != 'none') {
            return this.renderHtml();
          }
          return null;
        
    }
}

const styles = StyleSheet.create({
    container: {
    },
    mapView: {
        width: 150,
        height: 100,
        borderRadius: 13,
        margin: 3,
    },
    image: {
        width: 150,
        height: 100,
        borderRadius: 13,
        margin: 3,
        resizeMode: 'cover'
    },
    webview: {
        flex: 1,
    },
    imageActive: {
        flex: 1,
        resizeMode: 'contain',
    },
});

CustomView.defaultProps = {
    mapViewStyle: {},
    currentMessage: {
        image: null,
        file_type: null,
        template: null,
        template_html: null,
    },
    containerStyle: {},
    imageStyle: {},
};

CustomView.propTypes = {
    currentMessage: PropTypes.object,
    containerStyle: ViewPropTypes.style,
    mapViewStyle: ViewPropTypes.style,
    imageStyle: Image.propTypes.style,
    imageProps: PropTypes.object,
};