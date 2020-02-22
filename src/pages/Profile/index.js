import React, { Component } from 'react';
import { WebView } from 'react-native-webview';

export default class Profile extends Component {
  state = {
    uri: '',
  };

  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('data').name,
  });

  async componentDidMount() {
    const { navigation } = this.props;
    const { name, login } = await navigation.getParam('data');
    this.setState({ uri: `https://github.com/${login}/${name}` });
  }

  render() {
    const { uri } = this.state;
    return <WebView style={{ flex: 1 }} source={{ uri }} />;
  }
}
