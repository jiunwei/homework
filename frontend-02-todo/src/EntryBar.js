import React, { Component } from 'react';
import './EntryBar.css';

class EntryBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({
      value: event.target.value
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.onEnter(this.state.value);
    this.setState({
      value: ''
    });
  }

  render() {
  	const { prompt } = this.props;
    return (
    	<form className="EntryBar" onSubmit={this.handleSubmit}>
    		<span className="EntryBar-Prompt">{prompt}</span><input type="text" value={this.state.value} onChange={this.handleChange} />
    	</form>
    );
  }
}

export default EntryBar;
