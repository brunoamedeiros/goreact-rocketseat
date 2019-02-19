import React from 'react';
import propTypes from 'prop-types';

import { Container, Repository } from './styles';

// eslint-disable-next-line react/prop-types
const CompareList = ({ repositories, deleteRepo, refreshRepo }) => (
  <Container>
    {repositories.map(repository => (
      <Repository key={repository.id}>
        <div className="actions">
          <i className="refresh-repo fa fa-refresh" onClick={() => refreshRepo(repository.id)} />
          <i className="delete-repo fa fa-close" onClick={() => deleteRepo(repository.id)} />
        </div>
        <header>
          <img src={repository.owner.avatar_url} alt={repository.owner.login} />
          <strong>{repository.name}</strong>
          <small>{repository.owner.login}</small>
        </header>

        <ul>
          <li>
            {repository.stargazers_count}
            {' '}
            <small>stars</small>
          </li>
          <li>
            {repository.forks_count}
            {' '}
            <small>forks</small>
          </li>
          <li>
            {repository.open_issues_count}
            {' '}
            <small>issues</small>
          </li>
          <li>
            {repository.lastCommit}
            {' '}
            <small>last commit</small>
          </li>
        </ul>
      </Repository>
    ))}
  </Container>
);

// eslint-disable-next-line react/no-typos
CompareList.propTypes = {
  repositories: propTypes.arrayOf(
    propTypes.shape({
      id: propTypes.number,
      name: propTypes.string,
      owner: propTypes.shape({
        login: propTypes.string,
        avatar_url: propTypes.string,
      }),
      stargazers_count: propTypes.number,
      forks_count: propTypes.number,
      open_issues_count: propTypes.number,
      pushed_at: propTypes.string,
    }),
  ).isRequired,
};

export default CompareList;
