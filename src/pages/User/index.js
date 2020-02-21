import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { ActivityIndicator } from 'react-native';

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
    const { page } = this.state;

    const { navigation } = this.props;
    const user = navigation.getParam('user');

    const response = await api.get(`/users/${user.login}/starred`);

    this.setState({ stars: response.data, loading: false });
  }

  loadStars = async () => { };

  handlePage = async () => {
    const { page, stars, starsEnded } = this.state;
    if (starsEnded === true) {
      return false;
    }

    await this.setState({ page: page + 1 });

    const { navigation } = this.props;
    const user = navigation.getParam('user');

    const response = await api.get(`/users/${user.login}/starred?page=${page}`);

    if (!!response.data === false || response.data.length <= 0) {
      return this.setState({ starsEnded: true });
    }

    await this.setState({ stars: [...stars, ...response.data] });
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
              data={stars}
              keyExtractor={(star, index) => `${String(star.id)}_${index}_star`}
              renderItem={({ item }) => (
                <Starred>
                  <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
                  <Info>
                    <Title>{item.name}</Title>
                    <Author>{item.owner.login}</Author>
                  </Info>
                </Starred>
              )}
              onEndReached={this.handlePage}
            />
          )}
      </Container>
    );
  }
}
