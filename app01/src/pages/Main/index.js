import React, { Component } from 'react';
import moment from 'moment';
import api from '../../services/api';

import GlobalStyle from '../../styles/global';
import logo from '../../assets/logo.png';

import { Container, Form } from './styles';
import CompareList from '../../components/CompareList';

export default class Main extends Component {
  state = {
    loading: false,
    repositoryError: false,
    repositoryInput: '',
    repositories: [],
  };

  componentDidMount() {
    if (localStorage.getItem('repository') !== null) {
      this.setState({ repositories: JSON.parse(localStorage.getItem('repository')) });
    }
  }

  handleAddRepository = async (e) => {
    e.preventDefault();

    this.setState({ loading: true });

    try {
      const { data: repository } = await api.get(`/repos/${this.state.repositoryInput}`);

      repository.lastCommit = moment(repository.pushed_at).fromNow();

      localStorage.setItem('repository', JSON.stringify([...this.state.repositories, repository]));

      this.setState({
        repositoryInput: '',
        repositoryError: false,
        repositories: JSON.parse(localStorage.getItem('repository')),
      });
    } catch (error) {
      this.setState({ repositoryError: true });
    } finally {
      this.setState({ loading: false });
    }
  };

  deleteRepo = async (id) => {
    const updateRepository = this.state.repositories.filter(item => item.id !== id);

    this.setState({
      repositories: updateRepository,
    });

    localStorage.setItem('repository', JSON.stringify(updateRepository));
  };

  refreshRepo = async (id) => {
    const repository = this.state.repositories.filter(item => item.id === id)[0];
    const index = this.state.repositories.indexOf(repository);

    const { data: newRepository } = await api.get(`/repos/${repository.full_name}`);
    newRepository.lastCommit = moment(newRepository.pushed_at).fromNow();

    const repositoryCopy = JSON.parse(JSON.stringify(this.state.repositories));
    repositoryCopy[index] = newRepository;
    this.setState({
      repositories: repositoryCopy,
    });

    localStorage.setItem('repository', JSON.stringify(repositoryCopy));
  };

  render() {
    return (
      <Container>
        <GlobalStyle />
        <img src={logo} alt="Github Compare" />

        <Form withError={this.state.repositoryError} onSubmit={this.handleAddRepository}>
          <input
            type="text"
            placeholder="usuário/repositório"
            value={this.state.repositoryInput}
            onChange={e => this.setState({ repositoryInput: e.target.value })}
          />
          <button type="submit">
            {this.state.loading ? <i className="fa fa-spinner fa-pulse" /> : 'OK'}
          </button>
        </Form>

        <CompareList
          repositories={this.state.repositories}
          deleteRepo={this.deleteRepo}
          refreshRepo={this.refreshRepo}
        />
      </Container>
    );
  }
}
