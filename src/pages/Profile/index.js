import React, { Component } from 'react';
import { WebView } from 'react-native-webview';

export default class Profile extends Component {
  state = {
    name: '',
    login: '',
  };

  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('name'),
  });

  async componentDidMount() {
    const { navigation } = this.props;
    const name = await navigation.getParam('name');
    const login = await navigation.getParam('login');
    this.setState({ name, login });
  }

  render() {
    const { name, login } = this.state;
    return (
      <WebView
        style={{ flex: 1 }}
        source={{
          uri: `https://github.com/${login}/${name}`,
        }}
      />
    );
  }
}
