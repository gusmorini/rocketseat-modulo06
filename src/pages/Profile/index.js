import React from 'react';
import { WebView } from 'react-native-webview';

function Profile({ navigation }) {
  const user = navigation.getParam('user');

  return (
    <WebView
      style={{ flex: 1 }}
      source={{ uri: `https://github.com/${user.owner.login}` }}
    />
  );
}

export default Profile;
