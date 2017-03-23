import React, { Component } from 'react';
import './Counter.css';

class Counter extends Component {
  render() {
  	const { count, unit } = this.props;
    return (
    	<div className="Counter">
    		<p className="Counter-Count">{count}</p>
    		<p className="Counter-Unit">{count === 1 ? unit : unit + 's'}</p>
    	</div>
    );
  }
}

export default Counter;
