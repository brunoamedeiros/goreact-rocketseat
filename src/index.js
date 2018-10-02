import React, { Component, Fragment } from 'react';
import { render } from 'react-dom';

import Button from './Button';

import './style.scss';

class App extends Component {
  state = {
    counter: 0,
  };

  // Montagem / Atualização
  // static getDerivedStateFromProps(nextProps, prevState) {
  //   return { counter: nextProps.initialCounter };
  // }

  // // Montagem
  // componentDidMount() {

  // }

  // // Atualizações
  // shouldComponentUpdate(nextProps, nextState) {
  //   return nextState.counter <= 10;
  // }

  // getSnapshotBeforeUpdate(prevProps, prevState) {
  //   return prevState.counter;
  // }

  // componentDidUpdate(prevProps, prevState, snapshot) {
  //   console.log(prevState, snapshot);
  // }

  // // Desmontagem
  // componentWillUnmount() {

  // }

  // // Error
  // componentDidCatch(error, info) {
  //   console.log('ERRO', error);
  // }

  handleClick = () => {
    this.setState({
      counter: this.state.counter + 1,
    });

    // Alterar variavel o estado na fila
    // this.setState(state => ({ counter: this.state.counter + 1}));

    // Com callback
    // this.setState({ counter: this.state.counter + 1}, () => {
    //   console.log(this.state.counter);
    // });
  };

  render() {
    return (
      <Fragment>
        <h1 className="title">Oi</h1>
        <h2 style={{ color: '#F00' }}>{this.state.counter}</h2>
        <Button onClick={this.handleClick}>Somar</Button>
      </Fragment>
    );
  };
}

render(<App />, document.getElementById('app'));
// render(<App initialCounter={0} />, document.getElementById('app'));
