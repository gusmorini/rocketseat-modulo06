import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  ActivityIndicator,
  TouchableHighlight,
  Button,
  Text,
} from 'react-native';
import { WebView } from 'react-native-webview';
import api from '../../services/api';

import {
  Container,
  Header,
  Avatar,
  Name,
  Bio,
  Stars,
  Starred,
  OwnerAvatar,
  Info,
  Title,
  Author,
  Loading,
} from './styles';

export default class User extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('user').name,
  });

  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
    }).isRequired,
  };

  state = {
    stars: [],
    starsEnded: false,
    loading: false,
    page: 1,
  };

  async componentDidMount() {
    this.setState({ loading: true });
    await this.loadStars();
    this.setState({ loading: false });
  }

  handlePage = async () => {
    const { page, starsEnded } = this.state;
    /*
      StarEnd representa o fim da lista de stars
      para evitar chamadas desnecessárias a api
    */
    if (starsEnded === true) {
      return false;
    }
    await this.setState({ page: page + 1 });
    await this.loadStars();
  };

  refreshList = async () => {
    await this.setState({
      page: 1,
      stars: [],
      starsEnded: false,
      loading: true,
    });
    await this.loadStars();
    this.setState({ loading: false });
  };

  loadStars = async () => {
    const { stars, page } = this.state;
    const { navigation } = this.props;
    const user = navigation.getParam('user');
    const response = await api.get(`/users/${user.login}/starred?page=${page}`);
    if (!!response.data === false || response.data.length <= 0) {
      return this.setState({ starsEnded: true });
    }
    await this.setState({ stars: [...stars, ...response.data] });
  };

  handleNavigate = user => {
    const { navigation } = this.props;
    const data = { name: user.name, login: user.owner.login };
    navigation.navigate('Profile', { data });
  };

  render() {
    const { stars, loading } = this.state;
    const { navigation } = this.props;
    const user = navigation.getParam('user');

    return (
      <Container>
        <Header>
          <Avatar source={{ uri: user.avatar }} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
        </Header>

        {loading ? (
          <Loading>
            <ActivityIndicator color="#7159c1" size={100} />
          </Loading>
        ) : (
            <Stars
              onEndReachedThreshold={0.2} // carrega mais itens quando chegar em 20% do fim
              onEndReached={this.handlePage} // carrega mais itens
              onRefresh={this.refreshList} // arrasta lista para baixo
              refreshing={this.state.loading}
              data={stars}
              keyExtractor={(star, index) => `${String(star.id)}_${index}_star`}
              renderItem={({ item }) => (
                <Starred onPress={() => this.handleNavigate(item)}>
                  <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
                  <Info>
                    <Title>{item.name}</Title>
                    <Author>{item.owner.login}</Author>
                  </Info>
                </Starred>
              )}
            />
          )}
      </Container>
    );
  }
}
