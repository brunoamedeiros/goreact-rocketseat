import React, { Component } from 'react';
import moment from 'moment';
import api from '../../services/api';

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

  async componentDidMount() {
    // if (localStorage.getItem('repository') !== null) {
    //   this.setState({ repositories: JSON.parse(localStorage.getItem('repository')) });
    // }
    this.setState({ loading: true });
    this.setState({ loading: false, repositories: await this.getLocalRepositories() });
  }

  handleAddRepository = async (e) => {
    e.preventDefault();

    this.setState({ loading: true });

    const { repositories } = this.state;

    try {
      const { data: repository } = await api.get(`/repos/${this.state.repositoryInput}`);

      repository.last_commit = moment(repository.pushed_at).fromNow();

      // localStorage.setItem('repository', JSON.stringify([...this.state.repositories, repository]));

      this.setState({
        repositoryInput: '',
        repositoryError: false,
        // repositories: JSON.parse(localStorage.getItem('repository')),
        repositories: [...repositories, repository],
      });

      const localRepositories = await this.getLocalRepositories();

      await localStorage.setItem(
        '@GitCompare:repositories',
        JSON.stringify([...localRepositories, repository]),
      );
    } catch (error) {
      this.setState({ repositoryError: true });
    } finally {
      this.setState({ loading: false });
    }
  };

  getLocalRepositories = async () => JSON.parse(await localStorage.getItem('@GitCompare:repositories')) || [];

  deleteRepo = async (id) => {
    const { repositories } = this.state;
    // const updateRepository = this.state.repositories.filter(item => item.id !== id);
    const updateRepository = repositories.filter(repository => repository.id !== id);

    this.setState({
      repositories: updateRepository,
    });

    // localStorage.setItem('repository', JSON.stringify(updateRepository));
    await localStorage.setItem('@GitCompare:repositories', JSON.stringify(updateRepository));
  };

  refreshRepo = async (id) => {
    // const repository = this.state.repositories.filter(item => item.id === id)[0];
    // const index = this.state.repositories.indexOf(repository);

    // const { data: newRepository } = await api.get(`/repos/${repository.full_name}`);
    // newRepository.lastCommit = moment(newRepository.pushed_at).fromNow();

    // const repositoryCopy = JSON.parse(JSON.stringify(this.state.repositories));
    // repositoryCopy[index] = newRepository;

    // this.setState({
    //   repositories: repositoryCopy,
    // });

    // localStorage.setItem('repository', JSON.stringify(repositoryCopy));

    const { repositories } = this.state;
    const repository = repositories.find(repo => repo.id === id);

    try {
      const { data } = await api.get(`/repos/${repository.full_name}`);
      data.last_commit = moment(data.pushed_at).fromNow();

      this.setState({
        repositoryError: false,
        repositoryInput: '',
        repositories: repositories.map(repo => (repo.id === data.id ? data : repo)),
      });

      await localStorage.setItem('@GitCompare:repositories', JSON.stringify(repositories));
    } catch (err) {
      this.setState({ repositoryError: true });
    }
  };

  render() {
    const {
      repositories, repositoryInput, repositoryError, loading,
    } = this.state;
    return (
      <Container>
        <img src={logo} alt="Github Compare" />

        <Form withError={repositoryError} onSubmit={this.handleAddRepository}>
          <input
            type="text"
            placeholder="usuário/repositório"
            value={repositoryInput}
            onChange={e => this.setState({ repositoryInput: e.target.value })}
          />
          <button type="submit">{loading ? <i className="fa fa-spinner fa-pulse" /> : 'OK'}</button>
        </Form>

        <CompareList
          repositories={repositories}
          deleteRepo={this.deleteRepo}
          refreshRepo={this.refreshRepo}
        />
      </Container>
    );
  }
}
